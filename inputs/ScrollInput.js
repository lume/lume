/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

/* Documentation in progress. May be outdated. */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var OptionsManager = require('samsara/core/OptionsManager');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var Timer = require('samsara/core/Timer');

    var MINIMUM_TICK_TIME = 8;

    /**
     * Wrapper for DOM wheel/mousewheel events. Converts `scroll` events
     *  to `start`, `update` and `end` events and emits them with the payload:
     *
     *      `value`     - Scroll displacement in pixels from start
     *      `delta`     - Scroll differential in pixels between subsequent events
     *      `velocity`  - Velocity of scroll
     *
     * @class ScrollInput
     * @constructor
     * @extends Streams.SimpleStream
     * @uses TouchTracker
     * @uses OptionsManager
     * @param [options] {Object}                Options
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     */
    function ScrollInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._payload = {
            delta    : null,
            value    : null,
            velocity : null
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('mousewheel', handleMove.bind(this));
        this._eventInput.on('wheel', handleMove.bind(this));

        this._value = (this.options.direction === undefined) ? [0,0] : 0;
        this._prevTime = undefined;
        this._inProgress = false;

        var self = this;
        this._scrollEnd = Timer.debounce(function(){
            self._inProgress = false;
            self._eventOutput.emit('end', self._payload);
        }, 100);
    }

    ScrollInput.prototype = Object.create(SimpleStream.prototype);
    ScrollInput.prototype.constructor = ScrollInput;

    ScrollInput.DEFAULT_OPTIONS = {
        direction: undefined,
        scale: 1
    };

    /**
     * Constrain the input along a specific axis.
     *
     * @property DIRECTION {Object}
     * @property DIRECTION.X {Number}   x-axis
     * @property DIRECTION.Y {Number}   y-axis
     * @static
     */
    ScrollInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    var _now = Date.now;

    function handleMove(event) {
        if (!this._inProgress) {
            this._value = (this.options.direction === undefined) ? [0,0] : 0;
            payload = this._payload;
            payload.value = this._value;
            payload.clientX = event.clientX;
            payload.clientY = event.clientY;
            payload.offsetX = event.offsetX;
            payload.offsetY = event.offsetY;

            this._eventOutput.emit('start', payload);
            this._inProgress = true;
            return;
        }

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        var invDeltaT = 1 / Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
        this._prevTime = currTime;

        var velX = diffX * invDeltaT;
        var velY = diffY * invDeltaT;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollInput.DIRECTION.X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._value += nextDelta;
        }
        else if (this.options.direction === ScrollInput.DIRECTION.Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._value += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._value[0] += nextDelta[0];
            this._value[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.value = this._value;

        this._eventOutput.emit('update', payload);

        // debounce `end` event
        this._scrollEnd();
    }

    module.exports = ScrollInput;
});
