class Tile
{
	constructor(cx, cy)
	{
		this.x		= cx;
		this.y		= cy;
		this.index	= (cy * Map.width) + cx;
		this.cell	= null;
	}
}
var Map = {
	width	: 28,
	height	: 18,
	tiles	: [],
	
	generate : function(w, h)
	{
		this.width = w;
		this.height = h;
		this.tiles = [];
		
		for(var y = 0; y < h; y++)
		{
			for(var x = 0; x < w; x++)
			{
				this.tiles.push(new Tile(x, y));
			}
		}
	}
};
