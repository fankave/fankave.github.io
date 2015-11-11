var rootModule = angular.module("Forum", ["ngRoute", "AuthModule", "LoginModule","TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", "$locationProvider", initRootModule]);

function initRootModule($routeProvider, $locationProvider) {
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

	// $locationProvider.html5Mode(true);
}


