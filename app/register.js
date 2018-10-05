import idb from 'idb';

const dbPromise = idb.open('restaurants', 3, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', { keyPath: 'id' });
    case 1:
      upgradeDB.createObjectStore('reviews', { keyPath: 'id' });
    case 2:
      upgradeDB.createObjectStore('newReviews', { keyPath: 'id', autoIncrement: true });
    case 3:
      upgradeDB.createObjectStore('likes', { keyPath: 'id', autoIncrement: true });
  }
});

let restID = window.location.href.split('?')[1].split('=')[1];

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(reg => {

      const heartBtn = document.getElementById("toggle-heart")
      heartBtn.addEventListener("click", event => {
        console.log("clicked heart")
        console.log(event.target.checked)
        let like = {};
        like.id = Date.now();
        like.like = event.target.checked;
        like.restaurant_id = parseInt(restID);
        
        saveLike(like);
        reg.sync.register("likes");
      })

      const form = document.getElementById("reviews-form");
      form.addEventListener("submit", event => {
        event.preventDefault();
        let formData = new FormData(document.getElementById("reviews-form"));
        formData = formData.entries();
        let obj = formData.next();
        let retrieved = {};
        while (obj.value !== undefined) {
          retrieved[obj.value[0]] = obj.value[1];
          obj = formData.next();
        }

        
        let reviewObj = {};
        reviewObj.id = Date.now();
        reviewObj.restaurant_id = parseInt(restID);
        reviewObj.name = retrieved.name;
        reviewObj.rating = parseInt(retrieved.rating);
        reviewObj.comments = retrieved.review;

        saveNewReview(reviewObj);
        reg.sync.register("syncReviews");
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
    const tx = db.transaction("newReviews", "readwrite");
    const store = tx.objectStore("newReviews");
    store.put(review)
    return tx.complete;
  })
    .catch(err => {
      console.error('Error:', err)
    });
}

function saveLike(like) {
  dbPromise.then(db => {
    const tx = db.transaction("likes", "readwrite");
    const store = tx.objectStore("likes");
    store.put(like)
    return tx.complete;
  })
  .catch(err => {
    console.log("Error:" + err)
  })
}