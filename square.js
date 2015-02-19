// this is square.js - the square module

var Set = require('set');

module.exports = function Square(answer, squareIndex) {
  this.col = squareIndex % 9;
  this.row = Math.floor(squareIndex / 9);
  this.answer = answer;
//  this.box = parseInt((Math.floor(this.row / 3).toString() + Math.floor(this.col / 3).toString()), 3);
  this.box = Math.floor(this.row / 3) * 3 + Math.floor(this.col / 3);

  this.possibilities = new Set([1,2,3,4,5,6,7,8,9]);
  
  this.squareSolve = function() {                 // check to see if only one possibility remains. if so, set answer
    if (this.possibilities.size() === 1) {
      this.answer = this.possibilities.get()[0];
      return this.answer;
    }
    return null;
  };

  return this;
}

