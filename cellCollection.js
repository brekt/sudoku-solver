// this is the cellCollection module

var Set = require('set');

module.exports = function(id){
  this.id = id;
  this.members = new Set([]);
  this.cells = [];

  this.setMember = function(number){
    this.members.add(number);
  };
  return this;
};
