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
    var dirtyQueue = require('famous/core/dirtyQueue');

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
        this._dirty = true;
        this._dirtyLock = 0;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.on('start', function(){
            this._dirtyLock++;
            if (this._dirty) return;
            this._dirty = true;
            this._eventOutput.emit('start', this._output);
        }.bind(this));

        this._eventInput.on('end', function(){
            this._dirtyLock--;
            if (this._dirtyLock == 0){
                this._dirty = false;
                this._eventOutput.emit('end');
            }
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

    function _fireDirty(){
        if (this._dirty) return;
        this.trigger('start');
        dirtyQueue.push(this);
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
        if (transform instanceof Object && transform.get) {
            this._eventInput.subscribe(transform);
        }
        else {
            this._output.transform = transform;
            _fireDirty.call(this);
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
        if (opacity instanceof Object && opacity.emit) {
            opacity.on('start', function(data){
                this._output.opacity = data.value;
                this.trigger('start');
            }.bind(this));

            opacity.on('update', function(data){
                this._output.opacity = data.value;
            }.bind(this));

            opacity.on('end', function(data){
                this._output.opacity = data.value;
                this.trigger('end');
            }.bind(this));

            this._output.opacity = opacity.get();
        }
        else {
            this._output.opacity = opacity;
            _fireDirty.call(this);
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
        if (origin instanceof Object && origin.get) {
            this._eventInput.subscribe(origin);
        }
        else {
            this._output.origin = origin;
            _fireDirty.call(this);
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
        if (align instanceof Object && align.get) {
            this._eventInput.subscribe(align);
        }
        else {
            this._output.align = align;
            _fireDirty.call(this);
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
        if (size instanceof Object && size.get) {
            this._eventInput.subscribe(size);
            this._sizeGetter = size.get.bind(size);
        }
        else {
            this._sizeGetter = null;
            this._output.size = size;
            _fireDirty.call(this);
        }
        return this;
    };

    Modifier.prototype.marginsFrom = function marginsFrom(margins) {
        if (margins instanceof Object && margins.get) {
            this._eventInput.subscribe(margins);
        }
        else {
            this._output.margins = margins;
            _fireDirty.call(this);
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
        if (proportions instanceof Object && proportions.get) {
            this._eventInput.subscribe(proportions);
        }
        else {
            this._output.proportions = proportions;
            _fireDirty.call(this);
        }
        return this;
    };

    Modifier.prototype.clean = function(){
        if (this._dirtyLock == 0) {
            this._dirty = false;
            this.emit('end');
        }
    };

    module.exports = Modifier;
});
