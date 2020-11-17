const osc = require('osc')

/** {
        // Tags this bundle with a timestamp that is 60 seconds from now.
        // Note that the message will be sent immediately;
        // the receiver should use the time tag to determine
        // when to act upon the received message.
        timeTag: osc.timeTag(60),

        packets: [
            {
                address: "/carrier/frequency",
                args: [
                    {
                        type: "f",
                        value: 440
                    }
                ]
            },
            {
                address: "/carrier/amplitude",
                args: [
                    {
                        type: "f",
                        value: 0.5
                    }
                ]
            }
        ]
    })*/

// function isNumeric(value) {
//     return !isNaN(value - parseFloat(value));
// }

const js2osc = function(jsObj)
{

     let packets = Object.keys(jsObj).map( key => {

        let src = Array.isArray(jsObj[key]) ? jsObj[key] : [ jsObj[key] ];
        args = src.map(el => {
            const f = parseFloat(el);
            const numeric = !isNaN(el - f);
            const value = numeric ? f : el;
            const type = numeric ? 'f' : 's';
            return {
                type,
                value
            }
        });

        return {
            address: `/${key}`,
            args
        }
    })

    return osc.writePacket({
        timeTag: osc.timeTag(0),
        packets
    })
}

module.exports = { js2osc }