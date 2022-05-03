
/**
 * 
 * @param {Object} obj object to filter
 * @param {Array} key_arr array of keys to use to filter
 */
function filterByKeys(obj, key_arr)
{
    let ret = {};
    key_arr.forEach( k => {
        if( typeof obj[k] !== "undefined" )
        {
            ret[k] = obj[k];
        }
    })
    return ret;
}


/**
 * 
 * @param {Object} obj object to check
 * @param {String/Array} attr attribute key or array of keys to look for
 * @param {Boolean} failQuietly if set to true no error will be thrown on fail
 * 
 */
function hasParam(obj, attr, failQuietly = false)
{
    if( !Array.isArray(attr) )
    {
        return (typeof obj[attr] !== "undefined");
    }
    else
    {
        for( let i = 0; i < attr.length; i++ )
        {
            if( typeof obj[attr[i]] === "undefined" )
            {
                if (!failQuietly)
                    throw new Error(`object missing attribute ${attr[i]}, ${JSON.stringify(obj, null, 2)}`);
                else
                    return false;
            }
        }
        return true;
    }
}


function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}

const { v4 } = require('uuid');

function fairlyUniqueString() {
    return v4();//(performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
}
/*
function uid() {
    let a = new Uint32Array(3);
    window.crypto.getRandomValues(a);
    return (performance.now().toString(36)+Array.from(a).map(A => A.toString(36)).join("")).replace(/\./g,"");
};
*/

function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}


function makeUniqueID(obj)
{
    let tok = obj.id.split("_u_");
    let base = ( tok.length == 1 ) ? tok : tok[0];
    let newId = base+'_u_'+fairlyUniqueString();
    return newId;
}

function makeChildUniqueIDs(node, old_toplevel_id, new_toplevel_id)
{
    // only update child nodes with ids
    if( typeof node.id !== "undefined" && node.id !== new_toplevel_id ) 
    {
        let tok = node.id.split(old_toplevel_id);
        let tag = ( tok.length == 1 ) ? "-NO_TAG_FOUND" : tok[1];
        node.id = `${new_toplevel_id}${tag}`;
    }

    if( node.hasChildNodes() )
    {
        const child_nodes = node.childNodes;
        for(let i = 0, l = child_nodes.length; i < l; ++i){
            makeChildUniqueIDs(child_nodes[i], old_toplevel_id, new_toplevel_id);
        }
    }
}

function copyObjectAndAddToParent(obj)
{
    let new_node = obj.cloneNode(true);
    new_node.id = makeUniqueID(new_node);
    makeChildUniqueIDs(new_node, obj.id, new_node.id);
  //  console.log("copyObjectAndAddToParent", obj, new_node);
    return obj.parentElement.appendChild(new_node);
}

module.exports = {
    fairlyUniqueString,
    isNumeric,
    hasParam,
    filterByKeys,
    cloneObj,
    makeUniqueID,
    copyObjectAndAddToParent
}



/**
 * unused 
 */

// maybe use arrays instead?
function formatClassArray(classlist)
{
    let classArr = classlist.split(" ");
    if( Array.isArray(classArr) )
        return classArr;
    else
        return [ classArr ];

    /*

    let classArr = attr.value.includes(" ") ? attr.value.split(" ") : attr.value;
    
    if( Array.isArray(classArr) )
    {
        let newClassList = [];
        for( let ii = 0 ; ii < classArr.length; ii++)
        {
            newClassList.push(classArr[ii]);
        }

        return newClassList;
    }
    
    return classArr;
    */
}

function parseStyleString(styleStr)
{
    let chunks = styleStr.split(';').map( tok => tok.trim() );
    chunks = Array.isArray(chunks) ? chunks : [chunks];

    let rules = {};
    chunks.forEach( ruleStr => {
        if( ruleStr != "" )
        {
            let keyval = ruleStr.split(':').map( tok => tok.trim() );

            let val = keyval[1];
            rules[keyval[0]] = isNumeric(val) ? Number(val) : val;
        }
    });
    //console.log('parseStyleString',chunks, '//', rules);
    return rules;
}

function elementToJSON(elm)
{
    if( typeof elm === 'undefined' || elm == document )
        return null;

    if( typeof elm.attributes === 'undefined' )
    {
        if( typeof elm == 'object' )
            return cloneObj(elm); // not sure if this is the right thing yet
        else {
            console.log('->',elm);
            return null;
        }
    }
        
        
    let obj = {};
    obj.type = elm.tagName;
    for( let i = 0, l = elm.attributes.length; i < l; ++i)
    {
        const attr = elm.attributes[i];
        if( attr.specified )
        {
            if( obj.type === 'path' && attr.name === 'd' && attr.value.length > 0 ){    
                //console.log(attr);            
                obj.points = SVGPoints.toPoints({ type: "path", d: attr.value });
            }

            if( attr.name == 'style' )
            {
                obj.style = parseStyleString(attr.value);
            }
            else if( attr.name === "class" )
            {
                obj.class = formatClassArray(attr.value); // removedSymbolistSelected(attr.value);
            }
            else
                obj[attr.name] = (isNumeric(attr.value) ? Number(attr.value) : attr.value);
        }
    }

    if( elm != topContainer )
    {
        let children = [];
        if( elm.hasChildNodes() ){
            const nodes = elm.childNodes;
            for(let i = 0, l = nodes.length; i < l; ++i){
                children.push(  elementToJSON(nodes[i]) ); 
            }
            obj.children = children;
        }
    }

    return obj;
}

