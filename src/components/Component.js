import SinglyLinkedList from '../util/SinglyLinkedList';
import Pool from '../util/Pool';
import FrameLoop from '../core/FrameLoop';
import log from '../util/log';
import Event from '../util/Event';

var componentCount = 0;
var componentMap = {};

class Component {

  constructor(options, allow) {
    if (!allow)
      throw new Error("Did you mean to (Class).instance(options)?");

    this.init(options);
  }

  init(options) {
    // These lists should be empty on old instances
    // Check?  XXX

    this._id = ++componentCount;
    componentMap[this._id] = this;

    if (!this._observers)
      this._observers = SinglyLinkedList();

    if (!this._observing)
      this._observing = SinglyLinkedList();
  }

  recycle() {
    if (this._observering.head)
      this.unobserveAll();

    // maybe we should just be nice and loop through and unobserve
    // them for the user?
    if (this._observers.head)
      throw new Error("Tried to remove me while others depend on me",
        this, this._observers);

    delete componentMap[this._id];
  }

  // Uh, yeah... TODO: better
  requires(/* arguments */) {
    var node = this._node;
    for (var i=0, len=arguments.length; i < len; i++)
      if (!node.hasComponent(arguments[i]))
        node.addComponent(arguments[i]);
  }

  /* Updates */

  // What to do when an update is called
  update(changed) {
    this._updateRequested = false;
//    if (changed)
//      this._notifyObservers();
  }

  _updateWrapper() {
    this._node && this.update();
  }
  requestUpdate() {
    if (!this._updateRequested) {
      this._updateRequested = true;
      Component.loop.onNextTick(this._updateWrapper, this);
    }
  }

  /* Nodes */

  attachTo(node) {
    this._node = node;
    node._attachComponentInstance(this);

    if (this.onAttach)
      this.onAttach();

    var autoListen = this.__proto__.constructor.autoListen;
    if (autoListen)
      for (var i=0; i < autoListen.length; i++)
        node.addComponentListener(autoListen[i], this);

    return this; // chainable
  }

  detach() {

    node._detachComponentInstance(this);
  }

  onEvent(event, sender /*, arguments */) {
    // Extra if, because computing the log message is a little expensive
    if (log.level === 'trace') {
      let args = Array.prototype.slice(arguments, 2);
      log.trace('[Frame ' + Component.loop._currentFrame + '] '
        + this.constructor.name + ' #' + this._id + ' received "'
        + Event[event] + '" from ' + sender.constructor.name
        + ' #' + sender._id + ' with: ', args);
    }

    this.requestUpdate();
  }

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
  emit(/* , arguments */) {
    // Inject componentInstance as 2nd arg
    // Note, if we spliced `arguments` directly, it's a v8 deop
    Array.prototype.splice.call(arguments, 1, 0, this);
    this._node && this._node._emit.apply(this._node, arguments);
  }

  /* Observes */

  /*
  observe(component) {
    component._addObserver(this);
    this._observing.push(component);
  }

  unobserve(component) {
    component._removeObserver(this);
    this._observing.remove(component);
  }

  unobserveAll() {
    this._observing.forEach(this.unobserve, this);
  }
  */

  _addObserver(component) {
    this._observers.push(component);
  }

  _removeObserver(component) {
    this._observers.remove(component);
  }

  _notifyObserver(component) {
    component.update()
  }

  _notifyObservers() {
    this._observers.forEach(this._notifyObserver);
  }

//  observeComponents()

}

Pool.extend(Component);

export default Component;