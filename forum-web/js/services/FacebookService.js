var facebookModule = angular.module("FacebookModule", ["NetworkModule", "TopicModule"]);
facebookModule.controller("FacebookController", ["$scope", "$http", "facebookService", "UserInfoService", "TopicService", initFacebookController]);

function initFacebookController($scope, $http, facebookService, UserInfoService, TopicService)
{
	console.log("initFacebookController");

	$scope.loginToFacebook = function()
	{
		console.log("log in to Facebook");
		// facebookService.userLoggedInToFacebook = true;
		// window.location = "#/topic/0";


		window.fbAsyncInit = function()
		{
	        FB.init({
	          appId      : '1573356879579907',
	          xfbml      : true,
	          version    : 'v2.4'
	        });
	        console.log('FB SDK loaded OK');
	        // $scope.facebookSDKStatus = "FB SDK loaded OK";
	        // $scope.$apply();

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
	              // $scope.facebookUserStatus = "login & authentication OK";
	              console.log("FB: login & authentication OK");
	 

	              FB.api('/me', {}, function(response)
	              {
	                // console.log(response.name);
	                console.log("FB ID: " + response.id);
	                $scope.fbID = response.id;
	                console.log("FB access token: " + accessToken);
	                $scope.fbAccessToken = accessToken;
	                $scope.registerFacebookUser()

	                // var userPictureURL = "http://graph.facebook.com/" + response.id + "/picture?type=square";
	                // console.log(userPictureURL);

	                // var userInfoDiv = document.getElementById("facebookUserInfo");
	                // userInfoDiv.innerHTML = "<div>Welcome back, " + response.name + "</div><div><img src=" + userPictureURL + "></div>";
	              });
	 
	            } 
	            else if (response.status === 'not_authorized')
	            {
	              // the user is logged in to Facebook, 
	              // but has not authenticated your app
	              // $scope.facebookUserStatus = "login OK, authentication NO";
	              console.log("login OK, authentication NO");
	              FB.login();
	            }
	            else
	            {
	              // the user isn't logged in to Facebook.
	              // $scope.facebookUserStatus = "Not logged in to Facebook";
	              console.log("Not logged in to Facebook");
	              FB.login();
	            }

			 	// $scope.$apply();
			});
	      };

	      (function(d, s, id)
	      {
	      	// console.log('loading FB SDK...');
	         var js, fjs = d.getElementsByTagName(s)[0];
	         if (d.getElementById(id)) {return;}
	         js = d.createElement(s); js.id = id;
	         js.src = "//connect.facebook.net/en_US/sdk.js";
	         fjs.parentNode.insertBefore(js, fjs);

	       }(document, 'script', 'facebook-jssdk'));
	}


	$scope.registerFacebookUser = function()
	{
		// console.log("register facebook user");
		// console.log("fbID: " + $scope.fbID);
		// console.log("fbAccessToken: " + $scope.fbAccessToken);

		var facebookData = new Object();
		facebookData.id = $scope.fbID;
		facebookData.accessToken = $scope.fbAccessToken;
		
	      var registrationParameters =
	      {
	        "type":"facebook",
	        "locale":"en_US",
	        "utcOffset":-25200,
	        "deviceType":"web",
	        "deviceId":"0",
	        "deviceModel":"browser",
	        "appKey":"testKey",
	        "appVersion":"0.1",
	        "facebook":facebookData
	      };

	      // console.log('registration parameters: ' + JSON.stringify(registrationParameters));

	      
	      $http.post('http://104.197.8.198/v1.0/user/register', registrationParameters).then(
	      function(response)
	      {
	          // console.log('success');
	          // console.log('response:  ' + response);
	          // console.log('response.status: ' + response.status);
	          // console.log('response.data: ' + JSON.stringify(response.data));
	          // console.log('response.headers: ' + response.headers);
	          // console.log('response.config: ' + response.config);
	          // console.log('response.statusText: ' + response.statusText);

	          if(response.status == 200)
	          {
	            console.log("registered user successfully");
	            var registrationInfoElement = document.getElementById("registrationInfo")
	            var registrationInfoHTML = "<div>userID: " + response.data.userId + "</div>";
	            registrationInfoHTML += "<div>sessionID: " + response.data.sessionId + "</div>";
	            registrationInfoHTML += "<div>accessToken: " + response.data.accessToken + "</div>";
	            // registrationInfoElement.innerHTML = registrationInfoHTML;

	            // console.log("user ID: " + response.data.userId);
	            // console.log("session ID: " + response.data.sessionId);
	            // console.log("access token: " + response.data.accessToken);

	            // console.log(" - - - > access UserInfoService: " + UserInfoService);

	            facebookService.userLoggedInToFacebook = true;
	            console.log("Setting user info in Facebook Service");
	            UserInfoService.setUserCredentials(response.data.userId, response.data.accessToken, response.data.sessionId);

	            // console.log(":: " + TopicService.getTopicId());
				window.location = "#/topic/" + TopicService.getTopicId();
	          }
	      },
	      function(response)
	      {
	          console.log('error');
	          console.log('response:  ' + response);
	          console.log('response.status: ' + response.status);
	          console.log('response.data: ' + JSON.stringify(response.data));
	          console.log('response.headers: ' + response.headers);
	          console.log('response.config: ' + response.config);
	          console.log('response.statusText: ' + response.statusText);
	      });

	}
}






facebookModule.factory("facebookService", [initFacebookService]);

function initFacebookService()
{
	// console.log("initFacebookService");

	var userLoggedInToFacebook = false

	return{
		userLoggedInToFacebook: userLoggedInToFacebook
	}
}