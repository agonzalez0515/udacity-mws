
const filesToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/sw.js'
];

const restaurantCache = 'cache-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(restaurantCache).then( cache => {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener ('fetch', e => {
  e.respondWith(
    caches.open(restaurantCache).then(cache => {
      return cache.match(e.request).then(response => {
        // console.log("returning match")
        return response || fetch(e.request).then(response => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
