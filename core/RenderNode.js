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
    var Spec = require('./Spec');

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
        this._dirty = true;

        this._entityIds = {};

        this._cachedSize = null;
        this._cachedObjectSpec = null;
        this._cachedCompoundSpec = null;
        this._cachedParentSpec = null;
        this.passThrough = false;

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
        if (!child.render && !(child instanceof Function))
            child = new Modifier(child);

        var childNode = (child instanceof RenderNode)
            ? child
            : new RenderNode(child);

        if (this._child instanceof CombinerNode)
            this._child.add(childNode);
        else if (this._child)
            this._child = new CombinerNode([this._child, childNode]);
        else this._child = childNode;

        return childNode;
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

    RenderNode.prototype.render = function render(parentSpec) {
        this.passThrough = false;

        if (this._object){

            var parentSize = parentSpec.size;
            var object = this._object;

            var objectSpec;
            var compoundSpec;
            var cachedSize;

            var sizeDirty = false;
            var objectDirty = false;
            var parentDirty = false;

            // size computation
            if ((this._cachedSize === null) || (this._cachedSize[0] !== parentSize[0] || this._cachedSize[1] !== parentSize[1])){
                cachedSize = [parentSize[0], parentSize[1]];
                sizeDirty = true;
                this._cachedSize = cachedSize;
            }
            else cachedSize = this._cachedSize;

            // objectTransform computation
            if (object instanceof Function) {
                objectSpec = object(cachedSize);

                if (objectSpec instanceof Spec){
                    if (objectSpec._dirty || sizeDirty){
                        objectSpec = objectSpec.render(cachedSize);
                        this._cachedObjectSpec = objectSpec;
                        objectDirty = true;
                    }
                    else objectSpec = this._cachedObjectSpec;
                }
                else objectDirty = true;
            }
            else if (sizeDirty || object._dirty === true || object._dirty === undefined){
                objectSpec = object.render(cachedSize);
                this._cachedObjectSpec = objectSpec;
                objectDirty = true;
            }
            else objectSpec = this._cachedObjectSpec;

            // parent computation
            if ((this._cachedParentSpec === null) || (this._cachedParentSpec !== parentSpec)){
                parentDirty = true;
                this._cachedParentSpec = parentSpec;
            }

            // compound spec computation
            if (parentDirty || objectDirty){
                compoundSpec = SpecManager.merge(objectSpec, parentSpec, this._entityIds);
                this._cachedCompoundSpec = compoundSpec;
            }
            else {
                this.passThrough = true;
                compoundSpec = this._cachedCompoundSpec;
            }

        }
        else compoundSpec = parentSpec;

        if (this._child) {
            this._child.render(compoundSpec);
        }

        if (this.cleanState) this.cleanState();
    };

    RenderNode.prototype.clean = function(){
        this._dirty = false;
    };

    RenderNode.prototype.commit = function(allocator){
        if (!this.passThrough){
            for (var id in this._entityIds){
                var entity = Entity.get(id);
                entity.commit(this._entityIds[id], allocator);
            }
        }
        if (this._child) this._child.commit(allocator);
    };

    module.exports = RenderNode;
});
