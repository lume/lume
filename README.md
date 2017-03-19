infamous
========

A famous UI library.

[![NPM](https://nodei.co/npm/infamous.png)](https://nodei.co/npm/infamous/)

Visit the [site](http://infamous.io), discuss in the [forums](http://forums.infamous.io).

Getting Started
---------------

The following sample workflows show possible ways to install and start using
infamous using a few different build tools that are popular today, and they
will refer to the [snippets](#snippets) at the end of the README. The examples
all use [`tween.js`](https://github.com/tweenjs/tween.js), a popular library
for animating numbers using "easing curves".

Supported browsers are Chrome, Firefox, Opera, and Edge, and basically any
browser that supports the `transform-style:preserve-3d` CSS property.

<!--Also read the [docs](http://infamous.github.io/infamous).-->

### Global Workflow (easiest)

Make a file `index.html` containing [Snippet 4](#snippet-4). Now use `File >
Open` in your browser to open the `index.html` file and see the result.

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

Make a file `app.js` containing [Snippet 1](#snippet-1) and `public/index.html`
containing [Snippet 2](#snippet-2) then compile a bundle that we'll run in the
browser:

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

Make a file `app.js` containing [Snippet 3](#snippet-3) and `public/index.html`
containing [Snippet 2](#snippet-2) then compile a bundle that we'll run in the
browser:

```sh
webpack
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

Snippets
--------

### Snippet 1

```js
const Motor = require('infamous/motor/Motor')
const Node = require('infamous/motor/Node')
const Scene = require('infamous/motor/Scene')
const TWEEN = require('tween.js')

const scene = new Scene
scene.mount(document.body)

const node = new Node({
    absoluteSize: {x:200, y:200},

    // place it in the middle of the scene
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

### Snippet 2

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

### Snippet 3

```js
import {Motor, Node, Scene} from 'infamous/motor'
import {Tween, Easing} from 'tween.js'

const scene = new Scene
scene.mount(document.body)

const node = new Node({
    absoluteSize: {x:200, y:200},

    // place it in the middle of the scene
    align: {x:0.5, y:0.5},
    mountPoint: {x:0.5, y:0.5},
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

### Snippet 4

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Project with infamous</title>
        <style>
            html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <script src="https://cdn.rawgit.com/trusktr/infamous/v15.0.0/global.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min.js"></script>
        <script>
            const {Motor, Node, Scene} = infamous.motor

            const scene = new Scene
            scene.mount(document.body)

            const node = new Node({
                absoluteSize: {x:200, y:200},

                // place it in the middle of it's parent
                align: {x:0.5, y:0.5},
                mountPoint: {x:0.5, y:0.5},
            })

            node.element.innerHTML = 'Hello.'
            node.element.style.cssText = ' backface-visibility: visible; background: pink; padding: 5px; '

            scene.addChild(node)

            let tween = new TWEEN.Tween(node.rotation)
              .to({y: 360}, 5000)
              .easing(TWEEN.Easing.Elastic.InOut)
              .start()

            Motor.addRenderTask(now => {
                tween.update(now)
            })
        </script>
    </body>
</html>
```

---

Testing powered by:

[![BrowserStack](https://cloud.githubusercontent.com/assets/297678/18807024/f6a2ed04-81f1-11e6-94d7-b4205ed77db8.png)](https://www.browserstack.com/)
