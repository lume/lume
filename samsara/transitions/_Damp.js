/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var Transition = require('./_Transition');
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
        Transition.apply(this, arguments);
        this.damp = 0;
    }

    Damp.DIMENSIONS = 1;

    Damp.DEFAULT_OPTIONS = {
        damping: 0.9
    };

    Damp.prototype = Object.create(Transition.prototype);
    Damp.prototype.constructor = Damp;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param value {Number}                Starting value
     * @param [transition] {Object}         Transition definition
     */
    Damp.prototype.set = function (value, transition) {
        Transition.prototype.set.apply(this, arguments);

        this.damp = (transition.damping === undefined)
            ? Damp.DEFAULT_OPTIONS.damping
            : transition.damping;
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
        this.velocity = 1 / dt * (this.value - newValue);

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
