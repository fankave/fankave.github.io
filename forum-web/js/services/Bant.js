networkModule.factory('Bant', function (DateUtilityService) {
	var EXTRACT_MEDIA_TYPE_LENGTH = 5;

	function Bant(data){
		var _commentObject = {};
		_commentObject.id = data.id;
		_commentObject.author = data.author;
		_commentObject.owner = data.owner;
		if(data.content.sections != undefined){
			_commentObject.sectionsLength = data.content.sections.length;

			for(j=0;j<_commentObject.sectionsLength;j++){
				_commentObject.type = data.content.sections[j].type;
				if(_commentObject.type == "html")
					_commentObject.html = data.content.sections[j].html;

				if(_commentObject.type == "media"){
					_commentObject.media = data.content.sections[j].media;
					var tempMedia = _commentObject.media[0];
					//if Video update
					_commentObject.mediaType = tempMedia.mediaType.substring(EXTRACT_MEDIA_TYPE_LENGTH,0);
					if(_commentObject.mediaType =="video"){
						_commentObject.mediaThumbUrl = tempMedia.thumbUrl;
					}
					_commentObject.mediaUrl = tempMedia.url;
					_commentObject.mediaAspectFull = tempMedia.sizes.full;
					_commentObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
					_commentObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
					_commentObject.mediaAspect2x1 = tempMedia.sizes["2:1"];
					if(_commentObject.mediaAspect16x9 != undefined)
						_commentObject.mediaAspectFeed = _commentObject.mediaAspect16x9;
					else if(_commentObject.mediaAspect1x1 != undefined)
							_commentObject.mediaAspectFeed = _commentObject.mediaAspect1x1;
					else if(_commentObject.mediaAspect2x1 != undefined)
								_commentObject.mediaAspectFeed = _commentObject.mediaAspect2x1;
					if(_commentObject.mediaAspectFeed != undefined){
						_commentObject.mediaAspectFeed.x == undefined ? 0 : _commentObject.mediaAspectFeed.x;
						_commentObject.mediaAspectFeed.y == undefined ? 0 : _commentObject.mediaAspectFeed.y;
						_commentObject.mediaAspectFeed.w == undefined ? 0 : _commentObject.mediaAspectFeed.w;
						_commentObject.mediaAspectFeed.h == undefined ? 0 : _commentObject.mediaAspectFeed.h;
					}
					if(_commentObject.mediaAspectFull != undefined){
						_commentObject.mediaAspectFull.x == undefined ? 0 : _commentObject.mediaAspectFull.x;
						_commentObject.mediaAspectFull.y == undefined ? 0 : _commentObject.mediaAspectFull.y;
						_commentObject.mediaAspectFull.w == undefined ? 0 : _commentObject.mediaAspectFull.w;
						_commentObject.mediaAspectFull.h == undefined ? 0 : _commentObject.mediaAspectFull.h;
					}


				}
				_commentObject.tweet = data.content.sections[j].tweet;
				_commentObject.ogp = data.content.sections[j].ogp;
				_commentObject.link = data.content.sections[j].link;
			}
		}
		_commentObject.signal = data.signal;
		if(_commentObject.signal == undefined){
			var likeObject = {like:false};
			_commentObject.signal = likeObject;
		}
		else if(_commentObject.signal.like == undefined)
			_commentObject.signal.like = false;
		_commentObject.metrics = data.metrics;
		_commentObject.createdAt = DateUtilityService.getTimeSince(data.createdAt);
		_commentObject.pin = data.pin;
		_commentObject.commentId = data.commentId;
		
		return _commentObject;

	}
	
	function updateBantLiked(data, liked){
		//if same state, dont do anything
		if(data.signal.like == liked){
			if(NETWORK_DEBUG)
				console.log("no need to change   data.signal.like:"+ data.signal.like);
			return data;
		}
		if(liked){
			//update like status
			data.signal.like = true;
			//increment like count.
			(data.metrics.likes == undefined) ? data.metrics.likes = 1: data.metrics.likes = (data.metrics.likes + 1);
		}
		else{
			//update like status
			data.signal.like = false;
			//decrement like count.
			if(data.metrics.likes != undefined) 
			data.metrics.likes = (data.metrics.likes - 1);
		}
		if(NETWORK_DEBUG)
			console.log("data.metrics.likes :"+ data.metrics.likes);
		return data;
	}

	return {
		bant: Bant,
		updateBantLiked : updateBantLiked
	};

});