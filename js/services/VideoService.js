networkModule.factory('VideoService', function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var _videoArray = [];
	var _videoArrayArchive = [];
	var _offset = 0;
	var LIMIT = 20;


	function setVideoData(videoData) {
		_videoArray = [];
		tempData = videoData.data.results;
		if(tempData!= undefined && tempData.length>0){
			var len = tempData.length;
			for(i=0;i<len;i++){
				var _videoObject = {};
				_videoObject = Bant.bant(tempData[i]);
				if(_videoObject.id != undefined)
					_videoArray.push(_videoObject);
					_videoArrayArchive.push(_videoObject);
			}
			_offset = videoData.data.nextOffset;
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

	function getVideoDataRequest(id){
		return  {"rid": "video",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+_offset+"&video=true")}
	}

	return {
		videoArray: function(){
			return _videoArray;
		},
		videoArrayArchive: function(){
			return _videoArrayArchive
		},

			setVideoData:setVideoData,
			getVideoDataRequest:getVideoDataRequest,

			registerObserverCallback:registerObserverCallback
	};

});