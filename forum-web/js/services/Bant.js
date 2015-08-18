networkModule.factory('Bant', function () {
	var type;
	var id;
	var author;
	var owner;
	var lang;
	var content;
	var media;
	var hidden;
	var rank;
	var liked;
	var createdAt;
	
	function Bant(tData){
		this.type = tdata.type;
		this.id = tdata.id;
		this.author = tdata.author;
		this.owner = tdata.owner;
		this.lang = tdata.lang;
		this.content = tdata.content;
		this.media = tdata.media;
		this.hidden = tdata.hidden;
		this.rank = tdata.rank;
		this.liked = tdata.liked;
		this.createdAt = tdata.createdAt;
		
	}
    return {
        bant: Bant
    };
   
});