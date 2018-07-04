const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify')

// copy files
gulp.task('copy-html', function (){
  gulp.src('app/*.html')
      .pipe(gulp.dest('dist'))
})

gulp.task('copy-css', function (){
  gulp.src('app/css/*.css')
      .pipe(gulp.dest('dist/css'))
})

gulp.task('copy-js', function () {
  gulp.src(['app/js/main.js', 'app/js/restaurant_info.js'])
      .pipe(babel({
        presets: ['env']}))
      .pipe(gulp.dest('dist/js'))
})

gulp.task('copy-images', function () {
  gulp.src(['app/images/*.jpg', 'app/images/*.svg'])
      .pipe(gulp.dest('dist/images'))
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

//minify all js
gulp.task ('minify', function () {
  return gulp.src(['dist/js/dbhelper.js', 'dist/js/main.js', 'dist/js/restaurant_info.js'])
      .pipe(concat('script.js'))
      // .pipe(uglify({ compress: { drop_console: true } }))
      .pipe(gulp.dest('dist/js'))
})

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
  gulp.watch('app/css/*.css', ['copy-css']);
  gulp.watch('app/*.html', ['copy-html']);
  gulp.watch('app/js/dbhelper.js', ['transpile']);
  gulp.watch('app/sw.js', ['sw']);
})

gulp.task('default', ['copy-html', 'copy-css', 'copy-images', 'copy-js', 'transpile', 'sw'])