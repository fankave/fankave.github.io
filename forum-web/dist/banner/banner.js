document.addEventListener("DOMContentLoaded", function(event) { 
  var channelID = window.location.href.slice(window.location.href.indexOf('?')+1);
  console.log("channelID: ", channelID);

  var banner = document.getElementById('peelBanner');
  banner.src = "https://storage.googleapis.com/forumus/channel/" + channelID + "/cover";
  banner.style.visibility = "visible";
});
