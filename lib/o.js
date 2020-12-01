
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

function getOSCTypeTagFromJS(val)
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
            console.error("unknown type");
            return '?';
    }
}

function getSizeInBytesFromJS(val)
{
    switch (typeof val) {
        case 'number':
            return 8;
        case 'string':
            return getPaddedStringLen(val);  
        case 'object':
            return getOSCSize(val) + 4; // plus four for bundle size field
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
            _n += getSizeInBytesFromJS(at);
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
  //  console.log('padded_typetag_len', padded_typetag_len, vec.length);
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
        
        const typetag = getOSCTypeTagFromJS(at);

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
                {
                    let sub = obj2osc( at );
                    _n = buf.writeInt32BE(sub.length, _n);
//                    console.log('size', sub.length, buf.length, _n);
                    sub.copy( buf, _n );
                    _n += sub.length;
                }
                break;
            default:
                console.log('unused type:', typetag);
                break;
        }
        
    }
    
    buf.writeInt32BE(_n - 4 - offset, offset);

//    console.log('setting message size: ', _n - 4 - offset);
    
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

function c_strlen(str)
{
    let i = 0;
    while( i < str.length )
    {
        if( str[i++] == '\0' )
            return i-1;
    }

    return i;
}


function getSizeInBytesFromOSC(typetag, buffer, data_offset)
{
    switch (typetag) {
        case 'f':
        case 'c':
        case 'i':
            return 4;
        case 'd':
        case 'h':
            return 8;
        case 's':
            {
                let end = buffer.indexOf('\0', data_offset);
                let str = buffer.toString('utf8', data_offset, end);
                return getPaddedStringLen(str);  
            }
        case '.':
            return buffer.readInt32BE(data_offset) + 4;
        default:
            return 0;
    }
}

function getDataAndSize(typetag, buffer, data_offset)
{
    switch (typetag) {
        case 'f':
            return {
                data: buffer.readFloatBE(data_offset),
                bytes: 4
            };
        case 'c':
            return {
                data: String.fromCharCode(buffer[data_offset]),
                bytes: 4
            };
        case 'i':
            return {
                data: buffer.readInt32BE(data_offset),
                bytes: 4
            };
        case 'd':
            return {
                data: buffer.readDoubleBE(data_offset),
                bytes: 8
            };
        case 'h':
            return {
                data: buffer.readBigInt64BE(data_offset),
                bytes: 8
            };
        case 's':
            {
                let end = buffer.indexOf('\0', data_offset);
                let str = buffer.toString('utf8', data_offset, end);
                return {
                    data: str,
                    bytes: getPaddedStringLen(str)
                };
            }
        case '.':
            {
                let sub_size = buffer.readInt32BE(data_offset);
                console.log('sub_size', sub_size);
                return {
                    data: deserialize( buffer.subarray( data_offset + 4, sub_size) ),
                    bytes: sub_size + 4
                };
            }
        default:
            return 0;
    }
}

function deserialize(buf)
{
    let _n = OSC_HEADER_SIZE;

    while( _n < buf.length )
    {
        let msg_size = buf.readInt32BE(_n);

        let addr_start = _n + 4;
        let addr_end = buf.indexOf('\0', addr_start);
        let addr = buf.toString('utf8', addr_start, addr_end);
        
        let typetags_start = addr_start + getPaddedStringLen(addr);
        let typetags_end = buf.indexOf('\0', typetags_start);
        let typetags = buf.toString('utf8', typetags_start, typetags_end);

        console.log(addr, typetags_start, typetags);

        let data_start = typetags_start + getPaddedStringLen(typetags);
        let bytes_to_next = 0;

        for( let i = 1; i < typetags.length-1; i++)
        {
            let data_chunk = getDataAndSize( typetags[i], buf, data_start + bytes_to_next)
            bytes_to_next = data_chunk.bytes;

            console.log( typetags[i], data_chunk.data );
        }

        _n += msg_size + 4;
    }
}


function test()
{

    let test = {
        ho: 1,
        sub: {
            bar: 2
        }
    }
    
    let test2 = {
        foo: 1,
        bar: 2
    }

    let size_ = getOSCSize(test);
    let buf_ = Buffer.alloc( size_ );
    
    serializeIntoBuffer( test, buf_, size_ );
    for( let i = 0; i < size_; i++)
    {
        console.log(`${i} \t${buf_[i]} \t${String.fromCharCode(buf_[i]) }` )
    }


    deserialize(buf_);

   /* 
    console.log( size_, buf_.length );    
    */
}

function obj2osc(obj)
{
    let size = getOSCSize(obj);
    let buf = Buffer.alloc( size, '\0' );
    
    serializeIntoBuffer( obj, buf, size );
    
    return buf;
}

test();

module.exports = {
    serializeIntoBuffer,
    getOSCSize,

    obj2osc
}

/*
let str = "foo bar";

console.log( c_strlen(str) );
*/