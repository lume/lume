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
     * @extends SceneGraphNode
     */
    function RootNode() {
        SceneGraphNode.call(this);

        this.root = this;
        this.specs = {};
        this.objects = {};
        this.dirtyObjects = [];
    }

    RootNode.prototype = Object.create(SceneGraphNode.prototype);
    RootNode.prototype.constructor = RootNode;

    /**
     * Commit the RootNode's descendants to the DOM.
     *
     * @method commit
     * @param allocator {ElementAllocator}  The elementAllocator provided by a Context
     */
    RootNode.prototype.commit = function commit(allocator){
        var objects = this.objects;
        var specs = this.specs;

        for (var key in objects)
            objects[key].commit(specs[key], allocator);

        while (this.dirtyObjects.length)
            this.dirtyObjects.pop().commit(null, allocator);
    };

    module.exports = RootNode;
});
