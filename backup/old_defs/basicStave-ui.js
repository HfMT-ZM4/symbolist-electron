// maybe merge into one module with model def later

let pts = [];

let downTarget = null;
let currentPosition = {x: 0, y: 0}

let dataObj = {};


function move(e)
{

    currentPosition = {
        x: e.clientX,
        y: e.clientY
    }

    if( downTarget == null )
        return;
    
    

    //console.log('move', e.clientX, e.clientY);
}


function down(e)
{
    currentPosition = {
        x: e.clientX,
        y: e.clientY
    }

    downTarget = e.target;

    if( e.metaKey )
    {

        // new from click
        
        console.log('new point', pts);
    }


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
        case "Meta":
            break;
        default:
            break;
    }    
}


function keyUp(event)
{
    switch( event.key )
    {
        case "Meta":
            drawsocket.input({
                key: "remove",
                val: "preview-line"
            })
            break;
        default:
            break;
    }  
}

/**
 * required enter and exit functions to start and stop the UI
 * passed the mousedown_pos from the renderer script to get started,
 * we could potentially add other context info here if needed
 */

function enter()
{

    console.log('hello world!! starting custom UI basicStave');

    //symbolist.stopDefaultEventHandlers();

    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    document.body.addEventListener("keydown", keyDown);
    document.body.addEventListener("keyup", keyUp);

    // iterate existing points and make handles

}


function exit()
{

    window.removeEventListener("mousedown", down);
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    document.body.removeEventListener("keydown", keyDown);
    document.body.removeEventListener("keyup", keyUp);

    //symbolist.startDefaultEventHandlers();

    console.log('goodbye world!! exiting custom UI basicStave');

}


function enterEditMode( dataObj ) 
{
    dataObj = dataContext;

    enter(dataObj);
}

function onselection()
{}

function edit()
{}

function enterCreationMode()
{
    
}

function getConstraintsForPoint(contextObj, pt)
{
    const staffline = contextObj.querySelector('.basic-staffline');
    let y = staffline.getAttribute('y1');
    return {
        x: pt.x,
        y
    }
}

module.exports = {
    enter,
    exit,
    enterEditMode,
    enterCreationMode,
    getConstraintsForPoint
}
