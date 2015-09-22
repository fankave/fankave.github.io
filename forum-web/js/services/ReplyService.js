networkModule.factory('ReplyService', function (DateUtilityService, Bant,FDSUtility) {
	var _postID;
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
	var _topicIdFromReply;

	function setReplies(replyData) {
		_replies = [];
		tempReplyData = replyData.data.results;
		if(tempReplyData!= undefined && tempReplyData.length>0){
			var len = tempReplyData.length;
			// console.log("replies #"+ len);
			for(i=0;i<len;i++){
				var _replyObject = {};
				_replyObject = Bant.bant(tempReplyData[i])
				if(_replyObject.id != undefined )
					_replies.push(_replyObject);
				// console.log("Reply object"+_replyObject);
				_topicIdFromReply = tempReplyData[i].topicId;
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
		var replyObj = replyData.data;
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyObj.id){
				//update
				_replies[i] = Bant.bant(replyObj)
				console.log("Reply updated");
				return;
			}
		}
		appendToReplies(replyData);
		// console.log("ReplyService update Reply");
	}
	
	function updateLocalData(newData){
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == newData.id){
				//update
				_replies[i] = newData;
				if(NETWORK_DEBUG)
					console.log("updated Data for id:"+ _replies[i].id);
				return;
			}
		}
	}
	
	function updateLikeReplyWithId(id, liked){
		if(NETWORK_DEBUG)
		console.log("updateLikeReplyWithId :"+ id + "   liked "+ liked);
		if((id != undefined)){
			var tempObject;
			tempObject = getReplyById(id);
			tempObject = Bant.updateBantLiked(tempObject, liked);
			updateLocalData(tempObject);

			notifyObservers();
		}
		
	}

	function removeReply(replyData){
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//remove element
				_replies.splice(i,1);
			}
		}

	}
	
	function getReplyById(id){
		if(NETWORK_DEBUG) console.log("_replies :"+ _replies.length);
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == id){
				//remove element
				return _replies[i];
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

	function getPostReplyRequest(topicId, commentId,replyData, replyId, isReplyToReply){
		var targetType = "comment";
		var targetId = commentId;
		if(isReplyToReply != undefined && isReplyToReply == true ){
			targetType = "reply";
			targetId = replyId;
		}
		console.log("Topicid : "+topicId,"commentid : "+commentId,"replydata : "+replyData);
		var createReplyParams = replyPostRequest(POST_REPLY_URI);
		createReplyParams.data = 	
		{
				"lang": "en", 
				"content": {"sections":[{"type":"html","html":replyData}]},
				"target": {
					"type": targetType, // Target type: “comment” or “reply”.
					"id":targetId,  // Target bant ID of comment or reply.
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
		return  replyPostRequest(FLAG_REPLY_URI + id +"?reason=spam");
	}

	function unflagReplyRequest(id){
		return  replyPostRequest(UNFLAG_REPLY_URI + id);
	}
	
	function deleteReplyRequest(id){
		return  replyPostRequest(DELETE_REPLY_URI + id);
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
	function isReplyLiked(id){
		return FDSUtility.isLikedById(_replies, id);
	}
	
	function updateReplyLocalData(uri,id){
		if(uri == LIKE_REPLY_URI+id){
			console.log("calling update like ");
			updateLikeReplyWithId(id, true)
		}
		else if(uri == UNLIKE_REPLY_URI+id){
			updateLikeReplyWithId(id, false)
		}
		else if(uri == DELETE_REPLY_URI+id){
			_replies = FDSUtility.deleteById(_replies,id);
			notifyObservers();
		}
		else if(uri == FLAG_REPLY_URI+id){
			_replies = FDSUtility.flagById(_replies, true);
			}
		else if(uri == UNFLAG_REPLY_URI+id){
			_replies = FDSUtility.flagById(_replies, false);
		}
		else if(uri == HIDE_REPLY_URI+id){
			_replies = FDSUtility.hideById(_replies, true);
		}
		else if(uri == UNHIDE_REPLY_URI+id){
			_replies = FDSUtility.hideById(_replies, false);
		}
	}

	
	return {
		replies: function(){return _replies },
		getTopicIdFromReply: function(){return _topicIdFromReply; },
		getPostId: function(){return _postID ;},
		setPostId: function(postId){_postID = postId ;},
		setReplies:setReplies,
		updateReply:updateReply,
		appendToReplies:appendToReplies,
		updateLikeReplyWithId:updateLikeReplyWithId,
		updateReplyLocalData:updateReplyLocalData,
		removeReply:removeReply,
		getPostReplyRequest:getPostReplyRequest,
		likeReplyRequest:likeReplyRequest,
		unlikeReplyRequest:unlikeReplyRequest,
		deleteReplyRequest:deleteReplyRequest,
		flagReplyRequest:flagReplyRequest,
		registerObserverCallback:registerObserverCallback,
		getRepliesRequest:getRepliesRequest,
		isReplyLiked:isReplyLiked
	};

});