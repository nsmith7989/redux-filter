var webpack = require('webpack');
var config = require('./webpack.config.js');
var browserSync = require('browser-sync').create();
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var compiler = webpack(config);

browserSync.init({
    server: {
        baseDir: './',
        middleware: [
            webpackDevMiddleware(compiler, {
                noInfo: true,
                publicPath: config.output.publicPath
            }),
            webpackHotMiddleware(compiler)
        ]
    },
    files: [
        'css/style.css',
        '*.html'
    ],
    open: false
});
