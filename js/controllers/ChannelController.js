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
      if (HTML5_LOC){
        if(!!$scope.urlQueryStr)
          $location.path("/topic/" + id).search($scope.urlQueryStr);
        else
          $location.path("/topic/" + id);
      } else {
        if(!!$scope.urlQueryStr)
          $window.location = "/#/topic/" + id + "?" + $scope.urlQueryStr;
        else
          $window.location = "/#/topic/" + id;
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
    $window.location = "/#/login?MI16";
  }
  else {
    if(URIHelper.isPeelUser()){
      $scope.isPeelUser = true;
      AuthService.loginWithPeel();
    }
    else{
      if (HTML5_LOC){
        $location.path("/login");
      } else {
        $window.location = "/#/login";
      }
    }
  }
  

}
