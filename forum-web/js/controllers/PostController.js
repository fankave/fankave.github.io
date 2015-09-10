var postModule = angular.module("PostModule", ["NetworkModule"]);
postModule.controller("PostController", ["$scope", "$routeParams", "networkService","ReplyService", initPostController]);

function initPostController($scope, $routeParams, networkService, ReplyService)
{
	$scope.pageClass = 'page-post';

	$scope.postID = $routeParams.postID;
	$scope.replies = networkService.getRepliesForPostID();

	$scope.backToTopicButtonTapped = function()
	{
		window.location = "#/topic/"+TopicService.getTopicId();
	}


	$scope.requestReplies = function(){
		console.log("PostController requestReplies Invoked :");
		networkService.send(ReplyService.getReplyRequest($scope.postID));
	}

	$scope.postReply = function(commentText) {
		console.log("PostController postReply Invoked :"+ commentText);
		networkService.send(ReplyService.postReplyRequest(TopicService.getTopicId(),$scope.postID, commentText));
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
		var repliesdata = ReplyService.replies();
		var len = repliesdata.length;

		$scope.repliesArray = [];

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


						$scope.repliesArray.push(tempReply);
			console.log(i +" : updated replies html : " +$scope.repliesArray[i].html);
			if($scope.repliesArray[i].type == "media"){
				console.log(i +" : updated replies media : " +$scope.repliesArray[i].mediaUrl);
				console.log(i +" : updated replies media : " +$scope.repliesArray[i].mediaAspectFeed);

			}
			console.log(i +" : updated replies author name: " +$scope.repliesArray[i].postAuthorName);
			console.log(i +" : updated replies author photo: " +$scope.repliesArray[i].postAuthorPhoto);
		}
	};
	ReplyService.registerObserverCallback(updateReplies);


}