const {ipcRenderer} = require('electron')
const drawsocket = require('./drawsocket_wrapper.js')
/*
let main = d3.select("#main-html");
let drawing = d3.select("#main-svg"); // svg group drawing layer
let mainSVG = d3.select("#svg"); // actual svg
let maindef = d3.select("#defs");
let forms = d3.select("#forms");
*/

document.addEventListener('mousemove', (event) => {
  // ipcRenderer.send('mousemove', [event.clientX, event.clientY] )
})

ipcRenderer.on('draw-input', (event, arg) => {
  console.log(`received ${arg}`);
  
  drawsocket.input(arg)
})

/*
main.node().addEventListener("click", (event => {
  ipcRenderer.send('click', "le click")
}));


function getHTML_element(node)
{

  let el = null;
  let isNew = true;
  if( node.hasOwnProperty('id') )
  {
    el = d3.select(`#${node.id}`);
    isNew = false;
  }

  if( node.hasOwnProperty('new') )
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
      else // regular attribute
        el.attr(prop, node[prop]);

    }

  }

  return { node: el.node(), new: isNew };
}



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
  let el = null;
  let isNew = true;
  if( node.hasOwnProperty('id') )
  {
    el = d3.select(`#${node.id}`);
    isNew = false;
  }

// new tag means "make a new svg node"
  if( node.hasOwnProperty('new') )
  {
    if( el !== null){
//      console.log("should delete", el);
      el.remove();
    }
      
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
          el.attr('d',  SVGPoints.toPath(node.points));
        }
        else if( prop === "child" || prop === "children" || prop === "text" || prop === "html")
        {
 
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

      if( _isNew )
      {

        let _context = null;
        if( node.hasOwnProperty('parent') )
        {
          _context = d3.select(`#${node.parent}`);
          //console.log("found parent context ", node.parent);
          
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
    

//  console.log(iter_obj_arr);

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

        default:
            console.log("unrouted command key:", key, objValue );
            wasHandled = false;
        break;
      }

    }
  }

  */