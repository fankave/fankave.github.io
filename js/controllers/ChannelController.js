var channelModule = angular.module("ChannelModule", ["NetworkModule", "AuthModule"]);
channelModule.controller("ChannelController", ["$scope","$window","$location","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",initTopicController]);

function initTopicController($scope,$window,$location,$sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($routeParams.channelID);
  if (window.location.href.indexOf('?') !== -1){
    $scope.urlQueryStr = window.location.href.slice(window.location.href.indexOf('?')+1);
    console.log(" $scope.urlQueryStr: " + $scope.urlQueryStr);
  }
  
  $scope.init = function() {
    console.log("Init all connections");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic());
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id !== undefined){
      console.log("Got Topic id from Channel : " +"/topic/" + id + $scope.urlQueryStr);
      if(!!$scope.urlQueryStr)
        $location.path("/topic/" + id).search($scope.urlQueryStr);
      else
        $location.path("/topic/" + id);
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
        $location.path("/login");
    }
  }
  

}
