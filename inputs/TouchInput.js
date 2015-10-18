/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var TouchTracker = require('samsara/inputs/TouchTracker');
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var OptionsManager = require('samsara/core/OptionsManager');

    var MINIMUM_TICK_TIME = 8;

    /**
     * Wrapper for DOM touch events. Converts
     *
     *      `touchstart` -> `start`
     *      `touchmove`  -> `update`
     *      `touchend`   -> `end`
     *
     * TouchInput emits these events with the following payload data:
     *
     *      `value`     - Displacement in pixels from `touchstart`
     *      `delta`     - Differential in pixels between successive mouse positions
     *      `velocity`  - Velocity of mouse movement in pixels per second
     *      `clientX`   - DOM event clientX property
     *      `clientY`   - DOM event clientY property
     *      `count`     - DOM event for number of simultaneous touches
     *      `touch`     - DOM touch event identifier
     *
     * @example
     *
     *      var touchInput = new TouchInput({
     *          direction : TouchInput.DIRECTION.Y
     *      });
     *
     *      touchInput.subscribe(Engine);
     *
     *      touchInput.on('start', function(payload){
     *          // fired on mouse down
     *          console.log('start', payload);
     *      });
     *
     *      touchInput.on('update', function(payload){
     *          // fired on mouse move
     *          console.log('update', payload);
     *      });
     *
     *      touchInput.on('end', function(payload){
     *          // fired on mouse up
     *          console.log('end', payload);
     *      });
     *
     * @class TouchInput
     * @constructor
     * @extends Streams.SimpleStream
     * @uses Inputs.TouchTracker
     * @uses Core.OptionsManager
     * @param [options] {Object}                Options
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     */
    function TouchInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker();

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', handleStart.bind(this));
        this._touchTracker.on('trackmove', handleMove.bind(this));
        this._touchTracker.on('trackend', handleEnd.bind(this));

        this._payload = {
            delta    : null,
            value    : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        this._position = null;
    }

    TouchInput.prototype = Object.create(SimpleStream.prototype);
    TouchInput.prototype.constructor = TouchInput;

    TouchInput.DEFAULT_OPTIONS = {
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
    TouchInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    function handleStart(data) {
        var velocity;
        var delta;
        if (this.options.direction !== undefined){
            this._position = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            this._position = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.value = this._position;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touch = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    function handleMove(data) {
        var history = data.history;

        var currHistory = history[history.length - 1];
        var prevHistory = history[history.length - 2];

        var distantTime = prevHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = currHistory.x - prevHistory.x;
        var diffY = currHistory.y - prevHistory.y;

        var velDiffX = currHistory.x - prevHistory.x;
        var velDiffY = currHistory.y - prevHistory.y;

        var invDeltaT = Math.max(currTime - distantTime, MINIMUM_TICK_TIME);

        var velX = velDiffX * invDeltaT;
        var velY = velDiffY * invDeltaT;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchInput.DIRECTION.X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === TouchInput.DIRECTION.Y) {
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
        payload.delta      = nextDelta;
        payload.velocity   = nextVel;
        payload.value      = this._position;
        payload.clientX    = data.x;
        payload.clientY    = data.y;
        payload.count      = data.count;
        payload.touch      = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    function handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    module.exports = TouchInput;
});
