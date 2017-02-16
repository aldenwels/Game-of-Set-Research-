


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
  var i = 0;
  this.generateDeck = function(){
    for(var s in shapes){
      for(var sh in shadings){
        for(var c in colors){
          for(var n in numbers){
            var url = "images/" + shapes[s] + "_" + colors[c] + "_" + shadings[sh] + "_" + numbers[n] + ".png";
            var id = 'card' + i;
            this.deck.push(new Card(shapes[s], shadings[sh], colors[c], numbers[n],url, id));
            i++;
            //document.write("Shape: " + card.shape + "Shading: " + card.shading + "Number: " + card.number + "Color: " + card.color);
            //console.log("Shape: " + shapes[s] + "Shading: " + shadings[sh] + "Number: " + numbers[n] + "Color: " + colors[c]);
          }
        }
      }
    }
  };
}
function Card(shape, shading, color, number, image, id){
    this.shape = shape;
    this.shading = shading;
    this.number = number;
    this.color = color;
    this.imageSource = image;
    this.id = id;
}
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

var shuffle = function(v){
  for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
  };


function printDeck(deck){
  for(var card in deck){
    if(card < 9){   //display nine at a time(for now)
      //var x = "<img src='" + deck[card].imageSource + "' onclick = 'console.log('.')'></img>";
      //var funct = "console.log(hello" +")";
      //var funct = "console.log(" + '"hello"' + ")";
      //var id1 = 'card' + card;
      //console.log(id1);
      var funct = "printID(\"" + deck[card].id + "\")";
      var x = "<img src='" + deck[card].imageSource + "' onclick='"+ funct +"' id = '" + deck[card].id + "' </img>";
      
      $(".cards").append(x);
      console.log(x);
      console.log("Card " + card + ": Shape: " + deck[card].shape + " Shading: " + deck[card].shading + " Number: " + deck[card].number + " Color: " + deck[card].color + "<br />");
    }
  }
}
function printID(id1){
  var id = document.getElementById("" + id1 + "");
  //console.log("" + id1 + "");
  console.log(id);
  console.log(id1);
}
function main(){
  var game = new Game();
  game.generateDeck();  //generate deck
  //printDeck(game.deck);
  game.deck = shuffle(game.deck); //shuffle game deck
  printDeck(game.deck); //print deck to screen
}
