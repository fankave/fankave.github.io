angular.module('NetworkModule')
.factory('URIHelper', ["ForumStorage","$stateParams",
	function (ForumStorage,$stateParams) {

	var peelUserName;
	var peelUserId;
	var peelShowId;

	var ssUserName;
	var ssUserId;

	var _MI16;
	var _MWC;

	return {
		isPeelUser:function(){
			if($stateParams.peel){
				peelUserId = $stateParams.userId;
				peelUserName = $stateParams.userName;
				peelShowId = $stateParams.showId;
				//If diff previous peel user, clear storage
				var prevPeelUser = ForumStorage.getFromLocalStorage("forumUserType");
				// if(prevPeelUser != undefined && prevPeelUser == "peel" && ForumStorage.setToLocalStorage("forumPeelUserId") != peelUserId)
					// ForumStorage.clearStorage();
				ForumStorage.setToLocalStorage("forumPeelUserId",peelUserId);
				ForumStorage.setToLocalStorage("forumPeelShowId",peelShowId);
				return true;
			}
			else
			return false;
		},
		isSmartStadiumUser:function(){
			if($stateParams.smartStadium){
				ssUserId = $stateParams.userId;
				ssUserName = $stateParams.userName;
				ForumStorage.setToLocalStorage("forumSmartStadiumUserId",ssUserId);
				return true;
			}
			return false;
		},
		isTechMUser:function(){
			console.log("isTechM: ", $stateParams);
			if ($stateParams.MI16){
				_MI16 = true;
				ForumStorage.setToLocalStorage("techMIUser",true);
				return true;
			}
			if (_MI16){
				return true;
			}
			return false;
		},
		isMWCUser:function(){
			if ($stateParams.MWC){
				_MWC = true;
				ForumStorage.setToLocalStorage("MWCUser",true);
				return true;
			}
			if (_MWC){
				return true;
			}
			return false;
		},
		getPeelUserId:function(){
			return peelUserId;
		},
		getPeelUserName:function(){
			return peelUserName;
		},
		getPeelShowId:function(){
			return peelShowId;
		},
		getPeelParams:function(){
			return window.location.search.substring(1);
		},
		getSSUserId:function(){
			return ssUserId;
		},
		getSSUserName:function(){
			return ssUserName;
		}


	};

}]);