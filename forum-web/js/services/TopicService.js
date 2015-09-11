networkModule.service('TopicService', function (DateUtilityService,Bant) {

	var TOPIC_BASE_URI = "/v1.0/topic/show/";
	var LIKE_TOPIC_URI = "/v1.0/topic/like/";
	var UNLIKE_TOPIC_URI = "/v1.0/topic/unlike/";
	var WATCH_TOPIC_URI = "/v1.0/topic/watch/";
	//TODO temp, holding Topic JSON
	var _topic;
	var _id;
	var _title;
	var _game;
	var _status;
	var _score;
	var _gameStats;
	var _links;
	var observerCallbacks = [];	

	function setTopicData(topicData) 
	{

		_id = topicData.id;
		if(topicData.data != undefined){
			if(topicData.data.content != undefined )
				_title = topicData.data.content.title;

			_game = topicData.data.game;
			if(_game != undefined){
				_score = _game.score;
//				Future game: live == false AND final == false.
//				Live game: live == true.
//				Past game: final == true.
				if(_score.live == undefined && _score.final == undefined)
					_status = "future";
				else if(_score.live == true)
					_status = "live";
				else if(_score.final == true)
					_status = "past";
				console.log("GAME Status  :"+ _status );

				if(_status == "live"){
					console.log("_gameStats" + _score.status);
					_gameStats = _score.status;
				}
			}

			_topic = Bant.bant(topicData.data);
			notifyObservers();
		}
	}

	function updateTopicData(scoreData){
		setScoreData(scoreData);
	}

	function setScoreData(scoreData) 
	{
//		TODO: Check API to complete this.
		_score = scoreData;
		if(_score != undefined){
			if(_score.live == true){
				_status = "live";
			}
			_gameStats = _score.status;
			console.log("Game Points :" + _score.points[0] + " : : "+_score.points[1] );
			console.log("Game Period :" + _gameStats[0]);
			console.log("Game Period :" + _gameStats[1]);
			notifyObservers();
		}
	}

	function getTopicRequest(topicId){
		var uri = TOPIC_BASE_URI+topicId;

		return  varTopicParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "GET",
				"uri": encodeURI(uri)};
	}
	function getFollowChannelRequest(channelID){
		var uri = "/v1.0/channel/follow/" + channelID;

		return  varTopicParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "POST",
				"uri": encodeURI(uri)};
	}
	
	function watchTopicRequest(topicId){
		var uri = WATCH_TOPIC_URI+topicId;

		return  varTopicParams = {"rid": "topic",
				"timestamp": new Date().getTime(),
				"method": "POST",
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
		getTeamA: function(){if(_game != undefined) return _game.teams[0];},
		getTeamB: function(){if(_game != undefined) return _game.teams[1];},
		getLinks: function(){if(_game != undefined) return _game.links;},
		getScore: function(){if(_score != undefined) return _score;},
		getGameStatus: function() {return _status;},
		getGamePeriod: function() {return _gameStats[0];},
		getGameClock: function() {return _gameStats[1];},
//		getSectionType: function(sectionNumber){ 
//		//TODO check for section length
//		if(sectionNumber == undefined )
//		return _topic.data.content.sections[0].type;
//		else
//		return _topic.data.content.sections[sectionNumber].type
//		},
		getChannelId:function(){ return _topic.owner.id;},
		getTitle:function(){ return _title;},
		getHtml:function(){return _topic.html},
//		getMedia:function(){return _media},
//		getTweet:function(){return _tweet},
//		getOgp:function(){return _ogp},
//		getLink:function(){return _link},
		getTimeCreatedAt:function(){return _topic.createdAt},
		getLiked:function(){return _topic.liked},
		getMetrics:function(){return _topic.metrics},
		
		watchTopicRequest:watchTopicRequest,
		getLikeTopicRequest:likeTopicRequest,
		getUnlikeTopicRequest:unlikeTopicRequest,
		getFollowChannelRequest:getFollowChannelRequest,
		getTopicRequest:getTopicRequest,
		setTopicId: function(topicId){_id = topicId ;},
		setTopic:setTopicData,
		updateTopic:updateTopicData,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("topic callback registered");
			observerCallbacks.push(callback);
		}
	};

});