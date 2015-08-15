networkModule.service('DataService', function (TopicService) {
    var data = [];
    var _comments = [];
    
    return {
        comments: _comments,
        data:data,
    setComments:function(commentsData) { _comments.push(commentsData);},
    setTopic:function(topicData) { TopicService.setTopic(topicData);
	}
    };
   
});