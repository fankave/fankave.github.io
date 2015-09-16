networkModule.service('DataService', function (TopicService, CommentService, ReplyService) {
	
	var DATA_TYPE_TOPIC = "topic";
	var DATA_TYPE_COMMENT = "comment";
	var DATA_TYPE_REPLY = "reply";
	var DATA_TYPE_SCORE = "score";

	function delegateSetComments(commentsData) 
	{ 
		if(commentsData.error){
			console.log("Comments Error message from network :"+commentsData.error);
		}
		else if(commentsData.push){
			if(commentsData.method == "UPSERT")
				CommentService.updateComment(commentsData);
			else if(commentsData.method == "REMOVE")
				CommentService.removeComment();	
		}
		else {
			if(commentsData.method == "POST")
				CommentService.appendToComments(commentsData);
			else
				CommentService.setComments(commentsData);

		}
	}

	function delegateSetTopic(topicData)
	{
		if(topicData.error){
			console.log("Topic Error message from network :"+topicData.error);
		}
		else if(topicData.push){
			if(topicData.method == "UPSERT")
				TopicService.updateTopic(topicData.data);
			else if(topicData.method == "REMOVE")
				TopicService.removeTopic();
		}
		else
			TopicService.setTopic(topicData)
	}

	function delegateSetReplies(replyData)
	{
		if(replyData.error){
			console.log("Topic Error message from network :"+replyData.error);
		}
		else if(replyData.push){
			console.log("reply pushed ");
			if(replyData.method == "UPSERT")
				ReplyService.updateReply();
			else if(replyData.method == "REMOVE")
				ReplyService.removeReply();
		}
		else {
			if(replyData.method == "POST")
				ReplyService.appendToReplies(replyData);
			else
				ReplyService.setReplies(replyData);
		}
			
	}

	return {
		setTopic:delegateSetTopic,
		setComments:delegateSetComments,
		setReplies:delegateSetReplies
	};

});