/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6; // for calculating velocity using finite difference
    var tolerance = 1e-9; // energy minimum

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

    Inertia.prototype.set = function (value, transition) {
        if (!this._active) {
            this.emit('start', value);
            this._active = true;
        }

        var damping = transition.damping || Inertia.DEFAULT_OPTIONS.damping;
        var v0 = transition.velocity || this.velocity;

        this.curve = getCurve(damping, value, v0);
        this.startTime = now();
    };

    Inertia.prototype.get = function () {
        return this.value;
    };

    Inertia.prototype.getVelocity = function () {
        return this.velocity;
    };

    Inertia.prototype.reset = function (value, velocity) {
        this.value = value;
        this.velocity = velocity || 0;
    };

    Inertia.prototype.halt = function () {
        var value = this.get();
        this.reset(value);
        this._active = false;
        this.emit('end', value);
    };

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
            this.reset(this.target);
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