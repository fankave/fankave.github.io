var rootModule = angular.module("Forum", ["ngRoute", "LoginModule","TopicModule", "PostModule", "NetworkModule", "AuthModule"]);
rootModule.config(["$routeProvider", initRootModule]);

function initRootModule($routeProvider)
{
	$routeProvider.when('/channel/:channelID',
			{
				templateUrl:'partials/login.html',
				controller:'LoginController'
			}).
	when('/topic/:topicID',
	{
		templateUrl:'partials/topic.html',
		controller:'TopicController'
	}).
	when('/post/:postID',
	{
		templateUrl:'partials/post.html',
		controller:'PostController'
	}).
	when('/invalidTopic',
	{
		templateUrl:'partials/invalidTopic.html'
	}).
	when('/facebookLogin',
	{
		templateUrl:'partials/facebookLogin.html',
		controller:'AuthController'
	}).
	otherwise(
	{
		redirectTo:'invalidTopic'
	});
}


