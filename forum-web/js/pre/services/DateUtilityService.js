angular.module('NetworkModule')
.service('DateUtilityService', function () {

	function timeSince(timeStamp) {
		// console.log("timeSatmp", timeStamp);
		var now = new Date();
		var createdDate = new Date(timeStamp);
		secondsPast = (now.getTime() - createdDate.getTime()) / 1000;
		if(secondsPast < 60){
			return 'now';
		}
		if(secondsPast < 3600){
			return parseInt(secondsPast/60) + 'm';
		}
		if(secondsPast < 86400){
			return parseInt(secondsPast/3600) + 'h';
		}
		if(secondsPast < 2592000){

			var daysPassed = secondsPast/86400;
			return Math.floor(daysPassed) + 'd';
		}
		if(secondsPast > 2592000){
			day = createdDate.getDate();
			month = createdDate.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
			year = createdDate.getFullYear() == now.getFullYear() ? "" :  " "+createdDate.getFullYear();
			if (GEN_DEBUG)
			console.log("DATE "+ day + " " + month + year);
			return day + " " + month + year;
		}
	}
	
	function gameScheduleTime(timeStamp){
		var date_format = '12';
		var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		
		var createdDate = new Date(timeStamp);
		
		var day = createdDate.getDate();
		var dayOfWeek = days[createdDate.getDay()];
		var month = createdDate.getMonth() + 1;
		var monthName = months[createdDate.getMonth()];

		var hour    = createdDate.getHours();  /* Returns the hour (from 0-23) */
		var minutes     = createdDate.getMinutes();  /* Returns the minutes (from 0-59) */
		var time  = hour;
		var ext     = '';
		var timeZone = createdDate.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();

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
		var date = month + "/" + day;
		var dateExt = dayOfWeek + ", " + monthName + " " + day;
		result = { "date": date, "time": time, "dateExt": dateExt };

		if (GEN_DEBUG){
			console.log("Scheduled date : "+ result.date + "  Scheduled time : "+result.time);
			console.log("Scheduled Date, Extended Format: ", result.dateExt);
		}
		
		
		return result;
		
	}
	return{
		getTimeSince:timeSince,
		getGameScheduledTime:gameScheduleTime
	};	
});