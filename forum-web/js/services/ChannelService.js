channelModule.factory('ChannelService', function (DateUtilityService,Bant,FDSUtility) {


  var _channelId;
  var _liveTopicId;

  var observerCallbacks = []; 

  function setTopicData(topicData) 
  {
    if(topicData.data != undefined){
      _liveTopicId = topicData.data.id;
      console.log("_liveTopicId : "+ _liveTopicId);
      notifyObservers();
    }
  }

  function getLiveGameTopic(channelId){
    var reqChannelId = channelId || _channelId;
    var uri = "/v1.0/channel/topic/show/" + reqChannelId + "?type=livegame";
    if(reqChannelId == "404")
    uri = "/v1.0/channel/topic/show/" + reqChannelId;

    var topicParams = {"rid": "channel",
      "timestamp": new Date().getTime(),
      "method": "GET",
      "uri":uri };
    console.log("Ch.getLiveGameTopic: ", topicParams);
    return topicParams;
  }

  //call this when you know 'data' has been changed
  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };
  
  function registerObserverCallback(callback){
    //register an observer
    // console.log("topic callback registered");
    var callbackLength  = observerCallbacks.length;
    while(callbackLength > 0){
      callbackLength = observerCallbacks.length;
      observerCallbacks.pop();
    }
    observerCallbacks.push(callback);
  }

  return {
    setTopicData:setTopicData,
    getLiveTopicId:function(){ return _liveTopicId;},
    getLiveGameTopic:getLiveGameTopic,
    setChannel: function(channelId){
      _channelId = channelId;
    },
    getChannel: function(){
      return _channelId;
    },
    registerObserverCallback:registerObserverCallback


  };

});