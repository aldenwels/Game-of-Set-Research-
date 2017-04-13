var fs = require('fs');
var path = "/Users/pgringer/Game-of-Set-Research-/data/game.txt";


function printTofile(lvl,checks,time){
  var row = lvl + "," + checks[0] + "," + checks[1] + "," +
  checks[2] + "," + checks[3] + "," + time + "\n";
  fs.appendFile('data/game.txt', row, function (err) {
    if(err)
      console.log(err);
  });
}
