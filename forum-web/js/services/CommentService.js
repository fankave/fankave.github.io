networkModule.factory('CommentService', function (Bant,DateUtilityService,FDSUtility) {
	var LIST_COMMENTS_URI = "/v1.0/topic/comments/list/"
	var SHOW_COMMENT_URI = "/v1.0/comment/show/";
		
	var POST_COMMENT_URI="/v1.0/comment/create";
	var UPDATE_COMMNET_URI = "/v1.0/comment/content/update/";
	var PIN_COMMENT_URI = "/v1.0/comment/pin/";
	var DELETE_COMMENT_URI = "/v1.0/comment/delete/";
	
	var LIKE_COMMENT_URI = "/v1.0/comment/like/";
	var UNLIKE_COMMENT_URI = "/v1.0/comment/unlike/";

	var HIDE_COMMENT_URI = "/v1.0/comment/hide/";
	var UNHIDE_COMMENT_URI = "/v1.0/comment/unhide/";
	
	var FLAG_COMMENT_URI = "/v1.0/comment/flag/";
	var UNFLAG_COMMENT_URI = "/v1.0/comment/unflag/";
	
	var observerCallbacks = [];
	var _comments = [];
	var _pinnedComments = 0;


	function setComments(commentsData) {
		//TODO clear comments for complete refresh Comments API
		_comments = [];
		tempCommentsData = commentsData.data.results;
		if(tempCommentsData!= undefined && tempCommentsData.length>0){
			var len = tempCommentsData.length;
			for(i=0;i<len;i++){
				var _commentObject = {};
				_commentObject = Bant.bant(tempCommentsData[i]);
				if(_commentObject.id != undefined)
					_comments.push(_commentObject);
				// console.log("Comments in set comment Service type:"+_commentObject.type + "  " +_commentObject.html );
			}
			notifyObservers();
		}
		else{
			//PArticular case when user is on reply page and requires comment by comment ID
			var data = commentsData.data;
			if((commentsData.method == "GET") &&(commentsData.uri.substring(0,SHOW_COMMENT_URI.length) == SHOW_COMMENT_URI) ){
				if(NETWORK_DEBUG) console.log("Processing Show comment");
				var _commentObject = {};
				_commentObject = Bant.bant(data);
				if(_commentObject.id != undefined)
					_comments.push(_commentObject);	
				notifyObservers();
			}
		}
	}

	function appendToComments(postCommentData) {
		var tempComment = postCommentData.data;
		if(tempComment!= undefined){
			var _commentObject = {};
			_commentObject = Bant.bant(tempComment);
			if(_commentObject.id != undefined && _commentObject.html != undefined){
				var i = 0;
				if(_comments.length >0)
				while(_comments[i].pin == true)
					i++; 
				_pinnedComments = i;
				//console.log("Pinned comments "+ i);
				if(_pinnedComments>0)
					_comments.splice(i,0,_commentObject);
				else
					_comments.unshift(_commentObject);
			}
			// console.log("appendToComments CommentService"+_commentObject.html );
		}
		notifyObservers();
	}




	function updateComment(commentData){
		//if comments ID exist, update it 
		//else append to existing list
		var commentObj = commentData.data;
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == commentObj.id){
				//update
				_comments[i] = Bant.bant(commentObj);
				return 1;
			}
		}
		appendToComments(commentData);
		//notifyObservers();
		console.log("In Comment Service update comment");
		return 0;
	}
	
	function updateLocalData(newData){
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == newData.id){
				//update
				_comments[i] = newData;
				return;
			}
		}
	}
	
	function updateLikeCommentWithId(id, liked){
		if(NETWORK_DEBUG)
		console.log("updateLikeCommentWithId :"+ id + "   liked "+ liked);
		if((id != undefined)){
			var tempObject;
			tempObject = getCommentById(id);
			tempObject = Bant.updateBantLiked(tempObject, liked);
			updateLocalData(tempObject);

			notifyObservers();
		}
		
	}

	function removeComment(commentData){
		var commentObj = commentData.data;
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == commentObj.id){
				//remove element
				_comments.splice(i,1);
				console.log("found Comment")
				return 0;
			}
		}
		return 1;

	}
	
	function getCommentById(id){
		if(NETWORK_DEBUG) console.log("_comments :"+ _comments.length);
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == id){
				//remove element
				return _comments[i];
			}
		}
	}




	//call this when you know 'comments' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	
	function registerObserverCallback(callback){
		//register an observer
		// console.log("comments callback registered");
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}
	
	function commentGetRequest(uri){
		return  {"rid": "comment",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(uri)}
	}
	function commentPostRequest(uri){
		return  {"rid": "comment",
			"timestamp": new Date().getTime(),
			"method": "POST",
			"uri": encodeURI(uri)}
	}
	function getCommentsRequest(commentId){
		var uri = LIST_COMMENTS_URI+commentId;
		return  commentGetRequest(uri);
	}
	
	function getCommentByIdRequest(commentId){
		var uri = SHOW_COMMENT_URI + commentId;
		return  commentGetRequest(uri);
	}

	function postCommentRequest(topicId, commentData){
		var createCommentParams = commentPostRequest(POST_COMMENT_URI);
		createCommentParams.data =
				{
					"lang": "en", 
					"content": {"sections":[{"type":"html","html":commentData}]},
					"topicId": topicId,
				};
		return createCommentParams;
	}
	function postCommentRequestForMedia(topicId, commentData, mediaData){
		var m = {"media":[mediaData]};
		
		var createCommentParams = commentPostRequest(POST_COMMENT_URI);
		createCommentParams.data =
				{
					"lang": "en", 
					"content": {"sections":[{"type":"html","html":commentData},{"type":"media"}]},
					
					"topicId": topicId,
				};
		createCommentParams.data.content.sections[1].media = m.media;
		console.log("Media comment Request :"+ JSON.stringify(createCommentParams, null, 10));
		return createCommentParams;
	}
	
	function postCommentRequestForShare(topicId, commentData, embedData){
		var createCommentParams = commentPostRequest(POST_COMMENT_URI);
		createCommentParams.data =
				{
					"lang": "en", 
					"content": {"sections":[{"type":"html","html":commentData},{"type":"embed"}]},
					
					"topicId": topicId,
				};
		createCommentParams.data.content.sections[1].embed = embedData;
		console.log("Media comment Request :"+ JSON.stringify(createCommentParams, null, 10));
		return createCommentParams;
	}

	function likeCommentRequest(id){
		return commentPostRequest(LIKE_COMMENT_URI + id);

	}

	function unlikeCommentRequest(id){
		return commentPostRequest(UNLIKE_COMMENT_URI + id);
	}
	
	function hideCommentRequest(id){
		return commentPostRequest(HIDE_COMMENT_URI + id);

	}

	function unhideCommentRequest(id){
		return commentPostRequest(UNHIDE_COMMENT_URI + id);
	}
	
	function flagCommentRequest(id){
		return commentPostRequest(FLAG_COMMENT_URI + id + "?reason=spam");

	}

	function unflagCommentRequest(id){
		return commentPostRequest(UNFLAG_COMMENT_URI + id);
	}
	
	function deleteCommentRequest(id){
		return commentPostRequest(DELETE_COMMENT_URI + id);
	}
	
	function isCommentLiked(id){
		return FDSUtility.isLikedById(_comments,id);
	}
	
	
	function updateReplyCountById(id, value){
		if(id != undefined ){
		//var id = replyData.commentId;
		var tempStructure = getCommentById(id);
		if(tempStructure != undefined){
			if(NETWORK_DEBUG) console.log("found element :"+ tempStructure  + " tempStructure.metrics.replies :"+ tempStructure.metrics.replies);
			if(value == -1){
			tempStructure.metrics.replies == undefined ? tempStructure.metrics.replies = 0: tempStructure.metrics.replies = tempStructure.metrics.replies - 1;
			}
			else {
				
				tempStructure.metrics.replies == undefined ? tempStructure.metrics.replies = 1: tempStructure.metrics.replies = tempStructure.metrics.replies + 1;
			}
			updateLocalData(tempStructure);	
		notifyObservers();
		}
		}
		
	}

	function updateCommentLocalData(uri,id){
		if(uri == LIKE_COMMENT_URI+id){
			console.log("calling update like ");
			updateLikeCommentWithId(id, true)
		}
		else if(uri == UNLIKE_COMMENT_URI+id){
			updateLikeCommentWithId(id, false)
		}
		else if(uri == DELETE_COMMENT_URI+id){
			_comments = FDSUtility.deleteById(_comments,id);
			notifyObservers();
			return 0;
		}
		else if(uri == FLAG_COMMENT_URI+id){
			_comments = FDSUtility.flagById(_comments, false);
			}
		else if(uri == UNFLAG_COMMENT_URI+id){
			_comments = FDSUtility.flagById(_comments, false);
		}
		else if(uri == HIDE_COMMENT_URI+id){
			_comments = FDSUtility.hideById(_comments, true);
		}
		else if(uri == UNHIDE_COMMENT_URI+id){
			_comments = FDSUtility.hideById(_comments, false);
		}
	}


	return {
		comments: function(){
			return _comments },

			setComments:setComments,
			updateComment:updateComment,
			appendToComments:appendToComments,
			updateLikeCommentWithId:updateLikeCommentWithId,
			updateCommentLocalData:updateCommentLocalData,
			updateReplyCountById:updateReplyCountById,
			removeComment:removeComment,
			postCommentRequest:postCommentRequest,
			postCommentRequestForMedia:postCommentRequestForMedia,
			postCommentRequestForShare:postCommentRequestForShare,
			getLikeCommentRequest:likeCommentRequest,
			getUnlikeCommentRequest:unlikeCommentRequest,
			registerObserverCallback:registerObserverCallback,
			getCommentsRequest:getCommentsRequest,
			getCommentById:getCommentById,
			getCommentByIdRequest:getCommentByIdRequest,
			deleteCommentRequest:deleteCommentRequest,
			flagCommentRequest:flagCommentRequest,
			isCommentLiked:isCommentLiked,
			getNumPinComments:function(){
				return _pinnedComments;
			}
	};

});