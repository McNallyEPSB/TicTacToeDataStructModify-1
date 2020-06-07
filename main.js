

var c = document.getElementById("myCanvas");
var ctx = c.getContext ("2d");
c.width = 450;
c.height = 450;

let numRows = 3;
let numCols = 3;
let gameBoard = new Array(numRows);
for (let c = 0; c < gameBoard.length; c++) { 
    gameBoard[c] = new Array(numCols); 
}

let spacingHor = c.width/numCols;
let spacingVert = c.height/numRows;

let xFill = c.width/numCols;
let yFill = c.height/numRows;

let currentPlayer = 1;

ctx.beginPath();
ctx.strokeStyle="black";
ctx.lineWidth = "1";


let initBoard = function(){//initialize the game state in the data structure behind the user interface - currently all to 0 (not onwned by first player :1 or second player:2)
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        gameBoard[r][c] = 0;
        console.log(gameBoard[r][c]);
      }
  }
}

let drawBoard = function(){//draw the user interface in the canvas to represent state stored in the board data structure
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        if (gameBoard[r][c] == 0)
          ctx.fillStyle = 'white';
        else if (gameBoard[r][c]== 1)//is this because current player = 1?
          ctx.fillStyle = 'red';
        else if (gameBoard[r][c] == 2)
          ctx.fillStyle = 'blue';
        
      
        ctx.strokeRect(c*spacingHor, r*spacingVert, xFill, yFill);
        ctx.fillRect(c*spacingHor, r*spacingVert, xFill, yFill);                
      }
  }
}

//https://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
  function getMousePos(canvas, evt) {//get the mouseposition in relation to the canvas - css must have canvas position set to relative
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
 
   function getCanvasRC(canvas, evt) {//converts the mouse position from x,y relative to canvas into which row and column
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
    
  if (gameBoard[canvasRC.r][canvasRC.c]==0){//if a row and column is unclaimed (gamestate 0) then it is claimed by whoever's turn it is
    console.log('Row: ' + (canvasRC.r) + ' , Col: ' + (canvasRC.c));
    gameBoard[canvasRC.r][canvasRC.c] = currentPlayer;
    
    for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        console.log(gameBoard[r][c]);    
      }
    }
  drawBoard();
  if (currentPlayer == 1)//flip flop between player turns
      currentPlayer = 2;
    else 
      currentPlayer = 1;
  }
}, false);


//run the game
initBoard();
drawBoard();
//need to build 