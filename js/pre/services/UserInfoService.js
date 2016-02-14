angular.module('NetworkModule')
.factory('UserInfoService', ["ForumStorage","URIHelper",
	function (ForumStorage, URIHelper) {
	//OLD Creds userId=1, sessionId=dac24379, accessToken=7uFF3QGh-84=
	//NEW Creds userId=193, sessionId=53d7b518, accessToken=dsKGKXyZgGs=
	var _userInfo = {};
	var userInfoTemp = {
			"userId":"193",
			"accessToken":"dsKGKXyZgGs=",
			"sessionId":"53d7b518"
	};
	var _isUserLoggedIn = false;
	var _userType = "";

//	var userInfoTemp = {
//	"userId":"204",
//	"accessToken":"_uO41ylA_xs=",
//	"sessionId":"b7427f4a"
//	};

	function getUserCredentials(){
		if(_userInfo == undefined){
			if (NETWORK_DEBUG)
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
		if (NETWORK_DEBUG)
		console.log("setUserCredentials: ", userId, accessToken, sessionId, userType);
		// _userInfo = {};
		_userInfo.userId = userId;
		_userInfo.accessToken = accessToken;
		_userInfo.sessionId = sessionId;
		_isUserLoggedIn = true;
		_userInfo.userType = userType;
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
			if (NETWORK_DEBUG)
			console.log("ForumStorage.getFromLocalStorage: "+ForumStorage.getFromLocalStorage("forumUserType"));
			if(_userInfo.userType === "peel")
				return true;
			if(ForumStorage.getFromLocalStorage("forumUserType") === "peel")
				return true;
			return false;
		},
		isSmartStadiumUser:function(){
			var ssUser = URIHelper.isSmartStadiumUser();
			if (NETWORK_DEBUG)
			console.log("ForumStorage.getFromLocalStorage: ", ForumStorage.getFromLocalStorage("forumUserType"));
			if(ssUser){
				_userInfo.userType = 'email';
				return true;
			}
			if(_userInfo.userType === "email"){
				return true;
			}
			if (ForumStorage.getFromLocalStorage("forumUserType") === "email"){
				return true;
			}
			return false;
		},
		isMI16User:function(){
			var MI16User = URIHelper.isTechMUser();
			if (NETWORK_DEBUG)
			console.log("ForumStorage.getFromLocalStorage: ", ForumStorage.getFromLocalStorage("forumUserType"));
			if(MI16User){
				_userInfo.userType = 'MI16';
				return true;
			}
			if(_userInfo.userType === "MI16"){
				return true;
			}
			if (ForumStorage.getFromLocalStorage("forumUserType") === "MI16"){
				return true;
			}
			return false;
		},
		isMWCUser:function(){
			var MWCUser = URIHelper.isMWCUser();
			if (NETWORK_DEBUG)
			console.log("ForumStorage.getFromLocalStorage: ", ForumStorage.getFromLocalStorage("forumUserType"));
			if(MWCUser){
				_userInfo.userType = 'MWC';
				return true;
			}
			if(_userInfo.userType === "MWC"){
				return true;
			}
			if (ForumStorage.getFromLocalStorage("forumUserType") === "MWC"){
				return true;
			}
			return false;
		},
		getUserType:function(){
			if (NETWORK_DEBUG)
			console.log("UIS _userType - - - ", _userInfo.userType);
			return _userInfo.userType;
		},
		isGuestUser:function(){
			if (NETWORK_DEBUG)
			console.log("UIS _userType - - - ", _userInfo.userType);
			if(_userInfo.userType === "guest" || ForumStorage.getFromLocalStorage("forumUserType") === "guest")
			return true;
			return false;
		}

	};

}]);
