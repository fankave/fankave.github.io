var socialModule = angular.module("SocialModule", ["NetworkModule","ChannelModule","TopicModule"]);
socialModule.controller("SocialController", ["$scope","$sce","$window","$routeParams","SocialService","networkService","ChannelService","TopicService",
  function ($scope,$sce,$window,$routeParams,SocialService,networkService,ChannelService,TopicService){

    this.initFeed = function(tab) {
      if (tab === 'social'){
        loadContent('social');
      } else {
        loadContent('video');
      }
    };

    var channelID = ChannelService.getChannel()||TopicService.getChannelId();

    function loadContent(type) {
      if (type === 'social'){
        console.log("LOADING SOCIAL");
        networkService.send(SocialService.getSocialDataRequest(channelID));
      } else {
        console.log("LOADING VIDEO");
        networkService.send(SocialService.getVideoDataRequest(channelID));
      }
    };

    var updateFeed = function(tab) {

      // Get Appropriate Content
      var feedData;
      if (tab === 'social'){
        feedData = SocialService.socialArray();
        $scope.socialArray = $scope.socialArray || [];
      } else {
        feedData = SocialService.videoArray();
        $scope.videoArray = $scope.videoArray || [];
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
            $scope.socialArray.push(tempItem);
          } else {
            $scope.videoArray.push(tempItem);
          }
        }
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

    function scrollAfterLoad(pos) {
      setTimeout(function(){
        $(document).scrollTop(pos);
      }, 250);
    };


    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var watchContentScroll = debounce(function() {
      var currentScroll = $(document).height() - clientHeight - 1;
      // console.log("currentScroll: ", currentScroll, clientHeight);
      if ($(document).scrollTop() > currentScroll) {
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

    SocialService.registerObserverCallback('social',updateFeed('social'));
    SocialService.registerObserverCallback('video',updateFeed('video'));


}]);
