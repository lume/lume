Infamous
========

A UI library.

Install
-------

The following example workflows show possible way to install infamous and these examples will refer to the snippets at the end of the README.

### browserify workflow

If you don't already have a package.json in your project, create one.

```
npm init
```

Install [`browserify`](http://browserify.org) globally.

```
npm install -g browserify
```

Install infamous along with famous, famousify, and cssify into your project.

```
npm install infamous famous famousify cssify --save
```

Add the the famousify and cssify transforms to your package.json so it looks similar to the following.

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

Suppose you have `src/app.js` containing Snippet 1 and `public/index.html` containing Snippet 2. Compile a bundle for production.

```
browserify src/app.js -o public/app.js
```

Alternatively, use [watchify](https://github.com/substack/watchify) to watch the filesystem for changes and re-compile automatically.

```
watchify src/app.js -o public/app.js
```

Install `serve`.

```
npm install -g serve
```

Quickly serve the contents of the public folder.

```
serve public
```

Visit `localhost:3000` in your browser.

### webpack workflow

If you don't already have a package.json in your project, create one.

```
npm init
```

Install [`webpack`](http://webpack.github.io) globally.

```
npm install -g webpack
```

Install infamous along with famous, webpack, css-loader, and style-loader into your project.

```
npm install infamous webpack famous css-loader style-loader --save
```

Create webpack.config.js to configure webpack.

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
            famous: 'famous/src'
        }
    }
}
```

Suppose you have `src/app.js` containing Snippet 1 and `public/index.html` containing Snippet 2. Compile a bundle for production.

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

Quickly serve the contents of the public folder.

```
serve public
```

Visit `localhost:3000` in your browser.

Usage
-----

Come back later.

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
        <title>Project with Infamous</title>
        <meta charset="utf-8" />
    </head>
    <body>
        <script type="text/javascript" charset="utf-8" src="app.js"></script>
    </body>
</html>
```
