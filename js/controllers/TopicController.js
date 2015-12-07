var topicModule = angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload"]);
topicModule.controller("TopicController", ["$scope", "$sce", "$window", "$sanitize", "$timeout", "$routeParams","networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService","VideoService",initTopicController]);

function initTopicController($scope, $sce, $window, $sanitize, $timeout, $routeParams,networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService, VideoService)
{
  // Check For Mobile Browser
  window.mobileCheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
  if (mobileCheck() === true){
    console.log("MOBILE BROWSER DETECTED");
    $scope.mobileBrowser = true;
  } else {
    $scope.mobileBrowser = false;
  }

  // if (ForumStorage.getFromLocalStorage('lastChannel') === undefined){
    ForumStorage.setToLocalStorage("lastChannel", ChannelService.getChannel());
  // }

  // Retain & Handle State when Returning From External Links
  // if (ForumStorage.getFromLocalStorage('hasUserVisited') === true){
  //   console.log("Checking For Existing Session");
    
  //   $scope.initPage();
  //   $scope.channelId = ForumStorage.getFromLocalStorage('lastChannel');
  //   $scope.loadTab(ForumStorage.getFromLocalStorage('lastTabActive'), $scope.channelId);
  //   setTimeout(function(){
  //     $scope.activeTab = ForumStorage.getFromLocalStorage('lastTabActive');
  //   }, 100);
  //   // updateVideo();
  //   // updateSocial();
  // }
  var headerHeight;
  $scope.scrollToBookmark = function() {
    if (ForumStorage.getFromLocalStorage('commentBookmark') !== undefined){
      setTimeout(function(){
        var bookmarkedId = parseInt(ForumStorage.getFromLocalStorage('commentBookmark'));
        var bookmarkedPost = Array.prototype.slice.call(document.getElementsByClassName('postRow'));
        bookmarkedPost = bookmarkedPost[bookmarkedId];
        var offElem = $(bookmarkedPost).offset().top - headerHeight;
        console.log("Bookmarked Post: ", bookmarkedPost);
        console.log("Bookmarked Post Top Offset: ", offElem);
        $(document).scrollTop(offElem);
        ForumStorage.setToLocalStorage('commentBookmark', undefined);
      }, 100);
    }
  };

  ga('send', 'pageview', "/topic/"+$routeParams.topicID);
  console.log('Sent Pageview from /topic/' + $routeParams.topicID);
  
  TopicService.setTopicId($routeParams.topicID);
  $scope.topicType = "livegame";
  $scope.innerButtonTapped = false;
  if(UserInfoService.isPeelUser() === true){
    $scope.isPeelUser = true;
    if (!UserInfoService.hasUserVisited()){
      console.log('USER HASNT VISITED');
      // SplashService.hidePeelSplash = false;
      $scope.hidePeelSplash = false;
      $timeout(function() {$scope.continueToExperience(); }, 5000);
    }
  }
  else {
    $scope.isPeelUser = false;  
    SplashService.hidePeelSplash = true;
    $scope.hidePeelSplash = true;
  }
//  var tempJasonNFL = {};
//  
//  
//  console.log("Team Names");
//  for(i=0;i<tempJasonNFL.results.length;i++){
//    console.log( "http://was.fankave.com/forum/#/channel/"+tempJasonNFL.results[i].channelId);
//  }
  //Samyukta test
//  $(window).scroll(function(){
//      $("#textInputFieldTopic").css("top", Math.max(160, 250 - $(this).scrollTop()));
//  });
  // $scope.hidePeelSplash = true;

  $scope.continueToExperience = function() {
    console.log("CONTINUE XP CLICKED");
    SplashService.hidePeelSplash = true;
    $scope.hidePeelSplash = true;
  };
  $scope.setScoreCardUI = function(){
    if($scope.isPeelUser === true)
    {
      if($scope.topicType == "livegame"){
        document.getElementById('topicSection').style.paddingTop = "177px";
        document.getElementById('header').style.height = "177px";
        headerHeight = 177;
      }
      else{
      document.getElementById('topicSection').style.paddingTop = "3em";
      document.getElementById('header').style.height = "3em";
      
      var parent = document.getElementById("allScoresButtonLink");
      var child = document.getElementById("allScoresButtonSpan");
      if(parent != null && child != null )
        parent.removeChild(child);
      }
    }
    else
    {
      if($scope.topicType == "livegame"){
        document.getElementById('topicSection').style.paddingTop = "125px";
        document.getElementById('header').style.height = "125px";
        headerHeight = 125;
      }
      else{
        document.getElementById('topicSection').style.paddingTop = "0em";
        document.getElementById('header').style.height = "0em";
//        var parent = document.getElementById("header");
//        var child = document.getElementById("scoreCardContent");
        var parent = document.getElementById("allScoresButtonLink");
        var child = document.getElementById("allScoresButtonSpan");
        if(parent != null && child != null )
          parent.removeChild(child);
      }
    }
  }
  
  var updateTopic = function(){
    if(TopicService.getTopic() != undefined){
      $scope.topicType = TopicService.getTopicType();
      if(TopicService.isWatchingTopic() == false){
        networkService.send(TopicService.getFollowChannelRequest());
        networkService.send(TopicService.watchTopicRequest($routeParams.topicID));
      }
      
      
      $scope.setScoreCardUI();
      if($scope.topicType == "livegame"){
        console.log("Inside topic set :"+ TopicService.getTeamA());
        //Score API update
        $scope.leftTeam = TopicService.getTeamA();
        $scope.rightTeam = TopicService.getTeamB();
        var score = TopicService.getScore();
        if(score != undefined){
          $scope.leftTeamScore = score.points[0];
          $scope.rightTeamScore = score.points[1];
        }
        $scope.gameStatus = TopicService.getGameStatus();
        // console.log($scope.gameStatus)

        if($scope.gameStatus == "live") {
          $scope.gamePeriod = TopicService.getGamePeriod();
          $scope.gameClock = TopicService.getGameClock();
        }

        $scope.gameScheduledTime = TopicService.getGameTime();



        $scope.allScoresTitle = TopicService.getScoresTitle();
        $scope.allScoresURL = TopicService.getScoresLink();

        // renderScoreCard($scope.leftTeam.pColor, $scope.rightTeam.pColor);
        var left = $('.scoreCardContent');
        var right = $('.svg-content');
        left.css('background-color', $scope.leftTeam.pColor);
        right.css('fill', $scope.rightTeam.pColor);
      }
      $scope.topicTitle = TopicService.getTitle();
      var thisTopic = TopicService.getTopic();
      $scope.topicDescHtml = thisTopic.html;
      //console.log("has MEDIA  :"+ thisTopic.type +"thisTopic.mediaUrl"+ thisTopic.mediaUrl);
      if(thisTopic.type == "media"){
      $scope.topicMediaUrl = thisTopic.mediaUrl;
      $scope.topicMediaAspectFeed = thisTopic.mediaAspectFull;
      }
//      var width = window.innerWidth;
//      console.log("Image width :"+$scope.topicMediaAspectFeed.w +"  X  " + $scope.topicMediaAspectFeed.h + "xxxx "+width)
//      $scope.topicMediaAspectFull = thisTopic.mediaAspectFull;

      $scope.createdAt = TopicService.getTimeCreatedAt();
      $scope.liked = TopicService.getLiked();
      var metrics = TopicService.getMetrics();
      $scope.likesCount = metrics.likes;
      $scope.commentsCount = metrics.comments || 0;

    }
  };

  var updateComments = function(){
    var commentsdata = CommentService.comments();
    if(commentsdata != undefined && commentsdata.length >0){
      console.log("CommentsData : ", commentsdata);
      var len = commentsdata.length;

      $scope.commentsArray = [];

      for(i=0;i<len;i++){
        var tempComment = {};
        tempComment = commentsdata[i];
        tempComment.postAuthorName = commentsdata[i].author.name;
        tempComment.postAuthorPhoto = commentsdata[i].author.photo;
        tempComment.isMyComment = UserInfoService.isCurrentUser(commentsdata[i].author.id);

        tempComment.likeCount = commentsdata[i].metrics.likes;
        tempComment.replyCount = commentsdata[i].metrics.replies;

        tempComment.postTimestamp = commentsdata[i].createdAt;
        tempComment.mediaAspectFeed = commentsdata[i].mediaAspectFeed;
        tempComment.mediaAspectFull = commentsdata[i].mediaAspectFull;
        tempComment.isLiked = commentsdata[i].signal.like;
        $scope.commentsArray.push(tempComment);

        // console.log(i +" : updated comments html : " +$scope.commentsArray[i].html);

        if($scope.commentsArray[i].type == "media"){
//          console.log("Media Aspect feed x: "+tempComment.mediaAspectFeed.x + 
//          "y: "+ tempComment.mediaAspectFeed.y + 
//          "w: "+ tempComment.mediaAspectFeed.w +
//          "h: "+ tempComment.mediaAspectFeed.h );

//          console.log("Media Aspect full x: "+tempComment.mediaAspectFull.x + 
//          "y: "+ tempComment.mediaAspectFull.y + 
//          "w: "+ tempComment.mediaAspectFull.w +
//          "h: "+ tempComment.mediaAspectFull.h );
          // console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaUrl);
          // console.log(i +" : updated comments media : " +$scope.commentsArray[i].mediaAspectFeed);

        }
      }
    }

  };

  $scope.init = function() {
    networkService.send(TopicService.getTopicRequest($routeParams.topicID));
    networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
  };
  

  $scope.setPeelUI = function(isPeelUser){
    //console.log("isPeelUser :"+isPeelUser);
    $scope.isPeelUser = isPeelUser;
    
  }

  
  $scope.setPeelUI($scope.isPeelUser);

  $scope.initPage = function(){
    updateTopic();
    updateComments();
    $scope.pageClass = 'page-topic';

    $scope.topicID = $routeParams.topicID;
    $scope.init();

    if ($scope.mobileBrowser === true){
      document.getElementById('topicSection').style.marginBottom = "54px";
    }

    $scope.$watch("commentsArray", function (newValue, oldValue)
        {
      $timeout(function()
          {
        var postDivs = document.getElementsByClassName("postRow");
        for(div in postDivs)
        {
          if(newValue != undefined)
          {
            var thisPost = newValue[div];

            if(thisPost != undefined)
            {
              var thisDiv = postDivs[div];
              thisDiv.onclick = function(e)
              {
                if ($(e.target).is('a')){
                  console.log("EXTERNAL LINK: ", e, this.id);
                  ForumStorage.setToLocalStorage('commentBookmark', this.id);
                  return;
                } else {
                  // console.log("thisDiv.onclick");
                  thisPost = $scope.commentsArray[this.id];
                  if($scope.innerButtonTapped == false)
                  {
                    window.location = "#/post/" + thisPost.id;
                  }
                  $scope.innerButtonTapped = false;
                }
              }
            } 
          }
        }
        setLinks();
          });
        });
  }

//  if(URIHelper.isPeelUser())
//    ga('send', 'event', 'UserType', '0', 'Peel User', { 'nonInteraction': 2 });
//  else
//    ga('send', 'event', 'UserType', '0', 'Non Peel User', { 'nonInteraction': 2 });
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    if(!networkService.isSocketConnected())
      networkService.init();
    $scope.initPage();
  }
  else
    if(URIHelper.isPeelUser()){
      $scope.isPeelUser = true;
      $scope.setPeelUI( true);
      AuthService.loginWithPeel();
      //networkService.init();
    }
    else{
      // console.log("Not logged in to facebook, take user to login page")
      window.location = "#/";
    }


  $scope.peelClose = function()
  {
    ga('send', 'event', 'Peel', 'click', 'BackToPeelHome');
    console.log("peelClose()");
    window.location = "peel://home";
  }

  $scope.peelWatchOnTV = function()
  {
    ga('send', 'event', 'Peel', 'click', 'PeelWatchOnTV');
    console.log("peelWatchOnTV()");
    var showId = URIHelper.getPeelShowId();
    console.log("Peel show on TV uri :  "+ "peel://tunein/"+showId);
    if(showId != undefined)
      window.location = "peel://tunein/"+showId;
    else
      window.location = "peel://home";
  }

  $scope.showNewCommentsIndicator = false;
  $scope.newCommentsIndicatorTapped = function()
  {
    console.log("newCommentsIndicatorTapped");
    $scope.showNewCommentsIndicator = false;
    updateComments();
    $(document).scrollTop(0);
  }

  $scope.imageClick = function(imageURL)
  {
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();

    $.magnificPopup.open({
      items: {
        type:'image',
        src: imageURL,
      },
      type: 'inline',
      callbacks:
      {
        open: function()
        {
          console.log("popup opened");
          $('body').bind('touchmove', function(e){e.preventDefault()})
        },
        close: function()
        {
          console.log("popup closed");
          $('body').unbind('touchmove')
        }
        // e.t.c.
      }
    });
  }

  $scope.moreButtonTapped = function()
  {
    $scope.innerButtonTapped = true;
  }

  $scope.updateLikeTopic = function() {
    console.log("TopicController update like Topic");
    if(TopicService.getLiked() == true)
      networkService.send(TopicService.getUnlikeTopicRequest());
    else
      networkService.send(TopicService.getLikeTopicRequest());  
  };

  $scope.commentOnTopic = function()
  {
    // console.log("comment on topic");
    document.getElementById("topicCommentField").focus();
  };

  $scope.updateLikeComment = function(id) {
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();

    console.log("TopicController updateLike (" + id + ")");
    if(CommentService.isCommentLiked(id)){
      networkService.send(CommentService.getUnlikeCommentRequest(id));
    }
    else{
      networkService.send(CommentService.getLikeCommentRequest(id));  
    }
  };


  $scope.deleteComment = function(id)
  {
    console.log("deleteComment(" + id + ")");
    $scope.innerButtonTapped = true;
    networkService.send(CommentService.deleteCommentRequest(id)); 
  }

  $scope.reportCommentAsSpam = function(id)
  {
    console.log("reportCommentAsSpam(" + id + ")");
    $scope.innerButtonTapped = true;
    networkService.send(CommentService.flagCommentRequest(id)); 
  }

  $scope.goToRepliesWithKeyboardTriggered = function(id)
  {
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();

    // console.log("TopicController.goToRepliesWithKeyboardTriggered(" + id + ")");
    TopicService.directComment = true;
    window.location = "#/post/" + id;
  };



  var notifyNewComments = function(){
    if($scope.commentsArray == undefined)
    {
      updateComments();
    }
    else {
      var commentsdata = CommentService.comments();
      var len = commentsdata.length;
      var pinIndex = CommentService.getNumPinComments();
      if($scope.commentsArray.length < len){
        if(!UserInfoService.isCurrentUser(commentsdata[pinIndex].author.id)){
          $scope.showNewCommentsIndicator = true;
        }
        else {
          updateComments();
        }
      }
      else{
        updateComments();
      }
    }
  };

  var updateSocial = function() {
    var socialData = SocialService.socialArray();
    if (!!socialData && socialData.length > 0){
      console.log("Social Data: ", socialData);
      var len = socialData.length;

      $scope.socialArray = $scope.socialArray || [];
      console.log("Social Array: ", $scope.socialArray);
      for (var i = 0; i < len; i++){
        var tempSocial = socialData[i];
        tempSocial.postAuthorName = socialData[i].embedAuthor.name;
        tempSocial.postAuthorAlias = socialData[i].embedAuthor.alias;
        tempSocial.postAuthorPhoto = socialData[i].embedAuthor.photo;
        tempSocial.postTimestamp = socialData[i].createdAt;

        tempSocial.isLiked = socialData[i].signal.like || false;
        tempSocial.isRetweet = socialData[i].signal.retweet || false;
        tempSocial.isFavorite = socialData[i].signal.favorite || false;
        tempSocial.providerName = socialData[i].embedProvider.name;
        tempSocial.providerLogo = socialData[i].embedProvider.logo;
        tempSocial.html = socialData[i].embedText;
        tempSocial.retweetCount = socialData[i].metrics.retweets;
        tempSocial.favoriteCount = socialData[i].metrics.favorites;
        tempSocial.replyCount = socialData[i].metrics.replies;

        tempSocial.embedType = socialData[i].embedType;
        if (socialData[i].embedType === "link" && socialData[i].embedPlayable === true){
          tempSocial.embedHtml = $sce.trustAsHtml(socialData[i].embedHtml);
          tempSocial.embedPlayable = true;
        }
        if (socialData[i].embedType === "media"){
          tempSocial.mediaType = socialData[i].embedMedia.mediaType;
          tempSocial.mediaUrl = socialData[i].embedMedia.mediaUrl;
          tempSocial.mediaAspectFeed = socialData[i].embedMedia.mediaAspectFeed;
          if (!!tempSocial.mediaAspectFeed.y){
            // tempSocial.mediaAspectFeed.dispY = socialData[i].embedMedia.mediaAspectFeed.h - socialData[i].embedMedia.mediaAspectFeed.y;
            tempSocial.mediaAspectFeed.y = socialData[i].embedMedia.mediaAspectFeed.y + 'px';
          } else {
            tempSocial.mediaAspectFeed.y = 0;
          }
          if (!!tempSocial.mediaAspectFeed.x){
            tempSocial.mediaAspectFeed.x = socialData[i].embedMedia.mediaAspectFeed.x + 'px';
          } else {
            tempSocial.mediaAspectFeed.x = 0;
          }
          tempSocial.mediaAspectFull = socialData[i].embedMedia.mediaAspectFull;
        }
        $scope.socialArray.push(tempSocial);
      }
    }
  };

  var prependSocial = function(newItemId){
    var socialData = SocialService.socialArrayArchive();
    for (var i = 0; i < socialData.length; i++){
      if (socialData[i].id === newItemId){
        var tempSocial = socialData[i];
        tempSocial.postAuthorName = socialData[i].embedAuthor.name;
        tempSocial.postAuthorAlias = socialData[i].embedAuthor.alias;
        tempSocial.postAuthorPhoto = socialData[i].embedAuthor.photo;
        tempSocial.postTimestamp = socialData[i].createdAt;

        tempSocial.isLiked = socialData[i].signal.like || false;
        tempSocial.isRetweet = socialData[i].signal.retweet || false;
        tempSocial.isFavorite = socialData[i].signal.favorite || false;
        tempSocial.providerName = socialData[i].embedProvider.name;
        tempSocial.providerLogo = socialData[i].embedProvider.logo;
        tempSocial.html = socialData[i].embedText;
        tempSocial.retweetCount = socialData[i].metrics.retweets;
        tempSocial.favoriteCount = socialData[i].metrics.favorites;
        tempSocial.replyCount = socialData[i].metrics.replies;

        tempSocial.embedType = socialData[i].embedType;
        
        if (socialData[i].embedType === "media"){
          tempSocial.mediaType = socialData[i].embedMedia.mediaType;
          tempSocial.mediaUrl = socialData[i].embedMedia.mediaUrl;
          tempSocial.mediaAspectFeed = socialData[i].embedMedia.mediaAspectFeed;
          tempSocial.mediaAspectFull = socialData[i].embedMedia.mediaAspectFull;
        }
        console.log("Prepending Social Item: ", tempSocial);
        $scope.socialArray.unshift(tempSocial);
        $scope.showNewCommentsIndicator = true;
        return;
      }
    }
  };

  var notifyNewSocial = function(newItemId) {
    if (!!newItemId){
      console.log("Incoming Social Item ID: ", newItemId);
      prependSocial(newItemId);
    } else {
      updateSocial();
    }
  };

  var updateVideo = function() {
    var videoData = VideoService.videoArray();
    if (!!videoData && videoData.length > 0){
      console.log("Video Data: ", videoData);
      var len = videoData.length;

      $scope.videoArray = $scope.videoArray || [];

      for (var i = 0; i < len; i++){
        var tempVideo = videoData[i];
        tempVideo.postAuthorName = videoData[i].embedAuthor.name;
        tempVideo.postAuthorAlias = videoData[i].embedAuthor.alias;
        tempVideo.postAuthorPhoto = videoData[i].embedAuthor.photo;
        tempVideo.postTimestamp = videoData[i].createdAt;

        tempVideo.isLiked = videoData[i].signal.like;
        tempVideo.isRetweet = videoData[i].signal.retweet || false;
        tempVideo.isFavorite = videoData[i].signal.favorite || false;
        tempVideo.providerName = videoData[i].embedProvider.name;
        tempVideo.providerLogo = videoData[i].embedProvider.logo;
        tempVideo.html = videoData[i].embedText;
        tempVideo.retweetCount = videoData[i].metrics.retweets;
        tempVideo.favoriteCount = videoData[i].metrics.favorites;
        tempVideo.replyCount = videoData[i].metrics.replies;

        tempVideo.embedType = videoData[i].embedType;

        if (videoData[i].embedType === "link" && videoData[i].embedPlayable === true){
          tempVideo.embedHtml = $sce.trustAsHtml(videoData[i].embedHtml);
          tempVideo.embedPlayable = true;
        }

        if (videoData[i].embedType === "media"){
          tempVideo.mediaType = videoData[i].embedMedia.mediaType;
          tempVideo.mediaUrl = videoData[i].embedMedia.mediaUrl;
          tempVideo.mediaAspectFeed = videoData[i].embedMedia.mediaAspectFeed;
          tempVideo.mediaAspectFull = videoData[i].embedMedia.mediaAspectFull;
        }

        $scope.videoArray.push(tempVideo);
      }
    }
  };

  var notifyNewVideo = function() {
    // if (!$scope.socialArray){
      updateVideo();
    // }
  };

  SocialService.registerObserverCallback(notifyNewSocial);
  VideoService.registerObserverCallback(notifyNewVideo);
  TopicService.registerObserverCallback(updateTopic);
  CommentService.registerObserverCallback(notifyNewComments);

  $scope.trustSrc = function(src)
  {
    return $sce.trustAsResourceUrl(src);
  }

  $window.addEventListener("beforeunload", function(){
    console.log("Before Unload");
    ForumStorage.setToLocalStorage("hasUserVisited", true);
    ForumStorage.setToLocalStorage("lastTabActive", $scope.activeTab);
  });

  $scope.xLinkActivated = false;

  function setLinks() {
    // $('.postContent > a').addClass()
    // $('.postContent > a').click(function(){
      // $('#xContent').css('display', 'block');
    // });
  };
  
  // $scope.backToChat = function() {
  //   $('#xContent').css('display', 'none');
  // };

  // CONTENT TABS
  $scope.activeTab = 'chat';
  $scope.switchTabs = function(tab) {
    if (tab === 'chat'){
      $('#chatTab').addClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $scope.activeTab = 'chat';
    }
    if (tab === 'video'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').addClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $scope.activeTab = 'video';
    }
    if (tab === 'social'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').addClass('selectedTab');
      $scope.activeTab = 'social';
    }
    $scope.loadTab(tab);
    $scope.channelId = ForumStorage.getFromLocalStorage('lastChannel');
  };

  // var _channelId = ChannelService.getChannel();
  // TopicService.setChannel(_channelId);
  // ForumStorage.setToLocalStorage('lastChannel',_channelId);
  $scope.loadTab = function(tab, channel) {
    console.log("Channel in Load Tab: ", $scope.channelId, TopicService.getChannelId());
    console.log("Switched to Tab: ", tab);
    if (tab === 'social'){
      // console.log("Tab Channel: ", ChannelService.getChannel());
      networkService.send(SocialService.getSocialDataRequest(ChannelService.getChannel()||TopicService.getChannelId()));
    }
    else if (tab === 'video'){
      // console.log("Tab Channel: ", ChannelService.getChannel());
      networkService.send(VideoService.getVideoDataRequest(ChannelService.getChannel()||TopicService.getChannelId()));
    }
  };

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

  var tabs = $('#inputControls');
  var userInput = $('#textInputFieldTopic');

  var watchScroll = debounce(function() {
      if ($(document).scrollTop() > 77) {
        tabs.addClass('fixTabs');
        userInput.addClass('inputBase');
      } else {
        tabs.removeClass('fixTabs');
        userInput.removeClass('inputBase');
      }
  }, 15);

  // var lastElTop;
  // var lastElHeight;
  // var clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var clientHeight = document.documentElement.clientHeight || window.innerHeight;
  var scrollAfterLoad = function(pos){
    setTimeout(function(){
      $(document).scrollTop(pos);
    }, 250);
  };
  var watchContentScroll = debounce(function() {
    // lastElTop = $('.postRow').last().offset().top - headerHeight;
    // lastElHeight = $('.postRow').last().height();
    // console.log("LAST ELEM TOP: ", lastElTop, lastElHeight, clientHeight);
    var currentScroll = $(document).height() - clientHeight - 1;
    // console.log("currentScroll: ", currentScroll, clientHeight);
    if ($(document).scrollTop() > currentScroll) {
      if ($scope.activeTab === 'social'){
        console.log("LOADING MORE SOCIAL");
        networkService.send(SocialService.getSocialDataRequest(ChannelService.getChannel()||TopicService.getChannelId()));
        scrollAfterLoad(currentScroll + 90);
      }
      else if ($scope.activeTab === 'video'){
        console.log("LOADING MORE VIDEO");
        networkService.send(VideoService.getVideoDataRequest(ChannelService.getChannel()||TopicService.getChannelId()));
        scrollAfterLoad(currentScroll + 90);
      }
    }
  }, 500);

  // $(document).on('scroll', watchScroll);
  // if ($scope.activeTab === 'video' || $scope.activeTab === 'social'){
    $(document).on('scroll', watchContentScroll);
  // }

};

topicModule.directive('repeatFinishedNotify', function () {
  return function (scope, element, attrs) {
    if (scope.$last){
      scope.scrollToBookmark();
    }
  };
});
