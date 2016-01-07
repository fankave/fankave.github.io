networkModule.service('UserInfoService', function (ForumStorage, URIHelper) {
	//OLD Creds userId=1, sessionId=dac24379, accessToken=7uFF3QGh-84=
	//NEW Creds userId=193, sessionId=53d7b518, accessToken=dsKGKXyZgGs=
	var _userInfo;
	var userInfoTemp = {
			"userId":"193",
			"accessToken":"dsKGKXyZgGs=",
			"sessionId":"53d7b518"
	};
	var _isUserLoggedIn = false;
	var _userType;

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
		//console.log("Current user id  && id :"+_userInfo.userId + " :   "+ id);
		if(id == _userInfo.userId)
			return true;
		return false;
	}

	function setUserCredentials(userId, accessToken, sessionId, userType){
		// console.log("setUserCredentials(" + userId + ", " + accessToken + ", " + sessionId);
		_userInfo = {};
		_userInfo.userId = userId;
		_userInfo.accessToken = accessToken;
		_userInfo.sessionId = sessionId;
		_isUserLoggedIn = true;
		_userType = userType;
		// ForumStorage.clearStorage();
		ForumStorage.setToLocalStorage("forumIsLoggedIn",_isUserLoggedIn);
		ForumStorage.setToLocalStorage("forumUserId",userId);
		ForumStorage.setToLocalStorage("forumAccessToken",accessToken);
		ForumStorage.setToLocalStorage("forumSessionId",sessionId);
		ForumStorage.setToLocalStorage("forumUserType",userType);

		// console.log("this.userInfo.userId :"+ _userInfo.userId);
	}

	function hasUserVisited() {
		return ForumStorage.getFromLocalStorage("hasUserVisited") ? true : false;
	}

	return{
		getUserCredentials:getUserCredentials,
		setUserCredentials:setUserCredentials,
		isCurrentUser:isCurrentUser,
		hasUserVisited: hasUserVisited,
		isUserLoggedIn:function(){

			//console.log("cached : is user logged in : "+_isUserLoggedIn);
			if(_isUserLoggedIn)
				return true;
			else{
//				var islogged = ForumStorage.getFromLocalStorage("forumIsLoggedIn");
//				console.log("storage : is user logged in : "+islogged);
				if(ForumStorage.getFromLocalStorage("forumIsLoggedIn"))
				{
					_userInfo = {};
					_userInfo.userId = ForumStorage.getFromLocalStorage("forumUserId");
					_userInfo.accessToken = ForumStorage.getFromLocalStorage("forumAccessToken");
					_userInfo.sessionId = ForumStorage.getFromLocalStorage("forumSessionId");
					return true;
				}
				return false;
			}
		},
		isPeelUser:function(){
			URIHelper.isPeelUser();
			console.log("ForumStorage.getFromLocalStorage: "+ForumStorage.getFromLocalStorage("forumUserType"));
			if(_userType === "peel")
				return true;
			if(ForumStorage.getFromLocalStorage("forumUserType") == "peel")
				return true;
			return false;
		},
		isSmartStadiumUser:function(){
			var ssUser = URIHelper.isSmartStadiumUser();
			console.log("ForumStorage.getFromLocalStorage: ", ForumStorage.getFromLocalStorage("forumUserType"));
			if(ssUser){
				return true;
			}
			if(_userType === "email"){
				return true;
			}
			return false;
		},
		getUserType:function(){
			console.log("UIS _userType - - - ", _userType);
			return _userType;
		}

	};

});