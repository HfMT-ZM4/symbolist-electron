
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


module.exports = {
    matrixFromString,
    getChildByValue,
    applyTransform,
    JSONprint,
    getValObject,
    make_default_infoDisplay,
    getCSSFunctionArgs
  }
