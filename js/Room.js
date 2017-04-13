var Room = function(name){
  this.name = name;
  this.players = [];
  this.limit = 2;
  this.game;
};

Room.prototype.addPlayer = function(player){
  this.players.push(player);
}

module.exports = Room;
