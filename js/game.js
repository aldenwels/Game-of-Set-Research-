/*     */

var cardsPicked = [];



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
        if(cardsPicked.includes(id)){
          console.log(id + " is in this bih");
          var index = cardsPicked.indexOf(id);
          cardsPicked.splice(index,1);
        }
        else{
            console.log("adding to bh");
            var obj = $.grep(game.deck, function(e){ return e['id'] == id; });
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

console.log(setCheck);

function checkIfSet(){
  for(var i = 0; i < cardsPicked.length; i++){
    for(var prop in cardsPicked[i]){
      if((prop != 'imageSource')){
        if((prop != 'id')){
        console.log(prop);
        setCheck[prop].push(cardsPicked[i][prop]);
      }
      }
    }
  }
  console.log(setCheck);
}
