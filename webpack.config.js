const DedupePlugin = require('webpack/lib/optimize/DedupePlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

module.exports = {
    entry: [ ],
    resolve: {
        extensions: [ "", ".js", ".jsx", ]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        'es2015',
                        'stage-1',
                    ],
                    plugins: [
                        'transform-runtime'
                    ],
                },
            },
        ],
    },
    plugins: [
        new DedupePlugin(),
        new UglifyJsPlugin(),
    ],
    devtool: "source-map",
}
