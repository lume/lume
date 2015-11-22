(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.boxer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Component handles storing the state of a Component that is attached to a Node.
var Component = function(node){
    this.node = node ? node : null;
}

module.exports = Component;

},{}],2:[function(require,module,exports){
var Component = require('./Component');
var Matrix = require('./Matrix');

var DOMComponent = function(node, elem, container){

    this.node = node.id ? node.id : node;
    this._node = node;
    this.elem = elem ? document.createElement(elem) : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    this.elem.classList.add(this.node);
    this.elem.classList.add('node');
    container.appendChild(this.elem);

    Object.observe(this._node, function(changes){
        this.transform(this._node);
    }.bind(this));

    var prefix = function () {

      var styles = window.getComputedStyle(document.documentElement, ''),
        transform,
        origin,
        perspective,
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        if(dom ==='Moz'){
          transform = 'transform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        } else if(dom ==='WebKit'){
          transform = 'webkitTransform';
          origin = 'webkitTransformOrigin';
          perspective = 'perspective';
        } else if(dom ==='MS'){
          transform = 'msTransform';
          origin = 'msTransformOrigin';
          perspective = 'perspective';
        } else if (dom ==='O'){
          transform = 'OTransform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        } else {
          transform = 'transform';
          origin = 'transformOrigin';
          perspective = 'perspective';
        }
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1),
        transform: transform,
        origin: origin
      };

    };

    this.vendor = prefix();

    if(node.content) {
      this.setContent(node.content);
    }

    if(node.classes) {
      for(var i=0; i<node.classes.length; i++){
        this.addClass(node.classes[i]);
      }
    }

    this.transform(node);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;

DOMComponent.prototype.configure = function(n){

  n.origin = n.origin || [0.0,0.0,0.0];
  n.align = n.align || [0.0,0.0,0.0];
  n.size = n.size || [1.0,1.0,1.0];
  n.scale = n.scale || [1.0,1.0,1.0];
  n.rotate = n.rotate || [0,0,0];
  n.opacity = n.opacity || 1.0;

}

DOMComponent.prototype.isInt = function(n){

    return Number(n) === n && n % 1 === 0;

}

DOMComponent.prototype.isFloat = function(n){

    if(n === parseFloat(1.0)) return true;
    return n === Number(n) && n % 1 !== 0;

}

DOMComponent.prototype.setContent = function(content){

  this.elem.innerHTML = content;

}

DOMComponent.prototype.addClass = function(cl){

  this.elem.classList.add(cl);

}

DOMComponent.prototype.removeClass = function(cl){

  this.elem.classList.remove(cl);

}

DOMComponent.prototype.degreesToRadians = function(degrees) {

  return degrees * (Math.PI / 180);

};

DOMComponent.prototype.transform = function(node){

  var d = this;

  if(node.origin) {

    this.elem.style[this.vendor.origin] = (node.origin[0]*100)+'% '+(node.origin[1]*100)+'%';

  }


  if(node.size) {

    if(node.size[0] === 1) node.size[0] = parseFloat(1.0);
    if(node.size[1] === 1) node.size[1] = parseFloat(1.0);

    if(node.size[0] === null) {
        this.elem.style.width = node.size[1]*100+'vh';
    } else if(node.size[0] === 'auto') {
        this.elem.style.width = 'auto';
    } else {
        this.isFloat(node.size[0]) ? this.elem.style.width = node.size[0]*100+'%' : this.elem.style.width = node.size[0]+'px';
    }
    if(node.size[1] === null) {
        this.elem.style.height = node.size[0]*100+'vw';
    } else if(node.size[1] === 'auto') {
        this.elem.style.height = 'auto';
    } else {
        this.isFloat(node.size[1]) ? this.elem.style.height = node.size[1]*100+'%' : this.elem.style.height = node.size[1]+'px';
        // console.log(node.size[1]*100+'%');
        // this.elem.style.height = node.size[1]*100+'%';
    }

    //TODO: fix isFloat and isInt, its not working!

  }

  if(node.opacity) {

    this.elem.style.opacity = node.opacity;

  }

  if(node.position) {

    this.elem.style.position = node.position;

  }

  if(node.transform) {

    this.elem.style[this.vendor.transform] = node.transform;

  } else {

  var matrix = new Matrix();

  if(node.translate && node.align) {

    matrix = matrix.translate((node.align[0] * this.elem.parentNode.clientWidth)+node.translate[0], (node.align[1] * this.elem.parentNode.clientHeight)+node.translate[1], node.align[2]+ node.translate[2] === 0 ? 1 : node.translate[2] );

  } else if(node.align) {

    matrix = matrix.translate(node.align[0] * this.elem.parentNode.clientWidth, node.align[1] * this.elem.parentNode.clientHeight, node.align[2] );

  } else if(node.translate) {

    matrix = matrix.translate(node.translate[0], node.translate[1], node.translate[2] === 0 ? 1 : node.translate[2]);

  } else {

    matrix = matrix.translate(0, 0, 1);

  }

  if(node.scale) {

      matrix.scale(node.scale[0] || 1, node.scale[1] || 1, node.scale[2] || 1);

  }
  if(node.rotate) {

      if(node.rotate[0]) {
        matrix = matrix.rotateX(d.degreesToRadians(node.rotate[0]));
      }
      if(node.rotate[1]) {
        matrix = matrix.rotateY(d.degreesToRadians(node.rotate[1]));
      }
      if(node.rotate[2]) {
        matrix = matrix.rotateZ(d.degreesToRadians(node.rotate[2]));
      }

  }

  this.elem.style[this.vendor.transform] = matrix.toString();

  }

};

DOMComponent.prototype.setPerspective = function(p){

  this.elem.style['perspective'] = p;

};

DOMComponent.prototype.sync = function(events, cb){

  for( var i = 0; i < events.length; i++ ){
    this.elem.addEventListener(events[i],cb);
  }

  //TODO: Make a Sync Class and properly sync mousewheel and touch drag

};


DOMComponent.prototype.resize = function(){

  this.transform(this._node);

};

module.exports = DOMComponent;

},{"./Component":1,"./Matrix":3}],3:[function(require,module,exports){
/**
 * A really simple and basic 4x4 matrix implementation, compatible with CSS. Transform them, and
 * apply the toString() output to a node's transform style. Don't forget perspective :)
 *
 * By Peter Nederlof, https://github.com/peterned
 * Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
 */

	   // _  __  __  __   ___  _____  _   _  __  _ \\
	  // | \/ |||  \/  ||/   \|_   _|| |_| ||| \/ | \\
	 //   \  // | |\/| ||  _  | | | ||  _  | \\  /   \\
	//     \//  |_|| |_||_| |_| |_| ||_| |_|  \\/     \\

	"use strict";

	var IDENTITY = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	function multiply (
		a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p,
		A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P
	) {
		return [
			a * A + b * E + c * I + d * M,
			a * B + b * F + c * J + d * N,
			a * C + b * G + c * K + d * O,
			a * D + b * H + c * L + d * P,
			e * A + f * E + g * I + h * M,
			e * B + f * F + g * J + h * N,
			e * C + f * G + g * K + h * O,
			e * D + f * H + g * L + h * P,
			i * A + j * E + k * I + l * M,
			i * B + j * F + k * J + l * N,
			i * C + j * G + k * K + l * O,
			i * D + j * H + k * L + l * P,
			m * A + n * E + o * I + p * M,
			m * B + n * F + o * J + p * N,
			m * C + n * G + o * K + p * O,
			m * D + n * H + o * L + p * P
		];
	}

	var sin = Math.sin;
	var cos = Math.cos;

	/**
	 * Matrix
	 *
	 */

	var Matrix = function (entities) {
		this.entities = entities || IDENTITY;
	};

	Matrix.prototype = {
		multiply: function (entities) {
			return new Matrix(
				multiply.apply(window, this.entities.concat(entities))
			);
		},

		transform: function (matrix) {
			return this.multiply(matrix.entities);
		},

		scale: function (s) {
			return this.multiply([
				s, 0, 0, 0,
				0, s, 0, 0,
				0, 0, s, 0,
				0, 0, 0, 1
			]);
		},

		rotateX: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				1, 0,  0, 0,
				0, c, -s, 0,
				0, s,  c, 0,
				0, 0,  0, 1
			]);
		},

		rotateY: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				 c, 0, s, 0,
				 0, 1, 0, 0,
				-s, 0, c, 0,
				 0, 0, 0, 1
			]);
		},

		rotateZ: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				c, -s, 0, 0,
				s,  c, 0, 0,
				0,  0, 1, 0,
				0,  0, 0, 1
			]);
		},

		translate: function (x, y, z) {
			return this.multiply([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				x, y, z, 1
			]);
		},

		toString: function () {
			return 'matrix3d(' + this.entities.join(',') + ')';
		}
	};

module.exports = Matrix;

},{}],4:[function(require,module,exports){
module.exports = {
    Component: require('./Component'),
    DOMComponent: require('./DOMComponent'),
    Matrix: require('./Matrix')
};

},{"./Component":1,"./DOMComponent":2,"./Matrix":3}],5:[function(require,module,exports){

var Engine = function(){

    this.time = 0;
    this._worker = null;
    this.updateQueue = [];

}

Engine.prototype.init = function(worker){
    window.requestAnimationFrame(this.tick.bind(this));
    if(worker){
        this._worker = worker;
    }
    if(worker.constructor.name === 'Worker'){
        this._worker.postMessage({init:'done'});
    }
}

Engine.prototype.tick = function(time){

    var item;
    this.time = performance.now();

    if(this._worker.constructor.name === 'Worker'){
      this._worker.postMessage({frame:this.time});
    } else {
      this._worker.tick(time);
    }

    while (this.updateQueue.length) {
      item = this.updateQueue.shift();
      if (item && item.update) item.update(this.time);
      if (item && item.onUpdate) item.onUpdate(this.time);
    }

    window.requestAnimationFrame(this.tick.bind(this));

}


module.exports = new Engine();

},{}],6:[function(require,module,exports){
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
    this.position = 'absolute';
    this.translate = null;
    this.origin = [0.0,0.0,0.0];
    this.align = null;
    this.size = [0,0,0];
    this.scale = [1.0,1.0,1.0];
    this.rotate = [0,0,0];
    this.opacity = 1.0;
    this.transform = null;
};

Node.prototype.serialize = function(conf){
    this.id = conf.id ? conf.id : null;
    this.position = conf.position ? conf.position : 'absolute';
    this.translate = conf.translate ? conf.translate : null;
    this.origin = conf.origin ? conf.origin : [0.0,0.0,0.0];
    this.align = conf.align ? conf.align : null;
    this.size = conf.size ? conf.size : [0,0,0];
    this.scale = conf.scale ? conf.scale : [1.0,1.0,1.0];
    this.rotate = conf.rotate ? conf.rotate : [0,0,0];
    this.opacity = conf.opacity ? conf.opacity : 1.0;
    this.transform = conf.transform ? conf.transform : null;
    this.observe(this.id, this);
    conf.transition ? this.setTransitionable(conf.transition) : false;
};

Node.prototype.getProperties = function(){
    return {
        position: this.position,
        translate: this.translate,
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

Node.prototype.setTranslation = function(pos){
    this.translate = pos;
};

Node.prototype.getTranslation = function(){
    return this.translate;
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

Node.prototype.transition = function(conf) {
  this.setTransitionable(conf);
};

Node.prototype.setTransitionable = function(conf){
    var n  = this;

    n.transitionables[conf.key] = conf;
    n.transitionables[conf.key].transition = new Transitionable(conf.from);
    n.transitionables[conf.key].transition.set(conf.to);
    //n.transitionables[conf.key].transition.set(conf.to);
    if(conf.delay) {
      n.transit(conf);
    } else {
      n.transitionables[conf.key]
       .transition
       .from(conf.from)
       .to(conf.to, conf.curve, conf.duration);
    }

    this[conf.key] = conf.to;

    n.transitionables[conf.key].transition.id = this.id;
    n.transitionables[conf.key].transition.param = conf.key;
    this.observe(conf.key, n.transitionables[conf.key].transition.get(), conf);

    //TODO: figure out a better way to update Transitionable
    //TODO: unobserve object, clearInerval


};

Node.prototype.transit = function(conf){
    var n  = this;
    if(conf.delay) {

      n.transitionables[conf.key].transition.from(conf.from).delay(conf.delay).to(conf.to, conf.curve, conf.duration);
    }
};

Node.prototype.observe = function(id, obj, conf) {
      var n = this;

      _observableCallback[id] = function(changes){
          changes.forEach(function(change) {
            if(change.type === 'update' && change.name !== 'id') {

              if(change.object.constructor.name === 'Array'){

                n.parent.update({
                              message:{
                                prop: id,
                                val: change.object
                              },
                              node: n.id
                            });
              }
              else if(change.object.constructor.name === 'Transitionable'){
                n[change.object.param] = change.oldValue;
              } else {
                n.parent.update({
                              message:{
                                prop: change.name,
                                val: change.oldValue
                              },
                              node: n.id
                            });
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

Node.prototype.update = function(frame){
  for(var id in this.transitionables) {
    this.transitionables[id].transition.get();
  }
};

module.exports = Node;

},{"../transitions/Curves":16,"../transitions/Transitionable":17}],7:[function(require,module,exports){
var cxt = self;

var Scene = function(graph){

    this.graph = graph || {};
    this.length = 0;

}

Scene.prototype.init = function(worker) {
    if(worker){
        this.worker = worker;
    }
    console.log(this.worker);
}

Scene.prototype.addChild = function(node){
    node.id = node.id || 'node-'+this.length;
    this.length++;
    this.graph[node.id] = node;
}


Scene.prototype.fetchNode = function(id) {
    return this.graph[id];
}

Scene.prototype.find = function(query) {
    var queryArray = [];
    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    queryArray.push(this.graph[prop]);
                }
            }
        }
    }
    return queryArray;
}

Scene.prototype.findOne = function(query) {

    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    return this.graph[prop];
                }
            }
        }
    }

}

Scene.prototype.tick = function(frame){
  for(var node in this.graph) {
    this.graph[node].update(frame);
  }
}

Scene.prototype.update = function(change){
  // if(cxt.constructor.name === 'DedicatedWorkerGlobalScope') {
  //   cxt.postMessage(JSON.parse(JSON.stringify(change)));
  // } else {
    this.onmessage(JSON.parse(JSON.stringify(change)));
  // }
}

module.exports = new Scene();

},{}],8:[function(require,module,exports){
/*
  Tested against Chromium build with Object.observe and acts EXACTLY the same,
  though Chromium build is MUCH faster

  Trying to stay as close to the spec as possible,
  this is a work in progress, feel free to comment/update

  Specification:
    http://wiki.ecmascript.org/doku.php?id=harmony:observe

  Built using parts of:
    https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js

  Limits so far;
    Built using polling... Will update again with polling/getter&setters to make things better at some point

TODO:
  Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
*/
if(!Object.observe){
  (function(extend, global){
    "use strict";
    var isCallable = (function(toString){
        var s = toString.call(toString),
            u = typeof u;
        return typeof global.alert === "object" ?
          function isCallable(f){
            return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
          }:
          function isCallable(f){
            return s === toString.call(f);
          }
        ;
    })(extend.prototype.toString);
    // isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM node
    var isNode = function isNode(o){
      return (
        typeof Node === "object" ? o instanceof Node :
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
      );
    }
    //Returns true if it is a DOM element
    var isElement = function isElement(o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
    }
    var _isImmediateSupported = (function(){
      return !!global.setImmediate;
    })();
    var _doCheckCallback = (function(){
      if(_isImmediateSupported){
        return function _doCheckCallback(f){
          return setImmediate(f);
        };
      }else{
        return function _doCheckCallback(f){
          return setTimeout(f, 10);
        };
      }
    })();
    var _clearCheckCallback = (function(){
      if(_isImmediateSupported){
        return function _clearCheckCallback(id){
          clearImmediate(id);
        };
      }else{
        return function _clearCheckCallback(id){
          clearTimeout(id);
        };
      }
    })();
    var isNumeric=function isNumeric(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var sameValue = function sameValue(x, y){
      if(x===y){
        return x !== 0 || 1 / x === 1 / y;
      }
      return x !== x && y !== y;
    };
    var isAccessorDescriptor = function isAccessorDescriptor(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('get' in desc || 'set' in desc);
    };
    var isDataDescriptor = function isDataDescriptor(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('value' in desc || 'writable' in desc);
    };

    var validateArguments = function validateArguments(O, callback, accept){
      if(typeof(O)!=='object'){
        // Throw Error
        throw new TypeError("Object.observeObject called on non-object");
      }
      if(isCallable(callback)===false){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting function");
      }
      if(Object.isFrozen(callback)===true){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting unfrozen function");
      }
      if (accept !== undefined) {
        if (!Array.isArray(accept)) {
          throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array");
        }
      }
    };

    var Observer = (function Observer(){
      var wraped = [];
      var Observer = function Observer(O, callback, accept){
        validateArguments(O, callback, accept);
        if (!accept) {
          accept = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];
        }
        Object.getNotifier(O).addListener(callback, accept);
        if(wraped.indexOf(O)===-1){
          wraped.push(O);
        }else{
          Object.getNotifier(O)._checkPropertyListing();
        }
      };

      Observer.prototype.deliverChangeRecords = function Observer_deliverChangeRecords(O){
        Object.getNotifier(O).deliverChangeRecords();
      };

      wraped.lastScanned = 0;
      var f = (function f(wrapped){
              return function _f(){
                var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
                for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
                  if(_indexes.indexOf(wrapped[i]) > -1){
                    Object.getNotifier(wrapped[i])._checkPropertyListing();
                    takingTooLong=((new Date())-startTime)>100; // make sure we don't take more than 100 milliseconds to scan all objects
                  }else{
                    wrapped.splice(i, 1);
                    i--;
                    l--;
                  }
                }
                wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
                _doCheckCallback(_f);
              };
            })(wraped);
      _doCheckCallback(f);
      return Observer;
    })();

    var Notifier = function Notifier(watching){
    var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
      var self = this;
      Object.defineProperty(self, '_watching', {
                  enumerable: true,
                  get: (function(watched){
                    return function(){
                      return watched;
                    };
                  })(watching)
                });
      var wrapProperty = function wrapProperty(object, prop){
        var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor(object, prop);
        if((prop==='getNotifier')||isAccessorDescriptor(descriptor)||(!descriptor.enumerable)){
          return false;
        }
        if((object instanceof Array)&&isNumeric(prop)){
          var idx = properties.length;
          properties[idx] = prop;
          values[idx] = object[prop];
          return true;
        }
        (function(idx, prop){
          properties[idx] = prop;
          values[idx] = object[prop];
          function getter(){
            return values[getter.info.idx];
          }
          function setter(value){
            if(!sameValue(values[setter.info.idx], value)){
              Object.getNotifier(object).queueUpdate(object, prop, 'update', values[setter.info.idx]);
              values[setter.info.idx] = value;
            }
          }
          getter.info = setter.info = {
            idx: idx
          };
          Object.defineProperty(object, prop, {
            get: getter,
            set: setter
          });
        })(properties.length, prop);
        return true;
      };
      self._checkPropertyListing = function _checkPropertyListing(dontQueueUpdates){
        var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
        var newKeys = [], oldKeys = properties.slice(0), updates = [];
        var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

        if(object instanceof Array){
          aLength = self._oldLength;//object.length;
          //aLength = object.length;
        }

        for(i=0; i<l; i++){
          prop = keys[i];
          value = object[prop];
          propType = typeof(value);
          if((idx = properties.indexOf(prop))===-1){
            if(wrapProperty(object, prop)&&queueUpdates){
              self.queueUpdate(object, prop, 'add', null, object[prop]);
            }
          }else{
            if(!(object instanceof Array)||(isNumeric(prop))){
              if(values[idx] !== value){
                if(queueUpdates){
                  self.queueUpdate(object, prop, 'update', values[idx], value);
                }
                values[idx] = value;
              }
            }
            oldKeys.splice(oldKeys.indexOf(prop), 1);
          }
        }

        if(object instanceof Array && object.length !== aLength){
          if(queueUpdates){
            self.queueUpdate(object, 'length', 'update', aLength, object);
          }
          self._oldLength = object.length;
        }

        if(queueUpdates){
          l = oldKeys.length;
          for(i=0; i<l; i++){
            idx = properties.indexOf(oldKeys[i]);
            self.queueUpdate(object, oldKeys[i], 'delete', values[idx]);
            properties.splice(idx,1);
            values.splice(idx,1);
            for(var i=idx;i<properties.length;i++){
              if(!(properties[i] in object))
                continue;
              var getter = Object.getOwnPropertyDescriptor(object,properties[i]).get;
              if(!getter)
                continue;
              var info = getter.info;
              info.idx = i;
            }
          };
        }
      };
      self.addListener = function Notifier_addListener(callback, accept){
        var idx = _listeners.indexOf(callback);
        if(idx===-1){
          _listeners.push(callback);
          _acceptLists.push(accept);
        }
        else {
          _acceptLists[idx] = accept;
        }
      };
      self.removeListener = function Notifier_removeListener(callback){
        var idx = _listeners.indexOf(callback);
        if(idx>-1){
          _listeners.splice(idx, 1);
          _acceptLists.splice(idx, 1);
        }
      };
      self.listeners = function Notifier_listeners(){
        return _listeners;
      };
      self.queueUpdate = function Notifier_queueUpdate(what, prop, type, was){
        this.queueUpdates([{
          type: type,
          object: what,
          name: prop,
          oldValue: was
        }]);
      };
      self.queueUpdates = function Notifier_queueUpdates(updates){
        var self = this, i = 0, l = updates.length||0, update;
        for(i=0; i<l; i++){
          update = updates[i];
          _updates.push(update);
        }
        if(_updater){
          _clearCheckCallback(_updater);
        }
        _updater = _doCheckCallback(function(){
          _updater = false;
          self.deliverChangeRecords();
        });
      };
      self.deliverChangeRecords = function Notifier_deliverChangeRecords(){
        var i = 0, l = _listeners.length,
            //keepRunning = true, removed as it seems the actual implementation doesn't do this
            // In response to BUG #5
            retval;
        for(i=0; i<l; i++){
          if(_listeners[i]){
            var currentUpdates;
            if (_acceptLists[i]) {
              currentUpdates = [];
              for (var j = 0, updatesLength = _updates.length; j < updatesLength; j++) {
                if (_acceptLists[i].indexOf(_updates[j].type) !== -1) {
                  currentUpdates.push(_updates[j]);
                }
              }
            }
            else {
              currentUpdates = _updates;
            }
            if (currentUpdates.length) {
              if(_listeners[i]===console.log){
                console.log(currentUpdates);
              }else{
                _listeners[i](currentUpdates);
              }
            }
          }
        }
        _updates=[];
      };
      self.notify = function Notifier_notify(changeRecord) {
        if (typeof changeRecord !== "object" || typeof changeRecord.type !== "string") {
          throw new TypeError("Invalid changeRecord with non-string 'type' property");
        }
        changeRecord.object = watching;
        self.queueUpdates([changeRecord]);
      };
      self._checkPropertyListing(true);
    };

    var _notifiers=[], _indexes=[];
    extend.getNotifier = function Object_getNotifier(O){
    var idx = _indexes.indexOf(O), notifier = idx>-1?_notifiers[idx]:false;
      if(!notifier){
        idx = _indexes.length;
        _indexes[idx] = O;
        notifier = _notifiers[idx] = new Notifier(O);
      }
      return notifier;
    };
    extend.observe = function Object_observe(O, callback, accept){
      // For Bug 4, can't observe DOM elements tested against canry implementation and matches
      if(!isElement(O)){
        return new Observer(O, callback, accept);
      }
    };
    extend.unobserve = function Object_unobserve(O, callback){
      validateArguments(O, callback);
      var idx = _indexes.indexOf(O),
          notifier = idx>-1?_notifiers[idx]:false;
      if (!notifier){
        return;
      }
      notifier.removeListener(callback);
      if (notifier.listeners().length === 0){
        _indexes.splice(idx, 1);
        _notifiers.splice(idx, 1);
      }
    };
  })(Object, this);
}

module.exports = {
    Engine: require('./Engine'),
    Scene: require('./Scene'),
    Node: require('./Node')
};

},{"./Engine":5,"./Node":6,"./Scene":7}],9:[function(require,module,exports){
module.exports = {
    core: require('./core'),
    components: require('./components'),
    math: require('./math'),
    transitions: require('./transitions')
};

},{"./components":4,"./core":8,"./math":15,"./transitions":18}],10:[function(require,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Famous Industries Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A 3x3 numerical matrix, represented as an array.
 *
 * @class Mat33
 *
 * @param {Array} values a 3x3 matrix flattened
 */
function Mat33(values) {
    this.values = values || [1,0,0,0,1,0,0,0,1];
}

/**
 * Return the values in the Mat33 as an array.
 *
 * @method
 *
 * @return {Array} matrix values as array of rows.
 */
Mat33.prototype.get = function get() {
    return this.values;
};

/**
 * Set the values of the current Mat33.
 *
 * @method
 *
 * @param {Array} values Array of nine numbers to set in the Mat33.
 *
 * @return {Mat33} this
 */
Mat33.prototype.set = function set(values) {
    this.values = values;
    return this;
};

/**
 * Copy the values of the input Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix The Mat33 to copy.
 * 
 * @return {Mat33} this
 */
Mat33.prototype.copy = function copy(matrix) {
    var A = this.values;
    var B = matrix.values;

    A[0] = B[0];
    A[1] = B[1];
    A[2] = B[2];
    A[3] = B[3];
    A[4] = B[4];
    A[5] = B[5];
    A[6] = B[6];
    A[7] = B[7];
    A[8] = B[8];

    return this;
};

/**
 * Take this Mat33 as A, input vector V as a column vector, and return Mat33 product (A)(V).
 *
 * @method
 *
 * @param {Vec3} v Vector to rotate.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The input vector after multiplication.
 */
Mat33.prototype.vectorMultiply = function vectorMultiply(v, output) {
    var M = this.values;
    var v0 = v.x;
    var v1 = v.y;
    var v2 = v.z;

    output.x = M[0]*v0 + M[1]*v1 + M[2]*v2;
    output.y = M[3]*v0 + M[4]*v1 + M[5]*v2;
    output.z = M[6]*v0 + M[7]*v1 + M[8]*v2;

    return output;
};

/**
 * Multiply the provided Mat33 with the current Mat33.  Result is (this) * (matrix).
 *
 * @method
 *
 * @param {Mat33} matrix Input Mat33 to multiply on the right.
 *
 * @return {Mat33} this
 */
Mat33.prototype.multiply = function multiply(matrix) {
    var A = this.values;
    var B = matrix.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    A[0] = A0*B0 + A1*B3 + A2*B6;
    A[1] = A0*B1 + A1*B4 + A2*B7;
    A[2] = A0*B2 + A1*B5 + A2*B8;
    A[3] = A3*B0 + A4*B3 + A5*B6;
    A[4] = A3*B1 + A4*B4 + A5*B7;
    A[5] = A3*B2 + A4*B5 + A5*B8;
    A[6] = A6*B0 + A7*B3 + A8*B6;
    A[7] = A6*B1 + A7*B4 + A8*B7;
    A[8] = A6*B2 + A7*B5 + A8*B8;

    return this;
};

/**
 * Transposes the Mat33.
 *
 * @method
 *
 * @return {Mat33} this
 */
Mat33.prototype.transpose = function transpose() {
    var M = this.values;

    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];

    M[1] = M3;
    M[2] = M6;
    M[3] = M1;
    M[5] = M7;
    M[6] = M2;
    M[7] = M5;

    return this;
};

/**
 * The determinant of the Mat33.
 *
 * @method
 *
 * @return {Number} The determinant.
 */
Mat33.prototype.getDeterminant = function getDeterminant() {
    var M = this.values;

    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M[0]*(M4*M8 - M5*M7) -
              M[1]*(M3*M8 - M5*M6) +
              M[2]*(M3*M7 - M4*M6);

    return det;
};

/**
 * The inverse of the Mat33.
 *
 * @method
 *
 * @return {Mat33} this
 */
Mat33.prototype.inverse = function inverse() {
    var M = this.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7) -
              M1*(M3*M8 - M5*M6) +
              M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-40) return null;

    det = 1 / det;

    M[0] = (M4*M8 - M5*M7) * det;
    M[3] = (-M3*M8 + M5*M6) * det;
    M[6] = (M3*M7 - M4*M6) * det;
    M[1] = (-M1*M8 + M2*M7) * det;
    M[4] = (M0*M8 - M2*M6) * det;
    M[7] = (-M0*M7 + M1*M6) * det;
    M[2] = (M1*M5 - M2*M4) * det;
    M[5] = (-M0*M5 + M2*M3) * det;
    M[8] = (M0*M4 - M1*M3) * det;

    return this;
};

/**
 * Clones the input Mat33.
 *
 * @method
 *
 * @param {Mat33} m Mat33 to clone.
 *
 * @return {Mat33} New copy of the original Mat33.
 */
Mat33.clone = function clone(m) {
    return new Mat33(m.values.slice());
};

/**
 * The inverse of the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to invert.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the invert.
 */
Mat33.inverse = function inverse(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7) -
              M1*(M3*M8 - M5*M6) +
              M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-40) return null;

    det = 1 / det;

    result[0] = (M4*M8 - M5*M7) * det;
    result[3] = (-M3*M8 + M5*M6) * det;
    result[6] = (M3*M7 - M4*M6) * det;
    result[1] = (-M1*M8 + M2*M7) * det;
    result[4] = (M0*M8 - M2*M6) * det;
    result[7] = (-M0*M7 + M1*M6) * det;
    result[2] = (M1*M5 - M2*M4) * det;
    result[5] = (-M0*M5 + M2*M3) * det;
    result[8] = (M0*M4 - M1*M3) * det;

    return output;
};

/**
 * Transposes the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to transpose.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the transpose.
 */
Mat33.transpose = function transpose(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    result[0] = M0;
    result[1] = M3;
    result[2] = M6;
    result[3] = M1;
    result[4] = M4;
    result[5] = M7;
    result[6] = M2;
    result[7] = M5;
    result[8] = M8;

    return output;
};

/**
 * Add the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the addition.
 */
Mat33.add = function add(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 + B0;
    result[1] = A1 + B1;
    result[2] = A2 + B2;
    result[3] = A3 + B3;
    result[4] = A4 + B4;
    result[5] = A5 + B5;
    result[6] = A6 + B6;
    result[7] = A7 + B7;
    result[8] = A8 + B8;

    return output;
};

/**
 * Subtract the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the subtraction.
 */
Mat33.subtract = function subtract(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 - B0;
    result[1] = A1 - B1;
    result[2] = A2 - B2;
    result[3] = A3 - B3;
    result[4] = A4 - B4;
    result[5] = A5 - B5;
    result[6] = A6 - B6;
    result[7] = A7 - B7;
    result[8] = A8 - B8;

    return output;
};
/**
 * Multiply the provided Mat33 M2 with this Mat33.  Result is (this) * (M2).
 *
 * @method
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} the result of the multiplication.
 */
Mat33.multiply = function multiply(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0*B0 + A1*B3 + A2*B6;
    result[1] = A0*B1 + A1*B4 + A2*B7;
    result[2] = A0*B2 + A1*B5 + A2*B8;
    result[3] = A3*B0 + A4*B3 + A5*B6;
    result[4] = A3*B1 + A4*B4 + A5*B7;
    result[5] = A3*B2 + A4*B5 + A5*B8;
    result[6] = A6*B0 + A7*B3 + A8*B6;
    result[7] = A6*B1 + A7*B4 + A8*B7;
    result[8] = A6*B2 + A7*B5 + A8*B8;

    return output;
};

module.exports = Mat33;

},{}],11:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var sin = Math.sin;
var cos = Math.cos;
var asin = Math.asin;
var acos = Math.acos;
var atan2 = Math.atan2;
var sqrt = Math.sqrt;

