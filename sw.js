const CACHE = 'cobros-v2';
const FILES = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // index.html siempre se pide al servidor (nunca desde caché)
  if (e.request.url.endsWith('/') || e.request.url.includes('index.html')) {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  // El resto (iconos, manifest) sí se sirve desde caché
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
