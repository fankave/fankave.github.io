angular.module('ChatModule', ['NetworkModule','AuthModule','SocialModule'])
.controller('ChatController', ['$state','$stateParams','$sce','$window','$timeout','CommentService','ChannelService','TopicService','networkService','URIHelper','UserInfoService','UserAgentService',
  function ($state,$stateParams,$sce,$window,$timeout,CommentService,ChannelService,TopicService,networkService,URIHelper,UserInfoService,UserAgentService) {

    // Chat Initialization
    var _this = this;
    var lastComment = false;
    _this.newCommentsAvailable = false;

    if (!this.commentsArray){
      this.loading = true;
    }

    function init() {
      if (NETWORK_DEBUG) console.log("Init Chat for Topic: ", $stateParams.topicID)
      networkService.send(CommentService.getCommentsRequest($stateParams.topicID));
    }

    // Comment Loading
    function updateComments(){
      var commentsdata = CommentService.comments();
      if (commentsdata != undefined && (commentsdata.length > 0 || lastComment === true)){
        lastComment = false;
        var len = commentsdata.length;

        _this.commentsArray = [];

        for(i=0;i<len;i++){
          var tempComment = {};
          tempComment = commentsdata[i];
          tempComment.postAuthorName = commentsdata[i].author.name;
          tempComment.postAuthorPhoto = commentsdata[i].author.photo;
          tempComment.isMyComment = UserInfoService.isCurrentUser(commentsdata[i].author.id);

          tempComment.likeCount = commentsdata[i].metrics.likes;
          tempComment.replyCount = commentsdata[i].metrics.replies;

          tempComment.postTimestamp = commentsdata[i].createdAt;
          if (tempComment.type === 'media'){
            tempComment.mediaUrl = commentsdata[i].mediaUrl;
            tempComment.mediaAspectFeed = commentsdata[i].mediaAspectFeed;
            tempComment.mediaAspectFull = commentsdata[i].mediaAspectFull;
            tempComment.mediaAspectRatio = commentsdata[i].mediaAspectRatio;
            tempComment.mediaOrientation = commentsdata[i].mediaOrientation;
            tempComment.mediaThumbUrl = commentsdata[i].mediaThumbUrl;
          }
          tempComment.isLiked = commentsdata[i].signal.like;

          if (tempComment.type === 'embed'){
            tempComment.shared = true;
            tempComment.embed = commentsdata[i].embed;
            tempComment.embed.embedCreatedAt = commentsdata[i].embedCreatedAt;
            tempComment.embed.embedCreatedAtFull = commentsdata[i].embedCreatedAtFull;
            tempComment.embedType = commentsdata[i].embedType;
            
            if (tempComment.embedType === 'media' || tempComment.embedType === 'link'){
              tempComment.mediaUrl = commentsdata[i].embedMedia.mediaUrl;
              tempComment.mediaThumbUrl = commentsdata[i].embedMedia.mediaThumbUrl;
              tempComment.mediaAspectFeed = commentsdata[i].embedMedia.mediaAspectFeed;
              tempComment.mediaAspectFull = commentsdata[i].embedMedia.mediaAspectFull;
              tempComment.mediaAspectRatio = commentsdata[i].embedMedia.mediaAspectRatio;
              tempComment.mediaOrientation = commentsdata[i].embedMedia.mediaOrientation;
            }

            if (tempComment.providerName === "Twitter"){
              tempComment.embed.embedLogo = "img/twitterLogo@2x.png";
            } else {
              tempComment.embed.embedLogo = commentsdata[i].embed.provider.logo;
            }

            if (commentsdata[i].embed.type === 'link' && commentsdata[i].embed.playable === true){
              tempComment.embedHtml = commentsdata[i].embedHtml;
            }
          }
          _this.commentsArray.push(tempComment);
        }
        if (NETWORK_DEBUG) console.log("Comments Array: ", _this.commentsArray);
      }
    }

    this.loadRemainingComments = function() {
      console.log("LOADING REST OF COMMENTS...");
      if (!CommentService.loadedComments()){
        networkService.send(CommentService.getCommentsRequest($stateParams.topicID));
        CommentService.setLoadedComments(true);
        _this.loadedAllComments = true;
      }
    };

    this.doneLoading = function() {
      _this.loading = false;
    };

    this.showNewComments = function() {
      _this.newCommentsAvailable = false;
      updateComments();
      $(document).scrollTop(0);
    };

    function notifyNewComments() {
      if(!_this.commentsArray){
        updateComments();
      } else {
        var commentsData = CommentService.comments();
        var len = commentsData.length;
        var pinIndex = CommentService.getNumPinComments();
        if (_this.commentsArray.length < len){
          if (!UserInfoService.isCurrentUser(commentsData[pinIndex].author.id)){
            _this.newCommentsAvailable = true;
          } else {
            updateComments();
          }
        } else {
          updateComments();
        }
      }
    }

    CommentService.registerObserverCallback(notifyNewComments);
    CommentService.registerObserverCallback(updateComments, true);

    this.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    // Chat Navigation
    this.viewPost = function(e, id) {
      if ($(e.target).is('a')){
        return;
      }
      var postParams = $stateParams;
      postParams.postID = id;
      $state.go('post', postParams);
    };

    this.replyDirectToPost = function(id) {
      TopicService.directComment = true;
      var postParams = $stateParams;
      postParams.postID = id;
      $state.go('post', postParams);
    };

    // Comment Operations
    this.updateLikeComment = function(id) {
      if (NETWORK_DEBUG) console.log("Like Comment: ", id);
      if (CommentService.isCommentLiked(id)){
        networkService.send(CommentService.getUnlikeCommentRequest(id));
      } else {
        networkService.send(CommentService.getLikeCommentRequest(id));  
      }
    };

    this.deleteComment = function(id) {
      if (NETWORK_DEBUG) console.log("Delete Comment: ", id);
      if (_this.commentsArray.length === 1){
        if (NETWORK_DEBUG) console.log("Deleting Final Comment");
        lastComment = true;
      }
      networkService.send(CommentService.deleteCommentRequest(id));
    };

    this.reportCommentAsSpam = function(id) {
      if (NETWORK_DEBUG) console.log("Report Comment As Spam: ", id);
      networkService.send(CommentService.flagCommentRequest(id)); 
    };

}]);
