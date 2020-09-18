var allCells = [];
var newCells = [];

var updatePrey = true;

var drPred = 0.3;
var drPrey = 0.2;

class Cell
{
	constructor(cx, cy, cp)
	{
		this.x		= cx;
		this.y		= cy;
		this.tile	= (cy * Map.width) + cx;
		this.prey	= cp;
		this.alive	= true;
		
		newCells.push(this);
		Map.tiles[this.tile].cell = this;
	}
	
	getNeighbours()
	{
		var n = [];
		
		for(var y = (this.y - 1); y<= (this.y + 1); y++)
		{
			for(var x = (this.x - 1); x <= (this.x + 1); x++)
			{
				if(y < 0 || x < 0 || x >= Map.width || y >= Map.height) { continue; }
				
				n.push((y * Map.width) + x);
			}
		}
		
		return n;
	}
	
	kill()
	{
		this.alive = false;
		Map.tiles[this.tile].cell = null;
	}
	
	update()
	{
		var n = this.getNeighbours();
		
		if(this.prey)
		{
			for(x in n)
			{
				if(Map.tiles[n[x]].cell==null)
				{
					new Cell(Map.tiles[n[x]].x, Map.tiles[n[x]].y, true);
				}
			}
		}
		else
		{
			var prey = [];
			
			for(var x in n)
			{
				if(Map.tiles[n[x]].cell!=null && Map.tiles[n[x]].cell.prey)
				{
					prey.push(n[x]);
					
					Map.tiles[n[x]].cell.kill();
					new Cell(Map.tiles[n[x]].x, Map.tiles[n[x]].y, false);
				}
			}
			
			if(!prey.length) { this.kill(); }
		}
		
		return false;
	}
};

function updateCells()
{
	for(var x in allCells)
	{
		if(allCells[x].prey==updatePrey) { allCells[x].update(); }
	}
	
	for(var x in newCells) { if(newCells[x].alive) { allCells.push(newCells[x]); } }
	newCells.splice(0, newCells.length);
	
	for(var x in allCells)
	{
		if((updatePrey && allCells[x].prey && Math.random()<drPrey) ||
			(!updatePrey && !allCells[x].prey && Math.random()<drPred)) { allCells[x].kill(); }
	}
	
	var toRemove = [];
	for(var x in allCells)
	{
		if(!allCells[x].alive) { toRemove.push(allCells[x]); }
	}
	while(toRemove.length > 0)
	{
		allCells.splice( allCells.indexOf(toRemove[0]), 1 );
		toRemove.shift();
	}
	
	updatePrey = !updatePrey;
}
