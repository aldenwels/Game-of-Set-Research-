/*
Holds Game object to be served to rooms, and in turn players
*/
var Deck = require("./Deck.js")
var Game = function() {
  this.deck = new Deck();
  this.players = [];
  this.room;
};

module.exports = Game;
