var Player = function(socket,name,level,gender){
  this.socket = socket;
  this.id = socket.id;
  this.game;
  this.score = 0;
  this.name = name;
  this.level = level;
  this.gender = gender;
}

module.exports = Player;
