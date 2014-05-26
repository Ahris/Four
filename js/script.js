// possible error, need to catch in main
// - combine the methods: cont and switch players in play
// - check in four directions. direction is a set array. twp for loops? one loop for direction, one loop moving in both directions

function GameState() {
    // Num representing pieces in board array
    this.EMPTY    = 0;
    this.PLAYER1  = 1;
    this.PLAYER2  = 2;
    this.WIDTH    = 7;
    this.HEIGHT   = 6;

    // Return types
    this.STALEMATE   = -2; 
    this.GAMEOVER    = -1;
    this.CONTINUE    =  0;
    this.INVALIDMOVE =  1; 

    this.lastStarter = true;
    this.lastMove    = {x: -1, y: -1}; // no last move when you first start game 
    this.result       = this.CONTINUE;  

    this.board         = new Array(this.WIDTH);
    this.colLengths    = new Array(this.WIDTH);
    this.currentPlayer = this.EMPTY;
    this.winner        = this.EMPTY;

    // Setting up board array, setting all to empty
    for (var x = 0; x < this.WIDTH; x++) {
        this.board[x] = new Array(this.HEIGHT);
        this.colLengths[x] = 0;

        for (var y = 0; y < this.HEIGHT; y++)
            this.board[x][y] = this.EMPTY;
    }
}

// Displays the board
GameState.prototype.drawBoard = function() { 
console.log("Got to drawBoard");
    var str = "<div class='board'>";

    for (var y = this.HEIGHT-1; y >= 0; y--) {
        for (var x=0; x < this.WIDTH; x++) {
            if (this.board[x][y] == this.EMPTY) {
                str += "<span class='empty " + x + "'>_ </span>";
            }
            else if (this.board[x][y] == this.PLAYER1) {
                str += "<span class='red " + x + "'>x </span>";
            }
            else {
                str += "<span class='yellow " + x + "'>o </span>";
            }
        }
        str += "<br>";
    }

    str += "</div>";

    document.getElementById("boardDiv").innerHTML = str;
};



// Checks if a square is empty, which determines if a move is valid
// returns boolean
GameState.prototype.validMove = function(x,y) {
console.log("VALID MOVE " + "x: " + x + " y: " + y);

    if ((x < this.WIDTH && x >= 0) && (y < this.HEIGHT && y >= 0)) {
        if (this.board[x][y] == this.EMPTY) {   
            if (y == 0) {
                return true;
            } 
            else if (this.board[x][y-1] != this.EMPTY) { //Checks if a piece exists below this piece
                return true;
            }
        }
    }  
    return false; 
}


// Handles the players move
// return boolean
GameState.prototype.move = function(xColIndex) {
    var yRowIndex = this.colLengths[xColIndex];

    if (this.validMove(xColIndex,yRowIndex)) { 
console.log("Got a new move!!! Curplayer: " + this.currentPlayer + " x: " + xColIndex + " y: " + yRowIndex);
        this.board[xColIndex][yRowIndex] = this.currentPlayer;
        this.lastMove = {x: xColIndex, y: yRowIndex};
        this.colLengths[xColIndex] += 1;
        return true;
    } else {
        //When false, main method returns an error message telling the user the row is full
        return false;
    }
}

// Checks that the cooridnates are within the board dimensions
// and that piece at that location is equal to the player who made the last move
GameState.prototype.validDirection = function(curX, curY, curWinner) {
    if ((curX < this.WIDTH && curX >= 0) && (curY < this.HEIGHT && curY >= 0)) {
        if (this.board[curX][curY] == curWinner) {                  
                return true;
        }   
    }
}

