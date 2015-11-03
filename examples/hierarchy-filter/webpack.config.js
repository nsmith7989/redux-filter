var webpack = require('webpack');
var path = require('path');

module.exports = {

    devtool: 'eval-source-map',

    entry: {
        filter: [
            'webpack-hot-middleware/client?reload=true',
            './index.js'
        ]
    },

    output: {
        path: path.join(__dirname, 'static'),
        publicPath: '/static/',
        filename: 'bundle.js'
    },

    // Require the webpack and react-hot-loader plugins
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            __DEV__: true
        })
    ],

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        // Load the react-hot-loader
        loaders: [ {
            test: /\.jsx?$/,
            loaders: ['babel'],
        }, {
                test: /\.json/,
                loader: 'json'
            }]
    },

};