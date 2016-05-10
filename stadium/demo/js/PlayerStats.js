angular.module('player.stats', [])
.controller('ctrl.player-stats', ['$http','$timeout',
function ($http, $timeout) {

  var _this = this;

  function roundToTenths (num) {
    return Math.max(Math.round(num * 10) / 10).toFixed(1);
  }

  $.fn.countUp = function (duration, easing, complete) {
    return this.each(function () {
      var $this = $(this);
      var stepFn;
      if ($this.text().indexOf('.') === -1) {
        stepFn = function(num){return Math.ceil(num);};
      } else {
        stepFn = function(num){return Math.max(Math.round(num * 10) / 10).toFixed(1);};
      }
      $({ Counter: 0 }).animate({ Counter: $this.text() }, {
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
angular.module('player.stats')
.directive('barUp', function() {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $(elem)
      .css({ visibility: 'visible' })
      .animate({ height: attrs.barUp }, {
        duration: 800,
        easing: 'swing',
        start: function () {
          $('#'+attrs.assetId)
          .css({ visibility: 'visible' })
          .animate({ top: attrs.playerEnd }, {
            duration: 900,
            easing: 'swing'
          });
        },
        complete: function () {
          var trueScope = $('#curry-bg-1').scope();
          scope.$apply(function(){
            trueScope[attrs.triggerNext] = true;
          });
        }
      });
    }
  };
});
angular.module('player.stats')
.directive('countUp', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $(elem).countUp(parseInt(attrs.countUp));
    }
  }
});
angular.module('player.stats')
.directive('triggerStart', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      elem.bind('load', function(e) {
        scope.$apply(function(){
          scope[attrs.triggerStart] = true;
        });
      });
    }
  }
});
angular.module('player.stats')
.directive('enterFromRight', ['$timeout', '$state',
function ($timeout, $state) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      $(elem).animate({
        opacity: '1',
        left: '1315px'
      }, {
        duration: 1500,
        complete: function () {
          // $timeout(function(){
          //   $state.go($state.current, {}, {reload: true});
          // }, 10000);
        }
      });
    }
  }
}]);
