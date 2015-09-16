import SinglyLinkedList from '../util/SinglyLinkedList';
import Pool from '../util/Pool';
import FrameLoop from '../core/FrameLoop';
import log from '../util/log';
import Event from '../util/Event';

var componentCount = 0;
var componentMap = {};
var componentPool = SinglyLinkedList();
var registered = {};

var Component = {

  extend: function(overrides, ignoreDup) {

    var Sub, key, name = overrides.name;

    if (!name)
      throw new Error("Usage: Component.extend({ name: 'componentName' });");
    if (registered[name] && !ignoreDup)
      throw new Error('A component named "' + name + '" already exists');

    Sub = function Component() {
      var component;

      if (!(this instanceof Sub)) {
        component = componentPool.shift();
        if (component)
            return component.init.apply(component, arguments);
        else
          return new Sub();
      }

      // new instance
      this.init.apply(this, arguments);
    };

    /*
     * There are only a small number of components, with a small
     * number of methods, so let's avoid the (minor, but accumulative)
     * overhead of inheritance.
     */
    //Sub.prototype = Object.create(_super);
    //Sub.prototype.constructor = Sub;
    for (key in _super)
      Sub.prototype[key] = _super[key];

    // Just for constructor, *sub* class's one is this.__constructor
    overrides.__constructor = overrides.constructor;

    // For everything else, "super" version is, e.g. this._update()
    for (key in overrides) {
      if (Sub.prototype[key])
        Sub.prototype['_'+key] = Sub.prototype[key];
      Sub.prototype[key] = overrides[key];
    }

    // Map from name to component class, e.g. "size" -> Size
    registered[name] = Sub;

    return Sub;

  },

  exists: function(name) {
    return !!registered[name];
  },

  get: function(name) {
    if (registered[name])
      return registered[name];
    else
      throw new Error('No component "' + name +
        '" exists, did you forget to import it?');
  }

};

var _super = {

  init: function() {
    this._id = ++componentCount;
    componentMap[this._id] = this;

    if (log.level === 'trace')
      log.trace("New " + this.name + " component #" + this._id);    
  },

  recycle: function() {
    delete componentMap[this._id];
  },

  requires: function(/* arguments */) {
    var node = this._node;
    for (var i=0, len=arguments.length; i < len; i++)
      node.addComponent(arguments[i], true /* noWarn */);
  },

  /* Updates */

  // What to do when an update is called
  update: function(changed) {
    this._updateRequested = false;
  },

  _updateWrapper: function(data, timestamp) {
    this._node && this.update(data, timestamp);
  },

  requestUpdate: function() {
    if (!this._updateRequested) {
      this._updateRequested = true;
      Component.loop.onNextTick(this._updateWrapper, this);
    }
  },

  /* Nodes */

  attachTo: function(node) {
    this._node = node;
    node._attachComponentInstance(this);

    if (this.onAttach)
      this.onAttach();

    var autoListen = this.__proto__.constructor.autoListen;
    if (autoListen)
      for (var i=0; i < autoListen.length; i++)
        node.addComponentListener(autoListen[i], this);

    return this; // chainable
  },

  detach: function() {
    this._node._detachComponentInstance(this);
  },

  onEvent: function(event, sender /*, arguments */) {
    // Extra if, because computing the log message is a little expensive
    if (log.level === 'trace') {
      var args = Array.prototype.slice.call(arguments, 2);
      log.trace('[Frame ' + Component.loop._currentFrame + '] '
        + this.constructor.name + ' #' + this._id + ' received "'
        + Event[event] + '" from ' + sender.constructor.name
        + ' #' + sender._id + ' with: ', args);
    }

    this.requestUpdate();
  },

  /*
  emit(/* , arguments *//*) {
    // Inject componentInstance as 2nd org
    var len = arguments.length;
    var args = new Array(len + 1);
    for (var i=0, len=arguments.length; i < len; i++) {

    }
    Array.prototype.splice.call(arguments, 1, 0, this);
    this._node && this._node._emit.apply(this._node, arguments);
  }
  */


  // XXX consider avoiding this abstraction for extra function call XXX
  emit: function(/* , arguments */) {
    // Inject componentInstance as 2nd arg
    // Note, if we spliced `arguments` directly, it's a v8 deop
    Array.prototype.splice.call(arguments, 1, 0, this);
    this._node && this._node._emit.apply(this._node, arguments);
  }

}

export default Component;