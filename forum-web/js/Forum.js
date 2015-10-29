var rootModule = angular.module("Forum", ["ngRoute", "LoginModule","TopicModule", "PostModule", "NetworkModule"]);
rootModule.config(["$routeProvider", initRootModule]);
rootModule.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
    $rootScope
    .$on('$stateChangeSuccess',
        function(event){

            if (!$window.ga)
                return;

            $window.ga('send', 'pageview', { page: $location.path() });
    });
}]);
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
		controller:'FacebookController'
	}).
	otherwise(
	{
		redirectTo:'invalidTopic'
	});
}