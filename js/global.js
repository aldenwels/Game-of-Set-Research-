module.exports = {
    allValuesSame: function(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] !== arr[j]) {
                    return false;
                }
            }
        }

        return true;
    },
    //checks if all values are unique
    unique: function(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    return false;
                }
            }
        }
        return true;
    }
};
