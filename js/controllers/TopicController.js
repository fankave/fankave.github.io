var topicModule = angular.module("TopicModule", ["NetworkModule", "FacebookModule"]);
topicModule.controller("TopicController", ["$scope", "$timeout", "$routeParams","networkService", "TopicService","CommentService", "facebookService", "UserInfoService",initTopicController]);

function initTopicController($scope, $timeout, $routeParams,networkService,TopicService, CommentService, facebookService, UserInfoService)
{
	TopicService.setTopicId($routeParams.topicID);

	$scope.init = function() {
		networkService.send(TopicService.getTopicRequest($routeParams.topicID));
		networkService.send(CommentService.getCommentsRequest($routeParams.topicID));

//		var varPushParams = {"rid": "comment",
//		"timestamp": (new Date).getTime(),
//		"method": "POST",
//		"uri": "\/mock\/topic\/53c167f17040001d?duration=\(100)"};
	};

	$scope.innerButtonTapped = false
	if(facebookService.userLoggedInToFacebook === false)
	{
		console.log("Not logged in to facebook, take user to login page")
		window.location = "#/facebookLogin";
	}
	else
	{
		// console.log("TopicController | userLoggedInToFacebook: " + facebookService.userLoggedInToFacebook);
		$scope.pageClass = 'page-topic';

		$scope.topicID = $routeParams.topicID;
		//TODO: remove this - usd with static Data
		//$scope.posts = StaticData.getPostsForTopicID();
		//networkService.init();
		$scope.init();

		document.getElementById('topicSection').style.paddingTop = "8em";
		document.getElementById('topicSection').style.paddingBottom = "3.9em";

		 $scope.$watch("commentsArray", function (newValue, oldValue)
		 {
  			$timeout(function()
  			{
    			var postDivs = document.getElementsByClassName("postRow");
				 for(div in postDivs)
				 {
				 	if(newValue != undefined)
				 	{
					 	var thisPost = newValue[div];

					 	if(thisPost != undefined)
					 	{
						 	var thisDiv = postDivs[div];
						 	thisDiv.onclick = function()
						 	{
						 		// console.log("thisDiv.onclick");
						 		thisPost = $scope.commentsArray[this.id];
						 		if($scope.innerButtonTapped == false)
						 		{
						 			window.location = "#/post/" + thisPost.id;
						 		}
						 		$scope.innerButtonTapped = false;
						 	}
						 }	
					}
				 }
  			});
		});
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
                type: 'inline'
            });
	}

	$scope.moreButtonTapped = function()
	{
		$scope.innerButtonTapped = true;
	}

	$scope.postComment = function(commentText) {
		if((commentText != undefined)	 && commentText != ""){
		// console.log("TopicController postComment Invoked :"+ commentText);
		networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
		}
		$scope.commentText = "";
		document.getElementById("topicCommentField").blur();
	};

	$scope.updateLikeTopic = function() {
		console.log("TopicController update like Topic");
		if(TopicService.getLiked() == true)
			networkService.send(TopicService.getUnlikeTopicRequest());
		else
			networkService.send(TopicService.getLikeTopicRequest());	
	};

	$scope.commentOnTopic = function()
	{
		// console.log("comment on topic");
		document.getElementById("topicCommentField").focus();
	};

	$scope.updateLikeComment = function(id) {
		event.cancelBubble = true;
		if(event.stopPropagation) event.stopPropagation();

		console.log("TopicController updateLike (" + id + ")");
		if(CommentService.isCommentLiked(id)){
			networkService.send(CommentService.getUnlikeCommentRequest(id));
		}
		else{
			networkService.send(CommentService.getLikeCommentRequest(id));	
		}
	};


	$scope.deleteComment = function(id)
	{
		console.log("deleteComment(" + id + ")");
		$scope.innerButtonTapped = true;
		networkService.send(CommentService.deleteCommentRequest(id));	
	}

	$scope.reportCommentAsSpam = function(id)
	{
		console.log("reportCommentAsSpam(" + id + ")");
		$scope.innerButtonTapped = true;
		networkService.send(CommentService.flagCommentRequest(id));	
	}

	$scope.goToRepliesWithKeyboardTriggered = function(id)
	{
		event.cancelBubble = true;
	   if(event.stopPropagation) event.stopPropagation();

		// console.log("TopicController.goToRepliesWithKeyboardTriggered(" + id + ")");
		TopicService.directComment = true;
		window.location = "#/post/" + id;
	};

	var updateTopic = function(){
		if(TopicService.isWatchingTopic() == false){
			networkService.send(TopicService.getFollowChannelRequest());
			networkService.send(TopicService.watchTopicRequest($routeParams.topicID));
		}
		//Score API update
		$scope.leftTeam = TopicService.getTeamA();
		$scope.rightTeam = TopicService.getTeamB();
		var score = TopicService.getScore();
		if(score != undefined){
			$scope.leftTeamScore = score.points[0];
			$scope.rightTeamScore = score.points[1];
		}
		$scope.gameStatus = TopicService.getGameStatus();
		// console.log($scope.gameStatus)
		$scope.topicTitle = TopicService.getTitle();
		if($scope.gameStatus == "live") {
			$scope.gamePeriod = TopicService.getGamePeriod();
			$scope.gameClock = TopicService.getGameClock();
		}

//		var sectionType = TopicService.getSectionType();
//		if(sectionType == "html")
		$scope.topicDescHtml = TopicService.getHtml();
//		else if(sectionType == "media")
//		$scope.media = TopicService.getMedia();
//		else if(sectionType == "tweet")
//		$scope.tweet = TopicService.getTweet();
//		else if(sectionType == "ogp")
//		$scope.ogp = TopicService.getOgp();
//		else if(sectionType == "link")
//		$scope.link = TopicService.getLink();

		$scope.createdAt = TopicService.getTimeCreatedAt();
		$scope.liked = TopicService.getLiked();
		var metrics = TopicService.getMetrics();
		$scope.likesCount = metrics.likes;
		$scope.commentsCount = metrics.comments;
		// console.log("updated topic" +$scope.topicTitle);
		// console.log("updated time" +$scope.createdAt);
		// console.log("updated metrics" +$scope.likesCount);
		
		$scope.allScoresTitle = TopicService.getScoresTitle();
		$scope.allScoresURL = TopicService.getScoresLink();

		renderScoreCard($scope.leftTeam.pColor, $scope.rightTeam.pColor);
	};
	var updateComments = function(){

		//TODO: check with ahmed, these values could be individual scope var.
		var commentsdata = CommentService.comments();
		var len = commentsdata.length;

		$scope.commentsArray = [];

		for(i=0;i<len;i++){
			var tempComment = {};
			tempComment = commentsdata[i];
			tempComment.postAuthorName = commentsdata[i].author.name;
			tempComment.postAuthorPhoto = commentsdata[i].author.photo;
			tempComment.isMyComment = UserInfoService.isCurrentUser(commentsdata[i].author.id);
			
			tempComment.likeCount = commentsdata[i].metrics.likes;
			tempComment.replyCount = commentsdata[i].metrics.replies;

			tempComment.postTimestamp = commentsdata[i].createdAt;
			tempComment.mediaAspectFeed = commentsdata[i].mediaAspectFeed;
			tempComment.mediaAspectFull = commentsdata[i].mediaAspectFull;
			tempComment.isLiked = commentsdata[i].signal.like;
			$scope.commentsArray.push(tempComment);
						
			// console.log(i +" : updated comments html : " +$scope.commentsArray[i].html);
			
			if($scope.commentsArray[i].type == "media"){
//				console.log("Media Aspect feed x: "+tempComment.mediaAspectFeed.x + 
//						"y: "+ tempComment.mediaAspectFeed.y + 
//						"w: "+ tempComment.mediaAspectFeed.w +
//						"h: "+ tempComment.mediaAspectFeed.h );
//				
//				console.log("Media Aspect full x: "+tempComment.mediaAspectFull.x + 
//						"y: "+ tempComment.mediaAspectFull.y + 
//						"w: "+ tempComment.mediaAspectFull.w +
//						"h: "+ tempComment.mediaAspectFull.h );
				// console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaUrl);
				// console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaAspectFeed);

			}
			// console.log(i +" : updated comments author name: " +$scope.commentsArray[i].postAuthorName);
			// console.log(i +" : updated comments author photo: " +$scope.commentsArray[i].postAuthorPhoto);
			//console.log(i +" : updated comments likes: " +$scope.commentsArray[i].likeCount);
		}

	};

	TopicService.registerObserverCallback(updateTopic);
	CommentService.registerObserverCallback(updateComments);

}