angular.module('NetworkModule')
.factory('ForumStorage', function () {
	var localStorageAvailable = false;
	if(typeof(Storage) != undefined) {
		if (NETWORK_DEBUG)
		console.log("Local storage available :"+ typeof(Storage));
		localStorageAvailable = true;
	}  
	else {
		if (NETWORK_DEBUG)
		console.log("Sorry! No Storage support on this browser..");
	}
	
	function setToLocalStorage(key, value){
		if(localStorage!= undefined && localStorageAvailable)
		localStorage.setItem(key,value);
	}
	
	function getFromLocalStorage(key){
		if(localStorage!= undefined && localStorageAvailable)
		return localStorage.getItem(key);
		return undefined;
	}
	
	function clearStorage(){
		if(localStorage!= undefined && localStorageAvailable)
		localStorage.clear();
	}
	
	return{
		getFromLocalStorage:getFromLocalStorage,
		setToLocalStorage:setToLocalStorage,
		clearStorage:clearStorage
	}
	
	

});