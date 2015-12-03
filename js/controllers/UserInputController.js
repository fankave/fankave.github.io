angular.module("UserInput", ["NetworkModule","TopicModule","MediaModule","angularFileUpload"])
  .controller("UserInputController", ["$scope","$window","$routeParams","networkService","TopicService","CommentService","ReplyService","UserInfoService","FileUploader","MUService",
    function ($scope,$window,$routeParams,networkService,TopicService,CommentService,ReplyService,UserInfoService,FileUploader,MUService){

      console.log("Inherited Scope? ", $scope.topicID);
      console.log("Find Preview Elem? ", $("#mobilePreview"));
      // ATTACH MEDIA
      var MUS_SERVER_URI = 'https://dev.fankave.com:8080';
      var UPLOAD_URL = '/v1.0/media/upload';

      var uploader = this.uploader = new FileUploader({
        url: MUS_SERVER_URI + UPLOAD_URL,
        autoUpload: false,
        removeAfterUpload: true
      });

      this.isHTML5 = this.uploader.isHTML5;
      this.mediaType;
      this.uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var itemType = item.type;
          if(itemType.indexOf("image") != -1){
            this.mediaType = "image";
            return this.queue.length < 1 && (item.size < 1048576);
          }
          else if(itemType.indexOf("video") != -1){
            this.mediaType = "video";
            return this.queue.length < 1 && (item.size < 10485760);
          }
          return this.queue.length < 10;
        }
      });

      // MEDIA PREVIEW
      var dontAdd;
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
            if ($scope.mobileBrowser === true && !dontAdd){
              document.getElementById('mobilePreview').insertBefore(span, null);
            } else if (!dontAdd) {
              document.getElementById('preview').insertBefore(span, null);
            }
            };
          })(f);
          reader.readAsDataURL(f);
        };

      document.getElementById('fileUpload').addEventListener('change',
        generateImagePreview, false);

      this.removeMedia = function(){
        this.uploader.clearQueue();
        var e = $('#fileUpload');
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
        dontAdd = false;
      };

      // CALLBACKS
      this.fileMaxExceeded = false;
      this.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        dontAdd = true;
        console.info('onWhenAddingFileFailed', item, filter, options);
        if (!this.isHTML5){
          console.log("Browser Doesn't Support HTML5");
          this.HTML5warning = true;
        } else if (this.uploader.queue.length < 1) {
          this.fileMaxExceeded = true;
          $timeout(function(){this.fileMaxExceeded = false;}, 5000);
        }
      };
      this.uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);


      };
      this.uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
      };
      this.uploader.onBeforeUploadItem = function(item) {
        var user = UserInfoService.getUserCredentials();
        item.headers = {  
            'X-UserId': user.userId,
            'X-SessionId': user.sessionId,
            'X-AccessToken': user.accessToken};
        item.formData =[{'type':item._file.type},{'size': item._file.size},{'file': item._file}];

        console.info('onBeforeUploadItem', item);
      };
      this.uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
      };
      this.uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
      };
      this.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        networkService.send(MUService.postMediaRequest(response));
      };
      this.uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
      };
      this.uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
      };
      this.uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
      };
      this.uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        this.uploader.clearQueue();
      };

      console.info('uploader', this.uploader);

      // POST COMMENT
      this.postComment = function(commentText, isComment) {
        console.log("In New Controller: ", isComment);
        if (this.uploader.queue.length > 0 && isComment){
          MUService.setCommentParams($scope.topicID, commentText, true);
        } else if (this.uploader.queue.length > 0 && !isComment){
          MUService.setCommentParams($scope.topicId, commentText, false, $scope.postID);
        } else if (!!commentText && commentText !== "" && isComment){
          networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
        } else if (!!commentText && commentText !== "" && !isComment){
          networkService.send(ReplyService.getPostReplyRequest($scope.topicId, $scope.postID, commentText));
        }
        this.uploader.uploadAll();
        $scope.commentText = "";
        if (isComment){
          $(document).scrollTop(0);
        } else {
          window.scrollTo(0, document.body.scrollHeight);
        }
      };

    }]);