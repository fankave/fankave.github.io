var postModule = angular.module("PostModule", ["NetworkModule", "SplashModule", "MediaModule", "angularFileUpload"]);
postModule.controller("PostController", ["$scope", "$sce", "$timeout", "$window", "$location","$sanitize", "$routeParams", "networkService","ReplyService", "TopicService","CommentService", "UserInfoService","URIHelper", "SplashService", "MUService", "FileUploader", "ForumStorage", initPostController]);

function initPostController($scope, $sce, $timeout, $window, $location, $sanitize, $routeParams, networkService, ReplyService, TopicService, CommentService, UserInfoService,URIHelper,SplashService,MUService,FileUploader,ForumStorage)
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

  // Retain & Handle State when Returning From External Links
  if (ForumStorage.getFromLocalStorage('hasUserVisited') === true){
    console.log("Checking For Existing Session");
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
		if(topicId == undefined)
			topicId = $scope.comment.topicId;
    if (HTML5_LOC){
		  $location.path("/topic/"+topicId);
    } else {
      $window.location = "#/topic/" + topicId;
    }
	}

	$scope.setPeelUI = function(userType){
		console.log("Post User Type: ", userType);
		if (userType === 'peel') {
			$('#postSection').css('padding-top','54px');
		} else if (userType === 'email') {
      $('#postSection').css('padding-top','30px');
		} else {
      $('#postSection').css('padding-top','0px');
    }
	}

  var _userType = UserInfoService.getUserType();
	if (_userType === 'peel'){
		$scope.isPeelUser = true;
		SplashService.hidePeelSplash = true;
	}
	else if (_userType === 'email'){
		$scope.isSmartStadiumUser = true;
	}
	$scope.setPeelUI(_userType);

	$scope.requestReplies = function(){
		// console.log("PostController requestReplies Invoked");
		networkService.send(ReplyService.getRepliesRequest($scope.postID));
		var selectedComment = CommentService.getCommentById($scope.postID);
		if(selectedComment != undefined){
			updateCommentInReply(selectedComment);
		}
		else{
			console.log("No data from comment service : TODO handle this with cookies");
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
		console.log("newRepliesIndicatorTapped");
		$scope.showNewRepliesIndicator = false;
		updateReplies();
		window.scrollTo(0,document.body.scrollHeight);
	}

	$scope.triggerRepliesKeyboard = function()
	{
		document.getElementById("postCommentField").focus();
	}
	
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
                    console.log("EXTERNAL LINK: ", e, this.id);
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
		if (HTML5_LOC){
      $location.path("/login");
    } else {
      $window.location = "#/login";
    }
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
		console.log("deleteReply(" + id + ")");
		networkService.send(ReplyService.deleteReplyRequest(id));
	}

	$scope.reportReplyAsSpam = function(id)
	{
		console.log("reportReplyAsSpam(" + id + ")");
		networkService.send(ReplyService.flagReplyRequest(id));
	}

  $scope.deleteComment = function(id)
  {
    console.log("deleteComment(" + id + ")");
    // $scope.innerButtonTapped = true;
    networkService.send(CommentService.deleteCommentRequest(id));
    if (HTML5_LOC){
      $location.path("/topic/" + $scope.topicId);
    } else {
      $window.location = "#/topic/" + $scope.topicId;
    }
    $window.location.reload();
  }

  $scope.reportCommentAsSpam = function(id)
  {
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
		console.log("Scores updated in replies");
	}

	 function updateCommentInReply(selectedComment){
		console.log("Already Had PostID: ", $scope.postID);
    if (!$scope.postID){
      $scope.postID = ReplyService.getPostId();
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

      if (tempComment.type === 'embed'){
        tempComment.shared = true;
        tempComment.embed = selectedComment.embed;
        tempComment.embed.embedCreatedAt = selectedComment.embedCreatedAt;
        tempComment.embed.embedCreatedAtFull = selectedComment.embedCreatedAtFull;

        if (tempComment.providerName === "Twitter"){
          tempComment.embed.embedLogo = "img/twitterLogo@2x.png";
        } else {
          tempComment.embed.embedLogo = selectedComment.embed.provider.logo;
        }

        if (selectedComment.embed.type === 'link' && selectedComment.embed.playable === true){
          tempComment.embed.embedHtml = $sce.trustAsHtml(selectedComment.embedHtml);
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
		if(TopicService.directComment === true)
		{
			$scope.triggerRepliesKeyboard();
			TopicService.directComment = false;
		}

		if($scope.justReplied == true)
		{
			setTimeout(function()
				{ 
					console.log("Scroll to last reply");
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
    console.log("Before Unload");
    ForumStorage.setToLocalStorage("hasUserVisited", true);
  });

  $scope.xLinkActivated = false;


};

// postModule.directive('repeatReplyFinished', function () {
//   return function (scope, element, attrs) {
//     if (scope.$last){
//       // scope.scrollToBookmark();
//       console.log("DONE LOADING REPLIES");
//       scope.hideLoading();
//     }
//   };
// });
