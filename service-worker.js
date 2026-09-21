const CACHE='cockpit-v2-text-layout-spotlight-1';
const SHELL=[
  './','./index.html','./styles.css?v=2.0.9','./app.js?v=2.0.9','./manifest.webmanifest?v=2.0.8'
];
const MEDIA=[
  './menu-background-v1.jpg?v=2.0.2','./icon-512.png','./icon-192.png','./icon-64.png','./apple-touch-icon.png','./favicon-32.png','./music-note.png','./loupe.png','./annuler.png','./menu_trois_points.png','./coche.png','./plus.png','./jouer.png','./sauvegarde.png','./fermer.png','./crayon.png','./actualiser.png','./fleche_gauche.png','./parchemin.png','./d20.png','./rouage.png','./grimoire.png','./oeil.png','./plume.png','./etoile.png','./groupe.png','./eclair.png','./point_exclamation.png','./marqueur_carte.png','./epingle.png','./sablier.png','./fleche_bas.png','./fleche_haut.png','./spotlight.png','./bulle_dialogue.png','./magie.png','./cerveau.png'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(SHELL);
    await Promise.all(MEDIA.map(url=>cache.add(url).catch(()=>null)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE&&(key.startsWith('dm-cockpit-')||key.startsWith('cockpit-'))).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put('./index.html',copy)); return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request)));
});
