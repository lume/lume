/* Copyright © 2015 David Valdman */

define(function (require, exports, module) {
    var preTickQueue = require('../core/queues/preTickQueue');
    var tickQueue = require('../core/queues/tickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6; // for calculating velocity using finite difference
    var tolerance = 1e-9; // energy minimum

    function Spring(value, velocity) {
        SimpleStream.call(this);

        if (value instanceof Array){
            this.value = value || [];
            if (velocity) this.velocity = velocity;
            else {
                this.velocity = [];
                for (var i = 0; i < value.length; i++){
                    this.velocity[i] = 0;
                }
            }
        }
        else {
            this.value = value || 0;
            this.velocity = velocity || 0;
        }


        this.target = null;
        this.startTime = now();
        this.curve = null;
        this.energy = null;
        this.boundUpdate = update.bind(this);
        this.energyTolerance = tolerance;
        this.active = false;

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
                if (!this.active){
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

        if (!this.active){
            this.active = true;
            this.emit('start', x0);
        }

        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
        var frequency = transition.frequency || Spring.DEFAULT_OPTIONS.frequency;
        var v0 = transition.velocity || this.velocity;

        if (x0 instanceof Array){
            this.curve = getCurveND(damping, frequency, x0, value, v0);
            this.energy = calculateEnergyND(frequency);
        }
        else {
            this.curve = getCurve(damping, frequency, x0, value, v0);
            this.energy = calculateEnergy(frequency);
        }

        var spread = getSpread(value, x0);
        this.energyTolerance = tolerance * Math.pow(spread, 2);

        this.target = value;
        this.startTime = now();
    };

    Spring.prototype.get = function () {
        return this.value;
    };

    Spring.prototype.getVelocity = function () {
        return this.velocity;
    };

    Spring.prototype.isActive = function () {
        return this.active;
    };

    Spring.prototype.reset = function (value, velocity) {
        this.value = value;
        this.velocity = velocity || 0;
    };

    Spring.prototype.halt = function () {
        this.reset(this.get());
        end.call(this);
    };

    function getSpread(x0, value){
        var spread = 0;
        if (x0 instanceof Array){
            for (var i = 0; i < x0.length; i++){
                spread += Math.abs(value[i] - x0[i]);
            }
        }
        else spread = Math.max(1, Math.abs(value - x0));
        return Math.max(1, spread);
    }

    function getCurve(damping, frequency, x0, value, v0){
        if (damping < 1)
            return createUnderDampedSpring(damping, frequency, x0, value, v0);
        else if (damping === 1)
            return createCriticallyDampedSpring(damping, frequency, x0, value, v0);
        else
            return createOverDampedSpring(damping, frequency, x0, value, v0);
    }

    function getCurveND(damping, frequency, x0, value, v0) {
        if (damping < 1)
            return createUnderDampedSpringND(damping, frequency, x0, value, v0);
        else if (damping === 1)
            return createCriticallyDampedSpringND(damping, frequency, x0, value, v0);
        else
            return createOverDampedSpringND(damping, frequency, x0, value, v0);
    }

    function calculateEnergy(frequency){
        var omega = 2 * Math.PI * frequency;

        return function(origin, position, velocity){
            var distance = origin - position;
            var potentialEnergy = omega * omega * distance * distance;
            var kineticEnergy = velocity * velocity;
            return kineticEnergy + potentialEnergy;
        }
    }

    function calculateEnergyND(frequency){
        var omega = 2 * Math.PI * frequency;

        return function (origin, position, velocity) {
            var kineticEnergy = 0;
            var potentialEnergy = 0;
            for (var i = 0; i < origin.length; i++){
                potentialEnergy += Math.pow(position[i] - origin[i], 2);
                kineticEnergy += velocity[i] * velocity[i];
            }
            potentialEnergy *= omega * omega;
            return kineticEnergy + potentialEnergy;
        }
    }

    function createUnderDampedSpringND(damping, frequency, x0, x1, v0) {
        var w_d = frequency * Math.sqrt(1 - damping * damping);
        var A = [];
        var B = [];
        for (var i = 0; i < x0.length; i++){
            A[i] = x0[i] - x1[i];
            B[i] = 1 / w_d * (damping * frequency * A[i] + v0[i]);
        }
        var result = [];
        return function (t) {
            for (var i = 0; i < A.length; i++){
                result[i] = x1[i] + Math.exp(-damping * frequency * t) *
                    (A[i] * Math.cos(w_d * t) + B[i] * Math.sin(w_d * t));
            }
            return result;
        }
    }

    function createUnderDampedSpring(damping, frequency, x0, x1, v0) {
        var w_d = frequency * Math.sqrt(1 - damping * damping); // damped frequency
        var A = x0 - x1;
        var B = 1 / w_d * (damping * frequency * A + v0);

        return function (t) {
            return x1 + Math.exp(-damping * frequency * t) *
                (A * Math.cos(w_d * t) + B * Math.sin(w_d * t));
        }
    }

    function createCriticallyDampedSpringND(damping, frequency, x0, x1, v0) {
        var A = [];
        var B = [];
        for (var i = 0; i < x0.length; i++){
            A[i] = x0[i] - x1[i];
            B[i] = v0[i] + frequency * A[i];
        }
        var result = [];

        return function (t) {
            for (var i = 0; i < x0.length; i++)
                result[i] = x1[i] + Math.exp(-damping * frequency * t) * (A[i] + B[i] * t)
            return result;
        }
    }

    function createCriticallyDampedSpring(damping, frequency, x0, x1, v0) {
        var A = x0 - x1;
        var B = v0 + frequency * A;

        return function (t) {
            return x1 + Math.exp(-damping * frequency * t) * (A + B * t);
        }
    }

    function createOverDampedSpringND(damping, frequency, x0, x1, v0) {
        var w_d = frequency * Math.sqrt(damping * damping - 1); // damped frequency
        var r1 = -damping * frequency + w_d;
        var r2 = -damping * frequency - w_d;

        var L = [];
        var A = [];
        var B = [];
        var const1 = [];

        for (var i = 0; i < x0.length; i++){
            L[i] = x0[i] - x1[i];
            const1[i] = (r1 * L[i] - v0[i]) / (r2 - r1);
            A[i] = L[i] + const1[i];
            B[i] = -const1[i];
        }
        var result = [];

        return function (t) {
            for (var i = 0; i < x0.length; i++){
                result[i] = x1[i] + A[i] * Math.exp(r1 * t) + B[i] * Math.exp(r2 * t);
            }
            return result;
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
        var next = this.curve(timeSinceStart + eps);
        var prev = this.curve(timeSinceStart - eps);

        if (value instanceof Array){
            for (var i = 0; i < value.length; i++)
                this.velocity[i] = (next[i] - prev[i]) / (2 * eps);
        }
        else this.velocity = (next - prev) / (2 * eps);

        var energy = this.energy(this.target, value, this.velocity);

        if (energy >= this.energyTolerance) {
            this.value = value;
            this.emit('update', value);
        }
        else {
            this.reset(this.target);
            end.call(this);
        }
    }

    function end() {
        this.active = false;

        dirtyQueue.push(function () {
            if (!this.active)
                this.emit('end', this.get());
        }.bind(this));
    }

    module.exports = Spring;
});