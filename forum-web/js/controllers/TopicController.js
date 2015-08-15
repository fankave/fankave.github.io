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
		$scope.topic = TopicService.topic();
		$scope.title = $scope.topic.data.content.title;
		$scope.sections = $scope.topic.data.content.sections;

		console.log("updated topic" +$scope.title);
		console.log("updated sections" +$scope.sections);
	};
	var updateComments = function(){
		$scope.comments = CommentService.comments();
		console.log("updated comments" +$scope.comments);
	};

	TopicService.registerObserverCallback(updateTopic);
	CommentService.registerObserverCallback(updateComments);


}