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

ViewController.prototype.addNode = function(model){

  var id = model.id || 'node-'+Math.floor(Math.random() * (32768 - 16384)) + 16384;
  model.id = id;
  this.scene.addSubGraph.push(model);
  this.elements[model.id || 'node-'+i] = new DOMComponent(model);

};

ViewController.prototype.getComponent = function(model){
    return this.elements[model.id];
};

ViewController.prototype.broadcast = function(msg,conf){
  if(this.worker){
      console.log(msg.constructor.name);
      if(msg.constructor.name === 'String'){
        this.worker.postMessage({query:{id:msg},transition:conf});
      } else {
        this.worker.postMessage(msg);
      }

  }
};

ViewController.prototype.receive = function(e) {

  if(e.data && e.data.message) {
    if(e.data.message.prop === 'rotate' ||
       e.data.message.prop === 'translate' ||
       e.data.message.prop === 'scale'){
      this.elements[e.data.node]._node[e.data.message.prop] = e.data.message.val;
    } else {
      this.elements[e.data.node].elem.style[e.data.message.prop] = e.data.message.val;
    }

  } else if(e.data && e.data.id) {
    console.log(e.data.id, this.elements[e.data.id]);

  }

}
//
// module.exports = ViewController;
