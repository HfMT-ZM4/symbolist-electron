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
