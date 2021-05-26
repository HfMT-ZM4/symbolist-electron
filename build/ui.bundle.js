/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 964:
/***/ ((module) => {



function make_parms_inputs(element)
{
    // note we can't store the dataobj or element because the instance changes after updating
    let infoBoxChildren = [];
    let id = element.id;
    let dataobj = {
        id,
        class: element.classList[0],
        ...element.dataset
    }
    
   console.log('make_parms_inputs', JSON.stringify(dataobj));

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
                for : id+"-"+param+"-input",
                text : param
            }, {
                new : "input",
                class : "infovalue",
                type : "text",
                id : id+"-"+param+"-input",
                value : dataobj[param],
                onkeydown : (event) => {
                    if( event.key == 'Enter' || event.key == 'Tab' )
                    {
                        const viewObj = document.getElementById(`${id}`);
                        viewObj.dataset[param] = event.target.value;
                        console.log(param, viewObj.dataset[param]);
                        // data is sent to io_controller from here
                        symbolist.callSymbolMethod(viewObj, "updateFromDataset");
                     
                        event.target.blur();
                    }
                    else if( event.key == 'Escape' )
                    {
                        const viewObj = document.getElementById(`${id}`);
                        event.target.value = viewObj.dataset[param];
                        event.target.blur();
                    }
                },
                onblur: (event) => {
                    const viewObj = document.getElementById(`${id}`);
                    if( viewObj.dataset[param] != event.target.value )
                    {
                        viewObj.dataset[param] = event.target.value;
                        // data is sent to io_controller from here
                        symbolist.callSymbolMethod(viewObj, "updateFromDataset");
                    }
                    
                    symbolist.startDefaultEventHandlers();
                },
                onfocus: 'symbolist.stopDefaultEventHandlers()'
            }] )
        }
    });

    return infoBoxChildren;

}

// scroll offset could be abstracted in the ui_controller
// rather than having user scripts need to get the offset 
function defaultInfoDisplay(viewObj, bbox)
{
    return {
              key : "html",
              val : {
                  parent : "floating-forms",
                  new : "div",
                  style : {
                      left : `${bbox.x}px`,
                      top : `${bbox.bottom}px`
                  },
                  id : viewObj.id+"-infobox",
                  class : "infobox",
                  children : make_parms_inputs(viewObj)
              }
          }
}

module.exports = { defaultInfoDisplay }

/***/ }),

/***/ 207:
/***/ ((module) => {

//const d3 = require('d3-selection')


let main = d3.select("#main-html");
let drawing = d3.select("#main-svg"); // svg group drawing layer
let svgObj = d3.select("#svg"); // actual svg
let maindef = d3.select("#defs");
let forms = d3.select("#forms");

/*
main.node().addEventListener("click", (event => {
  ipcRenderer.send('click', "le click")
}));
*/

function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function getBBoxAdjusted(element)
{
    let bbox = cloneObj( element.getBoundingClientRect() );

    const topLeft = svgObj.node().createSVGPoint();
    const bottomRight = svgObj.node().createSVGPoint();

    topLeft.x = bbox.x;
    topLeft.y = bbox.y;
    bottomRight.x = bbox.right;
    bottomRight.y = bbox.bottom;
    
    let xy = topLeft.matrixTransform( drawing.node().getScreenCTM().inverse() );
    let br = bottomRight.matrixTransform( drawing.node().getScreenCTM().inverse() );

    return {
        x: xy.x,
        y: xy.y,
        left: xy.x,
        top: xy.y,
        right: br.x,
        bottom: br.y,
        width: bbox.width,
        height: bbox.height
    }
    
}




function getHTML_element(node)
{

  let el = null;
  let isNew = true;
  if( node.hasOwnProperty('id') )
  {
    el = d3.select(`#${node.id}`);
    isNew = false;
  }

  if( node.hasOwnProperty('new') && typeof node.new != 'undefined')
  {
    if( el !== null){
      el.remove();
    }
      
    el = d3.create(node.new);
    isNew = true;

  }

  return { node: el, new: isNew };

}

function processJSON_HTML_node(node)
{

// handle new nodes and selection if already existing
  let elObj = getHTML_element(node);
  let el = elObj.node;
  let isNew = elObj.new;

  if( el === null ) // not a new node and not found
  {
    console.log("unable to create node", node);
    return { node: el, new: isNew };
  }

  // remove "new" from node?
  for( let prop in node)
  {
    
    if( prop !== 'new' && prop != 'href' && prop != 'timetag' && prop != 'parent' )
    {
      if(prop === "style" )
      {

        let cssnode = node[prop];

        for( let cssprop in cssnode )
        {

          el.node().style[cssprop] = cssnode[cssprop];
      //    console.log("setting", cssprop, cssnode[cssprop]);

        }
        //console.log("style", el.node().style);

      }
      else if( prop === "child" || prop === "children" || prop === "text" || prop === "html"  )
      {
        // case of child node
        // if it's an array, parse for nodes, otherwise, add as text
        if( typeof node[prop] == 'object')
        {

          let childobj = (node[prop].length === undefined) ?  [ node[prop] ] : node[prop];

          // case of child node array
          for( let subnode in childobj )
          {
//              console.log("subnode", subnode);
            if( typeof childobj[subnode] == "object" )
            {

              // recusive child node creation
              let _childnode = ( el.node().tagName === 'svg' ) ? d3_processJSON_SVG_node(childobj[subnode]) : processJSON_HTML_node( childobj[subnode] );
              if( _childnode.node !== null )
              {
                
                let _childID = _childnode.node.id;
                if( _childID )
                {
                  let existing = d3.select(`#${_childID}`);
                  if( existing )
                    existing.remove();
                  
                }

                el.append( ()=>{
                  return _childnode.node;
                });
              }
            }

          }

        }
        else // text element
        {
          el.html( node[prop] );
        }

      }
      else if(prop === 'call' && typeof node[prop] === 'object' )
      {
      
        processMethodCalls( el.node(), node[prop] );            
        
      }
      else if( typeof node[prop] == 'function' )
        el.node()[prop] = node[prop];
      else // regular attribute
        el.attr(prop, node[prop]);

    }

  }

  return { node: el.node(), new: isNew };
}




/*
function loadlistener(event)
{
  let bb = event.target.getBBox();
  TweenMax.set(event.target, {x: oldx - bb.x, y: oldy - bb.y} );
  el.node().classList.remove("invisible");
  event.target.removeEventListener(loadlistener);
}
*/

function href_handler(node, el)
{

  const el_type = el.node().nodeName;

  if( el_type === 'use' )
  {
    if( typeof node.href == 'object' && node.href.length === 2 )
    {
      //let frag = document.createDocumentFragment();

      el.attr('xlink:href', node.href[0] );

      if( node.href[1] != 0 )
      {

        let oldx = ( node.x !== undefined ) ? node.x : 0;
        let oldy = ( node.y !== undefined ) ? node.y : 0;

        el.node().classList.add("invisible");

        el.attr('x', 0)
          .attr('y', 0);

        let retries = 100;

        let fix_position = () => { //timestamp
          let bb = el.node().getBBox();
          if( bb.width === 0 && retries-- > 0){
//              console.log('retrying');
            window.requestAnimationFrame(fix_position);
          }
          else
          {
            if( retries <= 0 )
              console.log("retry timeout", retries);
/*
            console.log(node.href[0], "bbox y h", bb.y, bb.height);
            console.log( "client rect", el.node().getBoundingClientRect() );
*/            
            TweenMax.set(el.node(), {x: oldx - bb.x, y: oldy - bb.y, width: bb.width, height: bb.height} );
            el.node().classList.remove("invisible");
          }
        };
        
        window.requestAnimationFrame( fix_position );

      }
    }
    else
    {
      el.attr('xlink:href', node.href);
    }

  }
  else if ( el_type === 'image' )
  {
//    let extension = node.href.substr( node.href.lastIndexOf('.') + 1 )

    let uniqueImgSrc = node.href+"?"+(new Date()).getTime();


    if( node.hasOwnProperty('width') && node.hasOwnProperty('height') )
    {
      el.attr("xlink:href", uniqueImgSrc);
    }
    else
    {
      let w =  node.hasOwnProperty('width') ? node.width : 0;
      let h =  node.hasOwnProperty('height') ? node.height : 0;

      el.attr('width', 100)
        .attr('height', 100)
        .attr("xlink:href", uniqueImgSrc);

      let image = new Image();
      
      image.addEventListener('load', function() {
        if( !w && !h)
        {
          w = this.naturalWidth;
          h = this.naturalHeight;
        }
        else if( !h )
        {
          h = (w / this.naturalWidth) * this.naturalHeight;
        }
        else if( !w )
        {
          w = (h / this.naturalHeight) * this.naturalWidth;
        }

        el.attr('width', w )
          .attr('height', h );
      });

      image.src = uniqueImgSrc;


    }

    

  }

}

function d3_getElement(node)
{

  // note: worth testing, but it might be faster to always create a new node and swap it out?
  // or maybe do some fastDOM stuff, to avoid window update thrashing/reflow

  // note also here we're ignoring the id stack storage... seems kind of ok actually

  // added isNew to keep objects in order based on their creation not their adjustment sequence
  //console.log("new node", node );


  let el = null;
  let isNew = true;
  if( node.hasOwnProperty('id') )
  {
    el = d3.select(`#${node.id}`);
    isNew = false;
  }

// new tag means "make a new svg node"
  if( node.hasOwnProperty('new') && typeof node.new != 'undefined' )
  {
    if( el !== null){
    //  console.log("should delete", el.node());
      el.remove();
      //console.log(" delete?", el.node());
    }
      
    if( node.new.indexOf("html:") == 0 )
    {
      el = d3.create( node.new.slice(4) );
    }
    else
      el = d3.create(`svg:${node.new}`);

    isNew = true; // << can be new even if there's no id

  }

  return { node: el, new: isNew };

}

function d3_processJSON_SVG_node(node)
{

  // handle new nodes and selection if already existing
    let elObj = d3_getElement(node);
    let el = elObj.node;
    let isNew = elObj.new;

    if( el === null ) // not a new node and not found
    {
      console.log("unable to create node", node);
      return { node: el, new: isNew };
    }

    // remove "new" from node?
    for( let prop in node)
    {
      if( prop !== 'new' && prop != 'href' && prop != 'timetag' && prop != 'parent' )
      {
        if(prop === "style" )
        {

          let cssnode = node[prop];
          for( let cssprop in cssnode )
          {
  //          console.log("prop", cssprop);

            el.style(cssprop, cssnode[cssprop]);
          }
        }
        else if( prop === "points" && Array.isArray(node.points) ) // must be an array (i.e. more than one point)
        {
         // console.log('drawsocket', node.points);
          el.attr('d',  SVGPoints.toPath(node.points));
        }
        else if( prop === "child" || prop === "children" || prop === "text" || prop === "html")
        {
          // case of child node
          // if it's an array, parse for nodes, otherwise, add as text
          /**
           *  --> no longer supporting child arrays directly here
           * nested object need to be set via the /parent tag
           * 
           * */
          if( typeof node[prop] == 'object')
          {

            let childobj = (node[prop].length === undefined) ?  [ node[prop] ] : node[prop];

            // case of child node array
            for( let subnode in childobj )
            {
//              console.log("subnode", subnode);
              if( typeof childobj[subnode] == "object" )
              {
                // recusive child node creation
                let _childnode = d3_processJSON_SVG_node( childobj[subnode] );
                if( _childnode.node !== null )
                {
                
                  let _childID = _childnode.node.id;
                  if( _childID )
                  {
                    let existing = d3.select(`#${_childID}`);
                    if( existing )
                      existing.remove();
                    
                  }
                    
                  el.append( ()=>{
                    return _childnode.node;
                  });
                }
              }

            }

          }
          else // text element
          {
            el.html( node[prop] );
          }

        }
        else if( typeof node[prop] == 'function' )
        {
          //el.node().setAttributeNS(null, prop, node[prop] );
          el.node()[prop] = node[prop]
         // console.log('setting function', el.node(), el.node()[prop]);

        }
        else if( typeof node[prop] == "object")
        {
          let node_prop = node[prop];
          if( node_prop.hasOwnProperty("selector") )
          {
            let rel_el = document.querySelector(node_prop.selector);
            if( !rel_el )
            {
              console.error("couldn't find element at selector", node_prop.selector);
            }

            if( node_prop.hasOwnProperty("coord") )
            {
              //let bbox = rel_el.getBoundingClientRect();
              let bbox = getBBoxAdjusted(rel_el);

              let coord;
              if( node_prop.coord == "cx" )
              {
                coord = bbox.x + (bbox.width * 0.5);
              }
              else if( node_prop.coord == "cy" )
              {
                coord = bbox.y + (bbox.height * 0.5);
              }
              else
              {
                coord = bbox[node_prop.coord];
              }

              el.attr(prop, coord );
            }
            else if( node_prop.hasOwnProperty("attr") )
            {
              el.attr(prop, rel_el.getAttribute(node_prop.attr) )
            }
            

          }
        }
        else // regular attribute
          el.attr(prop, node[prop]);

      }

    }

    // href special case
    if( node.hasOwnProperty('href') )
    {
      href_handler(node, el);
    }


  return { node: el.node(), new: isNew };
}

function iterate_HTML_array(_objarr, _type)
  {

    //console.log(_objarr, Object.keys(_objarr), _type);

    for(let node of _objarr)
    { 
      //console.log('node', node);
      
      let _newnodeObj = null;
      
      if(_type === "svg")
        _newnodeObj = d3_processJSON_SVG_node(node);
      else if( _type === 'html')
        _newnodeObj = processJSON_HTML_node(node);

      let _newnode = _newnodeObj.node;
      let _isNew = _newnodeObj.new;

      if( _newnode !== null )
      {

        /**
         * relativeTo : {
         *  selector : "#foo",
         *  point : "center" (top, bottom, left, right, center)
         * }
         */
        if( node.hasOwnProperty('relativeTo')  )
        {
          let selector = null;
          let rel_pt = { x: "x", y: "y" };

          if( typeof node.relativeTo == "object" )
          {
            let rel_set = node.relativeTo;
            selector = rel_set.selector;
            if( rel_set.hasOwnProperty('anchor_x') )
            {
              rel_pt.x = rel_set.anchor_x;
            }
            if( rel_set.hasOwnProperty('anchor_y') )
            {
              rel_pt.y = rel_set.anchor_y;
            }

          }
          else
          {
            selector = node.relativeTo;
          }
          
          let relObj = document.querySelector(selector);
         // console.log(node.relativeTo, selector, relObj);
          let rel_BB = getBBoxAdjusted(relObj);

          let offsetX = rel_pt.x == "cx" ? rel_BB.x + (rel_BB.width * 0.5) : rel_BB[rel_pt.x];
          let offsetY = rel_pt.y == "cy" ? rel_BB.y + (rel_BB.height * 0.5) : rel_BB[rel_pt.y];

          TweenMax.set(_newnode, { x: `+= ${offsetX}`, y: `+= ${offsetY}` })
        }
  /*
        if( typeof _newnode.id == 'undefined' )
        {
          _newnode.id = ts.now();
        }
  */
        if( _isNew )
        {

          let _context = null;
          if( node.hasOwnProperty('parent') )
          {
            _context = d3.select(`#${node.parent}`);
            //console.log("found parent context ", node.parent);
            
          }
          else if( node.hasOwnProperty('container') )
          {
            _context = d3.select(`#${node.container}`);          
          }
          
          if( !_context )
          {
            _context = _type === "svg" ? drawing : main;
          }

          _context.append( ()=> {
            return _newnode;
          });

        }

      }
    }
  }

function drawsocket_input(obj)
{
  //  const keys = Object.keys(obj);
    // console.log("keys", keys);
    let iter_obj_arr;

    let toplevel_timetag;
    if( !Array.isArray(obj) )
    {
      iter_obj_arr = obj.hasOwnProperty('obj_arr') ? obj.obj_arr : [ obj ];
    }
    else
      iter_obj_arr = obj;
    

  //console.log('iter_obj_arr', iter_obj_arr);

    let wasHandled = true;

    for( let i = 0; i < iter_obj_arr.length; i++ )  
    {
      const key = iter_obj_arr[i].key;
      const objValue =  iter_obj_arr[i].val;

      let _objarr = !Array.isArray(objValue) ?  [ objValue ] : objValue;

      // first level command switch
      switch (key)
      {
        case "svg":
            iterate_HTML_array(_objarr, 'svg');
        break;

        case "html":
          iterate_HTML_array(_objarr, 'html');
        break;

        case "remove":
          for( let _clear of _objarr )
          {
            d3.select("#"+_clear).remove();
          }
        break;
        case "clear":
            if( _objarr[0] == 1 || _objarr[0] == "*" || _objarr[0] == "all" ) // clear : 1
            {
              
              drawing.selectAll("*").remove();
              maindef.selectAll("*").remove();
              main.selectAll("*").remove();
              forms.selectAll("*").remove();
  
              ongoingTouches = [];
  
              //clearCSS();
              //clearAnim();
              //clearPDF();
              //clearSound();
            }
            else
            {
              for( let _clear of _objarr )
              {
                switch( _clear )
                {
                  case "svg":
                    drawing.selectAll("*").remove();
                  break;
  
                  case "html":
                    main.selectAll("*").remove();
                  break;
  /*
                  case "css":
                    clearCSS();
                  break;
  
                  case "tween":
                  case "tweens":
                    clearAnim();
                  break;
  
                  case "pdf":
                    clearPDF();
                  break;
  */
                  
                  default:
                  {
                    let parent = d3.select(`#${_clear}`).node();
//                    console.log("select and remove", _clear, parent);
  
                    while( parent.firstChild )
                    {
                      parent.firstChild.remove();
                    }
                  }
                  break;
                }
              }
            }
            break;
        default:
            console.log("unrouted command key:", key, objValue );
            wasHandled = false;
        break;
      }

    }
  }


module.exports = {
   input: drawsocket_input
}


/***/ }),

