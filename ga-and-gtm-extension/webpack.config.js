const path = require('path'),
    webpack = require('webpack'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: ["core-js/fn/promise", './src/analytics-event-delegate.js'],
    output: {
        filename: 'analytics-event-delegate.min.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [

        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),

        new UglifyJsPlugin()
    ]
};