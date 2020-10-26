/**
 * how does this get to renderer window?
 * 
 * not sure of the right sequence yet,...
 * the palette button can call the enter function -- but we will need to resolve the path, 
 * so maybe it makes sense to add the UI to the defs -- or include the whole thing in the main def
 * but it's better/easier to keep the UI as a separate file and use the require() in the renderer
 * (which can also be deleted from the require.cache later)
 * 
 * 
 * so maybe the newFromClick function can return a message to the controller to start the custom UI
 * then the controller sends the renderer the custom UI file with the right file path which we got when
 * we were loading the def from the json file
 * 
 * 
 * 
 * new idea, better would be to load the interface when you select the symbol type in the palette
 * then make callbacks for "new from click", or other key event listners
 * this makes it easier to handle different typeps of actions
 * 
 * ok -->> going for this approach now
 * def will call script functions
 * palette change will trigger loading js file
 * 
 * ah, but every time you select a new object, the UI will change,
 * so I think that means we need to store all of the UI scripts in the browser
 * 
 * 
 * 
 * could be neater later to use import instead of require since then we can import just the GUI part
 * or just the data part, rather than needing two separate files (or require in both contexts and only use the parts we need?)
 * 
 * it does get a little long so maybe it's ok this way...
 * 
 *  */



//import { toPath } from 'svg-points'
//const toPath = SVGPoints.toPath
// to path is in the drawsocket wrapper, so we can use points instead


let pts = [];

let startingPos = {x: 0, y: 0}


/**
 * obj sent from new controller (probably from new from click)
 * that contains the absolute file path of this file, and the data object
 * which importantly contains the id of the object we are manipulating
 * we need the id so that we can update the values of the data object in the model
 */
let dataObj = {};

function move(e)
{
    if( pts.length > 0 )
    {

        if( e.buttons == 1 ) // drag
        {
            pts[pts.length - 1].curve = {
                type: 'quadratic',
                x1: e.clientX,
                y1: e.clientY
            }

            drawsocket.input(
            {
                key: "svg",
                val: [
                    HandleRect(e.clientX, e.clientY, `quad-${pts.length - 1}`),
                    {
                        id: "path-preview",
                        points: pts
                    },
                    {
                        id: `quad-${pts.length - 1}-connector`,
                        parent: "path-preview-group",
                        new: "path",
                        "stroke-dasharray" : 1,
                        points: [{
                            x: pts[pts.length - 2].x,
                            y: pts[pts.length - 2].y
                        }, 
                        {
                            x: e.clientX,
                            y: e.clientY
                        }, 
                        {
                            x: pts[pts.length - 1].x,
                            y: pts[pts.length - 1].y
                        }]
                    }
                ]
            })
          
        }
        else
        {
            let lastpt = pts[pts.length - 1];

            // preview line
            drawsocket.input({
                key: "svg",
                val: {
                    new: "line",
                    parent: "path-preview-group",
                    id: "preview-line",
                    x1 : lastpt.x,
                    y1: lastpt.y,
                    x2: e.clientX,
                    y2: e.clientY,
                    "stroke-dasharray" : 1
                }
            })
        }
        
    }
    
    //console.log('move', e.clientX, e.clientY);
}


function HandleRect(x,y, idx) {
    const r = 5;
    const d = r * 2;
    return {
        new: "rect",
        parent: "path-preview-group",
        x: x - r,
        y: y - r,
        width: d,
        height: d,
        id: `handle-${idx}`,
        onclick: `console.log( "selected", this.id )`
    }
}

function down(e)
{
    let newPt = {
        x: e.clientX, 
        y: e.clientY
    };
    
    if( pts.length == 0 )
        newPt.moveTo = true;

    pts.push( newPt );

    drawsocket.input([
        {
            key: "remove",
            val: "preview-line"
        },
        {
            key: "svg",
            val: [
                {
                    id: "path-preview",
                    points: pts
                },
                HandleRect(newPt.x, newPt.y, pts.length - 1)
            ]
        }        
    ])

    
    console.log('new point', pts);

}



function up(e)
{

}

function keyDown(event)
{
    let nmods =  event.altKey + event.shiftKey + event.ctrlKey + event.metaKey;
    switch( event.key )
    {
        case "Escape":
            exit();
            break;
    }    
}


/**
 * required enter and exit functions to start and stop the UI
 * passed the mousedown_pos from the renderer script to get started,
 * we could potentially add other context info here if needed
 */

function enter( dataContext )
{
    dataObj = dataContext;

    if(dataObj.points)
    {
        pts = dataObj.points;
    }
    else
    {
        console.error('no points found for editing');
        return;
    }

    console.log('hello world!! starting custom UI', pts);

    symbolist.stopDefaultEventHandlers();

    window.addEventListener("mousedown", down, true);
    window.addEventListener("mousemove", move, true);
    window.addEventListener("mouseup", up, true);
    document.body.addEventListener("keydown", keyDown, true);

    // iterate existing points and make handles

    let handles = [];
    pts.forEach( (p, i) => {
        handles.push( HandleRect(p.x, p.y, i) );

        if( p.curve && p.curve.type == "quadratic")
        {
            handles.push( HandleRect( p.curve.x1, p.curve.y1, `quad-${i}`) );
            handles.push( {
                id: `quad-${i}-connector`,
                parent: "path-preview-group",
                new: "path",
                "stroke-dasharray" : 1,
                points: [{
                    x: pts[i-1].x,
                    y: pts[i-1].y
                }, 
                {
                    x: p.curve.x1,
                    y: p.curve.y1
                }, 
                {
                    x: p.x,
                    y: p.y
                }]
            })
        }
    })

    // create new UI (probably should be on separate layer)
    drawsocket.input([
        {
            key: "svg",
            val: {
                new: "g",
                id : "path-preview-group",
                children : [
                    {
                        new: "path",
                        id: "path-preview",
                        points: dataObj.points
                    },
                    ...handles
                ]
            }
        }
    ])
}


function exit()
{

    // clean up, removing the UI graphics we made above
    drawsocket.input({
        key: "remove",
        val: "path-preview-group"
    })

    // update the edited symbol
    const viewObj = document.getElementById(dataObj.id);
    symbolist.send( {
        key: 'symbolistEvent',
        val: {
            symbolistAction: 'updateSymbolData',
            class: dataObj.class,
            id: dataObj.id,
            param: "points",
            value: pts,
            view_context: symbolist.getObjViewContext( viewObj )
        }
    });

    window.removeEventListener("mousedown", down, true);
    window.removeEventListener("mousemove", move, true);
    window.removeEventListener("mouseup", up, true);
    document.body.removeEventListener("keydown", keyDown, true);

    symbolist.startDefaultEventHandlers();

    console.log('goodbye world!! exiting custom UI');

}


function enterEditMode( dataObj ) 
{
    enter(dataObj);
}

function onselection()
{}

function edit()
{}

module.exports = {
    enter,
    exit,
    enterEditMode
}
