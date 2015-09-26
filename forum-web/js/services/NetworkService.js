var networkModule = angular.module("NetworkModule", ['ngWebSocket']);
networkModule.factory("networkService",["$websocket","DataService","UserInfoService",initNetworkService]);

var NETWORK_DEBUG = true;

function initNetworkService($websocket,DataService,UserInfoService)
{
	var WEBSOCKET_BASE_URI = 'ws://104.197.8.198/ws?';

	var ws;

	return{
		send:function(message) { ws.send(JSON.stringify(message));},
		init:function() { 
			ws = $websocket(getWebsocketUri());

			//Websocket callbacks below
			ws.onOpen(function() {
				console.log("Websocket Connected");
			});

			ws.onClose(function(evt) {
				console.log("Websocket Closed")
			});

			ws.onMessage(function(evt) {
				if(NETWORK_DEBUG) console.log("Websocket Message Recieved :  " +evt.data);
				var responseJson = JSON.parse(evt.data);
				var type = responseJson.rid;
				if(type != undefined){
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
	}
}