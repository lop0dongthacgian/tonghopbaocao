// ════════════════════════════════════════════════════
// SERVICE WORKER — sw.js  v1.0.0
// ✏️  Đổi VERSION mỗi khi deploy bản mới để tự clear cache cũ
// ════════════════════════════════════════════════════

const VERSION    = 'v1.0.0';
const CACHE_NAME = `app-cache-${VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-core.js',
  '/icon-1000.png',
  '/icon-512.png',
  '/icon-192.png',
];

self.addEventListener('install', (event) => {
  console.log(`[SW ${VERSION}] Installing…`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log(`[SW ${VERSION}] Activating…`);
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter((name) => name !== CACHE_NAME).map((name) => {
        console.log(`[SW] Deleting stale cache: ${name}`);
        return caches.delete(name);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log(`[SW] SKIP_WAITING received — activating new SW`);
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cloned = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});