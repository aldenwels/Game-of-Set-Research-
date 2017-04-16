/*
  Need to modularize many functions to limit code resue such as
  - calls to set deck and game for all players in room
  - add player to room
  - need to think of flow of control for this
  e.g:
  - client decdes to add AI to game
  - emits message to server asking to add AI
  - call generalize add to Room function
  - have a generalize run AI on game function
  - generalzed create game function
  etc...
*/


var express = require('express');
var app = express();
var serv = require('http').Server(app);
var GameObj = require('./js/GameModule');
var Room = require('./js/Room');
var Player = require('./js/Player');
var NanoTimer = require('nanotimer');
var fs = require('fs');
var gameNum = 1;
var AI = require('./js/ai');
var $ = require('cheerio');
var aiRoom;
/*
GET HTML FILE USING EXPRESS
*/
console.log(gameNum);
var t0;
var t1;
var setRequest = 0;
app.get('/', function(req, res) {
    //server html file with express
    res.sendFile(__dirname + '/index.html');
});
app.use('/', express.static(__dirname + '/'));
var multiplayers = [];
/*
LISTEN ON PORT 2000
*/
serv.listen(2000);
console.log("Server started.");


//array that holds each socket
var SOCKET_LIST = [];
//room no.s
var multiplayerRoom = 1,
    singleplayerRoom = 1;
//keeps track of number of single and multiconnections
var singleConnections = 0,
    multiConnections = 0;
var room = new Room("Test Room"),
    game;
