angular.module("ChannelModule", ["NetworkModule", "AuthModule"])
.controller("ChannelController", ["$scope", "$state", "$stateParams", "$window","$location","$sce","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",

function ($scope,$state,$stateParams,$window,$location,$sce,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($stateParams.channelID);
  console.log("State Params in Channel: ", $stateParams);
  
  $scope.init = function() {
    console.log("Init all connections");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic($stateParams.channelID));
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id !== undefined){
      if (NETWORK_DEBUG) console.log("Got Topic ID from Channel: ", id);
      var paramsObj = $stateParams;
      paramsObj.topicID = id;
      if (NETWORK_DEBUG) console.log("Go to Topic w/ Params: ", paramsObj);
      if ($stateParams.tab === 'video'){
        delete $stateParams.tab;
        $state.go("topic.video", paramsObj);
      } else if ($stateParams.tab === 'social'){
        delete $stateParams.tab;
        $state.go("topic.social", paramsObj);
      } else {
        delete $stateParams.tab;
        $state.go("topic.chat", paramsObj);
      }
    }

  };
  
  

  ChannelService.registerObserverCallback(updateTopic);
  
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    $scope.init();
  }
  else if (URIHelper.isSmartStadiumUser()){
    $scope.isSmartStadiumUser = true;
    AuthService.loginWithEmail();
  }
  else if (URIHelper.isTechMUser()){
    console.log("MI16 User Detected");
    $window.location = "#/login?MI16=true";
  }
  else {
    if(URIHelper.isPeelUser()){
      $scope.isPeelUser = true;
      AuthService.loginWithPeel();
    }
    else{
      AuthService.loginAsGuest();
    }
  }
  

}]);
