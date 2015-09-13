var SceneWorker = new Worker('src/workers/SceneWorker.js');
var Engine = boxer.core.Engine;
var Scene = boxer.core.Scene;

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


// TODO: Change for better API? Need to link Scene to receive updates somehow...
Engine.init(SceneWorker);


SceneWorker.onmessage = function(e) {
  console.log(e.data);  // receieve message from Scene Worker that represents current Graph.
}
