angular.module('SocialModule')
.factory('ExpertService', ["Bant",
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var autoObserverCallbacks = [];
  var newObserverCallbacks = [];
  var _expertArray = [];
  var _expertArrayAuto = [];
  var _offset = 0;
  var LIMIT = 20;
  var prevLength = 0;

  function setExpertData(expertData) {
    _expertArray = [];
    var tempData = expertData.data.results;
    var len = !!tempData ? tempData.length : 0;

    if (!!tempData && len > 0){
      // var newExpert = false;
      for (var i = 0; i < len; i++){
        var _expertObject = Bant.bant(tempData[i]);
        // _expertObject.expert = tempData[i].source.type === "Twitter:Expert" ? true : false;
        // if (!newExpert && _expertObject.expert) newExpert = true;
        if (!!_expertObject.id){
          var isNewObject = true;
          for (var j = 0; j < _expertArrayAuto.length; j++){
            if (_expertArrayAuto[j].id === _expertObject.id){
              isNewObject = false;
              break;
            }
          }
          _expertArray.push(_expertObject);
          if (len === 1 && isNewObject && expertData.rid === "expert_auto"){
            if (GEN_DEBUG) console.log("$AUTO$ SINGLE REQUEST FOUND NEW EXPERT - NOTIFYING");
            notifyObservers('new');
            return;
          }
          if (isNewObject && expertData.rid === "expert_auto"){
            _expertArrayAuto.push(_expertObject);
          }
        }
      }
      if (expertData.rid === "expert"){
        _offset = expertData.data.nextOffset;
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

  function getExpertDataRequest(id, offset){
    var request = {
      "rid": "expert",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+_offset+"&filter=expert")
    };
    if (NETWORK_DEBUG)
    console.log("Expert Request: ", request);
    return request;
  }

  // function getExpertDataRequestAuto(id){
  //   var request = {
  //     "rid": "expert_auto",
  //     "timestamp": new Date().getTime(),
  //     "method": "GET",
  //     "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+0+"&filter=expert")
  //   };
  //   if (NETWORK_DEBUG)
  //   console.log("Expert Request Auto: ", request);
  //   return request;
  // }

  // function getExpertDataRequestAutoSingle(id){
  //   var request = {
  //     "rid": "expert_auto",
  //     "timestamp": new Date().getTime(),
  //     "method": "GET",
  //     "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit=1&offset=0&filter=expert")
  //   };
  //   if (NETWORK_DEBUG)
  //   console.log("Expert Request Single Auto: ", request);
  //   return request;
  // }

  return {
    expertArray: function(){
      return _expertArray;
    },
    resetExpertOffset: function(){
      _offset = 0;
    },
    setExpertData:setExpertData,
    getExpertDataRequest:getExpertDataRequest,
    // getExpertDataRequestAuto:getExpertDataRequestAuto,
    // getExpertDataRequestAutoSingle:getExpertDataRequestAutoSingle,
    registerObserverCallback:registerObserverCallback
    // expertArrayAutoLength: function(){
    //   return _expertArrayAuto.length;
    // },
    // getPrevLength: function(){
    //   return prevLength;
    // },
    // setPrevLength: function(length){
    //   prevLength = length;
    // }
  };

}]);
