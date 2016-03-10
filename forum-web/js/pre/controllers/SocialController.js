angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"])
.controller("SocialController", ["$scope","$sce","$window","$routeParams","$http","SocialService","VideoService","networkService","ChannelService","TopicService","DateUtilityService","CommentService","URIHelper",
  function ($scope,$sce,$window,$routeParams,$http,SocialService,VideoService,networkService,ChannelService,TopicService,DateUtilityService,CommentService,URIHelper){
    console.log("Social Control");

    var _this = this;
    this.initFeed = function(tab) {
      // Show Loading UI Once On Each Tab
      if (tab === 'social'){
        if (!_this.socialArray){
          $scope.$parent.loadingSocial = true;
        }
        if (!!_this.socialArray){
          updateTimestamps('social');
        }
        $scope.$parent.switchTabs('social');
        SocialService.resetSocialOffset();
        _this.loadContent('social');
      } else {
        if (!_this.videoArray){
          $scope.$parent.loadingSocial = true;
        }
        if (!!_this.videoArray){
          updateTimestamps('video');
        }
        $scope.$parent.switchTabs('video');
        VideoService.resetVideoOffset();
        _this.loadContent('video');
      }
    };

    $scope.$on('videoActive', function (event, args){
      URIHelper.tabEntered();
      $scope.$parent.activeTab = 'video';
      _this.initFeed('video');
    });

    $scope.$on('socialActive', function (event, args){
      URIHelper.tabEntered();
      $scope.$parent.activeTab = 'social';
      _this.initFeed('social');
    });

    this.loadContent = function(type, offset) {
      var channelID = ChannelService.getChannel()||TopicService.getChannelId();
      if ($scope.$parent.activeTab === 'social' || type === 'social'){
        if (NETWORK_DEBUG)
        console.log("LOADING SOCIAL: ", channelID);
        networkService.send(SocialService.getSocialDataRequest(channelID,offset));
      } else {
        if (NETWORK_DEBUG)
        console.log("LOADING VIDEO: ", channelID);
        networkService.send(VideoService.getVideoDataRequest(channelID,offset));
      }
    };

    function updateFeed(tab) {

      // Get Appropriate Content
      var feedData,
          existingLength,
          tabArray;
      if (tab === 'social'){
        feedData = SocialService.socialArray();
        _this.socialArray = _this.socialArray || [];
        existingLength = _this.socialArray.length;
        tabArray = _this.socialArray;
      } else {
        feedData = VideoService.videoArray();
        _this.videoArray = _this.videoArray || [];
        existingLength = _this.videoArray.length;
        tabArray = _this.videoArray;
      }

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

          if (tab === 'social'){
            _this.socialArray.push(tempItem);
          } else {
            _this.videoArray.push(tempItem);
          }
          if (NETWORK_DEBUG && i === len - 1){
            if (tab === 'social'){
              console.log("Social Array: ", _this.socialArray);
            } else {
              console.log("Video Array: ", _this.videoArray);
            }
          }
        }
      }
    };

    function trustSrc(src) {
      return $sce.trustAsResourceUrl(src);
    };

    function updateTimestamps(tab){
      if (tab === 'social'){
        for (var i = 0; i < _this.socialArray.length; i++){
          _this.socialArray[i].postTimestamp = DateUtilityService.getTimeSince(_this.socialArray[i].createdAtFull);
        }
      } else {
        for (var i = 0; i < _this.videoArray.length; i++){
          _this.videoArray[i].postTimestamp = DateUtilityService.getTimeSince(_this.videoArray[i].createdAtFull);
        }
      }
    };

    SocialService.registerObserverCallback(function(){updateFeed('social');});
    VideoService.registerObserverCallback(function(){updateFeed('video');});
    
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

    function scrollAfterLoad(pos) {
      setTimeout(function(){
        $(document).scrollTop(pos);
      }, 250);
    };


    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var watchContentScroll = debounce(function() {
      var currentScroll = $(document).height() - clientHeight - 50;
      if ($(document).scrollTop() > currentScroll && currentScroll > 500) {
        if ($scope.activeTab === 'social'){
          // We are Loading More Content -->
          // Base offset on Current Length of Scope Array
          _this.loadContent('social',_this.socialArray.length);
          // scrollAfterLoad(currentScroll + 90);
        }
        else if ($scope.activeTab === 'video'){
          // We are Loading More Content -->
          // Base offset on Current Length of Scope Array
          _this.loadContent('video',_this.videoArray.length);
          // scrollAfterLoad(currentScroll + 90);
        }
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

    this.shareTweetToChat = function (embed, id) {
      _this.embedShareContent = embed;
      _this.showShareDialog = true;

      var selectedHeight = $('#'+id).offset().top + 'px';
      if (GEN_DEBUG) console.log("Embed Object: ", embed, selectedHeight);
      
      // If embedded, position dialog over post being shared
      if (URIHelper.embedded()){
        setTimeout(function(){
          $('#sharePreviewContainer').css({ top: selectedHeight });
        }, 0);
      }

      // If peel, position dialog below header
      if ($scope.$parent.isPeelUser && $scope.$parent.peelShowId){
        var fullClient = document.documentElement.clientHeight - 54;
        if (GEN_DEBUG)
        console.log("fullClient Height: ", fullClient);
        setTimeout(function(){
          $('#sharePreviewContainer').css({top: '54px'}).height(fullClient);
        },25);
      }
    };

    this.submitSharedPost = function (commentData,embedData) {
      var topicID = $scope.$parent.topicID;
      if (GEN_DEBUG)
      console.log("topicID From Parent: ", topicID);
      networkService.send(CommentService.postCommentRequestForShare(topicID,commentData,embedData));
      _this.showShareDialog = false;
      $scope.$parent.switchTabs('chat');
      if (URIHelper.embedded()){
        sendScroll();
      }
    };

    function sendScroll() {
      if (GEN_DEBUG) console.log('Scroll Up to Top of Frame');
      var message = {
        type: 'scroll'
      };
      parent.postMessage(message, 'http://www.fankave.net');
    }

    if (!window.FB){
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '210324962465861',
        xfbml      : true,
        version    : 'v2.4'
      });
    };

    this.shareToFacebook = function (id,embedUrl) {
      FB.ui({
        method: 'share',
        href: embedUrl
      }, function (response){
        // Keep Track of User Shares to Facebook?
        if (GEN_DEBUG)
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


}]);

