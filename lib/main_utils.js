
const fs = require('fs');
const path = require('path')
const os = require('os')

function getFilesFromMenuFolderArray(folder)
{

    folder = folder.replace(/^~/, os.homedir());

    const fullpath = path.normalize( path.isAbsolute(folder) ? folder : path.resolve('./', folder) );

   // const folder = folderArray[0];
    console.log('loadUserFolder', fullpath);

    let files = [];

    fs.readdirSync(fullpath, 'utf-8').forEach( name => {
      if( name !== ".DS_Store" )
      {
        const type = name.split('.').pop();        
        files.push({
          name,
          type: type == name ? 'folder' : type
        });
      }
        
    });

    return {
        path: fullpath,
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