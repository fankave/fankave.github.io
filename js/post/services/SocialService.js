angular.module('SocialModule')
.factory('SocialService', ["Bant", 
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var _socialArray = [];
  var _offset = 0;
  var LIMIT = 20;


  function setSocialData(socialData) {
    _socialArray = [];
    var tempData = socialData.data.results;
    var len = tempData.length;

    if (!!tempData && len > 0){
      for (i = 0; i < len; i++){
        var _socialObject = Bant.bant(tempData[i]);
        if (!!_socialObject.id)
          _socialArray.push(_socialObject);
      }
      _offset = socialData.data.nextOffset;
      notifyObservers();
    }
  };

  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  function registerObserverCallback(callback){
    // register an observer for provided feed
    var callbackLength  = observerCallbacks.length;
    while(callbackLength > 0){
      callbackLength = observerCallbacks.length;
      observerCallbacks.pop();
    }
    observerCallbacks.push(callback);
  };

  function getSocialDataRequest(id, offset){
    var reqOffset = offset || _offset;
    var request = {
      "rid": "social",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+reqOffset)
    };
    console.log("Social Request: ", request);
    return request;
  };

  return {
    socialArray: function(){
      return _socialArray;
    },
    resetSocialOffset: function(){
      _offset = 0;
    },
    setSocialData: setSocialData,
    getSocialDataRequest: getSocialDataRequest,
    registerObserverCallback: registerObserverCallback
  };

}]);