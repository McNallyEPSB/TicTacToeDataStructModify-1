//canvas setup
var c = document.getElementById("myCanvas");
var ctx = c.getContext ("2d");
c.width = 300;
c.height = 300;

//grid board setup
let numRows = 3;
let numCols = 3;
let gameBoard = new Array(numRows);
for (let c = 0; c < gameBoard.length; c++) { 
    gameBoard[c] = new Array(numCols); 
}

let xFill = c.width/numCols;
let yFill = c.height/numRows;
let spacingHor = c.width/numCols;
let spacingVert = c.height/numRows;

ctx.beginPath();
ctx.strokeStyle="black";
ctx.lineWidth = "1";

//gameplay variables
let clickable = true;
let possibleTurns = numRows*numCols;
let numTurns = 0;
let player1Wins = false;
let player2Wins = false;
let currentPlayer = 1;//could be overridden wuth random generator button and should indicate somewhere

//========================Canvas Grid functions========================================
//https://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
  function getMousePos(canvas, evt) {//get the mouseposition in relation to the canvas top left - css must have canvas position set to relative
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

//========================Game functions==============================================
/*to be complete
let randomPlayerOnStart = function(){//see who goes first
 currentPlayer = Math.ceil(Math.random()*2);
 initBoard();
}
*/

let initBoard = function(){//initialize the game state in the data structure behind the user interface - currently sets all tile states to 0 (not onwned by first player :tilestate 1 or second player: tile state 2)
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        gameBoard[r][c] = 0;
        console.log(gameBoard[r][c]);
      }
  }
  clickable = true;
  player1Wins = false;
  player2Wins = false;
  numTurns = 0;
  drawBoard();
}

let drawBoard = function(){//draw the user interface in the canvas to represent state stored in the board data structure
  for (let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++){
        if (gameBoard[r][c] == 0)
          ctx.fillStyle = 'white';
        else if (gameBoard[r][c]== 1)//is this because current player = 1?
          ctx.fillStyle = 'blue';
        else if (gameBoard[r][c] == 2)
          ctx.fillStyle = 'green';
        
      
        ctx.strokeRect(c*spacingHor, r*spacingVert, xFill, yFill);
        ctx.fillRect(c*spacingHor, r*spacingVert, xFill, yFill);                
      }
  }
  document.getElementById("playerTurn").innerHTML="It is currently player "+ currentPlayer +"'s turn"
  document.getElementById("playAgainButton").innerHTML="Game in Progress, Click to reset";
}

let gameOver = function(gameState){//determine who wins or draw
 if (gameState == 1){
   document.getElementById("playAgainButton").innerHTML="Player 1 wins! Click to play again";
   document.getElementById("playerTurn").innerHTML="GameOver";
   }
  else if (gameState == 2){
   document.getElementById("playAgainButton").innerHTML="Player 2 wins! Click to play again";
   document.getElementById("playerTurn").innerHTML="GameOver";
   }
  else{
   document.getElementById("playAgainButton").innerHTML="It's a tie! Click to play again";
   document.getElementById("playerTurn").innerHTML="GameOver";
  }

  clickable=false;
  console.log("Test"); 
}

//gameTurn eventListener --> actual gameplay
 myCanvas.addEventListener('click', function(evt) {
  if (clickable){
    var canvasRC = getCanvasRC(myCanvas, evt);


    if (gameBoard[canvasRC.r][canvasRC.c]==0){//if a row and column is unclaimed (tilestate 0) then it is claimed by whoever's turn it is
      numTurns +=1;//need to keep track for a tie gameState
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

    document.getElementById("playerTurn").innerHTML="It is currently player "+ currentPlayer +"'s turn"

    //check rows,cols and diagonals 
    for (let rows = 0; rows < numRows; rows++){
      for (let cols = 0; cols < numCols; cols++){
      if (gameBoard[rows][0]==1 && gameBoard[rows][1]==1 && gameBoard[rows][2]==1 ||gameBoard[0][cols]==1 && gameBoard[1][cols]==1 && gameBoard[2][cols]==1 )
          //gameOver(1);
          player1Wins = true;
        else if (gameBoard[rows][0]==2 && gameBoard[rows][1]==2 && gameBoard[rows][2]==2 ||gameBoard[0][cols]==2 && gameBoard[1][cols]==2 && gameBoard[2][cols]==2 )
          //gameOver(2);
          player2Wins = true;
      }
    }
    if (player1Wins)
      gameOver(1);
    else if (player2Wins)
      gameOver(2);
    else if (gameBoard[0][0]==1 && gameBoard[1][1]==1 && gameBoard[2][2]==1 ||gameBoard[0][2]==1 && gameBoard[1][1]==1 && gameBoard[2][0]==1)
      gameOver(1);
    else if (gameBoard[0][0]==2 && gameBoard[1][1]==2 && gameBoard[2][2]==2 ||gameBoard[0][2]==2 && gameBoard[1][1]==2 && gameBoard[2][0]==2)
      gameOver(2);
    else if (numTurns >= possibleTurns)
      gameOver(0);
  }
}, false);


//==========================run the game===============================================
initBoard();
drawBoard();
