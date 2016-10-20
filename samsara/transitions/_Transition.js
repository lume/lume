/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    function Transition(value, velocity) {
        SimpleStream.call(this);

        this.value = value || 0;
        this.velocity = velocity || 0;

        this.start = value;
        this.end = 0;

        this.energy = Number.NaN;
        this._previousTime = Number.NaN;
        this._active = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Transition.DIMENSIONS = 1;

    Transition.DEFAULT_OPTIONS = {};

    Transition.prototype = Object.create(SimpleStream.prototype);
    Transition.prototype.constructor = Transition;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param value {Number}                Starting value
     * @param [transition] {Object}         Transition definition
     */
    Transition.prototype.set = function (value, transition) {
        if (!this._active) {
            this.emit('start', this.get());
            this._active = true;
        }

        this.start = this.get();
        this.end = value;

        if (transition && transition.velocity) this.velocity = transition.velocity;
        else this.velocity = this.velocity || 0;

        this._previousTime = Date.now();
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number}
     */
    Transition.prototype.get = function () {
        return this.value;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    Transition.prototype.getVelocity = function () {
        return this.velocity;
    };

    /**
     * Reset the value and velocity of the transition.
     *
     * @method reset
     * @param value {Number}       Value
     * @param [velocity] {Number}  Velocity
     */
    Transition.prototype.reset = function (value, velocity) {
        this.start = value;
        this.value = value;
        this.velocity = velocity || 0;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transition.prototype.halt = function () {
        if (!this._active) return;
        this._active = false;
        var value = this.get();
        this.reset(value);
        this.emit('end', value);
    };

    /**
     * Check to see if Inertia is actively transitioning
     *
     * @method isActive
     * @returns {Boolean}
     */
    Transition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Transition.prototype.update = function update() {};

    module.exports = Transition;
});
