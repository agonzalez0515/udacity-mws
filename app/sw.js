import idb from 'idb';

const filesToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
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
    '/images/no-image.svg',
    '/images/icon-food-1x.png',
    '/images/icon-food-2x.png',
    '/images/icon-food-4x.png',
    '/images/icon-food-10x.png',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/sw.js'
];

const restaurantCache = 'cache-v10';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(restaurantCache).then( cache => {
      return cache.addAll(filesToCache);
    })
  );
});


//Offline First
//intercept the fetch and return anything that matches from the cache. If it's not in the cache, put it in for next time and return response
self.addEventListener('fetch', e => {
  const requestRestaurants = e.request.url.indexOf("restaurants")
  if (requestRestaurants === -1) {
    e.respondWith(
      caches.open(restaurantCache).then(cache => {
        return cache.match(e.request, {ignoreSearch: true}).then(response => {
          return response || fetch(e.request).then(response => {
            cache.put(e.request, response.clone())
            return response
          })
        });
      })
    ); 
  }
})



self.addEventListener('sync', event => {
  if (event.tag == 'syncReviews') {
    // event.waitUntil(postReviews(reviews));
    console.log("hi from the sw")
  }
});










