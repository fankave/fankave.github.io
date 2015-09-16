var networkModule = angular.module("NetworkModule", ['ngWebSocket']);
networkModule.factory("networkService",["$websocket","DataService","UserInfoService",initNetworkService]);

function initNetworkService($websocket,DataService,UserInfoService)
{
	var WEBSOCKET_BASE_URI = 'ws://104.197.8.198/ws?';

	var ws;


	return{
		send:function(message) { ws.send(JSON.stringify(message));},
		init:function() { 
			// console.log("init networkService");
			ws = $websocket(getWebsocketUri());

			//Websocket callbacks below
			ws.onOpen(function() {
				console.log("Websocket Connected");
			});

			ws.onClose(function(evt) {
				console.log("Websocket Closed")
			});

			ws.onMessage(function(evt) {
				// console.log("Websocket Message Recieved :  " +evt.data);
				var responseJson = JSON.parse(evt.data);
				var type = responseJson.rid;
				if(type != undefined){
					if(type == "topic" || type == "score"){
						DataService.setTopic(responseJson);
						// console.log("Processing Topic");
					}else if(type == "comment"){
						// console.log("Processing Comments");
						DataService.setComments(responseJson);
					}
					else if(type == "reply"){
						//TODO handle Replies
						// console.log("Processing Reply");
						DataService.setReplies(responseJson);
					}
				}
			});

			ws.onError(function(evt) {
				console.log("Websocket OnError: "+evt.data);
			});

			function getWebsocketUri(){
				var user = UserInfoService.getUserCredentials();
				var socketUri = WEBSOCKET_BASE_URI+
				'userId='+user.userId+
				'&sessionId='+user.sessionId+
				'&accessToken='+user.accessToken+
				'/';
				return socketUri;
			}
		}
	}
}