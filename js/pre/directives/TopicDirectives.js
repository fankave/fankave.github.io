angular.module('TopicModule')
.directive('secure', ['$location','$window','UserInfoService',
  function ($location, $window, UserInfoService) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs){
        console.log("!!!Secure Elem: ", UserInfoService.isGuestUser(), elem, attrs);
        var element = elem[0];
        $(element).on('click', function(e){
          console.log("!!!Secure Element Clicked- ", UserInfoService.isGuestUser());
          e.preventDefault();
          if (UserInfoService.isGuestUser()){
            if (HTML5_LOC){
              $location.path("/login");
            } else {
              $window.location = "#/login";
            }
          } else {
            attrs['secure']();
          }
        });
      }
    }
}]);

angular.module('TopicModule')
.directive('repeatFinishedNotify', function () {
  return function (scope, element, attrs) {
    if (scope.$last){
      // scope.scrollToBookmark();
      // console.log("DONE LOADING COMMENTS");
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
      vidIndex: '@'
    },
    link: function(scope,elem,attr) {

      scope.isMobileUser = UserAgentService.isMobileUser();

      scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      }

      var video = elem[0].firstElementChild.childNodes[1];
      var loadingSpinner = elem[0].firstElementChild.childNodes[7];
      
      // Video Loading Event Listeners
      $(video).on('waiting', function() {
        if (NETWORK_DEBUG)
          console.log("Video Waiting");
        if (scope.isMobileUser){
          loadingSpinner.className = 'media-loading-fullscreen';
          loadingSpinner.style.zIndex = "2147483647";
        } else {
          loadingSpinner.className = 'media-loading';
        }
      });
      $(video).on('stalled', function() {
        if (NETWORK_DEBUG)
          console.log("Video Stalled");
        if (scope.isMobileUser){
          loadingSpinner.className = 'media-loading-fullscreen';
          loadingSpinner.style.zIndex = "2147483647";
        } else {
          loadingSpinner.className = 'media-loading';
        }
      });
      var canPlay;
      $(video).on('canplay', function() {
        canPlay = true;
      });
      $(video).on('playing', function() {
        if (NETWORK_DEBUG)
          console.log("Video Playing");
        loadingSpinner.className = 'media-loading-default';
      });

      scope.togglePlayPause = function(e) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisThumbnail = thesePlayerNodes[3];
        var thisPlayBtn = thesePlayerNodes[5];
        var thisLoading = thesePlayerNodes[7];

        if (thisVideo.paused || thisVideo.ended){
          thisPlayBtn.className = 'pause';
          thisThumbnail.className = 'pause';
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
          thisLoading.className = 'media-loading-default';
          thisPlayBtn.className = 'media-controls';
          thisThumbnail.className = 'media-thumbnail';
          thisVideo.pause();
        }
      }

      scope.setAspectRatio = function (aspectRatio, orientation) {
        if (NETWORK_DEBUG){
          // console.log("setAspectRatio: ", aspectRatio, orientation);
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
          // console.log("Elem in setD: ", elem);
          // console.log("PlayerNodes in setD: ", thesePlayerNodes);
          // console.log("Video in setD: ", thisVideo);
          // console.log("Width in setD: ", thisWidth);
        }

        // Width Contingencies (landscape)
        if (scope.isMobileUser && aspectRatio === 1 && thisWidth > 380){
          thisWidth = 381;
        } else if (aspectRatio === 1 && thisWidth > 300){
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
          // console.log("Set Dimensions Object: ", styleObj);
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
    templateUrl: 'partials/mediaPlayer.html'
  };
}]);

