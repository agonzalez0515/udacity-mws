
const form = document.getElementById("reviews-form");
  
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = new FormData(document.getElementById("reviews-form"));
  formData = formData.entries();              
  let obj = formData.next();
  let retrieved = {};             
  while(obj.value !== undefined) {    
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
  
  DBHelper.saveNewReview(reviewObj);
});
