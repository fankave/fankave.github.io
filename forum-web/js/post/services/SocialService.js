angular.module('SocialModule')
.factory('SocialService', ["Bant", 
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var autoObserverCallbacks = [];
  var _socialArray = [];
  var _socialArrayAuto = [];
  var _offset = 0;
  var LIMIT = 20;
  var prevLength = 0;

  function setSocialData(socialData) {
    _socialArray = [];
    var tempData = socialData.data.results;
    var len = !!tempData ? tempData.length : 0;

    if (!!tempData && len > 0){
      for (var i = 0; i < len; i++){
        var _socialObject = Bant.bant(tempData[i]);
        if (!!_socialObject.id){
          var isNewObject = true;
          for (var j = 0; j < _socialArrayAuto.length; j++){
            if (_socialArrayAuto[j].id === _socialObject.id){
              isNewObject = false;
              break;
            }
          }
          _socialArray.push(_socialObject);
          if (isNewObject && socialData.rid === "social_auto"){
            _socialArrayAuto.push(_socialObject);
          }
        }
      }
      if (socialData.rid === "social"){
        _offset = socialData.data.nextOffset;
        notifyObservers();
      }
      else {
        notifyObservers(true);
      }
    }
  }

  var notifyObservers = function(autoRequest){
   if (autoRequest){
        angular.forEach(autoObserverCallbacks, function(callback){
          console.log("Notify observer in autoRequest");
          callback();
        });
      } else {
      angular.forEach(observerCallbacks, function(callback){
        callback();
      });
    }
  };

  function registerObserverCallback(callback, auto){
   //register an observer
    if (auto){
      var callbackLength = autoObserverCallbacks.length;
      while (callbackLength > 0){
        callbackLength = autoObserverCallbacks.length;
        autoObserverCallbacks.pop();
      }
      autoObserverCallbacks.push(callback);
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

  function getSocialDataRequest(id, offset){
    var reqOffset = _offset;
    var request = {
      "rid": "social",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+reqOffset)
    };
    if (NETWORK_DEBUG)
    console.log("Social Request: ", request);
    return request;
  }


  function getSocialDataRequestAuto(id){
    var request = {
      "rid": "social_auto",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+0)
    };
    if (NETWORK_DEBUG)
    console.log("Social Request Auto: ", request);
    return request;
  }

  return {
    socialArray: function(){
      return _socialArray;
    },
    resetSocialOffset: function(){
      _offset = 0;
    },
    setSocialData: setSocialData,
    getSocialDataRequest: getSocialDataRequest,
    getSocialDataRequestAuto: getSocialDataRequestAuto,
    registerObserverCallback: registerObserverCallback,
    socialArrayAutoLength: function(){
      return _socialArrayAuto.length;
    },
    getPrevLength: function(){
      return prevLength;
    },
    setPrevLength: function(length){
      prevLength = length;
    }
  };

}]); 