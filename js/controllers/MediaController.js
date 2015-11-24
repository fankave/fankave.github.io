'use strict';

var mediaModule = angular.module('MediaModule', ['angularFileUpload', 'NetworkModule', 'TopicModule'])

mediaModule.controller('MediaController', ['$scope', '$routeParams', '$window', 'FileUploader', 'MUService', 'UserInfoService', 'networkService', 'CommentService', 'URIHelper', 'TopicService',
  function ($scope, $routeParams, $window, FileUploader, MUService, UserInfoService, networkService, CommentService, URIHelper, TopicService) {
  
  var MUS_SERVER_URI = 'https://dev.fankave.com:8080';
  var UPLOAD_URL = '/v1.0/media/upload';
  
  

  var user = UserInfoService.getUserCredentials();
  if ($routeParams.postID){
    $scope.postID = $routeParams.postID;
  }
  $scope.topicID = $routeParams.topicID;

  var uploader = $scope.uploader = new FileUploader({
    url: MUS_SERVER_URI + UPLOAD_URL,
    autoUpload: false
  });

  var mediaData;
  $scope.postComment = function(commentText) {
    if((commentText !== undefined)  && commentText !== ""){
      console.log("MediaController postComment Invoked :"+ commentText);
      if ($scope.postID){
        console.log("Post: ", $scope.postID);
        MUService.setCommentParams($scope.topicID, commentText, false, $scope.postID);
      } else {
        MUService.setCommentParams($scope.topicID, commentText, true);
      }
      if (mediaData){
        networkService.send(MUService.postMediaRequest(mediaData));
      }
    }
    $scope.commentText = "";
    if ($scope.postID){
      $window.location = "#/post/" + $scope.postID;
    } else {
      $window.location = "#/topic/" + $scope.topicID;
    }
  };

  $scope.setUI = function() {
    document.getElementById('mediaSection').style.paddingTop = "52px";
    document.getElementById('header').style.height = "52px"; 
  };

  if (UserInfoService.isPeelUser()) {
    $scope.isPeelUser = true;
    $scope.setUI();
  } else {
    $scope.isPeelUser = false;
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

  // FILTERS

  uploader.filters.push({
    name: 'customFilter',
    fn: function(item /*{File|FileLikeObject}*/, options) {
    	var itemType = item.type;
    	if(itemType.indexOf("image") != -1)
    		return this.queue.length < 1 && (item.size < 1048576);
    	else if(itemType.indexOf("video") != -1)
    		return this.queue.length < 1 && (item.size < 10485760);
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
      mediaData = response;
      uploader.clearQueue();
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
