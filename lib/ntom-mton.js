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

/**
 * 
 * @param {String} ratio ratio, e.g. 2/3
 */
function ratio2float(ratio)
{
    const divIdx = ratio.indexOf('/');
    return Number(ratio.slice(0, divIdx)) / Number(ratio.substr(divIdx+1));
}


function parseRatioStr(ratioStr)
{
    const divIdx = ratioStr.indexOf('/');
    return[ Number(ratioStr.slice(0, divIdx)), Number(ratioStr.substr(divIdx+1)) ];
}

/**
 * 
 * @param {String} ratio ratio, e.g. 2/3
 */
function reduceRatio(ratio)
{
    const divIdx = ratio.indexOf('/');
    const num = Number(ratio.slice(0, divIdx));
    const den = Number(ratio.substr(divIdx+1));

    const divisor = gcd(num, den);
    return [ num/divisor, den/divisor ];
}


function mtof(midi, a4 = 440)
{
    return a4 * Math.pow(2., ( midi - 69) / 12 )
}

function ftom(hz, a4 = 440)
{
    return 69. + 17.31234050465299 * Math.log( hz / a4 );
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
 
    console.log( ratio2float("12/33") );

}

/**
 * 
 * @param {Number} a numerator
 * @param {Number} b denominator
 */
function gcd(a, b) {
    // fast GCD aka Binary GCD
    if (a === 0) return b;
    if (b === 0) return a;
    if (a === b) return a;
    // remove even divisors
    var sa = 0;
    while (!(a & 1)) sa++, a >>= 1;
    var sb = 0;
    while (!(b & 1)) sb++, b >>= 1;
    var p = sa < sb ? sa : sb; // Power part of 2^p Common Divisor
    // euclidean algorithm: limited only odd numbers
    while (a !== b) {// both a and b should be odd
        if (b > a) {var t = a; a = b; b = t;} // swap as a > b
        a -= b; // a is even because of odd - odd
        do a >>= 1; while (!(a & 1)); // a become odd
    }
    return a << p; // Odd-Common-Divisor * 2^p
}

const isPrime = num => {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num > 1;
}

function getFactors(num) {
    const isEven = num % 2 === 0;
    let inc = isEven ? 1 : 2;
    let factors = []; // 1, num
  
    for (let curFactor = isEven ? 2 : 3; Math.pow(curFactor, 2) <= num; curFactor += inc) 
    {
      if (num % curFactor !== 0) continue;
      factors.push(curFactor);
      let compliment = num / curFactor;
      if (compliment !== curFactor) factors.push(compliment);
    }
  
    return factors.sort((a,b) => a - b);
}

function getAllFactorsFor(remainder) {
    var factors = [], i;

    for (i = 2; i <= remainder; i++) {
        while ((remainder % i) === 0) {
            factors.push(i);
            remainder /= i;
        }
    }

    return factors;
}


function getPrimeCoefs(n, limit = 13)
{
    let factors = getAllFactorsFor(n);

    let primeCoefs = {};

    factors.forEach( f => {
        if( f <= limit )
        {
            if( primeCoefs.hasOwnProperty(f) )
            {
                primeCoefs[f]++;
            }
            else
            {
                primeCoefs[f] = 1;
            }
        }
    })

    return primeCoefs;

}

function getRatioPrimeCoefs( num, den, limit = 13)
{

    let numPrimes = getPrimeCoefs(num);
    let denPrimes = getPrimeCoefs(den);

    Object.keys(denPrimes).forEach( p => {
        if( typeof numPrimes[p] !== 'undefined' )
        {
            numPrimes[p]--;
            denPrimes[p]--;

            if( numPrimes[p] == 0 )
                delete numPrimes[p];
            
            if( denPrimes[p] == 0 )
                delete denPrimes[p];

        }
    });

    return {
        num: numPrimes,
        den: denPrimes
    }
}

//console.log( getRatioPrimeCoefs(3*5*5, 8) );


//test();

module.exports = {
    ntom,
    mton,
    mtof,
    ftom,
    ratio2float,
    gcd,
    parseRatioStr,
    reduceRatio,
    getRatioPrimeCoefs
}