/**
 * A vector-like object used to represent rotations. If theta is the angle of
 * rotation, and (x', y', z') is a normalized vector representing the axis of
 * rotation, then w = cos(theta/2), x = sin(theta/2)*x', y = sin(theta/2)*y',
 * and z = sin(theta/2)*z'.
 *
 * @class Quaternion
 *
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
function Quaternion(w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

/**
 * Multiply the current Quaternion by input Quaternion q.
 * Left-handed multiplication.
 *
 * @method
 *
 * @param {Quaternion} q The Quaternion to multiply by on the right.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.multiply = function multiply(q) {
    var x1 = this.x;
    var y1 = this.y;
    var z1 = this.z;
    var w1 = this.w;
    var x2 = q.x;
    var y2 = q.y;
    var z2 = q.z;
    var w2 = q.w || 0;

    this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    this.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    this.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    this.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return this;
};

/**
 * Multiply the current Quaternion by input Quaternion q on the left, i.e. q * this.
 * Left-handed multiplication.
 *
 * @method
 *
 * @param {Quaternion} q The Quaternion to multiply by on the left.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.leftMultiply = function leftMultiply(q) {
    var x1 = q.x;
    var y1 = q.y;
    var z1 = q.z;
    var w1 = q.w || 0;
    var x2 = this.x;
    var y2 = this.y;
    var z2 = this.z;
    var w2 = this.w;

    this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
    this.x = x1*w2 + x2*w1 + y2*z1 - y1*z2;
    this.y = y1*w2 + y2*w1 + x1*z2 - x2*z1;
    this.z = z1*w2 + z2*w1 + x2*y1 - x1*y2;
    return this;
};

/**
 * Apply the current Quaternion to input Vec3 v, according to
 * v' = ~q * v * q.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The rotated version of the Vec3.
 */
Quaternion.prototype.rotateVector = function rotateVector(v, output) {
    var cw = this.w;
    var cx = -this.x;
    var cy = -this.y;
    var cz = -this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Invert the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.invert = function invert() {
    this.w = -this.w;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * Conjugate the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.conjugate = function conjugate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * Compute the length (norm) of the current Quaternion.
 *
 * @method
 *
 * @return {Number} length of the Quaternion
 */
Quaternion.prototype.length = function length() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return sqrt(w * w + x * x + y * y + z * z);
};

/**
 * Alter the current Quaternion to be of unit length;
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.normalize = function normalize() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return this;
    length = 1 / length;
    this.w *= length;
    this.x *= length;
    this.y *= length;
    this.z *= length;
    return this;
};

/**
 * Set the w, x, y, z components of the current Quaternion.
 *
 * @method
 *
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.set = function set(w, x ,y, z) {
    if (w != null) this.w = w;
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;
    return this;
};

/**
 * Copy input Quaternion q onto the current Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.copy = function copy(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
};

/**
 * Reset the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.clear = function clear() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * The dot product. Can be used to determine the cosine of the angle between
 * the two rotations, assuming both Quaternions are of unit length.
 *
 * @method
 *
 * @param {Quaternion} q The other Quaternion.
 *
 * @return {Number} the resulting dot product
 */
Quaternion.prototype.dot = function dot(q) {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
};

/**
 * Spherical linear interpolation.
 *
 * @method
 *
 * @param {Quaternion} q The final orientation.
 * @param {Number} t The tween parameter.
 * @param {Vec3} output Vec3 in which to put the result.
 *
 * @return {Quaternion} The quaternion the slerp results were saved to
 */
Quaternion.prototype.slerp = function slerp(q, t, output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var qw = q.w;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;

    var omega;
    var cosomega;
    var sinomega;
    var scaleFrom;
    var scaleTo;

    cosomega = w * qw + x * qx + y * qy + z * qz;
    if ((1.0 - cosomega) > 1e-5) {
        omega = acos(cosomega);
        sinomega = sin(omega);
        scaleFrom = sin((1.0 - t) * omega) / sinomega;
        scaleTo = sin(t * omega) / sinomega;
    }
    else {
        scaleFrom = 1.0 - t;
        scaleTo = t;
    }

    output.w = w * scaleFrom + qw * scaleTo;
    output.x = x * scaleFrom + qx * scaleTo;
    output.y = y * scaleFrom + qy * scaleTo;
    output.z = z * scaleFrom + qz * scaleTo;

    return output;
};

/**
 * Get the Mat33 matrix corresponding to the current Quaternion.
 *
 * @method
 *
 * @param {Object} output Object to process the Transform matrix
 *
 * @return {Array} the Quaternion as a Transform matrix
 */
Quaternion.prototype.toMatrix = function toMatrix(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x*x;
    var yy = y*y;
    var zz = z*z;
    var xy = x*y;
    var xz = x*z;
    var yz = y*z;

    return output.set([
        1 - 2 * (yy + zz), 2 * (xy - w*z), 2 * (xz + w*y),
        2 * (xy + w*z), 1 - 2 * (xx + zz), 2 * (yz - w*x),
        2 * (xz - w*y), 2 * (yz + w*x), 1 - 2 * (xx + yy)
    ]);
};

/**
 * The rotation angles about the x, y, and z axes corresponding to the
 * current Quaternion, when applied in the ZYX order.
 *
 * @method
 *
 * @param {Vec3} output Vec3 in which to put the result.
 *
 * @return {Vec3} the Vec3 the result was stored in
 */
Quaternion.prototype.toEuler = function toEuler(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x * x;
    var yy = y * y;
    var zz = z * z;

    var ty = 2 * (x * z + y * w);
    ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

    output.x = atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
    output.y = asin(ty);
    output.z = atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));

    return output;
};

/**
 * The Quaternion corresponding to the Euler angles x, y, and z,
 * applied in the ZYX order.
 *
 * @method
 *
 * @param {Number} x The angle of rotation about the x axis.
 * @param {Number} y The angle of rotation about the y axis.
 * @param {Number} z The angle of rotation about the z axis.
 * @param {Quaternion} output Quaternion in which to put the result.
 *
 * @return {Quaternion} The equivalent Quaternion.
 */
Quaternion.prototype.fromEuler = function fromEuler(x, y, z) {
    var hx = x * 0.5;
    var hy = y * 0.5;
    var hz = z * 0.5;

    var sx = sin(hx);
    var sy = sin(hy);
    var sz = sin(hz);
    var cx = cos(hx);
    var cy = cos(hy);
    var cz = cos(hz);

    this.w = cx * cy * cz - sx * sy * sz;
    this.x = sx * cy * cz + cx * sy * sz;
    this.y = cx * sy * cz - sx * cy * sz;
    this.z = cx * cy * sz + sx * sy * cz;

    return this;
};

/**
 * Alter the current Quaternion to reflect a rotation of input angle about
 * input axis x, y, and z.
 *
 * @method
 *
 * @param {Number} angle The angle of rotation.
 * @param {Vec3} x The axis of rotation.
 * @param {Vec3} y The axis of rotation.
 * @param {Vec3} z The axis of rotation.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.fromAngleAxis = function fromAngleAxis(angle, x, y, z) {
    var len = sqrt(x * x + y * y + z * z);
    if (len === 0) {
        this.w = 1;
        this.x = this.y = this.z = 0;
    }
    else {
        len = 1 / len;
        var halfTheta = angle * 0.5;
        var s = sin(halfTheta);
        this.w = cos(halfTheta);
        this.x = s * x * len;
        this.y = s * y * len;
        this.z = s * z * len;
    }
    return this;
};

/**
 * Multiply the input Quaternions.
 * Left-handed coordinate system multiplication.
 *
 * @method
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The product of multiplication.
 */
Quaternion.multiply = function multiply(q1, q2, output) {
    var w1 = q1.w || 0;
    var x1 = q1.x;
    var y1 = q1.y;
    var z1 = q1.z;

    var w2 = q2.w || 0;
    var x2 = q2.x;
    var y2 = q2.y;
    var z2 = q2.z;

    output.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    output.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    output.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    output.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return output;
};

/**
 * Normalize the input quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The normalized quaternion.
 */
Quaternion.normalize = function normalize(q, output) {
    var w = q.w;
    var x = q.x;
    var y = q.y;
    var z = q.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return this;
    length = 1 / length;
    output.w *= length;
    output.x *= length;
    output.y *= length;
    output.z *= length;
    return output;
};

/**
 * The conjugate of the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The conjugate Quaternion.
 */
Quaternion.conjugate = function conjugate(q, output) {
    output.w = q.w;
    output.x = -q.x;
    output.y = -q.y;
    output.z = -q.z;
    return output;
};

/**
 * Clone the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q the reference Quaternion.
 *
 * @return {Quaternion} The cloned Quaternion.
 */
Quaternion.clone = function clone(q) {
    return new Quaternion(q.w, q.x, q.y, q.z);
};

/**
 * The dot product of the two input Quaternions.
 *
 * @method
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 *
 * @return {Number} The dot product of the two Quaternions.
 */
Quaternion.dot = function dot(q1, q2) {
    return q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
};

module.exports = Quaternion;

},{}],12:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var Vec3 = require('./Vec3');


var Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ?  new Vec3(origin[0],origin[1],origin[2]) : new Vec3();
	this.direction = ( direction !== undefined ) ? new Vec3(direction[0],direction[1],direction[2]) : new Vec3();

};

Ray.prototype.set = function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

};

Ray.prototype.copy = function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

};

Ray.prototype.at =  function ( t ) {

    var result = new Vec3();

    return result.copy( this.direction ).scale( t ).add( this.origin );

};


Ray.prototype.intersectSphere = function (center, radius) {

	// from http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/

	var vec = new Vec3();
    var c = new Vec3(center[0],center[1],center[2]);

	vec.subVectors( c, this.origin );

	var tca = vec.dot( this.direction );

	var d2 = vec.dot( vec ) - tca * tca;

	var radius2 = radius * radius;

	if ( d2 > radius2 ) return null;

	var thc = Math.sqrt( radius2 - d2 );

	// t0 = first intersect point - entrance on front of sphere
	var t0 = tca - thc;

	// t1 = second intersect point - exit point on back of sphere
	var t1 = tca + thc;

	// test to see if both t0 and t1 are behind the ray - if so, return null
	if ( t0 < 0 && t1 < 0 ) return null;

	// test to see if t0 is behind the ray:
	// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
	// in order to always return an intersect point that is in front of the ray.
	if ( t0 < 0 ) return this.at( t1 );

	// else t0 is in front of the ray, so return the first collision point scaled by t0
	return this.at( t0 );

};

Ray.prototype.intersectBox = function(center, size) {

    var tmin,
        tmax,
        tymin,
        tymax,
        tzmin,
        tzmax,
        box,
        out,
        invdirx = 1 / this.direction.x,
        invdiry = 1 / this.direction.y,
        invdirz = 1 / this.direction.z;

    box = {
        min: {
            x: center[0]-(size[0]/2),
            y: center[1]-(size[1]/2),
            z: center[2]-(size[2]/2)
        },
        max: {
            x: center[0]+(size[0]/2),
            y: center[1]+(size[1]/2),
            z: center[2]+(size[2]/2)
        }
    };

    if ( invdirx >= 0 ) {

        tmin = ( box.min.x - this.origin.x ) * invdirx;
        tmax = ( box.max.x - this.origin.x ) * invdirx;

    } else {

        tmin = ( box.max.x - this.origin.x ) * invdirx;
        tmax = ( box.min.x - this.origin.x ) * invdirx;
    }

    if ( invdiry >= 0 ) {

        tymin = ( box.min.y - this.origin.y ) * invdiry;
        tymax = ( box.max.y - this.origin.y ) * invdiry;

    } else {

        tymin = ( box.max.y - this.origin.y ) * invdiry;
        tymax = ( box.min.y - this.origin.y ) * invdiry;
    }

    if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

    if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

    if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

    if ( invdirz >= 0 ) {

        tzmin = ( box.min.z - this.origin.z ) * invdirz;
        tzmax = ( box.max.z - this.origin.z ) * invdirz;

    } else {

        tzmin = ( box.max.z - this.origin.z ) * invdirz;
        tzmax = ( box.min.z - this.origin.z ) * invdirz;
    }

    if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

    if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

    if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;


    if ( tmax < 0 ) return null;

    out = this.direction.scale(tmin >= 0 ? tmin : tmax);
    return out.add(out, this.origin, out);

};


Ray.prototype.equals = function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

};

Ray.prototype.clone = function () {

		return new Ray().copy( this );

};


module.exports = Ray;

},{"./Vec3":14}],13:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A two-dimensional vector.
 *
 * @class Vec2
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 */
var Vec2 = function(x, y) {
    if (x instanceof Array || x instanceof Float32Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
    }
    else {
        this.x = x || 0;
        this.y = y || 0;
    }
};

/**
 * Set the components of the current Vec2.
 *
 * @method
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 *
 * @return {Vec2} this
 */
Vec2.prototype.set = function set(x, y) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    return this;
};

/**
 * Add the input v to the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to add.
 *
 * @return {Vec2} this
 */
Vec2.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

/**
 * Subtract the input v from the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to subtract.
 *
 * @return {Vec2} this
 */
Vec2.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

/**
 * Scale the current Vec2 by a scalar or Vec2.
 *
 * @method
 *
 * @param {Number|Vec2} s The Number or vec2 by which to scale.
 *
 * @return {Vec2} this
 */
Vec2.prototype.scale = function scale(s) {
    if (s instanceof Vec2) {
        this.x *= s.x;
        this.y *= s.y;
    }
    else {
        this.x *= s;
        this.y *= s;
    }
    return this;
};

/**
 * Rotate the Vec2 counter-clockwise by theta about the z-axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec2} this
 */
Vec2.prototype.rotate = function(theta) {
    var x = this.x;
    var y = this.y;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */
Vec2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * The cross product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */
Vec2.prototype.cross = function(v) {
    return this.x * v.y - this.y * v.x;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */
Vec2.prototype.invert = function invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
};

/**
 * Apply a function component-wise to the current Vec2.
 *
 * @method
 *
 * @param {Function} fn Function to apply.
 *
 * @return {Vec2} this
 */
Vec2.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    return this;
};

/**
 * Get the magnitude of the current Vec2.
 *
 * @method
 *
 * @return {Number} the length of the vector
 */
Vec2.prototype.length = function length() {
    var x = this.x;
    var y = this.y;

    return Math.sqrt(x * x + y * y);
};

/**
 * Copy the input onto the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v Vec2 to copy
 *
 * @return {Vec2} this
 */
Vec2.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
};

/**
 * Reset the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */
Vec2.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec2 is exactly 0.
 *
 * @method
 *
 * @return {Boolean} whether or not the length is 0
 */
Vec2.prototype.isZero = function isZero() {
    if (this.x !== 0 || this.y !== 0) return false;
    else return true;
};

/**
 * The array form of the current Vec2.
 *
 * @method
 *
 * @return {Array} the Vec to as an array
 */
Vec2.prototype.toArray = function toArray() {
    return [this.x, this.y];
};

/**
 * Normalize the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The normalized Vec2.
 */
Vec2.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;

    var length = Math.sqrt(x * x + y * y) || 1;
    length = 1 / length;
    output.x = v.x * length;
    output.y = v.y * length;

    return output;
};

/**
 * Clone the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to clone.
 *
 * @return {Vec2} The cloned Vec2.
 */
Vec2.clone = function clone(v) {
    return new Vec2(v.x, v.y);
};

/**
 * Add the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the addition.
 */
Vec2.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;

    return output;
};

/**
 * Subtract the second Vec2 from the first.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the subtraction.
 */
Vec2.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    return output;
};

/**
 * Scale the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Number} s Number to scale by.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the scaling.
 */
Vec2.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    return output;
};

/**
 * The dot product of the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 *
 * @return {Number} The dot product.
 */
Vec2.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * The cross product of the input Vec2's.
 *
 * @method
 *
 * @param {Number} v1 The left Vec2.
 * @param {Number} v2 The right Vec2.
 *
 * @return {Number} The z-component of the cross product.
 */
Vec2.cross = function(v1,v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

module.exports = Vec2;

},{}],14:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A three-dimensional vector.
 *
 * @class Vec3
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
var Vec3 = function(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

/**
 * Set the components of the current Vec3.
 *
 * @method
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 *
 * @return {Vec3} this
 */
Vec3.prototype.set = function set(x, y, z) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;

    return this;
};

/**
 * Add the input v to the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to add.
 *
 * @return {Vec3} this
 */
Vec3.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
};

/**
 * Subtract the input v from the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to subtract.
 *
 * @return {Vec3} this
 */
Vec3.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
};

/**
 * Subtract the input a from b and create new vector.
 *
 * @method
 *
 * @param {Vec3} a The Vec3 to subtract.
 * @param {Vec3} b The Vec3 to subtract.
 *
 * @return {Vec3} this
 */
Vec3.prototype.subVectors = function ( a, b ) {

	this.x = a.x - b.x;
	this.y = a.y - b.y;
	this.z = a.z - b.z;

	return this;

};

/**
 * Rotate the current Vec3 by theta clockwise about the x axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateX = function rotateX(theta) {
    var y = this.y;
    var z = this.z;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.y = y * cosTheta - z * sinTheta;
    this.z = y * sinTheta + z * cosTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the y axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateY = function rotateY(theta) {
    var x = this.x;
    var z = this.z;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = z * sinTheta + x * cosTheta;
    this.z = z * cosTheta - x * sinTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the z axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateZ = function rotateZ(theta) {
    var x = this.x;
    var y = this.y;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 *
 * @method
 *
 * @param {Vec3} v The other Vec3.
 *
 * @return {Vec3} this
 */
Vec3.prototype.dot = function dot(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 * Stores the result in the current Vec3.
 *
 * @method cross
 *
 * @param {Vec3} v The other Vec3
 *
 * @return {Vec3} this
 */
Vec3.prototype.cross = function cross(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    this.x = y * vz - z * vy;
    this.y = z * vx - x * vz;
    this.z = x * vy - y * vx;
    return this;
};

/**
 * Scale the current Vec3 by a scalar.
 *
 * @method
 *
 * @param {Number} s The Number by which to scale
 *
 * @return {Vec3} this
 */
Vec3.prototype.scale = function scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec3.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.invert = function invert() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
};

/**
 * Apply a function component-wise to the current Vec3.
 *
 * @method
 *
 * @param {Function} fn Function to apply.
 *
 * @return {Vec3} this
 */
Vec3.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    this.z = fn(this.z);

    return this;
};

/**
 * The magnitude of the current Vec3.
 *
 * @method
 *
 * @return {Number} the magnitude of the Vec3
 */
Vec3.prototype.length = function length() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return Math.sqrt(x * x + y * y + z * z);
};

/**
 * The magnitude squared of the current Vec3.
 *
 * @method
 *
 * @return {Number} magnitude of the Vec3 squared
 */
Vec3.prototype.lengthSq = function lengthSq() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return x * x + y * y + z * z;
};

/**
 * Copy the input onto the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v Vec3 to copy
 *
 * @return {Vec3} this
 */
Vec3.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

/**
 * Reset the current Vec3.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec3 is exactly 0.
 *
 * @method
 *
 * @return {Boolean} whether or not the magnitude is zero
 */
Vec3.prototype.isZero = function isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
};

/**
 * The array form of the current Vec3.
 *
 * @method
 *
 * @return {Array} a three element array representing the components of the Vec3
 */
Vec3.prototype.toArray = function toArray() {
    return [this.x, this.y, this.z];
};

/**
 * Preserve the orientation but change the length of the current Vec3 to 1.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.normalize = function normalize() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var len = Math.sqrt(x * x + y * y + z * z) || 1;
    len = 1 / len;

    this.x *= len;
    this.y *= len;
    this.z *= len;
    return this;
};

/**
 * Apply the rotation corresponding to the input (unit) Quaternion
 * to the current Vec3.
 *
 * @method
 *
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply
 *
 * @return {Vec3} this
 */
Vec3.prototype.applyRotation = function applyRotation(q) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = this.x;
    var vy = this.y;
    var vz = this.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    this.x = tx * w + x * tw + y * tz - ty * z;
    this.y = ty * w + y * tw + tx * z - x * tz;
    this.z = tz * w + z * tw + x * ty - tx * y;
    return this;
};

/**
 * Apply the input Mat33 the the current Vec3.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to apply
 *
 * @return {Vec3} this
 */
Vec3.prototype.applyMatrix = function applyMatrix(matrix) {
    var M = matrix.get();

    var x = this.x;
    var y = this.y;
    var z = this.z;

    this.x = M[0]*x + M[1]*y + M[2]*z;
    this.y = M[3]*x + M[4]*y + M[5]*z;
    this.z = M[6]*x + M[7]*y + M[8]*z;
    return this;
};

/**
 * Normalize the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The normalize Vec3.
 */
Vec3.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;
    var z = v.z;

    var length = Math.sqrt(x * x + y * y + z * z) || 1;
    length = 1 / length;

    output.x = x * length;
    output.y = y * length;
    output.z = z * length;
    return output;
};

/**
 * Apply a rotation to the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The rotated version of the input Vec3.
 */
Vec3.applyRotation = function applyRotation(v, q, output) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Clone the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to clone.
 *
 * @return {Vec3} The cloned Vec3.
 */
Vec3.clone = function clone(v) {
    return new Vec3(v.x, v.y, v.z);
};

/**
 * Add the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the addition.
 */
Vec3.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;
    output.z = v1.z + v2.z;
    return output;
};

/**
 * Subtract the second Vec3 from the first.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the subtraction.
 */
Vec3.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    output.z = v1.z - v2.z;
    return output;
};

/**
 * Scale the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the scaling.
 */
Vec3.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    output.z = v.z * s;
    return output;
};

/**
 * Scale and add the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the scaling.
 */
Vec3.prototype.scaleAndAdd = function scaleAndAdd(a, b, s) {
    this.x = a.x + (b.x * s);
    this.y = a.y + (b.y * s);
    this.z = a.z + (b.z * s);
};


/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
Vec3.prototype.squaredDistance = function squaredDistance(b) {
    var x = b.x - this.x,
        y = b.y - this.y,
        z = b.z - this.z;
    return x*x + y*y + z*z
};

Vec3.prototype.distanceTo = function ( v ) {

    return Math.sqrt( this.squaredDistance( v ) );

};

/**
 * The dot product of the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 *
 * @return {Number} The dot product.
 */
Vec3.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * The (right-handed) cross product of the input Vec3's.
 * v1 x v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.cross = function cross(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    output.x = y1 * z2 - z1 * y2;
    output.y = z1 * x2 - x1 * z2;
    output.z = x1 * y2 - y1 * x2;
    return output;
};

/**
 * The projection of v1 onto v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.project = function project(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    var scale = x1 * x2 + y1 * y2 + z1 * z2;
    scale /= x2 * x2 + y2 * y2 + z2 * z2;

    output.x = x2 * scale;
    output.y = y2 * scale;
    output.z = z2 * scale;

    return output;
};

Vec3.prototype.createFromArray = function(a){
    this.x = a[0] || 0;
    this.y = a[1] || 0;
    this.z = a[2] || 0;
};

module.exports = Vec3;

},{}],15:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = {
    Mat33: require('./Mat33'),
    Quaternion: require('./Quaternion'),
    Vec2: require('./Vec2'),
    Vec3: require('./Vec3'),
    Ray: require('./Ray')
};

},{"./Mat33":10,"./Quaternion":11,"./Ray":12,"./Vec2":13,"./Vec3":14}],16:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W008 */

'use strict';

/**
 * A library of curves which map an animation explicitly as a function of time.
 *
 * @namespace
 * @property {Function} linear
 * @property {Function} easeIn
 * @property {Function} easeOut
 * @property {Function} easeInOut
 * @property {Function} easeOutBounce
 * @property {Function} spring
 * @property {Function} inQuad
 * @property {Function} outQuad
 * @property {Function} inOutQuad
 * @property {Function} inCubic
 * @property {Function} outCubic
 * @property {Function} inOutCubic
 * @property {Function} inQuart
 * @property {Function} outQuart
 * @property {Function} inOutQuart
 * @property {Function} inQuint
 * @property {Function} outQuint
 * @property {Function} inOutQuint
 * @property {Function} inSine
 * @property {Function} outSine
 * @property {Function} inOutSine
 * @property {Function} inExpo
 * @property {Function} outExpo
 * @property {Function} inOutExp
 * @property {Function} inCirc
 * @property {Function} outCirc
 * @property {Function} inOutCirc
 * @property {Function} inElastic
 * @property {Function} outElastic
 * @property {Function} inOutElastic
 * @property {Function} inBounce
 * @property {Function} outBounce
 * @property {Function} inOutBounce
 * @property {Function} flat            - Useful for delaying the execution of
 *                                        a subsequent transition.
 */
var Curves = {
    linear: function(t) {
        return t;
    },

    easeIn: function(t) {
        return t*t;
    },

    easeOut: function(t) {
        return t*(2-t);
    },

    easeInOut: function(t) {
        if (t <= 0.5) return 2*t*t;
        else return -2*t*t + 4*t - 1;
    },

    easeOutBounce: function(t) {
        return t*(3 - 2*t);
    },

    spring: function(t) {
        return (1 - t) * Math.sin(6 * Math.PI * t) + t;
    },

    inQuad: function(t) {
        return t*t;
    },

    outQuad: function(t) {
        return -(t-=1)*t+1;
    },

    inOutQuad: function(t) {
        if ((t/=.5) < 1) return .5*t*t;
        return -.5*((--t)*(t-2) - 1);
    },

    inCubic: function(t) {
        return t*t*t;
    },

    outCubic: function(t) {
        return ((--t)*t*t + 1);
    },

    inOutCubic: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t;
        return .5*((t-=2)*t*t + 2);
    },

    inQuart: function(t) {
        return t*t*t*t;
    },

    outQuart: function(t) {
        return -((--t)*t*t*t - 1);
    },

    inOutQuart: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t;
        return -.5 * ((t-=2)*t*t*t - 2);
    },

    inQuint: function(t) {
        return t*t*t*t*t;
    },

    outQuint: function(t) {
        return ((--t)*t*t*t*t + 1);
    },

    inOutQuint: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t*t;
        return .5*((t-=2)*t*t*t*t + 2);
    },

    inSine: function(t) {
        return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
    },

    outSine: function(t) {
        return Math.sin(t * (Math.PI/2));
    },

    inOutSine: function(t) {
        return -.5*(Math.cos(Math.PI*t) - 1);
    },

    inExpo: function(t) {
        return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
    },

    outExpo: function(t) {
        return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
    },

    inOutExpo: function(t) {
        if (t===0) return 0.0;
        if (t===1.0) return 1.0;
        if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    },

    inCirc: function(t) {
        return -(Math.sqrt(1 - t*t) - 1);
    },

    outCirc: function(t) {
        return Math.sqrt(1 - (--t)*t);
    },

    inOutCirc: function(t) {
        if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
        return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },

    inElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
    },

    outElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
    },

    inOutElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
    },

    inBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return t*t*((s+1)*t - s);
    },

    outBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return ((--t)*t*((s+1)*t + s) + 1);
    },

    inOutBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
        return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },

    inBounce: function(t) {
        return 1.0 - Curves.outBounce(1.0-t);
    },

    outBounce: function(t) {
        if (t < (1/2.75)) {
            return (7.5625*t*t);
        }
        else if (t < (2/2.75)) {
            return (7.5625*(t-=(1.5/2.75))*t + .75);
        }
        else if (t < (2.5/2.75)) {
            return (7.5625*(t-=(2.25/2.75))*t + .9375);
        }
        else {
            return (7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    },

    inOutBounce: function(t) {
        if (t < .5) return Curves.inBounce(t*2) * .5;
        return Curves.outBounce(t*2-1.0) * .5 + .5;
    },

    flat: function() {
        return 0;
    }
};

module.exports = Curves;

},{}],17:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var Curves = require('./Curves');
var Engine = require('../core/Engine');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */
 var performance = {};

 (function(){

   Date.now = (Date.now || function () {  // thanks IE8
 	  return new Date().getTime();
   });

   if ("now" in performance == false){

     var nowOffset = Date.now();

     if (performance.timing && performance.timing.navigationStart){
       nowOffset = performance.timing.navigationStart
     }

     performance.now = function now(){
       return Date.now() - nowOffset;
     }
   }

 })();

function Transitionable(initialState, param, loop) {
    this._queue = [];
    this._from = null;
    this._state = null;
    this._startedAt = null;
    this._pausedAt = null;
    this._loop = loop || null;
    this.id = null;
    param ? this.param = param : param = null;
    if (initialState != null) this.from(initialState);
    Engine.updateQueue.push(this);
}

/**
 * Registers a transition to be pushed onto the internal queue.
 *
 * @method to
 * @chainable
 *
 * @param  {Number|Array.Number}    finalState              final state to
 *                                                          transiton to
 * @param  {String|Function}        [curve=Curves.linear]   easing function
 *                                                          used for
 *                                                          interpolating
 *                                                          [0, 1]
 * @param  {Number}                 [duration=100]          duration of
 *                                                          transition
 * @param  {Function}               [callback]              callback function
 *                                                          to be called after
 *                                                          the transition is
 *                                                          complete
 * @param  {String}                 [method]                method used for
 *                                                          interpolation
 *                                                          (e.g. slerp)
 * @return {Transitionable}         this
 */
Transitionable.prototype.to = function to(finalState, curve, duration, callback, method) {

    curve = curve != null && curve.constructor === String ? Curves[curve] : curve;
    if (this._queue.length === 0) {
        this._startedAt = performance.now();
        this._pausedAt = null;
    }

    this._queue.push(
        finalState,
        curve != null ? curve : Curves.linear,
        duration != null ? duration : 100,
        callback,
        method
    );

    return this;
};

/**
 * Resets the transition queue to a stable initial state.
 *
 * @method from
 * @chainable
 *
 * @param  {Number|Array.Number}    initialState    initial state to
 *                                                  transition from
 * @return {Transitionable}         this
 */
Transitionable.prototype.from = function from(initialState) {
    this._state = initialState;
    this._from = this._sync(null, this._state);
    this._queue.length = 0;
    this._startedAt = performance.now();
    this._pausedAt = null;
    return this;
};

/**
 * Delays the execution of the subsequent transition for a certain period of
 * time.
 *
 * @method delay
 * @chainable
 *
 * @param {Number}      duration    delay time in ms
 * @param {Function}    [callback]  Zero-argument function to call on observed
 *                                  completion (t=1)
 * @return {Transitionable}         this
 */
Transitionable.prototype.delay = function delay(duration, callback) {
    var endState = this._queue.length > 0 ? this._queue[this._queue.length - 5] : this._state;
    return this.to(endState, Curves.flat, duration, callback);
};

/**
 * Overrides current transition.
 *
 * @method override
 * @chainable
 *
 * @param  {Number|Array.Number}    [finalState]    final state to transiton to
 * @param  {String|Function}        [curve]         easing function used for
 *                                                  interpolating [0, 1]
 * @param  {Number}                 [duration]      duration of transition
 * @param  {Function}               [callback]      callback function to be
 *                                                  called after the transition
 *                                                  is complete
 * @param {String}                  [method]        optional method used for
 *                                                  interpolating between the
 *                                                  values. Set to `slerp` for
 *                                                  spherical linear
 *                                                  interpolation.
 * @return {Transitionable}         this
 */
Transitionable.prototype.override = function override(finalState, curve, duration, callback, method) {
    if (this._queue.length > 0) {
        if (finalState != null) this._queue[0] = finalState;
        if (curve != null)      this._queue[1] = curve.constructor === String ? Curves[curve] : curve;
        if (duration != null)   this._queue[2] = duration;
        if (callback != null)   this._queue[3] = callback;
        if (method != null)     this._queue[4] = method;
    }
    return this;
};


/**
 * Used for interpolating between the start and end state of the currently
 * running transition
 *
 * @method  _interpolate
 * @private
 *
 * @param  {Object|Array|Number} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Object|Array|Number} from       Start state of current transition.
 * @param  {Object|Array|Number} to         End state of current transition.
 * @param  {Number} progress                Progress of the current transition,
 *                                          in [0, 1]
 * @param  {String} method                  Method used for interpolation (e.g.
 *                                          slerp)
 * @return {Object|Array|Number}            output
 */
Transitionable.prototype._interpolate = function _interpolate(output, from, to, progress, method) {
    if (to instanceof Object) {
        if (method === 'slerp') {
            var x, y, z, w;
            var qx, qy, qz, qw;
            var omega, cosomega, sinomega, scaleFrom, scaleTo;

            x = from[0];
            y = from[1];
            z = from[2];
            w = from[3];

            qx = to[0];
            qy = to[1];
            qz = to[2];
            qw = to[3];

            if (progress === 1) {
                output[0] = qx;
                output[1] = qy;
                output[2] = qz;
                output[3] = qw;
                return output;
            }

            cosomega = w * qw + x * qx + y * qy + z * qz;
            if ((1.0 - cosomega) > 1e-5) {
                omega = Math.acos(cosomega);
                sinomega = Math.sin(omega);
                scaleFrom = Math.sin((1.0 - progress) * omega) / sinomega;
                scaleTo = Math.sin(progress * omega) / sinomega;
            }
            else {
                scaleFrom = 1.0 - progress;
                scaleTo = progress;
            }

            output[0] = x * scaleFrom + qx * scaleTo;
            output[1] = y * scaleFrom + qy * scaleTo;
            output[2] = z * scaleFrom + qz * scaleTo;
            output[3] = w * scaleFrom + qw * scaleTo;
        }
        else if (to instanceof Array) {
            for (var i = 0, len = to.length; i < len; i++) {
                output[i] = this._interpolate(output[i], from[i], to[i], progress, method);
            }
        }
        else {
            for (var key in to) {
                output[key] = this._interpolate(output[key], from[key], to[key], progress, method);
            }
        }
    }
    else {
        output = from + progress * (to - from);
    }
    return output;
};


