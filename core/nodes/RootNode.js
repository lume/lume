/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var RenderTreeNode = require('samsara/core/nodes/RenderTreeNode');

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
        this.allocator = allocator;
    }

    RootNode.prototype = Object.create(RenderTreeNode.prototype);
    RootNode.prototype.constructor = RootNode;

    module.exports = RootNode;
});
