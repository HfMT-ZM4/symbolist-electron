const svgObj = document.getElementById("svg");
const mainSVG = document.getElementById("main-svg");

const { cloneObj } = require("./ui_utils");

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