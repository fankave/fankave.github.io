var postModule = angular.module("PostModule", ["NetworkModule", "FacebookModule"]);
postModule.controller("PostController", ["$scope", "$sce", "$timeout", "$routeParams", "networkService","ReplyService", "TopicService","CommentService", "facebookService","UserInfoService","URIHelper", initPostController]);

function initPostController($scope, $sce, $timeout, $routeParams, networkService, ReplyService, TopicService, CommentService, facebookService, UserInfoService,URIHelper)
{
	ga('send', 'pageview', location.pathname);
	$scope.pageClass = 'page-post';
//	$(function() {
//	    var oldScroll = window.onscroll;
//	    $(document).on('focus', 'input', function(e) {
//	        window.onscroll = function () { 
//	            e.preventDefault(); 
//	        } ;
//	        setTimeout(function() {
//	            window.onscroll = oldScroll;
//	        }, 100);
//	    });
//	    
//	});
	$scope.postID = $routeParams.postID;
	$scope.topicId = TopicService.getTopicId();
	//$scope.replies = networkService.getRepliesForPostID();
	$scope.justReplied = false;
	
	ReplyService.setPostId($routeParams.postID);

	$scope.backToTopicButtonTapped = function()
	{
		var topicId = TopicService.getTopicId();
		if(topicId == undefined)
			topicId = $scope.comment.topicId;
		//window.location = "#/topic/"+topicId;
		window.history.back();
	}

	$scope.setPeelUI = function(isPeelUser){
		console.log("isPeelUser :"+isPeelUser);
//		if(isPeelUser === true)
//		{
//			document.getElementById('postSection').style.paddingTop = "2.0em";
//			document.getElementById('postHeader').style.height = "3.5em";
//		}
//		else
		{
			document.getElementById('postSection').style.paddingTop = "3.5em";
			document.getElementById('postHeader').style.height = "3.5em";
		}
	}

	if((UserInfoService.isPeelUser() == true))
		$scope.isPeelUser = true;
	else
		$scope.isPeelUser = false;	
	$scope.setPeelUI($scope.isPeelUser);

	$scope.requestReplies = function(){
		// console.log("PostController requestReplies Invoked");
		networkService.send(ReplyService.getRepliesRequest($scope.postID));
		var selectedComment = CommentService.getCommentById($scope.postID);
		if(selectedComment != undefined){
			updateCommentInReply(selectedComment);

		}
		else{
			console.log("No data from comment service : TODO handle this with cookies");
			networkService.send(CommentService.getCommentByIdRequest($scope.postID));
		}
	}

	$scope.peelClose = function()
	{
		console.log("peelClose()");
	}

	$scope.peelWatchOnTV = function()
	{
		ga('send', 'event', 'Button', 'click', 'PeelWatchOnTV');
		console.log("peelWatchOnTV()");
		var showId = URIHelper.getPeelShowId();
		if(showId != undefined)
			window.location = "peel://tunein/"+showId;
		else
			window.location = "peel://home";
	}

	$scope.showNewRepliesIndicator = false;
	$scope.newRepliesIndicatorTapped = function()
	{
		console.log("newRepliesIndicatorTapped");
		$scope.showNewRepliesIndicator = false;
		updateReplies();
		window.scrollTo(0,document.body.scrollHeight);
	}

	$scope.triggerRepliesKeyboard = function()
	{
		document.getElementById("postCommentField").focus();
	}
	
	$scope.initReplyPage = function(){
		$scope.pageClass = 'page-post';
		$scope.paddingTop = "20";
		// $scope.pageStyle = {'padding-top': '10em'};

		$scope.requestReplies();

		var replyPostHeader = $("#replyPost").height();
		// console.log("height of repy header: " + replyPostHeader);
		var heightString = replyPostHeader + "px";
		// document.getElementById('postHeader').style.height = '3.5em';//heightString;
		// document.getElementById('postSection').style.paddingTop = '3.5em';
		document.getElementById('postSection').style.paddingBottom = "3.9em";

		$scope.$watch("replies", function (newValue, oldValue)
		 {
  			$timeout(function()
  			{
    			$('.commentsContainer').each(function()
    			{
      				$('.image-link').magnificPopup({
        				type:'image'
     				});
    			});
  			});
		});
	}

	if(UserInfoService.isUserLoggedIn()){
		if(!networkService.isSocketConnected())
			networkService.init();
		$scope.initReplyPage();
	}
	else
	{
		window.location = "#/facebookLogin";
	}

	$scope.postReply = function(commentText) {
		if((commentText != undefined)	 && commentText != ""){
		console.log("PostController postReply Invoked :"+ commentText + $scope.topicId);
		networkService.send(ReplyService.getPostReplyRequest($scope.topicId,$scope.postID, commentText));
		}
		$scope.commentText = "";
		document.getElementById("textInputFieldReply").blur();
		document.getElementById("postReplyButton").blur();
		$scope.justReplied = true
	};

	$scope.updateLikeComment = function(id) {
		// console.log("PostController updateLikeComment(" + id + ")");
		if(CommentService.isCommentLiked(id)){
			networkService.send(CommentService.getUnlikeCommentRequest(id));
		}
		else{
			networkService.send(CommentService.getLikeCommentRequest(id));	
		}
	};

	$scope.updateLikeReply = function(id) {
		// console.log("PostController Like Reply");
		if(ReplyService.isReplyLiked(id)){
			networkService.send(ReplyService.unlikeReplyRequest(id));
		}
		else{
			networkService.send(ReplyService.likeReplyRequest(id));
		}
	};

	$scope.deleteReply = function(id)
	{
		console.log("deleteReply(" + id + ")");
		networkService.send(ReplyService.deleteReplyRequest(id));
	}

	$scope.reportReplyAsSpam = function(id)
	{
		console.log("reportReplyAsSpam(" + id + ")");
		networkService.send(ReplyService.flagReplyRequest(id));
	}

	$scope.imageClick = function(imageURL)
	{
		event.cancelBubble = true;
	   if(event.stopPropagation) event.stopPropagation();

		$.magnificPopup.open({
                    items: {
                    	type:'image',
                    	src: imageURL,
                },
                type: 'inline',
                callbacks:
                {
				    open: function()
				    {
				      console.log("popup opened");
				      $('body').bind('touchmove', function(e){e.preventDefault()})
				    },
				    close: function()
				    {
				      console.log("popup closed");
				      $('body').unbind('touchmove')
				    }
				    // e.t.c.
				}
            });
	}

	function updateScore(){
		//Score update here
		$scope.leftTeam = TopicService.getTeamA();
		$scope.rightTeam = TopicService.getTeamB();
		var score = TopicService.getScore();
		if(score != undefined){
			$scope.leftTeamScore = score.points[0];
			$scope.rightTeamScore = score.points[1];
		}
		$scope.gameStatus = TopicService.getGameStatus();
		$scope.topicTitle = TopicService.getTitle();
		if($scope.gameStatus == "live") {
			$scope.gamePeriod = TopicService.getGamePeriod();
			$scope.gameClock = TopicService.getGameClock();
		}
		console.log("Scores updated in replies");
	}

	 function updateCommentInReply(selectedComment){
		if(selectedComment == undefined){
			selectedComment = CommentService.getCommentById($scope.postID);
		}
		if(selectedComment != undefined){
			if(NETWORK_DEBUG) console.log("Updated comment in reply triggered" ); 
			var tempComment = {};
			tempComment = selectedComment;
			tempComment.postAuthorName = selectedComment.author.name;
			tempComment.postAuthorPhoto = selectedComment.author.photo;

			tempComment.postTimestamp = selectedComment.createdAt;
			tempComment.likeCount = selectedComment.metrics.likes;
			tempComment.replyCount = selectedComment.metrics.replies;
			tempComment.mediaAspectFeed = selectedComment.mediaAspectFeed;
			tempComment.isLiked = selectedComment.signal.like;
			tempComment.topicId = selectedComment.topicId;

			$scope.comment = tempComment;

//			 console.log("comments html : " +$scope.comment.html);
//			 console.log("updated comments author name: " +$scope.comment.postAuthorName);
//			 console.log("updated comments author photo: " +$scope.comment.postAuthorPhoto);
//			if($scope.comment.type == "media"){
//				 console.log("updated comments media : " +$scope.comment.mediaUrl);
//				 console.log("updated comments media : " +$scope.comment.mediaAspectFeed);
//
//			}
		}
	}

	 function updateReplies(){

		//TODO: check with ahmed, these values could be individual scope var.
		var repliesData = ReplyService.replies();
		var len = repliesData.length;

		$scope.replies = [];

		for(i=0;i<len;i++){
			var tempReply = {};
			tempReply = repliesData[i];
			tempReply.postAuthorName = repliesData[i].author.name;
			tempReply.postAuthorPhoto = repliesData[i].author.photo;
			tempReply.isMyReply = UserInfoService.isCurrentUser(repliesData[i].author.id);

			tempReply.postTimestamp = repliesData[i].createdAt;
			tempReply.likeCount = repliesData[i].metrics.likes;
			tempReply.replyCount = repliesData[i].metrics.replies;
			tempReply.mediaAspectFeed = repliesData[i].mediaAspectFeed;
			tempReply.isLiked = repliesData[i].signal.like;
			$scope.replies.push(tempReply);

			// console.log(i +" : updated replies html : " +$scope.replies[i].html);
			// console.log(i +" : updated replies author name: " +$scope.replies[i].postAuthorName);
			// console.log(i +" : updated replies author photo: " +$scope.replies[i].postAuthorPhoto);

			if($scope.replies[i].type == "media"){
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaUrl);
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaAspectFeed);
			}
			//console.log(i +" : updated replies likecount : " +$scope.replies[i].likeCount);

		}

		if(TopicService.directComment === true)
		{
			$scope.triggerRepliesKeyboard();
			TopicService.directComment = false;
		}

		if($scope.justReplied == true)
		{
			setTimeout(function()
				{ 
					console.log("Scroll to last reply");
					window.scrollTo(0,document.body.scrollHeight);
					$scope.justReplied = false;
				}, 1000);
		}
	}
	 
	 var notifyNewReplies = function(){

		 if($scope.replies == undefined)
		 {
			 updateReplies();
		 }
		 else {
			 var repliesData = ReplyService.replies();
			 var len = repliesData.length;
			 if($scope.replies.length < len ){
				 //console.log("newReplies triggered");
				 if(!UserInfoService.isCurrentUser(repliesData[len-1].author.id)){
					 $scope.showNewRepliesIndicator = true;
				 }
				 else{
					 updateReplies();
				 }
			 }
			 else{
				 updateReplies();
			 }

		 }
	 }
	 
	ReplyService.registerObserverCallback(notifyNewReplies);
	TopicService.registerObserverCallback(updateScore);
	CommentService.registerObserverCallback(updateCommentInReply);

	$scope.trustSrc = function(src)
	{
    	return $sce.trustAsResourceUrl(src);
  	}

}