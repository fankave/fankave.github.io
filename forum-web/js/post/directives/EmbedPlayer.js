angular.module('TopicModule')
.directive('embedPlayer', ['$sce', 'UserAgentService',
  function ($sce, UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '='
    },
    link: function(scope,elem,attr) {

      var isMobileUser = UserAgentService.isMobileUser();
      var post = scope.thisPost;
      scope.embedHtml = trustSrcHtml(post.embedHtml);
      scope.aspectRatio = setAspectRatio(post.mediaAspectRatio, post.mediaOrientation);
      scope.dimensions = setDimensions(post.mediaAspectRatio, post.mediaOrientation);

      // setTimeout(function(){twttr.widgets.load();},30);

      function trustSrcHtml (src){
        return $sce.trustAsHtml(src);
      }

      function setAspectRatio (aspectRatio, orientation) {
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

      function setDimensions (aspectRatio, orientation) {
        var thesePlayerNodes = elem[0].childNodes;
        var thisVideo = thesePlayerNodes[0];
        var thisWidth = $(thisVideo).width();
        if (GEN_DEBUG){
          console.log("PlayerNodes in setD: ", thesePlayerNodes);
          console.log("Video in setD: ", thisVideo, thisVideo.childNodes);
          console.log("Width in setD: ", thisWidth);
        }

        // Width Contingencies (landscape)
        if (isMobileUser && aspectRatio === 1 && thisWidth > 380){
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

        var height = thisWidth / aspectRatio;

        // Height Contingencies (portrait)
        if ((aspectRatio === 1.778 || aspectRatio === 2) && height > 300){
          height = 300;
        }

        var iframePlayer;
        // 0-second timeout ensures element exists before we manipulate it
        setTimeout(function(){
          iframePlayer = thisVideo.childNodes[0];
          $(iframePlayer).css('height',height);
          if (GEN_DEBUG) console.log("Setting Height On: ", iframePlayer, height);
          twttr.widgets.load();
        }, 0);
      }

    },
    templateUrl: 'partials/embedPlayer.html'
  };
}]);