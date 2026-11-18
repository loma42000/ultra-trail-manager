// Ultra Trail Manager — service worker : version en ligne en priorité, copie locale si pas de réseau
const CACHE='utm-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin||url.pathname.endsWith('version.json'))return;
  e.respondWith(fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})
    .catch(()=>caches.match(req).then(m=>m||caches.match('./index.html'))));
});
