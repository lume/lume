importScripts('../../dist/boxer.js');

var Scene = boxer.core.Scene;
var Node = boxer.core.Node;

// API for working on a Scene via messages to/from WebWorker

onmessage = function(e) {

    if(e.data.frame){
      //  Scene.update(e.data.frame);
    }
    if(e.data.message) {
      //  Scene.update(e.data.message);
        //postMessage(e.data.message);
    }
    if(e.data.addNode){
        Scene.addChild(new Node(e.data.addNode, Scene));
    }
    if(e.data.addSubGraph){
        e.data.addSubGraph.forEach(function(node){
            Scene.addChild(new Node(node, Scene));
        });
    }
    if(e.data.removeNode){
        Scene.removeChild(Scene.findOne(e.data.removeNode));
    }
    if(e.data.removeSubGraph){
        e.data.removeSubGraph.forEach(function(query){
            Scene.removeChild(Scene.findOne(query));
        });
    }
    if(e.data.graph){
        //console.log(Scene.graph);
        postMessage(Scene.graph);
    }
    if(e.data.query){
        postMessage(Scene.findOne(e.data.query));
    }
    if(e.data.transition){
        var n = Scene.findOne(e.data.query);
        console.log(Scene);
        n.setTransitionable(e.data.transition);
        //postMessage(n.t[e.data.transition.t]);
    }

}
