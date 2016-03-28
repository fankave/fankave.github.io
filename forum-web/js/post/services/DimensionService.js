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

  function setDimensions (elem, aspectRatio, orientation, mediaType, isMobileUser, media) {
    var thisMedia;
    if (mediaType === 'video'){
      thisMedia = elem[0].firstElementChild.childNodes[1];
    }
    else if (mediaType === 'embed' || mediaType === 'image'){
      thisMedia = elem[0].childNodes[0];
    }
    var thisWidth = $(thisMedia).width();

    if (GEN_DEBUG){
      console.log("SET DIM ", mediaType, thisMedia, thisWidth);
      // console.log("PlayerNodes in setD: ", thesePlayerNodes);
      // console.log("Video in setD: ", thisVideo);
      // console.log("Width in setD: ", thisWidth);
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

    var styleObj = {};
    var height = thisWidth / aspectRatio;

    // Height Contingencies (portrait)
    if ((aspectRatio === 1.778 || aspectRatio === 2) && height > 300){
      height = 300;
    }

    if (mediaType === 'embed'){
      setTimeout(function(){
        var iframePlayer = thisMedia.childNodes[0];
        $(iframePlayer).css('height', height);
        if (GEN_DEBUG) console.log("Setting Height On: ", iframePlayer, height);
        twttr.widgets.load();
      }, 0);
    }
    else {
      styleObj['height'] = height;
    }

    if (!!media){
      if (mediaType === 'video'){
        styleObj['background-image'] = 'url(' + media.mediaThumbUrl + ')';
      } else {
        styleObj['background-image'] = 'url(' + media.mediaUrl + ')';
      }
      styleObj['background-size'] = 'cover';
      styleObj['background-position-y'] = setOffsets(media, 'y', height) || '';
      styleObj['background-position-x'] = setOffsets(media, 'x', thisWidth) || '';
    }

    return styleObj;
  }

  function setOffsets(media, direction, ref){
    var offset;
    var offsetScale; 
    if (direction === 'y'){
      if (!!media.mediaAspectFeed.y){
        offsetScale = ref / media.mediaAspectFeed.h;
        var scaledY = media.mediaAspectFeed.y * offsetScale;
        offset = '-' + scaledY + 'px';
      }
    }
    if (direction === 'x'){
      if (!!media.mediaAspectFeed.x){
        offsetScale = ref / media.mediaAspectFeed.w;
        var scaledX = media.mediaAspectFeed.x * offsetScale;
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