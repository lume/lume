/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('./Transform');
    var EventHandler = require('famous/core/EventHandler');

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

        this._transformDirty = null;
        this._opacityDirty = null;
        this._originDirty = null;
        this._alignDirty = null;
        this._sizeDirty = null;
        this._proportionsDirty = null;
        this._marginsDirty = null;

        this._dirty = true;
        this._dirtyLock = 0;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.on('start', function(){
            debugger
            this._dirty = true;
            this._dirtyLock++;
            this._eventOutput.emit('dirty');
        }.bind(this));

        this._eventInput.on('end', function(){
            debugger
            this._dirtyLock--;
            this._eventOutput.emit('clean');
        }.bind(this));


        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            margins: null,
            proportions: null
        };

        if (options) this.from(options);
    }

    Modifier.prototype.from = function from(options){
        if (options.transform) this.transformFrom(options.transform);
        if (options.opacity !== undefined) this.opacityFrom(options.opacity);
        if (options.origin) this.originFrom(options.origin);
        if (options.align) this.alignFrom(options.align);
        if (options.size) this.sizeFrom(options.size);
        if (options.margins) this.marginsFrom(options.margins);
        if (options.proportions) this.proportionsFrom(options.proportions);
    };

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
        if (transform instanceof Function) {
            this._transformDirty = true;
            this._transformGetter = transform;
//            this._eventOutput.emit('dirty');
        }
        else if (transform instanceof Object && transform.get) {
//            this._eventInput.subscribe(transform);
            this._transformDirty = transform.isDirty ? transform.isDirty.bind(transform) : true;
            this._transformGetter = transform.get.bind(transform);
        }
        else {
//            this._dirty = true;
            this._transformDirty = false;
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
        if (opacity instanceof Function) {
            this._eventOutput.emit('dirty');
            this._opacityDirty = true;
            this._opacityGetter = opacity;
        }
        else if (opacity instanceof Object && opacity.get) {
            this._eventInput.subscribe(opacity);
            this._opacityDirty = opacity.isDirty ? opacity.isDirty.bind(opacity) : true;
            this._opacityGetter = opacity.get.bind(opacity);
        }
        else {
            this._dirty = true;
            this._opacityDirty = false;
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
        if (origin instanceof Function) {
            this._originDirty = true;
            this._originGetter = origin;
        }
        else if (origin instanceof Object && origin.get) {
            this._originDirty = origin.isDirty ? origin.isDirty.bind(origin) : true;
            this._originGetter = origin.get.bind(origin);
        }
        else {
            this._originDirty = false;
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
        if (align instanceof Function) {
            this._alignDirty = true;
            this._alignGetter = align;
        }
        else if (align instanceof Object && align.get) {
            this._alignDirty = align.isDirty ? align.isDirty.bind(align) : true;
            this._alignGetter = align.get.bind(align);
        }
        else {
            this._alignDirty = false;
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    Modifier.prototype.getSize = function(){
        return (this._output._sizeGetter)
            ? this._output._sizeGetter()
            : this._output.size;
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
        if (size instanceof Function) {
            this._sizeDirty = true;
            this._sizeGetter = size;
        }
        else if (size instanceof Object && size.get) {
            this._sizeDirty = size.isDirty ? size.isDirty.bind(size) : true;
            this._sizeGetter = size.get.bind(size);
        }
        else {
            this._sizeDirty = false;
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

    Modifier.prototype.marginsFrom = function marginsFrom(margins) {
        if (margins instanceof Function) {
            this._marginsDirty = true;
            this._marginsGetter = margins;
        }
        else if (margins instanceof Object && margins.get) {
            this._marginsDirty = margins.isDirty ? margins.isDirty.bind(margins) : true;
            this._marginsGetter = margins.get.bind(margins);
        }
        else {
            this._marginsDirty = false;
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
        if (proportions instanceof Function) {
            this._proportionsDirty = true;
            this._proportionsGetter = proportions;
        }
        else if (proportions instanceof Object && proportions.get) {
            this._proportionsDirty = proportions.isDirty ? proportions.isDirty.bind(proportions) : true;
            this._proportionsGetter = proportions.get.bind(proportions);
        }
        else {
            this._proportionsDirty = false;
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
        if (this._dirty) {
            _update.call(this);
            console.log('updated')
        }
        if (!this._dirtyLock) this._dirty = false;

        return this._output;
    };

    module.exports = Modifier;
});
