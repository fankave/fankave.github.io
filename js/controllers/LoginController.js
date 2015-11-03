var loginModule = angular.module("LoginModule", ["NetworkModule", "AuthModule"]);
loginModule.controller("LoginController", ["$scope","$sce","$routeParams","networkService", "ChannelService","TopicService","URIHelper","RegistrationService","UserInfoService",initTopicController]);

function initTopicController($scope, $sce,$routeParams,networkService,ChannelService,TopicService, URIHelper, RegistrationService, UserInfoService)
{
	HOST_NAME = window.location.hostname;
	if(HOST_NAME == 'was.fankave.com')
		{
			WEBSOCKET_BASE_URI = 'ws://was.fankave.com/ws?';
			REGISTER_SERVER_URI = 'http://was.fankave.com/v1.0/user/register';
			console.log("setting Prod url for "+ HOST_NAME);
		}
	ChannelService.setChannel($routeParams.channelID);
	$scope.urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
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
//		if(!networkService.isSocketConnected())
//			networkService.init();
//		window.location = "#/topic/" + TopicService.getTopicId()+$scope.urlQueryStr;
	}
	else{
		if(URIHelper.isPeelUser()){
			$scope.isPeelUser = true;
			RegistrationService.registerUser(URIHelper.getPeelUserId(),(URIHelper.getPeelUserName()));
		}
		else{
			// console.log("Not logged in to facebook, take user to login page")
			window.location = "#/facebookLogin";
		}
	}
	

}