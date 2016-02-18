angular.module("ChannelModule", ["NetworkModule", "AuthModule"])
.controller("ChannelController", ["$scope","$window","$location","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",

function ($scope,$window,$location,$sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($routeParams.channelID);
  if (window.location.href.indexOf('?') !== -1){
    var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?')+1);
    console.log("urlQueryStr: ", urlQueryStr);
  }
  
  function init() {
    console.log("Init all connections");
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic());
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id !== undefined){
    	ga('send', 'pageview', "/topic/"+id);
    	  console.log('Sent Pageview from /channel/' + id);
      console.log("Got Topic id from Channel : " +"/topic/" + id + urlQueryStr);
      if (HTML5_LOC){
        if(!!urlQueryStr)
          $location.path("/topic/" + id).search(urlQueryStr);
        else
          $location.path("/topic/" + id);
      } else {
        if(!!urlQueryStr)
          $window.location = "#/topic/" + id + "?" + urlQueryStr;
        else
          $window.location = "#/topic/" + id;
      }
    }

  };
  
  

  ChannelService.registerObserverCallback(updateTopic);
  
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    init();
  }
  else if (URIHelper.isSmartStadiumUser()){
    // $scope.isSmartStadiumUser = true;
    AuthService.loginWithEmail();
  }
  else if (URIHelper.isTechMUser()){
    console.log("MI16 User Detected");
    $window.location = "#/login?MI16=true";
  }
  else if (URIHelper.isMWCUser()){
    if (GEN_DEBUG)
    console.log("MWC User Detected");
    $window.$location = "#/login?MWC=true";
  }
  else {
    if(URIHelper.isPeelUser()){
      // $scope.isPeelUser = true;
      AuthService.loginWithPeel();
    }
    else{
      AuthService.loginAsGuest();
    }
  }
  

}]);
