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



/*
  DECK CONSTRUCTOR
*/
var Deck = function() {
    this.cards = [];
    this.cardsDealt = [];
    this.currentCards = [];
    this.generateDeck();
    this.shuffle();
};

/*
CARD CONSTRUCTOR
*/
function Card(shape, shading, color, number, image, id) {
    this.shape = shape;
    this.shading = shading;
    this.number = number;
    this.color = color;
    this.imageSource = image;
    this.id = "card-" + id;
}

var i = 0;
//generate rando deck
Deck.prototype.generateDeck = function() {
    //generates deck based on 4 arrays of properties and creates new card based on the image corresponding to
    //those properties
    for (var s in shapes) {
        for (var sh in shadings) {
            for (var c in colors) {
                for (var n in numbers) {
                    var url = "images/" + shapes[s] + "_" + colors[c] + "_" + shadings[sh] + "_" + numbers[n] + ".png";
                    this.cards.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n], url, i));
                    i++;
                }
            }
        }
    }
    console.log(this.cards);
}

//shuffle deck
Deck.prototype.shuffle = function() {
    for (var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
    return this.cards;
};

//print deck to screen
Deck.prototype.printDeck = function() {
    var printedCards = [];
    for (var card in this.cards) {
        if (card < 12) {
            //display nine at a time(for now)
            //$(".cards").append("<img src='" + this.deck[card].imageSource + "' id = '" + this.deck[card].id + "' </img>");
            printedCards.push("<img src='" + this.cards[card].imageSource + "' id = '" + this.cards[card].id + "' </img>");
            console.log("Card " + card + ": Shape: " + this.cards[card].shape + " Shading: " + this.cards[card].shading + " Number: " + this.cards[card].number + " Color: " + this.cards[card].color + "<br />");
            this.currentCards.push(this.cards[card]);
            this.cardsDealt.push(this.cards[card]);
            var r = this.cards.indexOf(this.cards[card]);
            this.cards.splice(r, 1);
        }
    }
    return printedCards;
    //this.possibleCombinations(currentCards);
}

module.exports = Deck;