/**
 * Internal helper method used for synchronizing the current, absolute state of
 * a transition to a given output array, object literal or number. Supports
 * nested state objects by through recursion.
 *
 * @method  _sync
 * @private
 *
 * @param  {Number|Array|Object} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Number|Array|Object} input      Input state to proxy onto the
 *                                          output.
 * @return {Number|Array|Object} output     Passed in output object.
 */
Transitionable.prototype._sync = function _sync(output, input) {
    if (typeof input === 'number') output = input;
    else if (input instanceof Array) {
        if (output == null) output = [];
        for (var i = 0, len = input.length; i < len; i++) {
            output[i] = _sync(output[i], input[i]);
        }
    }
    else if (input instanceof Object) {
        if (output == null) output = {};
        for (var key in input) {
            output[key] = _sync(output[key], input[key]);
        }
    }
    return output;
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {Number=} t               Evaluate the curve at a normalized version
 *                                  of this time. If omitted, use current time
 *                                  (Unix epoch time retrieved from Clock).
 * @return {Number|Array.Number}    Beginning state interpolated to this point
 *                                  in time.
 */
Transitionable.prototype.get = function get(t) {
    if (this._queue.length === 0) return this._state;

    t = this._pausedAt ? this._pausedAt : t;
    t = t ? t : performance.now();

    var progress = (t - this._startedAt) / this._queue[2];
    this._state = this._interpolate(
        this._state,
        this._from,
        this._queue[0],
        this._queue[1](progress > 1 ? 1 : progress),
        this._queue[4]
    );
    var state = this._state;
    if (progress >= 1) {
        this._startedAt = this._startedAt + this._queue[2];
        this._from = this._sync(this._from, this._state);
        this._queue.shift();
        this._queue.shift();
        this._queue.shift();
        var callback = this._queue.shift();
        this._queue.shift();
        if (callback) callback();
    }
    return progress > 1 ? this.get() : state;
};

/**
 * Is there at least one transition pending completion?
 *
 * @method isActive
 *
 * @return {Boolean}    Boolean indicating whether there is at least one pending
 *                      transition. Paused transitions are still being
 *                      considered active.
 */
Transitionable.prototype.isActive = function isActive() {
    return this._queue.length > 0;
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.halt = function halt() {
    return this.from(this.get());
};

/**
 * Pause transition. This will not erase any actions.
 *
 * @method pause
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.pause = function pause() {
    this._pausedAt = performance.now();
    return this;
};

/**
 * Has the current action been paused?
 *
 * @method isPaused
 * @chainable
 *
 * @return {Boolean} if the current action has been paused
 */
Transitionable.prototype.isPaused = function isPaused() {
    return !!this._pausedAt;
};

/**
 * Resume a previously paused transition.
 *
 * @method resume
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.resume = function resume() {
    var diff = this._pausedAt - this._startedAt;
    this._startedAt = performance.now() - diff;
    this._pausedAt = null;
    return this;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 * @deprecated Use `.from` instead!
 *
 * @param {Number|Array.Number|Object.<number, number>} start
 *    stable state to set to
 * @return {Transitionable}                             this
 */
Transitionable.prototype.reset = function(start) {
    return this.from(start);
};

/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 * @chainable
 * @deprecated Use `.to` instead!
 *
 * @param {Number|FamousEngineMatrix|Array.Number|Object.<number, number>} state
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 * @return {Transitionable} this
 */
Transitionable.prototype.set = function(state, transition, callback) {
    if (transition == null) {
        this.from(state);
        if (callback) callback();
    }
    else {
        this.to(state, transition.curve, transition.duration, callback, transition.method);
    }
    return this;
};


module.exports = Transitionable;

},{"../core/Engine":5,"./Curves":16}],18:[function(require,module,exports){
module.exports = {
    Curves: require('./Curves'),
    Transitionable: require('./Transitionable')
};

},{"./Curves":16,"./Transitionable":17}]},{},[9])(9)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb21wb25lbnRzL0NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL0RPTUNvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL01hdHJpeC5qcyIsInNyYy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2NvcmUvRW5naW5lLmpzIiwic3JjL2NvcmUvTm9kZS5qcyIsInNyYy9jb3JlL1NjZW5lLmpzIiwic3JjL2NvcmUvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF0aC9NYXQzMy5qcyIsInNyYy9tYXRoL1F1YXRlcm5pb24uanMiLCJzcmMvbWF0aC9SYXkuanMiLCJzcmMvbWF0aC9WZWMyLmpzIiwic3JjL21hdGgvVmVjMy5qcyIsInNyYy9tYXRoL2luZGV4LmpzIiwic3JjL3RyYW5zaXRpb25zL0N1cnZlcy5qcyIsInNyYy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZS5qcyIsInNyYy90cmFuc2l0aW9ucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5cEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9kQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvbXBvbmVudCBoYW5kbGVzIHN0b3JpbmcgdGhlIHN0YXRlIG9mIGEgQ29tcG9uZW50IHRoYXQgaXMgYXR0YWNoZWQgdG8gYSBOb2RlLlxudmFyIENvbXBvbmVudCA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHRoaXMubm9kZSA9IG5vZGUgPyBub2RlIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQ7XG4iLCJ2YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9Db21wb25lbnQnKTtcbnZhciBNYXRyaXggPSByZXF1aXJlKCcuL01hdHJpeCcpO1xuXG52YXIgRE9NQ29tcG9uZW50ID0gZnVuY3Rpb24obm9kZSwgZWxlbSwgY29udGFpbmVyKXtcblxuICAgIHRoaXMubm9kZSA9IG5vZGUuaWQgPyBub2RlLmlkIDogbm9kZTtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLmVsZW0gPSBlbGVtID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdmFyIGNvbnRhaW5lciA9IGNvbnRhaW5lciA/IGNvbnRhaW5lciA6IGRvY3VtZW50LmJvZHk7XG5cbiAgICB0aGlzLmVsZW0uZGF0YXNldC5ub2RlID0gdGhpcy5ub2RlO1xuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKHRoaXMubm9kZSk7XG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ25vZGUnKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtKTtcblxuICAgIE9iamVjdC5vYnNlcnZlKHRoaXMuX25vZGUsIGZ1bmN0aW9uKGNoYW5nZXMpe1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLl9ub2RlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdmFyIHByZWZpeCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdmFyIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgICAgICB0cmFuc2Zvcm0sXG4gICAgICAgIG9yaWdpbixcbiAgICAgICAgcGVyc3BlY3RpdmUsXG4gICAgICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgICAgICAuY2FsbChzdHlsZXMpXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICAgICAgKVsxXSxcbiAgICAgICAgZG9tID0gKCdXZWJLaXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgICAgIGlmKGRvbSA9PT0nTW96Jyl7XG4gICAgICAgICAgdHJhbnNmb3JtID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgb3JpZ2luID0gJ3RyYW5zZm9ybU9yaWdpbic7XG4gICAgICAgICAgcGVyc3BlY3RpdmUgPSAncGVyc3BlY3RpdmUnO1xuICAgICAgICB9IGVsc2UgaWYoZG9tID09PSdXZWJLaXQnKXtcbiAgICAgICAgICB0cmFuc2Zvcm0gPSAnd2Via2l0VHJhbnNmb3JtJztcbiAgICAgICAgICBvcmlnaW4gPSAnd2Via2l0VHJhbnNmb3JtT3JpZ2luJztcbiAgICAgICAgICBwZXJzcGVjdGl2ZSA9ICdwZXJzcGVjdGl2ZSc7XG4gICAgICAgIH0gZWxzZSBpZihkb20gPT09J01TJyl7XG4gICAgICAgICAgdHJhbnNmb3JtID0gJ21zVHJhbnNmb3JtJztcbiAgICAgICAgICBvcmlnaW4gPSAnbXNUcmFuc2Zvcm1PcmlnaW4nO1xuICAgICAgICAgIHBlcnNwZWN0aXZlID0gJ3BlcnNwZWN0aXZlJztcbiAgICAgICAgfSBlbHNlIGlmIChkb20gPT09J08nKXtcbiAgICAgICAgICB0cmFuc2Zvcm0gPSAnT1RyYW5zZm9ybSc7XG4gICAgICAgICAgb3JpZ2luID0gJ3RyYW5zZm9ybU9yaWdpbic7XG4gICAgICAgICAgcGVyc3BlY3RpdmUgPSAncGVyc3BlY3RpdmUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyYW5zZm9ybSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgIG9yaWdpbiA9ICd0cmFuc2Zvcm1PcmlnaW4nO1xuICAgICAgICAgIHBlcnNwZWN0aXZlID0gJ3BlcnNwZWN0aXZlJztcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9tOiBkb20sXG4gICAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKSxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgICAgIG9yaWdpbjogb3JpZ2luXG4gICAgICB9O1xuXG4gICAgfTtcblxuICAgIHRoaXMudmVuZG9yID0gcHJlZml4KCk7XG5cbiAgICBpZihub2RlLmNvbnRlbnQpIHtcbiAgICAgIHRoaXMuc2V0Q29udGVudChub2RlLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIGlmKG5vZGUuY2xhc3Nlcykge1xuICAgICAgZm9yKHZhciBpPTA7IGk8bm9kZS5jbGFzc2VzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdGhpcy5hZGRDbGFzcyhub2RlLmNsYXNzZXNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudHJhbnNmb3JtKG5vZGUpO1xufTtcblxuRE9NQ29tcG9uZW50LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQ29tcG9uZW50LnByb3RvdHlwZSk7XG5ET01Db21wb25lbnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ29tcG9uZW50O1xuXG5ET01Db21wb25lbnQucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG4pe1xuXG4gIG4ub3JpZ2luID0gbi5vcmlnaW4gfHwgWzAuMCwwLjAsMC4wXTtcbiAgbi5hbGlnbiA9IG4uYWxpZ24gfHwgWzAuMCwwLjAsMC4wXTtcbiAgbi5zaXplID0gbi5zaXplIHx8IFsxLjAsMS4wLDEuMF07XG4gIG4uc2NhbGUgPSBuLnNjYWxlIHx8IFsxLjAsMS4wLDEuMF07XG4gIG4ucm90YXRlID0gbi5yb3RhdGUgfHwgWzAsMCwwXTtcbiAgbi5vcGFjaXR5ID0gbi5vcGFjaXR5IHx8IDEuMDtcblxufVxuXG5ET01Db21wb25lbnQucHJvdG90eXBlLmlzSW50ID0gZnVuY3Rpb24obil7XG5cbiAgICByZXR1cm4gTnVtYmVyKG4pID09PSBuICYmIG4gJSAxID09PSAwO1xuXG59XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUuaXNGbG9hdCA9IGZ1bmN0aW9uKG4pe1xuXG4gICAgaWYobiA9PT0gcGFyc2VGbG9hdCgxLjApKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gbiA9PT0gTnVtYmVyKG4pICYmIG4gJSAxICE9PSAwO1xuXG59XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uKGNvbnRlbnQpe1xuXG4gIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBjb250ZW50O1xuXG59XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjbCl7XG5cbiAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoY2wpO1xuXG59XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihjbCl7XG5cbiAgdGhpcy5lbGVtLmNsYXNzTGlzdC5yZW1vdmUoY2wpO1xuXG59XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUuZGVncmVlc1RvUmFkaWFucyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcblxuICByZXR1cm4gZGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKTtcblxufTtcblxuRE9NQ29tcG9uZW50LnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbihub2RlKXtcblxuICB2YXIgZCA9IHRoaXM7XG5cbiAgaWYobm9kZS5vcmlnaW4pIHtcblxuICAgIHRoaXMuZWxlbS5zdHlsZVt0aGlzLnZlbmRvci5vcmlnaW5dID0gKG5vZGUub3JpZ2luWzBdKjEwMCkrJyUgJysobm9kZS5vcmlnaW5bMV0qMTAwKSsnJSc7XG5cbiAgfVxuXG5cbiAgaWYobm9kZS5zaXplKSB7XG5cbiAgICBpZihub2RlLnNpemVbMF0gPT09IDEpIG5vZGUuc2l6ZVswXSA9IHBhcnNlRmxvYXQoMS4wKTtcbiAgICBpZihub2RlLnNpemVbMV0gPT09IDEpIG5vZGUuc2l6ZVsxXSA9IHBhcnNlRmxvYXQoMS4wKTtcblxuICAgIGlmKG5vZGUuc2l6ZVswXSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUud2lkdGggPSBub2RlLnNpemVbMV0qMTAwKyd2aCc7XG4gICAgfSBlbHNlIGlmKG5vZGUuc2l6ZVswXSA9PT0gJ2F1dG8nKSB7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS53aWR0aCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlzRmxvYXQobm9kZS5zaXplWzBdKSA/IHRoaXMuZWxlbS5zdHlsZS53aWR0aCA9IG5vZGUuc2l6ZVswXSoxMDArJyUnIDogdGhpcy5lbGVtLnN0eWxlLndpZHRoID0gbm9kZS5zaXplWzBdKydweCc7XG4gICAgfVxuICAgIGlmKG5vZGUuc2l6ZVsxXSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuaGVpZ2h0ID0gbm9kZS5zaXplWzBdKjEwMCsndncnO1xuICAgIH0gZWxzZSBpZihub2RlLnNpemVbMV0gPT09ICdhdXRvJykge1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNGbG9hdChub2RlLnNpemVbMV0pID8gdGhpcy5lbGVtLnN0eWxlLmhlaWdodCA9IG5vZGUuc2l6ZVsxXSoxMDArJyUnIDogdGhpcy5lbGVtLnN0eWxlLmhlaWdodCA9IG5vZGUuc2l6ZVsxXSsncHgnO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlLnNpemVbMV0qMTAwKyclJyk7XG4gICAgICAgIC8vIHRoaXMuZWxlbS5zdHlsZS5oZWlnaHQgPSBub2RlLnNpemVbMV0qMTAwKyclJztcbiAgICB9XG5cbiAgICAvL1RPRE86IGZpeCBpc0Zsb2F0IGFuZCBpc0ludCwgaXRzIG5vdCB3b3JraW5nIVxuXG4gIH1cblxuICBpZihub2RlLm9wYWNpdHkpIHtcblxuICAgIHRoaXMuZWxlbS5zdHlsZS5vcGFjaXR5ID0gbm9kZS5vcGFjaXR5O1xuXG4gIH1cblxuICBpZihub2RlLnBvc2l0aW9uKSB7XG5cbiAgICB0aGlzLmVsZW0uc3R5bGUucG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuXG4gIH1cblxuICBpZihub2RlLnRyYW5zZm9ybSkge1xuXG4gICAgdGhpcy5lbGVtLnN0eWxlW3RoaXMudmVuZG9yLnRyYW5zZm9ybV0gPSBub2RlLnRyYW5zZm9ybTtcblxuICB9IGVsc2Uge1xuXG4gIHZhciBtYXRyaXggPSBuZXcgTWF0cml4KCk7XG5cbiAgaWYobm9kZS50cmFuc2xhdGUgJiYgbm9kZS5hbGlnbikge1xuXG4gICAgbWF0cml4ID0gbWF0cml4LnRyYW5zbGF0ZSgobm9kZS5hbGlnblswXSAqIHRoaXMuZWxlbS5wYXJlbnROb2RlLmNsaWVudFdpZHRoKStub2RlLnRyYW5zbGF0ZVswXSwgKG5vZGUuYWxpZ25bMV0gKiB0aGlzLmVsZW0ucGFyZW50Tm9kZS5jbGllbnRIZWlnaHQpK25vZGUudHJhbnNsYXRlWzFdLCBub2RlLmFsaWduWzJdKyBub2RlLnRyYW5zbGF0ZVsyXSA9PT0gMCA/IDEgOiBub2RlLnRyYW5zbGF0ZVsyXSApO1xuXG4gIH0gZWxzZSBpZihub2RlLmFsaWduKSB7XG5cbiAgICBtYXRyaXggPSBtYXRyaXgudHJhbnNsYXRlKG5vZGUuYWxpZ25bMF0gKiB0aGlzLmVsZW0ucGFyZW50Tm9kZS5jbGllbnRXaWR0aCwgbm9kZS5hbGlnblsxXSAqIHRoaXMuZWxlbS5wYXJlbnROb2RlLmNsaWVudEhlaWdodCwgbm9kZS5hbGlnblsyXSApO1xuXG4gIH0gZWxzZSBpZihub2RlLnRyYW5zbGF0ZSkge1xuXG4gICAgbWF0cml4ID0gbWF0cml4LnRyYW5zbGF0ZShub2RlLnRyYW5zbGF0ZVswXSwgbm9kZS50cmFuc2xhdGVbMV0sIG5vZGUudHJhbnNsYXRlWzJdID09PSAwID8gMSA6IG5vZGUudHJhbnNsYXRlWzJdKTtcblxuICB9IGVsc2Uge1xuXG4gICAgbWF0cml4ID0gbWF0cml4LnRyYW5zbGF0ZSgwLCAwLCAxKTtcblxuICB9XG5cbiAgaWYobm9kZS5zY2FsZSkge1xuXG4gICAgICBtYXRyaXguc2NhbGUobm9kZS5zY2FsZVswXSB8fCAxLCBub2RlLnNjYWxlWzFdIHx8IDEsIG5vZGUuc2NhbGVbMl0gfHwgMSk7XG5cbiAgfVxuICBpZihub2RlLnJvdGF0ZSkge1xuXG4gICAgICBpZihub2RlLnJvdGF0ZVswXSkge1xuICAgICAgICBtYXRyaXggPSBtYXRyaXgucm90YXRlWChkLmRlZ3JlZXNUb1JhZGlhbnMobm9kZS5yb3RhdGVbMF0pKTtcbiAgICAgIH1cbiAgICAgIGlmKG5vZGUucm90YXRlWzFdKSB7XG4gICAgICAgIG1hdHJpeCA9IG1hdHJpeC5yb3RhdGVZKGQuZGVncmVlc1RvUmFkaWFucyhub2RlLnJvdGF0ZVsxXSkpO1xuICAgICAgfVxuICAgICAgaWYobm9kZS5yb3RhdGVbMl0pIHtcbiAgICAgICAgbWF0cml4ID0gbWF0cml4LnJvdGF0ZVooZC5kZWdyZWVzVG9SYWRpYW5zKG5vZGUucm90YXRlWzJdKSk7XG4gICAgICB9XG5cbiAgfVxuXG4gIHRoaXMuZWxlbS5zdHlsZVt0aGlzLnZlbmRvci50cmFuc2Zvcm1dID0gbWF0cml4LnRvU3RyaW5nKCk7XG5cbiAgfVxuXG59O1xuXG5ET01Db21wb25lbnQucHJvdG90eXBlLnNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24ocCl7XG5cbiAgdGhpcy5lbGVtLnN0eWxlWydwZXJzcGVjdGl2ZSddID0gcDtcblxufTtcblxuRE9NQ29tcG9uZW50LnByb3RvdHlwZS5zeW5jID0gZnVuY3Rpb24oZXZlbnRzLCBjYil7XG5cbiAgZm9yKCB2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKysgKXtcbiAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbaV0sY2IpO1xuICB9XG5cbiAgLy9UT0RPOiBNYWtlIGEgU3luYyBDbGFzcyBhbmQgcHJvcGVybHkgc3luYyBtb3VzZXdoZWVsIGFuZCB0b3VjaCBkcmFnXG5cbn07XG5cblxuRE9NQ29tcG9uZW50LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpe1xuXG4gIHRoaXMudHJhbnNmb3JtKHRoaXMuX25vZGUpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUNvbXBvbmVudDtcbiIsIi8qKlxuICogQSByZWFsbHkgc2ltcGxlIGFuZCBiYXNpYyA0eDQgbWF0cml4IGltcGxlbWVudGF0aW9uLCBjb21wYXRpYmxlIHdpdGggQ1NTLiBUcmFuc2Zvcm0gdGhlbSwgYW5kXG4gKiBhcHBseSB0aGUgdG9TdHJpbmcoKSBvdXRwdXQgdG8gYSBub2RlJ3MgdHJhbnNmb3JtIHN0eWxlLiBEb24ndCBmb3JnZXQgcGVyc3BlY3RpdmUgOilcbiAqXG4gKiBCeSBQZXRlciBOZWRlcmxvZiwgaHR0cHM6Ly9naXRodWIuY29tL3BldGVybmVkXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQsIHNlZSBsaWNlbnNlLnR4dCBvciBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG5cblx0ICAgLy8gXyAgX18gIF9fICBfXyAgIF9fXyAgX19fX18gIF8gICBfICBfXyAgXyBcXFxcXG5cdCAgLy8gfCBcXC8gfHx8ICBcXC8gIHx8LyAgIFxcfF8gICBffHwgfF98IHx8fCBcXC8gfCBcXFxcXG5cdCAvLyAgIFxcICAvLyB8IHxcXC98IHx8ICBfICB8IHwgfCB8fCAgXyAgfCBcXFxcICAvICAgXFxcXFxuXHQvLyAgICAgXFwvLyAgfF98fCB8X3x8X3wgfF98IHxffCB8fF98IHxffCAgXFxcXC8gICAgIFxcXFxcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgSURFTlRJVFkgPSBbXG5cdFx0MSwgMCwgMCwgMCxcblx0XHQwLCAxLCAwLCAwLFxuXHRcdDAsIDAsIDEsIDAsXG5cdFx0MCwgMCwgMCwgMVxuXHRdO1xuXG5cdGZ1bmN0aW9uIG11bHRpcGx5IChcblx0XHRhLCBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpLCBqLCBrLCBsLCBtLCBuLCBvLCBwLFxuXHRcdEEsIEIsIEMsIEQsIEUsIEYsIEcsIEgsIEksIEosIEssIEwsIE0sIE4sIE8sIFBcblx0KSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdGEgKiBBICsgYiAqIEUgKyBjICogSSArIGQgKiBNLFxuXHRcdFx0YSAqIEIgKyBiICogRiArIGMgKiBKICsgZCAqIE4sXG5cdFx0XHRhICogQyArIGIgKiBHICsgYyAqIEsgKyBkICogTyxcblx0XHRcdGEgKiBEICsgYiAqIEggKyBjICogTCArIGQgKiBQLFxuXHRcdFx0ZSAqIEEgKyBmICogRSArIGcgKiBJICsgaCAqIE0sXG5cdFx0XHRlICogQiArIGYgKiBGICsgZyAqIEogKyBoICogTixcblx0XHRcdGUgKiBDICsgZiAqIEcgKyBnICogSyArIGggKiBPLFxuXHRcdFx0ZSAqIEQgKyBmICogSCArIGcgKiBMICsgaCAqIFAsXG5cdFx0XHRpICogQSArIGogKiBFICsgayAqIEkgKyBsICogTSxcblx0XHRcdGkgKiBCICsgaiAqIEYgKyBrICogSiArIGwgKiBOLFxuXHRcdFx0aSAqIEMgKyBqICogRyArIGsgKiBLICsgbCAqIE8sXG5cdFx0XHRpICogRCArIGogKiBIICsgayAqIEwgKyBsICogUCxcblx0XHRcdG0gKiBBICsgbiAqIEUgKyBvICogSSArIHAgKiBNLFxuXHRcdFx0bSAqIEIgKyBuICogRiArIG8gKiBKICsgcCAqIE4sXG5cdFx0XHRtICogQyArIG4gKiBHICsgbyAqIEsgKyBwICogTyxcblx0XHRcdG0gKiBEICsgbiAqIEggKyBvICogTCArIHAgKiBQXG5cdFx0XTtcblx0fVxuXG5cdHZhciBzaW4gPSBNYXRoLnNpbjtcblx0dmFyIGNvcyA9IE1hdGguY29zO1xuXG5cdC8qKlxuXHQgKiBNYXRyaXhcblx0ICpcblx0ICovXG5cblx0dmFyIE1hdHJpeCA9IGZ1bmN0aW9uIChlbnRpdGllcykge1xuXHRcdHRoaXMuZW50aXRpZXMgPSBlbnRpdGllcyB8fCBJREVOVElUWTtcblx0fTtcblxuXHRNYXRyaXgucHJvdG90eXBlID0ge1xuXHRcdG11bHRpcGx5OiBmdW5jdGlvbiAoZW50aXRpZXMpIHtcblx0XHRcdHJldHVybiBuZXcgTWF0cml4KFxuXHRcdFx0XHRtdWx0aXBseS5hcHBseSh3aW5kb3csIHRoaXMuZW50aXRpZXMuY29uY2F0KGVudGl0aWVzKSlcblx0XHRcdCk7XG5cdFx0fSxcblxuXHRcdHRyYW5zZm9ybTogZnVuY3Rpb24gKG1hdHJpeCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubXVsdGlwbHkobWF0cml4LmVudGl0aWVzKTtcblx0XHR9LFxuXG5cdFx0c2NhbGU6IGZ1bmN0aW9uIChzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tdWx0aXBseShbXG5cdFx0XHRcdHMsIDAsIDAsIDAsXG5cdFx0XHRcdDAsIHMsIDAsIDAsXG5cdFx0XHRcdDAsIDAsIHMsIDAsXG5cdFx0XHRcdDAsIDAsIDAsIDFcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHRyb3RhdGVYOiBmdW5jdGlvbiAoYSkge1xuXHRcdFx0dmFyIGMgPSBjb3MoYSk7XG5cdFx0XHR2YXIgcyA9IHNpbihhKTtcblx0XHRcdHJldHVybiB0aGlzLm11bHRpcGx5KFtcblx0XHRcdFx0MSwgMCwgIDAsIDAsXG5cdFx0XHRcdDAsIGMsIC1zLCAwLFxuXHRcdFx0XHQwLCBzLCAgYywgMCxcblx0XHRcdFx0MCwgMCwgIDAsIDFcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHRyb3RhdGVZOiBmdW5jdGlvbiAoYSkge1xuXHRcdFx0dmFyIGMgPSBjb3MoYSk7XG5cdFx0XHR2YXIgcyA9IHNpbihhKTtcblx0XHRcdHJldHVybiB0aGlzLm11bHRpcGx5KFtcblx0XHRcdFx0IGMsIDAsIHMsIDAsXG5cdFx0XHRcdCAwLCAxLCAwLCAwLFxuXHRcdFx0XHQtcywgMCwgYywgMCxcblx0XHRcdFx0IDAsIDAsIDAsIDFcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHRyb3RhdGVaOiBmdW5jdGlvbiAoYSkge1xuXHRcdFx0dmFyIGMgPSBjb3MoYSk7XG5cdFx0XHR2YXIgcyA9IHNpbihhKTtcblx0XHRcdHJldHVybiB0aGlzLm11bHRpcGx5KFtcblx0XHRcdFx0YywgLXMsIDAsIDAsXG5cdFx0XHRcdHMsICBjLCAwLCAwLFxuXHRcdFx0XHQwLCAgMCwgMSwgMCxcblx0XHRcdFx0MCwgIDAsIDAsIDFcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHR0cmFuc2xhdGU6IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tdWx0aXBseShbXG5cdFx0XHRcdDEsIDAsIDAsIDAsXG5cdFx0XHRcdDAsIDEsIDAsIDAsXG5cdFx0XHRcdDAsIDAsIDEsIDAsXG5cdFx0XHRcdHgsIHksIHosIDFcblx0XHRcdF0pO1xuXHRcdH0sXG5cblx0XHR0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICdtYXRyaXgzZCgnICsgdGhpcy5lbnRpdGllcy5qb2luKCcsJykgKyAnKSc7XG5cdFx0fVxuXHR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdHJpeDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENvbXBvbmVudDogcmVxdWlyZSgnLi9Db21wb25lbnQnKSxcbiAgICBET01Db21wb25lbnQ6IHJlcXVpcmUoJy4vRE9NQ29tcG9uZW50JyksXG4gICAgTWF0cml4OiByZXF1aXJlKCcuL01hdHJpeCcpXG59O1xuIiwiXG52YXIgRW5naW5lID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMudGltZSA9IDA7XG4gICAgdGhpcy5fd29ya2VyID0gbnVsbDtcbiAgICB0aGlzLnVwZGF0ZVF1ZXVlID0gW107XG5cbn1cblxuRW5naW5lLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24od29ya2VyKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbiAgICBpZih3b3JrZXIpe1xuICAgICAgICB0aGlzLl93b3JrZXIgPSB3b3JrZXI7XG4gICAgfVxuICAgIGlmKHdvcmtlci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnV29ya2VyJyl7XG4gICAgICAgIHRoaXMuX3dvcmtlci5wb3N0TWVzc2FnZSh7aW5pdDonZG9uZSd9KTtcbiAgICB9XG59XG5cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKHRpbWUpe1xuXG4gICAgdmFyIGl0ZW07XG4gICAgdGhpcy50aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZih0aGlzLl93b3JrZXIuY29uc3RydWN0b3IubmFtZSA9PT0gJ1dvcmtlcicpe1xuICAgICAgdGhpcy5fd29ya2VyLnBvc3RNZXNzYWdlKHtmcmFtZTp0aGlzLnRpbWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd29ya2VyLnRpY2sodGltZSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHRoaXMudXBkYXRlUXVldWUubGVuZ3RoKSB7XG4gICAgICBpdGVtID0gdGhpcy51cGRhdGVRdWV1ZS5zaGlmdCgpO1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbS51cGRhdGUpIGl0ZW0udXBkYXRlKHRoaXMudGltZSk7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtLm9uVXBkYXRlKSBpdGVtLm9uVXBkYXRlKHRoaXMudGltZSk7XG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFbmdpbmUoKTtcbiIsIi8vIE5vZGUgaGFuZGxlcyBzdG9yaW5nIHRoZSBzdGF0ZSBvZiBhIG5vZGUgb24gdGhlIFNjZW5lIEdyYXBoLlxudmFyIFRyYW5zaXRpb25hYmxlID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGUnKTtcbnZhciBDdXJ2ZXMgPSByZXF1aXJlKCcuLi90cmFuc2l0aW9ucy9DdXJ2ZXMnKTtcblxudmFyIF9vYnNlcnZhYmxlQ2FsbGJhY2sgPSB7fTtcblxudmFyIE5vZGUgPSBmdW5jdGlvbihjb25mLCBwYXJlbnQpe1xuXG4gICAgdGhpcy50cmFuc2l0aW9uYWJsZXMgPSB7fTtcblxuICAgIGlmKGNvbmYpe1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZShjb25mKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERlZmF1bHRzKCk7XG4gICAgfVxuICAgIHBhcmVudCA/IHRoaXMucGFyZW50ID0gcGFyZW50IDogdGhpcy5wYXJlbnQgPSBudWxsO1xuXG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXREZWZhdWx0cyA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIHRoaXMucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMudHJhbnNsYXRlID0gbnVsbDtcbiAgICB0aGlzLm9yaWdpbiA9IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5hbGlnbiA9IG51bGw7XG4gICAgdGhpcy5zaXplID0gWzAsMCwwXTtcbiAgICB0aGlzLnNjYWxlID0gWzEuMCwxLjAsMS4wXTtcbiAgICB0aGlzLnJvdGF0ZSA9IFswLDAsMF07XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMudHJhbnNmb3JtID0gbnVsbDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIHRoaXMuaWQgPSBjb25mLmlkID8gY29uZi5pZCA6IG51bGw7XG4gICAgdGhpcy5wb3NpdGlvbiA9IGNvbmYucG9zaXRpb24gPyBjb25mLnBvc2l0aW9uIDogJ2Fic29sdXRlJztcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IGNvbmYudHJhbnNsYXRlID8gY29uZi50cmFuc2xhdGUgOiBudWxsO1xuICAgIHRoaXMub3JpZ2luID0gY29uZi5vcmlnaW4gPyBjb25mLm9yaWdpbiA6IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5hbGlnbiA9IGNvbmYuYWxpZ24gPyBjb25mLmFsaWduIDogbnVsbDtcbiAgICB0aGlzLnNpemUgPSBjb25mLnNpemUgPyBjb25mLnNpemUgOiBbMCwwLDBdO1xuICAgIHRoaXMuc2NhbGUgPSBjb25mLnNjYWxlID8gY29uZi5zY2FsZSA6IFsxLjAsMS4wLDEuMF07XG4gICAgdGhpcy5yb3RhdGUgPSBjb25mLnJvdGF0ZSA/IGNvbmYucm90YXRlIDogWzAsMCwwXTtcbiAgICB0aGlzLm9wYWNpdHkgPSBjb25mLm9wYWNpdHkgPyBjb25mLm9wYWNpdHkgOiAxLjA7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSBjb25mLnRyYW5zZm9ybSA/IGNvbmYudHJhbnNmb3JtIDogbnVsbDtcbiAgICB0aGlzLm9ic2VydmUodGhpcy5pZCwgdGhpcyk7XG4gICAgY29uZi50cmFuc2l0aW9uID8gdGhpcy5zZXRUcmFuc2l0aW9uYWJsZShjb25mLnRyYW5zaXRpb24pIDogZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgYWxpZ246IHRoaXMuYWxpZ24sXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZSxcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgIHJvdGF0ZTogdGhpcy5yb3RhdGUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMub3BhY2l0eSxcbiAgICAgICAgdHJhbnNpdGlvbmFibGVzOiB0aGlzLnRyYW5zaXRpb25hYmxlcy8vLFxuICAgICAgICAvL29ic2VydmFibGVzOiB0aGlzLm9ic2VydmFibGVzXG4gICAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbihwb3Mpe1xuICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHBvcyl7XG4gICAgdGhpcy50cmFuc2xhdGUgPSBwb3M7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHNpemUpe1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5zaXplO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0U2NhbGUgPSBmdW5jdGlvbihzY2FsZSl7XG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0U2NhbGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnNjYWxlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0T3JpZ2luID0gZnVuY3Rpb24ob3JpZ2luKXtcbiAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMub3JpZ2luO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0QWxpZ24gPSBmdW5jdGlvbihhbGlnbil7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0QWxpZ24gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLmFsaWduO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0Um90YXRpb24gPSBmdW5jdGlvbihyb3RhdGlvbil7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0Um90YXRpb24gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnJvdGF0aW9uO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0T3BhY2l0eSA9IGZ1bmN0aW9uKG9wYWNpdHkpe1xuICAgIHRoaXMub3BhY2l0eSA9IG9wYWNpdHk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5O1xufTtcblxuTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uKGNvbmYpIHtcbiAgdGhpcy5zZXRUcmFuc2l0aW9uYWJsZShjb25mKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldFRyYW5zaXRpb25hYmxlID0gZnVuY3Rpb24oY29uZil7XG4gICAgdmFyIG4gID0gdGhpcztcblxuICAgIG4udHJhbnNpdGlvbmFibGVzW2NvbmYua2V5XSA9IGNvbmY7XG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi5rZXldLnRyYW5zaXRpb24gPSBuZXcgVHJhbnNpdGlvbmFibGUoY29uZi5mcm9tKTtcbiAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLmtleV0udHJhbnNpdGlvbi5zZXQoY29uZi50byk7XG4gICAgLy9uLnRyYW5zaXRpb25hYmxlc1tjb25mLmtleV0udHJhbnNpdGlvbi5zZXQoY29uZi50byk7XG4gICAgaWYoY29uZi5kZWxheSkge1xuICAgICAgbi50cmFuc2l0KGNvbmYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLmtleV1cbiAgICAgICAudHJhbnNpdGlvblxuICAgICAgIC5mcm9tKGNvbmYuZnJvbSlcbiAgICAgICAudG8oY29uZi50bywgY29uZi5jdXJ2ZSwgY29uZi5kdXJhdGlvbik7XG4gICAgfVxuXG4gICAgdGhpc1tjb25mLmtleV0gPSBjb25mLnRvO1xuXG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi5rZXldLnRyYW5zaXRpb24uaWQgPSB0aGlzLmlkO1xuICAgIG4udHJhbnNpdGlvbmFibGVzW2NvbmYua2V5XS50cmFuc2l0aW9uLnBhcmFtID0gY29uZi5rZXk7XG4gICAgdGhpcy5vYnNlcnZlKGNvbmYua2V5LCBuLnRyYW5zaXRpb25hYmxlc1tjb25mLmtleV0udHJhbnNpdGlvbi5nZXQoKSwgY29uZik7XG5cbiAgICAvL1RPRE86IGZpZ3VyZSBvdXQgYSBiZXR0ZXIgd2F5IHRvIHVwZGF0ZSBUcmFuc2l0aW9uYWJsZVxuICAgIC8vVE9ETzogdW5vYnNlcnZlIG9iamVjdCwgY2xlYXJJbmVydmFsXG5cblxufTtcblxuTm9kZS5wcm90b3R5cGUudHJhbnNpdCA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIHZhciBuICA9IHRoaXM7XG4gICAgaWYoY29uZi5kZWxheSkge1xuXG4gICAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLmtleV0udHJhbnNpdGlvbi5mcm9tKGNvbmYuZnJvbSkuZGVsYXkoY29uZi5kZWxheSkudG8oY29uZi50bywgY29uZi5jdXJ2ZSwgY29uZi5kdXJhdGlvbik7XG4gICAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKGlkLCBvYmosIGNvbmYpIHtcbiAgICAgIHZhciBuID0gdGhpcztcblxuICAgICAgX29ic2VydmFibGVDYWxsYmFja1tpZF0gPSBmdW5jdGlvbihjaGFuZ2VzKXtcbiAgICAgICAgICBjaGFuZ2VzLmZvckVhY2goZnVuY3Rpb24oY2hhbmdlKSB7XG4gICAgICAgICAgICBpZihjaGFuZ2UudHlwZSA9PT0gJ3VwZGF0ZScgJiYgY2hhbmdlLm5hbWUgIT09ICdpZCcpIHtcblxuICAgICAgICAgICAgICBpZihjaGFuZ2Uub2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBcnJheScpe1xuXG4gICAgICAgICAgICAgICAgbi5wYXJlbnQudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBjaGFuZ2Uub2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbi5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYoY2hhbmdlLm9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnVHJhbnNpdGlvbmFibGUnKXtcbiAgICAgICAgICAgICAgICBuW2NoYW5nZS5vYmplY3QucGFyYW1dID0gY2hhbmdlLm9sZFZhbHVlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4ucGFyZW50LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcDogY2hhbmdlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbDogY2hhbmdlLm9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogbi5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIE9iamVjdC5vYnNlcnZlKG9iaiwgX29ic2VydmFibGVDYWxsYmFja1tpZF0pO1xuXG59O1xuXG5Ob2RlLnByb3RvdHlwZS51bm9ic2VydmUgPSBmdW5jdGlvbihwYXJhbSkge1xuICAgIE9iamVjdC51bm9ic2VydmUodGhpcywgX29ic2VydmFibGVDYWxsYmFja1t0aGlzLmlkXSk7XG59O1xuXG5cbk5vZGUucHJvdG90eXBlLmV2ZW50TWFuYWdlciA9IGZ1bmN0aW9uKCl7XG5cbiAgdmFyIGV2ZW50cyA9IHt9O1xuICB2YXIgaGFzRXZlbnQgPSBldmVudHMuaGFzT3duUHJvcGVydHk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdWI6IGZ1bmN0aW9uKGV2LCBsaXN0ZW5lcikge1xuXG4gICAgICB0aGlzLm9ic2VydmUoZXYsIHRoaXMpO1xuICAgICAgLy8gQ3JlYXRlIHRoZSBldmVudCdzIG9iamVjdCBpZiBub3QgeWV0IGNyZWF0ZWRcbiAgICAgIGlmKCFoYXNFdmVudC5jYWxsKGV2ZW50cywgZXYpKSBldmVudHNbZXZdID0gW107XG5cbiAgICAgIC8vIEFkZCB0aGUgbGlzdGVuZXIgdG8gcXVldWVcbiAgICAgIHZhciBpbmRleCA9IGV2ZW50c1tldl0ucHVzaChsaXN0ZW5lcikgLSAxO1xuXG4gICAgICAvLyBQcm92aWRlIGhhbmRsZSBiYWNrIGZvciByZW1vdmFsIG9mIHRvcGljXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMudW5vYnNlcnZlKGV2KTtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW2V2XVtpbmRleF07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBwdWI6IGZ1bmN0aW9uKGV2LCBpbmZvKSB7XG4gICAgICAvLyBJZiB0aGUgZXZlbnQgZG9lc24ndCBleGlzdCwgb3IgdGhlcmUncyBubyBsaXN0ZW5lcnMgaW4gcXVldWUsIGp1c3QgbGVhdmVcbiAgICAgIGlmKCFoYXNFdmVudC5jYWxsKGV2ZW50cywgZXYpKSByZXR1cm47XG5cbiAgICAgIC8vIEN5Y2xlIHRocm91Z2ggZXZlbnRzIHF1ZXVlLCBmaXJlIVxuICAgICAgZXZlbnRzW2V2XS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIFx0XHRpdGVtKGluZm8gIT0gdW5kZWZpbmVkID8gaW5mbyA6IHt9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGZyYW1lKXtcbiAgZm9yKHZhciBpZCBpbiB0aGlzLnRyYW5zaXRpb25hYmxlcykge1xuICAgIHRoaXMudHJhbnNpdGlvbmFibGVzW2lkXS50cmFuc2l0aW9uLmdldCgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGU7XG4iLCJ2YXIgY3h0ID0gc2VsZjtcblxudmFyIFNjZW5lID0gZnVuY3Rpb24oZ3JhcGgpe1xuXG4gICAgdGhpcy5ncmFwaCA9IGdyYXBoIHx8IHt9O1xuICAgIHRoaXMubGVuZ3RoID0gMDtcblxufVxuXG5TY2VuZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHdvcmtlcikge1xuICAgIGlmKHdvcmtlcil7XG4gICAgICAgIHRoaXMud29ya2VyID0gd29ya2VyO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLndvcmtlcik7XG59XG5cblNjZW5lLnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIG5vZGUuaWQgPSBub2RlLmlkIHx8ICdub2RlLScrdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5sZW5ndGgrKztcbiAgICB0aGlzLmdyYXBoW25vZGUuaWRdID0gbm9kZTtcbn1cblxuXG5TY2VuZS5wcm90b3R5cGUuZmV0Y2hOb2RlID0gZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFwaFtpZF07XG59XG5cblNjZW5lLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24ocXVlcnkpIHtcbiAgICB2YXIgcXVlcnlBcnJheSA9IFtdO1xuICAgIGZvcihxIGluIHF1ZXJ5KXtcbiAgICAgICAgZm9yKHByb3AgaW4gdGhpcy5ncmFwaCkge1xuICAgICAgICAgICAgZm9yKHAgaW4gdGhpcy5ncmFwaFtwcm9wXSl7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT09IHEgJiYgdGhpcy5ncmFwaFtwcm9wXVtwXSA9PT0gcXVlcnlbcV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcXVlcnlBcnJheS5wdXNoKHRoaXMuZ3JhcGhbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcnJheTtcbn1cblxuU2NlbmUucHJvdG90eXBlLmZpbmRPbmUgPSBmdW5jdGlvbihxdWVyeSkge1xuXG4gICAgZm9yKHEgaW4gcXVlcnkpe1xuICAgICAgICBmb3IocHJvcCBpbiB0aGlzLmdyYXBoKSB7XG4gICAgICAgICAgICBmb3IocCBpbiB0aGlzLmdyYXBoW3Byb3BdKXtcbiAgICAgICAgICAgICAgICBpZiAocCA9PT0gcSAmJiB0aGlzLmdyYXBoW3Byb3BdW3BdID09PSBxdWVyeVtxXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncmFwaFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuU2NlbmUucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbihmcmFtZSl7XG4gIGZvcih2YXIgbm9kZSBpbiB0aGlzLmdyYXBoKSB7XG4gICAgdGhpcy5ncmFwaFtub2RlXS51cGRhdGUoZnJhbWUpO1xuICB9XG59XG5cblNjZW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihjaGFuZ2Upe1xuICAvLyBpZihjeHQuY29uc3RydWN0b3IubmFtZSA9PT0gJ0RlZGljYXRlZFdvcmtlckdsb2JhbFNjb3BlJykge1xuICAvLyAgIGN4dC5wb3N0TWVzc2FnZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNoYW5nZSkpKTtcbiAgLy8gfSBlbHNlIHtcbiAgICB0aGlzLm9ubWVzc2FnZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNoYW5nZSkpKTtcbiAgLy8gfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTY2VuZSgpO1xuIiwiLypcbiAgVGVzdGVkIGFnYWluc3QgQ2hyb21pdW0gYnVpbGQgd2l0aCBPYmplY3Qub2JzZXJ2ZSBhbmQgYWN0cyBFWEFDVExZIHRoZSBzYW1lLFxuICB0aG91Z2ggQ2hyb21pdW0gYnVpbGQgaXMgTVVDSCBmYXN0ZXJcblxuICBUcnlpbmcgdG8gc3RheSBhcyBjbG9zZSB0byB0aGUgc3BlYyBhcyBwb3NzaWJsZSxcbiAgdGhpcyBpcyBhIHdvcmsgaW4gcHJvZ3Jlc3MsIGZlZWwgZnJlZSB0byBjb21tZW50L3VwZGF0ZVxuXG4gIFNwZWNpZmljYXRpb246XG4gICAgaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpvYnNlcnZlXG5cbiAgQnVpbHQgdXNpbmcgcGFydHMgb2Y6XG4gICAgaHR0cHM6Ly9naXRodWIuY29tL3R2Y3V0c2VtL2hhcm1vbnktcmVmbGVjdC9ibG9iL21hc3Rlci9leGFtcGxlcy9vYnNlcnZlci5qc1xuXG4gIExpbWl0cyBzbyBmYXI7XG4gICAgQnVpbHQgdXNpbmcgcG9sbGluZy4uLiBXaWxsIHVwZGF0ZSBhZ2FpbiB3aXRoIHBvbGxpbmcvZ2V0dGVyJnNldHRlcnMgdG8gbWFrZSB0aGluZ3MgYmV0dGVyIGF0IHNvbWUgcG9pbnRcblxuVE9ETzpcbiAgQWRkIHN1cHBvcnQgZm9yIE9iamVjdC5wcm90b3R5cGUud2F0Y2ggLT4gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L3dhdGNoXG4qL1xuaWYoIU9iamVjdC5vYnNlcnZlKXtcbiAgKGZ1bmN0aW9uKGV4dGVuZCwgZ2xvYmFsKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgaXNDYWxsYWJsZSA9IChmdW5jdGlvbih0b1N0cmluZyl7XG4gICAgICAgIHZhciBzID0gdG9TdHJpbmcuY2FsbCh0b1N0cmluZyksXG4gICAgICAgICAgICB1ID0gdHlwZW9mIHU7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZ2xvYmFsLmFsZXJ0ID09PSBcIm9iamVjdFwiID9cbiAgICAgICAgICBmdW5jdGlvbiBpc0NhbGxhYmxlKGYpe1xuICAgICAgICAgICAgcmV0dXJuIHMgPT09IHRvU3RyaW5nLmNhbGwoZikgfHwgKCEhZiAmJiB0eXBlb2YgZi50b1N0cmluZyA9PSB1ICYmIHR5cGVvZiBmLnZhbHVlT2YgPT0gdSAmJiAvXlxccypcXGJmdW5jdGlvblxcYi8udGVzdChcIlwiICsgZikpO1xuICAgICAgICAgIH06XG4gICAgICAgICAgZnVuY3Rpb24gaXNDYWxsYWJsZShmKXtcbiAgICAgICAgICAgIHJldHVybiBzID09PSB0b1N0cmluZy5jYWxsKGYpO1xuICAgICAgICAgIH1cbiAgICAgICAgO1xuICAgIH0pKGV4dGVuZC5wcm90b3R5cGUudG9TdHJpbmcpO1xuICAgIC8vIGlzTm9kZSAmIGlzRWxlbWVudCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzg0Mjg2L2phdmFzY3JpcHQtaXNkb20taG93LWRvLXlvdS1jaGVjay1pZi1hLWphdmFzY3JpcHQtb2JqZWN0LWlzLWEtZG9tLW9iamVjdFxuICAgIC8vUmV0dXJucyB0cnVlIGlmIGl0IGlzIGEgRE9NIG5vZGVcbiAgICB2YXIgaXNOb2RlID0gZnVuY3Rpb24gaXNOb2RlKG8pe1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdHlwZW9mIE5vZGUgPT09IFwib2JqZWN0XCIgPyBvIGluc3RhbmNlb2YgTm9kZSA6XG4gICAgICAgIG8gJiYgdHlwZW9mIG8gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG8ubm9kZVR5cGUgPT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIG8ubm9kZU5hbWU9PT1cInN0cmluZ1wiXG4gICAgICApO1xuICAgIH1cbiAgICAvL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBlbGVtZW50XG4gICAgdmFyIGlzRWxlbWVudCA9IGZ1bmN0aW9uIGlzRWxlbWVudChvKXtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gXCJvYmplY3RcIiA/IG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA6IC8vRE9NMlxuICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZT09PVwic3RyaW5nXCJcbiAgICApO1xuICAgIH1cbiAgICB2YXIgX2lzSW1tZWRpYXRlU3VwcG9ydGVkID0gKGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gISFnbG9iYWwuc2V0SW1tZWRpYXRlO1xuICAgIH0pKCk7XG4gICAgdmFyIF9kb0NoZWNrQ2FsbGJhY2sgPSAoZnVuY3Rpb24oKXtcbiAgICAgIGlmKF9pc0ltbWVkaWF0ZVN1cHBvcnRlZCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfZG9DaGVja0NhbGxiYWNrKGYpe1xuICAgICAgICAgIHJldHVybiBzZXRJbW1lZGlhdGUoZik7XG4gICAgICAgIH07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9kb0NoZWNrQ2FsbGJhY2soZil7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZiwgMTApO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdmFyIF9jbGVhckNoZWNrQ2FsbGJhY2sgPSAoZnVuY3Rpb24oKXtcbiAgICAgIGlmKF9pc0ltbWVkaWF0ZVN1cHBvcnRlZCl7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfY2xlYXJDaGVja0NhbGxiYWNrKGlkKXtcbiAgICAgICAgICBjbGVhckltbWVkaWF0ZShpZCk7XG4gICAgICAgIH07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9jbGVhckNoZWNrQ2FsbGJhY2soaWQpe1xuICAgICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSkoKTtcbiAgICB2YXIgaXNOdW1lcmljPWZ1bmN0aW9uIGlzTnVtZXJpYyhuKXtcbiAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfTtcbiAgICB2YXIgc2FtZVZhbHVlID0gZnVuY3Rpb24gc2FtZVZhbHVlKHgsIHkpe1xuICAgICAgaWYoeD09PXkpe1xuICAgICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgICB9XG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH07XG4gICAgdmFyIGlzQWNjZXNzb3JEZXNjcmlwdG9yID0gZnVuY3Rpb24gaXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzYyl7XG4gICAgICBpZiAodHlwZW9mKGRlc2MpID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoJ2dldCcgaW4gZGVzYyB8fCAnc2V0JyBpbiBkZXNjKTtcbiAgICB9O1xuICAgIHZhciBpc0RhdGFEZXNjcmlwdG9yID0gZnVuY3Rpb24gaXNEYXRhRGVzY3JpcHRvcihkZXNjKXtcbiAgICAgIGlmICh0eXBlb2YoZGVzYykgPT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuICgndmFsdWUnIGluIGRlc2MgfHwgJ3dyaXRhYmxlJyBpbiBkZXNjKTtcbiAgICB9O1xuXG4gICAgdmFyIHZhbGlkYXRlQXJndW1lbnRzID0gZnVuY3Rpb24gdmFsaWRhdGVBcmd1bWVudHMoTywgY2FsbGJhY2ssIGFjY2VwdCl7XG4gICAgICBpZih0eXBlb2YoTykhPT0nb2JqZWN0Jyl7XG4gICAgICAgIC8vIFRocm93IEVycm9yXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qub2JzZXJ2ZU9iamVjdCBjYWxsZWQgb24gbm9uLW9iamVjdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmKGlzQ2FsbGFibGUoY2FsbGJhY2spPT09ZmFsc2Upe1xuICAgICAgICAvLyBUaHJvdyBFcnJvclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0Lm9ic2VydmVPYmplY3Q6IEV4cGVjdGluZyBmdW5jdGlvblwiKTtcbiAgICAgIH1cbiAgICAgIGlmKE9iamVjdC5pc0Zyb3plbihjYWxsYmFjayk9PT10cnVlKXtcbiAgICAgICAgLy8gVGhyb3cgRXJyb3JcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5vYnNlcnZlT2JqZWN0OiBFeHBlY3RpbmcgdW5mcm96ZW4gZnVuY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZiAoYWNjZXB0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0Lm9ic2VydmVPYmplY3Q6IEV4cGVjdGluZyBhY2NlcHRMaXN0IGluIHRoZSBmb3JtIG9mIGFuIGFycmF5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBPYnNlcnZlciA9IChmdW5jdGlvbiBPYnNlcnZlcigpe1xuICAgICAgdmFyIHdyYXBlZCA9IFtdO1xuICAgICAgdmFyIE9ic2VydmVyID0gZnVuY3Rpb24gT2JzZXJ2ZXIoTywgY2FsbGJhY2ssIGFjY2VwdCl7XG4gICAgICAgIHZhbGlkYXRlQXJndW1lbnRzKE8sIGNhbGxiYWNrLCBhY2NlcHQpO1xuICAgICAgICBpZiAoIWFjY2VwdCkge1xuICAgICAgICAgIGFjY2VwdCA9IFtcImFkZFwiLCBcInVwZGF0ZVwiLCBcImRlbGV0ZVwiLCBcInJlY29uZmlndXJlXCIsIFwic2V0UHJvdG90eXBlXCIsIFwicHJldmVudEV4dGVuc2lvbnNcIl07XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmdldE5vdGlmaWVyKE8pLmFkZExpc3RlbmVyKGNhbGxiYWNrLCBhY2NlcHQpO1xuICAgICAgICBpZih3cmFwZWQuaW5kZXhPZihPKT09PS0xKXtcbiAgICAgICAgICB3cmFwZWQucHVzaChPKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgT2JqZWN0LmdldE5vdGlmaWVyKE8pLl9jaGVja1Byb3BlcnR5TGlzdGluZygpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBPYnNlcnZlci5wcm90b3R5cGUuZGVsaXZlckNoYW5nZVJlY29yZHMgPSBmdW5jdGlvbiBPYnNlcnZlcl9kZWxpdmVyQ2hhbmdlUmVjb3JkcyhPKXtcbiAgICAgICAgT2JqZWN0LmdldE5vdGlmaWVyKE8pLmRlbGl2ZXJDaGFuZ2VSZWNvcmRzKCk7XG4gICAgICB9O1xuXG4gICAgICB3cmFwZWQubGFzdFNjYW5uZWQgPSAwO1xuICAgICAgdmFyIGYgPSAoZnVuY3Rpb24gZih3cmFwcGVkKXtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9mKCl7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBsID0gd3JhcHBlZC5sZW5ndGgsIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCksIHRha2luZ1Rvb0xvbmc9ZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yKGk9d3JhcHBlZC5sYXN0U2Nhbm5lZDsgKGk8bCkmJighdGFraW5nVG9vTG9uZyk7IGkrKyl7XG4gICAgICAgICAgICAgICAgICBpZihfaW5kZXhlcy5pbmRleE9mKHdyYXBwZWRbaV0pID4gLTEpe1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZ2V0Tm90aWZpZXIod3JhcHBlZFtpXSkuX2NoZWNrUHJvcGVydHlMaXN0aW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHRha2luZ1Rvb0xvbmc9KChuZXcgRGF0ZSgpKS1zdGFydFRpbWUpPjEwMDsgLy8gbWFrZSBzdXJlIHdlIGRvbid0IHRha2UgbW9yZSB0aGFuIDEwMCBtaWxsaXNlY29uZHMgdG8gc2NhbiBhbGwgb2JqZWN0c1xuICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZWQuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgIGwtLTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd3JhcHBlZC5sYXN0U2Nhbm5lZD1pPGw/aTowOyAvLyByZXNldCB3cmFwcGVkIHNvIHdlIGNhbiBtYWtlIHN1cmUgdGhhdCB3ZSBwaWNrIHRoaW5ncyBiYWNrIHVwXG4gICAgICAgICAgICAgICAgX2RvQ2hlY2tDYWxsYmFjayhfZik7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSh3cmFwZWQpO1xuICAgICAgX2RvQ2hlY2tDYWxsYmFjayhmKTtcbiAgICAgIHJldHVybiBPYnNlcnZlcjtcbiAgICB9KSgpO1xuXG4gICAgdmFyIE5vdGlmaWVyID0gZnVuY3Rpb24gTm90aWZpZXIod2F0Y2hpbmcpe1xuICAgIHZhciBfbGlzdGVuZXJzID0gW10sIF9hY2NlcHRMaXN0cyA9IFtdLCBfdXBkYXRlcyA9IFtdLCBfdXBkYXRlciA9IGZhbHNlLCBwcm9wZXJ0aWVzID0gW10sIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsICdfd2F0Y2hpbmcnLCB7XG4gICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgZ2V0OiAoZnVuY3Rpb24od2F0Y2hlZCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3YXRjaGVkO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSkod2F0Y2hpbmcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICB2YXIgd3JhcFByb3BlcnR5ID0gZnVuY3Rpb24gd3JhcFByb3BlcnR5KG9iamVjdCwgcHJvcCl7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZihvYmplY3RbcHJvcF0pLCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3ApO1xuICAgICAgICBpZigocHJvcD09PSdnZXROb3RpZmllcicpfHxpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjcmlwdG9yKXx8KCFkZXNjcmlwdG9yLmVudW1lcmFibGUpKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYoKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSYmaXNOdW1lcmljKHByb3ApKXtcbiAgICAgICAgICB2YXIgaWR4ID0gcHJvcGVydGllcy5sZW5ndGg7XG4gICAgICAgICAgcHJvcGVydGllc1tpZHhdID0gcHJvcDtcbiAgICAgICAgICB2YWx1ZXNbaWR4XSA9IG9iamVjdFtwcm9wXTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAoZnVuY3Rpb24oaWR4LCBwcm9wKXtcbiAgICAgICAgICBwcm9wZXJ0aWVzW2lkeF0gPSBwcm9wO1xuICAgICAgICAgIHZhbHVlc1tpZHhdID0gb2JqZWN0W3Byb3BdO1xuICAgICAgICAgIGZ1bmN0aW9uIGdldHRlcigpe1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1tnZXR0ZXIuaW5mby5pZHhdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmdW5jdGlvbiBzZXR0ZXIodmFsdWUpe1xuICAgICAgICAgICAgaWYoIXNhbWVWYWx1ZSh2YWx1ZXNbc2V0dGVyLmluZm8uaWR4XSwgdmFsdWUpKXtcbiAgICAgICAgICAgICAgT2JqZWN0LmdldE5vdGlmaWVyKG9iamVjdCkucXVldWVVcGRhdGUob2JqZWN0LCBwcm9wLCAndXBkYXRlJywgdmFsdWVzW3NldHRlci5pbmZvLmlkeF0pO1xuICAgICAgICAgICAgICB2YWx1ZXNbc2V0dGVyLmluZm8uaWR4XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBnZXR0ZXIuaW5mbyA9IHNldHRlci5pbmZvID0ge1xuICAgICAgICAgICAgaWR4OiBpZHhcbiAgICAgICAgICB9O1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3AsIHtcbiAgICAgICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICAgICAgc2V0OiBzZXR0ZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkocHJvcGVydGllcy5sZW5ndGgsIHByb3ApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG4gICAgICBzZWxmLl9jaGVja1Byb3BlcnR5TGlzdGluZyA9IGZ1bmN0aW9uIF9jaGVja1Byb3BlcnR5TGlzdGluZyhkb250UXVldWVVcGRhdGVzKXtcbiAgICAgICAgdmFyIG9iamVjdCA9IHNlbGYuX3dhdGNoaW5nLCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KSwgaT0wLCBsPWtleXMubGVuZ3RoO1xuICAgICAgICB2YXIgbmV3S2V5cyA9IFtdLCBvbGRLZXlzID0gcHJvcGVydGllcy5zbGljZSgwKSwgdXBkYXRlcyA9IFtdO1xuICAgICAgICB2YXIgcHJvcCwgcXVldWVVcGRhdGVzID0gIWRvbnRRdWV1ZVVwZGF0ZXMsIHByb3BUeXBlLCB2YWx1ZSwgaWR4LCBhTGVuZ3RoO1xuXG4gICAgICAgIGlmKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KXtcbiAgICAgICAgICBhTGVuZ3RoID0gc2VsZi5fb2xkTGVuZ3RoOy8vb2JqZWN0Lmxlbmd0aDtcbiAgICAgICAgICAvL2FMZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGk9MDsgaTxsOyBpKyspe1xuICAgICAgICAgIHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgIHZhbHVlID0gb2JqZWN0W3Byb3BdO1xuICAgICAgICAgIHByb3BUeXBlID0gdHlwZW9mKHZhbHVlKTtcbiAgICAgICAgICBpZigoaWR4ID0gcHJvcGVydGllcy5pbmRleE9mKHByb3ApKT09PS0xKXtcbiAgICAgICAgICAgIGlmKHdyYXBQcm9wZXJ0eShvYmplY3QsIHByb3ApJiZxdWV1ZVVwZGF0ZXMpe1xuICAgICAgICAgICAgICBzZWxmLnF1ZXVlVXBkYXRlKG9iamVjdCwgcHJvcCwgJ2FkZCcsIG51bGwsIG9iamVjdFtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZighKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5KXx8KGlzTnVtZXJpYyhwcm9wKSkpe1xuICAgICAgICAgICAgICBpZih2YWx1ZXNbaWR4XSAhPT0gdmFsdWUpe1xuICAgICAgICAgICAgICAgIGlmKHF1ZXVlVXBkYXRlcyl7XG4gICAgICAgICAgICAgICAgICBzZWxmLnF1ZXVlVXBkYXRlKG9iamVjdCwgcHJvcCwgJ3VwZGF0ZScsIHZhbHVlc1tpZHhdLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlc1tpZHhdID0gdmFsdWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9sZEtleXMuc3BsaWNlKG9sZEtleXMuaW5kZXhPZihwcm9wKSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYob2JqZWN0IGluc3RhbmNlb2YgQXJyYXkgJiYgb2JqZWN0Lmxlbmd0aCAhPT0gYUxlbmd0aCl7XG4gICAgICAgICAgaWYocXVldWVVcGRhdGVzKXtcbiAgICAgICAgICAgIHNlbGYucXVldWVVcGRhdGUob2JqZWN0LCAnbGVuZ3RoJywgJ3VwZGF0ZScsIGFMZW5ndGgsIG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYuX29sZExlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZihxdWV1ZVVwZGF0ZXMpe1xuICAgICAgICAgIGwgPSBvbGRLZXlzLmxlbmd0aDtcbiAgICAgICAgICBmb3IoaT0wOyBpPGw7IGkrKyl7XG4gICAgICAgICAgICBpZHggPSBwcm9wZXJ0aWVzLmluZGV4T2Yob2xkS2V5c1tpXSk7XG4gICAgICAgICAgICBzZWxmLnF1ZXVlVXBkYXRlKG9iamVjdCwgb2xkS2V5c1tpXSwgJ2RlbGV0ZScsIHZhbHVlc1tpZHhdKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuc3BsaWNlKGlkeCwxKTtcbiAgICAgICAgICAgIHZhbHVlcy5zcGxpY2UoaWR4LDEpO1xuICAgICAgICAgICAgZm9yKHZhciBpPWlkeDtpPHByb3BlcnRpZXMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgIGlmKCEocHJvcGVydGllc1tpXSBpbiBvYmplY3QpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QscHJvcGVydGllc1tpXSkuZ2V0O1xuICAgICAgICAgICAgICBpZighZ2V0dGVyKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB2YXIgaW5mbyA9IGdldHRlci5pbmZvO1xuICAgICAgICAgICAgICBpbmZvLmlkeCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNlbGYuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBOb3RpZmllcl9hZGRMaXN0ZW5lcihjYWxsYmFjaywgYWNjZXB0KXtcbiAgICAgICAgdmFyIGlkeCA9IF9saXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgIGlmKGlkeD09PS0xKXtcbiAgICAgICAgICBfbGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgIF9hY2NlcHRMaXN0cy5wdXNoKGFjY2VwdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgX2FjY2VwdExpc3RzW2lkeF0gPSBhY2NlcHQ7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gTm90aWZpZXJfcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2spe1xuICAgICAgICB2YXIgaWR4ID0gX2xpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgaWYoaWR4Pi0xKXtcbiAgICAgICAgICBfbGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgIF9hY2NlcHRMaXN0cy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNlbGYubGlzdGVuZXJzID0gZnVuY3Rpb24gTm90aWZpZXJfbGlzdGVuZXJzKCl7XG4gICAgICAgIHJldHVybiBfbGlzdGVuZXJzO1xuICAgICAgfTtcbiAgICAgIHNlbGYucXVldWVVcGRhdGUgPSBmdW5jdGlvbiBOb3RpZmllcl9xdWV1ZVVwZGF0ZSh3aGF0LCBwcm9wLCB0eXBlLCB3YXMpe1xuICAgICAgICB0aGlzLnF1ZXVlVXBkYXRlcyhbe1xuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgb2JqZWN0OiB3aGF0LFxuICAgICAgICAgIG5hbWU6IHByb3AsXG4gICAgICAgICAgb2xkVmFsdWU6IHdhc1xuICAgICAgICB9XSk7XG4gICAgICB9O1xuICAgICAgc2VsZi5xdWV1ZVVwZGF0ZXMgPSBmdW5jdGlvbiBOb3RpZmllcl9xdWV1ZVVwZGF0ZXModXBkYXRlcyl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgaSA9IDAsIGwgPSB1cGRhdGVzLmxlbmd0aHx8MCwgdXBkYXRlO1xuICAgICAgICBmb3IoaT0wOyBpPGw7IGkrKyl7XG4gICAgICAgICAgdXBkYXRlID0gdXBkYXRlc1tpXTtcbiAgICAgICAgICBfdXBkYXRlcy5wdXNoKHVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoX3VwZGF0ZXIpe1xuICAgICAgICAgIF9jbGVhckNoZWNrQ2FsbGJhY2soX3VwZGF0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIF91cGRhdGVyID0gX2RvQ2hlY2tDYWxsYmFjayhmdW5jdGlvbigpe1xuICAgICAgICAgIF91cGRhdGVyID0gZmFsc2U7XG4gICAgICAgICAgc2VsZi5kZWxpdmVyQ2hhbmdlUmVjb3JkcygpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBzZWxmLmRlbGl2ZXJDaGFuZ2VSZWNvcmRzID0gZnVuY3Rpb24gTm90aWZpZXJfZGVsaXZlckNoYW5nZVJlY29yZHMoKXtcbiAgICAgICAgdmFyIGkgPSAwLCBsID0gX2xpc3RlbmVycy5sZW5ndGgsXG4gICAgICAgICAgICAvL2tlZXBSdW5uaW5nID0gdHJ1ZSwgcmVtb3ZlZCBhcyBpdCBzZWVtcyB0aGUgYWN0dWFsIGltcGxlbWVudGF0aW9uIGRvZXNuJ3QgZG8gdGhpc1xuICAgICAgICAgICAgLy8gSW4gcmVzcG9uc2UgdG8gQlVHICM1XG4gICAgICAgICAgICByZXR2YWw7XG4gICAgICAgIGZvcihpPTA7IGk8bDsgaSsrKXtcbiAgICAgICAgICBpZihfbGlzdGVuZXJzW2ldKXtcbiAgICAgICAgICAgIHZhciBjdXJyZW50VXBkYXRlcztcbiAgICAgICAgICAgIGlmIChfYWNjZXB0TGlzdHNbaV0pIHtcbiAgICAgICAgICAgICAgY3VycmVudFVwZGF0ZXMgPSBbXTtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIHVwZGF0ZXNMZW5ndGggPSBfdXBkYXRlcy5sZW5ndGg7IGogPCB1cGRhdGVzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoX2FjY2VwdExpc3RzW2ldLmluZGV4T2YoX3VwZGF0ZXNbal0udHlwZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50VXBkYXRlcy5wdXNoKF91cGRhdGVzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBjdXJyZW50VXBkYXRlcyA9IF91cGRhdGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRVcGRhdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBpZihfbGlzdGVuZXJzW2ldPT09Y29uc29sZS5sb2cpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRVcGRhdGVzKTtcbiAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgX2xpc3RlbmVyc1tpXShjdXJyZW50VXBkYXRlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3VwZGF0ZXM9W107XG4gICAgICB9O1xuICAgICAgc2VsZi5ub3RpZnkgPSBmdW5jdGlvbiBOb3RpZmllcl9ub3RpZnkoY2hhbmdlUmVjb3JkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hhbmdlUmVjb3JkICE9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjaGFuZ2VSZWNvcmQudHlwZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGNoYW5nZVJlY29yZCB3aXRoIG5vbi1zdHJpbmcgJ3R5cGUnIHByb3BlcnR5XCIpO1xuICAgICAgICB9XG4gICAgICAgIGNoYW5nZVJlY29yZC5vYmplY3QgPSB3YXRjaGluZztcbiAgICAgICAgc2VsZi5xdWV1ZVVwZGF0ZXMoW2NoYW5nZVJlY29yZF0pO1xuICAgICAgfTtcbiAgICAgIHNlbGYuX2NoZWNrUHJvcGVydHlMaXN0aW5nKHRydWUpO1xuICAgIH07XG5cbiAgICB2YXIgX25vdGlmaWVycz1bXSwgX2luZGV4ZXM9W107XG4gICAgZXh0ZW5kLmdldE5vdGlmaWVyID0gZnVuY3Rpb24gT2JqZWN0X2dldE5vdGlmaWVyKE8pe1xuICAgIHZhciBpZHggPSBfaW5kZXhlcy5pbmRleE9mKE8pLCBub3RpZmllciA9IGlkeD4tMT9fbm90aWZpZXJzW2lkeF06ZmFsc2U7XG4gICAgICBpZighbm90aWZpZXIpe1xuICAgICAgICBpZHggPSBfaW5kZXhlcy5sZW5ndGg7XG4gICAgICAgIF9pbmRleGVzW2lkeF0gPSBPO1xuICAgICAgICBub3RpZmllciA9IF9ub3RpZmllcnNbaWR4XSA9IG5ldyBOb3RpZmllcihPKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub3RpZmllcjtcbiAgICB9O1xuICAgIGV4dGVuZC5vYnNlcnZlID0gZnVuY3Rpb24gT2JqZWN0X29ic2VydmUoTywgY2FsbGJhY2ssIGFjY2VwdCl7XG4gICAgICAvLyBGb3IgQnVnIDQsIGNhbid0IG9ic2VydmUgRE9NIGVsZW1lbnRzIHRlc3RlZCBhZ2FpbnN0IGNhbnJ5IGltcGxlbWVudGF0aW9uIGFuZCBtYXRjaGVzXG4gICAgICBpZighaXNFbGVtZW50KE8pKXtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZlcihPLCBjYWxsYmFjaywgYWNjZXB0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV4dGVuZC51bm9ic2VydmUgPSBmdW5jdGlvbiBPYmplY3RfdW5vYnNlcnZlKE8sIGNhbGxiYWNrKXtcbiAgICAgIHZhbGlkYXRlQXJndW1lbnRzKE8sIGNhbGxiYWNrKTtcbiAgICAgIHZhciBpZHggPSBfaW5kZXhlcy5pbmRleE9mKE8pLFxuICAgICAgICAgIG5vdGlmaWVyID0gaWR4Pi0xP19ub3RpZmllcnNbaWR4XTpmYWxzZTtcbiAgICAgIGlmICghbm90aWZpZXIpe1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBub3RpZmllci5yZW1vdmVMaXN0ZW5lcihjYWxsYmFjayk7XG4gICAgICBpZiAobm90aWZpZXIubGlzdGVuZXJzKCkubGVuZ3RoID09PSAwKXtcbiAgICAgICAgX2luZGV4ZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIF9ub3RpZmllcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoT2JqZWN0LCB0aGlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRW5naW5lOiByZXF1aXJlKCcuL0VuZ2luZScpLFxuICAgIFNjZW5lOiByZXF1aXJlKCcuL1NjZW5lJyksXG4gICAgTm9kZTogcmVxdWlyZSgnLi9Ob2RlJylcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb3JlOiByZXF1aXJlKCcuL2NvcmUnKSxcbiAgICBjb21wb25lbnRzOiByZXF1aXJlKCcuL2NvbXBvbmVudHMnKSxcbiAgICBtYXRoOiByZXF1aXJlKCcuL21hdGgnKSxcbiAgICB0cmFuc2l0aW9uczogcmVxdWlyZSgnLi90cmFuc2l0aW9ucycpXG59O1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqIFxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICogXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIDN4MyBudW1lcmljYWwgbWF0cml4LCByZXByZXNlbnRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiBAY2xhc3MgTWF0MzNcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgYSAzeDMgbWF0cml4IGZsYXR0ZW5lZFxuICovXG5mdW5jdGlvbiBNYXQzMyh2YWx1ZXMpIHtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcyB8fCBbMSwwLDAsMCwxLDAsMCwwLDFdO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgdmFsdWVzIGluIHRoZSBNYXQzMyBhcyBhbiBhcnJheS5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7QXJyYXl9IG1hdHJpeCB2YWx1ZXMgYXMgYXJyYXkgb2Ygcm93cy5cbiAqL1xuTWF0MzMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgdmFsdWVzIG9mIHRoZSBjdXJyZW50IE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgQXJyYXkgb2YgbmluZSBudW1iZXJzIHRvIHNldCBpbiB0aGUgTWF0MzMuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IHRoaXNcbiAqL1xuTWF0MzMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCh2YWx1ZXMpIHtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dCBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4IFRoZSBNYXQzMyB0byBjb3B5LlxuICogXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhpc1xuICovXG5NYXQzMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkobWF0cml4KSB7XG4gICAgdmFyIEEgPSB0aGlzLnZhbHVlcztcbiAgICB2YXIgQiA9IG1hdHJpeC52YWx1ZXM7XG5cbiAgICBBWzBdID0gQlswXTtcbiAgICBBWzFdID0gQlsxXTtcbiAgICBBWzJdID0gQlsyXTtcbiAgICBBWzNdID0gQlszXTtcbiAgICBBWzRdID0gQls0XTtcbiAgICBBWzVdID0gQls1XTtcbiAgICBBWzZdID0gQls2XTtcbiAgICBBWzddID0gQls3XTtcbiAgICBBWzhdID0gQls4XTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUYWtlIHRoaXMgTWF0MzMgYXMgQSwgaW5wdXQgdmVjdG9yIFYgYXMgYSBjb2x1bW4gdmVjdG9yLCBhbmQgcmV0dXJuIE1hdDMzIHByb2R1Y3QgKEEpKFYpLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVmVjdG9yIHRvIHJvdGF0ZS5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgaW5wdXQgdmVjdG9yIGFmdGVyIG11bHRpcGxpY2F0aW9uLlxuICovXG5NYXQzMy5wcm90b3R5cGUudmVjdG9yTXVsdGlwbHkgPSBmdW5jdGlvbiB2ZWN0b3JNdWx0aXBseSh2LCBvdXRwdXQpIHtcbiAgICB2YXIgTSA9IHRoaXMudmFsdWVzO1xuICAgIHZhciB2MCA9IHYueDtcbiAgICB2YXIgdjEgPSB2Lnk7XG4gICAgdmFyIHYyID0gdi56O1xuXG4gICAgb3V0cHV0LnggPSBNWzBdKnYwICsgTVsxXSp2MSArIE1bMl0qdjI7XG4gICAgb3V0cHV0LnkgPSBNWzNdKnYwICsgTVs0XSp2MSArIE1bNV0qdjI7XG4gICAgb3V0cHV0LnogPSBNWzZdKnYwICsgTVs3XSp2MSArIE1bOF0qdjI7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB0aGUgcHJvdmlkZWQgTWF0MzMgd2l0aCB0aGUgY3VycmVudCBNYXQzMy4gIFJlc3VsdCBpcyAodGhpcykgKiAobWF0cml4KS5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4IElucHV0IE1hdDMzIHRvIG11bHRpcGx5IG9uIHRoZSByaWdodC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhpc1xuICovXG5NYXQzMy5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseShtYXRyaXgpIHtcbiAgICB2YXIgQSA9IHRoaXMudmFsdWVzO1xuICAgIHZhciBCID0gbWF0cml4LnZhbHVlcztcblxuICAgIHZhciBBMCA9IEFbMF07XG4gICAgdmFyIEExID0gQVsxXTtcbiAgICB2YXIgQTIgPSBBWzJdO1xuICAgIHZhciBBMyA9IEFbM107XG4gICAgdmFyIEE0ID0gQVs0XTtcbiAgICB2YXIgQTUgPSBBWzVdO1xuICAgIHZhciBBNiA9IEFbNl07XG4gICAgdmFyIEE3ID0gQVs3XTtcbiAgICB2YXIgQTggPSBBWzhdO1xuXG4gICAgdmFyIEIwID0gQlswXTtcbiAgICB2YXIgQjEgPSBCWzFdO1xuICAgIHZhciBCMiA9IEJbMl07XG4gICAgdmFyIEIzID0gQlszXTtcbiAgICB2YXIgQjQgPSBCWzRdO1xuICAgIHZhciBCNSA9IEJbNV07XG4gICAgdmFyIEI2ID0gQls2XTtcbiAgICB2YXIgQjcgPSBCWzddO1xuICAgIHZhciBCOCA9IEJbOF07XG5cbiAgICBBWzBdID0gQTAqQjAgKyBBMSpCMyArIEEyKkI2O1xuICAgIEFbMV0gPSBBMCpCMSArIEExKkI0ICsgQTIqQjc7XG4gICAgQVsyXSA9IEEwKkIyICsgQTEqQjUgKyBBMipCODtcbiAgICBBWzNdID0gQTMqQjAgKyBBNCpCMyArIEE1KkI2O1xuICAgIEFbNF0gPSBBMypCMSArIEE0KkI0ICsgQTUqQjc7XG4gICAgQVs1XSA9IEEzKkIyICsgQTQqQjUgKyBBNSpCODtcbiAgICBBWzZdID0gQTYqQjAgKyBBNypCMyArIEE4KkI2O1xuICAgIEFbN10gPSBBNipCMSArIEE3KkI0ICsgQTgqQjc7XG4gICAgQVs4XSA9IEE2KkIyICsgQTcqQjUgKyBBOCpCODtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2VzIHRoZSBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TWF0MzN9IHRoaXNcbiAqL1xuTWF0MzMucHJvdG90eXBlLnRyYW5zcG9zZSA9IGZ1bmN0aW9uIHRyYW5zcG9zZSgpIHtcbiAgICB2YXIgTSA9IHRoaXMudmFsdWVzO1xuXG4gICAgdmFyIE0xID0gTVsxXTtcbiAgICB2YXIgTTIgPSBNWzJdO1xuICAgIHZhciBNMyA9IE1bM107XG4gICAgdmFyIE01ID0gTVs1XTtcbiAgICB2YXIgTTYgPSBNWzZdO1xuICAgIHZhciBNNyA9IE1bN107XG5cbiAgICBNWzFdID0gTTM7XG4gICAgTVsyXSA9IE02O1xuICAgIE1bM10gPSBNMTtcbiAgICBNWzVdID0gTTc7XG4gICAgTVs2XSA9IE0yO1xuICAgIE1bN10gPSBNNTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUaGUgZGV0ZXJtaW5hbnQgb2YgdGhlIE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBkZXRlcm1pbmFudC5cbiAqL1xuTWF0MzMucHJvdG90eXBlLmdldERldGVybWluYW50ID0gZnVuY3Rpb24gZ2V0RGV0ZXJtaW5hbnQoKSB7XG4gICAgdmFyIE0gPSB0aGlzLnZhbHVlcztcblxuICAgIHZhciBNMyA9IE1bM107XG4gICAgdmFyIE00ID0gTVs0XTtcbiAgICB2YXIgTTUgPSBNWzVdO1xuICAgIHZhciBNNiA9IE1bNl07XG4gICAgdmFyIE03ID0gTVs3XTtcbiAgICB2YXIgTTggPSBNWzhdO1xuXG4gICAgdmFyIGRldCA9IE1bMF0qKE00Kk04IC0gTTUqTTcpIC1cbiAgICAgICAgICAgICAgTVsxXSooTTMqTTggLSBNNSpNNikgK1xuICAgICAgICAgICAgICBNWzJdKihNMypNNyAtIE00Kk02KTtcblxuICAgIHJldHVybiBkZXQ7XG59O1xuXG4vKipcbiAqIFRoZSBpbnZlcnNlIG9mIHRoZSBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TWF0MzN9IHRoaXNcbiAqL1xuTWF0MzMucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbiBpbnZlcnNlKCkge1xuICAgIHZhciBNID0gdGhpcy52YWx1ZXM7XG5cbiAgICB2YXIgTTAgPSBNWzBdO1xuICAgIHZhciBNMSA9IE1bMV07XG4gICAgdmFyIE0yID0gTVsyXTtcbiAgICB2YXIgTTMgPSBNWzNdO1xuICAgIHZhciBNNCA9IE1bNF07XG4gICAgdmFyIE01ID0gTVs1XTtcbiAgICB2YXIgTTYgPSBNWzZdO1xuICAgIHZhciBNNyA9IE1bN107XG4gICAgdmFyIE04ID0gTVs4XTtcblxuICAgIHZhciBkZXQgPSBNMCooTTQqTTggLSBNNSpNNykgLVxuICAgICAgICAgICAgICBNMSooTTMqTTggLSBNNSpNNikgK1xuICAgICAgICAgICAgICBNMiooTTMqTTcgLSBNNCpNNik7XG5cbiAgICBpZiAoTWF0aC5hYnMoZGV0KSA8IDFlLTQwKSByZXR1cm4gbnVsbDtcblxuICAgIGRldCA9IDEgLyBkZXQ7XG5cbiAgICBNWzBdID0gKE00Kk04IC0gTTUqTTcpICogZGV0O1xuICAgIE1bM10gPSAoLU0zKk04ICsgTTUqTTYpICogZGV0O1xuICAgIE1bNl0gPSAoTTMqTTcgLSBNNCpNNikgKiBkZXQ7XG4gICAgTVsxXSA9ICgtTTEqTTggKyBNMipNNykgKiBkZXQ7XG4gICAgTVs0XSA9IChNMCpNOCAtIE0yKk02KSAqIGRldDtcbiAgICBNWzddID0gKC1NMCpNNyArIE0xKk02KSAqIGRldDtcbiAgICBNWzJdID0gKE0xKk01IC0gTTIqTTQpICogZGV0O1xuICAgIE1bNV0gPSAoLU0wKk01ICsgTTIqTTMpICogZGV0O1xuICAgIE1bOF0gPSAoTTAqTTQgLSBNMSpNMykgKiBkZXQ7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xvbmVzIHRoZSBpbnB1dCBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbSBNYXQzMyB0byBjbG9uZS5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gTmV3IGNvcHkgb2YgdGhlIG9yaWdpbmFsIE1hdDMzLlxuICovXG5NYXQzMy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKG0pIHtcbiAgICByZXR1cm4gbmV3IE1hdDMzKG0udmFsdWVzLnNsaWNlKCkpO1xufTtcblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiB0aGUgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeCBNYXQzMyB0byBpbnZlcnQuXG4gKiBAcGFyYW0ge01hdDMzfSBvdXRwdXQgTWF0MzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gVGhlIE1hdDMzIGFmdGVyIHRoZSBpbnZlcnQuXG4gKi9cbk1hdDMzLmludmVyc2UgPSBmdW5jdGlvbiBpbnZlcnNlKG1hdHJpeCwgb3V0cHV0KSB7XG4gICAgdmFyIE0gPSBtYXRyaXgudmFsdWVzO1xuICAgIHZhciByZXN1bHQgPSBvdXRwdXQudmFsdWVzO1xuXG4gICAgdmFyIE0wID0gTVswXTtcbiAgICB2YXIgTTEgPSBNWzFdO1xuICAgIHZhciBNMiA9IE1bMl07XG4gICAgdmFyIE0zID0gTVszXTtcbiAgICB2YXIgTTQgPSBNWzRdO1xuICAgIHZhciBNNSA9IE1bNV07XG4gICAgdmFyIE02ID0gTVs2XTtcbiAgICB2YXIgTTcgPSBNWzddO1xuICAgIHZhciBNOCA9IE1bOF07XG5cbiAgICB2YXIgZGV0ID0gTTAqKE00Kk04IC0gTTUqTTcpIC1cbiAgICAgICAgICAgICAgTTEqKE0zKk04IC0gTTUqTTYpICtcbiAgICAgICAgICAgICAgTTIqKE0zKk03IC0gTTQqTTYpO1xuXG4gICAgaWYgKE1hdGguYWJzKGRldCkgPCAxZS00MCkgcmV0dXJuIG51bGw7XG5cbiAgICBkZXQgPSAxIC8gZGV0O1xuXG4gICAgcmVzdWx0WzBdID0gKE00Kk04IC0gTTUqTTcpICogZGV0O1xuICAgIHJlc3VsdFszXSA9ICgtTTMqTTggKyBNNSpNNikgKiBkZXQ7XG4gICAgcmVzdWx0WzZdID0gKE0zKk03IC0gTTQqTTYpICogZGV0O1xuICAgIHJlc3VsdFsxXSA9ICgtTTEqTTggKyBNMipNNykgKiBkZXQ7XG4gICAgcmVzdWx0WzRdID0gKE0wKk04IC0gTTIqTTYpICogZGV0O1xuICAgIHJlc3VsdFs3XSA9ICgtTTAqTTcgKyBNMSpNNikgKiBkZXQ7XG4gICAgcmVzdWx0WzJdID0gKE0xKk01IC0gTTIqTTQpICogZGV0O1xuICAgIHJlc3VsdFs1XSA9ICgtTTAqTTUgKyBNMipNMykgKiBkZXQ7XG4gICAgcmVzdWx0WzhdID0gKE0wKk00IC0gTTEqTTMpICogZGV0O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogVHJhbnNwb3NlcyB0aGUgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeCBNYXQzMyB0byB0cmFuc3Bvc2UuXG4gKiBAcGFyYW0ge01hdDMzfSBvdXRwdXQgTWF0MzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gVGhlIE1hdDMzIGFmdGVyIHRoZSB0cmFuc3Bvc2UuXG4gKi9cbk1hdDMzLnRyYW5zcG9zZSA9IGZ1bmN0aW9uIHRyYW5zcG9zZShtYXRyaXgsIG91dHB1dCkge1xuICAgIHZhciBNID0gbWF0cml4LnZhbHVlcztcbiAgICB2YXIgcmVzdWx0ID0gb3V0cHV0LnZhbHVlcztcblxuICAgIHZhciBNMCA9IE1bMF07XG4gICAgdmFyIE0xID0gTVsxXTtcbiAgICB2YXIgTTIgPSBNWzJdO1xuICAgIHZhciBNMyA9IE1bM107XG4gICAgdmFyIE00ID0gTVs0XTtcbiAgICB2YXIgTTUgPSBNWzVdO1xuICAgIHZhciBNNiA9IE1bNl07XG4gICAgdmFyIE03ID0gTVs3XTtcbiAgICB2YXIgTTggPSBNWzhdO1xuXG4gICAgcmVzdWx0WzBdID0gTTA7XG4gICAgcmVzdWx0WzFdID0gTTM7XG4gICAgcmVzdWx0WzJdID0gTTY7XG4gICAgcmVzdWx0WzNdID0gTTE7XG4gICAgcmVzdWx0WzRdID0gTTQ7XG4gICAgcmVzdWx0WzVdID0gTTc7XG4gICAgcmVzdWx0WzZdID0gTTI7XG4gICAgcmVzdWx0WzddID0gTTU7XG4gICAgcmVzdWx0WzhdID0gTTg7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIHByb3ZpZGVkIE1hdDMzJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDEgVGhlIGxlZnQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgyIFRoZSByaWdodCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG91dHB1dCBNYXQzMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSBUaGUgcmVzdWx0IG9mIHRoZSBhZGRpdGlvbi5cbiAqL1xuTWF0MzMuYWRkID0gZnVuY3Rpb24gYWRkKG1hdHJpeDEsIG1hdHJpeDIsIG91dHB1dCkge1xuICAgIHZhciBBID0gbWF0cml4MS52YWx1ZXM7XG4gICAgdmFyIEIgPSBtYXRyaXgyLnZhbHVlcztcbiAgICB2YXIgcmVzdWx0ID0gb3V0cHV0LnZhbHVlcztcblxuICAgIHZhciBBMCA9IEFbMF07XG4gICAgdmFyIEExID0gQVsxXTtcbiAgICB2YXIgQTIgPSBBWzJdO1xuICAgIHZhciBBMyA9IEFbM107XG4gICAgdmFyIEE0ID0gQVs0XTtcbiAgICB2YXIgQTUgPSBBWzVdO1xuICAgIHZhciBBNiA9IEFbNl07XG4gICAgdmFyIEE3ID0gQVs3XTtcbiAgICB2YXIgQTggPSBBWzhdO1xuXG4gICAgdmFyIEIwID0gQlswXTtcbiAgICB2YXIgQjEgPSBCWzFdO1xuICAgIHZhciBCMiA9IEJbMl07XG4gICAgdmFyIEIzID0gQlszXTtcbiAgICB2YXIgQjQgPSBCWzRdO1xuICAgIHZhciBCNSA9IEJbNV07XG4gICAgdmFyIEI2ID0gQls2XTtcbiAgICB2YXIgQjcgPSBCWzddO1xuICAgIHZhciBCOCA9IEJbOF07XG5cbiAgICByZXN1bHRbMF0gPSBBMCArIEIwO1xuICAgIHJlc3VsdFsxXSA9IEExICsgQjE7XG4gICAgcmVzdWx0WzJdID0gQTIgKyBCMjtcbiAgICByZXN1bHRbM10gPSBBMyArIEIzO1xuICAgIHJlc3VsdFs0XSA9IEE0ICsgQjQ7XG4gICAgcmVzdWx0WzVdID0gQTUgKyBCNTtcbiAgICByZXN1bHRbNl0gPSBBNiArIEI2O1xuICAgIHJlc3VsdFs3XSA9IEE3ICsgQjc7XG4gICAgcmVzdWx0WzhdID0gQTggKyBCODtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBwcm92aWRlZCBNYXQzMydzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgxIFRoZSBsZWZ0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MiBUaGUgcmlnaHQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBvdXRwdXQgTWF0MzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gVGhlIHJlc3VsdCBvZiB0aGUgc3VidHJhY3Rpb24uXG4gKi9cbk1hdDMzLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QobWF0cml4MSwgbWF0cml4Miwgb3V0cHV0KSB7XG4gICAgdmFyIEEgPSBtYXRyaXgxLnZhbHVlcztcbiAgICB2YXIgQiA9IG1hdHJpeDIudmFsdWVzO1xuICAgIHZhciByZXN1bHQgPSBvdXRwdXQudmFsdWVzO1xuXG4gICAgdmFyIEEwID0gQVswXTtcbiAgICB2YXIgQTEgPSBBWzFdO1xuICAgIHZhciBBMiA9IEFbMl07XG4gICAgdmFyIEEzID0gQVszXTtcbiAgICB2YXIgQTQgPSBBWzRdO1xuICAgIHZhciBBNSA9IEFbNV07XG4gICAgdmFyIEE2ID0gQVs2XTtcbiAgICB2YXIgQTcgPSBBWzddO1xuICAgIHZhciBBOCA9IEFbOF07XG5cbiAgICB2YXIgQjAgPSBCWzBdO1xuICAgIHZhciBCMSA9IEJbMV07XG4gICAgdmFyIEIyID0gQlsyXTtcbiAgICB2YXIgQjMgPSBCWzNdO1xuICAgIHZhciBCNCA9IEJbNF07XG4gICAgdmFyIEI1ID0gQls1XTtcbiAgICB2YXIgQjYgPSBCWzZdO1xuICAgIHZhciBCNyA9IEJbN107XG4gICAgdmFyIEI4ID0gQls4XTtcblxuICAgIHJlc3VsdFswXSA9IEEwIC0gQjA7XG4gICAgcmVzdWx0WzFdID0gQTEgLSBCMTtcbiAgICByZXN1bHRbMl0gPSBBMiAtIEIyO1xuICAgIHJlc3VsdFszXSA9IEEzIC0gQjM7XG4gICAgcmVzdWx0WzRdID0gQTQgLSBCNDtcbiAgICByZXN1bHRbNV0gPSBBNSAtIEI1O1xuICAgIHJlc3VsdFs2XSA9IEE2IC0gQjY7XG4gICAgcmVzdWx0WzddID0gQTcgLSBCNztcbiAgICByZXN1bHRbOF0gPSBBOCAtIEI4O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG4vKipcbiAqIE11bHRpcGx5IHRoZSBwcm92aWRlZCBNYXQzMyBNMiB3aXRoIHRoaXMgTWF0MzMuICBSZXN1bHQgaXMgKHRoaXMpICogKE0yKS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgxIFRoZSBsZWZ0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MiBUaGUgcmlnaHQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBvdXRwdXQgTWF0MzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhlIHJlc3VsdCBvZiB0aGUgbXVsdGlwbGljYXRpb24uXG4gKi9cbk1hdDMzLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkobWF0cml4MSwgbWF0cml4Miwgb3V0cHV0KSB7XG4gICAgdmFyIEEgPSBtYXRyaXgxLnZhbHVlcztcbiAgICB2YXIgQiA9IG1hdHJpeDIudmFsdWVzO1xuICAgIHZhciByZXN1bHQgPSBvdXRwdXQudmFsdWVzO1xuXG4gICAgdmFyIEEwID0gQVswXTtcbiAgICB2YXIgQTEgPSBBWzFdO1xuICAgIHZhciBBMiA9IEFbMl07XG4gICAgdmFyIEEzID0gQVszXTtcbiAgICB2YXIgQTQgPSBBWzRdO1xuICAgIHZhciBBNSA9IEFbNV07XG4gICAgdmFyIEE2ID0gQVs2XTtcbiAgICB2YXIgQTcgPSBBWzddO1xuICAgIHZhciBBOCA9IEFbOF07XG5cbiAgICB2YXIgQjAgPSBCWzBdO1xuICAgIHZhciBCMSA9IEJbMV07XG4gICAgdmFyIEIyID0gQlsyXTtcbiAgICB2YXIgQjMgPSBCWzNdO1xuICAgIHZhciBCNCA9IEJbNF07XG4gICAgdmFyIEI1ID0gQls1XTtcbiAgICB2YXIgQjYgPSBCWzZdO1xuICAgIHZhciBCNyA9IEJbN107XG4gICAgdmFyIEI4ID0gQls4XTtcblxuICAgIHJlc3VsdFswXSA9IEEwKkIwICsgQTEqQjMgKyBBMipCNjtcbiAgICByZXN1bHRbMV0gPSBBMCpCMSArIEExKkI0ICsgQTIqQjc7XG4gICAgcmVzdWx0WzJdID0gQTAqQjIgKyBBMSpCNSArIEEyKkI4O1xuICAgIHJlc3VsdFszXSA9IEEzKkIwICsgQTQqQjMgKyBBNSpCNjtcbiAgICByZXN1bHRbNF0gPSBBMypCMSArIEE0KkI0ICsgQTUqQjc7XG4gICAgcmVzdWx0WzVdID0gQTMqQjIgKyBBNCpCNSArIEE1KkI4O1xuICAgIHJlc3VsdFs2XSA9IEE2KkIwICsgQTcqQjMgKyBBOCpCNjtcbiAgICByZXN1bHRbN10gPSBBNipCMSArIEE3KkI0ICsgQTgqQjc7XG4gICAgcmVzdWx0WzhdID0gQTYqQjIgKyBBNypCNSArIEE4KkI4O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0MzM7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzaW4gPSBNYXRoLnNpbjtcbnZhciBjb3MgPSBNYXRoLmNvcztcbnZhciBhc2luID0gTWF0aC5hc2luO1xudmFyIGFjb3MgPSBNYXRoLmFjb3M7XG52YXIgYXRhbjIgPSBNYXRoLmF0YW4yO1xudmFyIHNxcnQgPSBNYXRoLnNxcnQ7XG5cbi8qKlxuICogQSB2ZWN0b3ItbGlrZSBvYmplY3QgdXNlZCB0byByZXByZXNlbnQgcm90YXRpb25zLiBJZiB0aGV0YSBpcyB0aGUgYW5nbGUgb2ZcbiAqIHJvdGF0aW9uLCBhbmQgKHgnLCB5JywgeicpIGlzIGEgbm9ybWFsaXplZCB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSBheGlzIG9mXG4gKiByb3RhdGlvbiwgdGhlbiB3ID0gY29zKHRoZXRhLzIpLCB4ID0gc2luKHRoZXRhLzIpKngnLCB5ID0gc2luKHRoZXRhLzIpKnknLFxuICogYW5kIHogPSBzaW4odGhldGEvMikqeicuXG4gKlxuICogQGNsYXNzIFF1YXRlcm5pb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdyBUaGUgdyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geiBUaGUgeiBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIFF1YXRlcm5pb24odywgeCwgeSwgeikge1xuICAgIHRoaXMudyA9IHcgfHwgMTtcbiAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgdGhpcy55ID0geSB8fCAwO1xuICAgIHRoaXMueiA9IHogfHwgMDtcbn1cblxuLyoqXG4gKiBNdWx0aXBseSB0aGUgY3VycmVudCBRdWF0ZXJuaW9uIGJ5IGlucHV0IFF1YXRlcm5pb24gcS5cbiAqIExlZnQtaGFuZGVkIG11bHRpcGxpY2F0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIFF1YXRlcm5pb24gdG8gbXVsdGlwbHkgYnkgb24gdGhlIHJpZ2h0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUubXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseShxKSB7XG4gICAgdmFyIHgxID0gdGhpcy54O1xuICAgIHZhciB5MSA9IHRoaXMueTtcbiAgICB2YXIgejEgPSB0aGlzLno7XG4gICAgdmFyIHcxID0gdGhpcy53O1xuICAgIHZhciB4MiA9IHEueDtcbiAgICB2YXIgeTIgPSBxLnk7XG4gICAgdmFyIHoyID0gcS56O1xuICAgIHZhciB3MiA9IHEudyB8fCAwO1xuXG4gICAgdGhpcy53ID0gdzEgKiB3MiAtIHgxICogeDIgLSB5MSAqIHkyIC0gejEgKiB6MjtcbiAgICB0aGlzLnggPSB4MSAqIHcyICsgeDIgKiB3MSArIHkyICogejEgLSB5MSAqIHoyO1xuICAgIHRoaXMueSA9IHkxICogdzIgKyB5MiAqIHcxICsgeDEgKiB6MiAtIHgyICogejE7XG4gICAgdGhpcy56ID0gejEgKiB3MiArIHoyICogdzEgKyB4MiAqIHkxIC0geDEgKiB5MjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdGhlIGN1cnJlbnQgUXVhdGVybmlvbiBieSBpbnB1dCBRdWF0ZXJuaW9uIHEgb24gdGhlIGxlZnQsIGkuZS4gcSAqIHRoaXMuXG4gKiBMZWZ0LWhhbmRlZCBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSBRdWF0ZXJuaW9uIHRvIG11bHRpcGx5IGJ5IG9uIHRoZSBsZWZ0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUubGVmdE11bHRpcGx5ID0gZnVuY3Rpb24gbGVmdE11bHRpcGx5KHEpIHtcbiAgICB2YXIgeDEgPSBxLng7XG4gICAgdmFyIHkxID0gcS55O1xuICAgIHZhciB6MSA9IHEuejtcbiAgICB2YXIgdzEgPSBxLncgfHwgMDtcbiAgICB2YXIgeDIgPSB0aGlzLng7XG4gICAgdmFyIHkyID0gdGhpcy55O1xuICAgIHZhciB6MiA9IHRoaXMuejtcbiAgICB2YXIgdzIgPSB0aGlzLnc7XG5cbiAgICB0aGlzLncgPSB3MSp3MiAtIHgxKngyIC0geTEqeTIgLSB6MSp6MjtcbiAgICB0aGlzLnggPSB4MSp3MiArIHgyKncxICsgeTIqejEgLSB5MSp6MjtcbiAgICB0aGlzLnkgPSB5MSp3MiArIHkyKncxICsgeDEqejIgLSB4Mip6MTtcbiAgICB0aGlzLnogPSB6MSp3MiArIHoyKncxICsgeDIqeTEgLSB4MSp5MjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwbHkgdGhlIGN1cnJlbnQgUXVhdGVybmlvbiB0byBpbnB1dCBWZWMzIHYsIGFjY29yZGluZyB0b1xuICogdicgPSB+cSAqIHYgKiBxLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIHJlZmVyZW5jZSBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByb3RhdGVkIHZlcnNpb24gb2YgdGhlIFZlYzMuXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLnJvdGF0ZVZlY3RvciA9IGZ1bmN0aW9uIHJvdGF0ZVZlY3Rvcih2LCBvdXRwdXQpIHtcbiAgICB2YXIgY3cgPSB0aGlzLnc7XG4gICAgdmFyIGN4ID0gLXRoaXMueDtcbiAgICB2YXIgY3kgPSAtdGhpcy55O1xuICAgIHZhciBjeiA9IC10aGlzLno7XG5cbiAgICB2YXIgdnggPSB2Lng7XG4gICAgdmFyIHZ5ID0gdi55O1xuICAgIHZhciB2eiA9IHYuejtcblxuICAgIHZhciB0dyA9IC1jeCAqIHZ4IC0gY3kgKiB2eSAtIGN6ICogdno7XG4gICAgdmFyIHR4ID0gdnggKiBjdyArIHZ5ICogY3ogLSBjeSAqIHZ6O1xuICAgIHZhciB0eSA9IHZ5ICogY3cgKyBjeCAqIHZ6IC0gdnggKiBjejtcbiAgICB2YXIgdHogPSB2eiAqIGN3ICsgdnggKiBjeSAtIGN4ICogdnk7XG5cbiAgICB2YXIgdyA9IGN3O1xuICAgIHZhciB4ID0gLWN4O1xuICAgIHZhciB5ID0gLWN5O1xuICAgIHZhciB6ID0gLWN6O1xuXG4gICAgb3V0cHV0LnggPSB0eCAqIHcgKyB4ICogdHcgKyB5ICogdHogLSB0eSAqIHo7XG4gICAgb3V0cHV0LnkgPSB0eSAqIHcgKyB5ICogdHcgKyB0eCAqIHogLSB4ICogdHo7XG4gICAgb3V0cHV0LnogPSB0eiAqIHcgKyB6ICogdHcgKyB4ICogdHkgLSB0eCAqIHk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0IHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gaW52ZXJ0KCkge1xuICAgIHRoaXMudyA9IC10aGlzLnc7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHRoaXMueiA9IC10aGlzLno7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbmp1Z2F0ZSB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmNvbmp1Z2F0ZSA9IGZ1bmN0aW9uIGNvbmp1Z2F0ZSgpIHtcbiAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgdGhpcy56ID0gLXRoaXMuejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29tcHV0ZSB0aGUgbGVuZ3RoIChub3JtKSBvZiB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGxlbmd0aCBvZiB0aGUgUXVhdGVybmlvblxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgoKSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG4gICAgcmV0dXJuIHNxcnQodyAqIHcgKyB4ICogeCArIHkgKiB5ICsgeiAqIHopO1xufTtcblxuLyoqXG4gKiBBbHRlciB0aGUgY3VycmVudCBRdWF0ZXJuaW9uIHRvIGJlIG9mIHVuaXQgbGVuZ3RoO1xuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZSgpIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcbiAgICB2YXIgbGVuZ3RoID0gc3FydCh3ICogdyArIHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXM7XG4gICAgbGVuZ3RoID0gMSAvIGxlbmd0aDtcbiAgICB0aGlzLncgKj0gbGVuZ3RoO1xuICAgIHRoaXMueCAqPSBsZW5ndGg7XG4gICAgdGhpcy55ICo9IGxlbmd0aDtcbiAgICB0aGlzLnogKj0gbGVuZ3RoO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHcsIHgsIHksIHogY29tcG9uZW50cyBvZiB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdyBUaGUgdyBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geiBUaGUgeiBjb21wb25lbnQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQodywgeCAseSwgeikge1xuICAgIGlmICh3ICE9IG51bGwpIHRoaXMudyA9IHc7XG4gICAgaWYgKHggIT0gbnVsbCkgdGhpcy54ID0geDtcbiAgICBpZiAoeSAhPSBudWxsKSB0aGlzLnkgPSB5O1xuICAgIGlmICh6ICE9IG51bGwpIHRoaXMueiA9IHo7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvcHkgaW5wdXQgUXVhdGVybmlvbiBxIG9udG8gdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSByZWZlcmVuY2UgUXVhdGVybmlvbi5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5KHEpIHtcbiAgICB0aGlzLncgPSBxLnc7XG4gICAgdGhpcy54ID0gcS54O1xuICAgIHRoaXMueSA9IHEueTtcbiAgICB0aGlzLnogPSBxLno7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLncgPSAxO1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLnogPSAwO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3QuIENhbiBiZSB1c2VkIHRvIGRldGVybWluZSB0aGUgY29zaW5lIG9mIHRoZSBhbmdsZSBiZXR3ZWVuXG4gKiB0aGUgdHdvIHJvdGF0aW9ucywgYXNzdW1pbmcgYm90aCBRdWF0ZXJuaW9ucyBhcmUgb2YgdW5pdCBsZW5ndGguXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgb3RoZXIgUXVhdGVybmlvbi5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSByZXN1bHRpbmcgZG90IHByb2R1Y3RcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gZG90KHEpIHtcbiAgICByZXR1cm4gdGhpcy53ICogcS53ICsgdGhpcy54ICogcS54ICsgdGhpcy55ICogcS55ICsgdGhpcy56ICogcS56O1xufTtcblxuLyoqXG4gKiBTcGhlcmljYWwgbGluZWFyIGludGVycG9sYXRpb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgZmluYWwgb3JpZW50YXRpb24uXG4gKiBAcGFyYW0ge051bWJlcn0gdCBUaGUgdHdlZW4gcGFyYW1ldGVyLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwdXQgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgcXVhdGVybmlvbiB0aGUgc2xlcnAgcmVzdWx0cyB3ZXJlIHNhdmVkIHRvXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLnNsZXJwID0gZnVuY3Rpb24gc2xlcnAocSwgdCwgb3V0cHV0KSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgcXcgPSBxLnc7XG4gICAgdmFyIHF4ID0gcS54O1xuICAgIHZhciBxeSA9IHEueTtcbiAgICB2YXIgcXogPSBxLno7XG5cbiAgICB2YXIgb21lZ2E7XG4gICAgdmFyIGNvc29tZWdhO1xuICAgIHZhciBzaW5vbWVnYTtcbiAgICB2YXIgc2NhbGVGcm9tO1xuICAgIHZhciBzY2FsZVRvO1xuXG4gICAgY29zb21lZ2EgPSB3ICogcXcgKyB4ICogcXggKyB5ICogcXkgKyB6ICogcXo7XG4gICAgaWYgKCgxLjAgLSBjb3NvbWVnYSkgPiAxZS01KSB7XG4gICAgICAgIG9tZWdhID0gYWNvcyhjb3NvbWVnYSk7XG4gICAgICAgIHNpbm9tZWdhID0gc2luKG9tZWdhKTtcbiAgICAgICAgc2NhbGVGcm9tID0gc2luKCgxLjAgLSB0KSAqIG9tZWdhKSAvIHNpbm9tZWdhO1xuICAgICAgICBzY2FsZVRvID0gc2luKHQgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHNjYWxlRnJvbSA9IDEuMCAtIHQ7XG4gICAgICAgIHNjYWxlVG8gPSB0O1xuICAgIH1cblxuICAgIG91dHB1dC53ID0gdyAqIHNjYWxlRnJvbSArIHF3ICogc2NhbGVUbztcbiAgICBvdXRwdXQueCA9IHggKiBzY2FsZUZyb20gKyBxeCAqIHNjYWxlVG87XG4gICAgb3V0cHV0LnkgPSB5ICogc2NhbGVGcm9tICsgcXkgKiBzY2FsZVRvO1xuICAgIG91dHB1dC56ID0geiAqIHNjYWxlRnJvbSArIHF6ICogc2NhbGVUbztcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgTWF0MzMgbWF0cml4IGNvcnJlc3BvbmRpbmcgdG8gdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG91dHB1dCBPYmplY3QgdG8gcHJvY2VzcyB0aGUgVHJhbnNmb3JtIG1hdHJpeFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgUXVhdGVybmlvbiBhcyBhIFRyYW5zZm9ybSBtYXRyaXhcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUudG9NYXRyaXggPSBmdW5jdGlvbiB0b01hdHJpeChvdXRwdXQpIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciB4eCA9IHgqeDtcbiAgICB2YXIgeXkgPSB5Knk7XG4gICAgdmFyIHp6ID0geip6O1xuICAgIHZhciB4eSA9IHgqeTtcbiAgICB2YXIgeHogPSB4Kno7XG4gICAgdmFyIHl6ID0geSp6O1xuXG4gICAgcmV0dXJuIG91dHB1dC5zZXQoW1xuICAgICAgICAxIC0gMiAqICh5eSArIHp6KSwgMiAqICh4eSAtIHcqeiksIDIgKiAoeHogKyB3KnkpLFxuICAgICAgICAyICogKHh5ICsgdyp6KSwgMSAtIDIgKiAoeHggKyB6eiksIDIgKiAoeXogLSB3KngpLFxuICAgICAgICAyICogKHh6IC0gdyp5KSwgMiAqICh5eiArIHcqeCksIDEgLSAyICogKHh4ICsgeXkpXG4gICAgXSk7XG59O1xuXG4vKipcbiAqIFRoZSByb3RhdGlvbiBhbmdsZXMgYWJvdXQgdGhlIHgsIHksIGFuZCB6IGF4ZXMgY29ycmVzcG9uZGluZyB0byB0aGVcbiAqIGN1cnJlbnQgUXVhdGVybmlvbiwgd2hlbiBhcHBsaWVkIGluIHRoZSBaWVggb3JkZXIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcHV0IHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhlIFZlYzMgdGhlIHJlc3VsdCB3YXMgc3RvcmVkIGluXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLnRvRXVsZXIgPSBmdW5jdGlvbiB0b0V1bGVyKG91dHB1dCkge1xuICAgIHZhciB3ID0gdGhpcy53O1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIHh4ID0geCAqIHg7XG4gICAgdmFyIHl5ID0geSAqIHk7XG4gICAgdmFyIHp6ID0geiAqIHo7XG5cbiAgICB2YXIgdHkgPSAyICogKHggKiB6ICsgeSAqIHcpO1xuICAgIHR5ID0gdHkgPCAtMSA/IC0xIDogdHkgPiAxID8gMSA6IHR5O1xuXG4gICAgb3V0cHV0LnggPSBhdGFuMigyICogKHggKiB3IC0geSAqIHopLCAxIC0gMiAqICh4eCArIHl5KSk7XG4gICAgb3V0cHV0LnkgPSBhc2luKHR5KTtcbiAgICBvdXRwdXQueiA9IGF0YW4yKDIgKiAoeiAqIHcgLSB4ICogeSksIDEgLSAyICogKHl5ICsgenopKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFRoZSBRdWF0ZXJuaW9uIGNvcnJlc3BvbmRpbmcgdG8gdGhlIEV1bGVyIGFuZ2xlcyB4LCB5LCBhbmQgeixcbiAqIGFwcGxpZWQgaW4gdGhlIFpZWCBvcmRlci5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGFib3V0IHRoZSB4IGF4aXMuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgYW5nbGUgb2Ygcm90YXRpb24gYWJvdXQgdGhlIHkgYXhpcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFRoZSBhbmdsZSBvZiByb3RhdGlvbiBhYm91dCB0aGUgeiBheGlzLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBvdXRwdXQgUXVhdGVybmlvbiBpbiB3aGljaCB0byBwdXQgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgZXF1aXZhbGVudCBRdWF0ZXJuaW9uLlxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5mcm9tRXVsZXIgPSBmdW5jdGlvbiBmcm9tRXVsZXIoeCwgeSwgeikge1xuICAgIHZhciBoeCA9IHggKiAwLjU7XG4gICAgdmFyIGh5ID0geSAqIDAuNTtcbiAgICB2YXIgaHogPSB6ICogMC41O1xuXG4gICAgdmFyIHN4ID0gc2luKGh4KTtcbiAgICB2YXIgc3kgPSBzaW4oaHkpO1xuICAgIHZhciBzeiA9IHNpbihoeik7XG4gICAgdmFyIGN4ID0gY29zKGh4KTtcbiAgICB2YXIgY3kgPSBjb3MoaHkpO1xuICAgIHZhciBjeiA9IGNvcyhoeik7XG5cbiAgICB0aGlzLncgPSBjeCAqIGN5ICogY3ogLSBzeCAqIHN5ICogc3o7XG4gICAgdGhpcy54ID0gc3ggKiBjeSAqIGN6ICsgY3ggKiBzeSAqIHN6O1xuICAgIHRoaXMueSA9IGN4ICogc3kgKiBjeiAtIHN4ICogY3kgKiBzejtcbiAgICB0aGlzLnogPSBjeCAqIGN5ICogc3ogKyBzeCAqIHN5ICogY3o7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWx0ZXIgdGhlIGN1cnJlbnQgUXVhdGVybmlvbiB0byByZWZsZWN0IGEgcm90YXRpb24gb2YgaW5wdXQgYW5nbGUgYWJvdXRcbiAqIGlucHV0IGF4aXMgeCwgeSwgYW5kIHouXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZSBUaGUgYW5nbGUgb2Ygcm90YXRpb24uXG4gKiBAcGFyYW0ge1ZlYzN9IHggVGhlIGF4aXMgb2Ygcm90YXRpb24uXG4gKiBAcGFyYW0ge1ZlYzN9IHkgVGhlIGF4aXMgb2Ygcm90YXRpb24uXG4gKiBAcGFyYW0ge1ZlYzN9IHogVGhlIGF4aXMgb2Ygcm90YXRpb24uXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5mcm9tQW5nbGVBeGlzID0gZnVuY3Rpb24gZnJvbUFuZ2xlQXhpcyhhbmdsZSwgeCwgeSwgeikge1xuICAgIHZhciBsZW4gPSBzcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICB0aGlzLncgPSAxO1xuICAgICAgICB0aGlzLnggPSB0aGlzLnkgPSB0aGlzLnogPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgdmFyIGhhbGZUaGV0YSA9IGFuZ2xlICogMC41O1xuICAgICAgICB2YXIgcyA9IHNpbihoYWxmVGhldGEpO1xuICAgICAgICB0aGlzLncgPSBjb3MoaGFsZlRoZXRhKTtcbiAgICAgICAgdGhpcy54ID0gcyAqIHggKiBsZW47XG4gICAgICAgIHRoaXMueSA9IHMgKiB5ICogbGVuO1xuICAgICAgICB0aGlzLnogPSBzICogeiAqIGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE11bHRpcGx5IHRoZSBpbnB1dCBRdWF0ZXJuaW9ucy5cbiAqIExlZnQtaGFuZGVkIGNvb3JkaW5hdGUgc3lzdGVtIG11bHRpcGxpY2F0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHExIFRoZSBsZWZ0IFF1YXRlcm5pb24uXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEyIFRoZSByaWdodCBRdWF0ZXJuaW9uLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBvdXRwdXQgUXVhdGVybmlvbiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBwcm9kdWN0IG9mIG11bHRpcGxpY2F0aW9uLlxuICovXG5RdWF0ZXJuaW9uLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkocTEsIHEyLCBvdXRwdXQpIHtcbiAgICB2YXIgdzEgPSBxMS53IHx8IDA7XG4gICAgdmFyIHgxID0gcTEueDtcbiAgICB2YXIgeTEgPSBxMS55O1xuICAgIHZhciB6MSA9IHExLno7XG5cbiAgICB2YXIgdzIgPSBxMi53IHx8IDA7XG4gICAgdmFyIHgyID0gcTIueDtcbiAgICB2YXIgeTIgPSBxMi55O1xuICAgIHZhciB6MiA9IHEyLno7XG5cbiAgICBvdXRwdXQudyA9IHcxICogdzIgLSB4MSAqIHgyIC0geTEgKiB5MiAtIHoxICogejI7XG4gICAgb3V0cHV0LnggPSB4MSAqIHcyICsgeDIgKiB3MSArIHkyICogejEgLSB5MSAqIHoyO1xuICAgIG91dHB1dC55ID0geTEgKiB3MiArIHkyICogdzEgKyB4MSAqIHoyIC0geDIgKiB6MTtcbiAgICBvdXRwdXQueiA9IHoxICogdzIgKyB6MiAqIHcxICsgeDIgKiB5MSAtIHgxICogeTI7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBpbnB1dCBxdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIHJlZmVyZW5jZSBRdWF0ZXJuaW9uLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBvdXRwdXQgUXVhdGVybmlvbiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBub3JtYWxpemVkIHF1YXRlcm5pb24uXG4gKi9cblF1YXRlcm5pb24ubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKHEsIG91dHB1dCkge1xuICAgIHZhciB3ID0gcS53O1xuICAgIHZhciB4ID0gcS54O1xuICAgIHZhciB5ID0gcS55O1xuICAgIHZhciB6ID0gcS56O1xuICAgIHZhciBsZW5ndGggPSBzcXJ0KHcgKiB3ICsgeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcztcbiAgICBsZW5ndGggPSAxIC8gbGVuZ3RoO1xuICAgIG91dHB1dC53ICo9IGxlbmd0aDtcbiAgICBvdXRwdXQueCAqPSBsZW5ndGg7XG4gICAgb3V0cHV0LnkgKj0gbGVuZ3RoO1xuICAgIG91dHB1dC56ICo9IGxlbmd0aDtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBUaGUgY29uanVnYXRlIG9mIHRoZSBpbnB1dCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIHJlZmVyZW5jZSBRdWF0ZXJuaW9uLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBvdXRwdXQgUXVhdGVybmlvbiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBjb25qdWdhdGUgUXVhdGVybmlvbi5cbiAqL1xuUXVhdGVybmlvbi5jb25qdWdhdGUgPSBmdW5jdGlvbiBjb25qdWdhdGUocSwgb3V0cHV0KSB7XG4gICAgb3V0cHV0LncgPSBxLnc7XG4gICAgb3V0cHV0LnggPSAtcS54O1xuICAgIG91dHB1dC55ID0gLXEueTtcbiAgICBvdXRwdXQueiA9IC1xLno7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogQ2xvbmUgdGhlIGlucHV0IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSB0aGUgcmVmZXJlbmNlIFF1YXRlcm5pb24uXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIGNsb25lZCBRdWF0ZXJuaW9uLlxuICovXG5RdWF0ZXJuaW9uLmNsb25lID0gZnVuY3Rpb24gY2xvbmUocSkge1xuICAgIHJldHVybiBuZXcgUXVhdGVybmlvbihxLncsIHEueCwgcS55LCBxLnopO1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIHR3byBpbnB1dCBRdWF0ZXJuaW9ucy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxMSBUaGUgbGVmdCBRdWF0ZXJuaW9uLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxMiBUaGUgcmlnaHQgUXVhdGVybmlvbi5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgdHdvIFF1YXRlcm5pb25zLlxuICovXG5RdWF0ZXJuaW9uLmRvdCA9IGZ1bmN0aW9uIGRvdChxMSwgcTIpIHtcbiAgICByZXR1cm4gcTEudyAqIHEyLncgKyBxMS54ICogcTIueCArIHExLnkgKiBxMi55ICsgcTEueiAqIHEyLno7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1YXRlcm5pb247XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgVmVjMyA9IHJlcXVpcmUoJy4vVmVjMycpO1xuXG5cbnZhciBSYXkgPSBmdW5jdGlvbiAoIG9yaWdpbiwgZGlyZWN0aW9uICkge1xuXG5cdHRoaXMub3JpZ2luID0gKCBvcmlnaW4gIT09IHVuZGVmaW5lZCApID8gIG5ldyBWZWMzKG9yaWdpblswXSxvcmlnaW5bMV0sb3JpZ2luWzJdKSA6IG5ldyBWZWMzKCk7XG5cdHRoaXMuZGlyZWN0aW9uID0gKCBkaXJlY3Rpb24gIT09IHVuZGVmaW5lZCApID8gbmV3IFZlYzMoZGlyZWN0aW9uWzBdLGRpcmVjdGlvblsxXSxkaXJlY3Rpb25bMl0pIDogbmV3IFZlYzMoKTtcblxufTtcblxuUmF5LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoIG9yaWdpbiwgZGlyZWN0aW9uICkge1xuXG5cdFx0dGhpcy5vcmlnaW4uY29weSggb3JpZ2luICk7XG5cdFx0dGhpcy5kaXJlY3Rpb24uY29weSggZGlyZWN0aW9uICk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxufTtcblxuUmF5LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCByYXkgKSB7XG5cblx0XHR0aGlzLm9yaWdpbi5jb3B5KCByYXkub3JpZ2luICk7XG5cdFx0dGhpcy5kaXJlY3Rpb24uY29weSggcmF5LmRpcmVjdGlvbiApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cbn07XG5cblJheS5wcm90b3R5cGUuYXQgPSAgZnVuY3Rpb24gKCB0ICkge1xuXG4gICAgdmFyIHJlc3VsdCA9IG5ldyBWZWMzKCk7XG5cbiAgICByZXR1cm4gcmVzdWx0LmNvcHkoIHRoaXMuZGlyZWN0aW9uICkuc2NhbGUoIHQgKS5hZGQoIHRoaXMub3JpZ2luICk7XG5cbn07XG5cblxuUmF5LnByb3RvdHlwZS5pbnRlcnNlY3RTcGhlcmUgPSBmdW5jdGlvbiAoY2VudGVyLCByYWRpdXMpIHtcblxuXHQvLyBmcm9tIGh0dHA6Ly93d3cuc2NyYXRjaGFwaXhlbC5jb20vbGVzc29ucy8zZC1iYXNpYy1sZXNzb25zL2xlc3Nvbi03LWludGVyc2VjdGluZy1zaW1wbGUtc2hhcGVzL3JheS1zcGhlcmUtaW50ZXJzZWN0aW9uL1xuXG5cdHZhciB2ZWMgPSBuZXcgVmVjMygpO1xuICAgIHZhciBjID0gbmV3IFZlYzMoY2VudGVyWzBdLGNlbnRlclsxXSxjZW50ZXJbMl0pO1xuXG5cdHZlYy5zdWJWZWN0b3JzKCBjLCB0aGlzLm9yaWdpbiApO1xuXG5cdHZhciB0Y2EgPSB2ZWMuZG90KCB0aGlzLmRpcmVjdGlvbiApO1xuXG5cdHZhciBkMiA9IHZlYy5kb3QoIHZlYyApIC0gdGNhICogdGNhO1xuXG5cdHZhciByYWRpdXMyID0gcmFkaXVzICogcmFkaXVzO1xuXG5cdGlmICggZDIgPiByYWRpdXMyICkgcmV0dXJuIG51bGw7XG5cblx0dmFyIHRoYyA9IE1hdGguc3FydCggcmFkaXVzMiAtIGQyICk7XG5cblx0Ly8gdDAgPSBmaXJzdCBpbnRlcnNlY3QgcG9pbnQgLSBlbnRyYW5jZSBvbiBmcm9udCBvZiBzcGhlcmVcblx0dmFyIHQwID0gdGNhIC0gdGhjO1xuXG5cdC8vIHQxID0gc2Vjb25kIGludGVyc2VjdCBwb2ludCAtIGV4aXQgcG9pbnQgb24gYmFjayBvZiBzcGhlcmVcblx0dmFyIHQxID0gdGNhICsgdGhjO1xuXG5cdC8vIHRlc3QgdG8gc2VlIGlmIGJvdGggdDAgYW5kIHQxIGFyZSBiZWhpbmQgdGhlIHJheSAtIGlmIHNvLCByZXR1cm4gbnVsbFxuXHRpZiAoIHQwIDwgMCAmJiB0MSA8IDAgKSByZXR1cm4gbnVsbDtcblxuXHQvLyB0ZXN0IHRvIHNlZSBpZiB0MCBpcyBiZWhpbmQgdGhlIHJheTpcblx0Ly8gaWYgaXQgaXMsIHRoZSByYXkgaXMgaW5zaWRlIHRoZSBzcGhlcmUsIHNvIHJldHVybiB0aGUgc2Vjb25kIGV4aXQgcG9pbnQgc2NhbGVkIGJ5IHQxLFxuXHQvLyBpbiBvcmRlciB0byBhbHdheXMgcmV0dXJuIGFuIGludGVyc2VjdCBwb2ludCB0aGF0IGlzIGluIGZyb250IG9mIHRoZSByYXkuXG5cdGlmICggdDAgPCAwICkgcmV0dXJuIHRoaXMuYXQoIHQxICk7XG5cblx0Ly8gZWxzZSB0MCBpcyBpbiBmcm9udCBvZiB0aGUgcmF5LCBzbyByZXR1cm4gdGhlIGZpcnN0IGNvbGxpc2lvbiBwb2ludCBzY2FsZWQgYnkgdDBcblx0cmV0dXJuIHRoaXMuYXQoIHQwICk7XG5cbn07XG5cblJheS5wcm90b3R5cGUuaW50ZXJzZWN0Qm94ID0gZnVuY3Rpb24oY2VudGVyLCBzaXplKSB7XG5cbiAgICB2YXIgdG1pbixcbiAgICAgICAgdG1heCxcbiAgICAgICAgdHltaW4sXG4gICAgICAgIHR5bWF4LFxuICAgICAgICB0em1pbixcbiAgICAgICAgdHptYXgsXG4gICAgICAgIGJveCxcbiAgICAgICAgb3V0LFxuICAgICAgICBpbnZkaXJ4ID0gMSAvIHRoaXMuZGlyZWN0aW9uLngsXG4gICAgICAgIGludmRpcnkgPSAxIC8gdGhpcy5kaXJlY3Rpb24ueSxcbiAgICAgICAgaW52ZGlyeiA9IDEgLyB0aGlzLmRpcmVjdGlvbi56O1xuXG4gICAgYm94ID0ge1xuICAgICAgICBtaW46IHtcbiAgICAgICAgICAgIHg6IGNlbnRlclswXS0oc2l6ZVswXS8yKSxcbiAgICAgICAgICAgIHk6IGNlbnRlclsxXS0oc2l6ZVsxXS8yKSxcbiAgICAgICAgICAgIHo6IGNlbnRlclsyXS0oc2l6ZVsyXS8yKVxuICAgICAgICB9LFxuICAgICAgICBtYXg6IHtcbiAgICAgICAgICAgIHg6IGNlbnRlclswXSsoc2l6ZVswXS8yKSxcbiAgICAgICAgICAgIHk6IGNlbnRlclsxXSsoc2l6ZVsxXS8yKSxcbiAgICAgICAgICAgIHo6IGNlbnRlclsyXSsoc2l6ZVsyXS8yKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICggaW52ZGlyeCA+PSAwICkge1xuXG4gICAgICAgIHRtaW4gPSAoIGJveC5taW4ueCAtIHRoaXMub3JpZ2luLnggKSAqIGludmRpcng7XG4gICAgICAgIHRtYXggPSAoIGJveC5tYXgueCAtIHRoaXMub3JpZ2luLnggKSAqIGludmRpcng7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRtaW4gPSAoIGJveC5tYXgueCAtIHRoaXMub3JpZ2luLnggKSAqIGludmRpcng7XG4gICAgICAgIHRtYXggPSAoIGJveC5taW4ueCAtIHRoaXMub3JpZ2luLnggKSAqIGludmRpcng7XG4gICAgfVxuXG4gICAgaWYgKCBpbnZkaXJ5ID49IDAgKSB7XG5cbiAgICAgICAgdHltaW4gPSAoIGJveC5taW4ueSAtIHRoaXMub3JpZ2luLnkgKSAqIGludmRpcnk7XG4gICAgICAgIHR5bWF4ID0gKCBib3gubWF4LnkgLSB0aGlzLm9yaWdpbi55ICkgKiBpbnZkaXJ5O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICB0eW1pbiA9ICggYm94Lm1heC55IC0gdGhpcy5vcmlnaW4ueSApICogaW52ZGlyeTtcbiAgICAgICAgdHltYXggPSAoIGJveC5taW4ueSAtIHRoaXMub3JpZ2luLnkgKSAqIGludmRpcnk7XG4gICAgfVxuXG4gICAgaWYgKCAoIHRtaW4gPiB0eW1heCApIHx8ICggdHltaW4gPiB0bWF4ICkgKSByZXR1cm4gbnVsbDtcblxuICAgIGlmICggdHltaW4gPiB0bWluIHx8IHRtaW4gIT09IHRtaW4gKSB0bWluID0gdHltaW47XG5cbiAgICBpZiAoIHR5bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4ICkgdG1heCA9IHR5bWF4O1xuXG4gICAgaWYgKCBpbnZkaXJ6ID49IDAgKSB7XG5cbiAgICAgICAgdHptaW4gPSAoIGJveC5taW4ueiAtIHRoaXMub3JpZ2luLnogKSAqIGludmRpcno7XG4gICAgICAgIHR6bWF4ID0gKCBib3gubWF4LnogLSB0aGlzLm9yaWdpbi56ICkgKiBpbnZkaXJ6O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICB0em1pbiA9ICggYm94Lm1heC56IC0gdGhpcy5vcmlnaW4ueiApICogaW52ZGlyejtcbiAgICAgICAgdHptYXggPSAoIGJveC5taW4ueiAtIHRoaXMub3JpZ2luLnogKSAqIGludmRpcno7XG4gICAgfVxuXG4gICAgaWYgKCAoIHRtaW4gPiB0em1heCApIHx8ICggdHptaW4gPiB0bWF4ICkgKSByZXR1cm4gbnVsbDtcblxuICAgIGlmICggdHptaW4gPiB0bWluIHx8IHRtaW4gIT09IHRtaW4gKSB0bWluID0gdHptaW47XG5cbiAgICBpZiAoIHR6bWF4IDwgdG1heCB8fCB0bWF4ICE9PSB0bWF4ICkgdG1heCA9IHR6bWF4O1xuXG5cbiAgICBpZiAoIHRtYXggPCAwICkgcmV0dXJuIG51bGw7XG5cbiAgICBvdXQgPSB0aGlzLmRpcmVjdGlvbi5zY2FsZSh0bWluID49IDAgPyB0bWluIDogdG1heCk7XG4gICAgcmV0dXJuIG91dC5hZGQob3V0LCB0aGlzLm9yaWdpbiwgb3V0KTtcblxufTtcblxuXG5SYXkucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICggcmF5ICkge1xuXG5cdFx0cmV0dXJuIHJheS5vcmlnaW4uZXF1YWxzKCB0aGlzLm9yaWdpbiApICYmIHJheS5kaXJlY3Rpb24uZXF1YWxzKCB0aGlzLmRpcmVjdGlvbiApO1xuXG59O1xuXG5SYXkucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0cmV0dXJuIG5ldyBSYXkoKS5jb3B5KCB0aGlzICk7XG5cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYXk7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSB0d28tZGltZW5zaW9uYWwgdmVjdG9yLlxuICpcbiAqIEBjbGFzcyBWZWMyXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICovXG52YXIgVmVjMiA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5IHx8IHggaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICAgICAgdGhpcy54ID0geFswXSB8fCAwO1xuICAgICAgICB0aGlzLnkgPSB4WzFdIHx8IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICB9XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoeCwgeSkge1xuICAgIGlmICh4ICE9IG51bGwpIHRoaXMueCA9IHg7XG4gICAgaWYgKHkgIT0gbnVsbCkgdGhpcy55ID0geTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIHRoZSBpbnB1dCB2IHRvIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBUaGUgVmVjMiB0byBhZGQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQodikge1xuICAgIHRoaXMueCArPSB2Lng7XG4gICAgdGhpcy55ICs9IHYueTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIGlucHV0IHYgZnJvbSB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVGhlIFZlYzIgdG8gc3VidHJhY3QuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KHYpIHtcbiAgICB0aGlzLnggLT0gdi54O1xuICAgIHRoaXMueSAtPSB2Lnk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNjYWxlIHRoZSBjdXJyZW50IFZlYzIgYnkgYSBzY2FsYXIgb3IgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ8VmVjMn0gcyBUaGUgTnVtYmVyIG9yIHZlYzIgYnkgd2hpY2ggdG8gc2NhbGUuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIHNjYWxlKHMpIHtcbiAgICBpZiAocyBpbnN0YW5jZW9mIFZlYzIpIHtcbiAgICAgICAgdGhpcy54ICo9IHMueDtcbiAgICAgICAgdGhpcy55ICo9IHMueTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMueCAqPSBzO1xuICAgICAgICB0aGlzLnkgKj0gcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSB0aGUgVmVjMiBjb3VudGVyLWNsb2Nrd2lzZSBieSB0aGV0YSBhYm91dCB0aGUgei1heGlzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGhldGEgQW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24odGhldGEpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcblxuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICB0aGlzLnggPSB4ICogY29zVGhldGEgLSB5ICogc2luVGhldGE7XG4gICAgdGhpcy55ID0geCAqIHNpblRoZXRhICsgeSAqIGNvc1RoZXRhO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiBvZiB0aGUgY3VycmVudCBWZWMyIHdpdGggdGhlIGlucHV0IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2IFRoZSBvdGhlciBWZWMyLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24odikge1xuICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XG59O1xuXG4vKipcbiAqIFRoZSBjcm9zcyBwcm9kdWN0IG9mIG9mIHRoZSBjdXJyZW50IFZlYzIgd2l0aCB0aGUgaW5wdXQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHYgVGhlIG90aGVyIFZlYzIuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54O1xufTtcblxuLyoqXG4gKiBQcmVzZXJ2ZSB0aGUgbWFnbml0dWRlIGJ1dCBpbnZlcnQgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gaW52ZXJ0KCkge1xuICAgIHRoaXMueCAqPSAtMTtcbiAgICB0aGlzLnkgKj0gLTE7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFwcGx5IGEgZnVuY3Rpb24gY29tcG9uZW50LXdpc2UgdG8gdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gYXBwbHkuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAoZm4pIHtcbiAgICB0aGlzLnggPSBmbih0aGlzLngpO1xuICAgIHRoaXMueSA9IGZuKHRoaXMueSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbWFnbml0dWRlIG9mIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gdGhlIGxlbmd0aCBvZiB0aGUgdmVjdG9yXG4gKi9cblZlYzIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIGlucHV0IG9udG8gdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFZlYzIgdG8gY29weVxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkodikge1xuICAgIHRoaXMueCA9IHYueDtcbiAgICB0aGlzLnkgPSB2Lnk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3VycmVudCBWZWMyIGlzIGV4YWN0bHkgMC5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBvciBub3QgdGhlIGxlbmd0aCBpcyAwXG4gKi9cblZlYzIucHJvdG90eXBlLmlzWmVybyA9IGZ1bmN0aW9uIGlzWmVybygpIHtcbiAgICBpZiAodGhpcy54ICE9PSAwIHx8IHRoaXMueSAhPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFRoZSBhcnJheSBmb3JtIG9mIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSB0aGUgVmVjIHRvIGFzIGFuIGFycmF5XG4gKi9cblZlYzIucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldO1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGlucHV0IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBUaGUgcmVmZXJlbmNlIFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dHB1dCBWZWMyIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gVGhlIG5vcm1hbGl6ZWQgVmVjMi5cbiAqL1xuVmVjMi5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUodiwgb3V0cHV0KSB7XG4gICAgdmFyIHggPSB2Lng7XG4gICAgdmFyIHkgPSB2Lnk7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpIHx8IDE7XG4gICAgbGVuZ3RoID0gMSAvIGxlbmd0aDtcbiAgICBvdXRwdXQueCA9IHYueCAqIGxlbmd0aDtcbiAgICBvdXRwdXQueSA9IHYueSAqIGxlbmd0aDtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIENsb25lIHRoZSBpbnB1dCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVGhlIFZlYzIgdG8gY2xvbmUuXG4gKlxuICogQHJldHVybiB7VmVjMn0gVGhlIGNsb25lZCBWZWMyLlxuICovXG5WZWMyLmNsb25lID0gZnVuY3Rpb24gY2xvbmUodikge1xuICAgIHJldHVybiBuZXcgVmVjMih2LngsIHYueSk7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgaW5wdXQgVmVjMidzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYxIFRoZSBsZWZ0IFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IHYyIFRoZSByaWdodCBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSBvdXRwdXQgVmVjMiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IFRoZSByZXN1bHQgb2YgdGhlIGFkZGl0aW9uLlxuICovXG5WZWMyLmFkZCA9IGZ1bmN0aW9uIGFkZCh2MSwgdjIsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdjEueCArIHYyLng7XG4gICAgb3V0cHV0LnkgPSB2MS55ICsgdjIueTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBzZWNvbmQgVmVjMiBmcm9tIHRoZSBmaXJzdC5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2MSBUaGUgbGVmdCBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSB2MiBUaGUgcmlnaHQgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gb3V0cHV0IFZlYzIgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSBUaGUgcmVzdWx0IG9mIHRoZSBzdWJ0cmFjdGlvbi5cbiAqL1xuVmVjMi5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2MS54IC0gdjIueDtcbiAgICBvdXRwdXQueSA9IHYxLnkgLSB2Mi55O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlIHRoZSBpbnB1dCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVGhlIHJlZmVyZW5jZSBWZWMyLlxuICogQHBhcmFtIHtOdW1iZXJ9IHMgTnVtYmVyIHRvIHNjYWxlIGJ5LlxuICogQHBhcmFtIHtWZWMyfSBvdXRwdXQgVmVjMiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IFRoZSByZXN1bHQgb2YgdGhlIHNjYWxpbmcuXG4gKi9cblZlYzIuc2NhbGUgPSBmdW5jdGlvbiBzY2FsZSh2LCBzLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYueCAqIHM7XG4gICAgb3V0cHV0LnkgPSB2LnkgKiBzO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgaW5wdXQgVmVjMidzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYxIFRoZSBsZWZ0IFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IHYyIFRoZSByaWdodCBWZWMyLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0LlxuICovXG5WZWMyLmRvdCA9IGZ1bmN0aW9uIGRvdCh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueTtcbn07XG5cbi8qKlxuICogVGhlIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIGlucHV0IFZlYzIncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHYxIFRoZSBsZWZ0IFZlYzIuXG4gKiBAcGFyYW0ge051bWJlcn0gdjIgVGhlIHJpZ2h0IFZlYzIuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBUaGUgei1jb21wb25lbnQgb2YgdGhlIGNyb3NzIHByb2R1Y3QuXG4gKi9cblZlYzIuY3Jvc3MgPSBmdW5jdGlvbih2MSx2Mikge1xuICAgIHJldHVybiB2MS54ICogdjIueSAtIHYxLnkgKiB2Mi54O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWMyO1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgdGhyZWUtZGltZW5zaW9uYWwgdmVjdG9yLlxuICpcbiAqIEBjbGFzcyBWZWMzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHogVGhlIHogY29tcG9uZW50LlxuICovXG52YXIgVmVjMyA9IGZ1bmN0aW9uKHgsIHksIHope1xuICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgdGhpcy56ID0geiB8fCAwO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHogVGhlIHogY29tcG9uZW50LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHgsIHksIHopIHtcbiAgICBpZiAoeCAhPSBudWxsKSB0aGlzLnggPSB4O1xuICAgIGlmICh5ICE9IG51bGwpIHRoaXMueSA9IHk7XG4gICAgaWYgKHogIT0gbnVsbCkgdGhpcy56ID0gejtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGlucHV0IHYgdG8gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSBWZWMzIHRvIGFkZC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCh2KSB7XG4gICAgdGhpcy54ICs9IHYueDtcbiAgICB0aGlzLnkgKz0gdi55O1xuICAgIHRoaXMueiArPSB2Lno7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIGlucHV0IHYgZnJvbSB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIFZlYzMgdG8gc3VidHJhY3QuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KHYpIHtcbiAgICB0aGlzLnggLT0gdi54O1xuICAgIHRoaXMueSAtPSB2Lnk7XG4gICAgdGhpcy56IC09IHYuejtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgaW5wdXQgYSBmcm9tIGIgYW5kIGNyZWF0ZSBuZXcgdmVjdG9yLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IGEgVGhlIFZlYzMgdG8gc3VidHJhY3QuXG4gKiBAcGFyYW0ge1ZlYzN9IGIgVGhlIFZlYzMgdG8gc3VidHJhY3QuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5zdWJWZWN0b3JzID0gZnVuY3Rpb24gKCBhLCBiICkge1xuXG5cdHRoaXMueCA9IGEueCAtIGIueDtcblx0dGhpcy55ID0gYS55IC0gYi55O1xuXHR0aGlzLnogPSBhLnogLSBiLno7XG5cblx0cmV0dXJuIHRoaXM7XG5cbn07XG5cbi8qKlxuICogUm90YXRlIHRoZSBjdXJyZW50IFZlYzMgYnkgdGhldGEgY2xvY2t3aXNlIGFib3V0IHRoZSB4IGF4aXMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aGV0YSBBbmdsZSBieSB3aGljaCB0byByb3RhdGUuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5yb3RhdGVYID0gZnVuY3Rpb24gcm90YXRlWCh0aGV0YSkge1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcblxuICAgIHRoaXMueSA9IHkgKiBjb3NUaGV0YSAtIHogKiBzaW5UaGV0YTtcbiAgICB0aGlzLnogPSB5ICogc2luVGhldGEgKyB6ICogY29zVGhldGE7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUm90YXRlIHRoZSBjdXJyZW50IFZlYzMgYnkgdGhldGEgY2xvY2t3aXNlIGFib3V0IHRoZSB5IGF4aXMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aGV0YSBBbmdsZSBieSB3aGljaCB0byByb3RhdGUuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5yb3RhdGVZID0gZnVuY3Rpb24gcm90YXRlWSh0aGV0YSkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcblxuICAgIHRoaXMueCA9IHogKiBzaW5UaGV0YSArIHggKiBjb3NUaGV0YTtcbiAgICB0aGlzLnogPSB6ICogY29zVGhldGEgLSB4ICogc2luVGhldGE7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUm90YXRlIHRoZSBjdXJyZW50IFZlYzMgYnkgdGhldGEgY2xvY2t3aXNlIGFib3V0IHRoZSB6IGF4aXMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aGV0YSBBbmdsZSBieSB3aGljaCB0byByb3RhdGUuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5yb3RhdGVaID0gZnVuY3Rpb24gcm90YXRlWih0aGV0YSkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuXG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcblxuICAgIHRoaXMueCA9IHggKiBjb3NUaGV0YSAtIHkgKiBzaW5UaGV0YTtcbiAgICB0aGlzLnkgPSB4ICogc2luVGhldGEgKyB5ICogY29zVGhldGE7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSBjdXJyZW50IFZlYzMgd2l0aCBpbnB1dCBWZWMzIHYuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgb3RoZXIgVmVjMy5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIGRvdCh2KSB7XG4gICAgcmV0dXJuIHRoaXMueCp2LnggKyB0aGlzLnkqdi55ICsgdGhpcy56KnYuejtcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSBjdXJyZW50IFZlYzMgd2l0aCBpbnB1dCBWZWMzIHYuXG4gKiBTdG9yZXMgdGhlIHJlc3VsdCBpbiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2QgY3Jvc3NcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIG90aGVyIFZlYzNcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gY3Jvc3Modikge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIHZ4ID0gdi54O1xuICAgIHZhciB2eSA9IHYueTtcbiAgICB2YXIgdnogPSB2Lno7XG5cbiAgICB0aGlzLnggPSB5ICogdnogLSB6ICogdnk7XG4gICAgdGhpcy55ID0geiAqIHZ4IC0geCAqIHZ6O1xuICAgIHRoaXMueiA9IHggKiB2eSAtIHkgKiB2eDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2NhbGUgdGhlIGN1cnJlbnQgVmVjMyBieSBhIHNjYWxhci5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHMgVGhlIE51bWJlciBieSB3aGljaCB0byBzY2FsZVxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiBzY2FsZShzKSB7XG4gICAgdGhpcy54ICo9IHM7XG4gICAgdGhpcy55ICo9IHM7XG4gICAgdGhpcy56ICo9IHM7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUHJlc2VydmUgdGhlIG1hZ25pdHVkZSBidXQgaW52ZXJ0IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uIGludmVydCgpIHtcbiAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgdGhpcy56ID0gLXRoaXMuejtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBseSBhIGZ1bmN0aW9uIGNvbXBvbmVudC13aXNlIHRvIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGFwcGx5LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwKGZuKSB7XG4gICAgdGhpcy54ID0gZm4odGhpcy54KTtcbiAgICB0aGlzLnkgPSBmbih0aGlzLnkpO1xuICAgIHRoaXMueiA9IGZuKHRoaXMueik7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGhlIG1hZ25pdHVkZSBvZiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBtYWduaXR1ZGUgb2YgdGhlIFZlYzNcbiAqL1xuVmVjMy5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKCkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xufTtcblxuLyoqXG4gKiBUaGUgbWFnbml0dWRlIHNxdWFyZWQgb2YgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBtYWduaXR1ZGUgb2YgdGhlIFZlYzMgc3F1YXJlZFxuICovXG5WZWMzLnByb3RvdHlwZS5sZW5ndGhTcSA9IGZ1bmN0aW9uIGxlbmd0aFNxKCkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgKyB6ICogejtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgaW5wdXQgb250byB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVmVjMyB0byBjb3B5XG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSh2KSB7XG4gICAgdGhpcy54ID0gdi54O1xuICAgIHRoaXMueSA9IHYueTtcbiAgICB0aGlzLnogPSB2Lno7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlc2V0IHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy56ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgbWFnbml0dWRlIG9mIHRoZSBjdXJyZW50IFZlYzMgaXMgZXhhY3RseSAwLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIG9yIG5vdCB0aGUgbWFnbml0dWRlIGlzIHplcm9cbiAqL1xuVmVjMy5wcm90b3R5cGUuaXNaZXJvID0gZnVuY3Rpb24gaXNaZXJvKCkge1xuICAgIHJldHVybiB0aGlzLnggPT09IDAgJiYgdGhpcy55ID09PSAwICYmIHRoaXMueiA9PT0gMDtcbn07XG5cbi8qKlxuICogVGhlIGFycmF5IGZvcm0gb2YgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7QXJyYXl9IGEgdGhyZWUgZWxlbWVudCBhcnJheSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudHMgb2YgdGhlIFZlYzNcbiAqL1xuVmVjMy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy56XTtcbn07XG5cbi8qKlxuICogUHJlc2VydmUgdGhlIG9yaWVudGF0aW9uIGJ1dCBjaGFuZ2UgdGhlIGxlbmd0aCBvZiB0aGUgY3VycmVudCBWZWMzIHRvIDEuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKCkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopIHx8IDE7XG4gICAgbGVuID0gMSAvIGxlbjtcblxuICAgIHRoaXMueCAqPSBsZW47XG4gICAgdGhpcy55ICo9IGxlbjtcbiAgICB0aGlzLnogKj0gbGVuO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBseSB0aGUgcm90YXRpb24gY29ycmVzcG9uZGluZyB0byB0aGUgaW5wdXQgKHVuaXQpIFF1YXRlcm5pb25cbiAqIHRvIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBVbml0IFF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbiB0byBhcHBseVxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuYXBwbHlSb3RhdGlvbiA9IGZ1bmN0aW9uIGFwcGx5Um90YXRpb24ocSkge1xuICAgIHZhciBjdyA9IHEudztcbiAgICB2YXIgY3ggPSAtcS54O1xuICAgIHZhciBjeSA9IC1xLnk7XG4gICAgdmFyIGN6ID0gLXEuejtcblxuICAgIHZhciB2eCA9IHRoaXMueDtcbiAgICB2YXIgdnkgPSB0aGlzLnk7XG4gICAgdmFyIHZ6ID0gdGhpcy56O1xuXG4gICAgdmFyIHR3ID0gLWN4ICogdnggLSBjeSAqIHZ5IC0gY3ogKiB2ejtcbiAgICB2YXIgdHggPSB2eCAqIGN3ICsgdnkgKiBjeiAtIGN5ICogdno7XG4gICAgdmFyIHR5ID0gdnkgKiBjdyArIGN4ICogdnogLSB2eCAqIGN6O1xuICAgIHZhciB0eiA9IHZ6ICogY3cgKyB2eCAqIGN5IC0gY3ggKiB2eTtcblxuICAgIHZhciB3ID0gY3c7XG4gICAgdmFyIHggPSAtY3g7XG4gICAgdmFyIHkgPSAtY3k7XG4gICAgdmFyIHogPSAtY3o7XG5cbiAgICB0aGlzLnggPSB0eCAqIHcgKyB4ICogdHcgKyB5ICogdHogLSB0eSAqIHo7XG4gICAgdGhpcy55ID0gdHkgKiB3ICsgeSAqIHR3ICsgdHggKiB6IC0geCAqIHR6O1xuICAgIHRoaXMueiA9IHR6ICogdyArIHogKiB0dyArIHggKiB0eSAtIHR4ICogeTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwbHkgdGhlIGlucHV0IE1hdDMzIHRoZSB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXggTWF0MzMgdG8gYXBwbHlcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmFwcGx5TWF0cml4ID0gZnVuY3Rpb24gYXBwbHlNYXRyaXgobWF0cml4KSB7XG4gICAgdmFyIE0gPSBtYXRyaXguZ2V0KCk7XG5cbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHRoaXMueCA9IE1bMF0qeCArIE1bMV0qeSArIE1bMl0qejtcbiAgICB0aGlzLnkgPSBNWzNdKnggKyBNWzRdKnkgKyBNWzVdKno7XG4gICAgdGhpcy56ID0gTVs2XSp4ICsgTVs3XSp5ICsgTVs4XSp6O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGlucHV0IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgcmVmZXJlbmNlIFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIG5vcm1hbGl6ZSBWZWMzLlxuICovXG5WZWMzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZSh2LCBvdXRwdXQpIHtcbiAgICB2YXIgeCA9IHYueDtcbiAgICB2YXIgeSA9IHYueTtcbiAgICB2YXIgeiA9IHYuejtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSB8fCAxO1xuICAgIGxlbmd0aCA9IDEgLyBsZW5ndGg7XG5cbiAgICBvdXRwdXQueCA9IHggKiBsZW5ndGg7XG4gICAgb3V0cHV0LnkgPSB5ICogbGVuZ3RoO1xuICAgIG91dHB1dC56ID0geiAqIGxlbmd0aDtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBBcHBseSBhIHJvdGF0aW9uIHRvIHRoZSBpbnB1dCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIHJlZmVyZW5jZSBWZWMzLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFVuaXQgUXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uIHRvIGFwcGx5LlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByb3RhdGVkIHZlcnNpb24gb2YgdGhlIGlucHV0IFZlYzMuXG4gKi9cblZlYzMuYXBwbHlSb3RhdGlvbiA9IGZ1bmN0aW9uIGFwcGx5Um90YXRpb24odiwgcSwgb3V0cHV0KSB7XG4gICAgdmFyIGN3ID0gcS53O1xuICAgIHZhciBjeCA9IC1xLng7XG4gICAgdmFyIGN5ID0gLXEueTtcbiAgICB2YXIgY3ogPSAtcS56O1xuXG4gICAgdmFyIHZ4ID0gdi54O1xuICAgIHZhciB2eSA9IHYueTtcbiAgICB2YXIgdnogPSB2Lno7XG5cbiAgICB2YXIgdHcgPSAtY3ggKiB2eCAtIGN5ICogdnkgLSBjeiAqIHZ6O1xuICAgIHZhciB0eCA9IHZ4ICogY3cgKyB2eSAqIGN6IC0gY3kgKiB2ejtcbiAgICB2YXIgdHkgPSB2eSAqIGN3ICsgY3ggKiB2eiAtIHZ4ICogY3o7XG4gICAgdmFyIHR6ID0gdnogKiBjdyArIHZ4ICogY3kgLSBjeCAqIHZ5O1xuXG4gICAgdmFyIHcgPSBjdztcbiAgICB2YXIgeCA9IC1jeDtcbiAgICB2YXIgeSA9IC1jeTtcbiAgICB2YXIgeiA9IC1jejtcblxuICAgIG91dHB1dC54ID0gdHggKiB3ICsgeCAqIHR3ICsgeSAqIHR6IC0gdHkgKiB6O1xuICAgIG91dHB1dC55ID0gdHkgKiB3ICsgeSAqIHR3ICsgdHggKiB6IC0geCAqIHR6O1xuICAgIG91dHB1dC56ID0gdHogKiB3ICsgeiAqIHR3ICsgeCAqIHR5IC0gdHggKiB5O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIENsb25lIHRoZSBpbnB1dCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIFZlYzMgdG8gY2xvbmUuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIGNsb25lZCBWZWMzLlxuICovXG5WZWMzLmNsb25lID0gZnVuY3Rpb24gY2xvbmUodikge1xuICAgIHJldHVybiBuZXcgVmVjMyh2LngsIHYueSwgdi56KTtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBpbnB1dCBWZWMzJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdjEgVGhlIGxlZnQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gdjIgVGhlIHJpZ2h0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJlc3VsdCBvZiB0aGUgYWRkaXRpb24uXG4gKi9cblZlYzMuYWRkID0gZnVuY3Rpb24gYWRkKHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2MS54ICsgdjIueDtcbiAgICBvdXRwdXQueSA9IHYxLnkgKyB2Mi55O1xuICAgIG91dHB1dC56ID0gdjEueiArIHYyLno7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIHNlY29uZCBWZWMzIGZyb20gdGhlIGZpcnN0LlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYxIFRoZSBsZWZ0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IHYyIFRoZSByaWdodCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByZXN1bHQgb2YgdGhlIHN1YnRyYWN0aW9uLlxuICovXG5WZWMzLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QodjEsIHYyLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYxLnggLSB2Mi54O1xuICAgIG91dHB1dC55ID0gdjEueSAtIHYyLnk7XG4gICAgb3V0cHV0LnogPSB2MS56IC0gdjIuejtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTY2FsZSB0aGUgaW5wdXQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSByZWZlcmVuY2UgVmVjMy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzIE51bWJlciB0byBzY2FsZSBieS5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcmVzdWx0IG9mIHRoZSBzY2FsaW5nLlxuICovXG5WZWMzLnNjYWxlID0gZnVuY3Rpb24gc2NhbGUodiwgcywgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2LnggKiBzO1xuICAgIG91dHB1dC55ID0gdi55ICogcztcbiAgICBvdXRwdXQueiA9IHYueiAqIHM7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU2NhbGUgYW5kIGFkZCB0aGUgaW5wdXQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSByZWZlcmVuY2UgVmVjMy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzIE51bWJlciB0byBzY2FsZSBieS5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcmVzdWx0IG9mIHRoZSBzY2FsaW5nLlxuICovXG5WZWMzLnByb3RvdHlwZS5zY2FsZUFuZEFkZCA9IGZ1bmN0aW9uIHNjYWxlQW5kQWRkKGEsIGIsIHMpIHtcbiAgICB0aGlzLnggPSBhLnggKyAoYi54ICogcyk7XG4gICAgdGhpcy55ID0gYS55ICsgKGIueSAqIHMpO1xuICAgIHRoaXMueiA9IGEueiArIChiLnogKiBzKTtcbn07XG5cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cblZlYzMucHJvdG90eXBlLnNxdWFyZWREaXN0YW5jZSA9IGZ1bmN0aW9uIHNxdWFyZWREaXN0YW5jZShiKSB7XG4gICAgdmFyIHggPSBiLnggLSB0aGlzLngsXG4gICAgICAgIHkgPSBiLnkgLSB0aGlzLnksXG4gICAgICAgIHogPSBiLnogLSB0aGlzLno7XG4gICAgcmV0dXJuIHgqeCArIHkqeSArIHoqelxufTtcblxuVmVjMy5wcm90b3R5cGUuZGlzdGFuY2VUbyA9IGZ1bmN0aW9uICggdiApIHtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoIHRoaXMuc3F1YXJlZERpc3RhbmNlKCB2ICkgKTtcblxufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIGlucHV0IFZlYzMncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2MSBUaGUgbGVmdCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSB2MiBUaGUgcmlnaHQgVmVjMy5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdC5cbiAqL1xuVmVjMy5kb3QgPSBmdW5jdGlvbiBkb3QodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnkgKyB2MS56ICogdjIuejtcbn07XG5cbi8qKlxuICogVGhlIChyaWdodC1oYW5kZWQpIGNyb3NzIHByb2R1Y3Qgb2YgdGhlIGlucHV0IFZlYzMncy5cbiAqIHYxIHggdjIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdjEgVGhlIGxlZnQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gdjIgVGhlIHJpZ2h0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IHRoZSByZXN1bHQgb2YgdGhlIGNyb3NzIHByb2R1Y3Qgd2FzIHBsYWNlZCBpbnRvXG4gKi9cblZlYzMuY3Jvc3MgPSBmdW5jdGlvbiBjcm9zcyh2MSwgdjIsIG91dHB1dCkge1xuICAgIHZhciB4MSA9IHYxLng7XG4gICAgdmFyIHkxID0gdjEueTtcbiAgICB2YXIgejEgPSB2MS56O1xuICAgIHZhciB4MiA9IHYyLng7XG4gICAgdmFyIHkyID0gdjIueTtcbiAgICB2YXIgejIgPSB2Mi56O1xuXG4gICAgb3V0cHV0LnggPSB5MSAqIHoyIC0gejEgKiB5MjtcbiAgICBvdXRwdXQueSA9IHoxICogeDIgLSB4MSAqIHoyO1xuICAgIG91dHB1dC56ID0geDEgKiB5MiAtIHkxICogeDI7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogVGhlIHByb2plY3Rpb24gb2YgdjEgb250byB2Mi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2MSBUaGUgbGVmdCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSB2MiBUaGUgcmlnaHQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBvYmplY3QgdGhlIHJlc3VsdCBvZiB0aGUgY3Jvc3MgcHJvZHVjdCB3YXMgcGxhY2VkIGludG9cbiAqL1xuVmVjMy5wcm9qZWN0ID0gZnVuY3Rpb24gcHJvamVjdCh2MSwgdjIsIG91dHB1dCkge1xuICAgIHZhciB4MSA9IHYxLng7XG4gICAgdmFyIHkxID0gdjEueTtcbiAgICB2YXIgejEgPSB2MS56O1xuICAgIHZhciB4MiA9IHYyLng7XG4gICAgdmFyIHkyID0gdjIueTtcbiAgICB2YXIgejIgPSB2Mi56O1xuXG4gICAgdmFyIHNjYWxlID0geDEgKiB4MiArIHkxICogeTIgKyB6MSAqIHoyO1xuICAgIHNjYWxlIC89IHgyICogeDIgKyB5MiAqIHkyICsgejIgKiB6MjtcblxuICAgIG91dHB1dC54ID0geDIgKiBzY2FsZTtcbiAgICBvdXRwdXQueSA9IHkyICogc2NhbGU7XG4gICAgb3V0cHV0LnogPSB6MiAqIHNjYWxlO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblZlYzMucHJvdG90eXBlLmNyZWF0ZUZyb21BcnJheSA9IGZ1bmN0aW9uKGEpe1xuICAgIHRoaXMueCA9IGFbMF0gfHwgMDtcbiAgICB0aGlzLnkgPSBhWzFdIHx8IDA7XG4gICAgdGhpcy56ID0gYVsyXSB8fCAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWZWMzO1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTWF0MzM6IHJlcXVpcmUoJy4vTWF0MzMnKSxcbiAgICBRdWF0ZXJuaW9uOiByZXF1aXJlKCcuL1F1YXRlcm5pb24nKSxcbiAgICBWZWMyOiByZXF1aXJlKCcuL1ZlYzInKSxcbiAgICBWZWMzOiByZXF1aXJlKCcuL1ZlYzMnKSxcbiAgICBSYXk6IHJlcXVpcmUoJy4vUmF5Jylcbn07XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKmpzaGludCAtVzAwOCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBsaWJyYXJ5IG9mIGN1cnZlcyB3aGljaCBtYXAgYW4gYW5pbWF0aW9uIGV4cGxpY2l0bHkgYXMgYSBmdW5jdGlvbiBvZiB0aW1lLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGxpbmVhclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZWFzZUluXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlT3V0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlSW5PdXRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVhc2VPdXRCb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IHNwcmluZ1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5RdWFkXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRRdWFkXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dFF1YWRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluQ3ViaWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEN1YmljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEN1YmljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpblF1YXJ0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRRdWFydFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRRdWFydFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5RdWludFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0UXVpbnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0UXVpbnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluU2luZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0U2luZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRTaW5lXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkV4cG9cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEV4cG9cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0RXhwXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkNpcmNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dENpcmNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0Q2lyY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5FbGFzdGljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRFbGFzdGljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEVsYXN0aWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluQm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRCb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0Qm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBmbGF0ICAgICAgICAgICAgLSBVc2VmdWwgZm9yIGRlbGF5aW5nIHRoZSBleGVjdXRpb24gb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgc3Vic2VxdWVudCB0cmFuc2l0aW9uLlxuICovXG52YXIgQ3VydmVzID0ge1xuICAgIGxpbmVhcjogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9LFxuXG4gICAgZWFzZUluOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQ7XG4gICAgfSxcblxuICAgIGVhc2VPdXQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqKDItdCk7XG4gICAgfSxcblxuICAgIGVhc2VJbk91dDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodCA8PSAwLjUpIHJldHVybiAyKnQqdDtcbiAgICAgICAgZWxzZSByZXR1cm4gLTIqdCp0ICsgNCp0IC0gMTtcbiAgICB9LFxuXG4gICAgZWFzZU91dEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCooMyAtIDIqdCk7XG4gICAgfSxcblxuICAgIHNwcmluZzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKDEgLSB0KSAqIE1hdGguc2luKDYgKiBNYXRoLlBJICogdCkgKyB0O1xuICAgIH0sXG5cbiAgICBpblF1YWQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdDtcbiAgICB9LFxuXG4gICAgb3V0UXVhZDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLSh0LT0xKSp0KzE7XG4gICAgfSxcblxuICAgIGluT3V0UXVhZDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQ7XG4gICAgICAgIHJldHVybiAtLjUqKCgtLXQpKih0LTIpIC0gMSk7XG4gICAgfSxcblxuICAgIGluQ3ViaWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdCp0O1xuICAgIH0sXG5cbiAgICBvdXRDdWJpYzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKCgtLXQpKnQqdCArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dEN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdCp0O1xuICAgICAgICByZXR1cm4gLjUqKCh0LT0yKSp0KnQgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5RdWFydDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0KnQqdDtcbiAgICB9LFxuXG4gICAgb3V0UXVhcnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0oKC0tdCkqdCp0KnQgLSAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRRdWFydDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQqdCp0O1xuICAgICAgICByZXR1cm4gLS41ICogKCh0LT0yKSp0KnQqdCAtIDIpO1xuICAgIH0sXG5cbiAgICBpblF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQqdCp0KnQ7XG4gICAgfSxcblxuICAgIG91dFF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAoKC0tdCkqdCp0KnQqdCArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dFF1aW50OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdCp0KnQqdDtcbiAgICAgICAgcmV0dXJuIC41KigodC09MikqdCp0KnQqdCArIDIpO1xuICAgIH0sXG5cbiAgICBpblNpbmU6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0xLjAqTWF0aC5jb3ModCAqIChNYXRoLlBJLzIpKSArIDEuMDtcbiAgICB9LFxuXG4gICAgb3V0U2luZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zaW4odCAqIChNYXRoLlBJLzIpKTtcbiAgICB9LFxuXG4gICAgaW5PdXRTaW5lOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtLjUqKE1hdGguY29zKE1hdGguUEkqdCkgLSAxKTtcbiAgICB9LFxuXG4gICAgaW5FeHBvOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAodD09PTApID8gMC4wIDogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcbiAgICB9LFxuXG4gICAgb3V0RXhwbzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKHQ9PT0xLjApID8gMS4wIDogKC1NYXRoLnBvdygyLCAtMTAgKiB0KSArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dEV4cG86IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wO1xuICAgICAgICBpZiAodD09PTEuMCkgcmV0dXJuIDEuMDtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuICAgICAgICByZXR1cm4gLjUgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5DaXJjOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtKE1hdGguc3FydCgxIC0gdCp0KSAtIDEpO1xuICAgIH0sXG5cbiAgICBvdXRDaXJjOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoMSAtICgtLXQpKnQpO1xuICAgIH0sXG5cbiAgICBpbk91dENpcmM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLS41ICogKE1hdGguc3FydCgxIC0gdCp0KSAtIDEpO1xuICAgICAgICByZXR1cm4gLjUgKiAoTWF0aC5zcXJ0KDEgLSAodC09MikqdCkgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5FbGFzdGljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT0xLjA7XG4gICAgICAgIGlmICh0PT09MCkgcmV0dXJuIDAuMDsgIGlmICh0PT09MSkgcmV0dXJuIDEuMDsgIGlmICghcCkgcD0uMztcbiAgICAgICAgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4oMS4wL2EpO1xuICAgICAgICByZXR1cm4gLShhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpLyBwKSk7XG4gICAgfSxcblxuICAgIG91dEVsYXN0aWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPTEuMDtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wOyAgaWYgKHQ9PT0xKSByZXR1cm4gMS4wOyAgaWYgKCFwKSBwPS4zO1xuICAgICAgICBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbigxLjAvYSk7XG4gICAgICAgIHJldHVybiBhKk1hdGgucG93KDIsLTEwKnQpICogTWF0aC5zaW4oKHQtcykqKDIqTWF0aC5QSSkvcCkgKyAxLjA7XG4gICAgfSxcblxuICAgIGluT3V0RWxhc3RpYzogZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9MS4wO1xuICAgICAgICBpZiAodD09PTApIHJldHVybiAwLjA7ICBpZiAoKHQvPS41KT09PTIpIHJldHVybiAxLjA7ICBpZiAoIXApIHA9KC4zKjEuNSk7XG4gICAgICAgIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luKDEuMC9hKTtcbiAgICAgICAgaWYgKHQgPCAxKSByZXR1cm4gLS41KihhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpL3ApKTtcbiAgICAgICAgcmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqKHQtPTEpKSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpL3ApKi41ICsgMS4wO1xuICAgIH0sXG5cbiAgICBpbkJhY2s6IGZ1bmN0aW9uKHQsIHMpIHtcbiAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiB0KnQqKChzKzEpKnQgLSBzKTtcbiAgICB9LFxuXG4gICAgb3V0QmFjazogZnVuY3Rpb24odCwgcykge1xuICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcbiAgICAgICAgcmV0dXJuICgoLS10KSp0KigocysxKSp0ICsgcykgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRCYWNrOiBmdW5jdGlvbih0LCBzKSB7XG4gICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSoodCp0KigoKHMqPSgxLjUyNSkpKzEpKnQgLSBzKSk7XG4gICAgICAgIHJldHVybiAuNSooKHQtPTIpKnQqKCgocyo9KDEuNTI1KSkrMSkqdCArIHMpICsgMik7XG4gICAgfSxcblxuICAgIGluQm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAxLjAgLSBDdXJ2ZXMub3V0Qm91bmNlKDEuMC10KTtcbiAgICB9LFxuXG4gICAgb3V0Qm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICh0IDwgKDEvMi43NSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1KnQqdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDcuNTYyNSoodC09KDEuNS8yLjc1KSkqdCArIC43NSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodCA8ICgyLjUvMi43NSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1Kih0LT0oMi4yNS8yLjc1KSkqdCArIC45Mzc1KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1Kih0LT0oMi42MjUvMi43NSkpKnQgKyAuOTg0Mzc1KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbk91dEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodCA8IC41KSByZXR1cm4gQ3VydmVzLmluQm91bmNlKHQqMikgKiAuNTtcbiAgICAgICAgcmV0dXJuIEN1cnZlcy5vdXRCb3VuY2UodCoyLTEuMCkgKiAuNSArIC41O1xuICAgIH0sXG5cbiAgICBmbGF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJ2ZXM7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBDdXJ2ZXMgPSByZXF1aXJlKCcuL0N1cnZlcycpO1xudmFyIEVuZ2luZSA9IHJlcXVpcmUoJy4uL2NvcmUvRW5naW5lJyk7XG5cbi8qKlxuICogQSBzdGF0ZSBtYWludGFpbmVyIGZvciBhIHNtb290aCB0cmFuc2l0aW9uIGJldHdlZW5cbiAqICAgIG51bWVyaWNhbGx5LXNwZWNpZmllZCBzdGF0ZXMuIEV4YW1wbGUgbnVtZXJpYyBzdGF0ZXMgaW5jbHVkZSBmbG9hdHMgYW5kXG4gKiAgICBhcnJheXMgb2YgZmxvYXRzIG9iamVjdHMuXG4gKlxuICogQW4gaW5pdGlhbCBzdGF0ZSBpcyBzZXQgd2l0aCB0aGUgY29uc3RydWN0b3Igb3IgdXNpbmdcbiAqICAgICB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZnJvbX0uIFN1YnNlcXVlbnQgdHJhbnNpdGlvbnMgY29uc2lzdCBvZiBhblxuICogICAgIGludGVybWVkaWF0ZSBzdGF0ZSwgZWFzaW5nIGN1cnZlLCBkdXJhdGlvbiBhbmQgY2FsbGJhY2suIFRoZSBmaW5hbCBzdGF0ZVxuICogICAgIG9mIGVhY2ggdHJhbnNpdGlvbiBpcyB0aGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgc3Vic2VxdWVudCBvbmUuIENhbGxzIHRvXG4gKiAgICAge0BsaW5rIFRyYW5zaXRpb25hYmxlI2dldH0gcHJvdmlkZSB0aGUgaW50ZXJwb2xhdGVkIHN0YXRlIGFsb25nIHRoZSB3YXkuXG4gKlxuICogTm90ZSB0aGF0IHRoZXJlIGlzIG5vIGV2ZW50IGxvb3AgaGVyZSAtIGNhbGxzIHRvIHtAbGluayBUcmFuc2l0aW9uYWJsZSNnZXR9XG4gKiAgICBhcmUgdGhlIG9ubHkgd2F5IHRvIGZpbmQgc3RhdGUgcHJvamVjdGVkIHRvIHRoZSBjdXJyZW50IChvciBwcm92aWRlZClcbiAqICAgIHRpbWUgYW5kIGFyZSB0aGUgb25seSB3YXkgdG8gdHJpZ2dlciBjYWxsYmFja3MgYW5kIG11dGF0ZSB0aGUgaW50ZXJuYWxcbiAqICAgIHRyYW5zaXRpb24gcXVldWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciB0ID0gbmV3IFRyYW5zaXRpb25hYmxlKFswLCAwXSk7XG4gKiB0XG4gKiAgICAgLnRvKFsxMDAsIDBdLCAnbGluZWFyJywgMTAwMClcbiAqICAgICAuZGVsYXkoMTAwMClcbiAqICAgICAudG8oWzIwMCwgMF0sICdvdXRCb3VuY2UnLCAxMDAwKTtcbiAqXG4gKiB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiBkaXYuc3R5bGUuYmFja2dyb3VuZCA9ICdibHVlJztcbiAqIGRpdi5zdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gKiBkaXYuc3R5bGUuaGVpZ2h0ID0gJzEwMHB4JztcbiAqIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAqXG4gKiBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAqICAgICB0LmlzUGF1c2VkKCkgPyB0LnJlc3VtZSgpIDogdC5wYXVzZSgpO1xuICogfSk7XG4gKlxuICogcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGxvb3AoKSB7XG4gKiAgICAgZGl2LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyB0LmdldCgpWzBdICsgJ3B4KScgKyAnIHRyYW5zbGF0ZVkoJyArIHQuZ2V0KClbMV0gKyAncHgpJztcbiAqICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gKiB9KTtcbiAqXG4gKiBAY2xhc3MgVHJhbnNpdGlvbmFibGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSBpbml0aWFsU3RhdGUgICAgaW5pdGlhbCBzdGF0ZSB0byB0cmFuc2l0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC0gZXF1aXZhbGVudCB0byBhIHB1cnN1YW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZvY2F0aW9uIG9mXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZnJvbX1cbiAqL1xuIHZhciBwZXJmb3JtYW5jZSA9IHt9O1xuXG4gKGZ1bmN0aW9uKCl7XG5cbiAgIERhdGUubm93ID0gKERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHsgIC8vIHRoYW5rcyBJRThcbiBcdCAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgfSk7XG5cbiAgIGlmIChcIm5vd1wiIGluIHBlcmZvcm1hbmNlID09IGZhbHNlKXtcblxuICAgICB2YXIgbm93T2Zmc2V0ID0gRGF0ZS5ub3coKTtcblxuICAgICBpZiAocGVyZm9ybWFuY2UudGltaW5nICYmIHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQpe1xuICAgICAgIG5vd09mZnNldCA9IHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbiAgICAgfVxuXG4gICAgIHBlcmZvcm1hbmNlLm5vdyA9IGZ1bmN0aW9uIG5vdygpe1xuICAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbm93T2Zmc2V0O1xuICAgICB9XG4gICB9XG5cbiB9KSgpO1xuXG5mdW5jdGlvbiBUcmFuc2l0aW9uYWJsZShpbml0aWFsU3RhdGUsIHBhcmFtLCBsb29wKSB7XG4gICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgICB0aGlzLl9mcm9tID0gbnVsbDtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gbnVsbDtcbiAgICB0aGlzLl9wYXVzZWRBdCA9IG51bGw7XG4gICAgdGhpcy5fbG9vcCA9IGxvb3AgfHwgbnVsbDtcbiAgICB0aGlzLmlkID0gbnVsbDtcbiAgICBwYXJhbSA/IHRoaXMucGFyYW0gPSBwYXJhbSA6IHBhcmFtID0gbnVsbDtcbiAgICBpZiAoaW5pdGlhbFN0YXRlICE9IG51bGwpIHRoaXMuZnJvbShpbml0aWFsU3RhdGUpO1xuICAgIEVuZ2luZS51cGRhdGVRdWV1ZS5wdXNoKHRoaXMpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhIHRyYW5zaXRpb24gdG8gYmUgcHVzaGVkIG9udG8gdGhlIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBtZXRob2QgdG9cbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBmaW5hbFN0YXRlICAgICAgICAgICAgICBmaW5hbCBzdGF0ZSB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdG9uIHRvXG4gKiBAcGFyYW0gIHtTdHJpbmd8RnVuY3Rpb259ICAgICAgICBbY3VydmU9Q3VydmVzLmxpbmVhcl0gICBlYXNpbmcgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQgZm9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbMCwgMV1cbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFtkdXJhdGlvbj0xMDBdICAgICAgICAgIGR1cmF0aW9uIG9mXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgICAgICBbY2FsbGJhY2tdICAgICAgICAgICAgICBjYWxsYmFjayBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYmUgY2FsbGVkIGFmdGVyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdHJhbnNpdGlvbiBpc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgIFttZXRob2RdICAgICAgICAgICAgICAgIG1ldGhvZCB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGUuZy4gc2xlcnApXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIHRvKGZpbmFsU3RhdGUsIGN1cnZlLCBkdXJhdGlvbiwgY2FsbGJhY2ssIG1ldGhvZCkge1xuXG4gICAgY3VydmUgPSBjdXJ2ZSAhPSBudWxsICYmIGN1cnZlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcgPyBDdXJ2ZXNbY3VydmVdIDogY3VydmU7XG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9zdGFydGVkQXQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3F1ZXVlLnB1c2goXG4gICAgICAgIGZpbmFsU3RhdGUsXG4gICAgICAgIGN1cnZlICE9IG51bGwgPyBjdXJ2ZSA6IEN1cnZlcy5saW5lYXIsXG4gICAgICAgIGR1cmF0aW9uICE9IG51bGwgPyBkdXJhdGlvbiA6IDEwMCxcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIG1ldGhvZFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXRzIHRoZSB0cmFuc2l0aW9uIHF1ZXVlIHRvIGEgc3RhYmxlIGluaXRpYWwgc3RhdGUuXG4gKlxuICogQG1ldGhvZCBmcm9tXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgaW5pdGlhbFN0YXRlICAgIGluaXRpYWwgc3RhdGUgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uIGZyb21cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbiBmcm9tKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuX3N0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIHRoaXMuX2Zyb20gPSB0aGlzLl9zeW5jKG51bGwsIHRoaXMuX3N0YXRlKTtcbiAgICB0aGlzLl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRGVsYXlzIHRoZSBleGVjdXRpb24gb2YgdGhlIHN1YnNlcXVlbnQgdHJhbnNpdGlvbiBmb3IgYSBjZXJ0YWluIHBlcmlvZCBvZlxuICogdGltZS5cbiAqXG4gKiBAbWV0aG9kIGRlbGF5XG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgZHVyYXRpb24gICAgZGVsYXkgdGltZSBpbiBtc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgW2NhbGxiYWNrXSAgWmVyby1hcmd1bWVudCBmdW5jdGlvbiB0byBjYWxsIG9uIG9ic2VydmVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uICh0PTEpXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5kZWxheSA9IGZ1bmN0aW9uIGRlbGF5KGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICAgIHZhciBlbmRTdGF0ZSA9IHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDAgPyB0aGlzLl9xdWV1ZVt0aGlzLl9xdWV1ZS5sZW5ndGggLSA1XSA6IHRoaXMuX3N0YXRlO1xuICAgIHJldHVybiB0aGlzLnRvKGVuZFN0YXRlLCBDdXJ2ZXMuZmxhdCwgZHVyYXRpb24sIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogT3ZlcnJpZGVzIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqXG4gKiBAbWV0aG9kIG92ZXJyaWRlXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgW2ZpbmFsU3RhdGVdICAgIGZpbmFsIHN0YXRlIHRvIHRyYW5zaXRvbiB0b1xuICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgICAgICAgW2N1cnZlXSAgICAgICAgIGVhc2luZyBmdW5jdGlvbiB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpbmcgWzAsIDFdXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbZHVyYXRpb25dICAgICAgZHVyYXRpb24gb2YgdHJhbnNpdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgICAgICAgICAgW2NhbGxiYWNrXSAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgY29tcGxldGVcbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICAgICAgICAgIFttZXRob2RdICAgICAgICBvcHRpb25hbCBtZXRob2QgdXNlZCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLiBTZXQgdG8gYHNsZXJwYCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWwgbGluZWFyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGlvbi5cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLm92ZXJyaWRlID0gZnVuY3Rpb24gb3ZlcnJpZGUoZmluYWxTdGF0ZSwgY3VydmUsIGR1cmF0aW9uLCBjYWxsYmFjaywgbWV0aG9kKSB7XG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKGZpbmFsU3RhdGUgIT0gbnVsbCkgdGhpcy5fcXVldWVbMF0gPSBmaW5hbFN0YXRlO1xuICAgICAgICBpZiAoY3VydmUgIT0gbnVsbCkgICAgICB0aGlzLl9xdWV1ZVsxXSA9IGN1cnZlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcgPyBDdXJ2ZXNbY3VydmVdIDogY3VydmU7XG4gICAgICAgIGlmIChkdXJhdGlvbiAhPSBudWxsKSAgIHRoaXMuX3F1ZXVlWzJdID0gZHVyYXRpb247XG4gICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSAgIHRoaXMuX3F1ZXVlWzNdID0gY2FsbGJhY2s7XG4gICAgICAgIGlmIChtZXRob2QgIT0gbnVsbCkgICAgIHRoaXMuX3F1ZXVlWzRdID0gbWV0aG9kO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBVc2VkIGZvciBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgc3RhdGUgb2YgdGhlIGN1cnJlbnRseVxuICogcnVubmluZyB0cmFuc2l0aW9uXG4gKlxuICogQG1ldGhvZCAgX2ludGVycG9sYXRlXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheXxOdW1iZXJ9IG91dHB1dCAgICAgV2hlcmUgdG8gd3JpdGUgdG8gKGluIG9yZGVyIHRvIGF2b2lkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCBhbGxvY2F0aW9uIGFuZCB0aGVyZWZvcmUgR0MpLlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fE51bWJlcn0gZnJvbSAgICAgICBTdGFydCBzdGF0ZSBvZiBjdXJyZW50IHRyYW5zaXRpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl8TnVtYmVyfSB0byAgICAgICAgIEVuZCBzdGF0ZSBvZiBjdXJyZW50IHRyYW5zaXRpb24uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHByb2dyZXNzICAgICAgICAgICAgICAgIFByb2dyZXNzIG9mIHRoZSBjdXJyZW50IHRyYW5zaXRpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIFswLCAxXVxuICogQHBhcmFtICB7U3RyaW5nfSBtZXRob2QgICAgICAgICAgICAgICAgICBNZXRob2QgdXNlZCBmb3IgaW50ZXJwb2xhdGlvbiAoZS5nLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGVycClcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheXxOdW1iZXJ9ICAgICAgICAgICAgb3V0cHV0XG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5faW50ZXJwb2xhdGUgPSBmdW5jdGlvbiBfaW50ZXJwb2xhdGUob3V0cHV0LCBmcm9tLCB0bywgcHJvZ3Jlc3MsIG1ldGhvZCkge1xuICAgIGlmICh0byBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSAnc2xlcnAnKSB7XG4gICAgICAgICAgICB2YXIgeCwgeSwgeiwgdztcbiAgICAgICAgICAgIHZhciBxeCwgcXksIHF6LCBxdztcbiAgICAgICAgICAgIHZhciBvbWVnYSwgY29zb21lZ2EsIHNpbm9tZWdhLCBzY2FsZUZyb20sIHNjYWxlVG87XG5cbiAgICAgICAgICAgIHggPSBmcm9tWzBdO1xuICAgICAgICAgICAgeSA9IGZyb21bMV07XG4gICAgICAgICAgICB6ID0gZnJvbVsyXTtcbiAgICAgICAgICAgIHcgPSBmcm9tWzNdO1xuXG4gICAgICAgICAgICBxeCA9IHRvWzBdO1xuICAgICAgICAgICAgcXkgPSB0b1sxXTtcbiAgICAgICAgICAgIHF6ID0gdG9bMl07XG4gICAgICAgICAgICBxdyA9IHRvWzNdO1xuXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMF0gPSBxeDtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMV0gPSBxeTtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMl0gPSBxejtcbiAgICAgICAgICAgICAgICBvdXRwdXRbM10gPSBxdztcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3NvbWVnYSA9IHcgKiBxdyArIHggKiBxeCArIHkgKiBxeSArIHogKiBxejtcbiAgICAgICAgICAgIGlmICgoMS4wIC0gY29zb21lZ2EpID4gMWUtNSkge1xuICAgICAgICAgICAgICAgIG9tZWdhID0gTWF0aC5hY29zKGNvc29tZWdhKTtcbiAgICAgICAgICAgICAgICBzaW5vbWVnYSA9IE1hdGguc2luKG9tZWdhKTtcbiAgICAgICAgICAgICAgICBzY2FsZUZyb20gPSBNYXRoLnNpbigoMS4wIC0gcHJvZ3Jlc3MpICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgICAgICAgICAgICAgc2NhbGVUbyA9IE1hdGguc2luKHByb2dyZXNzICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZyb20gPSAxLjAgLSBwcm9ncmVzcztcbiAgICAgICAgICAgICAgICBzY2FsZVRvID0gcHJvZ3Jlc3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dHB1dFswXSA9IHggKiBzY2FsZUZyb20gKyBxeCAqIHNjYWxlVG87XG4gICAgICAgICAgICBvdXRwdXRbMV0gPSB5ICogc2NhbGVGcm9tICsgcXkgKiBzY2FsZVRvO1xuICAgICAgICAgICAgb3V0cHV0WzJdID0geiAqIHNjYWxlRnJvbSArIHF6ICogc2NhbGVUbztcbiAgICAgICAgICAgIG91dHB1dFszXSA9IHcgKiBzY2FsZUZyb20gKyBxdyAqIHNjYWxlVG87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodG8gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRvLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldID0gdGhpcy5faW50ZXJwb2xhdGUob3V0cHV0W2ldLCBmcm9tW2ldLCB0b1tpXSwgcHJvZ3Jlc3MsIG1ldGhvZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdG8pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IHRoaXMuX2ludGVycG9sYXRlKG91dHB1dFtrZXldLCBmcm9tW2tleV0sIHRvW2tleV0sIHByb2dyZXNzLCBtZXRob2QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBmcm9tICsgcHJvZ3Jlc3MgKiAodG8gLSBmcm9tKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBoZWxwZXIgbWV0aG9kIHVzZWQgZm9yIHN5bmNocm9uaXppbmcgdGhlIGN1cnJlbnQsIGFic29sdXRlIHN0YXRlIG9mXG4gKiBhIHRyYW5zaXRpb24gdG8gYSBnaXZlbiBvdXRwdXQgYXJyYXksIG9iamVjdCBsaXRlcmFsIG9yIG51bWJlci4gU3VwcG9ydHNcbiAqIG5lc3RlZCBzdGF0ZSBvYmplY3RzIGJ5IHRocm91Z2ggcmVjdXJzaW9uLlxuICpcbiAqIEBtZXRob2QgIF9zeW5jXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSAge051bWJlcnxBcnJheXxPYmplY3R9IG91dHB1dCAgICAgV2hlcmUgdG8gd3JpdGUgdG8gKGluIG9yZGVyIHRvIGF2b2lkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCBhbGxvY2F0aW9uIGFuZCB0aGVyZWZvcmUgR0MpLlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5fE9iamVjdH0gaW5wdXQgICAgICBJbnB1dCBzdGF0ZSB0byBwcm94eSBvbnRvIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuXG4gKiBAcmV0dXJuIHtOdW1iZXJ8QXJyYXl8T2JqZWN0fSBvdXRwdXQgICAgIFBhc3NlZCBpbiBvdXRwdXQgb2JqZWN0LlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuX3N5bmMgPSBmdW5jdGlvbiBfc3luYyhvdXRwdXQsIGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIG91dHB1dCA9IGlucHV0O1xuICAgIGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgaWYgKG91dHB1dCA9PSBudWxsKSBvdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGlucHV0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBfc3luYyhvdXRwdXRbaV0sIGlucHV0W2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAob3V0cHV0ID09IG51bGwpIG91dHB1dCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIG91dHB1dFtrZXldID0gX3N5bmMob3V0cHV0W2tleV0sIGlucHV0W2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEdldCBpbnRlcnBvbGF0ZWQgc3RhdGUgb2YgY3VycmVudCBhY3Rpb24gYXQgcHJvdmlkZWQgdGltZS4gSWYgdGhlIGxhc3RcbiAqICAgIGFjdGlvbiBoYXMgY29tcGxldGVkLCBpbnZva2UgaXRzIGNhbGxiYWNrLlxuICpcbiAqIEBtZXRob2QgZ2V0XG4gKlxuICogQHBhcmFtIHtOdW1iZXI9fSB0ICAgICAgICAgICAgICAgRXZhbHVhdGUgdGhlIGN1cnZlIGF0IGEgbm9ybWFsaXplZCB2ZXJzaW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiB0aGlzIHRpbWUuIElmIG9taXR0ZWQsIHVzZSBjdXJyZW50IHRpbWVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChVbml4IGVwb2NoIHRpbWUgcmV0cmlldmVkIGZyb20gQ2xvY2spLlxuICogQHJldHVybiB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgQmVnaW5uaW5nIHN0YXRlIGludGVycG9sYXRlZCB0byB0aGlzIHBvaW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aW1lLlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHQpIHtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5fc3RhdGU7XG5cbiAgICB0ID0gdGhpcy5fcGF1c2VkQXQgPyB0aGlzLl9wYXVzZWRBdCA6IHQ7XG4gICAgdCA9IHQgPyB0IDogcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSAodCAtIHRoaXMuX3N0YXJ0ZWRBdCkgLyB0aGlzLl9xdWV1ZVsyXTtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuX2ludGVycG9sYXRlKFxuICAgICAgICB0aGlzLl9zdGF0ZSxcbiAgICAgICAgdGhpcy5fZnJvbSxcbiAgICAgICAgdGhpcy5fcXVldWVbMF0sXG4gICAgICAgIHRoaXMuX3F1ZXVlWzFdKHByb2dyZXNzID4gMSA/IDEgOiBwcm9ncmVzcyksXG4gICAgICAgIHRoaXMuX3F1ZXVlWzRdXG4gICAgKTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9zdGF0ZTtcbiAgICBpZiAocHJvZ3Jlc3MgPj0gMSkge1xuICAgICAgICB0aGlzLl9zdGFydGVkQXQgPSB0aGlzLl9zdGFydGVkQXQgKyB0aGlzLl9xdWV1ZVsyXTtcbiAgICAgICAgdGhpcy5fZnJvbSA9IHRoaXMuX3N5bmModGhpcy5fZnJvbSwgdGhpcy5fc3RhdGUpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9ncmVzcyA+IDEgPyB0aGlzLmdldCgpIDogc3RhdGU7XG59O1xuXG4vKipcbiAqIElzIHRoZXJlIGF0IGxlYXN0IG9uZSB0cmFuc2l0aW9uIHBlbmRpbmcgY29tcGxldGlvbj9cbiAqXG4gKiBAbWV0aG9kIGlzQWN0aXZlXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHBlbmRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24uIFBhdXNlZCB0cmFuc2l0aW9ucyBhcmUgc3RpbGwgYmVpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgIGNvbnNpZGVyZWQgYWN0aXZlLlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWUubGVuZ3RoID4gMDtcbn07XG5cbi8qKlxuICogSGFsdCB0cmFuc2l0aW9uIGF0IGN1cnJlbnQgc3RhdGUgYW5kIGVyYXNlIGFsbCBwZW5kaW5nIGFjdGlvbnMuXG4gKlxuICogQG1ldGhvZCBoYWx0XG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9IHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHJldHVybiB0aGlzLmZyb20odGhpcy5nZXQoKSk7XG59O1xuXG4vKipcbiAqIFBhdXNlIHRyYW5zaXRpb24uIFRoaXMgd2lsbCBub3QgZXJhc2UgYW55IGFjdGlvbnMuXG4gKlxuICogQG1ldGhvZCBwYXVzZVxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEhhcyB0aGUgY3VycmVudCBhY3Rpb24gYmVlbiBwYXVzZWQ/XG4gKlxuICogQG1ldGhvZCBpc1BhdXNlZFxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIHRoZSBjdXJyZW50IGFjdGlvbiBoYXMgYmVlbiBwYXVzZWRcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmlzUGF1c2VkID0gZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fcGF1c2VkQXQ7XG59O1xuXG4vKipcbiAqIFJlc3VtZSBhIHByZXZpb3VzbHkgcGF1c2VkIHRyYW5zaXRpb24uXG4gKlxuICogQG1ldGhvZCByZXN1bWVcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgIHZhciBkaWZmID0gdGhpcy5fcGF1c2VkQXQgLSB0aGlzLl9zdGFydGVkQXQ7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCkgLSBkaWZmO1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2FuY2VsIGFsbCB0cmFuc2l0aW9ucyBhbmQgcmVzZXQgdG8gYSBzdGFibGUgc3RhdGVcbiAqXG4gKiBAbWV0aG9kIHJlc2V0XG4gKiBAY2hhaW5hYmxlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYC5mcm9tYCBpbnN0ZWFkIVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5Lk51bWJlcnxPYmplY3QuPG51bWJlciwgbnVtYmVyPn0gc3RhcnRcbiAqICAgIHN0YWJsZSBzdGF0ZSB0byBzZXQgdG9cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHJldHVybiB0aGlzLmZyb20oc3RhcnQpO1xufTtcblxuLyoqXG4gKiBBZGQgdHJhbnNpdGlvbiB0byBlbmQgc3RhdGUgdG8gdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdHJhbnNpdGlvbnMuIFNwZWNpYWxcbiAqICAgIFVzZTogY2FsbGluZyB3aXRob3V0IGEgdHJhbnNpdGlvbiByZXNldHMgdGhlIG9iamVjdCB0byB0aGF0IHN0YXRlIHdpdGhcbiAqICAgIG5vIHBlbmRpbmcgYWN0aW9uc1xuICpcbiAqIEBtZXRob2Qgc2V0XG4gKiBAY2hhaW5hYmxlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYC50b2AgaW5zdGVhZCFcbiAqXG4gKiBAcGFyYW0ge051bWJlcnxGYW1vdXNFbmdpbmVNYXRyaXh8QXJyYXkuTnVtYmVyfE9iamVjdC48bnVtYmVyLCBudW1iZXI+fSBzdGF0ZVxuICogICAgZW5kIHN0YXRlIHRvIHdoaWNoIHdlIGludGVycG9sYXRlXG4gKiBAcGFyYW0ge3RyYW5zaXRpb249fSB0cmFuc2l0aW9uIG9iamVjdCBvZiB0eXBlIHtkdXJhdGlvbjogbnVtYmVyLCBjdXJ2ZTpcbiAqICAgIGZbMCwxXSAtPiBbMCwxXSBvciBuYW1lfS4gSWYgdHJhbnNpdGlvbiBpcyBvbWl0dGVkLCBjaGFuZ2Ugd2lsbCBiZVxuICogICAgaW5zdGFudGFuZW91cy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKT19IGNhbGxiYWNrIFplcm8tYXJndW1lbnQgZnVuY3Rpb24gdG8gY2FsbCBvbiBvYnNlcnZlZFxuICogICAgY29tcGxldGlvbiAodD0xKVxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9IHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHN0YXRlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0cmFuc2l0aW9uID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5mcm9tKHN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy50byhzdGF0ZSwgdHJhbnNpdGlvbi5jdXJ2ZSwgdHJhbnNpdGlvbi5kdXJhdGlvbiwgY2FsbGJhY2ssIHRyYW5zaXRpb24ubWV0aG9kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDdXJ2ZXM6IHJlcXVpcmUoJy4vQ3VydmVzJyksXG4gICAgVHJhbnNpdGlvbmFibGU6IHJlcXVpcmUoJy4vVHJhbnNpdGlvbmFibGUnKVxufTtcbiJdfQ==
