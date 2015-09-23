networkModule.service('DateUtilityService', dateUtility);

function dateUtility() {

	function timeSince(timeStamp) {
		// console.log("timeSatmp", timeStamp);
		var now = new Date();
		var createdDate = new Date(timeStamp);
		secondsPast = (now.getTime() - createdDate.getTime()) / 1000;
		if(secondsPast < 60){
			return 'now';
		}
		if(secondsPast < 3600){
			return parseInt(secondsPast/60) + 'min';
		}
		if(secondsPast < 86400){
			return parseInt(secondsPast/3600) + 'hr';
		}
		if(secondsPast > 86400){
//			day = createdDate.getDate();
//			month = createdDate.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
//			year = createdDate.getFullYear() == now.getFullYear() ? "" :  " "+createdDate.getFullYear();
			var daysPassed = secondsPast/86400;
			return Math.floor(daysPassed) + 'd';
		}
	}
	return{
		getTimeSince:timeSince
	};	
}