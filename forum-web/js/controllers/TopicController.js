var topicModule = angular.module("TopicModule", ["NetworkModule"]);
topicModule.controller("TopicController", ["$scope", "$routeParams", "networkService", "DataService","TopicService","CommentService", initTopicController]);

function initTopicController($scope, $routeParams, networkService,DataService, TopicService, CommentService)
{
	$scope.init = function() {
		console.log("initialized network");
		networkService.init();
	};
	$scope.topicID = $routeParams.topicID;
	$scope.posts = networkService.getPostsForTopicID();

	$scope.service = DataService;

	var updateTopic = function(){
		$scope.topic = TopicService.getTopic();
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

		console.log("updated topic" +$scope.title);
		console.log("updated type" +sectionType);
	};
	var updateComments = function(){
		$scope.comments = CommentService.comments().data.results;
		console.log("updated comments" +$scope.comments);
	};

	TopicService.registerObserverCallback(updateTopic);
	CommentService.registerObserverCallback(updateComments);


}