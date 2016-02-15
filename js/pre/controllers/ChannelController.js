angular.module("ChannelModule", ["NetworkModule", "AuthModule"])
.controller("ChannelController", ["$scope", "$state", "$stateParams", "$window","$location","$sce","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",

function ($scope,$state,$stateParams,$window,$location,$sce,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($stateParams.channelID);
  var channelParams = $stateParams;
  console.log("Channel Params: ", channelParams);
  // if (window.location.href.indexOf('?') !== -1){
  //   $scope.urlQueryStr = window.location.href.slice(window.location.href.indexOf('?')+1);
  //   console.log(" $scope.urlQueryStr: " + $scope.urlQueryStr);
  // }
  
  $scope.init = function() {
    console.log("Init all connections");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic($stateParams.channelID));
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id !== undefined){
      console.log("Got Topic id from Channel : " +"/topic/" + id + $scope.urlQueryStr);
      if (HTML5_LOC){
        if(!!$scope.urlQueryStr)
          $location.path("/topic/" + id).search($scope.urlQueryStr);
        else
          $location.path("/topic/" + id);
      } else {
        // if(!!$scope.urlQueryStr)
        var paramsObj = channelParams;
        paramsObj.topicID = id;
        // paramsObj.channel = channelParams.channelID;
        console.log("GO Topic: ", paramsObj);
        $state.go("topic.chat", paramsObj);
        // else
          // $window.location = "#/topic/" + id;
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
