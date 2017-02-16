var express = require('express');
var app = express();
var serv = require('http').Server(app);

/*
GET HTML FILE USING EXPRESS
*/
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use('/',express.static(__dirname + '/'));


/*
LISTEN ON PORT 2000
*/
serv.listen(2000);
console.log("Server started.");


//array that holds each socket
var SOCKET_LIST = [];
var multiplayerRoom = 1;
var singleplayerRoom = 1;

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    //push new socket onto array when connected
    SOCKET_LIST.push(socket);
    console.log("socket connected");
    //print how many sockets are connected
    console.log("There are now this many sockets connected:" + SOCKET_LIST.length);
    //send message to client
    socket.emit('serverMsg',{
       msg:'hello',
   });
   //disconnect socket
    socket.on('disconnect',function(socket){
        delete SOCKET_LIST[socket.id];
    });

    socket.on('singleplayer',function(data){
      console.log(data.msg);
      socket.join("single-"+singleplayerRoom);
      io.sockets.in("single-"+singleplayerRoom).emit('connectToRoom', "You are in Single room no. "+singleplayerRoom);
    });

    socket.on('multiplayer',function(data){
      console.log(data.msg);
      socket.join("multi-"+multiplayerRoom);
      io.sockets.in("multi-"+multiplayerRoom).emit('connectToRoom', "You are in  Multi room no. "+multiplayerRoom);
    });

});
