var postModule = angular.module("PostModule", ["NetworkModule"]);
postModule.controller("PostController", ["$scope", "$routeParams", "networkService","ReplyService", "TopicService",initPostController]);

function initPostController($scope, $routeParams, networkService, ReplyService, TopicService)
{
	$scope.pageClass = 'page-post';

	$scope.postID = $routeParams.postID;
	$scope.topicId = TopicService.getTopicId();
	//$scope.replies = networkService.getRepliesForPostID();
	

	$scope.backToTopicButtonTapped = function()
	{
		window.location = "#/topic/"+TopicService.getTopicId();
	}


	$scope.requestReplies = function(){
		console.log("PostController requestReplies Invoked :");
		networkService.send(ReplyService.getRepliesRequest($scope.postID));
	}
	$scope.requestReplies();
	
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

	var updateReplies = function(){

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

			if(repliesData[i].mediaAspect16x9 != undefined)
				tempReply.mediaAspectFeed = repliesData[i].mediaAspect16x9
				else if(repliesData[i].mediaAspect1x1 != undefined)
					tempReply.mediaAspectFeed = repliesData[i].mediaAspect1x1
					else if(repliesData[i].mediaAspect2x1 != undefined)
						tempReply.mediaAspectFeed = repliesData[i].mediaAspect2x1


						$scope.replies.push(tempReply);
			console.log(i +" : updated replies html : " +$scope.replies[i].html);
			if($scope.replies[i].type == "media"){
				console.log(i +" : updated replies media : " +$scope.replies[i].mediaUrl);
				console.log(i +" : updated replies media : " +$scope.replies[i].mediaAspectFeed);
			}
			console.log(i +" : updated replies author name: " +$scope.replies[i].postAuthorName);
			console.log(i +" : updated replies author photo: " +$scope.replies[i].postAuthorPhoto);
		}
	};
	ReplyService.registerObserverCallback(updateReplies);


}