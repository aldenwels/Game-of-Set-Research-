/*
    Instead of immediately generate random ask player to generate new game when they pick their mode
    so that can call seperate functions
    For instance a room is created for that one player with their own game.html
    Rooms:
    Single-x
    Multi-n
*/

var cardsDealt = [];

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
        for (var s in shapes) {
            for (var sh in shadings) {
                for (var c in colors) {
                    for (var n in numbers) {
                        var url = "images/" + shapes[s] + "_" + colors[c] + "_" + shadings[sh] + "_" + numbers[n] + ".png";
                        this.deck.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n], url, i));
                        i++;
                        //document.write("Shape: " + card.shape + "Shading: " + card.shading + "Number: " + card.number + "Color: " + card.color);
                        //console.log("Shape: " + shapes[s] + "Shading: " + shadings[sh] + "Number: " + numbers[n] + "Color: " + colors[c]);
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
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};


function printDeck() {
    for (var card in deck) {
        if (card < 9) {
            //display nine at a time(for now)
            $(".cards").append("<img src='" + deck[card].imageSource + "' id = '" + deck[card].id + "' </img>");
            console.log("Card " + card + ": Shape: " + deck[card].shape + " Shading: " + deck[card].shading + " Number: " + deck[card].number + " Color: " + deck[card].color + "<br />");
            cardsDealt.push(deck[card]);
        }
    }
}

function replaceSet(ids) {
    var newSet = [];
    for (var card in deck) {
        if (newSet.length < 3) {
            if (cardsDealt.includes(deck[card]) == false) {
                newSet.push(deck[card]);
            }
        }
    }
    for (var i = 0; i < newSet.length; i++) {
        $("#" + ids[i]).attr("id", newSet[i].id);
        $("#" + newSet[i].id).attr('src', newSet[i].imageSource);
        $("#" + newSet[i].id).toggleClass("shaded");
    }
}

var game;
var deck;

function main() {
    game = new Game();
    game.generateDeck(); //generate deck
    //printDeck(game.deck);
    game.deck = shuffle(game.deck); //shuffle game deck
    deck = game.deck;
    printDeck(game.deck); //print deck to screen
    printCurrentCards();
    $(".cards > img").click(function() {
        cardPicked($(this).attr('id'));
    });
}
