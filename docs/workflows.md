
Workflows
=========

The following sample workflows show possible ways to install and start using
infamous using a different build tools that are popular today.

In each workflow we will be making this [example](https://codepen.io/trusktr/pen/veXNZj):

<iframe height='418' scrolling='no' title='HTML Buttons with Real Shadow'
src='https://codepen.io/trusktr/embed/preview/veXNZj/?height=418&theme-id=light&default-tab=result&embed-version=2&editable=true'
frameborder='no' allowtransparency='true' allowfullscreen='true'
style='width:100%;'></iframe>

## Global Workflow (easiest)

This workflow involves simply placing a `<script>` tag into an HTML page in
order to load `infamous` as a global variable, and requires no build steps or
tooling.

Make a file named `index.html` containing the following:

```html
<!DOCTYPE html>
<style>
  html, body {
    width: 100%; height: 100%;
    margin: 0; padding: 0; background: #333;
  }

  i-node { background: pink; }

  div {
    text-align: center;
    margin-top: 50%;
    transform: translateY(-50%);
  }
</style>

<script src="https://cdn.rawgit.com/trusktr/infamous/v18.0.0/global.js"></script>

<i-scene>
  <i-node
    size="200 200"
    align="0.5 0.5"
    mountPoint="0.5 0.5"
  >

    <div>Hello 3D</div>

  </i-node>
</i-scene>

<script>
    // use the default names for the custom elements (f.e. i-node and i-scene).
    infamous.html.useDefaultNames()

    const {Motor} = infamous.core
    const node = document.querySelector('i-node')
    node.rotation = ( x, y, z ) => [ x, ++y, z ]
</script>
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

## Browserify Workflow

Install [Node.js](http://nodejs.org), then install
[`browserify`](http://browserify.org) globally:

```sh
npm install -g "browserify@^14"
```

Install `infamous` into your project:

```sh
npm install infamous --save
```

Make a file named `app.js` containing the following:

```js
const { useDefaultNames } = require('infamous/html')
const { Scene, Node, Motor } = require('infamous/core')

// tell infamous to
useDefaultNames()

const scene = new Scene

const node = new Node({
  size: [200, 200],
  align: [0.5, 0.5],
  mountPoint: [0.5, 0.5],
})

node.element.innerHTML = '<div>Hello 3D</div>'

scene.add(node)
scene.mount(document.body)

node.rotation = ( x, y, z ) => [ x, ++y, z ]
```

Make a file `public/index.html` containing the following:

```html
<!DOCTYPE html>
<style>
  html, body {
    width: 100%; height: 100%;
    margin: 0; padding: 0; background: #333;
  }

  i-node { background: pink; }

  div {
    text-align: center;
    margin-top: 50%;
    transform: translateY(-50%);
  }
</style>
<script src="./app.js"></script>
```

then compile a bundle that we'll run in the browser:

```sh
browserify app.js -o public/app.js
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

## Webpack Workflow

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
    size: [200, 200], // array notation
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
