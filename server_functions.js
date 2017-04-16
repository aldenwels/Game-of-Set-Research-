/*
  File holds on all non socket.io functions for modularity sake
*/


function initalizeAIGame(room,agent){
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

function replaceSet(setToRemove){
  console.log('replacing set');
    var newSet = [];
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
      console.log("removed set to remove from current cards for player who chose set");
        //remove set found from currentCards
        var r = game.deck.currentCards.indexOf(setToRemove[i]);
        console.log("about to remove " + setToRemove[i].id + " from currentCards");
        game.deck.currentCards.splice(r, 1);
        game.deck.currentCards.push(newSet[i]);
        //add to screen
    }
    for (p in aiRoom.players) {
        aiRoom.players[p].socket.emit('removeSetFromScreen', newSet, setToRemove);
    }
}




function runAI(agent,game){
  agent.alg1(game.deck.currentCards);
  if(agent.set.length > 0){
    console.log("set found");
    agent.setsFound.push(agent.set);
    setTimeout(replaceSet(agent.set),500);
  }
  console.log(game.deck.cardsDealt.length + " cards dealt");
}

function createGameFile(){

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


var path = "/Users/pgringer/Game-of-Set-Research-/data/game.txt";


function printTofile(lvl, checks, time) {
    var row = lvl + "," + checks[0] + "," + checks[1] + "," +
        checks[2] + "," + checks[3] + "," + time + "\n";
    fs.appendFile('data/game-'+gameNum+'.txt', row, function(err) {
        if (err)
            console.log(err);
    });
}
