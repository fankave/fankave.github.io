angular.module('player.social', [])
.controller('ctrl.player-social', [
  '$http',
  '$timeout',
  'ContentService',
function ($http, $timeout, ContentService) {

  var _this = this;
  this.showExpandedTweet = false;

  this.textContent;
  this.imageContent;
  this.videoContent;
  this.currentContent;
  // if (!ContentService.getSocialContent()) {
    ContentService.initContent()
    .then(function (response) {
      ContentService.setSocialContent(response.data);
      _this.textContent = response.data[5];
      _this.imageContent = response.data[2];
      _this.videoContent = response.data[1];
      _this.currentContent = _this.textContent.embed;
    });
  // } else {
  //   _socialContent = ContentService.getSocialContent();
  // }
  

  this.cycleCount = 0;
  this.scheduleNextContent = function (delay) {
    _this.cycleCount++;
    if (_this.cycleCount === 1){
      _this.currentContent = _this.imageContent.embed;
    } else if (_this.cycleCount === 2){
      _this.currentContent = _this.videoContent.embed;
    }
    console.log("Scheduling Next In: ", delay);
    $timeout(function(){
      if (_this.cycleCount === 1){
        _this.showExpandedImage = true;
      } else if (_this.cycleCount === 2){
        _this.showExpandedVideo = true;
      }
    }, delay);
  };

  this.hidePrevContent = function () {
    console.log("Hiding Previous");
    if (_this.cycleCount === 0) {
      _this.showExpandedTweet = false;
    } else if (_this.cycleCount === 1) {
      _this.showExpandedImage = false;
    } else if (_this.cycleCount === 2) {
      _this.showExpandedVideo = false;
    }
  };

  $.fn.animateRotate = function (initial, angle, duration, easing, complete, translation) {
    translation = translation || '';
    return this.each(function() {
      var $elem = $(this);

      $({deg: initial || 0}).animate({deg: angle}, {
        duration: duration,
        easing: easing,
        step: function(now) {
          $elem.css({
             '-webkit-transform': 'rotate(' + now + 'deg)',
             'transform': 'rotate(' + now + 'deg)'
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
             '-webkit-transform': 'rotate(-' + now + 'deg)',
             'transform': 'rotate(-' + now + 'deg)'
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
          $elem.css({
            '-webkit-transform': 'translate('+now+unit+','+now+unit+')',
            'transform': 'translate('+now+unit+','+now+unit+')'
          });
        },
        complete: complete || $.noop
      });
    });
  };

  $.fn.countUp = function (duration, initial, final, easing, complete) {
    return this.each(function () {
      var $this = $(this);
      var stepFn = function(num){return Math.floor(num);};
      $({ Counter: initial || 0 }).animate({ Counter: final || $this.text() }, {
        duration: duration,
        easing: easing || 'swing',
        step: function () {
          $this.text(stepFn(this.Counter));
        },
        complete: complete || $.noop
      });
    });
  };

}]);

angular.module('player.social')
.directive('playerEnter', ['$compile', '$timeout', function ($compile, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('load', function (e) {
        $(elem).animate({ left: '25px' }, 1000, function (){
          scope.$apply(function(){
            scope.startRing = true;
          });
          $('#circle1a')
          .animateRotate(0, 720, 3000)
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
              .animateRotate(60, 780, 3000)
              .animate({ opacity: '1' }, {
                duration: 1000,
                start: function () {
                  $('#circle2').animate({ opacity: '1' }, 2000);
                },
                complete: function () {
                  $('#circle3a')
                  .animateRotate(330, 1050, 3000)
                  .animate({ opacity: '1' }, {
                    duration: 1000,
                    start: function () {
                      $('#circle3').animate({ opacity: '1' }, 2000);
                    },
                    complete: function () {
                      var trueScope = $('#curry-bg-2').scope();
                      setTimeout(function(){
                        trueScope.$apply(function(){
                          trueScope.psocial.showExpandedTweet = true;
                        });
                      }, 7500);
                      $timeout(function(){fillSpace();}, 1500);
                    }
                  });
                }
              });
            }
          });
          $('#circle1b')
          .animateRotate(-25, 695, 3000)
          .animate({ opacity: '1' }, 1000, function() {
            $('#circle2b')
            .animateRotate(60, 780, 3000)
            .animate({ opacity: '1' }, 1000, function() {
              $('#circle3b')
              .animateRotate(330, 1050, 3000)
              .animate({ opacity: '1' }, 1000, function() {
              });
            });
          });
        });
      });
      
      function fillSpace () {
        $('.pace-value-hundreds').countUp(7000, 234, 243, 'linear');
        $('.stat-num1').countUp(4000, 40, 43, 'linear');
        $('#circle1a').animateRotate(0, 40, 4000);
        $('#circle1b').animateRotate(-25, 15, 4000);

        $('.stat-num2').countUp(5000, 619, 625, 'linear', function () {
          $('.stat-num3').countUp(1000, 9, 8);
          $('#circle3a').rotateReverse(390, 365, 1000);
          $('#circle3b').rotateReverse(390, 365, 1000);
        });
        $('#circle2a').animateRotate(60, 110, 5000);
        $('#circle2b').animateRotate(60, 110, 5000);
      }
    }
  };
}]);
angular.module('player.social')
.directive('fadeInShift', ['$sce', function ($sce) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      if (attrs.fadeInShift === 'top'){  
        $(elem).animate({ top: attrs.fadeEnd, opacity: '1' }, 1000);
      } else {
        $(elem).animate({ opacity: '1' }, parseInt(attrs.fadeInShift));
      }
    }
  };
}]);
angular.module('player.social')
.directive('rotateFadeIn', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $(elem)
      .animateRotate(0, parseInt(attrs.rotateFadeIn), parseInt(attrs.fadeDur))
      .animate({ opacity: '1' }, 2000);
    }
  };
}]);
angular.module('player.social')
.directive('rotate', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $(elem)
      .animateRotate(0, 720, 20000, 'linear');
    }
  };
}]);
angular.module('player.social')
.directive('showTweetContent', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var loadString = attrs.showTweetContent + 'Loaded';
      $(elem).css({
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
          var trueScope = $('#curry-bg-2').scope();
          if (attrs.videoC) {
            trueScope.$apply(function(){
              trueScope.psocial.videoCLoaded = true;
            });
          } else {
            scope.$apply(function(){
              scope[loadString] = true;
            });
          }
        }
      });
    }
  };
}]);
angular.module('player.social')
.directive('expires', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $timeout(function(){
        $(elem).animate({ opacity: 0 }, 2000);
        var trueScope = $('#curry-bg-2').scope();
        $timeout(function(){
          trueScope.$apply(function(){
            trueScope.psocial.hidePrevContent();
          });
          if (trueScope.psocial.cycleCount < 3){
            trueScope.psocial.scheduleNextContent(2500);
          }
        }, 3500);
      }, parseInt(attrs.expires));
    }
  };
}]);
