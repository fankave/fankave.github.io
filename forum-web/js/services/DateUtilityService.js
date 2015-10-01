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

			var daysPassed = secondsPast/86400;
			return Math.floor(daysPassed) + 'd';
		}
//		if(secondsPast > 604800){
//			day = createdDate.getDate();
//			month = createdDate.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
//			year = createdDate.getFullYear() == now.getFullYear() ? "" :  " "+createdDate.getFullYear();
//			return day + " " + month + year;
//		}
	}
	
	function gameScheduleTime(timeStamp){
		var date_format = '12';
		var createdDate = new Date(timeStamp);
		day = createdDate.getUTCDate();
		month = createdDate.getUTCMonth() + 1;
		hour = createdDate.getUTCHours();
		var hour    = createdDate.getHours();  /* Returns the hour (from 0-23) */
		var minutes     = createdDate.getMinutes();  /* Returns the minutes (from 0-59) */
		var time  = hour;
		var ext     = '';

		if(date_format == '12'){
		    if(hour > 12){
		        ext = 'PM';
		        hour = (hour - 12);

		        if(hour < 10){
		        	time = "0" + hour;
		        }else if(hour == 12){
		            hour = "00";
		            ext = 'AM';
		        }
		    }
		    else if(hour < 12){
		    	time = ((hour < 10) ? "0" + hour : hour);
		        ext = 'AM';
		    }else if(hour == 12){
		        ext = 'PM';
		    }
		}

		if(minutes < 10){
		    minutes = "0" + minutes; 
		}

		time = time + ":" + minutes + ' ' + ext; 
		date = month+ "/" +day;
		result = {"date":date,"time":time};

		console.log("Scheduled date : "+ result.date + "  Scheduled time : "+result.time);
		
		
		return result;
		
	}
	return{
		getTimeSince:timeSince,
		getGameScheduledTime:gameScheduleTime
	};	
}