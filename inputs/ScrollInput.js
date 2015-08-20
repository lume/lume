/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');
    var Engine = require('../core/Engine');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Handles piped in mousewheel events.
     *   Emits 'start', 'update', and 'end' events with payloads including:
     *   delta: change since last position,
     *   position: accumulated deltas,
     *   velocity: speed of change in pixels per ms,
     *
     *   Can be used as delegate of GenericInput.
     *
     * @class ScrollInput
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.direction] Pay attention to x changes (ScrollInput.DIRECTION_X),
     *   y changes (ScrollInput.DIRECTION_Y) or both (undefined)
     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
     */
    function ScrollInput(options) {
        this.options = Object.create(ScrollInput.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            scroll   : true
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._position = (this.options.direction === undefined) ? [0,0] : 0;
        this._prevTime = undefined;
        this._boundNewFrame = _newFrame.bind(this);
        this._eventInput.on('mousewheel', _handleMove.bind(this));
        this._eventInput.on('wheel', _handleMove.bind(this));
        this._inProgress = false;
        this._loopBound = false;
    }

    ScrollInput.DEFAULT_OPTIONS = {
        direction: undefined,
        minimumEndSpeed: 1e-1,
        rails: false,
        scale: 1,
        stallTime: 80,
        lineHeight: 40,
        preventDefault: true
    };

    ScrollInput.DIRECTION_X = 0;
    ScrollInput.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _newFrame() {
        var dt = _now() - this._prevTime;
        if (this._inProgress && dt > this.options.stallTime) {
//            this._payload.velocity = 0;
            this._eventOutput.emit('end', this._payload);

            this._inProgress = false;
            this._loopBound = false;
            Engine.off('prerender', this._boundNewFrame);
        }
    }

    function _handleMove(event) {
        if (this.options.preventDefault) event.preventDefault();

        if (!this._inProgress) {
            if (!this._loopBound) {
                Engine.on('prerender', this._boundNewFrame);
                this._loopBound = true;
            }

            this._position = (this.options.direction === undefined) ? [0,0] : 0;
            payload = this._payload;
            payload.position = this._position;
            payload.clientX = event.clientX;
            payload.clientY = event.clientY;
            payload.offsetX = event.offsetX;
            payload.offsetY = event.offsetY;

            this._eventOutput.emit('start', payload);
        }

        this._inProgress = true;
        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
        this._prevTime = currTime;

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollInput.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === ScrollInput.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;

        this._eventOutput.emit('update', payload);
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScrollInput.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.minimimEndSpeed] If final velocity smaller than this, round down to 0.
     * @param {Number} [options.stallTime] ms of non-motion before 'end' emitted
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] ScrollInput.DIRECTION_X, DIRECTION_Y -
     *    pay attention to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    ScrollInput.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = ScrollInput;
});
