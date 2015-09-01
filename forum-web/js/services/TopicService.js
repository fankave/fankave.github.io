networkModule.service('TopicService', function (DateUtilityService) {

	var TOPIC_BASE_URI = "/v1.0/topic/show/";
	var LIKE_TOPIC_URI = "/v1.0/topic/like/";
	var UNLIKE_TOPIC_URI = "/v1.0/topic/unlike/";
	//TODO temp, holding Topic JSON
	var _topic;
	var _id;

	var _title;
	var _author;
	var _owner;
	var _lang;


	//Content Sections
	var _sectionLenght;
	var _sectionType;

	var _html;
	var _media;
	var _tweet;
	var _ogp;
	var _link;

	var _liked;
	var _createdAt;
	var _topicSubType;
	var _options;
	var _metrics;

	var observerCallbacks = [];

	//call this when you know 'foo' has been changed
	var notifyObservers = function(){
		angular.forEach(observerCallbacks, function(callback){
			callback();
		});
	};

	function setTopicData(topicData) 
	{
		_topic = topicData;
		_id = _topic.id;
		_title = _topic.data.content.title;
		_author = _topic.data.author;
		_owner = _topic.owner;
		_lang = _topic.data.lang;
		_sectionLength = _topic.data.content.sections.length;
		_sectionType = _topic.data.content.sections[0].type;
		//TODO support for multiple sections here
		_html = _topic.data.content.sections[0].html;
		_media = _topic.data.content.sections[0].media;
		_ogp = _topic.data.content.sections[0].ogp;
		_tweet = _topic.data.content.sections[0].tweet;
		_link = _topic.data.content.sections[0].link;

		_liked = _topic.data.liked;
		_createdAt = DateUtilityService.getTimeSince(_topic.data.createdAt);
		_topicSubType = _topic.data.topicType;
		_options = _topic.data.options;
		_metrics = _topic.data.metrics;

		console.log("LENGTH : "+_sectionLength);
		console.log("TYPE : "+ _topic.data.content.sections[0].type);
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

	return {
		getTopic: function(){return _topic ;},
		getTopicId: function(){return _id ;},
		getSectionType: function(sectionNumber){ 
			//TODO check for section length
			if(sectionNumber == undefined )
				return _topic.data.content.sections[0].type;
			else
				return _topic.data.content.sections[sectionNumber].type
		},
		getTitle:function(){ return _title;},
		getHtml:function(){return _html},
		getMedia:function(){return _media},
		getTweet:function(){return _tweet},
		getOgp:function(){return _ogp},
		getLink:function(){return _link},
		getTimeCreatedAt:function(){return _createdAt},
		getLiked:function(){return _liked},
		getMetrics:function(){return _metrics},

		getLikeTopicRequest:likeTopicRequest,
		getUnlikeTopicRequest:unlikeTopicRequest,
		getTopicRequest:getTopicRequest,
		setTopic:setTopicData,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("topic callback registered");
			observerCallbacks.push(callback);
		}
	};

});