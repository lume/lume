/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var Transition = require('./_Transition');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6; // for calculating velocity using finite difference
    var tolerance = 1e-9; // energy minimum

    /**
     * A method of interpolating between start and end values with
     *  a spring transition.
     *
     * @class Spring
     * @private
     * @namespace Transitions
     * @constructor
     * @param value {Number}    Initial value
     * @param velocity {Number} Initial velocity
     */
    function Spring(value, velocity) {
        Transition.apply(this, arguments);
        this.curve = null;
        this.energyTolerance = tolerance;
    }

    Spring.DIMENSIONS = 1;

    Spring.DEFAULT_OPTIONS = {
        velocity: 0,
        damping: 0.5,
        period : 100
    };

    Spring.prototype = Object.create(Transition.prototype);
    Spring.prototype.constructor = Spring;

    /**
     * Set new value to transition to.
     *
     * @method set
     * @param value {Number}                End value
     * @param transition {Object}           Transition definition
     */
    Spring.prototype.set = function (value, transition) {
        Transition.prototype.set.apply(this, arguments);

        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
        var period = transition.period || Spring.DEFAULT_OPTIONS.period;

        this.curve = getCurve(damping, period, this.start, this.end, this.velocity);
        this.energy = calculateEnergy(period);

        var spread = getSpread(this.end, this.start);
        this.energyTolerance = tolerance * Math.pow(spread, 2);
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Spring.prototype.update = function update() {
        if (!this._active) return;

        var timeSinceStart = now() - this._previousTime;

        this.value = this.curve(timeSinceStart);
        var next = this.curve(timeSinceStart + eps);
        var prev = this.curve(timeSinceStart - eps);

        this.velocity = (next - prev) / (2 * eps);

        var energy = this.energy(this.end, this.value, this.velocity);

        if (energy < this.energyTolerance) {
            this.reset(this.end);
            this._active = false;
            this.emit('end', this.end);
        }
        else this.emit('update', this.value);
    };

    function getSpread(x0, value){
        return Math.max(1, Math.abs(value - x0));
    }

    function getCurve(damping, period, x0, value, v0){
        if (damping < 1)
            return createUnderDampedSpring(damping, period, x0, value, v0);
        else if (damping === 1)
            return createCriticallyDampedSpring(damping, period, x0, value, v0);
        else
            return createOverDampedSpring(damping, period, x0, value, v0);
    }

    function calculateEnergy(period){
        var omega = 2 * Math.PI / period;

        return function(origin, position, velocity){
            var distance = origin - position;
            var potentialEnergy = omega * omega * distance * distance;
            var kineticEnergy = velocity * velocity;
            return kineticEnergy + potentialEnergy;
        }
    }

    function createUnderDampedSpring(damping, period, x0, x1, v0) {
        var wD =  Math.sqrt(1 - damping * damping) / period; // damped frequency
        var A = x0 - x1;
        var B = (damping / period * A + v0) / (wD);

        return function (t) {
            return x1 + Math.exp(-damping * t / period) *
                (A * Math.cos(wD * t) + B * Math.sin(wD * t));
        }
    }

    function createCriticallyDampedSpring(damping, period, x0, x1, v0) {
        var A = x0 - x1;
        var B = v0 + A / period;

        return function (t) {
            return x1 + Math.exp(-damping * t / period) * (A + B * t);
        }
    }

    function createOverDampedSpring(damping, period, x0, x1, v0) {
        var wD = Math.sqrt(damping * damping - 1) / period; // damped frequency
        var r1 = -damping / period + wD;
        var r2 = -damping / period - wD;
        var L = x0 - x1;
        var const1 = (r1 * L - v0) / (r2 - r1);
        var A = L + const1;
        var B = -const1;

        return function (t) {
            return x1 + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
        }
    }

    module.exports = Spring;
});
