angular.module('SocialModule')
.factory('SocialService', ["Bant", 
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var autoObserverCallbacks = [];
  var newObserverCallbacks = [];
  var _socialArray = [];
  var _socialArrayAuto = [];
  var _offset = 0;
  var LIMIT = 20;
  var prevLength = 0;

  var _newExpert = false;
  var _newMedia = false;

  function setSocialData(socialData) {
    _socialArray = [];
    var tempData = socialData.data.results;
    var len = !!tempData ? tempData.length : 0;

    if (!!tempData && len > 0){
      var newExpert = false;
      var newMedia = false;
      for (var i = 0; i < len; i++){
        var _socialObject = Bant.bant(tempData[i]);
        _socialObject.expert = tempData[i].source.type === "Twitter:Expert" ? true : false;
        if (!!_socialObject.embed){
          if (!!_socialObject.embed.media){
            _socialObject.mediaFilter = true;
          }
        }
        if (!newExpert && _socialObject.expert) newExpert = true;
        if (!newMedia && _socialObject.mediaFilter) newMedia = true;
        if (!!_socialObject.id){
          var isNewObject = true;
          for (var j = 0; j < _socialArrayAuto.length; j++){
            if (_socialArrayAuto[j].id === _socialObject.id){
              isNewObject = false;
              break;
            }
          }
          _socialArray.push(_socialObject);
          if (len === 1 && isNewObject && socialData.rid === "social_auto"){
            if (GEN_DEBUG) console.log("$AUTO$ SINGLE REQUEST FOUND NEW SOCIAL - NOTIFYING");
            notifyObservers('new');
            return;
          }
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
        if (newExpert) _newExpert = true;
        if (newMedia) _newMedia = true;
        notifyObservers(true);
      }
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

  function getSocialDataRequestAutoSingle(id){
    var request = {
      "rid": "social_auto",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit=1&offset=0")
    };
    if (NETWORK_DEBUG)
    console.log("Social Request Single Auto: ", request);
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
    getSocialDataRequestAutoSingle: getSocialDataRequestAutoSingle,
    registerObserverCallback: registerObserverCallback,
    socialArrayAutoLength: function(){
      return _socialArrayAuto.length;
    },
    getPrevLength: function(){
      console.log("PREV IN SERVICE GET: ", prevLength);
      return prevLength;
    },
    setPrevLength: function(length){
      console.log("PREV IN SERVICE SET: ", prevLength);
      prevLength = length;
    },
    newExpertIn: function(val){
      if (val === undefined){
        console.log("$AUTO$ EXPERT? ", _newExpert);
        return _newExpert;
      }
      else {
        _newExpert = val;
        console.log("$AUTO$ EXPERT SET: ", _newExpert);
      }
    },
    newMediaIn: function(val){
      if (val === undefined){
        return _newMedia;
      }
      else {
        _newMedia = val;
      }
    }
  };

}]); 