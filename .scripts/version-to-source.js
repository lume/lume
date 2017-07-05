#!/usr/bin/env node

~function() {
    "use strict"

    const fs = require('fs')
    const path = require('path')
    const version = require(path.resolve('package.json')).version

    let data = fs.readFileSync(path.resolve('src', 'index.js')).toString()

    const lines = data.trim().split('\n')
    lines.pop() // delete last line

    lines.push(`export const version = '${version}'`)

    data = lines.join('\n') + '\n'

    fs.writeFileSync(path.resolve('src', 'index.js'), data)
}()
