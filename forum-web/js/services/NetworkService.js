var networkModule = angular.module("NetworkModule", ['ngWebSocket']);
networkModule.factory("networkService",["$websocket","DataService","UserInfoService",initNetworkService]);

var NETWORK_DEBUG = true;

function initNetworkService($websocket,DataService,UserInfoService)
{
	var WEBSOCKET_BASE_URI = 'ws://was.fankave.com/ws?';

	var ws;
	function initSocket() { 
		ws = $websocket(getWebsocketUri());
		DataService.setWatchTopic(false);
		//Websocket callbacks below
		ws.onOpen(function() {
			console.log("Websocket Connected");
		});

		ws.onClose(function(evt) {
			ws = undefined;
			console.log("Websocket Closed :"+evt.data);
		});

		ws.onMessage(function(evt) {
			if(NETWORK_DEBUG) console.log("Websocket Message Recieved :  " +evt.data);
			var responseJson = JSON.parse(evt.data);
			var type = responseJson.rid;
			if(type != undefined){
				if(type == "channel"){
					DataService.setChannel(responseJson);
					if(NETWORK_DEBUG) console.log("Processing Channel");
				}
				if(type == "topic" || type == "score"){
					DataService.setTopic(responseJson);
					if(NETWORK_DEBUG) console.log("Processing Topic");
				}else if(type == "comment"){
					if(NETWORK_DEBUG) console.log("Processing Comments");
					DataService.setComments(responseJson);
				}
				else if(type == "reply"){
					//TODO handle Replies
					if(NETWORK_DEBUG) console.log("Processing Reply");
					DataService.setReplies(responseJson);
				}
			}
		});

		ws.onError(function(evt) {
			
			console.log("Websocket OnError: "+JSON.stringify(evt) );
		});

		function getWebsocketUri(){
			var user = UserInfoService.getUserCredentials();
			var socketUri = WEBSOCKET_BASE_URI+
			'userId='+user.userId+
			'&sessionId='+user.sessionId+
			'&accessToken='+user.accessToken+
			'/';
			if(NETWORK_DEBUG) console.log("socketUri" + socketUri);
			return socketUri;
		}
	}
	return{
		isSocketConnected:function(){
			if(NETWORK_DEBUG){
				if(ws!= null)
				console.log("ws status : "+ ws.readyState);
				else
					console.log("ws is null");
			}
			if(ws != undefined && ws.readyState == ws.OPEN){
				return true;
			}
			return false;
		},
		send:function(message) { 
			if(ws == undefined) 
			initSocket();
			ws.send(JSON.stringify(message));
			},
		init:initSocket
	}
}