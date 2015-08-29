/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {

    /**
     * A library of curves which map an animation explicitly as a function of time.
     *
     * @class Easing
     */
    var Easing = {

        /**
         * @method inQuad
         * @static
         */
        inQuad: function(t) {
            return t*t;
        },

        /**
         * @method outQuad
         * @static
         */
        outQuad: function(t) {
            return -(t-=1)*t+1;
        },

        /**
         * @method inOutQuad
         * @static
         */
        inOutQuad: function(t) {
            if ((t/=.5) < 1) return .5*t*t;
            return -.5*((--t)*(t-2) - 1);
        },

        /**
         * @method inCubic
         * @static
         */
        inCubic: function(t) {
            return t*t*t;
        },

        /**
         * @method outCubic
         * @static
         */
        outCubic: function(t) {
            return ((--t)*t*t + 1);
        },

        /**
         * @method inOutCubic
         * @static
         */
        inOutCubic: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t;
            return .5*((t-=2)*t*t + 2);
        },

        /**
         * @method inQuart
         * @static
         */
        inQuart: function(t) {
            return t*t*t*t;
        },

        /**
         * @method outQuart
         * @static
         */
        outQuart: function(t) {
            return -((--t)*t*t*t - 1);
        },

        /**
         * @method inOutQuart
         * @static
         */
        inOutQuart: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t;
            return -.5 * ((t-=2)*t*t*t - 2);
        },

        /**
         * @method inQuint
         * @static
         */
        inQuint: function(t) {
            return t*t*t*t*t;
        },

        /**
         * @method outQuint
         * @static
         */
        outQuint: function(t) {
            return ((--t)*t*t*t*t + 1);
        },

        /**
         * @method inOutQuint
         * @static
         */
        inOutQuint: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t*t;
            return .5*((t-=2)*t*t*t*t + 2);
        },

        /**
         * @method inSine
         * @static
         */
        inSine: function(t) {
            return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
        },

        /**
         * @method outSine
         * @static
         */
        outSine: function(t) {
            return Math.sin(t * (Math.PI/2));
        },

        /**
         * @method inOutSine
         * @static
         */
        inOutSine: function(t) {
            return -.5*(Math.cos(Math.PI*t) - 1);
        },

        /**
         * @method inExpo
         * @static
         */
        inExpo: function(t) {
            return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
        },

        /**
         * @method outExpo
         * @static
         */
        outExpo: function(t) {
            return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
        },

        /**
         * @method inOutExpo
         * @static
         */
        inOutExpo: function(t) {
            if (t===0) return 0.0;
            if (t===1.0) return 1.0;
            if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
            return .5 * (-Math.pow(2, -10 * --t) + 2);
        },

        /**
         * @method inCirc
         * @static
         */
        inCirc: function(t) {
            return -(Math.sqrt(1 - t*t) - 1);
        },

        /**
         * @method outCirc
         * @static
         */
        outCirc: function(t) {
            return Math.sqrt(1 - (--t)*t);
        },

        /**
         * @method inOutCirc
         * @static
         */
        inOutCirc: function(t) {
            if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
            return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
        },

        /**
         * @property inElastic
         * @static
         */
        inElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
        },

        /**
         * @method outElastic
         * @static
         */
        outElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
        },

        /**
         * @method inOutElastic
         * @static
         */
        inOutElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
        },

        /**
         * @method inBack
         * @static
         */
        inBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return t*t*((s+1)*t - s);
        },

        /**
         * @method outBack
         * @static
         */
        outBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return ((--t)*t*((s+1)*t + s) + 1);
        },

        /**
         * @method inOutBack
         * @static
         */
        inOutBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
            return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
        },

        /**
         * @method inBounce
         * @static
         */
        inBounce: function(t) {
            return 1.0 - Easing.outBounce(1.0-t);
        },

        /**
         * @method outBounce
         * @static
         */
        outBounce: function(t) {
            if (t < (1/2.75)) {
                return (7.5625*t*t);
            } else if (t < (2/2.75)) {
                return (7.5625*(t-=(1.5/2.75))*t + .75);
            } else if (t < (2.5/2.75)) {
                return (7.5625*(t-=(2.25/2.75))*t + .9375);
            } else {
                return (7.5625*(t-=(2.625/2.75))*t + .984375);
            }
        },

        /**
         * @method inOutBounce
         * @static
         */
        inOutBounce: function(t) {
            if (t < .5) return Easing.inBounce(t*2) * .5;
            return Easing.outBounce(t*2-1.0) * .5 + .5;
        },

        /**
         * @method createCustomCurve
         * @static
         */
        createCustomCurve: function(slope0, slope1) {
            if (slope0 === undefined) slope0 = 0; // slope at t = 0
            if (slope1 === undefined) slope1 = 0; // slope at t = 1
            return function(t) {
                return slope0*t + (-2*slope0 - slope1 + 3)*t*t + (slope0 + slope1 - 2)*t*t*t;
            };
        }
    };

    module.exports = Easing;
});
