var topicModule = angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload","SocialModule"]);
topicModule.controller("TopicController", ["$scope", "$sce", "$window", "$location","$sanitize", "$timeout", "$routeParams","networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService",initTopicController]);

function initTopicController($scope, $sce, $window, $location, $sanitize, $timeout, $routeParams,networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService)
{
  var lastComment = false;
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
  }
  if(UserInfoService.isPeelUser() === true){
    $scope.isPeelUser = true;
    if (!UserInfoService.hasUserVisited()){
      console.log('USER HASNT VISITED');
      // SplashService.hidePeelSplash = false;
      $scope.hidePeelSplash = false;
      ForumStorage.setToLocalStorage("hasUserVisited", true);
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
  $scope.setScoreCardUI = function() {
    if ($scope.topicType === 'livegame'){
      if ($scope.isPeelUser){
        $('#topicSection').css('padding-top','54px');
      } else if ($scope.isSmartStadiumUser){
        $('#topicSection').css('padding-top','54px');
      } else {
        $('#topicSection').css('padding-top','0px');
      }
    } else {
      $('#topicDetails').removeClass('topicDetailsHeight');
    }
  };
//   $scope.setScoreCardUI = function(){
//     if($scope.isPeelUser === true)
//     {
//       if($scope.topicType === "livegame"){
//         document.getElementById('topicSection').style.paddingTop = "54px";
//         // document.getElementById('header').style.height = "114px";
//       }
//       else{
//       document.getElementById('topicSection').style.paddingTop = "0px";
//       // document.getElementById('header').style.height = "0px";
//       $('#topicDetails').removeClass('topicDetailsHeight');
      
//       var parent = document.getElementById("allScoresButtonLink");
//       var child = document.getElementById("allScoresButtonSpan");
//       if(parent !== null && child !== null )
//         parent.removeChild(child);
//       }
//     }
//     else
//     {
//       if($scope.topicType === "livegame"){
//         document.getElementById('topicSection').style.paddingTop = "0px";
//         document.getElementById('header').style.height = "114px";
//       }
//       else{
//         document.getElementById('topicSection').style.paddingTop = "0px";
//         $('#header').css('display','none');
//         $('#topicDetails').removeClass('topicDetailsHeight');
// //        var parent = document.getElementById("header");
// //        var child = document.getElementById("scoreCardContent");
//         var parent = document.getElementById("allScoresButtonLink");
//         var child = document.getElementById("allScoresButtonSpan");
//         if(parent !== null && child !== null )
//           parent.removeChild(child);
//       }
//     }
//   }
  
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
        if (tempComment.type === 'media'){
          tempComment.mediaAspectFeed = commentsdata[i].mediaAspectFeed;
          tempComment.mediaAspectFull = commentsdata[i].mediaAspectFull;
          tempComment.mediaThumbUrl = commentsdata[i].mediaThumbUrl;
        }
        tempComment.isLiked = commentsdata[i].signal.like;

        if (tempComment.type === 'embed'){
          tempComment.shared = true;
          tempComment.embed = commentsdata[i].embed;
          tempComment.embed.embedCreatedAt = commentsdata[i].embedCreatedAt;
          tempComment.embed.embedCreatedAtFull = commentsdata[i].embedCreatedAtFull;

          if (tempComment.providerName === "Twitter"){
            tempComment.embed.embedLogo = "img/twitterLogo@2x.png";
          } else {
            tempComment.embed.embedLogo = commentsdata[i].embed.provider.logo;
          }

          if (commentsdata[i].embed.type === 'link' && commentsdata[i].embed.playable === true){
            tempComment.embed.embedHtml = $sce.trustAsHtml(commentsdata[i].embedHtml);
          }
        }
        
        $scope.commentsArray.push(tempComment);

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
            $window.location = "/#/post/" + thisPost.id;
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
  else if (URIHelper.isPeelUser()){
    $scope.isPeelUser = true;
    $scope.setPeelUI(true);
    AuthService.loginWithPeel();
  }
  else {
    // console.log("Not logged in to facebook, take user to login page")
    if (HTML5_LOC){
      $location.path("/login");
    } else {
      $window.location = "/#/login";
    }
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
      $window.location = "/#/post/" + id;
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
        headerHeight = 30;
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
        fixed = true;
      } else if (fixed) {
        tabs.removeClass('fixTabsPeel');
        tabs.css('top','');
        tabContainer.removeClass('fixTabContainer');
        fixed = false;
      }
    // } else {
    //   if ($(document).scrollTop() > 96) {
    //     tabs.addClass('fixTabs');
    //     tabContainer.addClass('fixTabContainer');
    //   } else {
    //     tabs.removeClass('fixTabs');
    //     tabContainer.removeClass('fixTabContainer');
    //   }
    // }
  };

  $(document).off('scroll');
  $(document).on('scroll', watchScroll);


};

