/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var RenderTreeNode = require('./nodes/RenderTreeNode');
    var SizeNode = require('./nodes/SizeNode');
    var LayoutNode = require('./nodes/LayoutNode');

    // TODO: combine with View
    // make three nodes
    function EmptyNode(object){
        this._node = new RenderTreeNode();
        this._sizeNode = new SizeNode();
        this._layoutNode = new LayoutNode();

        this._addNode = this._node.add(this._sizeNode).add(this._layoutNode);

        this.size = this._addNode.size; // actual size
        this._size = this._node.size; // incoming parent size

        if (object) setObject.call(this, object);
    }

    EmptyNode.prototype._isView = true;

    /**
     * Extends the render tree subtree with a new node.
     *
     * @method add
     * @param object {SizeNode|LayoutNode|Surface} Node
     * @return {RenderTreeNode}
     */
    EmptyNode.prototype.add = function add(){
        return RenderTreeNode.prototype.add.apply(this._addNode, arguments);
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

    function setObject(object){
        for (var key in object) {
            var value = object[key];
            if (SizeNode.KEYS[key]){
                this._sizeNode.set({key : value});
            }
            else if (LayoutNode.KEYS[key])
                this._layoutNode.set({key : value});
        }
    }

    module.exports = EmptyNode;
});
