
const OSC_HEADER_SIZE = 16 // bundle\0 + 8 byte timetag.
const OSC_IDENTIFIER = "#bundle\0"
const OSC_IDENTIFIER_SIZE = 8
const OSC_EMPTY_HEADER = "#bundle\0\0\0\0\0\0\0\0\0"

const OSC_ID = OSC_IDENTIFIER
const OSC_ID_SIZE = OSC_IDENTIFIER_SIZE

const OSC_BUNDLE_TYPETAG = '.'
const OSC_TIMETAG_TYPETAG = 't'


/**
 * 
 * @param {String} s 
 */
function getPaddedStringLen(s)
{
	if(!s){
		return 0;
    }
    
    let n = Buffer.byteLength(s, 'utf8');
    n = (n + 4) & 0xfffffffc;
	return n;
}

function getPaddingForNBytes(n)
{
	return (n + 4) & 0xfffffffc;
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
            return getObjSize(val);
        default:
            return 0;
    }
}


function getObjSize(obj)
{
    let _n = 0;
    
    Object.keys(obj).forEach( key => {
        _n += 4;
        _n += getPaddedStringLen( key + 1 ); // (added leading slash)
        
        let val = obj[key];
        if( !Array.isArray(val) ) 
            val = [val];

        _n += getPaddingForNBytes( val.length + 1 );
        
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

    let _n = 0;
   //let addresslen = address.length;
    let padded_address_len = getPaddedStringLen(address);
    let padded_typetag_len = getPaddingForNBytes(vec.length + 1);
    let num_bytes_before_data = 4 + padded_address_len + padded_typetag_len;

    if(remaining_size < num_bytes_before_data){
        console.log('out of buffer space');
        return 0;
    }

    _n = num_bytes_before_data;

    let prefix_pos = offset + 4;
    //let data_pos = num_bytes_before_data;

   // char *ptr = buf;
   // memset(ptr, '\0', num_bytes_before_data);
    //ptr += 4;
    
    //memcpy(ptr, address, addresslen);
    buf.write(address, prefix_pos);

    prefix_pos += padded_address_len;
    
   // char *ttptr = ptr;
   // ptr += padded_typetag_len; // << ptr now equal to data_pos
   // *ttptr++ = ',';
    buf.write(',', prefix_pos++)
    
    const vec_len = vec.length;

    for( let i = 0 ; i< vec_len; i++ )
    {
        const at = vec[i];
        
        const typetag = getOSCTypeTag(at);

        buf.write(typetag, prefix_pos++);

        switch (typetag) {
            case 'd':
                _n = buf.writeDoubleBE( at, _n ); // returns _n + bytes written
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
    
    let write_bytes = buf.writeInt32BE(_n - 4, offset);
    console.log('setting message size: ', _n - 4, write_bytes);

    //*((int32_t *)buf) = hton32((int32_t)_n - 4);
    
    return _n;
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
    
    let size_ = getOSCSize(test);
    let buf_ = Buffer.alloc( size_ );
    
    serializeIntoBuffer( test, buf_, size_ );
    
    for( let i = 0; i < size_; i++)
    {
        console.log(`${i} ${buf_[i]}` )
    }
    
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