// Num representing pieces in board array
var EMPTY  = 0;
var HUMAN    = 1;
var COMPUTER = 2;

var WIDTH = 7;
var HEIGHT = 6;

var lastLevel = 4;
var lastStarter = true;
var gs, lastMove;
var searchSequence = new Array(3,4,2,5,1,6,0); //ASK


function GameState(width, height) {
    this.board = new Array(width);

    // Setting up board array, setting all to empty
    for (var x=0; x<width; x++) {
        this.board[x] = new Array(height);

        for (var y=0; y<height; y++)
            this.board[x][y] = EMPTY;
    }

    this.currentPlayer = null;
    this.nextFree = new Array(width); //ASK
    this.winner = EMPTY;

    // Sets next free to 0?
    for (var x=0; x<WIDTH; x++) {
        this.nextFree[x] = 0;
    }
}



function drawBoard(el) {
    var str = "<div class='board'>";

    for (var y = HEIGHT-1; y >= 0; y--) {
        for (var x=0; x < WIDTH; x++) {
            if (gs.board[x][y] == EMPTY) {
                str += "<span class='empty' column='" + x + "'>n</span>";
			}
            else if (gs.board[x][y] == HUMAN) {
				if (lastMove != null && lastMove == x) {
					str += "<span class='lastMoveSign'>r</span>";
					lastMove = null;
				}
                str += "<span class='red' column='" + x + "'>n</span>";
			}
            else {
				if (lastMove != null && lastMove == x) {
					str += "<span class='lastMoveSign'>r</span>";
					lastMove = null;
				}
                str += "<span class='blue' column='" + x + "'>n</span>";
			}
        }
        str += "<br>";
    }

    str += "</div>";

    el.innerHTML = str;
}



function switchPlayer() {
    gs.currentPlayer = (gs.currentPlayer == HUMAN) ? COMPUTER : HUMAN;
}


//xDir/yDir: -1, 0 or 1
// ASK
function find(startX, startY, xDir, yDir) {
    var x,y;
    var opponent = (gs.currentPlayer == HUMAN) ? COMPUTER : HUMAN;
    var res = new Array(7);

    for (var i=0; i<7; i++) {
        x = startX + (i-3)*xDir;
        y = startY + (i-3)*yDir;

        if (x < 0 || x > WIDTH-1 || y < 0 || y > HEIGHT-1)
            res[i] = opponent;
        else
            res[i] = gs.board[x][y];
    }

    return res;
}



function howGood(seq) {
    var free1 = 0;
    var free2 = 0;
    var markers = 0;

    // Look to the left
    for (var i=2; i>=0; i--) {
        if (seq[i] == gs.currentPlayer && free1 >= 1)
            break;
        else if (seq[i] == gs.currentPlayer)
            markers++;
        else if (seq[i] == EMPTY)
            free1++;
        else
            break;
    }

    // Look to the right
    for (var i=4; i<=6; i++) {
        if (seq[i] == gs.currentPlayer && free2 >= 1)
            break;
        else if (seq[i] == gs.currentPlayer)
            markers++;
        else if (seq[i] == EMPTY)
            free2++;
        else
            break;
    }

    // Calculate how good the sequence is
    if (markers + 1 >= 4)
        return 10000;
    else if (markers + 1 == 3 && free1 >= 1 && free2 >= 1)
        return 150;
    else if (markers + 1 == 3 && ((free1 >= 1 && free2 == 0) || (free1 == 0 && free2 >= 1)))
        return 100;
    else if (markers + 1 == 2 && free1 >= 1 && free2 >= 1)
        return 30
    else if (markers + 1 == 2 && ((free1 >= 2 && free2 == 0) || (free1 == 0 && free2 >= 2)))
        return 30;
    else
        return 0;

}



function findWinner(x,y) {
    if (evaluate(x,y) >= 10000) {
        return gs.currentPlayer;
    }
    else
        return EMPTY;
}



function move(x) {
    var y;

    if (gs.nextFree[x] < HEIGHT) {
        y = gs.nextFree[x];
        gs.nextFree[x]++;
        gs.board[x][y] = gs.currentPlayer;
    }
    else {
        alert("This row is full!");
    }

    return findWinner(x,y);
}



function undoMove(x) {
    var y;

//  if (gs.nextFree[x] > 0) {
        y = gs.nextFree[x] - 1;
        gs.board[x][y] = EMPTY;
        gs.nextFree[x]--;
//  }
//  else
//      alert("This row is empty");
}



function evaluate(x,y) {
    var total = 0;

//  if (gs.board[x][y] == gs.currentPlayer) {
        total = howGood(find(x, y, 1, 0)) +
                howGood(find(x, y, 1, 1)) +
                howGood(find(x, y, 1,-1)) +
                howGood(find(x, y, 0, 1));
//  }

    return total;
}



function isBoardFull() {
    for (var x=0; x < WIDTH; x++)
        if (gs.nextFree[x] < HEIGHT)
            return false;

    return true;
}



function miniMax(depth, alpha, beta, maximize) {
    var tmp = new Object();
    var value, bestValue, x, bestMove;

    if (maximize)
        bestValue = alpha;
    else
        bestValue = beta;

//    for (x=0; x < WIDTH; x++) {
//	var firstLoop = true;
//	var middle = Math.floor(WIDTH/2);
//	for (x = middle; x != middle || firstLoop; x = (x+1) % WIDTH) {
	for (var i=0; i<WIDTH; i++) {
		x = searchSequence[i];
		firstLoop = false;
		
        if (maximize) {
            if (bestValue >= beta) {
                tmp.bestValue = bestValue;

                return tmp;
            }
        }
        else {
            if (bestValue <= alpha) {
                tmp.bestValue = bestValue;

                return tmp;
            }
        }

        if (gs.board[x][HEIGHT-1] == EMPTY) {

            gs.winner = move(x);

            if (isBoardFull()) {
                value = evaluate(x, gs.nextFree[x]-1);
                if (!maximize) value = -value;

                tmp.bestMove = x;
                tmp.bestValue = value;

                undoMove(x);

                return tmp;
            }

            if (depth == 0 || gs.winner != EMPTY) {
                value = evaluate(x, gs.nextFree[x]-1);
                if (!maximize) value = -value;
            }
            else {
                switchPlayer();

                if (maximize)
                    value = miniMax(depth-1, bestValue, beta, false).bestValue;
                else
                    value = miniMax(depth-1, alpha, bestValue, true).bestValue;

                switchPlayer();
            }

            if ((maximize && (value > bestValue)) || ((!maximize) && (value < bestValue))) {
                bestValue = value;
                bestMove = x;
            }

            undoMove(x);
        }
    }

    tmp.bestMove = bestMove;
    tmp.bestValue = bestValue;

    return tmp;
}


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