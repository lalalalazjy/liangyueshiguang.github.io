const KEY = "together-dashboard-v1";
const clone = value => JSON.parse(JSON.stringify(value));
const id = () => Math.random().toString(36).slice(2, 10);
const localDateString = date => {
  const year=date.getFullYear();
  const month=String(date.getMonth()+1).padStart(2,"0");
  const day=String(date.getDate()).padStart(2,"0");
  return `${year}-${month}-${day}`;
};
const today = () => localDateString(new Date());
function startOfWeek(date){
  const value=new Date(date);
  value.setHours(0,0,0,0);
  value.setDate(value.getDate()-((value.getDay()+6)%7));
  return value;
}
function addDays(date,amount){
  const value=new Date(date);
  value.setDate(value.getDate()+amount);
  return value;
}
function dateFromLocal(value){
  const [year,month,day]=String(value).slice(0,10).split("-").map(Number);
  return new Date(year,month-1,day);
}
function timestamp(){
  return new Date().toISOString();
}
function dateTimeLabel(value){
  if(!value)return "";
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return String(value);
  return date.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).replaceAll("/","-");
}
function currentOwnerKey(){
  return cloudStatus.membership?.member_key||"a";
}

const demo = {
  togetherSince: "2023-12-21",
  quoteMode: "daily",
  customQuote: "认真计划，也认真浪费时间。",
  homeSettingsCreatorId: null,
  homePhoto: {
    url: "./assets/images/home-photo.jpg",
    title: "十月的最后一个周末",
    caption: "杭州",
    date: "2026-10-31"
  },
  homePhotos: [],
  financeBudgets: {"2026-11":5000},
  healthVisibility: "summary",
  selectedWish: "w2",
  tasks: [
    {id:"t1",title:"预约周末的摄影棚",date:"2026-11-02",owner:"shared",type:"周计划",priority:"高",done:false},
    {id:"t2",title:"读完《悉达多》第三章",date:"2026-11-02",owner:"a",type:"个人计划",priority:"中",done:false},
    {id:"t3",title:"整理十月旅行照片",date:"2026-11-03",owner:"b",type:"共同计划",priority:"低",done:false},
    {id:"t4",title:"一起去超市采购",date:"2026-11-04",owner:"shared",type:"周计划",priority:"中",done:true},
    {id:"t5",title:"周日力量训练",date:"2026-11-08",owner:"a",type:"健身",priority:"中",done:false}
  ],
  wishes: [
    {id:"w1",title:"一起看冬天的第一场雪",owner:"a",date:"2026-12-15",budget:300,group:"ready",status:"刚刚许下",cover:"./assets/images/wish-snow.jpg"},
    {id:"w2",title:"去海边拍一组日落照片",owner:"shared",date:"2027-05-01",budget:2800,group:"arrange",status:"商量中",cover:"./assets/images/wish-sea.jpg"},
    {id:"w3",title:"一起做一顿完整的西餐",owner:"b",date:"2026-11-21",budget:260,group:"ready",status:"已列入计划",cover:"./assets/images/wish-dinner.jpg"},
    {id:"w4",title:"看一场喜欢很久的乐队演出",owner:"shared",date:"2027-03-01",budget:1600,group:"arrange",status:"商量中",cover:"./assets/images/wish-concert.jpg"},
    {id:"w5",title:"拥有一本共同生活摄影集",owner:"shared",date:"2027-12-31",budget:600,group:"long",status:"长期愿望",cover:"./assets/images/wish-album.jpg"}
  ],
  goals: [
    {id:"g1",title:"一起读完 12 本书",category:"阅读",unit:"本",target:12,current:7,start:"2026-01-01",end:"2026-12-31",tone:"green",records:[{date:"2026-10-28",amount:1,note:"读完《悉达多》"}]},
    {id:"g2",title:"记录 24 次认真运动",category:"健身",unit:"次",target:24,current:16,start:"2026-02-01",end:"2026-12-31",tone:"coralbar",records:[{date:"2026-10-30",amount:1,note:"晚间力量训练 45 分钟"}]},
    {id:"g3",title:"完成 10 组主题摄影",category:"摄影",unit:"组",target:10,current:6,start:"2026-03-01",end:"2026-11-30",tone:"bluebar",records:[{date:"2026-10-19",amount:1,note:"秋日公园人像"}]},
    {id:"g4",title:"一起看 6 场现场演出",category:"演出",unit:"场",target:6,current:4,start:"2026-01-01",end:"2026-12-31",tone:"goldbar",records:[{date:"2026-09-17",amount:1,note:"城市音乐节"}]}
  ],
  expenses: [
    {id:"e1",amount:168,date:"2026-11-01",category:"餐饮",scope:"共同支出",payment:"微信",owner:"a",note:"周末晚餐"},
    {id:"e2",amount:280,date:"2026-11-01",category:"购物",scope:"个人支出",payment:"支付宝",owner:"b",note:"运动装备"},
    {id:"e3",amount:96,date:"2026-11-02",category:"娱乐",scope:"共同支出",payment:"微信",owner:"b",note:"电影票"}
  ],
  messages: [
    {id:"m1",author:"b",createdAt:"2026-11-01T22:18:00+08:00",date:"11-01 22:18",text:"十一月也请继续一起认真生活。周末去吃那家收藏很久的小店吧。",pinned:true,likes:3,replies:[{id:"r1",author:"a",createdAt:"2026-11-01T22:24:00+08:00",date:"11-01 22:24",text:"好，周六留给我们。"}]},
    {id:"m2",author:"a",createdAt:"2026-10-28T09:20:00+08:00",date:"10-28 09:20",text:"照片洗出来了，比想象中更好看。谢谢你愿意陪我慢慢记录这些普通的日子。",pinned:false,likes:5,replies:[],image:"./assets/images/message-photo.jpg"}
  ],
  futureLetters: [],
  intimacy: [],
  sleep:{month:"2026-10",bedtime:"23:48",wake:"07:36",duration:7.3,nap:0.4,quality:"良好",energy:"整体稳定，月底稍有疲惫。",note:"月底工作较忙，有三天睡得偏晚。",next:"尽量在 23:30 前放下手机。"},
  sleepReports:[]
};

let state = load();
const initialRoute = new URLSearchParams(location.search).get("view");
let route = ["home","plans","wishes","growth","health","finance","messages","more"].includes(initialRoute)
  ? initialRoute
  : "home";
let planView = "week";
let planFilter = "all";
let planWeekStart = startOfWeek(new Date());
let planMonth = today().slice(0,7);
let planYear = new Date().getFullYear();
let ganttYear = new Date().getFullYear();
let wishFilter = "all";
let goalFilter = "all";
let messageFilter = "all";
let financeMonth = today().slice(0,7);
let financeAnnual = false;
let intimacyMonth = today().slice(0,7);
let healthMonth = today().slice(0,7);
let animateHeartDate = "";
let toastTimer;
const cloudConfigured=Boolean(
  window.APP_CONFIG?.supabaseUrl
  && window.APP_CONFIG?.supabasePublishableKey
  && !window.APP_CONFIG.supabaseUrl.includes("你的")
);
let cloudStatus = { configured:cloudConfigured, signedIn:false, ready:false };
const preparedFiles = new WeakMap();
let activeIntimacyId = "";

const meta = {
  home:["我们的生活总览",""],
  plans:["计划清单","安排时间，也给生活留一点空白"],
  wishes:["愿望墙","先把想做的事情记下来"],
  growth:["共同成长","看见每一次小小的推进"],
  health:["健康与作息","按月回顾，不把生活变成考试"],
  finance:["生活记账","知道钱花去了哪里，也保留各自空间"],
  messages:["留言与回忆","把值得回看的话留在这里"],
  more:["更多功能","健康、记账、留言和设置"]
};

