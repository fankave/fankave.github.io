var postModule = angular.module("PostModule", ["NetworkModule", "FacebookModule"]);
postModule.controller("PostController", ["$scope", "$routeParams", "networkService","ReplyService", "TopicService","CommentService", "facebookService", initPostController]);

function initPostController($scope, $routeParams, networkService, ReplyService, TopicService, CommentService, facebookService)
{
	$scope.pageClass = 'page-post';

	$scope.postID = $routeParams.postID;
	$scope.topicId = TopicService.getTopicId();
	//$scope.replies = networkService.getRepliesForPostID();
	
	ReplyService.setPostId($routeParams.postID);

	$scope.backToTopicButtonTapped = function()
	{
		var topicId = TopicService.getTopicId();
		if(topicId == undefined)
			topicId = ReplyService.getTopicIdFromReply();
		window.location = "#/topic/"+topicId;
	}


	$scope.requestReplies = function(){
		// console.log("PostController requestReplies Invoked");
		networkService.send(ReplyService.getRepliesRequest($scope.postID));
		var selectedComment = CommentService.getCommentById($scope.postID);
		if(selectedComment != undefined){
			updateCommentInReply(selectedComment);

		}
		else{
			console.log("No data from comment service : TODO handle this with cookies");

		}

	}

//	if(facebookService.userLoggedInToFacebook === false)
//	{
//		window.location = "#/facebookLogin";
//	}
//	else
	{
		$scope.pageClass = 'page-post';

		$scope.requestReplies();
	}

	$scope.postReply = function(commentText) {
		console.log("PostController postReply Invoked :"+ commentText + $scope.topicId);
		networkService.send(ReplyService.postReplyRequest($scope.topicId,$scope.postID, commentText));
		$scope.commentText = "";
	};

	$scope.likeReply = function() {
		console.log("PostController Like Reply");
		networkService.send(ReplyService.likeReplyRequest());
	};

	$scope.unlikeReply = function() {
		console.log("PostController Unlike Reply");
		networkService.send(ReplyService.unlikeReplyRequest());
	};

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
		if(selectedComment == undefined)
			selectedComment = CommentService.getCommentById($scope.postID);
		if(selectedComment != undefined){
			var tempComment = {};
			tempComment = selectedComment;
			tempComment.postAuthorName = selectedComment.author.name;
			tempComment.postAuthorPhoto = selectedComment.author.photo;

			tempComment.postTimestamp = selectedComment.createdAt;
			tempComment.likeCount = selectedComment.metrics.likes;
			tempComment.replyCount = selectedComment.metrics.replies;

			if(selectedComment.mediaAspect16x9 != undefined)
				tempComment.mediaAspectFeed = selectedComment.mediaAspect16x9;
			else if(selectedComment.mediaAspect1x1 != undefined)
				tempComment.mediaAspectFeed = selectedComment.mediaAspect1x1;
			else if(selectedComment.mediaAspect2x1 != undefined)
				tempComment.mediaAspectFeed = selectedComment.mediaAspect2x1;



			$scope.comment = tempComment;

			// console.log("comments html : " +$scope.comment.html);
			// console.log("updated comments author name: " +$scope.comment.postAuthorName);
			// console.log("updated comments author photo: " +$scope.comment.postAuthorPhoto);
			if($scope.comment.type == "media"){
				// console.log("updated comments media : " +$scope.comment.mediaUrl);
				// console.log("updated comments media : " +$scope.comment.mediaAspectFeed);

			}
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

			tempReply.postTimestamp = repliesData[i].createdAt;
			tempReply.likeCount = repliesData[i].metrics.likes;
			tempReply.replyCount = repliesData[i].metrics.replies;

			if(repliesData[i].mediaAspect16x9 != undefined)
				tempReply.mediaAspectFeed = repliesData[i].mediaAspect16x9;
			else if(repliesData[i].mediaAspect1x1 != undefined)
				tempReply.mediaAspectFeed = repliesData[i].mediaAspect1x1;
			else if(repliesData[i].mediaAspect2x1 != undefined)
				tempReply.mediaAspectFeed = repliesData[i].mediaAspect2x1;

			$scope.replies.push(tempReply);

			// console.log(i +" : updated replies html : " +$scope.replies[i].html);
			// console.log(i +" : updated replies author name: " +$scope.replies[i].postAuthorName);
			// console.log(i +" : updated replies author photo: " +$scope.replies[i].postAuthorPhoto);

			if($scope.replies[i].type == "media"){
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaUrl);
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaAspectFeed);
			}

		}
	}
	ReplyService.registerObserverCallback(updateReplies);
	TopicService.registerObserverCallback(updateScore);
	CommentService.registerObserverCallback(updateCommentInReply);


}