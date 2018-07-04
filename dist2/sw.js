(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var filesToCache = ['/', '/index.html', '/css/styles.css', '/data/restaurants.json', '/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/6.jpg', '/images/7.jpg', '/images/8.jpg', '/images/9.jpg', '/images/10.jpg', '/js/dbhelper.js', '/js/main.js', '/js/restaurant_info.js', '/sw.js'];

var restaurantCache = 'cache-v3';

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(restaurantCache).then(function (cache) {
        return cache.addAll(filesToCache);
    }));
});

self.addEventListener('fetch', function (e) {
    e.respondWith(caches.open(restaurantCache).then(function (cache) {
        return cache.match(e.request).then(function (response) {
            // console.log("returning match")
            return response || fetch(e.request).then(function (response) {
                cache.put(e.request, response.clone());
                return response;
            });
        });
    }));
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBLElBQU0sZUFBZSxDQUNqQixHQURpQixFQUVqQixhQUZpQixFQUdqQixpQkFIaUIsRUFJakIsd0JBSmlCLEVBS2pCLGVBTGlCLEVBTWpCLGVBTmlCLEVBT2pCLGVBUGlCLEVBUWpCLGVBUmlCLEVBU2pCLGVBVGlCLEVBVWpCLGVBVmlCLEVBV2pCLGVBWGlCLEVBWWpCLGVBWmlCLEVBYWpCLGVBYmlCLEVBY2pCLGdCQWRpQixFQWVqQixpQkFmaUIsRUFnQmpCLGFBaEJpQixFQWlCakIsd0JBakJpQixFQWtCakIsUUFsQmlCLENBQXJCOztBQXFCQSxJQUFNLGtCQUFrQixVQUF4Qjs7QUFFQSxLQUFLLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLGFBQUs7QUFDbEMsTUFBRSxTQUFGLENBQ0ksT0FBTyxJQUFQLENBQVksZUFBWixFQUE2QixJQUE3QixDQUFtQyxpQkFBUztBQUN4QyxlQUFPLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBUDtBQUNILEtBRkQsQ0FESjtBQUtILENBTkQ7O0FBU0EsS0FBSyxnQkFBTCxDQUF1QixPQUF2QixFQUFnQyxhQUFLO0FBQ2pDLE1BQUUsV0FBRixDQUNJLE9BQU8sSUFBUCxDQUFZLGVBQVosRUFBNkIsSUFBN0IsQ0FBa0MsaUJBQVM7QUFDdkMsZUFBTyxNQUFNLEtBQU4sQ0FBWSxFQUFFLE9BQWQsRUFBdUIsSUFBdkIsQ0FBNEIsb0JBQVk7QUFDM0M7QUFDQSxtQkFBTyxZQUFZLE1BQU0sRUFBRSxPQUFSLEVBQWlCLElBQWpCLENBQXNCLG9CQUFZO0FBQ2pELHNCQUFNLEdBQU4sQ0FBVSxFQUFFLE9BQVosRUFBcUIsU0FBUyxLQUFULEVBQXJCO0FBQ0EsdUJBQU8sUUFBUDtBQUNILGFBSGtCLENBQW5CO0FBSUgsU0FOTSxDQUFQO0FBT0gsS0FSRCxDQURKO0FBV0gsQ0FaRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuY29uc3QgZmlsZXNUb0NhY2hlID0gW1xuICAgICcvJyxcbiAgICAnL2luZGV4Lmh0bWwnLFxuICAgICcvY3NzL3N0eWxlcy5jc3MnLFxuICAgICcvZGF0YS9yZXN0YXVyYW50cy5qc29uJyxcbiAgICAnL2ltYWdlcy8xLmpwZycsXG4gICAgJy9pbWFnZXMvMi5qcGcnLFxuICAgICcvaW1hZ2VzLzMuanBnJyxcbiAgICAnL2ltYWdlcy80LmpwZycsXG4gICAgJy9pbWFnZXMvNS5qcGcnLFxuICAgICcvaW1hZ2VzLzYuanBnJyxcbiAgICAnL2ltYWdlcy83LmpwZycsXG4gICAgJy9pbWFnZXMvOC5qcGcnLFxuICAgICcvaW1hZ2VzLzkuanBnJyxcbiAgICAnL2ltYWdlcy8xMC5qcGcnLFxuICAgICcvanMvZGJoZWxwZXIuanMnLFxuICAgICcvanMvbWFpbi5qcycsXG4gICAgJy9qcy9yZXN0YXVyYW50X2luZm8uanMnLFxuICAgICcvc3cuanMnXG5dO1xuXG5jb25zdCByZXN0YXVyYW50Q2FjaGUgPSAnY2FjaGUtdjMnO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2luc3RhbGwnLCBlID0+IHtcbiAgICBlLndhaXRVbnRpbChcbiAgICAgICAgY2FjaGVzLm9wZW4ocmVzdGF1cmFudENhY2hlKS50aGVuKCBjYWNoZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGUuYWRkQWxsKGZpbGVzVG9DYWNoZSk7XG4gICAgICAgIH0pXG4gICAgKTtcbn0pO1xuXG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lciAoJ2ZldGNoJywgZSA9PiB7XG4gICAgZS5yZXNwb25kV2l0aChcbiAgICAgICAgY2FjaGVzLm9wZW4ocmVzdGF1cmFudENhY2hlKS50aGVuKGNhY2hlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZS5tYXRjaChlLnJlcXVlc3QpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmV0dXJuaW5nIG1hdGNoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGZldGNoKGUucmVxdWVzdCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNhY2hlLnB1dChlLnJlcXVlc3QsIHJlc3BvbnNlLmNsb25lKCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICApO1xufSk7XG4iXX0=
