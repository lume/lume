var SceneWorker = new Worker('src/workers/SceneWorker.js');
var controller;
var nodes = [];

// Add 180 Nodes to the Scene in a SubGraph.
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
            t: 'rotate',
            from: [(i+1)*4,0,(i+1)*4],
            to: [(i+1)*-4,0,(i+1)*-4],
            curve: 'linear',
            duration: 10000,
            delay: 0,
            loop: true
        }
    });

};

controller = new ViewController(nodes, SceneWorker);
