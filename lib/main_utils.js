
const fs = require('fs');

function getFilesFromMenuFolderArray(folderArray)
{
    const folder = folderArray[0];
    console.log('loadUserFolder', folder);

    let files = [];

    fs.readdirSync(folder,'utf-8').forEach( file => {
        files.push({
            file,
            type: file.split('.').pop()
        });
    });

    return {
        path: folder,
        files
    }
}


const parseAsync = (obj_str) => {
    return Promise.resolve().then( () => {
      if( typeof obj_str == 'String' )
        return JSON.parse( obj_str )  // max sends a trailing comma for some reason
      else
      {
        let _str = obj_str.toString('utf8');
        return JSON.parse(_str.slice( 0, _str.lastIndexOf('}')+1 ));
      }/*
      else
      {
        return obj_str;
      }*/
    })
  }
  
  module.exports = {
    getFilesFromMenuFolderArray,
    parseAsync
  }