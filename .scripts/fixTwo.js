#!/usr/bin/env node

// a function wrapper is needed for older versions of Node.
~function() {
    "use strict"

    const fs = require('fs')
    const path = require('path')
    const filePath = path.resolve('node_modules', 'two.js', 'build', 'two.js')

    let data = fs.readFileSync(filePath).toString()

    data = data.replace(
        /var root = this/g,
        "var root = typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : null"
    )

    fs.writeFileSync(filePath, data)
}()
