/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6; // for calculating velocity using finite difference
    var tolerance = 1e-9; // energy minimum

    /**
     * Defines an inertial transition, which decreases
     *
     * @class Tween
     * @private
     * @namespace Transitions
     * @constructor
     * @param value {Number}    Initial value
     * @param velocity {Number} Initial velocity
     */
    function Inertia(value, velocity) {
        SimpleStream.call(this);

        this.value = value || 0;
        this.velocity = velocity || 0;

        this.startTime = now();
        this.energy = null;
        this._active = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Inertia.DIMENSIONS = 1;

    Inertia.DEFAULT_OPTIONS = {
        velocity: 0,
        damping: 0.5
    };

    Inertia.prototype = Object.create(SimpleStream.prototype);
    Inertia.prototype.constructor = Inertia;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param endValue {Number}             End value
     * @param [transition] {Object}         Transition definition
     */
    Inertia.prototype.set = function (value, transition) {
        if (!this._active) {
            this.emit('start', value);
            this._active = true;
        }

        var damping = (transition.damping == undefined)
            ? Inertia.DEFAULT_OPTIONS.damping
            : Math.min(transition.damping, 1);

        // convert [0,1] input to [0,Infinity] in a way that seams reasonable
        damping = 0.005 * damping / (1 - damping);

        var v0 = transition.velocity || this.velocity;

        this.curve = getCurve(damping, value, v0);
        this.startTime = now();
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number}
     */
    Inertia.prototype.get = function () {
        return this.value;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    Inertia.prototype.getVelocity = function () {
        return this.velocity;
    };

    /**
     * Reset the value and velocity of the transition.
     *
     * @method reset
     * @param value {Number}       Value
     * @param [velocity] {Number}  Velocity
     */
    Inertia.prototype.reset = function (value, velocity) {
        this.value = value;
        this.velocity = velocity || 0;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Inertia.prototype.halt = function () {
        var value = this.get();
        this.reset(value);
        this._active = false;
        this.emit('end', value);
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Inertia.prototype.update = function update() {
        if (!this._active) return;

        var timeSinceStart = now() - this.startTime;

        var value = this.curve(timeSinceStart);
        var next = this.curve(timeSinceStart + eps);
        var prev = this.curve(timeSinceStart - eps);

        this.velocity = (next - prev) / (2 * eps);

        var energy = 0.5 * this.velocity * this.velocity;

        if (energy >= tolerance) {
            this.value = value;
            this.emit('update', value);
        }
        else {
            this.reset(value);
            this._active = false;
            this.emit('end', value);
        }
    };

    function getCurve(damping, x0, v0) {
        if (damping == 0)
            return createNoDamping(x0, v0);
        else if (damping > 0)
            return createWithDamping(damping, x0, v0);
        else console.error('damping must be positive');
    }

    function createNoDamping(x0, v0){
        return function(t){
            return x0 + v0 * t;
        }
    }

    function createWithDamping(damping, x0, v0){
        return function(t){
            return x0 + (v0 / damping) * (1 - Math.exp(-damping * t));
        }
    }

    module.exports = Inertia;
});