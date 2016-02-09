angular.module("UserInput", ["NetworkModule","TopicModule","MediaModule","angularFileUpload"])
  .controller("UserInputController", ["$scope","$window","$timeout","$routeParams","networkService","TopicService","CommentService","ReplyService","UserInfoService","FileUploader","MUService","UserAgentService",
    function ($scope,$window,$timeout,$routeParams,networkService,TopicService,CommentService,ReplyService,UserInfoService,FileUploader,MUService,UserAgentService){

      // ATTACH MEDIA
      var MUS_SERVER_URI;
      if (DEV_BUILD === true){
        MUS_SERVER_URI = 'https://dev.fankave.com:8080';
      } else {
        MUS_SERVER_URI = 'https://mus.fankave.com';
      }
      var UPLOAD_URL = '/v1.0/media/upload';

      var uploader = this.uploader = new FileUploader({
        url: MUS_SERVER_URI + UPLOAD_URL,
        autoUpload: false,
        removeAfterUpload: true,
        queueLimit: 1
      });

      var _this = this;
      this.isHTML5 = this.uploader.isHTML5;
      this.mediaType;
      this.uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var itemType = item.type;
          if(itemType.indexOf("image") != -1){
            _this.mediaType = "image";
            return this.queue.length < 1 && (item.size < 5242880);
          }
          else if(itemType.indexOf("video") != -1){
            _this.mediaType = "video";
            return this.queue.length < 1 && (item.size < 268435456);
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
          var previewSrc = "img/videoPrevIcon@2x.png";
        }

        var reader = new FileReader();
        reader.onload = (function (theFile) {
          return function (e) {
            var span = document.createElement('span');
            span.innerHTML = ['<img class="thumb" src="',
              previewSrc || e.target.result,
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
        _this.uploader.clearQueue();
        var e = $('#fileUpload');
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
        dontAdd = false;
        _this.unhighlightPost();
      };

      // CALLBACKS
      this.fileMaxExceeded = false;
      this.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        dontAdd = true;
        console.info('onWhenAddingFileFailed', item, filter, options);
        if (!_this.isHTML5){
          console.log("Browser Doesn't Support HTML5");
          _this.HTML5warning = true;
        } else if (_this.uploader.queue.length < 1) {
          _this.fileMaxExceeded = true;
          _this.removeMedia();
          $timeout(function(){_this.fileMaxExceeded = false;}, 5000);
        }
      };
      this.uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        _this.highlightPost();
        resetInput();
      };
      this.uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
        resetInput();
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
        resetInput();
      };
      this.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        networkService.send(MUService.postMediaRequest(response));
        resetInput();
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
        _this.uploader.clearQueue();
        MUService.resetCommentParams();
        resetInput();
      };

      console.info('uploader', this.uploader);

      // POST COMMENT
      this.postComment = function(commentText, isComment) {
        if (_this.uploader.queue.length > 0 && isComment){
          MUService.setCommentParams($scope.topicID, commentText, true);
        } else if (_this.uploader.queue.length > 0 && !isComment){
          MUService.setCommentParams($scope.topicId, commentText, false, $scope.postID);
        } else if (!!commentText && commentText !== "" && isComment){
          networkService.send(CommentService.postCommentRequest($scope.topicID, commentText));
        } else if (!!commentText && commentText !== "" && !isComment){
          networkService.send(ReplyService.getPostReplyRequest($scope.topicId, $scope.postID, commentText));
        }
        _this.uploader.uploadAll();
        $scope.commentText = "";
        $('input#topicCommentField').blur();
        $('#postCommentButton').css('color','rgb(211,214,215)');
        if (isComment){
          $(document).scrollTop(0);
        } else {
          window.scrollTo(0, document.body.scrollHeight);
        }
        resetInput();
      };

      this.highlightPost = function(){
        console.log("Styling post");
        $('#postCommentButton').css('color','rgb(22,189,231)');
      };

      this.unhighlightPost = function(){
        console.log("Styling post");
        if (_this.uploader.queue.length < 1){
          $('#postCommentButton').css('color','rgb(211,214,215)');
        }
      };

      function resetInput(){
        var fixedEl = document.getElementById('mobileUserInput');
        if (fixedEl.style.bottom !== ''){
          console.log("reset input");
          fixedEl.style.position = '';
          fixedEl.style.bottom = '';
          fixedEl.style.height = '';
          // inputEl.removeEventListener('blur', blurred);
        }
      }

      this.fixIOSFocus = function(view) {
        if (UserAgentService.getMobileUserAgent() === 'iOS'){
          var fixedEl = document.getElementById('mobileUserInput');
          var mediaEl = document.getElementById('fileUpload');
          var postEl = document.getElementById('postCommentButton');
          var inputEl;
          if (view === 'topic'){
            inputEl = document.getElementById('topicCommentField');
          } else {
            inputEl = document.getElementById('postCommentField');
          }

          // var mediaFocused;
          // mediaEl.addEventListener('click', function(){
          //   // mediaFocused = true;
          //   console.log("File click");
          //   setTimeout(resetInput, 1000);
          // });

          function focused() {
            var offset = 255;
            if (window.scrollY === 0){
              $(document).scrollTop(1);
            } else {
              $(document).scrollTop(window.scrollY);
            }
            fixedEl.style.bottom = (parseFloat(fixedEl.style.bottom) + offset - 42) + 'px';
            fixedEl.style.height = (fixedEl.clientHeight + 52) + 'px';
          }
          inputEl.addEventListener('touchstart', function() {
            var bottom = parseFloat(window.getComputedStyle(fixedEl).bottom);
            // Switch to Abs Positioning
            fixedEl.style.position = 'absolute';
            fixedEl.style.bottom = (document.body.clientHeight - (window.scrollY + window.innerHeight) + bottom) + 'px';
            // Switch Back After Focus is Lost
            function blurred() {
              // Don't reset if user is attaching media or hitting post button
              setTimeout(function(){
                console.log("Blur");
                fixedEl.style.position = '';
                fixedEl.style.bottom = '';
                fixedEl.style.height = '';
              }, 10);
              // inputEl.removeEventListener('blur', blurred);
            }
            inputEl.addEventListener('focus', focused);
            inputEl.addEventListener('blur', blurred);
          });
        }
      };

      this.report = function(message){
        console.log(message);
      };

    }]);