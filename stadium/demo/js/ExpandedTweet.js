angular.module('player.social')
.directive('expandedTweet', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      thisTweet: '='
    },
    link: function (scope, elem, attrs) {

      if (attrs.videoB){
        scope.videoB = true;
      }

      if (attrs.videoC){
        scope.alternate = true;
      } else {
        scope.alternate = false;
      }

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
      $(elem[0]).animate({
        width: '1130px'
      },{
        duration: 2000,
        start: function() {
          var trueScope = $('#curry-bg-2').scope();
          if (trueScope.psocial.cycleCount === 2){
            trueScope.psocial.videoReady = true;
          } else if (trueScope.psocial.cycleCount === 3){
            trueScope.psocial.videoBReady = true;
          }
        },
        complete: function () {
          var trueScope = $('#curry-bg-2').scope();
          trueScope.$apply(function(){
            if (trueScope.psocial.cycleCount === 3){
              trueScope.psocial.hidePrevContent();
            }
          });
          $(elem[0]).on('ended', function (e) {
            $timeout(function(){
              $(elem[0]).animate({ width: '800px', opacity: '0' },{
                duration: 1500,
                start: function () {
                  if (trueScope.psocial.cycleCount === 2){
                    $('#video-bg').animate({ opacity: '0' },{
                      duration: 1500,
                      complete: function () {
                        trueScope.$apply(function(){
                          trueScope.psocial.videoReady = false;
                        });
                      }
                    });
                  } else if (trueScope.psocial.cycleCount === 3){
                    $('#video-bgB').animate({ opacity: '0' },{
                      duration: 1500,
                      complete: function () {
                        trueScope.$apply(function(){
                          trueScope.psocial.videoBReady = false;
                          trueScope.psocial.videoBLoaded = false;
                        });
                      }
                    });
                  }
                },
                complete: function () {
                  var $selector = $('#tweet-bubble') || $(elem.context.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
                  $selector.animate({ opacity: 0 }, 2000);
                  $timeout(function(){
                    trueScope.$apply(function(){
                      trueScope.psocial.hidePrevContent();
                      if (trueScope.psocial.cycleCount < 4){
                        trueScope.psocial.scheduleNextContent(2500);
                      }
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
angular.module('player.social')
.directive('playFull', ['$timeout', '$state',
function ($timeout, $state) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var trueScope = $('#curry-bg-2').scope();
      trueScope.psocial.videoCReady = true;
      trueScope.psocial.hidePrevContent();
      $(elem[0]).on('ended', function (e) {
        $(elem[0]).animate({ opacity: '0' },{
          duration: 1000,
          start: function () {
            $('#video-bgC').animate({ opacity: '0' },{
              duration: 3000,
              start: function () {
                trueScope.$apply(function(){
                  trueScope.psocial.videoCLoaded = false;
                });
              },
              complete: function () {
                trueScope.$apply(function(){
                  trueScope.psocial.videoCReady = false;
                });
                $timeout(function(){
                  $state.go($state.current, {}, {reload: true});
                }, 1000);
              }
            });
          }
        });
      });
      elem[0].play();
    }
  };
}]);
