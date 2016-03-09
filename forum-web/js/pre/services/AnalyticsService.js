angular.module('ChannelModule')
.factory('AnalyticsService',["UserInfoService",
  function (UserInfoService) {

 
var userData = {};
  var isJoinedSession = false;
  var isAnalyticsInitialized = false;
  var eventStack = []; 

  var sesssionStack = [];
  var sesssionStackInternal= [];
  var sessionId = 0;


 function getBaseEvent(){
  var baseEvent =  {
    "context": {
      "class": "user-engagement",
      "category": "discussion",
     "data": userData
    }
  };
  return baseEvent;
 }
  function getNewSessionId(){
    sessionId = sessionId +1;
      return sessionId;
  }

  function getSessionObject(){
    var sessionObject = {};
    sessionObject.id = getNewSessionId();
    var d = new Date();
    sessionObject.timeStamp = d.getTime();
    console.log("SESSION");
    console.log(sessionObject);
    return sessionObject;
  }

  function addSession(){
    var session = getSessionObject();
    sesssionStack.push(session.id);
    sesssionStackInternal.push(session);

  }
  function getSessionTime(){
    if(sesssionStackInternal != null && sesssionStackInternal.length > 0){
    var temp = sesssionStackInternal[sesssionStackInternal.length-1];
    return temp.timeStamp;
  }
  else
    return null;
  }
  function browseSessionEvent(type){
    var time = new Date();

    var duration = time.getTime() - getSessionTime();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="browse";
      mEvent.context.data.sessionStack = sesssionStack;
      var content = {"entity" : type, "duration" : duration}
      mEvent.content = content;
      eventStack.push(mEvent);
      sesssionStack.pop();
      sesssionStackInternal.pop();

  }
  function addSessionEvent(){
    //AddEvent and Pop  Session

  }
  function addEvent(){
    //Just add event
  }
  
  function sendEventsToServer(){
    //Code to send events
  }

  
  
  //JOIN SESSION EVENT
  function joinSessionEvent(channel, topicId){
    if(!isJoinedSession){
      addSession();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="join";
      mEvent.context.data.sessionStack = sesssionStack;
      var content = {"channelId" : channel, "topicId" : topicId}
      mEvent.content = content;
      eventStack.push(mEvent);
      isJoinedSession = true;
    }
  }
  //LEAVE SESSION EVENT
  function leaveSessionEvent(channel, topicId){
    var mEvent = getBaseEvent();
    mEvent.createdAt = new Date();
    mEvent.context.type ="leave";
    mEvent.context.data.sessionStack = sesssionStack;
    var content = {"channelId" : channel, "topicId" :topicId}
      mEvent.content = content;
    eventStack.push(mEvent);
    printEventStack();
  }

  function setLoginSessionId(loginId){
    var user = UserInfoService.getUserCredentials();
    
     userData.userId = user.userId;
     userData.sessionId = user.sessionId;
     userData.loginSessionId = loginId;
     isAnalyticsInitialized = true;
     console.log("Analytics Base Event :"+ userData);
  }

  function printEventStack(){
      console.log(eventStack);
  }

  return {
    sendEventsToServer:sendEventsToServer,
    joinSessionEvent:joinSessionEvent,
    leaveSessionEvent:leaveSessionEvent,
    browseSessionEvent:browseSessionEvent,
    addEvent:addEvent,
    addSessionEvent:addSessionEvent,
    addSession:addSession,
    setLoginSessionId:setLoginSessionId,
    printEventStack:printEventStack,
    isInitialized:function(){ return isAnalyticsInitialized;}
  };

}]);