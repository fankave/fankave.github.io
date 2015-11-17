authModule.factory("AuthService", ["$http", "$location", "$q", "UserInfoService", "TopicService", "ReplyService", "networkService", "ForumDeviceInfo", "ChannelService", "URIHelper", 
  function ($http, $location, $q, UserInfoService, TopicService, ReplyService, networkService, ForumDeviceInfo, ChannelService, URIHelper) {

  var _urlQueryStr;
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

  var convertChannelToTopic = function(){
    var deferred = $q.defer();
    networkService.send(TopicService.getLiveTopicFromChannel(), function(){
      deferred.resolve();
    });
    return deferred.promise;
  }

  var initializeContent = function() {
    console.log("Initializing Content: " + _urlQueryStr);
    // Initialize Network Service and determine what type of resource is being accessed
    networkService.init();

    convertChannelToTopic().then(function(){
      var topicID = TopicService.getLiveTopicId();
      console.log("Converted Topic ID: " + topicID);
      window.location = "#/topic/" + topicID;
    });


    // if (!!ReplyService.getPostId()) {
    //   console.log("found post ID: " + ReplyService.getPostId());
    //   window.location = "#/post/" + ReplyService.getPostId();
    // }
    // else if (!!TopicService.getTopicId()) {
    //   console.log("found Topic ID: " + TopicService.getTopicId());
    //   window.location = "#/topic/" + TopicService.getTopicId();
    // }
    // else if (!!TopicService.getChannel()) {
    //   console.log("found channel ID: " + TopicService.getChannel());
    //   networkService.send(TopicService.getLiveTopicFromChannel());
    //   setTimeout(function(){
    //     console.log("Auth Redirecting To: " + "/topic/", TopicService.getLiveTopicId(), _urlQueryStr);
    //     $location.url("/topic/" + TopicService.getLiveTopicId() + _urlQueryStr);}, 2000);
    // }
  };

  return {
    loginToFacebook: loginToFacebook,
    loginWithPeel: loginWithPeel,
    setRegistrationParams: setRegistrationParams,
    registerUser: registerUser,
    initializeContent: initializeContent,
    userLoggedInToFacebook: userLoggedInToFacebook,
    setQueryStr: function(query){_urlQueryStr = query;},
    getQueryStr: function(){return _urlQueryStr;}
  };

}]);
