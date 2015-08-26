var postModule = angular.module("PostModule", ["NetworkModule"]);
postModule.controller("PostController", ["$scope", "$routeParams", "networkService","TopicService", initPostController]);

function initPostController($scope, $routeParams, networkService, TopicService)
{
	$scope.pageClass = 'page-post';
	
	$scope.postID = $routeParams.postID;
	$scope.replies = networkService.getRepliesForPostID();

	$scope.backToTopicButtonTapped = function()
	{
		window.location = "#/topic/"+TopicService.getTopicId();
	}
}