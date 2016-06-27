/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var TouchTracker = require('./_TouchTracker');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var OptionsManager = require('../core/OptionsManager');

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
     *      `cumulate`  - Accumulated displacement over successive displacements
     *      `count`     - DOM event for number of simultaneous touches
     *      `touchId`   - DOM touch event identifier
     *      `event`     - Original DOM event
     *      `dt`        - Time since last update
     *
     * @example
     *
     *      var touchInput = new TouchInput({
     *          direction : TouchInput.DIRECTION.Y
     *      });
     *
     *      touchInput.subscribe(surface);
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
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     * @param [options.count=1] {Number}        Number of simultaneous touches
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
     *                                          orthogonal direction is suppressed
     */
    function TouchInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker({memory : 1, count : this.options.count});

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', handleStart.bind(this));
        this._touchTracker.on('trackmove', handleMove.bind(this));
        this._touchTracker.on('trackend', handleEnd.bind(this));

        this._payload = {};
        this._cumulate = {};
        this._value = {};
    }

    TouchInput.prototype = Object.create(SimpleStream.prototype);
    TouchInput.prototype.constructor = TouchInput;

    TouchInput.DEFAULT_OPTIONS = {
        direction : undefined,
        scale : 1,
        rails : false,
        count : 1
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
        var touchId = data.touchId;
        var velocity;
        var delta;

        if (this.options.direction !== undefined) {
            if (!this._cumulate[touchId]) this._cumulate[touchId] = 0;
            this._value[touchId] = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            if (!this._cumulate[touchId]) this._cumulate[touchId] = [0, 0];
            this._value[touchId] = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = {};
        this._payload[data.touchId] = payload;

        payload.delta = delta;
        payload.value = this._value[touchId];
        payload.cumulate = this._cumulate[touchId];
        payload.velocity = velocity;
        payload.count = data.count;
        payload.touchId = data.touchId;
        payload.event = data.event;
        payload.timestamp = data.timestamp;

        this._eventOutput.emit('start', payload);
    }

    function handleMove(data) {
        var direction = this.options.direction;
        var touchId = data.touchId;

        var scale = this.options.scale;
        var prevData = data.history[0];

        var prevTime = prevData.timestamp;
        var currTime = data.timestamp;

        var diffX = scale * (data.x - prevData.x);
        var diffY = scale * (data.y - prevData.y);

        if (this.options.rails && direction !== undefined){
            var activateRails =
                (direction === TouchInput.DIRECTION.X && Math.abs(diffX) < Math.abs(0.5 * diffY)) ||
                (direction === TouchInput.DIRECTION.Y && Math.abs(diffY) < Math.abs(0.5 * diffX));

            if (activateRails) return false;
        }

        var dt = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
        var inv_dt = 1 / dt;

        var velX = diffX * inv_dt;
        var velY = diffY * inv_dt;

        var nextVel;
        var nextDelta;
        if (direction === TouchInput.DIRECTION.X) {
            nextDelta = diffX;
            nextVel = velX;
            this._value[touchId] += nextDelta;
            this._cumulate[touchId] += nextDelta;
        }
        else if (direction === TouchInput.DIRECTION.Y) {
            nextDelta = diffY;
            nextVel = velY;
            this._value[touchId] += nextDelta;
            this._cumulate[touchId] += nextDelta;
        }
        else {
            nextDelta = [diffX, diffY];
            nextVel = [velX, velY];
            this._value[touchId][0] += nextDelta[0];
            this._value[touchId][1] += nextDelta[1];
            this._cumulate[touchId][0] += nextDelta[0];
            this._cumulate[touchId][1] += nextDelta[1];
        }

        var payload = this._payload[data.touchId];
        payload.delta = nextDelta;
        payload.velocity = nextVel;
        payload.value = this._value[touchId];
        payload.cumulate = this._cumulate[touchId];
        payload.count = data.count;
        payload.touchId = data.touchId;
        payload.event = data.event;
        payload.timestamp = data.timestamp;
        payload.dt = dt;

        this._eventOutput.emit('update', payload);
    }

    function handleEnd(data) {
        var touchId = data.touchId;

        var payload = this._payload[touchId];
        payload.count = data.count;
        payload.event = data.event;
        payload.timestamp = data.timestamp;

        this._eventOutput.emit('end', payload);

        delete this._payload[touchId];
        delete this._value[touchId];
        delete this._cumulate[touchId];
    }

    module.exports = TouchInput;
});
