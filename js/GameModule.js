/*
Holds Game object to be served to rooms, and in turn players
*/
var Deck = require("./Deck.js")
var Game = function(id) {
  this.deck = new Deck();
  this.players = [];
  this.room;
  this.id = id;
};

module.exports = Game;
