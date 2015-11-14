var SceneWorker = new Worker('../src/workers/SceneWorker.js');
var controller;
var nodes = [{
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,0.0,0.0],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-header',
    opacity : 1.0
},
// {
//     position: 'absolute',
//     origin : [0.0,0.0,0.0],
//     align : [0.0,0.0,0.0],
//     size : [1.0,0.8,0],
//     scale : [1.0,1.0,1.0],
//     rotate: [0,0,0],
//     id: 'app-content',
//     opacity : 1.0
// },
{
    position: 'absolute',
    origin : [0.0,0.0,0.0],
    align : [0.0,1.0,0.0],
    size : [1.0,0.1,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-footer',
    opacity : 1.0
}];

controller = new ViewController(nodes, SceneWorker);
