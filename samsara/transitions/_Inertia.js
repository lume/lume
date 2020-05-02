/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var Transition = require('./_Transition');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var tolerance = 1e-4; // energy minimum

    /**
     * Defines an inertial transition, which decreases
     *
     * @class Inertia
     * @private
     * @namespace Transitions
     * @constructor
     * @param value {Number}    Initial value
     * @param velocity {Number} Initial velocity
     */
    function Inertia(value, velocity) {
        Transition.apply(this, arguments);
        this.drag = 0;
    }

    Inertia.DIMENSIONS = 1;

    Inertia.DEFAULT_OPTIONS = {
        velocity: 0,
        drag: 0.1
    };

    Inertia.prototype = Object.create(Transition.prototype);
    Inertia.prototype.constructor = Inertia;

    /**
     * Set new value to transition to, with a transition definition.
     *
     * @method set
     * @param value {Number}                Starting value
     * @param [transition] {Object}         Transition definition
     */
    Inertia.prototype.set = function (value, transition) {
        Transition.prototype.set.apply(this, arguments);

        this.drag = (transition.drag === undefined)
            ? Inertia.DEFAULT_OPTIONS.drag
            : Math.pow(Math.min(transition.drag, 1), 3);
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

        this.velocity *= (1 - this.drag);
        this.value += dt * this.velocity;

        var energy = 0.5 * this.velocity * this.velocity;

        if (energy < tolerance) {
            this.reset(this.value);
            this._active = false;
            this.emit('end', this.value);
        }
        else this.emit('update', this.value);
    };

    module.exports = Inertia;
});
