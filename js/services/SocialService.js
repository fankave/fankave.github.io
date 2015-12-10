socialModule.factory('SocialService', ["Bant", function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = {'social':[],'video':[]};
  var _socialArray = [];
  var _videoArray = [];
  var _socialOffset = 0;
  var _videoOffset = 0;
  var socialLIMIT = 20;
  var videoLIMIT = 10;


  function setData(feedData, tab) {
    var tempData = feedData.data.results;
    var len = tempData.length;

    if (tab === 'social'){
      _socialArray = [];
      if (!!tempData && len > 0){
        for (i = 0; i < len; i++){
          var _socialObject = Bant.bant(tempData[i]);
          if (!!_socialObject.id)
            _socialArray.push(_socialObject);
        }
        _socialOffset = feedData.data.nextOffset;
        notifyObservers(tab);
      }
    } else if (tab === 'video'){
      _videoArray = [];
      if (!!tempData && len > 0){
        for (i = 0; i < len; i++){
          var _videoObject = Bant.bant(tempData[i]);
          if (!!_videoObject.id)
            _videoArray.push(_videoObject);
        }
        _videoOffset = feedData.data.nextOffset;
        notifyObservers(tab);
      }
    }
  };

  var notifyObservers = function(tab){
    console.log("notifyObservers: ", tab, observerCallbacks[tab]);
    angular.forEach(observerCallbacks[tab], function(callback){
      callback();
    });
  };

  function registerObserverCallback(tab, callback){
    // register an observer for provided feed
    var callbackLength  = observerCallbacks[tab].length;
    while(callbackLength > 0){
      callbackLength = observerCallbacks[tab].length;
      observerCallbacks[tab].pop();
    }
    console.log("Obs Callback: ", tab, callback, observerCallbacks[tab]);
    observerCallbacks[tab].push(callback);
  };

  function getSocialDataRequest(id){
    var request = {
      "rid": "social",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+socialLIMIT+"&offset="+_socialOffset)
    };
    console.log("Social Request: ", request);
    return request;
  };

  function getVideoDataRequest(id){
    return  {
      "rid": "video",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+videoLIMIT+"&offset="+_videoOffset+"&filter=video")
    };
  };

  // function appendToFeed(socialData){
  //   var socialItem = socialData.data;
  //   if (!socialData){
  //     return;
  //   } else {
  //     socialObj = Bant.bant(socialItem);
  //     _socialArrayArchive.unshift(socialObj);
  //   }
  //   notifyObservers(true);
  // }

  // function updateFeed(socialData){
  //   var socialObj = socialData.data;
  //   for (var i = 0; i < _socialArrayArchive.length; i++){
  //     if (_socialArrayArchive[i].id === socialObj.id){
  //       console.log("Updating Existing Social Item, ID=", socialObj.id);
  //       _socialArrayArchive[i] = Bant.bant(socialObj);
  //       return;
  //     }
  //   }
  //   console.log("Updating Social Feed, New Item");
  //   appendToFeed(socialData);
  // }

  return {
    socialArray: function(){
      return _socialArray;
    },
    videoArray: function(){
      return _videoArray;
    },
    resetSocialOffset: function(){
      console.log("SOCIAL RESET");
      _socialOffset = 0;
    },
    resetVideoOffset: function(){
      _videoOffset = 0;
    },
    setData: setData,
    getSocialDataRequest: getSocialDataRequest,
    getVideoDataRequest: getVideoDataRequest,
    registerObserverCallback: registerObserverCallback
  };

}]);