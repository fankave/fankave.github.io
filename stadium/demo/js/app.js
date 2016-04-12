$(function() {

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
    // $('#circle1b').animateRotate(0, 720, 2000, 'swing', function(){expand(1)});
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

  // barUp(1, 1500, 614);
  // barUp(2, 1500, 730);
  // barUp(3, 1500, 540);

  function moveToCenter (id, size, dur) {
    var elem = '#circle' + id;
    var dur = dur || 1000;
    $(elem)
    .animate({
      top: (540 - size / 2) + 'px',
      left: (960 - size / 2) + 'px'
    }, dur, 'swing', function(){expand(id)});
  }

  function expand (id, dur) {
    var elem = '#circle' + id;
    var dur = dur || 2000;
    $(elem)
    .css({ 'z-index': 3 })
    .animate({
      width: '1920px',
      height: '1080px',
      'border-radius': '0%',
      top: '0px',
      left: '0px'
    }, dur, 'swing', function(){animComplete(id)});
  }

  function barUp (id, dur, height) {
    var $elem = $('#bar' + id);
    var dur = dur || 1500;
    $elem.animate({ height: height + 'px' }, dur);
  }

  function animComplete (circle) {
    console.log('Animation Complete For Circle: ' + circle);
    var elem = '#circle' + circle;
    setTimeout(function(){$(elem).removeAttr('style')}, 1500);
  }

});

$(window).load(function() {
  barUp(1, 1500, 592);
  barUp(2, 1500, 720);
  barUp(3, 1500, 520);
  function barUp (id, dur, height) {
    var $elem = $('#bar' + id);
    var $player = $('#player' + id);
    var heights = ['-32px','-64px','-120px'];
    var dur = dur || 1500;
    $elem.animate({ height: height + 'px' }, dur, 'swing', function(){
      $player.animate({ top: heights[id-1] }, 200);
      if (id === 1){
        $('#trail1').animate({ top: '130px' }, 200);
      }
      else if (id === 3){
        $('#trail3').animate({ top: '-20px' }, 200);
      }
    });
  }
});