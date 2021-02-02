const names_lower = ["c",   "c#",   "db",   "d",    "d#",   "eb",   "e",    "f",    "f#",   "gb",   "g",    "g#",   "ab",   "a",    "a#",   "bb",   "b" ];
const names_step =  [ 0,    1,      1,      2,      3,      3,      4,      5,      6,      6,      7,      8,      8,      9,      10,     10,     11];

const names_lower_flats = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b" ];
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
   
}

//test();

module.exports = {
    ntom,
    mton
}