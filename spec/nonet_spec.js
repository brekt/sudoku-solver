// this is the test suite for nonet.js

var Nonet = require('../nonet.js');
var Cell = require('../cell.js');

describe("the nonet constructor", function(){
  
  var nonet = new Nonet();

  it("should correctly set up the possibles set", function(){
    expect(nonet.possibles.size()).toBe(9);
  });

  it("should have zero cells when first constructed", function(){
    expect(nonet.cells.length).toBe(0);
  });

  describe("the add function", function() {
    
    it("should sucessfully add an unsolved cell to the cells array", function(){
      var cell1 = new Cell(null, 0);
      nonet.add(cell1);
      expect(nonet.cells.length).toBe(1);
      expect(nonet.possibles.size()).toBe(9);
    });
    
    it("should successfully add a solved cell to the cells array", function(){
      var cell2 = new Cell(5, 1);
      nonet.add(cell2);
      expect(nonet.cells.length).toBe(2);
      expect(nonet.possibles.size()).toBe(8);
    });

    it("should successfully add multiple cells to the cells array", function(){
      var cell3 = new Cell(3, 2);
      var cell4 = new Cell(null, 3);
      var cell5 = new Cell(1, 4);
      var cell6 = new Cell(null, 5);
      nonet.add(cell3, cell4);
      expect(nonet.cells.length).toBe(4);
      expect(nonet.possibles.size()).toBe(7);
      nonet.add.apply(nonet, [cell5, cell6]);
      expect(nonet.cells.length).toBe(6);
      expect(nonet.possibles.size()).toBe(6);
    });

  });

  describe("the removePossible function", function(){
    
    it("should remove a possible from the possibles set", function() {
      nonet.removePossible(6);
      expect(nonet.possibles.size()).toBe(5);
    });

    it("should remove multiple possibles from the possibles set", function(){
      nonet.removePossible(2,4);
      expect(nonet.possibles.size()).toBe(3);
      nonet.removePossible.apply(nonet, [7,8]);
      expect(nonet.possibles.size()).toBe(1);
      expect(nonet.possibles.get()[0]).toBe('9');
    });
  });
});
