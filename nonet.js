// this is the nonet module

var Set = require('set');

module.exports = function(){

  this.cells = [];

  this.possibles = new Set([1,2,3,4,5,6,7,8,9]);

  this.removePossible = function() {
    var args = arguments;
    for(var i = 0; i < args.length; i++){
      this.possibles.remove(arguments[i]);
    }
    this.cells.forEach(function(cell){
      if(!cell.answer()){
	cell.removePossible.apply(cell, args);
      }
    });
  };

  this.add = function() {
    var cell;
    for(var i = 0; i < arguments.length; i++) {
      cell = arguments[i];
      this.cells.push(cell);
      if(cell.answer()){
	this.removePossible(cell.answer());
      }
    }
  };

  return this;
};
