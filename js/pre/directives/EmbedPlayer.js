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

      scope.trustSrcHtml = function(src){
        return $sce.trustAsHtml(src);
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
        var thesePlayerNodes = elem[0].childNodes;
        var thisVideo = thesePlayerNodes[0];
        var thisWidth = $(thisVideo).width();
        if (NETWORK_DEBUG){
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

        var height = thisWidth / aspectRatio;

        // Height Contingencies (portrait)
        if ((aspectRatio === 1.778 || aspectRatio === 2) && height > 300){
          height = 300;
        }

        var iframePlayer = thisVideo.childNodes[0];
        $(iframePlayer).css('height',height);
        if (NETWORK_DEBUG){
          console.log("Setting Height On: ", iframePlayer, height);
        }
      }

    },
    templateUrl: 'partials/embedPlayer.html'
  };
}]);