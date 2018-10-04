import idb from 'idb';

const dbPromise = idb.open('restaurants', 2, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', { keyPath: 'id' });
    case 1:
      upgradeDB.createObjectStore('reviews', { keyPath: 'id' });
    case 2:
      upgradeDB.createObjectStore('newReviews', { keyPath: 'id', autoIncrement: true });
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(reg => {
      const form = document.getElementById("reviews-form");

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        let formData = new FormData(document.getElementById("reviews-form"));
        formData = formData.entries();
        let obj = formData.next();
        let retrieved = {};
        while (obj.value !== undefined) {
          retrieved[obj.value[0]] = obj.value[1];
          obj = formData.next();
        }

        let restID = window.location.href.split('?')[1].split('=')[1];
        let reviewObj = {};
        reviewObj.id = Date.now();
        reviewObj.restaurant_id = parseInt(restID);
        reviewObj.name = retrieved.name;
        reviewObj.rating = parseInt(retrieved.rating);
        reviewObj.comments = retrieved.review;

        saveNewReview(reviewObj);

        return reg.sync.register('syncReviews');
      });
    })
    .then(() => {
      console.log("Service Worker Registered");
      console.log("Sync Registered")
    })
    .catch((error) => { console.log("Registration failed: " + error); })
}


function saveNewReview(review) {
  dbPromise.then(db => {
    console.log("open idb")
    const tx = db.transaction("newReviews", "readwrite");
    const store = tx.objectStore("newReviews");
    console.log(store)
    console.log("review: " + JSON.stringify(review))
    store.put(review)
    console.log("in idb")
  })
    .catch(err => {
      console.error('Error:', err)
    });
}