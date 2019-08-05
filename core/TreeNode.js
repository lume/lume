"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeNodeMixin = TreeNodeMixin;
exports.default = exports.TreeNode = void 0;

var _lowclass = require("lowclass");

var _WithUpdate = _interopRequireDefault(require("../html/WithUpdate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TreeNodeMixin(Base) {
  // TODO WithUpdate.mixin isn't enforcing that we pass Constructor
  // constrained to extend from HTMLElement
  class TreeNode extends _WithUpdate.default.mixin((0, _lowclass.Constructor)(Base)) {
    constructor() {
      super(...arguments);
      this.__parent = null;
      this.__children = [];
    }
    /**
     * @readonly
     */


    get parent() {
      return this.__parent;
    }
    /**
     * This is named "subnodes" to avoid conflict with HTML's Element.children
     * @readonly
     */


    get subnodes() {
      // return a new array, so that the user modifying it doesn't affect
      // this node's actual children.
      return [...this.__children];
    }
    /**
     * Add a child node to this TreeNode.
     *
     * @param {TreeNode} childNode The child node to add.
     */


    add(childNode) {
      if (!(childNode instanceof TreeNode)) throw new TypeError('TreeNode.add() expects the childNode argument to be a TreeNode instance.');
      if (childNode.__parent === this) throw new ReferenceError('childNode is already a child of this parent.');
      if (childNode.__parent) childNode.__parent.removeNode(childNode);
      childNode.__parent = this;

      this.__children.push(childNode);

      Promise.resolve().then(() => {
        childNode.connected();
        this.childConnected(childNode);
      });
      return this;
    }
    /**
     * Add all the child nodes in the given array to this node.
     *
     * @param {Array.TreeNode} nodes The nodes to add.
     */


    addChildren(nodes) {
      nodes.forEach(node => this.add(node));
      return this;
    }
    /**
     * Remove a child node from this node.
     *
     * @param {TreeNode} childNode The node to remove.
     */


    removeNode(childNode) {
      if (!(childNode instanceof TreeNode)) {
        throw new Error(`
                    TreeNode.remove expects the childNode argument to be an
                    instance of TreeNode. There should only be TreeNodes in the
                    tree.
                `);
      }

      if (childNode.__parent !== this) throw new ReferenceError('childNode is not a child of this parent.');
      childNode.__parent = null;

      this.__children.splice(this.__children.indexOf(childNode), 1);

      Promise.resolve().then(() => {
        childNode.disconnected();
        this.childDisconnected(childNode);
      });
      return this;
    }
    /**
     * Remove all the child nodes in the given array from this node.
     *
     * @param {Array.TreeNode} nodes The nodes to remove.
     */


    removeChildren(nodes) {
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        this.removeNode(nodes[i]);
      }

      return this;
    }
    /**
     * Shortcut to remove all children.
     */


    removeAllChildren() {
      if (!this.__children.length) throw new ReferenceError('This node has no children.');
      this.removeChildren(this.__children);
      return this;
    }
    /**
     * How many children this TreeNode has.
     * @readonly
     */


    get childCount() {
      return this.__children.length;
    } // generic life cycle methods


    connected() {}

    disconnected() {}

    childConnected(_child) {}

    childDisconnected(_child) {} // traverse the tree at this node


    traverse(fn) {
      fn(this);
      const children = this.__children;

      for (let i = 0, l = children.length; i < l; i++) {
        children[i].traverse(fn);
      }
    }

  }

  return TreeNode;
}

const TreeNode = (0, _lowclass.Mixin)(TreeNodeMixin);
exports.TreeNode = TreeNode;
var _default = TreeNode; // const t: TreeNode = new TreeNode()
// t.asdfasdf
// t.asdfasdfadfasdf()
// t.childCount
// t.removeNode()
// t.removeNode(new TreeNode())
// t.innerHTML = 123
// t.innerHTML = 'asdf'
// t.setAttribute('foo', 123)
// t.setAttribute('foo', 'bar')

exports.default = _default;