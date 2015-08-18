networkModule.service('CommentService', function () {
	var COMMENTS_LIST_URI = "/v1.0/topic/comments/list/"
	var _comments;
	var observerCallbacks = [];
	//call this when you know 'comments' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	function getCommentsRequest(commentId){
		var uri = COMMENTS_LIST_URI+commentId;
		
		return  varCommentParams = {"rid": "comment",
			      "timestamp": new Date().getTime(),
			      "method": "GET",
			      "uri": encodeURI(uri)};
	}

	return {
		comments: function(){return _comments ;},
		setComments:function(commentsData) {
			_comments = commentsData;
			notifyObservers();
		},
		registerObserverCallback:function(callback){
			//register an observer
			console.log("comments callback registered");
			observerCallbacks.push(callback);
		},
		getCommentsRequest:getCommentsRequest
	};

});