var SceneWorker = new Worker('../../src/workers/SceneWorker.js');
var controller;
var nodes = [];

// Add 180 Nodes to the Scene in a SubGraph.
for( var i=0; i<180; i++ ){
    nodes.push({
        size : [0.1,null,80],
        scale : [0.5,0.5,0.5],
        rotate: [(i+1)*4,0,(i+1)*4],
        id: 'node-'+i,
        opacity : 0.0,
        transition:{
            t: 'rotate',
            from: [(i+1)*4,0,(i+1)*4],
            to: [(i+1)*-4,0,(i+1)*-4],
            curve: 'linear',
            duration: 14000,
            delay: 0,
            loop: true
        }
    });

};

controller = new ViewController(nodes, SceneWorker);

for( var i=0; i<180; i++ ){

controller.getComponent({id:'node-'+i}).addClass('rotate-node');

}
