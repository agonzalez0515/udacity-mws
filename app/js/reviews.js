
// listen on submit button
// get the form data
// store the form data in idb if offline
// pass the data back to server to update database

const form = document.getElementById("reviews-form");
  
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = new FormData(document.getElementById("reviews-form"));
  // const dataObj = {};
  
  formData = formData.entries();              
  let obj = formData.next();
  let retrieved = {};             
  while(undefined !== obj.value) {    
      retrieved[obj.value[0]] = obj.value[1];
      obj = formData.next();
  }
  console.log('retrieved: ',retrieved);
  let restID = window.location.href.split('?')[1].split('=')[1];
  let reviewObj = {};
  reviewObj.restaurant_id = parseInt(restID);
  reviewObj.name = retrieved.name;
  reviewObj.rating = parseInt(retrieved.rating);
  reviewObj.comments = retrieved.review;
  // reviewObj.createdAt = Date.now();
  // console.log(reviewObj)
  DBHelper.saveNewReview(reviewObj);
  
});



