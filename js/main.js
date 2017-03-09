/*
    Instead of immediately generate random ask player to generate new game when they pick their mode
    so that can call seperate functions
    For instance a room is created for that one player with their own game.html
    Rooms:
    Single-x
    Multi-n
*/

var cardsDealt = [];
var currentCards = [];
var shapes = [
    "rectangle",
    "circle",
    "triangle"
];
var shadings = [
    "blank",
    "striped",
    "fill"
];
var colors = [
    "blue",
    "red",
    "green"
];
var numbers = [
    "1",
    "2",
    "3"
];
var numCards = 81;



var i = 1;

function Game() {
    this.deck = [];
    this.generateDeck = function() {
        //generates deck based on 4 arrays of properties and creates new card based on the image corresponding to
        //those properties
        for (var s in shapes) {
            for (var sh in shadings) {
                for (var c in colors) {
                    for (var n in numbers) {
                        var url = "images/" + shapes[s] + "_" + colors[c] + "_" + shadings[sh] + "_" + numbers[n] + ".png";
                        this.deck.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n], url, i));
                        i++;
                    }
                }
            }
        }
    };
}

function Card(shape, shading, color, number, image, id) {
    this.shape = shape;
    this.shading = shading;
    this.number = number;
    this.color = color;
    this.imageSource = image;
    this.id = "card-" + id;
}
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

var shuffle = function(v) {
    //v id the deck
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};


function printDeck() {
    for (var card in deck) {
        if (card < 9) {
            //display nine at a time(for now)
            $(".cards").append("<img src='" + deck[card].imageSource + "' id = '" + deck[card].id + "' </img>");
            console.log("Card " + card + ": Shape: " + deck[card].shape + " Shading: " + deck[card].shading + " Number: " + deck[card].number + " Color: " + deck[card].color + "<br />");
            currentCards.push(deck[card]);
            cardsDealt.push(deck[card]);
            var r = deck.indexOf(deck[card]);
            deck.splice(r,1);
        }
    }
     possibleCombinations(currentCards);
}

function replaceSet(setToRemove) {
    var newSet = [];
    for (var card in deck) {
        if (newSet.length < 3) {
            if (cardsDealt.includes(deck[card]) == false) {
                newSet.push(deck[card]);
                cardsDealt.push(deck[card]);
                //var r = deck.indexOf(deck[card]);
                deck.splice(card,1);
            }
        }
    }
    for (var i = 0; i < newSet.length; i++) {
        //remove from currentCards
        var r = currentCards.indexOf(setToRemove[i]);
        currentCards.splice(r,1);
        currentCards.push(newSet[i]);
        //add to screen
        $("#" + setToRemove[i].id).attr("id", newSet[i].id);
        $("#" + newSet[i].id).attr('src', newSet[i].imageSource);
        $("#" + newSet[i].id).toggleClass("shaded");
    }
    possibleCombinations(currentCards);
}

var game;
var deck;

function main() {
    //create new game
    game = new Game();
    //generate deck
    game.generateDeck();
    //printDeck(game.deck);
    game.deck = shuffle(game.deck); //shuffle game deck
    //set game.deck to global variable
    deck = game.deck;
    //print deck which puts initial nine cards on board
    printDeck(game.deck);

    printCurrentCards();

    //event handler for clicking on card
    $(".cards > img").click(function() {
        //call function that adds to array of cards picked so far
        cardPicked($(this).attr('id'));
    });
}
