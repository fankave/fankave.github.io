networkModule.factory('URIHelper', function () {

	var peelUserName;
	var peelUserId;

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
		isPeelUri:function(){
			var vars = getUrlVars();
			if(vars["peel"]){
				peelUserId = vars["userId"];
				peelUserName = vars["userName"];
				return true;
			}
			else
			return false;
		},
		getPeelUserId:function(){
			return peelUserName;
		},
		getPeelUserName:function(){
			return peelUserId;
		}


	};

});