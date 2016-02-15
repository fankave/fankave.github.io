angular.module("Forum", ["ui.router","ngSanitize","AuthModule","ChannelModule","TopicModule","ChatModule","PostModule","NetworkModule","MediaModule","VideoModule","SocialModule","UserInput","SmartStadiumModule"])
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
function ($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl:'partials/facebookLogin.html',
    controller:'AuthController'
  })
  .state('channel', {
    url: '/channel/:channelID?peel&userId&userName&showId&smartStadium&MI16',
    templateUrl:'partials/login.html',
    controller:'ChannelController'
  })
  .state('topic', {
    url: '/topic/:topicID?channel&peel&userId&userName&showId&smartStadium&MI16',
    abstract: true,
    templateUrl:'partials/topic.html',
    controller:'TopicController'
  })
    .state('topic.chat', {
      url: '/chat',
      deepStateRedirect: true,
      views: {
        'topic-tab-view': {
          templateUrl:'partials/chat.html',
          controller: 'ChatController',
          controllerAs: 'chat'
        }
      }
    })
    .state('topic.video', {
      url: '/video',
      deepStateRedirect: true,
      views: {
        'topic-tab-view': {
          templateUrl:'partials/video.html',
          controller: 'VideoController',
          controllerAs: 'video'
        }
      }
    })
    .state('topic.social', {
      url: '/social',
      deepStateRedirect: true,
      views: {
        'topic-tab-view': {
          templateUrl:'partials/social.html',
          controller: 'SocialController',
          controllerAs: 'social'
        }
      }
    })
  .state('post', {
    url: '/post/:postID?channel&peel&userId&userName&showId&smartStadium&MI16',
    templateUrl:'partials/post.html',
    controller:'PostController'
  })
  .state('invalid', {
    url: 'invalidTopic',
    templateUrl:'partials/invalidTopic.html'
  })
  $urlRouterProvider.when('/topic/:topicID', '/topic/:topicID/chat');
  $urlRouterProvider.otherwise('invalid');

  if (window.history && window.history.pushState && HTML5_LOC){
    $locationProvider.html5Mode({
      enabled:true
    });
  }
}])

.run(['$state','$rootScope',function ($state, $rootScope) {
  $rootScope.$state = $state;
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
