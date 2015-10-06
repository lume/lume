/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var OptionsManager = require('samsara/core/OptionsManager');

    var registeredCurves = {};
    var eps = 1e-7; // for calculating velocity using finite difference

    /**
     * A method of interpolating between start and end values (numbers or
     *  arrays of numbers) via an easing curve.
     *
     * @class TweenTransition
     * @private
     * @namespace Transitions
     * @constructor
     */
    function TweenTransition(options) {
        this.options = OptionsManager.setOptions(this, options);

        this._startTime = 0;
        this._startValue = 0;
        this._endValue = 0;
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._callback = undefined;
        this.state = 0;
        this.velocity = undefined;
    }

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
    TweenTransition.CURVES = {
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
        },
        spring: function(t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
        }
    };

    TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.CURVES.linear,
        duration: 500,
        speed: 0
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
    TweenTransition.register = function register(name, curve) {
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
    TweenTransition.deregister = function deregister(name) {
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
    TweenTransition.getCurves = function getCurves() {
        return registeredCurves;
    };

    function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    }

    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _speed2Duration(start, end, speed){
        var duration;
        var startValue = this._startValue;
        if (startValue instanceof Array) {
            var variance = 0;
            for (var i in startValue)
                variance += (end[i] - start[i]) * (end[i] - start[i]);
            duration = Math.sqrt(variance) / speed;
        }
        else duration = Math.abs(end - start) / speed;

        return duration;
    }

    function _clone(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Array) return obj.slice(0);
            else return Object.create(obj);
        }
        else return obj;
    }

    function _normalize(transition, endValue, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        if (defaultTransition.duration) result.duration = defaultTransition.duration;
        if (defaultTransition.speed) result.speed = defaultTransition.speed;
        if (transition instanceof Object) {
            if (transition.duration !== undefined) result.duration = transition.duration;
            if (transition.curve) result.curve = transition.curve;
            if (transition.speed) result.speed = transition.speed;
        }
        if (typeof result.curve === 'string') result.curve = getCurve(result.curve);
        if (transition.speed) result.duration = _speed2Duration(endValue, this._startValue, transition.speed);

        return result;
    }

    /**
     * Set new value to transition to.
     *
     * @method set
     * @param endValue {Number|Number[]}    End value
     * @param [transition] {Object}         Transition object of type
     *                                      {duration: number, curve: name}
     * @param [callback] {Function}         Callback to execute on completion of transition
     */
    TweenTransition.prototype.set = function set(endValue, transition, callback) {
        if (!transition) {
            this.reset(endValue);
            if (callback) callback();
            return;
        }

        var curve = transition.curve;
        if (!registeredCurves[curve] && TweenTransition.CURVES[curve])
            TweenTransition.register(curve, TweenTransition.CURVES[curve]);

        this._startValue = _clone(this.get());
        transition = _normalize(transition, endValue, this.options);

        this._startTime = Date.now();
        this._endValue = _clone(endValue);
        this._startVelocity = _clone(transition.velocity);
        this._duration = transition.duration;
        this._curve = transition.curve;
        this._active = true;
        this._callback = callback;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     * @param value {number|Number[]}       Value
     * @param [velocity] {number|Number[]}  Velocity
     */
    TweenTransition.prototype.reset = function reset(value, velocity) {
        this.state = _clone(value);
        this.velocity = _clone(velocity);
        this._startTime = 0;
        this._duration = 0;
        this._startValue = this.state;
        this._startVelocity = this.velocity;
        this._endValue = this.state;
        this._active = false;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     * @returns {Number}
     */
    TweenTransition.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get current value.
     *
     * @method get
     * @return {Number|Number[]}
     */
    TweenTransition.prototype.get = function get() {
        if (this.isActive()) update.call(this);
        return this.state;
    };

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity;
        var speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++){
                velocity[i] = (typeof current[i] === 'number')
                    ? speed * (current[i] - start[i]) / duration
                    : 0;
            }
        }
        else velocity = speed * (current - start) / duration;
        return velocity;
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++) {
                if (typeof start[i] === 'number')
                    state[i] = _interpolate(start[i], end[i], t);
                else
                    state[i] = start[i];
            }
        }
        else state = _interpolate(start, end, t);
        return state;
    }

    function update() {
        var timestamp = Date.now();

        var timeSinceStart = timestamp - this._startTime;

        if (timeSinceStart >= this._duration) {
            this.state = this._endValue;
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
            this._active = false;
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return;
        }
        else if (timeSinceStart < 0) {
            this.state = this._startValue;
            this.velocity = this._startVelocity;
        }
        else {
            var t = timeSinceStart / this._duration;
            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
        }
    }

    /**
     * Returns true if the animation is ongoing, false otherwise.
     *
     * @method isActive
     * @return {Boolean}
     */
    TweenTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    TweenTransition.prototype.halt = function halt() {
        this.reset(this.get());
    };

    module.exports = TweenTransition;
});
