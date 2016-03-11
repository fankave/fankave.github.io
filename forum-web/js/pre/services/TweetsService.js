networkModule.service('TopicService', function (DateUtilityService,Bant,FDSUtility) {

	var TOPIC_BASE_URI = "/v1.0/topic/social/list/";
	//\(self.topicID)?limit=\(rLimit)&offset=\(self.offset);
	var _tweets [] ;

	function setTweetsData(tweetData) 
	{
		tempTweetsData = tweetData.data.results;
		if(tempTweetsData!= undefined && tempTweetsData.length>0){
			var len = tempTweetsData.length;
			for(i=0;i<len;i++){
				var _tweetObject = {};
				_tweetObject = Bant.bant(tempTweetsData[i]);
				if(_tweetObject.id != undefined)
					_tweets.push(_tweetObject);
				// console.log("Comments in set comment Service type:"+_tweetObject.type + "  " +_tweetObject.html );
			}
			notifyObservers();
	}
		

	function getTweetsRequest(id){
		return  varLikeParams = {"rid": "tweets",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(TOPIC_BASE_URI + id)};
	}

	function getAutoTweetsRequest(id){
		return  varLikeParams = {"rid": "tweets_auto",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(TOPIC_BASE_URI + id)};
	}

	//call this when you know 'data' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};
	
	function registerObserverCallback(callback){
		//register an observer
		// console.log("topic callback registered");
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}

	return {
		getTweetsRequest:getTweetsRequest,
		getAutoTweetsRequest:getAutoTweetsRequest,
		setTweetsData:setTweetsData

	};

});