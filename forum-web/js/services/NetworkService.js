var networkModule = angular.module("NetworkModule", ['ngWebSocket']);
networkModule.factory("networkService",["$websocket","DataService",initNetworkService]);

function initNetworkService($websocket,DataService)
{
	var ws = $websocket('ws://107.178.223.208/ws?userId=1&sessionId=dac24379&accessToken=7uFF3QGh-84=/');
	var varTopicParams = {"rid": "requestID",
            "timestamp": new Date().getTime(),
            "method": "GET",
            "uri": "\/v1.0\/topic\/show\/53c167f17040001d"};
	var varCommentParams = {"rid": "requestID",
		      "timestamp": new Date().getTime(),
		      "method": "GET",
		      "uri": encodeURI("/v1.0/topic/comments/list/53c167f17040001d")};
	//Websocket callbacks below
	ws.onOpen(function() {
		console.log("Socket Connected");
		ws.send(JSON.stringify(varTopicParams));
		ws.send(JSON.stringify(varCommentParams));
    });
	
	ws.onClose(function(evt) {
		console.log("Socket closed")
    });
	
    ws.onMessage(function(evt) {
  	  console.log("OnMessage");
  	  console.log(evt.data);
  	  var responseJson = JSON.parse(evt.data);
  	  DataService.data.push(evt.data);
//  	var type = responseJson.data.type;
//	  if(type != undefined && type =="topic"){
//		  console.log("Got Topic");
//		  DataService.topic = responseJson;
//	  }else{
//		  console.log("Got Comments ...TODO");
//	  	  DataService.data.push(responseJson);
//	  };
    });
    
    ws.onError(function(evt) {
  	  console.log("OnError:"+evt.data);
    });
    
	function getPostsForTopicID()
	{
		return [
					{
						"postID":"0",
						"postContent":"post 1"
					},
					{
						"postID":"1",
						"postContent":"post 2"
					},
					{
						"postID":"2",
						"postContent":"post 3"
					},
					{
						"postID":"3",
						"postContent":"post 4"
					},
					{
						"postID":"4",
						"postContent":"post 5"
					}
				];
	}

	function getRepliesForPostID()
	{
		return [
					{
						"replyID":"0",
						"replyContent":"reply A"
					},
					{
						"replyID":"1",
						"replyContent":"reply B"
					},
					{
						"replyID":"2",
						"replyContent":"reply C"
					},
					{
						"replyID":"3",
						"replyContent":"reply D"
					},
					{
						"replyID":"4",
						"replyContent":"reply E"
					}
				]
	}

	return{
		topic: DataService.topic,
		comments: DataService.comments,
		data: DataService.data,
		send:function(message) { ws.send(message);},
		getPostsForTopicID:getPostsForTopicID,
		getRepliesForPostID:getRepliesForPostID
	}
}