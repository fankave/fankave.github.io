var rootModule = angular.module("Forum", ["ngRoute", "AuthModule", "ChannelModule","TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", "$locationProvider",

function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl:'partials/facebookLogin.html',
    controller:'AuthController'
  })
  // .when('/channel/:channelID', {
  //   templateUrl:'partials/login.html',
  //   controller:'ChannelController'
  // })
  .when('/channel/:channelID', {
    templateUrl:'partials/topic.html',
    controller:'TopicController'
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

rootModule.run(function ($rootScope, $location, $window, URIHelper, UserInfoService) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    console.log("Route Change Registered");
    var help = URIHelper.isPeelUser();
    console.log("help: ", help);
    if (next.templateUrl !== 'partials/facebookLogin.html' && !UserInfoService.isUserLoggedIn()) {
      console.log("Denying");
      $location.url('/');
    } else {
      console.log("Allowing");
    }
  });
});
