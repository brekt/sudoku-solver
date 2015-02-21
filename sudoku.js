// this is the sudoku module

var Cell = require('./cell');
var Nonet = require('./nonet');
var Set = require('set');

var Combinatorics = require('js-combinatorics').Combinatorics;

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
    boxArray.push(new Nonet);
    rowArray.push(new Nonet);
    colArray.push(new Nonet);
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

    boxArray[cell.box].add(cell);
    rowArray[cell.row].add(cell);
    colArray[cell.col].add(cell);
    cellArray.push(cell); 
  });

  var allNonets = boxArray.concat(rowArray).concat(colArray);
  
  // loop over all cells and solve those with only one possibility

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
	      currentCell.removePossible( otherCell.answer() );  
	      changed = true;  
	      
	      // if currentCell has now been solved break out of loop
	      // and remove that possibility from all related cells
	      if ( currentCell.answer() ){
		getRelatedCells(currentCell).forEach(function(relatedCell){
		  relatedCell.removePossible(currentCell.answer());
		});
		return true;
	      }
	    } return false;
	  });
	}
      });
    }
  };

  // solve for naked pairs

  this.nakedPairs = function() {

    // loop over all nonets (groups of nine cells)

    allNonets.forEach(function(nonet) {

      // within each nonet, pull out cells with only 2 possibles

      var potentials = nonet.cells.filter(function(cell){
	return cell.possibles.size() === 2;
      });
      
      // if there is more than one cell with only two possibles left, continue

      if (potentials.length > 1) {
	
	potentials.forEach(function(cellOne, indexOne) {
	  
	  // for each cell with two possibles, find all cells with the same two possibles

	  var matches = potentials.filter(function(cellTwo, indexTwo) {
	    return cellTwo.possibles.union(cellOne.possibles).size() === 2 && indexOne !== indexTwo;
	  });

	  // if there is only one cell with the same two possibles, you have a naked pair
	  // remove those two numbers from the possibles of the other cells in the nonet

	  if (matches.length === 1) {
	    var pair = matches[0].possibles.get();
	    nonet.cells.forEach(function(cell){
	      cell.removePossible(pair[0]);
	      cell.removePossible(pair[1]);
	    });
	    matches[0].possibles.add(pair[0]);
	    matches[0].possibles.add(pair[1]);
	    cellOne.possibles.add(pair[0]);
	    cellOne.possibles.add(pair[1]);
	  }

	});
      }
    });
  };

  // solve for naked triples

  this.nakedTriples = function() {

    // loop over all nonets (groups of nine cells)

    allNonets.forEach(function(nonet) {

      // find all triplets of indices 0 - 8

      var triples = Combinatorics.combination([0,1,2,3,4,5,6,7,8], 3);
      var triple;

      // for each triplet, see if the union of all possibilities is only 3 numbers

      while((triple = triples.next())) {
	var totalPossibles = nonet.cells[triple[0]].possibles
	.union(nonet.cells[triple[1]].possibles)
	.union(nonet.cells[triple[2]].possibles);

	// if so, remove those three numbers as possibles from the other six cells

	if (totalPossibles.size() === 3) {
	  nonet.cells.forEach(function(cell, index){
	    if(index !== triple[0] && index !== triple[1] && index !== triple[2]) {
	      cell.removePossible(totalPossibles.get()[0]);
	      cell.removePossible(totalPossibles.get()[1]);
	      cell.removePossible(totalPossibles.get()[2]);
	    }
	  });
	}
      }

    });
    
  };

  this.nonetSolve = function() {

    // loop over the given nonets until the puzzle is
    // solved or no further answers can be found.

    var changed = true;
    while (numSolved() < 81 && changed) {
      changed = false;

      // loop over each nonet

      allNonets.forEach(function(nonet){

	// loop over each unsolved cell within a nonet

	nonet.cells.forEach(function(currentCell){
	  if ( !currentCell.answer() ) {

	    // create a new set of all remaining possibilites in the nonet
	    // besides those from the currentCell

	    var allPossibles = new Set([]);
	    nonet.cells.forEach(function(otherCell){
	      if (currentCell.index !== otherCell.index){
		allPossibles = allPossibles.union(otherCell.possibles);
	      }
	    });

	    // create a new set comprising all the answers that can't possibly be
	    // in any other cell in the nonet

	    var impossibles = new Set([1,2,3,4,5,6,7,8,9]).difference(allPossibles);

	    // if there is only one answer that can't possibly be anywhere else
	    // in the nonet it must belong in the current cell.
	    // in that case indicate a change.

	    if (impossibles.size() === 1){
	      currentCell.possibles = impossibles;
	      getRelatedCells(currentCell).forEach(function(relatedCell){
		relatedCell.removePossible(currentCell.answer());
	      });
	      changed = true;
	    }
	  }
	});
      });
    }
  };

  this.solve = function() {
    printPuzzle();
    while( numSolved() < 81 ) {
      this.basicSolve();
      this.nonetSolve();
      this.nakedPairs();
      this.nakedTriples();
      printPuzzle();
    }
  };

  // return a set of all the cells in the same row, column, or box as the given cell

  function getRelatedCells(cell) {
    var related = rowArray[cell.row].cells.concat(colArray[cell.col].cells).filter(function(relatedCell) {
      return relatedCell.index !== cell.index;
    });

    return related.concat(boxArray[cell.box].cells.filter(function(relatedCell){
      return relatedCell.index !== cell.index && relatedCell.row !== cell.row && relatedCell.col !== cell.col;
    }));
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
