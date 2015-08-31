networkModule.factory('ReplyService', function (DateUtilityService) {
	var LIST_REPLIES_URI = "/v1.0/reply/replies/list/"
	var POST_REPLY_URI="/v1.0/reply/create";
	var UPDATE_REPLY_URI = "/v1.0/reply/content/update/";
	var DELETE_REPLY_URI = "/v1.0/reply/delete/"
	var LIKE_REPLY_URI = "/v1.0/reply/like/";
	var UNLIKE_REPLY_URI = "/v1.0/reply/unlike/";
	var observerCallbacks = [];
	var _replies = [];
	var _replyObject = {
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
	
	function setReplyHelper(tempReplyData,len){
		for(i=0;i<len;i++){
			var _replyObject = {};
			_replyObject.id = tempReplyData[i].id;
			_replyObject.author = tempReplyData[i].author;
			_replyObject.owner = tempReplyData[i].owner;
			_replyObject.photo = tempReplyData[i].author.photo;
			_replyObject.type = tempReplyData[i].content.sections[0].type;
			_replyObject.html = tempReplyData[i].content.sections[0].html;
			_replyObject.media = tempReplyData[i].content.sections[0].media;
			if(_replyObject.type == "media"){
				var tempMedia = _replyObject.media[0];
				//if Video update
				_replyObject.mediaType = tempMedia.mediaType;
				if(_replyObject.mediaType =="video"){
					_replyObject.mediaThumbUrl = tempMedia.thumbUrl;
				}
				_replyObject.mediaUrl = tempMedia.url;
				_replyObject.mediaAspectFull = tempMedia.sizes.full;
				_replyObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
				_replyObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
				_replyObject.mediaAspect2x1 = tempMedia.sizes["2:1"];
				
				
			}
			_replyObject.tweet = tempReplyData[i].content.sections[0].tweet;
			_replyObject.ogp = tempReplyData[i].content.sections[0].ogp;
			_replyObject.link = tempReplyData[i].content.sections[0].link;
			_replyObject.metrics = tempReplyData[i].metrics;
			_replyObject.createdAt = DateUtilityService.getTimeSince(tempReplyData[i].createdAt);
			if(_replyObject.id != undefined && _replyObject.html != undefined)
			_replies.push(_replyObject);
			console.log("ReplService in setReplies reply:"+_replies[i].html );
		}
	}
	
	function setReplies(replyData) {
		tempReplyData = replyData.data.results;
		if(tempReplyData!= undefined && tempReplyData.length>0){
			setReplyHelper(tempReplyData, tempReplyData.length);
		notifyObservers();
		}
	}
	
	function appendToReplies(postReplyData) {
		tempPostedReply = postReplyData.data;
		if(tempReplysData!= undefined){
			setReplyHelper(tempPostedReply, 1);
			notifyObservers();
		}
	}
	
	
	
	
	function updateReply(replyData){
		//if Replys ID exist, update it 
		//else append to existing list
		for(i=0;i<_replies.length;i++){
			if(_replies[i].id == replyData.id){
				//update
				_replies[i].id = replyData.id;
				_replies[i].author = replyData.author;
				_replies[i].owner = replyData.owner;
				_replies[i].photo = replyData.photo;
				_replies[i].type = replyData.content.sections[0].type;
				_replies[i].html = replyData.content.sections[0].html;
				_replies[i].media = replyData.content.sections[0].media;
				if(_replies[i].type == "media"){
					var tempMedia = _replies[i].media[0];
					//if Video update
					_replies[i].mediaType = tempMedia.mediaType;
					if(_replies[i].mediaType =="video"){
						_replies[i].mediaThumbUrl = tempMedia.thumbUrl;
					}
					_replies[i].mediaUrl = tempMedia.url;
					_replies[i].mediaAspectFull = tempMedia.sizes.full;
					_replies[i].mediaAspect16x9 = tempMedia.sizes["16:9"];
					_replies[i].mediaAspect1x1 = tempMedia.sizes["1:1"];
					_replies[i].mediaAspect2x1 = tempMedia.sizes["2:1"];
					
					
				}
				_replies[i].tweet = replyData.content.sections[0].tweet;
				_replies[i].ogp = replyData.content.sections[0].ogp;
				_replies[i].link = replyData.content.sections[0].link;
				_replies[i].metrics = replyData.metrics;
				_replies[i].createdAt = DateUtilityService.getTimeSince(replyData.createdAt);
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
		

	
	
	//call this when you know '_replies' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	function getReplysRequest(replyId){
		var uri = LIST_REPLIES_URI+replyId;
		
		return  varReplyParams = {"rid": "reply",
			      "timestamp": new Date().getTime(),
			      "method": "GET",
			      "uri": encodeURI(uri)};
	}
	
	function postReplyRequest(topicId, replyData){
		var ReplyHtml = "<!DOCTYPE html><html><body>" + replyData + "</body></html>";
				
		var createReplyParams =
			   {"rid": "reply",
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
		return  varLikeParams = {"rid": "reply",
	            "timestamp": new Date().getTime(),
	            "method": "POST",
	            "uri": encodeURI(LIKE_REPLY_URI + _id)};
		

	}
	
	function unlikeReplyRequest(){
		return  varLikeParams = {"rid": "reply",
	            "timestamp": new Date().getTime(),
	            "method": "POST",
	            "uri": encodeURI(UNLIKE_REPLY_URI + _id)};
		

	}
	


	return {
		replys: function(){
		return _replys },
		
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
		getReplysRequest:getReplysRequest
	};

});