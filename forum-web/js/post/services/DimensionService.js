angular.module('TopicModule')
.factory('DimensionService', function() {

  function setAspectRatio (aspectRatio, orientation, mediaType) {
    if (GEN_DEBUG) console.log('setAspectRatio: ', aspectRatio, orientation, mediaType);
    var classStrings = [];

    if (orientation === 'portrait'){
      if (aspectRatio === 1.778){
        classStrings.push(mediaType + '-portrait-9x16');
      } else {
        classStrings.push(mediaType + '-portrait-1x2')
      }
    } else if (orientation === 'square'){
      classStrings.push(mediaType + '-square');
    } else {
      if (aspectRatio === 1.778){
        classStrings.push(mediaType + '-landscape-16x9');
      } else {
        classStrings.push(mediaType + '-landscape-2x1')
      }
    }
    return classStrings;
  }

  return {
    setAspectRatio: setAspectRatio
  };

});