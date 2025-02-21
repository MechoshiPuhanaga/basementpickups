importScripts('./sw-config.js');

const CACHE_PREFIX = 'BASEMENT_PICKUPS_WEB_SITE';

const version = process.env.CACHE_VERSION;

const CACHE_NAME = `${CACHE_PREFIX}_${version}`;

let assetsManifest = process.env.ASSETS;

let urlsToPrefetch = Object.values(assetsManifest);

self.addEventListener('install', (event) => {
  event.waitUntil(
    // the new assets are prefetched:
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToPrefetch))
      // then activate the new service worker:
      .then(self.skipWaiting)
      .catch(console.error)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // the old caches are removed:
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // 'Cache only' strategy with fetch fallback:
        return (
          cachedResponse ||
          fetch(event.request)
            .then((response) => {
              if (response.url.indexOf('chrome-extension') < 0) {
                // Add to the cache the assets
                // that haven't been cached during
                // the 'install' phase, because
                // not listed in the assets manifest:
                cache.put(event.request, response.clone());
              }

              return response;
            })
            .catch(() => {
              console.log('Error fetching:', event.request.url);

              if (event.request.mode === 'navigate') {
                console.log('navigate to: ', event.request.url);

                return cache.match(assetsManifest['index.html']);
              }
            })
        );
      });
    })
  );
});
