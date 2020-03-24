
function JSONprint(obj)
{
    return JSON.stringify(obj, null, 2 );
}

function getValObject(obj)
{
    const _obj = Array.isArray(obj) ? obj[0] : obj;

    if( _obj.hasOwnProperty('key') && _obj.hasOwnProperty('val') )
        return _obj.val;
    else
        return _obj;

    
}

function getChildByValue(obj, key, val)
{
//    console.log(`getChildByValue input ${JSONprint(obj)} testing for ${key} == ${val}`);
    
    if( Array.isArray(obj) )
    {
        const len = obj.length;
        for(let i = 0; i < len; i++)
        {
            return getChildByValue(obj[i], key, val);
        }
    }        
    else if( obj.hasOwnProperty(key) && obj[key] == val )
    {
        return obj;
    }
    else
    {
        if( obj.hasOwnProperty('children') )
        {
            let found = null;

            for(let i = 0; i < obj.children.length; i++)
            {
                found = getChildByValue(obj.children[i], key, val);
                if( found != null ){
                    return found;
                }
            }
        }
        else if( obj.hasOwnProperty('key') && obj.hasOwnProperty('val') )
        {
            return getChildByValue(obj.val, key, val);
        }
    }

    return null;
}

function matrixFromString(matrix_str) 
{    
    return matrix_str.trim().slice( matrix_str.indexOf("matrix(")+7, matrix_str.length-1 )
                            .split(" ")
                            .map(Number)
}
  
function applyTransform( matrix, xy )
{
    return [    matrix[[0]] * xy[[0]] + matrix[[2]] * xy[[1]] + matrix[[4]], 
                matrix[[1]] * xy[[0]] + matrix[[3]] * xy[[1]] + matrix[[5]]
            ];
}


  /*
  /helper/make/default_infoDisplay = quote(
      lambda([dataobj, bbox],
          {
              /key : "html",
              /val : {
                  /parent : "forms",
                  /new : "div",
                  /style : {
                      /left : bbox./x+"px",
                      /top : bbox./bottom+10+"px"
                  },
                  /id : dataobj./id+"-infobox",
                  /class : "infobox",
                  /children : /helper/make/parms_inputs(dataobj)
              }
          }
      )
  ),
  
  /helper/make/parms_inputs = quote(
      lambda([data],
              map(
                  lambda([param],
                      let({
                              deslashed_name : join("", split("/", param))
                          },
                          if( deslashed_name == "id" || deslashed_name == "class",
                              [{
                                      /new : "span",
                                      /class : "infoparam",
                                      /text : param
                                  }, {
                                      /new : "span",
                                      /class : "infovalue-noedit",
                                      /text : getbundlemember(data, param)
                              }], 
                              # else
                              [{
                                  /new : "label",
                                  /class : "infoparam",
                                  /for : data./id+"-"+deslashed_name+"-input",
                                  /text : param
                              }, {
                                  /new : "input",
                                  /class : "infovalue",
                                  /type : "text",
                                  /id : data./id+"-"+deslashed_name+"-input",
                                  /placeholder : getbundlemember(data, param),
                                  /onkeydown : " if( event.key == 'Enter' ){
                                      drawsocket.send( {
                                          event:  {
                                              key: 'symbolistEvent',
                                              val: {
                                                  id: '"+ data./id +"',
                                                  symbolistAction: 'updateSymbolData',
                                                  param: '"+ param +"',
                                                  value: this.value
                                              }
                                          }
                                      });
                                  }",
                                  /onmousedrag : "
                                      console.log(event);
                                  "
                              }]
                              
                          )
                      )
                  ), getaddresses(data)
              )
          
      )
  )*/



module.exports = {
    matrixFromString,
    getChildByValue,
    applyTransform,
    JSONprint,
    getValObject
  }
