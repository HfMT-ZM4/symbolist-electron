let dataobj = {
    foo: 1,
    bar: 2
};

let test = Object.keys(dataobj).map(param => {
                            
    if( param == 'id' || param == 'class' || param == 'parent') 
    {}
    else
    {
        return [{
            new : "label",
            class : "infoparam",
            for : param,
            text : param
        }, {
            new : "input",
            class : "infovalue",
            type : "text",
            id : param,
            value : dataobj[param],
            onkeydown : (event) => {
                if( event.key == 'Enter' )
                {
                    dataobj[param] = event.target.value;
                    console.log('dataobj', dataobj);
                }
            },
            onmousedrag : `
                console.log(event);
            `
        }]
    }
}).flat();

console.log(test);