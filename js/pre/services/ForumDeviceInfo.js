angular.module('NetworkModule')
.factory('ForumDeviceInfo', ["ForumStorage",
	function (ForumStorage) {
	//TODO : TEMP function to generate uuid. change this in final version
	function _p8(s) {
		var p = (Math.random().toString(16)+"000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	function generateUUID() {
		if (GEN_DEBUG)
		console.log("GEnerating UUID");
		var uuid = _p8() + _p8(true) + _p8(true) + _p8();
		if (GEN_DEBUG)
		console.log(" UUID :"+ uuid);
		return uuid;
	}

	return{
		getDeviceId:function(){
			var id = ForumStorage.getFromLocalStorage("forumUUID");
			if(id == undefined || id.length <15){
				id = generateUUID();
				ForumStorage.setToLocalStorage("forumUUID",id);
			}
			if (GEN_DEBUG)
			console.log("generated ID : "+ id);
			return id;

		}
	}
}]);
