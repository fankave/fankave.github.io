angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"])
.controller("SocialController", ["$state","$stateParams","$sce","$window","$http","SocialService","networkService","ChannelService","TopicService","DateUtilityService","CommentService","URIHelper","UserInfoService",
  function ($state,$stateParams,$sce,$window,$http,SocialService,networkService,ChannelService,TopicService,DateUtilityService,CommentService,URIHelper,UserInfoService){

    var _this = this;
    if (!this.socialArray){
      this.loading = true;
    }
    if (!!this.socialArray){
      updateTimestamps();
    }
    SocialService.resetSocialOffset();
    SocialService.registerObserverCallback(function(){updateFeed();});


    this.loadContent = function(offset) {
      var channelID = $stateParams.channel || ChannelService.getChannel()||TopicService.getChannelId();
      console.log("LOADING SOCIAL: ", channelID, TopicService.getChannelId());
      networkService.send(SocialService.getSocialDataRequest(channelID,offset));
    };
    // setTimeout(function(){_this.loadContent();},1000);
    TopicService.registerObserverCallback(_this.loadContent);

    function updateFeed() {

      // Get Appropriate Content
      var feedData,
          existingLength,
          tabArray;
      feedData = SocialService.socialArray();
      _this.socialArray = _this.socialArray || [];
      existingLength = _this.socialArray.length;
      tabArray = _this.socialArray;

      var len = feedData.length;
      if (!!feedData && len > 0){
        // console.log("Feed Data: ", feedData, " Type: ", tab);

        for (var i = 0; i < len; i++){
          var tempItem = feedData[i];

          // Check to See if Item Already Exists in Scope Array
          var itemExists = false;
          for (var j = 0; j < existingLength; j++){
            if (tempItem.id === tabArray[j].id){
              itemExists = true;
            }
          }
          // If Exists, Skip To Next Item
          if (itemExists){
            continue;
          }
          
          tempItem.postAuthorName = feedData[i].embedAuthor.name;
          tempItem.postAuthorAlias = feedData[i].embedAuthor.alias;
          tempItem.postAuthorPhoto = feedData[i].embedAuthor.photo;
          tempItem.tweetId = feedData[i].tweet.id;
          
          tempItem.postTimestamp = feedData[i].createdAt;
          tempItem.providerName = feedData[i].embedProvider.name;
          tempItem.html = feedData[i].embedText;
          tempItem.retweetCount = feedData[i].tweet.metrics.retweetCount;
          tempItem.likeCount = feedData[i].tweet.metrics.likeCount;
          tempItem.replyCount = feedData[i].tweet.metrics.replyCount;

          // Embed Object for Sharing
          tempItem.embed = feedData[i].embed;
          tempItem.embed.embedCreatedAt = feedData[i].embedCreatedAt;
          // tempItem.embed.embedCreatedAtFull = feedData[i].embedCreatedAtFull;

          if (tempItem.providerName === "Twitter"){
            tempItem.providerLogo = "img/twitterLogo@2x.png";
            tempItem.embed.provider.logo = "img/twitterLogo@2x.png";
          } else {
            tempItem.providerLogo = feedData[i].embedProvider.logo;
            tempItem.embed.provider.logo = feedData[i].embedProvider.logo;
          }

          tempItem.embedType = feedData[i].embedType;
          tempItem.embedUrl = feedData[i].embedUrl;
          if (feedData[i].embedType === "link" && feedData[i].embedPlayable === true){
            tempItem.embedHtml = feedData[i].embedHtml;
            tempItem.embedPlayable = true;
          }
          if (feedData[i].embedType === "media" || feedData[i].embedType === "link"){
            tempItem.mediaType = feedData[i].embedMedia.mediaType;
            tempItem.mediaUrl = feedData[i].embedMedia.mediaUrl;
            tempItem.mediaThumbUrl = feedData[i].embedMedia.mediaThumbUrl;
            tempItem.mediaAspectRatio = feedData[i].embedMedia.mediaAspectRatio;
            tempItem.mediaAspectFeed = feedData[i].embedMedia.mediaAspectFeed;
            tempItem.mediaAspectFull = feedData[i].embedMedia.mediaAspectFull;
            tempItem.mediaOrientation = feedData[i].embedMedia.mediaOrientation;
          }

          _this.socialArray.push(tempItem);
          if (NETWORK_DEBUG && i === len - 1){
            _this.loadingSocial = false;
            console.log("Social Array: ", _this.socialArray);
          }
        }
      }
    };

    function trustSrc(src) {
      return $sce.trustAsResourceUrl(src);
    };

    function updateTimestamps(){
      for (var i = 0; i < _this.socialArray.length; i++){
        _this.socialArray[i].postTimestamp = DateUtilityService.getTimeSince(_this.socialArray[i].createdAtFull);
      }
    };

    
    // Limit Rate that Function Can be Called
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var watchContentScroll = debounce(function() {
      var currentScroll = $(document).height() - clientHeight - 50;
      if ($(document).scrollTop() > currentScroll && currentScroll > 500) {
        // We are Loading More Content -->
        // Base offset on Current Length of Scope Array
        _this.loadContent(_this.socialArray.length);
      }
    }, 100);

    $(document).on('scroll', watchContentScroll);

    this.retweetPost = function(id) {
      $http({
        method: 'GET',
        url: 'https://twitter.com/intent/retweet?tweet_id=' + id,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    };

    this.shareTweetToChat = function (embed) {
      _this.embedShareContent = embed;
      _this.showShareDialog = true;
      console.log("Embed Object: ", embed);
      if (URIHelper.isPeelUser()){
        var fullClient = document.documentElement.clientHeight - 54;
        console.log("fullClient Height: ", fullClient);
        setTimeout(function(){
          $('#sharePreviewContainer').css({top: '54px'}).height(fullClient);
        },25);
      }
    };

    this.submitSharedPost = function (commentData,embedData) {
      var topicID = $stateParams.topicID;
      console.log("topicID From Parent: ", topicID);
      networkService.send(CommentService.postCommentRequestForShare(topicID,commentData,embedData));
      _this.showShareDialog = false;
      $state.go('topic.chat', $stateParams);
    };

    console.log("WAY BEFOREEEE");
    if (!window.FB){
      (function(d, s, id) {
        console.log('loading FB SDK...');
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    window.fbAsyncInit = function() {
      console.log("BEFOREEEE");
      FB.init({
        appId      : '210324962465861',
        xfbml      : true,
        version    : 'v2.4'
      });
      console.log("AFTERRRRR");
    };

    this.shareToFacebook = function (id,embedUrl) {
      FB.ui({
        method: 'share',
        href: embedUrl
      }, function (response){
        // Keep Track of User Shares to Facebook?
        console.log("FB Response Post-Share: ", response);
      });
    };

    this.exitShare = function () {
      _this.showShareDialog = false;
    };

    this.highlightPost = function(){
      $('#postShareContent').css('color','rgb(22,189,231)');
    };

    this.unhighlightPost = function(){
      $('#postShareContent').css('color','rgb(211,214,215)');
    };
    
    this.doneLoading = function() {
      _this.loading = false;
    };

    this.secureLink = function(url, id) {
      if (UserInfoService.isGuestUser()){
        return "";
      } else {
        return url + id;
      }
    };

}]);

