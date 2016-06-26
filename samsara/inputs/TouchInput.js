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
     *      `clientX`   - DOM event clientX property
     *      `clientY`   - DOM event clientY property
     *      `count`     - DOM event for number of simultaneous touches
     *      `touchId`     - DOM touch event identifier
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
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in TouchInput.DIRECTION.
     * @param [options.rails=false] {Boolean}   If a direction is specified, movement in the
     *                                          orthogonal direction is suppressed
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
            delta : null,
            value : null,
            cumulate : null,
            velocity : null,
            clientX : undefined,
            clientY : undefined,
            count : 0,
            touchId : undefined
        };

        this._cumulate = null;
        this._value = null;
    }

    TouchInput.prototype = Object.create(SimpleStream.prototype);
    TouchInput.prototype.constructor = TouchInput;

    TouchInput.DEFAULT_OPTIONS = {
        direction : undefined,
        scale : 1,
        rails : false
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
        if (this.options.direction !== undefined) {
            if (this._cumulate === null) this._cumulate = 0;
            this._value = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            if (this._cumulate === null) this._cumulate = [0, 0];
            this._value = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touchId = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    function handleMove(data) {
        var direction = this.options.direction

        var scale = this.options.scale;
        var history = data.history;

        var currHistory = history[history.length - 1];
        var prevHistory = history[history.length - 2];

        var prevTime = prevHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = scale * (currHistory.x - prevHistory.x);
        var diffY = scale * (currHistory.y - prevHistory.y);

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
            this._value += nextDelta;
            this._cumulate += nextDelta;
        }
        else if (direction === TouchInput.DIRECTION.Y) {
            nextDelta = diffY;
            nextVel = velY;
            this._value += nextDelta;
            this._cumulate += nextDelta;
        }
        else {
            nextDelta = [diffX, diffY];
            nextVel = [velX, velY];
            this._value[0] += nextDelta[0];
            this._value[1] += nextDelta[1];
            this._cumulate[0] += nextDelta[0];
            this._cumulate[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta = nextDelta;
        payload.velocity = nextVel;
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touchId = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    function handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    module.exports = TouchInput;
});
