angular.module('ChannelModule')
.factory('AnalyticsService',["UserInfoService",
  function (UserInfoService) {

 
var userData = {};
  var isJoinedSession = false;
  var isAnalyticsInitialized = false;
  var eventStack = []; 

  var sessionStackInternal= [];
  var sessionId = 0;


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

  function getSessionObject(){
    var sessionObject = {};
    sessionObject.id = getNewSessionId();
    var d = new Date();
    sessionObject.timeStamp = d.getTime();
    console.log("Analytics ****** getSession Object");
    console.log(sessionObject);
    return sessionObject;
  }

  function addSession(){
    var session = getSessionObject();
    sessionStackInternal.push(session);
    console.log("Analytics ****** : sessionStackInterNAl length : "+ sessionStackInternal.length);
  }
  function getSessionTime(){
    if(sessionStackInternal != null && sessionStackInternal.length > 0){
    var temp = sessionStackInternal[sessionStackInternal.length-1];
    return temp.timeStamp;
  }
  else
    return null;
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
  function getSessionStackId(index){
      var temp = {};
      temp = sessionStackInternal[index];
      return temp.id;
  }

  function getSessionStack(){
    var sessionStack = [];
    var tempStack = [];
    var length = sessionStackInternal.length;
    angular.copy(sessionStackInternal,tempStack);
    tempStack[0].timeStamp = 0;
    console.log(sessionStackInternal);
    console.log(tempStack);
    for(var j=0;j<tempStack.length;j++){
      console.log("Analytics ****** "+ tempStack[j].id );
      sessionStack.push(tempStack[j].id);
    }
    console.log(sessionStack);
    return sessionStack;
  }
  
  //JOIN SESSION EVENT
  function joinSessionEvent(channel, topicId){
    if(!isJoinedSession){
      addSession();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="join";
    //   var temp = getSessionStack().slice();
    // mEvent.context.data.sessionStack = temp;
      var content = {"channelId" : channel, "topicId" : topicId}
      mEvent.content = content;
      eventStack.push(mEvent);
      isJoinedSession = true;
      console.log("Analytics ****** joinSessionEvent");
    }
  }
  //LEAVE SESSION EVENT
  function leaveSessionEvent(channel, topicId){
    var mEvent = getBaseEvent();
    mEvent.createdAt = new Date();
    mEvent.context.type ="leave";
    // var temp = getSessionStack().slice();
    // mEvent.context.data.sessionStack = temp;
    var content = {"channelId" : channel, "topicId" :topicId}
      mEvent.content = content;
    eventStack.push(mEvent);
    printEventStack();
  }

  function browseSessionEvent(type){
    var time = new Date();

    var duration = time.getTime() - getSessionTime();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="browse";
      // var temp = getSessionStack().slice();
      // mEvent.context.data.sessionStack = temp;
      var content = {"entity" : type, "duration" : duration}
      mEvent.content = content;
      eventStack.push(mEvent);
      sessionStackInternal.pop();
      console.log("Analytics ****** browseEvent triggered");

  }

  function setLoginSessionId(loginId){
    var user = UserInfoService.getUserCredentials();
    
     userData.userId = user.userId;
     userData.sessionId = user.sessionId;
     userData.loginSessionId = loginId;
     isAnalyticsInitialized = true;
     console.log("Analytics ****** Base Event :"+ userData);
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