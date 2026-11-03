(function () {
  const config = window.APP_CONFIG || {};
  const configured = Boolean(
    config.supabaseUrl &&
    config.supabasePublishableKey &&
    !config.supabaseUrl.includes("你的")
  );
  const provider = "supabase";

  let client = null;
  let user = null;
  let profile = null;
  let membership = null;
  let remoteCallback = null;
  let statusCallback = null;
  let saveTimer = null;
  let realtimeChannel = null;

  function status() {
    return {
      configured,
      provider,
      signedIn: Boolean(user),
      user,
      profile,
      membership,
      space: membership?.space || null,
      ready: Boolean(configured && user && membership)
    };
  }

  function emitStatus(extra = {}) {
    statusCallback?.({ ...status(), ...extra });
  }

  function normalizeUsername(username) {
    const normalized = String(username || "").trim().toLowerCase();
    if (!/^[a-z][a-z0-9_-]{2,23}$/.test(normalized)) {
      throw new Error("用户名格式不正确");
    }
    return normalized;
  }

  function usernameEmail(username) {
    return `${normalizeUsername(username)}@${config.usernameDomain || "couple.local"}`;
  }

  function usernameFromUser(account) {
    return account?.user_metadata?.username
      || account?.email?.split("@")[0]?.toUpperCase()
      || "MEMBER";
  }

  async function signedUrl(bucket, path) {
    if (!path) return null;
    const result = await client.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    return result.error ? null : result.data.signedUrl;
  }

  async function readMembership() {
    const result = await client.rpc("get_my_couple_space");
    if (result.error) throw result.error;
    return result.data || null;
  }

  async function bootstrap() {
    if (!client) return status();
    const sessionResult = await client.auth.getSession();
    if (sessionResult.error) throw sessionResult.error;
    user = sessionResult.data.session?.user || null;
    profile = null;
    membership = null;

    if (user) {
      const username = usernameFromUser(user);
      const existing = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (existing.error) throw existing.error;
      if (existing.data) {
        profile = existing.data;
      } else {
        const inserted = await client.from("profiles").insert({
          id: user.id,
          username,
          display_name: user.user_metadata?.display_name || username
        }).select().single();
        if (inserted.error) throw inserted.error;
        profile = inserted.data;
      }
      if (profile.avatar_path) profile.avatar_url = await signedUrl("avatars", profile.avatar_path);
      membership = await readMembership();
      subscribe();
    }

    emitStatus();
    return status();
  }

  function subscribe() {
    if (!client || !membership) return;
    if (realtimeChannel) client.removeChannel(realtimeChannel);
    realtimeChannel = client
      .channel(`space-records:${membership.space_id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "records",
        filter: `space_id=eq.${membership.space_id}`
      }, () => remoteCallback?.())
      .subscribe();
  }

  async function init(options = {}) {
    remoteCallback = options.onRemoteChange;
    statusCallback = options.onStatus;
    if (!configured) {
      emitStatus();
      return status();
    }
    if (!window.supabase?.createClient) throw new Error("Supabase SDK 未加载");

    client = window.supabase.createClient(
      config.supabaseUrl,
      config.supabasePublishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    client.auth.onAuthStateChange(() => {
      setTimeout(async () => {
        try {
          await bootstrap();
          remoteCallback?.();
        } catch (error) {
          console.error("Supabase auth refresh failed", error);
          emitStatus({ syncError: error.message });
        }
      }, 0);
    });

    return bootstrap();
  }

  async function signIn(username, password) {
    if (!client) throw new Error("请先配置 Supabase");
    const result = await client.auth.signInWithPassword({
      email: usernameEmail(username),
      password
    });
    if (result.error) throw result.error;
    user = result.data.user;
    await bootstrap();
    return result.data;
  }

  async function signOut() {
    if (!client) return;
    const result = await client.auth.signOut();
    if (result.error) throw result.error;
    if (realtimeChannel) client.removeChannel(realtimeChannel);
    realtimeChannel = null;
    user = null;
    profile = null;
    membership = null;
    emitStatus();
  }

  async function createSpace(name, togetherSince) {
    if (!client || !user) throw new Error("请先登录");
    const result = await client.rpc("create_couple_space", {
      space_name: name,
      together_date: togetherSince || null
    });
    if (result.error) throw result.error;
    await bootstrap();
    return result.data;
  }

  async function joinSpace(inviteCode) {
    if (!client || !user) throw new Error("请先登录");
    const result = await client.rpc("join_couple_space", {
      code: String(inviteCode || "").trim().toUpperCase()
    });
    if (result.error) throw result.error;
    await bootstrap();
    return result.data;
  }

  async function uploadFile(bucket, path, file) {
    const result = await client.storage.from(bucket).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type
    });
    if (result.error) throw result.error;
    return signedUrl(bucket, path);
  }

  async function uploadAvatar(file) {
    if (!client || !user) throw new Error("请先登录");
    if (!file?.size) return null;
    if (file.size > 2 * 1024 * 1024) throw new Error("头像图片不能超过 2MB");
    const extension = file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const url = await uploadFile("avatars", path, file);
    return { path, url };
  }

  async function updateProfile(displayName, avatarFile) {
    if (!client || !user) throw new Error("请先登录");
    const avatar = avatarFile?.size ? await uploadAvatar(avatarFile) : null;
    const name = String(displayName || "").trim() || profile?.username || "成员";
    const changes = { display_name: name, updated_at: new Date().toISOString() };
    if (avatar) changes.avatar_path = avatar.path;
    const result = await client.from("profiles").update(changes).eq("id", user.id).select().single();
    if (result.error) throw result.error;
    await client.auth.updateUser({
      data: {
        username: profile?.username || usernameFromUser(user),
        display_name: name
      }
    });
    profile = { ...result.data, avatar_url: avatar?.url || profile?.avatar_url || null };
    emitStatus();
    return profile;
  }

  function recordRows(state) {
    if (!membership || !user) return [];
    const rows = [];
    const add = (type, item, fallbackVisibility = "shared") => {
      rows.push({
        space_id: membership.space_id,
        type,
        client_id: item.id,
        creator_id: item.creatorId || user.id,
        visibility: item.visibility || fallbackVisibility,
        payload: item,
        updated_at: new Date().toISOString()
      });
    };

    (state.tasks || []).forEach(item => add("task", item));
    (state.wishes || []).forEach(item => add("wish", item));
    (state.goals || []).forEach(item => add("goal", item));
    (state.messages || []).forEach(item => add("message", item));
    (state.expenses || []).forEach(item => add(
      "expense",
      item,
      item.scope === "个人支出" ? "private" : "shared"
    ));
    (state.intimacy || []).forEach(item => add("intimacy", item, "shared"));

    add("space_settings", {
      id: "home-settings",
      creatorId: state.homeSettingsCreatorId || user.id,
      quoteMode: state.quoteMode || "daily",
      customQuote: state.customQuote || "",
      homePhoto: state.homePhoto || null,
      financeBudgets: state.financeBudgets || {}
    });

    rows.push({
      space_id: membership.space_id,
      type: "sleep",
      client_id: `sleep:${user.id}:${state.sleep.month}`,
      creator_id: user.id,
      visibility: "private",
      payload: state.sleep,
      updated_at: new Date().toISOString()
    });
    return rows;
  }

  async function saveState(state) {
    if (!client || !user || !membership) return false;
    const rows = recordRows(state);
    const ownRows = rows.filter(row => row.creator_id === user.id);
    const partnerSharedRows = rows.filter(row => row.creator_id !== user.id && row.visibility === "shared");

    if (ownRows.length) {
      const result = await client.from("records").upsert(ownRows, {
        onConflict: "space_id,type,client_id"
      });
      if (result.error) throw result.error;
    }

    for (const row of partnerSharedRows) {
      const result = await client
        .from("records")
        .update({ payload: row.payload, updated_at: row.updated_at })
        .eq("space_id", row.space_id)
        .eq("type", row.type)
        .eq("client_id", row.client_id);
      if (result.error) throw result.error;
    }

    const spaceUpdate = await client
      .from("couple_spaces")
      .update({ together_since: state.togetherSince || null })
      .eq("id", membership.space_id);
    if (spaceUpdate.error) throw spaceUpdate.error;
    return true;
  }

  function queueSave(state) {
    if (!status().ready) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveState(state).catch(error => {
        console.error("Supabase sync failed", error);
        emitStatus({ syncError: error.message });
      });
    }, 650);
  }

  async function deleteRecord(type, clientId) {
    if (!client || !membership) return;
    const result = await client
      .from("records")
      .delete()
      .eq("space_id", membership.space_id)
      .eq("type", type)
      .eq("client_id", clientId);
    if (result.error) throw result.error;
  }

  async function saveFutureLetter(letter) {
    if (!client || !user || !membership) throw new Error("请先登录并进入情侣空间");
    const result = await client.rpc("create_future_letter", {
      letter_client_id: letter.id,
      letter_title: letter.title,
      receiver: letter.receiver,
      open_day: letter.openDate,
      letter_content: letter.text
    });
    if (result.error) throw result.error;
    return result.data;
  }

  function collectMediaPaths(rows) {
    const paths = [];
    rows.forEach(row => {
      const payload = row.payload || {};
      if (payload.coverPath) paths.push(payload.coverPath);
      if (payload.imagePath) paths.push(payload.imagePath);
      if (payload.thumbPath) paths.push(payload.thumbPath);
      if (payload.homePhoto?.path) paths.push(payload.homePhoto.path);
      if (payload.homePhoto?.thumbPath) paths.push(payload.homePhoto.thumbPath);
      (payload.images || []).forEach(image => {
        if (image.path) paths.push(image.path);
        if (image.thumbPath) paths.push(image.thumbPath);
      });
    });
    return [...new Set(paths)];
  }

  async function signedUrlMap(paths) {
    const map = new Map();
    if (!paths.length) return map;
    const result = await client.storage.from("couple-media").createSignedUrls(paths, 60 * 60 * 24 * 7);
    if (!result.error) result.data.forEach(item => map.set(item.path, item.signedUrl));
    return map;
  }

  async function loadState() {
    if (!client || !user || !membership) return null;
    const result = await client
      .from("records")
      .select("type,client_id,payload,visibility,creator_id,updated_at")
      .eq("space_id", membership.space_id)
      .order("updated_at", { ascending: true });
    if (result.error) throw result.error;
    const lettersResult = await client.rpc("get_my_future_letters");
    if (lettersResult.error) throw lettersResult.error;
    if (!result.data.length && !(lettersResult.data || []).length) return null;

    const next = {
      togetherSince: membership.space?.together_since,
      tasks: [],
      wishes: [],
      goals: [],
      expenses: [],
      messages: [],
      futureLetters: lettersResult.data || [],
      intimacy: [],
      quoteMode: "daily",
      customQuote: "",
      homePhoto: null,
      financeBudgets: {},
      homeSettingsCreatorId: null
    };
    const urls = await signedUrlMap(collectMediaPaths(result.data));

    for (const row of result.data) {
      const payload = { ...row.payload, visibility: row.visibility, creatorId: row.creator_id };
      if (payload.coverPath && urls.has(payload.coverPath)) payload.cover = urls.get(payload.coverPath);
      if (payload.imagePath && urls.has(payload.imagePath)) payload.image = urls.get(payload.imagePath);
      if (payload.thumbPath && urls.has(payload.thumbPath)) payload.thumb = urls.get(payload.thumbPath);
      if (payload.images) {
        payload.images = payload.images.map(image => ({
          ...image,
          url: urls.get(image.path) || image.url,
          thumbUrl: urls.get(image.thumbPath) || image.thumbUrl || urls.get(image.path) || image.url
        }));
      }

      if (row.type === "task") next.tasks.push(payload);
      if (row.type === "wish") next.wishes.push(payload);
      if (row.type === "goal") next.goals.push(payload);
      if (row.type === "expense") next.expenses.push(payload);
      if (row.type === "message") next.messages.push(payload);
      if (row.type === "intimacy") next.intimacy.push(payload);
      if (row.type === "sleep") next.sleep = payload;
      if (row.type === "space_settings") {
        next.quoteMode = payload.quoteMode || "daily";
        next.customQuote = payload.customQuote || "";
        next.homePhoto = payload.homePhoto ? {
          ...payload.homePhoto,
          url: urls.get(payload.homePhoto.path) || payload.homePhoto.url,
          thumbUrl: urls.get(payload.homePhoto.thumbPath) || payload.homePhoto.thumbUrl || urls.get(payload.homePhoto.path) || payload.homePhoto.url
        } : null;
        next.financeBudgets = payload.financeBudgets || {};
        next.homeSettingsCreatorId = row.creator_id;
      }
    }
    return next;
  }

  async function uploadMedia(file, visibility = "shared", thumbnailFile = null) {
    if (!client || !user || !membership) throw new Error("登录并加入情侣空间后才能上传图片");
    if (!file?.size) return null;
    if (file.size > 8 * 1024 * 1024) throw new Error("单张图片不能超过 8MB");
    const base = `${membership.space_id}/${user.id}/${visibility}/${crypto.randomUUID()}`;
    const extension = file.type === "image/webp"
      ? "webp"
      : (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${base}.${extension}`;
    const url = await uploadFile("couple-media", path, file);
    let thumbPath = null;
    let thumbUrl = url;
    if (thumbnailFile?.size) {
      thumbPath = `${base}-thumb.webp`;
      thumbUrl = await uploadFile("couple-media", thumbPath, thumbnailFile);
    }
    return { path, url, thumbPath, thumbUrl };
  }

  window.CloudStore = {
    configured,
    init,
    refresh: bootstrap,
    status,
    signIn,
    signOut,
    updateProfile,
    createSpace,
    joinSpace,
    loadState,
    saveState,
    queueSave,
    deleteRecord,
    saveFutureLetter,
    uploadMedia
  };
})();
