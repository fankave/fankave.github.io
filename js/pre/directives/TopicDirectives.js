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
.directive('mediaPlayer', ['$sce', 'UserAgentService',
  function ($sce, UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      vidSource: '@',
      vidIndex: '@'
    },
    link: function(scope,elem,attr) {

      scope.isMobileUser = UserAgentService.isMobileUser();
      scope.loading = false;

      scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      }

      var video = elem[0].firstElementChild.childNodes[1];
      console.log("Top Scope Video: ", video);
      $(video).on('canplay', function() {
        console.log("Video Loaded");
        scope.loading = false;
      });

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
        if (NETWORK_DEBUG){
          console.log("Elem in setD: ", elem);
          console.log("PlayerNodes in setD: ", thesePlayerNodes);
          console.log("Video in setD: ", thisVideo);
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
          styleObj['background-position-y'] = scope.setYOffset(video);
        }
        if (NETWORK_DEBUG){
          console.log("Set Dimensions Object: ", styleObj);
        }
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

