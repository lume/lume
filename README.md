#Boxer Engine

[![Join the chat at https://gitter.im/infamous/boxer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/infamous/boxer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##A proposal for the new API used by the Infamous Community.

The goal of this project is to create a scene graph that is minimal with components that are abstracted enough to be swapped out.

The built project is found in dist/boxer.js. Boxer currently operates on the window as an Object, similar to Famous.

- This project is very early in development.

###Advantages found in this approach:

* Scene Graph can be queried for Nodes so you don't have to store references to Nodes in your project, like in the Famous examples.

* Scene operates in a Web Worker, meaning the calculations needed to transform Nodes also happen on this thread.

* Not dependent on external libraries.


###Coming Soon:

* Support for Matrix Transformations and Vector Math on Nodes.
* An API for making UI Components and examples for DOMElement and Mesh.
* Unified UI Event system for GL and DOM.
* Refactor to use ES6 Modules.

##Getting Started

An example is provided in the root directory. Use any local server to host index.html. `live-server` is a useful tool for this.

`app.js` initializes the Engine and the Web Worker. It is fairly minimal at the moment.

```
var sceneWorker = new Worker('worker.js');
var engine = boxer.core.Engine;
engine.init(sceneWorker);

```

Currently the scene is injected into the Engine so the Web Worker can receive ticks from the Engine.

`worker.js` handles most of the application logic and it will be where all matrix transformations are calculated.


##Development

To build the project yourself use Browserify for the time being.

`browserify src/index.js -d --s boxer > dist/boxer.js`

If you want to help on this project, IM @steveblue on the Infamous/Motor Gitter.
