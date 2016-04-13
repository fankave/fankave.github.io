angular.module('player.social', [])
.controller('ctrl.player-social', [
  '$http',
  'ContentService',
function ($http, ContentService) {

  var _this = this;
  this.showExpandedTweet = false;

  var _socialContent;
  this.textContent;
  this.imageContent;
  this.videoContent;
  // if (!ContentService.getSocialContent()) {
    ContentService.initContent()
    .then(function (response) {
      ContentService.setSocialContent(response.data);
      _socialContent = response.data;
      _this.textContent = response.data[5];
      _this.imageContent = response.data[2];
      _this.videoContent = response.data[0];
      console.log("Content in Controller: ", _socialContent);
    });
  // } else {
  //   _socialContent = ContentService.getSocialContent();
  // }

  $.fn.animateRotate = function (initial, angle, duration, easing, complete, translation) {
    translation = translation || '';
    return this.each(function() {
      var $elem = $(this);

      $({deg: initial || 0}).animate({deg: angle}, {
        duration: duration,
        easing: easing,
        step: function(now) {
          $elem.css({
             transform: 'rotate(' + now + 'deg)' + translation
           });
        },
        complete: complete || $.noop
      });
    });
  };

  $.fn.rotateReverse = function (initial, angle, duration, easing, complete) {
    return this.each(function() {
      var $elem = $(this);

      $({deg: initial || 0}).animate({deg: angle}, {
        duration: duration,
        easing: easing,
        step: function(now) {
          $elem.css({
             transform: 'rotate(-' + now + 'deg)'
           });
        },
        complete: complete || $.noop
      });
    });
  };

  $.fn.animateTranslate = function (start, end, unit, duration, easing, complete) {
    return this.each(function() {
      var $elem = $(this);

      $({ transform: start })
      .animate({ transform: end }, {
        duration: duration,
        easing: easing || 'swing',
        step: function (now) {
          $elem.css({'transform': 'translate('+now+unit+','+now+unit+')'});
        },
        complete: complete || $.noop
      });
    });
  };

}]);

angular.module('player.social')
.directive('playerEnter', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('load', function (e) {
        $(elem).animate({ left: '25px' }, 1000, function (){
          scope.$apply(function(){
            scope.startRing = true;
          });
          $('#circle1a')
          .animateRotate(0, 720, 2000)
          .animate({ opacity: '1' }, {
            duration: 1000,
            start: function () {
              $('#circle1').animate({ opacity: '1' }, 2000);
              $('.meter-pos').animate({ width: '265px' }, {
                duration: 3500,
                start: function () {
                  $('#thumbsUp').addClass('pulse');
                }
              });
            },
            complete: function () {
              $('#circle2a')
              .animateRotate(60, 780, 2000)
              .animate({ opacity: '1' }, {
                duration: 1000,
                start: function () {
                  $('#circle2').animate({ opacity: '1' }, 2000);
                },
                complete: function () {
                  $('#circle3a')
                  .animateRotate(330, 1050, 2000)
                  .animate({ opacity: '1' }, {
                    duration: 1000,
                    start: function () {
                      $('#circle3').animate({ opacity: '1' }, 2000);
                    },
                    complete: function () {
                      console.log("Circles A Complete");
                      setTimeout(function(){
                        scope.$apply(function(){
                          scope.showExpandedTweetT = true;
                        });
                      }, 7000);
                    }
                  });
                }
              });
            }
          });
          $('#circle1b')
          .rotateReverse(-25, 385, 3000)
          // .animateRotate(-25, 695, 2000)
          .animate({ opacity: '1' }, 1000, function() {
            $('#circle2b')
            // .animateRotate(60, 780, 2000)
            .rotateReverse(60, 300, 3000)
            .animate({ opacity: '1' }, 1000, function() {
              $('#circle3b')
              // .animateRotate(330, 1050, 2000)
              .rotateReverse(330, 390, 2000)
              .animate({ opacity: '1' }, 1000, function() {
                console.log("Circles B Complete");
              });
            });
          });
        });
      });
    }
  };
}])
.directive('fadeInShift', ['$sce', function ($sce) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      if (attrs.fadeInShift === 'top'){  
        $(elem).animate({ top: attrs.fadeEnd, opacity: '1' }, 1000);
      }
    }
  };
}])
.directive('rotateFadeIn', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      console.log('Attr Added ', attrs.rotateFadeIn, attrs.fadeDur);
      $(elem)
      .animateRotate(0, parseInt(attrs.rotateFadeIn), parseInt(attrs.fadeDur))
      .animate({ opacity: '1' }, 2000);
    }
  };
}])
.directive('showTweetContent', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var loadString = attrs.showTweetContent + 'Loaded';
      $('#tweet-bubble').css({
        width: attrs.sSize,
        height: attrs.sSize,
        top: attrs.sTop,
        left: attrs.sLeft
      });
      $(elem).animateTranslate(0, -1100, 'px', 3000);
      $(elem).animate({
        width: '2220px',
        height: '2220px',
        top: '50%',
        left: '50%'
      },{
        duration: 3000,
        complete: function () {
          scope.$apply(function(){
            scope[loadString] = true;
          });
        }
      });
    }
  };
}])
.directive('expires', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $timeout(function(){
        $(elem).animate({ opacity: 0 }, 2000);
        var trueScope = $('#curry-bg-2').scope();
        $timeout(function(){
          trueScope.$apply(function(){
            trueScope.showExpandedTweetT = false;
          });
        }, 3500);
      }, parseInt(attrs.expires));
    }
  };
}]);
