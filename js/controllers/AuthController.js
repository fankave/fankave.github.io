var authModule = angular.module("AuthModule", ["NetworkModule", "TopicModule"]);

authModule.controller("AuthController", ["$scope", "$routeParams", "$http", "AuthService", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService", "URIHelper",
  function ($scope, $routeParams, $http, AuthService, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

    ChannelService.setChannel($routeParams.channelID);
    $scope.urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
    console.log(" $scope.urlQueryStr :" + $scope.urlQueryStr);

    var updateTopic = function(){
      var id = ChannelService.getLiveTopicId();
      if (id !== undefined){
        console.log("Got Topic id from Channel : " + "#/topic/" + id + $scope.urlQueryStr);
        if ($scope.urlQueryStr.charAt(0) === '?') {
          window.location = "#/topic/" + id + $scope.urlQueryStr;
        } else {
          window.location = "#/topic/" + id;
        }
      }
    };

    ChannelService.registerObserverCallback(updateTopic);
    
    if (UserInfoService.isUserLoggedIn()) {
      if (NETWORK_DEBUG) {
        console.log("User is logged in, checking for connection");
      }
      // AuthService.initializeContent();
      networkService.init();
      networkService.send(ChannelService.getLiveGameTopic());
    } else {
      if (URIHelper.isPeelUser()) {
        $scope.isPeelUser = true;
        AuthService.loginWithPeel();
      } else {
        window.location = "#/facebookLogin";
      }
    }

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

    (function(d, s, id) {
      console.log('loading FB SDK...');
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    
}]);