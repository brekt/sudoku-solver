// this is square.js - the square module

var Set = require('set');

module.exports = function Square(solution, squareIndex) {
  this.col = squareIndex % 9;
  this.row = Math.floor(squareIndex / 9);
  this.box = Math.floor(this.row / 3) * 3 + Math.floor(this.col / 3);

//  this.box = parseInt((Math.floor(this.row / 3).toString() + Math.floor(this.col / 3).toString()), 3);

  if (solution) {
    this.possibilities = new Set([solution]);
  }else {
    this.possibilities = new Set([1,2,3,4,5,6,7,8,9]);
  }

  this.answer = function() {                 // return the only remaining possibility or null if there are more than one
    if (this.possibilities.size() === 1) {
      return this.possibilities.get()[0];
    } else return null;
  };

  return this;
}

