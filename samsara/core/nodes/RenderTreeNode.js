/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../../events/EventHandler');
    var SimpleStream = require('../../streams/SimpleStream');
    var Stream = require('../../streams/Stream');
    var LayoutNode = require('./LayoutNode');
    var SizeNode = require('./SizeNode');
    var layoutAlgebra = require('../algebras/layout');
    var sizeAlgebra = require('../algebras/size');
    var preTickQueue = require('../../core/queues/preTickQueue');
    var dirtyQueue = require('../../core/queues/dirtyQueue');

    /**
     * A node in the render tree. As such, it wraps a layout or size node,
     *  providing them with an `add` method. By adding nodes, the render tree
     *  is constructed, the leaves of which are `Surfaces`.
     *
     *  @constructor
     *  @class RenderTreeNode
     *  @private
     *  @param object {Object|SizeNode|LayoutNode|Surface|View}
     */
    function RenderTreeNode(object) {
        // layout and size inputs
        this._layout = new EventHandler();
        this._size = new EventHandler();
        this._logic = new EventHandler();

        // layout and size streams
        this.size = new SimpleStream();
        this.layout = new SimpleStream();

        // set node middleware
        if (object) _set.call(this, object);
        else {
            // if no middleware specified, connect input to output
            this.layout.subscribe(this._layout);
            this.size.subscribe(this._size);
        }

        // save last spec if node is removed and later added
        this._cachedSpec = {
            layout : null,
            size : null
        };

        // update size cache
        this.size.on('start', updateSizeCache.bind(this));
        this.size.on('update', updateSizeCache.bind(this));
        this.size.on('end', updateSizeCache.bind(this));

        // update layout spec
        this.layout.on('start', updateLayoutCache.bind(this));
        this.layout.on('update', updateLayoutCache.bind(this));
        this.layout.on('end', updateLayoutCache.bind(this));

        // reference to RootNode if a node is removed and later added
        this.root = null;

        this._logic.on('mount', function(node){
            this.root = node;
        }.bind(this));

        this._logic.on('unmount', function() {
            this.root = null;
        }.bind(this));
    }

    function updateLayoutCache(layout){
        this._cachedSpec.layout = layout;
    }

    function updateSizeCache(size){
        this._cachedSpec.size = size;
    }

    /**
     * Extends the render tree with a new node. Similar to how a tree data structure
     *  is created, but instead of a node with an array of children, children subscribe
     *  to notifications from the parent.
     *
     *  Nodes can be instances of `LayoutNode`, `SizeNode`, or Object literals with
     *  size and layout properties, in which case, appropriate nodes will be created.
     *
     *  This method also takes `Views` (subtrees) and `Surfaces` (leaves).
     *
     * @method add
     * @chainable
     * @param node {Object|Node|Surface|View} Node
     * @return {RenderTreeNode}
     */
    RenderTreeNode.prototype.add = function add(node) {
        var childNode;

        if (node.constructor === Object){
            // Object literal case
            return _createNodeFromObjectLiteral.call(this, node);
        }
        else if (node._onAdd){
            // View case
            return node._onAdd(this);
        }
        else if (node instanceof RenderTreeNode){
            // RenderTree Node
            childNode = node;
        }
        else {
            // LayoutNode or SizeNode or Surface
            childNode = new RenderTreeNode(node);
        }

        childNode._layout.subscribe(this.layout);
        childNode._size.subscribe(this.size);
        childNode._logic.subscribe(this._logic);

        // Called when node is removed and later added
        if (this.root && !childNode.root)
            childNode._logic.trigger('mount', this.root);

        // Emit previously cached values if node was removed
        if (!node.root){
            var self = this;
            preTickQueue.push(function(){
                if (!self._cachedSpec.size) return;
                self.size.trigger('start', self._cachedSpec.size);
                self.layout.trigger('start', self._cachedSpec.layout);
                dirtyQueue.push(function(){
                    self.size.trigger('end', self._cachedSpec.size);
                    self.layout.trigger('end', self._cachedSpec.layout);
                });
            });
        }

        return childNode;
    };

    /**
     * Remove the node from the Render Tree
     *
     * @method remove
     */
    RenderTreeNode.prototype.remove = function (){
        this._logic.trigger('unmount');
        this._layout.unsubscribe();
        this._size.unsubscribe();
        this._logic.unsubscribe();
    };

    // Creates a combination of Size/Layout nodes from an object literal
    // depending on its keys
    function _createNodeFromObjectLiteral(object){
        var sizeKeys = {};
        var layoutKeys = {};

        var needsSize = false;
        var needsLayout = false;

        var node = this;

        for (var key in object){
            if (SizeNode.KEYS[key]){
                sizeKeys[key] = object[key];
                needsSize = true;
            }
            else if (LayoutNode.KEYS[key]){
                layoutKeys[key] = object[key];
                needsLayout = true;
            }
        }

        // create extra align node if needed
        if (needsSize && layoutKeys.align){
            var alignNode = new LayoutNode({
                align : layoutKeys.align
            });
            delete layoutKeys.align;
            node = node.add(alignNode);
        }

        // create size node first if needed
        if (needsSize)
            node = node.add(new SizeNode(sizeKeys));

        // create layout node if needed
        if (needsLayout)
            node = node.add(new LayoutNode(layoutKeys));

        return node;
    }

    // Set node middleware. Can be an object, SizeNode, LayoutNode, or Surface
    function _set(object) {
        if (object instanceof SizeNode){
            var size = Stream.lift(
                function SGSizeAlgebra (objectSpec, parentSize){
                    if (!parentSize) return false;
                    return(objectSpec)
                        ? sizeAlgebra(objectSpec, parentSize)
                        : parentSize;
                }.bind(this),
                [object, this._size]
            );
            this.size.subscribe(size);
            this.layout.subscribe(this._layout);
        }
        else if (object instanceof LayoutNode){
            var layout = Stream.lift(
                function SGLayoutAlgebra (objectSpec, parentSpec, size){
                    if (!parentSpec || !size) return false;
                    return (objectSpec)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                }.bind(this),
                [object, this._layout, this._size]
            );
            this.layout.subscribe(layout);
            this.size.subscribe(this._size);
        }
        else {
            this._logic.on('unmount', function() {
                object.remove();
            }.bind(this));

            this._logic.on('mount', function(root) {
                object.setup(root.allocator);
            }.bind(this));

            object.on('recall', function(){
                object._size.unsubscribe(this._size);
                object._layout.unsubscribe(this._layout);
            }.bind(this));

            object.on('deploy', function(){
                object._size.subscribe(this._size);
                object._layout.subscribe(this._layout);
            }.bind(this));
        }
    }

    module.exports = RenderTreeNode;
});
