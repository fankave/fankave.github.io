mediaModule.factory('MUService',  function () {
	var POST_COMMENT_URI="/v1.0/comment/create";
	var POST_REPLY_URI="/v1.0/reply/create";
	var isComment = true;
	var commentText = "test Comment media";
	var topicId = "5440804181400368";
	var commentId ="";
	var replyId = "";

	function commentPostRequest(){
		var createCommentParams = {"rid": "comment",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(POST_COMMENT_URI)};
		createCommentParams.data =
		{
				"lang": "en", 
				"topicId": topicId,
		};
		if(!isComment){
			createCommentParams = {"rid": "reply",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(POST_REPLY_URI)};
			createCommentParams.data =
			{
					"lang": "en", 
					"topicId": topicId,
			};
			createReplyParams.data.target = {
					"type": targetType, // Target type: “comment” or “reply”.
					"id":targetId,  // Target bant ID of comment or reply.
			};

			createReplyParams.data.commentId = commentId;
		}
		return createCommentParams;
	}

	function setCommentParams(tId,text,isCom,comId,repId){
		topicId = tId;
		commentText = text;
		isComment = isCom;
		
		commentId = comId;
		replyId = repId;
	}

	function postMediaRequest(mediaData){
		var m = {"media":[mediaData]};
		var sections = [];
		if((commentText != undefined)  && commentText != ""){
			sections.push({"type": "html","html":commentText});
		}
		sections.push({"type": "media", "media" : m.media});

		var createCommentParams = commentPostRequest();
		
		var content =  {"sections": sections};
		createCommentParams.data.content = content;
		console.log("Media comment Request :"+ JSON.stringify(createCommentParams, null, 10));
		return createCommentParams;
	}
	return {
		postMediaRequest:postMediaRequest,
		setCommentParams:setCommentParams
	}
});
