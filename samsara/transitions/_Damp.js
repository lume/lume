/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    var now = Date.now;
    var tolerance = 1e-6; // energy minimum

    /**
     * Defines an damping transition, which decreases the set value to 0 by repeatedly
     *  scaling it by the damping factor each tick.
     *
     * @class Inertia
     * @private
     * @namespace Transitions
     * @constructor
     * @param value {Number}    Initial value
     * @param velocity {Number} Initial velocity
     */
    function Damp(value, velocity) {
        SimpleStream.call(this);

        this.value = value || 0;
        this.damp = 0;

        this.energy = null;
        this._active = false;
        this._previousTime = now();

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Damp.DIMENSIONS = 1;

    Damp.DEFAULT_OPTIONS = {
        damping: 0.9
    };

    Damp.prototype = Object.create(SimpleStream.prototype);
    Damp.prototype.constructor = Damp;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param value {Number}                Starting value
     * @param [transition] {Object}         Transition definition
     */
    Damp.prototype.set = function (value, transition) {
        if (!this._active) {
            this.emit('start', value);
            this._active = true;
        }

        this.value = value;
        this.velocity = 0;

        this.damp = (transition.damping === undefined)
            ? Damp.DEFAULT_OPTIONS.damping
            : transition.damping;

        this.velocity = transition.velocity || this.velocity;
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number}
     */
    Damp.prototype.get = function () {
        return this.value;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    Damp.prototype.getVelocity = function () {
        return this.velocity;
    };

    /**
     * Reset the value and velocity of the transition.
     *
     * @method reset
     * @param value {Number}       Value
     * @param [velocity] {Number}  Velocity
     */
    Damp.prototype.reset = function (value, velocity) {
        this.value = value;
        this.velocity = velocity || 0;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Damp.prototype.halt = function () {
        if (!this._active) return;
        var value = this.get();
        this.reset(value);
        this._active = false;
        this.emit('end', value);
    };

    /**
     * Check to see if Inertia is actively transitioning
     *
     * @method isActive
     * @returns {Boolean}
     */
    Damp.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Damp.prototype.update = function update() {
        if (!this._active) return;

        var currentTime = now();
        var dt = currentTime - this._previousTime;
        this._previousTime = currentTime;

        var newValue = this.value * this.damp;
        this.velocity = 1/dt * (this.value - newValue);

        this.value = newValue;

        var energy = 0.5 * this.value * this.value;

        if (energy >= tolerance) {
            this.emit('update', this.value);
        }
        else {
            this.emit('update', this.value);

            dirtyQueue.push(function(){
                this.reset(this.value);
                this._active = false;
                this.emit('end', this.value);
            }.bind(this));
        }
    };

    module.exports = Damp;
});
