//instatiate socket
var socket = io();

//log random number
var random = Math.random();
console.log(random);

//log message from server
socket.on('serverMsg', function(data) {
    console.log(data.msg);
});

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

        console.log("You just joined the room");
        $(".game").show();
    });
});

socket.on('connectToRoom', function(data) {
    console.log(data);
});
