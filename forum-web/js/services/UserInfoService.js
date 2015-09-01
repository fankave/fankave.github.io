networkModule.service('UserInfoService', function () {
	//OLD Creds userId=1, sessionId=dac24379, accessToken=7uFF3QGh-84=
	//NEW Creds userId=193, sessionId=53d7b518, accessToken=dsKGKXyZgGs=
	var userInfo = {
			"userId":"193",
			"accessToken":"dsKGKXyZgGs=",
			"sessionId":"53d7b518"
	}

	function getUserCredentials(){
		return userInfo;
	}
	
	function setUserCredentials(userId, accessToken, sessionId){
		this.userInfo.userId = userId;
		this.userInfo.accessToken = accessToken;
		this.userInfo.sessionId = sessionId;
		console.log("this.userInfo.userId :"+ this.userInfo.userId);
	}
	return{
		getUserCredentials:getUserCredentials,
		setUserCredentials:setUserCredentials
	}

});