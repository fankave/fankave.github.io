networkModule.service('TopicService', function () {
	var _topic;
	var _title;
	var _sections;
	 var observerCallbacks = [];
	    //register an observer
	    

	    //call this when you know 'foo' has been changed
	    var notifyObservers = function(){
	      angular.forEach(observerCallbacks, function(callback){
	        callback();
	      });
	    };
	
    return {
        topic: function(){return _topic ;},
        setTopic:function(topicData) {
        	
        	_topic = topicData;
        	notifyObservers();
        	
    	},
    	registerObserverCallback:function(callback){
        	console.log("callback registered");
            observerCallbacks.push(callback);
          }
    };
   
});