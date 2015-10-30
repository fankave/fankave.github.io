ga('send', 'event', 'TimeOnPage', '0', '1 second', { 'nonInteraction': 1 });
console.log("TimeOnPage :1 second ");
function timer10(){
	console.log("TimeOnPage :10 seconds ");
	ga('send', 'event', 'TimeOnPage', '1', '10 seconds', { 'nonInteraction': 1 });
	}
function timer30(){
	console.log("TimeOnPage :30 seconds ");
	ga('send', 'event', 'TimeOnPage', '2', '30 seconds', { 'nonInteraction': 1 });
	}

function timer60(){
	//console.log("TimeOnPage :60 seconds ");
	ga('send', 'event', 'TimeOnPage', '3', '60 seconds', { 'nonInteraction': 1 });
	}

function timer120(){
	//console.log("TimeOnPage :2 mins ");
	ga('send', 'event', 'TimeOnPage', '4', '2 mins', { 'nonInteraction': 1 });
	}
function timer180(){
	//console.log("TimeOnPage :3 mins");
	ga('send', 'event', 'TimeOnPage', '5', '3 mins', { 'nonInteraction': 1 });
	}
function timer240(){
	//console.log("TimeOnPage :4 mins");
	ga('send', 'event', 'TimeOnPage', '6', '4 mins', { 'nonInteraction': 1 });
	}

function timer300(){
	//console.log("TimeOnPage :5 mins ");
	ga('send', 'event', 'TimeOnPage', '7', '5 mins', { 'nonInteraction': 1 });
	}

function timer600(){
	//console.log("TimeOnPage :10 mins ");
	ga('send', 'event', 'TimeOnPage', '8', '10 mins', { 'nonInteraction': 1 });
	}
function timer1200(){
	//console.log("TimeOnPage :20 mins ");
	ga('send', 'event', 'TimeOnPage', '9', '20 mins', { 'nonInteraction': 1 });
	}
function timer1800(){
	//console.log("TimeOnPage :30 mins ");
	ga('send', 'event', 'TimeOnPage', '10', '30 mins', { 'nonInteraction': 1 });
	}




setTimeout(timer10,10000);
setTimeout(timer30,30000);
setTimeout(timer60,60000);
setTimeout(timer120,120000);
setTimeout(timer180,180000);
setTimeout(timer240,240000);
setTimeout(timer300,300000);
setTimeout(timer600,600000);
setTimeout(timer1200,1200000);
setTimeout(timer1800,1800000);