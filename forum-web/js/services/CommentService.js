networkModule.factory('CommentService', function (DateUtilityService) {
	var LIST_COMMENTS_URI = "/v1.0/topic/comments/list/"
	var POST_COMMENT_URI="/v1.0/comment/create";
	var LIKE_COMMENT_URI = "/v1.0/comment/like/";
	var UNLIKE_COMMENT_URI = "/v1.0/comment/unlike/";
	var observerCallbacks = [];
	var _comments = [];
	var _commentObject = {
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
	
	function setComments(commentsData) {
		var commentsdata = commentsData.data.results;
		_comments = commentsData.data.results;
//		var len = commentsdata.length;
//		for(i=0;i<len;i++){
//			_commentObject.id = commentsdata[i].id;
//			_commentObject.author = commentsdata[i].author;
//			_commentObject.owner = commentsdata[i].owner;
//			_commentObject.photo = commentsdata[i].photo;
//			_commentObject.type = commentsdata[i].content.sections[0].type;
//			_commentObject.html = commentsdata[i].content.sections[0].html;
//			_commentObject.media = commentsdata[i].content.sections[0].media;
//			_commentObject.tweet = commentsdata[i].content.sections[0].tweet;
//			_commentObject.ogp = commentsdata[i].content.sections[0].ogp;
//			_commentObject.link = commentsdata[i].content.sections[0].link;
//			_commentObject.metrics = commentsdata[i].metrics;
//			_commentObject.createdAt = DateUtilityService.getTimeSince(commentsdata[i].createdAt);
//			console.log("Comments in comment Service"+_commentObject.html );
//			_comments.push(_commentObject);
//			console.log("Comments in comment Service"+_comments[i].html );
//		}
//		
	
		notifyObservers();
	}
	
	function updateComment(commentData){
		//if comments ID exist, update it 
		//else append to existing list
		for(i=0;i<_comments.length;i++){
			if(_comments[i].id == commentData.id){
				//update
				_comments[i].id = commentsdata.id;
				_comments[i].author = commentsdata.author;
				_comments[i].owner = commentsdata.owner;
				_comments[i].photo = commentsdata.photo;
				_comments[i].type = commentsdata.content.sections[0].type;
				_comments[i].html = commentsdata.content.sections[0].html;
				_comments[i].media = commentsdata.content.sections[0].media;
				_comments[i].tweet = commentsdata.content.sections[0].tweet;
				_comments[i].ogp = commentsdata.content.sections[0].ogp;
				_comments[i].link = commentsdata.content.sections[0].link;
				_comments[i].metrics = commentsdata.metrics;
				_comments[i].createdAt = DateUtilityService.getTimeSince(commentsdata.createdAt);
				
			}
			else{
				_comments.push(commentData)
			}
		}
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
		comments: function(){console.log("getting comments :" +_comments[0].content.sections[0].html);
		return _comments },
		
		setComments:setComments,
		updateComment:updateComment,
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