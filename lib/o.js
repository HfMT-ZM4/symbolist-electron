
const OSC_HEADER_SIZE = 16 // bundle\0 + 8 byte timetag.
const OSC_IDENTIFIER = "#bundle\0"
const OSC_IDENTIFIER_SIZE = 8
const OSC_EMPTY_HEADER = "#bundle\0\0\0\0\0\0\0\0\0"

const OSC_ID = OSC_IDENTIFIER
const OSC_ID_SIZE = OSC_IDENTIFIER_SIZE

const OSC_BUNDLE_TYPETAG = '.'
const OSC_TIMETAG_TYPETAG = 't'


function getPaddedStringLen(s)
{
	if(!s){
		return 0;
    }
    
    let n = Buffer.byteLength(s, 'utf8');
    n = (n + 4) & 0xfffffffc;
    //n += 4; 
    //while(n % 4){n++;}

	return n;
}

function getPaddingForNBytes(n)
{
    //n += 4; 
    //while(n % 4){n++;}
    n = (n + 4) & 0xfffffffc;

	return n;//(n + 4) & 0xfffffffffffffffc;
}



function getOSCTypeTag(val)
{
    // index matches order of types in variant template
    switch (typeof val) {
        case 'number':
            return 'd';
        case 'string':
            return 's';  
        case 'object':
            return '.';
        default:
            console.log("unknown type");
            return '?';
    }
}


function getSizeInBytes(val)
{
    switch (typeof val) {
        case 'number':
            return 8;
        case 'string':
            return getPaddedStringLen(val);  
        case 'object':
            return 0;//getObjSize(val);
        default:
            return 0;
    }
}


function getObjSize(obj)
{
    let _n = 0;
    
    Object.keys(obj).forEach( key => {
        _n += 4; // size field
        _n += getPaddedStringLen( key + 1 ); // address field with added leading slash
        
        let val = obj[key];
        if( !Array.isArray(val) ) 
            val = [val];

        _n += getPaddingForNBytes( val.length + 1 ); // typetag field with added leading comma
        
        val.forEach( at => {
            _n += getSizeInBytes(at);
        })
         
    })
    
    
    return _n;
}

/**
 * 
 * @param {Map} map 
 */

function getOSCSize(obj)
{
    let _n = OSC_HEADER_SIZE;
    _n += getObjSize(obj);
    return _n;
}


function serializeVector(buf, offset, remaining_size, address, vec )
{

    let _n = offset; // offset in buffer to start at
    let padded_address_len = getPaddedStringLen(address);
    let padded_typetag_len = getPaddingForNBytes(vec.length + 1);
    console.log('padded_typetag_len', padded_typetag_len, vec.length);
    let num_bytes_before_data = 4 + padded_address_len + padded_typetag_len;

    if(remaining_size < num_bytes_before_data){
        console.log('out of buffer space');
        return 0;
    }

    _n += num_bytes_before_data;

    let prefix_pos = offset + 4;
 
    buf.write(address, prefix_pos);

    prefix_pos += padded_address_len;
  
    buf.write(',', prefix_pos++)
    
    const vec_len = vec.length;

    for( let i = 0 ; i< vec_len; i++ )
    {
        const at = vec[i];
        
        const typetag = getOSCTypeTag(at);

        buf.write(typetag, prefix_pos++);

        switch (typetag) {
            case 'd':
                console.log('pre', _n);
                _n = buf.writeDoubleBE( at, _n ); // returns _n + bytes written
                console.log('post', _n);
                break;
            case 's':
                buf.write( at, _n );
                _n += getPaddedStringLen( at );
                break;
            case '.':
                console.log('do sub bundle here');
                break;
            default:
                console.log('unused type:', typetag);
                break;
        }
        
    }
    
    buf.writeInt32BE(_n - 4 - offset, offset);

    console.log('setting message size: ', _n - 4 - offset);

    //*((int32_t *)buf) = hton32((int32_t)_n - 4);
    
    return _n - offset;
}


function serializeIntoBuffer(obj, buf, size)
{
    let _n = 0;    

    buf.write(OSC_EMPTY_HEADER);
  
    _n += OSC_HEADER_SIZE;

    const keys = Object.keys(obj);
    
    let vec;
    for (key of keys)
    {
        vec = obj[key];
        vec = Array.isArray(vec) ? vec : [ vec ];
        _n += serializeVector(buf, _n, size - _n, '/'+key, vec );
    }
    //console.log(_n);
}


function test()
{

    let test = {
        ho: 1,
        f: "yo", 
        sub: {
            b: 'bob',
            bar: 2
        }
    }
    
    let test2 = {
        foo: 1,
        bar: 2
    }

    let size_ = getOSCSize(test2);
    let buf_ = Buffer.alloc( size_ );
    
    serializeIntoBuffer( test2, buf_, size_ );
    
    for( let i = 0; i < size_; i++)
    {
        console.log(`${i} \t${buf_[i]} \t${String.fromCharCode(buf_[i]) }` )
    }

    console.log( size_, buf_.length );    
}

function obj2osc(obj)
{
    let size = getOSCSize(obj);
    let buf = Buffer.alloc( size );
    
    serializeIntoBuffer( obj, buf, size );
    
    return buf;
}

test();

module.exports = {
    serializeIntoBuffer,
    getOSCSize,

    obj2osc
}