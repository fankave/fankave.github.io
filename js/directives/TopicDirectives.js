angular.module('TopicModule')
.directive('repeatFinishedNotify', function () {
  return function (scope, element, attrs) {
    if (scope.$last){
      // scope.scrollToBookmark();
      console.log("DONE LOADING COMMENTS");
      scope.hideLoading();
      scope.setLinksOnComments();
      scope.setDocVars();
      scope.continueToExperience('smartS');
      // scope.loadRemainingCommentsTimeout();
    }
  };
});

angular.module('TopicModule')
.directive('embedSharedContent', ['UserAgentService',
  function (UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=embedPost',
      imageZoom: '&',
      trustSource: '&',
      preventNav: '&'      
    },
    link: function(scope,elem,attr){
      scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
    },
    templateUrl: 'partials/shared.html'
  };
}]);

angular.module('TopicModule')
.directive('mediaPlayer', function () {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      vidSource: '@',
      vidIndex: '@'
    },
    link: function(scope,elem,attr){
      scope.togglePlayPause = function(e){
        var thisPlayer = angular.element(e.srcElement);
        var thisPlayBtn = angular.element(e.srcElement.nextSibling.nextSibling);
        console.log("This Player: ", thisPlayer, thisPlayBtn);

        // var playBtns = document.getElementsByClassName('play-pause-button');
        // var clickedBtn = playBtns[vidIndex];
        // console.log("User Clicked Play: ", clickedBtn, "@ Index: ", vidIndex);

        if (thisPlayer[0].paused || thisPlayer[0].ended){
          console.log("Play");
          // clickedBtn.title = 'pause';
          thisPlayBtn[0].className = 'pause';
          thisPlayer[0].play();
        }
        else {
          console.log("Pause");
          // clickedBtn.title = 'play';
          thisPlayBtn[0].className = 'media-controls';
          thisPlayer[0].pause();
        }
      }
    },
    templateUrl: 'partials/mediaPlayer.html'
  };
});

