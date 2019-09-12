#!/usr/bin/env node

// ability to require/import TypeScript files
require('ts-node').register({
    typeCheck: false,
    transpileOnly: true,
    files: true,
    project: './tsconfig.json',

    // manually supply our own compilerOptions, otherwise if we run this file
    // from another project's location (f.e. from Saffron) then ts-node will use
    // the compilerOptions from that other location, which may not work.
    compilerOptions: {
        // override vaslue of "./src"
        baseUrl: './',

        // so that it runs in Node.js (ES Modules aren't released in Node.js yet at time of
        // writing)
        module: 'commonjs',
    },
})

require('./readem.ts')
