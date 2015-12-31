var authModule = angular.module("AuthModule", ["NetworkModule", "TopicModule"]);

authModule.controller("AuthController", ["$scope", "$routeParams", "$http", "AuthService", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService", "URIHelper",
  function ($scope, $routeParams, $http, AuthService, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

    (function(d, s, id) {
      console.log('loading FB SDK...');
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    ga('send', 'pageview', 'Facebook Landing');
    // FACEBOOK AUTH SECTION
    $scope.showFacebookButton = true;

    $scope.loginToFacebook = function() {
      AuthService.loginToFacebook();
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
          var registerParams = AuthService.setRegistrationParams("facebook", -25200, response.authResponse);
          AuthService.registerUser(registerParams);
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


    
}]);