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
        RenderTreeNode.call(this);
        this.root = this;
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
    };

    module.exports = RootNode;
});
