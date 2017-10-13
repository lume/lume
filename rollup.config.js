const commonjs    = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const buble       = require('rollup-plugin-buble')
const babel       = require('rollup-plugin-babel')
//const babili      = require('rollup-plugin-babili')

// using `require` because `import` makes it utterly fail.
const babelConfig = require('./babel.config')
const bubleConfig = require('./buble.config')

module.exports = {
    input: 'src/index.js',
    name: 'infamous',
    output: {
        file: 'global.js',
        format: 'iife',
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),

        // TODO: we should exclude packages with ES modules, and transpile
        // those, so we can control quality of the transpiled code that goes
        // into our bundle..
        commonjs({
            exclude: [ 'src/**' ], // no CommonJS in here.
            include: [ 'node_modules/**' ], // CommonJS is in here only
        }),

        // We have to transpile class syntax with Babel first in order to get
        // it work with document-register-element if we want to support IE
        // 10/11, otherwise buble's class transpiled class code won't work with
        // document-register-element
        babel(Object.assign(babelConfig, {
            runtimeHelpers: true,
            exclude: [ 'node_modules/**' ],
        })),
        buble(bubleConfig),

        //babili({
            //comments: false,
        //}),
    ]
};
