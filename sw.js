// Ultra Trail Manager — service worker : fonctionne hors-ligne, se met à jour en arrière-plan
const CACHE='utm-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const sameOrigin=new URL(req.url).origin===location.origin;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const cached=await c.match(req);
    const net=fetch(req).then(r=>{if(r&&r.ok&&sameOrigin)c.put(req,r.clone());return r;}).catch(()=>cached);
    return cached||net; // réponse immédiate depuis le cache, nouvelle version téléchargée pour la prochaine ouverture
  }));
});
