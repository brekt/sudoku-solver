// this is the test suite for sudoku.js

var Sudoku = require('../sudoku.js');

var input = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';
var input2 = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5..9.3..2..2..5...8.7..9.413';


describe("the sudoku constructor", function(){

  var sudoku = new Sudoku(input);

  it("should not accept an improperly formatted puzzle", function() {
    expect(function(){
      new Sudoku(input2);
    }).toThrowError("Invalid puzzle string!");
  });

});
