var topicModule = angular.module("TopicModule", ["NetworkModule"]);
topicModule.controller("TopicController", ["$scope", "$routeParams", "networkService", "DataService","TopicService", initTopicController]);

function initTopicController($scope, $routeParams, networkService,DataService, TopicService)
{
	$scope.init = function() {
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

	TopicService.registerObserverCallback(updateTopic);
	
	    
}