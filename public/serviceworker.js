const CACHE_NAME = 'wdosa-25042020';
const CACHE_URLS = ['/', 'design1.html', 'design2.html', 'ecmascript.html', 'index.html', 'manifest.json', 'qualifications.html', 'serviceworker.js', 'skills.html', 'styles/images/skills.svg', 'images/aylologo-1x.webp', 'images/aylologo-2x.webp', 'images/aylologo-3x.webp', 'images/aylologo.jpg', 'images/bsslogo-1x.webp', 'images/bsslogo-2x.webp', 'images/bsslogo-3x.webp', 'images/bsslogo.jpg', 'images/design1-.png', 'images/design1-1x.webp', 'images/design1-2x.webp', 'images/design1-3x.webp', 'images/design2-1x.webp', 'images/design2-2x.webp', 'images/design2-3x.webp', 'images/design2.png', 'images/ecmascript-1x.webp', 'images/ecmascript-2x.webp', 'images/ecmascript-3x.webp', 'images/ecmascript.png', 'images/header-large-1x.webp', 'images/header-large-2x.webp', 'images/header-large.jpg', 'images/header-medium-1x.webp', 'images/header-medium-2x.webp', 'images/header-medium.jpg', 'images/header-small-1x.webp', 'images/header-small-2x.webp', 'images/header-small.jpg', 'images/header.jpg', 'images/knimg-1x.webp', 'images/knimg-2x.webp', 'images/knimg-3x.webp', 'images/knimg.jpg', 'images/landing-1x.webp', 'images/landing-2x.webp', 'images/landing-3x.webp', 'images/landing.png', 'images/lsoverlay-1x.webp', 'images/lsoverlay-2x.webp', 'images/lsoverlay-3x.webp', 'images/lsoverlay.png', 'images/rover-1x.webp', 'images/rover-2x.webp', 'images/rover-3x.webp', 'images/rover.jpg', 'images/icons/icon-128x128.png', 'images/icons/icon-144x144.png', 'images/icons/icon-152x152.png', 'images/icons/icon-192x192.png', 'images/icons/icon-384x384.png', 'images/icons/icon-512x512.png', 'images/icons/icon-72x72.png', 'images/icons/icon-96x96.png', 'js/drinks.json', 'js/main.js', 'styles/design1.css', 'styles/design2.css', 'styles/styles.css', 'styles/images/home.svg', 'styles/images/qualifications.svg'];

// Wait until we have been notified that we are installed
self.addEventListener("install", function (event) {

    // Announce that we are installed
    console.log("Service worker installed", self);

    // Create a cache, and add the resources to the cache
    // Tell the "install" event to wait for the promises to resolve before it completes
    event.waitUntil(

        caches.open(CACHE_NAME).then(function (cache) {
            // Cache has been opened
            console.log("Cache opened: ", cache);

            // Now add all URLs to the cache
            return cache.addAll(CACHE_URLS);
        })

    );
});

//On activate update the cache with the new version and clean out old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName.endsWith('appshell') && CACHE_NAME !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

//add all URLs to cache when installed
//...
//user has navigated to page - fetch required assets
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            //check whether asset is in cache
            if (response) {
                //asset in cache, so return it
                console.log(`Return ${event.request.url} from cache`);
                return response;
            }
            //asset not in cache so fetch asset from network
            console.log(`Fetch ${event.request.url} from network`);
            return fetch(event.request);
        })
    );
});