/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var Stream = require('samsara/streams/Stream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeNode = require('samsara/core/SizeNode');
    var layoutAlgebra = require('samsara/core/algebras/layout');
    var sizeAlgebra = require('samsara/core/algebras/size');

    /**
     * A node in the scene graph. As such, it wraps a layout or size node,
     *  providing them with an `add` method. By adding nodes, the scene graph
     *  is constructed like a tree, the leaves of which are `Surfaces`.
     *
     *  @constructor
     *  @class SceneGraphNode
     *  @param object {SizeNode, LayoutNode, Surface, View}
     */
    function SceneGraphNode(object) {
        this.sizeStream = null;
        this.layoutStream = null;

        this._layout = new EventHandler();
        this._size = new EventHandler();

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
     * @param object {SizeNode, LayoutNode, Surface, View} Node
     * @return {SceneGraphNode} Wrapped node
     */
    SceneGraphNode.prototype.add = function add(object) {
        var childNode;

        if (object._isView){
            if (this.root)
                object._node.root = this.root;
            else if (this.tempRoot)
                object._node.tempRoot = this.tempRoot;
            childNode = object;
        }
        else {
            childNode = new SceneGraphNode(object);
            if (this.tempRoot)
                childNode.tempRoot = this.tempRoot;
            else childNode.root = _getRootNode.call(this);
        }

        childNode._layout.subscribe(this.layoutStream || this._layout);
        childNode._size.subscribe(this.sizeStream || this._size);

        return childNode;
    };

    function _getRootNode(){
        if (this.root) return this.root;
        if (this.tempRoot) return _getRootNode.call(this.tempRoot);
        return this;
    }

    function _set(object) {
        if (object instanceof SizeNode){
            this.sizeStream = ResizeStream.lift(
                function SGSizeAlgebra (objectSpec, parentSize){
                    return (objectSpec)
                        ? sizeAlgebra(objectSpec, parentSize)
                        : parentSize;
                },
                [object, this._size]
            );
        }

        if (!object.commit){
            this.layoutStream = Stream.lift(
                function SGLayoutAlgebra (objectSpec, parentSpec, size){
                    // TODO: bug fix for when successive `start` events are fired downstream
                    if (!parentSpec || !size) return;
                    return (objectSpec)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                },
                [object, this._layout, this._size]
            );
        }
        else {
            object._size.subscribe(this._size);
            object._layout.subscribe(this._layout);

            object.layout.on('start', function(spec){
                var root = _getRootNode.call(this);
                root.objects[object._id] = object;
                root.specs[object._id] = spec;
            }.bind(this));

            object.layout.on('update', function(spec){
                var root = _getRootNode.call(this);
                //TODO: this is a bug. needs fixing.
                if (root.objects[object._id] === undefined)
                    root.objects[object._id] = object;
                root.specs[object._id] = spec;
            }.bind(this));

            object.layout.on('end', function(){
                var root = _getRootNode.call(this);
                delete root.objects[object._id];
                delete root.specs[object._id];
            }.bind(this));

            object.size.on('resize', function(){
                var root = _getRootNode.call(this);
                if (root.dirtyObjects.indexOf(object) == -1)
                    root.dirtyObjects.push(object);
            }.bind(this));

            object.on('dirty', function(){
                var root = _getRootNode.call(this);
                if (root.dirtyObjects.indexOf(object) == -1)
                    root.dirtyObjects.push(object);
            }.bind(this));
        }
    }

    module.exports = SceneGraphNode;
});
