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
    this.lastMove = {x: -1, y: -1};    

    this.board         = new Array(this.WIDTH);
    this.currentPlayer = null;
    this.winner        = this.EMPTY;

    // Setting up board array, setting all to empty
    for (var x = 0; x < this.WIDTH; x++) {
        this.board[x] = new Array(this.HEIGHT);

        for (var y = 0; y < this.HEIGHT; y++)
            this.board[x][y] = this.EMPTY;
    }
}

// Displays the board
GameState.prototype.drawBoard = function() { 
    var str = "<div class='board'>";

    for (var y = this.HEIGHT-1; y >= 0; y--) {
        for (var x=0; x < this.WIDTH; x++) {
            if (this.board[x][y] == this.EMPTY) {
                str += "<span class='empty' column='" + x + "'>_ </span>";
            }
            else if (this.board[x][y] == this.PLAYER1) {
                // if (lastMove != null && lastMove == x) {
                //  str += "<span class='lastMoveSign'>r</span>";
                //  lastMove = null;
                // }
                str += "<span class='red' column='" + x + "'>n</span>";
            }
            else {
                // if (lastMove != null && lastMove == x) {
                //  str += "<span class='lastMoveSign'>r</span>";
                //  lastMove = null;
                // }
                str += "<span class='blue' column='" + x + "'>n</span>";
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
    if ((x < this.WIDTH && x >= 0) && (y < this.HEIGHT && y >= 0)) {
        if (this.board[x][y] == 0) {
            if (y == 0) {
                return true;
            } 
            else if (this.board[x][y-1] != 0) { //Checks if a piece exists below this piece
                return true;
            }
        }
    }  
    return false; 
}


// Handles the players move
// return boolean
GameState.prototype.move = function(xColIndex) {
    var yRowIndex = this.board[x].length;

    if (this.validMove(xColIndex,yRowIndex)) {
        this.board[x][y] = this.currentPlayer;
        this.lastMove = {x: xColIndex, y: yRowIndex};
        //[{ "x": x }, { "y": "valueN" }]
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
    var curWinner = this.board[x][y];
    var curLength = 1;

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
                while(curX < WIDTH && curX > 0 && curY < HEIGHT && curY > 0) {
                    if(this.board[curX][curY] == curWinner) {
                        ++curLength;
                    } else {
                        break;
                    }
                    curX += deltaX;
                    curY += deltaY;
                }

                var curNegX = x - deltaX;
                var curNegY = y - deltaY;
                while(curNegX  < WIDTH && curNegX > 0 && curNegY < HEIGHT && curNegY > 0) {
                    if(this.board[curNegX][curNegY ] == curWinner) {
                        ++curLength;
                    } else {
                        break;
                    }
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
}


// Simple check to see if the board is full without a winning sequence 
// returns a boolean 
GameState.prototype.staleMate = function() {
    if(!findWinner()) {
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
    
    // Error message comes from wait for click
    switch(this.waitForClick()) {
        case 1: 
            return this.INVALIDMOVE;
            break;
    }
    
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

//FIXME what is happening
GameState.prototype.waitForClick = function() {
    document.getElementById("boardDiv").onclick = new Function(this + ".columnClick()");
}

GameState.prototype.columnClick = function() {
    var el = window.event.srcElement; // FIXME is there a better way to do this? we can have listeners on the column elements on da page

    if (el.column) {
        var x = parseInt(el.column);

        this.move(x);

    //  outputEl.style.cursor = "wait";
        document.getElementById("boardDiv").onclick = null;
        this.drawBoard();
        this.continueGame(); 
    }
}


//var tmpOutputEl;
// function continueGame(column, depth, outputEl) {
//     var winner, x;

//     winner = move(column);

//     lastMove = column;
    
//     drawBoard(outputEl);

//     if (winner != EMPTY || isBoardFull()) {
//         finished(winner);
//         return;
//     }

//     switchPlayer();

//     if (gs.currentPlayer == PLAYER1) {
//         waitForClick(depth, outputEl);
//     }
//     else {
//         // the following trick is used so that the board is redrawn before the heavy miniMax is called
//         tmpOutputEl = outputEl;
//         window.setTimeout("lastMove = miniMax(" + depth + ", -100000, 100000, true).bestMove; continueGame(lastMove," + depth + ", tmpOutputEl)", 1);
//     }
// }

// function finished(who) {
//     var res;
//     if (who == EMPTY)
//         res = "Game is draw";
//     else if (who == PLAYER1)
//         res = "Red wins";
//     else
//         res = "Yellow wins";

//     var str = '<table cellspacing="0" cellpadding="0"><tr>\
//                 <td class="title">Game result...</td>\
//             </tr><tr><td>';
//     str += res;
//     str += '</td></tr><tr>\
//                 <td valign="bottom" align="right"><button onclick="showDialogue(sStart())" onmousedown="window.event.cancelBubble = true">New Game</button>&nbsp;<button onclick="window.close()" onmousedown="window.event.cancelBubble = true">Quit</button>\
//             </tr></table>';

//     showDialogue(str);
// }


GameState.prototype.gameOver = function() {
    // grey out the board with a light fade, and display "Player 'winner' Wins!"
    // TODO
}


function main() {  
    var gs = new GameState(); 
    var result = 0; //result of play

    gs.currentPlayer = gs.PLAYER1;
    gs.drawBoard();

     // FIXME is this comparison correct?
    while(result == gs.CONTINUE) { 
        result = gs.play();
        switch(result) {
            case 1: //Invalid Move 
                // TODO display a little box telling the player that their move is invalid
                break;       
        }
    }

    gs.gameOver(); //we'll have to write this, will handle game over cleanup
}

window.onload = main();


