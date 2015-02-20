// this is the sudoku module

var Cell = require('./cell');
var CellCollection = require('./cellCollection');
var Set = require('set');


// The Sudoku constructor initializes the puzzle with an input string
// and has methods to solve and print the puzzle.

function Sudoku(inputString) {

  // check to make sure input string is a complete puzzle

  if (inputString.length !== 81) { 
    console.log('Invalid puzzle string!');
    return null;
  }

  // set up the data structures to hold the puzzle info:
  // an array of all cells, and arrays of all rows, boxes and columns 

  var cellArray = [];
  var boxArray = [];
  var rowArray = [];
  var colArray = [];

  for (var i = 0; i < 9; i++) {
    var box = new CellCollection(i);
    var row = new CellCollection(i);
    var col = new CellCollection(i);
    boxArray.push(box);
    rowArray.push(row);
    colArray.push(col);
  }

  // split input into array w/ answers where present and null otherwise

  var cellValues = inputString.split('').map(function(value) { 
    if (value === '.' || value === ' ') {
      return null;
    }
    else {
      return parseInt(value, 10);
    }
  });
  
  // push a new 'cell' object to an array of all cells for each value in input
  // also, push each cell into the arrays representing the appropriate
  // column, row, and box

  cellValues.forEach(function(value, index) {  
    var cell = new Cell(value, index);
    if(value){
      boxArray[cell.box].setMember(value);
      rowArray[cell.row].setMember(value);
      colArray[cell.col].setMember(value);
    }
    boxArray[cell.box].cells.push(cell);
    rowArray[cell.box].cells.push(cell);
    colArray[cell.box].cells.push(cell);
    cellArray.push(cell); 
  });
  
  this.basicSolve = function() {

    // loop over the puzzle until it is solved or no further answers can be found.

    var changed = true;
    while (numSolved() < 81 && changed) {     
      changed = false;

      // loop over all unsolved cells

      cellArray.forEach(function(currentCell) {           
	if ( !currentCell.answer() ) {      

	  // compare the currentCell with all other cells in the same row, column, or box
	  
	  getRelatedCells(currentCell).some(function(otherCell) {

	    // if the cell is solved and the solution remains as a possibility
	    // for the currentCell, remove the possibility and indicate that the puzzle
	    // has been changed.

	    if ( otherCell.answer() && currentCell.isPossible( otherCell.answer() ) ) { 
	      currentCell.removePossibility( otherCell.answer() );  
	      changed = true;  
	      
	      // if currentCell has now been solved break out of loop
	      // and remove that possibility from all related cells
	      if ( currentCell.answer() ){
		getRelatedCells(currentCell).forEach(function(relatedCell){
		  relatedCell.removePossibility(currentCell.answer());
		});
		return true;
	      }
	    } return false;
	  });
	}
      });
    }
    printPuzzle();
  };

  this.solve = function() {
    printPuzzle();
    while( numSolved() < 81 ) {
      this.basicSolve();
      this.cellCollectionSolve(boxArray);
      this.cellCollectionSolve(rowArray);
      this.cellCollectionSolve(colArray);
    }
    printPuzzle();
  };

  this.cellCollectionSolve = function(cellCollectionArray) {

    // loop over the given cellCollections until the puzzle is
    // solved or no further answers can be found.

    var changed = true;
    while (numSolved() < 81 && changed) {
      changed = false;

      // loop over each cell collection 

      cellCollectionArray.forEach(function(cellCollection){

	// loop over each unsolved cell within a collection

	cellCollection.cells.some(function(currentCell){
	  if ( !currentCell.answer() ) {

	    // create a new set of all remaining possibilites in the collection
	    // besides those from the currentCell

	    var allPossibles = new Set([]);
	    cellCollection.cells.forEach(function(otherCell){
	      if (currentCell.index !== otherCell.index){
		allPossibles = allPossibles.union(otherCell.possibles);
	      }
	    });

	    // create a new set comprising all the answers that can't possibly be
	    // in any other cell in the collection

	    var impossibles = new Set([1,2,3,4,5,6,7,8,9]).difference(allPossibles);

	    // if there is only one answer that can't possibly be anywhere else
	    // in the collection it must belong in the current cell.
	    // in that case indicate a change and break out of the loop.

	    if (impossibles.size() === 1){
	      currentCell.possibles = impossibles;
	      changed = true;
	      return true;
	    }
	  } return false;
	});
      });
    }
  };

  this.cellReport = function(index) {
    console.log(cellArray[index].possibles);
  };

  this.fullReport = function(){
    boxArray.forEach(function(box){
      console.log(box.members);
    });
  };

  // return a set of all the cells in the same row, column, or box as the given cell

  function getRelatedCells(cell) {
    var related =  boxArray[cell.box].cells
      .concat(rowArray[cell.row].cells)
      .concat(colArray[cell.col].cells);
    return related.filter(function(related){
      return related.index !== cell.index;
    });
  }

  function setMember(cell) {
    boxArray[cell.box].setMember(cell.answer());
    rowArray[cell.row].setMember(cell.answer());
    colArray[cell.col].setMember(cell.answer());
  }

  //  count and return the number of solved cells

  function numSolved() { 
    var answerArray = [];
    cellArray.forEach(function(cell) {
      if(cell.answer()) {
	answerArray.push(cell.answer());
      }
    });
    return answerArray.length;
  };

  // print a nicely formatted puzzle to the console

  function printPuzzle() {  
    console.log(numSolved() + ' cells solved.');
    var row = [];
    var border = "+-------+-------+-------+";
    var rowCount = 3;
    cellArray.forEach(function(cell) {
      if (row.length === 3 || row.length === 7){
	row.push('|');
      }
      if (row.length < 11) {
	row.push(cell.answer() || ' ');
      } else {
      	if(rowCount > 2) {
	  console.log(border);
	  rowCount = 0;
	}
	console.log('| ' + row.join(' ') + ' |');
	row = [];
	rowCount++;
	row.push(cell.answer() || ' ');
      }
    });
    console.log('| ' + row.join(' ') + ' |');
    console.log(border);
  };

  return this;
}

module.exports = Sudoku;
