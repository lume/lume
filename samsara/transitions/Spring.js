/* Copyright © 2015-2016 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');
    var dirtyQueue = require('../core/queues/dirtyQueue');

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
        SimpleStream.call(this);

        this.value = value || 0;
        this.velocity = velocity || 0;

        this.target = null;
        this.startTime = now();
        this.curve = null;
        this.energy = null;
        this.energyTolerance = tolerance;
        this._active = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Spring.DIMENSIONS = 1;

    Spring.DEFAULT_OPTIONS = {
        velocity: 0,
        damping: 0.5,
        period : 100
    };

    Spring.prototype = Object.create(SimpleStream.prototype);
    Spring.prototype.constructor = Spring;

    /**
     * Set new value to transition to.
     *
     * @method set
     * @param value {Number}                End value
     * @param [transition] {Object}         Transition definition
     */
    Spring.prototype.set = function (value, transition) {
        var x0 = this.get();

        if (!this._active){
            this.emit('start', x0);
            this._active = true;
        }

        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
        var period = transition.period || Spring.DEFAULT_OPTIONS.period;
        var v0 = transition.velocity || this.velocity;

        this.curve = getCurve(damping, period, x0, value, v0);
        this.energy = calculateEnergy(period);

        var spread = getSpread(value, x0);
        this.energyTolerance = tolerance * Math.pow(spread, 2);

        this.target = value;
        this.startTime = now();
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number}
     */
    Spring.prototype.get = function () {
        return this.value;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    Spring.prototype.getVelocity = function () {
        return this.velocity;
    };

    /**
     * Reset the value and velocity of the transition.
     *
     * @method reset
     * @param value {Number}       Value
     * @param [velocity] {Number}  Velocity
     */
    Spring.prototype.reset = function reset(value, velocity) {
        this.value = value;
        this.velocity = velocity || 0;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Spring.prototype.halt = function halt() {
        if (!this._active) return;
        var value = this.get();
        this.reset(value);
        this._active = false;
        this.emit('end', value);
    };

    /**
     * Check to see if Spring is actively transitioning
     *
     * @method isActive
     * @returns {Boolean}
     */
    Spring.prototype.isActive = function isActive(){
        return this._active;
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Spring.prototype.update = function update() {
        if (!this._active) return;

        var timeSinceStart = now() - this.startTime;

        var value = this.curve(timeSinceStart);
        var next = this.curve(timeSinceStart + eps);
        var prev = this.curve(timeSinceStart - eps);

        this.velocity = (next - prev) / (2 * eps);

        var energy = this.energy(this.target, value, this.velocity);

        if (energy >= this.energyTolerance) {
            this.value = value;
            this.emit('update', value);
        }
        else {
            this.emit('update', this.target);

            dirtyQueue.push(function(){
                this.reset(this.target);
                this._active = false;
                this.emit('end', this.target);
            }.bind(this));

        }
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
