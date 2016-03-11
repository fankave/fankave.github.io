document.addEventListener("DOMContentLoaded", function(event) { 
  var channelParam = window.location.href.slice(window.location.href.indexOf('?')+1);
  var channelID = channelParam.split("=")[1];
  console.log("channelID: ", channelID);

  var banner = document.getElementById('peelBanner');
  banner.src = "https://storage.googleapis.com/forumus/channel/" + channelID + "/cover";
  banner.style.visibility = "visible";
});
