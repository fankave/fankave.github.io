angular.module('SocialModule')
.factory('VideoService', ["Bant",
	function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var _videoArray = [];
	var _offset = 0;
	var LIMIT = 10;


	function setVideoData(videoData) {
		_videoArray = [];
		var tempData = videoData.data.results;
		var len = tempData.length;

		if (!!tempData && len > 0){
			for (i = 0; i < len; i++){
				var _videoObject = Bant.bant(tempData[i]);
				if (!!_videoObject.id){
          			var isNewObject = true;
          			for(i=0;i<_videoArray.length;i++){
			            if(_videoArray[i].id == _videoObject.id){
			              isNewObject = false;
			              break;
			              }
            			}
         			 if(isNewObject)
					_videoArray.push(_videoObject);
				}
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
		var callbackLength  = observerCallbacks.length;
		for (var i = 0; i < callbackLength; i++){
      if (observerCallbacks[i] === callback){
        return;
      }
    }
		observerCallbacks.push(callback);
	}

	function getVideoDataRequest(id, offset){
		var reqOffset = _offset;
		var request = {
			"rid": "video",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+reqOffset+"&filter=video")
		};
		if (NETWORK_DEBUG)
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

}]);