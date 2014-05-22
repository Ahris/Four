// possible error, need to catch in main
// - invalid move, column is full

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


GameState.prototype.switchPlayer = function() {
    this.currentPlayer = (this.currentPlayer == this.PLAYER1) ? this.PLAYER2 : this.PLAYER1;
};

// Checks if a square is empty, which determines if a move is valid
// returns boolean
GameState.prototype.validMove = function(x,y) {
    console.log("VALID MOVE");
    console.log("x: " + x);
    console.log("y: " + y);

    if ((x < this.WIDTH && x >= 0) && (y < this.HEIGHT && y >= 0)) {
        console.log("first if in valid move");
        if (this.board[x][y] == this.EMPTY) {   
            console.log("second if in valid move");
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
    console.log("PARAM xColIndex " + xColIndex);
    var yRowIndex = this.colLengths[xColIndex];

    if (this.validMove(xColIndex,yRowIndex)) { 
        console.log("Got a new move!!! Curplayer: " + this.currentPlayer + " x: " + xColIndex + " y: " + yRowIndex);
        this.board[xColIndex][yRowIndex] = this.currentPlayer;
        console.log(this.board[xColIndex][yRowIndex] + " new piece holla");
        this.lastMove = {x: xColIndex, y: yRowIndex};
        //[{ "x": x }, { "y": "valueN" }]   
        this.colLengths[xColIndex] += 1;
        return true;
    } else {
        //When false, main method returns an error message telling the user the row is full
        return false;
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
        curWinner = this.board[x][y];
        for(var deltaX = -1; deltaX < 2; ++deltaX) {
            for(var deltaY = -1; deltaY < 2; ++deltaY) {
                curLength = 1;  

                if(deltaX == 0 && deltaY == 0) {
                    continue; // Don’t check self!   
                } else if(this.board[x+deltaX][y+deltaY] == curWinner) {
                    // Found a matching piece
                    // Check direction of deltaX, deltaY and -deltaX, -deltaY
                    var curX = x + deltaX;
                    var curY = y + deltaY;
                    while(curX < this.WIDTH && curX > 0 && curY < this.HEIGHT && curY > 0) {
                        if(this.board[curX][curY] == curWinner) {
                            ++curLength;
                        } else break;
                        curX += deltaX;
                        curY += deltaY;
                    }

                    var curNegX = x - deltaX;
                    var curNegY = y - deltaY;
                    while(curNegX  < this.WIDTH && curNegX > 0 && curNegY < this.HEIGHT && curNegY > 0) {
                        if(this.board[curNegX][curNegY ] == curWinner) {
                            ++curLength;
                        } else break;
                        curX -= deltaX;
                        curY -= deltaY; 
                    }

                    if (curLength == 4) {
                        this.winner = curWinner;
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
    if(!this.findWinner()) {
        for(var i = 0; i < this.WIDTH; ++i) { 
            if (this.board[i].length != this.HEIGHT) return false;
        }
        return true;
    }
    return false;
}

// Continue method switches players, checks winner, and checks stalemate
// Gets called after the wait for turn method finds a executes a turn
// return 0 = cont normally
//        1 = found winner
//        2 = stalemate
GameState.prototype.continueGame = function() {
    this.switchPlayer();
    if(this.findWinner()) {
        return this.GAMEOVER;
    }
    if(this.stalemate()) {
        return this.STALEMATE;
    }
    return this.CONTINUE;
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
    this.drawBoard();
    
    switch(this.continueGame()) {
        case 0: 
            return this.CONTINUE;
            break;
        case 1: 
            return this.GAMEOVER;
            break;
        case 2: 
            return this.STALEMATE;
            break;
    }
}

GameState.prototype.columnClick = function() {
    var el = window.event.target; // FIXME is there a better way to do this? we can have listeners on the column elements on da page
    console.log(el.className.split(" ")[1]);

    if (el.className.split(" ")[1]) {
        var x = parseInt(el.className.split(" ")[1]);
        console.log("number " + x);
        this.move(x);

    //  outputEl.style.cursor = "wait";
        document.getElementById("boardDiv").onclick = null;
        this.drawBoard();
        this.continueGame(); 
    }
}

GameState.prototype.gameOver = function() {
    // grey out the board with a light fade, and display "Player 'winner' Wins!"
    // TODO
}


function main() {  
    var gs = new GameState(); 
    var result = 0; // result of play

    gs.currentPlayer = gs.PLAYER1;
    gs.drawBoard();

    document.getElementById("boardDiv").addEventListener("click", function(){
        gs.columnClick();
    }, false);

     // FIXME is this comparison correct?
    while(result == gs.CONTINUE) {  
        result = gs.play();
        // switch(result) {
        //     case 1: //Invalid Move 
        //         // TODO display a little box telling the player that their move is invalid
        //         break;       
        // }
    }
    gs.gameOver(); //we'll have to write this, will handle game over cleanup
}

window.onload = main();


