angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload","SocialModule"])
.controller("TopicController", ["$scope", "$sce", "$window", "$location","$sanitize", "$timeout", "$routeParams","networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService","UserAgentService",

function ($scope, $sce, $window, $location, $sanitize, $timeout, $routeParams,networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService, UserAgentService)
{
  var lastComment = false;
  // Check For Mobile Browser
  if (UserAgentService.isMobileUser()){
    $scope.mobileBrowser = true;
    $scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
    console.log("MOBILE USER AGENT: ", $scope.mobileUserAgent);
  } else {
    $scope.mobileBrowser = false;
  }

  if (!$scope.commentsArray){
    $scope.loadingChat = true;
  }

  ga('send', 'pageview', "/topic/"+$routeParams.topicID);
  console.log('Sent Pageview from /topic/' + $routeParams.topicID);
  
  TopicService.setTopicId($routeParams.topicID);
  $scope.topicType = "livegame";
  $scope.innerButtonTapped = false;
  if (UserInfoService.isSmartStadiumUser()){
    $scope.isSmartStadiumUser = true;
    // if (!UserInfoService.hasUserVisited()){
      console.log('SS USER HASNT VISITED');
      $scope.hideSSSplash = false;
      ForumStorage.setToLocalStorage("hasUserVisited", true);
      $timeout(function() {$scope.continueToExperience('smartS'); }, 5000);
    // }
  }
  else if (UserInfoService.isMI16User()){
    $scope.isMI16User = true;
  }
  else if(UserInfoService.isPeelUser()){
    $scope.isPeelUser = true;
    if (!UserInfoService.hasUserVisited()){
      console.log('PEEL USER HASNT VISITED');
      $scope.hidePeelSplash = false;
      ForumStorage.setToLocalStorage("hasUserVisited", true);
      $timeout(function() {$scope.continueToExperience('peel'); }, 5000);
    }
  }
  else {
    $scope.isPeelUser = false;  
    $scope.hidePeelSplash = true;
    $scope.hideSSSplash = true;
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

  $scope.continueToExperience = function(env) {
    console.log("CONTINUE XP CLICKED");
    if (env === 'peel'){
      SplashService.setPeelSplash(true);
      $scope.hidePeelSplash = true;
    } else if (env === 'smartS'){
      SplashService.setSSSplash(true);
      $scope.hideSSSplash = true;
    }
  };
  $scope.setScoreCardUI = function() {
    if ($scope.topicType === 'livegame'){
      if ($scope.isPeelUser){
        $('#topicSection').css('padding-top','54px');
      } else if ($scope.isSmartStadiumUser){
        $('#topicSection').css('padding-top','54px');
      } else if ($scope.isMI16User){
        // $('#topicSection').css('padding-top','54px');
      } else {
        $('#topicSection').css('padding-top','0px');
      }
    }
  };
  
  var updateTopic = function(){
    if(TopicService.getTopic() !== undefined){
      $scope.topicType = TopicService.getTopicType();
      if(TopicService.isWatchingTopic() === false){
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
      $scope.commentsCount = metrics.comments;
      if (!$scope.commentsCount || $scope.commentsCount === 0){
        $scope.loadingChat = false;
      }

    }
  };

  var updateComments = function(){
    var commentsdata = CommentService.comments();
    if(commentsdata != undefined && (commentsdata.length >0 || lastComment === true)){
      lastComment = false;
      // console.log("CommentsData : ", commentsdata);
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
        if (tempComment.type === 'media'){
          tempComment.mediaUrl = commentsdata[i].mediaUrl;
          // tempComment.trustedMediaUrl = $scope.trustSrc(tempComment.mediaUrl);
          tempComment.mediaAspectFeed = commentsdata[i].mediaAspectFeed;
          tempComment.mediaAspectFull = commentsdata[i].mediaAspectFull;
          tempComment.mediaAspectRatio = commentsdata[i].mediaAspectRatio;
          tempComment.mediaOrientation = commentsdata[i].mediaOrientation;
          tempComment.mediaThumbUrl = commentsdata[i].mediaThumbUrl;
        }
        tempComment.isLiked = commentsdata[i].signal.like;

        if (tempComment.type === 'embed'){
          tempComment.shared = true;
          tempComment.embed = commentsdata[i].embed;
          tempComment.embed.embedCreatedAt = commentsdata[i].embedCreatedAt;
          tempComment.embed.embedCreatedAtFull = commentsdata[i].embedCreatedAtFull;
          tempComment.embedType = commentsdata[i].embedType;
          
          if (tempComment.embedType === 'media' || tempComment.embedType === 'link'){
            tempComment.mediaUrl = commentsdata[i].embedMedia.mediaUrl;
            tempComment.mediaThumbUrl = commentsdata[i].embedMedia.mediaThumbUrl;
            tempComment.mediaAspectFeed = commentsdata[i].embedMedia.mediaAspectFeed;
            tempComment.mediaAspectFull = commentsdata[i].embedMedia.mediaAspectFull;
            tempComment.mediaAspectRatio = commentsdata[i].embedMedia.mediaAspectRatio;
            tempComment.mediaOrientation = commentsdata[i].embedMedia.mediaOrientation;
          }

          if (tempComment.providerName === "Twitter"){
            tempComment.embed.embedLogo = "img/twitterLogo@2x.png";
          } else {
            tempComment.embed.embedLogo = commentsdata[i].embed.provider.logo;
          }

          if (commentsdata[i].embed.type === 'link' && commentsdata[i].embed.playable === true){
            tempComment.embedHtml = commentsdata[i].embedHtml;
          }
        }
        $scope.commentsArray.push(tempComment);
        if (i === len - 1 && NETWORK_DEBUG){
          console.log("Comments Array: ", $scope.commentsArray);
        }

      }
    }

  };

  $scope.loadRemainingComments = function() {
    console.log("LOADING REST OF COMMENTS...");
    if (!CommentService.loadedComments()){
      networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
      CommentService.setLoadedComments(true);
      $scope.loadedAllComments = true;
    }
  };

  $scope.loadRemainingCommentsTimeout = function() {
      $timeout(function(){
        if (!CommentService.loadedComments()){
          console.log("LOADING REST OF COMMENTS...");
          networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
          $scope.loadedAllComments = true;
          CommentService.setLoadedComments(true);
        }
      }, 7000);
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

  $scope.hideLoading = function(){
    console.log("HIDING LOAD");
    $scope.loadingChat = false;
    $scope.loadingSocial = false;
  };
  $scope.initPage = function(){
    updateTopic();
    updateComments();
    $scope.pageClass = 'page-topic';
    $scope.showNewCommentsIndicator = false;

    $scope.topicID = $routeParams.topicID;
    $scope.init();

    if ($scope.mobileBrowser === true){
      document.getElementById('topicSection').style.paddingBottom = "42px";
    }
  }

  $scope.setLinksOnComments = function(){
    var postDivs = document.getElementsByClassName("postRow");
    for (div in postDivs) {
      var thisDiv = postDivs[div];
      thisDiv.onclick = function(e) {
        if ($(e.target).is('a')) {
          console.log("EXTERNAL LINK: ", e, this.id);
          return;
        } 
        thisPost = $scope.commentsArray[this.id];
        if ($scope.innerButtonTapped === false) {
          console.log("Post Click Active: ", thisPost.id);
          if (HTML5_LOC){
            $location.path("/post/" + thisPost.id);
            if (!$scope.$$phase){
              $scope.$apply();
            }
          } else {
            $window.location = "#/post/" + thisPost.id;
          }
        }
        $scope.innerButtonTapped = false;
      }
    }
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
  else if (URIHelper.isSmartStadiumUser()){
    $scope.isSmartStadiumUser = true;
    console.log("SS User? ", $scope.isSmartStadiumUser);
    AuthService.loginWithEmail();
  }
  else if (URIHelper.isTechMUser()){
    $window.location = "#/login?MI16=true";
  }
  else if (URIHelper.isPeelUser()){
    $scope.isPeelUser = true;
    $scope.setPeelUI(true);
    AuthService.loginWithPeel();
  }
  else {
    // console.log("Not logged in to facebook, take user to login page")
    AuthService.loginAsGuest();
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
    // if(UserInfoService.isGuestUser())
    // {
    //   if (HTML5_LOC){
    //     $location.path("/login");
    //   } else {
    //     $window.location = "#/login";
    //   }
    // }
    // else{ 
      if(TopicService.getLiked() == true)
        networkService.send(TopicService.getUnlikeTopicRequest());
      else
        networkService.send(TopicService.getLikeTopicRequest());  
      // }
  };

  $scope.commentOnTopic = function()
  {
    document.getElementById("topicCommentField").focus();
  };

  $scope.updateLikeComment = function(id) {
    $scope.innerButtonTapped = true;
    
    // event.cancelBubble = true;
    // if(event.stopPropagation) event.stopPropagation();

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
    if ($scope.commentsArray.length === 1){
      console.log("Deleting Final Comment");
      lastComment = true;
    }
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
    // event.cancelBubble = true;
    // if(event.stopPropagation) event.stopPropagation();

    // console.log("TopicController.goToRepliesWithKeyboardTriggered(" + id + ")");
    TopicService.directComment = true;
    if (HTML5_LOC){
      $location.path("/post/" + id);
    } else {
      $window.location = "#/post/" + id;
    }
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

  TopicService.registerObserverCallback(updateTopic);
  CommentService.registerObserverCallback(notifyNewComments);
  CommentService.registerObserverCallback(updateComments, true);

  $scope.trustSrc = function(src)
  {
    return $sce.trustAsResourceUrl(src);
  }

  $window.addEventListener("beforeunload", function(){
    console.log("Before Unload");
    ForumStorage.setToLocalStorage("lastTabActive", $scope.activeTab);
  });

  $scope.xLinkActivated = false;

  // CONTENT TABS
  $scope.activeTab = 'chat';
  $scope.switchTabs = function(tab) {
    if (tab === 'chat'){
      $('#chatTab').addClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $scope.activeTab = 'chat';
      $(document).scrollTop(0);
      updateTopic();
      updateComments();
    }
    if (tab === 'video'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').addClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $scope.activeTab = 'video';
      $(document).scrollTop(0);
    }
    if (tab === 'social'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').addClass('selectedTab');
      $scope.activeTab = 'social';
      $(document).scrollTop(0);
    }
    console.log("Active Tab: ", $scope.activeTab);
  };

  var _channelId = ChannelService.getChannel();
  TopicService.setChannel(_channelId);

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

  var docVarsSet = false;
  var tabs,
      tabContainer,
      tabsTop,
      tabsHeight,
      inputHeight,
      clientHeight,
      docHeight,
      headerHeight;
  $scope.setDocVars = function() {
    if (!docVarsSet){
      tabs = $('#inputControls');
      tabContainer = $('.tabContainer');
      tabsTop = tabs.offset().top;
      tabsHeight = tabContainer.height();
      inputHeight = tabs.height();
      clientHeight = document.documentElement.clientHeight;
      docHeight = $(document).height();
      docVarsSet = true;
      if ($scope.isSmartStadiumUser){
        headerHeight = 54;
      } else if ($scope.isPeelUser){
        headerHeight = 54;
      } else {
        headerHeight = 0;
      }
    }
  };

  var fixed = false;
  var watchScroll = function watchScroll() {
    console.log("Tabs Top: ", tabsTop);
    if ($scope.showNewCommentsIndicator){
      $scope.showNewCommentsIndicator = false;
    }
    // if ($scope.isPeelUser){
      if ($(document).scrollTop() > (tabsTop - headerHeight) && (docHeight - clientHeight) > (tabsTop + inputHeight - tabsHeight)) {
        tabs.addClass('fixTabsPeel');
        tabs.css('top',headerHeight);
        tabContainer.addClass('fixTabContainer');
        $('.commentsContainer').css('padding-top',$('#inputControls').height());
        fixed = true;
      } else if (fixed) {
        tabs.removeClass('fixTabsPeel');
        tabs.css('top','');
        tabContainer.removeClass('fixTabContainer');
        $('.commentsContainer').css('padding-top','');
        fixed = false;
      }
  };

  $(document).off('scroll');
  $(document).on('scroll', watchScroll);


}]);

