angular.module('PostModule')
.directive('mediaPlayer', ['$sce', 'UserAgentService', function ($sce, UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      vidSource: '@',
      vidIndex: '@'
    },
    link: function(scope,elem,attr) {

      scope.isMobileUser = UserAgentService.isMobileUser();
      
      scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      }

      scope.togglePlayPause = function(e) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisThumbnail = thesePlayerNodes[3];
        var thisPlayBtn = thesePlayerNodes[5];
        // console.log("This Player: ", thisVideo, $(thisVideo).width(), thesePlayerNodes);
        // console.log("This Play Button: ", thisPlayBtn);
        // console.log("This Player Thumbnail: ", thisThumbnail);

        scope.loadState = thisVideo.readyState;
        if (thisVideo.paused || thisVideo.ended){
          // console.log("Play");
          thisPlayBtn.className = 'pause';
          thisThumbnail.className = 'pause';
          thisVideo.play();
          if (scope.isMobileUser){
            if (typeof(thisVideo.webkitEnterFullscreen) !== "undefined") {
                thisVideo.webkitEnterFullscreen();
            } else if (typeof(thisVideo.webkitRequestFullscreen)  !== "undefined") {
                thisVideo.webkitRequestFullscreen();
            } else if (typeof(thisVideo.mozRequestFullScreen)  !== "undefined") {
                thisVideo.mozRequestFullScreen();
            }
          }
        }
        else {
          // console.log("Pause");
          thisPlayBtn.className = 'media-controls';
          thisThumbnail.className = 'media-thumbnail';
          thisVideo.pause();
        }
      }

      scope.setAspectRatio = function (aspectRatio, orientation) {
        console.log("setAspectRatio: ", aspectRatio, orientation);
        var classStrings = [];

        if (orientation === "portrait"){
          if (aspectRatio === 1.778){
            classStrings.push("video-portrait-9x16");
          } else {
            classStrings.push("video-portrait-1x2")
          }
        } else if (orientation === "square"){
          classStrings.push("video-square");
        } else {
          if (aspectRatio === 1.778){
            classStrings.push("video-landscape-16x9");
          } else {
            classStrings.push("video-landscape-2x1")
          }
        }
        return classStrings;
      }

      scope.setDimensions = function (aspectRatio, orientation, video) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisWidth = $(thisVideo).width();
        console.log("Elem in setD: ", elem);
        console.log("PlayerNodes in setD: ", thesePlayerNodes);
        console.log("Video in setD: ", thisVideo);
        console.log("Width in setD: ", thisWidth);

        var styleObj = {};
        var height = thisWidth / aspectRatio;
        styleObj['height'] = height;
        if (!!video){
          styleObj['background-image'] = 'url(' + video.mediaThumbUrl + ')';
          styleObj['background-size'] = 'cover';
          styleObj['background-position-y'] = scope.setYOffset(video);
        }
        console.log("Set Dimensions Object: ", styleObj);
        return styleObj;
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