var rootModule = angular.module("Forum", ["ngRoute", "ngAnimate", "TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", initRootModule]);

function initRootModule($routeProvider)
{
	$routeProvider.when('/topic/:topicID',
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
		controller:'FacebookController'
	}).
	otherwise(
	{
		redirectTo:'invalidTopic'
	});
}