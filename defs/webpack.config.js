/**
 * check this out later: https://webpack-config-plugins.js.org
 *
 * 
 *  */

const path = require('path');

module.exports = [{
    entry: './LibDefsUI.js',
    output: {
        filename: 'ui.defs.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        minimize: false
    }
}, {
    entry: './LibDefsIO.js',
    output: {
        libraryTarget: 'commonjs',
        filename: 'io.defs.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        minimize: false
    }
}]