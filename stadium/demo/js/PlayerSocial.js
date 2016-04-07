angular.module('player.social', [])
.controller('ctrl.player-social', ['$http',
function ($http) {

  var _this = this;

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

  $('#btn1').on('click', function (event) {
    console.log('Trigger Circle 1 Animation');
    $('#ring-filter').animateRotate(0, 1440, 12000);
  });

  $('#btn2').on('click', function (event) {
    console.log('Trigger Circle 2 Animation');
    $('#circle1a').animateRotate(0, 720, 2000);
    $('#circle1b').animateRotate(-25, 695, 2000);
  });

  $('#btn3').on('click', function (event) {
    console.log('Trigger Circle 3 Animation');
    $('#circle3a').animateRotate(330, 1050, 2000);
    $('#circle3b').animateRotate(330, 1050, 2000, 'swing', function(){moveToCenter(3, 244)});
  });

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
