infamous
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
========

Create 3D CSS+WebGL apps declaratively with HTML.

Visit the [site](http://infamous.io), discuss in the [forums](http://forums.infamous.io).

[![NPM](https://nodei.co/npm/infamous.png)](https://nodei.co/npm/infamous/)

About
-----

Infamous gives you general-purpose [Custom HTML
Elements](https://developers.google.com/web/fundamentals/architecture/building-components/customelements)
that the browser understands, for defining 2D or 3D scenes rendered with CSS3D,
WebGL, or both mixed together.

If you prefer imperative JavaScript, you can also use the imperative JavaScript
API.

Infamous' "mixed mode" let's us combine traditional HTML elements with new ones
that render to WebGL (powered by Three.js), which means we can render
traditional elements and 3D objects like spheres and cubes (and soon any 3D
model) together in the same 3D space (with lighting and shadow not just on the
WebGL objects, but on the DOM elements too!).

Unlike traditional CSS `box-shadow` which is flat and boring, with Infamous we
can give UIs __*real*__ shadows! [See for
yourself!](https://codepen.io/trusktr/pen/rpaQqK)

Infamous is built on the [Web Component
standards](https://www.w3.org/standards/techs/components#w3c_all), making it
possible to write 3D scenes declaratively using custom HTML elements,
regardless of which view layer you prefer. This makes it possible for you write
3D scenes using popular HTML frameworks like (but not limited to)
[React](https://facebook.github.io/react), [Vue.js](https://vuejs.org),
[Meteor](http://meteor.com), [Angular](https://angular.io),
[Ember.js](https://www.emberjs.com), or even the great
[jQuery](http://jquery.com).

Live Examples
-------------

- [HTML Buttons with Real Shadow!](https://codepen.io/trusktr/pen/rpegZR)
    - The 3D scene is defined using HTML
    - A "Picked" pen on CodePen!
    - JavaScript used for event handling and animating with Tween.js.
    - Rendering: experimental WebGL (powered by Three.js) and CSS3D, blended together in "mixed mode", where
      regular DOM elements (CSS3D) and WebGL objects are rendered together in
      the same 3D space with lighting and shadow
- [WebGL Cube with Lights](https://codepen.io/trusktr/pen/bYKXLd)
    - The 3D scene is defined with declarative HTML
    - Minimal JavaScript used for animation
    - Rendering: experimental WebGL (powered by Three.js)
- [Polydance](https://trusktr.io/polydance)
    - Presented at 3DWebFest 2017 in collaboration with [Anastasiia Vedernikova](https://vnastasia.myportfolio.com)
    - The 3D scene is defined with declarative HTML
    - The HTML is manipulated with [Vue.js](https://vuejs.org) ([see the source code](https://github.com/trusktr/trusktr.io/blob/master/meteor-app/client/imports/apps/polydance.vue))
    - Rendering: experimental WebGL (powered by an earlier webgl-from-scratch implementation)
- [Imperative Seed](https://codepen.io/trusktr/pen/yoWQOe)
    - The 3D scene is defined and animated with imperative JavaScript
    - Rendering: CSS3D
- [Declarative Seed](https://codepen.io/trusktr/pen/veXNZj)
    - The 3D scene is defined with declarative HTML
    - A sprinkle of JavaScript is used for animation
    - Rendering: CSS3D
- [RippleFlip](https://codepen.io/trusktr/pen/bWwdqR)
    - The 3D scene is defined with imperative JavaScript
    - Rendering: CSS3D
- [Geometric Rotation](https://trusktr.io/geometricRotation)
    - The 3D scene is defined with declarative HTML
    - The HTML is manipulated with [React](https://facebook.github.io/react) ([see the source code](https://github.com/trusktr/trusktr.io/blob/master/meteor-app/client/imports/apps/geometricRotation.js))
    - Rendering: experimental WebGL (powered by an earlier webgl-from-scratch implementation)
- [DOM Buggy](http://fiddle.jshell.net/trusktr/ymonmo70/15/embedded/result,html,css,js)
    - The 3D scene is defined with declarative HTML
    - The HTML is manipulated with plain JS.
    - Rendering: CSS3D

Getting Started
---------------

Use the "global" version of infamous via script tag in your HTML page:

```html
<script src="https://unpkg.com/infamous@17.0.5/global.js"></script>
<script>
    console.log(infamous)
    // use infamous
</script>
```

Or install from NPM:

```sh
npm install infamous
```
```js
const infamous = require('infamous')
console.log(infamous)
// use infamous
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
    var Motor = infamous.core.Motor
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

Notes
-----

- WebGL rendering is currently in "experimental" mode because the API isn't
  entirely finished, though many parts of it are stable.
  - This requires the `experimental-webgl="true"` attribute on root Scene
    elements, otherwise only CSS3D rendering is enabled by default.
- CSS3D rendering is stable.
- WebGL rendering is currently powered by [Three.js](https://threejs.org). All
  elements have a `.threeObject3d` property that you can access if you want to
  do custom things with the Three.js parts.
- Augmented and virtual reality modes (AR, VR) are not yet implemented, coming soon!
  - Implementing this should be a simple matter of taking advantage of builtin
    VR mode that ships with Three.js.
  - CSS3D doesn't support WebVR (at least not yet), therefore the only form of
    AR/VR that we can achieve with CSS3D rendering will be the type that splits
    the web page into two halves (one for each eye), which means CSS3D AR/VR
    will work only on headsets that carry mobile devices like Google Cardboard
    or Google Daydream. It may be possible to maps halves of a web page to
    specific eyes on other devices like Oculus, but this is a little way off.
- CSS3D objects can not be bent or distorted in 3D space at the moment (Adobe's
  CSS Shaders proposal was rejected due to security concerns), meaning
  traditional HTML elements can currently only be rendered as flat planes and
  nothing else.
  <!--
  - However, in the near future, we might be able to expose the hacky utility
    of tools like html2canvas via our API in order to manipulate textures
    generated from HTML content within WebGL directly. This has limitations,
    and some CSS styling may not work.
  -->

---

Testing powered by:
-------------------

[![BrowserStack](https://cloud.githubusercontent.com/assets/297678/18807024/f6a2ed04-81f1-11e6-94d7-b4205ed77db8.png)](https://www.browserstack.com/)

(Tests will be added to the repo soon.)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/2830402?v=4" width="100px;"/><br /><sub>corruptedzulu</sub>](https://github.com/corruptedzulu)<br />[💻](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Code") [📖](https://github.com/trusktr/infamous/commits?author=corruptedzulu "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/297678?v=4" width="100px;"/><br /><sub>Joseph Orbegoso Pea</sub>](http://trusktr.io)<br />[💻](https://github.com/trusktr/infamous/commits?author=trusktr "Code") [🐛](https://github.com/trusktr/infamous/issues?q=author%3Atrusktr "Bug reports") [📖](https://github.com/trusktr/infamous/commits?author=trusktr "Documentation") [💡](#example-trusktr "Examples") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
