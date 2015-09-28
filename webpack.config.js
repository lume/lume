
module.exports = {
    resolve: {
        extensions: [ "", ".js", ".jsx", ".glsl", '.css']
    },
    module: {
        loaders: [
            { test: /\.jsx?$/,  loader: 'babel', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.(glsl|frag|vert)$/, loader: 'raw' },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify' },
        ],
    },
}
