networkModule.factory('SocialService', function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var _socialArray = [];
	var _socialArrayArchive = [];
	var _offset = 0;
	var LIMIT = 20;


	function setSocialData(socialData) {
		_socialArray = [];
		tempData = socialData.data.results;
		if(tempData!= undefined && tempData.length>0){
			var len = tempData.length;
			for(i=0;i<len;i++){
				var _socialObject = {};
				_socialObject = Bant.bant(tempData[i]);
				if(_socialObject.id != undefined)
					_socialArray.push(_socialObject);
					_socialArrayArchive.push(_socialObject);
				console.log("Social data after Parsing :", _socialObject)
				
			}
			_offset = socialData.data.nextOffset;
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

	function getSocialDataRequest(id){
		return  {"rid": "social",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+_offset)}
	}

	function appendToFeed(socialData){
		var socialItem = socialData.data;
		if (!socialData){
			return;
		} else {
			socialObj = Bant.bant(socialItem);
			_socialArrayArchive.unshift(socialObj);
		}
		notifyObservers(true);
	}

	function updateFeed(socialData){
		var socialObj = socialData.data;
		for (var i = 0; i < _socialArrayArchive.length; i++){
			if (_socialArrayArchive[i].id === socialObj.id){
				console.log("Updating Existing Social Item, ID=", socialObj.id);
				_socialArrayArchive[i] = Bant.bant(socialObj);
				return;
			}
		}
		console.log("Updating Social Feed, New Item");
		appendToFeed(socialData);
	}

	return {
		socialArray: function(){
			return _socialArray;
		},
		socialArrayArchive: function(){
			return _socialArrayArchive;
		},

			setSocialData: setSocialData,
			getSocialDataRequest: getSocialDataRequest,
			registerObserverCallback: registerObserverCallback,
			updateFeed: updateFeed
	};

});