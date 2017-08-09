#!/usr/bin/env node

// a function wrapper is needed for older versions of Node.
~function() {
    "use strict"

    const fs = require('fs')
    const path = require('path')
    const filePath = path.resolve('src', 'index.js')
    const version = require(path.resolve('package.json')).version

    let data = fs.readFileSync(filePath).toString()

    const lines = data.trim().split('\n')
    lines.pop() // delete last line

    lines.push(`export const version = '${version}'`)

    data = lines.join('\n') + '\n'

    fs.writeFileSync(filePath, data)
}()
