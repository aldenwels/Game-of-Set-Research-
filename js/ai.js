var setCount = 0;
var AI = function(socket, number) {
    this.$ = require('cheerio');
    this.socket = socket;
    this.id = socket.id;
    this.set = [];
    this.setsFound = [];
    this.algNum = number;
    this.alg1 = function(cardsDealt) {
        console.log("Running alg1");
        var cardCombination = [];
        var n = cardsDealt.length;
        for (var i = 0; i < n; i++) {
            console.log("N is equal to " + n);
            for (var j = i + 1; j < n; j++) {
                console.log("card 1: ");
                console.log(cardsDealt[i]);
                console.log("card 2: ");
                console.log(cardsDealt[j]);
                console.log("Computing third card: ");
                if (this.computeThird(j, cardsDealt[i], cardsDealt[j], cardsDealt)) {
                    console.log("found set using alg1");
                    //return true;
                }

            }
        }
    };

    this.alg2 = function(cardsDealt){
    console.log("Running alg2");
    console.log(cardsDealt);
    var cardCombination = [];
    var n = cardsDealt.length;
    var n2 = parseInt(cardsDealt.length / 2);
    for(var i = 0; i < n/2 - 1; i++){
        for(var j = i + 1; j < n/2; j++){
            console.log("card 1: ");
            console.log(cardsDealt[i]);
            console.log("card 2: ");
            console.log(cardsDealt[j]);
            console.log("Computing third card: ");
            if(this.computeThird(j, cardsDealt[i], cardsDealt[j],cardsDealt)){
                console.log("found set with alg2, loop 1");
                return true;
            }

        }
     }
     console.log("done with first loop");
     for(var i = n2; i < n; i++){
        for(var j = i + 1; j < n; j++){
            console.log("i " + i);
            console.log("j " + j);
            console.log("card 1: ");
            console.log(cardsDealt[i]);
            console.log("card 2: ");
            console.log(cardsDealt[j]);
            console.log("Computing third card: ");
            if(this.computeThirdTwo(cardsDealt[i], cardsDealt[j],cardsDealt)){
                console.log("found set with alg2, loop 2");
                return true;
            }

        }
    }
    return false;
}

    this.computeThird = function(j, c1, c2, cardsDealt) {
        var shadePair = [];
        var shapePair = [];
        var numberPair = [];
        var colorPair = [];

        //Card c = new Card();
        var shading = "";
        var shape = "";
        var number = "";
        var color = "";

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

        //if the property of card 1 and 2 are the same, the third card's property must also be the same
        if (c1.shading == c2.shading)
            //c.shading = c1.shading;
            shading = c1.shading;
        //if they are different, the third card's property must be different, so
        //push the two card onto an array and compare this array with the original set of 3 options
        //return the the property that is different
        else {
          shadePair.push(c1.shading);
          shadePair.push(c2.shading);
          for(var shade in shadings){
            if(shadePair.indexOf(shadings[shade]) == -1);
              shading = shadings[shade];
          }
        }


        if (c1.shape == c2.shape)
            shape = c1.shape;
        else {
            shapePair.push(c1.shape);
            shapePair.push(c2.shape);
            for(var s in shapes){
              if(shapePair.indexOf(shapes[s]) == -1);
                shape = shapes[s];
            }
        }

        if (c1.number == c2.number)
            number = c1.number;
        else {
            numberPair.push(c1.number);
            numberPair.push(c2.number);
            for(var num in numbers){
              if(numberPair.indexOf(numbers[num]) == -1);
                number = numbers[num];
            }
        }

        if (c1.color == c2.color)
            //c.color = c1.color;
            color = c1.color;
        else {
            colorPair.push(c1.color);
            colorPair.push(c2.color);
            for(var col in colors){
              if(colorPair.indexOf(colors[col]) == -1);
                color = colors[col];
            }
        }

        console.log("Third card:");
        console.log("shading: " + shading);
        console.log("shape: " + shape);
        console.log("number: " + number);
        console.log("color: " + color);

        for (var i = j + 1; i < cardsDealt.length; i++) {
            if (shading == cardsDealt[i].shading && shape == cardsDealt[i].shape && number == cardsDealt[i].number && color == cardsDealt[i].color) {
                console.log("there is a set, sir");
                this.set = [c1, c2, cardsDealt[i]];
                setCount++;
                return true;
            } else {
                console.log("no set");
            }
        }
        return false;
    };

    this.computeThirdTwo = function(c1, c2, cardsDealt) {
      var setCount = 0;
      console.log("in compute third two");
      console.log(cardsDealt);
      var shadePair = [];
      var shapePair = [];
      var numberPair = [];
      var colorPair = [];

      //Card c = new Card();
      var shading = "";
      var shape = "";
      var number = "";
      var color = "";

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


        //if the property of card 1 and 2 are the same, the third card's property must also be the same
        if (c1.shading == c2.shading){
            //c.shading = c1.shading;
            shading = c1.shading;
            console.log("shading is same as " + shading);
        //if they are different, the third card's property must be different, so
        //push the two card onto an array and compare this array with the original set of 3 options
        //return the the property that is different
      }
        else {
            shadePair.push(c1.shading);
            shadePair.push(c2.shading);
            for(var shade in shadings){
              if(shadePair.indexOf(shadings[shade]) == -1);
                shading = shadings[shade];
            }
            //shading = this.$(shadings).not(shadePair).get();
        }


        if (c1.shape == c2.shape)
            //c.shape = c1.shape;
            shape = c1.shape;
        else {
            shapePair.push(c1.shape);
            shapePair.push(c2.shape);
            for(var s in shapes){
              if(shapePair.indexOf(shapes[s]) == -1);
                shape = shapes[s];
            }
        }

        if (c1.number == c2.number)
            //c.number = c1.number;
            number = c1.number;
        else {
            numberPair.push(c1.number);
            numberPair.push(c2.number);
            for(var num in numbers){
              if(numberPair.indexOf(numbers[num]) == -1);
                number = numbers[num];
            }
        }

        if (c1.color == c2.color)
            //c.color = c1.color;
            color = c1.color;
        else {
            colorPair.push(c1.color);
            colorPair.push(c2.color);
            for(var col in colors){
              if(colorPair.indexOf(colors[col]) == -1);
                color = colors[col];
            }
        }

        console.log("Third card:");
        console.log("shading: " + shading);
        console.log("shape: " + shape);
        console.log("number: " + number);
        console.log("color: " + color);


        //check if computed card is on board. start from beginning of board, buit ignore the pair of cards that were passed in.
        console.log("current set check");
        for (var i = 0; i < cardsDealt.length; i++) {
          console.log(c1);
          console.log(c2);
          console.log(cardsDealt[i]);
          console.log(shading);
          console.log(shape);
          console.log("number is " + number);
          console.log("color is " + color);
            if (cardsDealt[i] != c1 || cardsDealt[i] != c2) {
                if (shading == cardsDealt[i].shading && shape == cardsDealt[i].shape && number == cardsDealt[i].number && color == cardsDealt[i].color) {
                    console.log("there is a set, sir");
                    setCount++;
                    this.set = [c1,c2,cardsDealt[i]];
                    return true;

                    //return;
                } else {
                    console.log("no set");
                }
            }
        }
        return false;

    };
};


module.exports = AI;


//for algorithm 1
