// this is the test suite for cell.js

var Cell = require('../cell.js');

describe("the cell constructor", function() {

  var cell1 = new Cell(null, 15);
  var cell2 = new Cell(3, 64);

  it("should report the correct answer and index based on the inputs", function() {

    expect(cell1.answer()).toBeNull();
    expect(cell1.index).toBe(15);
    expect(cell2.answer()).toBe(3);
    expect(cell2.index).toBe(64);

  });

  it("should calculate the correct row, box and column", function() {

    expect(cell1.row).toBe(1);
    expect(cell1.col).toBe(6);
    expect(cell1.box).toBe(2);
    expect(cell2.row).toBe(7);
    expect(cell2.col).toBe(1);
    expect(cell2.box).toBe(6);    

  });

  it("should correctly setup the possibles set", function() {
    expect(cell1.possibles.size()).toBe(9);
    expect(cell2.possibles.size()).toBe(1);
  });

  describe("the isPossible function", function() {
    
    it("should return the correct boolean", function() {
      expect(cell1.isPossible(7)).toBe(true);
      expect(cell2.isPossible(7)).toBe(false);
      expect(cell1.isPossible(0)).toBe(false);
      expect(cell1.isPossible(15)).toBe(false);
    });

  });

  describe("the removePossible function", function() {

    it("The possibility should be there beforehand", function(){
      expect(cell1.possibles.contains(7)).toBe(true);
    });

    it("should remove the possibility from the possibles set", function() {
      cell1.removePossible(7);            
      expect(cell1.possibles.contains(7)).toBe(false);
    });

    it("should be able to remove multiple possibilities", function(){
      cell1.removePossible(1,2,3,5,6,7);
      expect(cell1.possibles.size()).toBe(3);
      cell1.removePossible.apply(cell1, [8,9]);
      expect(cell1.possibles.size()).toBe(1);
    });

    it("should cause an answer to be reported if all other possibles are removed", function(){
      expect(cell1.answer()).toBe(4);
    });

  });
});
