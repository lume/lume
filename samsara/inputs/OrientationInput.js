/* Copyright © 2015-2017 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var OptionsManager = require('../core/_OptionsManager');
    var SimpleStream = require('../streams/SimpleStream');
    var Quaternion = require('../camera/Quaternion');

    var DEBOUNCE = 100;
    var DEG2RAD = Math.PI/180;

    var _now = Date.now;

    /**
     * @class OrientationInput
     * @constructor
     * @uses Core._OptionsManager
     * @param [options] {Object}                Options
     * @param [options.scale=1] {Number}
     */
    function OrientationInput(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._payload = {
            delta : null,
            value : null,
            cumulate : null,
            velocity : null,
            event : null
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._update = update.bind(this);
        this._eventInput.on('deviceorientation', this._update);

        this._prevValue = Quaternion.create();
        this._value = Quaternion.create();
        this._cumulate = Quaternion.create();
        this._delta = Quaternion.create();
        this._start = Quaternion.create();

        this._prevTime = 0;
        this._inProgress = false;
    }

    OrientationInput.prototype = Object.create(SimpleStream.prototype);
    OrientationInput.prototype.constructor = OrientationInput;

    OrientationInput.DEFAULT_OPTIONS = {
        scale: 1
    };

    OrientationInput.prototype.start = function(){
        if (this._inProgress) return;
        this._eventInput.on('deviceorientation', this._update);
    };

    OrientationInput.prototype.end = function(){
        if (!this._inProgress) return;
        this._eventOutput.emit('end', payload);
        this._inProgress = false;
        this._eventInput.off('deviceorientation', this._update);
    };

    function update(event) {
        Quaternion.fromEulerAngles([event.beta * DEG2RAD, -event.gamma * DEG2RAD, event.alpha * DEG2RAD], this._value);

        if (!this._inProgress) {
            Quaternion.conjugate(this._value, this._value);
            Quaternion.set(this._value, this._start);

            Quaternion.clear(this._prevValue);
            Quaternion.clear(this._value);

            payload = this._payload;
            payload.value = this._value;
            payload.cumulate = this._cumulate;
            payload.event = event;

            this._eventOutput.emit('start', payload);
            this._inProgress = true;
            return;
        }

        Quaternion.multiply(this._start, this._value, this._value);

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var dt = currTime - prevTime;
        var invDt = 1 / dt;
        this._prevTime = currTime;

        Quaternion.conjugate(this._prevValue, this._delta)
        Quaternion.multiply(this._delta, this._value, this._delta);

        Quaternion.scalarMultiply(this._delta, this.options.scale, this._delta);
        Quaternion.multiply(this._value, this._delta, this._cumulate);

        var velocity = Quaternion.getAngle(this._delta) * invDt;

        var payload = this._payload;
        payload.delta = this._delta;
        payload.velocity = velocity;
        payload.value = this._value;
        payload.cumulate = this._cumulate;
        payload.event = event;

        this._eventOutput.emit('update', payload);
    }

    module.exports = OrientationInput;
});
