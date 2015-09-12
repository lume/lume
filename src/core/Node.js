import SinglyLinkedList from '../util/SinglyLinkedList';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import Pool from '../util/Pool';

class Node {

  constructor(options, allow) {
    if (!allow)
      throw new Error("Did you mean to (Class).instance(options)?");
    this.init(options);
  }

  init() {
    this._children && this._children.recycle();
    this._children = SinglyLinkedList();

    this._size && this._size.recycle();
    this._size = Vec3(0, 0, 0);

    this._componentIterator = 0;
    this.components && trash(this.components);
    this.components = {};

    this._listeners && trash(this._listeners);
    this._listeners = {};
  }

  /* children */

  addChild(child) {
    this._children.push(child);
  }

  childInstance() {
    var child = this.instance();
    this.addChild(child);
    return child;
  }

  /*
   * Gets the child at the given index.  Computationally expensive, useful
   * for testing but avoid common use.
   */
  getChild(index) {
    return this._children.get(index);
  }

  /*
   * Builds / returns an array of all children.  Computationally expensive, useful
   * for testing but avoid common use.
   */
  getChildren(index) {
    return this._children.toArray(index);
  }

  eachChild(func) {
    for (let current = this._children.head; current; current = current.next)
      func(current.data);
  }

  /*
   * Call the given function with all descedents of the current node.
   * It will run on the 1st child, and if function returns true and
   * the 1st child has children of it's own, the function will then be
   * run on the grandchildren recursively before iterating to the next
   * sibling.
   *
   * @param {function} func - the function that will be called with
   *                          each child as the only argument.
   */
  eachDescendant(func) {
    for (let current = this._children.head; current; current = current.next) {
      if (func(current.data) && current.data._children)
        current.data.eachDescendant(func);
    }
  }

  /* events */

  addComponentListener(event, component) {
    if (!this._listeners[event])
      this._listeners[event] = SinglyLinkedList();
    this._listeners[event].push(component);
  }

  removeComponentListener(event, listener) {
    this._listeners[event].remove(listener);
  }

  /**
   * Emits an event; called by components, not directly
   *
   * @param {EventCode} event - the event to fire
   * @param {Component} sender - the component instance sending the event
   * @param {mixed} ...args - optional data to send with the event
   * 
   */  
  _emit(event, component /*, arguments */) {
    if (this._listeners[event])
      this._listeners[event].forEach(this._emitWrapper, null, arguments);
  }
  _emitWrapper(component, data) {
    // data/args: [ Event, sender, optionalArg1, arg2, etc ]
    component.onEvent.apply(component, data);
  }

  /* components */

  addComponent(Component) {
    if (!this.hasComponent(Component))
      Component.instance().attachTo(this);
  }

  addComponents(/* arguments */) {
    for (var i=0; i < arguments.length; i++)
      if (!this.hasComponent(arguments[i]))
        arguments[i].instance().attachTo(this);
  }
  /*
  // babel output adds some overhead but this looks so nice :(
  addComponents(...args) {
    args.forEach(Comp => this._addComponent(Comp.instance()));
  }
  */

  // awful.  TODO with better map
  hasComponent(Component) {
    var has = false;
    var components = Object.values(this.components);  // !!
    var len = components.length;
    for (var i=0; i < len; i++) {
      if (components[i] instanceof Component) {
        has = true; break;
      }
    }
    return has;
  }

  _attachComponentInstance(component) {
    var name = component.constructor.name;
    name = name.charAt(0).toLowerCase() + name.substr(1);

    if (this.components[name])
      throw new Error("Node already has a " + name + " component",
        this, component, this.components[name]);

    this[name] = this.components[name] = component;
    return component;
  }

  _detachComponentInstance(component) {
    if (typeof component === 'object') {
      for (let key in this.components)
        if (this.components[key] === component) {
          this.components[key].recycle();
          this.components[key] = null;
          break;
        }
    } else {
      this.components[component].recycle();
      this.components[component] = null;
    }
  }

}

Pool.extend(Node);

export default Node;