var postModule = angular.module("PostModule", ["NetworkModule"]);
postModule.controller("PostController", ["$scope", "$routeParams", "networkService", initPostController]);

function initPostController($scope, $routeParams, networkService)
{
	$scope.postID = $routeParams.postID;
	$scope.replies = networkService.getRepliesForPostID();

	$scope.backToTopicButtonTapped = function()
	{
		window.location = "#/topic/0";
	}
}