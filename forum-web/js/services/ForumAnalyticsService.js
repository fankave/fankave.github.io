(function(){

	var visProp = getPrefix();

	// Get vendor prefix for document hidden state property
	function getPrefix() {
		var prefixes = ['webkit','moz','ms','o'];

		// First check if hidden is natively supported
		if ('hidden' in window.document) return 'hidden';
		// Then check all known prefixes
		for (var i = 0; i < prefixes.length; i++){
			if ((prefixes[i] + 'Hidden') in window.document){
				return prefixes[i] + 'Hidden';
			}
		}
		// otherwise not supported
		return null;
	};

	// Determine if window is in background or not
	function isHidden() {
		if (!visProp) return false;
		return window.document[visProp];
	};

	// Event listener for visibility change event
	if (visProp) {
		var visEvent = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
		// add event listener to start/stop TimeOnPage timer
		window.document.addEventListener(visEvent, function(){
			visChange(startTimer, stopTimer);
		});
	}

	// Helper function to run on visibility change; takes two callbacks
		// ** Register a new visibility-state-dependent event listener via:
		// window.document.addEventListener(event, visChange(vis, hid))
	function visChange(visCallback, hidCallback) {
		if (isHidden()) {
			console.log('hidden callback fired');
			hidCallback();
		} else {
			console.log('visible callback fired');
			visCallback();
		}
	};

	// TimeOnPage Reporting
	var time = 0;
	var count = 1;
	var timer = window.setInterval(timeAndReport, 10000);

	// Initial 1 second send
	console.log('TimeOnPage: 1 second');
	ga('send', 'event', 'TimeOnPage', '0', '1 second', { 'nonInteraction': 1 });

	function startTimer() {
		console.log('Starting Timer at: ' + time + 'seconds');
		timer = window.setInterval(timeAndReport, 10000);
	};
	function stopTimer() {
		console.log('Stopping Timer at: ' + time + 'seconds');
		window.clearInterval(timer);
	};

	var minutes = 1;
	// Send analytics to google at appropriate intervals
	function timeAndReport() {
		time += 10;

		if (time === 10 || time === 30 || time === 60){
			console.log('TimeOnPage: ' + time + ' seconds | Count: ' + count);
			ga('send', 'event', 'TimeOnPage', count.toString(), (time + ' seconds'), { 'nonInteraction': 1 });
			count++;
		} 
		if (time > 60 && time % 60 === 0){
			minutes++;
			if (minutes <= 5 || minutes === 10 || minutes === 20 || minutes === 30){
				console.log('TimeOnPage: ' + minutes + ' mins | Count: ' + count);
				ga('send', 'event', 'TimeOnPage', count.toString(), (minutes + ' mins'), { 'nonInteraction': 1 });
				count++;
			}
		}
	};

}());
