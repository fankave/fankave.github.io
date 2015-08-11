var networkModule = angular.module("NetworkModule", []);
networkModule.factory("networkService", initNetworkService);

function initNetworkService()
{
	function getPostsForTopicID()
	{
		return [
					{
						"postID":"0",
						"postContent":"post 1"
					},
					{
						"postID":"1",
						"postContent":"post 2"
					},
					{
						"postID":"2",
						"postContent":"post 3"
					},
					{
						"postID":"3",
						"postContent":"post 4"
					},
					{
						"postID":"4",
						"postContent":"post 5"
					}
				];
	}

	function getRepliesForPostID()
	{
		return [
					{
						"replyID":"0",
						"replyContent":"reply A"
					},
					{
						"replyID":"1",
						"replyContent":"reply B"
					},
					{
						"replyID":"2",
						"replyContent":"reply C"
					},
					{
						"replyID":"3",
						"replyContent":"reply D"
					},
					{
						"replyID":"4",
						"replyContent":"reply E"
					}
				]
	}

	return{
		getPostsForTopicID:getPostsForTopicID,
		getRepliesForPostID:getRepliesForPostID
	}
}