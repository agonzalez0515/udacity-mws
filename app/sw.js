import idb from 'idb';

const dbPromise = idb.open('restaurants', 2, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
    case 1:
      upgradeDB.createObjectStore('reviews', {keyPath: 'id'});
    case 2:
      upgradeDB.createObjectStore('newReviews', {keyPath: 'id', autoIncrement: true});
  }
});

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
    event.waitUntil(getNewReviews());
    console.log("hi from the sw")
  }
});


function getNewReviews() {
  console.log("sync review - open idb")
  dbPromise.then(db => {
    const tx = db.transaction("newReviews", "readonly");
    const store = tx.objectStore("newReviews");
    store.getAll().then(newReviews => {
      console.log(newReviews)
      postReviews(newReviews)
    })
  })
  .catch(err => {
    console.error('Error:', err.message)
  });
}


function postReviews(reviews) {
  console.log(reviews)
    if (reviews.length > 0) {
      reviews.forEach(review => {
        fetch('http://localhost:1337/reviews',
        {method: 'POST',
        body: JSON.stringify(review)})
        .then(res => {
          console.log("review sent - delete from idb")
          console.log(res)
          if (res.ok) {
            dbPromise.then(db => {
              const tx = db.transaction("newReviews", "readwrite");
              const store = tx.objectStore("newReviews");
              store.delete(review.id)
            })
          }
        })
        .catch(err => {
          console.log("Error: " + err)
          // location.reload(true);
        })
      })
    }
};








