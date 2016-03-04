angular.module("PostModule", ["NetworkModule", "SplashModule", "MediaModule", "angularFileUpload"])
.controller("PostController", ["$scope", "$sce", "$timeout", "$window", "$location","$sanitize", "$routeParams", "networkService","ReplyService", "TopicService","CommentService", "UserInfoService","URIHelper", "SplashService", "MUService", "FileUploader", "ForumStorage", "UserAgentService",

function ($scope, $sce, $timeout, $window, $location, $sanitize, $routeParams, networkService, ReplyService, TopicService, CommentService, UserInfoService,URIHelper,SplashService,MUService,FileUploader,ForumStorage,UserAgentService)
{

  // Check For Mobile Browser
  if (UserAgentService.isMobileUser()){
    $scope.mobileBrowser = true;
    $scope.mobileUserAgent = UserAgentService.getMobileUserAgent();
  } else {
    $scope.mobileBrowser = false;
  }

  // Retain & Handle State when Returning From External Links
  if (ForumStorage.getFromLocalStorage('hasUserVisited') === true){
    $scope.initPage();
  }
  var headerHeight;

	//ga('send', 'pageview', "/comment/"+$routeParams.postID);
	$scope.pageClass = 'page-post';

	$scope.postID = $routeParams.postID;
	$scope.topicId = TopicService.getTopicId();
	//$scope.replies = networkService.getRepliesForPostID();
	$scope.justReplied = false;
	
	ReplyService.setPostId($routeParams.postID);

	$scope.backToTopicButtonTapped = function()
	{
		var topicId = TopicService.getTopicId();
    var urlQueryStr = window.location.href.slice(window.location.href.indexOf('?'));
    if(topicId == undefined)
      topicId = $scope.comment.topicId;
    if (urlQueryStr !== undefined){
      $location.url("/topic/" + topicId + urlQueryStr);
    } else {
      $location.url("/topic/" + topicId);
    }
	}

	$scope.setPeelUI = function(userType){
		if (userType === 'peel') {
      $('#postSection').css('padding-top','104px');
      $('#backToChatContainer').css('margin-top','54px');
		} else if (userType === 'email') {
      $('#postSection').css('padding-top','104px');
    } else if (userType === 'MI16') {
      // $('#postSection').css('padding-top','54px');
		} else {
      $('#postSection').css('padding-top','50px');
    }
	}

  if (UserInfoService.isPeelUser()){
    $scope.isPeelUser = true;
    SplashService.hidePeelSplash = true;
    $scope.setPeelUI('peel');
  }
  else if (UserInfoService.isSmartStadiumUser()){
    $scope.isSmartStadiumUser = true;
    $scope.setPeelUI('email');
  }
  else if (UserInfoService.isMI16User() || UserInfoService.isMWCUser()){
    $scope.techMUser = true;
    $scope.setPeelUI();
  }
  else {
    $scope.techMUser = false;
    $scope.setPeelUI();
  }

	$scope.requestReplies = function(){
		// console.log("PostController requestReplies Invoked");
		networkService.send(ReplyService.getRepliesRequest($scope.postID));
		var selectedComment = CommentService.getCommentById($scope.postID);
		if(selectedComment != undefined){
			updateCommentInReply(selectedComment);
		}
		else{
      if (NETWORK_DEBUG)
			console.log("No data from comment service");
			networkService.send(CommentService.getCommentByIdRequest($scope.postID));
		}
	}

	$scope.peelClose = function()
	{
		console.log("peelClose()");
	}

	$scope.peelWatchOnTV = function()
	{
		ga('send', 'event', 'Peel', 'click', 'PeelWatchOnTV');
    if (GEN_DEBUG)
		console.log("peelWatchOnTV()");
		var showId = URIHelper.getPeelShowId();
		if(showId != undefined)
			window.location = "peel://tunein/"+showId;
		else
			window.location = "peel://home";
	}

	$scope.showNewRepliesIndicator = false;
	$scope.newRepliesIndicatorTapped = function()
	{
		if (GEN_DEBUG)
    console.log("newRepliesIndicatorTapped");
		$scope.showNewRepliesIndicator = false;
		updateReplies();
		window.scrollTo(0,document.body.scrollHeight);
	}

  $scope.checkDirectReply = function() {
    if (TopicService.directComment){
      $('#postCommentField').focus();
      TopicService.directComment = false;
    }
  }

	$scope.triggerRepliesKeyboard = function() {
    $('#postCommentField').focus();
	}

  $scope.secureLink = function(url, id) {
    if (UserInfoService.isGuestUser()){
      return "";
    } else {
      return url + id;
    }
  };
	
	$scope.initReplyPage = function(){
		$scope.pageClass = 'page-post';
		$scope.paddingTop = "20";
		// $scope.pageStyle = {'padding-top': '10em'};

		$scope.requestReplies();
    // $scope.loadingReply = true;
		var replyPostHeader = $("#replyPost").height();
		// console.log("height of repy header: " + replyPostHeader);
		var heightString = replyPostHeader + "px";
		// document.getElementById('postHeader').style.height = '3.5em';//heightString;
		// document.getElementById('postSection').style.paddingTop = '3.5em';
	  if ($scope.mobileBrowser === true){
      document.getElementById('postSection').style.paddingBottom = "42px";
    }

		$scope.$watch("replies", function (newValue, oldValue)
		 {
  			$timeout(function()
  			{
  				// setLinks();
          var replyDivs = document.getElementsByClassName("postRow");
          for (div in replyDivs){
            if (newValue != undefined){
              var thisReply = newValue[div];
              if (thisReply != undefined){
                var thisDiv = replyDivs[div];
                thisDiv.onclick = function(e) {
                  if ($(e.target).is('a')){
                    ForumStorage.setToLocalStorage('replyBookmark', this.id);
                    return;
                  }
                }
              }
            }
          }
    			$('.commentsContainer').each(function()
    			{
      				$('.image-link').magnificPopup({
        				type:'image'
     				});
    			});
  			});
		});
	}

	if(UserInfoService.isUserLoggedIn()){
		if(!networkService.isSocketConnected())
			networkService.init();
		$scope.initReplyPage();
	}
	else {
    $location.url("/login");
	}

	$scope.updateLikeComment = function(id) {
		// console.log("PostController updateLikeComment(" + id + ")");
		if(CommentService.isCommentLiked(id)){
			networkService.send(CommentService.getUnlikeCommentRequest(id));
		}
		else{
			networkService.send(CommentService.getLikeCommentRequest(id));	
		}
	};

	$scope.updateLikeReply = function(id) {
		// console.log("PostController Like Reply");
		if(ReplyService.isReplyLiked(id)){
			networkService.send(ReplyService.unlikeReplyRequest(id));
		}
		else{
			networkService.send(ReplyService.likeReplyRequest(id));
		}
	};

	$scope.deleteReply = function(id)
	{
		if (GEN_DEBUG)
    console.log("deleteReply(" + id + ")");
		networkService.send(ReplyService.deleteReplyRequest(id));
	}

	$scope.reportReplyAsSpam = function(id)
	{
		if (GEN_DEBUG)
    console.log("reportReplyAsSpam(" + id + ")");
		networkService.send(ReplyService.flagReplyRequest(id));
	}

  $scope.deleteComment = function(id)
  {
    if (GEN_DEBUG)
    console.log("deleteComment(" + id + ")");
    // $scope.innerButtonTapped = true;
    networkService.send(CommentService.deleteCommentRequest(id));
    $location.url("/topic/" + $scope.topicId);
    $window.location.reload();
  }

  $scope.reportCommentAsSpam = function(id)
  {
    if (GEN_DEBUG)
    console.log("reportCommentAsSpam(" + id + ")");
    // $scope.innerButtonTapped = true;
    networkService.send(CommentService.flagCommentRequest(id)); 
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

	function updateScore(){
		//Score update here
		$scope.leftTeam = TopicService.getTeamA();
		$scope.rightTeam = TopicService.getTeamB();
		var score = TopicService.getScore();
		if(score != undefined){
			$scope.leftTeamScore = score.points[0];
			$scope.rightTeamScore = score.points[1];
		}
		$scope.gameStatus = TopicService.getGameStatus();
		$scope.topicTitle = TopicService.getTitle();
		if($scope.gameStatus == "live") {
			$scope.gamePeriod = TopicService.getGamePeriod();
			$scope.gameClock = TopicService.getGameClock();
		}
	}

	 function updateCommentInReply(selectedComment){
    if (GEN_DEBUG)
		console.log("Already Had PostID: ", $scope.postID);
    if (!$scope.postID){
      $scope.postID = ReplyService.getPostId();
      if (GEN_DEBUG)
      console.log("Regenerated PostID: ", $scope.postID);
    }
    if(selectedComment == undefined){
			selectedComment = CommentService.getCommentById($scope.postID);
		}
		if(selectedComment != undefined){
			if(NETWORK_DEBUG) console.log("Updated comment in reply triggered" ); 
			var tempComment = {};
			tempComment = selectedComment;
			tempComment.postAuthorName = selectedComment.author.name;
			tempComment.postAuthorPhoto = selectedComment.author.photo;

			tempComment.postTimestamp = selectedComment.createdAt;
			tempComment.likeCount = selectedComment.metrics.likes;
			tempComment.replyCount = selectedComment.metrics.replies;
			tempComment.mediaAspectFeed = selectedComment.mediaAspectFeed;
			tempComment.isLiked = selectedComment.signal.like;
			tempComment.topicId = selectedComment.topicId;
      tempComment.isMyComment = UserInfoService.isCurrentUser(selectedComment.author.id);

      if (tempComment.type === 'media'){
          tempComment.mediaUrl = selectedComment.mediaUrl;
          // tempComment.trustedMediaUrl = $scope.trustSrc(tempComment.mediaUrl);
          tempComment.mediaAspectFeed = selectedComment.mediaAspectFeed;
          tempComment.mediaAspectFull = selectedComment.mediaAspectFull;
          tempComment.mediaAspectRatio = selectedComment.mediaAspectRatio;
          tempComment.mediaOrientation = selectedComment.mediaOrientation;
          tempComment.mediaThumbUrl = selectedComment.mediaThumbUrl;
        }

      if (tempComment.type === 'embed'){
        tempComment.shared = true;
        tempComment.embed = selectedComment.embed;
        tempComment.embed.embedCreatedAt = selectedComment.embedCreatedAt;
        tempComment.embed.embedCreatedAtFull = selectedComment.embedCreatedAtFull;

        if (tempComment.embedType === 'media'){
          tempComment.mediaUrl = selectedComment.embedMedia.mediaUrl;
          tempComment.mediaThumbUrl = selectedComment.embedMedia.mediaThumbUrl;
          tempComment.mediaAspectFeed = selectedComment.embedMedia.mediaAspectFeed;
          tempComment.mediaAspectFull = selectedComment.embedMedia.mediaAspectFull;
          tempComment.mediaAspectRatio = selectedComment.embedMedia.mediaAspectRatio;
          tempComment.mediaOrientation = selectedComment.embedMedia.mediaOrientation;
        }

        if (tempComment.providerName === "Twitter"){
          tempComment.embed.embedLogo = "img/twitterLogo@2x.png";
        } else {
          tempComment.embed.embedLogo = selectedComment.embed.provider.logo;
        }

        if (selectedComment.embed.type === 'link' && selectedComment.embed.playable === true){
          tempComment.embedHtml = selectedComment.embedHtml;
        }
      }

			$scope.comment = tempComment;
		}
	}

  // $scope.hideLoading = function(){
  //   console.log("HIDING LOAD");
  //   $scope.loadingReply = false;
  // };

	function updateReplies(){
		//TODO: check with ahmed, these values could be individual scope var.
		var repliesData = ReplyService.replies();
		var len = repliesData.length;

		$scope.replies = [];

		for(i=0;i<len;i++){
			var tempReply = {};
			tempReply = repliesData[i];
			tempReply.postAuthorName = repliesData[i].author.name;
			tempReply.postAuthorPhoto = repliesData[i].author.photo;
			tempReply.isMyReply = UserInfoService.isCurrentUser(repliesData[i].author.id);

			tempReply.postTimestamp = repliesData[i].createdAt;
			tempReply.likeCount = repliesData[i].metrics.likes;
			tempReply.replyCount = repliesData[i].metrics.replies;
			tempReply.mediaAspectFeed = repliesData[i].mediaAspectFeed;
			tempReply.isLiked = repliesData[i].signal.like;
			
      if (tempReply.type === 'media'){
          tempReply.mediaUrl = repliesData[i].mediaUrl;
          // tempReply.trustedMediaUrl = $scope.trustSrc(tempReply.mediaUrl);
          tempReply.mediaAspectFeed = repliesData[i].mediaAspectFeed;
          tempReply.mediaAspectFull = repliesData[i].mediaAspectFull;
          tempReply.mediaAspectRatio = repliesData[i].mediaAspectRatio;
          tempReply.mediaOrientation = repliesData[i].mediaOrientation;
          tempReply.mediaThumbUrl = repliesData[i].mediaThumbUrl;
        }
      if (tempReply.type === 'embed'){
        tempReply.shared = true;
        tempReply.embed = repliesData[i].embed;
        tempReply.embed.embedCreatedAt = repliesData[i].embedCreatedAt;
        tempReply.embed.embedCreatedAtFull = repliesData[i].embedCreatedAtFull;

        if (tempReply.providerName === "Twitter"){
          tempReply.embed.embedLogo = "img/twitterLogo@2x.png";
        } else {
          tempReply.embed.embedLogo = repliesData[i].embed.provider.logo;
        }

        if (repliesData[i].embed.type === 'link' && repliesData[i].embed.playable === true){
          tempReply.embed.embedHtml = $sce.trustAsHtml(repliesData[i].embedHtml);
        }
      }

      $scope.replies.push(tempReply);

			// console.log(i +" : updated replies html : " +$scope.replies[i].html);
			// console.log(i +" : updated replies author name: " +$scope.replies[i].postAuthorName);
			// console.log(i +" : updated replies author photo: " +$scope.replies[i].postAuthorPhoto);

			if($scope.replies[i].type == "media"){
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaUrl);
				// console.log(i +" : updated replies media : " +$scope.replies[i].mediaAspectFeed);
			}
			//console.log(i +" : updated replies likecount : " +$scope.replies[i].likeCount);

		}

		if($scope.justReplied == true)
		{
			setTimeout(function()
				{ 
					window.scrollTo(0,document.body.scrollHeight);
					$scope.justReplied = false;
				}, 1000);
		}
	}
	 
	 var notifyNewReplies = function(){

		 if($scope.replies == undefined)
		 {
			 updateReplies();
		 }
		 else {
			 var repliesData = ReplyService.replies();
			 var len = repliesData.length;
			 if($scope.replies.length < len ){
				 //console.log("newReplies triggered");
				 if(!UserInfoService.isCurrentUser(repliesData[len-1].author.id)){
					 $scope.showNewRepliesIndicator = true;
				 }
				 else{
					 updateReplies();
				 }
			 }
			 else{
				 updateReplies();
			 }

		 }
	 }
	 
	ReplyService.registerObserverCallback(notifyNewReplies);
	TopicService.registerObserverCallback(updateScore);
	CommentService.registerObserverCallback(updateCommentInReply);

	$scope.trustSrc = function(src)
	{
    	return $sce.trustAsResourceUrl(src);
  	}

  $window.addEventListener("beforeunload", function(){
    ForumStorage.setToLocalStorage("hasUserVisited", true);
  });

  $scope.xLinkActivated = false;


}]);

