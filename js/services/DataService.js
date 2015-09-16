networkModule.service('DataService', function (TopicService, CommentService) {
    var data = [];
    var _comments = [];
    
    return {
        comments: _comments,
        data:data,
    setComments:function(commentsData) { CommentService.setComments(commentsData);},
    setTopic:function(topicData) { TopicService.setTopic(topicData);
	}
    };
   
});