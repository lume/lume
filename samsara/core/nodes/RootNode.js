/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var RenderTreeNode = require('./RenderTreeNode');

    /**
     * A RootNode is a first node in the Render Tree. It is like any other
     *  RenderTreeNode but with the additional responsibility of defining
     *  an allocating DOM node to render to.
     *
     * @class RootNode
     * @constructor
     * @private
     * @extends Core.RenderTreeNode
     * @param [allocator] {ElementAllocator} ElementAllocator
     */
    function RootNode(allocator) {
        this.allocator = null;
        RenderTreeNode.call(this);
        if (allocator) this.setAllocator(allocator);
    }

    RootNode.prototype = Object.create(RenderTreeNode.prototype);
    RootNode.prototype.constructor = RootNode;

    /**
     * Define an allocator
     *
     * @method setAllocator
     * @param allocator {Allocator} Allocator
     */
    RootNode.prototype.setAllocator = function setAllocator(allocator){
        this.allocator = allocator;
        this._logic.trigger('mount', this);
    };

    RootNode.prototype.remove = function remove() {
        this.allocator = null;
        RenderTreeNode.prototype.remove.apply(this, arguments);
    };

    module.exports = RootNode;
});
