angular.module('AuthModule')
.factory("AuthService", ["$http","$window","$location","UserInfoService", "TopicService", "ReplyService", "networkService", "ForumDeviceInfo", "ChannelService", "URIHelper", 
  function ($http, $window, $location, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

  var userLoggedInToFacebook = false;

  var loginAsGuest = function(callback) {
  if (NETWORK_DEBUG)
  console.log("Logging in as Guest");
    var userData = {};
    userData.id = ForumDeviceInfo.getDeviceId();
    userData.userName = "GuestUser";

    var registerParams = setRegistrationParams("guest", -28800, userData);
    registerUser(registerParams, null, callback);
  };

  var loginToFacebook = function(callback) {
    FB.login(function (response) {
      if (response.status === 'connected') {
        callback();
        var registerParams = setRegistrationParams("facebook", -25200, response.authResponse);
        registerUser(registerParams);
      }
    });
  };

  var loginWithPeel = function(callback) {
    var userData = {};
    userData.id = URIHelper.getPeelUserId();
    userData.userName = URIHelper.getPeelUserName();

    var registerParams = setRegistrationParams("peel", -28800, userData);
    registerUser(registerParams, null, callback);
  };

  var loginWithEmail = function(callback) {
    var userData = {
      "id": URIHelper.getSSUserId(),
      "userName": URIHelper.getSSUserName()
    };

    var registerParams = setRegistrationParams("email", -28800, userData);
    registerUser(registerParams, null, callback);
  };

  var techMLogin = function (name, email, mUserType) {
    var userData = {
      "id": email,
      "userName": name
    };
    if (NETWORK_DEBUG)
    console.log("techMLogin: ", userData);
    var registerParams = setRegistrationParams("email", -28800, userData);
    registerUser(registerParams, mUserType);
  };

  var setRegistrationParams = function (type, utcOffset, userData) {
    var deviceId = ForumDeviceInfo.getDeviceId();
    var registerParams = {
      "type": type,
      "locale": "en_US",
      "utcOffset": utcOffset,
      "deviceType": "web",
      "deviceId": deviceId,
      "deviceModel": "browser",
      "appKey": "testKey",
      "appVersion": "1.0"
    };

    if (type === 'facebook'){
      registerParams.facebook = {
        "id": userData.userID,
        "accessToken": userData.accessToken
      };
    } else if (type === 'peel'){
      registerParams.peel = {
        "id": userData.id,
        "name": userData.userName
      }; 
    } else if (type === 'email'){
      registerParams.email = {
        "id": userData.id,
        "name": userData.userName
      }
    }
    return registerParams;
  };

  var registerUser = function(registerParams, mUserType, callback) {
    // Post request to our api to register/retrieve user
    var userType = registerParams.type;
    if (mUserType){
      userType = mUserType;
    }
    $http.post(REGISTER_SERVER_URI, JSON.stringify(registerParams))
      .then(function (response) {
        if (response.status === 200) {
          if (NETWORK_DEBUG)
          console.log("Successfully Registered User of Type: " + userType);
          if (registerParams.type === 'facebook'){
            userLoggedInToFacebook = true;
          }

          // Store user credentials in Local Storage
          UserInfoService.setUserCredentials(
            response.data.userId, 
            response.data.accessToken, 
            response.data.sessionId,
            userType);
        }
      },
      function (response) {
        if (NETWORK_DEBUG)
        console.log('Registration Error: ', response);
      }).then(function (response) {
        initializeContent(callback);
      });
  };

  var initializeContent = function(callback) {
    if (NETWORK_DEBUG)
    console.log("Initializing Content");

    var initChannel = ChannelService.getChannel();
    var initTopic = TopicService.getTopicId();

    if (!!initChannel) {
      if (NETWORK_DEBUG)
      console.log("found channel ID: " + initChannel);
      networkService.send(ChannelService.getLiveGameTopic(initChannel));
    }
    else if (!!initTopic) {
      if (NETWORK_DEBUG)
      console.log("found Topic ID: " + initTopic);
      if (callback){
        callback();
      }
      else if (!!urlQueryStr){
        $window.location = "#/topic/" + initTopic + "?" + urlQueryStr;
      } else {
        $window.location = "#/topic/" + initTopic;
      }
    }
    else {
      var initPost = ReplyService.getPostId();
      if (!!initPost){
        if (NETWORK_DEBUG)
        console.log("found post ID: " + initPost);
        if (HTML5_LOC){
          $location.path("/post/" + initPost);
        } else {
          $window.location = "#/post/" + initPost;
        }
      }
    }
  };

  return {
    loginAsGuest:loginAsGuest,
    loginToFacebook: loginToFacebook,
    loginWithPeel: loginWithPeel,
    loginWithEmail: loginWithEmail,
    techMLogin: techMLogin,
    setRegistrationParams: setRegistrationParams,
    registerUser: registerUser,
    initializeContent: initializeContent,
    userLoggedInToFacebook: userLoggedInToFacebook
  };

}]);
