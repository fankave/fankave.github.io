angular.module('ChannelModule')
.factory('AnalyticsService',["$interval","$http","UserInfoService","UserAgentService","$routeParams",
  function ($interval,$http,UserInfoService,UserAgentService,$routeParams) {
    
  var userData = {};
  var isJoinedSession = false;
  var isAnalyticsInitialized = false;
  var eventStack = []; 

  var sessionStackInternal= [];
  var sessionId = 0;
  var stop;


 function getBaseEvent(){
  var tempData = userData;
  var temp = getSessionStack();
  tempData.sessionStack = temp;
  var baseEvent =  {
    "context": {
      "class": "user-engagement",
      "category": "discussion",
     "data": tempData
    }
  };
  var tempBaseEvent ={};
  angular.copy(baseEvent, tempBaseEvent);
  return tempBaseEvent;
 }
  function getNewSessionId(){
    sessionId = sessionId +1;
      return sessionId;
  }

  function getSessionObject(sessionType){
    var sessionObject = {};
    sessionObject.id = sessionType + '_' + getNewSessionId();
    var d = new Date();
    sessionObject.timeStamp = d.getTime();
    if(ANALYTICS_DEBUG){
    console.log("Analytics ****** getSession Object");
    console.log(sessionObject);
  }
    return sessionObject;
  }

  function getSessionTime(){
    if(sessionStackInternal != null && sessionStackInternal.length > 0){
    var temp = sessionStackInternal[sessionStackInternal.length-1];
    return temp.timeStamp;
  }
  else
    return null;
  }

  function getSessionStackId(index){
      var temp = {};
      temp = sessionStackInternal[index];
      return temp.id;
  }

  function getSessionStack(){
    var sessionStack = [];
    // var tempStack = [];
    // var length = sessionStackInternal.length;
    // angular.copy(sessionStackInternal,tempStack);
    // tempStack[0].timeStamp = 0;
    // console.log(sessionStackInternal);
    // console.log(tempStack);
    for(var j=0;j<sessionStackInternal.length;j++){
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** "+ sessionStackInternal[j].id );
      sessionStack.push(sessionStackInternal[j].id);
    }
    console.log(sessionStack);
    return sessionStack;
  }

  function addSession(type){
    var session = getSessionObject(type);
    sessionStackInternal.push(session);
    if(ANALYTICS_DEBUG)
    console.log("Analytics ****** : sessionStackInterNAl length : "+ sessionStackInternal.length);
  }
  
  
  function addSessionEvent(){
    //AddEvent and Pop  Session

  }
  function addEvent(){
    //Just add event
  }
  
  function sendEventsToServer(){
  console.log("****************** send event to server triggered");
    //Code to send events
    if(eventStack.length > 0){

    $http.post(ANALYTICS_SERVER, JSON.stringify(eventStack))
      .then(function (response) {
        if (response.status === 200) {
          if (ANALYTICS_DEBUG)
          console.log("Successfully Sent analytics events to server");
        eventStack = [];
        }
      },
      function (response) {
        if (ANALYTICS_DEBUG)
        console.log('Analytics Error: ', response);
      }).then(function (response) {
        if (ANALYTICS_DEBUG)
        console.log('Analytics Resp: ', response);
      });
        printEventStack();
        //eventStack = [];
      }
  }
  
  
  //JOIN SESSION EVENT
  function joinSessionEvent(channel, topicId){
    if(!isJoinedSession){
      addSession('start');
      engageEvent();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="join";
    
      var content = {"channelId" : channel, "topicId" : topicId };
      mEvent.content = content;
      //eventStack.push(mEvent);
      isJoinedSession = true;
      if(ANALYTICS_DEBUG){
      console.log("Analytics ****** joinSessionEvent");
      console.log(UserAgentService.getDeviceInfo());
    }
    stop = $interval(sendEventsToServer,60000);
    }
  }

  function engageEvent(){
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="engage";
      mEvent.context.category = "access";
    
      var content = {"environment" : UserAgentService.getDeviceInfo()}
      mEvent.content = content;
      eventStack.push(mEvent);
      
  }
  function disengageEvent(){
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="disengage";
      mEvent.context.category = "access";
    
      var content = {"environment" : UserAgentService.getDeviceInfo()}
      mEvent.content = content;
      eventStack.push(mEvent);
      
  }
  //LEAVE SESSION EVENT
  function leaveSessionEvent(channel, topicId){
    var mEvent = getBaseEvent();
    var d = new Date();
    mEvent.createdAt = d;
    mEvent.context.type ="leave";
    while(sessionStackInternal.length >1)
      sessionStackInternal.pop();
    var duration = d.getTime() - getSessionTime();
    var content = {
    "channelId" : channel, 
    "topicId" :topicId,
    "duration" : duration
  };
    mEvent.content = content;
    eventStack.push(mEvent);
    disengageEvent();
    printEventStack();
    $interval.cancel(stop);
    sendEventsToServer();
    isJoinedSession = false;
    sessionStackInternal = [];
  }

  function browseSessionEvent(type){
    var time = new Date();
    while(sessionStackInternal.length > 2)
       sessionStackInternal.pop();
    var duration = time.getTime() - getSessionTime();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="browse";
      // var temp = getSessionStack().slice();
      // mEvent.context.data.sessionStack = temp;
      var section = "topic-view." + type +"-section";
      var content = {"entity" : section, "duration" : duration };
      mEvent.content = content;
      eventStack.push(mEvent);
      sessionStackInternal.pop();
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** browseEvent triggered");

  }

   function exploreSessionEvent(type, id, provider, providerId, source, site, dur){
    var time = new Date();

    var duration = time.getTime() - getSessionTime();
    if(dur != undefined)
      duration = dur *1000;
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="explore";
      // var temp = getSessionStack().slice();
      // mEvent.context.data.sessionStack = temp;
      var content = {
        "entity" : type, 
      "entityId" : id, 
      "provider" : provider,
      "providerId" : providerId,
      "source" : source,
      "site" : site,
      "duration" : duration };
      mEvent.content = content;
      eventStack.push(mEvent);
      sessionStackInternal.pop();
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** exploreSessionEvent triggered");

  }

  function exploreEvent(type, id, provider, providerId, source, site){
    var time = new Date();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="explore";
      // var temp = getSessionStack().slice();
      // mEvent.context.data.sessionStack = temp;
      var content = {
        "entity" : type, 
      "entityId" : id, 
      "provider" : provider,
      "providerId" : providerId,
      "source" : source,
      "site" : site };
      mEvent.content = content;
      eventStack.push(mEvent);
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** exploreEvent triggered");

  }

    function expressSocialEvent(type, id, provider, providerId, source, site){
    var time = new Date();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="express";
      var content = {
      "entity" : "social-post", 
      "entityId" : id, 
      "provider" : provider,
      "providerId" : providerId,
      "source" : source,
      "action": "twitter-"+type,
      "site" : "topic-view."+site+"-section.social-post" };
      mEvent.content = content;
      eventStack.push(mEvent);
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** exploreEvent triggered");

  }

  function setLoginSessionId(loginId, userId, sessionId){
    console.log("setting login session ID" ,loginId, userId, sessionId);
     userData.userId = userId;
     userData.sessionId = sessionId;
     userData.engagementId = loginId;
     isAnalyticsInitialized = true;
     if(ANALYTICS_DEBUG)
     console.log("Analytics ****** Base Event :");
      console.log(userData);
      joinSessionEvent($routeParams.channelID, $routeParams.topicID);
  }

  function printEventStack(){
    if(ANALYTICS_DEBUG){
      console.log(eventStack);
    }
  }


  return {
    sendEventsToServer:sendEventsToServer,
    joinSessionEvent:joinSessionEvent,
    leaveSessionEvent:leaveSessionEvent,
    browseSessionEvent:browseSessionEvent,
    exploreSessionEvent:exploreSessionEvent,
    exploreEvent:exploreEvent,
    expressSocialEvent:expressSocialEvent,
    addEvent:addEvent,
    addSessionEvent:addSessionEvent,
    addSession:addSession,
    setLoginSessionId:setLoginSessionId,
    printEventStack:printEventStack,
    isInitialized:function(){ return isAnalyticsInitialized;}
  };

}]);