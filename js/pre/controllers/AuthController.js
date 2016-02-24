angular.module("AuthModule", ["NetworkModule", "TopicModule"])
.controller("AuthController", ["$scope", "$routeParams", "$http", "AuthService", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService", "URIHelper",
  function ($scope, $routeParams, $http, AuthService, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

    if (URIHelper.embedded()){
      $('#fankave-page').height(700);
      $scope.$apply();
    }
    if (window.location.href.indexOf('?') !== -1){
      var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?')+1);
      if (GEN_DEBUG)
      console.log("urlQueryStr: ", urlQueryStr);
      // if (urlQueryStr === 'MI16=true'){
      if (URIHelper.isTechMUser()){
        $scope.mUserType = 'MI16';
      }
      // if (urlQueryStr === 'MWC=true'){
      if (URIHelper.isMWCUser()){
        $scope.mUserType = 'MWC';
      }
    } else {
      $scope.facebookUser = true;
    }

    if ($scope.facebookUser){
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      ga('send', 'pageview', 'Facebook Landing');
    }
    else {
      ga('send', 'pageview', 'Tech MI16 Landing');
    }
    // FACEBOOK AUTH SECTION
    $scope.showFacebookButton = true;

    function showSpinner() {
      $scope.showFacebookButton = false;
    }

    $scope.loginToFacebook = function() {
      AuthService.loginToFacebook(showSpinner);
    };

    $scope.techMLogin = function(name, email, isValid) {
      if (isValid){
        AuthService.techMLogin(name, email, $scope.mUserType);
      }
      $scope.submitted = true;
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
          $scope.showFacebookButton = false;
          $scope.loginToFacebook();
        }
        // User not logged in to Facebook
        else {
          $scope.showFacebookButton = true;
        }

      });

    };

    $scope.focusMWC = function() {
      $('#techLoginContainer').animate({'top':'-150px'},100);
    };

    $scope.blurMWC = function() {
      $('#techLoginContainer').animate({'top':''},100);
    };
    
}]);
