var shapes = [
  "Rectangle",
  "Circle",
  "Triangle"
];
var shadings = [
  "Blank",
  "Stripes",
  "Fill"
];
var colors = [
  "Blue",
  "Red",
  "Green"
];
var numbers = [
  "one",
  "two",
  "three"
];
var numCards = 81;

function Game(){
  this.deck = [];
  this.generateDeck = function(){
    for(var s in shapes){
      for(var sh in shadings){
        for(var c in colors){
          for(var n in numbers){
            this.deck.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n]));
            //document.write("Shape: " + card.shape + "Shading: " + card.shading + "Number: " + card.number + "Color: " + card.color);
            //document.write("Shape: " + s + "Shading: " + sh + "Number: " + n + "Color: " + c);
          }
        }
      }
    }
  };
}
  function Card(shape, shading, color, number){
    this.shape = shape;
    this.shading = shading;
    this.number = number;
    this.color = color;

    this.displayCard = function(shape,shading,number,color){
      var func = "";

      if(shape == "Rectangle")
        func = rect(50, 50, 80, 80);
    }
  }

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

var shuffle = function(v){
for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
return v;
};
function printDeck(deck){
for(var card in deck){

console.log("Card " + card + ": Shape: " + deck[card].shape + " Shading: " + deck[card].shading + " Number: " + deck[card].number + " Color: " + deck[card].color + "<br />");
}

}
function setup(){
  var myCanvas = createCanvas(600, 400);
  myCanvas.parent('canvas');
}
function draw() {
ellipse(50, 50, 80, 80);
}

var game = new Game();
game.generateDeck();
printDeck(game.deck);
game.deck = shuffle(game.deck);
printDeck(game.deck);
