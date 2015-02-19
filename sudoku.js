// this is the sudoku module

var Square = require('./square');
var Box = require('./puzzleElements').Box;
var Row = require('./puzzleElements').Row;
var Col = require('./puzzleElements').Col;

// This is the puzzle constructor with methods to initialize and solve the puzzle.

function Sudoku(input) {
  if (input.length !== 81) {          // check to make sure input string is a complete puzzle
    return null;
  }
  var squareArray = [];
  var boxArray = [];
  var rowArray = [];
  var colArray = [];

  for (var i = 0; i < 9; i++) {
    var box = new Box(i);
    var row = new Row(i);
    var col = new Col(i);
    boxArray.push(box);
    rowArray.push(row);
    colArray.push(col);
  }
//  console.log(boxArray, rowArray, colArray);

  var inputInts = input.split('').map(function(value) {          // split input into array w/ answers where present and null otherwise
    if (value === '.' || value === ' ') {
      return null;
    }
    else {
      return parseInt(value);
    }
  });
  
  inputInts.forEach(function(value, index) {       // create a new 'square' object for each cell and push them to an array
    var square = new Square(value, index);
    if(value){
      boxArray[square.box].setMember(value);
      rowArray[square.row].setMember(value);
      colArray[square.col].setMember(value);
    }
    squareArray.push(square); 
  });
  

  this.solve = function() {
    var loopCount = 0;
    while (this.report() < 81 && loopCount < 2) {       // loop over the puzzle until it is solved or no further answers can be found.
      squareArray.forEach(function(square) {           
	if (square.answer === null) {          // compare unsolved squares with all squares in same row, box, or col that have an answer.
	  squareArray.forEach(function(checkSquare) {
	    if (checkSquare.answer !== null && square.possibilities.contains(checkSquare.answer)) { 
	      if (checkSquare.col === square.col || checkSquare.row === square.row || checkSquare.box === square.box) {
		square.possibilities.remove(checkSquare.answer);    // if a num is already taken, remove it as a possibility from square
		loopCount = 0;                                      // if the puzzle has been altered, set loopCount back to zero
	      }
	    }
	  });
	  var newAnswer = square.squareSolve();                     // set the square's answer if only one possible number remains
	  if(newAnswer){
	    boxArray[square.box].setMember(newAnswer);
	    rowArray[square.row].setMember(newAnswer);
	    colArray[square.col].setMember(newAnswer);
	  }
	}
      });
      loopCount++;                            // increment loopCount
    }
  };

  this.report = function() {                   //  count and return the number of solved squares
    var answerArray = [];
    squareArray.forEach(function(square) {
      if(square.answer !== null) {
	answerArray.push(square.answer);
      }
    });
    return answerArray.length;
  };

  this.boxPrint = function() {
    console.log(boxArray);
  };

  this.printPuzzle = function() {              // print a nicely formatted sudoku to the console
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

module.exports = Sudoku;
