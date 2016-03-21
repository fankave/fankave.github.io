angular.module('NetworkModule')
.factory('URIHelper', ["ForumStorage","$rootScope",
	function (ForumStorage, $rootScope) {

	var peelUserName;
	var peelUserId;
	var peelShowId;

	var ssUserName;
	var ssUserId;

	var _MI16;
	var _MWC;
	var tabEntryComplete;

	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	return {
		isPeelUser:function(){
			var vars = getUrlVars();
			if(vars["peel"]){
				peelUserId = vars["userId"];
				peelUserName = vars["userName"];
				peelShowId = vars["showId"];
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
			var vars = getUrlVars();
			if(vars["smartStadium"]){
				ssUserId = vars["userId"];
				ssUserName = vars["userName"];
				ForumStorage.setToLocalStorage("forumSmartStadiumUserId",ssUserId);
				return true;
			}
			return false;
		},
		isTechMUser:function(){
			var vars = getUrlVars();
			if (vars["MI16"]){
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
			var vars = getUrlVars();
			if (vars["MWC"]){
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
		},
		getActiveTab:function(){
			var vars = getUrlVars();
			if (vars["tab"]){
				if (vars["tab"] === 'video'){
					return 'video';
				}
				if (vars["tab"] === 'social'){
					return 'social';
				}
			}
		},
		isSuperBowl:function(){
			var vars = getUrlVars();
			if (vars["superbowl"]){
				return true;
			}
			return false;
		},
		tabEntered: function(){
			tabEntryComplete = true;
		},
		tabEntry: function(){
			return tabEntryComplete;
		},
		extractOffset: function(uri){
			var offset = uri.slice(uri.indexOf('offset'));
    	var hash = offset.split("=");
    	return hash[1];
		},
		embedded: function(){
      var vars = getUrlVars();
      if (vars['embed']){
        console.log("Embed found in URL");
        $rootScope.embed = true;
        return true;
      }
      if ($rootScope.embed){
        console.log("Embed found on rootScope");
        return true;
      }
      return false;
    }

	};

}]);
