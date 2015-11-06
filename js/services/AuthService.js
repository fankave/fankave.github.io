authModule.factory("AuthService", ["$http", "UserInfoService", "TopicService", "ReplyService", "networkService","ForumDeviceInfo", "ChannelService",
  function ($http, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService) {

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
          if (ReplyService.getPostId() !== undefined) {
            console.log("found post ID: " + ReplyService.getPostId());
            window.location = "#/post/" + ReplyService.getPostId();
          }
          else if (TopicService.getTopicId() !== undefined) {
            console.log("found Topic ID: " + TopicService.getTopicId());
            window.location = "#/topic/" + TopicService.getTopicId();
          }
          else if (ChannelService.getChannel() !== undefined) {
            console.log("found channel ID: " + ChannelService.getChannel());
            networkService.send(ChannelService.getLiveGameTopic());
          }
        }
      },
      function (response) {
        console.log('error');
        console.log('response:  ' + JSON.stringify(response));
        console.log('response.status: ' + response.status);
        console.log('response.data: ' + JSON.stringify(response.data));
        console.log('response.headers: ' + response.headers);
        console.log('response.config: ' + response.config);
        console.log('response.statusText: ' + response.statusText);
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