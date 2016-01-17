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
.directive('mediaPlayer', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      vidSource: '@',
      vidIndex: '@'
    },
    link: function(scope,elem,attr) {

      scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      }

      scope.togglePlayPause = function(e) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisThumbnail = thesePlayerNodes[3];
        var thisPlayBtn = thesePlayerNodes[5];
        console.log("This Player: ", thisVideo, elem, thesePlayerNodes);
        console.log("This Play Button: ", thisPlayBtn);
        console.log("This Player Thumbnail: ", thisThumbnail);

        scope.loadState = thisVideo.readyState;
        if (thisVideo.paused || thisVideo.ended){
          console.log("Play");
          thisPlayBtn.className = 'pause';
          thisThumbnail.className = 'pause';
          thisVideo.play();
          if (typeof(thisVideo.webkitEnterFullscreen) !== "undefined") {
              thisVideo.webkitEnterFullscreen();
          } else if (typeof(thisVideo.webkitRequestFullscreen)  !== "undefined") {
              thisVideo.webkitRequestFullscreen();
          } else if (typeof(thisVideo.mozRequestFullScreen)  !== "undefined") {
              thisVideo.mozRequestFullScreen();
          }
        }
        else {
          console.log("Pause");
          thisPlayBtn.className = 'media-controls';
          thisThumbnail.className = 'media-thumbnail';
          thisVideo.pause();
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
        if (height > 300){
          height = '300px';
        } else {
          height = height + 'px';
        }
        // console.log("This: ", this, height);
        return height;
      }

      scope.setYOffset = function (video){
        var offset;
        if (!!video.mediaAspectFeed.y){
          offset = '-' + video.mediaAspectFeed.y + 'px';
        }
        else if (!!video.mediaAspectFull.y){
          offset = '-' + video.mediaAspectFull.y + 'px';
        }
        return offset;
      }

    },
    templateUrl: 'partials/mediaPlayer.html'
  };
}]);

