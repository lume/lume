
Install
=======

1 - Get the lib
---------------

Use the "global" version of infamous via script tag in your HTML page:

```html
<script src="https://unpkg.com/infamous@17.0.5/global.js"></script>
<script> infamous.html.useDefaultNames() </script>
```

Or install from NPM:

```sh
npm install infamous --save
```
```js
import infamous from 'infamous'
infamous.html.useDefaultNames()
```

2 - Define the HTML elements
----------------------------

You *must* register the infamous HTML elements with your browser, using default
names (easier), or custom names.

<h3> with default names </h3>

The fastest way to get up and running is to tell infamous to use default naming
for all of its HTML elements:

```js
import { useDefaultNames } from 'infamous/html'

// tell infamous to
useDefaultNames()
```

Then either write the scene with JavaScript,

```js
import Scene from 'infamous/core/Scene'
import Node from 'infamous/core/Node'

const scene = new Scene()

const node = new Node({
  position: [100, 100, 0]
})

scene.add(node)
scene.mount(document.body)

// outputs to the DOM:
// <body>
//   <i-scene>
//     <i-node style="matrix3d(...)">
//     </i-node>
//   </i-scene>
// </body>
```

...or write HTML using the default names.

```html
<body>
  <i-scene>
    <i-node position="100 100">
    </i-node>
  </i-scene>
</body>
```

The documentation will refer to all the elements by their default names.

<h3> with custom names </h3>

But sometimes you might like to use different element names (f.e. to avoid a
naming conflict, or just because you feel like it). You can do this using the
`.define()` method on any of the classes, for example:

```js
import Scene from 'infamous/core/Scene'
import Node from 'infamous/core/Node'

// define custom names:
Scene.define('nfms-scene')
Node.define('nfms-node')
```

Then either write the scene with JavaScript,

```js
const scene = new Scene()

const node = new Node({
  position: [100, 100, 0]
})

scene.add(node)
scene.mount(document.body)

// outputs to the DOM:
// <body>
//   <nfms-scene>
//     <nfms-node style="matrix3d(...)">
//     </nfms-node>
//   </nfms-scene>
// </body>
```

...or write HTML using the custom names.

```html
<body>
  <nfms-scene>
    <nfms-node position="100 100">
    </nfms-node>
  </nfms-scene>
</body>
```
