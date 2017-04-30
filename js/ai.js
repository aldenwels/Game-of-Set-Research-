var setCount = 0;
var glbl = require("./global");
var properties = {
    shape: ['rectangle', 'circle', 'triangle'],
    shading: ["blank","striped","fill"],
    color: ["blue","red","green"],
    number: ["1","2","3"]
},
shadePair = [],
shapePair = [],
numberPair = [],
colorPair = [],
//Card c = new Card();
shading = "",
shape =  "",
number =  "",
color = "",

shapes =["rectangle","circle","triangle"],
shadings = ["blank","striped","fill"],
colors =  ["blue","red","green"
],
numbers = ["1","2","3"];
var AI = function(socket, number) {
    this.$ = require('cheerio');
    this.socket = socket;
    this.id = socket.id;
    this.set = [];
    this.setsFound = [];
    this.score = 0;
    this.algNum = number;
    this.oracleSetCheck = {
        color: [],
        shape: [],
        number: [],
        shading: []
    };

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
                    return true;
                }
            }
        }
        return false;
    }

    this.alg2 = function(cardsDealt) {
        console.log("Running alg2");
        console.log(cardsDealt);
        var cardCombination = [];
        var n = cardsDealt.length;
        var n2 = parseInt(cardsDealt.length / 2);
        for (var i = 0; i < n / 2 - 1; i++) {
            for (var j = i + 1; j < n / 2; j++) {
                console.log("card 1: ");
                console.log(cardsDealt[i]);
                console.log("card 2: ");
                console.log(cardsDealt[j]);
                console.log("Computing third card: ");
                if (this.computeThird(j, cardsDealt[i], cardsDealt[j], cardsDealt)) {
                    console.log("found set with alg2, loop 1");
                    return true;
                }

            }
        }
        console.log("done with first loop");
        for (var i = n2; i < n; i++) {
            for (var j = i + 1; j < n; j++) {
                console.log("i " + i);
                console.log("j " + j);
                console.log("card 1: ");
                console.log(cardsDealt[i]);
                console.log("card 2: ");
                console.log(cardsDealt[j]);
                console.log("Computing third card: ");
                if (this.computeThirdTwo(cardsDealt[i], cardsDealt[j], cardsDealt)) {
                    console.log("found set with alg2, loop 2");
                    return true;
                }

            }
        }
        return false;
    }

    this.computeThird = function(j, c1, c2, cardsDealt) {


        //if the property of card 1 and 2 are the same, the third card's property must also be the same
        if (c1.shading == c2.shading) {
            //c.shading = c1.shading;
            glbl.shading = c1.shading;
            //if they are different, the third card's property must be different, so
            //push the two card onto an array and compare this array with the original set of 3 options
            //return the the property that is different
        } else {
            shadePair.push(c1.shading);
            shadePair.push(c2.shading);
            console.log("shade pair consists of this many elements: " + shadePair.length);
            for (var s in shadings) {
                if (shadePair.indexOf(shadings[s]) == -1)
                    shading = shadings[s];
            }
        }


        if (c1.shape == c2.shape)
            shape = c1.shape;
        else {
            shapePair.push(c1.shape);
            shapePair.push(c2.shape);
            for (var s in shapes) {
                if (shapePair.indexOf(shapes[s]) == -1)
                    shape = shapes[s];
            }
        }

        if (c1.number == c2.number)
            number = c1.number;
        else {
            numberPair.push(c1.number);
            numberPair.push(c2.number);
            for (var num in numbers) {
                if (numberPair.indexOf(numbers[num]) == -1)
                    number = numbers[num];
            }
        }

        if (c1.color == c2.color)
            //c.color = c1.color;
            color = c1.color;
        else {
            colorPair.push(c1.color);
            colorPair.push(c2.color);
            for (var col in colors) {
                if (colorPair.indexOf(colors[col]) == -1)
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
        if (c1.shading == c2.shading) {
            //c.shading = c1.shading;
            shading = c1.shading;
            console.log("shading is same as " + shading);
            //if they are different, the third card's property must be different, so
            //push the two card onto an array and compare this array with the original set of 3 options
            //return the the property that is different
        } else {
            shadePair.push(c1.shading);
            shadePair.push(c2.shading);
            for (var shade in shadings) {
                if (shadePair.indexOf(shadings[shade]) == -1)
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
            for (var s in shapes) {
                if (shapePair.indexOf(shapes[s]) == -1)
                    shape = shapes[s];
            }
        }

        if (c1.number == c2.number)
            //c.number = c1.number;
            number = c1.number;
        else {
            numberPair.push(c1.number);
            numberPair.push(c2.number);
            for (var num in numbers) {
                if (numberPair.indexOf(numbers[num]) == -1)
                    number = numbers[num];
            }
        }

        if (c1.color == c2.color)
            //c.color = c1.color;
            color = c1.color;
        else {
            colorPair.push(c1.color);
            colorPair.push(c2.color);
            for (var col in colors) {
                if (colorPair.indexOf(colors[col]) == -1)
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
                    this.set = [c1, c2, cardsDealt[i]];
                    return true;

                    //return;
                } else {
                    console.log("no set");
                }
            }
        }
        return false;

    };
    //checks condition for algorithm 3: three properties are shared and one is different
    this.checkCondition = function(c1, c2) {
        cardsPicked = []
        cardsPicked.push(c1);
        cardsPicked.push(c2);

        for (var i = 0; i < cardsPicked.length; i++) {
            for (var prop in cardsPicked[i]) {
                if ((prop != 'imageSource')) {
                    if ((prop != 'id')) {
                        //push property in setCheck into corresponding property for this card
                        this.oracleSetCheck[prop].push(cardsPicked[i][prop]);
                    }
                }
            }
        }

        var allSame = 0;
        var allDiff = 0;

        for (var prop in this.oracleSetCheck) {

            if (glbl.allValuesSame(this.oracleSetCheck[prop])) {
                console.log("prop: " + prop + "; " + this.oracleSetCheck[prop] + "all same");
                allSame++;
                //can return false here to save time
            }
            if (glbl.unique(this.oracleSetCheck[prop])) {
                console.log("prop: " + prop + "; " + this.oracleSetCheck[prop] + "all different");
                allDiff++;
            }
        }
        //clear set check array
        for (var prop in this.oracleSetCheck) {
            this.oracleSetCheck[prop] = [];
        }

        if (allSame == 1 && allDiff == 3) {
            console.log("satisifes condition");
            return true;
        } else
            return false;



    }
    //searches for sets within pairs of cards that satisfy the condition: three properties different and one the same.
    //all pairs that do not satisify the condition are pushed onto a separate array(otherCards).
    //this array will be checked for sets at the end if no sets are found with the original algorithm.
    this.alg3 = function(cardsDealt) {
        console.log("Running alg3");
        var flag = false;
        var cardCombination = [];
        var otherCards = [
            []
        ];
        var count = 0;
        var n = cardsDealt.length;
        var n2 = parseInt(cardsDealt.length / 2);
        for (var i = 0; i < n / 2 - 1; i++) {
            for (var j = i + 1; j < n / 2; j++) {
                console.log("card 1: ");
                console.log(cardsDealt[i]);
                console.log("card 2: ");
                console.log(cardsDealt[j]);
                console.log("Computing third card: ");
                if (this.checkCondition(cardsDealt[i], cardsDealt[j])) {
                    if (this.computeThird(j, cardsDealt[i], cardsDealt[j], cardsDealt)) {
                        console.log("found set with alg3, loop 1");
                        flag = true;
                        return true;
                    }
                } else {
                    //push cards to array of pairs, to be checked after with alg
                    console.log("i : " + i + " j : " + j);
                    console.log("count: " + count);
                    otherCards[count] = [];


                    otherCards[count][0] = cardsDealt[i];
                    otherCards[count][1] = cardsDealt[j];

                    console.log("pushing cards that don't satisfy");
                    console.log(otherCards[count][0]);
                    console.log(otherCards[count][1]);
                    count++;
                }


            }
        }
        //count = 0;
        console.log("done with first loop");
        for (var i = n2; i < n; i++) {
            for (var j = i + 1; j < n; j++) {
                console.log("i " + i);
                console.log("j " + j);
                console.log("card 1: ");
                console.log(cardsDealt[i]);
                console.log("card 2: ");
                console.log(cardsDealt[j]);

                if (this.checkCondition(cardsDealt[i], cardsDealt[j])) {
                    console.log("Computing third card: ");
                    if (this.computeThirdTwo(cardsDealt[i], cardsDealt[j], cardsDealt)) {
                        console.log("found set with alg3, loop 2");
                        flag = true;
                        return true;
                    }
                } else {
                    //push cards to array of pairs, to be checked after with alg2
                    console.log("i : " + i + " j : " + j);
                    console.log("count: " + count);

                    otherCards[count] = [];

                    otherCards[count][0] = cardsDealt[i];
                    otherCards[count][1] = cardsDealt[j];

                    console.log("pushing cards that don't satisfy");
                    console.log(otherCards[count][0]);
                    console.log(otherCards[count][1]);

                    count++;

                }

            }
        }
        if (flag == false) {
            console.log("set not found with alg3, doing alg2 modified");

            for (var i = 0; i < otherCards.length; i++) {
                console.log("card 1: ");
                console.log(otherCards[i][0]);
                console.log("card 2: ");
                console.log(otherCards[i][1]);
                if (this.computeThirdTwo(otherCards[i][0], otherCards[i][1], cardsDealt)) {

                    console.log("found set with alg2 modified");
                    return true;
                }
            }


            //alg2(cardsDealt);
        }

        return false;
    };
    this.alg4 = function(cardsDealt){
        console.log("Running alg4");
        var n = cardsDealt.length;
        var objProps = [];
        var obj = [];
        for(var prop in properties){
            for(var i in properties[prop]){

              for(var c in cardsDealt){
                if(cardsDealt[c][prop] == properties[prop][i])
                  obj.push(cardsDealt[c]);
              }


                objProps.push(obj);//push each object on to an array
                obj = [];
                console.log("WHERE " + prop + " is " + properties[prop][i]);
                console.log(obj);
            }
        }
        //sort objects in array in descending order
        objProps.sort(function (a, b) {
            return b.length - a.length;
    });

        //get all that have length of 6 or greater
        var obj2 = [];
            for(var i in objProps){
                if(objProps[i].length >= 6)
                    obj2.push(objProps[i]);
            }

            console.log("where the length is greater than 6");
            console.log(obj2);

        //for each set of objects in this array, run alg1
        for(var i in obj2){
            if(obj2.length != 0){
                if(this.alg2(obj2[i])){
                    console.log("found set alg4 in ");
                    console.log(obj2[i]);
                    return true;
                }
            }
        }

        console.log("set not found with alg4, doing alg2");
        this.alg2(cardsDealt);
        return false;

    };
    this.alg5 = function(cardsDealt){
        var obj = [];
        console.log("Running alg5");
        var n = cardsDealt.length;
        var objProps = [];
        for(var prop in properties){
            for(var i in properties[prop]){

              for(var c in cardsDealt){
                if(cardsDealt[c][prop] == properties[prop][i])
                  obj.push(cardsDealt[c]);
              }
                objProps.push(obj);//push each object on to an array

                console.log("WHERE " + prop + " is " + properties[prop][i]);
                console.log(obj);
            }
        }

        console.log("sorting in ascending order");
        //sort objects in array in ascending order
        objProps.sort(function (a, b) {
            return a.length - b.length;
    });
        console.log("printing objProps");
        console.log(objProps);

        /*for(var i in objProps){
            var obj2 = $.grep(objProps, function(e) {
                return objProps[i].length == 1;
                //will return object that satisifes a certain property
            });
        }*/
            var obj2 = [];
            for(var i in objProps){
                if(objProps[i].length == 1)
                    obj2.push(objProps[i]);
            }


            console.log("where the length is 1");
            console.log(obj2);
        for(var i in obj2){
            for(var j in cardsDealt){
                if(obj2.length != 0 && obj2[i] != cardsDealt[j]){
                //if(objProps[0].length == 1 && objProps[0][0] != cardsDealt[i]){
                    //console.log(objProps[0]);
                    console.log("First card ");
                    console.log(obj2[i][0]);
                    //console.log(objProps[0][0]);
                    console.log("Second card ");
                    console.log(cardsDealt[j]);
                    //console.log(cardsDealt[i]);
                    //if(computeThirdTwo(objProps[0][0], cardsDealt[i])){
                    if(this.computeThirdTwo(obj2[i][0], cardsDealt[j],cardsDealt)){
                        console.log("found set with alg5");
                        return true;
                    }

                }
            }
        }
        console.log("set not found with alg5, doing alg2");
        this.alg2(cardsDealt);
        return false;
    }
};




module.exports = AI;


//for algorithm 1
