'use strict';
var webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'build';
const isDev = NODE_ENV == 'dev';

var plugins = [];
if (!isDev) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true
    }));
}

module.exports = {
    entry: './src/GB',
    output: {
        path: './build',
        filename: isDev ? "GB.js" : "GB.min.js",
        library: "GB"
    },
    watch: isDev,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: isDev ? 'cheap-eval-source-map' : 'source-map',
    plugins: plugins
};