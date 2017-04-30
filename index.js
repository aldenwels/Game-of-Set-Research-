'use strict';
const PORT = process.env.PORT;
var express = require('express');
var app = express();
var serv = require('http').Server(app);
const path = require('path');
serv.listen(PORT);
var multiplayers = [];
var multiRoom;var pg = require('pg');




var currentSockets = {

};


var io = require('socket.io')(serv, {});
const INDEX = path.join(__dirname, 'index.html');

app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res) {
    //server html file with express
    res.sendFile(__dirname + '/index.html');
});


var GameObj = require('./js/GameModule'),
    Room = require('./js/Room'),
    Player = require('./js/Player'),
    NanoTimer = require('nanotimer'),
    fs = require('fs'),
    gameNum = 1,
    AI = require('./js/ai'),
    $ = require('cheerio'),
    aiRoom;


var t0;
var t1;
var setRequest = 0;

var SOCKET_LIST = [];
//room no.s
var multiplayerRoom = 1,
    singleplayerRoom = 1;
//keeps track of number of single and multiconnections
var singleConnections = 0,
    multiConnections = 0;
var room,
    game;

io.sockets.on('connection', function(socket) {
    //push new socket onto array when connected

    console.log("socket connected");
    //print how many sockets are connected
    console.log("There are now this many sockets connected:" +
        Object.keys(currentSockets).map(key => currentSockets.hasOwnProperty(key)).length);


    //disconnect socket
    socket.on('disconnect', function(socket) {
        console.log(socket);
    });

    socket.on('checkIfRoomAvailable', function() {
        if (multiplayers.length < 2)
            socket.emit('roomAvailable', true);
        else
            socket.emit('roomAvailable', false);

    });

    //When player picks singleplayer
    socket.on('singleplayer', function(name, experience, gender) {


        //set new player
        var player = new Player(socket, name, experience, gender);
        currentSockets[socket.id] = player;
        //create singlePlayerRoom
        currentSockets[socket.id]['room'] = new Room('Single Room', 'single');
        //add single player to room
        currentSockets[socket.id]['room'].addPlayer(player);
        //create new game object
        currentSockets[socket.id]['game'] = new GameObj(randomString(8, "#Aa"));
        //set player game

        //update screen name
        socket.emit('updateScreenName', name);
        //socket.emit('changeClientScore', name, 0);
        //make file for player randomString(8,"#A!a")
        fs.writeFile("data/game-" + currentSockets[socket.id]['game'].id + ".txt", "Game,Player Level,Gender,Color,Shape,Quantity,Shading,Time \n", function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        //set initinal deck to im
        var im = currentSockets[socket.id]['game'].deck.printDeck();
        room = currentSockets[socket.id]['room'];
        var game = currentSockets[socket.id]['game'];
        //print deck ot all players

        socket.emit('deck', im);
        socket.emit('setGame', game);
        //create start time
        currentSockets[socket.id]['t0'] = new Date().getTime();
        //display and calculate allotted time
        setInterval(function() {
            currentSockets[socket.id]['t1'] = new Date().getTime();

            socket.emit('displayTimer', currentSockets[socket.id]['t1'] - currentSockets[socket.id]['t0']);
        }, 1000);

        singleplayerRoom++;
    });



    //when player picks mlti
    socket.on('multiplayer', function(name, experience, gender) {
        //on load screen user has picked multiplayer mode
        //increase multiconnections
        multiConnections++;
        //create player object and send socket to constructor
        var player = new Player(socket, name, experience, gender);
        currentSockets[socket.id] = player;
        console.log(multiplayers);
        console.log(multiRoom);
        if (multiplayers.length == 0) {
            multiRoom = new Room('multi-player', 'multi');
        }
        currentSockets[socket.id]['room'] = multiRoom;
        room = multiRoom;
        multiplayers.push(player);
        //add player to room
        if (room.players.length <= room.limit)
            room.addPlayer(player);
        console.log(room);
        //update player name on screen (for html page name is sent to client.js)
        socket.emit('updateScreenName', name);
        //if room members have reached limit
        if (room.players.length == room.limit) {
            console.log("logging room at 150");
            console.log(room);
            //create game
            game = new GameObj(randomString(8, "#Aa"));

            //set game to each current socket for game in multiplayer room
            for (var p in room.players) {
                console.log("loggin game sockets line 155");
                console.log(currentSockets[room.players[p].id]['room']);
                currentSockets[room.players[p].id]['game'] = game;
            }


            fs.writeFile("data/game-" + currentSockets[socket.id]['game'].id + ".txt", "Game,Player Level,Gender,Color,Shape,Quantity,Shading,Time \n", function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            //create new game object
            console.log(room.players);
            //store intial 12 cards from print deck function returned as string of html elements
            var im = currentSockets[socket.id]['game'].deck.printDeck();
            //assign room a game
            room.game = currentSockets[socket.id]['game'];

            for (p in room.players) {
                //for all players in room emit deck and set game
                room.players[p].socket.emit('deck', im);
                room.players[p].socket.emit('setGame', game);
                //create start time
                currentSockets[room.players[p].id]['t0'] = new Date().getTime();
                //display and calculate allotted time
                setInterval(function() {
                    currentSockets[room.players[p].id]['t1'] = new Date().getTime();
                        room.players[p].socket.emit('displayTimer', currentSockets[room.players[p].id]['t1'] - currentSockets[room.players[p].id]['t0']);
                }, 1000);
            }
        }
    });
    socket.on('removeFromScreen', function(newSet, setToRemove) {
        room = currentSockets[socket.id]['room'];
        //call to server to remove picked set from screen, and replace that set with new set
        //on all sockets in rooms screen
        for (p in room.players) {
            room.players[p].socket.emit('removeSetFromScreen', newSet, setToRemove);
        }
    });
    socket.on('changeScore', function() {
        var names = [];
        var scores = [];
        room = currentSockets[socket.id]['room'];
        //increase player score by 5
        for (var p in room.players) {
            if (room.players[p].socket == socket)
                room.players[p].score += 5;

            names.push(room.players[p].name);
            scores.push(room.players[p].score);
        }
        //now call to increase scores on screen for every player in room

        for (var player in room.players) {
            room.players[player].socket.emit('changeClientScore', names, scores);
        }
    });
    socket.on('updateServerGame', function(update_game) {
        room = currentSockets[socket.id]['room'];
        console.log(room);
        //update game state for all clients in multi game room
        for (var player in room.players) {
            currentSockets[room.players[player]['id']]['game'] = update_game;
            room.players[player].socket.emit('updateGameState', update_game);
        }
    });
    socket.on('addSetRequest', function() {
        room = currentSockets[socket.id]['room'];
        //adds set and asks player that is not user if it agrees to add set
        if (room.type == 'multi') {
            setRequest++;
            for (var p in room.players) {
                if (room.players[p].socket != socket)
                    room.players[p].socket.emit('askToAddSet');
            }
        } else {
            for (var p in room.players)
                room.players[p].socket.emit('addSet');
        }
    });

    //if player has agreedto add send that set to all clients in room
    socket.on('agreedToAddSet', function() {
        room = currentSockets[socket.id]['room'];
        setRequest++;
        if (setRequest == room.limit) {
            for (var p in room.players)
                room.players[p].socket.emit('addSet');
        }
        setRequest = 0;
    });
    //calls to change card sizes in all game room
    socket.on('setCardSizes', function() {
        room = currentSockets[socket.id]['room'];
        for (var p in room.players)
            room.players[p].socket.emit('setCardSizes');
    });
    //logging
    var test = true;
    socket.on("printResult", function(set) {
        var isSet = true;
        room = currentSockets[socket.id]['room'];
        var checks = [],
            lvl, t;
        for (var prop in set) {
            if (allValuesSame(set[prop])) {
                checks.push(set[prop][0]);
            } else if (unique(set[prop]))
                checks.push("unique");
            else if (allValuesSame(set[prop]) == false && unique(set[prop]) == false) {
                    var wrong = set[prop][0] + "-" + set[prop][1] + "-" + set[prop][2];
                    checks.push(wrong);
                    isSet = false;
                }
        }
        for (var p in room.players) {
            if (room.players[p].socket == socket)
                lvl = room.players[p].level;
        }
        t = currentSockets[socket.id]['t1'] - currentSockets[socket.id]['t0'];
        console.log("this is the time it took: " + t);
        printTofile(currentSockets[socket.id]['room'].type, currentSockets[socket.id].gender, lvl, checks, t, socket,currentSockets[socket.id].name,isSet);
        //currentSockets[socket.id]['t0'] = new Date().getTime();
    });


    /*
      Single AI is run
    */
    socket.on('singleAI', function(num) {
        socket.emit('testing', 'hello');
        var agent = new AI(socket, num);
        aiRoom = new Room("AI", 'ai');
        aiRoom.addPlayer(agent);
        game = initalizeAIGame(aiRoom, agent);
        console.log("this is the initial set of current cards");
        console.log(game.deck.currentCards);
        while (game.deck.cardsDealt.length < 81) {
            game = runAI(agent, game);
        }
        console.log(agent.setsFound.length + " sets found");
        console.log(agent.setsFound);
    });
});



function initalizeAIGame(room, agent) {
    game = new GameObj(1);
    //store intial 12 cards from print deck function returned as string of html elements
    var im = game.deck.printDeck();
    room.game = game;
    agent.game = game;
    for (var p in aiRoom.players) {
        room.players[p].socket.emit('deck', im, game.deck.cardsDealt);
        room.players[p].socket.emit('setGame', game);
    }
    return game;
}


function runAI(agent, game) {
    //determine which alg 1-5 to run
    if (agent.alg2(game.deck.currentCards)) {
        console.log("set found");
        agent.setsFound.push(agent.set);
        game = replaceSet(agent.set, game);
        console.log(game.deck.currentCards.length + " cards on screen");
        console.log(game.deck.cardsDealt.length + " cards dealt");
    } else {
        console.log("no set found so need to add in these cards: ");
        console.log(game.deck.currentCards);
        game = addSetToDealt(game);
        console.log("now that has added here are the cards");
        console.log(game.deck.currentCards);
    }
    return game;
}

function replaceSet(setToRemove, game) {
    console.log('replacing set');
    var newSet = [];
    console.log(game.deck.currentCards.length + " current cards while in replace set");
    if (game.deck.currentCards.length <= 12) {
        console.log("creating new 3 cards to add to cardsdealth and remove from deck.cards, and adding to newSet array");
        for (var card in game.deck.cards) {
            if (newSet.length < 3) {
                if (game.deck.cardsDealt.indexOf(game.deck.cards[card]) == -1) {
                    newSet.push(game.deck.cards[card]);
                    game.deck.cardsDealt.push(game.deck.cards[card]);
                    game.deck.cards.splice(card, 1);
                }
            }
        }
        for (var i = 0; i < newSet.length; i++) {

            //remove set found from currentCards
            var r = game.deck.currentCards.indexOf(setToRemove[i]);
            console.log("about to remove " + setToRemove[i].id + " from currentCards");
            game.deck.currentCards.splice(r, 1);
            console.log("adding " + newSet[i] + " to currentCards");
            game.deck.currentCards.push(newSet[i]);
            //add to screen
        }
        for (p in aiRoom.players) {
            aiRoom.players[p].socket.emit('removeSetFromScreen', newSet, setToRemove);
        }
    } else if (game.deck.currentCards.length >= 15) {
        for (var i = 0; i < 3; i++) {
            console.log("removed set to remove from current cards for player who chose set");
            //remove set found from currentCards
            var r = game.deck.currentCards.indexOf(setToRemove[i]);
            console.log("about to remove " + setToRemove[i].id + " from currentCards");
            game.deck.currentCards.splice(r, 1);
            //add to screen
        }
    }
    return game;
}

function createGameFile() {

}


//server side functions
//checks if all values in array are the same
function allValuesSame(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] !== arr[j]) {
                return false;
            }
        }
    }

    return true;
}
//checks if all values are unique
function unique(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                return false;
            }
        }
    }
    return true;
}

