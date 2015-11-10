#Boxer Engine

[![Join the chat at https://gitter.im/infamous/boxer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/infamous/boxer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##A proposal for the new API used by the Infamous Community.

The goal of this project is to create a scene graph that is minimal with components that are abstracted enough to be swapped out.

The built project is found in dist/boxer.js. Boxer currently operates on the window as an Object, similar to Famous.

- This project is very early in development.


###Coming Soon:

* API for making UI Components and examples for DOMElement and Mesh.
* Unified UI Event system for GL and DOM.
* Refactor to use ES6 Modules.
* Add Support for Safari, Firefox, and Edge.

##Getting Started

An example is provided in the root directory. Use any local server to host index.html. `live-server` is a useful tool for this.

`app.js` initializes the Engine and the Web Worker. It is fairly minimal at the moment.

```
var SceneWorker = new Worker('src/workers/SceneWorker.js');
var controller;
var nodes = [];

// Add 180 Nodes to the Scene and fade them in.
for( var i=0; i<180; i++ ){
    nodes.push({
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

controller = new ViewController(nodes, SceneWorker);


```

Currently the scene is injected into the Engine so the Web Worker can receive ticks from the Engine. `SceneWorker.js` handles the calculations on each Node and maintains the graph on a separate thread from application logic (above).


##Development

`npm install` - Install only 1 dependency for prototype, XCSSMatrix to get up and running with CSS 3D Transforms.

To build the project yourself use Browserify for the time being.

`browserify src/index.js -d --s boxer > dist/boxer.js`

If you want to help on this project, join the community on the infamous/boxer Gitter.

##What's Needed

* API for timeline
* Unified UI Event System for DOM / GL
* Update Queue?
* Component API
* Three.js Mesh Component
* Math Utilities (Vec2, Vec3, Matrix, etc)
