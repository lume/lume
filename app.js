var SceneWorker = new Worker('src/workers/SceneWorker.js');
var controller;
var nodes = [];

// Add 180 Nodes to the Scene in a SubGraph.
for( var i=0; i<180; i++ ){
    var conf = {
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
    };

    nodes.push(conf);

};

controller = new ViewController(nodes, SceneWorker);
