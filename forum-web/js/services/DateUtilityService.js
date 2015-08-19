networkModule.service('DateUtilityService', dateUtility);

function dateUtility() {

	function timeSince(timeStamp) {
		console.log("timeSatmp", timeStamp);
    var now = new Date();
    var createdDate = new Date(timeStamp);
      secondsPast = (now.getTime() - createdDate.getTime()) / 1000;
    if(secondsPast < 60){
      return parseInt(secondsPast) + 's';
    }
    if(secondsPast < 3600){
      return parseInt(secondsPast/60) + 'm';
    }
    if(secondsPast <= 86400){
      return parseInt(secondsPast/3600) + 'h';
    }
    if(secondsPast > 86400){
        day = createdDate.getDate();
        month = createdDate.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        year = createdDate.getFullYear() == now.getFullYear() ? "" :  " "+createdDate.getFullYear();
        return day + " " + month + year;
    }
  }
return{
	getTimeSince:timeSince
};	
}