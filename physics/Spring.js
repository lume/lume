/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var preTickQueue = require('../core/queues/preTickQueue');
    var tickQueue = require('../core/queues/tickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6; // for calculating velocity using finite difference
    var tolerance = 1e-10; // energy minimum

    function Spring(value) {
        SimpleStream.call(this);

        this.value = value || 0;
        this.target = Number.NaN;
        this.velocity = 0;
        this.frequency = Number.NaN;
        this.startTime = now();
        this.curve = null;
        this.boundUpdate = update.bind(this);
        this.energyTolerance = tolerance;

        this.currentActive = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.on('start', function(){
            tickQueue.push(this.boundUpdate);
        }.bind(this));

        this.on('end', function () {
            var index = tickQueue.indexOf(this.boundUpdate);
            if (index >= 0) tickQueue.splice(index, 1);
        }.bind(this));

        if (value !== undefined) {
            preTickQueue.push(function(){
                if (!this.currentActive){
                    this.emit('start', value);
                    this.value = value;

                    dirtyQueue.push(function () {
                        this.emit('end', value);
                    }.bind(this));
                }
            }.bind(this))
        }
    }

    Spring.DEFAULT_OPTIONS = {
        damping: 0.5,
        frequency: 1 / 100
    };

    Spring.prototype = Object.create(SimpleStream.prototype);
    Spring.prototype.constructor = Spring;

    Spring.prototype.set = function (value, transition) {
        var x0 = this.get();
        this.target = value;
        this.startTime = now();

        if (!this.currentActive){
            this.currentActive = true;
            this.emit('start', x0);
        }

        this.energyTolerance = tolerance * Math.pow(value - x0, 2);

        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
        var frequency = transition.frequency || Spring.DEFAULT_OPTIONS.frequency;
        var v0 = transition.velocity || this.velocity;

        if (damping < 1)
            this.curve = createUnderDampedSpring(damping, frequency, x0, value, v0);
        else if (damping === 1)
            this.curve = createCriticallyDampedSpring(damping, frequency, x0, value, v0);
        else
            this.curve = createOverDampedSpring(damping, frequency, x0, value, v0);

        this.frequency = frequency;
    };

    Spring.prototype.get = function () {
        return this.value;
    };

    Spring.prototype.getVelocity = function () {
        return this.velocity;
    };

    Spring.prototype.isActive = function () {
        return this.currentActive;
    };

    Spring.prototype.reset = function (value) {
        this.value = value;
        end.call(this);
    };

    Spring.prototype.halt = function () {
        this.reset(this.get());
    };

    function createUnderDampedSpring(damping, frequency, x0, x1, v0) {
        var w_d = frequency * Math.sqrt(1 - damping * damping); // damped frequency

        var A = x0 - x1;
        var B = 1 / w_d * (damping * frequency * A + v0);
        return function (t) {
            return x1 + Math.exp(-damping * frequency * t) *
                (A * Math.cos(w_d * t) + B * Math.sin(w_d * t));
        }
    }

    function createCriticallyDampedSpring(damping, frequency, x0, x1, v0) {
        var L = x0 - x1;
        var A = L;
        var B = v0 + frequency * L;

        return function (t) {
            return x1 + Math.exp(-damping * frequency * t) * (A + B * t);
        }
    }

    function createOverDampedSpring(damping, frequency, x0, x1, v0) {
        var w_d = frequency * Math.sqrt(damping * damping - 1); // damped frequency
        var r1 = -damping * frequency + w_d;
        var r2 = -damping * frequency - w_d;
        var L = x0 - x1;
        var const1 = (r1 * L - v0) / (r2 - r1);
        var A = L + const1;
        var B = -const1;

        return function (t) {
            return x1 + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
        }
    }

    function update() {
        var timeSinceStart = now() - this.startTime;

        var value = this.curve(timeSinceStart);
        this.velocity = (this.curve(timeSinceStart + eps) - value) / eps;

        var displacement = Math.abs(value - this.target);
        var omega = 2 * Math.PI * this.frequency;

        var potentialEnergy = omega * omega * displacement * displacement;
        var kineticEnergy = this.velocity * this.velocity;
        var energy = kineticEnergy + potentialEnergy;

        if (energy >= this.energyTolerance) {
            this.value = value;
            this.emit('update', value);
        }
        else this.reset(this.target);
    }

    function end() {
        this.currentActive = false;

        dirtyQueue.push(function () {
            if (!this.currentActive)
                this.emit('end', this.get());
        }.bind(this));
    }

    module.exports = Spring;
});