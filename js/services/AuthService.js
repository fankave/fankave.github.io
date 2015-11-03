var authModule = angular.module("AuthModule", ["NetworkModule", "TopicModule"]);

authModule.controller("AuthController", ["$scope", "$routeParams", "$http", "AuthService", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService",
  function ($scope, $routeParams, $http, AuthService, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService) {
    
    // Resolve host and set up server uri
    if(HOST_NAME === undefined)
      HOST_NAME = window.location.host;
    if(HOST_NAME === 'dev.fanakve.com')
      REGISTER_SERVER_URI = 'http://dev.fankave.com/v1.0/user/register';
    
    // FACEBOOK AUTH SECTION CTRL
    $scope.showFacebookButton = true;

    $scope.loginToFacebook = function() {
      authService.loginToFacebook();
    };

    // load Facebook SDK and initialize
    // TBD: may want to move this initialization to the run cycle instead of in controller
    window.fbAsyncInit = function() {
      
      FB.init({
        appId      : '210324962465861',
        xfbml      : true,
        version    : 'v2.4'
      });

      FB.getLoginStatus(function (response) {

        // User is logged in to Facebook and authenticated our app
        // response.authResponse contains user auth information
        if (response.status === 'connected') {
          $scope.showFacebookButton = false;
          authService.registerFacebookUser(response);
        }
        // User is logged in to Facebook but hasn't authenticated our app
        else if (response.status === 'not_authorized') {
          // FB.login();
          $scope.loginToFacebook();
          $scope.showFacebookButton = false;
        }
        // User not logged in to Facebook
        else {
          $scope.showFacebookButton = true;
        }

      });

    };

    (function(d, s, id) {
      console.log('loading FB SDK...');
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    //FUTURE PEEL AUTH CTRL
    //TODO...
    
}]);


authModule.factory("AuthService", ["$http", "$q", function ($http, $q) {

  // FACEBOOK AUTH SECTION SRVC
  var userLoggedInToFacebook = false; //is this needed at all?

  var loginToFacebook = function() {
    FB.login(function (response) {
      if (response.status === 'connected') {
        registerFacebookUser(response);
      }
      // TODO: error handling
    });
  };

  var registerFacebookUser = function(response) {
    
    var deviceId = ForumDeviceInfo.getDeviceId();
    var facebookData = {};
    facebookData.id = response.authResponse.userID;
    facebookData.accessToken = response.authResponse.accessToken;

    var registrationParameters = {
      "type": "facebook",
      "locale": "en_US",
      "utcOffset": -25200,
      "deviceType": "web",
      "deviceId": deviceId,
      "deviceModel": "browser",
      "appKey": "testKey",
      "appVersion": "0.1",
      "facebook": facebookData
    };

    // Post request to our api to register/retrieve user
    $http.post(REGISTER_SERVER_URI, JSON.stringify(registrationParameters))
      .then(function (response) {
        if (response.status === 200) {
          userLoggedInToFacebook = true;

          // Store user credentials in Local Storage
          UserInfoService.setUserCredentials(
            response.data.userId, 
            response.data.accessToken, 
            response.data.sessionId,
            "facebook");

          // Initialize Network Service and determine what type of resource is being accessed
          networkService.init();
          if (ChannelService.getChannel() !== undefined) {
            // console.log("found channel ID: " + ChannelService.getChannel());
            networkService.send(ChannelService.getLiveGameTopic());
          }
          else if (TopicService.getTopicId() !== undefined) {
            // console.log("found Topic ID: " + TopicService.getTopicId());
            window.location = "#/topic/" + TopicService.getTopicId();
          }
          else if (ReplyService.getPostID() !== undefined) {
            // console.log("found post ID: " + ReplyService.getPostId());
            window.location = "#/post/" + ReplyService.getPostId();
          }
        }
      },
      function (response) {
        //TODO: error handling
      });

  };

  //FUTURE PEEL AUTH SRVC
  //TODO...

  return {
    loginToFacebook: loginToFacebook,
    registerFacebookUser: registerFacebookUser,
    userLoggedInToFacebook: userLoggedInToFacebook
  }

}]);