var io = require('socket.io')(serv, {});
var lol = 0;
io.sockets.on('connection', function(socket) {
    //push new socket onto array when connected
    SOCKET_LIST.push(socket);
    console.log("socket connected");
    //print how many sockets are connected
    console.log("There are now this many sockets connected:" + SOCKET_LIST.length);


    //disconnect socket
    socket.on('disconnect', function(socket) {
        delete SOCKET_LIST[socket.id];
    });

    //When player picks singleplayer
    socket.on('singleplayer', function(data) {
        //set new player
        var player = new Player(socket, name, level);
        //create singlePlayerRoom
        var sRoom = new Room('Single Room');
        //add single player to room
        room.addPlayer(player);
        //create new game object
        var game = new GameObj(1);
        //set player game
        player.game = game;
        //set games room
        game.room = room;
        //set initinal deck to im
        var im = game.deck.printDeck();
        //print deck ot all players
        for (p in room.players) {
            room.players[p].socket.emit('deck', im, game.deck.cardsDealt);
        }
        singleplayerRoom++;
    });

    //when player picks mlti
    socket.on('multiplayer', function(name, experience, gender) {
        //on load screen user has picked multiplayer mode
        //increase multiconnections
        multiConnections++;
        //create player object and send socket to constructor
        var player = new Player(socket, name, experience, gender);

        multiplayers.push(player);
        //add player to room
        room.addPlayer(player);
        //update player name on screen (for html page name is sent to client.js)
        socket.emit('updateScreenName', name);
        //if room members have reached limit
        if (room.players.length == room.limit) {
            fs.writeFile("data/game-" + gameNum + ".txt", "Player Level,Color,Shape,Quantity,Shading,Time \n", function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            //create new game object
            game = new GameObj(1);
            //store intial 12 cards from print deck function returned as string of html elements
            var im = game.deck.printDeck();
            //assign room a game
            room.game = game;

            for (p in room.players) {
                //for all players in room emit deck and set game
                room.players[p].socket.emit('deck', im);
                room.players[p].socket.emit('setGame', game);
                //create start time
                t0 = new Date().getTime();
                //display and calculate allotted time
                setInterval(function() {
                    t1 = new Date().getTime();
                    for (p in room.players)
                        room.players[p].socket.emit('displayTimer', t1 - t0);
                }, 1000);
            }
        }
    });
    socket.on('removeFromScreen', function(newSet, setToRemove) {
        //call to server to remove picked set from screen, and replace that set with new set
        //on all sockets in rooms screen
        for (p in room.players) {
            room.players[p].socket.emit('removeSetFromScreen', newSet, setToRemove);
        }
    });
    socket.on('changeScore', function() {
        //increase player score by 5
        for (p in room.players) {
            if (room.players[p].socket == socket)
                room.players[p].score += 5;
        }
        //now call to increase scores on screen for every player in room
        var names = [room.players[0].name, room.players[1].name];
        var scores = [room.players[0].score, room.players[1].score];
        for (player in room.players) {
            room.players[player].socket.emit('changeClientScore', names, scores);
        }
    });
    socket.on('updateServerGame', function(update_game) {
        //update game state for all clients in multi game room
        for (player in room.players) {
            room.players[player].socket.emit('updateGameState', update_game);
        }
    });
    socket.on('addSetRequest', function() {
        //adds set and asks player that is not user if it agrees to add set
        setRequest++;
        for (p in room.players) {
            if (room.players[p].socket != socket)
                room.players[p].socket.emit('askToAddSet');
        }
    });

    //if player has agreedto add send that set to all clients in room
    socket.on('agreedToAddSet', function() {
        setRequest++;
        if (setRequest == room.limit) {
            for (p in room.players)
                room.players[p].socket.emit('addSet');
        }
    });
    //calls to change card sizes in all game room
    socket.on('setCardSizes', function() {
        for (p in room.players)
            room.players[p].socket.emit('setCardSizes');
    });
    //logging
    var test = true;
    socket.on("printResult", function(set) {
        var checks = [],
            lvl, t;
        for (prop in set) {
            if (allValuesSame(set[prop])) {
                checks.push("same");
            } else if (unique(set[prop]))
                checks.push("unique");
        }
        for (p in room.players) {
            if (room.players[p].socket == socket)
                lvl = room.players[p].level;
        }
        t0 = new Date().getTime();
        t = t0 - t1;
        printTofile(lvl, checks, t);
    });
    socket.on('printWrongSet', function(set) {
        var checks = [],
            lvl, t;
        for (prop in set) {
            if (allValuesSame(set[prop])) {
                checks.push("same");
            } else if (unique(set[prop])) {
                checks.push("unique");
            } else if (allValuesSame(set[prop]) == false && unique(set[prop]) == false) {
                checks.push("WRONG");
            }
        }
        for (p in room.players) {
            if (room.players[p].socket == socket)
                lvl = room.players[p].level;
        }
        t1 = new Date().getTime();
        t = t1 - t0;
        printTofile(lvl, checks, t);
    });

    /*
      Single AI is run
    */
    socket.on('singleAI', function(num) {
        var agent = new AI(socket, num);
        aiRoom = new Room("AI");
        aiRoom.addPlayer(agent);
        game = initalizeAIGame(aiRoom, agent);
        console.log("this is the initial set of current cards");
        console.log(game.deck.currentCards);
        while (game.deck.cardsDealt.length < 81) {
            game = runAI(agent, game);
        }
        console.log(agent.setsFound.length + " sets found");
    });


    /*
    client picked to play an AI, recieves paramater of algo to use
     */
    socket.on('playAI', function(alg) {
        var agent = new AI(null, alg);
        game = new GameObj(1);
        var im = game.deck.printDeck();
        for (p in room.players) {
            room.players[p].socket.emit('deck', im, game.deck.cardsDealt);
            room.players[p].socket.emit('setGame', game);
        }
    });
});



function initalizeAIGame(room, agent) {
    game = new GameObj(1);
    //store intial 12 cards from print deck function returned as string of html elements
    var im = game.deck.printDeck();
    room.game = game;
    agent.game = game;
    for (p in aiRoom.players) {
        room.players[p].socket.emit('deck', im, game.deck.cardsDealt);
        room.players[p].socket.emit('setGame', game);
    }
    return game;
}


function runAI(agent, game) {
    //determine which alg 1-5 to run
    if (agent.alg3(game.deck.currentCards)) {
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



var path = "/Users/pgringer/Game-of-Set-Research-/data/game.txt";


function printTofile(lvl, checks, time) {
    var row = lvl + "," + checks[0] + "," + checks[1] + "," +
        checks[2] + "," + checks[3] + "," + time + "\n";
    fs.appendFile('data/game-' + gameNum + '.txt', row, function(err) {
        if (err)
            console.log(err);
    });
}
