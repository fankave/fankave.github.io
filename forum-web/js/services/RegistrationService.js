networkModule.service('RegistrationService', ["ForumStorage","ForumDeviceInfo","$http","UserInfoService","networkService","ReplyService","TopicService", "ChannelService","URIHelper",registration]);

function registration(ForumStorage,ForumDeviceInfo,$http,UserInfoService,networkService,ReplyService,TopicService,ChannelService,URIHelper) {
	if(HOST_NAME == undefined)
		HOST_NAME = window.location.hostname;;
		if(HOST_NAME == 'dev.fankave.com')
		REGISTER_SERVER_URI = 'https://dev.fankave.com/v1.0/user/register';

	function getPeelRegistrationParams(userId,userName){
		var peelData = new Object();
		peelData.id = userId;
		peelData.name = userName;
		
		var deviceId = ForumDeviceInfo.getDeviceId();
		var registrationParameters = new Object();
		registrationParameters.type = 'peel';
		registrationParameters.locale = 'en_US';
		registrationParameters.utcOffset = -28800;
		registrationParameters.deviceType = 'web';
		registrationParameters.deviceId = deviceId;
		registrationParameters.deviceModel = 'browser';
		registrationParameters.appKey = 'testkey';
		registrationParameters.appVersion = '1.0';
		registrationParameters.peel = peelData;
		
//		{
//				"type": "peel", 
//				"locale": "en_US", 
//				"utcOffset": -28800, 
//				"deviceType": "ios", 
//				"deviceId": "testdevice2", 
//				"deviceModel": "i phone 6", 
//				"appKey": "testKey", 
//				"appVersion": "1.0", 
//				"peel": {"id": userId, "name": userName}
//		};
//		
		//var regParamsTemp = {"type": "peel", "locale": "en_US", "utcOffset": -28800, "deviceType": "ios", "deviceId": "testdevice", "deviceModel": "iPhone 6", "appKey": "testkey", "appVersion": "1.0", "peel": {"id": "10", "name": "Peel User"}};
		//return registrationParameters;
		return registrationParameters;

	}
	function registerUser(userId,userName){
		var registrationParameters = getPeelRegistrationParams(userId,userName);
//
//
//		console.log('Peel registration parameters: ' + JSON.stringify(registrationParameters));
//		var peelData = new Object();
//		peelData.id = userId;
//		peelData.name = userName;
//
//		var deviceId = ForumDeviceInfo.getDeviceId();
//	     var registrationParameters =
//	      {
//	        "type":"peel",
//	        "locale":"en_US",
//	        "utcOffset":-25200,
//	        "deviceType":"web",
//	        "deviceId":deviceId,
//	        "deviceModel":"browser",
//	        "appKey":"testKey",
//	        "appVersion":"0.1",
//	        "peel":{"id":"1","name":"TestPeelUser"}
//	      };
			console.log('Peel registration parameters: ' + JSON.stringify(registrationParameters));
		var registrationSuccess = false;
		// $http.post(REGISTER_SERVER_URI, JSON.stringify(registrationParameters))
		// 	.then(function (response) {
		// 	console.log('success', response);

		// 	if(status == 200)
		// 	{
		// 		 console.log("registered user successfully");
		// 		 console.log("user ID: " + response.data.userId);
		// 		 console.log("session ID: " + response.data.sessionId);
		// 		 console.log("access token: " + response.data.accessToken);
		// 		 registrationSuccess = true;
		// 		 UserInfoService.setUserCredentials(response.data.userId, response.data.accessToken, response.data.sessionId, "peel");
				
		// 	}
			
		// 	networkService.init();
			
		// 	if(ReplyService.getPostId() != undefined)
  //           {
  //           	// console.log("found post ID: " + ReplyService.getPostId());
  //           	window.location = "#/post/" + ReplyService.getPostId();
  //           }
  //           else if(TopicService.getTopicId() != undefined)
  //           {
		// 		window.location = "#/topic/" + TopicService.getTopicId();
		// 	}
		// 	else if(ChannelService.getChannel() != undefined){
		// 		networkService.send(ChannelService.getLiveGameTopic());
		// 	}
		// }, 
		// function (response) {
		// 	console.log('error ' +  response);
		// 	console.log('response.code:  ' + response.status);
		// });
		var res = $http.post(REGISTER_SERVER_URI, JSON.stringify(registrationParameters));
		res.success(function(data, status, headers, config) {
			console.log('success');
			console.log('response.status: ' + status);
			console.log('response.data: ' + JSON.stringify(data));
			console.log('response.headers: ' + headers);
			console.log('response.config: ' + config);

			if(status == 200)
			{
				 console.log("registered user successfully");
				 console.log("user ID: " + data.userId);
				 console.log("session ID: " + data.sessionId);
				 console.log("access token: " + data.accessToken);
				 registrationSuccess = true;
				 UserInfoService.setUserCredentials(data.userId, data.accessToken, data.sessionId, "peel");
				
			}
			
			networkService.init();
			
			if(ReplyService.getPostId() != undefined)
            {
            	// console.log("found post ID: " + ReplyService.getPostId());
            	window.location = "#/post/" + ReplyService.getPostId();
            }
            else if(TopicService.getTopicId() != undefined)
            {
				window.location = "#/topic/" + TopicService.getTopicId();
			}
			else if(ChannelService.getChannel() != undefined){
				networkService.send(ChannelService.getLiveGameTopic());
			}
		});
				
				
		res.error(function(data, status, headers, config)
				{
					console.log('error ' +  data);
					console.log('response.code:  ' + status);
				});
	};
	

	
	function isUserRegistered(){
		//TODO
	};

	return{
		isUserRegistered:isUserRegistered,
		registerUser:registerUser

	};	
}