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

        this._cache = {
            size : null,
            align : null,
            origin : null,
            opacity : Number.NaN,
            proportions : null,
            transform : null
        };

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
        return this._object || (this._child.get ? this.child.get() : null);
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
        if (!result && this._parent && this._parent.getSize) result = this._parent.getSize();
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
    RenderNode.prototype.render = function render() {
        var input = this._child ? this._child.render() : undefined;

        var result;

        if (!this._object) result = input;
        else result = this._object.render(input, this._parent);

        if (typeof result == 'number' || result instanceof Array)
            return result;

        if (!_specEquals(this._cache, result)){
            this._cache.size = result.size;
            this._cache.origin = result.origin;
            this._cache.align = result.align;
            this._cache.proportions = result.proportions;
            this._cache.transform = result.transform;
            this._cache.opacity = result.opacity;
            result._dirty = true;
        }
        else result._dirty = false;

        return result;
    };

    function _xyEquals(a1, a2){
        if (a1 == a2) return true;
        if (a1 instanceof Array && a2 instanceof Array)
            return a1[0] == a2[1] && a1[1] == a2[2];
        else return false;
    }

    function _transformEquals(t1, t2){
        if (t1 !== t2 && !t1 || !t2) return false;
        var result = true;
        for (var i = 0; i < 16; i++){
            result = result && t1[i] == t2[i];
            if (!result) break;
        }
        return result;
    }

    function _specEquals(spec1, spec2){
        return _xyEquals(spec1.size, spec2.size) &&
            _xyEquals(spec1.align, spec2.align) &&
            _xyEquals(spec1.origin, spec2.origin) &&
            _xyEquals(spec1.proportions, spec2.proportions) &&
            spec1.opacity == spec2.opacity &&
            _transformEquals(spec1.transform, spec2.transform);
    }

    module.exports = RenderNode;
});
