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
	otherwise(
	{
		redirectTo:'invalidTopic'
	});



	window.fbAsyncInit = function()
	{
        FB.init({
          appId      : '1573356879579907',
          xfbml      : true,
          version    : 'v2.4'
        });
        console.log('FB SDK loaded OK');
        $scope.facebookSDKStatus = "FB SDK loaded OK";
        $scope.$apply();

        FB.getLoginStatus(function(response)
        {
		   if (response.status === 'connected')
            {
              // the user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
              $scope.facebookUserStatus = "login & authentication OK";
 
              FB.api('/me', {}, function(response)
              {
                console.log(response.name);
                console.log(response.id);
                var userPictureURL = "http://graph.facebook.com/" + response.id + "/picture?type=square";
                console.log(userPictureURL);

                var userInfoDiv = document.getElementById("facebookUserInfo");
                userInfoDiv.innerHTML = "<div>Welcome back, " + response.name + "</div><div><img src=" + userPictureURL + "></div>";
              });
 
            } 
            else if (response.status === 'not_authorized')
            {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              $scope.facebookUserStatus = "login OK, authentication NO";
              FB.login();
            }
            else
            {
              // the user isn't logged in to Facebook.
              $scope.facebookUserStatus = "Not logged in to Facebook";
            }

		 	$scope.$apply();
		});
      };

      (function(d, s, id)
      {
      	console.log('loading FB SDK...');
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);

       }(document, 'script', 'facebook-jssdk'));
      
}