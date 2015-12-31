networkModule.factory('URIHelper', function (ForumStorage) {

	var peelUserName;
	var peelUserId;
	var peelShowId;
	var peelParmas;

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
		}


	};

});