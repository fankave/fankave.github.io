networkModule.service('DataService', function (TopicService, CommentService) {
   
    function delegateSetComments(commentsData) 
    { 
    	if(commentsData.error){
    		console.log("Comments Error message from network :"+commentsData.error);
    	}
    	else if(commentsData.push){
    		if(commentsData.method == "UPSERT")
    			CommentService.updateComment();
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
    			TopicService.updateTopic();
    		else if(topicData.method == "REMOVE")
    			TopicService.removeTopic();
    	}
    	else
    	TopicService.setTopic(topicData)
    }
    
    return {
        setComments:delegateSetComments,
        setTopic:delegateSetTopic
    };
   
});