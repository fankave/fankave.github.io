authModule.factory("AuthService", ["$http", "UserInfoService", "TopicService", "ReplyService", "networkService", "ForumDeviceInfo", "ChannelService", "URIHelper", 
  function ($http, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

  var userLoggedInToFacebook = false;
  var loginToFacebook = function() {
    FB.login(function (response) {
      if (response.status === 'connected') {
        var registerParams = setRegistrationParams("facebook", -25200, response.authResponse);
        registerUser(registerParams);
      }
      // TODO: error handling
    });
  };

  var loginWithPeel = function() {
    var userData = {};
    userData.id = URIHelper.getPeelUserId();
    userData.userName = URIHelper.getPeelUserName();

    var registerParams = setRegistrationParams("peel", -28800, userData);
    registerUser(registerParams);
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
    }
    return registerParams;
  };

  var registerUser = function(registerParams) {
    // Post request to our api to register/retrieve user
    $http.post(REGISTER_SERVER_URI, JSON.stringify(registerParams))
      .then(function (response) {
        if (response.status === 200) {
          console.log("Successfully Registered User of Type: " + registerParams.type);
          if (registerParams.type === 'facebook'){
            userLoggedInToFacebook = true;
          }

          // Store user credentials in Local Storage
          UserInfoService.setUserCredentials(
            response.data.userId, 
            response.data.accessToken, 
            response.data.sessionId,
            registerParams.type);
        }
      },
      function (response) {
        console.log('Registration Error: ', response);
      }).then(function (response) {
        initializeContent();
      });
  };

  var initializeContent = function() {
    console.log("Initializing Content");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic());
  };

  return {
    loginToFacebook: loginToFacebook,
    loginWithPeel: loginWithPeel,
    setRegistrationParams: setRegistrationParams,
    registerUser: registerUser,
    initializeContent: initializeContent,
    userLoggedInToFacebook: userLoggedInToFacebook
  };

}]);
