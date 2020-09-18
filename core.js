var ctx = null;

var tileW = 10, tileH = 10;
var canvasW = 400, canvasH = 400;

var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
var gameTime = 0, lastFrame = 0, lastUpdate = 0, updateDelay = 2000;

var paused		= false;
var stepFrame	= false;
var reset		= false;

var creatableTypes = ["predator", "prey"];
var createType = 0;

var mouseState = {
	over : false,
	x : 0,
	y : 0,
	click : null
};

window.onload = function()
{
	canvasW = document.getElementById('map').width;
	canvasH = document.getElementById('map').height;
	
	document.addEventListener('keypress', function(e) {
		if(String.fromCharCode(e.which).toLowerCase()=='c')
		{
			createType++;
			if(createType>=creatableTypes.length) { createType = 0; }
		}
		else if(String.fromCharCode(e.which).toLowerCase()=='p') { paused = !paused; }
		else if(String.fromCharCode(e.which).toLowerCase()=='s' && paused) { stepFrame = true; }
		else if(String.fromCharCode(e.which).toLowerCase()=='r') { reset = true; }
		else if(String.fromCharCode(e.which).toLowerCase()=='d')
		{
			updateDelay+= 200;
			if(updateDelay>=2000) { updateDelay = 200; }
		}
		else if(String.fromCharCode(e.which).toLowerCase()=='f')
		{
			for(var x in Map.tiles)
			{
				if(Map.tiles[x].cell!=null) { continue; }
				if(Math.random() > 0.4) { continue; }
				
				new Cell(Map.tiles[x].x, Map.tiles[x].y,
					(Math.random() > 0.3));
			}
		}
		else if(String.fromCharCode(e.which)=='1') { drPred+= 0.1; if(drPred > 0.9) { drPred = 0.0; } }
		else if(String.fromCharCode(e.which)=='2') { drPrey+= 0.1; if(drPrey > 0.9) { drPrey = 0.0; } }
	});
	document.getElementById('map').addEventListener('mouseout', function() {
		mouseState.over = false;
	});
	document.getElementById('map').addEventListener('click', function(e) {
		if(e.which==1)
		{
			mouseState.click = [mouseState.x, mouseState.y];
		}
	});
	document.getElementById('map').addEventListener('mousemove', function(e) {
		// Get the position of the mouse on the page
		var mouseX = e.pageX;
		var mouseY = e.pageY;

		// Find the offset of the Canvas relative to the document top, left,
		// and modify the mouse position to account for this
		var p = document.getElementById('map');
		do
		{
			mouseX-= p.offsetLeft;
			mouseY-= p.offsetTop;

			p = p.offsetParent;
		} while(p!=null);
		
		mouseState.over = true;
		mouseState.x = mouseX;
		mouseState.y = mouseY;
	});
	
	ctx = document.getElementById('map').getContext('2d');
	requestAnimationFrame(updateMap);
	
	Map.generate(56, 36);
};

function updateMap()
{
	if(ctx==null) { return; }
	
	// Framerate & game time calculations
	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }
	
	var now = Date.now();
	gameTime+= (now-lastFrame);
	lastFrame = now;
	
	if(reset)
	{
		reset = false;
		
		allCells.splice(0, allCells.length);
		newCells.splice(0, newCells.length);
		Map.generate(Map.width, Map.height);
	}
	if((paused && stepFrame) || (!paused && updateDelay!=0 && (gameTime-lastUpdate)>=updateDelay))
	{
		updateCells();
		lastUpdate = gameTime;
		stepFrame = false;
	}
	
	// If there's been a click, attempt to create a new
	// cell at the given location:
	if(mouseState.click)
	{
		var x = Math.floor(mouseState.click[0] / tileW);
		var y = Math.floor(mouseState.click[1] / tileH);
		
		if(x < Map.width && y < Map.height && Map.tiles[((y*Map.width)+x)].cell==null)
		{
			new Cell(x, y, createType==1);
		}
		
		mouseState.click = null;
	}
	
	ctx.font = "bold 10pt sans-serif";
	ctx.fillStyle = "#cccccc"
	ctx.fillRect(0, 0, canvasW, canvasH);
	
	// Draw grid
	ctx.strokeStyle = "#ffffff";
	
	ctx.beginPath();
	for(var y = 0; y <= Map.height; y++)
	{
		ctx.moveTo(0, (y * tileH));
		ctx.lineTo((Map.width * tileW), (y * tileH));
	}
	for(var x = 0; x <= Map.width; x++)
	{
		ctx.moveTo((x * tileW), 0);
		ctx.lineTo((x * tileW), (Map.height * tileH));
	}
	ctx.stroke();
	
	for(var x in allCells)
	{
		if(!allCells[x].alive) { continue; }
		
		ctx.fillStyle = allCells[x].prey ? "#00dd00" : "#dd0000";
		ctx.fillRect( (allCells[x].x * tileW), (allCells[x].y * tileH), tileW, tileH);
	}
	
	for(var x in newCells)
	{
		ctx.strokeStyle = newCells[x].prey ? "#00dd00" : "#dd0000";
		ctx.strokeRect( (newCells[x].x * tileW), (newCells[x].y * tileH), tileW, tileH);
	}
	
	
	ctx.fillStyle = "#000000";
	ctx.textAlign = "end";
	ctx.fillText("Framerate: " + framesLastSecond +
		(paused ? " (Paused)" : ""), canvasW-50, 20);
	ctx.fillText("Creating: " + creatableTypes[createType] + " (c to change)", canvasW - 50, 35);
	
	ctx.textAlign = "start";
	ctx.fillText("Death rates; Predators: " + drPred.toFixed(1) + ", Prey: " + drPrey.toFixed(1) +
		" (1 & 2 to change)", 10, canvasH - 45);
	ctx.fillText("s to Step when paused, r to reset, f to random fill", 10, canvasH - 30);
	ctx.fillText("Auto step time: " + updateDelay + "ms (d to change) (next: " +
		(updatePrey?"prey":"predators") + ")", 10, canvasH - 15);
	
	requestAnimationFrame(updateMap);
}
