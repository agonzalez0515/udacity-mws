if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('sw.js')
             .then(reg => { 
                 console.log("Service Worker Registered");
                 reg.sync.register('syncReviews');
             })
             .then(() => { console.log("Sync Registered") })
             .catch((error) => { console.log("Registration failed: " + error); })
  }