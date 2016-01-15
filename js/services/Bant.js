angular.module('NetworkModule')
.factory('Bant', ["DateUtilityService",
  function (DateUtilityService) {
  var EXTRACT_MEDIA_TYPE_LENGTH = 5;
  
  function extractMediaObject (_bantObject, tempMedia){
    //if Video update
    _bantObject.mediaType = tempMedia.mediaType.substring(EXTRACT_MEDIA_TYPE_LENGTH,0);
    if(_bantObject.mediaType =="video"){
      _bantObject.mediaThumbUrl = tempMedia.thumbUrl;
    }
    _bantObject.mediaUrl = tempMedia.url;
    if(tempMedia.sizes != undefined){
    _bantObject.mediaAspectFull = tempMedia.sizes["full"];
    _bantObject.mediaAspect16x9 = tempMedia.sizes["16:9"];
    _bantObject.mediaAspect1x1 = tempMedia.sizes["1:1"];
    _bantObject.mediaAspect2x1 = tempMedia.sizes["2:1"];
    }
    if(_bantObject.mediaAspect16x9 != undefined){
      _bantObject.mediaAspectRatio = 1.778;
      _bantObject.mediaAspectFeed = _bantObject.mediaAspect16x9;
    }
    else if(_bantObject.mediaAspect1x1 != undefined){
      _bantObject.mediaAspectRatio = 1;
      _bantObject.mediaAspectFeed = _bantObject.mediaAspect1x1;
    }
    else if(_bantObject.mediaAspect2x1 != undefined){
      _bantObject.mediaAspectRatio = 2;
      _bantObject.mediaAspectFeed = _bantObject.mediaAspect2x1;
    }
    if(_bantObject.mediaAspectFeed != undefined){
      _bantObject.mediaAspectFeed.x == undefined ? 0 : _bantObject.mediaAspectFeed.x;
      _bantObject.mediaAspectFeed.y == undefined ? 0 : _bantObject.mediaAspectFeed.y;
      _bantObject.mediaAspectFeed.w == undefined ? 0 : _bantObject.mediaAspectFeed.w;
      _bantObject.mediaAspectFeed.h == undefined ? 0 : _bantObject.mediaAspectFeed.h;
      if (_bantObject.mediaAspectFeed.w < _bantObject.mediaAspectFeed.h){
        _bantObject.mediaOrientation = "portrait";
      } else {
        _bantObject.mediaOrientation = "landscape";
      }
    }
    if(_bantObject.mediaAspectFull != undefined){
      _bantObject.mediaAspectFull.x == undefined ? 0 : _bantObject.mediaAspectFull.x;
      _bantObject.mediaAspectFull.y == undefined ? 0 : _bantObject.mediaAspectFull.y;
      _bantObject.mediaAspectFull.w == undefined ? 0 : _bantObject.mediaAspectFull.w;
      _bantObject.mediaAspectFull.h == undefined ? 0 : _bantObject.mediaAspectFull.h;
      if (_bantObject.mediaAspectFull.w < _bantObject.mediaAspectFull.h){
        _bantObject.mediaOrientation = "portrait";
      } else {
        _bantObject.mediaOrientation = "landscape";
      }
    }
    return _bantObject;
  }
  
  function extractEmbedObject(_bantObject, embedObject){
//    Type      string        `json:"type,omitempty"`      // Type: "link", "media" or "html".
//    Title     string        `json:"title,omitempty"`     // Title.
//    Text      string        `json:"text,omitempty"`      // Text.
//    Media     []Media       `json:"media,omitempty"`     // List of images or videos.
//    Url       string        `json:"url,omitempty"`       // URL.
//    Playable  bool          `json:"playable,omitempty"`  // Link contains playable content such as video.
//    Html      string        `json:"html,omitempty"`      // HTML code to embed.
//    Mini      bool          `json:"mini,omitempty"`      // Use mini display format.
//    Author    EmbedAuthor   `json:"author,omitempty"`    // Author info.
//    Provider  EmbedProvider `json:"provider,omitempty"`  // Provider info.
//    CreatedAt string        `json:"createdAt,omitempty"` // Publication time in RFC3339 format.
    _bantObject.embedType = embedObject.type;
    _bantObject.embedTitle = embedObject.title;
    _bantObject.embedText = embedObject.text;
    _bantObject.embedMedia = {};
    if(embedObject.type == 'media'){
      // console.log("*****!!embedObject.media",embedObject.media,embedObject);
    _bantObject.embedMedia = extractMediaObject(_bantObject.embedMedia, embedObject.media[0]);
    }
    _bantObject.embedUrl = embedObject.url;
    _bantObject.embedPlayable = embedObject.playable;
    _bantObject.embedHtml = embedObject.html;
    _bantObject.embedMetrics = embedObject.metrics;
    _bantObject.embedMini = embedObject.mini;
    _bantObject.embedAuthor = embedObject.author;
    _bantObject.embedProvider = embedObject.provider;
    _bantObject.embedCreatedAt = DateUtilityService.getTimeSince(embedObject.createdAt);
    _bantObject.embedCreatedAtFull = embedObject.createdAt;
    
    
    return _bantObject;

  }

  function Bant(data){
    var _bantObject = {};
    _bantObject.id = data.id;
    _bantObject.author = data.author;
    _bantObject.owner = data.owner;
    if(data.content.sections != undefined){
      _bantObject.sectionsLength = data.content.sections.length;

      for(j=0;j<_bantObject.sectionsLength;j++){
        _bantObject.type = data.content.sections[j].type;
        if(_bantObject.type == "html")
          _bantObject.html = data.content.sections[j].html;

        if(_bantObject.type == "media"){
          _bantObject.media = data.content.sections[j].media;
          _bantObject = extractMediaObject(_bantObject, _bantObject.media[0]);
        }
        if(_bantObject.type == "embed" || _bantObject.type == "tweet"){
          if (data.content.sections[j].embed !== null){
            // console.log("!!!!!Fiding ID:",data.content.sections[j]);
            _bantObject = extractEmbedObject(_bantObject,data.content.sections[j].embed);
            _bantObject.embed = data.content.sections[j].embed;
          }
        }
        _bantObject.tweet = data.content.sections[j].tweet;
        _bantObject.ogp = data.content.sections[j].ogp;
        _bantObject.link = data.content.sections[j].link;
      }
    }
    _bantObject.signal = data.signal;
    if(_bantObject.signal == undefined){
      var likeObject = {like:false};
      _bantObject.signal = likeObject;
    }
    else if(_bantObject.signal.like == undefined)
      _bantObject.signal.like = false;
    _bantObject.metrics = data.metrics;
    _bantObject.createdAtFull = data.createdAt;
    _bantObject.createdAt = DateUtilityService.getTimeSince(data.createdAt);
    _bantObject.pin = data.pin;
    _bantObject.commentId = data.commentId;
    _bantObject.topicId = data.topicId;
    
    return _bantObject;

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

}]);