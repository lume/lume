/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var OptionsManager = require('samsara/core/OptionsManager');
    var Stream = require('samsara/streams/Stream');

    /**
     * Handles piped in mouse drag events. Outputs an object with two
     *   properties, position and velocity.
     *   Emits 'start', 'update' and 'end' events with DOM event passthroughs,
     *   with position, velocity, and a delta key.
     *
     * @class MouseInput
     * @constructor
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.propogate] {Boolean}  add listened to document on mouseleave
     */
    //TODO: DIRECTION.X
    function MouseInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('mousedown', _handleStart.bind(this));
        this._eventInput.on('mousemove', _handleMove.bind(this));
        this._eventInput.on('mouseup', _handleEnd.bind(this));

        if (this.options.propogate) this._eventInput.on('mouseleave', _handleLeave.bind(this));
        else this._eventInput.on('mouseleave', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            value    : null,
            velocity : null,
            clientX  : 0,
            clientY  : 0,
            offsetX  : 0,
            offsetY  : 0
        };

        this._position = null;      // to be deprecated
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._move = false;
    }

    MouseInput.prototype = Object.create(Stream.prototype);
    MouseInput.prototype.constructor = MouseInput;

    MouseInput.DEFAULT_OPTIONS = {
        direction: undefined,
        scale: 1,
        propogate: true  // events piped to document on mouseleave
    };

    MouseInput.DIRECTION_X = 0;
    MouseInput.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _handleStart(event) {
        var delta;
        var velocity;
        event.preventDefault(); // prevent drag

        var x = event.clientX;
        var y = event.clientY;

        this._prevCoord = [x, y];
        this._prevTime = _now();
        this._down = true;
        this._move = false;

        if (this.options.direction !== undefined){
            this._position = 0;
            delta = 0;
            velocity = 0;
        }
        else {
            this._position = [0, 0];
            delta = [0, 0];
            velocity = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.value = this._position;
        payload.velocity = velocity;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._eventOutput.emit('start', payload);
    }

    function _handleMove(event) {
        if (!this._prevCoord) return;

        var prevCoord = this._prevCoord;
        var prevTime = this._prevTime;

        var x = event.clientX;
        var y = event.clientY;

        var currTime = _now();

        var diffX = x - prevCoord[0];
        var diffY = y - prevCoord[1];

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === MouseInput.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === MouseInput.DIRECTION_Y) {
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
        payload.value = this._position;
        payload.velocity = nextVel;
        payload.clientX  = x;
        payload.clientY  = y;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        this._eventOutput.emit('update', payload);

        this._prevCoord = [x, y];
        this._prevTime = currTime;
        this._move = true;
    }

    function _handleEnd(event) {
        if (!this._down) return;

        this._eventOutput.emit('end', this._payload);
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._move = false;
    }

    function _handleLeave(event) {
        if (!this._down || !this._move) return;

        var boundMove = _handleMove.bind(this);
        var boundEnd = function(event) {
            _handleEnd.call(this, event);
            document.removeEventListener('mousemove', boundMove);
            document.removeEventListener('mouseup', boundEnd);
        }.bind(this, event);

        document.addEventListener('mousemove', boundMove);
        document.addEventListener('mouseup', boundEnd);
    }

    module.exports = MouseInput;
});