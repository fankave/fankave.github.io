angular.module('TopicModule')
.directive('embedPlayer',
  ['$sce',
  'UserAgentService',
  'DimensionService',
  function ($sce, UserAgentService, DimensionService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '='
    },
    link: function(scope,elem,attr) {

      var isMobileUser = UserAgentService.isMobileUser();
      var post = scope.thisPost;
      scope.embedHtml = trustSrcHtml(post.embedHtml);
      scope.aspectRatio = DimensionService.setAspectRatio(post.mediaAspectRatio, post.mediaOrientation, 'video');
      scope.dimensions = DimensionService.setDimensions(elem, post.mediaAspectRatio, post.mediaOrientation, 'embed', isMobileUser);

      function trustSrcHtml (src){
        return $sce.trustAsHtml(src);
      }

    },
    templateUrl: 'partials/embedPlayer.html'
  };
}]);