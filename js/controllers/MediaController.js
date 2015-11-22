'use strict';

var mediaModule = angular.module('MediaModule', ['angularFileUpload', 'NetworkModule'])

mediaModule.controller('MediaController', ['$scope', '$routeParams', '$window', 'FileUploader', 'MUService', 'UserInfoService', 'networkService','CommentService' ,
  function ($scope, $routeParams, $window, FileUploader, MUService, UserInfoService, networkService,CommentService) {
  
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
