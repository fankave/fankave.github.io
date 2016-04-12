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

  $.fn.animateRotate = function (initial, angle, duration, easing, complete) {
    return this.each(function() {
      var $elem = $(this);

      $({deg: initial || 0}).animate({deg: angle}, {
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

  function moveToCenter (id, size, dur) {
    var elem = '#circle' + id;
    var dur = dur || 1000;
    $(elem)
    .css({ 'z-index': 10 })
    .animate({
      top: (540 - size / 2) + 'px',
      left: (960 - size / 2) + 'px'
    }, dur, 'swing', function(){expand(id)});
  }

  function expand (id, dur) {
    var elem = '#circle' + id;
    var dur = dur || 2000;
    $(elem)
    .css({ 'z-index': 10 })
    .animate({
      width: '1920px',
      height: '1080px',
      'border-radius': '0%',
      top: '0px',
      left: '0px'
    }, dur, 'swing', function(){animComplete(id)});
  }

  function animComplete (circle) {
    console.log('Animation Complete For Circle: ' + circle);
    var elem = '#circle' + circle;
    setTimeout(function(){$(elem).removeAttr('style')}, 1500);
  }

}]);

angular.module('player.social')
.directive('playerEnter', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('load', function (e) {
        $(elem).animate({ left: '25px' }, 2000, function (){
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
      var elements = {
        '.tweet-ring-5': '1870px',
        '.tweet-ring-4': '1836px',
        '.tweet-ring-3,.tweet-ring-3filter': '1508px',
        '.tweet-ring-2': '1368px',
        '.tweet-ring-1': '1156px'
      };
      var loadString = attrs.showTweetContent + 'Loaded';
      $('#tweet-bubble').css({
        width: attrs.sSize,
        height: attrs.sSize,
        top: attrs.sTop,
        left: attrs.sLeft
      });
      // $timeout(function(){
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
      // }, 1000);
    }
  };
}]);

