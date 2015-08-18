networkModule.service('TopicService', function () {
	//TODO temp, holding Topic JSON
	var _topic;
	
	var _title;
	
	
	//Content Sections
	var _sectionLenght;
	var _sectionType;
	
	var _html;
	var _media;
	var _tweet;
	var _ogp;
	var _link;

	var liked;
	var createdAt;
	var topicSubType;
	var options;
	
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
		_title = _topic.data.content.title;
		var sections = [];
		sections = _topic.data.content.sections;
		_sectionLength = _topic.data.content.sections.length;
		_sectionType = _topic.data.content.sections[0].type;
		//TODO support for multiple sections here
		_html = _topic.data.content.sections[0].html;
		_media = _topic.data.content.sections[0].media;
		_ogp = _topic.data.content.sections[0].ogp;
		_tweet = _topic.data.content.sections[0].tweet;
		_link = _topic.data.content.sections[0].link;
		
		_liked = _topic.data.content.liked;
		_createdAt = _topic.data.content.createdAt;
		_topicSubType = _topic.data.content.topicType;
		_options = _topic.data.content.options;

		console.log("LENGTH : "+_sectionLength);
		console.log("TYPE : "+ _topic.data.content.sections[0].type);
		notifyObservers();
	}

	return {
		getTopicServiceInstance : function(){return this;},
		getTopic: function(){return _topic ;},
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
		
		setTopic:setTopicData,
		registerObserverCallback:function(callback){
			//register an observer
			console.log("topic callback registered");
			observerCallbacks.push(callback);
		}
	};

});