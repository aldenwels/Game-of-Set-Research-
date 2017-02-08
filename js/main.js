


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

function Game(){
  this.deck = [];
  this.generateDeck = function(){
    for(var s in shapes){
      for(var sh in shadings){
        for(var c in colors){
          for(var n in numbers){
            var url = "images/" + shapes[s] + "_" + colors[c] + "_" + shadings[sh] + "_" + numbers[n] + ".png";
            this.deck.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n],url));
            //document.write("Shape: " + card.shape + "Shading: " + card.shading + "Number: " + card.number + "Color: " + card.color);
            //document.write("Shape: " + s + "Shading: " + sh + "Number: " + n + "Color: " + c);
          }
        }
      }
    }
  };
}
function Card(shape, shading, color, number, image){
    this.shape = shape;
    this.shading = shading;
    this.number = number;
    this.color = color;
    this.imageSource = image;
}
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

var shuffle = function(v){
  for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
  };


function printDeck(deck){
  for(var card in deck){
    $(".cards").append("<img src='" + deck[card].imageSource + "'></img>")
    console.log("Card " + card + ": Shape: " + deck[card].shape + " Shading: " + deck[card].shading + " Number: " + deck[card].number + " Color: " + deck[card].color + "<br />");
  }
}

function main(){
  var game = new Game();
  game.generateDeck();
  printDeck(game.deck);
  game.deck = shuffle(game.deck);
  printDeck(game.deck);
}
