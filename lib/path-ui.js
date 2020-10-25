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
 *  */


//import { toPath } from 'svg-points'
//const toPath = SVGPoints.toPath
// to path is in the drawsocket wrapper, so we can use points instead

const main_svg = document.getElementById('main-svg');

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
        let lastpt = pts[pts.length - 1];

        drawsocket.input({
            key: "svg",
            val: {
                new: "line",
                x1 : lastpt.x,
                y1: lastpt.y,
                x2: e.clientX,
                y2: e.clientY,
                id: "preview-line"
            }
        })
    }
    
    //console.log('move', e.clientX, e.clientY);
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
    
    console.log('new point', pts);

    const viewObj = document.getElementById(dataObj.data.id);
    symbolist.send( {
        key: 'symbolistEvent',
        val: {
            symbolistAction: 'updateSymbolData',
            class: dataObj.data.class,
            id: dataObj.data.id,
            param: "points",
            value: pts,
            view_context: symbolist.getObjViewContext( viewObj )
        }
    });


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

function enter( dataContext, referenceLocation )
{
    dataObj = dataContext;

    if(dataObj.data.points)
    {
        pts = dataObj.data.points;
    }

    startingPos = referenceLocation;

    console.log('hello world!! starting custom UI');
    symbolist.stopDefaultEventHandlers();

    window.addEventListener("mousedown", down, true);
    window.addEventListener("mousemove", move, true);
    window.addEventListener("mouseup", up, true);

    document.body.addEventListener("keydown", keyDown, true);

    // create new UI (probably should be on separate layer)
    drawsocket.input({
        key: "svg",
        val: {
            new: "circle",
            cx: startingPos.x,
            cy: startingPos.y,
            r: 10,
            id: "drawmode-start-idx",
            fill: "none",
            stroke: "black"
        }
    })
}


function exit()
{

    // clean up, removing the UI graphics we made above
    drawsocket.input({
        key: "remove",
        val: [ "drawmode-start-idx", "preview-line"]
    })

    window.removeEventListener("mousedown", down, true);
    window.removeEventListener("mousemove", move, true);
    window.removeEventListener("mouseup", up, true);

    document.body.removeEventListener("keydown", keyDown, true);

    symbolist.startDefaultEventHandlers();
    console.log('goodbye world!! exiting custom UI');

}

module.exports = {
    enter,
    exit
}
