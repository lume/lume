/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
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
        this.damping = 0;

        this.energy = null;
        this._active = false;
        this._previousTime = now();

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Inertia.DIMENSIONS = 1;

    Inertia.DEFAULT_OPTIONS = {
        velocity: 0,
        damping: 0.1
    };

    Inertia.prototype = Object.create(SimpleStream.prototype);
    Inertia.prototype.constructor = Inertia;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param value {Number}                Starting value
     * @param [transition] {Object}         Transition definition
     */
    Inertia.prototype.set = function (value, transition) {
        if (!this._active) {
            this.emit('start', value);
            this._active = true;
        }

        this.value = value;

        this.damping = (transition.damping == undefined)
            ? Inertia.DEFAULT_OPTIONS.damping
            : Math.pow(Math.min(transition.damping, 1), 3);

        this.velocity = transition.velocity || this.velocity;
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

        var currentTime = now();
        var dt = currentTime - this._previousTime;
        this._previousTime = currentTime;

        this.velocity *= (1 - this.damping);
        this.value += dt * this.velocity;

        var energy = 0.5 * this.velocity * this.velocity;

        if (energy >= tolerance) {
            this.emit('update', this.value);
        }
        else {
            this.reset(this.value);
            this._active = false;
            this.emit('end', this.value);
        }
    };

    module.exports = Inertia;
});