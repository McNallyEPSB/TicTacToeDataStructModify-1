

var c = document.getElementById("myCanvas");
var ctx = c.getContext ("2d");
c.width = 600;
c.height = 600;

let numRows = 3;
let numCols = 3;
let array = [numRows, numCols];

let spacingHor = c.width/numCols;
let spacingVert = c.height/numRows;

let xFill = c.width/numCols;
let yFill = c.height/numRows;

let currentPlayer = 1;

ctx.beginPath();
ctx.strokeStyle="black";
ctx.lineWidth = "1";


let initBoard = function(){
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        array[r,c] = 0;
        console.log(array[r,c]);
      }
  }
}



let drawBoard = function(){
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        if (array[r,c] == 0)
          ctx.fillStyle = 'white';
        else if (array[r,c] == 1)//is this because current player = 1?
          ctx.fillStyle = 'red';
        else if (array[r,c] == 2)
          ctx.fillStyle = 'black';
        
      
        ctx.strokeRect(c*spacingHor, r*spacingVert, xFill, yFill);
        ctx.fillRect(c*spacingHor, r*spacingVert, xFill, yFill);        
        
      }
  }
}



initBoard();
drawBoard();

//https://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
 
   function getCanvasRC(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      c: Math.floor((evt.clientX - rect.left)/c.width*numCols),
      r: Math.floor((evt.clientY - rect.top)/c.height*numRows)
    };
  }
 /*
  myCanvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(myCanvas, evt);
    console.log('Row: ' + Math.ceil(mousePos.y/c.height*numRows) + ' , Col: ' + Math.ceil(mousePos.x/c.width*numCols));
  }, false);
*/
 myCanvas.addEventListener('click', function(evt) {
    var canvasRC = getCanvasRC(myCanvas, evt);
    var currentX = canvasRC.r;
    var currentY = canvasRC.c;

  if (array[canvasRC.r, canvasRC.c]==0){
    console.log('Row: ' + (canvasRC.r) + ' , Col: ' + (canvasRC.c));
    array[currentX, currentY] = currentPlayer;
    
    for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        console.log(array[r, c]);    
      }
    }
  drawBoard();
  if (currentPlayer == 1)
      currentPlayer = 2;
    else 
      currentPlayer = 1;
  }
}, false);


