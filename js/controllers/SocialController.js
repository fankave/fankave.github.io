var socialModule = angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"]);
socialModule.controller("SocialController", ["$scope","$sce","$window","$routeParams","SocialService","VideoService","networkService","ChannelService","TopicService",
  function ($scope,$sce,$window,$routeParams,SocialService,VideoService,networkService,ChannelService,TopicService){
    console.log("Social Control");

    var _this = this;
    this.initFeed = function(tab) {
      $scope.$parent.loadingSocial = true;
      if (tab === 'social'){
        $scope.$parent.switchTabs('social');
        _this.socialArray = [];
        SocialService.resetSocialOffset();
        loadContent('social');
      } else {
        $scope.$parent.switchTabs('video');
        _this.videoArray = [];
        VideoService.resetVideoOffset();
        loadContent('video');
      }
    };


    function loadContent(type) {
      var channelID = ChannelService.getChannel()||TopicService.getChannelId();
      if (type === 'social'){
        console.log("LOADING SOCIAL: ", channelID);
        networkService.send(SocialService.getSocialDataRequest(channelID));
      } else {
        console.log("LOADING VIDEO: ", channelID);
        networkService.send(VideoService.getVideoDataRequest(channelID));
      }
    };

    function updateFeed(tab) {

      // Get Appropriate Content
      var feedData;
      if (tab === 'social'){
        feedData = SocialService.socialArray();
        _this.socialArray = _this.socialArray || [];
      } else {
        feedData = VideoService.videoArray();
        _this.videoArray = _this.videoArray || [];
      }

      var len = feedData.length;
      if (!!feedData && len > 0){
        console.log("Feed Data: ", feedData, " Type: ", tab);

        for (var i = 0; i < len; i++){
          var tempItem = feedData[i];
          
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
      // console.log("currentScroll: ", currentScroll, clientHeight);
      if ($(document).scrollTop() > currentScroll && currentScroll > 500) {
        if ($scope.activeTab === 'social'){
          loadContent('social');
          scrollAfterLoad(currentScroll + 90);
        }
        else if ($scope.activeTab === 'video'){
          loadContent('video');
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