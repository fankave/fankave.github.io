var topicModule = angular.module("TopicModule", ["NetworkModule"]);
topicModule.controller("TopicController", ["$scope", "$routeParams", "networkService", "TopicService","CommentService", "DateUtilityService",initTopicController]);

function initTopicController($scope, $routeParams, networkService,TopicService, CommentService,DateUtilityService)
{
	$scope.pageClass = 'page-topic';
	
	$scope.topicID = $routeParams.topicID;
	$scope.posts = networkService.getPostsForTopicID();
	
	$scope.init = function() {
//		console.log("initialized network");
//		networkService.init();
		//TODO: Pass $routeParams.topicID to this to fetch TopicID from URL
		networkService.send(TopicService.getTopicRequest($routeParams.topicID));
		networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
		//TODO: add watch for Push, test once API starts working from server, currently broken - aug 25th, tuesday
	};
	
	$scope.postComment = function(commentData) {
		networkService.send(CommentService.postCommentRequest($scope.topicID, commentData));
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
		//$scope.topic = TopicService.getTopic();
		$scope.title = TopicService.getTitle();
		
		var sectionType = TopicService.getSectionType();
		if(sectionType == "html")
			$scope.html = TopicService.getHtml();
		else if(sectionType == "media")
			$scope.media = TopicService.getMedia();
		else if(sectionType == "tweet")
			$scope.tweet = TopicService.getTweet();
		else if(sectionType == "ogp")
			$scope.ogp = TopicService.getOgp();
		else if(sectionType == "link")
			$scope.link = TopicService.getLink();
		
		$scope.createdAt = TopicService.getTimeCreatedAt();
		$scope.metrics = TopicService.getMetrics();

		console.log("updated topic" +$scope.title);
		console.log("updated type" +sectionType);
		console.log("updated time" +$scope.createdAt);
		console.log("updated metrics" +$scope.metrics.likes);
	};
	var updateComments = function(){

		//TODO: check with ahmed, these values could be individual scope var.
		var commentsdata = CommentService.comments();
		var len = commentsdata.length;
		$scope.commentsArray = [];
		
		var tempComment = {};
		for(i=0;i<len;i++){
			tempComment.id = commentsdata[i].id;
			tempComment.author = commentsdata[i].author;
			tempComment.owner = commentsdata[i].owner;
			tempComment.photo = commentsdata[i].photo;
			tempComment.type = commentsdata[i].content.sections[0].type;
			tempComment.html = commentsdata[i].content.sections[0].html;
			tempComment.media = commentsdata[i].content.sections[0].media;
			tempComment.tweet = commentsdata[i].content.sections[0].tweet;
			tempComment.ogp = commentsdata[i].content.sections[0].ogp;
			tempComment.link = commentsdata[i].content.sections[0].link;
			tempComment.metrics = commentsdata[i].metrics;
			tempComment.createdAt = DateUtilityService.getTimeSince(commentsdata[i].createdAt);
			$scope.commentsArray.push(tempComment);
			console.log("updated comments : " +$scope.commentsArray[i].html);
			
//		}
		}
	};

	TopicService.registerObserverCallback(updateTopic);
	CommentService.registerObserverCallback(updateComments);

	renderScoreCard();
}