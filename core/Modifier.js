/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    /**
     *
     *  A collection of visual changes to be
     *    applied to another renderable component. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    Modifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The Modifier's children and descendants
     *    are transformed by the amounts specified in the Modifier's properties.
     *
     * @class Modifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function Modifier(options) {
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionsGetter = null;
        this._marginsGetter = null;

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            margins: null,
            proportions: null
        };

        if (options) {
            if (options.transform) this.transformFrom(options.transform);
            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
            if (options.origin) this.originFrom(options.origin);
            if (options.align) this.alignFrom(options.align);
            if (options.size) this.sizeFrom(options.size);
            if (options.margins) this.marginsFrom(options.margins);
            if (options.proportions) this.proportionsFrom(options.proportions);
        }
    }

    /**
     * Function, object, or static transform matrix which provides the transform.
     *   This is evaluated on every tick of the engine.
     *
     * @method transformFrom
     *
     * @param {Object} transform transform provider object
     * @return {Modifier} this
     */
    Modifier.prototype.transformFrom = function transformFrom(transform) {
        if (transform instanceof Function) this._transformGetter = transform;
        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
        else {
            this._transformGetter = null;
            this._output.transform = transform;
        }
        return this;
    };

    /**
     * Set function, object, or number to provide opacity, in range [0,1].
     *
     * @method opacityFrom
     *
     * @param {Object} opacity provider object
     * @return {Modifier} this
     */
    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
        if (opacity instanceof Function) this._opacityGetter = opacity;
        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
        else {
            this._opacityGetter = null;
            this._output.opacity = opacity;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide origin, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method originFrom
     *
     * @param {Object} origin provider object
     * @return {Modifier} this
     */
    Modifier.prototype.originFrom = function originFrom(origin) {
        if (origin instanceof Function) this._originGetter = origin;
        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
        else {
            this._originGetter = null;
            this._output.origin = origin;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide align, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method alignFrom
     *
     * @param {Object} align provider object
     * @return {Modifier} this
     */
    Modifier.prototype.alignFrom = function alignFrom(align) {
        if (align instanceof Function) this._alignGetter = align;
        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
        else {
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    Modifier.prototype.getSize = function(){
        return this._output.size;
    };

    /**
     * Set function, object, or numerical array to provide size, as [width, height].
     *
     * @method sizeFrom
     *
     * @param {Object} size provider object
     * @return {Modifier} this
     */
    Modifier.prototype.sizeFrom = function sizeFrom(size) {
        if (size instanceof Function) this._sizeGetter = size;
        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
        else {
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

    Modifier.prototype.marginsFrom = function marginsFrom(margins) {
        if (margins instanceof Function) this._marginsGetter = margins;
        else if (margins instanceof Object && margins.get) this._marginsGetter = margins.get.bind(margins);
        else {
            this._marginsGetter = null;
            this._output.margins = margins;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide proportions, as [percent of width, percent of height].
     *
     * @method proportionsFrom
     *
     * @param {Object} proportions provider object
     * @return {Modifier} this
     */
    Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
        if (proportions instanceof Function) this._proportionsGetter = proportions;
        else if (proportions instanceof Object && proportions.get) this._proportionsGetter = proportions.get.bind(proportions);
        else {
            this._proportionsGetter = null;
            this._output.proportions = proportions;
        }
        return this;
    };

    // call providers on tick to receive render spec elements to apply
    function _update() {
        if (this._transformGetter) this._output.transform = this._transformGetter();
        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
        if (this._originGetter) this._output.origin = this._originGetter();
        if (this._alignGetter) this._output.align = this._alignGetter();
        if (this._sizeGetter) this._output.size = this._sizeGetter();
        if (this._marginsGetter) this._output.margins = this._marginsGetter();
        if (this._proportionsGetter) this._output.proportions = this._proportionsGetter();
    }

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Modifier.prototype.render = function render() {
        _update.call(this);
        return this._output;
    };

    module.exports = Modifier;
});
