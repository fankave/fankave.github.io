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

      var isMobileUser = UserAgentService.isMobileUser();
      var isIOS = (UserAgentService.getMobileUserAgent() === 'iOS');
      var post = scope.thisPost;

      scope.videoSource = trustSrc(post.mediaUrl);
      scope.aspectRatio = DimensionService.setAspectRatio(post.mediaAspectRatio, post.mediaOrientation, 'video');
      scope.dimensions = DimensionService.setDimensions(elem, post.mediaAspectRatio, post.mediaOrientation, 'video', isMobileUser);
      scope.posterDimensions = DimensionService.setDimensions(elem, post.mediaAspectRatio, post.mediaOrientation, 'video', isMobileUser, post);

      function trustSrc (src){
        return $sce.trustAsResourceUrl(src);
      }

      var video = elem[0].firstElementChild.childNodes[1];
      var loadingSpinner = elem[0].firstElementChild.childNodes[7];
      
      // Video Loading Event Listeners
      $(video).on('waiting', function() {
        if (GEN_DEBUG)
          console.log("Video Waiting");
        if (isMobileUser && !isIOS){
          loadingSpinner.className = 'media-loading-fullscreen';
          loadingSpinner.style.zIndex = "2147483647";
        } else {
          loadingSpinner.className = 'media-loading';
        }
      });
      $(video).on('stalled', function() {
        if (GEN_DEBUG)
          console.log("Video Stalled");
        if (isMobileUser && !isIOS){
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
          if (isMobileUser){
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

    },
    templateUrl: 'partials/mediaPlayer.html'
  };
}]);
