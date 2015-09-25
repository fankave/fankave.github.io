networkModule.factory('ForumStorage', function () {
	var localStorageAvailable = false;
	if(typeof(Storage) !== "undefined") {
		console.log("Local storage available :"+ typeof(Storage));
		localStorageAvailable = true;
	}  
	else {
		console.log("Sorry! No Storage support on this browser..");
	}
	
	function setToLocalStorage(key, value){
		if(localStorageAvailable)
		localStorage.setItem(key,value);
	}
	
	function getFromLocalStorage(key){
		if(localStorageAvailable)
		return localStorage.getItem(key);
	}
	
	return{
		getFromLocalStorage:getFromLocalStorage,
		setToLocalStorage:setToLocalStorage
	}
	
	

});