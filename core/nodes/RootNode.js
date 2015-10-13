/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SceneGraphNode = require('samsara/core/nodes/SceneGraphNode');

    /**
     * A RootNode is a first node in the Scene Graph. It is like any other
     *  SceneGraphNode but with the additional responsibility of commiting
     *  the Scene Graph leaves that are its descendents to the DOM.
     *
     * @class RootNode
     * @constructor
     * @private
     * @extends Core.SceneGraphNode
     * @param [allocator] {ElementAllocator} ElementAllocator
     */
    function RootNode(allocator) {
        SceneGraphNode.call(this);
        this.root = this;
        this.allocator = allocator;
    }

    RootNode.prototype = Object.create(SceneGraphNode.prototype);
    RootNode.prototype.constructor = RootNode;

    module.exports = RootNode;
});
