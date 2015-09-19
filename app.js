var SceneWorker = new Worker('src/workers/SceneWorker.js');
var Engine = boxer.core.Engine;
var Scene = boxer.core.Scene;
var DOMComponent = boxer.components.DOMComponent;

var scene = {
    addSubGraph: []
};

var elements = {}; // a graph of elements;


// Add 180 Nodes to the Scene in a SubGraph.
for( var i=0; i<180; i++ ){
    scene.addSubGraph.push({
        position : [Math.random() * (window.innerWidth - 0) + 0 , Math.random() * (window.innerHeight - 0) + 0 , 0],
        origin : [0.0,0.0,0.0],
        align : [0.0,0.0,0.0],
        size : [20,20,20],
        rotate: [i*4,i*4,0],
        opacity : 1.0,
    });
    elements['elem-'+i] = new DOMComponent('node-'+i);
};

SceneWorker.postMessage(scene); // Adds Nodes to the Scene.
SceneWorker.postMessage({graph:true}); // send message to Scene Worker to retrieve current Graph.
//TODO: Make a better API for this.
SceneWorker.postMessage({query:{
                            id:'node-24'}
                        });

SceneWorker.onmessage = function(e) {
  console.log(e.data);  // receive message from Scene Worker that represents current Graph.

}

console.log(elements);

// TODO: Change for better API? Need to link Scene to receive updates somehow...
Engine.init(SceneWorker);
