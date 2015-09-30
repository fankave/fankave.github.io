networkModule.service('UserInfoService', function (ForumStorage) {
	//OLD Creds userId=1, sessionId=dac24379, accessToken=7uFF3QGh-84=
	//NEW Creds userId=193, sessionId=53d7b518, accessToken=dsKGKXyZgGs=
	var _userInfo;
	var userInfoTemp = {
			"userId":"193",
			"accessToken":"dsKGKXyZgGs=",
			"sessionId":"53d7b518"
	};
	var userLoggedIn = false;

//	var userInfoTemp = {
//	"userId":"204",
//	"accessToken":"_uO41ylA_xs=",
//	"sessionId":"b7427f4a"
//	};

	function getUserCredentials(){
		if(_userInfo == undefined){
			console.log("UserInfoService : UserId is not defined , using static user, TODO : Remove this for release build");
			_userInfo = userInfoTemp;
			return userInfoTemp;
		}

		return _userInfo;
	}

	function isCurrentUser(id){
		return id == _userInfo.userId;
	}

	function setUserCredentials(userId, accessToken, sessionId){
		// console.log("setUserCredentials(" + userId + ", " + accessToken + ", " + sessionId);
		_userInfo = {};
		_userInfo.userId = userId;
		_userInfo.accessToken = accessToken;
		_userInfo.sessionId = sessionId;
		isUserLoggedIn = true;
		ForumStorage.setToLocalStorage("forumIsLoggedIn",isUserLoggedIn);
		ForumStorage.setToLocalStorage("forumUserId",userId);
		ForumStorage.setToLocalStorage("forumAccessToken",accessToken);
		ForumStorage.setToLocalStorage("forumSessionId",sessionId);

		// console.log("this.userInfo.userId :"+ _userInfo.userId);
	}
	return{
		getUserCredentials:getUserCredentials,
		setUserCredentials:setUserCredentials,
		isCurrentUser:isCurrentUser,
		isUserLoggedIn:function(){
			if(ForumStorage.getFromLocalStorage("forumIsLoggedIn"))
			{
				_userInfo = {};
				_userInfo.userId = ForumStorage.getFromLocalStorage("forumUserId");;
				_userInfo.accessToken = ForumStorage.getFromLocalStorage("forumAccessToken");
				_userInfo.sessionId = ForumStorage.getFromLocalStorage("forumSessionId");
			}
			return ForumStorage.getFromLocalStorage("forumIsLoggedIn");
		},
		isPeelUser:function(){
			console.log("ForumStorage.getFromLocalStorage: "+ForumStorage.getFromLocalStorage("forumUserType"));
			if(ForumStorage.getFromLocalStorage("forumUserType") == "peel")
				return true;
			return false;
		}

	}

});