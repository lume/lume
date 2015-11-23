importScripts('../../dist/boxer.js');

/**
* SceneWorker
*
* API for messaging a Scene in a WebWorker. Compatible with ViewController. 
*
* by Steve Belovarich
* Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
**/


var Scene = boxer.core.Scene;
var Node = boxer.core.Node;

// API for working on a Scene via messages to/from WebWorker

onmessage = function(e) {
    if(e.data.frame){
      Scene.tick(e.data.frame);
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
    // if(e.data.graph){
    //     //console.log(Scene.graph);
    //     postMessage(Scene.graph);
    // }

    if(e.data.transition){
        var n = Scene.findOne(e.data.query);
        //console.log(Scene);
        n.setTransitionable(e.data.transition);
        //postMessage(n.t[e.data.transition.t]);
        return;
    }
    if(e.data.query){
        postMessage(Scene.findOne(e.data.query));
    }

}
