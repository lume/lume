# Workflows

The following sample workflows show possible ways to install and start using
infamous without any build steps or special tools, as well as using various
build tools that are popular today.

If you're a total beginner to web development and don't know [how to use a
command line](https://www.davidbaumgold.com/tutorials/command-line/), then the
[Global Workflow](<#global-workflow-(easiest)>) will be the easiest way for you
to get started. The other workflows require basic understanding of the command
line.

In each workflow we will be making a version of [this example](https://codepen.io/trusktr/pen/veXNZj):

<iframe height='418' scrolling='no' title='HTML Buttons with Real Shadow'
src='https://codepen.io/trusktr/embed/preview/veXNZj/?height=418&theme-id=light&default-tab=result&embed-version=2&editable=true'
frameborder='no' allowtransparency='true' allowfullscreen='true'
style='width:100%;'></iframe>

(Try it in a new browser window and resize the window to see that the example
is responsive.)

## Global Workflow (easiest)

This workflow involves simply placing a `<script>` tag into an HTML page in
order to load `infamous` as a global variable, and requires no build steps or
tooling. Many of the [examples](./examples.md) use this workflow, which you can
learn from.

In this workflow we'll write HTML (a "declarative language") to define the 3D
scene, and only a small sprinkle of JavaScript (an "imperative language") to
animate the rectangle.

Make a file named `index.html` containing the following:

```html
<!DOCTYPE html>
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #333;
    }

    i-node {
        background: pink;
    }

    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
</style>

<script src="https://cdn.rawgit.com/trusktr/infamous/v18.0.3/global.js"></script>

<i-scene>
    <i-node sizeMode="proportional proportional" size="0.75 0.75" align="0.5 0.5" mountPoint="0.5 0.5">
        <div>Hello 3D</div>
    </i-node>
</i-scene>

<script>
    // use the default names for the custom elements (f.e. i-node and i-scene).
    infamous.html.useDefaultNames()

    const {Motor} = infamous.core
    const node = document.querySelector('i-node')

    // Define "property function" to increment only the Y rotation:
    node.rotation = (x, y, z) => [x, ++y, z]
</script>
```

Now use `File > Open` in your browser to open the `index.html` file and see the
result.

## Browserify Workflow

In this workflow, you'll be able to write CommonJS modules (the same sort of
module format used by Node.js, [see the
guide](https://nodejs.org/docs/latest/api/modules.html#modules_modules)) which
is useful for sharing reusable code across files in your project, and then use
[Browserify](http://browserify.org) to bundle the code into a single file that
can be loaded into a web app via `<script>` tag.

In this workflow we'll write only JavaScript (an "imperative language") to define
the 3D scene as well as to animate it.

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
const {useDefaultNames} = require('infamous/html')
const {Scene, Node} = require('infamous/core')

// tell infamous to
useDefaultNames()

const scene = new Scene()

const node = new Node({
    sizeMode: ['proportional', 'proportional'],
    size: [0.75, 0.75],
    align: [0.5, 0.5],
    mountPoint: [0.5, 0.5],
})

node.innerHTML = '<div>Hello 3D</div>'

scene.add(node)
scene.mount(document.body)

node.rotation = (x, y, z) => [x, ++y, z]
```

Make a file `public/index.html` containing the following:

```html
<!DOCTYPE html>
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #333;
    }

    i-node {
        background: pink;
    }

    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
</style>
<script src="./app.js"></script>
```

then compile a bundle that we'll run in the browser:

```sh
browserify app.js -o public/app.js
```

This `browserify` command will output a bundle to `public/app.js`, which
contains your code plus the infamous code that you imported using the
`require()` syntax.

Now use `File > Open` in your browser to open the `public/index.html` file and
see the result.

## Webpack Workflow

In this workflow, you'll be able to write [ES
Modules](http://2ality.com/2014/09/es6-modules-final.html) (also known as ES6
Modules) which is useful for sharing reusable code across files in your project
(a similar purpose to the CommonJS module format used with the previous
[Browserify workflow](#browserify-workflow)), and then use
[Webpack](https://webpack.js.org) to bundle the code into a single file that
can be loaded into a web app via `<script>` tag.

Install [Node.js](http://nodejs.org), then install
[`webpack`](https://webpack.js.org) globally:

```sh
npm install -g "webpack@^3"
```

Install `infamous` into your project:

```sh
npm install infamous --save
```

Create a file named `webpack.config.js` to configure webpack:

```js
module.exports = {
    entry: './app.js',
    output: {
        path: './public',
        filename: 'app.js',
    },
}
```

Make a file named `app.js` containing the following:

```js
import {useDefaultNames} from 'infamous/html'
import {Scene, Node} from 'infamous/core'

// tell infamous to
useDefaultNames()

const scene = new Scene()

const node = new Node({
    sizeMode: ['proportional', 'proportional'],
    size: [0.75, 0.75],
    align: [0.5, 0.5],
    mountPoint: [0.5, 0.5],
})

node.innerHTML = '<div>Hello 3D</div>'

scene.add(node)
scene.mount(document.body)

node.rotation = (x, y, z) => [x, ++y, z]
```

Make a file named `public/index.html` containing the following:

```html
<!DOCTYPE html>
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #333;
    }

    i-node {
        background: pink;
    }

    div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
</style>
<script src="./app.js"></script>
```

then compile a bundle that we'll run in the browser:

```sh
webpack
```

The `webpack` command outputs a bundle to `public/app.js`, which includes your
code as well as the infamous code that you imported with the `import` syntax.

Now use `File > Open` in your browser to open the `public/index.html` file and
see the result.

# What's next?

Now that you're up and running, learn more in the [guide](#) (coming soon...)
and [API reference](#) (coming soon...).
