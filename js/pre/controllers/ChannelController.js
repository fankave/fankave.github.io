angular.module("ChannelModule", ["NetworkModule", "AuthModule"])
.controller("ChannelController", ["$scope","$window","$location","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","AuthService","UserInfoService",

function ($scope,$window,$location,$sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, AuthService, UserInfoService)
{
  ChannelService.setChannel($routeParams.channelID);
  if (window.location.href.indexOf('?') !== -1){
    var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?')+1);
    if (GEN_DEBUG)
    console.log("urlQueryStr: " + urlQueryStr);
  }
  
  function init() {
    networkService.init();
    networkService.send(ChannelService.getLiveGameTopic());
  };

  
  var updateTopic = function(){
    var id = ChannelService.getLiveTopicId();
    if(id !== undefined){
      if(GOOGLE_ANALYTICS === true){
    	ga('send', 'pageview', "/topic/"+id);
    }
      if (GEN_DEBUG){
  	  console.log('Sent Pageview from /channel/' + id);
      console.log("Got Topic id from Channel : " + "/topic/" + id + urlQueryStr);
      }
      if(!!urlQueryStr)
        $location.url("/topic/" + id + "?" + urlQueryStr);
      else
        $location.url("/topic/" + id);
    }

  };
  
  

  ChannelService.registerObserverCallback(updateTopic);
  
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    init();
  }
  else if (URIHelper.isSmartStadiumUser()){
    AuthService.loginWithEmail();
  }
  else if (URIHelper.isTechMUser()){
    if (GEN_DEBUG)
    console.log("MI16 User Detected");
    $location.url("/login?MI16=true");
  }
  else if (URIHelper.isMWCUser()){
    if (GEN_DEBUG)
    console.log("MWC User Detected");
    $location.url("/login?MWC=true");
  }
  else {
    if(URIHelper.isPeelUser()){
      AuthService.loginWithPeel();
    }
    else{
      AuthService.loginAsGuest();
    }
  }
  

}]);
