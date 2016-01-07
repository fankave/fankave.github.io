socialModule.factory('VideoService', function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var _videoArray = [];
	var _offset = 0;
	var LIMIT = 10;


	function setVideoData(videoData) {
		_videoArray = [];
		var tempData = videoData.data.results;
		var len = tempData.length;
		debugger;

		if (!!tempData && len > 0){
			for (i = 0; i < len; i++){
				debugger;
				var _videoObject = Bant.bant(tempData[i]);
				if (!!_videoObject.id)
					_videoArray.push(_videoObject);
			}
			_offset = videoData.data.nextOffset;
			debugger;
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
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}

	function getVideoDataRequest(id, offset){
		var reqOffset = offset || _offset;
		var request = {
			"rid": "video",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+reqOffset+"&filter=video")
		};
		console.log("Video Request: ", request);
		return request;
	}

	return {
		videoArray: function(){
			return _videoArray;
		},
		resetVideoOffset: function(){
      _offset = 0;
    },
		setVideoData:setVideoData,
		getVideoDataRequest:getVideoDataRequest,
		registerObserverCallback:registerObserverCallback
	};

});