/***/ 404:
/***/ ((module) => {

const names_lower = ["c",   "c#",   "db",   "d",    "d#",   "eb",   "e",    "f",    "f#",   "gb",   "g",    "g#",   "ab",   "a",    "a#",   "bb",   "b" ];
const names_step =  [ 0,    1,      1,      2,      3,      3,      4,      5,      6,      6,      7,      8,      8,      9,      10,     10,     11];

const names_lower_flats = (/* unused pure expression or super */ null && (["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b" ]));
const names_lower_sharps = ["c", "c#","d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ];


let nameStep = new Map();
let stepName = new Map();

for( let i = 0; i < names_step.length; i++)
{
    nameStep.set(names_lower[i], names_step[i]);    
    stepName.set(names_step[i], names_lower[i]);    
}


function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}

/**
 * 
 * @param {String} note note string
 */
function ntom(note)
{
    if( typeof note == "string")
    {
        const len = note.length;
    
        let oct_start = null, cent_start = null;
        for( let i = 0; i < len; i++)
        {
            if( isNumeric(note[i]) && !oct_start )
            {
                oct_start = i;
            }
            else if( (note[i] == '-' )|| (note[i] == '+') )
            {
                cent_start = i;
            }
        }

        const noteName = note.slice(0, oct_start);

        let oct, cents = 0;
        if( cent_start )
        {
            oct = Number(note.slice(oct_start, cent_start));
            cents = Number(note.substr(cent_start));
        }
        else
        {
            oct = Number(note.substr(oct_start));
        }
        
        let step = nameStep.get(noteName);
    
       // console.log(noteName, step, (12 * (oct + 1)), step + (12 * (oct + 1)) );

        return step + (12 * (oct + 1)) + (cents * 0.01);
    }
}

function mton(midi)
{
    let chroma = midi % 12.;
    let floorChroma = Math.floor(chroma);
    let cents = chroma - floorChroma;
    let oct = 0, step = 0;

    if( cents >= 0.5 )
    {
        step = (floorChroma + 1) % 12;
        oct = Math.floor( (floorChroma + 1) / 12 );
        cents = '-' + Math.round(100. * (1 - cents));
    }
    else
    {
        step = floorChroma;
        cents = '+' + Math.round(100. * cents);
    }

    oct += Math.floor( midi / 12 ) - 1;

    return ( cents != 0 ? 
                names_lower_sharps[step] + String(oct) + cents : 
                names_lower_sharps[step] + String(oct) 
            );
    
}

/**
 * 
 * @param {String} ratio ratio, e.g. 2/3
 */
function ratio2float(ratio)
{
    const divIdx = ratio.indexOf('/');
    return Number(ratio.slice(0, divIdx)) / Number(ratio.substr(divIdx+1));
}


function parseRatioStr(ratioStr)
{
    const divIdx = ratioStr.indexOf('/');
    return[ Number(ratioStr.slice(0, divIdx)), Number(ratioStr.substr(divIdx+1)) ];
}

/**
 * 
 * @param {String} ratio ratio, e.g. 2/3
 */
function reduceRatio(ratio)
{
    const divIdx = ratio.indexOf('/');
    const num = Number(ratio.slice(0, divIdx));
    const den = Number(ratio.substr(divIdx+1));

    const divisor = gcd(num, den);
    return [ num/divisor, den/divisor ];
}


function mtof(midi, a4 = 440)
{
    return a4 * Math.pow(2., ( midi - 69) / 12 )
}

function ftom(hz, a4 = 440)
{
    return 69. + 17.31234050465299 * Math.log( hz / a4 );
}

function test()
{
    let test = 'a4-14';
    let test2 = 'bb4+31';
    let test3 = 'bb4';
    
    console.log(ntom(test));
    console.log(ntom(test2));
    console.log(ntom(test3));

    console.log( mton(ntom(test)));
    console.log( mton(ntom(test2)));
    console.log( mton(ntom(test3)));
 
    console.log( ratio2float("12/33") );

}

/**
 * 
 * @param {Number} a numerator
 * @param {Number} b denominator
 */
function gcd(a, b) {
    // fast GCD aka Binary GCD
    if (a === 0) return b;
    if (b === 0) return a;
    if (a === b) return a;
    // remove even divisors
    var sa = 0;
    while (!(a & 1)) sa++, a >>= 1;
    var sb = 0;
    while (!(b & 1)) sb++, b >>= 1;
    var p = sa < sb ? sa : sb; // Power part of 2^p Common Divisor
    // euclidean algorithm: limited only odd numbers
    while (a !== b) {// both a and b should be odd
        if (b > a) {var t = a; a = b; b = t;} // swap as a > b
        a -= b; // a is even because of odd - odd
        do a >>= 1; while (!(a & 1)); // a become odd
    }
    return a << p; // Odd-Common-Divisor * 2^p
}

const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

function getFactors(num) {
    const isEven = num % 2 === 0;
    let inc = isEven ? 1 : 2;
    let factors = []; // 1, num
  
    for (let curFactor = isEven ? 2 : 3; Math.pow(curFactor, 2) <= num; curFactor += inc) 
    {
      if (num % curFactor !== 0) continue;
      factors.push(curFactor);
      let compliment = num / curFactor;
      if (compliment !== curFactor) factors.push(compliment);
    }
  
    return factors.sort((a,b) => a - b);
}

function getAllFactorsFor(remainder) {
    var factors = [], i;

    for (i = 2; i <= remainder; i++) {
        while ((remainder % i) === 0) {
            factors.push(i);
            remainder /= i;
        }
    }

    return factors;
}


function getPrimeCoefs(n, limit = 13)
{
    let factors = getAllFactorsFor(n);

    let primeCoefs = {};

    factors.forEach( f => {
        if( f <= limit )
        {
            if( primeCoefs.hasOwnProperty(f) )
            {
                primeCoefs[f]++;
            }
            else
            {
                primeCoefs[f] = 1;
            }
        }
    })

    return primeCoefs;

}

function getRatioPrimeCoefs( num, den, limit = 13)
{

    let numPrimes = getPrimeCoefs(num);
    let denPrimes = getPrimeCoefs(den);

    Object.keys(denPrimes).forEach( p => {
        if( typeof numPrimes[p] !== 'undefined' )
        {
            numPrimes[p]--;
            denPrimes[p]--;

            if( numPrimes[p] == 0 )
                delete numPrimes[p];
            
            if( denPrimes[p] == 0 )
                delete denPrimes[p];

        }
    });

    return {
        num: numPrimes,
        den: denPrimes
    }
}

//console.log( getRatioPrimeCoefs(3*5*5, 8) );


//test();

module.exports = {
    ntom,
    mton,
    mtof,
    ftom,
    ratio2float,
    gcd,
    parseRatioStr,
    reduceRatio,
    getRatioPrimeCoefs
}

/***/ }),

