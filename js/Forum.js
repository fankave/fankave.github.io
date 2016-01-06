var rootModule = angular.module("Forum", ["ngRoute","ngSanitize","AuthModule","ChannelModule","TopicModule","PostModule","NetworkModule","MediaModule","SocialModule","UserInput","SmartStadiumModule"]);
rootModule.config(["$routeProvider", "$locationProvider",

function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/login', {
    templateUrl:'/partials/facebookLogin.html',
    controller:'AuthController'
  })
  .when('/channel/:channelID', {
    templateUrl:'/partials/login.html',
    controller:'ChannelController'
  })
  .when('/topic/:topicID', {
    templateUrl:'/partials/topic.html',
    controller:'TopicController'
  })
  .when('/post/:postID', {
    templateUrl:'/partials/post.html',
    controller:'PostController'
  })
  .when('/invalidTopic', {
    templateUrl:'/partials/invalidTopic.html'
  })
  .otherwise({
    redirectTo:'/invalidTopic'
  });

  if (window.history && window.history.pushState && HTML5_LOC){
    $locationProvider.html5Mode({
      enabled:true
    });
  }
}]);

rootModule.filter('hashtags',['$filter', '$sce',
  function($filter, $sce) {
    return function(text, target) {
      if (!text) return text;

      var replacedText = $filter('linky')(text, target);
      var targetAttr = "";
      if (angular.isDefined(target)) {
          targetAttr = ' target="' + target + '"';
      }
      // replace #hashtags and send them to twitter
      var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = text.replace(replacePattern1, '$1<a href="https://twitter.com/search?q=%23$2"' + targetAttr + '>#$2</a>');
      // replace @mentions but keep them to our site
      var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="https://twitter.com/$2"' + targetAttr + '>@$2</a>');

      $sce.trustAsHtml(replacedText);
      return replacedText;
    };
  }
]);
