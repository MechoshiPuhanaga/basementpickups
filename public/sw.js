/*
 * Basement Pickups service worker (hand-rolled, runtime cache).
 *
 * Strategy:
 * - Navigations (HTML): network-first, fall back to cached page, then the
 *   offline page. Network-first keeps content fresh on every online load.
 * - Same-origin static assets (JS/CSS/fonts/images): cache-first, then network.
 *   Build assets are content-hashed, so a new deploy ships new URLs that are
 *   fetched fresh automatically.
 * - Versioned cache: bump VERSION on a meaningful SW change; old caches are
 *   deleted on activate. No skipWaiting — the new SW activates on the next load
 *   (silent update), so an open session is never swapped mid-flight.
 */
const VERSION = 'v1';
const CACHE = `bp-${VERSION}`;
const OFFLINE_URL = '/offline.html';
const PRECACHE = [OFFLINE_URL, '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML navigations: network-first with cache + offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL)),
        ),
    );
    return;
  }

  // Same-origin static assets: cache-first, then network (and cache it).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            void caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    }),
  );
});
