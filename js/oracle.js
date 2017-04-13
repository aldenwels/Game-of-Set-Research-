/*
 FUNCTIONS TO CHECK IF CURRENTLY DEALT SET CONTAINS CARDS
*/

var setCount = 0;

var oracleSetCheck = {
    color: [],
    shape: [],
    number: [],
    shading: []
};

//essentially identical to checkifset function. will reorganize
function checkOracleSet(cardCombo) {
    /* USES oracleSetCheck object to check if a set
      setCheck comprises of 4 arrays one for each property
      the property of each of the cards is pushed onto these arrays which is then assessed to check if
      the values of the arrays in setCheck are all the same or all different
    */
    for (var i = 0; i < cardCombo.length; i++) {
        //console.log(" Shape: " + cardCombo[i].shape + " Shading: " + cardCombo[i].shading + " Number: " + cardCombo[i].number + " Color: " + cardCombo[i].color);
        for (var prop in cardCombo[i]) {
            if ((prop != 'imageSource')) {
                if ((prop != 'id')) {
                    //push property in setCheck into corresponding property for this card
                    oracleSetCheck[prop].push(cardCombo[i][prop]);
                }
            }
        }
    }

    //check the 3 cards satisfy the all different or all same conditions for each property
    var isSet = true;
    for (var prop in oracleSetCheck) {

        if (!allValuesSame(oracleSetCheck[prop]) && !unique(oracleSetCheck[prop])) {
            isSet = false;
            //can return false here to save time
        }
    }

    //clear set check array
    for (var prop in oracleSetCheck) {
        oracleSetCheck[prop] = [];
    }
    if(isSet){
        //console.log("there is a set");
        setCount++;
    }
    //return true;
}

// Program to print all combination of size r in an array of size n

// The main function that prints all combinations of size r
// in arr[] of size n. This function mainly uses combinationUtil()
function printCombination(arr, n, r)
{
    // A temporary array to store all combination one by one
    var data = [];

    // Print all combination using temporary array 'data[]'
    combinationUtil(arr, n, r, 0, data, 0);
}

/* arr[]  ---> Input Array
   n      ---> Size of input array
   r      ---> Size of a combination to be printed
   index  ---> Current index in data[]
   data[] ---> Temporary array to store current combination
   i      ---> index of current element in arr[]     */
function combinationUtil(arr, n, r, index, data, i)
{
    // Current cobination is ready, print it
    if (index == r)
    {
        //check if current combination is set
        //if yes, increment setCount
        checkOracleSet(data);
        //console.log(setCount);
        /*
        for (var j=0; j<r; j++)
        	console.log(data[j]);
            //printf("%d ",data[j]);
        console.log("\n"); */
        //printf("\n");
        return;
    }

    // When no more elements are there to put in data[]
    if (i >= n)
        return;

    // current is included, put next at next location
    data[index] = arr[i];
    combinationUtil(arr, n, r, index+1, data, i+1);

    // current is excluded, replace it with next (Note that
    // i+1 is passed, but index is not changed)
    combinationUtil(arr, n, r, index, data, i+1);
}

function possibleCombinations(cardsDealt){
	//var arr = [6,7,9,1,2,];
    var r = 3;
    var n = cardsDealt.length;
    //printCombination(arr, n, r);
    printCombination(cardsDealt, n, r);
    $('#numSets').html("Possible Combinations: " + setCount);
}
