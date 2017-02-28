//instatiate socket
var socket = io();

//log random number
var random = Math.random();
console.log(random);

//log message from server
socket.on('serverMsg', function(data) {
    console.log(data.msg);
});
var multiConnections;
//send message to server when player mode is picked
$(document).ready(function() {
    $("#single").click(function() {
        $(".pickMode").hide();
        console.log(100);
        //emit message to server
        socket.emit('singleplayer', {
            msg: 'chose single player'
        });

        main();
        $(".game").show();
    });
    $("#multi").click(function() {
        $(".pickMode").hide();
        console.log(100);
        //emit message to server
        socket.emit('multiplayer', {
            msg: 'chose multi'
        });

        socket.on('multiConnections',function(data){
          console.log("multi" + data.msg);
          multiConnections = data.msg;
          multiConnections = parseInt(multiConnections);
          if(multiConnections <= 1){
              $(".game").show();
          }
          else if(multiConnections > 1){
            $(".choose-multi").show();
          }
        });

    });
});

socket.on('connectToRoom', function(data) {
    console.log(data);
});
