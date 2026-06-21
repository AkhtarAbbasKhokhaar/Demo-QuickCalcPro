const CACHE_NAME = 'quickcalcpro-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index',
  '/index.html',
  '/tools',
  '/tools.html',
  '/about',
  '/about.html',
  '/contact',
  '/contact.html',
  '/privacy-policy',
  '/privacy-policy.html',
  '/terms-and-conditions',
  '/terms-and-conditions.html',
  '/disclaimer',
  '/disclaimer.html',
  '/sitemap',
  '/sitemap.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching key assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Intercept and Cache-First Strategy
self.addEventListener('fetch', (event) => {
  // Only handle standard HTTP/HTTPS schemes
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((fetchResponse) => {
          // Check if we received a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Clone the response
          const responseToCache = fetchResponse.clone();

          // Only cache if the URL path aligns with our app assets
          const urlPath = new URL(event.request.url).pathname;
          if (ASSETS_TO_CACHE.some(asset => urlPath.endsWith(asset) || urlPath === asset)) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return fetchResponse;
        }).catch(() => {
          // Return offline fallback or graceful error if fetch fails (e.g., ofline)
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
