var topicModule = angular.module("TopicModule", ["NetworkModule", "SplashModule", "AuthModule", "MediaModule", "angularFileUpload"]);
topicModule.controller("TopicController", ["$scope", "$sce", "$window", "$sanitize", "$timeout", "$routeParams","networkService", "TopicService","CommentService", "UserInfoService","URIHelper","AuthService","SplashService","MUService","ForumStorage","FileUploader","SocialService","ChannelService",initTopicController]);

function initTopicController($scope, $sce, $window, $sanitize, $timeout, $routeParams,networkService,TopicService, CommentService, UserInfoService, URIHelper, AuthService, SplashService,MUService,ForumStorage,FileUploader,SocialService, ChannelService)
{
  

  ga('send', 'pageview', "/topic/"+$routeParams.topicID);
  console.log('Sent Pageview from /topic/' + $routeParams.topicID);
  
  TopicService.setTopicId($routeParams.topicID);
  $scope.topicType = "livegame";
  $scope.innerButtonTapped = false;
  if((UserInfoService.isPeelUser() === true)){
    $scope.isPeelUser = true;
    $timeout(function() {$scope.continueToExperience(); }, 5000);
  }
  else {
    $scope.isPeelUser = false;  
    SplashService.hidePeelSplash = true;
    $scope.hidePeelSplash = SplashService.hidePeelSplash;
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
  $scope.hidePeelSplash = SplashService.hidePeelSplash;

  $scope.continueToExperience = function() {
    SplashService.hidePeelSplash = true;
    $scope.hidePeelSplash = SplashService.hidePeelSplash;
  };

  $scope.setScoreCardUI = function(){
    if($scope.isPeelUser === true)
    {
      if($scope.topicType == "livegame"){
        document.getElementById('topicSection').style.paddingTop = "177px";
        document.getElementById('header').style.height = "177px"; 
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
      $scope.commentsCount = metrics.comments;

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

    document.getElementById('topicSection').style.paddingBottom = "3.9em";

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

  $scope.postComment = function(commentText) {
    if((commentText !== undefined) && commentText !== ""){
      // console.log("TopicController postComment Invoked :"+ commentText);
      if (uploader.queue.length > 0){
        MUService.setCommentParams($scope.topicID, commentText, true);
      } else {
        networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
      }
    }
    uploader.uploadAll();
    $scope.commentText = "";
    document.getElementById("topicCommentField").blur();
    document.getElementById("postCommentButton").blur();
    $(document).scrollTop(0);
  };

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

      $scope.socialArray = [];

      for (var i = 0; i < len; i++){
        var tempSocial = socialData[i];
        tempSocial.postAuthorName = socialData[i].embedAuthor.name;
        tempSocial.postAuthorAlias = socialData[i].embedAuthor.alias;
        tempSocial.postAuthorPhoto = socialData[i].embedAuthor.photo;
        tempSocial.postTimestamp = socialData[i].createdAt;

        tempSocial.isLiked = socialData[i].signal.like;
        tempSocial.providerName = socialData[i].embedProvider.name;
        tempSocial.providerLogo = socialData[i].embedProvider.logo;
        tempSocial.html = socialData[i].embedText;
        tempSocial.likeCount = socialData[i].metrics.likes;
        tempSocial.replyCount = socialData[i].metrics.replies;

        tempSocial.embedType = socialData[i].embedType;
        if (socialData[i].embedType === "media"){
          tempSocial.mediaType = socialData[i].embedMedia.mediaType;
          tempSocial.mediaUrl = socialData[i].embedMedia.mediaUrl;
          tempSocial.mediaAspectFeed = socialData[i].embedMedia.mediaAspectFeed;
          tempSocial.mediaAspectFull = socialData[i].embedMedia.mediaAspectFull;
        }

        $scope.socialArray.push(tempSocial);
      }
    }
  };

  var notifyNewSocial = function() {
    // if (!$scope.socialArray){
      updateSocial();
    // }
  };

  SocialService.registerObserverCallback(notifyNewSocial);
  TopicService.registerObserverCallback(updateTopic);
  CommentService.registerObserverCallback(notifyNewComments);

  $scope.trustSrc = function(src)
  {
    return $sce.trustAsResourceUrl(src);
  }

  $window.addEventListener("beforeunload", function(){
    console.log("Before Unload");
    ForumStorage.setToLocalStorage("hasUserVisited", true);
  });

  $scope.xLinkActivated = false;

  function setLinks() {
    $('.postContent > a').click(function(){
      $('#xContent').css('display', 'block');
    });
  };
  
  $scope.backToChat = function() {
    $('#xContent').css('display', 'none');
  };


  // ATTACH MEDIA
  var MUS_SERVER_URI = 'https://dev.fankave.com:8080';
  var UPLOAD_URL = '/v1.0/media/upload';

  var uploader = $scope.uploader = new FileUploader({
    url: MUS_SERVER_URI + UPLOAD_URL,
    autoUpload: false,
    removeAfterUpload: true
  });

  $scope.mediaType;
  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      var itemType = item.type;
      if(itemType.indexOf("image") != -1){
        $scope.mediaType = "image";
        return this.queue.length < 1 && (item.size < 1048576);
      }
      else if(itemType.indexOf("video") != -1){
        $scope.mediaType = "video";
        return this.queue.length < 1 && (item.size < 10485760);
      }
      return this.queue.length < 10;
    }
  });

  function generateImagePreview(evt) {
    var f = evt.target.files[0];
    console.log('F:', f);

    if (!f.type.match('image.*')) {
      return;
    }

    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="',
          e.target.result,
          '" title="', $sanitize(theFile.name),
          '"/>'].join('');
        document.getElementById('preview').insertBefore(span, null);
        };
      })(f);
      reader.readAsDataURL(f);
    };

  document.getElementById('fileUpload').addEventListener('change',
    generateImagePreview, false);

  // CALLBACKS
  $scope.fileMaxExceeded = false;
  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
    $scope.fileMaxExceeded = true;
    $timeout(function(){$scope.fileMaxExceeded = false;}, 5000);
  };
  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);

  };
  uploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  uploader.onBeforeUploadItem = function(item) {
    var user = UserInfoService.getUserCredentials();
    item.headers = {  
        'X-UserId': user.userId,
        'X-SessionId': user.sessionId,
        'X-AccessToken': user.accessToken};
    item.formData =[{'type':item._file.type},{'size': item._file.size},{'file': item._file}];

    console.info('onBeforeUploadItem', item);
  };
  uploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  uploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  uploader.onSuccessItem = function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
      networkService.send(MUService.postMediaRequest(response));
  };
  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
    uploader.clearQueue();
  };

  console.info('uploader', uploader);


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
  };

  TopicService.setChannel(ChannelService.getChannel());
  $scope.loadTab = function(tab) {
    console.log("Switched to Tab: ", tab);
    if (tab === 'social' && !$scope.socialArray){
      // console.log("Tab Channel: ", ChannelService.getChannel());
      networkService.send(SocialService.getSocialDataRequest(ChannelService.getChannel()));
      // updateSocial();
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

  $(document).on('scroll', watchScroll);


}
