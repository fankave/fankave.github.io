angular.module('TopicModule')
.directive('mediaPlayer',
  ['$sce',
  'UserAgentService',
  'AnalyticsService',
  'DimensionService',
  function ($sce, UserAgentService, AnalyticsService, DimensionService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '=',
      vidIndex: '@'
    },
    link: function(scope,elem,attr) {

      scope.isMobileUser = UserAgentService.isMobileUser();
      var isIOS = (UserAgentService.getMobileUserAgent() === 'iOS');
      var post = scope.thisPost;

      scope.videoSource = trustSrc(post.mediaUrl);
      scope.aspectRatio = DimensionService.setAspectRatio(post.mediaAspectRatio, post.mediaOrientation, 'video');
      scope.dimensions = setDimensions(post.mediaAspectRatio, post.mediaOrientation);
      scope.posterDimensions = setDimensions(post.mediaAspectRatio, post.mediaOrientation, post);

      function trustSrc (src){
        return $sce.trustAsResourceUrl(src);
      }

      var video = elem[0].firstElementChild.childNodes[1];
      var loadingSpinner = elem[0].firstElementChild.childNodes[7];
      
      // Video Loading Event Listeners
      $(video).on('waiting', function() {
        if (GEN_DEBUG)
          console.log("Video Waiting");
        if (scope.isMobileUser && !isIOS){
          loadingSpinner.className = 'media-loading-fullscreen';
          loadingSpinner.style.zIndex = "2147483647";
        } else {
          loadingSpinner.className = 'media-loading';
        }
      });
      $(video).on('stalled', function() {
        if (GEN_DEBUG)
          console.log("Video Stalled");
        if (scope.isMobileUser && !isIOS){
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
        if (GEN_DEBUG)
          console.log("Video Playing");
        loadingSpinner.className = 'media-loading-default';
      });
      $(video).on('play', function() {
        if (GEN_DEBUG)
          console.log("Video play clicked" + scope.thisPost.id);
        if(GOOGLE_ANALYTICS === true){
        ga('send', 'event', 'Video','Play', scope.thisPost.id);
      }
        if(ANALYTICS)
        AnalyticsService.addSession('explore_video');
      });
      $(video).on('pause', function() {
        var videoLengthPlayed = Math.round(video.currentTime);
        if (GEN_DEBUG)
        console.log("Video paused" + scope.thisPost.id + ": TimePlayed " + videoLengthPlayed);
      if(GOOGLE_ANALYTICS === true){
        ga('send', 'event', 'Video','VideoLengthPlayed', scope.thisPost.id, videoLengthPlayed);
      }
        if(ANALYTICS)
        AnalyticsService.exploreSessionEvent("Video", scope.thisPost.id, scope.thisPost.type, scope.thisPost.tweetId, scope.thisPost.providerName, "tab", videoLengthPlayed);
        if(ANALYTICS_DEBUG){
          console.log(scope.thisPost);
          console.log("Video" +  "   " + scope.thisPost.id+  "   " +  scope.thisPost.type+  "   " +  scope.thisPost.tweetId+  "   " +  scope.thisPost.providerName+  "   " +  "tab");
        }
      });
       $(video).on('ended', function() {
        var videoLengthPlayed = Math.round(video.currentTime);
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

      function setDimensions (aspectRatio, orientation, video) {
        var thesePlayerNodes = elem[0].firstElementChild.childNodes;
        var thisVideo = thesePlayerNodes[1];
        var thisWidth = $(thisVideo).width();
        if (GEN_DEBUG){
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
        if (GEN_DEBUG){
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
