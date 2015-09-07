import SinglyLinkedList from '../util/SinglyLinkedList';
import Vec3 from '../util/Vec3';

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
  this._children = SinglyLinkedList();
  this._size = Vec3(0, 0, 0);
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

export default Node;