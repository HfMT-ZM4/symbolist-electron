const opentype = require('opentype.js');

const font = opentype.loadSync('/Users/r/Documents/dev-lib/symbolist-electron/css/fonts/Bravura.ttf');

let bravuraUnicode = new Map();

for(let i = 0; i < font.glyphs.length; i++)
{
 //   console.log(font.glyphs.get(i).name);
    bravuraUnicode.set(font.glyphs.get(i).name, font.glyphs.get(i));

}
let bbox = bravuraUnicode.get('uniE2C2').getPath(0,0,23).getBoundingBox() ;

console.log(bbox ) //.getPath( ).toPathData() 
console.log( -bbox.y1 + bbox.y2 ) //.getPath( ).toPathData() 

// this does work, but you need to amke sure you have the right font size
//font.charToGlyph( f.innerHTML ).getPath(0,0,window.getComputedStyle(f).fontSize).getBoundingBox()

/**
 * could do something like check if the font family is bravura and then 
 */
// window.getComputedStyle(f).fontFamily