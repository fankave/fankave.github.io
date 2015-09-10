var topicModule = angular.module("TopicModule", ["NetworkModule", "FacebookModule"]);
topicModule.controller("TopicController", ["$scope", "$routeParams", "networkService", "TopicService","CommentService", "facebookService", initTopicController]);

function initTopicController($scope, $routeParams, networkService,TopicService, CommentService, facebookService)
{
	if(facebookService.userLoggedInToFacebook === false)
	{
		console.log("Not logged in to facebook, take user to login page")
		window.location = "#/facebookLogin";
	}
	// console.log("TopicController | userLoggedInToFacebook: " + facebookService.userLoggedInToFacebook);
	$scope.pageClass = 'page-topic';

	$scope.topicID = $routeParams.topicID;
	//TODO: remove this - usd with static Data
	//$scope.posts = StaticData.getPostsForTopicID();

	$scope.init = function() {
		networkService.send(TopicService.getTopicRequest($routeParams.topicID));
		//networkService.send(TopicService.getFollowChannelRequest(TopicService.getChannelId()));
		networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
		//TODO: add watch for Push, test once API starts working from server, currently broken - aug 25th, tuesday
		networkService.send(TopicService.watchTopicRequest($routeParams.topicID));

//		var varPushParams = {"rid": "comment",
//		"timestamp": (new Date).getTime(),
//		"method": "POST",
//		"uri": "\/mock\/topic\/53c167f17040001d?duration=\(100)"};
	};

	$scope.postComment = function(commentText) {
		console.log("postComment Invoked"+ commentText);
		networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
		$scope.commentText = "";
	};

	$scope.likeTopic = function() {
		networkService.send(TopicService.getLikeTopicRequest());
	};

	$scope.unlikeTopic = function() {
		networkService.send(TopicService.getUnlikeTopicRequest());
	};

	$scope.likeComment = function(id) {
		networkService.send(CommentService.getLikeCommentRequest(id));
	};

	$scope.unlikeComment = function(id) {
		networkService.send(CommentService.getUnlikeCommentRequest());
	};


	var updateTopic = function(){
		//TODO: re think design to setAll values in one JSON and update here after all integration complete
		//Score API update
		$scope.leftTeam = TopicService.getTeamA();
		$scope.rightTeam = TopicService.getTeamB();
		var score = TopicService.getScore();
		$scope.leftTeamScore = score.points[0];
		$scope.rightTeamScore = score.points[1];
		$scope.gameStatus = TopicService.getGameStatus();
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
		var metrics = TopicService.getMetrics();
		$scope.likesCount = metrics.likes;
		$scope.commentsCount = metrics.comments;
		console.log("updated topic" +$scope.topicTitle);
		console.log("updated time" +$scope.createdAt);
		console.log("updated metrics" +$scope.likesCount);
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

			tempComment.postTimestamp = commentsdata[i].createdAt;

			if(commentsdata[i].mediaAspect16x9 != undefined)
				tempComment.mediaAspectFeed = commentsdata[i].mediaAspect16x9
				else if(commentsdata[i].mediaAspect1x1 != undefined)
					tempComment.mediaAspectFeed = commentsdata[i].mediaAspect1x1
					else if(commentsdata[i].mediaAspect2x1 != undefined)
						tempComment.mediaAspectFeed = commentsdata[i].mediaAspect2x1


						$scope.commentsArray.push(tempComment);
			console.log(i +" : updated comments html : " +$scope.commentsArray[i].html);
			if($scope.commentsArray[i].type == "media"){
				console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaUrl);
				console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaAspect16x9);

			}
			console.log(i +" : updated comments author name: " +$scope.commentsArray[i].postAuthorName);
			console.log(i +" : updated comments author photo: " +$scope.commentsArray[i].postAuthorPhoto);

//			}
		}
	};

	TopicService.registerObserverCallback(updateTopic);
	CommentService.registerObserverCallback(updateComments);

	renderScoreCard();
}