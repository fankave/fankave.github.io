angular.module('SocialModule')
.factory('VideoService', ["Bant",
	function (Bant) {
	var LIST_SOCIAL_URI = "/v1.0/channel/social/list/";


	var observerCallbacks = [];
	var autoObserverCallbacks = [];
	var _videoArray = [];
	var _videoArrayAuto = [];
	var _offset = 0;
	var LIMIT = 10;
	var prevLength = 0;

  var _newExpert = false;

	function setVideoData(videoData) {
		_videoArray = [];
		var tempData = videoData.data.results;
		var len = !!tempData ? tempData.length : 0;

		if (!!tempData && len > 0){
      var newExpert = false;
			for (var i = 0; i < len; i++){
				var _videoObject = Bant.bant(tempData[i]);
        _videoObject.expert = tempData[i].source.type === "Twitter:Expert" ? true : false;
        if (!newExpert && _videoObject.expert) newExpert = true;
				if (!!_videoObject.id){
    			var isNewObject = true;
    			for (var j = 0; j < _videoArrayAuto.length; j++){
            if (_videoArrayAuto[j].id === _videoObject.id){
              isNewObject = false;
              break;
            }
    			}
    			_videoArray.push(_videoObject);
   			  if (isNewObject && videoData.rid === "video_auto"){
						_videoArrayAuto.push(_videoObject);
					}
				}
			}
			if(videoData.rid === "video"){
				_offset = videoData.data.nextOffset;
				notifyObservers();
			}
			else {
        if (newExpert) _newExpert = true;
				notifyObservers(true);
			}
		}
	}


	//call this when you know 'comments' has been changed
  var notifyObservers = function(autoRequest){
	    if (autoRequest){
	      angular.forEach(autoObserverCallbacks, function(callback){
	      	console.log("Notify observer in autoRequest");
	        callback();
	      });
	    } else {
			angular.forEach(observerCallbacks, function(callback){
				callback();
			});
		}
	};

  function registerObserverCallback(callback, auto){
    //register an observer
    if (auto){
      var callbackLength = autoObserverCallbacks.length;
      while (callbackLength > 0){
        callbackLength = autoObserverCallbacks.length;
        autoObserverCallbacks.pop();
      }
      autoObserverCallbacks.push(callback);
    }
    else {
      var callbackLength = observerCallbacks.length;
      while (callbackLength > 0){
        callbackLength = observerCallbacks.length;
        observerCallbacks.pop();
      }
      observerCallbacks.push(callback);
    }
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

	function getVideoDataRequestAuto(id){
		var request = {
			"rid": "video_auto",
			"timestamp": new Date().getTime(),
			"method": "GET",
			"uri": encodeURI(LIST_SOCIAL_URI+id+"?limit="+LIMIT+"&offset="+0+"&filter=video")
		};
		if (NETWORK_DEBUG)
		console.log("Video Request Auto: ", request);
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
		getVideoDataRequestAuto:getVideoDataRequestAuto,
		registerObserverCallback:registerObserverCallback,
		videoArrayAutoLength: function(){
      return _videoArrayAuto.length;
    },
    getPrevLength: function(){
      return prevLength;
    },
    setPrevLength: function(length){
      prevLength = length;
    },
    newExpertIn: function(val){
      // Getter/Setter
      // If no val provided, return current value of _newExpert
      if (val === undefined){
        return _newExpert;
      }
      // else set (reset) _newExpert (reset to false after UI updated)
      else {
        _newExpert = val;
      }
    }
	};

}]);