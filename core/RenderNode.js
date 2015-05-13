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
    var EventHandler = require('famous/core/EventHandler');

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

        this._cachedSize = [Number.NaN,Number.NaN];
        this._cachedObjectSpec = null;
        this._cachedCompoundSpec = null;
        this._cachedParentSpec = null;
        this._passThrough = false;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
        this._eventInput.bindThis(this);

        this._eventInput.on('dirty', function(){
            if (!this._dirty) {
                this._dirty = true;
                this._eventOutput.emit('dirty');
            }
        });

        this._eventInput.on('clean', function(){
            if (this._dirty) {
                this._dirty = false;
                this._eventOutput.emit('clean');
            }
        });

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

        var childNode = (child instanceof RenderNode || child._isView)
            ? child
            : new RenderNode(child);

        if (this._child instanceof CombinerNode)
            this._child.add(childNode);
        else if (this._child)
            this._child = new CombinerNode([this._child, childNode]);
        else this._child = childNode;

        this._eventInput.subscribe(childNode);

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
    RenderNode.prototype.set = function set(object) {
        this._object = object;
        if (object.emit) this._eventInput.subscribe(object);
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
     */

    RenderNode.prototype.render = function render(parentSpec) {
        // parent spec computation
        var parentSpecDirty;
        if (this._cachedParentSpec !== parentSpec){
            parentSpecDirty = true;
            this._cachedParentSpec = parentSpec;
        }
        else parentSpecDirty = false;

        // size computation
        var parentSize = parentSpec.size;
        var parentSizeDirty = false;
        if (this._cachedSize[0] !== parentSize[0] || this._cachedSize[1] !== parentSize[1]) {
            this._cachedSize[0] = parentSize[0];
            this._cachedSize[1] = parentSize[1];
            parentSizeDirty = true;
        }

        // pass through check
        if (!this._dirty && !parentSpecDirty && !parentSizeDirty) {
            this._passThrough = true;
            if (this._child) this._child.render(this._cachedCompoundSpec);
            return;
        }

        this._passThrough = false;

        if (this._object){
            var objectSpec;
            var objectSpecDirty = false;

            // objectSpec computation
            if (this._object instanceof Function) {
                objectSpec = this._object(parentSize);

                if (objectSpec instanceof Spec)
                    objectSpec = objectSpec.render(parentSize);

                objectSpecDirty = true;
            }
            else if (this._object._dirty === true || parentSizeDirty){
                objectSpec = this._object.render(parentSize);
                this._cachedObjectSpec = objectSpec;
                objectSpecDirty = true;
            }
            else objectSpec = this._cachedObjectSpec;

            // compound spec computation
            var compoundSpec;
            if (parentSpecDirty || objectSpecDirty)
                compoundSpec = SpecManager.merge(objectSpec, parentSpec, this._entityIds);
            else {
                this._passThrough = true;
                compoundSpec = this._cachedCompoundSpec;
            }
        }
        else compoundSpec = parentSpec;

        if (this._child) {
            this._cachedCompoundSpec = compoundSpec;
            this._child.render(compoundSpec);
        }
    };

    RenderNode.prototype.commit = function(allocator){
        if (!this._passThrough){
            for (var id in this._entityIds){
                var entity = Entity.get(id);
                entity.commit(this._entityIds[id], allocator);
            }
        }
        if (this._child) this._child.commit(allocator);
    };

    module.exports = RenderNode;
});
