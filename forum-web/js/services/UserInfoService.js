networkModule.service('UserInfoService', function () {
	//OLD Creds userId=1, sessionId=dac24379, accessToken=7uFF3QGh-84=
	//NEW Creds userId=193, sessionId=53d7b518, accessToken=dsKGKXyZgGs=
	var _userInfo;
//	var userInfo = {
//			"userId":"193",
//			"accessToken":"dsKGKXyZgGs=",
//			"sessionId":"53d7b518"
//	};

	function getUserCredentials(){
		if(_userInfo == undefined){
			console.log("UserInfoService : UserId is not defined , using static user");
			return userInfo = {
					"userId":"193",
					"accessToken":"dsKGKXyZgGs=",
					"sessionId":"53d7b518"
			};
		}
			
		return _userInfo;
	}
	
	function setUserCredentials(userId, accessToken, sessionId){
		console.log("setUserCredentials(" + userId + ", " + accessToken + ", " + sessionId);
		_userInfo = {};
		_userInfo.userId = userId;
		_userInfo.accessToken = accessToken;
		_userInfo.sessionId = sessionId;
		console.log("this.userInfo.userId :"+ _userInfo.userId);
	}
	return{
		getUserCredentials:getUserCredentials,
		setUserCredentials:setUserCredentials
	}

});