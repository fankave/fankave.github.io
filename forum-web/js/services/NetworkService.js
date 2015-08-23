var networkModule = angular.module("NetworkModule", ['ngWebSocket']);
networkModule.factory("networkService",["$websocket","DataService",initNetworkService]);

function initNetworkService($websocket,DataService)
{
	var OLD_URI = 'ws://107.178.223.208/ws?userId=1&sessionId=dac24379&accessToken=7uFF3QGh-84=/';
	//var OLD_STATIC_TOPIC_ID = "53c167f17040001d";
	
	var NEW_URI = 'ws://104.197.8.198/ws?userId=37&sessionId=3950cd16&accessToken=NrRwUQTzWEU=/';
	//new topicID 
	//var NEW_STATIC_TOPIC_ID1 = 53ccf152c5000001;
	//var NEW_STATIC_TOPIC_ID2 = 53ccf184c0c00002;
	
	var ws = $websocket(NEW_URI);
	
	//Websocket callbacks below
	ws.onOpen(function() {
		console.log("Socket Connected");
    });
	
	ws.onClose(function(evt) {
		console.log("Socket closed")
    });
	
    ws.onMessage(function(evt) {
  	  console.log("OnMessage");
  	  console.log(evt.data);
  	  var responseJson = JSON.parse(evt.data);
  	  DataService.data.push(responseJson);
  	  var type = responseJson.rid;
	  if(type != undefined && type =="topic"){
		  DataService.setTopic(responseJson);
		  console.log("Got Topic");
	  }else{
		  console.log("Got Comments ...TODO");
		 
	  	  DataService.setComments(responseJson);
	  };
    });
    
    ws.onError(function(evt) {
  	  console.log("OnError:"+evt.data);
    });
    
	function getPostsForTopicID()
	{
		var staticPosts = [];
		var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris";
		var postTypes = ["text", "text", "text", "photo", "video"];
		var postAuthors = [
							{
								"photo":"ana.png",
								"name":"Ana"
							},
							{
								"photo":"arod.png",
								"name":"A-Rod"
							},
							{
								"photo":"cristiano.png",
								"name":"Cristiano"
							},
							{
								"photo":"derek.png",
								"name":"Derek"
							},
							{
								"photo":"dwayne.png",
								"name":"Dwayne"
							},
							{
								"photo":"erin.png",
								"name":"Erin"
							},
							{
								"photo":"jordan.png",
								"name":"Michael"
							},
							{
								"photo":"lebron.png",
								"name":"Lebron"
							},
							{
								"photo":"lionel.png",
								"name":"Lionel"
							},
							{
								"photo":"maria.png",
								"name":"Maria"
							}
						];
			var fakePhotos = ["fakePhoto1.jpg", "fakePhoto2.jpg", "fakePhoto3.jpg", "fakePhoto4.jpg", "fakePhoto5.jpg", "fakePhoto6.jpg"];
			var usedFakePhotos = 0;

			var fakeVideos = ["fakeVideo1.jpg", "fakeVideo2.jpg", "fakeVideo3.jpg"];
			var usedFakeVideos = 0;

		for(var i = 0 ; i < 20 ; i++)
		{
			var fakePost = new Object();
			fakePost.postID = i;
			var minimumCharacterCount = 20
			var randomCharacterCount = minimumCharacterCount + Math.round(Math.random() * (loremIpsum.length - minimumCharacterCount));
			// console.log("random character count: " + randomCharacterCount);
			var loremIpsumSubstring = loremIpsum.substring(0, randomCharacterCount);
			// console.log("-> " + loremIpsumSubstring);
			fakePost.postContent = loremIpsumSubstring
			var postType = postTypes[Math.floor(Math.random() * postTypes.length)];
			fakePost.postType = postType;
			if(postType == "photo")
			{
				var fakePhoto = fakePhotos[usedFakePhotos % fakePhotos.length];
				fakePost.photo = fakePhoto;
				usedFakePhotos++;
			}
			else if(postType == "video")
			{
				var fakeVideo = fakeVideos[usedFakeVideos % fakeVideos.length];
				fakePost.video = fakeVideo;
				usedFakeVideos++;
			}

			var author = postAuthors[i % postAuthors.length];
			fakePost.postAuthorPhoto = author.photo;
			fakePost.postAuthorName = author.name;

			fakePost.likeCount = Math.floor(Math.random() * 100);
			fakePost.commentCount = Math.floor(Math.random() * 500);
			
			// console.log("fake post " + i + " :  " + JSON.stringify(fakePost));

			staticPosts.push(fakePost);
		}
		return staticPosts
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
		comments: DataService.comments,
		data: DataService.data,
		send:function(message) { ws.send(JSON.stringify(message));},
		init:function(message) { ws.send(JSON.stringify(varTopicParams));
								 ws.send(JSON.stringify(varCommentParams));
								 },
		getPostsForTopicID:getPostsForTopicID,
		getRepliesForPostID:getRepliesForPostID
	}
}