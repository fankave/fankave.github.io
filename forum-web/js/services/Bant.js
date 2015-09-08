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


				}
				_commentObject.tweet = data.content.sections[j].tweet;
				_commentObject.ogp = data.content.sections[j].ogp;
				_commentObject.link = data.content.sections[j].link;
			}
		}
		_commentObject.metrics = data.metrics;
		_commentObject.createdAt = DateUtilityService.getTimeSince(data.createdAt);

		return _commentObject;

	}

	return {
		bant: Bant
	};

});