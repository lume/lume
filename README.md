SamsaraJS is a functional reactive library for animating layout. It provides a language for positioning,
orienting and sizing DOM elements and animating these properties over time. This is all SamsaraJS does, 
but it has strong opinions. Everything in SamsaraJS — from the user input to the rendering pipeline — is a 
stream. Building a user interface becomes the art of composing streams.

SamsaraJS was created with the mobile web in mind. Under the hood, animations are hardware accelerated 
and batched by a single request animation frame loop. Building responsive gesture-based interfaces
is made possible with physics-based transitions and a stream architecture that makes it simple to 
coordinate complex animations.

tl;dr If you've ever wanted the opacity of a nav bar to respond to the displacement of a hamburger menu which
responds to a user's swipe gesture, then you might want to clone this repo.

### Getting Started

| Resources      ||
| -------------- | ------------- |
| Walkthrough    | [samsaraJS.org/docs](http://www.samsaraJS.org/docs)  |
| Examples       | [samsaraJS.org/examples](http://www.samsaraJS.org/examples)  |
| API docs       | [samsaraJS.org/reference_docs](http://www.samsaraJS.org/reference_docs)  |
| Questions      | [Google Group](https://groups.google.com/forum/#!forum/samsarajs) |

### Installation

SamsaraJS requires a small CSS file located at `dist/samsara.css`. For all of the installation methods
below, you will also need to include this CSS file for SamsaraJS to work properly.

## AMD

AMD modules loaded with `requireJS` is currently the recommended way of installing SamsaraJS.
Simply clone this repo and put the `samsara` sub-directory into your project. The `samsara.css` file
is also located in this sub-directory.

## CommonJS

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

## Window Object

Copy `dist/samsara.js` and include it as a source file.

#### Examples:

1. **examples/SideMenu**
A simple demo with a side-drawer. This example showcases the coordination of many animations, 
physics transitions from a gesture, native scrolling and 3D transformations.
[[demo]](http://samsara-navigation-controller.s3-website-us-west-2.amazonaws.com)

2. **examples/Logo**
The SamsaraJS logo. This example showcases responsive design and animation. The logo will scale 
to fit the size of the window.
[[demo]](http://samsara-logo.s3-website.eu-central-1.amazonaws.com)

More examples can be found [online](http://www.samsaraJS.org/examples).

### Talks
[![Talk](http://i.imgur.com/tGbmVk4.png)](https://www.youtube.com/watch?v=biJXpv-6XVY)
[JSConf EU 2015 Berlin, Germany](https://www.youtube.com/watch?v=biJXpv-6XVY)

### Roadmap
- [ ] Ability to remove render tree nodes (surface.remove(), node.remove(), etc)
- [ ] Backbone.js & React.js integration
- [ ] Scrollview
- [ ] 3D Camera
- [ ] More layouts
