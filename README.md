#Boxer Engine

[![Join the chat at https://gitter.im/infamous/boxer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/infamous/boxer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##A proposal for the new API used by the Infamous Community.

The goal of this project is to create a scene graph that is minimal with components that are abstracted enough to be swapped out.

The built project is found in dist/boxer.js. Boxer currently operates on the window as an Object, similar to Famous.

- This project is very early in development.

###Advantages found in this approach:

* Scene Graph can be queried for Nodes so you don't have to store references to Nodes in your project.

* Scene operates in a Web Worker, meaning the calculations needed to transform Nodes also happen separately on this thread while DOM Manipulation happens in your application logic.

* Not dependent on external libraries.


###Coming Soon:

* Support for Matrix Transformations and Vector Math on Nodes.
* API for making UI Components and examples for DOMElement and Mesh.
* Unified UI Event system for GL and DOM.
* Refactor to use ES6 Modules.

##Getting Started

An example is provided in the root directory. Use any local server to host index.html. `live-server` is a useful tool for this.

`app.js` initializes the Engine and the Web Worker. It is fairly minimal at the moment.

```
var SceneWorker = new Worker('dist/workers/SceneWorker.js');
var Engine = boxer.core.Engine;

var scene = {
    addSubGraph: [{
        position : [0,0,0],
        origin : [0.0,0.0,0.0],
        align : [0.0,0.0,0.0],
        size : [120,120,120],
        rotate: [0,180,0],
        opacity : 1.0,
    },
    {
        position : [0,0,0],
        origin : [0.5,0.5,0.5],
        align : [0.5,0.5,0.5],
        size : [120,120,120],
        rotate: [0,0,0],
        opacity : 1.0,
    },
    {
        position : [0,0,0],
        origin : [0.5,0.5,0.5],
        align : [0.9,0.5,0.5],
        size : [120,120,120],
        rotate: [0,-180,0],
        opacity : 1.0,
    }]
};

SceneWorker.postMessage(scene);
SceneWorker.postMessage({graph:true}); // send message to Scene Worker to retrieve current Graph.


SceneWorker.onmessage = function(e) {
  console.log(e.data);  // receieve message from Scene Worker that represents current Graph.
}

// TODO: Change for better API? Need to link Scene to receive updates somehow...
Engine.init(SceneWorker);

```

Currently the scene is injected into the Engine so the Web Worker can receive ticks from the Engine. `SceneWorker.js` handles the calculations on each Node and maintains the graph on a seprate thread from application logic (above).


##Development

To build the project yourself use Browserify for the time being.

`browserify src/index.js -d --s boxer > dist/boxer.js`

If you want to help on this project, join the community on the infamous/boxer Gitter.

##What's Needed

* Update Queue for Nodes in a Scene
* Component API
* DOM Component
* Three.js Mesh Component
* Finish integrating Famous Transitionable
* Unified UI Event System for Nodes
* Math Utilities (Vec2, Vec3, Matrix, etc)
