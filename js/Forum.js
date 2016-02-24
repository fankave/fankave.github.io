angular.module("Forum", ["ngRoute","ngSanitize","AuthModule","ChannelModule","TopicModule","PostModule","NetworkModule","MediaModule","SocialModule","UserInput","SmartStadiumModule"])
.config(["$routeProvider", "$locationProvider",

function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/login', {
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
    redirectTo:'/invalidTopic'
  });

  if (window.history && window.history.pushState && HTML5_LOC){
    $locationProvider.html5Mode({
      enabled:true
    });
  }
}])

.filter('hashtags',['$filter', '$sce',
  function ($filter, $sce) {
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
}]);

angular.module('Forum')
.directive('ngElementReady', [function() {
  return {
    priority: -1000,
    restrict: "A",
    link: function($scope, $element, $attributes) {
        $scope.$eval($attributes.ngElementReady); // execute expression from attribute
    }
  };
}]);

angular.module('Forum')
.directive('reportPageHeight', ['URIHelper',
  function (URIHelper) {
    return {
      link: function(scope, elem, attrs) {

        if (URIHelper.embedded()){
          scope.$watch(function() {
            scope.__height = elem.height();
            console.log("Setting Height: ", scope.__height);
          });

          scope.$watch('__height', function (newHeight, oldHeight) {
            console.log("Watching Height: ", newHeight, oldHeight);
            // if (newHeight !== oldHeight || newHeight < ){
              sendHeight(newHeight);
            // }
          });
        }

        function sendHeight(contentHeight) {
          // setTimeout(function(){
            if (GEN_DEBUG) console.log('Sending Height: ', contentHeight, parent);
            var message = {
              type: 'resize',
              contentHeight: contentHeight
            };
            parent.postMessage(message, 'http://www.fankave.net');
          // }, 0);
        }

      }
    }
}]);
