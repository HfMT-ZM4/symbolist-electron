

function make_parms_inputs(element)
{
    // note we can't store the dataobj or element because the instance changes after updating
    let infoBoxChildren = [];
    let id = element.id;
    let dataobj = element.dataset;

   // console.log('make_parms_inputs', JSON.stringify(dataobj));

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
                    if( event.key == 'Enter' )
                    {
                        const viewObj = document.getElementById(`${id}`);
                        viewObj.dataset[param] = event.target.value;
                        // data is sent to io_controller from here
                        symbolist.callSymbolMethod(viewObj, "updateFromDataset");
                    }
                },
                onblur: 'symbolist.startDefaultEventHandlers()',
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