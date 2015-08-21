networkModule.service('DataService', function (TopicService, CommentService) {
    var data = [];
    var _comments = [];
    
    function delegateSetComments(commentsData) 
    { 
    	if(commentsData.push){
    		if(commentsData.method == "UPSERT")
    			CommentService.updateComment();
    		else if(commentsData.method == "REMOVE")
    			CommentService.removeComment();	
    	}
    	else
    	CommentService.setComments(commentsData);
    }
    
    function delegateSetTopic(topicData)
    {
    	if(topicData.push){
    		if(topicData.method == "UPSERT")
    			TopicService.updateTopic();
    		else if(topicData.method == "REMOVE")
    			TopicService.removeTopic();
    	}
    	else
    	TopicService.setTopic(topicData)
    }
    
    return {
        comments: _comments,
        data:data,
    setComments:delegateSetComments,
    setTopic:delegateSetTopic
    };
   
});