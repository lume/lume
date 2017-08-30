import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble'
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

        commonjs(),

        buble({

            // we only support back to IE11, but here we transpile for IE10
            // (which uses `var` instead of `let`or `const`) to avoid a Safari
            // problem for the time being. See:
            // https://github.com/babel/minify/issues/681
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
