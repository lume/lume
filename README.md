**Note**: _This project is not being developed further at the moment. I hope to return to it soon._

<p align="center"><img src="http://i.imgur.com/VOiEqxD.png"></p>

<p align="center">
  <a href="https://travis-ci.org/dmvaldman/samsara">
    <img src="https://travis-ci.org/dmvaldman/samsara.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://gitter.im/dmvaldman/samsara">
    <img src="https://badges.gitter.im/dmvaldman/samsara.svg" alt="Gitter Chat">
  </a>
</p>

SamsaraJS is a library for building _continuous_ user interfaces. A continuous UI is one where many
visual elements are animating in coordinated ways. For example, you may want to fade the opacity of a
nav bar while a settings menu is translated by a user's swipe gesture. Or maybe you want to blur and scale 
a banner image when a user scrolls some content past its limits, and add a springy bounce at the end.

Building these interactions and maintaining performance is hard, and SamsaraJS is here to help. It supports

- 3D transforms and perspective (all hardware accelerated)
- natural physics-based transitions like springs and inertia along with tweens
- user input for mouse and touch along with gestures like pinch, scale, and rotate
- a stream-based architecture for coordinating animations

SamsaraJS is opinionated about presentation, but has no opinions about content. It moves rectangles around the
screen — what you do inside them is up to you. There is no support for routing,
server syncing, templating, data-binding, etc. There are many other frameworks for those needs, and Samsara
is designed to be friends with them.

## Getting Started

| Resources      |               |
| -------------- | ------------- |
| Guide          | [samsaraJS.org/docs](http://www.samsaraJS.org/docs/index.html)  |
| API docs       | [samsaraJS.org/reference_docs](http://www.samsaraJS.org/reference_docs/index.html)  |
| Questions      | [SamsaraJS Google Group](https://groups.google.com/forum/#!forum/samsarajs) |

## Examples

| Example  | Demo (fullscreen) | Description |
| -------- | ----------------- | ----------- |
| Logo | [demo](http://samsarajs.org/demos/Logo/index.html) • [docs](http://samsarajs.org/demos/Logo/docs/main.html) | The SamsaraJS logo |
| Cube | [demo](http://samsarajs.org/demos/Cube/index.html) • [docs](http://samsarajs.org/demos/Cube/docs/main.html) | 3D spinning cube with animated size |
| ParallaxCats | [demo](http://samsarajs.org/demos/ParallaxCats/index.html) • [docs](http://samsarajs.org/ParallaxCats/Logo/docs/main.html/index.html) | Scrollview of cat images that parallax with the scroll |
| Carousel | [demo](http://samsarajs.org/demos/Carousel/index.html) • [docs](http://samsarajs.org/demos/Carousel/docs/main.html) | A paginated scrollview converted into a slideshow with previous/next buttons |
| SideMenu | [demo](http://samsarajs.org/demos/SideMenu/index.html) • [docs](http://samsarajs.org/demos/SideMenu/docs/main.html) | A navigation UI with an exposed side drawer |
| Safari Tabs | [demo](http://samsarajs.org/demos/SafariTabs/index.html) • [docs](http://samsarajs.org/demos/SafariTabs/docs/main.html) | A scrollview imitating the mobile Safari tab viewer |

## Installation

SamsaraJS requires a small CSS file located at `dist/samsara.css` or `samsara/samsara.css`. For all of the installation methods
below, you will also need to include this CSS file for SamsaraJS to work properly.

### Git

Clone this repo

```
git clone git@github.com:dmvaldman/samsara.git
```

You'll find AMD modules in the `samsara` directory, CommonJS bundles in the `dist` directory, examples in the
`examples` directory and reference documentation in the `docs` directory.

### NPM

Install the CommonJS build of Samsara with

```
npm install samsarajs
```

This will provide a bundled `Samsara` object. Note there is a case-difference: path keys are
capitalized for CommonJS but lowercase for AMD.

```js
var Surface = require('samsara/dom/Surface');   // AMD
var Surface = require('samsarajs').DOM.Surface; // CommonJS
```

The `samsara.css` file will also be included in `node_modules/samsarajs/dist/samsara.css`.

### Window Object

Copy `dist/samsara.js` and include it as a source file. `Samsara` will then be accessible
through `window.Samsara`. This is particularly useful for sharing on sites like jsFiddle, CodePen, etc.

### Yeoman Generator

A generator was made by [@richardkopelow](https://github.com/richardkopelow). This is an easy way to get started if you're comfortable with [yeoman](http://yeoman.io/). Follow the [installation instructions here](https://github.com/richardkopelow/generator-samsara).

## Talks
[![Talk](http://i.imgur.com/tGbmVk4.png)](https://www.youtube.com/watch?v=biJXpv-6XVY)
[JSConf EU 2015 Berlin, Germany](https://www.youtube.com/watch?v=biJXpv-6XVY)

[![Talk](http://i.imgur.com/O4mr8v7.png)](https://www.youtube.com/watch?v=9bmoo64hhg4)
[InRhythm Meetup](https://www.youtube.com/watch?v=9bmoo64hhg4)
