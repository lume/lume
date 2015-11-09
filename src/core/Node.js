// Node handles storing the state of a node on the Scene Graph.
var Transitionable = require('../transitions/Transitionable');
var Curves = require('../transitions/Curves');

var _observableCallback = {};

var Node = function(conf, parent){

    this.transitionables = {};

    if(conf){
        this.serialize(conf);
    } else {
        this.setDefaults();
    }

    parent ? this.parent = parent : this.parent = null;

};

Node.prototype.setDefaults = function(conf){
    this.position = [0,0,0];
    this.origin = [0.0,0.0,0.0];
    this.align = [0.0,0.0,0.0];
    this.size = [0,0,0];
    this.scale = [1.0,1.0,1.0];
    this.rotate = [0,0,0];
    this.opacity = 1.0;
};

Node.prototype.serialize = function(conf){
    this.id = conf.id ? conf.id : null;
    this.position = conf.position ? conf.position : [0,0,0];
    this.origin = conf.origin ? conf.origin : [0.0,0.0,0.0];
    this.align = conf.align ? conf.align : [0.0,0.0,0.0];
    this.size = conf.size ? conf.size : [0,0,0];
    this.scale = conf.scale ? conf.scale : [1.0,1.0,1.0];
    this.rotate = conf.rotate ? conf.rotate : [0,0,0];
    this.opacity = conf.opacity ? conf.opacity : 1.0;
    this.observe(this.id, this);
    conf.t ? this.setTransitionables(conf.transitionables) : false;
};

Node.prototype.getProperties = function(){
    return {
        position: this.position,
        origin: this.origin,
        align: this.align,
        size: this.size,
        scale: this.scale,
        rotate: this.rotate,
        opacity: this.opacity,
        transitionables: this.transitionables//,
        //observables: this.observables
    }
};

Node.prototype.setPosition = function(pos){
    this.position = pos;
};

Node.prototype.getPosition = function(){
    return this.position;
};

Node.prototype.setSize = function(size){
    this.size = size;
};

Node.prototype.getSize = function(){
    return this.size;
};

Node.prototype.setScale = function(scale){
    this.scale = scale;
};

Node.prototype.getScale = function(){
    return this.scale;
};

Node.prototype.setOrigin = function(origin){
    this.origin = origin;
};

Node.prototype.getOrigin = function(){
    return this.origin;
};

Node.prototype.setAlign = function(align){
    this.align = align;
};

Node.prototype.getAlign = function(){
    return this.align;
};

Node.prototype.setRotation = function(rotation){
    this.rotation = rotation;
};

Node.prototype.getRotation = function(){
    return this.rotation;
};

Node.prototype.setOpacity = function(opacity){
    this.opacity = opacity;
};

Node.prototype.getOpacity = function(){
    return this.opacity;
};

Node.prototype.setTransitionable = function(conf){
    var n  = this;

    n.transitionables[conf.t] = conf;
    n.transitionables[conf.t].transition = new Transitionable(conf.from);
    n.transitionables[conf.t].transition.set(conf.to);
    //n.transitionables[conf.t].transition.set(conf.to);
    if(conf.delay) {
      n.transit(conf);
    } else {
      n.transitionables[conf.t]
       .transition
       .from(conf.from)
       .to(conf.to, conf.curve, conf.duration);
    }


    this[conf.t] = conf.to;
    n.transitionables[conf.t].transition.id = this.id;
    n.transitionables[conf.t].transition.param = conf.t;
    this.observe(this.id+'-'+conf.t, n.transitionables[conf.t].transition);
    //console.log(conf.t, this[conf.t], n.transitionables[conf.t].transition.get());
    //TODO: figure out a better way to update Transitionable
    setInterval(function(){
      n.transitionables[conf.t].transition.get();
    },10);

};

Node.prototype.transit = function(conf){
    var n  = this;
    if(conf.delay) {

      n.transitionables[conf.t].transition.from(conf.from).delay(conf.delay).to(conf.to, conf.curve, conf.duration);
    }
};

Node.prototype.observe = function(id, obj) {
      var n = this;
      _observableCallback[id] = function(changes){
          changes.forEach(function(change) {
            if(change.type === 'update' && change.name !== 'id') {
              //TODO:broadcast change to scene

              if(change.object.constructor.name === 'Transitionable'){
                n[change.object.param] = change.oldValue;
              } else {
                n.parent.update({
                              message:{
                                prop: change.name,
                                val: change.oldValue
                              },
                              node: n.id
                            });
                // console.log({
                //               message:{
                //                 prop: change.name,
                //                 val: change.oldValue
                //               },
                //               node: n.id
                //             });
              }

            }
          });
      };
      Object.observe(obj, _observableCallback[id]);

};

Node.prototype.unobserve = function(param) {
    Object.unobserve(this, _observableCallback[this.id]);
};


Node.prototype.eventManager = function(){

  var events = {};
  var hasEvent = events.hasOwnProperty;

  return {
    sub: function(ev, listener) {

      this.observe(ev, this);
      // Create the event's object if not yet created
      if(!hasEvent.call(events, ev)) events[ev] = [];

      // Add the listener to queue
      var index = events[ev].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          this.unobserve(ev);
          delete events[ev][index];
        }
      };
    },
    pub: function(ev, info) {
      // If the event doesn't exist, or there's no listeners in queue, just leave
      if(!hasEvent.call(events, ev)) return;

      // Cycle through events queue, fire!
      events[ev].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
};

module.exports = Node;
