/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var now = Date.now;
    var eps = 1e-9; // for calculating velocity using finite difference
    var registeredCurves = {};

    /**
     * A method of interpolating between start and end values with
     *  an easing curve.
     *
     * @class Tween
     * @private
     * @namespace Transitions
     * @constructor
     * @param value {Number}    Initial value
     */
    function Tween(value) {
        SimpleStream.call(this);

        this.state = value || 0;
        this.velocity = 0;
        this._startValue = value || 0;
        this._endValue = 0;
        this._startTime = now();
        this._curve = undefined;
        this._duration = 0;
        this._active = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Tween.prototype = Object.create(SimpleStream.prototype);
    Tween.prototype.constructor = Tween;

    /**
     * Default easing curves.
     *
     * @property CURVES {object}
     * @property CURVES.linear {Function}           Linear interpolation
     * @property CURVES.easeIn {Function}           EaseIn interpolation. Deceleration from zero velocity.
     * @property CURVES.easeInCubic {Function}      Cubic interpolation. Acceleration from zero velocity.
     * @property CURVES.easeOut {Function}          EaseOut interpolation. Acceleration from zero velocity.
     * @property CURVES.easeOutCubic {Function}     Cubic interpolation. Deceleration from zero velocity.
     * @property CURVES.easeOutWall                 Interpolation with wall boundary.
     * @property CURVES.easeInOut {Function}        EaseInOut interpolation. Acceleration then deceleration.
     * @property CURVES.easeInOutCubic {Function}   Cubic interpolation. Acceleration then deceleration.
     * @static
     */
    Tween.CURVES = {
        linear: function(t) {
            return t;
        },
        easeIn: function(t) {
            return t * t;
        },
        easeOut: function(t) {
            return t * (2 - t);
        },
        easeInOut: function(t) {
            return (t <= 0.5)
                ?  2 * t * t
                : -2 * t * t + 4 * t - 1;
        },
        easeOutBounce: function(t) {
            return t * (3 - 2 * t);
        },
        easeInCubic: function (t) {
            return t * t * t;
        },
        easeOutCubic: function (t) {
            return 1 + Math.pow(t - 1, 3);
        },
        easeInOutCubic: function (t) {
            t *= 2;
            return (t < 1)
                ? .5 * t * t * t
                : .5 * Math.pow(t - 2, 3) + 1;
        },
        easeOutWall: function (t) {
            if (t < (1 / 2.75)) {
                return (7.5625 * t * t);
            } else if (t < (2 / 2.75)) {
                return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
            } else if (t < (2.5 / 2.75)) {
                return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
            } else {
                return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
            }
        }
    };

    Tween.DIMENSIONS = Infinity;

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
     */
    Tween.prototype.set = function set(endValue, transition) {
        this._startValue = this.get();

        if (!this._active) {
            this.emit('start', this._startValue);
            this._active = true;
        }

        this._endValue = endValue;
        this._startTime = now();

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
     * Get current value.
     *
     * @method get
     * @return {Number|Number[]}
     */
    Tween.prototype.get = function get() {
        return this.state;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number|Number[]}
     */
    Tween.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Reset the value and velocity of the transition.
     *
     * @method reset
     * @param value {Number|Number[]}       Value
     * @param [velocity] {Number|Number[]}  Velocity
     */
    Tween.prototype.reset = function reset(value, velocity) {
        this.state = value;
        this.velocity = velocity || 0;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Tween.prototype.halt = function halt() {
        var value = this.get();
        this.reset(value);
        this._active = false;
        this.emit('end', value);
    };

    /**
     * Update the transition in time.
     *
     * @method update
     */
    Tween.prototype.update = function update() {
        if (!this._active) return;

        var timeSinceStart = now() - this._startTime;

        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);

        if (timeSinceStart < this._duration) {
            var t = timeSinceStart / this._duration;
            this.state = _interpolate(this._startValue, this._endValue, this._curve(t));
            this.emit('update', this.state);
        }
        else {
            this.emit('update', this._endValue);

            this.reset(this._endValue);
            this._active = false;
            this.emit('end', this._endValue);
        }
    };

    function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    }

    function _interpolate(a, b, t) {
        var result;
        if (a instanceof Array){
            result = [];
            for (var i = 0; i < a.length; i++){
                if (typeof a[i] === 'number')
                    result.push(_interpolate1D(a[i], b[i], t));
                else result.push(a[i]);
            }

        }
        else result = _interpolate1D(a, b, t);
        return result;
    }

    function _interpolate1D(a, b, t){
        return ((1 - t) * a) + (t * b);
    }

    function _calculateVelocity1D(current, start, curve, duration, t) {
        return (current - start) * (curve(t + eps) - curve(t - eps)) / (2 * eps * duration);
    }

    function _calculateVelocity(current, start, curve, duration, t) {
        var result;
        if (current instanceof Array){
            result = [];
            for (var i = 0; i < current.length; i++){
                if (typeof current[i] === 'number')
                    result.push(_calculateVelocity1D(current[i], start[i], curve, duration, t));
                else result.push(current[i]);
            }
        }
        else result = _calculateVelocity1D(current, start, curve, duration, t);
        return result;
    }

    module.exports = Tween;
});
