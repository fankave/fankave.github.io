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

gulp.task('lib-pre', function () {
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js'
  ])
  .pipe(sourcemaps.init())
    .pipe(concat('lib-pre.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/lib'));
});