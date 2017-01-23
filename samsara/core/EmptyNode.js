/* Copyright © 2015-2017 David Valdman */

define(function(require, exports, module){
    var RenderTreeNode = require('./nodes/RenderTreeNode');
    var EventHandler = require('samsara/events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var SizeNode = require('./nodes/SizeNode');
    var LayoutNode = require('./nodes/LayoutNode');
    var sizeAlgebra = require('./algebras/size');
    var layoutAlgebra = require('./algebras/layout');
    var Stream = require('../streams/Stream');

    function EmptyNode(options){
        this._sizeNode = null;
        this._layoutNode = null;

        this._size = new EventHandler();
        this._layout = new EventHandler();
        this._logic = new EventHandler();

        this.size = new SimpleStream();
        this.layout = new SimpleStream();

        this.size.subscribe(this._size);
        this.layout.subscribe(this._layout);

        this._node = new RenderTreeNode();

        this._cachedSize = [0, 0];
        this._node.size.on(['set', 'start', 'update', 'end'], updateSize.bind(this));

        this._node._size.subscribe(this.size);
        this._node._layout.subscribe(this.layout);
        this._node._logic.subscribe(this._logic);

        if (options) setOptions.call(this, options);
    }

    EmptyNode.prototype._onAdd = function add(parent){
        this._logic.unsubscribe();
        this._logic.subscribe(parent._logic);
        return this;
    };

    /**
     * Extends the render tree subtree with a new node.
     *
     * @method add
     * @param object {SizeNode|LayoutNode|Surface} Node
     * @return {RenderTreeNode}
     */
    EmptyNode.prototype.add = function add(){
        return RenderTreeNode.prototype.add.apply(this._node, arguments);
    };

    /**
     * Remove the View from the RenderTree. All Surfaces added to the View
     *  will also be removed. The View can be added back at a later time and
     *  all of its data and Surfaces will be restored.
     *
     * @method remove
     */
    EmptyNode.prototype.remove = function remove(){
        RenderTreeNode.prototype.remove.apply(this._node, arguments);
    };

    EmptyNode.prototype.setSize = function setSize(size){
        if (!this._sizeNode) createSizeNode.call(this);
        this._cachedSize = size;
        this._sizeNode.set({size : size});
    };

    EmptyNode.prototype.setProportions = function setProportions(proportions){
        if (!this._sizeNode) createSizeNode.call(this);
        this._sizeNode.set({proportions : proportions});
    };

    EmptyNode.prototype.setMargins = function setMargins(margins){
        if (!this._sizeNode) createSizeNode.call(this);
        this._sizeNode.set({margins : margins});
    };

    EmptyNode.prototype.setOrigin = function setOrigin(origin){
        if (!this._layoutNode) createLayoutNode.call(this);
        this._layoutNode.set({origin : origin});
    };

    EmptyNode.prototype.setOpacity = function setOpacity(opacity){
        if (!this._layoutNode) createLayoutNode.call(this);
        this._layoutNode.set({opacity : opacity});
    };

    function updateSize(size){
        if (this._cachedSize[0] === size[0] && this._cachedSize[1] === size[1]) return;
        this._cachedSize = size;
        this.size.emit('resize', size);
    }

    function setOptions(options){
        for (var key in options){
            var value = options[key];
            switch (key){
                case 'size':
                    this.setSize(value);
                    break;
                case 'proportions':
                    this.setProportions(value);
                    break;
                case 'margins':
                    this.setMargins(value);
                    break;
                case 'origin':
                    this.setOrigin(value);
                    break;
                case 'opacity':
                    this.setOpacity(value);
                    break;
            }
        }
    }

    function createSizeNode(){
        this.size.unsubscribe();
        this._sizeNode = new SizeNode();

        var size = Stream.lift(function surfaceSizeLift(sizeSpec, parentSize) {
            if (!parentSize) return false;
            return sizeAlgebra(sizeSpec, parentSize);
        }, [this._sizeNode, this._size]);

        this.size.subscribe(size);
    }

    function createLayoutNode(){
        this.layout.unsubscribe();
        this._layoutNode = new LayoutNode();

        var layout = Stream.lift(function surfaceLayoutLift(parentSpec, objectSpec, size) {
            if (!size || !parentSpec) return false;
            return (objectSpec)
                ? layoutAlgebra(objectSpec, parentSpec, size)
                : parentSpec;
        }, [this._layout, this._layoutNode, this.size]);

        this.layout.subscribe(layout);
    }

    module.exports = EmptyNode;
});
