const path = require('path')
const babelConfig = require('./babel.config')
const bubleConfig = require('./buble.config')
const BabelMinify = require("babel-minify-webpack-plugin");
const AsyncAwaitPlugin = require('webpack-async-await')

let DEV = false

const node_modules = (...p) => path.resolve(__dirname, 'node_modules', ...p)

// --watch option means dev mode
if (process.argv.includes('--watch')) {
    DEV = true
}

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
                    node_modules('custom-attributes'), // ES6+
                    node_modules('element-behaviors'), // ES6+
                ],
                use: [
                    //{
                        //loader: 'buble-loader',
                        //options: bubleConfig,
                    //},
                    {
                        loader: 'babel-loader',
                        options: babelConfig,
                    },
                ],
            },
        ],
    },
    plugins: DEV ? [
        new AsyncAwaitPlugin(),
    ] : [
        //new BabelMinify({}, {
            //comments: false,
        //}),
        new AsyncAwaitPlugin(),
    ],
}
