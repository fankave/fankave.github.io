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

	var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris";
	var postTypes = ["text", "text", "text", "photo", "video"];

	function getPostsForTopicID()
	{
		var staticPosts = [];
		
			var fakePhotos = ["fakePhoto1.jpg", "fakePhoto2.jpg", "fakePhoto3.jpg", "fakePhoto4.jpg", "fakePhoto5.jpg", "fakePhoto6.jpg"];
			var usedFakePhotos = 0;

			var fakeVideos = ["fakeVideo1.jpg", "fakeVideo2.jpg", "fakeVideo3.jpg"];
			var usedFakeVideos = 0;

			var peelDemoData = [
									{
										"type":"photo",
										"postContent":"Will this be the year Kaep teaches Sherman a lesson or will Kaep get schooled again?",
										"postMedia":"fakePhoto1.jpg"
									},
									{
										"type":"video",
										"postContent":"Remember Kyle Williams - for some reason, I am having recurring nightmares about him again - weird but true:(",
										"postMedia":"fakeVideo1.jpg"
									},
									{
										"type":"photo",
										"postContent":"Will Kaep be given a free reign to do whatever he wants? Please don't make him a pocket passer because HE IS NOT ONE",
										"postMedia":"fakePhoto2.jpg"
									},
									{
										"type":"video",
										"postContent":"Running back of the 9ers this season truly scares the hell out of me - thoughts?",
										"postMedia":"fakeVideo2.jpg"
									},
									{
										"type":"video",
										"postContent":"Will our defense save us again? We have seen that this offense needs lot of help:(",
										"postMedia":"fakeVideo3.jpg"
									},
									{
										"type":"photo",
										"postContent":"Can't wait for this game - gets me want to kick Seahawks every time we play them",
										"postMedia":"fakePhoto3.jpg"
									},
									{
										"type":"text",
										"postContent":"Jimmy Graham is going to be such a formidable match-up for our secondary. Not sure if we have the personnel to cover him. Hate the fact that the saehawks offense just got whole lot better this year",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"From contenders to last in the league - reasons for our free fall down the ranks",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"One more drubbing - when are we going to be good again?",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"How do we always fuck up the second half? It is always the take of two halves with us this year. Sucks",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"Are you fuckin kidding me - how did we miss that tackle? Why do we keep messing up defensively during 3rd and long? That is the 5th 3rd and long conversion for the Hawks.. Come on DDDDD",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"Time to talk about the next season already? Sure nothing is going to change and we are going to suck again.. ",
										"postMedia":""
									},
									{
										"type":"text",
										"postContent":"We miss Aldon Smith so much - we absolutely don't have an edge rusher.. what a jack-ass.. blew away so much second chances:(",
										"postMedia":""
									}
								]

		for(var i = 0 ; i < peelDemoData.length ; i++)
		{
			var peelPost = peelDemoData[i];
			var fakePost = new Object();
			fakePost.postID = i;
			var minimumCharacterCount = 20
			var randomCharacterCount = minimumCharacterCount + Math.round(Math.random() * (loremIpsum.length - minimumCharacterCount));
			// console.log("random character count: " + randomCharacterCount);
			var loremIpsumSubstring = loremIpsum.substring(0, randomCharacterCount);
			// console.log("-> " + loremIpsumSubstring);
			fakePost.postContent = peelPost.postContent;//loremIpsumSubstring
			var postType = peelPost.type;//postTypes[Math.floor(Math.random() * postTypes.length)];
			fakePost.postType = postType;
			if(postType == "photo")
			{
				var fakePhoto = fakePhotos[usedFakePhotos % fakePhotos.length];
				fakePost.photo = fakePhoto;
				// peelPost.photo = peelPost.postMedia
				usedFakePhotos++;
			}
			else if(postType == "video")
			{
				var fakeVideo = fakeVideos[usedFakeVideos % fakeVideos.length];
				fakePost.video = fakeVideo;
				// peelPost.video = peelPost.postMedia
				usedFakeVideos++;
			}

			var author = postAuthors[i % postAuthors.length];
			fakePost.postAuthorPhoto = author.photo;
			peelPost.postAuthorPhoto = author.photo;
			fakePost.postAuthorName = author.name;
			peelPost.postAuthorName = author.name;

			fakePost.likeCount = Math.floor(Math.random() * 100);
			peelPost.likeCount = Math.floor(Math.random() * 100);
			fakePost.commentCount = Math.floor(Math.random() * 500);
			peelPost.commentCount = Math.floor(Math.random() * 500);
			
			// console.log("fake post " + i + " :  " + JSON.stringify(fakePost));
			// console.log("fake post " + i + " :  " + JSON.stringify(peelPost));

			// staticPosts.push(fakePost);
			staticPosts.push(peelPost);
		}
		return staticPosts
	}

	function getRepliesForPostID()
	{
		/*
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
				*/

		var fakeReplies = [];
		for(var i = 0 ; i < 10 ; i++)
		{
			var fakeReply = new Object();
			fakeReply.postID = i;
			var minimumCharacterCount = 20
			var randomCharacterCount = minimumCharacterCount + Math.round(Math.random() * (loremIpsum.length - minimumCharacterCount));
			// console.log("random character count: " + randomCharacterCount);
			var loremIpsumSubstring = loremIpsum.substring(0, randomCharacterCount);
			// console.log("-> " + loremIpsumSubstring);
			fakeReply.replyContent = loremIpsumSubstring
			fakeReply.replyType = "text";

			var author = postAuthors[i % postAuthors.length];
			fakeReply.postAuthorPhoto = author.photo;
			fakeReply.postAuthorName = author.name;

			fakeReply.likeCount = Math.floor(Math.random() * 100);
			fakeReply.commentCount = Math.floor(Math.random() * 500);

			// staticPosts.push(fakePost);
			fakeReplies.push(fakeReply);
		}

		return fakeReplies
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