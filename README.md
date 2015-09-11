#Boxer Engine

##A proposal for the new API used by the Infamous Community.

The goal of this project is to create a scene graph that is minimal with components that are abstracted enough to be swapped out.

The built project is found in dist/boxer.js. Boxer currently operates on the window as an Object, similar to Famous.

###Advantages found in this approach:

* Scene Graph can be queried for Nodes so you don't have to store references to Nodes in your project, like in the Famous examples.

* Scene operates in a Web Worker, meaning the calculations needed to transform Nodes also happen on this thread.

* Not dependent on external libraries.


###Coming Soon:

* Support for Matrix Transformations and Vector Math on Nodes.
* An API for making UI Components and examples for DOMElement and Mesh.
* Unified UI Event system for GL and DOM.
* Refactor to use ES6 Modules.


To build the project yourself use Browserify for the time being.

`browserify src/index.js -d --s boxer > dist/boxer.js`

If you want to help on this project, IM @steveblue on the Infamous/Motor Gitter.
