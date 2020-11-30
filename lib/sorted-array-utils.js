
/**
 * 
 * @param {*} element element to insert
 * @param {Array} array array to insert into
 * @param {Function} comparitor function to use for comparison, returing a value of -1, 0, 1 
 * @param {index} start (optional) start index, used internally
 * @param {index} end (optional) end index, used internallly
 * 
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

/**
 * 
 * @param {*} element item for insertion
 * @param {Array} array 
 * @param {Function} comparer -- note that element is always the first element in the comparison
 */
function insertIndex(element, array, comparer)
{
    return locationOf(element, array, comparer);
}

function defaultComparitor(a,b)
{
    return (a < b ? -1 : (a == b ? 0 : 1));
}

/**
 *  
 * @param {Array} array array to insert into (modifies array)
 * @param {*} element element to insert
 * @param {Function} comparitor_fn function to use for comparison, returing a value of -1, 0, 1 (defaults to increasing numbers)
 */
function insertSorted(array, element, comparitor_fn = defaultComparitor) {
    array.splice( locationOf(element, array, comparitor_fn) + 1, 0, element);
    return array;
}
 
function insertSortedHTML(collection, element, comparitor_fn)
{
    collection[ locationOf(element, collection, comparitor_fn) ].after( element );   
}


module.exports = { insertSorted, insertSortedHTML, insertIndex }