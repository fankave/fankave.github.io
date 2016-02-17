angular.module("NetworkModule", ['ngWebSocket'])
.factory("networkService",["$websocket","$route","DataService","UserInfoService",

function ($websocket,$route,DataService,UserInfoService)
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
        else if(type === "social"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing Social");
          DataService.setSocial(responseJson);
        }
        else if(type === "video"){
          //TODO handle Replies
          if(NETWORK_DEBUG) console.log("Processing Video");
          DataService.setVideo(responseJson);
        }
      }
    });

    ws.onError(function(evt) {
      if (NETWORK_DEBUG)
      console.log("Websocket OnError: ",evt);
    });

    function getWebsocketUri(){
      var user = UserInfoService.getUserCredentials();
      var socketUri = WEBSOCKET_BASE_URI+
      'userId='+user.userId+
      '&sessionId='+user.sessionId+
      '&accessToken='+user.accessToken+
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
      if(ws != undefined && ws.readyState == ws.OPEN){
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
    init:initSocket
  }
}]);