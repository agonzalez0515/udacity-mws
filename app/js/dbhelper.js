import idb from 'idb';

const dbPromise = idb.open('restaurants', 2, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('restaurants', {keyPath: 'id'});
    case 1:
      upgradeDB.createObjectStore('reviews', {keyPath: 'id'});
    case 2:
      upgradeDB.createObjectStore('newReviews', {keyPath: 'id'});
  }
});



/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL () {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants (callback) {
    fetch(DBHelper.DATABASE_URL)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(restaurants => {
        dbPromise.then(db => {
          const tx = db.transaction("restaurants", "readwrite");
          const store = tx.objectStore("restaurants");
          restaurants.forEach(restaurant => {
            console.log("putting restaurants in idb")
            store.put(restaurant)
          })
        });
        callback(null, restaurants);
      })
      .catch(err => {
        console.log("fetch failed")
        // callback(null, err)
        dbPromise.then(db => {
          const tx = db.transaction("restaurants", "readonly");
          const store = tx.objectStore("restaurants");
          store.getAll().then(restaurantsIdb => {
            callback(null, restaurantsIdb)
          })
          
        })
      });
  }

  
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById (id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  static fetchReviews(callback) {
    fetch('http://localhost:1337/reviews')
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(reviews=> {
      console.log(reviews)
      dbPromise.then(db => {
        const tx = db.transaction("reviews", "readwrite");
        const store = tx.objectStore("reviews");
        reviews.forEach(review => {
          console.log("putting reviews in idb")
          store.put(review)
        })
      });
      callback(null, reviews);
    })
    .catch(err => {
      console.log("fetch failed")
      // callback(null, err)
      dbPromise.then(db => {
        const tx = db.transaction("reviews", "readonly");
        const store = tx.objectStore("reviews");
        console.log(store)
        store.getAll().then(reviewsIdb => {
          callback(null, reviewsIdb)
        })
        
      })
    });
  }


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (restaurant.photograph) {
      const imgPath = `${restaurant.photograph}.jpg`
      return (`/images/${imgPath}`);
    } else {
      return (`/images/no-image.svg`)
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      });
    marker.addTo(newMap);
    return marker;
  }
  
  static saveNewReview(review) {
    fetch('http://localhost:1337/reviews',
     {method: 'POST',
      body: JSON.stringify(review)})
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(response => {
      console.log('Success:', JSON.stringify(response))
      // dbPromise.then(db => {
      //   const tx = db.transaction("reviews", "readwrite");
      //   const store = tx.objectStore("reviews");
      //   reviews.forEach(review => {
      //     console.log("putting reviews in idb")
      //     store.put(review)
      //   })
      // });
      // callback(null, reviews);
    })
    .catch(err => {
      console.error('Error:', err)
      // dbPromise.then(db => {
      //   const tx = db.transaction("reviews", "readonly");
      //   const store = tx.objectStore("reviews");
      //   console.log(store)
      //   store.getAll().then(reviewsIdb => {
      //     callback(null, reviewsIdb)
      //   })
        
      // })
    });
    
    
  }
}



window.DBHelper = DBHelper;