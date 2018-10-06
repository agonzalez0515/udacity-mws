# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: 
### Current Stage: 3

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

In **Stage Two**, you will take the responsive, accessible design you built in Stage One and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using Lighthouse.

In **Stage Three** you will implement review submission and favorites logic on the client side. You will leverage offline   capabilities so that users will be able write a review offline or mark a restaurant as a favorite while offline, defer it, and have it sent to the server when it's back online.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality. 


### To Run It Locally
1. Clone this repo 
2. Run `npm install`
3. Run `gulp` (make sure gulp is installed globally)
4. `cd` into `dist` folder and start a simple http python server at port 8080
`python -m SimpleHTTPServer 8080`



