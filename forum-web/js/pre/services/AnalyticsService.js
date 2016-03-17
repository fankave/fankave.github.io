angular.module('ChannelModule')
.factory('AnalyticsService',["$interval","$http","UserInfoService",
  function ($interval,$http,UserInfoService) {
    
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

  function getSessionObject(){
    var sessionObject = {};
    sessionObject.id = getNewSessionId();
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

  function addSession(){
    var session = getSessionObject();
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

    //Code to send events
    if(eventStack.length > 0){

//       $http({
//     url: 'http://146.148.35.97:8088/v1.0/services/analytics/events',
//     dataType: 'json',
//     method: 'POST',
//     data: JSON.stringify(eventStack),
//     headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*"
//     }

// }).success(function(response){
//           if (ANALYTICS_DEBUG)
//           console.log("Successfully Sent analytics events to server");
//         eventStack = [];
// }).error(function(error){
//    if (ANALYTICS_DEBUG)
//         console.log('Analytics Error: ', error);
// });

var config = {
                headers: {
        "Content-Type": "application/json"
                          }
            };
    $http.post("http://146.148.35.97:8088/v1.0/services/analytics/events", JSON.stringify(eventStack),config)
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
        eventStack = [];
      }
  }
  
  
  //JOIN SESSION EVENT
  function joinSessionEvent(channel, topicId){
    if(!isJoinedSession){
      addSession();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="engage";
    //   var temp = getSessionStack().slice();
    // mEvent.context.data.sessionStack = temp;
      var content = {"channelId" : channel, "topicId" : topicId}
      mEvent.content = content;
      eventStack.push(mEvent);
      isJoinedSession = true;
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** joinSessionEvent");
    stop = $interval(sendEventsToServer,20000);
    }
  }
  //LEAVE SESSION EVENT
  function leaveSessionEvent(channel, topicId){
    var mEvent = getBaseEvent();
    var d = new Date();
    mEvent.createdAt = d;
    mEvent.context.type ="disengage";
    // var temp = getSessionStack().slice();
    // mEvent.context.data.sessionStack = temp;
    var duration = d.getTime() - getSessionTime();
    var content = {
      "channelId" : channel, 
    "topicId" :topicId,
    "duration" : duration
  };
    mEvent.content = content;
    eventStack.push(mEvent);
    printEventStack();
    $interval.cancel(stop);
    sendEventsToServer();
    sessionStackInternal = [];
  }

  function browseSessionEvent(type){
    var time = new Date();

    var duration = time.getTime() - getSessionTime();
      var mEvent = getBaseEvent();
      mEvent.createdAt = new Date();
      mEvent.context.type ="browse";
      // var temp = getSessionStack().slice();
      // mEvent.context.data.sessionStack = temp;
      var content = {"entity" : type, "duration" : duration };
      mEvent.content = content;
      eventStack.push(mEvent);
      sessionStackInternal.pop();
      if(ANALYTICS_DEBUG)
      console.log("Analytics ****** browseEvent triggered");

  }

   function exploreSessionEvent(type, id, provider, providerId, source, site){
    var time = new Date();

    var duration = time.getTime() - getSessionTime();
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

  function setLoginSessionId(loginId){
    var user = UserInfoService.getUserCredentials();
    
     userData.userId = user.userId;
     userData.sessionId = user.sessionId;
     userData.loginSessionId = loginId;
     isAnalyticsInitialized = true;
     if(ANALYTICS_DEBUG)
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
    exploreSessionEvent:exploreSessionEvent,
    exploreEvent:exploreEvent,
    addEvent:addEvent,
    addSessionEvent:addSessionEvent,
    addSession:addSession,
    setLoginSessionId:setLoginSessionId,
    printEventStack:printEventStack,
    isInitialized:function(){ return isAnalyticsInitialized;}
  };

}]);