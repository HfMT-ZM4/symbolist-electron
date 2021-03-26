

function make_parms_inputs(element)
{
    // note we can't store the dataobj or element because the instance changes after updating
    let infoBoxChildren = [];
    let id = element.id;
    let dataobj = {
        id,
        class: element.classList[0],
        ...element.dataset
    }
    
   console.log('make_parms_inputs', JSON.stringify(dataobj));

    Object.keys(dataobj).map(param => {
        
        if( param == 'id' || param == 'class' || param == 'parent')
        {
            infoBoxChildren = infoBoxChildren.concat( [{
                    new : "span",
                    class : "infoparam",
                    text : param
                }, {
                    new : "span",
                    class : "infovalue-noedit",
                    text : dataobj[param]
                }])
        }
        else
        {
            infoBoxChildren = infoBoxChildren.concat( [{
                new : "label",
                class : "infoparam",
                for : id+"-"+param+"-input",
                text : param
            }, {
                new : "input",
                class : "infovalue",
                type : "text",
                id : id+"-"+param+"-input",
                value : dataobj[param],
                onkeydown : (event) => {
                    console.log(event.key);
                    if( event.key == 'Enter' || event.key == 'Tab' )
                    {
                        const viewObj = document.getElementById(`${id}`);
                        viewObj.dataset[param] = event.target.value;
                        console.log(param, viewObj.dataset[param]);
                        // data is sent to io_controller from here
                        symbolist.callSymbolMethod(viewObj, "updateFromDataset");
                     
                        event.target.blur();
                    }
                    else if( event.key == 'Escape' )
                    {
                        const viewObj = document.getElementById(`${id}`);
                        event.target.value = viewObj.dataset[param];
                        event.target.blur();
                    }
                },
                onblur: (event) => {
                    const viewObj = document.getElementById(`${id}`);
                    if( viewObj.dataset[param] != event.target.value )
                    {
                        viewObj.dataset[param] = event.target.value;
                        // data is sent to io_controller from here
                        symbolist.callSymbolMethod(viewObj, "updateFromDataset");
                    }
                    
                    symbolist.startDefaultEventHandlers();
                },
                onfocus: 'symbolist.stopDefaultEventHandlers()'
            }] )
        }
    });

    return infoBoxChildren;

}

// scroll offset could be abstracted in the ui_controller
// rather than having user scripts need to get the offset 
function defaultInfoDisplay(viewObj, bbox)
{
    return {
              key : "html",
              val : {
                  parent : "floating-forms",
                  new : "div",
                  style : {
                      left : `${bbox.x}px`,
                      top : `${bbox.bottom}px`
                  },
                  id : viewObj.id+"-infobox",
                  class : "infobox",
                  children : make_parms_inputs(viewObj)
              }
          }
}

module.exports = { defaultInfoDisplay }