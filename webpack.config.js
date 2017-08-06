const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
    entry: [ ],
    resolve: {
        extensions: [ ".js", ".jsx", ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [

                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            plugins: [
                                'transform-runtime',
                                'transform-es2015-modules-commonjs'
                            ],
                        },
                    },

                    {
                        loader: 'buble-loader',
                        options: {
                            target: { ie: 11 },
                            objectAssign: 'Object.assign',
                            transforms: {
                                modules: false,
                                dangerousForOf: true,
                            },
                        },
                    },

                ],
            },
        ],
    },
    plugins: [
        new BabiliPlugin()
    ],
    devtool: "source-map",
}
