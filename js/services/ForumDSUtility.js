networkModule.factory('FDSUtility', function () {
	
	function getStructureById(array, id){
		if(NETWORK_DEBUG) console.log("structureLengths :"+ array.length);
		for(i=0;i<array.length;i++){
			if(array[i].id == id){
				return array[i];
			}
		}
	}
	
	function getIndexById(array, id){
		if(NETWORK_DEBUG) console.log("structureLengths :"+ array.length);
		for(i=0;i<array.length;i++){
			if(array[i].id == id){
				return i;
			}
		}
		return -1;
	}
	
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
	
	function isFlaggedById(array, id){
		var tempStructure = getStructureById(array,id);
		if(tempStructure != undefined){
			if(NETWORK_DEBUG) console.log("found element :"+ tempStructure  + " tempStructure.signal.flag :"+ tempStructure.signal.flag);
			if(tempStructure.signal.flag == true){
				return true;
			}
			}
		return false;
	}

	
	function flagById(array, id, flag){
		var tempStructure = getStructureById(array,id);
		if(tempStructure != undefined){
			if(NETWORK_DEBUG) console.log("found element :"+ tempStructure  + " tempStructure.signal.flag :"+ tempStructure.signal.flag);
			tempStructure.signal.flag = flag;
			}
	}
	
	
	function deleteById(array, id){
		var index = getIndexById(array,id);
		
		if(index != -1){
			if(NETWORK_DEBUG) console.log("found element at:"+index );
			array.splice(index,1);
			}
		return array;
	}

	return {
		isLikedById:isLikedById,
		isFlaggedById:isFlaggedById,
		flagById:flagById,
		deleteById:deleteById
		
		
	};

});