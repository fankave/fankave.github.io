angular.module('TopicModule')
.directive('imageControl',
  ['$sce',
  'URIHelper',
  'DimensionService',
  function ($sce, URIHelper, DimensionService) {
  return {
    restrict: 'E',
    scope: {
      thisPost: '='
    },
    link: function(scope,elem,attr) {
      var $el = elem[0];

      var post = scope.thisPost;
      scope.aspectRatio = DimensionService.setAspectRatio(post.mediaAspectRatio, post.mediaOrientation, 'image');
      scope.dimensions = setDimensions(post.mediaAspectRatio, post.mediaOrientation, post);

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

      function setDimensions (aspectRatio, orientation, image) {
        var thisImage = elem[0].childNodes[0];
        var thisWidth = $(thisImage).width();
        if (GEN_DEBUG){
          console.log("Image in setD: ", thisImage);
          console.log("Width in setD: ", thisWidth);
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
        if (!!image){
          styleObj['background-image'] = 'url(' + image.mediaUrl + ')';
          styleObj['background-size'] = 'cover';
          styleObj['background-position-y'] = setOffsets(image, 'y', height) || '';
          styleObj['background-position-x'] = setOffsets(image, 'x', thisWidth) || '';
        }

        if (GEN_DEBUG){
          console.log("Set Dimensions Object: ", styleObj);
        }
        return styleObj;
      }

      function setOffsets(image, direction, ref){
        var offset;
        var offsetScale; 
        if (direction === 'y'){
          if (!!image.mediaAspectFeed.y){
            offsetScale = ref / image.mediaAspectFeed.h;
            var scaledY = image.mediaAspectFeed.y * offsetScale;
            offset = '-' + scaledY + 'px';
          }
        }
        if (direction === 'x'){
          if (!!image.mediaAspectFeed.x){
            offsetScale = ref / image.mediaAspectFeed.w;
            var scaledX = image.mediaAspectFeed.x * offsetScale;
            offset = '-' + scaledX + 'px';
          }
        }
        return offset;
      }

    },
    templateUrl: 'partials/imageControl.html'
  };
}]);
