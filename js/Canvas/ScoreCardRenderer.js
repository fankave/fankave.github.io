function renderScoreCard(leftTeamColor, rightTeamColor)
{
	// console.log("renderScoreCard(" + leftTeamColor + ", " + rightTeamColor);

	//sCC = scoreCardCanvas
	var sCC = $('#scoreCardCanvas');
	var ctx = sCC.get(0).getContext('2d');

	var dpr = window.devicePixelRatio;

	// resize container
	var container = $(sCC).parent();
	var canvasWidth = $(container).width();
	sCC.attr('width', canvasWidth);
	var canvasHeight = $(container).height();
    sCC.attr('height', canvasHeight);

    var centerPoint = canvasWidth / 2
    var centerOffset = centerPoint * 0.1
    // draw bkgd (left team)

    ctx.beginPath();
    ctx.fillStyle = leftTeamColor;//"rgb(5, 43, 93)";
    // ctx.fillRect (0, 0, canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, 0);
    ctx.lineTo(centerPoint + centerOffset, 0);
    ctx.lineTo(centerPoint - centerOffset, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, 0);
     ctx.fill();

    // draw bkgd (right team)
    ctx.beginPath();
    ctx.fillStyle = rightTeamColor;//"rgb(167, 2, 15)";
    // ctx.fillRect (canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
    ctx.moveTo(centerPoint + centerOffset, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(centerPoint - centerOffset, canvasHeight);
    ctx.lineTo(centerPoint + centerOffset, 0);
    ctx.fill();

    // draw team names
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    // ctx.fillText("Seahawks", canvasWidth / 4, 25, canvasWidth / 2, 100);
    // ctx.fillText("49ers", canvasWidth * 0.75, 25, canvasWidth / 2, 100);

    

    // draw team logos
    var leftImage = new Image();   // Create new img element
    var maxImageHeight = canvasHeight / 2
    var maxImageWidth = canvasWidth / 5
	leftImage.addEventListener("load", function()
	{
		// console.log("left image loaded: " + leftImage.width + " x " + leftImage.height);
  		// execute drawImage statements here

  		var ratio = 1
  		if(leftImage.width > leftImage.height)
  		{
  			ratio = leftImage.width / maxImageWidth;
  		}
  		else
  		{
  			ratio = leftImage.height / maxImageHeight;
  		}

  		// ctx.drawImage(leftImage, ((maxImageWidth - (leftImage.width)) / 2), 25, leftImage.width * ratio / dpr, leftImage.height * ratio / dpr);
	}, false);
	leftImage.src = 'img/seahawks.png'; // Set source path

	
	// console.log("dpr: " + dpr);
}

$(document).ready( function()
{
    //Run function when browser resizes
    // $(window).resize( renderScoreCard );
});