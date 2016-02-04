angular.module("Forum", ["ui.router","ngSanitize","AuthModule","ChannelModule","TopicModule","PostModule","NetworkModule","MediaModule","SocialModule","UserInput","SmartStadiumModule"])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl:'partials/facebookLogin.html',
    controller:'AuthController'
  })
  .state('channel', {
    url: '/channel/:channelID',
    templateUrl:'partials/login.html',
    controller:'ChannelController'
  })
  .state('topic', {
    url: '/topic/:topicID',
    templateUrl:'partials/topic.html',
    controller:'TopicController'
  })
    .state('topic.chat', {
      url: '/chat',
      views: {
        'topic-tab-view': {
          templateUrl:'partials/chat.html'
        }
      }
    })
    .state('topic.video', {
      url: '/video',
      views: {
        'topic-tab-view': {
          templateUrl:'partials/video.html'
        }
      },
      controller: 'VideoController',
      controllerAs: 'video'
    })
    .state('topic.social', {
      url: '/social',
      views: {
        'topic-tab-view': {
          templateUrl:'partials/social.html'
        }
      },
      controller: 'SocialController',
      controllerAs: 'social'
    })
  .state('post', {
    url: '/post/:postID',
    templateUrl:'partials/post.html',
    controller:'PostController'
  })
  .state('invalid', {
    url: 'invalidTopic',
    templateUrl:'partials/invalidTopic.html'
  })
  $urlRouterProvider.otherwise('invalid');

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

$.fn.animateRotate = function(angle, duration, easing, complete) {
  return this.each(function() {
    var $elem = $(this);

    $({deg: 0}).animate({deg: angle}, {
      duration: duration,
      easing: easing,
      step: function(now) {
        $elem.css({
           transform: 'rotate(' + now + 'deg)'
         });
      },
      complete: complete || $.noop
    });
  });
};
