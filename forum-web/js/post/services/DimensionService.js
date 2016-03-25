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

  function setDimensions (elem, aspectRatio, orientation, media, mediaType) {
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

  function setOffsets(media, direction, ref){
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

  return {
    setAspectRatio: setAspectRatio,
    setDimensions: setDimensions
  };

});