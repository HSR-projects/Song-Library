const CACHE_NAME = 'hsr-offline-cache-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_URL))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
