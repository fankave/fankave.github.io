angular.module("NetworkModule", ['ngWebSocket'])
.factory("networkService",["$websocket","$route","DataService","UserInfoService","AnalyticsService","URIHelper",

function ($websocket,$route,DataService,UserInfoService,AnalyticsService,URIHelper)
{
  var ws;

  disconnectSocket = function(){
    if (NETWORK_DEBUG)
    console.log("Disconnect Callback triggered");
    if(ws !== undefined) {
      ws.close();
      ws = undefined;
    }
  }

  reconnectSocket = function(){
    if (NETWORK_DEBUG)
    console.log("Reconnect Callback triggered");
    $route.reload();
  }
  
  // window.document.addEventListener(visEvent, function(){
  //     visChange(reconnectSocket, disconnectSocket);
  //   });

  function initSocket() { 
    if(ws != undefined)
      ws.close();
    ws = $websocket(getWebsocketUri());
    DataService.setWatchTopic(false);
    //Websocket callbacks below
    ws.onOpen(function() {
      if (NETWORK_DEBUG)
      console.log("Websocket Connected");
    // if(ANALYTICS && !URIHelper.isPeelUser()){
    //   if(ws != null){
    //   var getLoginSessionRequest = {"rid": "loginId",
    //     "timestamp": new Date().getTime(),
    //     "method": "GET",
    //     "uri": encodeURI("/v1.0/user/session/show")};
    //     ws.send(getLoginSessionRequest);
    //   }
    // }

    });

    ws.onClose(function(evt) {
      ws = undefined;
      if (NETWORK_DEBUG)
      console.log("Websocket Closed :"+evt.data);
    });

    ws.onMessage(function(evt) {
      if(NETWORK_DEBUG) console.log("Websocket Message Recieved :  " +evt.data);
      var responseJson = JSON.parse(evt.data);
      var type = responseJson.rid;
      if(type !== undefined){
        if(type === "context" || type === "hello"){
          if(NETWORK_DEBUG) console.log("Processing context");
          AnalyticsService.setLoginSessionId(responseJson.data.analytics.sessionId,responseJson.data.userId,responseJson.data.sessionId);
          if(URIHelper.isPeelUser()){
                  // var getLoginSessionRequest = {"rid": "loginId",
                  //   "timestamp": new Date().getTime(),
                  //   "method": "GET",
                  //   "uri": encodeURI("/v1.0/user/session/show")};
                  //   ws.send(getLoginSessionRequest);
                  
            UserInfoService.setUserCredentials(
              responseJson.data.userId, 
              responseJson.data.sessionId,
              "Peel");
          }
        }
        if(type === "channel"){
          if(NETWORK_DEBUG) console.log("Processing Channel");
          DataService.setChannel(responseJson);
        }
        if(type === "topic" || type === "score"){
          if(NETWORK_DEBUG) console.log("Processing Topic");
          DataService.setTopic(responseJson);
        }else if(type === "comment"){
          if(NETWORK_DEBUG) console.log("Processing Comments");
          DataService.setComments(responseJson);
        }
        else if(type === "reply"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing Reply");
          DataService.setReplies(responseJson);
        }
        else if(type === "social" || type ==="social_auto"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing Social");
          DataService.setSocial(responseJson);
        }
        else if(type === "video" || type ==="video_auto"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing Video");
          DataService.setVideo(responseJson);
        }
        else if(type === "loginId"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing loginId");
          // if(responseJson.data != null && responseJson.data.id != null)
          //   AnalyticsService.setLoginSessionId(responseJson.data.id);
          // else
          //   console.log("Error : not LoginId from Server");
        }
      }
    });

    ws.onError(function(evt) {
      if (NETWORK_DEBUG)
      console.log("Websocket OnError: ",evt);
    });

    function getWebsocketUri(){
      if(URIHelper.isPeelUser())
        return getPeelWebsocketUri();
      var user = UserInfoService.getUserCredentials();
      var socketUri = WEBSOCKET_BASE_URI+
      'userId='+user.userId+
      '&sessionId='+user.sessionId+
      '&accessToken='+user.accessToken+
      '/';
      if(NETWORK_DEBUG) console.log("socketUri: " + socketUri);
      return socketUri;
    }

    function getPeelWebsocketUri(){
      var socketUri = WEBSOCKET_BASE_URI_PEEL+
      'userId='+URIHelper.getPeelUserId()+
      '&userName=='+URIHelper.getPeelUserName()+
      '/';
      if(NETWORK_DEBUG) console.log("socketUri: " + socketUri);
      return socketUri;
    }
  }
  return{
    isSocketConnected:function(){
      if(NETWORK_DEBUG){
        if(ws!= null){
          if (NETWORK_DEBUG)
          console.log("ws status : "+ ws.readyState +"ws.OPEN :"+ ws.OPEN);
        }
        else {
          if (NETWORK_DEBUG)
          console.log("ws is null");
        }
      }
      if(ws != undefined && ws.readyState == 1){
        return true;
      }
      return false;
    },
    send:function(message) { 
      if(ws == undefined){ 
        initSocket();
      }
      ws.send(JSON.stringify(message));
    },
    closeSocket:function(){
      if(ws != undefined)
        ws.close();
    },
    init:initSocket
  }
}]);