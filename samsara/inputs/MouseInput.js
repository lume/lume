/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var SimpleStream = require('../streams/SimpleStream');

    var MINIMUM_TICK_TIME = 8;
    var _now = Date.now;

    /**
     * Wrapper for DOM mouse events. Converts
     *
     *      `mousedown` -> `start`
     *      `mousemove` -> `update`
     *      `mouseup`   -> `end`
     *
     * MouseInput emits these events with the following payload data:
     *
     *      `value`     - Displacement in pixels from `mousedown`
     *      `delta`     - Differential in pixels between successive mouse positions
     *      `velocity`  - Velocity of mouse movement in pixels per second
     *      `cumulate`  - Accumulated value over successive displacements
     *      `clientX`   - DOM event clientX property
     *      `clientY`   - DOM event clientY property
     *      `offsetX`   - DOM event offsetX property
     *      `offsetY`   - DOM event offsetY property
     *
     * @example
     *
     *      var surface = new Surface({
     *          size : [100,100],
     *          properties : {background : 'red'}
     *      });
     *
     *      var mouseInput = new MouseInput({
     *          direction : MouseInput.DIRECTION.X
     *      });
     *
     *      mouseInput.subscribe(surface);
     *
     *      mouseInput.on('start', function(payload){
     *          // fired on mouse down
     *          console.log('start', payload);
     *      });
     *
     *      mouseInput.on('update', function(payload){
     *          // fired on mouse move
     *          console.log('update', payload);
     *      });
     *
     *      mouseInput.on('end', function(payload){
     *          // fired on mouse up
     *          console.log('end', payload);
     *      });
     *
     * @class MouseInput
     * @constructor
     * @extend SimpleStream
     * @param [options] {Object}                Options
     * @param [options.direction] {Number}      Direction to project movement onto.
     *                                          Options found in MouseInput.DIRECTION.
     * @param [options.scale=1] {Number}        Scale the response to the mouse
     */
    function MouseInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        // references for event listeners put on document when
        // mouse is quickly moved off of target DOM element
        this.boundMove = null;
        this.boundUp = null;

        this._eventInput.on('mousedown',    handleStart.bind(this));
        this._eventInput.on('mousemove',    handleMove.bind(this));
        this._eventInput.on('mouseup',      handleEnd.bind(this));
        this._eventInput.on('mouseenter',   handleEnter.bind(this));
        this._eventInput.on('mouseleave',   handleLeave.bind(this));

        this._payload = {
            delta : null,
            value : null,
            cumulate : null,
            velocity : null,
            clientX : 0,
            clientY : 0,
            offsetX : 0,
            offsetY : 0
        };

        this._value = null;
        this._cumulate = null;
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._move = false;
    }

    MouseInput.prototype = Object.create(SimpleStream.prototype);
    MouseInput.prototype.constructor = MouseInput;

    MouseInput.DEFAULT_OPTIONS = {
        direction : undefined,
        scale : 1
    };

    /**
     * Constrain the input along a specific axis.
     *
     * @property DIRECTION {Object}
     * @property DIRECTION.X {Number}   x-axis
     * @property DIRECTION.Y {Number}   y-axis
     * @static
     */
    MouseInput.DIRECTION = {
        X : 0,
        Y : 1
    };

    function handleStart(event) {
        var delta;
        var velocity;

        event.preventDefault(); // prevent drag

        var x = event.clientX;
        var y = event.clientY;

        this._prevCoord = [x, y];
        this._prevTime = _now();
        this._down = true;
        this._move = false;

        if (this.options.direction !== undefined) {
            if (this._cumulate === null) this._cumulate = 0;
            this._value = 0;
            delta = 0;
            velocity = 0;
        }
        else {
            if (this._cumulate === null) this._cumulate = [0, 0];
            this._value = [0, 0];
            delta = [0, 0];
            velocity = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.velocity = velocity;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._eventOutput.emit('start', payload);
    }

    function handleMove(event){
        if (!this._down) return false;

        var scale = this.options.scale;

        var prevCoord = this._prevCoord;
        var prevTime = this._prevTime;

        var x = event.clientX;
        var y = event.clientY;

        var currTime = _now();

        var diffX = scale * (x - prevCoord[0]);
        var diffY = scale * (y - prevCoord[1]);

        var dt = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
        var inv_dt = 1 / dt;

        var velX = diffX * inv_dt;
        var velY = diffY * inv_dt;

        var nextVel;
        var nextDelta;

        if (this.options.direction === MouseInput.DIRECTION.X) {
            nextDelta = diffX;
            nextVel = velX;
            this._value += nextDelta;
            this._cumulate += nextDelta;
        }
        else if (this.options.direction === MouseInput.DIRECTION.Y) {
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
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.velocity = nextVel;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._eventOutput.emit('update', payload);

        this._prevCoord = [x, y];
        this._prevTime = currTime;
        this._move = true;
    }

    function handleEnd() {
        if (!this._down) return false;

        this._eventOutput.emit('end', this._payload);
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._move = false;
    }

    function handleEnter(event){
        if (!this._down || !this._move) return;

        this._eventInput.off('mousemove', handleMove.bind(this));
        this._eventInput.off('mouseup', handleEnd.bind(this));

        document.removeEventListener('mousemove', this.boundMove);
        document.removeEventListener('mouseup', this.boundUp);
    }

    function handleLeave(event) {
        if (!this._down || !this._move) return;

        this.boundMove = handleMove.bind(this);
        this.boundUp = function(event) {
            handleEnd.call(this, event);
            document.removeEventListener('mousemove', this.boundMove);
            document.removeEventListener('mouseup', this.boundUp);
        }.bind(this, event);


        this._eventInput.off('mousemove', handleMove.bind(this));
        this._eventInput.off('mouseup', handleEnd.bind(this));

        document.addEventListener('mousemove', this.boundMove);
        document.addEventListener('mouseup', this.boundUp);
    }

    module.exports = MouseInput;
});