
module.exports = {
    resolve: {
        extensions: [ "", ".js", ".jsx", ".glsl" ]
    },
    module: {
        loaders: [
            { test: /\.jsx?$/,  loader: 'babel', exclude: /node_modules/ },
            { test: /\.(glsl|frag|vert)$/, loader: 'raw' },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify' },
        ],
    },
}
