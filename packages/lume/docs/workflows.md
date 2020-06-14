# Workflows

The following sample workflows show possible ways to install and start using
Lume with or without build tools

If you're a total beginner to development and don't know [how to use a
terminal command line](https://www.davidbaumgold.com/tutorials/command-line/), then the
[Global Workflow](#global-workflow-easiest) will be the easiest way for you
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
order to load `LUME` as a global variable, and requires no build steps or
tooling. Many of the [examples](./examples.old.md) use this workflow, which you can
learn from.

In this workflow we'll write HTML (a "declarative programming language") to
define the 3D scene, and only a small sprinkle of JavaScript (an "imperative
programming language") to animate the rectangle.

Make a file named `index.html` containing the following:

```html
<style>
	html,
	body {
		/* Make the app full width/height of the viewport. */
		width: 100%;
		height: 100%;
		margin: 0;

		/* Give the app a background color. */
		background: #333;
	}

	i-node {
		/* Give the rotating rectangle (the i-node below) a pink color. */
		background: pink;
	}
</style>

<!-- Define a 3D scene. -->
<i-scene>
	<!--
		The <i-node> is a basic element that is rendered with CSS.

		Here we give it "proportional" sizing along the X nd Y axes, which
		means it will be sized relative to the size of its parent (in this
		case the parent is the <i-scene> element). The <i-node> will have 75%
		or the width and height of the scene width and height.

		The align and mount-point properties have values that center the
		<i-node> rectangle in the center of the view.
	-->
	<i-node size-mode="proportional proportional" size="0.75 0.75" align="0.5 0.5" mount-point="0.5 0.5">
		<!-- Put some italicized text inside of it. -->
		<i>Hello 3D</i>
	</i-node>
</i-scene>

<!-- Include the global version of Lume in the app. -->
<script src="https://unpkg.com/lume/dist/global.js"></script>

<script>
	// Tell Lume to use default names for the elements (f.e. i-node and i-scene).
	LUME.useDefaultNames()

	// Get a reference to the i-node element.
	const node = document.querySelector('i-node')

	// Define a "property function" to increment only the Y rotation. This
	// increments rotation around the Y axis by 1 degree every time the scene
	// re-renders (which is usually 60fps unless the framerate decreases for
	// graphically intensive scenes).
	node.rotation = (x, y, z) => [x, ++y, z]
</script>
```

Now use `File > Open` in your web browser to open the `index.html` file and see the
result.

## Webpack Workflow

In this workflow we'll use a build tool called
[Webpack](https://webpack.js.org) to bundle our application code into a
single file that can be loaded into a web app via `<script>` tag.

Make a folder somewhere on your computer, then open it in your terminal. (What is a Terminal?)

Install [Node.js](http://nodejs.org), then install
[`webpack`](https://webpack.js.org) in your project:

```sh
npm install "webpack@^3" --save-dev
```

The `--save-dev` option saves webpack as a ["dev
dependency"](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file).

Install Lume into your project:

```sh
npm install lume --save
```

Create a file named `webpack.config.js` to configure Webpack:

```js
module.exports = {
	entry: './app.js',
	output: {
		path: './output',
		filename: 'app.js',
	},
}
```

Make a file named `app.js` containing the following:

```js
import {Scene, Node, useDefaultNames} from 'lume'

// Tell Lume to use default names for the elements.
useDefaultNames()

// Create a new 3D scene:
const scene = new Scene()

// Add a 3D node into the scene tree.
const node = new Node({
	// Make the node take up 75% of the width and height of the scene viewport.
	sizeMode: ['proportional', 'proportional'],
	size: [0.75, 0.75],

	// Position the node in the center of the view.
	align: [0.5, 0.5],
	mountPoint: [0.5, 0.5],
})

node.innerHTML = '<div>Hello 3D</div>'

scene.add(node)
scene.mount(document.body)

node.rotation = (x, y, z) => [x, ++y, z]
```

Make a file named `output/index.html` in your poject containing the following:

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

then compile a bundle that we'll run in the browser by running the following in your command line:

```sh
npx webpack
```

The `npx webpack` command runs the Webpack build tool and outputs a bundle to
the file `output/app.js` within your project, which includes your code as
well as the Lume code that you imported with the `import` statements.

Now use `File > Open` in your browser to open the `output/index.html` file and
see the result.

# What's next?

Now that you're up and running, learn more in the [Guide](#) (coming soon...) and [API
reference](./api/core/Node).