function addSetToDealt(game) {
    console.log("adding 3 cards to set");
    console.log(game.deck.currentCards.length + " cards ");
    for (var card in game.deck.cards) {
        if (card < 3) {
            game.deck.currentCards.push(game.deck.cards[card]);
            game.deck.cardsDealt.push(game.deck.cards[card]);
            game.deck.cards.splice(card, 1);
        }
    }
    return game;
}



var p = "/Users/pgringer/Game-of-Set-Research-/data/game.txt";


function printTofile(type, gender, lvl, checks, time, socket,name,isSet) {
    var row = type + "," + lvl + "," + gender + "," + checks[0] + "," + checks[1] + "," +
        checks[2] + "," + checks[3] + "," + time + "\n";
    fs.appendFile('data/game-' + currentSockets[socket.id]['game'].id + '.txt', row, function(err) {
        if (err)
            console.log(err);
    });

    console.log("abouto to connect");
    var client = new pg.Client(process.env.DATABASE_URL);


    client.connect(function (err) {
      if (err) console.log(err);

  // execute a query on our database
  var query = "INSERT INTO game_set (game_id,type,level,gender,color,shape,quantity,shading,name,time,isSet) VALUES ('" + currentSockets[socket.id]['game'].id + "','" + type + "','" +
  lvl + "','" + gender + "','" + checks[0] + "','" +
  checks[1] + "','" + checks[2] + "','" + checks[3] + "','" + name + "','" + time + "','" + isSet + "');";
  console.log(query);
  client.query(query, function (err, result) {
    if (err) console.log(err);
    else
      console.log("queried");

    // disconnect the client
    client.end(function (err) {
      if (err)console.log(err);
      else console.log("ended");
      if(currentSockets[socket.id]['room'].type == 'single')
        currentSockets[socket.id]['t0'] = new Date().getTime();
      else{
        var players = currentSockets[socket.id]['room'].players;
        for(p in players){
          currentSockets[players[p].id]['t0'] = new Date().getTime();
        }
      }
    });
  });
});
}

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
