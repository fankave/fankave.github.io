networkModule.factory('FDSUtility', function () {
	function isLikedById(array, id){
		var tempStructure = getStructureById(array,id);
		if(tempStructure != undefined){
			if(NETWORK_DEBUG) console.log("found element :"+ tempStructure  + " tempStructure.signal.like :"+ tempStructure.signal.like);
			if(tempStructure.signal.like == true){
				return true;
			}
			}
		return false;
	}
	function getStructureById(array, id){
		if(NETWORK_DEBUG) console.log("structureLengths :"+ array.length);
		for(i=0;i<array.length;i++){
			if(array[i].id == id){
				return array[i];
			}
		}
	}

	return {
		isLikedById:isLikedById
	};

});