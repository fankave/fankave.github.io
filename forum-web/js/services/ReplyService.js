networkModule.factory('ReplyService', function (DateUtilityService, Bant) {
	var LIST_REPLIES_URI = "/v1.0/comment/replies/list/"
	var POST_REPLY_URI="/v1.0/reply/create";
	
	var UPDATE_REPLY_URI = "/v1.0/reply/content/update/";
	var DELETE_REPLY_URI = "/v1.0/reply/delete/";
		
	var LIKE_REPLY_URI = "/v1.0/reply/like/";
	var UNLIKE_REPLY_URI = "/v1.0/reply/unlike/";
	
	var HIDE_REPLY_URI = "/v1.0/reply/hide/";
	var UNHIDE_REPLY_URI = "/v1.0/reply/unhide/";
	
	var FLAG_REPLY_URI = "/v1.0/reply/flag/";
	var UNFLAG_REPLY_URI = "/v1.0/reply/unflag/";
	
	var observerCallbacks = [];
	var _replies = [];

	function setReplies(replyData) {
		_replies = [];
		tempReplyData = replyData.data.results;
		if(tempReplyData!= undefined && tempReplyData.length>0){
			var len = tempReplyData.length;
			console.log("replies #"+ len);
			for(i=0;i<len;i++){
				var _replyObject = {};
				_replyObject = Bant.bant(tempReplyData[i])
				if(_replyObject.id != undefined )
					_replies.push(_replyObject);
				console.log("Reply object"+_replyObject);
			}
			notifyObservers();
		}
	}

	function appendToReplies(postReplyData) {
		var tempPostedReply = postReplyData.data;
		if(tempPostedReply!= undefined){
			console.log("appendToReplies :"+tempPostedReply);
			var _replyObject = Bant.bant(tempPostedReply);
			if(_replyObject.id != undefined )
				_replies.push(_replyObject);
			notifyObservers();
		}
	}

	function updateReply(replyData){
		//if Replys ID exist, update it 
		//else append to existing list
		var tempReply = replyData.data;
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//update
				_replies[i] = Bant.bant(tempReply)
				return;
			}
		}
		appendToReplies(replyData);
		console.log("ReplyService update Reply");
	}

	function removeReply(replyData){
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//remove element
				_replies.splice(i,1);
			}
		}

	}
	
	function replyGetRequest(uri){
		return  varReplyParams = {"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(uri)};
		
	}
	
	function replyPostRequest(uri){
		return varPostParams = {
				"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(uri)}
		
	}
	
	function getRepliesRequest(commentId){
		var uri = LIST_REPLIES_URI + commentId;
		return replyGetRequest (uri);
		
	}

	function postReplyRequest(topicId, commentId,replyData){
		console.log("Topicid : "+topicId,"commentid : "+commentId,"replydata : "+replyData);
		var createReplyParams =replyPostRequest(POST_REPLY_URI);
		createReplyParams.data = 	
		{
				"lang": "en", 
				"content": {"sections":[{"type":"html","html":replyData}]},
				"target": {
					"type": "comment", // Target type: “comment” or “reply”.
					"id":commentId,  // Target bant ID of comment or reply.
				},

				"topicId": topicId,
				"commentId": commentId
		};
		return createReplyParams;
	}

	function likeReplyRequest(id){
		return  replyPostRequest(LIKE_REPLY_URI + id);
	}

	function unlikeReplyRequest(id){
		return  replyPostRequest(UNLIKE_REPLY_URI + id);
	}
	
	
	function hideReplyRequest(id){
		return  replyPostRequest(HIDE_REPLY_URI + id);
	}

	function unhideReplyRequest(id){
		return  replyPostRequest(UNHIDE_REPLY_URI + id);
	}
	
	function flagReplyRequest(id){
		return  replyPostRequest(FLAG_REPLY_URI + id);
	}

	function unflagReplyRequest(id){
		return  replyPostRequest(UNFLAG_REPLY_URI + id);
	}
	
	
	
	//call this when you know '_replies' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	
	function registerObserverCallback(callback){
		//register an observer
		// console.log("reply callback registered");
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}
	
	return {
		replies: function(){return _replies },

		setReplies:setReplies,
		updateReply:updateReply,
		appendToReplies:appendToReplies,
		removeReply:removeReply,
		postReplyRequest:postReplyRequest,
		likeReplyRequest:likeReplyRequest,
		unlikeReplyRequest:unlikeReplyRequest,
		registerObserverCallback:registerObserverCallback,
		getRepliesRequest:getRepliesRequest
	};

});