angular.module('TopicModule')
.directive('infiniteSegment', ['$sce', function($sce) {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs){

      // scope.trustSrc = function(src) {
      //     return $sce.trustAsResourceUrl(src);
      // }

      // scope.imageClick = function(imageURL) {
      //   event.cancelBubble = true;
      //   if(event.stopPropagation) event.stopPropagation();

      //   $.magnificPopup.open({
      //     items: {
      //       type:'image',
      //       src: imageURL,
      //     },
      //     type: 'inline',
      //     callbacks: {
      //       open: function() {
      //         console.log("popup opened");
      //         $('body').bind('touchmove', function(e){e.preventDefault()})
      //       },
      //       close: function() {
      //         console.log("popup closed");
      //         $('body').unbind('touchmove')
      //       }
      //     }
      //   });
      // }
    },
    templateUrl: function(elem, attrs) {
      if (attrs.env === 'chat'){
        return 'partials/chatInfiniteSegment.html';
      } else if (attrs.env === 'video'){
        return 'partials/videoInfiniteSegment.html';
      } else if (attrs.env === 'social'){
        return 'partials/socialInfiniteSegment.html';
      }
    }
  }
}]);