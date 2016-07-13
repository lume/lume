const DedupePlugin = require('webpack/lib/optimize/DedupePlugin')

module.exports = {
    entry: [
        // Using this instead of transform-runtime,
        // see babel config below.
        'babel-polyfill',
    ],
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
                        'stage-0',
                    ],
                    plugins: [
                        // broken in Webpack, doesn't work. Instead we load
                        // babel-polyfill as an entry, above. See
                        // https://discuss.babeljs.io/t/regeneratorruntime-is-not-defined-in-webpack-build/202
                        //'transform-runtime'
                    ],
                },
            },
        ],
    },
    plugins: [
        new DedupePlugin()
    ],
    devtool: "source-map",
}
