//const { enter } = require("../lib/basicStave_event-ui");

let arr = '[1, "2", 3]';
let foo = JSON.parse(arr);
console.log(foo);



/**
 * 
 * @param {*} element element to insert
 * @param {Array} array array to insert into
 * @param {Function} comparitor function to use for comparison, returing a value of -1, 0, 1 
 * @param {index} start (optional) start index, used internally
 * @param {index} end (optional) end index, used internallly
 */
function locationOf(element, array, comparer, start, end) {
    if (array.length === 0)
        return -1;

    start = start || 0;
    end = end || array.length;
    var pivot = (start + end) >> 1;  // should be faster than dividing by 2

    var c = comparer(element, array[pivot]);
    if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

    switch (c) {
        case -1: return locationOf(element, array, comparer, start, pivot);
        case 0: return pivot;
        case 1: return locationOf(element, array, comparer, pivot, end);
    };
}


function defaultComparitor(a,b)
{
    return (a < b ? -1 : (a == b ? 0 : 1));
}


function insertSorted(element, array, comparitor_fn = defaultComparitor) {
    array.splice( locationOf(element, array, comparitor_fn) + 1, 0, element);
    return array;
}
  

var array = [];
var element = 0;


insertSorted(element, array, (a,b) => {
    return ( a > b ? -1 : (a == b ? 0 : 1) );
});

console.log( array );

let obj1 = {
    a: 1,
    b: 2
}

let obj2 = {
    a: 3,
    c: 4
}

console.log({ ...obj2, ...obj1 });
console.log({ ...obj1, ...obj2 });