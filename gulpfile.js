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
    './js/controllers/ChannelController.js',
    './js/controllers/AuthController.js',
    './js/controllers/TopicController.js',
    './js/controllers/UserInputController.js',
    './js/services/UserAgentService.js',
    './js/services/NetworkService.js',
    './js/services/ForumStorage.js',
    './js/services/ForumDeviceInfo.js',
    './js/services/URIHelper.js',
    './js/services/ChannelService.js',
    './js/directives/TopicDirectives.js',
    './js/services/DataService.js',
    './js/services/TopicService.js',
    './js/services/SplashService.js',
    './js/services/CommentService.js',
    './js/services/DateUtilityService.js',
    './js/services/Bant.js',
    './js/services/UserInfoService.js',
    './js/services/AuthService.js',
    './js/services/StaticData.js',
    './js/services/ForumDSUtility.js',
    './js/services/MediaUploadService.js'
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
    './js/controllers/PostController.js',
    './js/controllers/SocialController.js',
    './js/controllers/SmartStadiumController.js',
    './js/directives/SocialDirectives.js',
    './js/services/ReplyService.js',
    './js/services/SocialService.js',
    './js/services/VideoService.js'
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
