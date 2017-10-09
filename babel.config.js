module.exports = {
    plugins: [
        // this has to go before transform-es2015-classes.
        // makes super() calls to native constructors work properly. We
        // must explicitly specify the classes we extend.
        ['transform-builtin-classes', { globals: ['HTMLElement'] }],
        'transform-es2015-classes',
        'transform-object-rest-spread',
        'array-includes',
        ['transform-runtime', {
            helpers: true,
            polyfill: true,
            // we don't need regenerator, we write Promises, or
            // transpile to Promises, and we're not currently using any
            // generator functions.
            regenerator: false,
        }],
    ],
}
