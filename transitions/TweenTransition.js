/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var preTickQueue = require('../core/queues/preTickQueue');
    var tickQueue = require('../core/queues/tickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-7; // for calculating velocity using finite difference
    var registeredCurves = {};

    /**
     * A method of interpolating between start and end values with
     *  an easing curve.
     *
     * @class Tween
     * @private
     * @namespace Transitions
     * @constructor
     */
    function Tween(value) {
        SimpleStream.call(this);

        this.state = value || 0;
        this.velocity = undefined;
        this._startValue = value || 0;
        this._endValue = 0;
        this._startTime = now();
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._boundUpdate = update.bind(this);

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.on('start', function () {
            tickQueue.push(this._boundUpdate);
        }.bind(this));

        this.on('end', function () {
            var index = tickQueue.indexOf(this._boundUpdate);
            if (index >= 0) tickQueue.splice(index, 1);
        }.bind(this));

        if (value !== undefined) {
            preTickQueue.push(function () {
                if (!this._active) {
                    this.emit('start', value);
                    this.state = value;

                    dirtyQueue.push(function () {
                        this.emit('end', value);
                    }.bind(this));
                }
            }.bind(this))
        }
    }

    Tween.prototype = Object.create(SimpleStream.prototype);
    Tween.prototype.constructor = Tween;

    /**
     * Default easing curves.
     *
     * @property CURVES {object}
     * @property CURVES.linear {Function}           Linear interpolation
     * @property CURVES.easeIn {Function}           EaseIn interpolation
     * @property CURVES.easeOut {Function}          EaseOut interpolation
     * @property CURVES.easeInOut {Function}        EaseInOut interpolation
     * @property CURVES.easeInOutBounce {Function}  EaseInOutBounce interpolation
     * @property CURVES.spring {Function}           Spring-like interpolation
     * @static
     */
    Tween.CURVES = {
        linear: function(t) {
            return t;
        },
        easeIn: function(t) {
            return t*t;
        },
        easeOut: function(t) {
            return t*(2-t);
        },
        easeInOut: function(t) {
            if (t <= 0.5) return 2*t*t;
            else return -2*t*t + 4*t - 1;
        },
        easeOutBounce: function(t) {
            return t*(3 - 2*t);
        }
    };

    Tween.DEFAULT_OPTIONS = {
        curve: Tween.CURVES.linear,
        duration: 500
    };

    /**
     * A way of registering custom easing curves by name.
     *  Curves are functions that take a number between 0 and 1 and return
     *  a number (often between 0 and 1, but can over/under shoot).
     *
     * @method register
     * @static
     * @param name {String}         Identifying name
     * @param curve {Function}      Function defined on the domain [0,1]
     * @return {Boolean}            False if key is taken, else true
     */
    Tween.register = function register(name, curve) {
        if (!registeredCurves[name]) {
            registeredCurves[name] = curve;
            return true;
        }
        else return false;
    };

    /**
     * Remove curve from internal registry. Undoes work of `register`.
     *
     * @method deregister
     * @static
     * @param name {String}     Name dictionary key
     * @return {Boolean}        False if key doesn't exist
     */
    Tween.deregister = function deregister(name) {
        if (registeredCurves[name]) {
            delete registeredCurves[name];
            return true;
        }
        else return false;
    };

    /**
     * Retrieve all registered curves.
     *
     * @method getCurves
     * @static
     * @return {Object}
     */
    Tween.getCurves = function getCurves() {
        return registeredCurves;
    };

    /**
     * Set new value to transition to.
     *
     * @method set
     * @param endValue {Number|Number[]}    End value
     * @param [transition] {Object}         Transition object of type
     *                                      {duration: number, curve: name}
     * @param [callback] {Function}         Callback to execute on completion of transition
     */
    Tween.prototype.set = function set(endValue, transition) {
        this._startValue = this.get();
        this._endValue = endValue;
        this._startTime = now();

        if (!this._active) {
            this._active = true;
            this.emit('start', this._startValue);
        }

        var curve = transition.curve;
        if (!registeredCurves[curve] && Tween.CURVES[curve])
            Tween.register(curve, Tween.CURVES[curve]);

        this.velocity = transition.velocity;
        this._duration = transition.duration || Tween.DEFAULT_OPTIONS.duration;
        this._curve = curve
            ? (curve instanceof Function) ? curve : getCurve(curve)
            : Tween.DEFAULT_OPTIONS.curve;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     * @param value {number|Number[]}       Value
     * @param [velocity] {number|Number[]}  Velocity
     */
    Tween.prototype.reset = function reset(value) {
        this.state = value;
        end.call(this);
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    Tween.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number|Number[]}
     */
    Tween.prototype.get = function get() {
        return this.state;
    };


    /**
     * Returns true if the animation is ongoing, false otherwise.
     *
     * @method isActive
     * @return {Boolean}
     */
    Tween.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Tween.prototype.halt = function halt() {
        this.reset(this.get());
    };

    function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    }

    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _calculateVelocity(current, start, curve, duration, t) {
        return (current - start) * (curve(t) - curve(t - eps)) / (eps * duration);
    }

    function update() {
        var timestamp = now();
        var timeSinceStart = timestamp - this._startTime;

        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);

        if (timeSinceStart < this._duration) {
            var t = timeSinceStart / this._duration;
            this.state = _interpolate(this._startValue, this._endValue, this._curve(t));
            this.emit('update', this.state);
        }
        else this.reset(this._endValue);
    }

    function end() {
        this._active = false;

        dirtyQueue.push(function () {
            if (!this._active)
                this.emit('end', this.get());
        }.bind(this));
    }

    module.exports = Tween;
});
