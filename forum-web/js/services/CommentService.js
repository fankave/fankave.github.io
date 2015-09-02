networkModule.factory('CommentService', function (Bant,DateUtilityService) {
	var LIST_COMMENTS_URI = "/v1.0/topic/comments/list/"
		var POST_COMMENT_URI="/v1.0/comment/create";
	var LIKE_COMMENT_URI = "/v1.0/comment/like/";
	var UNLIKE_COMMENT_URI = "/v1.0/comment/unlike/";
	var observerCallbacks = [];
	var _comments = [];


	function setComments(commentsData) {
		tempCommentsData = commentsData.data.results;
		if(tempCommentsData!= undefined && tempCommentsData.length>0)
			var len = tempCommentsData.length;
		for(i=0;i<len;i++){
			var _commentObject = {};
			_commentObject = Bant.bant(tempCommentsData[i]);
			if(_commentObject.id != undefined)
				_comments.push(_commentObject);
			console.log("Comments in set comment Service type:"+_commentObject.type + "  " +_commentObject.html );
		}
		notifyObservers();
	}

	function appendToComments(postCommentData) {
		var tempComment = postCommentData.data;
		if(tempCommentsData!= undefined){
			var _commentObject = {};
			_commentObject = Bant.bant(tempComment);
			if(_commentObject.id != undefined && _commentObject.html != undefined)
				_comments.unshift(_commentObject);
			console.log("appendToComments CommentService"+_commentObject.html );
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




	//call this when you know 'comments' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	function getCommentsRequest(commentId){
		var uri = LIST_COMMENTS_URI+commentId;

		return  varCommentParams = {"rid": "comment",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(uri)};
	}

	function postCommentRequest(topicId, commentData){
		var commentHtml = "<!DOCTYPE html><html><body>" + commentData + "</body></html>";

		var createCommentParams =
		{"rid": "comment",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(POST_COMMENT_URI),
				"data":{
					"lang": "en", 
					"content": {"sections":[{"type":"html","html":commentData}]},
					"topicId": topicId,
				}};
		return createCommentParams;
	}

	function likeCommentRequest(){
		return  varLikeParams = {"rid": "comment",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(LIKE_COMMENT_URI + _id)};


	}

	function unlikeCommentRequest(){
		return  varLikeParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(UNLIKE_COMMENT_URI + _id)};


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
			registerObserverCallback:function(callback){
				//register an observer
				console.log("comments callback registered");
				observerCallbacks.push(callback);
			},
			getCommentsRequest:getCommentsRequest
	};

});