# Install

## Get the lib

Use the "global" version of Lume via script tag in your HTML page:

```html
<script src="https://unpkg.com/lume/dist/global.js"></script>
<script>
	LUME.useDefaultNames()
</script>
```

Or install from NPM:

```sh
npm install lume
```

```js
import * as LUME from 'lume'
LUME.useDefaultNames()
```

## Define the HTML elements

You must register the Lume HTML elements with your browser, using either the
default element names (which is easier), or custom element names. Using
custom names for the elements may be useful for solving a naming collision if
one arrises.

<h3> with default names </h3>

The fastest way to get up and running is to tell Lume to use default naming
for all of its HTML elements:

```js
import {useDefaultNames} from 'lume'

useDefaultNames()
```

Then either write the scene with JavaScript without thinking about the names,

```js
import {Scene, Node} from 'lume'

const scene = new Scene()

const node = new Node({
	position: [100, 100, 0],
})

scene.add(node)
scene.mount(document.body)

// outputs to the DOM:
// <body>
//   <i-scene>
//     <i-node ...>
//     </i-node>
//   </i-scene>
// </body>
```

...or write HTML using the default names.

```html
<body>
	<i-scene>
		<i-node position="100 100"> </i-node>
	</i-scene>
</body>
```

Note, the documentation will refer to all the elements by their default names.

<h3> with custom names </h3>

Sometimes you might like to use different element names (f.e. to avoid a
naming conflict, or just because you feel like it). You can do this using the
`.define()` method on any of the classes, for example:

```js
import {Scene, Node} from 'lume'

// define custom names:
Scene.define('x-scene')
Node.define('x-node')
```

Then either write the scene with JavaScript without thinking about the names,

```js
const scene = new Scene()

const node = new Node({
	position: [100, 100, 0],
})

scene.add(node)
scene.mount(document.body)

// outputs to the DOM:
// <body>
//   <x-scene>
//     <x-node ...></x-node>
//   </x-scene>
// </body>
```

...or write HTML using the custom names.

```html
<body>
	<x-scene>
		<x-node position="100 100"></x-node>
	</x-scene>
</body>
```
