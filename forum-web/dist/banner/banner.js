document.addEventListener("DOMContentLoaded", function(event) { 
  var _enteredAt = new Date();
  var channelParam = window.location.href.slice(window.location.href.indexOf('?')+1);
  var _channelId = channelParam.split("=")[1];
  var _userAgent = navigator.userAgent;

  var banner = document.getElementById('peelBanner');
  banner.src = "https://storage.googleapis.com/forumus/channel/" + _channelId + "/cover";
  banner.style.visibility = "visible";

  var dateObj = {
    year: _enteredAt.getFullYear().toString(),
    month: (_enteredAt.getMonth() + 1).toString(),
    day: _enteredAt.getDate().toString(),
    hours: _enteredAt.getHours().toString(),
    mins: _enteredAt.getMinutes().toString(),
    secs: _enteredAt.getSeconds().toString(),
    milli: _enteredAt.getMilliseconds().toString()
  };

  if (dateObj.month.length === 1){
    dateObj.month = "0" + dateObj.month;
  }
  if (dateObj.day.length === 1){
    dateObj.day = "0" + dateObj.day;
  }
  if (dateObj.hours.length === 1){
    dateObj.hours = "0" + dateObj.hours;
  }
  if (dateObj.mins.length === 1){
    dateObj.mins = "0" + dateObj.mins;
  }
  if (dateObj.secs.length === 1){
    dateObj.secs = "0" + dateObj.secs;
  }
  if (dateObj.milli.length === 1){
    dateObj.milli = "00" + dateObj.milli;
  } else if (dateObj.milli.length === 2){
    dateObj.milli = "0" + dateObj.milli;
  }

  var _createdAt = 
    dateObj.year + "-" +
    dateObj.month + "-" +
    dateObj.day + "T" +
    dateObj.hours + ":" +
    dateObj.mins + ":" +
    dateObj.secs + "." +
    dateObj.milli + "Z";

  var analytics = {
    "createdAt": _createdAt,
    "context": {
      "category": "access",
      "type": "impression"
    },
    "content": {
      "channelId": _channelId,
      "userAgent": _userAgent
    }
  }

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
