var Player = function(id,name,level,gender){
  this.socket = id;
  this.id = id.id;
  this.game;
  this.score = 0;
  this.name = name;
  this.level = level;
  this.gender = gender;
}

module.exports = Player;
