networkModule.service('CommentService', function () {
	var LIST_COMMENTS_URI = "/v1.0/topic/comments/list/"
	var POST_COMMENT_URI="/v1.0/comment/create";
	
	var _comments;
	
//	var _author;
//	var _owner;
//	var lang;
//	var photo
//	
//	var _sectionType;
//	
//	var _html;
//	var _media;
//	var _tweet;
//	var _ogp;
//	var _link;
//
//	var liked;
//	var createdAt;
	
	var observerCallbacks = [];
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
	
	function setComments(commentsData) {
		_comments = commentsData.data.results;
	
		notifyObservers();
	}

	return {
		comments: function(){return _comments ;},
		setComments:setComments,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("comments callback registered");
			observerCallbacks.push(callback);
		},
		getCommentsRequest:getCommentsRequest
	};

});