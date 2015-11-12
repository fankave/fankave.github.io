var rootModule = angular.module("Forum", ["ngRoute", "AuthModule", "ChannelModule","TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", "$locationProvider",

function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl:'partials/facebookLogin.html',
    controller:'AuthController'
  })
  .when('/channel/:channelID', {
    templateUrl:'partials/login.html',
    controller:'ChannelController'
  })
  .when('/topic/:topicID', {
    templateUrl:'partials/topic.html',
    controller:'TopicController'
  })
  .when('/post/:postID', {
    templateUrl:'partials/post.html',
    controller:'PostController'
  })
  .when('/invalidTopic', {
    templateUrl:'partials/invalidTopic.html'
  })
  .otherwise({
    redirectTo:'invalidTopic'
  });

  // $locationProvider.html5Mode(true);
}]);
