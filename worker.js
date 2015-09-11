importScripts('dist/boxer.js');

var Scene = boxer.core.Scene;
var Node = boxer.core.Node;

for(var i=0; i<100; i++){
    Scene.addChild(new Node());
}
console.log(Scene);

onmessage = function(e) {
    Scene.update(e.data.frame);
}
