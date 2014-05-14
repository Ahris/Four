function GameState() {
    // Num representing pieces in board array
    this.EMPTY    = 0;
    this.HUMAN    = 1;
    this.COMPUTER = 2;
    this.WIDTH    = 7;
    this.HEIGHT   = 6;

    this.lastLevel = 4;
    this.lastStarter = true;
    this.lastMove = lastMove;    
    this.searchSequence = new Array(3,4,2,5,1,6,0);   //ASK
    this.board = new Array(WIDTH);
    this.currentPlayer = null;
    //this.nextFree = new Array(WIDTH);               //ASK
    this.winner = EMPTY;

    // Setting up board array, setting all to empty
    for (var x=0; x<WIDTH; x++) {
        this.board[x] = new Array(HEIGHT);

        for (var y=0; y<HEIGHT; y++)
            this.board[x][y] = EMPTY;
    }
  
    // // Sets next free to 0?
    // for (var x=0; x<WIDTH; x++) {
    //     this.nextFree[x] = 0;
    // }
}



GameState.prototype.drawBoard = function(el) { 
    var str = "<div class='board'>";

    for (var y = HEIGHT-1; y >= 0; y--) {
        for (var x=0; x < WIDTH; x++) {
            if (this.board[x][y] == EMPTY) {
                str += "<span class='empty' column='" + x + "'>n</span>";
			}
            else if (this.board[x][y] == HUMAN) {
				// if (lastMove != null && lastMove == x) {
				// 	str += "<span class='lastMoveSign'>r</span>";
				// 	lastMove = null;
				// }
                str += "<span class='red' column='" + x + "'>n</span>";
			}
            else {
				// if (lastMove != null && lastMove == x) {
				// 	str += "<span class='lastMoveSign'>r</span>";
				// 	lastMove = null;
				// }
                str += "<span class='blue' column='" + x + "'>n</span>";
			}
        }
        str += "<br>";
    }

    str += "</div>";

    el.innerHTML = str;
};


GameState.prototype.switchPlayer = function() {
    this.currentPlayer = (this.currentPlayer == HUMAN) ? COMPUTER : HUMAN;
};


//xDir/yDir: -1, 0 or 1
// ASK
// GameState.prototype.find = function(startX, startY, xDir, yDir) {
//     var x,y;
//     var opponent = (this.currentPlayer == HUMAN) ? COMPUTER : HUMAN;
//     var res = new Array(7);

//     for (var i=0; i<7; i++) {
//         x = startX + (i-3)*xDir;
//         y = startY + (i-3)*yDir;

//         if (x < 0 || x > WIDTH-1 || y < 0 || y > HEIGHT-1)
//             res[i] = opponent;
//         else
//             res[i] = this.board[x][y];
//     }
//     return res;
// };

// function howGood(seq) {
//     var free1 = 0;
//     var free2 = 0;
//     var markers = 0;

//     // Look to the left
//     for (var i=2; i>=0; i--) {
//         if (seq[i] == gs.currentPlayer && free1 >= 1)
//             break;
//         else if (seq[i] == gs.currentPlayer)
//             markers++;
//         else if (seq[i] == EMPTY)
//             free1++;
//         else
//             break;
//     }

//     // Look to the right
//     for (var i=4; i<=6; i++) {
//         if (seq[i] == gs.currentPlayer && free2 >= 1)
//             break;
//         else if (seq[i] == gs.currentPlayer)
//             markers++;
//         else if (seq[i] == EMPTY)
//             free2++;
//         else
//             break;
//     }

//     // Calculate how good the sequence is
//     if (markers + 1 >= 4)
//         return 10000;
//     else if (markers + 1 == 3 && free1 >= 1 && free2 >= 1)
//         return 150;
//     else if (markers + 1 == 3 && ((free1 >= 1 && free2 == 0) || (free1 == 0 && free2 >= 1)))
//         return 100;
//     else if (markers + 1 == 2 && free1 >= 1 && free2 >= 1)
//         return 30
//     else if (markers + 1 == 2 && ((free1 >= 2 && free2 == 0) || (free1 == 0 && free2 >= 2)))
//         return 30;
//     else
//         return 0;

// }



// function findWinner(x,y) {
//     if (evaluate(x,y) >= 10000) {
//         return gs.currentPlayer;
//     }
//     else
//         return EMPTY;
// }

