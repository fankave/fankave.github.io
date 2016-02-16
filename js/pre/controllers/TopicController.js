angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload","SocialModule"])
.controller("TopicController", ["$scope", "$state", "$stateParams", "$sce", "$window", "$location","$sanitize", "$timeout", "networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService","UserAgentService",

function ($scope, $state, $stateParams, $sce, $window, $location, $sanitize, $timeout, networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService, UserAgentService)
{
  var sessionTime = window.time;
  // Check For Mobile Browser
  if (UserAgentService.isMobileUser()){
    $scope.mobileBrowser = true;
    $scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
    if (GEN_DEBUG) console.log("MOBILE USER AGENT: ", $scope.mobileUserAgent);
  } else {
    $scope.mobileBrowser = false;
  }

  //Google Analytics code
  if((ChannelService.getChannel() == undefined ) && (TopicService.getChannel() == undefined)){
    ga('send', 'pageview', "/topic/", $stateParams.topicID);
    if (GEN_DEBUG)
    console.log('Sent Pageview from /topic/', $stateParams.topicID);
  }
  
  TopicService.setTopicId($stateParams.topicID);
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
  else if ($stateParams.MI16 || UserInfoService.isMI16User()){
    $scope.isMI16User = true;
  }
  else if ($stateParams.MWC || UserInfoService.isMWCUser()){
    $scope.isMWCUser = true;
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
        networkService.send(TopicService.watchTopicRequest($stateParams.topicID));
      }
      
      $scope.setScoreCardUI();
      if($scope.topicType == "livegame"){
        console.log("Inside topic set :", TopicService.getTeamA());
        $scope.leftTeam = TopicService.getTeamA();
        $scope.rightTeam = TopicService.getTeamB();
        var score = TopicService.getScore();
        if(score != undefined){
          $scope.leftTeamScore = score.points[0];
          $scope.rightTeamScore = score.points[1];
        }
        $scope.gameStatus = TopicService.getGameStatus();

        if($scope.gameStatus == "live") {
          $scope.gamePeriod = TopicService.getGamePeriod();
          $scope.gameClock = TopicService.getGameClock();
        }

        $scope.gameScheduledTime = TopicService.getGameTime();
        $scope.allScoresTitle = TopicService.getScoresTitle();
        $scope.allScoresURL = TopicService.getScoresLink();

        var left = $('.scoreCardContent');
        var right = $('.svg-content');
        left.css('background-color', $scope.leftTeam.pColor);
        right.css('fill', $scope.rightTeam.pColor);
      }
      $scope.topicTitle = TopicService.getTitle();
      var thisTopic = TopicService.getTopic();
      $scope.topicDescHtml = thisTopic.html;
      if(thisTopic.type == "media"){
      $scope.topicMediaUrl = thisTopic.mediaUrl;
      $scope.topicMediaAspectFeed = thisTopic.mediaAspectFull;
      }

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
          
  $scope.init = function() {
    networkService.send(TopicService.getTopicRequest($stateParams.topicID));
  };

  $scope.setPeelUI = function(isPeelUser){
    $scope.isPeelUser = isPeelUser;
    
  };
  
  $scope.setPeelUI($scope.isPeelUser);

  $scope.initPage = function(){
    updateTopic();
    $scope.pageClass = 'page-topic';

    $scope.topicID = $stateParams.topicID;
    $scope.init();

    if ($scope.mobileBrowser === true){
      document.getElementById('topicSection').style.paddingBottom = "42px";
    }
  };

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
    $state.go('login', $stateParams);
  }
  else if (URIHelper.isMWCUser()){
    $state.go('login', $stateParams);
  }
  else if (URIHelper.isPeelUser()){
    $scope.isPeelUser = true;
    $scope.setPeelUI(true);
    AuthService.loginWithPeel();
  }
  else {
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

  $scope.newCommentsAvailable = false;
  $scope.showNewComments = function() {
    // Broadcast to Chat Controller
    $scope.$broadcast('viewNewComments');
  };

  $scope.imageClick = function(imageURL) {
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();

    $.magnificPopup.open({
      items: {
        type:'image',
        src: imageURL,
      },
      type: 'inline',
      callbacks: {
        open: function(){
          $('body').bind('touchmove', function(e){e.preventDefault()})
        },
        close: function(){
          $('body').unbind('touchmove')
        }
      }
    });
  };

  $scope.updateLikeTopic = function() {
    console.log("TopicController update like Topic");
    if(TopicService.getLiked() == true)
      networkService.send(TopicService.getUnlikeTopicRequest());
    else
      networkService.send(TopicService.getLikeTopicRequest());  
  };

  $scope.commentOnTopic = function() {
    document.getElementById("topicCommentField").focus();
  };

  TopicService.registerObserverCallback(updateTopic);

  // CONTENT TABS
  $scope.switchTabs = function(tab) {
    if (tab === 'chat'){
      $('#chatTab').addClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $state.go('topic.chat');
      $(document).scrollTop(0);
      updateTopic();
    }
    if (tab === 'video'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').addClass('selectedTab');
      $('#socialTab').removeClass('selectedTab');
      $state.go('topic.video');
      $(document).scrollTop(0);
    }
    if (tab === 'social'){
      $('#chatTab').removeClass('selectedTab');
      $('#videoTab').removeClass('selectedTab');
      $('#socialTab').addClass('selectedTab');
      $state.go('topic.social');
      $(document).scrollTop(0);
    }
  };

  $scope.initializeTab = function() {
    console.log("Initializing Tabs");
    if ($state.includes("topic.chat")){
      console.log("In Chat");
      $('#chatTab').addClass('selectedTab');
    }
    else if ($state.includes("topic.video")){
      console.log("In Video");
      $('#videoTab').addClass('selectedTab');
    }
    else if ($state.includes("topic.social")){
      console.log("In Social");
      $('#socialTab').addClass('selectedTab');
    }
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
    // console.log("Setting Doc Vars");
    if (!docVarsSet){
      tabs = $('#inputControls').first();
      tabContainer = $('.tabContainer').first();
      tabsTop = tabs.offset().top;
      tabsHeight = tabContainer.height();
      inputHeight = tabs.height();
      clientHeight = document.documentElement.clientHeight;
      docHeight = $(document).height();
      if ($scope.isSmartStadiumUser){
        headerHeight = 54;
      } else if ($scope.isPeelUser){
        headerHeight = 54;
      } else {
        headerHeight = 0;
      }
      docVarsSet = true;
    }
  };

  var fixed = false;
  var watchScroll = debounce(function() {
    $scope.setDocVars();
    if (GEN_DEBUG) console.log("Tabs Top: ", tabsTop);
    if ($scope.showNewCommentsIndicator){
      $scope.showNewCommentsIndicator = false;
      $scope.$apply();
    }
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
  }, 50);

  $(document).off('scroll');
  $(document).on('scroll', watchScroll);



}]);

