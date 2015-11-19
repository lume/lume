var Engine = boxer.core.Engine;
var Scene = boxer.core.Scene;
var DOMComponent = boxer.components.DOMComponent;

var ViewController = function(model, worker){
  var v = this;
  this.scene = {
      addSubGraph: []
  }; // a model for a scene graph
  this.elements = {}; // a graph of elements;
  this._callback = null;

  this.set(model, worker);

  Engine.init(SceneWorker);

  window.addEventListener('resize',this.resize.bind(this));

};

ViewController.prototype.resize = function(){
  for(var prop in this.elements) {
    this.elements[prop].resize();
  }
};

ViewController.prototype.set = function(model, worker){
  var v = this;
  for( var i=0; i<model.length; i++ ){
    this.scene.addSubGraph.push(model[i]);
    this.elements[model[i].id || 'node-'+i] = new DOMComponent(model[i]);
  }
  this.worker = worker;
  this.worker.onmessage = this.receive.bind(this);
  this.worker.postMessage(v.scene); // send the model to the Scene Graph
};

ViewController.prototype.addComponents = function(model){

  var scene = {
    subGraph : []
  };
  for( var i=0; i<model.length; i++ ){
    var id = model.id || 'node-'+Math.floor(Math.random() * (32768 - 16384)) + 16384;
    model[i].id = id;
    scene.addSubGraph.push(model[i]);
    this.elements[model[i].id || 'node-'+i] = new DOMComponent(model[i], model[i].elem, model[i].container);
  }
  this.worker.postMessage(scene);

};

ViewController.prototype.addComponent = function(model, elem, container){

  var id = model.id || 'node-'+Math.floor(Math.random() * (32768 - 16384)) + 16384;
  model.id = id;
  this.elements[model.id] = new DOMComponent(model, elem, container);
  this.worker.postMessage({
    addNode: model
  });

};

ViewController.prototype.getComponent = function(model){
    return this.elements[model.id];
};

ViewController.prototype.transition = function(msg,conf){
  if(this.worker){
      this.worker.postMessage({query:{id:msg},transition:conf});
  }
};

ViewController.prototype.broadcast = function(msg){
  if(this.worker){
      this.worker.postMessage(msg);
  }
};

ViewController.prototype.degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

ViewController.prototype.receive = function(e) {

  if(e.data && e.data.message) {
    if(e.data.message.prop === 'rotate') {
      this.elements[e.data.node]._node[e.data.message.prop] = [e.data.message.val[0],
       e.data.message.val[1],
       e.data.message.val[2]];
    }
    else if(e.data.message.prop === 'translate' ||
       e.data.message.prop === 'scale' ||
       e.data.message.prop === 'opacity' ||
       e.data.message.prop === 'size' ||
       e.data.message.prop === 'origin' ||
       e.data.message.prop === 'align'  ){
      this.elements[e.data.node]._node[e.data.message.prop] = e.data.message.val;
    } else {
      this.elements[e.data.node].elem.style[e.data.message.prop] = e.data.message.val;
    }

  } else if(e.data && e.data.id) {
    // node is received, but what use is it?
    //console.log(e.data.id, this.elements[e.data.id]);

  }

}
//
// module.exports = ViewController;
