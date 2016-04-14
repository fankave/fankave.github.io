var gulp       = require('gulp'),
    util       = require('gulp-util'),
    concat     = require('gulp-concat'),
    cssnano    = require('gulp-cssnano'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer'),
    jshint     = require('gulp-jshint'),
    gzip       = require('gulp-gzip');

gulp.task('lib', function () {
  return gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.min.js'
  ])
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('lib.js'))
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/lib'));
});

gulp.task('css-prefix', function () {
  return gulp.src(['./css/stadium.css'])
  .pipe(autoprefix())
  .pipe(rename({ suffix: '.pref' }))
  .pipe(gulp.dest('./css'));
});

gulp.task('css', function () {
  return gulp.src(['./css/stadium.css'])
  .pipe(sourcemaps.init())
    .pipe(autoprefix())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function() {
  return gulp.src([
    './js/Stadium.js',
    './js/PlayerSocial.js',
    './js/PlayerStats.js',
    './js/ExpandedTweet.js',
    './js/ContentService.js'
  ])
  .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
  gulp.watch('./css/*.css', ['css']);
  gulp.watch('./js/*.js', ['scripts']);
});
