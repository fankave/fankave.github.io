networkModule.factory('Bant', function (DateUtilityService) {
	var type;
	var id;
	var author;
	var owner;
	var lang;
	var content;
	var media;
	var hidden;
	var rank;
	var liked;
	var createdAt;
	
	function Bant(tempCommentsData){
		var _commentObject = {};
		_commentObject.id = tempCommentsData.id;
		_commentObject.author = tempCommentsData.author;
		_commentObject.owner = tempCommentsData.owner;
		_commentObject.sectionsLength = tempCommentsData.content.sections.length;
		for(j=0;j<_commentObject.sectionsLength;j++){
			_commentObject.type = tempCommentsData.content.sections[j].type;
			if(_commentObject.type == "html")
			_commentObject.html = tempCommentsData.content.sections[j].html;
			
			if(_commentObject.type == "media"){
				_commentObject.media = tempCommentsData.content.sections[j].media;
				var tempMedia = _commentObject.media[0];
				//if Video update
				_commentObject.mediaType = tempMedia.mediaType.substring(5,0);
				if(_commentObject.mediaType =="video"){
					_commentObject.mediaThumbUrl = tempMedia.thumbUrl;
				}
				_commentObject.mediaUrl = tempMedia.url;
				_commentObject.mediaAspectFull = tempMedia.sizes.full;
				_commentObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
				_commentObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
				_commentObject.mediaAspect2x1 = tempMedia.sizes["2:1"];


			}
			_commentObject.tweet = tempCommentsData.content.sections[j].tweet;
			_commentObject.ogp = tempCommentsData.content.sections[j].ogp;
			_commentObject.link = tempCommentsData.content.sections[j].link;
		}
		_commentObject.metrics = tempCommentsData.metrics;
		_commentObject.createdAt = DateUtilityService.getTimeSince(tempCommentsData.createdAt);
		
		return _commentObject;
		
	}

    return {
        bant: Bant
    };
   
});