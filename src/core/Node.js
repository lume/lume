import SinglyLinkedList from '../util/SinglyLinkedList';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';

// See SinglyLinkedList.js for more info on this pattern
let nodePool = SinglyLinkedList();
let Node = function(options) {
  if (this instanceof Node) {
    this.init(options);
  } else {
    let node = nodePool.shiftElement();
    return node && node.init(options) || new Node(options);
  }
};

Node.prototype.init = function(options) {
  this._children && this._children.recycle();
  this._children = SinglyLinkedList();

  this._size && this._size.recycle();
  this._size = Vec3(0, 0, 0);

  this._componentIterator = 0;
  this.components && trash(this.components);
  this.components = {};
};

Node.prototype.addChild = function(child) {
  this._children.push(child);
};

/*
 * Gets the child at the given index.  Computationally expensive, useful
 * for testing but avoid common use.
 */
Node.prototype.getChild = function(index) {
  return this._children.get(index);
};

/*
 * Builds / returns an array of all children.  Computationally expensive, useful
 * for testing but avoid common use.
 */
Node.prototype.getChildren = function(index) {
  return this._children.toArray(index);
};

Node.prototype.eachChild = function(func) {
  for (let current = this._children.head; current; current = current.next)
    func(current.data);
};

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
Node.prototype.eachDescendant = function(func) {
  for (let current = this._children.head; current; current = current.next) {
    if (func(current.data) && current.data._children)
      current.data.eachDescendant(func);
  }
}

Node.prototype.addComponent = function(component) {
  var name = component.name;
  if (name) {
     if (this.components[name])
        throw new Error("Node already has a " + name + " component",
          this, component, this.components[name]);
  } else
    name = this._componentIterator++;

  this.components[name] = component;
  
  component._node = this;
  return component;
};

Node.prototype.removeComponent = function(component) {
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
};

export default Node;