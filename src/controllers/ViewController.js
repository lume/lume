var Engine = boxer.core.Engine;
var Scene = boxer.core.Scene;
var Node = boxer.core.Node;
var DOMComponent = boxer.components.DOMComponent;

var ViewController = function(model, worker){
  var v = this;
  this.scene = {
      addSubGraph: []
  }; // a model for a scene graph
  this.elements = {}; // a graph of elements;
  this._callback = null;

  this.set(model, worker);

  Engine.init(worker);

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
  if(this.worker.constructor.name === 'Worker'){
    this.worker.onmessage = this.receive.bind(this);
    this.worker.postMessage(v.scene); // send the model to the Scene Graph
  }
  else {
     var scene = this.scene;
     this.worker.onmessage = this.update.bind(this);
     for(var i=0; i<this.scene.addSubGraph.length; i++) {
        this.worker.addChild(new Node(scene.addSubGraph[i], worker));
        if(this.scene.addSubGraph[i].transition) {

          this.transition(scene.addSubGraph[i].id, scene.addSubGraph[i].transition);
        }
     }
  }
};

ViewController.prototype.addComponents = function(model){

  var scene = {
    subGraph : []
  },
  worker = this.worker;

  for( var i=0; i<model.length; i++ ){
    var id = model.id || 'node-'+Math.floor(Math.random() * (32768 - 16384)) + 16384;
    model[i].id = id;
    scene.subGraph.push(model[i]);
    this.elements[model[i].id || 'node-'+i] = new DOMComponent(model[i], model[i].elem, model[i].container);
  }

  if(this.worker.constructor.name === 'Worker'){
      this.worker.postMessage(scene);
  } else {
     for(var i=0; i<scene.subGraph.length; i++) {
        this.worker.addChild(new Node(scene.subGraph[i], worker));
        if(scene.subGraph[i].transition) {
          this.transition(scene.subGraph[i].id, scene.subGraph[i].transition);
        }
     }
  }


};

ViewController.prototype.addComponent = function(model, elem, container){

  var id = model.id || 'node-'+Math.floor(Math.random() * (32768 - 16384)) + 16384,
      worker = this.worker;
  model.id = id;
  this.elements[model.id] = new DOMComponent(model, elem, container);
  if(this.worker.constructor.name === 'Worker'){
    this.worker.postMessage({
      addNode: model
    });
  } else {
    this.worker.addChild(new Node(model, worker));
  }

};

ViewController.prototype.getComponent = function(model){
    return this.elements[model.id];
};

ViewController.prototype.transition = function(msg,conf){
  if(this.worker.constructor.name === 'Worker'){
      this.worker.postMessage({query:{id:msg},transition:conf});
  } else {
    var n = this.worker.fetchNode(msg);
    n.setTransitionable(conf);
  }
};

ViewController.prototype.broadcast = function(msg){
  if(this.worker.constructor.name === 'Worker'){
      this.worker.postMessage(msg);
  } else {

  }
};

ViewController.prototype.degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

ViewController.prototype.update = function(e) {

  if(e.message) {
    if(e.message.prop === 'rotate') {
      this.elements[e.node]._node[e.message.prop] = [e.message.val[0],
       e.message.val[1],
       e.message.val[2]];
    }
    else if(e.message.prop === 'translate' ||
       e.message.prop === 'scale' ||
       e.message.prop === 'opacity' ||
       e.message.prop === 'size' ||
       e.message.prop === 'origin' ||
       e.message.prop === 'align'  ){
      this.elements[e.node]._node[e.message.prop] = e.message.val;
    } else {
      this.elements[e.node].elem.style[e.message.prop] = e.message.val;
    }

  }

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

};
//
// module.exports = ViewController;
