const path = require('path')
const babelConfig = require('./babel.config')
const bubleConfig = require('./buble.config')
const BabelMinify = require("babel-minify-webpack-plugin");

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'global.js',
        library: 'infamous',
        libraryTarget: 'var', // alternative: "window"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules', 'custom-attributes'), // ES6+
                ],
                use: [
                    {
                        loader: 'buble-loader',
                        options: bubleConfig,
                    },
                    {
                        loader: 'babel-loader',
                        options: babelConfig,
                    },
                ],
            },
        ],
    },
    plugins: [
        new BabelMinify({}, {
            comments: false,
        })
    ],
}
