var gulp       = require('gulp'),
    util       = require('gulp-util'),
    concat     = require('gulp-concat'),
    cssnano    = require('gulp-cssnano'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefix = require('gulp-autoprefixer');

gulp.task('default', function() {

});

gulp.task('scripts-pre', function() {
  return gulp.src([
    './js/Forum.js',
    './js/pre/controllers/ChannelController.js',
    './js/pre/controllers/AuthController.js',
    './js/pre/controllers/TopicController.js',
    './js/pre/controllers/UserInputController.js',
    './js/pre/services/UserAgentService.js',
    './js/pre/services/NetworkService.js',
    './js/pre/services/ForumStorage.js',
    './js/pre/services/ForumDeviceInfo.js',
    './js/pre/services/URIHelper.js',
    './js/pre/services/ChannelService.js',
    './js/pre/directives/TopicDirectives.js',
    './js/pre/services/DataService.js',
    './js/pre/services/TopicService.js',
    './js/pre/services/SplashService.js',
    './js/pre/services/CommentService.js',
    './js/pre/services/DateUtilityService.js',
    './js/pre/services/Bant.js',
    './js/pre/services/UserInfoService.js',
    './js/pre/services/AuthService.js',
    './js/pre/services/StaticData.js',
    './js/pre/services/ForumDSUtility.js',
    './js/pre/services/MediaUploadService.js'
    ])
  .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-post', function() {
  return gulp.src([
    './js/post/controllers/PostController.js',
    './js/post/controllers/SocialController.js',
    './js/post/controllers/SmartStadiumController.js',
    './js/post/directives/SocialDirectives.js',
    './js/post/services/ReplyService.js',
    './js/post/services/SocialService.js',
    './js/post/services/VideoService.js'
    ])
  .pipe(sourcemaps.init())
    .pipe(concat('app-post.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('lib-pre', function() {
  return gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-websocket/angular-websocket.min.js',
    './lib/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-file-upload/dist/angular-file-upload.min.js'
    ])
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('lib-pre.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/lib'));
});

gulp.task('lib-post', function() {
  return gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js',
    './lib/magnific/jQuery.magnific-popup.min.js'
    ])
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('lib-post.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/lib'));
});

gulp.task('css', function() {
  return gulp.src([
    './css/bootstrapCSS/bootstrap.css',
    './bower_components/videoJS/dist/video-js.css',
    './css/forum.css',
    './css/forumAnimations.css',
    './css/magnificCSS/magnific.css'
  ])
  .pipe(sourcemaps.init())
    .pipe(autoprefix())
    .pipe(concat('fankave.css'))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/css'));
})

gulp.task('minifyFile', function() {
  return gulp.src(['./lib/angular/angular-sanitize.js'])
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({
        suffix: '.min'
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./lib/angular-sanitize'));
});