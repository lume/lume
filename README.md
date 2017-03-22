infamous
========

A famous UI library.

[![NPM](https://nodei.co/npm/infamous.png)](https://nodei.co/npm/infamous/)

Visit the [site](http://infamous.io), discuss in the [forums](http://forums.infamous.io).

Getting Started
---------------

Use the "global" version of infamous via script tag in your HTML page:

```html
<script src="https://unpkg.com/infamous@15.2.0/global.js"></script>
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

<script src="https://cdn.rawgit.com/trusktr/infamous/v15.2.0/global.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>

<motor-scene>
    <motor-node
        absoluteSize="200 200" align="0.5 0.5" mountPoint="0.5 0.5"
        style=" backface-visibility: visible; background: pink; padding: 5px; "
        >

        Hello.

    </motor-node>
</motor-scene>

<script>
    var Motor = infamous.motor.Motor
    var node = document.querySelector('motor-node')
    var tween = new TWEEN.Tween(node.rotation)
      .to({y: 360}, 5000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .start()

    Motor.addRenderTask(now => {
        tween.update(now)
    })
</script>
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
const Motor = require('infamous/motor/Motor')
const Node = require('infamous/motor/Node')
const Scene = require('infamous/motor/Scene')
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
import {Motor, Node, Scene} from 'infamous/motor'
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
