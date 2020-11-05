
function toArray(o)
{
    return Array.isArray(o) ? o : [o];
}
function JSONprint(obj)
{
    return JSON.stringify(obj, null, 2 );
}

function getValObject(obj)
{
    const _obj = Array.isArray(obj) ? obj[0] : obj;

    if( _obj.hasOwnProperty('key') && _obj.hasOwnProperty('val') )
        return _obj.val;
    else
        return _obj;

    
}

function getChildByValue(obj, key, val)
{
//    console.log(`getChildByValue input ${JSONprint(obj)} testing for ${key} == ${val}`);
    
    if( Array.isArray(obj) )
    {
        const len = obj.length;
        for(let i = 0; i < len; i++)
        {
            return getChildByValue(obj[i], key, val);
        }
    }        
    else if( obj.hasOwnProperty(key) && obj[key] == val )
    {
        return obj;
    }
    else
    {
        if( obj.hasOwnProperty('children') )
        {
            let found = null;

            for(let i = 0; i < obj.children.length; i++)
            {
                found = getChildByValue(obj.children[i], key, val);
                if( found != null ){
                    return found;
                }
            }
        }
        else if( obj.hasOwnProperty('key') && obj.hasOwnProperty('val') )
        {
            return getChildByValue(obj.val, key, val);
        }
    }

    return null;
}

function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}

function getCSSFunctionArgs(str, functionname)
{
    const index = str.indexOf(functionname);
    if( index == -1 )
    {
        console.log(`${functionname} function not found in string`);
        return null;
    }

    const sub = str.slice( functionname.length );

    let args = sub.match(/\(\s*([^)]+?)\s*\)/);
    if( args )
    {
        args = args[1].split(/\s*,\s*/);
        args = Array.isArray(args) ? args : [args];
        let fnArgs = args.map( a => ( isNumeric(a) ? Number(a) : a ) );
        return fnArgs;
    }

    console.log(`no args found for function ${functionname}`);

    return null;
      
}

function matrixFromString(matrix_str) 
{    
    return matrix_str.trim().slice( matrix_str.indexOf("matrix(")+7, matrix_str.length-1 )
                            .split(" ")
                            .map(Number)
}
  
function applyTransform( matrix, xy )
{
    return [    matrix[0] * xy[0] + matrix[2] * xy[1] + matrix[4], 
                matrix[1] * xy[0] + matrix[3] * xy[1] + matrix[5]
            ];
}


function make_parms_inputs(dataobj)
{
    let infoBoxChildren = [];
    
   // console.log('make_parms_inputs', JSON.stringify(dataobj));

    Object.keys(dataobj).map(param => {
        
        if( param == 'id' || param == 'class' || param == 'parent')
        {
            infoBoxChildren = infoBoxChildren.concat( [{
                    new : "span",
                    class : "infoparam",
                    text : param
                }, {
                    new : "span",
                    class : "infovalue-noedit",
                    text : dataobj[param]
                }])
        }
        else
        {
            infoBoxChildren = infoBoxChildren.concat( [{
                new : "label",
                class : "infoparam",
                for : dataobj.id+"-"+param+"-input",
                text : param
            }, {
                new : "input",
                class : "infovalue",
                type : "text",
                id : dataobj.id+"-"+param+"-input",
                value : dataobj[param],
                onkeydown : ` if( event.key == 'Enter' ){
                    const viewObj = document.getElementById('${dataobj.id}');
                    symbolist.send( {
                            key: 'symbolistEvent',
                            val: {
                                id: '${dataobj.id}',
                                class: '${dataobj.class}',
                                symbolistAction: 'updateSymbolData',
                                param: '${param}',
                                value: this.value,
                                view_context: symbolist.getObjViewContext(viewObj)
                            }
                    });
                }`,
                onmousedrag : `
                    console.log(event);
                `
            }] )
        }
    });

    return infoBoxChildren;

}


function make_default_infoDisplay(dataobj, bbox)
{
    return {
              key : "html",
              val : {
                  parent : "forms",
                  new : "div",
                  style : {
                      left : bbox.x+"px",
                      top : bbox.bottom+10+"px"
                  },
                  id : dataobj.id+"-infobox",
                  class : "infobox",
                  children : make_parms_inputs(dataobj)
              }
          }
}

/*
function findLoc(el, arr, st, en) { 
    st = st || 0; 
    en = en || arr.length; 
    var pivot = parseInt(st + (en - st) / 2, 10); 
    if (en - st <= 1 || arr[pivot] === el) return pivot; 
    if (arr[pivot] < el) { 
        return findLoc(el, arr, pivot, en); 
    } else { 
        return findLoc(el, arr, st, pivot); 
    } 
} 


function insertSorted(el, arr) { 
    arr.splice(findLoc(el, arr) + 1, 0, el); 
    return arr; 
} 
*/

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

/**
 * 
 * @param {*} element element to insert
 * @param {Array} array array to insert into (modifies array)
 * @param {Function} comparitor_fn function to use for comparison, returing a value of -1, 0, 1 (defaults to increasing numbers)
 */
function insertSorted(element, array, comparitor_fn = defaultComparitor) {
    array.splice( locationOf(element, array, comparitor_fn) + 1, 0, element);
    return array;
}
  


module.exports = {
    matrixFromString,
    getChildByValue,
    applyTransform,
    JSONprint,
    getValObject,
    make_default_infoDisplay,
    getCSSFunctionArgs,
    toArray,
    insertSorted
  }