/***/ 944:
/***/ ((module) => {


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

/***/ }),

/***/ 876:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const svgObj = document.getElementById("svg");
const mainSVG = document.getElementById("main-svg");

const { cloneObj } = __webpack_require__(633);

// try : getIntersectionList()
function hitTest(regionRect, obj)
{
    const objBBox = obj.getBoundingClientRect();

    return  !(objBBox.left  > regionRect.right ||
             objBBox.top    > regionRect.bottom ||
             objBBox.right  < regionRect.left || 
             objBBox.bottom < regionRect.top );

}

function recursiveHitTest(region, element)
{

    if( hitTest(region, element) )
        return true;

    for (let i = 0; i < element.children.length; i++) 
    {
        if( recursiveHitTest(region, element.children[i]) )
            return true;
        
           // console.log(element.children[i].tagName);
    }

    return false;
}



function deltaPt(ptA, ptB)
{
    return { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
}



function getSVGCoordsFromEvent(event)
{
    let pt = svgObj.createSVGPoint();
    pt.x = event.pageX;
    pt.y = event.pageY;
    let newPt = pt.matrixTransform( mainSVG.getScreenCTM().inverse() );
    return {
        x: newPt.x,
        y: newPt.y
    }; 
}

function getBBoxAdjusted(element)
{
    let bbox = cloneObj( element.getBoundingClientRect() );

    const topLeft = svgObj.createSVGPoint();
    const bottomRight = svgObj.createSVGPoint();

    topLeft.x = bbox.x;
    topLeft.y = bbox.y;
    bottomRight.x = bbox.right;
    bottomRight.y = bbox.bottom;
    
    let xy = topLeft.matrixTransform( mainSVG.getScreenCTM().inverse() );
    let br = bottomRight.matrixTransform( mainSVG.getScreenCTM().inverse() );

    return {
        x: xy.x,
        y: xy.y,
        left: xy.x,
        top: xy.y,
        right: br.x,
        bottom: br.y,
        width: bbox.width,
        height: bbox.height
    }
    
}


function transformPoint(matrix, pt)
{  
    return { 
        x: matrix.a * pt.x + matrix.c * pt.y + matrix.e, 
        y: matrix.b * pt.x + matrix.d * pt.y + matrix.f
    }   
}


function getComputedMatrix(element)
{
    const style = window.getComputedStyle(element)
    const matrix = new WebKitCSSMatrix( style.transform );
   // console.log('getComputedMatrix ', style.transform );

    let svgMatrix = svgObj.createSVGMatrix();

    svgMatrix.a = matrix.a;
    svgMatrix.b = matrix.b;
    svgMatrix.c = matrix.c;
    svgMatrix.d = matrix.d;
    svgMatrix.e = matrix.e;
    svgMatrix.f = matrix.f;

  //  console.log('getComputedMatrix ', element, matrix, svgMatrix);

    return svgMatrix;


   /*
    const transform = style.transform;

    // if not a matrix we're in trouble

  // Can either be 2d or 3d transform
    const matrixType = transform.includes('3d') ? '3d' : '2d'
    let matrixValues = transform.match(/matrix.*\((.+)\)/)[1].split(', ').map( v => parseFloat(v) );

    console.log(matrixValues);

    let svgMatrix = mainSVG.getScreenCTM();
    let adjustedMatrix = matrix.multiply( svgMatrix.inverse() );
*/

}

/**
 * 
 * @param {Object} obj element to transform
 * @param {Object} matrix transform matrix, if undefined gets computed transform matrix of element
 * 
 * the function gets the tranformation matrix and adjusts the SVG parameters to the desired values
 * 
 * transform matrix is in SVG coordinates, before scalling and scrolling of main view
 * 
 */
function applyTransform(obj, matrix = null)
{    
    if( !matrix )
        matrix = getComputedMatrix(obj);

    // using svgPoint so we can use the matrixTransform function
    let pt = svgObj.createSVGPoint();

// add scaling eventually
    switch ( obj.tagName )
    {
        case "g":
            {
                obj.childNodes.forEach(node => {
                    applyTransform(node, matrix);
                });
            }
            break;
        case "circle":
            {
                pt.x = obj.getAttribute("cx");
                pt.y = obj.getAttribute("cy");
                let newPt = pt.matrixTransform(matrix);
                obj.setAttribute("cx", newPt.x );
                obj.setAttribute("cy", newPt.y );
            }
            break;
        case "rect":
            {
                // note that SVG rectangles can't be rotated
                // if we need rotation, the rotation has to be part of the user script
                // or make it a path instead
                pt.x = obj.getAttribute("x");
                pt.y = obj.getAttribute("y");
                let newPt = pt.matrixTransform(matrix);
                obj.setAttribute("x", newPt.x );
                obj.setAttribute("y", newPt.y );
            }
            break;
        case "text":
            {
                pt.x = obj.getAttribute("x");
                pt.y = obj.getAttribute("y");
                let newPt = pt.matrixTransform(matrix);
                obj.setAttribute("x", newPt.x );
                obj.setAttribute("y", newPt.y );
            }
            break;
        case "line":
            {
                pt.x = obj.getAttribute("x1");
                pt.y = obj.getAttribute("y1");
                let newPt = pt.matrixTransform(matrix);
                obj.setAttribute("x1", newPt.x );
                obj.setAttribute("y1", newPt.y );

                pt.x = obj.getAttribute("x2");
                pt.y = obj.getAttribute("y2");
                let newPt2 = pt.matrixTransform(matrix);
                obj.setAttribute("x2", newPt2.x );
                obj.setAttribute("y2", newPt2.y );
            }
            break;
        case "path":
            let d = obj.getAttribute('d');
            let points = SVGPoints.toPoints({
                type: 'path',
                d: d
              });

            let adjusted = Points.offset(points, matrix.e, matrix.f );
            /*
            let adjusted = points.map( p => {
                pt.x = p.x;
                pt.y = p.y;
                // check for curve also...
                let newPt = pt.matrixTransform(matrix);

                return {
                    ...p,
                    x: newPt.x,
                    y: newPt.y
                }
            })
            */
         //   console.log("points", points, adjusted, SVGPoints.toPath(adjusted) );
            obj.setAttribute('d', SVGPoints.toPath(adjusted) );
            break;
        case "foreignObject":
            pt.x = obj.getAttribute("x");
            pt.y = obj.getAttribute("y");
            let newPt = pt.matrixTransform(matrix);
            obj.setAttribute("x", newPt.x );
            obj.setAttribute("y", newPt.y );
            break;
        default:
            break;
    }

    if( obj.hasAttribute('transform'))
        obj.removeAttribute('transform');
    
    if( obj.dataset.svgOrigin )
        delete obj.dataset.svgOrigin;
}


function rotate(obj, mouse_pos)
{

//     var scaleX = 2;
// var scaleY = 3;
// var translateX = 12;
// var translateY = 8;
// var angle = Math.PI / 2;
// var matrix = new DOMMatrix([
//   Math.sin(angle) * scaleX,
//   Math.cos(angle) * scaleX,
//   -Math.sin(angle) * scaleY,
//   Math.cos(angle) * scaleY,
//   translateX,
//   translateY
// ]);

    if( !obj )
        return;

//    let svg = document.getElementById("svg");
    if( obj === svgObj )
        return;
    
    let bbox = clickedObjBoundsPreTransform;    
    let cx = bbox.x + (bbox.width / 2);
    let cy = bbox.y + (bbox.height / 2);

    //let dx = mouse_pos.x - cx;
    //let dy =  mouse_pos.y - cy;
    let azim = Math.atan2( mouse_pos.x - cx, mouse_pos.y - cy );

//    console.log(cx, cy, mouse_pos.x - cx, mouse_pos.y - cy);

    let transformlist = obj.transform.baseVal; 

    //var translate1 = svgObj.createSVGTransform();
    //translate.setTranslate(-cx, -cy);

    var rotate = svgObj.createSVGTransform();
    rotate.setRotate(azim / -Math.PI * 180.0, cx, cy )

    //var translate2 = svgObj.createSVGTransform();
    //translate.setTranslate(cx, cy);

    //let matrix = svgObj.getCTM();
/*
    matrix = matrixTranslate(matrix, -cx, -cy);
    matrix = matrixRotate(matrix, azim);
    matrix = matrixTranslate(matrix, cx, cy);

    //matrix = matrix.rotate(azim, mouse_pos.x - cx, mouse_pos.y - cy)
    console.log(matrix);
*/
    /*
    matrix = matrix.translate(-cx, -cy);
    matrix = matrix.rotate(azim);
    matrix = matrix.translate(cx, cy);
    */
    /*
    matrix.a = Math.sin(azim);
    matrix.c = Math.cos(azim);
    matrix.b = -Math.sin(azim); 
    matrix.d = Math.cos(azim);
    matrix.e = cx - matrix.a * cx - matrix.c * cy;
    matrix.f = cy - matrix.b * cx - matrix.d * cy;
*/
    const transformMatrix = svgObj.createSVGTransformFromMatrix(rotate.matrix);
    transformlist.initialize( transformMatrix );
    console.log(transformMatrix);
}



function makeRelative(obj, container)
{
    let containerBBox = container.getBoundingClientRect();

    // assumes that the translation has been applied already
    let matrix = obj.getScreenCTM();
    matrix.e = -containerBBox.x;
    matrix.f = -containerBBox.y;

    applyTransform(obj, matrix);

}



module.exports = {
    hitTest,
    recursiveHitTest,
    deltaPt,
    getSVGCoordsFromEvent,
    transformPoint,
    getComputedMatrix,
    getBBoxAdjusted,
    applyTransform,
    rotate,
    makeRelative
}

/***/ }),

