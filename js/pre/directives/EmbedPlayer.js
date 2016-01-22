angular.module('TopicModule')
.directive('embedPlayer', ['$sce', 'UserAgentService',
  function ($sce, UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '='
    },
    link: function(scope,elem,attr) {

      scope.isMobileUser = UserAgentService.isMobileUser();

      scope.togglePlayPause = function(e) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisThumbnail = thesePlayerNodes[3];
        var thisPlayBtn = thesePlayerNodes[5];
        var thisLoading = thesePlayerNodes[7];
        // console.log("This Player: ", thisVideo, $(thisVideo).width(), thesePlayerNodes);
        // console.log("This Play Button: ", thisPlayBtn);
        // console.log("This Player Thumbnail: ", thisThumbnail);

        scope.loadState = thisVideo.readyState;
        if (thisVideo.paused || thisVideo.ended){
          // console.log("Play");
          thisPlayBtn.className = 'pause';
          thisThumbnail.className = 'pause';
          scope.loading = true;
          thisVideo.play();
          if (scope.isMobileUser){
            if (thisVideo.requestFullscreen){
              thisVideo.requestFullscreen();
            } else if (thisVideo.webkitRequestFullscreen){
              thisVideo.webkitRequestFullscreen();
            } else if (thisVideo.mozRequestFullScreen){
              thisVideo.mozRequestFullScreen();
            } else if (thisVideo.msRequestFullscreen){
              thisVideo.msRequestFullscreen();
            }
          }
        }
        else {
          // console.log("Pause");
          scope.loading = false;
          thisPlayBtn.className = 'media-controls';
          thisThumbnail.className = 'media-thumbnail';
          thisVideo.pause();
        }
      }

      scope.setAspectRatio = function (aspectRatio, orientation) {
        if (NETWORK_DEBUG){
          console.log("setAspectRatio: ", aspectRatio, orientation);
        }
        var classStrings = [];

        // if (orientation === "portrait"){
        //   if (aspectRatio === 1.778){
        //     classStrings.push("video-portrait-9x16");
        //   } else {
        //     classStrings.push("video-portrait-1x2")
        //   }
        // } else if (orientation === "square"){
        //   classStrings.push("video-square");
        // } else {
        //   if (aspectRatio === 1.778){
        //     classStrings.push("video-landscape-16x9");
        //   } else {
        //     classStrings.push("video-landscape-2x1")
        //   }
        // }
        return classStrings;
      }

      scope.setDimensions = function (aspectRatio, orientation, video) {
        // var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        // var thisVideo = thesePlayerNodes[1];
        var thisWidth = $(elem).width();
        if (NETWORK_DEBUG){
          console.log("Elem in setD: ", elem);
          // console.log("PlayerNodes in setD: ", thesePlayerNodes);
          // console.log("Video in setD: ", thisVideo);
          console.log("Width in setD: ", thisWidth);
        }

        // Width Contingencies (landscape)
        if (aspectRatio === 1 && thisWidth > 300){
          thisWidth = 300;
        }
        if (aspectRatio === 1.778 && thisWidth > 533){
          thisWidth = 533;
        }
        if (aspectRatio === 2 && thisWidth > 600){
          thisWidth = 600;
        }

        var styleObj = {};
        var height = thisWidth / aspectRatio;

        // Height Contingencies (portrait)
        if ((aspectRatio === 1.778 || aspectRatio === 2) && height > 300){
          height = 300;
        }

        styleObj['height'] = height;
        if (!!video){
          styleObj['background-image'] = 'url(' + video.mediaThumbUrl + ')';
          styleObj['background-size'] = 'cover';
          styleObj['background-position-y'] = setYOffset(video);
          styleObj['background-position-x'] = setXOffset(video);
        }
        if (NETWORK_DEBUG){
          console.log("Set Dimensions Object: ", styleObj);
        }
        return styleObj;
      }

      function setYOffset(video){
        var offset;
        if (!!video.mediaAspectFeed.y){
          offset = '-' + video.mediaAspectFeed.y + 'px';
        }
        else if (!!video.mediaAspectFull.y){
          offset = '-' + video.mediaAspectFull.y + 'px';
        }
        return offset;
      }

      function setXOffset(video){
        var offset;
        if (!!video.mediaAspectFeed.x){
          offset = '-' + video.mediaAspectFeed.x + 'px';
        }
        else if (!!video.mediaAspectFull.x){
          offset = '-' + video.mediaAspectFull.x + 'px';
        }
        return offset;
      }

    },
    templateUrl: 'partials/embedPlayer.html'
  };
}]);