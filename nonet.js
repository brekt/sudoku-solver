// this is the nonet module

var Set = require('set');

module.exports = function(){

  this.cells = [];

  this.possibles = new Set([1,2,3,4,5,6,7,8,9]);

  this.removePossible = function(number) {
    this.possibles.remove(number);
  };

  this.add = function(cell) {
    this.cells.push(cell);
    if(cell.answer()){
      this.removePossible(cell.answer());
    }
  };

  return this;
};
