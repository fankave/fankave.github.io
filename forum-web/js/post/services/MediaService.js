angular.module('SocialModule')
.factory('MediaService', ["Bant",
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var autoObserverCallbacks = [];
  var newObserverCallbacks = [];
  var _mediaArray = [];
  var _mediaArrayAuto = [];
  var _offset = 0;
  var LIMIT = 20;
  var prevLength = 0;

  function setMediaData(mediaData) {
    _mediaArray = [];
    var tempData = mediaData.data.results;
    var len = !!tempData ? tempData.length : 0;

    if (!!tempData && len > 0){
      // var newExpert = false;
      for (var i = 0; i < len; i++){
        var _mediaObject = Bant.bant(tempData[i]);
        // _mediaObject.expert = tempData[i].source.type === "Twitter:Expert" ? true : false;
        // if (!newExpert && _mediaObject.expert) newExpert = true;
        if (!!_mediaObject.id){
          var isNewObject = true;
          for (var j = 0; j < _mediaArrayAuto.length; j++){
            if (_mediaArrayAuto[j].id === _mediaObject.id){
              isNewObject = false;
              break;
            }
          }
          _mediaArray.push(_mediaObject);
          if (len === 1 && isNewObject && mediaData.rid === "media_auto"){
            if (GEN_DEBUG) console.log("$AUTO$ SINGLE REQUEST FOUND NEW media - NOTIFYING");
            notifyObservers('new');
            return;
          }
          if (isNewObject && mediaData.rid === "media_auto"){
            _mediaArrayAuto.push(_mediaObject);
          }
        }
      }
      if (mediaData.rid === "media"){
        _offset = mediaData.data.nextOffset;
        notifyObservers();
      }
      // else {
      //   if (newExpert) _newExpert = true;
      //   notifyObservers(true);
      // }
    }
  }

  var notifyObservers = function(autoRequest){
    if (autoRequest === true){
      angular.forEach(autoObserverCallbacks, function(callback){
        console.log("Notify observer in autoRequest ", callback);
        callback();
      });
    }
    else if (autoRequest === 'new'){
      angular.forEach(newObserverCallbacks, function(callback){
        console.log("Notify observer in newRequest ", callback);
        callback();
      });
    }
    else {
      angular.forEach(observerCallbacks, function(callback){
        callback();
      });
    }
  };

  function registerObserverCallback(callback, auto){
    //register an observer
    if (auto === true){
      var callbackLength = autoObserverCallbacks.length;
      while (callbackLength > 0){
        callbackLength = autoObserverCallbacks.length;
        autoObserverCallbacks.pop();
      }
      autoObserverCallbacks.push(callback);
    }
    else if (auto === 'new'){
      var callbackLength = newObserverCallbacks.length;
      while (callbackLength > 0){
        callbackLength = newObserverCallbacks.length;
        newObserverCallbacks.pop();
      }
      newObserverCallbacks.push(callback);
    }
    else {
      var callbackLength = observerCallbacks.length;
      while (callbackLength > 0){
        callbackLength = observerCallbacks.length;
        observerCallbacks.pop();
      }
      observerCallbacks.push(callback);
    }
  }

  function getMediaDataRequest(id, offset){
    var request = {
      "rid": "media",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+_offset+"&filter=media")
    };
    if (NETWORK_DEBUG)
    console.log("Media Request: ", request);
    return request;
  }

  // function getMediaDataRequestAuto(id){
  //   var request = {
  //     "rid": "media_auto",
  //     "timestamp": new Date().getTime(),
  //     "method": "GET",
  //     "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+0+"&filter=media")
  //   };
  //   if (NETWORK_DEBUG)
  //   console.log("Media Request Auto: ", request);
  //   return request;
  // }

  // function getMediaDataRequestAutoSingle(id){
  //   var request = {
  //     "rid": "media_auto",
  //     "timestamp": new Date().getTime(),
  //     "method": "GET",
  //     "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit=1&offset=0&filter=media")
  //   };
  //   if (NETWORK_DEBUG)
  //   console.log("Media Request Single Auto: ", request);
  //   return request;
  // }

  return {
    mediaArray: function(){
      return _mediaArray;
    },
    resetMediaOffset: function(){
      _offset = 0;
    },
    setMediaData:setMediaData,
    getMediaDataRequest:getMediaDataRequest,
    // getMediaDataRequestAuto:getMediaDataRequestAuto,
    // getMediaDataRequestAutoSingle:getMediaDataRequestAutoSingle,
    registerObserverCallback:registerObserverCallback
    // mediaArrayAutoLength: function(){
    //   return _mediaArrayAuto.length;
    // },
    // getPrevLength: function(){
    //   return prevLength;
    // },
    // setPrevLength: function(length){
    //   prevLength = length;
    // }
  };

}]);
