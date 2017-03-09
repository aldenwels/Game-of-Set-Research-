/*     */

//Holds card object of those currently picked
var cardsPicked = [];
var imgToChange = [];
var randomNew = [];
var setsPicked = [];
var setCheck = {
    color: [],
    shape: [],
    number: [],
    shading: []
};
var score = 0;
$(document).ready(function() {
    console.log("GAME READY");
    $("#addSet").click(function() {
        addSetToDealt();
    });
});

function printCurrentCards() {
    //print ids of all cards currently dealt
    $(".cards > img").each(function() {
        console.log($(this).attr('id'));
    });
}


function cardPicked(id) {
    console.log("Picked " + id);
    //if 3 cards have not been picked then add them to cardsPicked
    if (cardsPicked.length < 3) {
        console.log("Picked " + id);
        //add shading or remove shading
        $("#" + id).toggleClass("shaded");
        //search cards dealt for that html elements id so it can be added to cardspicked as object
        var obj = $.grep(cardsDealt, function(e) {
            return e['id'] == id;
        });
        if (cardsPicked.includes(obj[0])) {
            //if cards have been pickedd before then remove from cardsPicked
            var index = cardsPicked.indexOf(id);
            cardsPicked.splice(index, 1);
        } else {
            console.log("adding to bh");
            cardsPicked.push(obj[0]);
        }

        if (cardsPicked.length == 3) {
            //if 3 cards are picked check if these 3 cards are a set
            checkIfSet();
        }
        console.log(cardsPicked);
    }

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
        console.log("Cards selected are a set");
        score += 5;
        $('#score').html("Score: " + score);
        setCount = 0;   //reset set counter
        replaceSet(cardsPicked);
        removeSet();
        //remove in main
    }
    //remove 3 cards from deck, add point to player, add 3 new cards to screen.
    else {
        console.log("Cards selected are not a set");
        removeSet();
    }

    //unshade the 3 cards, display message saying 'not a set'
}


//checks if all values in array are the same
function allValuesSame(arr) {
    for (var i = 0; i < arr.length; i++){
        for(var j = i + 1; j < arr.length; j++ ) {
            if (arr[i] !== arr[j]) {
                return false;
            }
        }
    }

    return true;
}
//checks if all values are unique
function unique(arr) {
    for (var i = 0; i < arr.length; i++){
        for(var j = i + 1; j < arr.length; j++){
            if (arr[i] === arr[j]){
                return false;
            }
        }
    }
    
    return true;
}

function removeSet() {
    //removes from cardsPicked array, and empties arrays inside setCheck
    for (var i = 0; i < cardsPicked.length; i++) {
        $("#" + cardsPicked[i].id).toggleClass("shaded");
    }
    cardsPicked = [];
    for (var prop in setCheck) {
        setCheck[prop] = [];
    }
}

function addSetToDealt() {
    for (var card in deck) {
        if (card < 3) {
            $(".cards").append("<img src='" + deck[card].imageSource + "' id = '" + deck[card].id + "' </img>");
            currentCards.push(deck[card]);
            cardsDealt.push(deck[card]);
            $("#" + deck[card].id).click(function() {
                cardPicked($(this).attr('id'));
            });
            //var r = deck.indexOf(deck[card]);
            deck.splice(card, 1);
        }
    }
    possibleCombinations(currentCards);
}