// Checks if a square is empty, which determines if a move is valid
GameState.prototype.validMove = function(x,y) {
    if ((x < WIDTH && x >= 0) && (y < HEIGHT && y >= 0)) {
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
GameState.prototype.move = function(x) {
    var y = this.board[x].length;

    if (validMove(x,y)) {
        this.board[x][y] = this.currentPlayer;
        this.lastMove = ['x' = x, 'y' = y];
        return true;
    } else {
        //When false, main method returns an error message telling the user the row is full
        return false;
    }
}


// Check to see if the last move is a winning move
GameState.prototype.findWinner = function() { 
    var x = lastmove[x];
    var y = lastmove[y];
    var curWinner = this.board[x][y];
    var curLength = 1;

    for(int deltaX = -1; deltaX < 2; ++deltaX) {
        for(int deltaY = -1; deltaY < 2; ++deltaY) {

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
                if (curLength == 4) return true;
            }
        }
    }
}


// Simple check to see if the board is full without a winning sequence 
GameState.prototype.staleMate = function() {
    if(findWinner == false) {
        for(int i = 0; i < WIDTH; ++i) { 
            if (this.board[i].length != HEIGTH) return false;
        }
        return true;
    }
    return false;
}


// function move(x) {
//     var y;

//     if (gs.nextFree[x] < HEIGHT) {
//         y = gs.nextFree[x];
//         gs.nextFree[x]++;
//         gs.board[x][y] = gs.currentPlayer;
//     }
//     else {
//         alert("This row is full!");
//     }

//     return findWinner(x,y);
// }



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



// function evaluate(x,y) {
//     var total = 0;

// //  if (gs.board[x][y] == gs.currentPlayer) {
//         total = howGood(find(x, y, 1, 0)) +
//                 howGood(find(x, y, 1, 1)) +
//                 howGood(find(x, y, 1,-1)) +
//                 howGood(find(x, y, 0, 1));
// //  }

//     return total;
// }



// function isBoardFull() {
//     for (var x=0; x < WIDTH; x++)
//         if (gs.nextFree[x] < HEIGHT)
//             return false;

//     return true;
// }



// function miniMax(depth, alpha, beta, maximize) {
//     var tmp = new Object();
//     var value, bestValue, x, bestMove;

//     if (maximize)
//         bestValue = alpha;
//     else
//         bestValue = beta;

// //    for (x=0; x < WIDTH; x++) {
// //	var firstLoop = true;
// //	var middle = Math.floor(WIDTH/2);
// //	for (x = middle; x != middle || firstLoop; x = (x+1) % WIDTH) {
// 	for (var i=0; i<WIDTH; i++) {
// 		x = searchSequence[i];
// 		firstLoop = false;
		
//         if (maximize) {
//             if (bestValue >= beta) {
//                 tmp.bestValue = bestValue;

//                 return tmp;
//             }
//         }
//         else {
//             if (bestValue <= alpha) {
//                 tmp.bestValue = bestValue;

//                 return tmp;
//             }
//         }

//         if (gs.board[x][HEIGHT-1] == EMPTY) {

//             gs.winner = move(x);

//             if (isBoardFull()) {
//                 value = evaluate(x, gs.nextFree[x]-1);
//                 if (!maximize) value = -value;

//                 tmp.bestMove = x;
//                 tmp.bestValue = value;

//                 undoMove(x);

//                 return tmp;
//             }

//             if (depth == 0 || gs.winner != EMPTY) {
//                 value = evaluate(x, gs.nextFree[x]-1);
//                 if (!maximize) value = -value;
//             }
//             else {
//                 switchPlayer();

//                 if (maximize)
//                     value = miniMax(depth-1, bestValue, beta, false).bestValue;
//                 else
//                     value = miniMax(depth-1, alpha, bestValue, true).bestValue;

//                 switchPlayer();
//             }

//             if ((maximize && (value > bestValue)) || ((!maximize) && (value < bestValue))) {
//                 bestValue = value;
//                 bestMove = x;
//             }

//             undoMove(x);
//         }
//     }

//     tmp.bestMove = bestMove;
//     tmp.bestValue = bestValue;

//     return tmp;
// }


// The rest is special funtions for handling the GUI and starting of the game

function start(level, humanStarts) {
    var lvl = parseInt(level);

    if (isNaN(lvl) || lvl <= 0) {
        showDialogue(sNaN);
        return;
    }

	lastLevel = lvl;
	lastStarter = !humanStarts;
	
    gs = new GameState(WIDTH, HEIGHT);

    dialogue.style.display = "none";
    // The number represent the search depth.
    // A large value => better computer => more calculations

    drawBoard(boardDiv);

    if (humanStarts) {
        gs.currentPlayer = HUMAN;
        waitForClick(lvl, boardDiv);
    }
    else {
        gs.currentPlayer = COMPUTER;
		lastMove = miniMax(lvl, -100000, 100000, true).bestMove
        continueGame(lastMove, lvl, boardDiv);
    }
}


function waitForClick(depth, outputEl) {
	outputEl.style.cursor = "hand";
    outputEl.onclick = new Function("columnClick(" + depth + ", this)");
}

function columnClick(depth, outputEl) {
    var el = window.event.srcElement;

    if (el.column) {
        var x = parseInt(el.column);

        if (gs.nextFree[x] > HEIGHT-1) return;

		outputEl.style.cursor = "wait";
        outputEl.onclick = null;
        drawBoard(outputEl);
        continueGame(x, depth, outputEl);
    }
}


var tmpOutputEl;
function continueGame(column, depth, outputEl) {
    var winner, x;

    winner = move(column);

	lastMove = column;
	
    drawBoard(outputEl);

    if (winner != EMPTY || isBoardFull()) {
        finished(winner);
        return;
    }

    switchPlayer();

    if (gs.currentPlayer == HUMAN) {
        waitForClick(depth, outputEl);
    }
    else {
        // the following trick is used so that the board is redrawn before the heavy miniMax is called
        tmpOutputEl = outputEl;
		window.setTimeout("lastMove = miniMax(" + depth + ", -100000, 100000, true).bestMove; continueGame(lastMove," + depth + ", tmpOutputEl)", 1);
    }
}

function finished(who) {
    var res;
    if (who == EMPTY)
        res = "Game is draw";
    else if (who == HUMAN)
        res = "Red wins";
    else
        res = "Yellow wins";

    var str = '<table cellspacing="0" cellpadding="0"><tr>\
                <td class="title">Game result...</td>\
            </tr><tr><td>';
    str += res;
    str += '</td></tr><tr>\
                <td valign="bottom" align="right"><button onclick="showDialogue(sStart())" onmousedown="window.event.cancelBubble = true">New Game</button>&nbsp;<button onclick="window.close()" onmousedown="window.event.cancelBubble = true">Quit</button>\
            </tr></table>';

    showDialogue(str);
}

window.onload = function() {gs = new GameState(WIDTH, HEIGHT);
							drawBoard(boardDiv);
                           };