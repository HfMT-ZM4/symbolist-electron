
//import { toPath } from 'svg-points'
const toPath = SVGPoints.toPath


let Point = (x, y) => { return { x, y } };

const main_svg = document.getElementById('main-svg');

let pts = [];


function move(e)
{
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

    console.log( toPath(pts) );
    
}

function up(e)
{

}

window.addEventListener("mousedown", down);
window.addEventListener("mousemove", move);
window.addEventListener("mouseup", up);