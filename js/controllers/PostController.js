var postModule = angular.module("PostModule", ["NetworkModule", "SplashModule", "MediaModule", "angularFileUpload"]);
postModule.controller("PostController", ["$scope", "$sce", "$timeout", "$window", "$sanitize", "$routeParams", "networkService","ReplyService", "TopicService","CommentService", "UserInfoService","URIHelper", "SplashService", "MUService", "FileUploader", initPostController]);

function initPostController($scope, $sce, $timeout, $window, $sanitize, $routeParams, networkService, ReplyService, TopicService, CommentService, UserInfoService,URIHelper,SplashService,MUService,FileUploader)
{
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
		$window.location = "#/topic/"+topicId;
	}

	$scope.setPeelUI = function(isPeelUser){
		console.log("isPeelUser :"+isPeelUser);
//		if(isPeelUser === true)
//		{
//			document.getElementById('postSection').style.paddingTop = "2.0em";
//			document.getElementById('postHeader').style.height = "3.5em";
//		}
//		else
		// {
			document.getElementById('postSection').style.paddingTop = "3.5em";
			document.getElementById('postHeader').style.height = "3.5em";
		// }
	}

	if((UserInfoService.isPeelUser() == true)){
		$scope.isPeelUser = true;
		SplashService.hidePeelSplash = true;
	}
	else {
		$scope.isPeelUser = false;
	}
	$scope.setPeelUI($scope.isPeelUser);

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
		var replyPostHeader = $("#replyPost").height();
		// console.log("height of repy header: " + replyPostHeader);
		var heightString = replyPostHeader + "px";
		// document.getElementById('postHeader').style.height = '3.5em';//heightString;
		// document.getElementById('postSection').style.paddingTop = '3.5em';
		document.getElementById('postSection').style.paddingBottom = "3.9em";

		$scope.$watch("replies", function (newValue, oldValue)
		 {
  			$timeout(function()
  			{
  				setLinks();
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
	else
	{
		window.location = "#/";
	}

	$scope.postReply = function(commentText) {
		if((commentText !== undefined) && commentText !== ""){
			// console.log("PostController postReply Invoked :", commentText, $scope.topicId, $scope.postID);
			if (uploader.queue.length > 0){
				MUService.setCommentParams($scope.topicId, commentText, false, $scope.postID);
			} else {
				networkService.send(ReplyService.getPostReplyRequest($scope.topicId,$scope.postID, commentText));
			}
		}
		uploader.uploadAll();
		$scope.commentText = "";
		document.getElementById("postCommentField").blur();
		document.getElementById("postCommentButton").blur();
		$scope.justReplied = true;
		// $(document).scrollTop(0);
	};

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

			$scope.comment = tempComment;

//			 console.log("comments html : " +$scope.comment.html);
//			 console.log("updated comments author name: " +$scope.comment.postAuthorName);
//			 console.log("updated comments author photo: " +$scope.comment.postAuthorPhoto);
//			if($scope.comment.type == "media"){
//				 console.log("updated comments media : " +$scope.comment.mediaUrl);
//				 console.log("updated comments media : " +$scope.comment.mediaAspectFeed);
//
//			}
		}
	}

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

}