const localDemoImages = {
  "photo-1483664852095-d6cc6870702d":"./assets/images/wish-snow.jpg",
  "photo-1507525428034-b723cf961d3e":"./assets/images/wish-sea.jpg",
  "photo-1498837167922-ddd27525d352":"./assets/images/wish-dinner.jpg",
  "photo-1501386761578-eac5c94b800a":"./assets/images/wish-concert.jpg",
  "photo-1499750310107-5fef28a66643":"./assets/images/wish-album.jpg",
  "photo-1527529482837-4698179dc6ce":"./assets/images/message-photo.jpg",
  "photo-1529156069898-49953e39b3ac":"./assets/images/wish-default.jpg"
};
function localizeDemoImage(url=""){
  if(!String(url).includes("images.unsplash.com"))return url;
  const match=Object.entries(localDemoImages).find(([id])=>String(url).includes(id));
  return match?.[1]||"./assets/images/wish-default.jpg";
}
function normalizeStateImages(value){
  value.tasks=(value.tasks||[]).map(item=>({
    ...item,
    type:item.type==="月计划"?"月计划":"日计划",
    createdAt:item.createdAt||`${item.date||today()}T09:00:00+08:00`,
    completedAt:item.done?(item.completedAt||`${item.date||today()}T18:00:00+08:00`):null
  }));
  value.wishes=(value.wishes||[]).map(item=>({
    ...item,
    createdAt:item.createdAt||`${item.date||today()}T09:00:00+08:00`,
    cover:localizeDemoImage(item.cover)
  }));
  value.goals=(value.goals||[]).map(goal=>({
    ...goal,
    owner:goal.owner||"shared",
    customCategory:goal.customCategory||"",
    records:(goal.records||[]).map(record=>({...record,id:record.id||id(),images:record.images||[],createdAt:record.createdAt||`${record.date}T12:00:00+08:00`}))
  }));
  value.messages=(value.messages||[]).map(item=>({
    ...item,
    createdAt:item.createdAt||`2026-${String(item.date||"01-01 00:00").replace(" ","T")}:00+08:00`,
    image:localizeDemoImage(item.image),
    images:item.images||(
      item.image?[{
        path:item.imagePath||null,
        url:localizeDemoImage(item.image),
        thumbUrl:localizeDemoImage(item.thumb||item.image)
      }]:[]
    )
  }));
  value.expenses=(value.expenses||[]).map(item=>({
    ...item,
    category:item.category==="礼物"?"爱好":item.category,
    month:item.month||String(item.date||today()).slice(0,7)
  }));
  value.futureLetters=value.futureLetters||[];
  value.financeBudgets=value.financeBudgets||{};
  value.homePhoto=value.homePhoto||clone(demo.homePhoto);
  value.homePhotos=value.homePhotos||[];
  value.homePhoto.id=value.homePhoto.id||`photo-${value.homePhoto.date||"current"}`;
  if(value.homePhoto?.url&&!value.homePhotos.some(item=>item.id===value.homePhoto.id||item.path&&item.path===value.homePhoto.path)){
    value.homePhotos.unshift({...value.homePhoto});
  }
  value.intimacy=value.intimacy||[];
  value.sleep=value.sleep||{};
  if(value.sleep.quality==="等待云端同步")value.sleep.quality="";
  if(value.sleep.note==="私人健康数据未缓存在此设备。")value.sleep.note="";
  value.sleepReports=(value.sleepReports||[]).map(report=>{
    const normalized={...report};
    if(normalized.quality==="等待云端同步")normalized.quality="";
    if(normalized.note==="私人健康数据未缓存在此设备。")normalized.note="";
    return normalized;
  });
  if(value.sleep.month&&!value.sleepReports.some(report=>report.month===value.sleep.month)){
    value.sleepReports.push({...value.sleep});
  }
  return value;
}
function load(){try{return normalizeStateImages({...clone(demo),...JSON.parse(localStorage.getItem(KEY))})}catch{return clone(demo)}}
function freshCloudState(togetherSince){
  return {
    togetherSince:togetherSince||today(),
    quoteMode:"daily",
    customQuote:"",
    homeSettingsCreatorId:null,
    homePhoto:clone(demo.homePhoto),
    homePhotos:[],
    financeBudgets:{},
    healthVisibility:"summary",
    selectedWish:null,
    tasks:[],
    wishes:[],
    goals:[],
    expenses:[],
    messages:[],
    futureLetters:[],
    intimacy:[],
    sleepReports:[],
    sleep:{
      month:today().slice(0,7),
      bedtime:"23:30",
      wake:"07:30",
      duration:8,
      nap:0,
      quality:"良好",
      energy:"",
      note:"",
      next:""
    }
  };
}
function storeLocalState(){
  let snapshot=state;
  if(window.CloudStore?.status().ready&&window.APP_CONFIG?.cachePrivateData!==true){
    snapshot=clone(state);
    const isPrivate=item=>item.visibility==="private";
    snapshot.tasks=snapshot.tasks.filter(item=>!isPrivate(item));
    snapshot.wishes=snapshot.wishes.filter(item=>!isPrivate(item));
    snapshot.goals=snapshot.goals.filter(item=>!isPrivate(item));
    snapshot.messages=snapshot.messages.filter(item=>!isPrivate(item));
    snapshot.futureLetters=snapshot.futureLetters.filter(item=>!isPrivate(item)).map(item=>({
      ...item,
      text:item.openDate<=today()&&item.text?item.text:null
    }));
    snapshot.expenses=snapshot.expenses.filter(item=>!isPrivate(item)&&item.scope!=="个人支出");
    snapshot.intimacy=[];
    snapshot.sleepReports=[];
    snapshot.sleep={
      month:"",
      bedtime:"--:--",
      wake:"--:--",
      duration:0,
      nap:0,
      quality:"",
      note:"",
      next:""
    };
  }
  localStorage.setItem(KEY,JSON.stringify(snapshot));
}
function save(message=""){
  storeLocalState();
  window.CloudStore?.queueSave(state);
  if(message)toast(message);
}
async function persistNow(message=""){
  storeLocalState();
  if(window.CloudStore?.status().ready)await window.CloudStore.saveState(state);
  if(message)toast(message);
}
function icons(){window.lucide?.createIcons({attrs:{"stroke-width":1.8}})}
function owner(o){return o==="a"?"月":o==="b"?"亮":"共同"}
function ownerCls(o){return o==="a"?"a":o==="b"?"b":"shared"}
function goalCategoryLabel(goal){
  return goal?.category==="自定义"?(goal.customCategory?.trim()||"未命名栏目"):(goal?.category||"目标");
}
function blankSleepReport(month=healthMonth){
  return {month,bedtime:"",wake:"",duration:"",nap:"",quality:"",energy:"",note:"",next:""};
}
function sleepReportFor(month){
  return (state.sleepReports||[]).find(report=>report.month===month)
    ||(state.sleep?.month===month?state.sleep:null);
}
function sortPlans(items){
  return items.slice().sort((a,b)=>Number(a.done)-Number(b.done)||(a.date||"").localeCompare(b.date||"")||(a.createdAt||"").localeCompare(b.createdAt||""));
}
function money(n){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY",maximumFractionDigits:0}).format(n)}
function monthLabel(value){
  const match=String(value||"").match(/^(\d{4})-(\d{2})$/);
  return match?`${match[1]}年${Number(match[2])}月`:value||"未填写月份";
}
function todayHeading(){
  const date=new Date();
  const week=["周日","周一","周二","周三","周四","周五","周六"][date.getDay()];
  return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 · ${week}`;
}
function percent(g){return Math.min(100,Math.round(g.current/g.target*100))}
function days(){return Math.floor((Date.now()-new Date(state.togetherSince+"T00:00:00"))/86400000)+1}
function catIcon(c){return {阅读:"book-open",健身:"dumbbell",摄影:"camera",演出:"ticket"}[c]||"target"}
const dailyQuotes=[
  "认真计划，也认真浪费时间。",
  "把普通的日子，过成两个人的收藏。",
  "慢一点没关系，我们在一起向前。",
  "今天也给彼此留一点温柔和空白。",
  "生活不用完美，记得一起参与。",
  "愿我们的计划里有目标，也有晚风。",
  "一起完成小事，就是生活的大事。",
  "把想去的地方，慢慢变成走过的路。",
  "认真生活，也认真听对方说话。",
  "每一次坚持，都在靠近想要的生活。",
  "日子向前走，我们把故事留下来。",
  "愿今天有进展，也有值得回味的瞬间。"
];
function homeQuote(){
  if(state.quoteMode==="manual"&&state.customQuote?.trim())return state.customQuote.trim();
  const [year,month,day]=today().split("-").map(Number);
  const dayNumber=Math.floor(Date.UTC(year,month-1,day)/86400000);
  return dailyQuotes[dayNumber%dailyQuotes.length];
}
function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function toast(text){const el=document.querySelector("#toast");el.textContent=text;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function authErrorMessage(error){
  const code=String(error?.code||"");
  const message=String(error?.message||error||"操作失败");
  if(code==="over_email_send_rate_limit"||message.toLowerCase().includes("email rate limit")){
    return "账号服务暂时限制了请求频率，请稍后再试。";
  }
  if(code==="user_already_exists"||message.toLowerCase().includes("already registered")){
    return "这个用户名已经创建过，请直接登录。";
  }
  if(code==="over_request_rate_limit"||message.toLowerCase().includes("too many requests")){
    return "尝试次数过多，请等待几分钟后重试。";
  }
  if(message.includes("already belongs to a couple space")){
    return "这个账号已经有情侣空间。请点击“重新读取已有空间”；若仍未显示，请运行数据库修复脚本。";
  }
  if(message.includes("Invalid invite code")){
    return "邀请码不正确，请检查后重新输入。";
  }
  if(message.includes("already has two members")){
    return "这个情侣空间已经有两名成员，不能再加入。";
  }
  return message;
}
function fileAsDataUrl(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=()=>reject(reader.error);
    reader.readAsDataURL(file);
  });
}
function formatBytes(bytes){
  if(bytes<1024)return `${bytes} B`;
  if(bytes<1024*1024)return `${(bytes/1024).toFixed(0)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}
function canvasBlob(canvas,type,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(
    blob=>blob?resolve(blob):reject(new Error("图片处理失败")),
    type,
    quality
  ));
}
function imageFile(blob,name){
  return new File([blob],name,{type:blob.type,lastModified:Date.now()});
}
async function decodeImage(file){
  if("createImageBitmap" in window)return createImageBitmap(file);
  const url=URL.createObjectURL(file);
  try{
    const image=new Image();
    image.src=url;
    await image.decode();
    return image;
  }finally{
    URL.revokeObjectURL(url);
  }
}
function scaledSize(width,height,maxDimension){
  const scale=Math.min(1,maxDimension/Math.max(width,height));
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
async function makeThumbnail(source){
  const size=scaledSize(source.width,source.height,900);
  const canvas=document.createElement("canvas");
  canvas.width=size.width;canvas.height=size.height;
  canvas.getContext("2d").drawImage(source,0,0,size.width,size.height);
  const blob=await canvasBlob(canvas,"image/webp",0.84);
  return imageFile(blob,`thumb-${id()}.webp`);
}
async function prepareImage(file){
  if(!(file instanceof File)||!file.size)return null;
  if(!file.type.startsWith("image/"))throw new Error("请选择图片文件");
  const source=await decodeImage(file);
  try{
    const special=file.type==="image/png"||/截图|screenshot|screen.?shot/i.test(file.name);
    const withinSize=file.size<=500*1024;
    const withinDimensions=Math.max(source.width,source.height)<=1600;
    let optimized=file;
    let compressed=false;

    if(!(withinSize&&withinDimensions)){
      let size=scaledSize(source.width,source.height,1600);
      let quality=special?0.92:0.82;
      let blob=null;
      for(let attempt=0;attempt<8;attempt+=1){
        const canvas=document.createElement("canvas");
        canvas.width=size.width;canvas.height=size.height;
        const context=canvas.getContext("2d");
        context.imageSmoothingEnabled=true;
        context.imageSmoothingQuality="high";
        context.drawImage(source,0,0,size.width,size.height);
        blob=await canvasBlob(canvas,"image/webp",quality);
        if(blob.size<=500*1024)break;
        if(quality>0.76)quality-=0.04;
        else size={width:Math.round(size.width*0.88),height:Math.round(size.height*0.88)};
      }
      optimized=imageFile(blob,`${file.name.replace(/\.[^.]+$/,"")||"photo"}.webp`);
      compressed=true;
    }

    const thumbnail=await makeThumbnail(source);
    return {
      original:file,
      file:optimized,
      thumbnailFile:thumbnail,
      originalSize:file.size,
      finalSize:optimized.size,
      compressed,
      special,
      previewUrl:URL.createObjectURL(optimized)
    };
  }finally{
    source.close?.();
  }
}
async function resolvePreparedImage(prepared,visibility="shared"){
  if(!prepared?.file?.size)return null;
  if(window.CloudStore?.status().ready){
    return window.CloudStore.uploadMedia(prepared.file,visibility,prepared.thumbnailFile);
  }
  if(prepared.file.size>1.5*1024*1024)throw new Error("本地模式图片需小于 1.5MB");
  return {
    path:null,
    url:await fileAsDataUrl(prepared.file),
    thumbPath:null,
    thumbUrl:await fileAsDataUrl(prepared.thumbnailFile)
  };
}
async function resolveImages(prepared,visibility="shared"){
  const list=(prepared||[]).filter(Boolean);
  const uploaded=[];
  for(const item of list)uploaded.push(await resolvePreparedImage(item,visibility));
  return uploaded;
}
function imagePreviewHost(input){
  let host=input.parentElement.querySelector(".image-previews");
  if(!host){
    host=document.createElement("div");
    host.className="image-previews";
    input.insertAdjacentElement("afterend",host);
  }
  return host;
}
function renderImagePreviews(input,items){
  const host=imagePreviewHost(input);
  host.innerHTML=items.map(item=>`<div class="image-preview">
    <img src="${item.previewUrl}" alt="上传前预览">
    <div><strong>${escapeHtml(item.original.name)}</strong><small>${formatBytes(item.originalSize)} → ${formatBytes(item.finalSize)}</small><span>${item.compressed?(item.special?"文字图片 · 高质量压缩":"已转为 WebP"):"原图已符合大小要求"}</span></div>
  </div>`).join("");
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function urlAsDataUrl(url){
  if(!url)return "";
  if(String(url).startsWith("data:"))return url;
  const response=await fetch(url);
  if(!response.ok)throw new Error(`图片读取失败：${response.status}`);
  return fileAsDataUrl(await response.blob());
}
function dataUrlAsFile(dataUrl,name){
  const [header,data]=String(dataUrl).split(",");
  const type=header.match(/data:([^;]+)/)?.[1]||"image/webp";
  const binary=atob(data);
  const bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
  return new File([bytes],name,{type});
}
async function exportBackup(){
  const snapshot=clone(state);
  const media=[];
  let failed=0;
  const capture=async(url,label)=>{
    if(!url||String(url).startsWith("./assets/"))return null;
    try{
      const mediaId=`media-${media.length+1}`;
      media.push({id:mediaId,label,data:await urlAsDataUrl(url)});
      return mediaId;
    }catch(error){
      console.warn("Backup image skipped",error);
      failed+=1;
      return null;
    }
  };

  for(const wish of snapshot.wishes||[]){
    const original=state.wishes.find(item=>item.id===wish.id)||wish;
    const fullId=await capture(original.cover,`${wish.title||"愿望"}-原图`);
    const thumbId=await capture(original.thumb,`${wish.title||"愿望"}-缩略图`);
    wish.backupMedia=fullId?{fullId,thumbId}:null;
    wish.coverPath=null;wish.thumbPath=null;
    wish.cover=fullId?"":"./assets/images/wish-default.jpg";
    wish.thumb="";
  }
  for(const message of snapshot.messages||[]){
    const original=state.messages.find(item=>item.id===message.id)||message;
    message.images=[];
    for(let index=0;index<(original.images||[]).length;index+=1){
      const image=original.images[index];
      const fullId=await capture(image.url,`留言-${message.id}-${index+1}-原图`);
      if(!fullId)continue;
      const thumbId=await capture(image.thumbUrl,`留言-${message.id}-${index+1}-缩略图`);
      message.images.push({backupMedia:{fullId,thumbId}});
    }
    delete message.image;
    delete message.imagePath;
  }
  for(const goal of snapshot.goals||[]){
    const original=state.goals.find(item=>item.id===goal.id)||goal;
    for(const record of goal.records||[]){
      const source=original.records.find(item=>item.id===record.id)||record;
      record.images=[];
      for(let index=0;index<(source.images||[]).length;index+=1){
        const image=source.images[index];
        const fullId=await capture(image.url,`进展-${goal.title}-${record.date}-${index+1}`);
        if(!fullId)continue;
        const thumbId=await capture(image.thumbUrl,`进展-${goal.title}-${record.date}-${index+1}-缩略图`);
        record.images.push({backupMedia:{fullId,thumbId}});
      }
    }
  }
  snapshot.homePhotos=uniqueHomePhotos([snapshot.homePhoto,...(snapshot.homePhotos||[])]);
  for(const photo of snapshot.homePhotos){
    const original=uniqueHomePhotos([state.homePhoto,...(state.homePhotos||[])])
      .find(item=>photoKey(item)===photoKey(photo))||photo;
    const fullId=await capture(original.url,`首页照片-${photo.title||photo.date||"原图"}`);
    const thumbId=await capture(original.thumbUrl,`首页照片-${photo.title||photo.date||"缩略图"}`);
    photo.backupMedia=fullId?{fullId,thumbId}:null;
    photo.path=null;photo.thumbPath=null;
    photo.url=fullId?"":"./assets/images/home-photo.jpg";
    photo.thumbUrl="";
  }
  const activePhotoKey=photoKey(snapshot.homePhoto||{});
  snapshot.homePhoto=snapshot.homePhotos.find(photo=>photoKey(photo)===activePhotoKey)||snapshot.homePhotos[0]||null;

  const avatarData=await capture(cloudStatus.profile?.avatar_url,"账号头像");
  const backup={
    format:"couple-life-dashboard-backup",
    version:1,
    exportedAt:new Date().toISOString(),
    sourceProvider:cloudStatus.provider||"local",
    profile:{
      displayName:cloudStatus.profile?.display_name||"",
      avatarMediaId:avatarData
    },
    state:snapshot,
    media
  };
  downloadBlob(
    new Blob([JSON.stringify(backup)],{type:"application/json"}),
    `月亮生活看板备份-${today()}.couple-backup.json`
  );
  toast(failed?`备份已导出，${failed}张图片读取失败`:"完整备份已导出");
}
function clearImportedCreators(value){
  ["tasks","wishes","goals","expenses","messages","futureLetters","intimacy"].forEach(key=>{
    (value[key]||[]).forEach(item=>delete item.creatorId);
  });
  value.homeSettingsCreatorId=null;
  return value;
}
async function importBackup(file){
  if(!window.CloudStore?.status().ready)throw new Error("请先登录并进入情侣空间，再导入备份");
  const backup=JSON.parse(await file.text());
  if(backup.format!=="couple-life-dashboard-backup"||backup.version!==1){
    throw new Error("这不是可识别的生活看板备份文件");
  }
  const media=new Map((backup.media||[]).map(item=>[item.id,item.data]));
  const restored=clearImportedCreators(backup.state||{});
  for(const wish of restored.wishes||[]){
    const ref=wish.backupMedia;
    if(ref?.fullId&&media.has(ref.fullId)){
      const full=dataUrlAsFile(media.get(ref.fullId),`${wish.id||id()}-full.webp`);
      const thumb=ref.thumbId&&media.has(ref.thumbId)
        ?dataUrlAsFile(media.get(ref.thumbId),`${wish.id||id()}-thumb.webp`)
        :null;
      const uploaded=await window.CloudStore.uploadMedia(full,wish.visibility||"shared",thumb);
      wish.coverPath=uploaded.path;wish.cover=uploaded.url;
      wish.thumbPath=uploaded.thumbPath;wish.thumb=uploaded.thumbUrl;
    }
    delete wish.backupMedia;
  }
  for(const message of restored.messages||[]){
    const images=[];
    for(let index=0;index<(message.images||[]).length;index+=1){
      const ref=message.images[index].backupMedia;
      if(!ref?.fullId||!media.has(ref.fullId))continue;
      const full=dataUrlAsFile(media.get(ref.fullId),`${message.id||id()}-${index+1}.webp`);
      const thumb=ref.thumbId&&media.has(ref.thumbId)
        ?dataUrlAsFile(media.get(ref.thumbId),`${message.id||id()}-${index+1}-thumb.webp`)
        :null;
      images.push(await window.CloudStore.uploadMedia(full,message.visibility||"shared",thumb));
    }
    message.images=images;
  }
  for(const goal of restored.goals||[]){
    for(const record of goal.records||[]){
      const images=[];
      for(let index=0;index<(record.images||[]).length;index+=1){
        const ref=record.images[index].backupMedia;
        if(!ref?.fullId||!media.has(ref.fullId))continue;
        const full=dataUrlAsFile(media.get(ref.fullId),`${record.id||id()}-${index+1}.webp`);
        const thumb=ref.thumbId&&media.has(ref.thumbId)
          ?dataUrlAsFile(media.get(ref.thumbId),`${record.id||id()}-${index+1}-thumb.webp`)
          :null;
        images.push(await window.CloudStore.uploadMedia(full,goal.visibility||"shared",thumb));
      }
      record.images=images;
    }
  }
  restored.homePhotos=restored.homePhotos||[restored.homePhoto].filter(Boolean);
  for(const photo of restored.homePhotos){
    const ref=photo.backupMedia;
    if(ref?.fullId&&media.has(ref.fullId)){
      const full=dataUrlAsFile(media.get(ref.fullId),`${photo.id||id()}-home.webp`);
      const thumb=ref.thumbId&&media.has(ref.thumbId)
        ?dataUrlAsFile(media.get(ref.thumbId),`${photo.id||id()}-thumb.webp`)
        :null;
      const uploaded=await window.CloudStore.uploadMedia(full,"shared",thumb);
      Object.assign(photo,{path:uploaded.path,url:uploaded.url,thumbPath:uploaded.thumbPath,thumbUrl:uploaded.thumbUrl});
    }
    delete photo.backupMedia;
  }
  const activePhotoKey=photoKey(restored.homePhoto||{});
  restored.homePhoto=restored.homePhotos.find(photo=>photoKey(photo)===activePhotoKey)||restored.homePhotos[0]||restored.homePhoto;
  if(restored.homePhoto)delete restored.homePhoto.backupMedia;
  if(backup.profile?.displayName){
    const avatar=backup.profile.avatarMediaId&&media.has(backup.profile.avatarMediaId)
      ?dataUrlAsFile(media.get(backup.profile.avatarMediaId),"avatar.webp")
      :null;
    await window.CloudStore.updateProfile(backup.profile.displayName,avatar);
  }
  if(window.CloudStore.saveFutureLetter){
    const migrated=[];
    for(const letter of restored.futureLetters||[]){
      if(!letter.text)continue;
      migrated.push(await window.CloudStore.saveFutureLetter(letter));
    }
    restored.futureLetters=migrated;
  }
  state=normalizeStateImages({...freshCloudState(restored.togetherSince),...restored});
  await window.CloudStore.saveState(state);
  storeLocalState();
  cloudStatus=window.CloudStore.status();
  render();
  toast("备份已导入并同步到当前云端");
}
function syncSpaceStatus(){
  const status=document.querySelector("#space-status");
  const name=document.querySelector("#space-name");
  const avatars=document.querySelector("#space-control .avatars");
  if(!status||!name)return;
  const currentMember=avatars?.querySelector(currentOwnerKey()==="b"?".member-b":".member-a");
  if(currentMember&&currentMember!==avatars.firstElementChild)avatars.prepend(currentMember);
  if(cloudStatus.ready){
    name.textContent=cloudStatus.space?.name||"我们的情侣空间";
    status.textContent="云端同步已开启";
  }else if(cloudStatus.signedIn){
    name.textContent="创建或加入空间";
    status.textContent="账号已登录";
  }else{
    name.textContent="月亮的小家";
    status.textContent=cloudStatus.configured?"点击登录同步":"本地模式";
  }
}
function syncAuthGate(){
  const locked=Boolean(cloudStatus.configured&&!cloudStatus.signedIn);
  document.body.classList.remove("auth-pending");
  document.body.classList.toggle("auth-locked",locked);
  const form=document.querySelector("#login-form");
  if(form){
    form.querySelectorAll("input").forEach(input=>{input.disabled=!locked});
    const submit=form.querySelector('[type="submit"]');
    submit.disabled=!locked;
    submit.textContent="登录";
  }
  if(locked){
    document.querySelectorAll("dialog[open]").forEach(dialog=>dialog.close());
    document.querySelector("#content").replaceChildren();
    document.querySelector("#account-content").replaceChildren();
  }
}
async function pullCloud(showMessage=false){
  if(!window.CloudStore?.status().ready)return;
  try{
    const remote=await window.CloudStore.loadState();
    if(remote){
      state=normalizeStateImages({...state,...remote});
      storeLocalState();
      render();
      if(showMessage)toast("云端数据已同步");
    }
  }catch(error){toast(`同步失败：${error.message}`)}
}

function render(){
  if(cloudStatus.configured&&!cloudStatus.signedIn){
    document.querySelector("#content").replaceChildren();
    return;
  }
  const [title,eyebrow]=meta[route]||meta.home;
  document.querySelector("#title").textContent=title;
  document.querySelector("#eyebrow").textContent=route==="home"?todayHeading():eyebrow;
  document.querySelector("#content").innerHTML=({
    home:homePage,plans:plansPage,wishes:wishesPage,growth:growthPage,
    health:healthPage,finance:financePage,messages:messagesPage,more:morePage
  }[route]||homePage)();
  document.querySelectorAll("[data-route]").forEach(x=>x.classList.toggle("active",x.dataset.route===route));
  syncSpaceStatus();
  icons();
}

function metric(label,value,sub,icon,tone,target=""){
  const attrs=target?` role="button" tabindex="0" data-home-target="${target}"`:"";
  return `<article class="card metric ${target?"metric-link":""}"${attrs}><div class="metric-top"><span>${label}</span><i class="${tone}"><svg data-lucide="${icon}"></svg></i></div><strong>${value}</strong><small>${sub}</small></article>`;
}
function taskRow(t,actions=false){
  return `<div class="todo ${ownerCls(t.owner)} ${t.done?"done":""}">
    <button class="check" data-task="${t.id}" aria-label="${t.done?"恢复":"完成"}计划">${t.done?"✓":""}</button>
    <button class="todo-copy" type="button" data-edit-task="${t.id}"><span class="todo-title">${escapeHtml(t.title)}</span><small>${t.type==="月计划"?monthLabel(t.date.slice(0,7)):t.date} · ${escapeHtml(t.priority||"中")}优先级</small></button>
    ${actions?`<div class="row-actions"><button class="icon-btn compact" data-edit-task="${t.id}" title="编辑"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-task="${t.id}" title="删除"><i data-lucide="trash-2"></i></button></div>`:`<span class="chip ${ownerCls(t.owner)}">${owner(t.owner)}</span>`}
  </div>`;
}
function activity(icon,title,text,time,tone){
  return `<div class="activity"><i class="${tone}"><svg data-lucide="${icon}"></svg></i><div><strong>${title}</strong><p>${text}</p></div><time>${time}</time></div>`;
}
function eventDate(value,fallback=""){
  const candidate=value||fallback;
  const date=new Date(candidate);
  return Number.isNaN(date.getTime())?new Date(`${String(candidate).slice(0,10)}T12:00:00+08:00`):date;
}
function lifeEvents(){
  const events=[];
  (state.tasks||[]).filter(item=>item.done).forEach(item=>events.push({
    date:eventDate(item.completedAt,item.date),
    icon:"calendar-check-2",tone:"green",title:"完成计划",text:item.title,
    memory:true
  }));
  (state.wishes||[]).filter(item=>item.status==="已完成").forEach(item=>events.push({
    date:eventDate(item.completedAt,item.date),
    icon:"sparkles",tone:"coral",title:"实现愿望",text:item.title,
    memory:true
  }));
  (state.goals||[]).forEach(goal=>(goal.records||[]).forEach(record=>events.push({
    date:eventDate(record.createdAt,record.date),
    icon:catIcon(goal.category),tone:"blue",title:`推进${goalCategoryLabel(goal)}目标`,text:`${goal.title} · +${record.amount}${goal.unit}`,
    memory:true
  })));
  (state.messages||[]).forEach(item=>events.push({
    date:eventDate(item.createdAt),
    icon:"message-circle",tone:"gold",title:`${owner(item.author)}留下留言`,text:item.text,
    memory:false
  }));
  return events.sort((a,b)=>b.date-a.date);
}
function relativeDate(date){
  const diff=Math.floor((dateFromLocal(today())-new Date(date.getFullYear(),date.getMonth(),date.getDate()))/86400000);
  if(diff===0)return "今天";
  if(diff===1)return "昨天";
  if(diff>1&&diff<30)return `${diff}天前`;
  return localDateString(date);
}
function memoriesTimeline(){
  const events=lifeEvents().filter(item=>item.memory);
  return events.length?`<div class="timeline">${events.map(item=>`<div class="timeline-item"><time>${localDateString(item.date)}</time><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>`).join("")}</div>`:`<div class="empty-inline">完成计划、愿望或成长进展后，会自动出现在这里。</div>`;
}
function progressRow(g){
  return `<div class="progress"><label><strong>${escapeHtml(goalCategoryLabel(g))}</strong><small>${g.current}/${g.target}${g.unit}</small></label><div class="bar ${g.tone}"><span style="width:${percent(g)}%"></span></div><b>${percent(g)}%</b></div>`;
}

function photoKey(photo){
  return photo.id||photo.path||photo.url;
}
function uniqueHomePhotos(photos){
  const seen=new Set();
  return (photos||[]).filter(photo=>{
    const key=photoKey(photo);
    if(!key||seen.has(key))return false;
    seen.add(key);
    return true;
  });
}

function homePage(){
  const month=today().slice(0,7);
  const previousMonth=shiftMonth(month,-1);
  const currentSleep=sleepReportFor(month);
  const previousSleep=sleepReportFor(previousMonth);
  const monthTasks=state.tasks.filter(item=>item.date?.startsWith(month));
  const done=monthTasks.filter(item=>item.done).length;
  const previousExpenses=state.expenses.filter(item=>item.month===previousMonth);
  const spending=previousExpenses.reduce((sum,item)=>sum+Number(item.amount),0);
  const sharedPreviousSpending=previousExpenses.filter(item=>item.scope==="共同支出").reduce((sum,item)=>sum+Number(item.amount),0);
  const monthExpenses=state.expenses.filter(item=>item.month===month);
  const sharedSpending=monthExpenses.filter(item=>item.scope==="共同支出").reduce((sum,item)=>sum+Number(item.amount),0);
  const events=lifeEvents().slice(0,20);
  const openTodayTasks=sortPlans(state.tasks.filter(item=>!item.done&&item.date===today()));
  const newWishes=state.wishes.filter(item=>String(item.createdAt||item.date).slice(0,7)===month).length;
  const photo=state.homePhoto||demo.homePhoto;
  const photos=uniqueHomePhotos([photo,...(state.homePhotos||[])]);
  return `<section class="grid g4">
    <article class="card hero span3"><button class="hero-quote-edit" data-quote-settings title="设置首页名言" aria-label="设置首页名言"><i data-lucide="pencil"></i></button><div><p class="kicker">月 × 亮 · 我们的第 ${days()} 天</p><h2>${escapeHtml(homeQuote())}</h2><p>把想做的事、正在坚持的目标和那些普通却重要的瞬间，都慢慢留在这里。</p><div class="hero-stats"><button data-home-target="plans-week"><strong>${state.tasks.filter(t=>!t.done).length}</strong><small>正在进行</small></button><button data-home-target="wishes"><strong>${state.wishes.length}</strong><small>共同愿望</small></button><button data-home-target="growth"><strong>${state.goals.reduce((s,g)=>s+g.records.length,0)}</strong><small>成长记录</small></button></div></div></article>
    <article class="card photo"><button class="photo-edit" data-form="homePhoto" title="更换首页照片"><i data-lucide="pencil"></i></button><button class="photo-main" type="button" data-home-album><img src="${escapeHtml(photo.thumbUrl||photo.url||"./assets/images/home-photo.jpg")}" alt="最近的共同照片"><span class="photo-open"><i data-lucide="images"></i>相册 ${photos.length}</span></button><div class="caption"><strong>${escapeHtml(photo.title||"我们的照片")}</strong><small>${escapeHtml(photo.caption||"共同生活")} · ${escapeHtml(photo.date||"")}</small></div></article>
  </section>
  <section class="grid g4" style="margin-top:16px">${metric("今日待办",openTodayTasks.length,"查看今天尚未完成的计划","check-circle-2","coral","plans-week")}${metric("本月完成",`${done}/${monthTasks.length}`,"按计划日期统计","calendar-check-2","green","plans-month")}${metric("上月睡眠",previousSleep?`${previousSleep.duration}h`:"--",previousSleep?`${previousSleep.bedtime} 入睡`:"上月尚未填写","moon-star","blue","health")}${metric("上月支出",money(spending),spending?`共同支出占 ${Math.round(sharedPreviousSpending/spending*100)}%`:"上月尚未记录","wallet-cards","gold","finance-previous")}</section>
  <section class="grid g3" style="margin-top:16px">
    <article class="card pad span2 home-list-card"><div class="card-head"><div><h2>待办速览</h2><p>今天尚未完成的所有任务</p></div><button class="btn outline small-btn" data-form="task"><i data-lucide="plus"></i>新增</button></div><div class="todo-list fixed-scroll-list">${openTodayTasks.map(item=>taskRow(item,true)).join("")||'<div class="empty-inline">今天没有待办。</div>'}</div></article>
    <article class="card pad home-list-card"><div class="card-head"><div><h2>最近发生</h2><p>最近修改的 20 条动态</p></div></div><div class="activity-list fixed-scroll-list">${events.map(item=>activity(item.icon,item.title,item.text,relativeDate(item.date),item.tone)).join("")||'<div class="empty-inline">最近还没有新的生活记录。</div>'}</div></article>
  </section>
  <section class="grid g2" style="margin-top:16px">
    <article class="card pad clickable-card" data-route="growth"><div class="card-head"><div><h2>正在坚持</h2><p>年度目标的实际完成进度</p></div></div><div class="progress-list">${state.goals.map(progressRow).join("")}</div></article>
    <article class="card pad"><div class="card-head"><div><h2>这个月的我们</h2><p>${monthLabel(month)}</p></div></div><div class="grid g2"><button class="summary home-summary-link" data-home-target="plans-month"><span>一起完成</span><strong>${done} 件</strong></button><button class="summary home-summary-link" data-home-target="wishes"><span>新增愿望</span><strong>${newWishes} 个</strong></button><button class="summary home-summary-link" data-home-target="health-current"><span>平均睡眠</span><strong>${currentSleep?.duration??"--"} 小时</strong></button><button class="summary home-summary-link" data-home-target="finance-current"><span>共同支出</span><strong>${money(sharedSpending)}</strong></button></div></article>
  </section>`;
}

function plansPage(){
  const tasks=filteredPlanTasks();
  const main={
    week:weekPlanView,
    month:monthPlanView,
    year:yearPlanView,
    list:planTable
  }[planView](tasks);
  return `<div class="toolbar"><div class="segments">${[["week","周"],["month","月"],["year","年"],["list","清单"]].map(([v,l])=>`<button class="${planView===v?"active":""}" data-plan-view="${v}">${l}</button>`).join("")}</div><button class="btn primary" data-form="task"><i data-lucide="plus"></i>新增计划</button></div>
    <div class="filters" style="margin-bottom:15px">${[["all","全部"],["shared","共同计划"],["a","月的计划"],["b","亮的计划"]].map(([value,label])=>`<button class="filter ${planFilter===value?"active":""}" data-plan-filter="${value}">${label}</button>`).join("")}</div>${main}`;
}
function filteredPlanTasks(){
  return state.tasks.filter(item=>planFilter==="all"||item.owner===planFilter);
}
function planNavigator(label,unit){
  return `<div class="view-navigator"><button class="icon-btn compact" data-plan-shift="-1" data-plan-unit="${unit}" title="上一个"><i data-lucide="chevron-left"></i></button><strong>${label}</strong><button class="icon-btn compact" data-plan-shift="1" data-plan-unit="${unit}" title="下一个"><i data-lucide="chevron-right"></i></button><button class="text-button" data-plan-current="${unit}">回到当前</button></div>`;
}
function planItem(t){
  return `<div class="plan ${ownerCls(t.owner)} ${t.done?"done":""}">
    <button class="mini-check" data-task="${t.id}" aria-label="${t.done?"恢复":"完成"}计划">${t.done?"✓":""}</button>
    <button class="plan-copy" data-edit-task="${t.id}"><strong>${escapeHtml(t.title)}</strong><small>${owner(t.owner)} · ${escapeHtml(t.priority||"中")}优先级</small></button>
  </div>`;
}
function weekPlanView(tasks){
  const daysData=Array.from({length:7},(_,index)=>{
    const date=addDays(planWeekStart,index);
    return {name:["周一","周二","周三","周四","周五","周六","周日"][index],number:String(date.getDate()),value:localDateString(date)};
  });
  const end=daysData.at(-1).value;
  return `${planNavigator(`${planWeekStart.getFullYear()}年${planWeekStart.getMonth()+1}月${planWeekStart.getDate()}日 - ${Number(end.slice(5,7))}月${Number(end.slice(8,10))}日`,"week")}
    <article class="card calendar"><div class="week">${daysData.map(date=>`<div class="day ${date.value===today()?"today":""}"><div class="day-head"><span>${date.name}</span><strong>${date.number}</strong></div>${sortPlans(tasks.filter(item=>item.type!=="月计划"&&item.date===date.value)).map(planItem).join("")||'<div class="day-empty">暂无计划</div>'}</div>`).join("")}</div></article>`;
}
function monthPlanView(tasks){
  const [year,month]=planMonth.split("-").map(Number);
  const first=new Date(year,month-1,1);
  const start=addDays(first,-((first.getDay()+6)%7));
  const cells=Array.from({length:42},(_,index)=>{
    const date=addDays(start,index);
    const value=localDateString(date);
    const items=sortPlans(tasks.filter(item=>item.type!=="月计划"&&item.date===value));
    return `<div class="month-day ${date.getMonth()!==month-1?"outside":""} ${value===today()?"today":""}"><strong>${date.getDate()}</strong><div>${items.map(planItem).join("")}</div></div>`;
  }).join("");
  return `${planNavigator(`${year}年${month}月`,"month")}<article class="card month-calendar"><div class="month-week">${["一","二","三","四","五","六","日"].map(day=>`<span>${day}</span>`).join("")}</div><div class="month-grid">${cells}</div></article>`;
}
function yearPlanView(tasks){
  const yearTasks=tasks.filter(item=>item.type==="月计划"&&Number(item.date?.slice(0,4))===planYear);
  return `${planNavigator(`${planYear}年`,"year")}<section class="year-grid">${Array.from({length:12},(_,index)=>{
    const month=String(index+1).padStart(2,"0");
    const items=sortPlans(yearTasks.filter(item=>item.date?.slice(5,7)===month));
    return `<article class="card year-month"><h2>${index+1}月</h2><div>${items.map(planItem).join("")||'<span class="day-empty">暂无计划</span>'}</div></article>`;
  }).join("")}</section>`;
}
function planTable(tasks){
  const year=planYear;
  return `${planNavigator(`${year}年计划统计`,"year")}<article class="card pad"><div class="plan-month-summary">${Array.from({length:12},(_,index)=>{
    const month=`${year}-${String(index+1).padStart(2,"0")}`;
    const count=tasks.filter(item=>item.date?.slice(0,7)===month).length;
    return `<button class="summary plan-month-button ${count?"":"is-empty"}" data-plan-month-jump="${month}"><span>${index+1}月</span><strong>${count?`${count} 项`:"暂无"}</strong></button>`;
  }).join("")}</div></article>`;
}

function wishesPage(){
  const visible=state.wishes.filter(item=>{
    if(wishFilter==="mine")return item.owner===currentOwnerKey();
    if(wishFilter==="shared")return item.owner==="shared";
    return true;
  });
  const w=visible.find(item=>item.id===state.selectedWish)||visible[0];
  const group=(key,title,desc,icon,done=false)=>{
    const items=visible.filter(item=>done?item.status==="已完成":item.group===key&&item.status!=="已完成");
    return `<div class="wish-section ${done?"completed":""}"><h2>${title}</h2><p>${desc}</p><div class="wish-cloud">${items.map(item=>`<span class="wish-item"><button class="wish-pill ${done?"done":""}" data-wish="${item.id}"><i data-lucide="${icon}"></i>${escapeHtml(item.title)}</button></span>`).join("")||"<span>这里暂时空着</span>"}</div></div>`;
  };
  return `<div class="toolbar"><div class="filters">${[["all",`全部愿望 ${state.wishes.length}`],["shared","共同提出"],["mine","我提出的"]].map(([value,label])=>`<button class="filter ${wishFilter===value?"active":""}" data-wish-filter="${value}">${label}</button>`).join("")}</div><button class="btn primary" data-form="wish"><i data-lucide="plus"></i>许个愿望</button></div>
    ${w?`<article class="card wish-detail ${w.status==="已完成"?"is-complete":""}"><div class="wish-cover" style="background-image:url('${escapeHtml(w.thumb||w.cover||"./assets/images/wish-default.jpg")}')"></div><div class="wish-info"><span class="chip ${w.status==="已完成"?"done-chip":"shared"}">${escapeHtml(w.status)}</span><h2>${escapeHtml(w.title)}</h2><p>${w.status==="已完成"?"这个愿望已经成为共同回忆，也会一直收藏在我们走过的时光里。":"愿望不需要一开始就变成任务。先记录下来，等两个人都有时间和心情，再把它安排进计划。"}</p><div class="detail-grid"><div><span>提出人</span><strong>${owner(w.owner)}</strong></div><div><span>预计时间</span><strong>${escapeHtml(w.date)}</strong></div><div><span>大致预算</span><strong>${money(w.budget)}</strong></div></div><div class="wish-detail-actions"><button class="btn ${w.status==="已完成"?"success":"primary"}" data-toggle-wish="${w.id}"><i data-lucide="${w.status==="已完成"?"rotate-ccw":"party-popper"}"></i>${w.status==="已完成"?"取消实现":"实现愿望"}</button>${w.status!=="已完成"?`<button class="btn ghost" data-plan-wish="${w.id}"><i data-lucide="calendar-plus"></i>列入计划</button>`:""}<button class="btn outline" data-edit-wish="${w.id}"><i data-lucide="pencil"></i>编辑</button><button class="btn danger-ghost" data-delete-wish="${w.id}"><i data-lucide="trash-2"></i>删除</button></div></div></article>`:`<article class="card empty-state"><i data-lucide="sparkles"></i><h2>当前分类还是空的</h2><p>可以切换分类，或者许下一个新愿望。</p><button class="btn primary" data-form="wish"><i data-lucide="plus"></i>许个愿望</button></article>`}
    ${group("ready","随时可以做","不用准备太久，找个合适的日子就出发","zap")}${group("arrange","需要安排","需要确认时间、预算或提前预约","calendar-clock")}${group("long","长期愿望","不急着完成，但值得一直记着","telescope")}${group("done","已实现的愿望","完成的愿望会保留在这里，也可以取消实现","circle-check-big",true)}`;
}

function growthPage(){
  const goals=state.goals.filter(goal=>{
    if(goalFilter==="mine")return goal.owner===currentOwnerKey();
    if(goalFilter==="shared")return goal.owner==="shared";
    return true;
  });
  return `<div class="toolbar"><div class="filters">${[["all","全部目标"],["mine","我的目标"],["shared","共同目标"]].map(([value,label])=>`<button class="filter ${goalFilter===value?"active":""}" data-goal-filter="${value}">${label}</button>`).join("")}</div><div style="display:flex;gap:8px"><button class="btn outline" data-form="progress"><i data-lucide="plus"></i>记录进展</button><button class="btn primary" data-form="goal"><i data-lucide="target"></i>新目标</button></div></div>
  <section class="goal-grid">${goals.map(goalCard).join("")||'<article class="card empty-state"><i data-lucide="target"></i><h2>当前分类还没有目标</h2><p>可以切换筛选，或者建立一个新目标。</p><button class="btn primary" data-form="goal"><i data-lucide="plus"></i>新目标</button></article>'}</section>
  <article class="card pad" style="margin-top:16px"><div class="card-head"><div><h2>年度目标甘特图</h2><p>计划周期、实际进度和阶段节点</p></div><div class="gantt-year-switch"><button class="icon-btn compact" data-gantt-shift="-1" title="上一年"><i data-lucide="chevron-left"></i></button><strong>${ganttYear}年</strong><button class="icon-btn compact" data-gantt-shift="1" title="下一年"><i data-lucide="chevron-right"></i></button></div></div>${gantt(goals)}</article>
  <article class="card pad" style="margin-top:16px"><div class="card-head"><div><h2>最近进展记录</h2><p>每次推进都会留下过程</p></div></div><div class="timeline">${goals.flatMap(g=>g.records.map(r=>({...r,title:g.title,unit:g.unit,goalId:g.id}))).sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<div class="timeline-item progress-entry"><div><time>${r.date}</time><strong>${escapeHtml(r.title)} · +${r.amount}${escapeHtml(r.unit)}</strong><p>${escapeHtml(r.note||"")}</p></div><div class="row-actions"><button class="icon-btn compact" data-edit-progress="${r.goalId}:${r.id}" title="编辑进展"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-progress="${r.goalId}:${r.id}" title="删除进展"><i data-lucide="trash-2"></i></button></div></div>`).join("")||'<div class="empty-inline">当前分类还没有进展记录。</div>'}</div></article>`;
}
function goalCard(g){
  return `<article class="card goal"><div class="goal-top"><i class="goal-icon ${g.tone==="coralbar"?"coral":g.tone==="bluebar"?"blue":g.tone==="goldbar"?"gold":"green"}"><svg data-lucide="${catIcon(g.category)}"></svg></i><div class="goal-chips"><span class="chip ${ownerCls(g.owner)}">${owner(g.owner)}</span><span class="chip shared">${g.end.slice(5,7)}月前完成</span></div></div><h3>${escapeHtml(g.title)}</h3><small>${g.start} 至 ${g.end}</small><div class="goal-number"><strong>${g.current}<small> / ${g.target}${escapeHtml(g.unit)}</small></strong><span>${percent(g)}%</span></div><div class="bar ${g.tone}"><span style="width:${percent(g)}%"></span></div><div class="goal-actions"><small>最近：${escapeHtml(g.records.at(-1)?.note||"暂无记录")}</small><div class="row-actions"><button class="icon-btn compact" data-progress="${g.id}" title="记录进展"><i data-lucide="plus"></i></button><button class="icon-btn compact" data-goal-details="${g.id}" title="查看进展详情"><i data-lucide="list"></i></button><button class="icon-btn compact" data-edit-goal="${g.id}" title="编辑目标"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-goal="${g.id}" title="删除目标"><i data-lucide="trash-2"></i></button></div></div></article>`;
}
function gantt(goals=state.goals){
  const visible=goals.filter(goal=>Number(goal.start?.slice(0,4))<=ganttYear&&Number(goal.end?.slice(0,4))>=ganttYear);
  return visible.length
    ?`<div class="gantt"><div class="gantt-grid"><div class="gantt-head"><span>目标</span>${Array.from({length:12},(_,i)=>`<span>${i+1}月</span>`).join("")}</div>${visible.map(g=>{
      const startYear=Number(g.start.slice(0,4)),endYear=Number(g.end.slice(0,4));
      const startMonth=startYear<ganttYear?1:Number(g.start.slice(5,7));
      const endMonth=endYear>ganttYear?12:Number(g.end.slice(5,7));
      return `<div class="gantt-row"><span class="gantt-label">${escapeHtml(goalCategoryLabel(g))}</span>${Array.from({length:12},()=>"<span></span>").join("")}<div class="gantt-bar ${g.tone}" style="grid-column:${startMonth+1}/${endMonth+2};--p:${percent(g)}%"></div></div>`;
    }).join("")}</div></div>`
    :'<div class="empty-inline">当前分类还没有可展示的目标。</div>';
}

function shiftMonth(value,amount){
  const [year,month]=value.split("-").map(Number);
  const date=new Date(year,month-1+amount,1);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}
function intimacyCalendar(){
  const [year,month]=intimacyMonth.split("-").map(Number);
  const first=new Date(year,month-1,1);
  const mondayOffset=(first.getDay()+6)%7;
  const start=new Date(year,month-1,1-mondayOffset);
  const records=new Map((state.intimacy||[]).map(item=>[item.date,item]));
  const cells=Array.from({length:42},(_,index)=>{
    const date=new Date(start);
    date.setDate(start.getDate()+index);
    const dateValue=localDateString(date);
    const record=records.get(dateValue);
    const isToday=dateValue===today();
    const outside=date.getMonth()!==month-1;
    const classes=[
      "intimacy-day",
      outside?"outside":"",
      isToday?"is-today":"",
      record?"has-heart":"",
      animateHeartDate===dateValue?"heart-new":""
    ].filter(Boolean).join(" ");
    return `<button class="${classes}" type="button" ${record?`data-intimacy-date="${dateValue}"`:""} aria-label="${dateValue}${record?"，有一颗心":""}">
      <span class="day-number">${date.getDate()}</span>
      ${record?'<span class="calendar-heart" aria-hidden="true">♥</span>':""}
    </button>`;
  }).join("");
  return `<div class="intimacy-calendar">
    <div class="calendar-toolbar">
      <button class="icon-btn compact" data-intimacy-month="-1" title="上个月"><i data-lucide="chevron-left"></i></button>
      <strong>${year}年${month}月</strong>
      <div class="calendar-actions"><button class="text-button today-button" data-intimacy-today>回到今天</button><button class="icon-btn compact" data-intimacy-month="1" title="下个月"><i data-lucide="chevron-right"></i></button></div>
    </div>
    <div class="calendar-week">${["一","二","三","四","五","六","日"].map(day=>`<span>${day}</span>`).join("")}</div>
    <div class="calendar-days">${cells}</div>
  </div>`;
}

function healthPage(){
  const report=sleepReportFor(healthMonth);
  const display=report||blankSleepReport(healthMonth);
  const month=monthLabel(healthMonth);
  const sleepQuality=display.quality?.trim();
  const sleepNote=display.note?.trim();
  const metricValue=(value,suffix="")=>value!==""&&value!=null?`${value}${suffix}`:"--";
  return `<article class="card health-banner"><div><h2>健康作息月报</h2><div class="health-month-switch"><button class="icon-btn compact" data-health-month="-1" title="上个月"><i data-lucide="chevron-left"></i></button><strong>${month}</strong><button class="icon-btn compact" data-health-month="1" title="下个月"><i data-lucide="chevron-right"></i></button><button class="text-button" data-health-today>回到本月</button></div></div><button class="btn primary" data-form="sleep" data-sleep-mode="new"><i data-lucide="pencil"></i>填写睡眠月报</button></article>
  <section class="grid g4" style="margin-top:16px">${metric("日均入睡",metricValue(display.bedtime),month,"moon","blue")}${metric("日均醒来",metricValue(display.wake),month,"sunrise","gold")}${metric("日均睡眠",metricValue(display.duration,"h"),month,"bed-double","green")}${metric("零星小睡",metricValue(display.nap,"h"),month,"coffee","coral")}</section>
  <article class="card pad" style="margin-top:16px"><div class="card-head"><div><h2>月度复盘</h2><p>${month}</p></div>${report?'<button class="btn outline small-btn" data-form="sleep" data-sleep-mode="edit"><i data-lucide="pencil"></i>修改</button>':""}</div><div class="timeline"><div class="timeline-item"><strong>睡眠质量${sleepQuality?`：${escapeHtml(sleepQuality)}`:""}</strong><p>${sleepQuality?"已填写本月睡眠质量。":"本月还没有填写睡眠质量。"}</p></div><div class="timeline-item"><strong>下月准备调整</strong><p>${display.next||"本月还没有填写调整计划。"}</p></div></div></article>
  <section class="health-lower" style="margin-top:16px">
    <article class="card pad intimacy-card"><div class="card-head"><div><h2>亲密日历</h2><p>只属于两个人的小日历</p></div><button class="btn outline small-btn" data-form="intimacy"><span aria-hidden="true">♡</span>记一颗心</button></div>${intimacyCalendar()}</article>
    <article class="card pad health-supplement"><div class="card-head"><div><h2>月报补充</h2><p>记录数字以外的感受</p></div></div><div class="activity-list">${activity("brain","这个月精神状态如何？",display.energy||"还没有填写","","purple")}${activity("calendar-heart","影响作息的事情",sleepNote||"还没有填写","","coral")}${activity("footprints","下个月想改变什么？",display.next||"还没有填写","","green")}</div></article>
  </section>`;
}

function financePage(){
  const year=financeMonth.slice(0,4);
  const records=state.expenses.filter(item=>financeAnnual?item.month?.startsWith(year):item.month===financeMonth);
  const total=records.reduce((sum,item)=>sum+Number(item.amount),0);
  const shared=records.filter(item=>item.scope==="共同支出").reduce((sum,item)=>sum+Number(item.amount),0);
  const a=records.filter(item=>item.owner==="a").reduce((sum,item)=>sum+Number(item.amount),0);
  const b=records.filter(item=>item.owner==="b").reduce((sum,item)=>sum+Number(item.amount),0);
  const categories=[...new Set(records.map(item=>item.category))];
  const colors=["var(--coral)","var(--green)","var(--blue)","var(--gold)","var(--purple)","#88958d","#c9845c","#5d8e91"];
  let cursor=0;
  const categoryData=categories.map((category,index)=>{
    const amount=records.filter(item=>item.category===category).reduce((sum,item)=>sum+Number(item.amount),0);
    const percentValue=total?amount/total*100:0;
    const start=cursor;cursor+=percentValue;
    return {category,amount,percent:percentValue,color:colors[index%colors.length],start,end:cursor};
  }).sort((x,y)=>y.amount-x.amount);
  cursor=0;
  categoryData.forEach(item=>{item.start=cursor;cursor+=item.percent;item.end=cursor});
  const gradient=categoryData.length?`conic-gradient(${categoryData.map(item=>`${item.color} ${item.start}% ${item.end}%`).join(",")})`:"#eceeea";
  const budget=financeAnnual
    ?Object.entries(state.financeBudgets||{}).filter(([month])=>month.startsWith(year)).reduce((sum,[,amount])=>sum+Number(amount||0),0)
    :Number(state.financeBudgets?.[financeMonth]||0);
  const monthlyTotals=Array.from({length:12},(_,index)=>{
    const month=`${year}-${String(index+1).padStart(2,"0")}`;
    return {month,index:index+1,total:state.expenses.filter(item=>item.month===month).reduce((sum,item)=>sum+Number(item.amount),0)};
  });
  const maxMonth=Math.max(1,...monthlyTotals.map(item=>item.total));
  return `<div class="toolbar"><div class="finance-switcher"><button class="icon-btn compact" data-finance-shift="-1"><i data-lucide="chevron-left"></i></button><strong>${financeAnnual?`${year}年`:monthLabel(financeMonth)}</strong><button class="icon-btn compact" data-finance-shift="1"><i data-lucide="chevron-right"></i></button><button class="btn ${financeAnnual?"primary":"outline"} small-btn" data-finance-annual><i data-lucide="chart-column"></i>${financeAnnual?"查看月度":"全年统计"}</button></div><button class="btn primary" data-form="expense"><i data-lucide="plus"></i>记录月度支出</button></div>
  <article class="card pad"><div class="finance-grid"><div class="summary"><span>${financeAnnual?"全年":"本月"}总支出</span><strong>${money(total)}</strong></div><div class="summary"><span>共同支出</span><strong>${money(shared)}</strong></div><div class="summary"><span>月 · 支出</span><strong>${money(a)}</strong></div><div class="summary"><span>亮 · 支出</span><strong>${money(b)}</strong></div></div><div class="budget"><div><strong>${financeAnnual?"全年共同预算":"共同预算使用情况"}</strong><span>${money(shared)} / ${budget?money(budget):"未设置"}</span><button class="text-button" data-form="budget" data-budget-month="${financeMonth}">设置预算</button></div><div class="bar coralbar" style="margin-top:8px"><span style="width:${budget?Math.min(100,shared/budget*100):0}%"></span></div></div></article>
  ${financeAnnual?`<article class="card pad" style="margin-top:16px"><div class="card-head"><div><h2>全年月度趋势</h2><p>${year}年各月支出自动汇总</p></div></div><div class="annual-bars">${monthlyTotals.map(item=>`<div><span style="height:${Math.max(3,item.total/maxMonth*100)}%"></span><b>${item.index}月</b><small>${item.total?money(item.total):"—"}</small></div>`).join("")}</div></article>`:""}
  <section class="grid g2" style="margin-top:16px"><article class="card pad"><div class="card-head"><div><h2>支出分类</h2><p>${financeAnnual?"全年":"本月"}消费结构</p></div></div><div class="donut-layout"><div class="donut dynamic" style="background:${gradient}"><span>${financeAnnual?"全年":"本月"}<strong>${money(total)}</strong></span></div><div class="legend">${categoryData.map(item=>`<div><i style="background:${item.color}"></i><span>${escapeHtml(item.category)}</span><b>${item.percent.toFixed(1)}%</b></div>`).join("")||'<div class="empty-inline">当前月份还没有支出记录。</div>'}</div></div></article><article class="card pad expense-record-card"><div class="card-head"><div><h2>${financeAnnual?"全年记录":"本月记录"}</h2><p>每条记录代表一个月度分类汇总</p></div></div><div class="expense-list">${records.slice().reverse().map(item=>`<div class="expense-row"><div><b>${escapeHtml(item.category)}</b><small>${escapeHtml(item.note||item.scope)} · ${monthLabel(item.month)}</small></div><span class="chip ${ownerCls(item.owner)}">${owner(item.owner)}</span><strong>${money(item.amount)}</strong><div class="row-actions"><button class="icon-btn compact" data-edit-expense="${item.id}" title="编辑"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-expense="${item.id}" title="删除"><i data-lucide="trash-2"></i></button></div></div>`).join("")||'<div class="empty-inline">当前范围还没有支出记录。</div>'}</div></article></section>`;
}

function messagesPage(){
  const notes=state.messages
    .filter(item=>{
      if(messageFilter==="pinned")return item.pinned;
      if(messageFilter==="photos")return (item.images||[]).length>0;
      return true;
    })
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const emptyNotes=state.messages.length
    ?'<article class="card empty-state"><i data-lucide="search-x"></i><h2>当前筛选没有留言</h2><p>可以切换到“全部留言”查看其他内容。</p></article>'
    :'<article class="card empty-state"><i data-lucide="messages-square"></i><h2>留言板还是空的</h2><p>写下第一句值得以后再看的话。</p><button class="btn primary" data-form="message"><i data-lucide="pen-line"></i>写留言</button></article>';
  return `<div class="toolbar messages-toolbar"><div class="filters">${[["all","全部留言"],["pinned","只看置顶"],["photos","有图片"]].map(([value,label])=>`<button class="filter ${messageFilter===value?"active":""}" data-message-filter="${value}">${label}</button>`).join("")}</div><button class="btn primary" data-form="message"><i data-lucide="pen-line"></i>写留言</button></div>
  <section class="message-grid">${notes.map(note).join("")||emptyNotes}</section>
  <section class="messages-lower" style="margin-top:16px">
    ${futureLettersView()}
    <article class="card pad"><div class="card-head"><div><h2>回忆时间轴</h2><p>由愿望、计划和成长记录自动生成</p></div></div>${memoriesTimeline()}</article>
  </section>`;
}
function futureLettersView(){
  const letters=state.futureLetters.slice().sort((a,b)=>a.openDate.localeCompare(b.openDate));
  return `<article class="card pad"><div class="card-head"><div><h2>未来信箱</h2><p>在指定日期自动公开</p></div><button class="btn outline" data-form="future"><i data-lucide="mail-plus"></i>写一封</button></div><div class="future-list">${letters.map(letter=>{
    const daysLeft=Math.ceil((dateFromLocal(letter.openDate)-dateFromLocal(today()))/86400000);
    const unlocked=daysLeft<=0;
    const canRead=letter.receiver==="shared"||letter.receiver===currentOwnerKey();
    const readable=unlocked&&canRead&&Boolean(letter.text);
    const status=!unlocked?`${daysLeft}天后`:!canRead?"仅收件人可打开":readable?"可以打开":"同步后打开";
    return `<div class="future-letter ${readable?"unlocked":""}"><i class="${unlocked?"green":"coral"}"><svg data-lucide="${unlocked?"mail-open":"mail"}"></svg></i><div><strong>${escapeHtml(letter.title)}</strong><p>${unlocked?`公开日期：${letter.openDate}`:`将在 ${letter.openDate} 公开`}</p></div><span>${status}</span>${readable?`<button class="btn outline small-btn" data-open-letter="${letter.id}">打开</button><button class="icon-btn compact" data-edit-letter="${letter.id}" title="编辑信件"><i data-lucide="pencil"></i></button>`:""}<button class="icon-btn compact danger-icon" data-delete-letter="${letter.id}" title="删除信件"><i data-lucide="trash-2"></i></button></div>`;
  }).join("")||'<div class="empty-inline">还没有写给未来的信。</div>'}</div></article>`;
}
function note(n){
  const replies=n.replies||[];
  const images=n.images||[];
  const gallery=images.length?`<div class="message-gallery ${images.length===1?"single":""}">${images.map((image,index)=>`<button type="button" data-lightbox="${escapeHtml(image.url||"")}" aria-label="查看第${index+1}张图片"><img src="${escapeHtml(image.thumbUrl||image.url||"")}" alt="留言附图"></button>`).join("")}</div>`:"";
  return `<article class="card note ${n.pinned?"pinned":""}"><div class="note-head"><i class="avatar ${ownerCls(n.author)}">${owner(n.author)}</i><div><strong>${owner(n.author)} 留言</strong><time>${dateTimeLabel(n.createdAt)||n.date}</time></div><div class="row-actions note-actions"><button class="icon-btn compact" data-edit-message="${n.id}" title="编辑留言"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-message="${n.id}" title="删除留言"><i data-lucide="trash-2"></i></button></div></div><div class="note-body">${escapeHtml(n.text)}</div>${gallery}${replies.length?`<div class="reply-list">${replies.map(reply=>`<div class="reply-item"><span class="avatar ${ownerCls(reply.author)}">${owner(reply.author)}</span><div class="reply-copy"><b>${owner(reply.author)}</b><p>${escapeHtml(reply.text)}</p><time>${dateTimeLabel(reply.createdAt)||reply.date}</time></div><div class="row-actions"><button class="icon-btn compact" data-edit-reply="${n.id}:${reply.id}" title="编辑回应"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-reply="${n.id}:${reply.id}" title="删除回应"><i data-lucide="trash-2"></i></button></div></div>`).join("")}</div>`:""}<div class="note-foot"><button class="reaction" data-like="${n.id}">♡ 喜欢 ${n.likes||0}</button><button class="reaction" data-reply="${n.id}"><i data-lucide="message-circle"></i> 回应${replies.length?` ${replies.length}`:""}</button></div></article>`;
}
function morePage(){
  const links=[
    {route:"health",icon:"moon-star",title:"健康作息",subtitle:"睡眠月报和作息回顾"},
    {route:"finance",icon:"wallet-cards",title:"生活记账",subtitle:"支出、预算和月度观察"},
    {route:"messages",icon:"messages-square",title:"留言与回忆",subtitle:"留言板、未来信箱和回忆册"},
    {account:true,icon:"circle-user-round",title:"账号与同步",subtitle:"登录、情侣空间和数据权限"}
  ];
  return `<section class="more-grid">${links.map(item=>`<button class="more-link" ${item.account?"data-account-open":`data-route="${item.route}"`}><i data-lucide="${item.icon}"></i><span><strong>${item.title}</strong><small>${item.subtitle}</small></span></button>`).join("")}</section>`;
}

const forms = {
  quote:{k:"首页设置",t:"设置首页名言",s:"保存名言",f:[
    ["quoteMode","更换方式","select","",["daily:每天自动更换","manual:使用自己的名言"],1],
    ["customQuote","自己的名言","textarea","写一句属于你们的话","",0,"full"]],
    submit:d=>{state.quoteMode=d.quoteMode;state.customQuote=d.customQuote.trim()||state.customQuote;save(d.quoteMode==="daily"?"已开启每日自动更换":"首页名言已保存")}},
  homePhoto:{k:"首页照片",t:"更换首页照片",s:"保存首页照片",f:[
    ["title","照片标题","text","例如：十一月的周末",state.homePhoto?.title||"",1],
    ["date","照片日期","date","",state.homePhoto?.date||today(),1],
    ["caption","地点或说明","text","例如：杭州 · 西湖边",state.homePhoto?.caption||"",0,"full"],
    ["photoFile","选择照片","file","选择 JPG、PNG 或 WebP","",0,"full"]],
    submit:async d=>{
      const input=document.querySelector('#record-form [name="photoFile"]');
      const media=(await resolveImages(preparedFiles.get(input)||[],"shared"))[0];
      delete d.photoFile;
      const current={...state.homePhoto,...d};
      if(media){
        current.id=`photo-${id()}`;
        Object.assign(current,{path:media.path,url:media.url,thumbPath:media.thumbPath,thumbUrl:media.thumbUrl});
        state.homePhotos=uniqueHomePhotos([current,...(state.homePhotos||[]),state.homePhoto]);
      }else{
        state.homePhotos=uniqueHomePhotos([current,...(state.homePhotos||[])]);
      }
      state.homePhoto=current;
      await persistNow("首页照片已更新");
    }},
  task:{k:"计划与待办",t:"新增一项计划",s:"保存计划",f:[
    ["title","标题","text","例如：预约周末摄影棚","",1],
    ["owner","负责人","select","",["shared:共同","a:月","b:亮"],1],["type","计划类型","select","",["日计划:日计划","月计划:月计划"],1],
    ["date","日期","date","",today(),1],
    ["priority","优先级","select","",["高:高","中:中","低:低"],1],["visibility","可见范围","select","",["shared:双方可见","private:仅自己"],1],
    ["note","备注","textarea","补充地点、准备事项或提醒方式","",0,"full"]],
    submit:d=>{
      const existing=state.tasks.find(item=>item.id===d.contextId);
      delete d.contextId;
      if(d.type==="月计划"&&d.date.length===7)d.date=`${d.date}-01`;
      if(existing)Object.assign(existing,d);
      else state.tasks.unshift({id:id(),...d,done:false,createdAt:timestamp(),completedAt:null});
      save(existing?"计划已修改":"计划已添加");
    }},
  wish:{k:"愿望墙",t:"许下一个新愿望",s:"收进愿望墙",f:[
    ["title","愿望名称","text","例如：一起去海边看日落","",1],["owner","提出人","select","",["a:月","b:亮","shared:共同"],1],
    ["date","预计时间","date","","2026-12-31",1],["budget","大致预算","number","0","",0],
    ["group","准备程度","select","",["ready:随时可以做","arrange:需要安排","long:长期愿望"],1],["visibility","可见范围","select","",["shared:双方可见","private:仅自己"],1],
    ["coverFile","封面图片","file","选择 JPG、PNG 或 WebP","",0,"full"]],
    submit:async d=>{const input=document.querySelector('#record-form [name="coverFile"]');const media=(await resolveImages(preparedFiles.get(input)||[],d.visibility))[0];const existing=state.wishes.find(item=>item.id===d.contextId);delete d.coverFile;delete d.contextId;d.budget=Number(d.budget||0);if(existing){Object.assign(existing,d);if(media)Object.assign(existing,{coverPath:media.path,cover:media.url,thumbPath:media.thumbPath,thumb:media.thumbUrl||media.url});save("愿望已修改")}else{const w={id:id(),...d,status:"刚刚许下",createdAt:timestamp(),coverPath:media?.path||null,cover:media?.url||"./assets/images/wish-default.jpg",thumbPath:media?.thumbPath||null,thumb:media?.thumbUrl||media?.url||""};state.wishes.unshift(w);state.selectedWish=w.id;save("愿望已收好")}}},
  goal:{k:"共同成长",t:"建立一个新目标",s:"建立目标",f:[
    ["title","目标名称","text","例如：一年一起读完 12 本书","",1],["category","栏目","select","",["阅读:阅读","健身:健身","摄影:摄影","演出:演出","自定义:自定义"],1],
    ["customCategory","自定义栏目名称","text","例如：烘焙、学琴、旅行","",0,"full custom-category-field"],
    ["owner","目标归属","select","",["shared:共同","a:月","b:亮"],1],
    ["target","目标数值","number","12","",1],["unit","单位","text","本、次、小时……","",1],
    ["start","开始日期","date","",today(),1],["end","结束日期","date","","2027-11-01",1]],
    submit:d=>{const existing=state.goals.find(item=>item.id===d.contextId);delete d.contextId;d.target=Number(d.target);d.customCategory=d.category==="自定义"?d.customCategory.trim():"";if(d.category==="自定义"&&!d.customCategory)throw new Error("请填写自定义栏目名称");if(existing){Object.assign(existing,d);save("目标已修改")}else{state.goals.push({id:id(),...d,current:0,tone:"green",records:[]});save("新目标已经建立")}}},
  progress:{k:"共同成长",t:"记录一次进展",s:"保存进展",f:[
    ["goalId","选择目标","select","",()=>state.goals.map(g=>`${g.id}:${g.title}`),1],["date","完成日期","date","",today(),1],
    ["amount","本次完成","number","例如：1","",1],["note","进展备注","textarea","例如：读完第三章，共 50 页","",0,"full"],
    ["imageFiles","进展照片","files","可一次选择多张图片","",0,"full"]],
    submit:async d=>{
      const input=document.querySelector('#record-form [name="imageFiles"]');
      const images=await resolveImages(preparedFiles.get(input)||[],state.goals.find(item=>item.id===d.goalId)?.visibility||"shared");
      const goal=state.goals.find(item=>item.id===d.goalId);
      if(!goal)return;
      const existing=goal.records.find(item=>item.id===d.contextId);
      const amount=Number(d.amount);
      delete d.contextId;delete d.imageFiles;
      if(existing){
        goal.current=Math.max(0,goal.current-Number(existing.amount)+amount);
        Object.assign(existing,{date:d.date,amount,note:d.note});
        if(images.length)existing.images=[...(existing.images||[]),...images];
        save("进展已修改");
      }else{
        goal.current=Math.min(goal.target,goal.current+amount);
        goal.records.push({id:id(),date:d.date,createdAt:timestamp(),amount,note:d.note,images});
        save("进展已记录");
      }
    }},
  expense:{k:"生活记账",t:"记录月度支出",s:"保存支出",f:[
    ["month","记录月份","month","",financeMonth,1],["amount","月度金额","number","0.00","",1],
    ["category","分类","select","",["餐饮:餐饮","交通:交通","购物:购物","生活:生活","旅行:旅行","娱乐:娱乐","爱好:爱好","健康:健康","其他:其他"],1],
    ["scope","支出范围","select","",["共同支出:共同支出","个人支出:个人支出"],1],
    ["owner","记录人","select","",["a:月","b:亮"],1],["note","备注","text","例如：本月餐饮汇总","",0,"full"]],
    submit:d=>{
      const existing=state.expenses.find(item=>item.id===d.contextId);
      delete d.contextId;d.amount=Number(d.amount);
      if(existing)Object.assign(existing,d);
      else state.expenses.push({id:id(),...d,createdAt:timestamp()});
      financeMonth=d.month;financeAnnual=false;
      save(existing?"月度支出已修改":"月度支出已记录");
    }},
  budget:{k:"生活记账",t:"设置共同预算",s:"保存预算",f:[
    ["month","预算月份","month","",financeMonth,1],
    ["amount","共同预算金额","number","例如：5000",state.financeBudgets?.[financeMonth]||"",1]],
    submit:async d=>{state.financeBudgets[d.month]=Number(d.amount);financeMonth=d.month;financeAnnual=false;await persistNow("共同预算已保存")}},
  message:{k:"共享留言板",t:"给对方留句话",s:"发布留言",f:[
    ["author","留言人","select","",["a:月","b:亮"],1],["pinned","是否置顶","select","",["false:普通留言","true:固定在顶部"],1],
    ["visibility","可见范围","select","",["shared:双方可见","private:仅自己"],1],
    ["text","留言内容","textarea","写下一句值得以后再看的话","",1,"full"],["imageFiles","附加图片","files","可一次选择多张图片","",0,"full"]],
    submit:async d=>{const input=document.querySelector('#record-form [name="imageFiles"]');const images=await resolveImages(preparedFiles.get(input)||[],d.visibility);const existing=state.messages.find(item=>item.id===d.contextId);delete d.imageFiles;delete d.contextId;if(existing){Object.assign(existing,d,{pinned:d.pinned==="true"});if(images.length)existing.images=[...(existing.images||[]),...images];await persistNow("留言已修改")}else{const createdAt=timestamp();state.messages.unshift({id:id(),...d,images,pinned:d.pinned==="true",createdAt,date:dateTimeLabel(createdAt),likes:0,replies:[]});await persistNow("留言已发布")}}},
  reply:{k:"留言回应",t:"回应这条留言",s:"发布回应",f:[
    ["author","回应人","select","",["a:月","b:亮"],1],
    ["text","回应内容","textarea","写一句简短回应","",1,"full"]],
    submit:async d=>{const message=state.messages.find(item=>item.id===d.messageId);if(message){message.replies=message.replies||[];const existing=message.replies.find(reply=>reply.id===d.contextId);if(existing)Object.assign(existing,{author:d.author,text:d.text});else{const createdAt=timestamp();message.replies.push({id:id(),author:d.author,text:d.text,createdAt,date:dateTimeLabel(createdAt)})}}await persistNow("回应已保存")}},
  sleep:{k:"健康作息",t:"填写睡眠月报",s:"保存月报",f:[
    ["month","记录月份","month","","",1],["bedtime","日均入睡时间","time","","",1],
    ["wake","日均醒来时间","time","","",1],["duration","日均睡眠时长","number","小时","",1],
    ["nap","日均零星小睡","number","小时","",0],["quality","自评睡眠质量","select","",[":请选择","很好:很好","良好:良好","一般:一般","较差:较差"],1],
    ["energy","这个月精神状态如何","textarea","例如：整体稳定，月底稍有疲惫","",0,"full"],
    ["note","本月影响作息的事情","textarea","例如：出差、加班、旅行","",0,"full"],["next","下个月准备调整什么","textarea","写一个容易做到的小改变","",0,"full"]],
    submit:d=>{
      const report={...d,duration:Number(d.duration),nap:Number(d.nap||0)};
      state.sleepReports=state.sleepReports||[];
      const existing=state.sleepReports.find(item=>item.month===report.month);
      if(existing)Object.assign(existing,report);
      else state.sleepReports.push(report);
      state.sleep=report;
      healthMonth=report.month;
      save(existing?"睡眠月报已修改":"睡眠月报已保存");
    }},
  intimacy:{k:"亲密日历",t:"记下这一天",s:"留下小心心",f:[
    ["date","纪念日期","date","",today(),1],
    ["note","一句悄悄话","textarea","可以不写，只有你们两个人能看到","",0,"full"]],
    submit:async d=>{
      const existing=state.intimacy.find(item=>item.id===d.contextId)||state.intimacy.find(item=>item.date===d.date);
      if(existing&&existing.date!==d.date){
        await window.CloudStore?.deleteRecord("intimacy",existing.id);
        existing.id=`intimacy:${d.date}`;
        existing.creatorId=window.CloudStore?.status().user?.id||existing.creatorId;
      }
      if(existing){
        existing.date=d.date;existing.note=d.note;existing.visibility="shared";
      }else{
        state.intimacy.push({id:`intimacy:${d.date}`,date:d.date,note:d.note,visibility:"shared"});
      }
      intimacyMonth=d.date.slice(0,7);
      animateHeartDate=d.date;
      await persistNow("已经留下这颗心");
    }},
  future:{k:"未来信箱",t:"写一封未来的信",s:"封存这封信",f:[
    ["title","信件标题","text","例如：写给下一个纪念日","",1],
    ["author","写信人","select","",["a:月","b:亮"],1],["receiver","收件人","select","",["a:月","b:亮","shared:我们两个人"],1],
    ["openDate","公开日期","date","",localDateString(addDays(new Date(),30)),1],
    ["text","信件内容","textarea","到那一天，想让对方读到什么？","",1,"full"]],
    submit:async d=>{
      const existing=state.futureLetters.find(item=>item.id===d.contextId);
      delete d.contextId;
      if(existing){
        const updated={...existing,...d};
        const saved=window.CloudStore?.status().ready
          ?await window.CloudStore.updateFutureLetter(updated)
          :updated;
        Object.assign(existing,saved);
        toast("未来信件已修改");
      }else{
        const letter={id:id(),...d,createdAt:timestamp(),visibility:"shared"};
        const saved=window.CloudStore?.status().ready&&window.CloudStore.saveFutureLetter
          ?await window.CloudStore.saveFutureLetter(letter)
          :letter;
        state.futureLetters.push(saved);
        toast("信件已封存，到指定日期且由收件人登录后才能打开");
      }
      storeLocalState();
    }}
};

function openForm(type,preset={}){
  const cfg=forms[type];if(!cfg)return;
  const editingTask=type==="task"&&Boolean(preset.contextId);
  document.querySelector("#form-kicker").textContent=cfg.k;
  document.querySelector("#form-title").textContent=editingTask?"修改计划":cfg.t;
  document.querySelector("#form-submit").textContent=editingTask?"保存修改":cfg.s;
  document.querySelector("#form-fields").innerHTML=cfg.f.map(f=>field(f,preset)).join("");
  document.querySelector("#record-form").dataset.type=type;
  document.querySelector("#record-form").dataset.contextId=preset.contextId||"";
  document.querySelector("#record-form").dataset.messageId=preset.messageId||"";
  const deleteButton=document.querySelector("#form-delete");
  deleteButton.hidden=!editingTask;
  deleteButton.dataset.taskId=editingTask?preset.contextId:"";
  document.querySelector("#form-dialog").showModal();
  if(type==="goal")syncCustomCategoryField();
  if(type==="task")syncTaskDateField();
  icons();
}
function field(f,preset){
  const [name,label,type,placeholder,raw,required,layout]=f;
  const value=preset[name]??((Array.isArray(raw)||typeof raw==="function")?"":raw||"");
  const opts=typeof raw==="function"?raw():raw;
  let control;
  if(type==="select") control=`<select name="${name}" ${required?"required":""}>${opts.map(o=>{const cut=o.indexOf(":"),v=o.slice(0,cut),l=o.slice(cut+1);return `<option value="${v}" ${String(value)===v?"selected":""}>${l}</option>`}).join("")}</select>`;
  else if(type==="textarea")control=`<textarea name="${name}" placeholder="${placeholder}" ${required?"required":""}>${value}</textarea>`;
  else if(type==="file")control=`<input name="${name}" type="file" accept="image/jpeg,image/png,image/webp" ${required?"required":""}><div class="image-previews" data-preview-for="${name}"></div>`;
  else if(type==="files")control=`<input name="${name}" type="file" accept="image/jpeg,image/png,image/webp" multiple ${required?"required":""}><div class="image-previews" data-preview-for="${name}"></div>`;
  else control=`<input name="${name}" type="${type}" placeholder="${placeholder}" value="${value}" ${type==="number"?'step="0.1"':""} ${required?"required":""}>`;
  return `<label class="field ${layout||""}"><span>${label}</span>${control}</label>`;
}
function syncCustomCategoryField(){
  const form=document.querySelector("#record-form");
  const category=form?.querySelector('[name="category"]');
  const field=form?.querySelector(".custom-category-field");
  if(!category||!field)return;
  const show=category.value==="自定义";
  field.hidden=!show;
  const input=field.querySelector("input");
  if(input)input.required=show;
}
function syncTaskDateField(){
  const form=document.querySelector("#record-form");
  const type=form?.querySelector('[name="type"]');
  const dateInput=form?.querySelector('[name="date"]');
  if(!type||!dateInput)return;
  const monthly=type.value==="月计划";
  const current=String(dateInput.value||today());
  dateInput.type=monthly?"month":"date";
  dateInput.value=monthly?current.slice(0,7):(current.length===7?`${current}-01`:current);
  dateInput.closest(".field")?.querySelector("span")?.replaceChildren(document.createTextNode(monthly?"月份":"日期"));
}

function openAccountDialog(){
  const dialog=document.querySelector("#account-dialog");
  const content=document.querySelector("#account-content");
  const status=window.CloudStore?.status()||cloudStatus;
  document.querySelector("#account-title").textContent="情侣空间";

  if(!status.configured){
    const isCloudBase=status.provider==="cloudbase";
    content.innerHTML=`<div class="account-section"><div class="setup-banner"><i data-lucide="database"></i><div><strong>尚未配置${isCloudBase?"腾讯云":"Supabase"}</strong><p>请按照本版本的部署说明填写 <code>config.js</code>。完成后即可使用后台预设的月、亮两个私人账号，在手机和电脑上登录同步。</p></div></div><div class="privacy-panel"><h3>正式版数据放在哪里？</h3><p>账号和生活记录保存在你的${isCloudBase?"腾讯云 CloudBase":"Supabase"}数据库；头像和生活图片保存在私有对象存储；浏览器只保留必要的离线缓存。</p></div></div>`;
  }else if(!status.signedIn){
    const cloudbase=status.provider==="cloudbase";
    const usernamePattern=cloudbase?"[A-Za-z][A-Za-z0-9_-]{2,23}":"[A-Za-z0-9_]{3,24}";
    content.innerHTML=`<form id="auth-form" class="account-form"><label>用户名<input name="username" pattern="${usernamePattern}" placeholder="用户名" autocomplete="username" required></label><label>密码<input name="password" type="password" minlength="8" autocomplete="current-password" required></label><button class="btn primary" type="submit">登录</button><p class="form-note">私人空间不开放注册。</p></form>`;
  }else if(!status.membership){
    content.innerHTML=`<div class="account-section">${profileSummary(status)}${profileForm(status)}<div class="space-actions"><form id="create-space-form" class="account-form"><h3>创建情侣空间</h3><label>空间名称<input name="name" value="我们的生活空间" required></label><label>在一起的日期<input name="togetherSince" type="date" value="${state.togetherSince}"></label><button class="btn primary" type="submit">创建并生成邀请码</button></form><form id="join-space-form" class="account-form"><h3>加入对方的空间</h3><label>邀请码<input name="code" placeholder="8位邀请码" maxlength="12" required></label><button class="btn outline" type="submit">加入空间</button></form></div><button class="btn ghost" type="button" data-account-action="refresh-space"><i data-lucide="refresh-cw"></i>我已经创建过，重新读取已有空间</button><button class="text-button" data-account-action="logout">退出登录</button></div>`;
  }else{
    content.innerHTML=`<div class="account-section">${profileSummary(status,true)}${profileForm(status)}<div class="invite-card"><span>邀请对方加入</span><strong>${status.space?.invite_code||"已加入"}</strong><button class="icon-btn" data-copy-invite="${status.space?.invite_code||""}" title="复制邀请码"><i data-lucide="copy"></i></button></div><div class="privacy-panel"><h3>隐私默认值</h3><p>共同计划、愿望和留言双方可见；个人支出和睡眠记录默认仅本人可见。亲密日历不会出现在首页、动态或年度报告。</p></div><div class="backup-panel"><div><h3>本地备份与服务器迁移</h3><p>导出的文件包含生活记录和已上传图片，不包含账号密码。可导入 Supabase 或腾讯云版本。</p></div><div class="backup-actions"><button class="btn outline" type="button" data-account-action="export-backup"><i data-lucide="download"></i>导出完整备份</button><label class="btn ghost import-button"><i data-lucide="upload"></i>导入备份<input id="backup-file" type="file" accept=".json,.couple-backup.json,application/json"></label></div></div><button class="btn outline" data-account-action="sync"><i data-lucide="refresh-cw"></i>立即同步</button><button class="text-button" data-account-action="logout">退出登录</button></div>`;
  }
  if(!dialog.open)dialog.showModal();
  icons();
}

function profileSummary(status,showSpace=false){
  const profile=status.profile||{};
  const avatar=profile.avatar_url?`<img class="profile-avatar" src="${profile.avatar_url}" alt="头像">`:`<span class="profile-avatar placeholder">${escapeHtml((profile.display_name||profile.username||"我").slice(0,1))}</span>`;
  const subtitle=showSpace?`${escapeHtml(profile.username||"")} · ${status.membership.role==="owner"?"创建者":"成员"}`:"账号已登录，还没有加入情侣空间。";
  const title=showSpace?(status.space?.name||"情侣空间"):(profile.display_name||profile.username||"我的账号");
  return `<div class="signed-user">${avatar}<div><strong>${escapeHtml(title)}</strong><p>${subtitle}</p></div></div>`;
}

function profileForm(status){
  return `<form id="profile-form" class="account-form profile-form"><h3>个人资料</h3><label>昵称<input name="displayName" value="${escapeHtml(status.profile?.display_name||"")}" required></label><label>更换头像<input name="avatarFile" type="file" accept="image/jpeg,image/png,image/webp"><div class="image-previews" data-preview-for="avatarFile"></div></label><button class="btn outline" type="submit">保存昵称和头像</button></form>`;
}

function openIntimacyDetail(record){
  activeIntimacyId=record.id;
  document.querySelector("#intimacy-detail-date").textContent=record.date;
  document.querySelector("#intimacy-detail-note").textContent=record.note?.trim()||"这一天只留下了一颗小心心。";
  document.querySelector("#intimacy-detail-dialog").showModal();
}
function openLightbox(url){
  const image=document.querySelector("#lightbox-image");
  image.src=url;
  document.querySelector("#lightbox-dialog").showModal();
}
function openHomeAlbum(){
  const currentKey=photoKey(state.homePhoto||{});
  const photos=uniqueHomePhotos([state.homePhoto,...(state.homePhotos||[])]);
  document.querySelector("#home-album-grid").innerHTML=photos.map(photo=>{
    const current=photoKey(photo)===currentKey;
    return `<article class="album-photo ${current?"is-cover":""}"><button class="album-image" type="button" data-home-photo-view="${escapeHtml(photo.url||"")}" aria-label="查看大图"><img src="${escapeHtml(photo.thumbUrl||photo.url||"")}" alt="${escapeHtml(photo.title||"共同照片")}"></button><div class="album-photo-meta"><strong>${escapeHtml(photo.title||"共同照片")}</strong><small>${escapeHtml(photo.date||"")} · ${escapeHtml(photo.caption||"")}</small><div class="row-actions"><button class="btn outline small-btn" data-home-set-cover="${escapeHtml(photoKey(photo))}" ${current?"disabled":""}>${current?"当前封面":"设为封面"}</button><button class="icon-btn compact danger-icon" data-home-delete-photo="${escapeHtml(photoKey(photo))}" title="从相册删除"><i data-lucide="trash-2"></i></button></div></div></article>`;
  }).join("")||'<div class="empty-inline">相册还没有照片。</div>';
  const dialog=document.querySelector("#home-album-dialog");
  if(!dialog.open)dialog.showModal();
  icons();
}
function openGoalDetails(goalId){
  const goal=state.goals.find(item=>item.id===goalId);
  if(!goal)return;
  document.querySelector("#goal-detail-title").textContent=goal.title;
  const records=goal.records.slice().sort((a,b)=>
    (b.date||"").localeCompare(a.date||"")||(b.createdAt||"").localeCompare(a.createdAt||"")
  );
  document.querySelector("#goal-detail-content").innerHTML=records.map(record=>{
    const gallery=(record.images||[]).length
      ?`<div class="progress-images">${record.images.map((image,index)=>`<button type="button" data-lightbox="${escapeHtml(image.url||"")}" aria-label="查看进展照片 ${index+1}"><img src="${escapeHtml(image.thumbUrl||image.url||"")}" alt="进展照片"></button>`).join("")}</div>`
      :"";
    return `<article class="goal-progress-row"><time>${escapeHtml(record.date||"")}</time><div class="goal-progress-copy"><strong>完成 ${record.amount}${escapeHtml(goal.unit)}</strong>${record.note?`<p>${escapeHtml(record.note)}</p>`:""}${gallery}</div><div class="row-actions"><button class="icon-btn compact" data-edit-progress="${goal.id}:${record.id}" title="编辑进展"><i data-lucide="pencil"></i></button><button class="icon-btn compact danger-icon" data-delete-progress="${goal.id}:${record.id}" title="撤销进展"><i data-lucide="trash-2"></i></button></div></article>`;
  }).join("")||'<div class="empty-inline">这个目标还没有进展记录。</div>';
  document.querySelector("#goal-detail-add").dataset.goalId=goal.id;
  const dialog=document.querySelector("#goal-detail-dialog");
  if(!dialog.open)dialog.showModal();
  icons();
}
function openLetter(letter){
  if(letter.openDate>today())return toast("还没有到这封信的公开日期");
  if(letter.receiver!=="shared"&&letter.receiver!==currentOwnerKey())return toast("这封信只对收件人公开");
  document.querySelector("#letter-title").textContent=letter.title;
  document.querySelector("#letter-meta").textContent=`${owner(letter.author)} 写于 ${dateTimeLabel(letter.createdAt)} · ${letter.openDate} 公开`;
  document.querySelector("#letter-text").textContent=letter.text;
  document.querySelector("#letter-dialog").showModal();
}

document.querySelector("#account-dialog").addEventListener("click",async e=>{
  const copy=e.target.closest("[data-copy-invite]");
  if(copy){
    await navigator.clipboard.writeText(copy.dataset.copyInvite);
    toast("邀请码已复制");
    return;
  }
  const action=e.target.closest("[data-account-action]");
  if(!action)return;
  if(action.dataset.accountAction==="logout"){
    await window.CloudStore.signOut();
    cloudStatus=window.CloudStore.status();
    localStorage.removeItem(KEY);
    state=freshCloudState();
    document.querySelector("#account-dialog").close();
    syncAuthGate();
    render();
    syncSpaceStatus();
    toast("已退出登录");
  }
  if(action.dataset.accountAction==="refresh-space"){
    try{
      await window.CloudStore.refresh();
      cloudStatus=window.CloudStore.status();
      openAccountDialog();
      syncSpaceStatus();
      toast(cloudStatus.membership?"已恢复情侣空间和邀请码":"没有读取到已有空间，请运行数据库修复脚本");
    }catch(error){toast(authErrorMessage(error))}
  }
  if(action.dataset.accountAction==="sync"){await pullCloud(true);document.querySelector("#account-dialog").close()}
  if(action.dataset.accountAction==="export-backup"){
    action.disabled=true;
    try{await exportBackup()}catch(error){toast(`备份失败：${error.message}`)}
    finally{action.disabled=false}
  }
});

document.querySelector("#account-dialog").addEventListener("submit",async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.target).entries());
  try{
    if(e.target.id==="auth-form"){
      await window.CloudStore.signIn(data.username,data.password);
      toast("登录成功");
    }
    if(e.target.id==="profile-form"){
      const input=e.target.querySelector('[name="avatarFile"]');
      const prepared=preparedFiles.get(input)?.[0];
      await window.CloudStore.updateProfile(data.displayName,prepared?.file||data.avatarFile);
      toast("昵称和头像已保存");
    }
    if(e.target.id==="create-space-form"){
      await window.CloudStore.createSpace(data.name,data.togetherSince);
      state=freshCloudState(data.togetherSince);
      await window.CloudStore.saveState(state);
      storeLocalState();
      toast("情侣空间已创建，可以复制邀请码给对方");
    }
    if(e.target.id==="join-space-form"){
      await window.CloudStore.joinSpace(data.code);
      await pullCloud(false);
      toast("已加入情侣空间");
    }
    cloudStatus=window.CloudStore.status();openAccountDialog();syncSpaceStatus();
  }catch(error){toast(authErrorMessage(error))}
});

document.querySelector("#login-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const submit=form.querySelector('[type="submit"]');
  const feedback=document.querySelector("#login-feedback");
  const data=Object.fromEntries(new FormData(form).entries());
  submit.disabled=true;
  submit.textContent="正在登录";
  feedback.textContent="";
  try{
    await window.CloudStore.signIn(data.username,data.password);
    cloudStatus=window.CloudStore.status();
    syncAuthGate();
    if(cloudStatus.ready)await pullCloud(false);
    else render();
    form.reset();
    toast("登录成功");
  }catch(error){
    feedback.textContent=authErrorMessage(error);
  }finally{
    if(document.body.classList.contains("auth-locked")){
      submit.disabled=false;
      submit.textContent="登录";
    }
  }
});

document.addEventListener("change",async e=>{
  if(e.target.matches('#record-form [name="category"]')){syncCustomCategoryField();return}
  if(e.target.matches('#record-form [name="type"]')){syncTaskDateField();return}
  const input=e.target.closest('input[type="file"]');
  if(!input)return;
  if(input.id==="backup-file"){
    const file=input.files?.[0];
    if(!file)return;
    if(!confirm("导入会把备份内容写入当前情侣空间。确定继续吗？")){input.value="";return}
    input.disabled=true;
    try{
      await importBackup(file);
      document.querySelector("#account-dialog").close();
    }catch(error){toast(`导入失败：${error.message}`)}
    finally{input.disabled=false;input.value=""}
    return;
  }
  if(!input.accept?.includes("image/"))return;
  const submit=input.closest("form")?.querySelector('[type="submit"]');
  if(submit)submit.disabled=true;
  try{
    const items=[];
    for(const file of [...(input.files||[])])items.push(await prepareImage(file));
    preparedFiles.set(input,items);
    renderImagePreviews(input,items);
  }catch(error){
    preparedFiles.delete(input);
    input.value="";
    renderImagePreviews(input,[]);
    toast(error.message);
  }finally{
    if(submit)submit.disabled=false;
  }
});

document.addEventListener("click",async e=>{
  const homeTarget=e.target.closest("[data-home-target]");
  if(homeTarget){
    const target=homeTarget.dataset.homeTarget;
    if(target==="plans-week"){route="plans";planView="week";planWeekStart=startOfWeek(new Date())}
    if(target==="plans-month"){route="plans";planView="month";planMonth=today().slice(0,7)}
    if(target==="wishes")route="wishes";
    if(target==="growth")route="growth";
    if(target==="health"){route="health";healthMonth=shiftMonth(today().slice(0,7),-1)}
    if(target==="health-current"){route="health";healthMonth=today().slice(0,7)}
    if(target==="finance-previous"){route="finance";financeAnnual=false;financeMonth=shiftMonth(today().slice(0,7),-1)}
    if(target==="finance-current"){route="finance";financeAnnual=false;financeMonth=today().slice(0,7)}
    render();scrollTo({top:0,behavior:"smooth"});return
  }
  const r=e.target.closest("[data-route]");if(r){route=r.dataset.route;render();scrollTo({top:0,behavior:"smooth"});return}
  if(e.target.closest("[data-home-album]")){openHomeAlbum();return}
  if(e.target.closest('[data-action="quick"]')){document.querySelector("#quick-dialog").showModal();return}
  if(e.target.closest(".close-dialog")){e.target.closest("dialog").close();return}
  if(e.target.closest("[data-quote-settings]")){openForm("quote",{quoteMode:state.quoteMode,customQuote:state.customQuote});return}
  const f=e.target.closest("[data-form]");if(f){
    e.target.closest("dialog")?.close();
    let preset={};
    if(f.dataset.form==="sleep"){
      preset=f.dataset.sleepMode==="edit"
        ?{...blankSleepReport(healthMonth),...(sleepReportFor(healthMonth)||{})}
        :blankSleepReport(healthMonth);
    }
    if(f.dataset.form==="homePhoto")preset=state.homePhoto;
    if(f.dataset.form==="budget"){
      const month=f.dataset.budgetMonth||financeMonth;
      preset={month,amount:state.financeBudgets?.[month]||""};
    }
    openForm(f.dataset.form,preset);
    return
  }
  const t=e.target.closest("[data-task]");if(t){const item=state.tasks.find(x=>x.id===t.dataset.task);if(!item)return;item.done=!item.done;item.completedAt=item.done?timestamp():null;save(item.done?"完成了一件事":"计划已恢复");render();return}
  const editTask=e.target.closest("[data-edit-task]");if(editTask){const item=state.tasks.find(x=>x.id===editTask.dataset.editTask);if(item)openForm("task",{...item,contextId:item.id});return}
  const formDelete=e.target.closest("#form-delete");if(formDelete){
    const item=state.tasks.find(x=>x.id===formDelete.dataset.taskId);if(!item)return;
    if(!confirm(`确定删除计划“${item.title}”吗？`))return;
    formDelete.disabled=true;
    try{
      await window.CloudStore?.deleteRecord("task",item.id);
      state.tasks=state.tasks.filter(x=>x.id!==item.id);
      document.querySelector("#form-dialog").close();
      save("计划已删除");render();
    }catch(error){toast(`删除失败：${error.message}`)}
    finally{formDelete.disabled=false}
    return
  }
  const deleteTask=e.target.closest("[data-delete-task]");if(deleteTask){
    const item=state.tasks.find(x=>x.id===deleteTask.dataset.deleteTask);if(!item)return;
    if(!confirm(`确定删除计划“${item.title}”吗？`))return;
    await window.CloudStore?.deleteRecord("task",item.id);
    state.tasks=state.tasks.filter(x=>x.id!==item.id);save("计划已删除");render();return
  }
  const pv=e.target.closest("[data-plan-view]");if(pv){planView=pv.dataset.planView;render();return}
  const monthJump=e.target.closest("[data-plan-month-jump]");if(monthJump){planMonth=monthJump.dataset.planMonthJump;planView="month";render();scrollTo({top:0,behavior:"smooth"});return}
  const pf=e.target.closest("[data-plan-filter]");if(pf){planFilter=pf.dataset.planFilter;render();return}
  const planShift=e.target.closest("[data-plan-shift]");if(planShift){
    const amount=Number(planShift.dataset.planShift);
    const unit=planShift.dataset.planUnit;
    if(unit==="week")planWeekStart=addDays(planWeekStart,amount*7);
    if(unit==="month")planMonth=shiftMonth(planMonth,amount);
    if(unit==="year")planYear+=amount;
    render();return
  }
  const planCurrent=e.target.closest("[data-plan-current]");if(planCurrent){
    if(planCurrent.dataset.planCurrent==="week")planWeekStart=startOfWeek(new Date());
    if(planCurrent.dataset.planCurrent==="month")planMonth=today().slice(0,7);
    if(planCurrent.dataset.planCurrent==="year")planYear=new Date().getFullYear();
    render();return
  }
  const ganttShift=e.target.closest("[data-gantt-shift]");if(ganttShift){ganttYear+=Number(ganttShift.dataset.ganttShift);render();return}
  const healthShift=e.target.closest("[data-health-month]");if(healthShift){healthMonth=shiftMonth(healthMonth,Number(healthShift.dataset.healthMonth));render();return}
  if(e.target.closest("[data-health-today]")){healthMonth=today().slice(0,7);render();return}
  const w=e.target.closest("[data-wish]");if(w){state.selectedWish=w.dataset.wish;save();render();scrollTo({top:0,behavior:"smooth"});return}
  const editWish=e.target.closest("[data-edit-wish]");if(editWish){const item=state.wishes.find(x=>x.id===editWish.dataset.editWish);if(item)openForm("wish",{...item,contextId:item.id});return}
  const deleteWish=e.target.closest("[data-delete-wish]");if(deleteWish){
    const item=state.wishes.find(x=>x.id===deleteWish.dataset.deleteWish);if(!item)return;
    if(!confirm(`确定删除愿望“${item.title}”吗？`))return;
    deleteWish.disabled=true;
    try{
      await window.CloudStore?.deleteRecord("wish",item.id);
      await window.CloudStore?.deleteMedia([item.coverPath,item.thumbPath]);
      state.wishes=state.wishes.filter(x=>x.id!==item.id);
      if(state.selectedWish===item.id)state.selectedWish=state.wishes[0]?.id||null;
      save("愿望已删除");render();
    }catch(error){toast(`删除失败：${error.message}`)}
    finally{deleteWish.disabled=false}
    return
  }
  const wishFilterButton=e.target.closest("[data-wish-filter]");if(wishFilterButton){wishFilter=wishFilterButton.dataset.wishFilter;render();return}
  const goalFilterButton=e.target.closest("[data-goal-filter]");if(goalFilterButton){goalFilter=goalFilterButton.dataset.goalFilter;render();return}
  const messageFilterButton=e.target.closest("[data-message-filter]");if(messageFilterButton){messageFilter=messageFilterButton.dataset.messageFilter;render();return}
  const toggleWish=e.target.closest("[data-toggle-wish]");if(toggleWish){
    const item=state.wishes.find(x=>x.id===toggleWish.dataset.toggleWish);if(!item)return;
    if(item.status==="已完成"){
      item.status=item.previousStatus||"刚刚许下";item.group=item.previousGroup||"ready";item.completedAt=null;
      save("已经取消实现愿望");
    }else{
      item.previousStatus=item.status;item.previousGroup=item.group;item.status="已完成";item.group="done";item.completedAt=timestamp();
      save("愿望已实现，已经进入回忆时间轴");
    }
    render();return
  }
  const plan=e.target.closest("[data-plan-wish]");if(plan){const item=state.wishes.find(x=>x.id===plan.dataset.planWish);item.status="已列入计划";state.tasks.unshift({id:id(),title:item.title,date:item.date,owner:item.owner,type:"愿望计划",priority:"中",visibility:"shared",done:false,createdAt:timestamp(),completedAt:null});save("愿望已经加入计划");render();return}
  const p=e.target.closest("[data-progress]");if(p){openForm("progress",{goalId:p.dataset.progress});return}
  const goalDetails=e.target.closest("[data-goal-details]");if(goalDetails){openGoalDetails(goalDetails.dataset.goalDetails);return}
  const goalDetailAdd=e.target.closest("#goal-detail-add");if(goalDetailAdd){
    document.querySelector("#goal-detail-dialog").close();
    openForm("progress",{goalId:goalDetailAdd.dataset.goalId});return
  }
  const editGoal=e.target.closest("[data-edit-goal]");if(editGoal){const item=state.goals.find(x=>x.id===editGoal.dataset.editGoal);if(item)openForm("goal",{...item,contextId:item.id});return}
  const deleteGoal=e.target.closest("[data-delete-goal]");if(deleteGoal){
    const item=state.goals.find(x=>x.id===deleteGoal.dataset.deleteGoal);if(!item)return;
    if(!confirm(`确定删除目标“${item.title}”及其全部进展吗？`))return;
    await window.CloudStore?.deleteRecord("goal",item.id);
    state.goals=state.goals.filter(x=>x.id!==item.id);save("目标及其进展已删除");render();return
  }
  const editProgress=e.target.closest("[data-edit-progress]");if(editProgress){
    const [goalId,recordId]=editProgress.dataset.editProgress.split(":");
    const goal=state.goals.find(item=>item.id===goalId);const record=goal?.records.find(item=>item.id===recordId);
    if(goal&&record)openForm("progress",{goalId,contextId:record.id,...record});return
  }
  const deleteProgress=e.target.closest("[data-delete-progress]");if(deleteProgress){
    const [goalId,recordId]=deleteProgress.dataset.deleteProgress.split(":");
    const goal=state.goals.find(item=>item.id===goalId);const record=goal?.records.find(item=>item.id===recordId);
    if(!goal||!record)return;
    if(!confirm(`确定撤销“${goal.title}”的这条进展（+${record.amount}${goal.unit}）吗？`))return;
    await window.CloudStore?.deleteMedia((record.images||[]).flatMap(image=>[image.path,image.thumbPath]));
    goal.records=goal.records.filter(item=>item.id!==record.id);
    goal.current=Math.max(0,goal.current-Number(record.amount));
    save("这条进展已撤销");render();return
  }
  const like=e.target.closest("[data-like]");if(like){
    const message=state.messages.find(x=>x.id===like.dataset.like);
    if(!message)return;
    message.likes=(message.likes||0)+1;
    await persistNow();
    render();
    return
  }
  const reply=e.target.closest("[data-reply]");if(reply){openForm("reply",{messageId:reply.dataset.reply});return}
  const editMessage=e.target.closest("[data-edit-message]");if(editMessage){const item=state.messages.find(x=>x.id===editMessage.dataset.editMessage);if(item)openForm("message",{...item,contextId:item.id});return}
  const deleteMessage=e.target.closest("[data-delete-message]");if(deleteMessage){
    const item=state.messages.find(x=>x.id===deleteMessage.dataset.deleteMessage);if(!item)return;
    if(!confirm("确定删除这条留言及其回应和图片吗？"))return;
    await window.CloudStore?.deleteRecord("message",item.id);
    await window.CloudStore?.deleteMedia((item.images||[]).flatMap(image=>[image.path,image.thumbPath]));
    state.messages=state.messages.filter(x=>x.id!==item.id);await persistNow("留言已删除");render();return
  }
  const editReply=e.target.closest("[data-edit-reply]");if(editReply){
    const [messageId,replyId]=editReply.dataset.editReply.split(":");
    const message=state.messages.find(item=>item.id===messageId);const reply=message?.replies?.find(item=>item.id===replyId);
    if(message&&reply)openForm("reply",{...reply,contextId:reply.id,messageId});return
  }
  const deleteReply=e.target.closest("[data-delete-reply]");if(deleteReply){
    const [messageId,replyId]=deleteReply.dataset.deleteReply.split(":");
    const message=state.messages.find(item=>item.id===messageId);if(!message)return;
    if(!confirm("确定删除这条回应吗？"))return;
    message.replies=(message.replies||[]).filter(item=>item.id!==replyId);await persistNow("回应已删除");render();return
  }
  const editLetter=e.target.closest("[data-edit-letter]");if(editLetter){
    const letter=state.futureLetters.find(item=>item.id===editLetter.dataset.editLetter);
    if(letter)openForm("future",{...letter,contextId:letter.id});return
  }
  const deleteLetter=e.target.closest("[data-delete-letter]");if(deleteLetter){
    const letter=state.futureLetters.find(item=>item.id===deleteLetter.dataset.deleteLetter);if(!letter)return;
    if(!confirm(`确定删除未来信件“${letter.title}”吗？`))return;
    const button=deleteLetter;button.disabled=true;
    try{
      if(window.CloudStore?.status().ready)await window.CloudStore.deleteFutureLetter(letter.id);
      state.futureLetters=state.futureLetters.filter(item=>item.id!==letter.id);
      storeLocalState();render();toast("未来信件已删除");
    }catch(error){toast(`删除失败：${error.message}`)}
    finally{button.disabled=false}
    return
  }
  const letterButton=e.target.closest("[data-open-letter]");if(letterButton){const item=state.futureLetters.find(x=>x.id===letterButton.dataset.openLetter);if(item)openLetter(item);return}
  const financeShift=e.target.closest("[data-finance-shift]");if(financeShift){financeMonth=shiftMonth(financeMonth,Number(financeShift.dataset.financeShift)*(financeAnnual?12:1));render();return}
  if(e.target.closest("[data-finance-annual]")){financeAnnual=!financeAnnual;render();return}
  const editExpense=e.target.closest("[data-edit-expense]");if(editExpense){const item=state.expenses.find(x=>x.id===editExpense.dataset.editExpense);if(item)openForm("expense",{...item,contextId:item.id});return}
  const deleteExpense=e.target.closest("[data-delete-expense]");if(deleteExpense){
    const item=state.expenses.find(x=>x.id===deleteExpense.dataset.deleteExpense);if(!item)return;
    if(!confirm(`确定删除 ${monthLabel(item.month)} 的“${item.category}”记录吗？`))return;
    await window.CloudStore?.deleteRecord("expense",item.id);
    state.expenses=state.expenses.filter(x=>x.id!==item.id);save("支出记录已删除");render();return
  }
  const monthShift=e.target.closest("[data-intimacy-month]");if(monthShift){intimacyMonth=shiftMonth(intimacyMonth,Number(monthShift.dataset.intimacyMonth));render();return}
  if(e.target.closest("[data-intimacy-today]")){intimacyMonth=today().slice(0,7);render();return}
  const heart=e.target.closest(".intimacy-day");if(heart){
    const dateValue=heart.dataset.intimacyDate||heart.getAttribute("aria-label")?.slice(0,10);
    const record=state.intimacy.find(item=>item.date===dateValue);
    if(record)openIntimacyDetail(record);else openForm("intimacy",{date:dateValue});
    return
  }
  const lightbox=e.target.closest("[data-lightbox]");if(lightbox){openLightbox(lightbox.dataset.lightbox);return}
  const photoView=e.target.closest("[data-home-photo-view]");if(photoView){openLightbox(photoView.dataset.homePhotoView);return}
  const setCover=e.target.closest("[data-home-set-cover]");if(setCover){
    const photo=uniqueHomePhotos([state.homePhoto,...(state.homePhotos||[])]).find(item=>photoKey(item)===setCover.dataset.homeSetCover);
    if(!photo)return;
    state.homePhoto={...photo};state.homePhotos=uniqueHomePhotos([photo,...(state.homePhotos||[])]);
    await persistNow("首页封面已切换");openHomeAlbum();render();return
  }
  const deletePhoto=e.target.closest("[data-home-delete-photo]");if(deletePhoto){
    const key=deletePhoto.dataset.homeDeletePhoto;
    const photos=uniqueHomePhotos([state.homePhoto,...(state.homePhotos||[])]);
    const photo=photos.find(item=>photoKey(item)===key);if(!photo)return;
    if(!confirm(`确定从相册删除“${photo.title||"这张照片"}”吗？`))return;
    await window.CloudStore?.deleteMedia([photo.path,photo.thumbPath]);
    const remaining=photos.filter(item=>photoKey(item)!==key);
    if(photoKey(state.homePhoto)===key)state.homePhoto=remaining[0]||clone(demo.homePhoto);
    state.homePhotos=remaining;
    await persistNow("照片已从相册删除");openHomeAlbum();render();return
  }
  if(e.target.closest("#sync")){
    if(window.CloudStore?.status().ready)pullCloud(true);
    else toast("本地数据已保存；登录后可跨设备同步");
  }
  if(e.target.closest("#space-control, #account-control, [data-account-open]")){openAccountDialog();return}
});

document.querySelector("#intimacy-edit").addEventListener("click",()=>{
  const record=state.intimacy.find(item=>item.id===activeIntimacyId);
  if(!record)return;
  document.querySelector("#intimacy-detail-dialog").close();
  openForm("intimacy",{...record,contextId:record.id});
});
document.querySelector("#intimacy-remove").addEventListener("click",()=>{
  document.querySelector("#intimacy-detail-dialog").close();
  document.querySelector("#intimacy-remove-dialog").showModal();
});
document.querySelector("#intimacy-remove-confirm").addEventListener("click",async()=>{
  const button=document.querySelector("#intimacy-remove-confirm");
  const record=state.intimacy.find(item=>item.id===activeIntimacyId);
  if(!record)return;
  button.disabled=true;
  try{
    await window.CloudStore?.deleteRecord("intimacy",record.id);
    state.intimacy=state.intimacy.filter(item=>item.id!==record.id);
    activeIntimacyId="";
    save();
    document.querySelector("#intimacy-remove-dialog").close();
    render();
    toast("这颗心已经移除");
  }catch(error){toast(error.message)}
  finally{button.disabled=false}
});

document.querySelector("#record-form").addEventListener("submit",async e=>{
  e.preventDefault();if(!e.currentTarget.reportValidity())return;
  const cfg=forms[e.currentTarget.dataset.type];
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  if(e.currentTarget.dataset.contextId)data.contextId=e.currentTarget.dataset.contextId;
  if(e.currentTarget.dataset.messageId)data.messageId=e.currentTarget.dataset.messageId;
  try{
    const submit=e.currentTarget.querySelector('[type="submit"]');
    submit.disabled=true;
    await cfg.submit(data);
    document.querySelector("#form-dialog").close();render();
    if(animateHeartDate)setTimeout(()=>{animateHeartDate="";if(route==="health")render()},650);
  }catch(error){toast(error.message)}
  finally{e.currentTarget.querySelector('[type="submit"]').disabled=false}
});

if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
window.CloudStore?.init({
  onStatus(status){
    cloudStatus=status;
    syncAuthGate();
    syncSpaceStatus();
  },
  onRemoteChange(){
    pullCloud(false);
  }
}).then(status=>{
  cloudStatus=status;
  syncAuthGate();
  syncSpaceStatus();
  if(status.ready)pullCloud(false);
  else if(status.signedIn||!status.configured)render();
}).catch(error=>{
  cloudStatus=window.CloudStore?.status()||cloudStatus;
  syncAuthGate();
  const feedback=document.querySelector("#login-feedback");
  if(feedback)feedback.textContent="暂时无法连接云端，请检查网络后重试。";
  toast(`云端初始化失败：${error.message}`);
});
