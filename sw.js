const CACHE_NAME = 'portfolio-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/contact.html',
    '/404.html',
    '/style.css',
    '/i18n.js',
    '/favicon.svg',
    '/swiftpurge.svg',
    '/manifest.json'
];

// Install: Cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch: Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Update cache with new version if successful
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Allow offline fallback
                return caches.match(event.request);
            })
    );
});
