/**
 * check this out later: https://webpack-config-plugins.js.org
 *
 * 
 *  */

/**
 * eventually use config json to build different folder
 * but we will need to bundle defs on start
 */
/*
 const symbolist_config = require('./symbolist-config.json');
 const utils = require('./lib/main_utils')

let files = utils.getFilesFromMenuFolderArray(symbolist_config['default-init-folder']);
*/
const path = require('path');

module.exports = [{
    entry: './symbolist-global-modules.js',
    output: {
        filename: 'ui.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        minimize: false
    },
}]