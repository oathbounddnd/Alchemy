
const CACHE = "ac-pwa-v1757187989";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./background.png",
  "./Smoke_1_Mist_1_Storm_1_RADIUS_COLOR_10_1200x1200.webm",
  "./TransmutationCircleComplete_02_Regular_Green_800x800.webm",
  "./BubbleComplete001_001_Purple_2x2_400x400.webm",
  "./BubbleComplete002_001_PurpleRed_3x3_600x600.webm",
  "./Aura_2_Emanating_CIRCLE_RADIUS_LOOP_COLOR_3_1200x1200.webm",
  "./Apothecary_01.ogg",
  "./Potion (1).mp3",
  "./Potion (2).mp3",
  "./Potion (3).mp3",
  "./Potion (4).mp3"
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try { return await fetch(req); } catch (err) {
        const cache = await caches.open(CACHE);
        return cache.match('./index.html');
      }
    })());
    return;
  }
  if (ASSETS.some(p => url.pathname.endsWith(p.replace('./','/')))) {
    e.respondWith(caches.match(req).then(res => res || fetch(req)));
    return;
  }
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
