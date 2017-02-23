/*     */

var cardsPicked = [];
var imgToChange = [];
var randomNew = [];
var setsPicked = [];


$(document).ready(function() {
    console.log("GAME READY");
});

function printCurrentCards() {
    $(".cards > img").each(function() {
        console.log($(this).attr('id'));
    });
}


function cardPicked(id) {
  console.log(game);
    console.log("Picked " + id);
    if (cardsPicked.length < 3) {
        console.log("Picked " + id);

        $("#" + id).toggleClass("shaded");
        //card has its own ID change the grep function
        var obj = $.grep(cardsDealt, function(e){ return e['id'] == id; });
        if(cardsPicked.includes(obj[0])){
          var index = cardsPicked.indexOf(id);
          cardsPicked.splice(index,1);
        }
        else{
            console.log("adding to bh");
            //var obj = $.grep(game.deck, function(e){ return e['id'] == id; });
            cardsPicked.push(obj[0]);
        }

        if(cardsPicked.length == 3){
          checkIfSet();
        }
        console.log(cardsPicked);
    }

}

var setCheck = {
  color: [],
  shape: [],
  number: [],
  shading: []
};


//check the console for the results
function checkIfSet(){
  for(var i = 0; i < cardsPicked.length; i++){
    for(var prop in cardsPicked[i]){
      if((prop != 'imageSource')){
        if((prop != 'id')){
        //console.log(prop);
        setCheck[prop].push(cardsPicked[i][prop]);
      }
      }
    }
  }
  var isSet = true;
  for(var prop in setCheck){
    if(allValuesSame(setCheck[prop]) || unique(setCheck[prop])){
      console.log(prop + " satisfies");
    }
    else{
      console.log(prop + " does not satisfy");
      isSet = false;
    }

  }
  if(isSet){
    console.log("Cards selected are a set");
    var holdIDs = [];
    for(var i = 0; i < cardsPicked.length;i++)
      holdIDs[i] = cardsPicked[i].id;
    console.log(holdIDs);
    replaceSet(holdIDs);
    removeSet();
    //remove in main
  }
    //remove 3 cards from deck, add point to player, add 3 new cards to screen.
  else{
    console.log("Cards selected are not a set");
    removeSet();
  }

    //unshade the 3 cards, display message saying 'not a set'
}

//checks if all values in array are the same
function allValuesSame(arr){
  for(var i = 1; i < arr.length; i++)
    {
        if(arr[i] != arr[0]){
            //console.log(arr[i] + " does not equal " + arr[0]);
            return false;
          }
    }

    return true;
}
//checks if all values are unique
function unique(arr){
  for(var i = 1; i < arr.length; i++)
  {
    if(arr[i] == arr[0])
            return false;
  }
  return true;
}

function removeSet(){
  for(var i = 0; i < cardsPicked.length; i++){
    $("#"+cardsPicked[i].id).toggleClass("shaded");
  }
  cardsPicked = [];
  for(var prop in setCheck){
    setCheck[prop] = [];
  }
}
