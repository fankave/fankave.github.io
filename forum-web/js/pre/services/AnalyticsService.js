angular.module('ChannelModule')
.service('AnalyticsService',["UserInfoService",
  function (UserInfoService) {

  var baseEvent = {
    "context": {
      "class": "user-engagement",
      "category": "discussion",
     "data": {
        "userId": "478",
        "sessionId": "9fb29d49",
        "loginSessionId": "478:9fb29d49:1456189956"
      }
    }
  };
  var eventStack = []; 

  var sesssionStack = [];
  var sesssionStackInternal= [];
  var sessionObject={};
  var sessionId = 0;



  function getNewSessionId(){
    sessionId = sessionId +1;
      return sessionId;
  }

  function getSessionObject(){
    sessionObject = {};
    sessionObject.id = getNewSessionId();
    var d = new Date();
    sessionObject.timeStamp = d.getTime();
    return sessionObject;
  }

  function addSession(){
    var session = getSessionObject();
    sesssionStack.push(session.id);
    sesssionStackInternal.push(session);

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

  
  
  
  function constructEvent(){
    var mEvent = baseEvent;

  }

  function setLoginSessionId(loginId){
    var user = UserInfoService.getUserCredentials();
    baseEvent.data.userId = user.userId;
     baseEvent.data.sessionId = user.sessionId;
     baseEvent.data.loginSessionId = loginId;
  }

  function initEventFormat(){

  }

  return {
    sendEventsToServer:sendEventsToServer,
    addEvent:addEvent,
    addSessionEvent:addSessionEvent,
    addSession:addSession,
    setLoginSessionId:setLoginSessionId
  };

}]);