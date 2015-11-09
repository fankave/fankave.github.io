var count = 0;
function sendTimeOnPage(time, suffix){
	
	var convertTime = time + ' ' + suffix;

	if (!checkHidden()){
		console.log('Time On Page: ' + convertTime + ' | Count: ' + count);
		ga('send', 'event', 'TimeOnPage', count.toString(), convertTime, { 'nonInteraction': 1 });
		count++;
	}
}

function checkHidden(){
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
	} else if (typeof document.mozHidden !== "undefined") {
	    hidden = "mozHidden";
	} else if (typeof document.msHidden !== "undefined") {
	    hidden = "msHidden";
	} else if (typeof document.webkitHidden !== "undefined") {
	    hidden = "webkitHidden";
	}
	// console.log('In Background: ', document[hidden]);
	return document[hidden];
}

setTimeout(function(){sendTimeOnPage(1, 'second')}, 1000);
setTimeout(function(){sendTimeOnPage(10, 'seconds')}, 10000);
setTimeout(function(){sendTimeOnPage(30, 'seconds')}, 30000);
setTimeout(function(){sendTimeOnPage(60, 'seconds')}, 60000);
setTimeout(function(){sendTimeOnPage(2, 'mins')}, 120000);
setTimeout(function(){sendTimeOnPage(3, 'mins')}, 180000);
setTimeout(function(){sendTimeOnPage(4, 'mins')}, 240000);
setTimeout(function(){sendTimeOnPage(5, 'mins')}, 300000);
setTimeout(function(){sendTimeOnPage(10, 'mins')}, 600000);
setTimeout(function(){sendTimeOnPage(20, 'mins')}, 1200000);
setTimeout(function(){sendTimeOnPage(30, 'mins')}, 1800000);
