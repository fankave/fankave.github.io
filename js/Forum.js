var rootModule = angular.module("Forum", ["ngRoute", "AuthModule", "ChannelModule","TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", "$locationProvider", initRootModule]);

function initRootModule($routeProvider, $locationProvider) {
  $routeProvider.when('/channel/:channelID',
      {
        templateUrl:'partials/login.html',
        controller:'ChannelController'
      }).
  when('/topic/:topicID',
  {
    templateUrl:'partials/topic.html',
    controller:'TopicController'
  }).
  when('/post/:postID',
  {
    templateUrl:'partials/post.html',
    controller:'PostController'
  }).
  when('/invalidTopic',
  {
    templateUrl:'partials/invalidTopic.html'
  }).
  when('/facebookLogin',
  {
    templateUrl:'partials/facebookLogin.html',
    controller:'AuthController'
  }).
  otherwise(
  {
    redirectTo:'invalidTopic'
  });

  // $locationProvider.html5Mode(true);
};

rootModule.run(function (){
  // Initialize Facebook SDK once loaded
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '210324962465861',
      xfbml      : true,
      version    : 'v2.4'
    });
  };
  // Load Facebook SDK
  (function(d, s, id) {
    console.log('loading FB SDK...');
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

});
