// this is the sudoku module

var Square = require('./square');
var Box = require('./puzzleElements').Box;
var Row = require('./puzzleElements').Row;
var Col = require('./puzzleElements').Col;

var Set = require('set');

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
    boxArray[square.box].squares.push(square);
    rowArray[square.box].squares.push(square);
    colArray[square.box].squares.push(square);
    squareArray.push(square); 
  });
  

  this.naiveSolve = function() {
    var changed = true;
    while (report() < 81 && changed) {       // loop over the puzzle until it is solved or no further answers can be found.
      changed = false;
      squareArray.forEach(function(square) {           
	if ( !square.answer() ) {          // compare unsolved squares with all squares in same row, box, or col that have an answer.
	  squareArray.some(function(checkSquare) {
	    if ( ( checkSquare.col === square.col || checkSquare.row === square.row || checkSquare.box === square.box) && checkSquare.answer() ){
	      if ( square.possibilities.contains( checkSquare.answer() ) ) { 
		square.possibilities.remove(checkSquare.answer() );    // if a num is already taken, remove it as a possibility from square
		changed = true;  
		printPuzzle();
		if (square.answer()){
		  boxArray[square.box].setMember(square.answer());
		  rowArray[square.row].setMember(square.answer());
		  colArray[square.col].setMember(square.answer());
		  return true;
		}
	      }
	    } return false;
	  });
	}
      });
    }
  };

  this.superSolve = function() {
    while( report() < 81 ) {
      this.naiveSolve();
      this.elementSolve(boxArray);
      this.elementSolve(rowArray);
      this.elementSolve(colArray);
    }
  };

  this.elementSolve = function(elementArray) {
    var changed = true;
    while (report() < 81 && changed) {
      changed = false;
      elementArray.forEach(function(element){
	element.squares.some(function(square){
	  if ( !square.answer() ) {
	    var eliminated = new Set([]);
	    element.squares.forEach(function(otherSquare){
	      if (square !== otherSquare){
		eliminated = eliminated.union(otherSquare.possibilities);
	      }
	    });
	    var possible = new Set([1,2,3,4,5,6,7,8,9]).difference(eliminated);
	    if (possible.size() === 1){
	      square.possibilities = possible;
	      changed = true;
	      printPuzzle();
	      return true;
	    }
	  } return false;
	});
      });
    }
  };

  this.squareReport = function(index) {
    console.log(squareArray[index].possibilities);
  };

  this.fullReport = function(){
    boxArray.forEach(function(box){
      console.log(box.members);
    });
  };


  function report() {                   //  count and return the number of solved squares
    var answerArray = [];
    squareArray.forEach(function(square) {
      if(square.answer()) {
	answerArray.push(square.answer());
      }
    });
    return answerArray.length;
  };


  function printPuzzle() {              // print a nicely formatted sudoku to the console
    console.log(report() + ' cells solved.');
    var row = [];
    var border = "+-------+-------+-------+";
    var rowCount = 3;
    squareArray.forEach(function(square) {
      if (row.length === 3 || row.length === 7){
	row.push('|');
      }
      if (row.length < 11) {
	row.push(square.answer() || ' ');
      } else {
      	if(rowCount > 2) {
	  console.log(border);
	  rowCount = 0;
	}
	console.log('| ' + row.join(' ') + ' |');
	row = [];
	rowCount++;
	row.push(square.answer() || ' ');
      }

    });
    console.log('| ' + row.join(' ') + ' |');
    console.log(border);
  };

  return this;
}

module.exports = Sudoku;

/*
	    boxArray[square.box].setMember(square.answer());
	    rowArray[square.row].setMember(square.answer());
	    colArray[square.col].setMember(square.answer());
*/
