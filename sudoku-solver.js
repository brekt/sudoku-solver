var input = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';
var input2 = '5.1.83..7...72...........1...8....2..1..5.9....3.....1...9...8..4...75..39.4.....';



// This is the puzzle constructor with methods to initialize and solve the puzzle.

function Sudoku(input) {
  if (input.length !== 81) {
    return null;
  }
  var squareArray = [];
  var inputInts = input.split('').map(function(value) {
    if (value === '.' || value === ' ') {
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
    var loopCount = 0;
    while (this.report() < 81 && loopCount < 2) {
      squareArray.forEach(function(square) {
	if (square.answer === null) {
	  squareArray.forEach(function(checkSquare) {
	    if (checkSquare.answer !== null && square.possibilities[checkSquare.answer]) {
	      if (checkSquare.column === square.column || checkSquare.row === square.row || checkSquare.box === square.box) {
		delete square.possibilities[checkSquare.answer];
		loopCount = 0;
	      }
	    }
	  });	
	  square.squareSolve();
	}
      });
      loopCount++;
    }
  };

  this.report = function() {
    var answerArray = [];
    squareArray.forEach(function(square) {
      if(square.answer !== null) {
	answerArray.push(square.answer);
      }
    });
    return answerArray.length;
  };

  this.printPuzzle = function() {
    var row = [];
    var border = "+-------+-------+-------+";
    var rowCount = 3;
    squareArray.forEach(function(square) {
      if (row.length === 3 || row.length === 7){
	row.push('|');
      }
      if (row.length < 11) {
	row.push(square.answer || ' ');
      } else {
      	if(rowCount > 2) {
	  console.log(border);
	  rowCount = 0;
	}
	console.log('| ' + row.join(' ') + ' |');
	row = [];
	rowCount++;
	row.push(square.answer || ' ');
      }

    });
    console.log('| ' + row.join(' ') + ' |');
    console.log(border);
  };

  return this;
}

var sudoku = new Sudoku(input);
console.log("\nBefore - " + sudoku.report() + " answers:");
sudoku.printPuzzle();
sudoku.solve();
console.log("After - " + sudoku.report() + " answers:");
sudoku.printPuzzle();
console.log('');

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
    if (Object.keys(this.possibilities).length === 1) {
      this.answer = Object.keys(this.possibilities)[0];
    }
  };

  return this;
}
