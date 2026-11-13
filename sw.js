const NAME = "together-supabase-github-v43-r4";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./cloud.js",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/vendor/supabase.js",
  "./assets/vendor/lucide.min.js",
  "./assets/images/hero-writing.jpg",
  "./assets/images/home-photo.jpg",
  "./assets/images/wish-snow.jpg",
  "./assets/images/wish-sea.jpg",
  "./assets/images/wish-dinner.jpg",
  "./assets/images/wish-concert.jpg",
  "./assets/images/wish-album.jpg",
  "./assets/images/message-photo.jpg",
  "./assets/images/wish-default.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys
      .filter(key => (
        key.startsWith("together-supabase-v")
        || key.startsWith("together-supabase-github-v")
      ) && key !== NAME)
      .map(key => caches.delete(key)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const networkFirst = event.request.mode === "navigate"
    || /\.(?:html|js|css|webmanifest)$/.test(url.pathname);

  if (networkFirst) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(hit => hit || caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
