networkModule.factory('ReplyService', function (DateUtilityService) {
	var LIST_REPLIES_URI = "/v1.0/reply/replies/list/"
	var POST_REPLY_URI="/v1.0/reply/create";
	var UPDATE_REPLY_URI = "/v1.0/reply/content/update/";
	var DELETE_REPLY_URI = "/v1.0/reply/delete/"
	var LIKE_REPLY_URI = "/v1.0/reply/like/";
	var UNLIKE_REPLY_URI = "/v1.0/reply/unlike/";
	var observerCallbacks = [];
	var _replies = [];
	var _replyObject = {
		id:"",
		author:"",
		owner:"",
		photo:"",
		type:"",
		html:"",
		media:"",
		tweet:"",
		ogp:"",
		limk:"",
		metrics:"",
		createdAt:""
		
	};
	
	function setReplies(replyData) {
		tempReplyData = replyData.data.results;
		if(tempReplyData!= undefined && tempReplyData.length>0)
			var len = tempReplyData.length;
			for(i=0;i<len;i++){
				var _replyObject = {};
				_replyObject.id = tempReplyData[i].id;
				_replyObject.author = tempReplyData[i].author;
				_replyObject.owner = tempReplyData[i].owner;
				_replyObject.photo = tempReplyData[i].author.photo;
				_replyObject.type = tempReplyData[i].content.sections[0].type;
				_replyObject.html = tempReplyData[i].content.sections[0].html;
				_replyObject.media = tempReplyData[i].content.sections[0].media;
				_replyObject.tweet = tempReplyData[i].content.sections[0].tweet;
				_replyObject.ogp = tempReplyData[i].content.sections[0].ogp;
				_replyObject.link = tempReplyData[i].content.sections[0].link;
				_replyObject.metrics = tempReplyData[i].metrics;
				_replyObject.createdAt = DateUtilityService.getTimeSince(tempReplyData[i].createdAt);
				if(_replyObject.id != undefined && _replyObject.html != undefined)
				_replies.push(_replyObject);
				console.log("ReplService in setReplies reply:"+_replies[i].html );
			}
		notifyObservers();
	}
	
	function appendToReplies(postReplyData) {
		tempPostedReply = postReplyData.data;
		if(tempReplysData!= undefined){
				var _replyObject = {};
				_replyObject.id = tempPostedReply.id;
				_replyObject.author = tempPostedReply.author;
				_replyObject.owner = tempPostedReply.owner;
				_replyObject.photo = tempPostedReply.author.photo;
				_replyObject.type = tempPostedReply.content.sections[0].type;
				_replyObject.html = tempPostedReply.content.sections[0].html;
				_replyObject.media = tempPostedReply.content.sections[0].media;
				_replyObject.tweet = tempPostedReply.content.sections[0].tweet;
				_replyObject.ogp = tempPostedReply.content.sections[0].ogp;
				_replyObject.link = tempPostedReply.content.sections[0].link;
				_replyObject.metrics = tempPostedReply.metrics;
				_replyObject.createdAt = DateUtilityService.getTimeSince(tempPostedReply.createdAt);
				if(_replyObject.id != undefined && _replyObject.html != undefined)
				_relies.unshift(_replyObject);
				console.log("ReplyService appendToReplys "+_replyObject.html );
			}
		notifyObservers();
	}
	
	
	
	
	function updateReply(replyData){
		//if Replys ID exist, update it 
		//else append to existing list
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//update
				_replies[i].id = replyData.id;
				_replies[i].author = replyData.author;
				_replies[i].owner = replyData.owner;
				_replies[i].photo = replyData.photo;
				_replies[i].type = replyData.content.sections[0].type;
				_replies[i].html = replyData.content.sections[0].html;
				_replies[i].media = replyData.content.sections[0].media;
				_replies[i].tweet = replyData.content.sections[0].tweet;
				_replies[i].ogp = replyData.content.sections[0].ogp;
				_replies[i].link = replyData.content.sections[0].link;
				_replies[i].metrics = replyData.metrics;
				_replies[i].createdAt = DateUtilityService.getTimeSince(replyData.createdAt);
				return;
			}
		}
		_replies.push(replyData);
		//notifyObservers();
		console.log("ReplyService updateReply");
	}
	
	function removeReply(replyData){
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//remove element
				_replies.splice(i,1);
			}
		}
		
	}
		

	
	
	//call this when you know '_replies' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	function getReplysRequest(replyId){
		var uri = LIST_REPLIES_URI+replyId;
		
		return  varReplyParams = {"rid": "reply",
			      "timestamp": new Date().getTime(),
			      "method": "GET",
			      "uri": encodeURI(uri)};
	}
	
	function postReplyRequest(topicId, replyData){
		var ReplyHtml = "<!DOCTYPE html><html><body>" + replyData + "</body></html>";
				
		var createReplyParams =
			   {"rid": "reply",
	            "timestamp": new Date().getTime(),
	            "method": "POST",
	            "uri": encodeURI(POST_REPLY_URI),
	            "data":{
	            		"lang": "en", 
	            		"content": {"sections":[{"type":"html","html":replyData}]},
	            		"topicId": topicId,
		}};
		return createReplyParams;
	}
	
	function likeReplyRequest(){
		return  varLikeParams = {"rid": "reply",
	            "timestamp": new Date().getTime(),
	            "method": "POST",
	            "uri": encodeURI(LIKE_REPLY_URI + _id)};
		

	}
	
	function unlikeReplyRequest(){
		return  varLikeParams = {"rid": "reply",
	            "timestamp": new Date().getTime(),
	            "method": "POST",
	            "uri": encodeURI(UNLIKE_REPLY_URI + _id)};
		

	}
	


	return {
		replys: function(){
		return _replys },
		
		setReplys:setReplys,
		updateReply:updateReply,
		appendToReplies:appendToReplies,
		removeReply:removeReply,
		postReplyRequest:postReplyRequest,
		likeReplyRequest:likeReplyRequest,
		unlikeReplyRequest:unlikeReplyRequest,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("Replies callback registered");
			observerCallbacks.push(callback);
		},
		getReplysRequest:getReplysRequest
	};

});