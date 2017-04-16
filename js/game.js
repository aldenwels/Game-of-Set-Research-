/*     */

//Holds card object of those currently picked
var cardsPicked = [];
var setCheck = {
    color: [],
    shape: [],
    number: [],
    shading: []
};
//keeps track on this clients score
var score = 0;

$(document).ready(function() {
    console.log("GAME READY");
    $("#addSet").click(function() {
        //adds on click even to add set so it calls to server the request to add set
        socket.emit('addSetRequest');
    });
});

function printCurrentCards() {
    //print ids of all cards currently dealt
    $(".cards > img").each(function() {
        console.log($(this).attr('id'));
    });
}

function cardPicked(id) {
    console.log(game);
    console.log("Picked " + id);
    console.log(cardsPicked);
    //if 3 cards have not been picked then add them to cardsPicked
    if (cardsPicked.length < 3) {
        $("#" + id).toggleClass("shaded");
        //search cards dealt for that html elements id so it can be added to cardspicked as object
        var obj = $.grep(game.deck.currentCards, function(e) {
            return e['id'] == id;
        });
        console.log("Found this in cards dealt: ");
        console.log(obj);
        if (cardsPicked.includes(obj[0])) {
            //if cards have been pickedd before then remove from cardsPicked
            var index = cardsPicked.indexOf(id);
            cardsPicked.splice(index, 1);
        } else {
            cardsPicked.push(obj[0]);
        }

        if (cardsPicked.length == 3) {
            //if 3 cards are picked check if these 3 cards are a set
            checkIfSet();
        }
    }
    console.log("Current Cards picked:");
    console.log(cardsPicked);
}



function checkIfSet() {
    /* USES setCheck object to check if a set
      setCheck comprises of 4 arrays one for each property
      the property of each of the cards is pushed onto these arrays which is then assesed to check if
      the values of the arrays in setCheck are all the saem or all different
    */
    for (var i = 0; i < cardsPicked.length; i++) {
        for (var prop in cardsPicked[i]) {
            if ((prop != 'imageSource')) {
                if ((prop != 'id')) {
                    //push property in setCheck into corresponding property for this card
                    setCheck[prop].push(cardsPicked[i][prop]);
                }
            }
        }
    }

    //check the 3 cards satisfy the all different or all same conditions for each property
    var isSet = true;
    for (var prop in setCheck) {
        if (!allValuesSame(setCheck[prop]) && !unique(setCheck[prop])) {
            isSet = false;
        }
    }
    if (isSet) {
        socket.emit("printResult",setCheck);
        replaceSet(cardsPicked);
        removeSet();
        //remove in main
    }
    else {
        socket.emit("printWrongSet",setCheck);
        removeSet();
    }
}


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

function removeSet() {
  console.log("Cards Picked in remove Set");
  console.log(cardsPicked);
    //toggles shaded card class
    for (var i = 0; i < cardsPicked.length; i++) {
        $("#" + cardsPicked[i].id).toggleClass("shaded");
    }
    //emits remove set to message so it it removed for all clients in room
    socket.emit('removeSet', cardsPicked);
    //empties this clients cardsPicked
    //empty setCheck obj arrays
    for (var prop in setCheck) {
        setCheck[prop] = [];
    }
    cardsPicked = [];
}

function addSetToDealt() {
    for (var card in game.deck.cards) {
        if (card < 3) {
            $(".cards").append("<img src='" + game.deck.cards[card].imageSource + "' id = '" + game.deck.cards[card].id + "' >");
            game.deck.currentCards.push(game.deck.cards[card]);
            game.deck.cardsDealt.push(game.deck.cards[card]);
            $("#" + game.deck.cards[card].id).click(function() {
                cardPicked($(this).attr('id'));
            });
            //var r = deck.indexOf(deck[card]);
            game.deck.cards.splice(card, 1);
        }
    }
    //possibleCombinations(game.deck.currentCards);
    socket.emit('updateServerGame', game);
    console.log(game.deck.currentCards);
    socket.emit('setCardSizes');
}

function changeScore() {
    console.log("change score gamejs");
    socket.emit('changeScore');
}

function replaceSet(setToRemove) {
  console.log("Found set in replaceSet function");
  for (var i = 0; i < cardsPicked.length; i++) {
      $("#" + cardsPicked[i].id).toggleClass("shaded");
  }
    console.log(game.deck.currentCards);
    var newSet = [];

    if (game.deck.currentCards.length <= 12) {
      //generate new set of cards
      console.log("Generating new set on game.js");
        for (var card in game.deck.cards) {
            if (newSet.length < 3) {
                if (game.deck.cardsDealt.includes(game.deck.cards[card]) == false) {
                    newSet.push(game.deck.cards[card]);
                    game.deck.cardsDealt.push(game.deck.cards[card]);
                    game.deck.cards.splice(card, 1);
                }
            }
        }
        console.log("THIS is new set");
        console.log(newSet);
        for (var i = 0; i < newSet.length; i++) {
          console.log("removed set to remove from current cards for player who chose set");
            //remove set found from currentCards
            var r = game.deck.currentCards.indexOf(setToRemove[i]);
            console.log("about to remove " + setToRemove[i].id + " from currentCards");
            game.deck.currentCards.splice(r, 1);
            game.deck.currentCards.push(newSet[i]);
            //add to screen
        }
    } else {
        for (var i = 0; i < setToRemove.length; i++) {
            console.log("removing from current cards and dealt size is 15")
            var r = game.deck.currentCards.indexOf(setToRemove[i]);
            console.log("about to remove " + setToRemove[i].id + " from currentCards");
            game.deck.currentCards.splice(r, 1);
        }
    }
    //console.log(game.deck.cardsDealt);
    console.log("call to remove");
    socket.emit('removeFromScreen', newSet, setToRemove);
    //possibleCombinations(game.deck.currentCards);
    socket.emit('updateServerGame', game);
    changeScore();
    console.log(game.deck.currentCards);
    socket.emit('setCardSizes');
    for (var prop in setCheck) {
        setCheck[prop] = [];
    }
    cardsPicked = [];
}


function setCardSizes() {
    console.log("changign card sizes");
    $(".cards > img").each(function() {
      if(game.deck.currentCards.length > 12){
        $(this).removeClass('twelve');
        $(this).addClass('fifteen');
      }
      if(game.deck.currentCards.length <= 12){
          $(this).removeClass('fifteen');
          $(this).addClass('twelve');
      }
    });
}
