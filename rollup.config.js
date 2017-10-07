import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble'
import babel from 'rollup-plugin-babel'
import babili from 'rollup-plugin-babili'

export default {
    entry: 'src/index.js',
    dest: 'global.js',
    format: 'iife',
    moduleName: 'infamous',
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            exclude: [ 'src/**' ], // no CommonJS in here.
            include: [ 'node_modules/**' ], // CommonJS is in here only
        }),

        // We have to transpile class syntax with Babel first in order to get
        // it work with document-register-element if we want to support IE
        // 10/11, otherwise buble's class transpiled class code won't work with
        // document-register-element
        babel({
            runtimeHelpers: true,
            plugins: [
                // this has to go before transform-es2015-classes
                ['transform-builtin-classes', { globals: ['HTMLElement'] }],
                'transform-es2015-classes',
                'transform-object-rest-spread',
                'array-includes',
                // makes super() calls to native constructors work properly. We
                // must explicitly specify the classes we extend.
                ['transform-runtime', {
                    helpers: true,
                    polyfill: true,
                    // we don't need regenerator, we write Promises, or
                    // transpile to Promises, and we're not currently using any
                    // generator functions.
                    regenerator: false,
                }],
            ],
            exclude: [ 'node_modules/**' ],
        }),
        buble({
            target: { ie: 10 },
            objectAssign: 'Object.assign',
            transforms: {
                modules: false,
                dangerousForOf: true,
            },
        }),

        babili({
            comments: false,
        }),
    ]
};
