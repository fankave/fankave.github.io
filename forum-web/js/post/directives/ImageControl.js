angular.module('TopicModule')
.directive('imageControl',
  ['$sce',
  'URIHelper',
  'DimensionService',
  'UserAgentService',
  function ($sce, URIHelper, DimensionService, UserAgentService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '='
    },
    link: function(scope,elem,attr) {
      var $el = elem[0];

      var post = scope.thisPost;
      var isMobileUser = UserAgentService.isMobileUser();
      scope.aspectRatio = DimensionService.setAspectRatio(post.mediaAspectRatio, post.mediaOrientation, 'image');
      scope.dimensions = DimensionService.setDimensions(elem, post.mediaAspectRatio, post.mediaOrientation, 'image', isMobileUser, post);

      scope.imageClick = function(imageURL) {

        $.magnificPopup.open({
          items: {
            type:'image',
            src: imageURL
          },
          type: 'inline',
          callbacks: {
            open: function(){
              $('body').bind('touchmove', function(e){e.preventDefault()});
              if (URIHelper.embedded()){
                console.log("MFP: ", $('.mfp-content').offset(), " DOC: ", $el.getBoundingClientRect().top);
                if ($('.mfp-content').offset() !== $el.getBoundingClientRect().top){
                  console.log("Shifting MFP");
                  $('.mfp-content').offset({ top: $el.getBoundingClientRect().top - 100 });
                }
              }
            },
            close: function(){
              $('body').unbind('touchmove');
            }
          }
        });
      }

    },
    templateUrl: 'partials/imageControl.html'
  };
}]);
