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
    var TouchTracker = require('samsara/inputs/TouchTracker');
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var OptionsManager = require('samsara/core/OptionsManager');

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with delta, position, velocity, acceleration, clientX, clientY, count, and touch id.
     *   Useful for dealing with inputs on touch devices. Designed to be used either as standalone, or
     *   included in a GenericInput.
     *
     * @class TouchInput
     * @constructor
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    function TouchInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker();

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', _handleStart.bind(this));
        this._touchTracker.on('trackmove', _handleMove.bind(this));
        this._touchTracker.on('trackend', _handleEnd.bind(this));

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

    TouchInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by trackstart.
     *  @method _handleStart
     *  @private
     */
    function _handleStart(data) {
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

    /**
     *  Triggered by trackmove.
     *  @method _handleMove
     *  @private
     */
    function _handleMove(data) {
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

    /**
     *  Triggered by trackend.
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    module.exports = TouchInput;
});
