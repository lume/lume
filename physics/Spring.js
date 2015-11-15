define(function (require, exports, module) {
    var tickQueue = require('../core/queues/tickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-6;
    var tolerance = 1e-2;

    function Spring(value) {
        SimpleStream.call(this);

        this.value = value || 0;
        this.target = Number.NaN;
        this.velocity = 0;
        this.active = false;
        this.startTime = now();
        this.curve = null;
        this.callback = null;
        this.boundUpdate = update.bind(this);

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        if (value !== undefined) this.set(value);
    }

    Spring.DEFAULT_OPTIONS = {
        damping: 0.5,
        frequency: 1 / 1000
    };

    Spring.prototype = Object.create(SimpleStream.prototype);
    Spring.prototype.constructor = Spring;

    Spring.prototype.set = function (value, transition, callback) {
        var x0 = this.get();
        this.target = value;
        if (callback) this.callback = callback;

        if (!this.active) {
            this.emit('start', x0);
            this.active = true;
        }

        if (!transition) {
            this.reset(value, 0);
            return;
        }

        var damping = transition.damping || Spring.DEFAULT_OPTIONS.damping;
        var frequency = transition.frequency || Spring.DEFAULT_OPTIONS.frequency;
        var v0 = transition.velocity || this.velocity;

        this.startTime = now();

        if (damping < 1)
            this.curve = createUnderDampedSpring(damping, frequency, x0, value, v0);
        else if (damping === 1)
            this.curve = createCriticallyDampedSpring(damping, frequency, x0, value, v0);
        else
            this.curve = createOverDampedSpring(damping, frequency, x0, value, v0);

        if (callback) this.callback = callback;

        tickQueue.push(this.boundUpdate);
    };

    Spring.prototype.get = function () {
        return this.value;
    };

    Spring.prototype.isActive = function () {
        return this.active;
    };

    Spring.prototype.reset = function (value) {
        this.value = value;
        end.call(this);
    };

    Spring.prototype.halt = function () {
        this.reset(this.get());
        end.call(this);
    };

    function end() {
        this.active = false;
        var index = tickQueue.indexOf(this.boundUpdate);
        if (index >= 0) tickQueue.splice(index, 1);
        dirtyQueue.push(function () {
            if (this.active) return;

            this.emit('end', this.get());
            if (this.callback) {
                var callback = this.callback;
                this.callback = null;
                callback();
            }
        }.bind(this));
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
        var timestamp = now();
        var timeSinceStart = timestamp - this.startTime;

        var value = this.curve(timeSinceStart);

        var energy = (!this.velocity)
            ? Infinity
            : this.velocity * this.velocity / 2 + Math.abs(value - this.target);

        if (energy >= tolerance) {
            this.value = value;
            this.velocity = (this.curve(timeSinceStart + eps) - value) / eps;
            this.emit('update', value);
        }
        else this.reset(this.target);
    }

    module.exports = Spring;
});