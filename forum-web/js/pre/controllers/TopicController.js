angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload","SocialModule"])
.controller("TopicController", ["$scope", "$rootScope", "$sce", "$window", "$location","$sanitize", "$timeout", "$interval", "$routeParams","networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService","UserAgentService",

function ($scope, $rootScope, $sce, $window, $location, $sanitize, $timeout, $interval, $routeParams,networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService, UserAgentService)
{
  var sessionTime = window.time;
  var lastComment = false;
  // Check For Mobile Browser
  if (UserAgentService.isMobileUser()){
    $scope.mobileBrowser = true;
    $scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
    if (GEN_DEBUG)
    console.log("MOBILE USER AGENT: ", $scope.mobileUserAgent);
  } else {
    $scope.mobileBrowser = false;
  }

  // Check User Credentials
  if(UserInfoService.isUserLoggedIn()){
    if(NETWORK_DEBUG)
      console.log("User is logged in, checking for connection");
    if(!networkService.isSocketConnected())
      networkService.init();
    initPage();
  }
  else if (URIHelper.isSmartStadiumUser()){
    console.log("SS User? ", $scope.isSmartStadiumUser);
    AuthService.loginWithEmail(initPage);
  }
  else if (URIHelper.isTechMUser()){
    console.log("Topic Found MI16");
    $location.url("/login?MI16=true");
  }
  else if (URIHelper.isMWCUser()){
    console.log("Topic Found MWC");
    $location.url("/login?MWC=true");
  }
  else if (URIHelper.isPeelUser()){
    AuthService.loginWithPeel(initPage);
  }
  else {
    AuthService.loginAsGuest(initPage);
  }

  if (!$scope.commentsArray){
    $scope.loadingChat = true;
  }

  //Google Analytics code
  if((ChannelService.getChannel() == undefined ) && (TopicService.getChannel() == undefined)){
     ga('send', 'pageview', "/topic/"+$routeParams.topicID);
     if (GEN_DEBUG)
     console.log('Sent Pageview from /topic/' + $routeParams.topicID);
  }
  
  TopicService.setTopicId($routeParams.topicID);
  $scope.topicType = "livegame";
  $scope.innerButtonTapped = false;

  // Set User-Specific UI Variables
  if (UserInfoService.isSmartStadiumUser()){
    $scope.isSmartStadiumUser = true;
    // if (!UserInfoService.hasUserVisited()){
      if (GEN_DEBUG)
      console.log('SS USER HASNT VISITED');
      $scope.hideSSSplash = false;
      ForumStorage.setToLocalStorage("hasUserVisited", true);
      $timeout(function() {$scope.continueToExperience('smartS'); }, 7000);
    // }
  }
  else if (UserInfoService.isMI16User() || URIHelper.isTechMUser()){
    $scope.isMI16User = true;
  }
  else if (UserInfoService.isMWCUser() || URIHelper.isMWCUser()){
    $scope.isMWCUser = true;
  }
  else if(UserInfoService.isPeelUser()){
    $scope.isPeelUser = true;
    if (!URIHelper.getPeelShowId()){
      $scope.peelShowId = false;
    } else {
      $scope.peelShowId = true;
    }
    // if (!UserInfoService.hasUserVisited()){
    //   if (GEN_DEBUG)
    //   console.log('PEEL USER HASNT VISITED');
    //   if (URIHelper.isSuperBowl()){
    //     $scope.SBSplash = true;
    //   }
    //   $scope.hidePeelSplash = false;
    //   ForumStorage.setToLocalStorage("hasUserVisited", true);
    //   $timeout(function() {$scope.continueToExperience('peel'); }, 5000);
    // }
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
    if (GEN_DEBUG)
    console.log("CONTINUE XP CLICKED");
    if (env === 'peel'){
      SplashService.setPeelSplash(true);
      $scope.hidePeelSplash = true;
    } else if (env === 'smartS'){
      SplashService.setSSSplash(true);
      $scope.hideSSSplash = true;
    }
  };
  function setScoreCardUI() {
    if ($scope.topicType === 'livegame'){
      if ($scope.isPeelUser && $scope.peelShowId){
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

  // CONTENT TABS
  $scope.activeTab = 'chat';
  $scope.switchTabs = function(tab) {
    var t = (window.time - sessionTime);
    if($scope.activeTab  != tab ){
      AnalyticsService.browseSessionEvent($scope.activeTab)
    }
    AnalyticsService.addSession();
    console.log("ACTIVE TAB ********* " + $scope.activeTab + "TIME SPENT : "+ t );
      ga('send', 'event', 'Tabs','ActiveTab', $scope.activeTab);
      ga('send', 'event', 'Tabs','TabSessionLength', $scope.activeTab, t);
    sessionTime = window.time ;

    if (tab === 'chat'){
      $scope.activeTab = 'chat';
      $(document).scrollTop(0);
      init();
      $scope.newVideoAvailable = false;
      $scope.newSocialAvailable = false;
    }
    if (tab === 'video'){
      $scope.activeTab = 'video';
      $(document).scrollTop(0);
      $scope.newSocialAvailable = false;
    }
    if (tab === 'social'){
      $scope.activeTab = 'social';
      $(document).scrollTop(0);
      $scope.newVideoAvailable = false;
    }
    if (GEN_DEBUG)
    console.log("Active Tab: ", $scope.activeTab);
  };
  
  function updateTopic(){
    if(TopicService.getTopic() !== undefined){
      $scope.topicType = TopicService.getTopicType();
      if(TopicService.isWatchingTopic() === false){
        networkService.send(TopicService.getFollowChannelRequest());
        networkService.send(TopicService.watchTopicRequest($routeParams.topicID));
      }
      
      
      setScoreCardUI();
      if($scope.topicType == "livegame"){
        if (GEN_DEBUG)
        console.log("Inside topic set :"+ TopicService.getTeamA());
        
        // Determine if game type is cricket
        $scope.isCricket = TopicService.isGameCricket();
        if ($scope.isCricket && !$scope.$$phase){
          $scope.$apply();
        }

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
          if ($scope.isCricket){
            $scope.offenseTeam = TopicService.getOffense().team;
            $scope.offensePosition = TopicService.getOffense().position;
          }
        }
        if ($scope.gameStatus === "past" && $scope.isCricket){
          $scope.gameSummary = TopicService.getGameSummary();
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
      if (!URIHelper.tabEntry()){
        if (URIHelper.getActiveTab() === 'video'){
          $rootScope.$broadcast('videoActive');
        }
        if (URIHelper.getActiveTab() === 'social'){
          $rootScope.$broadcast('socialActive');
        }
      }
    }
  }

  function updateComments(){
    var commentsdata = CommentService.comments();
    // if (load){
    //   $scope.showNewCommentsIndicator = false;
    // }
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

  }

  $scope.loadRemainingComments = function() {
    if (GEN_DEBUG)
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
          if (GEN_DEBUG)
          console.log("LOADING REST OF COMMENTS...");
          networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
          $scope.loadedAllComments = true;
          CommentService.setLoadedComments(true);
        }
      }, 7000);
  };

  function init() {
    networkService.send(TopicService.getTopicRequest($routeParams.topicID));
    networkService.send(CommentService.getCommentsRequest($routeParams.topicID));
    AnalyticsService.joinSessionEvent(ChannelService.getChannel(),$routeParams.topicID);
  };

  $scope.hideLoading = function(){
    if (GEN_DEBUG)
    console.log("HIDING LOAD");
    $scope.loadingChat = false;
    $scope.loadingSocial = false;
  };
  function initPage(){
    if (URIHelper.getActiveTab() === 'video'){
      $rootScope.leftTab = 'video';
    }
    else if (URIHelper.getActiveTab() === 'social'){
      $rootScope.leftTab = 'social';
    }
    else {
      $rootScope.leftTab = 'chat';
    }
    updateTopic();
    updateComments();
    $scope.pageClass = 'page-topic';
    $scope.showNewCommentsIndicator = false;

    $scope.topicID = $routeParams.topicID;
    init();

    // Comment/Uncomment to Disable/Enable Auto Refresh
    initAutoRefresh();

    $scope.newVideoAvailable = false;
    $scope.newSocialAvailable = false;

    if ($scope.mobileBrowser === true && !URIHelper.embedded()){
      document.getElementById('topicSection').style.paddingBottom = "42px";
    }
  }

  // Auto Refresh
  function initAutoRefresh () {
    registerAutoCallbacks();
    if (TopicService.currentTimer()){
      $interval.cancel(TopicService.currentTimer(false));
    }
    var timer = $interval(function(){
      if (GEN_DEBUG) console.log("$AUTO$ CHECK NEW SOCIAL/VIDEO");
      networkService.send(SocialService.getSocialDataRequestAuto(TopicService.getChannelId()));
      // Video tab does not exist for MWC/MI16 users
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
        if ($scope.activeTab === 'social'){
          // If user is on tab during first interval, don't show indicator
          if (prevLength !== 0){
            $scope.newSocialAvailable = true;
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
        if ($scope.activeTab === 'video'){
          // If user is on tab during first interval, don't show indicator
          if (prevLength !== 0){
            $scope.newVideoAvailable = true;
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
    el.classList.remove('pulse');
    el.offsetWidth = el.offsetWidth;
    el.classList.add('pulse');
  }


  $scope.viewPost = function(e,id){
    // Check for url query string
    if (window.location.href.indexOf('?') !== -1){
      var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
    }
    // If target is an external link, do nothing
    if ($(e.target).is('a')){
      return;
    }
    // If auto-refresh timer is running, clear it before navigating to post
    if (TopicService.currentTimer()){
      $interval.cancel(TopicService.currentTimer(false));
    }
    VideoService.resetVideoOffset();
    SocialService.resetSocialOffset();
    // Pass along query string if present when navigating to post
    if (urlQueryStr !== undefined){
      $location.url("/post/" + id + urlQueryStr);
    } else {
      $location.url("/post/" + id);
    }
  }

  $scope.peelClose = function()
  {
    ga('send', 'event', 'Peel', 'click', 'BackToPeelHome');
     var t = (window.time - sessionTime);
      ga('send', 'event', 'Tabs','TabSessionLength', $scope.activeTab, t);
      sessionTime = window.time;
      //AnalyticsService.printEventStack();
    if (GEN_DEBUG)
    console.log("peelClose()");
    window.location = "peel://home";
  }

  $scope.peelWatchOnTV = function()
  {
    ga('send', 'event', 'Peel', 'click', 'PeelWatchOnTV');
    if (GEN_DEBUG)
    console.log("peelWatchOnTV()");
    var showId = URIHelper.getPeelShowId();
    // var t = (window.time - sessionTime);
    //   ga('send', 'event', 'Tabs','TabSessionLength', $scope.activeTab, t);
    //   sessionTime = window.time;
    if (GEN_DEBUG)
    console.log("Peel show on TV uri :  "+ "peel://tunein/"+showId+ "?action=SendIRorReminder&post_action=None");
    if(showId != undefined)
      window.location = "peel://tunein/"+showId+"?action=SendIRorReminder&post_action=None";
    else
      window.location = "peel://home";
  }

  $scope.showNewCommentsIndicator = false;
  $scope.newCommentsIndicatorTapped = function()
  {
    if (GEN_DEBUG)
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
          $('body').bind('touchmove', function(e){e.preventDefault()})
        },
        close: function()
        {
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
    if (GEN_DEBUG)
    console.log("TopicController update like Topic");
    if(TopicService.getLiked() == true)
      networkService.send(TopicService.getUnlikeTopicRequest());
    else
      networkService.send(TopicService.getLikeTopicRequest());  
  };

  $scope.commentOnTopic = function()
  {
    document.getElementById("topicCommentField").focus();
  };

  $scope.updateLikeComment = function(id) {
    $scope.innerButtonTapped = true;
    
    // event.cancelBubble = true;
    // if(event.stopPropagation) event.stopPropagation();
    if (GEN_DEBUG)
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
    if (GEN_DEBUG)
    console.log("deleteComment(" + id + ")");
    if ($scope.commentsArray.length === 1){
      if (GEN_DEBUG)
      console.log("Deleting Final Comment");
      lastComment = true;
    }
    $scope.innerButtonTapped = true;
    networkService.send(CommentService.deleteCommentRequest(id));
  }

  $scope.reportCommentAsSpam = function(id)
  {
    if (GEN_DEBUG)
    console.log("reportCommentAsSpam(" + id + ")");
    $scope.innerButtonTapped = true;
    networkService.send(CommentService.flagCommentRequest(id)); 
  }

  $scope.goToRepliesWithKeyboardTriggered = function(id)
  {
    // Check for url query string
    if (window.location.href.indexOf('?') !== -1){
      var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
    }
    TopicService.directComment = true;
    VideoService.resetVideoOffset();
    SocialService.resetSocialOffset();
    // Pass along query string if present when navigating to post
    if (urlQueryStr !== undefined){
      $location.url("/post/" + id + urlQueryStr);
    } else {
      $location.url("/post/" + id);
    }
  };

  $scope.secureLink = function(url, id) {
    if (UserInfoService.isGuestUser()){
      return "";
    } else {
      return url + id;
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
  CommentService.registerObserverCallback(
    function(){updateComments(true);}, true);

  $scope.trustSrc = function(src)
  {
    return $sce.trustAsResourceUrl(src);
  }

  $window.addEventListener("beforeunload", function(){
    if (GEN_DEBUG)
    console.log("Before Unload");
    AnalyticsService.leaveSessionEvent(ChannelService.getChannel(),$routeParams.topicID);
    networkService.closeSocket();
    // ForumStorage.setToLocalStorage("lastTabActive", $scope.activeTab);
  });

  $scope.xLinkActivated = false;

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
      } else if ($scope.isPeelUser && $scope.peelShowId){
        headerHeight = 54;
      } else {
        headerHeight = 0;
      }
    }
  };

  var fixed = false;
  var watchScroll = function watchScroll() {
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

