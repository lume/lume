<p align="center"><img width="200"src="http://i.imgur.com/MCcLoYk.png"></p>

SamsaraJS is a functional reactive library for animating layout. It provides a language for positioning,
orienting and sizing DOM elements and animating these properties over time. Everything in SamsaraJS — from 
the user input to the rendering pipeline — is a stream. Building a user interface becomes the art of composing streams.

SamsaraJS was created to solve performance on the mobile web. Under the hood, animations are hardware accelerated 
and batched by a single request animation frame loop. Building responsive user interfaces
is made possible with physics-based transitions, rich support for gestures, and a stream architecture that 
makes coordinating complex animations simple.

SamsaraJS doesn't have any opinions about content, only presentation. It moves rectangles around the screen — 
what you do inside those rectangles is up to you. It doesn’t include any support for routing, server syncing, 
templating or data-binding; there are plenty of other great frameworks for that. If we don’t play nicely with your tools, 
let us know and we will do our best to improve. Integrations with MVC frameworks like Backbone and React are on the roadmap.

**tl;dr** If you've ever wanted the opacity of a nav bar to respond to the displacement of a hamburger menu which
responds to a user's swipe gesture, then you might want to clone this repo.

### Getting Started

| Resources      ||
| -------------- | ------------- |
| Walkthrough    | [samsaraJS.org/docs](http://www.samsaraJS.org/docs)  |
| Examples       | [samsaraJS.org/examples](http://www.samsaraJS.org/examples)  |
| API docs       | [samsaraJS.org/reference_docs](http://www.samsaraJS.org/reference_docs)  |
| Questions      | [SamsaraJS Google Group](https://groups.google.com/forum/#!forum/samsarajs) |

## Installation

SamsaraJS requires a small CSS file located at `dist/samsara.css`. For all of the installation methods
below, you will also need to include this CSS file for SamsaraJS to work properly.

### AMD

AMD modules loaded with require.js is currently the recommended way of installing SamsaraJS.
Simply clone this repo and put the `samsara` sub-directory into your project. The `samsara.css` file
is also located in this sub-directory for convenience.

### CommonJS

Installing with npm will provide a CommonJS module containing all of SamsaraJS.

```
	npm install samsarajs
```

This will provide a bundled `Samsara` object. Note there is a case-difference: path keys are
capitalized for CommonJS but lowercase for AMD.

```js
	var Surface = require('samsara/dom/Surface');   // AMD
	var Surface = require('samsarajs').DOM.Surface; // CommonJS
```

The `samsara.css` file will also be included in `samsarajs/samsara.css`.

### Window Object

Copy `dist/samsara.js` and include it as a source file. `Samsara` will then be accessible
through `window.Samsara`. This is particularly useful for sharing on sites like jsFiddle, CodePen, etc.

## Examples:

1. [**examples/SideMenu**](https://github.com/dmvaldman/samsara/tree/master/examples/SideMenu)
A simple demo with a side-drawer. This example incorporates gestures, physics transitions, native scrolling, transforms 
in 3D space and coordinated animations.
[[demo]](http://goo.gl/nhRGeg)

2. [**examples/Logo**](https://github.com/dmvaldman/samsara/tree/master/examples/Logo)
The SamsaraJS logo. This example showcases responsive design and animation.
[[demo]](http://goo.gl/p4HQiv)

More examples can be found at [samsaraJS.org/examples](http://www.samsaraJS.org/examples).

## Talks
[![Talk](http://i.imgur.com/tGbmVk4.png)](https://www.youtube.com/watch?v=biJXpv-6XVY)
[JSConf EU 2015 Berlin, Germany](https://www.youtube.com/watch?v=biJXpv-6XVY)

## Roadmap
- [ ] Ability to remove render tree nodes (surface.remove(), node.remove(), etc)
- [ ] Backbone.js & React.js integration
- [ ] Scrollview
- [ ] 3D Camera
- [ ] More layouts
