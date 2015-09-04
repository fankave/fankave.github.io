networkModule.factory('ReplyService', function (DateUtilityService, Bant) {
	var LIST_REPLIES_URI = "/v1.0/reply/replies/list/"
	var POST_REPLY_URI="/v1.0/reply/create";
	var UPDATE_REPLY_URI = "/v1.0/reply/content/update/";
	var DELETE_REPLY_URI = "/v1.0/reply/delete/"
	var LIKE_REPLY_URI = "/v1.0/reply/like/";
	var UNLIKE_REPLY_URI = "/v1.0/reply/unlike/";
	var observerCallbacks = [];
	var _replies = [];

	function setReplies(replyData) {
		tempReplyData = replyData.data.results;
		if(tempReplyData!= undefined && tempReplyData.length>0){
			var len = tempReplyData.length;
			for(i=0;i<len;i++){
				var _replyObject = {};
				_replyObject = Bant.bant(tempReplyData[i])
				if(_replyObject.id != undefined )
					_replies.push(_replyObject);
				notifyObservers();
			}
		}
	}

	function appendToReplies(postReplyData) {
		var tempPostedReply = postReplyData.data;
		if(tempReplysData!= undefined){
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
	
	function getReplyRequest(replyId){
		var uri = LIST_REPLIES_URI+replyId;

		return  varReplyParams = {"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(uri)};
	}

	function postReplyRequest(topicId, replyData){
		var ReplyHtml = "<!DOCTYPE html><html><body>" + replyData + "</body></html>";

		var createReplyParams ={
				"rid": "reply",
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
		return  varLikeParams = {
				"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(LIKE_REPLY_URI + _id)};


	}

	function unlikeReplyRequest(){
		return  varLikeParams = {
				"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(UNLIKE_REPLY_URI + _id)};


	}
	
	//call this when you know '_replies' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	
	return {
		replys: function(){return _replys },

		setReplies:setReplies,
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
		getReplyRequest:getReplyRequest
	};

});