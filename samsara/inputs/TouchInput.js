/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var TouchTracker = require('./_TouchTracker');
    var EventHandler = require('../events/EventHandler');
    var StreamContract = require('../streams/_StreamContract');
    var OptionsManager = require('../core/_OptionsManager');

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
     *      `x`         - x-position relative to screen (independent of scroll)
     *      `y`         - y-position relative to screen (independent of scroll)
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
     * @uses Inputs._TouchTracker
     * @uses Core._OptionsManager
     * @param [options] {Object}                Options
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     * @param [options.track=1] {Number}        Max simultaneous touches to record
     * @param [options.limit=Infinity] {Number} Limit number of touches. If reached, no events are emitted
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.rails=false] {Boolean}   If a direction is unspecified, movement in the
     *                                          orthogonal to the principal direction is suppressed
     */
    function TouchInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        StreamContract.call(this);

        this._touchTracker = new TouchTracker(this.options);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', handleStart.bind(this));
        this._touchTracker.on('trackmove', handleMove.bind(this));
        this._touchTracker.on('trackend', handleEnd.bind(this));

        this._payload = {};
        this._cumulate = {};
        this._value = {};
    }

    TouchInput.prototype = Object.create(StreamContract.prototype);
    TouchInput.prototype.constructor = TouchInput;

    TouchInput.DEFAULT_OPTIONS = {
        direction : undefined,
        scale : 1,
        rails : false,
        track : 1,
        limit : Infinity
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

        var payload = {};
        if (this.options.direction !== undefined) {
            if (this.options.direction === TouchInput.DIRECTION.X) payload.x = data.x;
            if (this.options.direction === TouchInput.DIRECTION.Y) payload.y = data.y;
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
            payload.x = data.x;
            payload.y = data.y;
        }

        payload.delta = delta;
        payload.value = this._value[touchId];
        payload.cumulate = this._cumulate[touchId];
        payload.velocity = velocity;
        payload.count = data.count;
        payload.touchId = data.touchId;
        payload.event = data.event;
        payload.timestamp = data.timestamp;
        payload.dt = 0;

        this._payload[data.touchId] = payload;

        this.emit('start', payload);
    }

    function handleMove(data) {
        var direction = this.options.direction;
        var touchId = data.touchId;
        var payload = this._payload[touchId];

        var scale = this.options.scale;
        var prevData = data.history[0];

        var prevTime = prevData.timestamp;
        var currTime = data.timestamp;

        var x = data.x;
        var y = data.y;

        var diffX = scale * (x - prevData.x);
        var diffY = scale * (y - prevData.y);

        if (this.options.rails){
            if ((direction === TouchInput.DIRECTION.X && Math.abs(diffY) > Math.abs(diffX)))
                diffY = 0;

            if (direction === TouchInput.DIRECTION.Y && Math.abs(diffX) > Math.abs(diffY))
                diffX = 0;
        }

        var dt = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);
        var invDt = 1 / dt;

        var velX = diffX * invDt;
        var velY = diffY * invDt;

        var nextVel;
        var nextDelta;

        if (direction === TouchInput.DIRECTION.X) {
            payload.x = x;
            nextDelta = diffX;
            nextVel = velX;
            this._value[touchId] += nextDelta;
            this._cumulate[touchId] += nextDelta;
        }
        else if (direction === TouchInput.DIRECTION.Y) {
            payload.y = y;
            nextDelta = diffY;
            nextVel = velY;
            this._value[touchId] += nextDelta;
            this._cumulate[touchId] += nextDelta;
        }
        else {
            payload.x = x;
            payload.y = y;
            nextDelta = [diffX, diffY];
            nextVel = [velX, velY];
            this._value[touchId][0] += nextDelta[0];
            this._value[touchId][1] += nextDelta[1];
            this._cumulate[touchId][0] += nextDelta[0];
            this._cumulate[touchId][1] += nextDelta[1];
        }

        payload.delta = nextDelta;
        payload.velocity = nextVel;
        payload.value = this._value[touchId];
        payload.cumulate = this._cumulate[touchId];
        payload.count = data.count;
        payload.touchId = data.touchId;
        payload.event = data.event;
        payload.timestamp = data.timestamp;
        payload.dt = dt;

        this.emit('update', payload);
    }

    function handleEnd(data) {
        var touchId = data.touchId;

        var payload = this._payload[touchId];
        payload.count = data.count;
        payload.event = data.event;
        payload.timestamp = data.timestamp;

        this.emit('end', payload);
        delete this._payload[touchId];
        delete this._value[touchId];
        delete this._cumulate[touchId];
    }

    module.exports = TouchInput;
});
