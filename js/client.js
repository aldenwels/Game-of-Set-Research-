//instatiate socket
var socket = io();
var cardsDealt = [];
var room, game;
//log random number
var random = Math.random();
console.log(random);

socket.on('removeWaiting',function(){
  $('#waiting').html("");
});

socket.on('testing',function(data){
  console.log(data);
});

//log message from server
socket.on('serverMsg', function(data) {
    console.log(data);
});

socket.on('setGame', function(g) {
    //set game sets a client side global game variable
    game = g;
    console.log(game);
    //call to possible combination on cards dealt
    possibleCombinations(game.deck.currentCards);
});

socket.on('updateScreenName', function(name) {
    $("#player-name").html("Player: " + name);
});

//prints cards to screen
socket.on('deck', function(data) {
    //adds cards to screen
    for (i in data) {
        $(".cards").append(data[i]);
    }
    //set on click event to each appended image
    $(".cards > img").click(function() {
        cardPicked($(this).attr('id'));
    });
    $(".cards > img").each(function() {
        $(this).addClass('twelve');
    });
});

socket.on('removeSetFromScreen', function(newSet, setToRemove) {
    console.log(" on cli NEW SET IS THIS BIG" + newSet.length);
  console.log("removing set froms creen");
    //actually changes client side html elements to new set of cards
    if (newSet.length == 0) {
      console.log("no new set to remove");
        for (i in setToRemove) {
            $("#" + setToRemove[i].id).remove();
        }
    } else {
        for (var i = 0; i < newSet.length; i++) {
            $("#" + setToRemove[i].id).attr("id", newSet[i].id);
            $("#" + newSet[i].id).attr('src', newSet[i].imageSource);
            //$("#" + newSet[i].id).toggleClass("shaded");
        }
    }
    return;
});

socket.on('changeClientScore', function(names, scores) {
    $('#score').empty();
    if(names.length <= 1){
      $('#score').append("<li>" + names[0] + " score : " + scores[0] + "</li>");
    }
    else{
      $('#score').append("<li>" + names[0] + " : " + scores[0] + "</li>");
      $('#score').append("<li>" + names[1] + " : " + scores[1] + "</li>");
    }
});

var multiConnections;
//send message to server when player mode is picked
$(document).ready(function() {
    $("#single").click(function() {
        $(".pickMode").hide();
        //emit message to server
        socket.emit('singleplayer',$("#name").val(), $("#experience").val(),$("#gender").val());
        //main();
        $(".game").show();
    });
    $("#multi").click(function() {
        socket.emit('checkIfRoomAvailable');
        socket.on('roomAvailable',function(data){
          if(data){
            $(".pickMode").hide();
            $(".game").show();
            //emit message to server
            socket.emit('multiplayer', $("#name").val(), $("#experience").val(),$("#gender").val());
          }
          else{
            alert('multiplayer room is full you are going to have to wait');
          }
        });

    });
    $("#singleAI").click(function() {
        $(".pickMode").hide();
        $(".game").show();
        console.log(100);
        //emit message to server
        socket.emit('singleAI', 1);
    });
    $("#playAI-button").click(function(){
      var alg = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
      console.log(alg);
      socket.emit("playAI",alg);
    });
});

socket.on('connectToRoom', function(data) {
    console.log(data);
});

socket.on('updateGameState', function(update_game) {
    game = update_game;
    var amount = possibleCombinations(game.deck.currentCards);
    if(amount <= 0 && game.deck.cardsDealt.length == 81){
      alert("GAME OVER");
      $(".cards").empty();
      $(".game").hide();
      $(".pickMode").show();
    }
});

socket.on('displayTimer', function(time) {
    time = millisToMinutesAndSeconds(time);
    $("#timer").empty();
    $("#timer").append("<li>" + time +  "</li>");
});

socket.on('askToAddSet', function() {
    var form = "<center><form class='requestSetForm'>Other player requested to add Set do you agree <input type='button' id='yes' value='yes'></input> <input type='button' value='no'></input></center> </form>"
    $(".requestFormContainer").append(form);
    $("#yes").click(function() {
        $(".requestFormContainer").empty();
        socket.emit("agreedToAddSet");
    });
});

socket.on('addSet', function() {
    console.log("add to dealt");
    addSetToDealt();
});

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

socket.on('setCardSizes',function(){
  setCardSizes();
});
