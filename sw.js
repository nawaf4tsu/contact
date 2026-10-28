const CACHE="iron-week-v10";
const SHELL=["./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Pages, scripts and the manifest: network first, so updates show up right away. Images: cache first.
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET")return;
 const url=new URL(r.url);
 const fresh=r.mode==="navigate"||/\.(html|js|json)$/.test(url.pathname)||url.pathname.endsWith("/");
 if(fresh){
  e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(h=>h||caches.match("./index.html"))));
 }else{
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>caches.match("./index.html"))));
 }
});
