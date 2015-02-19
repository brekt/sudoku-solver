var input = '158 2  6 2   8  9  3  7 8 2 6 74      4 6 7      19 5 4 9 3  2  2  5   8 7  9 413';

// This is the puzzle constructor with methods to initialize and solve the puzzle.

function Sudoku(input) {
	if (input.length !== 81) {
		return null;
	}
	var squareArray = [];
	var inputInts = input.split('').map(function(value) {
		if (value === ' ') {
			return null;
		}
		else {
			return parseInt(value);
		}
	});
	
	inputInts.forEach(function(value, index) {
		var square = new Square(value, index);
		squareArray.push(square); 
	});

	this.solve = function() {
		squareArray.forEach(function(square) {
			if (square.answer === null) {
				squareArray.forEach(function(checkSquare) {
					if (checkSquare.answer !== null) {
						if (checkSquare.column === square.column) {
							delete square.possibilities[checkSquare.answer];
						}
						if (checkSquare.row === square.row) {
							delete square.possibilities[checkSquare.answer];
						}
						if (checkSquare.box === square.box) {
							delete square.possibilities[checkSquare.answer];
						}
					}
				});	
			}
		});
	}
	this.report = function() {
		var answerArray = [];
		squareArray.forEach(function(square) {
			if(square.answer !== null) {
				answerArray.push(square.answer);
			}
		});
		console.log(answerArray.length);
	}
	return this;
}

var sudoku = new Sudoku(input);
sudoku.report();
sudoku.solve();
sudoku.report();

// This function gives us the row, column, and box number of each of the 81 squares.

function Square(answer, squareIndex) {
	this.column = squareIndex % 9;
	this.row = Math.floor(squareIndex / 9);
	this.answer = answer;
	this.box = parseInt((Math.floor(this.row / 3).toString() + Math.floor(this.column / 3).toString()), 3);
	this.possibilities = setPoss();
	
	function setPoss() {
		var obj = {};
		for (var i = 1; i <= 9; i++) {
			obj[i] = true;
		}
		return obj;
	}

	this.squareSolve = function() {
		if (this.possibilities.length === 1) {
			this.answer = Object.keys(this.possibilities)[0];
		}
	}
}