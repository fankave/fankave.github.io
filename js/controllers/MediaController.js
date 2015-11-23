'use strict';

var mediaModule = angular.module('MediaModule', ['angularFileUpload', 'NetworkModule'])

mediaModule.controller('MediaController', ['$scope', '$routeParams', '$window', 'FileUploader', 'MUService', 'UserInfoService', 'networkService', 'CommentService', 'URIHelper',
  function ($scope, $routeParams, $window, FileUploader, MUService, UserInfoService, networkService, CommentService, URIHelper) {
  
  var MUS_SERVER_URI = 'https://dev.fankave.com:8080';
  var UPLOAD_URL = '/v1.0/media/upload';
  
  

  var user = UserInfoService.getUserCredentials();
  $scope.topicID = $routeParams.topicID;
  console.log("Media Add ID: ", $scope.topicID);

  var uploader = $scope.uploader = new FileUploader({
	  url: MUS_SERVER_URI + UPLOAD_URL,
	  autoUpload: true
  });

  $scope.postComment = function(commentText) {
    if((commentText !== undefined)  && commentText !== ""){
       console.log("MediaController postComment Invoked :"+ commentText);
      MUService.setCommentParams($scope.topicID, commentText,true);
    }
    $scope.commentText = "";
    $window.location = "#/topic/" + $scope.topicID;
  };

  $scope.setUI = function() {
    if($scope.isPeelUser === true) {
      document.getElementById('mediaSection').style.paddingTop = "52px";
      document.getElementById('header').style.height = "52px"; 
    } else {
      document.getElementById('mediaSection').style.paddingTop = "0px";
      document.getElementById('header').style.height = "0px";
    }
  };

  if (UserInfoService.isPeelUser()) {
    $scope.isPeelUser = true;
    $scope.setUI();
  } else {
    $scope.isPeelUser = false;
    $scope.setUI();
  }

  $scope.peelClose = function() {
    ga('send', 'event', 'Peel', 'click', 'BackToPeelHome');
    console.log("peelClose()");
    window.location = "peel://home";
  };

  $scope.peelWatchOnTV = function() {
    ga('send', 'event', 'Peel', 'click', 'PeelWatchOnTV');
    console.log("peelWatchOnTV()");
    var showId = URIHelper.getPeelShowId();
    console.log("Peel show on TV uri :  "+ "peel://tunein/"+showId);
    if(showId !== undefined)
      window.location = "peel://tunein/"+showId;
    else
      window.location = "peel://home";
  };

  $scope.progressFill = function(progress) {

    return {
      'width': progress + '%',
      'background-color': 'rgb(59,166,252)'
    }
  };

  $scope.chatSelected = 'selectedTab';
  $scope.switchTabs = function(tab) {
    if (tab === 'chat'){
      $scope.chatSelected = 'selectedTab';
      $scope.videoSelected = '';
      $scope.socialSelected = '';
    }
    if (tab === 'video'){
      $scope.chatSelected = '';
      $scope.videoSelected = 'selectedTab';
      $scope.socialSelected = '';
    }
    if (tab === 'social'){
      $scope.chatSelected = '';
      $scope.videoSelected = '';
      $scope.socialSelected = 'selectedTab';
    }
  }

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
      return this.queue.length < 10;
    }
  });

  // CALLBACKS

  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    console.info('onWhenAddingFileFailed', item, filter, options);
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
		  //CommentService.postCommentRequestForMedia(topicId,commentText, response);
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
  };

  console.info('uploader', uploader);

}]);
