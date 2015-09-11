import SinglyLinkedList from '../util/SinglyLinkedList';
import Pool from '../util/Pool';
import FrameLoop from '../core/FrameLoop';

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

  /* Updates */

  // What to do when an update is called
  update(changed) {
    this._updateRequested = false;
    if (changed)
      this._notifyObservers();
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
    node._addComponent(this);
    return this; // chainable
  }

  detach() {
    node._removeComponent(this);
  }

  /* Observes */

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

}

Pool.extend(Component);

// temporary
Component.loop = new FrameLoop();
Component.loop.start();

export default Component;