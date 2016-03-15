angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"])
.controller("SocialController", ["$scope","$sce","$window","$location","$routeParams","$q","$interval","$http","SocialService","VideoService","networkService","ChannelService","TopicService","DateUtilityService","CommentService","URIHelper","UserAgentService",
  function ($scope,$sce,$window,$location,$routeParams,$q,$interval,$http,SocialService,VideoService,networkService,ChannelService,TopicService,DateUtilityService,CommentService,URIHelper,UserAgentService){
    console.log("Social Control");
    initAutoRefresh();

    var _this = this;
    this.initFeed = function(tab) {
      // Show Loading UI Once On Each Tab
      if (tab === 'social'){
        if (_this.newSocialAvailable) _this.newSocialAvailable = false;
        if (!_this.socialArray){
          $scope.$parent.loadingSocial = true;
          _this.loadContent('social');
        } else {
          updateFeed('social');
        }
        updateTimestamps('social');
        $scope.$parent.switchTabs('social');
        // initPTR();
        if (_this.socialFilter === undefined && TopicService.getGameStatus() === 'live'){
          _this.socialFilter = true;
        } else if (_this.socialFilter === undefined){
          _this.socialFilter = false;
        }
      } else {
        if (_this.newVideoAvailable) _this.newVideoAvailable = false;
        if (!_this.videoArray){
          $scope.$parent.loadingSocial = true;
          _this.loadContent('video');
        } else {
          updateFeed('video');
        }
        updateTimestamps('video');
        $scope.$parent.switchTabs('video');
        // initPTR();
        if (_this.videoFilter === undefined && TopicService.getGameStatus() === 'live'){
          _this.videoFilter = true;
        } else if (_this.videoFilter === undefined){
          _this.videoFilter = false;
        }
      }
    };

    $scope.$on('videoActive', function (event, args){
      console.log("Video Broadcast Received");
      $scope.$parent.activeTab = 'video';
      URIHelper.tabEntered();
      _this.initFeed('video');
    });

    $scope.$on('socialActive', function (event, args){
      console.log("Social Broadcast Received");
      $scope.$parent.activeTab = 'social';
      URIHelper.tabEntered();
      _this.initFeed('social');
    });

    // Auto Refresh
    function initAutoRefresh () {
      registerAutoCallbacks();
      if (TopicService.currentTimer()){
        $interval.cancel(TopicService.currentTimer(false));
      }
      var timer = $interval(function(){
        if (GEN_DEBUG) console.log("$AUTO$ START INTERVAL");
        networkService.send(SocialService.getSocialDataRequestAuto(TopicService.getChannelId()));
        if (!URIHelper.isTechMUser() && !URIHelper.isMWCUser()){
          networkService.send(VideoService.getVideoDataRequestAuto(TopicService.getChannelId()));
        }
      }, 15000);
      TopicService.currentTimer(timer);
    }

    function registerAutoCallbacks () {
      SocialService.registerObserverCallback(function(){updateJewels('social')}, true);
      if (!URIHelper.isTechMUser() && !URIHelper.isMWCUser()){
        VideoService.registerObserverCallback(function(){updateJewels('video')}, true);
      }
    }

    function updateJewels (tab) {
      if (tab === 'social'){
        var length = SocialService.socialArrayAutoLength();
        var prevLength = SocialService.getPrevLength();
        if (GEN_DEBUG) console.log("$AUTO$ UPDATE JEWEL[S] - ", {prevLength:prevLength,newLength:length});
        if (length > prevLength){
          if (GEN_DEBUG) console.log("$AUTO$ PULSE SOCIAL JEWEL");
          if ($scope.$parent.activeTab === 'social'){
            // If user is on tab during first interval, don't show indicator
            if (prevLength !== 0){
              if ((_this.socialFilter && SocialService.newExpertIn()) || !_this.socialFilter){
                _this.newSocialAvailable = true;
                SocialService.newExpertIn(false);
              }
            }
          } else {
            pulseJewel('social');
          }
          SocialService.setPrevLength(length);
        }
      }
      if (tab === 'video'){
        var length = VideoService.videoArrayAutoLength();
        var prevLength = VideoService.getPrevLength();
        if (GEN_DEBUG) console.log("$AUTO$ UPDATE JEWEL[V] - ", {prevLength:prevLength,newLength:length});
        if (length > prevLength){
          if (GEN_DEBUG) console.log("$AUTO$ PULSE VIDEO JEWEL");
          if ($scope.$parent.activeTab === 'video'){
            // If user is on tab during first interval, don't show indicator
            if (prevLength !== 0){
              if ((_this.videoFilter && VideoService.newExpertIn()) || !_this.videoFilter){
                _this.newVideoAvailable = true;
                VideoService.newExpertIn(false);
              }
            }
          } else {
            pulseJewel('video');
          }
          VideoService.setPrevLength(length);
        }
      }
    }

    function pulseJewel (tab) {
      var el;
      if (tab === 'social'){
        el = document.getElementById('socialJewel');
      }
      if (tab === 'video'){
        el = document.getElementById('videoJewel');
      }

      // Trick to retrigger animation
      el.style.visibility = 'visible';
      el.classList.remove('pulse');
      el.offsetWidth = el.offsetWidth;
      el.classList.add('pulse');
      setTimeout(function(){el.style.visibility = 'hidden';}, 2500);
    }

    this.loadContent = function(type, offset) {
      var channelID = ChannelService.getChannel()||TopicService.getChannelId();
      if (type === 'social'){
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
        _this.loadContent('video', 0);
        deferred.resolve();
      }
      else if (tab === 'social'){
        $('#moreContentBar').css('display','none');
        _this.socialArray = [];
        $scope.$apply();
        SocialService.resetSocialOffset();
        _this.loadContent('social', 0);
        deferred.resolve();
      }
      return deferred.promise;
    }

    function initPTR(){
      var pullEl;
      if (UserAgentService.getMobileUserAgent() === 'iOS'){
        pullEl = 'iosPTR';
      } else {
        pullEl = 'fankave-page';
      }
      console.log("WebPTR Loading");
      document.getElementById('ptrZone').style.visibility = 'visible';
      WebPullToRefresh.init({
        loadingFunction: refreshContent,
        contentEl: pullEl,
        ptrEl: 'ptrZone',
        distanceToRefresh: 70,
        resistance: 2.0
      });
      console.log("WebPTR Loaded");
    };

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
          // console.log("Social Array Item " + i + ": ", tempItem, len);

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

          if (tab === 'social'){
            _this.socialArray.push(formattedItem);
          } else {
            _this.videoArray.push(formattedItem);
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
    }

    function trustSrc(src) {
      return $sce.trustAsResourceUrl(src);
    };

    function updateTimestamps(tab){
      if (tab === 'social'){
        if (!_this.socialArray) return;
        for (var i = 0; i < _this.socialArray.length; i++){
          _this.socialArray[i].postTimestamp = DateUtilityService.getTimeSince(_this.socialArray[i].createdAtFull);
        }
      } else {
        if (!_this.videoArray) return;
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

    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var watchContentScroll = debounce(function() {
      var currentScroll = $(document).height() - clientHeight - 150;
      if ($(document).scrollTop() > currentScroll) {
        if ($scope.activeTab === 'social' && !_this.preventLoad){
          _this.loadContent('social');
        }
        else if ($scope.activeTab === 'video' && !_this.preventLoad){
          _this.loadContent('video');
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
      if ($scope.$parent.isPeelUser && $scope.$parent.peelShowId){
        var fullClient = document.documentElement.clientHeight - 54;
        console.log("fullClient Height: ", fullClient);
        setTimeout(function(){
          $('#sharePreviewContainer').css({top: '54px'}).height(fullClient);
        },25);
      }
      setTimeout(function(){$('#shareEmbedComment').focus();},0);
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

    this.showNewSocial = function(){
      _this.newSocialAvailable = false;
      updateFeed('social');
      var body = $('body');
      body.stop().animate({scrollTop:0}, '500', 'swing');
    }

    this.showNewVideo = function(){
      _this.newVideoAvailable = false;
      updateFeed('video');
      var body = $('body');
      body.stop().animate({scrollTop:0}, '500', 'swing');
    }

    this.reportSocialInteraction = function (post, button, tab) {
      console.log("Social Button Clicked: ", post, button, tab);
    }

    function scrollUpAnimate(time) {
      var body = $('body');
      body.stop().animate({scrollTop:0}, time.toString(), 'swing');
      if (_this.preventLoad) {
        _this.preventLoad = false;
      }
    }

    this.filterContent = function (tab, filter) {
      if (tab === 'social'){
        if (filter === 'expert'){
          _this.preventLoad = true;
          scrollUpAnimate(500);
          _this.socialFilter = true;
        } else {
          _this.socialFilter = false;
        }
      } 
      else if (tab === 'video'){
        if (filter === 'expert'){
          _this.preventLoad = true;
          scrollUpAnimate(500);
          _this.videoFilter = true;
        } else {
          _this.videoFilter = false;
        }
      }
    }


}]);

