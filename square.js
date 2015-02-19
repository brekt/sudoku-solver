// this is square.js - the square module

module.exports = function Square(answer, squareIndex) {
  this.column = squareIndex % 9;
  this.row = Math.floor(squareIndex / 9);
  this.answer = answer;
  this.box = parseInt((Math.floor(this.row / 3).toString() + Math.floor(this.column / 3).toString()), 3);
  this.possibilities = setPoss();
  
  function setPoss() {         //  populate the possibilites object with keys 1 - 9
    var obj = {};
    for (var i = 1; i <= 9; i++) {
      obj[i] = true;
    }
    return obj;
  }

  this.squareSolve = function() {                 // check to see if only one possibility remains. if so, set answer
    if (Object.keys(this.possibilities).length === 1) {
      this.answer = Object.keys(this.possibilities)[0];
    }
  };

  return this;
}

