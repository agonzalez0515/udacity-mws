const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');

// copy files
gulp.task('copy-html', function() {
  gulp.src('app/*.html')
      .pipe(gulp.dest('dist'))
})

gulp.task('copy-js', function() {
  gulp.src(['app/js/main.js', 'app/js/restaurant_info.js', 'app/js/reviews.js'])
      .pipe(babel({
        presets: ['env']}))
      .pipe(gulp.dest('dist/js'))
})

gulp.task('copy-images', function() {
  gulp.src(['app/images/*.jpg', 'app/images/*.svg', 'app/images/*.png'])
      .pipe(gulp.dest('dist/images'))
})

gulp.task('copy-manifest', function() {
  gulp.src(['app/manifest.json'])
      .pipe(gulp.dest('dist'))
})

//transpile es6 js
gulp.task('transpile', function () {
  return browserify({entries: ['app/js/dbhelper.js'], debug: true})
      .transform(babelify, {presets: ['env']})
      .bundle()
      .on('error', function (error) {
        console.log(error);
      })
      .pipe(source('dbhelper.js'))
      .pipe(gulp.dest('dist/js'))
});

//uglify CSS
gulp.task('css', function () {
  gulp.src('app/css/*.css')
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(gulp.dest('dist/css'));
});

//transpile service worker
gulp.task('sw', function () {
  return browserify({entries: 'app/sw.js', debug: true})
    .transform(babelify, {presets: ['env']})
    .bundle()
    .on('error', function (error) {
      console.log(error)
    })
    .pipe(source('sw.js'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('watch', function (){
  gulp.watch(['app/js/main.js', 'app/js/restaurant_info.js'], ['copy-js']);
  gulp.watch('app/css/*.css', ['css']);
  gulp.watch('app/*.html', ['copy-html']);
  gulp.watch('app/js/dbhelper.js', ['transpile']);
  gulp.watch('app/sw.js', ['sw']);
})

gulp.task('default', ['copy-html', 'copy-images', 'copy-js', 'css', 'transpile', 'sw', 'copy-manifest'])