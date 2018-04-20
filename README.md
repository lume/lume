# View Engine (Codename Boxer)

[![Join the chat at https://gitter.im/infamous/boxer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/infamous/boxer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## A library that uses CSS 3D Transforms to provide highly performant Views to Web Apps.

The goal of this project is to create a scene graph that contains nodes which handle calculations needed to animate DOM Elements.

The built project is found in dist/boxer.js. Boxer currently operates on the window as an Object, similar to Famous.

- This project is very early in development.


### Coming Soon:

* UI Event System
* Responsive Framework
* ES6 Modules

## Getting Started

Examples are provided in a web app built with this Engine in the root directory of the repo and [here](http://devmagnet.net/boxer/demo).

Below is an example that initializes the Engine and Scene Graph, configures 180 nodes and adds them to the graph. Each node is set to transition it's opacity over 1 second from 0 to 1. A ViewController handles normal tasks associated with a higher level API.

```
var Scene = boxer.core.Scene;
var controller = new ViewController([], Scene);

// Add 180 Nodes to the Scene and fade them in.
for( var i=0; i<180; i++ ){
    controller.addComponent({
        position: 'absolute',
        translate : [0, 0, 0],
        origin : [0.0,0.0,0.0],
        align : [0.0,0.0,0.0],
        size : [80,80,80],
        scale : [0.5,0.5,0.5],
        rotate: [(i+1)*4,0,(i+1)*4],
        id: 'node-'+i,
        opacity : 0.0,
        transition:{
            t: 'opacity',
            from: 0.0,
            to: 1.0,
            curve: 'linear',
            duration: 1000,
            delay: 0
        }
    });
};


```

## Performance Tips

- Don't use 'position' property to force elements into a layout, this will make the browser repaint Elements unnecessarily. Use float or flexbox instead.
- Setting the z to either 'translate' or 'align' an Element to 1 will force DOMComponent to draw Matrix3D transforms and leverage GPU.


## Development

`npm install` - Install only 1 dependency for prototype, XCSSMatrix to get up and running with CSS 3D Transforms.

To build the project yourself use Browserify for the time being.

`browserify src/index.js -d --s boxer > dist/boxer.js`

Lately, I've been relying on `live-server` to setup watchers and give me an instant dev server. `npm install -g live-server` will install this package globally.

If you want to help on this project, join the community on the infamous/boxer Gitter.

## What's Needed

* API for timeline to create complex Transitions
* Event System similar to Famo.us 0.3.5 that allows dev to sync EventListeners
* Update Queue, Performance Audit
* Deprecate position property in favor of flexbox.
* Physics Engine
* Three.js Mesh Component
* Math Utilities (Vec2, Vec3, Matrix, etc)
* Refactor translate, rotate, scale, align, origin, etc to use Vec2 and Vec3 Objects instead of Arrays.
* Refactor library to use ES6 Modules, remove Browserify dependency for build
