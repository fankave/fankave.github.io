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
      scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      }
      $(elem).animate({
        opacity: '1'
      }, 1000);
    },
    templateUrl: 'templates/expanded-tweet.html'
  };
}]);