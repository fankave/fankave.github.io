var loginModule = angular.module("LoginModule", ["NetworkModule", "FacebookModule"]);
loginModule.controller("LoginController", ["$scope","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","RegistrationService","UserInfoService",initTopicController]);

function initTopicController($scope, $sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, RegistrationService, UserInforService)
{
	ChannelService.setChannel($routeParams.channelID);
	$scope.urlQueryStr = window.location.search.substring(1);
	console.log(" $scope.urlQueryStr :" + $scope.urlQueryStr);
	
	
//	function getLiveGameTopic(){
//		var uri = "/v1.0/channel/topic/show/" + TopicService.getChannel()+"?type=livegame";
//
//		return  varTopicParams = {"rid": "topic",
//				"timestamp": new Date().getTime(),
//				"method": "GET",
//				"uri":uri };
//	}
//	
//	$scope.init = function() {
//		networkService.init();
//		networkService.send(getLiveGameTopic);
//	};

	
	var updateTopic = function(){
		if(TopicService.getTopic() != undefined){
			console.log("Got Topic id from Channel : " +"#/topic/" + TopicService.getTopicId()+$scope.urlQueryStr)
			window.location = "#/topic/" + TopicService.getTopicId()+$scope.urlQueryStr;
		}

	};
	
	

	ChannelService.registerObserverCallback(updateTopic);
	if(UserInfoService.isUserLoggedIn()){
		if(NETWORK_DEBUG)
			console.log("User is logged in, checking for connection");
		if(!networkService.isSocketConnected())
			networkService.init();
		window.location = "#/topic/" + TopicService.getTopicId()+$scope.urlQueryStr;
	}
	if(URIHelper.isPeelUser()){
		$scope.isPeelUser = true;
		RegistrationService.registerUser(URIHelper.getPeelUserId(),(URIHelper.getPeelUserName()));
		//networkService.init();
	}
	else{
		// console.log("Not logged in to facebook, take user to login page")
		window.location = "#/facebookLogin";
	}
	$scope.trustSrc = function(src)
	{
		return $sce.trustAsResourceUrl(src);
	}

}