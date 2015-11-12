var authModule = angular.module("AuthModule", ["NetworkModule", "TopicModule"]);

authModule.controller("AuthController", ["$scope", "$routeParams", "$http", "AuthService", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService", "URIHelper",
  function ($scope, $routeParams, $http, AuthService, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

    ga('send', 'pageview', 'Facebook Landing');
    
    // FACEBOOK AUTH SECTION
    $scope.showFacebookButton = true;

    $scope.loginToFacebook = function() {
      AuthService.loginToFacebook();
    };

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
    
}]);