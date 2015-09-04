networkModule.service('TopicService', function (DateUtilityService,Bant) {

	var TOPIC_BASE_URI = "/v1.0/topic/show/";
	var LIKE_TOPIC_URI = "/v1.0/topic/like/";
	var UNLIKE_TOPIC_URI = "/v1.0/topic/unlike/";
	//TODO temp, holding Topic JSON
	var _topic;
	var _id;
	var _title;
	var _game;
	var _status;
	var _score;
	var observerCallbacks = [];	

	function setTopicData(topicData) 
	{

		_id = topicData.id;
		_title = topicData.data.content.title;
		_game = topicData.data.game;
		_score = _game.score;
//		Future game: live == false AND final == false.
//		Live game: live == true.
//		Past game: final == true.
		if(_score.live == undefined && _score.final == undefined)
			_status = "future";
		else if(_score.live == true)
			_status = "live";
		else if(_score.final == true)
			_status = "final";
		console.log("GAME Status  :"+ _status );

		_topic = Bant.bant(topicData.data);
		notifyObservers();
	}
	
	function updateTopicData(topicData){
		setScoreData(topicData.data);
	}
	
	function setScoreData(scoreData) 
	{
//TODO: Check API to complete this.
		_score = scoreData.score;
//		Future game: live == false AND final == false.
//		Live game: live == true.
//		Past game: final == true.
		if(_score.live == undefined && _score.final == undefined)
			_status = "future";
		else if(_score.live == true)
			_status = "live";
		else if(_score.final == true)
			_status = "final";
		console.log("GAME Status  :"+ _status );
		notifyObservers();
	}

	function getTopicRequest(topicId){
		var uri = TOPIC_BASE_URI+topicId;

		return  varTopicParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(uri)};
	}

	function likeTopicRequest(){
		return  varLikeParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(LIKE_TOPIC_URI + _id)};


	}

	function unlikeTopicRequest(){
		return  varLikeParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(UNLIKE_TOPIC_URI + _id)};


	}
	
	//call this when you know 'data' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

	return {
		getTopic: function(){return _topic ;},
		getTopicId: function(){return _id ;},
		getGame: function(){return _game;},
		getTeamA: function(){return _game.teams[0];},
		getTeamB: function(){return _game.teams[1];},
		getScore: function(){return _score;},
		getGameStatus: function() {return _status;},
//		getSectionType: function(sectionNumber){ 
//		//TODO check for section length
//		if(sectionNumber == undefined )
//		return _topic.data.content.sections[0].type;
//		else
//		return _topic.data.content.sections[sectionNumber].type
//		},
		getTitle:function(){ return _title;},
		getHtml:function(){return _topic.html},
//		getMedia:function(){return _media},
//		getTweet:function(){return _tweet},
//		getOgp:function(){return _ogp},
//		getLink:function(){return _link},
		getTimeCreatedAt:function(){return _topic.createdAt},
		getLiked:function(){return _topic.liked},
		getMetrics:function(){return _topic.metrics},

		getLikeTopicRequest:likeTopicRequest,
		getUnlikeTopicRequest:unlikeTopicRequest,
		getTopicRequest:getTopicRequest,
		setTopic:setTopicData,
		updateTopic:updateTopicData,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("topic callback registered");
			observerCallbacks.push(callback);
		}
	};

});