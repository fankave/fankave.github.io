angular.module('player.social')
.directive('expandedTweet', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      thisTweet: '='
    },
    link: function (scope, elem, attrs) {

      scope.whitelistHtml = $sce.trustAsHtml(scope.thisTweet.text);

      scope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(src);
      }

      scope.convertTime = function (time) {

      }

      scope.mediaType = scope.thisTweet.media ? scope.thisTweet.media[0].mediaType : 'text';

      $(elem).animate({ opacity: '1' }, 1000);

    },
    templateUrl: 'templates/expanded-tweet.html'
  };
}]);
angular.module('player.social')
.directive('expandAndPlay', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      console.log(elem);
      $(elem[0]).animate({
        width: '1130px'
      },{
        duration: 2000,
        start: function() {
          var trueScope = $('#curry-bg-2').scope();
          trueScope.psocial.videoReady = true;
        },
        complete: function () {
          var trueScope = $('#curry-bg-2').scope();
          $(elem[0]).on('ended', function (e) {
            $timeout(function(){
              $(elem[0]).animate({ width: '800px' },{
                duration: 1500,
                start: function () {
                  $('#video-bg').animate({ opacity: '0' },{
                    duration: 1500,
                    complete: function () {
                      trueScope.$apply(function(){
                        trueScope.psocial.videoReady = false;
                      });
                    }
                  });
                },
                complete: function () {
                  var $selector = $('#tweet-bubble') || $(elem.context.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                  $selector.animate({ opacity: 0 }, 2000);
                  $timeout(function(){
                    trueScope.$apply(function(){
                      trueScope.psocial.hidePrevContent();
                    });
                  }, 3500);
                }
              });
            }, 1000);
          });
          $timeout(function(){elem[0].play()}, 500);
        }
      });
    }
  };
}]);