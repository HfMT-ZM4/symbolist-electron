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

const drawsocket_wrapper = require("../drawsocket_wrapper");



//import { toPath } from 'svg-points'
//const toPath = SVGPoints.toPath
// to path is in the drawsocket wrapper, so we can use points instead

const main_svg = document.getElementById('main-svg');

let pts = [];

let startingPos = {x: 0, y: 0}

function move(e)
{
    drawsocket.input({
        key: "svg",
        val: {
            r: Math.abs(startingPos.x - e.clientX),
            id: "drawmode-start-idx"
        }
    })
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

function enter( objectID, referenceLocation )
{
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
        val: "drawmode-start-idx",
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