/***/ 633:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


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

const { v4 } = __webpack_require__(614);

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


function copyObjectAndAddToParent(obj)
{
    let new_node = obj.cloneNode(true);
    new_node.id = makeUniqueID(obj);
    console.log("copyObjectAndAddToParent", obj, new_node);
    return obj.parentElement.appendChild(new_node);
}


function makeUniqueID(obj)
{
    let tok = obj.id.split("_u_");
    let base = ( tok.length == 1 ) ? tok : tok[0];
    let newId = base+'_u_'+fairlyUniqueString();
    return newId;
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



/***/ }),

/***/ 614:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NIL": () => (/* reexport */ nil),
  "parse": () => (/* reexport */ esm_browser_parse),
  "stringify": () => (/* reexport */ esm_browser_stringify),
  "v1": () => (/* reexport */ esm_browser_v1),
  "v3": () => (/* reexport */ esm_browser_v3),
  "v4": () => (/* reexport */ esm_browser_v4),
  "v5": () => (/* reexport */ esm_browser_v5),
  "validate": () => (/* reexport */ esm_browser_validate),
  "version": () => (/* reexport */ esm_browser_version)
});

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ const esm_browser_validate = (validate);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || esm_browser_stringify(b);
}

/* harmony default export */ const esm_browser_v1 = (v1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/parse.js


function parse(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const esm_browser_parse = (parse);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v35.js



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = esm_browser_parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return esm_browser_stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/md5.js
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const esm_browser_md5 = (md5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v3.js


var v3 = v35('v3', 0x30, esm_browser_md5);
/* harmony default export */ const esm_browser_v3 = (v3);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/sha1.js
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const esm_browser_sha1 = (sha1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v5.js


var v5 = v35('v5', 0x50, esm_browser_sha1);
/* harmony default export */ const esm_browser_v5 = (v5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/nil.js
/* harmony default export */ const nil = ('00000000-0000-0000-0000-000000000000');
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/version.js


function version(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const esm_browser_version = (version);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/index.js










/***/ }),

/***/ 216:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* global drawsocket:readonly  */

if( window.uiDefs == "undefined"){
    window.uiDefs = new Map();
}

if( typeof window.initDef == "undefined" ){
    window.initDef = {};
}




//let uiDefs = window.uiDefs;
//let initDef = window.initDef;

let post = console.log;
let outlet = (msg) => { };
let io_send = (msg) => console.error("not sending to io", msg);


if( typeof window.max !== "undefined")
{
    window.max.bindInlet('input', (msg) => {
        console.log(msg);
        try {
          let obj = JSON.parse(msg);
          input(obj);

        }
        catch(err)
        {
            console.error(err);
        }
    });

    post = (msg) => window.max.outlet("post", JSON.stringify(msg));
    outlet = (msg) => window.max.outlet("outlet", JSON.stringify(msg));
    io_send = (msg) => window.max.outlet("io_controller", JSON.stringify(msg));

}
else if( typeof window.electron != 'undefined')
{
    io_send = msg => window.electron.io_send(msg);
    window.electron.set_receiver_fn( (msg) => {
        console.log('callback received', msg); 
        input(msg);
     });
}

let params = {
    io_send: "default",
    post: "default",
    outlet: "default",
    dirname: "default",
    max: false
}
 
 const init = function(obj) {
     
     params = {
         ...params,
         ...obj
     }
 
     if( params.post != "default" )
     {
         post = params.post;
     }
 
     if( params.outlet != "default" )
     {
         outlet = params.outlet;
     }
 
     if( params.io_send != "default" )
     {
         console.log('setting io', params)
         io_send = params.io_send;
     }
 
     if( params.dirname != "default" )
     {
         window.__symbolist_dirname = params.__dirname;
     }
 
 }
 

/**
 * symbolist renderer view module -- exported functions are at the the bottom
 */

const { defaultInfoDisplay } = __webpack_require__(964)

const { insertSorted, insertSortedHTML, insertIndex } = __webpack_require__(944)

const { ntom, mton, ftom, mtof, ratio2float, parseRatioStr, reduceRatio, getRatioPrimeCoefs } = __webpack_require__(404)

const {
    fairlyUniqueString,
    isNumeric,
    hasParam,
    filterByKeys,
    cloneObj,
    makeUniqueID,
    copyObjectAndAddToParent
} = __webpack_require__(633);

const {
    hitTest,
    recursiveHitTest,
    deltaPt,
    getSVGCoordsFromEvent,
    transformPoint,
    getComputedMatrix,
    getBBoxAdjusted,
    applyTransform,
    rotate,
    makeRelative
} = __webpack_require__(876);


const svgObj = document.getElementById("svg");
const mainSVG = document.getElementById("main-svg");



/**
 * globals
 */
 const mainHTML = document.getElementById("main-html");
 const topContainer = document.getElementById('top-svg');
 const mainDiv = document.getElementById("main-div");
 const floatingForms = document.getElementById('floating-forms');
 
 const overlay = document.getElementById('symbolist_overlay');
 
 let symbolist_log = document.getElementById("symbolist_log");;
 
 let clickedObj = null;
 let clickedObjBoundsPreTransform = null;
 let prevEventTarget = null;
 let selected = [];
 let selectedCopy = [];
 
 let mousedown_pos = svgObj.createSVGPoint();
 let mousedown_page_pos = svgObj.createSVGPoint();
 let mouse_pos = svgObj.createSVGPoint();
 let mouse_page_pos = svgObj.createSVGPoint();
 
 let scrollOffset = {x: 0, y: 0};
 let m_scale = 1;
 let default_zoom_step = 0.1;
 
 let currentContext = topContainer;
 let currentPaletteClass =  "";
 
 let selectedClass = currentPaletteClass;
 
 //if( typeof window.initDef == "undefined" )
 //    let initDef;
 
 
 
 let currentMode = "palette";

 
/**
 * uiDefs stores UI defs in flat array, lookup by classname
 * 
 * definitions have a palette array that stores the classNames of potential child types
 *  */ 


// API




/**
 * 
 * @param {Object} obj element to translate
 * @param {Object} delta_pos point {x,y} of translation delta from the object attribute settings
 * 
 * function applies transaltion and updates position of object, via transform without updating SVG attributes
 * this is done via the transform list since it works on the top level <g> object
 * 
 * once the transformation is complete, it should be applied to the child objects so that the mapping works more easiy in the controller
 * 
 * 
 *  */
function translate(obj, delta_pos)
{
    if( !obj )
        return;

//    let svg = document.getElementById("svg");
    if( obj === topContainer )
        return;
    
    gsap.set(obj, delta_pos);

/*
    return;

    let transformlist = obj.transform.baseVal; 

    let matrix = svgObj.createSVGMatrix();//obj.getScreenCTM().multiply( mainSVG.getScreenCTM().inverse() );
    // delta position is prescaled in svg coordinates
    // keep scale/rotation transform as is 
    matrix.e = delta_pos.x;
    matrix.f = delta_pos.y;

    

    //let translation_ = svgObj.createSVGTransform();
    //translation_.setTranslate( delta_pos.x,  delta_pos.y );
    
    const transformMatrix = svgObj.createSVGTransformFromMatrix(matrix);
    transformlist.initialize( transformMatrix );

    //transformlist.insertItemBefore(translation_, 1);
*/
}

/*
function translate_selected(delta_pos)
{
    for( let i = 0; i < selected.length; i++)
    {
       
        if( !callSymbolMethod(selected[i], "translate", delta_pos))
        {
            translate(selected[i], delta_pos);
        }
    }
}
*/



/**
 * iterates to top level element from child
 * @param {target element} elm 
 */

function getTopLevel(elm)
{    
    if( elm == topContainer )
        return elm;
    else    
    {

        return elm.closest(".symbol");

        /*
        // should return only the first layer of objects within the current context
        // mabye we need to set the default context with current_context?
        let ret = elm.closest(".symbol");
        while ( !ret.parentNode.closest(".symbol").classList.includes('.current_context') ) 
        {
            ret = parentNode;
        }

        return ret;
        */
    }

/*
    while(  elm != svgObj && 
            elm.parentNode && 
            elm.parentNode.id != 'main-svg' && 
            elm.parentNode.id != 'palette' && 
            ( currentContext != svgObj ? !elm.parentNode.classList.contains('stave_content') : 1 ) ) 
    {
        elm = elm.parentNode;
    }

   return elm;
   */
}




/*
function symbolost_sendKeyEvent(event, caller)
{
    if( typeof event.symbolistAction === 'undefined' )
    {
        console.log('undefined key action');
        return;
    }
    
    let sel_arr = [];
    for( let i = 0; i < selected.length; i++)
    {
        let _jsonEl = elementToJSON( selected[i]);
        _jsonEl.bbox = cloneObj(selected[i].getBoundingClientRect());
        sel_arr.push( _jsonEl );
    }

    let _jsonContext = elementToJSON( currentContext );
    _jsonContext.bbox = cloneObj(currentContext.getBoundingClientRect());

    console.log("send key: ", event.symbolistAction);

    ipcRenderer.send('symbolist_event',  {
        key: 'key',
        val: {
            xy: [mouse_pos.x, mouse_pos.y],
            context: _jsonContext,
            action: caller,
            keyVal: event.key,
            mods : {
                alt: event.altKey,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                meta: event.metaKey
            },
            paletteClass: currentPaletteClass, 
            selected: sel_arr,
            symbolistAction: event.symbolistAction
        }
    });
}
*/

function symbolist_keydownhandler(event)
{
    let nmods =  event.altKey + event.shiftKey + event.ctrlKey + event.metaKey;
    switch( event.key )
    {
        case "i":
            if( nmods == 0 && selected.length > 0 ){                

                callMethodForSelected("getInfoDisplay");
                
            }
            break;
        case "e":
            if( nmods == 0 && selected.length > 0 ){                
                callEnterEditModeForSelected();
            }
            break;
        case "Escape":
            escapeModes()
            break;
        case "s":
            setSelectedContext();
            event.symbolistAction = "setContext";
            break;
        case "Backspace":
            if( removeSelected() ) // returns true if should really delete (and not in infobox)
                event.symbolistAction = "removeSelected";
            break;
        case "+":
            console.log('plus');
        break;

    }

  //  console.log("symbolist_keydownhandler", event.symbolistAction, event.key);
    
   // symbolost_sendKeyEvent(event, "keydown");
}

function symbolist_keyuphandler(event)
{
  //  symbolost_sendKeyEvent(event, "keyup");
}

/*
function sendMouseEvent(event, caller)
{  

    if( typeof event.symbolistAction === 'undefined' )
        return;

    const toplevelObj = getTopLevel(event.target);
    
    const _id = ( event.target.id == "svg" || toplevelObj.id == currentContext.id ) ? selectedClass+'_u_'+fairlyUniqueString() : toplevelObj.id;

  //  console.log(_id, selectedClass, toplevelObj.id, currentContext);
   
    let sel_arr = [];

    for( let i = 0; i < selected.length; i++)
    {
        let _jsonEl = elementToJSON( selected[i]);
        _jsonEl.bbox = cloneObj(selected[i].getBoundingClientRect());
        sel_arr.push( _jsonEl );    
    }

    let _jsonContext = elementToJSON( currentContext );
    _jsonContext.bbox = cloneObj(currentContext.getBoundingClientRect());

    let _jsonTarget = elementToJSON( toplevelObj );
    _jsonTarget.bbox = cloneObj(toplevelObj.getBoundingClientRect());


    let obj = {
        key: 'mouse',
        val: {
            id: _id,
            context: _jsonContext,
            paletteClass: currentPaletteClass, // class specified by the palette
            action: caller,
            xy: [ event.pageX, event.pageY ],
            mousedownPos: event.buttons == 1 ? [mousedown_pos.x, mousedown_pos.y ] : null,
            button: event.buttons,
            mods : {
                alt: event.altKey,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                meta: event.metaKey
            },
            target: _jsonTarget, // the object receiving mouse event
            selected: sel_arr
        }
    };

    if( caller == 'wheel' )
    {
        obj.val.delta = [ event.deltaX, event.deltaY ];
    }

    if( event.hasOwnProperty("symbolistAction") )
        obj.val.symbolistAction = event.symbolistAction;

    ipcRenderer.send( 'symbolist_event', obj );

}
*/

function symbolsit_dblclick(event)
{
   // event.preventDefault();
    /*
    setSelectedContext();
    deselectAll();
    event.symbolistAction = "setContext";
    sendMouseEvent(event, "dblclick");
*/
/*
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;

    prevEventTarget = _eventTarget;             

    if( currentContext !== _eventTarget )
    {
        event.symbolistAction = "set_context";
        currentContext = _eventTarget;
        console.log('set context to', currentContext);
    }
    
    sendMouseEvent(event, "dblclick");
    */
}



function symbolist_mousemove(event)
{         
    if( currentMode == "edit" )
        return;
    
    //console.log('symbolist_mousemove', event.pageX, event.pageY, event.screenX, event.screenY);
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;

    mouse_page_pos.x = event.clientX;
    mouse_page_pos.y = event.clientY;

    mouse_pos = getSVGCoordsFromEvent(event);//{ x: event.pageX, y: event.pageY };
    const mouseDelta = deltaPt(mouse_pos, mousedown_pos);
  //  console.log('symbolist_mousemove', mouseDelta, mouse_pos);

    if( event.buttons == 1 )
    {
        if( clickedObj )
        {
            /*
            if( event.shiftKey ) {
                //rotate_selected( mouse_pos )
                // put snap points here?
            }
            else
            {
                */
                // now only translating if the def has a translate function
                callMethodForSelected("drag", { ...event, delta_pos: mouseDelta } );
            //}
        }
        else 
        {
            if( !event.shiftKey ){
                deselectAll();
            }

            if( event.metaKey ){
                event.symbolistAction = "newFromClick_drag";
            }
            else
            {
                let dragRegion = getDragRegion(event);

                selectAllInRegion( dragRegion, mainSVG );
    
                drawDragRegion(dragRegion);
            }


        }
    }

    
    prevEventTarget = _eventTarget;

   // sendMouseEvent(event, "mousemove");

}


function symbolist_mousedown(event)
{          

    mousedown_page_pos.x = event.pageX;
    mousedown_page_pos.y = event.pageY;
    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

    mouse_pos = mousedown_pos;

    if( currentMode == "edit" )
        return;

 //   console.log(`mouse down> current context: ${currentContext.id}\n event target ${event.target}`); 

   
    const _eventTarget = getTopLevel( event.target );

    if( !_eventTarget )
        return;

    //console.log(_eventTarget);
    
   // console.log(`mouse down ${_eventTarget.id} was ${JSON.stringify(elementToJSON(event.target))}`); 
    
    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


    if( (_eventTarget == currentContext) || (!event.shiftKey && !event.altKey) ){
        deselectAll();
    }

    if( event.metaKey )
    {
        event.symbolistAction = "newFromClick_down";

        /*
        if( uiDefs.has(currentPaletteClass) )
        {
            const def_ = uiDefs.get(currentPaletteClass);
            if( def_.hasOwnProperty('newFromClick') )
                def_.newFromClick(event);
        }
        */

        clickedObj = null;
        selectedClass = currentPaletteClass; // later, get from palette selection
    }
    else
    {
        if( _eventTarget != topContainer && _eventTarget != currentContext )
        {
            
            addToSelection( _eventTarget );
            clickedObj = _eventTarget;
            clickedObjBoundsPreTransform = cloneObj( clickedObj.getBoundingClientRect() );
            
            event.symbolistAction = "selection";
    
            console.log(`selected object ${clickedObj} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );
    
    //        selectedClass =  clickedObj.classList[0]; // hopefully this will always be correct! not for sure though
    
            if( event.altKey )
            {
                copySelected();
                //clickedObj = copyObjectAndAddToParent(_eventTarget);       
                //addToSelection( clickedObj );
            }
            else if( event.altKey && event.metaKey )
            {
                event.symbolistAction = "create_menu";
            }
    
        }
        else
            console.log(`not selected object ${_eventTarget.id} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );

    }

   
    prevEventTarget = _eventTarget;
    
   // sendMouseEvent(event, "mousedown");

   // callbackCustomUI( event );

}


function symbolist_mouseup(event)
{   
    console.log('symbolist_mouseup');

    clearDragRegionRect();

    const _eventTarget = getTopLevel( event.target );
    
    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


//    console.log("1", _eventTarget.getAttribute("class"));

//    const classString = _eventTarget.getAttribute("class");

    if( event.metaKey ){
        event.symbolistAction = "newFromClick_up";

    }
    else
    {
       // console.log('compare', selectedCopy != selected, selectedCopy, selected );
        
        if( selectedObjectsChanged() ) // _eventTarget != svgObj
        {
            //event.symbolistAction = "transformed";

            applyTransformToSelected();
            removeSprites();
            
        }
        else
        {

            //callSelected();
            // only call getUnionBounds if there is no custom transform function
           // getUnionBounds();
        }
    }

    
    
    mouse_pos = getSVGCoordsFromEvent(event);//{ x: event.pageX, y: event.pageY };
    event.mousedownPos = mousedown_pos;

    //sendMouseEvent(event, "mouseup");

    clickedObj = null;
    selectedClass = currentPaletteClass;
    prevEventTarget = _eventTarget;

}


function symbolist_mouseover(event)
{           
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


    prevEventTarget = _eventTarget;

    //sendMouseEvent(event, "mouseover");

}


function symbolist_mouseleave(event)
{           
    //console.log('symbolist_mouseleave');
    //clearDragRegionRect();

    /*
    drawsocketInput({
        key: "clear",
        val: "symbolist_overlay"
    })
    */
    removeSprites();
    prevEventTarget = null;
}


function symbolist_zoomReset()
{
    if( m_scale == 1 )
    {
        scrollOffset = {x: 0, y: 0};
        gsap.set( mainSVG,  scrollOffset );
        gsap.set( mainHTML, scrollOffset );
        gsap.set( floatingForms, scrollOffset )
    }

    m_scale = 1;
   // const scale = Math.pow( Math.E, m_scale);
    gsap.set( mainSVG,  { scale: 1 } );
    gsap.set( mainHTML, { scale: 1 } );
    gsap.set( floatingForms, { scale: 1 } );

    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

}


function symbolist_zoom(offset)
{

    const visible_w = window.innerWidth / m_scale;
    const visible_h = window.innerHeight / m_scale;

    m_scale += offset;

    const next_visible_w = window.innerWidth / m_scale;
    const next_visible_h = window.innerHeight / m_scale;

    const offset_x = next_visible_w - visible_w;
    const offset_y = next_visible_h - visible_h;

    if( offset_x < 0 )
        scrollOffset.x += offset_x * 0.5;
    if( offset_y < 0 )
        scrollOffset.y += offset_y * 0.5;

    gsap.set( mainSVG,  { ...scrollOffset, scale: m_scale } );
    gsap.set( mainHTML, { ...scrollOffset, scale: m_scale } );
    gsap.set( floatingForms, { ...scrollOffset, scale: m_scale } );


    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

}

let ticking = false;

function symbolist_wheel(event)
{

    scrollOffset.x -= event.deltaX;
    scrollOffset.y -= event.deltaY;

    // >> slowing the update down a litte, which was causing some jittery behavior

    if (!ticking) {
      window.requestAnimationFrame( function() {

        gsap.set( mainSVG,  scrollOffset );
        gsap.set( mainHTML, scrollOffset );
        gsap.set( floatingForms, scrollOffset );

        ticking = false;
      });
  
      ticking = true;
    }
}

/**
 * 
 * @param {Point} norm_pos normalized xy position 0-1
 * 
 */
function setScrollOffset(norm_pos)
{

    const bbox = svgObj.getBBox();

    if( typeof norm_pos.x != "undefined" )
        scrollOffset.x = -norm_pos.x * bbox.width;
    
    if( typeof norm_pos.y != "undefined" )
        scrollOffset.y = -norm_pos.y * bbox.height;

    if (!ticking) {
        window.requestAnimationFrame( function() {
  
          gsap.set( mainSVG,  scrollOffset );
          gsap.set( mainHTML, scrollOffset );
          gsap.set( floatingForms, scrollOffset );
  
          ticking = false;
        });
    
        ticking = true;
      }
}


function addSymbolistMouseHandlers(element)
{
    element.addEventListener("mousedown", symbolist_mousedown);
    element.addEventListener("mousemove", symbolist_mousemove);
    element.addEventListener("mouseup", symbolist_mouseup);
    element.addEventListener("mouseover", symbolist_mouseover);
    element.addEventListener("mouseleave", symbolist_mouseleave);
    element.addEventListener("dblclick", symbolsit_dblclick);

    window.addEventListener('wheel', symbolist_wheel);

}

function removeSymbolistMouseHandlers(element)
{
    element.removeEventListener("mousedown", symbolist_mousedown);
    element.removeEventListener("mousemove", symbolist_mousemove);
    element.removeEventListener("mouseup", symbolist_mouseup);
    element.removeEventListener("mouseover", symbolist_mouseover);
    element.removeEventListener("mouseleave", symbolist_mouseleave);
    element.removeEventListener("dblclick", symbolsit_dblclick);

    window.removeEventListener('wheel', symbolist_wheel);

}

function addSymbolistKeyListeners()
{
  document.body.addEventListener("keydown", symbolist_keydownhandler);
  document.body.addEventListener("keyup", symbolist_keyuphandler);
}

function removeSymbolistKeyListeners()
{
  document.body.removeEventListener("keydown", symbolist_keydownhandler);
  document.body.removeEventListener("keyup", symbolist_keyuphandler);
}


var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function visibility_handler(event)
{
    console.log('hidden', document[hidden] );

    /*
    if( document[hidden] )
    {
        removeSymbolistMouseHandlers(svgObj);
        removeSymbolistKeyListeners();
    }
    else
    {
        addSymbolistMouseHandlers(svgObj);
        addSymbolistKeyListeners
    }
    */
}

window.addEventListener("blur", (event)=> {
 //   console.log("blur");
    removeSymbolistMouseHandlers(svgObj);
    removeSymbolistKeyListeners();
}, false);

window.addEventListener("focus", (event)=> {
  //  console.log("focus");
    addSymbolistMouseHandlers(svgObj);
    addSymbolistKeyListeners();
}, false);

window.addEventListener("load", ()=> {
    io_send({
        init: "bang"
    });
}, false);

function addFocusListner()
{   
    window.addEventListener(visibilityChange, visibility_handler, false);

}

function removeFocusListner()
{
    // probably not necessary
}



function onChange(event)
{
    console.log('changer', event);
}

// https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340
function startObserver()
{
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    let queue = [];


    const observer = new MutationObserver( mutation => {
        if( queue.length > 0 ){
            requestAnimationFrame( () => {
                
                console.log( mainDiv.getBoundingClientRect() );
                
                queue.forEach( modlist => {
                    modlist.forEach( mod => {
                        
                        switch( mod.type ){
                            case "attributes":
                                console.log('attr', mod.attributeName );
                                break;
                            default:
                                break;
                        }

                    })
                    
                })

                queue = [];
            });
        }

        queue.push(mutation);
    });


    // Start observing the target node for configured mutations
    
   // observer.observe(mainDiv, config);

    // Later, you can stop observing
  //  observer.disconnect();
}

function startDefaultEventHandlers()
{
    addSymbolistMouseHandlers(svgObj);
    
    startObserver();

    addSymbolistKeyListeners();

    addFocusListner();
}

function stopDefaultEventHandlers()
{
    removeSymbolistMouseHandlers(svgObj);
    removeSymbolistKeyListeners();
}

startDefaultEventHandlers();



/**
 * returns Element Node of currently selected context
 */
function getCurrentContext(){
    //console.log('currentContext', currentContext);
    return currentContext;
}






 
 /**
  * routes message from the controllers
  */
  function input(obj_arr) 
  {
      console.log(obj_arr);
      obj_arr = Array.isArray(obj_arr) ? obj_arr : [obj_arr];
 
      obj_arr.forEach( obj => {
         switch(obj.key){
             case 'data':
                 iterateScore(obj.val);
                 break;
             case 'model':
                // parseDataModelFromServer(obj.val);
                 break;
             case 'score':
                 console.log('score');
                 symbolist_newScore();
                 iterateScore(obj.val);
                 break;
             case 'call':
                 callFromIO(obj.val);
                 break;
             case 'drawsocket':
                 drawsocketInput(obj.val)
                 break;
            case 'load-ui-defs':
                loadUIDefs(obj.val);
                break;
             case 'set-dirname':
                 __webpack_require__.g.__symbolist_dirname = obj.val;
                 break;

            // menu calls
            case 'deleteSelected':
                removeSelected();
                break;
            case 'zoomIn':
                symbolist_zoom(default_zoom_step);
                break;
            case 'zoomOut':
                symbolist_zoom(-default_zoom_step);
                break;
            case 'zoomReset':
                symbolist_zoomReset()
                break;
            case 'newScore':
                symbolist_newScore();
                break;
            case 'init':
                init(obj.val)
                break;
             default:
                 break;
         }
      })
      
  }




function io_out(msg)
{
    sendToServer({
        key: 'io_out',
        val: {
            'return/ui' : msg
        }
    })
}



/*
function symbolist_send(obj)
{
    ipcRenderer.send('symbolist_event', obj);
}
*/

/**
 * 
 * @param {Object} obj object to send to controller
 */
function sendToServer(obj)
{
    io_send(obj);

}


/*
// not used now but could be useful if we want to deal with the lookup system from the gui
async function getDataForID(id)
{
    return ipcRenderer.invoke('query-event', id);
}

function asyncQuery(id, query, calllbackFn)
{
    ipcRenderer.once(`${id}-reply`, (event, args) => {
        calllbackFn(args) 
    })

    ipcRenderer.send('query', {
        id,
        query
    });
}
*/



/**
 * 
 * @param {Object} obj input to drawsocket
 */
function drawsocketInput(obj){
    drawsocket.input(obj)
}



/**
 * Main Def Handling
 */


/**
 * 
 * @param {SVG/HTML Element} element 
 * 
 * returns ui def for class, which must be first in the class list
 */
function getDefForElement(element)
{
    return uiDefs.get(element.classList[0]);;
}

/**
 * 
 * @param {String} classname
 * @returns def
 */
function getDef(classname)
{
    return uiDefs.get(classname);
}


async function loadScript(script, src){
    return new Promise((resolve, reject) => {
        script.onload = ()=> {
           // document.head.removeChild(script);
            resolve();
        };
        script.onerror = reject;
        script.src = src
        document.head.appendChild(script);
    })
}

async function loadUIDefs(folder)
{
    
    initPalette();
 
    sendToServer({
        key: 'data-refresh'
    })
    return;

    const path = folder.path;

    folder.files.forEach( async (f) => {
        
        if( f.type != 'folder' )
        {
            const filepath = `${path}/${f.name}`;
            
            /*
            const exists = require.resolve(filepath); 
            if( exists )
                delete require.cache[ exists ];
            
            if( f.type == 'js')
            {
                // load controller def
                let { ui_def } = require(filepath);
    
                // initialize def with api
    
                // api now global
                let cntrlDef_ = new ui_def();
            
                // set into def map
                uiDefs.set(cntrlDef_.class, cntrlDef_);
                console.log('added ', cntrlDef_.class);
            }*/
            if( f.type == 'js')
            {
                /*
                let script = document.createElement('script');
                script.type = 'text/javascript';

                await loadScript(script, filepath);
                console.log('returned');
                */

            }
            else if( f.type == "css" )
            {
                let head = document.getElementsByTagName("head");
                if( !document.querySelector(`link[href="${filepath}"]`) )
                {
                    var cssFileRef = document.createElement("link");
                    cssFileRef.rel = "stylesheet";
                    cssFileRef.type = "text/css";
                    cssFileRef.href = filepath;
                    head[0].appendChild(cssFileRef);
                }
                
            }
            else if( f.name == 'init.json' ) //if(f.type == 'json')
            {
                console.log('loading init');
                // there can be only one json file in the folder
               // initDef = require(filepath);
            }
        }        
        
   
    })
    
  //   initDocument();
 

}



/**
 * 
 * @param {Object} data object with perceptual parameters
 * @param {Element} context_element HTML/SVG element container, 
 * 
 * iterates each layer of container first, then calls updateAfterContents
 * then iterates the contents of each container
 * 
 */
function iterateScore(contents, context_element = null)
{
    console.log('iterateScore', contents, context_element);

    if( !context_element ){
        context_element = getCurrentContext();
    }

    const contents_arr = Array.isArray(contents) ? contents : [ contents ];

    contents_arr.forEach( data => {
        console.log('iterateScore', data);
        
        if( !hasParam(data, 'container' ) )
            data.container = context_element.id;
    
        context_element = document.getElementById(data.container);

        if( !context_element )
        {
            console.error('no context element', data.container );
        }

        if( uiDefs.has(data.class) )
        {
            const def_ = uiDefs.get(data.class);
            
            if( hasParam(def_, "fromData") )
            {
                def_.fromData( data, context_element );
            }
        }
        else
        {
            console.error("no ui def found for class:", data.class);
        }
        
    })

    if( context_element ) // seems like there will always be a context element so maybe this is not required
    {
        //console.log(context_element.classList[0]);
        const container_class_def = uiDefs.get( context_element.classList[0] );
        if( container_class_def && hasParam(container_class_def, 'updateAfterContents') )
        {
            container_class_def.updateAfterContents(context_element);
        }
    }

    // why not do depth first?
    // maybe so that the absolute values are correct for the parents before
    // drawing the children

    contents_arr.forEach( data => {
        const newEl = document.getElementById(data.id);
        if( newEl && data.hasOwnProperty('contents') )
        {
         //   console.log('drawing children');
            iterateScore(data.contents, newEl )
        }
    })
   
}



function initPalette()
{
    if( hasParam( initDef, 'palette') )
    {
        let drawMsgs = [];
        initDef.palette.forEach( el => {
            if( el.length > 0 )
            {
                let def_ = uiDefs.get(el);
                if( def_ )
                {
                    const def_classname = def_.class;
                    let def_palette_display = def_.getPaletteIcon();
        
                    if( def_palette_display && def_palette_display.key == "svg" )
                    {
                        def_palette_display = {
                            new: "svg",
                            class: "palette-svg",
                            id: `${def_classname}-icon`,
                            children: def_palette_display.val
                        }
                    }
        
                    drawMsgs.push({
                        key: "html",
                        val: {
                            new: "div",
                            class: `${def_classname} palette-icon`,
                            id: `${def_classname}-paletteIcon`,
                            parent: "palette-tools",
                            onclick: () => {
                                    console.log(`select ${def_classname}`); 
                                    symbolist_setClass(def_classname);
                            },
                            children: def_palette_display
                        }
                    })
                }
                else
                {
                    console.error("no def found for:", el);
                }
                
            }
            
        })

        drawsocketInput([{
                key: "clear",
                val: "palette-symbols"
            }, ...drawMsgs
        ]) 
    }

    // in controller there is a defautlContext class, probably we should do the same
    console.log('initFile', initDef);
}


/**
 * 
 * @param {Array} class_array array of class names
 */
function makeSymbolPalette(class_array)
{
    let draw_msg = [];
    class_array.forEach( classname => {
        if( uiDefs.has(classname) )
        {
            const symDef = uiDefs.get(classname);

            let def_palette_display = symDef.getPaletteIcon();

            if( def_palette_display && def_palette_display.key == "svg" )
            {
                def_palette_display = {
                    new: "svg",
                    class: "palette-svg",
                    id: `${classname}-icon`,
                    children: def_palette_display.val
                }
            }
        
            draw_msg.push({
                key: "html",    
                val: {
                    new: "div",
                    class: `${classname} palette-icon`,
                    id: `${classname}-paletteIcon`,
                    parent: "palette-symbols",
                    onclick: () => {
                            console.log(`select ${classname}`); 
                            symbolist_setClass(`${classname}`);
                    },
                    children: def_palette_display
                }
            })
        
        }
    })

    if( draw_msg.length > 0 )
    {
        drawsocket.input([
            {
                key: "clear",
                val: "palette-symbols"
            }, 
            ...draw_msg
        ]) 
    }
}


function makeDefaultInfoDisplay(viewObj)
{
    const bbox = getBBoxAdjusted(viewObj);
    //const bbox = viewObj.getBoundingClientRect();
    return defaultInfoDisplay(viewObj, bbox);
}



function callFromIO(params)
{
    if( typeof params.class != "undefined" && typeof params.method != "undefined" )
    {

        if( uiDefs.has(params.class)  )
        {  
            const _def = uiDefs.get(params.class);
            if( typeof _def[params.method] != 'undefined')
            {
                const ret = _def[params.method](params);
                if( ret )
                {
                    io_out(_def[params.method](params));
                }
            }
        }
    }
}



/**
 * 
 * @param {string} _class sets current selected palette class
 * 
 * called on click from the palette icon
 * 
 */
function symbolist_setClass(_class)
{
//    console.log("symbolist_setClass", _class);
    symbolist_set_log(`selected symbol ${_class}`)

    if( _class == selectedClass )
    {
        document.querySelectorAll(".palette .selected").forEach( el => {
            el.classList.remove("selected");
        });

        if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
        {
            uiDefs.get(selectedClass).paletteSelected(false);
            
        }
        selectedClass = null;
        return;
    }

    document.querySelectorAll(".palette .selected").forEach( el => {
        el.classList.remove("selected");
    });

    let paletteItem = document.getElementById(`${_class}-paletteIcon`);
    paletteItem.classList.add("selected");  

    if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
    {
        uiDefs.get(selectedClass).paletteSelected(false);
    }

    currentPaletteClass = _class;
    selectedClass = _class;

    if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
    {
        uiDefs.get(selectedClass).paletteSelected(true);
    }

    /*
    io_send({
        key: "symbolistEvent",  
        val: {
            symbolistAction: 'setPaletteClass',
            class: currentPaletteClass
        }
    }); 
    */
}

/**
 * -->> change this to element..
 * @param {Object} obj set context from symbolist controller
 */
function symbolist_setContext(obj)
{
    deselectAll();

    document.querySelectorAll(".palette .selected").forEach( el => {

        if( uiDefs.has( el.classList[0] ) )
        {
            uiDefs.get( el.classList[0] ).paletteSelected(false);
        }
    
    //    callSymbolMethod(el, "paletteSelected", false);
    });

    // not sure that it's possible to have more than one context...
    // maybe?
    document.querySelectorAll(".current_context").forEach( el => {
        el.classList.remove("current_context");
    });

    if( uiDefs.has(obj.classList[0]) )
    {
        let def_ = uiDefs.get(obj.classList[0]);

        if( def_.palette )
        {
            makeSymbolPalette(def_.palette);
        }

        // make enter context mode also?
        //def_.enter(obj);
    }

    if( obj != topContainer )
        obj.classList.add("current_context");


    callSymbolMethod(currentContext, "currentContext", false);

    currentContext = obj;
    callSymbolMethod(currentContext, "currentContext", true);

    symbolist_set_log(`set context to ${currentContext.id}`)


}



/**
 * 
 * @param {Element} element HTML/SVG symbol element to call method on
 * @param {String} methodName name of method (e.g. editMode, selected.. )
 * @param {Object} args arguments to pass to method, could be anything, but probably an object
 * 
 * returns true if there is a method name defined in the def, false if not
 * 
 * if false, there is a possibility of using the default handlers for translate, etc.
 * but I think we're going to remove most of the default handlers
 */
function callSymbolMethod( element, methodName, args )
{
    if( uiDefs.has( element.classList[0] ) )
    {
        const def_ = uiDefs.get( element.classList[0] );

        if( hasParam(def_, methodName) )
        {
            const ret = def_[methodName](element, args);
            return (typeof ret === "undefined" ? false : ret );
        }        
    }

    return false;

}


/**
 * UI Helpers
 */



// storage for internal Handle callbacks
let cb = {};

/**
 * 
 * @param {Element} element element to create Handle for
 * @param {Object} relativeToAttrs attrs of element to use for handle position for x and y
 * @param {Function} callback (element, event) => {} callback to call on drag
 */
function createHandle(  element, 
                        relativeToAttrs = {selector: "", x: "", y: ""}, 
                        callback = (element, event) => {} )
{
   // const symbol = getContainerForElement(element);
  //  console.log('create handle with reative selector', relativeToAttrs.selector);
    const handle_id = `${element.id}-handle-${relativeToAttrs.x}-${relativeToAttrs.y}`;
    ui_api.drawsocketInput({
        key: "svg", 
        val: {
            id: handle_id,
            new: "rect",
            class: "symbolist_handle",
            parent: 'symbolist_overlay', 
            x: {
                selector: relativeToAttrs.selector,
                attr: relativeToAttrs.x
            },
            y: {
                selector: relativeToAttrs.selector,
                attr: relativeToAttrs.y
            },
            onmousedown: function (event) { 
                document.addEventListener('mousemove', 
                    cb[`${handle_id}-moveHandler`] = function (event) {
                      //  console.log(`${handle_id}-moveHandler`);
                        if( event.buttons == 1 ) {
                            
                            callback(element, event);

                            // update position after callback
                            ui_api.drawsocketInput({
                                key: "svg",
                                val: {
                                    id: handle_id,
                                    x: {
                                        selector: relativeToAttrs.selector,
                                        attr: relativeToAttrs.x
                                    },
                                    y: {
                                        selector: relativeToAttrs.selector,
                                        attr: relativeToAttrs.y
                                    }
                                }
                            })
                            

                        }

                    }
                );
            }                        
        }
    });

 //   console.log( document.getElementById(handle_id) );
}

function removeHandles()
{
    document.querySelectorAll('.symbolist_handle').forEach( e => {
        document.removeEventListener('mousemove', cb[`${e.id}-moveHandler`]);
        delete cb[`${e.id}-moveHandler`];
   //     console.log(`removed ${e.id}-moveHandler, now = ${cb[`${e.id}-moveHandler`]}`);
    })
}


function removeSprites()
{
    removeHandles();
    document.querySelectorAll('.sprite').forEach(e => e.remove());
}

/**
 * 
 * @param {Object/Array} view object, or array of Drawsocket format, SVG elements to draw, placed inside the display <g> group
 * @param {Object} dataObj data object containing id, class, container-id, and any other data to store in the dataset
 * @param {Boolean} overwrite (optional) force overwrite the object, this will whipe out child elements false by default
 * 
 * returns object formatted to send to Drawsocket
 * 
 * When creating a new SVG element, you need to include the class in the dataObj
 * 
 */
function svgFromViewAndData(view, dataObj, overwrite = false)
{
    if( !overwrite )
    {
        overwrite = !document.getElementById(dataObj.id);
    }

    let val = {
        ...dataToHTML(dataObj),
        children: [{
            id: `${dataObj.id}-display`,
            children: view
        }, {
            id: `${dataObj.id}-contents`,
        }]
    };

    if( overwrite )
    {
        val.new = 'g';
        val.children[0].new = 'g';
        val.children[1].new = 'g';
    }

    if( hasParam(dataObj, "container" ) )
    {
        if( dataObj.container == "symbolist_overlay" )
            val.container = "symbolist_overlay";
        else
            val.container = `${dataObj.container}-contents`;
    }

    if( hasParam(dataObj, "class" ) )
    {
        val.class = `${dataObj.class} symbol`;
        val.children[0].class = `${dataObj.class} display`;
        val.children[1].class = `${dataObj.class} contents`;
    }

    return {
        key: "svg",
        val
    }
}



/**
 * 
 * could definitely avoid this copy here...
 * 
 * @param {Object/Array} view object, or array of Drawsocket format, SVG elements to draw, placed inside the display <g> group
 * @param {Object} dataObj data object containing id, class, container-id, and any other data to store in the dataset
 * @param {Boolean} overwrite (optional) force overwrite the object, this will whipe out child elements false by default
 * 
 * returns object formatted to send to Drawsocket
 * 
 * When creating a new SVG element, you need to include the class in the dataObj
 * 
 */
function htmlFromViewAndData(view, dataObj, overwrite = false)
{
    if( !overwrite )
    {
        overwrite = !document.getElementById(dataObj.id);
    }

    let val = {
        ...dataToHTML(dataObj),
        children: [{
            id: `${dataObj.id}-display`,
            children: view
        }, {
            id: `${dataObj.id}-contents`,
        }]
    };

    if( overwrite )
    {
        val.new = 'div';
        val.children[0].new = 'div';
        val.children[1].new = 'div';
    }

    if( hasParam(dataObj, "container" ) )
    {
        if( dataObj.container == "forms" )
            val.container = "forms";
        else
            val.container = `${dataObj.container}-contents`;
    }

    if( hasParam(dataObj, "class" ) )
    {
        val.class = `${dataObj.class} symbol`;
        val.children[0].class = `${dataObj.class} display`;
        val.children[1].class = `${dataObj.class} contents`;
    }

    return {
        key: "html",
        val
    }
}



function getDataTextView(dataObj, relativeTo = null)
{
    return {
        key: 'svg',
        val: {  
            new: "text",
            class: "data_text sprite",
            container: `symbolist_overlay`,
            relativeTo : (relativeTo ? relativeTo : `#${dataObj.id}`),
            id: `${dataObj.id}-data_text`,
            x: 0,
            y: -20,
            text: JSON.stringify( filterDataset(dataObj) )
        }
    }
}

function svgPreviewFromViewAndData(view, dataObj, relativeTo = null)
{
    let drawing = svgFromViewAndData(view, 
        {
            ...dataObj,
            class: `${dataObj.class} sprite`, // << sprite flags the object to be deleted
            id: `${dataObj.class}-sprite`,
            container: 'symbolist_overlay' // << temp overlay layer gets cleared also
        }, 
        true /* overwrite*/ 
    );
    
    if( relativeTo )
    {
        relativeTo = `#${dataObj.class}-sprite ${relativeTo}`;
    }
        
    let text_drawing = getDataTextView({
        ...dataObj,
        id: `${dataObj.class}-sprite`
    }, relativeTo );

    console.log("svgPreviewFromViewAndData", drawing, text_drawing );
    return [ drawing, text_drawing ];
}

/**
 * 
 * @param {Object} data_ data object to convert to HTML style
 * 
 * returns object with "data-" prepended to keys
 */
function dataToHTML(data_)
{
    let dataObj = {};
    Object.keys(data_).forEach( key => {
        // filtering elements not used in the dataset
        if( key != 'id' && 
            key != 'class' && 
            key != 'container' && 
            key != 'parent' && 
            key != 'contents' ) 
        {
            dataObj[`data-${key}`] = typeof data_[key] == "object" ? JSON.stringify(data_[key]) : data_[key];
        }
        else if( key == 'id') // maybe pass all keys?
        {
            dataObj.id = data_.id; 
        }
            
    })

    return dataObj;
}

// better to make a flag for dataToHTML?
function filterDataset(data_)
{
    let dataObj = {};
    Object.keys(data_).forEach( key => {
        // filtering elements not used in the dataset
        if( key != 'id' && 
            key != 'class' && 
            key != 'container' && 
            key != 'parent' && 
            key != 'contents' ) 
        {
            dataObj[key] = data_[key];
        }
            
    })

    return dataObj;
}




/**
 * 
 * @param {Element} element SVG/HTML element to get dataset from
 * @param {Element} container optional, adds container.id to data
 */
function getElementData(element, container = null) 
{
    let data = {};
    Object.keys(element.dataset).forEach( k => {
        if( isNumeric( element.dataset[k] ) )
        {
            data[k] = Number( element.dataset[k] );
        }
        else if( element.dataset[k][0] == '{' ||  element.dataset[k][0] == '[' )
        {
            try 
            {
                data[k] = JSON.parse(element.dataset[k])
            }
            catch (e) 
            {
                data[k] = element.dataset[k]; 
            }
        }
        else if(  element.dataset[k] == 'true' ||  element.dataset[k] == 'false' )
        {
            data[k] = element.dataset[k] == 'true';
        }
        else
        {
            data[k] = element.dataset[k]; 
        }
    });
    
    data.id = element.id;
    data.class = element.classList[0];

    if( container )
        data.container = container.id;

    return data;
}

/**
 * 
 * @param {SVG/HTML Element} element a symbol element
 * 
 * searches through the parent elements for the first container
 */
function getContainerForElement(element)
{
    // all symbols are in .contents groups
    // so we can get the parent node (.contents) 
    // and then the parent of that note should be the symbol
    return element.parentNode.closest('.symbol'); //element.parentNode.parentNode;
    // could also do element.parentNode.closest('.symbol');
}


/**
 * UI Actions
 */




function escapeModes()
{
    document.getSelection().removeAllRanges();
    document.activeElement.blur();

    if( selected.length == 0 )
        setDefaultContext();
    else
    {
        if( currentMode == "edit" )
            callExitEditModeForSelected();
        else {
            deselectAll();
        }
        console.log('currentMode', currentMode, 'currentContext', currentContext );
    }
        
}




/**
 * returns array of selected elements
 */
function getSelected()
{
    return selected;
}



function symbolist_newScore()
{
    console.log('newScore');
    deselectAll();
    setDefaultContext();

    drawsocketInput({
        key: "clear",
        val: ["palette-symbols", "top-svg-contents", "top-html-contents", "symbolist_overlay", "floating-forms", "floating-overlay"]
    })
}



function symbolist_set_log(msg)
{
    if( symbolist_log )
    {
        symbolist_log.innerHTML = `<span>${msg}</span>`;
    }
}

function symbolist_setContainerClass(_class)
{
    drawsocketInput({
        key: "clear",
        val: "palette-symbols"
    })
    
    symbolist_setClass(_class);
}


function setDefaultContext()
{
    symbolist_setContext(topContainer);
}

/**
 * set context from UI event, selecting most recently selected object
 * sets palette class to null
 */
function setSelectedContext(){

    if( selected.length > 0 )
        symbolist_setContext( selected[selected.length-1] );
    else
        setDefaultContext();

    currentPaletteClass = null;
}
 


function removeSelected()
{
    if( selected.length > 0 && !document.querySelector('.infobox') )
    {
        let selectedIDs = selected.map( val => val.id );
        drawsocket.input({
            key: 'remove',
            val: selectedIDs
        });  

        return true;
    }

    return false;
        
}



/**
 * UI Def Method Functions
 * require UI info (selection)
 * and defs
 * 
 */

/**
 * 
 * @param {String} methodName method name
 * @param {*} args args (optional)
 * 
 * simple wrapper to call method for all selected objects
 */
function callMethodForSelected(methodName, args)
{
    selected.forEach( sel => callSymbolMethod(sel, methodName, args) )

}

function callEnterEditModeForSelected()
{
    selected.forEach( sel => {
        if( callSymbolMethod(sel, "editMode", true) )
            currentMode = "edit"
    })
}

function callExitEditModeForSelected()
{
    let check = true;
    selected.forEach( sel => {
        if( !callSymbolMethod(sel, "editMode", false)  )
            check = false;
    })

    if( check ){
        currentMode = "palette"
    }
    else
        console.error('failed to exit edit mode!!')

    console.log('callExitEditModeForSelected now ', currentMode );


}

/*

function getUnionBounds()
{

    if( selected.length == 0 )
        return;

    const bounds = cloneObj(selected[0].getBoundingClientRect());

    let l = bounds.left;
    let r = bounds.right;
    let t = bounds.top;
    let b = bounds.bottom;

    for( let i = 1; i < selected.length; i++)
    {
            const addBox = selected[i].getBoundingClientRect();

            if( l > addBox.left ){
                l = addBox.left;
            }
            
            if( r < addBox.right ){
                r = addBox.right;
            }

            if( t > addBox.top ){
                t = addBox.top;
            }
            
            if( b < addBox.bottom ){
                b = addBox.bottom;
            }

           // console.log('bounds', bounds);
    }


    function HandleRect(x,y, idx) {
        const r = 5;
        const d = r * 2;
        return {
            new: "rect",
            parent: "symbolist_overlay",
            class: "transform-handle",
            x: x - r,
            y: y - r,
            width: d,
            height: d,
            id: `transform-handle-${idx}`,
            onclick: `console.log( "selected", this.id )`,
            style: {
                fill: "rgba(0, 0, 0, 0.05)"
            }
        }
    }

    function BoundsLine(x1,y1,x2,y2) {
        const r = 2;
        const d = r * 2;
        return {
            new: "line",
            parent: "bounds-group",
            class: "transform-line",
            x1: x - r,
            y: y - r,
            width: d,
            height: d,
            id: `transform-handle-${idx}`,
            onclick: `console.log( "selected", this.id )`,
            style: {
                fill: "rgba(0, 0, 0, 0.05)"
            }
        }
    }
    
    

    drawsocket.input({
        key: 'svg',
        val: {
            new: "g",
            id: "bounds-group",
            parent: "symbolist_overlay",
            children : [
                HandleRect(l,t, 0),
                HandleRect(l,b, 1),
                HandleRect(r,t, 2),
                HandleRect(r,b, 3),
                {
                    new: "rect",
                    id: "bounds-rect",
                    x: l,
                    y: t,
                    width: r-l,
                    height: b-t,
                    style: {
                        "stroke-width" : 1,
                        stroke: 'rgba(0,0,0, 0.5)',
                        fill: "none",
                        "stroke-dasharray" : 1,
                        'pointer-events': "none" // "stroke"
                    }
                }
            ]
        }
    });


}
*/



/**
 * Selection
 */



function addToSelection( element )
{

    if( !element || typeof element.id == "undefined" || element.id == 'dragRegion' )
        return;

   // console.log('addToSelection', element);

    for( let i = 0; i < selected.length; i++)
    {
        if( selected[i] == element )
            return;    
    }

    selected.push(element);

    if( !element.classList.contains("symbolist_selected") )
    {
        element.classList.add("symbolist_selected");
    }

    // copy with selected tag to deal with comparison later
    selectedCopy.push( element.cloneNode(true) );

    callSymbolMethod(element, "selected", true);

}

function selectedObjectsChanged()
{
    for( let i = 0; i < selected.length; i++)
    {
        if( !selectedCopy[i].isEqualNode( selected[i] ) ){
      //      console.log(selectedCopy[i], selected[i] );    
            return true;
        }   
        
    }

    return false;
}


function selectAllInRegion(region, element)
{

    let contextContent = currentContext.querySelector('.contents');

    for (let i = 0; i < contextContent.children.length; i++) 
    {
        if( recursiveHitTest(region, contextContent.children[i]) )
            addToSelection( contextContent.children[i] );

    }
        
}

function deselectAll()
{
 
    document.querySelectorAll('.symbolist_selected').forEach( el => {
        el.classList.remove("symbolist_selected");
                
        callSymbolMethod(el, "selected", false);
        callSymbolMethod(el, "editMode", false);
        
    })

    selected = [];
    selectedCopy = [];

    document.querySelectorAll('.infobox').forEach( ibox => {
        ibox.remove();
    })

    drawsocket.input({
        key: "clear",
        val: "symbolist_overlay"
    })

}



function applyTransformToSelected()
{
    for( let i = 0; i < selected.length; i++)
    {
        
        if( !callSymbolMethod(selected[i], "applyTransformToData" ) )
        {
            let matrix = getComputedMatrix(selected[i]);
            applyTransform(selected[i], matrix);
        }
        
    }
}


function cancelTransform(element)
{
    element.removeAttribute('transform');   
}



function rotate_selected(mouse_pos)
{
    for( let i = 0; i < selected.length; i++)
    {
       
       // if( !callTranslate(selected[i], delta_pos) )
        {
            rotate(selected[i], mouse_pos);
        }
    }
}


function copySelected()
{

    let newArray = [];
    for( let i = 0; i < selected.length; i++)
    {
        newArray.push( copyObjectAndAddToParent(selected[i]) );
    }

    deselectAll();

    for( let i = 0; i < newArray.length; i++)
    {
        addToSelection(newArray[i]);
    }

}



function getDragRegion(event)
{
    let left, right, top, bottom;
    if( mousedown_pos.x < event.pageX )
    {
        right = event.pageX;
        left = mousedown_pos.x;
    }
    else
    {
        left = event.pageX;
        right = mousedown_pos.x;
    }

    if( mousedown_pos.y < event.pageY )
    {
        bottom = event.pageY;
        top = mousedown_pos.y;
    }
    else
    {
        top = event.pageY;
        bottom = mousedown_pos.y;
    }

    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom
    };
}

function drawDragRegion(_dragRegion)
{
    drawsocket.input({
        key: 'svg',
        val: {
            id: 'dragRegion',
            parent: 'symbolist_overlay',
            new: 'rect',
            x: _dragRegion.left,
            y: _dragRegion.top,
            width: _dragRegion.right - _dragRegion.left,
            height: _dragRegion.bottom - _dragRegion.top,
            fill: 'none',
            'stroke-width': 1,
            'stroke': 'rgba(0,0,0,0.5)'
        }
    });
}

function clearDragRegionRect() 
{
    drawsocket.input({
        key: 'remove',
        val: 'dragRegion'
    });    
}


/**
 * ui_api used in defs
 */

let ui_api = {
    uiDefs: window.uiDefs, // access to the defs in the defs
    
    getDef,

    getSymbolFromElement: getTopLevel,
    getDefForElement, // helper function to get def for DOM element
    getContainerForElement, // look upwards in the elemement heirarchy to find the container

    svgFromViewAndData,
    htmlFromViewAndData,
    svgPreviewFromViewAndData,
    getDataTextView,
    removeSprites,

    drawsocketInput,
    sendToServer, // renderer-event
    outlet, // to max if running in max
    fairlyUniqueString,
    makeUniqueID,
    getCurrentContext,
    getSelected,
    dataToHTML,
    getElementData,

    filterByKeys,

    makeDefaultInfoDisplay,
    translate,
    applyTransform,

    getSVGCoordsFromEvent,
    getBBoxAdjusted,


    svgObj,
    mainDiv,
    scrollOffset,

    
    insertSorted, 
    insertSortedHTML,
    insertIndex,

    ntom,
    mton,
    ftom, 
    mtof,
    ratio2float,
    reduceRatio,
    getRatioPrimeCoefs,
    parseRatioStr,

    hasParam,
    createHandle,

    startDefaultEventHandlers,
    stopDefaultEventHandlers,

    filterDataset
}


/**
 * availale globally
 */
module.exports = { 
    drawsocketInput,
    sendToServer, // renderer-event
    fairlyUniqueString,

   // send: symbolist_send,

    setClass: symbolist_setClass, 
    setContext: symbolist_setContext,

    getCurrentContext,
    
   // elementToJSON,
    
    translate,
    applyTransform,
    makeRelative,
    startDefaultEventHandlers,
    stopDefaultEventHandlers,
  //  getContextConstraintsForPoint,

    callSymbolMethod,

    ui_api,

    setScrollOffset,

    init,
    input,

    outlet

 }


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * this is a global reference to modules that should be accessable to user scrips 
 */


window.drawsocket = __webpack_require__(207)
window.symbolist = __webpack_require__(216);
window.ui_api = symbolist.ui_api;



})();

/******/ })()
;