networkModule.factory('CommentService', function (Bant,DateUtilityService) {
	var LIST_COMMENTS_URI = "/v1.0/topic/comments/list/"
		
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


	function setComments(commentsData) {
		//TODO clear comments for complete refresh Comments API
		_comments = [];
		tempCommentsData = commentsData.data.results;
		if(tempCommentsData!= undefined && tempCommentsData.length>0)
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

	function appendToComments(postCommentData) {
		var tempComment = postCommentData.data;
		if(tempComment!= undefined){
			var _commentObject = {};
			_commentObject = Bant.bant(tempComment);
			if(_commentObject.id != undefined && _commentObject.html != undefined)
				_comments.unshift(_commentObject);
			// console.log("appendToComments CommentService"+_commentObject.html );
		}
		notifyObservers();
	}




	function updateComment(commentData){
		//if comments ID exist, update it 
		//else append to existing list
		var tempComment = commentData.data;
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == tempComment.id){
				//update
				_comments[i] = Bant.bant(tempComment);
				return;
			}
		}
		appendToComments(commentData);
		//notifyObservers();
		console.log("In Comment Service update comment");
	}

	function removeComment(commentData){
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == commentData.id){
				//remove element
				_comments.splice(i,1);
			}
		}

	}
	
	function getCommentById(id){
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
		return commentPostRequest(FLAG_COMMENT_URI + id);

	}

	function unflagCommentRequest(id){
		return commentPostRequest(UNFLAG_COMMENT_URI + id);
	}
	
	



	return {
		comments: function(){
			return _comments },

			setComments:setComments,
			updateComment:updateComment,
			appendToComments:appendToComments,
			removeComment:removeComment,
			postCommentRequest:postCommentRequest,
			likeCommentRequest:likeCommentRequest,
			unlikeCommentRequest:unlikeCommentRequest,
			registerObserverCallback:registerObserverCallback,
			getCommentsRequest:getCommentsRequest,
			getCommentById:getCommentById
	};

});