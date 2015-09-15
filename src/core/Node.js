import SinglyLinkedList from '../util/SinglyLinkedList';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import Pool from '../util/Pool';
import Component from '../components/Component';

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

    this._components && trash(this.components);
    this._components = {};

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

  addComponent(componentName) {
    if (!this.hasComponent(componentName))
      return Component.get(componentName)().attachTo(this);
  }

  addComponents(/* arguments */) {
    for (var i=0; i < arguments.length; i++)
      if (!this.hasComponent(arguments[i])) {
        Component.get(arguments[i])().attachTo(this);
      }
  }
  /*
  // babel output adds some overhead but this looks so nice :(
  addComponents(...args) {
    args.forEach(Comp => this._addComponent(Comp.instance()));
  }
  */

  hasComponent(componentName) {
    return this._components[componentName];
  }

  _attachComponentInstance(component) {
    this[component.name] = component;
    this._components[component.name] = true;
    return component;
  }

  _detachComponentInstance(component) {
    this[component.name].recycle();
    this._components[component.name] = false;
  }

}

Pool.extend(Node);

export default Node;