/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var CombinerNode = require('./CombinerNode');
    var CacheManager = require('./CacheManager');
    var Transform = require('./Transform');
    var Entity = require('./Entity');

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

        this.cacheManager = new CacheManager();

        this._resultCache = {};
        this._prevResults = {};

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
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);

        if (this._child instanceof CombinerNode)
            this._child.add(childNode);
        else if (this._child)
            this._child = new CombinerNode([this._child, childNode]);
        else this._child = childNode;

        childNode._parent = this;

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
        this._child = null;
        this._parent = null;
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

    RenderNode.prototype.getParentSize = function(){
        return (this._parent) ? this._parent.getSize() : this._parent.getParentSize() || null;
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
    RenderNode.prototype.render = function render(context) {
        if (this._object) {
            var spec = this._object.render(context);
            context = flattenSpec(spec, context);
            if (context.commit) Entity.register(this._object, context);
        }

        if (this._child) this._child.render(context);
    };

    var _zeroZero = [0,0];
    function flattenSpec(spec, parentSpec){
        //spec is either an object
        if (spec === null){
            transform = parentSpec.transform;
            align = parentSpec.align || _zeroZero;
            if (parentSpec.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentSpec.size[0], align[1] * parentSpec.size[1], 0];
                // transform is relative to origin defined by last size context's transform and its alignment
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, parentSpec.nextsizeContext));
            }
            return {
                transform: transform,
                opacity: parentSpec.opacity,
                origin: parentSpec.origin || _zeroZero,
                size: parentSpec.size,
                commit : true
            };
        }

        if (spec instanceof Object){
            var opacity = (spec.opacity !== undefined)
                ? parentSpec.opacity * spec.opacity
                : parentSpec.opacity;

            var transform = (spec.transform)
                ? Transform.multiply(parentSpec.transform, spec.transform)
                : parentSpec.transform;

            var align = (spec.align)
                ? spec.align
                : parentSpec.align;

            var origin = (spec.origin)
                ? spec.origin
                : parentSpec.origin;

            var nextsizeContext = (spec.origin)
                ? parentSpec.transform
                : parentSpec.nextsizeContext;

            var size;
            if (spec.size || spec.proportions) {
                var parentSize = parentSpec.size;
                size = [parentSize[0], parentSize[1]];

                if (spec.size) {
                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
                }

                if (spec.proportions) {
                    if (spec.proportions[0] !== undefined) size[0] *= spec.proportions[0];
                    if (spec.proportions[1] !== undefined) size[1] *= spec.proportions[1];
                }

                if (align && (align[0] || align[1]))
                    transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], parentSpec.transform));

                if (origin && (origin[0] || origin[1]))
                    transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);

                nextsizeContext = parentSpec.transform;
                origin = null;
                align = null;
            }
            else size = parentSpec.size;

            return {
                transform : transform,
                opacity : opacity,
                origin : origin,
                align : align,
                size : size,
                nextsizeContext : nextsizeContext
            }
        }
    }

    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    module.exports = RenderNode;
});
