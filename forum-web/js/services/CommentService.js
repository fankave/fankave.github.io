networkModule.service('CommentService', function () {
	var _comments;
	var observerCallbacks = [];
	//call this when you know 'comments' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

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
		}
	};

});