# Install

The following describes ways to install and start using LUME with or
without build tools.

If you're a new to development and are not yet familiar with [how to use a
terminal command
line](https://www.davidbaumgold.com/tutorials/command-line/), then the
following [Global install](#global-install-easiest) method will be the easiest way
for you to get started with the most minimal knowledge required.

The non-global install methods require basic understanding of the command line
and command line tools for managing code, and is better suited for bigger or
longer-term applications that require modular code organization.

## Install methods

First you will want to get the LUME code into your project using one of the following methods.

### Global install (easiest)

The easiest way to get started is by placing a `<script>` tag into an HTML
page in order to load `LUME` as a global variable. This requires no build
steps or tooling, only a text editor. Many of the
[examples](/examples/hello3d.md) use this workflow.

To start, open up a text editor. We'll create an empty file that we will save
as an HTML file with a file name ending in `.html`. We will then run this
file in a web browser; basically creating what people commonly refer to as a
"web site", "web page", or "web app".

> **TIP:** Your computer comes with a text editor by default. You can use
> [TextEdit](https://support.apple.com/guide/textedit/work-with-html-documents-txted0b6cd61/1.15/mac/10.15)
> in macOS or
> [Notepad](https://www.microsoft.com/en-us/p/windows-notepad/9msmlrh6lzf3) in
> Windows. See this [small tutorial](https://www.wikihow.com/Edit-HTML-Files)
> on how to open and edit an HTML file in either TextEdit or Notepad, as well
> as some other editors. When you're ready for a small adventure, we recommend
> exploring a more advanced text editor such as [VS
> Code](https://code.visualstudio.com) or [Atom](https://atom.io). And there
> are even [more text
> editors](https://www.google.com/search?q=best%20text%20editors%20for%20code&cad=h)
> too!

Copy the following code into the HTML file. Now save the file with a name ending in `.html`, click `File > Open` in
your favorite web browser, choose the `.html` file that you saved, and open
it. You should see the same visual as in the following example:

<div id="globalInstall"></div>

Let's go over what this does. The first line,

```html
<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"></script>
```

is an HTML `<script>` element that tells the browser where to get LUME code from.

> **TIP:** If HTML text format is totally new to you, see this [HTML
> tutorial](https://html.com).

What this will do in the web page (when you run it in your browser) is create
a global `LUME` variable that is available to all code in the web page.

After including the script tag, which loads LUME from http://unpkg.com (a
website that allows us to get code for any JavaScript projects that are
hosted on http://npmjs.com), we wrote

```html
<script type="module">
	LUME.defineElements()
</script>
```

which tells LUME to define all the HTML elements with their default tag names
so that we can use them in our HTML code, otherwise nothing would happen.

Next we wrote some HTML code using the LUME elements to define the structure
of a 3D scene on the screen:

```html
<lume-scene webgl>
	<lume-ambient-light intensity="0.5"></lume-ambient-light>
	<lume-point-light
		color="white"
		align-point="0.5 0.5"
		position="0 0 300"
		size="0 0 0"
		cast-shadow="true"
		intensity="0.65"
	>
	</lume-point-light>

	<lume-box id="box" size="100 100 100" align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0.5"> </lume-box>
</lume-scene>
```

The `lume-ambient-light`, `lume-point-light`, and `lume-box` elements must be placed
within the `lume-scene` element. We gave each element some properties like
`color`, `size`, `intensity`, etc, by specifying values for those properties
with HTML attributes on the elements (for example, `size="100 100 100"` on
the `lume-box` element to make a cube with a size of `100` in each dimension).

<!-- TODO: add a tip about 3D space, dimensions, etc, here. -->

Now that we've defined a scene, we made a `<script>` tag containing some code
to make our cube rotate:

```html
<script type="module">
	box.rotation = (x, y, z) => [x, y + 1, z]
</script>
```

The `box` variable is a global variable that references the `lume-box` element
because we gave that element an ID of "box" with the attribute `id="box"`.
The browser saves top-level elements as global variables with names matching
their IDs.

<!-- TODO: Add a tip here about JavaScript programming. -->

Finally, the file ended with some styling inside of a `<style>` element, in the form of CSS code:

```html
<style>
	body,
	html {
		width: 100%;
		height: 100%;

		padding: 0;
		margin: 0;

		background: #62b997;
	}
</style>
```

This styling makes the page take up the whole width and height of the browser
window, and gives the web page a background color.

<!-- TODO: Add a tip here regarding CSS, link to a tutorial. -->

### ES module install

> :construction: :hammer: Under construction! :hammer: :construction:

### Local install

> :construction: :hammer: Under construction! :hammer: :construction:
>
> This section is work-in-progress, but people with knowledge of common JavaScript tooling should get the idea.

More advanced users can install LUME from NPM:

```bash
npm install lume
```

```js
import * as LUME from 'lume'
LUME.defineElements()
```

## Define the HTML elements

Now that you've imported the code into your project, you must register the LUME
HTML elements with your browser, using either the default element names
(easier), or custom element names. Using custom names for the elements may be
useful for solving naming collisions if any arrise, or if you simply prefer to
use different names.

### with default names

The fastest way to get up and running is to tell LUME to use default naming
for all of its HTML elements:

```js
LUME.defineElements()
```

We can write the scene with JavaScript imperatively, without thinking about
the element names, like this:

<div id="defaultNamesImperative"></div>

Or we can write the scene declaratively with HTML, using the default element
names, like so:

<div id="defaultNamesDeclarative"></div>

> **Note:** The documentation will refer to the LUME elements by their default names.

> **Tip:** Right click (or two-finger click if you're in macOS) on the
> rotating blue square, then click on "Inspect" or "Inspect Element" depending
> on your browser, and you'll be able to see the live DOM. In some browsers
> (namely Safari) you may first need to enable developer tools before this
> option will appear in your context menu (see how to [enable the developer
> tools in
> Safari](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/Web_Inspector_Tutorial/EnableWebInspector/EnableWebInspector.html)).
> DOM stands for "Document Object Model". Essentially the DOM is a tree of HTML
> elements that are in your web page. Here's an [introduction to the
> DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction).

### with custom names

Sometimes you might like to use different element names (f.e. to avoid a
naming conflict, or just because you feel like it). You can do this using the
`.define()` method on any of the classes, for example:

```js
const {Scene, Node} = LUME

// Define custom names, only for these two classes:
Scene.defineElement('x-scene')
Node.defineElement('x-node')
```

> **Note:** If you choose not to use `LUME.defineElements()`, you must then
> define the custom names yourself for each element that you wish to use.

Here's the same imperative JavaScript example as the previous section, but
using custom names for the elements:

<div id="customNamesImperative"></div>

And similarly to the previous section, we can also write HTML using the
custom names:

<div id="customNamesDeclarative"></div>

<script>
new Vue({
  el: '#globalInstall',
  template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
  data: {
    code:
`<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"><\/script>

<script type=module>
    LUME.defineElements()
<\/script>

<!-- This defines the structure of a 3D scene with some lighting, and a 3D
cube in the middle of the view: -->
<lume-scene webgl>
	<lume-ambient-light intensity="0.5"></lume-ambient-light>
	<lume-point-light color="white" align-point="0.5 0.5" position="0 0 300" size="0 0 0" cast-shadow="true" intensity="0.65">
	</lume-point-light>

	<lume-box id="box" size="100 100 100" align-point="0.5 0.5 0.5" mount-point="0.5 0.5 0.5"> </lume-box>
</lume-scene>

<!-- Now we give the cube a basic rotation around the Y axis: -->
<script type=module>
	box.rotation = (x, y, z) => [x, y + 1, z]
<\/script>

<!-- Finally, default styling to the document: -->
<style>
	body,
	html {
		/*
		 * Make the root elements take full width/height of the window. Some browsers
		 * don't do this by default, so let's ensure that it we explicitly define
		 * it:
		 */
		width: 100%;
		height: 100%;

		/*
		 * Also remove default padding and margin. These changes give you a
		 * consistent experience across browsers, which are quirky.
		 */
		padding: 0;
		margin: 0;

		/* Let's set the background color of the web site using a hex code: */
		background: #62b997;
	}
</style>`

},
})

new Vue({
el: '#defaultNamesImperative',
template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
data: {
code:
`<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"><\/script>

<script type=module>
  LUME.defineElements()

  const {Scene, Node} = LUME
  const scene = new Scene()

  const node = new Node().set({
    position: [50, 50, 0], // X, Y, and Z position
    size: [100, 100, 0], // X, Y, and Z size
  })

  node.style.background = 'cornflowerblue'
  scene.append(node)
  document.body.append(scene)
  node.rotation = (x, y, z) => [x, y + 1, z]

  // The code outputs these elements to the DOM:
  // <body>
  //   <lume-scene>
  //     <lume-element3d position="50 50 0" size="100 100 0"></lume-element3d>
  //   </lume-scene>
  // </body>
<\/script>

<style>
  body, html {width: 100%; height: 100%; padding: 0; margin: 0}
</style>`

},
})

new Vue({
el: '#defaultNamesDeclarative',
template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
data: {
code:
`<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"><\/script>

<lume-scene>
  <lume-element3d id="node" position="50 50" size="100 100"></lume-element3d>
</lume-scene>

<script type=module>
  LUME.defineElements()
  document.getElementById('node').rotation = (x, y, z) => [x, y + 1, z]
<\/script>

<style>
  body, html {width: 100%; height: 100%; padding: 0; margin: 0;}
  #node {background: cornflowerblue;}
</style>`

},
})

new Vue({
el: '#customNamesImperative',
template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
data: {
code:
`<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"><\/script>

<script type=module>
  const {Scene, Node} = LUME

  // Define custom names, only for these two classes:
  Scene.defineElement('x-scene')
  Node.defineElement('x-node')

  const scene = new Scene()

  const node = new Node().set({
    position: [50, 50, 0], // X, Y, and Z position
    size: [100, 100, 0], // X, Y, and Z size
  })

  node.style.background = 'cornflowerblue'
  scene.append(node)
  document.body.append(scene)
  node.rotation = (x, y, z) => [x, y + 1, z]

  // The code outputs these elements to the DOM:
  // <body>
  //   <x-scene>
  //     <x-node position="50 50 0" size="100 100 0"></x-node>
  //   </x-scene>
  // </body>
<\/script>

<style>
  body, html {width: 100%; height: 100%; padding: 0; margin: 0}
</style>`

},
})

new Vue({
el: '#customNamesDeclarative',
template: '<live-code :template="code" :autorun="true" mode="html>iframe" />',
data: {
code:
`<script src="https://unpkg.com/lume@0.3.0-alpha.9/dist/global.js"><\/script>

<x-scene>
  <x-node id="node" position="50 50" size="100 100"></x-node>
</x-scene>

<script type=module>
  const {Scene, Node} = LUME

  // Define custom names, only for these two classes:
  Scene.defineElement('x-scene')
  Node.defineElement('x-node')

  document.getElementById('node').rotation = (x, y, z) => [x, y + 1, z]
<\/script>

<style>
  body, html {width: 100%; height: 100%; padding: 0; margin: 0;}
  #node {background: cornflowerblue;}
</style>`

},
})
</script>
