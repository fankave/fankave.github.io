var channelModule = angular.module("ChannelModule", ["NetworkModule", "AuthModule"]);
channelModule.controller("ChannelController", ["$scope","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",initTopicController]);

function initTopicController($scope, $sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($routeParams.channelID);
  $scope.urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
  console.log(" $scope.urlQueryStr :" + $scope.urlQueryStr);
  
  $scope.init = function() {
    console.log("Init all connections");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic());
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id != undefined){
      console.log("Got Topic id from Channel : " +"#/topic/" + id+$scope.urlQueryStr)
      if($scope.urlQueryStr.charAt(0) == '?')
        window.location = "#/topic/" + id+$scope.urlQueryStr;
      else
        window.location = "#/topic/" + id
    }

  };
  
  

  ChannelService.registerObserverCallback(updateTopic);
  
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    $scope.init();
  }
  else{
    if(URIHelper.isPeelUser()){
      $scope.isPeelUser = true;
      AuthService.loginWithPeel();
    }
    else{
      // console.log("Not logged in to facebook, take user to login page")
      window.location = "#/";
    }
  }
  

}
