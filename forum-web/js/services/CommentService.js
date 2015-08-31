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
		tempCommentsData = commentsData.data.results;
		if(tempCommentsData!= undefined && tempCommentsData.length>0)
			var len = tempCommentsData.length;
			for(i=0;i<len;i++){
				var _commentObject = {};
				_commentObject.id = tempCommentsData[i].id;
				_commentObject.author = tempCommentsData[i].author;
				_commentObject.owner = tempCommentsData[i].owner;
				_commentObject.photo = tempCommentsData[i].author.photo;
				_commentObject.type = tempCommentsData[i].content.sections[0].type;
				_commentObject.html = tempCommentsData[i].content.sections[0].html;
				_commentObject.media = tempCommentsData[i].content.sections[0].media;
				if(_commentObject.type == "media"){
					var tempMedia = _commentObject.media[0];
					//if Video update
					_commentObject.mediaType = tempMedia.mediaType;
					if(_commentObject.mediaType =="video"){
						_commentObject.mediaThumbUrl = tempMedia.thumbUrl;
					}
					_commentObject.mediaUrl = tempMedia.url;
					_commentObject.mediaAspectFull = tempMedia.sizes.full;
					_commentObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
					_commentObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
					_commentObject.mediaAspect2x1 = tempMedia.sizes["2:1"];
					
					
				}
				_commentObject.tweet = tempCommentsData[i].content.sections[0].tweet;
				_commentObject.ogp = tempCommentsData[i].content.sections[0].ogp;
				_commentObject.link = tempCommentsData[i].content.sections[0].link;
				_commentObject.metrics = tempCommentsData[i].metrics;
				_commentObject.createdAt = DateUtilityService.getTimeSince(tempCommentsData[i].createdAt);
				if(_commentObject.id != undefined)
				_comments.push(_commentObject);
				console.log("Comments in set comment Service type:"+_commentObject.type + "  " +_commentObject.html );
			}
		notifyObservers();
	}
	
	function appendToComments(postCommentData) {
		tempPostedComment = postCommentData.data;
		if(tempCommentsData!= undefined){
				var _commentObject = {};
				_commentObject.id = tempPostedComment.id;
				_commentObject.author = tempPostedComment.author;
				_commentObject.owner = tempPostedComment.owner;
				_commentObject.photo = tempPostedComment.author.photo;
				_commentObject.type = tempPostedComment.content.sections[0].type;
				_commentObject.html = tempPostedComment.content.sections[0].html;
				_commentObject.media = tempPostedComment.content.sections[0].media;
				if(_commentObject.type == "media"){
					var tempMedia = _commentObject.media[0];
					//if Video update
					_commentObject.mediaType = tempMedia.mediaType;
					if(_commentObject.mediaType =="video"){
						_commentObject.mediaThumbUrl = tempMedia.thumbUrl;
					}
					_commentObject.mediaUrl = tempMedia.url;
					_commentObject.mediaAspectFull = tempMedia.sizes.full;
					_commentObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
					_commentObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
					_commentObject.mediaAspect2x1 = tempMedia.sizes["2:1"];
					
					
				}
				_commentObject.tweet = tempPostedComment.content.sections[0].tweet;
				_commentObject.ogp = tempPostedComment.content.sections[0].ogp;
				_commentObject.link = tempPostedComment.content.sections[0].link;
				_commentObject.metrics = tempPostedComment.metrics;
				_commentObject.createdAt = DateUtilityService.getTimeSince(tempPostedComment.createdAt);
				if(_commentObject.id != undefined && _commentObject.html != undefined)
				_comments.unshift(_commentObject);
				console.log("appendToComments CommentService"+_commentObject.html );
			}
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
				if(_comments[i].type == "media"){
					var tempMedia = _comments[i].media[0];
					//if Video update
					_comments[i].mediaType = tempMedia.mediaType;
					if(_comments[i].mediaType =="video"){
						_comments[i].mediaThumbUrl = tempMedia.thumbUrl;
					}
					_comments[i].mediaUrl = tempMedia.url;
					_comments[i].mediaAspectFull = tempMedia.sizes.full;
					_comments[i].mediaAspect16x9 = tempMedia.sizes["16:9"];
					_comments[i].mediaAspect1x1 = tempMedia.sizes["1:1"];
					_comments[i].mediaAspect2x1 = tempMedia.sizes["2:1"];
					
					
				}
				_comments[i].tweet = commentsdata.content.sections[0].tweet;
				_comments[i].ogp = commentsdata.content.sections[0].ogp;
				_comments[i].link = commentsdata.content.sections[0].link;
				_comments[i].metrics = commentsdata.metrics;
				_comments[i].createdAt = DateUtilityService.getTimeSince(commentsdata.createdAt);
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