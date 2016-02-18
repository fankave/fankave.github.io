angular.module('TopicModule')
.factory('TopicService', ["DateUtilityService","Bant","FDSUtility",
  function (DateUtilityService,Bant,FDSUtility) {

  var TOPIC_BASE_URI = "/v1.0/topic/show/";
  var LIKE_TOPIC_URI = "/v1.0/topic/like/";
  var UNLIKE_TOPIC_URI = "/v1.0/topic/unlike/";
  var WATCH_TOPIC_URI = "/v1.0/topic/watch/";
  
  var _channelId;
  var _userType;
  
  var _isTopicWatched = false;
  var _topic;
  var _topicType;
  var _id;
  var _title;
  var _game;
  var _status;
  var _score;
  var _gameStats;
  var _links;
  var _scheduledAt;
  var observerCallbacks = []; 
  var directComment; //bool flag to indicate whether user tapped on a comment's "comment" icon

  function setTopicData(topicData) 
  {
    if(topicData.data != undefined){
      if(topicData.data.content != undefined ){
        _title = topicData.data.content.title;
      }


      _topicType = topicData.data.topicType;
      console.log("TOPIC TYPE :"+_topicType );
      _id = topicData.data.id;
      if(_topicType == "livegame"){
        _game = topicData.data.game;
        if(_game != undefined){
          _scheduledAt = DateUtilityService.getGameScheduledTime(_game.scheduledAt);
          _score = _game.score;
  //        Future game: live == false AND final == false.
  //        Live game: live == true.
  //        Past game: final == true.
          if(_score.live == undefined && _score.final == undefined)
            _status = "future";
          else if(_score.live == true)
            _status = "live";
          else if(_score.final == true)
            _status = "past";
          // console.log("GAME Status  :"+ _status );
  
          if(_status == "live"){
            console.log("_gameStats" + _score.status);
            _gameStats = _score.status;
          }
        }
      }

      _topic = Bant.bant(topicData.data);
      notifyObservers();
    }
    else if(topicData.method == "POST"){

      //Handle operations dependent on POST
      if(topicData.uri == WATCH_TOPIC_URI+_id){
        if(NETWORK_DEBUG)
          console.log("Topic watch success");
        _isTopicWatched = true;
      }
      else if(topicData.uri == LIKE_TOPIC_URI+_id)
      {
        if(NETWORK_DEBUG)
          console.log("Topic liked success");
        _topic = Bant.updateBantLiked(_topic, true);
        notifyObservers();
      }
      else if(topicData.uri == UNLIKE_TOPIC_URI+_id){
        if(NETWORK_DEBUG)
          console.log("Topic unliked success");
        _topic = Bant.updateBantLiked(_topic, false);
        notifyObservers();
      }
    }
  }

  function updateTopicData(scoreData){
    console.log("Topic Service scoreData :" + scoreData)
    setScoreData(scoreData);
  }

  function setScoreData(scoreData) 
  {
    _score = scoreData;
    //console.log("TopicService  insideScore"+_score );
    if(_score != undefined){
      if(_score.live == true){
        _status = "live";
      }
      _gameStats = _score.status;
      console.log("Game Points :" + _score.points[0] + " : : "+_score.points[1] );
      console.log("Game Period :" + _gameStats[0]);
      console.log("Game Period :" + _gameStats[1]);
      notifyObservers();
    }
  }
  
  function updateCommentCount(value){
    console.log("Update comment count: " + _topic.metrics.comments + "     Value : "+ value);
    if(_topic!= undefined && _topic.metrics != undefined){
      if(value == 1)
      _topic.metrics.comments == undefined ? _topic.metrics.comments =1: _topic.metrics.comments = _topic.metrics.comments+1;
      else
        _topic.metrics.comments == undefined ? _topic.metrics.comments =0: _topic.metrics.comments = _topic.metrics.comments-1; 
    }
    notifyObservers();
  }

  function getTopicRequest(topicId){
    var uri = TOPIC_BASE_URI+topicId;

    return  varTopicParams = {"rid": "topic",
        "timestamp": new Date().getTime(),
        "method": "GET",
        "uri": encodeURI(uri)};
  }
  function getFollowChannelRequest(){
    
    var channelId = 0;
    if(_topic!= undefined && _topic.owner!= undefined)
      channelId = _topic.owner.id;
      _channelId = channelId;
    var uri = "/v1.0/channel/follow/" + channelId;

    return  varTopicParams = {"rid": "topic",
        "timestamp": new Date().getTime(),
        "method": "POST",
        "uri": encodeURI(uri)};
  }
  
  function watchTopicRequest(topicId){
    var uri = WATCH_TOPIC_URI+topicId;

    return  varTopicParams = {"rid": "topic",
        "timestamp": new Date().getTime(),
        "method": "POST",
        "uri": encodeURI(uri)};
  }

  function likeTopicRequest(){
    console.log("Like topic request invoked"+_id);
    return  varLikeParams = {"rid": "topic",
        "timestamp": new Date().getTime(),
        "method": "POST",
        "uri": encodeURI(LIKE_TOPIC_URI + _id)};


  }

  function unlikeTopicRequest(){
    return  varLikeParams = {"rid": "topic",
        "timestamp": new Date().getTime(),
        "method": "POST",
        "uri": encodeURI(UNLIKE_TOPIC_URI + _id)};


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
    while (callbackLength > 0){
      callbackLength = observerCallbacks.length;
      observerCallbacks.pop();
    }
    observerCallbacks.push(callback);
  }

  return {
    getTopic: function(){ 
      return _topic ;},
    getTopicId: function(){ 
      return _id ;},
    getTopicType: function(){ 
      return _topicType ;},
    getGame: function(){  
      return _game;},
    getGameTime: function(){
      return _scheduledAt;
    },
    getTeamA: function(){ 
      if(_game != undefined) {
        return _game.teams[0];
      }},
    getTeamB: function(){ 
      if(_game != undefined) {
        return _game.teams[1];}
    },
    getScoresTitle: function(){   
      if(_game != undefined && _game.links != undefined) 
        return _game.links[0].title;},
    getScoresLink: function(){  
      if((_game != undefined) && (_game.links != undefined)) 
        return _game.links[0].url;},
    getScore: function(){ 
      if(_score != undefined) 
        return _score;},
    getGameStatus: function() { 
      return _status;},
    getGamePeriod: function() { 
      return _gameStats[0];},
    getGameClock: function() {  
      return _gameStats[1];},
//    getSectionType: function(sectionNumber){ 
//    //TODO check for section length
//    if(sectionNumber == undefined )
//    return _topic.data.content.sections[0].type;
//    else
//    return _topic.data.content.sections[sectionNumber].type
//    },
    getChannelId:function(){  
      if(_topic != undefined) 
        return _topic.owner.id;},
    getTitle:function(){  
      return _title;},
    getHtml:function(){ 
      if(_topic != undefined) 
        return _topic.html},
//    getMedia:function(){return _media},
//    getTweet:function(){return _tweet},
//    getOgp:function(){return _ogp},
//    getLink:function(){return _link},
    getTimeCreatedAt:function(){  
      if(_topic != undefined) 
        return _topic.createdAt},
    getLiked:function(){  
      if(_topic != undefined) 
        return _topic.signal.like},
    getMetrics:function(){  
      if(_topic != undefined) 
        return _topic.metrics},
    
    watchTopicRequest:watchTopicRequest,
    
    getLikeTopicRequest:likeTopicRequest,
    
    getUnlikeTopicRequest:unlikeTopicRequest,
    
    getFollowChannelRequest:getFollowChannelRequest,
    
    getTopicRequest:getTopicRequest,
    
    isWatchingTopic: function(){ return _isTopicWatched;},
    
    setWatchTopic: function(watch){_isTopicWatched = watch;},
    
    setTopicId: function(topicId){_id = topicId ;},
    
    setChannel: function(channelId){_channelId = channelId; },
    getChannel: function(){return _channelId ; },
    
    setTopic:setTopicData,
    
    updateTopic:updateTopicData,
    
    updateCommentCount: updateCommentCount,
    
    registerObserverCallback:registerObserverCallback,
    
    directComment:directComment

  };

}]);