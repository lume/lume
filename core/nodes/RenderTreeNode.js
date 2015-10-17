/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var Stream = require('samsara/streams/Stream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeNode = require('samsara/core/SizeNode');
    var LayoutNode = require('samsara/core/LayoutNode');
    var layoutAlgebra = require('samsara/core/algebras/layout');
    var sizeAlgebra = require('samsara/core/algebras/size');

    /**
     * A node in the scene graph. As such, it wraps a layout or size node,
     *  providing them with an `add` method. By adding nodes, the scene graph
     *  is constructed like a tree, the leaves of which are `Surfaces`.
     *
     *  @constructor
     *  @class RenderTreeNode
     *  @private
     *  @param object {SizeNode, LayoutNode, Surface, View}
     */
    function RenderTreeNode(object) {
        // layout and size inputs
        this._layout = new EventHandler();
        this._size = new EventHandler();

        // layout and size streams
        this.size = null;
        this.layout = null;

        this.root = null;

        if (object) _set.call(this, object);
    }

    /**
     * Extends the scene graph with a new node. Similar to how a tree data structure
     *  is created, but instead of a node with an array of children, children subscribe
     *  to notifications from the parent.
     *
     *  This method also takes `Views` (subtrees) and `Surfaces` (leaves).
     *
     * @method add
     * @param node {SizeNode|LayoutNode|Surface|View} Node
     * @return {RenderTreeNode}
     */
    RenderTreeNode.prototype.add = function add(node) {
        var childNode;

        if (node._isView){
            if (this.root)
                node._node.root = this.root;
            else if (this.tempRoot)
                node._node.tempRoot = this.tempRoot;
            childNode = node;
        }
        else {
            childNode = new RenderTreeNode(node);
            if (this.tempRoot)
                childNode.tempRoot = this.tempRoot;
            else childNode.root = _getRootNode.call(this);
        }

        childNode._layout.subscribe(this.layout || this._layout);
        childNode._size.subscribe(this.size || this._size);

        return childNode;
    };

    function _getRootNode(){
        if (this.root) return this.root;
        if (this.tempRoot) return _getRootNode.call(this.tempRoot);
        return this;
    }

    function _set(object) {
        if (object instanceof SizeNode){
            this.size = ResizeStream.lift(
                function SGSizeAlgebra (objectSpec, parentSize){
                    if (!parentSize) return false;
                    return (objectSpec)
                        ? sizeAlgebra(objectSpec, parentSize)
                        : parentSize;
                },
                [object, this._size]
            );
            return;
        }

        if (object instanceof LayoutNode){
            this.layout = Stream.lift(
                function SGLayoutAlgebra (objectSpec, parentSpec, size){
                    if (!parentSpec || !size) return false;
                    return (objectSpec)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                },
                [object, this._layout, this._size]
            );
            return;
        }

        // object is a leaf node
        object._size.subscribe(this._size);
        object._layout.subscribe(this._layout);
        object._getRoot = _getRootNode.bind(this);
    }

    module.exports = RenderTreeNode;
});
