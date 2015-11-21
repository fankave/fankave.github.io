mediaModule.factory('MUService', ['$http','UserInfoService', function ($http,UserInfoService) {

	var UPLOAD_URL = '/v1.0/media/upload';
//	Transport: Multipart Form
//	Method: POST


//Callback for Media Upload
	var observerCallbacks = [];
	function registerObserverCallback(callback){
		//register an observer
		// console.log("comments callback registered");
		var callbackLength  = observerCallbacks.length;
		while(callbackLength > 0){
			callbackLength = observerCallbacks.length;
			observerCallbacks.pop();
		}
		observerCallbacks.push(callback);
	}
	
	function dataURItoBlob(dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([ia], {type:mimeString});
	}
	
	function getBase64FromImageUrl(url) {
	    var img = new Image();

	    img.onload = function () {
	        var canvas = document.createElement("canvas");
	        canvas.width =this.width;
	        canvas.height =this.height;

	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(this, 0, 0);

	        var dataURL = canvas.toDataURL("image/png");
	    };

	    img.src = url;
	}

//Upload Media to FK server
	uploadMedia = function(file){
		var user = UserInfoService.getUserCredentials();
//		var fd = new FormData();
//		file = dataURItoBlob('img/kave_logo2.png');
//		fd.append('file', file);
		console.log(" MUS upload");
		var fd = new FormData();
		var file = getBase64FromImageUrl('img/kave_logo2.png');
	    //Take the first selected file
	    fd.append("file", file);

	    $http.post(MUS_SERVER_URI+UPLOAD_URL, fd, {
	        
	        headers: {'Content-Type': undefined ,
	        	'X-UserId': user.userId,
            	'X-SessionId': user.sessionId,
            	'X-AccessToken': user.accessToken},
	        transformRequest: angular.identity
	    })
//	    $http.post(MUS_SERVER_URI+UPLOAD_URL, fd, {
//	        headers: {'Content-Type': undefined,
//	        	'X-UserId': user.userId,
//            	'X-SessionId': user.sessionId,
//            	'X-AccessToken': user.accessToken},
//	        transformRequest: angular.identity
//		})
		.success(function(){
			console.log(" MUS Success");

		})
		.error(function(){
			console.log("MUS Error");
		});
	}
	return {
		uploadMedia:uploadMedia
	}
}]);
	