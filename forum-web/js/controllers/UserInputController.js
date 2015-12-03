angular.module("UserInput", ["NetworkModule","TopicModule","angularFileUpload"])
  .controller("UserInputController", ["$scope","$window","$routeParams","networkService","TopicService","CommentService","ReplyService","UserInfoService",
    function ($scope,$window,$routeParams,networkService,TopicService,CommentService,ReplyService,UserInfoService){

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

      // MEDIA PREVIEW
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
              '"/>'].join('');
            if ($scope.mobileBrowser === true){
              document.getElementById('mobilePreview').insertBefore(span, null);
            } else {
              document.getElementById('preview').insertBefore(span, null);
            }
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
        uploader.clearQueue();
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        uploader.clearQueue();
      };
      uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        uploader.clearQueue();
      };

      console.info('uploader', uploader);

      // POST COMMENT
      $scope.postComment = function(commentText, isComment) {
        if (uploader.queue.length > 0 && isComment === true){
          MUService.setCommentParams($scope.topicID, commentText, true);
        } else if (uploader.queue.length > 0 && isComment === false){
          MUService.setCommentParams($scope.topicId, commentText, false, $scope.postID);
        } else if (!!commentText && commentText !== "" && isComment === true){
          networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
        } else if (!!commentText && commentText !== "" && isComment === false){
          networkService.send(ReplyService.getPostReplyRequest($scope.topicId, $scope.postID, commentText));
        }
        uploader.uploadAll();
        $scope.commentText = "";
        document.getElementById("topicCommentField").blur();
        document.getElementById("postCommentField").blur();
        document.getElementById("postCommentButton").blur();
        $(document).scrollTop(0);
      };

    }]);