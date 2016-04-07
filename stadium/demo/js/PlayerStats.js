angular.module('player.stats', [])
.controller('ctrl.player-stats', ['$http','$timeout',
function ($http, $timeout) {

  var _this = this;

  function barUp (id, dur, height) {
    var $elem = $('#bar' + id);
    var $player = $('#player' + id);
    var heights = ['-32px','-64px','-120px'];
    var dur = dur || 1500;
    $elem
    .css({ visibility: 'visible' })
    .animate({ height: height + 'px' }, dur, 'swing', function(){
      $player.animate({ top: heights[id-1] }, 200);
      if (id === 1){
        $('#trail1').animate({ top: '130px' }, 200);
      }
      else if (id === 3){
        $('#trail3').animate({ top: '-20px' }, 200);
      }
    });
  }
  $timeout(function(){
    barUp(1, 1500, 592);
    barUp(2, 1500, 720);
    barUp(3, 1500, 520);
  }, 1000);

}]);
