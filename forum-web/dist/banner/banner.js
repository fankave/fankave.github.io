document.addEventListener("DOMContentLoaded", function(event) { 
  
  var _createdAt = new Date().toISOString();
  var channelParam = window.location.href.slice(window.location.href.indexOf('?')+1);
  var _channelId = channelParam.split("=")[1];
  var _userAgent = navigator.userAgent;

  var banner = document.getElementById('peelBanner');
  banner.src = "https://storage.googleapis.com/forumus/channel/" + _channelId + "/cover";
  banner.style.visibility = "visible";

  var analytics = [{
    "createdAt": _createdAt,
    "context": {
      "category": "access",
      "type": "impression"
    },
    "content": {
      "channelId": _channelId,
      "userAgent": _userAgent
    }
  }]

  function sendAnalytics (analytics) {
    var jsonObj = JSON.stringify(analytics);
    console.log("Banner Analytics: ", jsonObj);

    var xmlhttp = new XMLHttpRequest(); 
    xmlhttp.open("POST", "http://devlog.fankave.com/v1.0/log/events");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(jsonObj);
  }

  sendAnalytics(analytics);

});