// Check to see if the last move is a winning move
// returns boolean
GameState.prototype.findWinner = function() { 
    var x = this.lastMove.x;
    var y = this.lastMove.y;
    var curLength = 1;
    var curWinner;

    if(x >= 0 && y >= 0) {
        curWinner = this.board[x][y]; // last move
        for(var deltaX = -1; deltaX < 2; deltaX++) {
            for(var deltaY = -1; deltaY < 2; deltaY++) {
                curLength = 1;  
                
                var curX = x + deltaX;
                var curY = y + deltaY;
                var curNegX = x - deltaX;
                var curNegY = y - deltaY;

console.log("curX: "+ (x+deltaX) + " curY: " + (y+deltaY) + " BOARD: "+ this.board[x+deltaX][y+deltaY]);

                if(deltaX == 0 && deltaY == 0) {
console.log("SELF");
                    continue; // Don’t check self!   
                } else if(this.validDirection(curX, curY, curWinner)) {
console.log("CHECKED");
                    // Found a matching piece
                    // Check direction of deltaX, deltaY and -deltaX, -deltaY

console.log("curX: " + curX + " curY: " + curY);
                    while(this.validDirection(curX, curY, curWinner)) {
                        ++curLength;
console.log("Curlength " + curLength);
                        curX += deltaX;
                        curY += deltaY;
console.log("found a similar piece near by");
                    }

console.log("curNegX: " + curNegX + " curNegY: " + curNegY);
                    while(this.validDirection(curNegX, curNegY, curWinner)) {
                            ++curLength;
console.log("Curlength " + curLength);
                            curNegX -= deltaX;
                            curNegY -= deltaY; 
                            console.log("found a similar piece near by");
                    }

                    if (curLength == 4) {
console.log("Curlength " + curLength);
console.log("FOUDN 4 OF THE SAME PIECES");
                        this.winner = curWinner;
                        this.gameOver();
                        return true;
                    }
                }
            }
        }
    } else {
        curWinner = this.EMPTY;
    }
}


// Simple check to see if the board is full without a winning sequence 
// returns a boolean 
GameState.prototype.stalemate = function() {
    if(this.winner == this.EMPTY) {
        for(var i = 0; i < this.WIDTH; i++) { 
            if (this.colLengths[i] != this.HEIGHT) return false;
        }
        this.gameOver();
        return true;
    }
    return false;
}

// function undoMove(x) {
//     var y;

// //  if (gs.nextFree[x] > 0) {
//         y = gs.nextFree[x] - 1;
//         gs.board[x][y] = EMPTY;
//         gs.nextFree[x]--;
// //  }
// //  else
// //      alert("This row is empty");
// }

// Handles the error messages from WaitForClick
// returns an interger
// returns are same as they were in GameState::Continue, being passed up to main
GameState.prototype.play = function() {
    this.currentPlayer = (this.currentPlayer == this.PLAYER1) ? this.PLAYER2 : this.PLAYER1;
    document.getElementById("state").innerHTML = "Player " + this.currentPlayer;

    this.findWinner();
    this.stalemate();
}

GameState.prototype.columnClick = function() {
    var el = window.event.target; // FIXME is there a better way to do this? we can have listeners on the column elements on da page
console.log(el.className.split(" ")[1]);

    if (el.className.split(" ")[1]) {
        var x = parseInt(el.className.split(" ")[1]);
        this.move(x);

    //  outputEl.style.cursor = "wait";
        document.getElementById("boardDiv").onclick = null;
        this.drawBoard();
        this.result = this.play(); 
    }
}

GameState.prototype.gameOver = function() {
    // grey out the board with a light fade, and display "Player 'winner' Wins!"
    // TODO
console.log("GAME OVER");
    document.getElementById("state").innerHTML = "Player " + this.winner + " wins";

    document.getElementById("boardDiv").removeEventListener("click", function(){
        gs.columnClick();
    }, false);
}


function main() {  
    var gs = new GameState(); 
    gs.currentPlayer = gs.PLAYER1;

    document.getElementById("state").innerHTML = "Player " + gs.currentPlayer;
    gs.drawBoard();
    document.getElementById("boardDiv").addEventListener("click", function(){
        gs.columnClick();
    }, false);
}

window.onload = main();