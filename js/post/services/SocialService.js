angular.module('SocialModule')
.factory('SocialService', ["Bant", 
  function (Bant) {
  var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


  var observerCallbacks = [];
  var autoObserverCallbacks = [];
  var _socialArray = [];
  var _offset = 0;
  var LIMIT = 20;

  var _socialBacklog = {};

  function setSocialData(socialData) {
    _socialArray = [];
    var tempData = socialData.data.results;
    var len = tempData.length;

    if (!!tempData && len > 0){
      for (i = 0; i < len; i++){
        var _socialObject = Bant.bant(tempData[i]);
        if (!!_socialObject.id){
          var isNewObject = true;
          for(i=0;i<_socialArray.length;i++){
            if(_socialArray[i].id == _socialObject.id){
              isNewObject = false;
              break;
              }
            }
          if(isNewObject)
            _socialArray.push(_socialObject);
        }
      }
      _offset = socialData.data.nextOffset;
      console.log("Social Array offset : "+ _offset);
      if(socialData.rid === "social")
        notifyObservers();
      else
        notifyObservers(true);
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

  function registerObserverCallback(callback){
   //register an observer
        var callbackLength = autoObserverCallbacks.length;
          while (callbackLength > 0){
            callbackLength = autoObserverCallbacks.length;
            autoObserverCallbacks.pop();
          }
          autoObserverCallbacks.push(callback);
      
      var callbackLength  = observerCallbacks.length;
      while (callbackLength > 0){
          callbackLength = observerCallbacks.length;
          observerCallbacks.pop();
      }
      observerCallbacks.push(callback);
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

  function formatSocial (tempItem, feedData) {
    
    tempItem.postAuthorName = feedData.embedAuthor.name;
    tempItem.postAuthorAlias = feedData.embedAuthor.alias;
    tempItem.postAuthorPhoto = feedData.embedAuthor.photo;
    tempItem.tweetId = feedData.tweet.id;
    
    tempItem.postTimestamp = feedData.createdAt;
    tempItem.providerName = feedData.embedProvider.name;
    tempItem.html = feedData.embedText;
    tempItem.retweetCount = feedData.tweet.metrics.retweetCount;
    tempItem.likeCount = feedData.tweet.metrics.likeCount;
    tempItem.replyCount = feedData.tweet.metrics.replyCount;

    // Embed Object for Sharing
    tempItem.embed = feedData.embed;
    tempItem.embed.embedCreatedAt = feedData.embedCreatedAt;
    // tempItem.embed.embedCreatedAtFull = feedData.embedCreatedAtFull;

    if (tempItem.providerName === "Twitter"){
      tempItem.providerLogo = "img/twitterLogo@2x.png";
      tempItem.embed.provider.logo = "img/twitterLogo@2x.png";
    } else {
      tempItem.providerLogo = feedData.embedProvider.logo;
      tempItem.embed.provider.logo = feedData.embedProvider.logo;
    }

    tempItem.embedType = feedData.embedType;
    tempItem.embedUrl = feedData.embedUrl;
    if (feedData.embedType === "link" && feedData.embedPlayable === true){
      tempItem.embedHtml = feedData.embedHtml;
      tempItem.embedPlayable = true;
    }
    if (feedData.embedType === "media" || feedData.embedType === "link"){
      tempItem.mediaType = feedData.embedMedia.mediaType;
      tempItem.mediaUrl = feedData.embedMedia.mediaUrl;
      tempItem.mediaThumbUrl = feedData.embedMedia.mediaThumbUrl;
      tempItem.mediaAspectRatio = feedData.embedMedia.mediaAspectRatio;
      tempItem.mediaAspectFeed = feedData.embedMedia.mediaAspectFeed;
      tempItem.mediaAspectFull = feedData.embedMedia.mediaAspectFull;
      tempItem.mediaOrientation = feedData.embedMedia.mediaOrientation;
    }
    return tempItem;
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
    formatSocial: formatSocial,
    socialBacklog: function(id) {
      if (_socialBacklog[id]){
        return true;
      }
      if (!id){
        return false;
      }
      _socialBacklog[id] = true;
      return id;
    },
    socialBacklogLength: function(id) {
      return Object.keys(_socialBacklog).length;
    }
  };

}]);