infamous
========

A famous UI library.

[![NPM](https://nodei.co/npm/infamous.png)](https://nodei.co/npm/infamous/)

Visit the [site](http://infamous.io), discuss in the [forums](http://forums.infamous.io).

Getting Started
---------------

The following sample workflows show possible ways to install and start using
infamous. These examples will refer to the [snippets](#snippets) at the end of
the README.

Also read the [docs](http://infamous.github.io/infamous).

### browserify workflow

Install [nodejs](http://nodejs.org), then create `package.json` for your
project.

```
npm init # creates package.json
```

Install [`browserify`](http://browserify.org) globally.

```
npm install -g browserify
```

Install infamous along with famous, famousify, and cssify into your project.

```
npm install infamous famous famousify cssify --save
```

Add the famousify and cssify transforms to your package.json so it looks
similar to the following.

```json
{
  "dependencies": {
    "cssify": "^0.6.0",
    "famous": "^0.3.4",
    "famousify": "^0.1.5",
    "infamous": "^0.0.15"
  },
  "browserify": {
    "transform": [
      "famousify",
      "cssify"
    ]
  }
}
```

Suppose you have `src/app.js` containing [Snippet 1](#snippet-1) and
`public/index.html` containing [Snippet 2](#snippet-2). Compile a bundle for
production.

```
browserify src/app.js -o public/app.js
```

Alternatively, use [watchify](https://github.com/substack/watchify) to watch
the filesystem for changes and re-compile automatically.

```
watchify src/app.js -o public/app.js
```

Install `serve` globally.

```
npm install -g serve
```

Serve the contents of the public folder.

```
serve public
```

Visit `localhost:3000` in your browser.

### webpack workflow

Install [nodejs](http://nodejs.org), then create `package.json` for your
project.

```
npm init # creates package.json
```

Install [`webpack`](http://webpack.github.io) globally.

```
npm install -g webpack
```

Install infamous along with famous, webpack, css-loader, and style-loader into
your project.

```
npm install infamous webpack famous css-loader style-loader --save
```

Create `webpack.config.js` to configure webpack.

```js
var webpack = require('webpack')
module.exports = {
    entry: "./src/app.js",
    output: {
        path: './public',
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    resolve: {
        alias: {
            // add this alias only for famous <0.3.5
            famous: 'famous/src'
        }
    }
}
```

Suppose you have `src/app.js` containing [Snippet 1](#snippet-1) and
`public/index.html` containing [Snippet 2](#snippet-2). Compile a bundle for
production.

```
webpack
```

Alternatively, watch the filesystem for changes and re-compile automatically.

```
webpack --watch
```

Install `serve` globally.

```
npm install -g serve
```

Serve the contents of the public folder.

```
serve public
```

Visit `localhost:3000` in your browser.

### jspm workflow

Install [nodejs](http://nodejs.org), then create `package.json` for your
project.

```
npm init # creates package.json
```

Install [`jspm`](http://jspm.io) globally.

```
npm install -g jspm
```

Set `jspm.directories.baseURL` in your package.json to `"src"`, similar to the
following.

```json
{
  "jspm": {
    "directories": {
      "baseURL": "src"
    }
  }
}
```

Install infamous along with famous and css into your project.

```
jspm install -y infamous famous css
```

Suppose you have `src/app.js` containing [Snippet 3](#snippet-3) and
`src/index.html` containing [Snippet 4](#snippet-4). Install `serve` globally.

```
npm install -g serve
```

Serve the contents of the `src` folder.

```
serve src
```

Visit `localhost:3000` in your browser.

Snippets
--------

### Snippet 1

```js
var style                  = require('famous/core/famous.css') // needed by famous
var Plane                  = require('infamous/Plane')
var contextWithPerspective = require('infamous/utils').contextWithPerspective

var ctx = contextWithPerspective(1000)
var square = new Plane({
    size: [200,200],
    content: 'Hello.',
    properties: {
        backfaceVisibility: 'visible',
        background: 'pink',
        padding: '5px'
    }
})

ctx.add(square)
square.transform.setRotate([0,2*Math.PI,0], {duration: 5000, curve: 'easeInOut'})
```

### Snippet 2

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html>
    <head>
        <title>Project with infamous</title>
        <meta charset="utf-8" />
    </head>
    <body>
        <script type="text/javascript" charset="utf-8" src="app.js"></script>
    </body>
</html>
```

### Snippet 3

```js
import 'famous/core/famous.css!'

import Plane from 'infamous/Plane'
import {contextWithPerspective} from 'infamous/utils'

var ctx = contextWithPerspective(1000)
var square = new Plane({
    size: [200,200],
    content: 'Hello.',
    properties: {
        backfaceVisibility: 'visible',
        background: 'pink',
        padding: '5px'
    }
})

ctx.add(square)
square.transform.setRotate([0,2*Math.PI,0], {duration: 5000, curve: 'easeInOut'})
```

### Snippet 4

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Project with infamous</title>
        <meta charset="utf-8" />
    </head>
    <body>
        <script src='jspm_packages/system.src.js'></script>
        <script src='config.js'></script>
        <script type="module">
            System.import('app');
        </script>
    </body>
</html>
```
