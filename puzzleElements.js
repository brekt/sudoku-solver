// this is the puzzleElements module

var Set = require('set');

exports.Box = function(id){
  this.id = id;
  this.members = new Set([]);

  this.setMember = function(number){
    this.members.add(number);
  };
  return this;
};

exports.Row = function(id){
  this.id = id;
  this.members = new Set([]);

  this.setMember = function(number){
    this.members.add(number);
  };
  return this;
};

exports.Col = function(id){
  this.id = id;
  this.members = new Set([]);

  this.setMember = function(number){
    this.members.add(number);
  };
  return this;
};
