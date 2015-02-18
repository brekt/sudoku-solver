var input = '158 2  6 2   8  9  3  7 8 2 6 74      4 6 7      19 5 4 9 3  2  2  5   8 7  9 413';


function Sudoku(input) {
	if (input.length !== 81) {
		return null;
	}
	var squareArray = [];
	var inputInts = input.split('').map(function(value) {
		if (value === ' ') {
			return null;
		}
		else {
			return parseInt(value);
		}
	});
	inputInts.forEach(function(value, index) {
		var square = new Square(value, index);
		squareArray.push(square); 
	});
	console.log(squareArray);
	console.log(squareArray.length);
}

Sudoku(input);

function Square(answer, squareIndex) {
	this.column = squareIndex % 9;
	this.row = Math.floor(squareIndex / 9);
	this.answer = answer;
	this.box = parseInt((Math.floor(this.row / 3).toString() + Math.floor(this.column / 3).toString()), 3); 
}