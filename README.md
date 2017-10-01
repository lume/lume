infamous
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
========

A famous UI library.

[![NPM](https://nodei.co/npm/infamous.png)](https://nodei.co/npm/infamous/)

Visit the [site](http://infamous.io), discuss in the [forums](http://forums.infamous.io).

Getting Started
---------------

Use the "global" version of infamous via script tag in your HTML page:

```html
<script src="https://unpkg.com/infamous@17.0.5/global.js"></script>
<script>
    console.log(infamous)
</script>
```

Or install from NPM:

```sh
npm install infamous
```
```js
console.log(require('infamous'))
```

Workflows
---------

The following sample workflows show possible ways to install and start using
infamous using a few different build tools that are popular today.

They will all show how to make this demo: https://jsfiddle.net/trusktr/52zzLx6e.

The examples all use [`tween.js`](https://github.com/tweenjs/tween.js), a
library for animating numbers using "easing curves".

Supported browsers are Chrome, Firefox, Opera, and Edge, and basically any
browser that supports the `transform-style:preserve-3d` CSS property.

<!--Also read the [docs](http://infamous.github.io/infamous).-->

### Global Workflow (easiest)

Make a file `index.html` containing the following:

```html
<!DOCTYPE html>
<style>
    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>

<script src="https://cdn.rawgit.com/trusktr/infamous/v17.0.5/global.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>

<script>
    // use the default names for the custom elements (i-node and i-scene):
    infamous.html.useDefaultNames()
</script>

<i-scene>
    <i-node
        absoluteSize="200 200" align="0.5 0.5" mountPoint="0.5 0.5"
        style=" backface-visibility: visible; background: pink; padding: 5px; "
        >

        Hello.

    </i-node>
</i-scene>

<script>
    var Motor = infamous.motor.Motor
    var node = document.querySelector('i-node')
    var tween = new TWEEN.Tween(node.rotation)
      .to({y: 360}, 5000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .start()

    Motor.addRenderTask(now => {
        tween.update(now)
    })
</script>
```

Alternatively, we can give the elements any name we want:

```html
<script>
    // Give the elements our own names:
    const { HTMLScene, HTMLNode } = infamous.html
    HTMLScene.define('infamous-scene')
    HTMLNode.define('object-3d')
</script>

<infamous-scene>
    <object-3d
        absoluteSize="200 200" align="0.5 0.5" mountPoint="0.5 0.5"
        style=" backface-visibility: visible; background: pink; padding: 5px; "
        >

        Hello.

    </object-3d>
</infamous-scene>
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

### Browserify Workflow

Install [Node.js](http://nodejs.org), then install
[`browserify`](http://browserify.org) globally:

```sh
npm install -g "browserify@^14"
```

Install `infamous` and `tween.js` into your project:

```sh
npm install infamous tween.js --save
```

Make a file `app.js` containing the following:

```js
const Motor = require('infamous/core/Motor')
const Node = require('infamous/core/Node')
const Scene = require('infamous/core/Scene')
const TWEEN = require('tween.js')

const scene = new Scene
scene.mount(document.body)

const node = new Node({
    absoluteSize: {x:200, y:200}, // object notation
    // place it in the middle of the scene:
    align: {x:0.5, y:0.5},
    mountPoint: {x:0.5, y:0.5},
})

node.element.textContent = 'Hello.'
node.element.style.cssText = 'backface-visibility: visible; background: pink; padding: 5px;'

scene.addChild(node)

let tween = new TWEEN.Tween(node.rotation)
    .to({y: 360}, 5000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .start()

Motor.addRenderTask(function(timestamp) {
    tween.update(timestamp)
})
```

Make a file `public/index.html` containing the following:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Project with infamous</title>
    </head>
    <body>
        <script src="app.js"></script>
    </body>
</html>
```

then compile a bundle that we'll run in the browser:

```sh
browserify app.js -o public/app.js
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

### Webpack Workflow

Install [Node.js](http://nodejs.org), then install
[`webpack`](http://webpack.github.io) globally:

```sh
npm install -g "webpack@^2"
```

Install `infamous` and `tween.js` into your project:

```sh
npm install infamous tween.js --save
```

Create a file `webpack.config.js` to configure webpack:

```js
module.exports = {
    entry: "./app.js",
    output: {
        path: './public',
        filename: "app.js"
    },
}
```

Make a file `app.js` containing the following:

```js
import {Motor, Node, Scene} from 'infamous/core'
import {Tween, Easing} from 'tween.js'

const scene = new Scene
scene.mount(document.body)

const node = new Node({
    absoluteSize: [200, 200], // array notation
    // place it in the middle of the scene:
    align: [0.5, 0.5],
    mountPoint: [0.5, 0.5],
})

node.element.textContent = 'Hello.'
node.element.style.cssText = 'backface-visibility: visible; background: pink; padding: 5px;'

scene.addChild(node)

let tween = new Tween(node.rotation)
    .to({y: 360}, 5000)
    .easing(Easing.Elastic.InOut)
    .start()

Motor.addRenderTask(function(timestamp) {
    tween.update(timestamp)
})
```

Makea a file `public/index.html` containing the following:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Project with infamous</title>
    </head>
    <body>
        <script src="app.js"></script>
    </body>
</html>
```

then compile a bundle that we'll run in the browser:

```sh
webpack
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

---

Testing powered by:

[![BrowserStack](https://cloud.githubusercontent.com/assets/297678/18807024/f6a2ed04-81f1-11e6-94d7-b4205ed77db8.png)](https://www.browserstack.com/)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/2830402?v=4" width="100px;"/><br /><sub>corruptedzulu</sub>](https://github.com/corruptedzulu)<br />[💻](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Code") [📖](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/297678?v=4" width="100px;"/><br /><sub>Joseph Orbegoso Pea</sub>](http://trusktr.io)<br />[💻](https://github.com/trusktr/infamous/commits?author=trusktr "Code") [🐛](https://github.com/trusktr/infamous/issues?q=author%3Atrusktr "Bug reports") [📖](https://github.com/trusktr/infamous/commits?author=trusktr "Documentation") [💡](#example-trusktr "Examples") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
