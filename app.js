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
        id: 'node-'+i,
        opacity : 0.0,
        transitionables : [{
            id: 'opacity',
            startValue: 0.0
        },{
            id: 'position',
            startValue: [0,0,0]
        }],
        observables: ['opacity','position','align','rotate']
    });
    elements['elem-'+i] = new DOMComponent('node-'+i);
};

SceneWorker.postMessage(scene); // Adds Nodes to the Scene.
SceneWorker.postMessage({graph:true}); // send message to Scene Worker to retrieve current Graph.
//TODO: Make a better API for messaging Graph?
SceneWorker.postMessage({query:{
                            id:'node-4'}
                        });
SceneWorker.postMessage({query: {
                           id:'node-4'
                        },
                        transition:{
                            t: 'opacity',
                            from: 0.0,
                            to: 1.0,
                            curve: 'linear',
                            duration: 1000,
                            delay: 0
                        }
                        });


SceneWorker.onmessage = function(e) {

  if(e.data.message) {
    console.log(e.data.message);
      document.getElementsByClassName(e.data.node)[0].style.opacity = e.data.message.val;
  }

}

//console.log(elements);


// TODO: Change for better API? Need to link Scene to receive updates somehow...
Engine.init(SceneWorker);
