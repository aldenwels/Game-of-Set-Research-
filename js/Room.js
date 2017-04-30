var Room = function(name,type){
  this.type = type;
  this.name = name;
  this.players = [];
  this.limit = 2;
  this.game;
};

Room.prototype.addPlayer = function(player){
  this.players.push(player);
}

module.exports = Room;
