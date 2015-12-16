var socialModule = angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"]);
socialModule.controller("SocialController", ["$scope","$sce","$window","$routeParams","SocialService","VideoService","networkService","ChannelService","TopicService","DateUtilityService",
  function ($scope,$sce,$window,$routeParams,SocialService,VideoService,networkService,ChannelService,TopicService,DateUtilityService){
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


    this.loadContent = function(type, offset) {
      var channelID = ChannelService.getChannel()||TopicService.getChannelId();
      if (type === 'social'){
        console.log("LOADING SOCIAL: ", channelID);
        networkService.send(SocialService.getSocialDataRequest(channelID,offset));
      } else {
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
        console.log("Feed Data: ", feedData, " Type: ", tab);

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
          
          tempItem.postTimestamp = feedData[i].createdAt;
          tempItem.providerName = feedData[i].embedProvider.name;
          if (tempItem.providerName === "Twitter"){
            tempItem.providerLogo = "img/twitterLogo@2x.png";
          } else {
            tempItem.providerLogo = feedData[i].embedProvider.logo;
          }
          tempItem.html = feedData[i].embedText;
          tempItem.retweetCount = feedData[i].metrics.retweets;
          tempItem.favoriteCount = feedData[i].metrics.favorites;
          tempItem.replyCount = feedData[i].metrics.replies;

          tempItem.embedType = feedData[i].embedType;
          if (feedData[i].embedType === "link" && feedData[i].embedPlayable === true){
            tempItem.embedHtml = $sce.trustAsHtml(feedData[i].embedHtml);
            tempItem.embedPlayable = true;
          }
          if (feedData[i].embedType === "media"){
            tempItem.mediaType = feedData[i].embedMedia.mediaType;
            tempItem.mediaUrl = feedData[i].embedMedia.mediaUrl;
            tempItem.mediaAspectFeed = feedData[i].embedMedia.mediaAspectFeed;
            if (!!tempItem.mediaAspectFeed.y){
              tempItem.mediaAspectFeed.y = feedData[i].embedMedia.mediaAspectFeed.y + 'px';
            } else {
              tempItem.mediaAspectFeed.y = 0;
            }
            if (!!tempItem.mediaAspectFeed.x){
              tempItem.mediaAspectFeed.x = feedData[i].embedMedia.mediaAspectFeed.x + 'px';
            } else {
              tempItem.mediaAspectFeed.x = 0;
            }
            tempItem.mediaAspectFull = feedData[i].embedMedia.mediaAspectFull;
          }

          if (tab === 'social'){
            _this.socialArray.push(tempItem);
          } else {
            _this.videoArray.push(tempItem);
          }
        }
      }
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
          scrollAfterLoad(currentScroll + 90);
        }
        else if ($scope.activeTab === 'video'){
          // We are Loading More Content -->
          // Base offset on Current Length of Scope Array
          _this.loadContent('video',_this.videoArray.length);
          scrollAfterLoad(currentScroll + 90);
        }
      }
    }, 100);

    $(document).on('scroll', watchContentScroll);


}]);

// socialModule.directive('repeatFinishedSocial', function () {
//   return function (scope, element, attrs) {
//     if (scope.$last){
//       // scope.scrollToBookmark();
//       console.log("DONE LOADING COMMENTS");
//       // scope.loadingChat = false;
//       scope.hideLoading();
//     }
//   };
// });