networkModule.service('DataService', function (TopicService, CommentService, ReplyService,ChannelService,SocialService) {
  
  var DATA_TYPE_TOPIC = "topic";
  var DATA_TYPE_COMMENT = "comment";
  var DATA_TYPE_REPLY = "reply";
  var DATA_TYPE_SCORE = "score";
  var DATA_BANT_ID_LENGTH = 16;

  function delegateSetComments(commentsData) 
  { 
    if(commentsData.error){
      console.log("Comments Error message from network :"+commentsData.error);
    }
    else if(commentsData.push){
      if(commentsData.method == "UPSERT")
        if(CommentService.updateComment(commentsData) == 0)
          TopicService.updateCommentCount(1);
      else if(commentsData.method == "REMOVE"){
        //TODO: Design requirement for how to show a deleted comment
//        if(CommentService.removeComment(commentsData) == 0)
//          TopicService.updateCommentCount(-1);  
      }
    }
    else {
      if(commentsData.method == "POST"){
        var uri = commentsData.uri;
        if(uri != undefined){
          var commentId = uri.slice(-DATA_BANT_ID_LENGTH);
//          console.log("Comment ID: "+ commentId);
//          console.log("uri: "+ uri);
          if(uri == "/v1.0/comment/create"){
            CommentService.appendToComments(commentsData);
            TopicService.updateCommentCount(1);
          }
          else{
            if(CommentService.updateCommentLocalData(uri, commentId) == 0)
              TopicService.updateCommentCount(-1);
          }
        }
      }
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
        TopicService.removeTopic(topicData.data);
    }
    else
      TopicService.setTopic(topicData);
  }

  function delegateSetReplies(replyData)
  {
    if(replyData.error){
      console.log("Topic Error message from network :"+replyData.error);
    }
    else if(replyData.push){
      console.log("reply pushed ");
      if(replyData.method == "UPSERT")
        if(ReplyService.updateReply(replyData) === 0){
          if(replyData.data != undefined)
          CommentService.updateReplyCountById(replyData.data.commentId,1);
        }
      else if(replyData.method == "REMOVE"){
        //TODO: no action required
        //ReplyService.removeReply(replyData);
      }
    }
    else {
      if(replyData.method == "POST"){
        var uri = replyData.uri;
        if(uri != undefined){
          var id = uri.slice(-DATA_BANT_ID_LENGTH);
//          console.log("Comment ID: "+ id);
//          console.log("uri: "+ uri);
          if(uri == "/v1.0/reply/create"){
            ReplyService.appendToReplies(replyData);
            if(replyData.data != undefined)
              CommentService.updateReplyCountById(replyData.data.commentId, 1);
          }
          else{
            var commentId =  ReplyService.getCommentIdByReply(id);
            if(ReplyService.updateReplyLocalData(uri, id) == 0)
              CommentService.updateReplyCountById(commentId, -1);
          }
        }
      }
      else
        ReplyService.setReplies(replyData);
    }
      
  }
  
  function delegateSetChannel(data)
  {
    if(data.error){
      console.log("Topic Error message from network :"+data.error);
    }
    else
      ChannelService.setTopicData(data);
  }
  
  function delegateSetSocial(data)
  {
    if(data.error){
      console.log("Social Error message from network :"+data.error);
    }
    else
      SocialService.setSocialData(data);
  }

  return {
    setSocial:delegateSetSocial,
    setChannel:delegateSetChannel,
    setTopic:delegateSetTopic,
    setComments:delegateSetComments,
    setReplies:delegateSetReplies,
    setWatchTopic:function(watched){
      TopicService.setWatchTopic(watched);
    }
  };

});