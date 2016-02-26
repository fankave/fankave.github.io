angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"])
.controller("SocialController", ["$scope","$sce","$window","$location","$routeParams","$q","$http","SocialService","VideoService","networkService","ChannelService","TopicService","DateUtilityService","CommentService","URIHelper",
  function ($scope,$sce,$window,$location,$routeParams,$q,$http,SocialService,VideoService,networkService,ChannelService,TopicService,DateUtilityService,CommentService,URIHelper){
    console.log("Social Control");

    var _this = this;
    // this.newVideosAvailable = true;
    // this.newSocialAvailable = true;
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
      console.log("Video Broadcast Received");
      URIHelper.tabEntered();
      _this.initFeed('video');
    });

    $scope.$on('socialActive', function (event, args){
      console.log("Social Broadcast Received");
      URIHelper.tabEntered();
      _this.initFeed('social');
    });

    this.loadContent = function(type, offset) {
      var channelID = ChannelService.getChannel()||TopicService.getChannelId();
      if ($scope.$parent.activeTab === 'social' || type === 'social'){
        console.log("LOADING SOCIAL: ", channelID);
        networkService.send(SocialService.getSocialDataRequest(channelID,offset));
        return true;
      } else {
        console.log("LOADING VIDEO: ", channelID);
        networkService.send(VideoService.getVideoDataRequest(channelID,offset));
        return true;
      }
    }

    var refreshContent = function() {
      var tab = $scope.$parent.activeTab;
      console.log("Refreshing: ", tab);
      var deferred = $q.defer();
      if (tab === 'chat'){
        deferred.reject();
      }
      if (tab === 'video'){
        $('#moreContentBar').css('display','none');
        _this.videoArray = [];
        $scope.$apply();
        VideoService.resetVideoOffset();
        _this.loadContent('video',0)
        deferred.resolve();
      }
      else if (tab === 'social'){
        $('#moreContentBar').css('display','none');
        _this.socialArray = [];
        $scope.$apply();
        SocialService.resetSocialOffset();
        _this.loadContent('social',0)
        deferred.resolve();
      }
      return deferred.promise;
    }

    $window.onload = function(){
      console.log("WebPTR Loading");
      WebPullToRefresh.init({
        loadingFunction: refreshContent,
        contentEl: 'fankave-page',
        ptrEl: 'ptrZone',
        distanceToRefresh: 70,
        resistance: 2.0
      });
      console.log("WebPTR Loaded");
    };

    var videoStaging = [];
    var socialStaging = [];

    function flattenProperties(tempItem, feedData) {
      
      tempItem.postAuthorName = feedData.embedAuthor.name;
      tempItem.postAuthorAlias = feedData.embedAuthor.alias;
      tempItem.postAuthorPhoto = feedData.embedAuthor.photo;
      tempItem.tweetId = feedData.tweet.id;
      
      tempItem.postTimestamp = feedData.createdAt;
      tempItem.providerName = feedData.embedProvider.name;
      tempItem.html = feedData.embedText;
      tempItem.retweetCount = feedData.tweet.metrics.retweetCount;
      tempItem.likeCount = feedData.tweet.metrics.likeCount;
      tempItem.replyCount = feedData.tweet.metrics.replyCount;

      // Embed Object for Sharing
      tempItem.embed = feedData.embed;
      tempItem.embed.embedCreatedAt = feedData.embedCreatedAt;
      // tempItem.embed.embedCreatedAtFull = feedData.embedCreatedAtFull;

      if (tempItem.providerName === "Twitter"){
        tempItem.providerLogo = "img/twitterLogo@2x.png";
        tempItem.embed.provider.logo = "img/twitterLogo@2x.png";
      } else {
        tempItem.providerLogo = feedData.embedProvider.logo;
        tempItem.embed.provider.logo = feedData.embedProvider.logo;
      }

      tempItem.embedType = feedData.embedType;
      tempItem.embedUrl = feedData.embedUrl;
      if (feedData.embedType === "link" && feedData.embedPlayable === true){
        tempItem.embedHtml = feedData.embedHtml;
        tempItem.embedPlayable = true;
      }
      if (feedData.embedType === "media" || feedData.embedType === "link"){
        tempItem.mediaType = feedData.embedMedia.mediaType;
        tempItem.mediaUrl = feedData.embedMedia.mediaUrl;
        tempItem.mediaThumbUrl = feedData.embedMedia.mediaThumbUrl;
        tempItem.mediaAspectRatio = feedData.embedMedia.mediaAspectRatio;
        tempItem.mediaAspectFeed = feedData.embedMedia.mediaAspectFeed;
        tempItem.mediaAspectFull = feedData.embedMedia.mediaAspectFull;
        tempItem.mediaOrientation = feedData.embedMedia.mediaOrientation;
      }
      return tempItem;
    }

    function updateFeed(tab, polling) {

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

          var formattedItem = flattenProperties(tempItem, feedData[i]);

          if (polling){
            if (tab === 'social'){
              socialStaging.push(formattedItem);
            } else {
              videoStaging.push(formattedItem);
            }
          } else {
            if (tab === 'social'){
              _this.socialArray.push(formattedItem);
            } else {
              _this.videoArray.push(formattedItem);
            }
          }
        }
        if (NETWORK_DEBUG){
          if (tab === 'social'){
            console.log("Social Array: ", _this.socialArray);
          } else {
            console.log("Video Array: ", _this.videoArray);
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
      var currentScroll = $(document).height() - clientHeight - 150;
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
      console.log("Embed Object: ", embed, selectedHeight);
      if (URIHelper.embedded()){
        setTimeout(function(){
          $('#sharePreviewContainer').css({ top: selectedHeight });
        }, 0);
      }
      if ($scope.$parent.isPeelUser){
        var fullClient = document.documentElement.clientHeight - 54;
        console.log("fullClient Height: ", fullClient);
        setTimeout(function(){
          $('#sharePreviewContainer').css({top: '54px'}).height(fullClient);
        },25);
      }
    };

    this.submitSharedPost = function (commentData,embedData) {
      var topicID = $scope.$parent.topicID;
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


}]);

