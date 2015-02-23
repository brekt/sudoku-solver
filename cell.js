// this is cell.js - the cell module

var Set = require('set');

module.exports = function Cell(solution, index) {

  // determine which col, row, and box the cell belongs to based on the order it was read in.
  this.index = index;
  this.col = index % 9;                  
  this.row = Math.floor(index / 9);
  this.box = Math.floor(this.row / 3) * 3 + Math.floor(this.col / 3);

  // if a solution is passed in, make it the only member of possibles
  // else, set the possibles to 1 - 9 inclusive

  if (solution) {
    this.possibles = new Set([solution]);
  }else {
    this.possibles = new Set([1,2,3,4,5,6,7,8,9]);
  }
  
  this.isPossible = function(number){
    if (this.possibles.contains(number)) {
      return true;
    } else return false;
  };

  this.removePossible = function(){
    for( var i = 0; i < arguments.length; i++){
      this.possibles.remove(arguments[i]);
    }
    if (this.possibles.size() === 0){
      throw new Error('removed all possibilities from cell ' + this.index);
    }
  };

  // if only one possibility remains, return it, else return null

  this.answer = function() {  
    if (this.possibles.size() === 1) {
      return parseInt(this.possibles.get()[0]);
    } else return null;
  };

  return this;
};

