var topicModule = angular.module("TopicModule", ["NetworkModule"]);
topicModule.controller("TopicController", ["$scope", "$routeParams", "networkService", initTopicController]);

function initTopicController($scope, $routeParams, networkService)
{
	$scope.topicID = $routeParams.topicID;
	$scope.posts = networkService.getPostsForTopicID();
}