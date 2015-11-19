networkModule.factory('SocialService', function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var _socialArray = [];
	var _offset = 0;
	var LIMIT = 20;


	function setSocialData(socialData) {

		tempData = socialData.data.results;
		if(tempData!= undefined && tempData.length>0){
			var len = tempData.length;
			for(i=0;i<len;i++){
				var _socialObject = {};
				_socialObject = Bant.bant(tempData[i]);
				if(_socialObject.id != undefined)
					_socialArray.push(_socialObject);
			}
			_offset = _socialArray.length;
			notifyObservers();
		}
	}


	//call this when you know 'comments' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

	function registerObserverCallback(callback){
		//register an observer
		// console.log("comments callback registered");
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}

	function socialDataGetRequest(id){
		return  {"rid": "social",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+_offset)}
	}

	return {
		socialArray: function(){
			return _socialArray },

			setSocialData:setSocialData,
			getSocialDataRequest:socialDataGetRequest,

			registerObserverCallback:registerObserverCallback
	};

});