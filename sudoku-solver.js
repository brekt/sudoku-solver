var input = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';
var input2 = '5.1.83..7...72...........1...8....2..1..5.9....3.....1...9...8..4...75..39.4.....';

var Sudoku = require('./sudoku');

var sudoku = new Sudoku(input);
console.log("\nBefore - " + sudoku.report() + " answers:");
sudoku.printPuzzle();
sudoku.solve();
console.log("After - " + sudoku.report() + " answers:");
sudoku.printPuzzle();
console.log('');
