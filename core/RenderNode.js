/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var CombinerNode = require('./CombinerNode');
    var Transform = require('./Transform');
    var SpecManager = require('./SpecManager');
    var Modifier = require('./Modifier');
    var Entity = require('./Entity');
    var CommitData = require('./CommitData');

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._parent = null;

        this._entityIds = [];

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} child renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(child) {
        // Sugar for adding modifiers
        if (!child.render) child = new Modifier(child);

        if (child._id !== undefined && Entity.has(child._id))
            this.pushEntityId(child._id);

        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);

        childNode._parent = this;

        if (this._child instanceof CombinerNode)
            this._child.add(childNode);
        else if (this._child)
            this._child = new CombinerNode([this._child, childNode]);
        else this._child = childNode;

        return childNode;
    };

    RenderNode.prototype.pushEntityId = function(id){
        this._entityIds.push(id);
        if (this._parent) this._parent.pushEntityId(id);
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._child ? this._child.get() : null);
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(child) {
        this._object = child;
        return this;
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child) result = this._child.getSize();
        return result;
    };

    /**
     * Generate a render spec from the contents of the wrapped component.
     *
     * @private
     * @method render
     *
     * @return {Object} render specification for the component subtree
     *    only under this node.
     */

    RenderNode.prototype.render = function render(sizeSpec) {
        var size;
        if (this._object){
            var objectTransform = this._object.render(sizeSpec);
            size = SpecManager.getSize(objectTransform, sizeSpec.size);
        }
        else size = sizeSpec.size;

        if (this._child) this._child.render({size : size});

        if (objectTransform){

            if (!objectTransform.size) objectTransform.size = size;

            for (var i = 0; i < this._entityIds.length; i++){
                var id = this._entityIds[i];
                var data = CommitData.get(id);
                var newData = SpecManager.merge(data, objectTransform);
                CommitData.set(id, newData);
            }

        }
    };

    RenderNode.prototype.commit = function(allocator){
        for (var i = 0; i < this._entityIds.length; i++){
            var id = this._entityIds[i];
            var entity = Entity.get(id);
            var data = CommitData.get(id);
            entity.commit(data, allocator);
            CommitData.reset(id);
        }
    };

    module.exports = RenderNode;
});
