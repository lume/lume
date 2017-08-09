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
            target: { ie: 11 },
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
