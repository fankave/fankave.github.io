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
      $(elem).animate({
        width: '1130px'
      },{
        duration: 1500,
        complete: function () {
          $(elem[0]).on('ended', function (e) {
            $timeout(function(){
              $(elem).animate({ width: '800px' },{
                duration: 1500,
                complete: function () {
                  var $selector = $('#tweet-bubble') || $(elem.context.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                  $selector.animate({ opacity: 0 }, 2000);
                  var trueScope = $('#curry-bg-2').scope();
                  $timeout(function(){
                    trueScope.$apply(function(){
                      trueScope.psocial.hidePrevContent();
                    });
                  }, 3500);
                }
              });
            }, 1000);
          });
          elem[0].play();
        }
      });
    }
  };
}]);