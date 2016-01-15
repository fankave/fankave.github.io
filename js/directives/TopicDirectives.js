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
    link: function(scope,elem,attr) {

      scope.togglePlayPause = function(e) {
        var thisPlayer = angular.element(e.srcElement);
        var thisPlayBtn = angular.element(e.srcElement.nextElementSibling.nextElementSibling);
        var thisThumbnail = angular.element(e.srcElement.nextElementSibling);
        console.log("This Player: ", thisPlayer);
        console.log("This Play Button: ", thisPlayBtn);
        console.log("This Player Thumbnail: ", thisThumbnail);

        if (thisPlayer[0].paused || thisPlayer[0].ended){
          console.log("Play");
          thisPlayBtn[0].className = 'pause';
          thisThumbnail[0].className = 'pause';
          thisPlayer[0].play();
        }
        else {
          console.log("Pause");
          thisPlayBtn[0].className = 'media-controls';
          thisThumbnail[0].className = 'media-thumbnail';
          thisPlayer[0].pause();
        }
      }

      scope.setAspectRatio = function (aspectRatio, orientation) {
        console.log("setAspectRatio: ", aspectRatio, orientation);
        var classStrings = [];
        // Set Aspect Ratio Class
        if (aspectRatio === 1){
          classStrings.push("thumb1x1");
        } else if (aspectRatio === 1.778){
          classStrings.push("thumb16x9");
        } else if (aspectRatio === 2){
          classStrings.push("thumb2x1");
        }
        // Set Orientation Class
        if (orientation === "portrait"){
          classStrings.push("video-portrait");
        } else {
          classStrings.push("video-landscape");
        }
        return classStrings;
      }

      scope.getContainerHeight = function (aspectRatio) {
        var _this = this;
        var height = document.documentElement.clientWidth / aspectRatio;
        height = height + 'px';
        console.log("This: ", this, height);
        return height;
      }

      scope.clickLayerBelow = function (e) {
        var nextLayer = angular.element(e.srcElement.previousElementSibling);
        console.log("Next Layer Below: ", nextLayer);
        $(nextLayer[0]).click();
      }

    },
    templateUrl: 'partials/mediaPlayer.html'
  };
});

