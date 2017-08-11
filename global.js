(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["infamous"] = factory();
	else
		root["infamous"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 58);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(48)('wks');
var uid = __webpack_require__(49);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */


    /**
     *  A high-performance static matrix math library used to calculate
     *    affine transforms on surfaces and other renderables.
     *    Famo.us uses 4x4 matrices corresponding directly to
     *    WebKit matrices (column-major order).
     *
     *    The internal "type" of a Matrix is a 16-long float array in
     *    row-major order, with:
     *    elements [0],[1],[2],[4],[5],[6],[8],[9],[10] forming the 3x3
     *          transformation matrix;
     *    elements [12], [13], [14] corresponding to the t_x, t_y, t_z
     *           translation;
     *    elements [3], [7], [11] set to 0;
     *    element [15] set to 1.
     *    All methods are static.
     *
     * @static
     *
     * @class Transform
     */
    var Transform = {};

    // WARNING: these matrices correspond to WebKit matrices, which are
    //    transposed from their math counterparts
    Transform.precision = 1e-6;
    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    /**
     * Multiply two or more Transform matrix types to return a Transform matrix.
     *
     * @method multiply4x4
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply4x4 = function multiply4x4(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
            a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
            a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
            a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
            a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
        ];
    };

    /**
     * Fast-multiply two Transform matrix types to return a
     *    Matrix, assuming bottom row on each is [0 0 0 1].
     *
     * @method multiply
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply = function multiply(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2],
            0,
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6],
            0,
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10],
            0,
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14],
            1
        ];
    };

    /**
     * Return a Transform translated by additional amounts in each
     *    dimension. This is equivalent to the result of
     *
     *    Transform.multiply(Matrix.translate(t[0], t[1], t[2]), m).
     *
     * @method thenMove
     * @static
     * @param {Transform} m a Transform
     * @param {Array.Number} t floats delta vector of length 2 or 3
     * @return {Transform}
     */
    Transform.thenMove = function thenMove(m, t) {
        if (!t[2]) t[2] = 0;
        return [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1];
    };

    /**
     * Return a Transform matrix which represents the result of a transform matrix
     *    applied after a move. This is faster than the equivalent multiply.
     *    This is equivalent to the result of:
     *
     *    Transform.multiply(m, Transform.translate(t[0], t[1], t[2])).
     *
     * @method moveThen
     * @static
     * @param {Array.Number} v vector representing initial movement
     * @param {Transform} m matrix to apply afterwards
     * @return {Transform} the resulting matrix
     */
    Transform.moveThen = function moveThen(v, m) {
        if (!v[2]) v[2] = 0;
        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
        var t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
        var t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform which represents a translation by specified
     *    amounts in each dimension.
     *
     * @method translate
     * @static
     * @param {Number} x x translation
     * @param {Number} y y translation
     * @param {Number} z z translation
     * @return {Transform}
     */
    Transform.translate = function translate(x, y, z) {
        if (z === undefined) z = 0;
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    };

    /**
     * Return a Transform scaled by a vector in each
     *    dimension. This is a more performant equivalent to the result of
     *
     *    Transform.multiply(Transform.scale(s[0], s[1], s[2]), m).
     *
     * @method thenScale
     * @static
     * @param {Transform} m a matrix
     * @param {Array.Number} s delta vector (array of floats &&
     *    array.length == 3)
     * @return {Transform}
     */
    Transform.thenScale = function thenScale(m, s) {
        return [
            s[0] * m[0], s[1] * m[1], s[2] * m[2], 0,
            s[0] * m[4], s[1] * m[5], s[2] * m[6], 0,
            s[0] * m[8], s[1] * m[9], s[2] * m[10], 0,
            s[0] * m[12], s[1] * m[13], s[2] * m[14], 1
        ];
    };

    /**
     * Return a Transform which represents a scale by specified amounts
     *    in each dimension.
     *
     * @method scale
     * @static
     * @param {Number} x x scale factor
     * @param {Number} y y scale factor
     * @param {Number} z z scale factor
     * @return {Transform}
     */
    Transform.scale = function scale(x, y, z) {
        if (z === undefined) z = 1;
        if (y === undefined) y = x;
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the x axis.
     *
     * @method rotateX
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateX = function rotateX(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the y axis.
     *
     * @method rotateY
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateY = function rotateY(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the z axis.
     *
     * @method rotateZ
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateZ = function rotateZ(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents composed clockwise
     *    rotations along each of the axes. Equivalent to the result of
     *    Matrix.multiply(rotateX(phi), rotateY(theta), rotateZ(psi)).
     *
     * @method rotate
     * @static
     * @param {Number} phi radians to rotate about the positive x axis
     * @param {Number} theta radians to rotate about the positive y axis
     * @param {Number} psi radians to rotate about the positive z axis
     * @return {Transform}
     */
    Transform.rotate = function rotate(phi, theta, psi) {
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        var cosPsi = Math.cos(psi);
        var sinPsi = Math.sin(psi);
        var result = [
            cosTheta * cosPsi,
            cosPhi * sinPsi + sinPhi * sinTheta * cosPsi,
            sinPhi * sinPsi - cosPhi * sinTheta * cosPsi,
            0,
            -cosTheta * sinPsi,
            cosPhi * cosPsi - sinPhi * sinTheta * sinPsi,
            sinPhi * cosPsi + cosPhi * sinTheta * sinPsi,
            0,
            sinTheta,
            -sinPhi * cosTheta,
            cosPhi * cosTheta,
            0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents an axis-angle rotation
     *
     * @method rotateAxis
     * @static
     * @param {Array.Number} v unit vector representing the axis to rotate about
     * @param {Number} theta radians to rotate clockwise about the axis
     * @return {Transform}
     */
    Transform.rotateAxis = function rotateAxis(v, theta) {
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var verTheta = 1 - cosTheta; // versine of theta

        var xxV = v[0] * v[0] * verTheta;
        var xyV = v[0] * v[1] * verTheta;
        var xzV = v[0] * v[2] * verTheta;
        var yyV = v[1] * v[1] * verTheta;
        var yzV = v[1] * v[2] * verTheta;
        var zzV = v[2] * v[2] * verTheta;
        var xs = v[0] * sinTheta;
        var ys = v[1] * sinTheta;
        var zs = v[2] * sinTheta;

        var result = [
            xxV + cosTheta, xyV + zs, xzV - ys, 0,
            xyV - zs, yyV + cosTheta, yzV + xs, 0,
            xzV + ys, yzV - xs, zzV + cosTheta, 0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents a transform matrix applied about
     * a separate origin point.
     *
     * @method aboutOrigin
     * @static
     * @param {Array.Number} v origin point to apply matrix
     * @param {Transform} m matrix to apply
     * @return {Transform}
     */
    Transform.aboutOrigin = function aboutOrigin(v, m) {
        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]);
        var t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]);
        var t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform representation of a skew transformation
     *
     * @method skew
     * @static
     * @param {Number} phi scale factor skew in the x axis
     * @param {Number} theta scale factor skew in the y axis
     * @param {Number} psi scale factor skew in the z axis
     * @return {Transform}
     */
    Transform.skew = function skew(phi, theta, psi) {
        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the x-direction
     *
     * @method skewX
     * @static
     * @param {Number} angle the angle between the top and left sides
     * @return {Transform}
     */
    Transform.skewX = function skewX(angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the y-direction
     *
     * @method skewY
     * @static
     * @param {Number} angle the angle between the top and right sides
     * @return {Transform}
     */
    Transform.skewY = function skewY(angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Returns a perspective Transform matrix
     *
     * @method perspective
     * @static
     * @param {Number} focusZ z position of focal point
     * @return {Transform}
     */
    Transform.perspective = function perspective(focusZ) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1];
    };

    /**
     * Return translation vector component of given Transform
     *
     * @method getTranslate
     * @static
     * @param {Transform} m Transform
     * @return {Array.Number} the translation vector [t_x, t_y, t_z]
     */
    Transform.getTranslate = function getTranslate(m) {
        return [m[12], m[13], m[14]];
    };

    /**
     * Return inverse affine transform for given Transform.
     *   Note: This assumes m[3] = m[7] = m[11] = 0, and m[15] = 1.
     *   Will provide incorrect results if not invertible or preconditions not met.
     *
     * @method inverse
     * @static
     * @param {Transform} m Transform
     * @return {Transform}
     */
    Transform.inverse = function inverse(m) {
        // only need to consider 3x3 section for affine
        var c0 = m[5] * m[10] - m[6] * m[9];
        var c1 = m[4] * m[10] - m[6] * m[8];
        var c2 = m[4] * m[9] - m[5] * m[8];
        var c4 = m[1] * m[10] - m[2] * m[9];
        var c5 = m[0] * m[10] - m[2] * m[8];
        var c6 = m[0] * m[9] - m[1] * m[8];
        var c8 = m[1] * m[6] - m[2] * m[5];
        var c9 = m[0] * m[6] - m[2] * m[4];
        var c10 = m[0] * m[5] - m[1] * m[4];
        var detM = m[0] * c0 - m[1] * c1 + m[2] * c2;
        var invD = 1 / detM;
        var result = [
            invD * c0, -invD * c4, invD * c8, 0,
            -invD * c1, invD * c5, -invD * c9, 0,
            invD * c2, -invD * c6, invD * c10, 0,
            0, 0, 0, 1
        ];
        result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8];
        result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9];
        result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10];
        return result;
    };

    /**
     * Returns the transpose of a 4x4 matrix
     *
     * @method transpose
     * @static
     * @param {Transform} m matrix
     * @return {Transform} the resulting transposed matrix
     */
    Transform.transpose = function transpose(m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
    };

    function _normSquared(v) {
        return (v.length === 2) ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }
    function _norm(v) {
        return Math.sqrt(_normSquared(v));
    }
    function _sign(n) {
        return (n < 0) ? -1 : 1;
    }

    /**
     * Decompose Transform into separate .translate, .rotate, .scale,
     *    and .skew components.
     *
     * @method interpret
     * @static
     * @param {Transform} M transform matrix
     * @return {Object} matrix spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     */
    Transform.interpret = function interpret(M) {

        // QR decomposition via Householder reflections
        //FIRST ITERATION

        //default Q1 to the identity matrix;
        var x = [M[0], M[1], M[2]];                // first column vector
        var sgn = _sign(x[0]);                     // sign of first component of x (for stability)
        var xNorm = _norm(x);                      // norm of first column vector
        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
        var mult = 2 / _normSquared(v);            // mult = 2/v'v

        //bail out if our Matrix is singular
        if (mult >= Infinity) {
            return {translate: Transform.getTranslate(M), rotate: [0, 0, 0], scale: [0, 0, 0], skew: [0, 0, 0]};
        }

        //evaluate Q1 = I - 2vv'/v'v
        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonals
        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

        //upper diagonal
        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

        //lower diagonal
        Q1[4] = Q1[1];                      // 1,0 entry
        Q1[8] = Q1[2];                      // 2,0 entry
        Q1[9] = Q1[6];                      // 2,1 entry

        //reduce first column of M
        var MQ1 = Transform.multiply(Q1, M);

        //SECOND ITERATION on (1,1) minor
        var x2 = [MQ1[5], MQ1[6]];
        var sgn2 = _sign(x2[0]);                    // sign of first component of x (for stability)
        var x2Norm = _norm(x2);                     // norm of first column vector
        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];    // v = x + sign(x[0])|x|e1
        var mult2 = 2 / _normSquared(v2);           // mult = 2/v'v

        //evaluate Q2 = I - 2vv'/v'v
        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonal
        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

        //off diagonals
        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
        Q2[9] = Q2[6];                      // 1,2 entry

        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
        var Q = Transform.multiply(Q2, Q1);      //note: really Q transpose
        var R = Transform.multiply(Q, M);

        //remove negative scaling
        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.multiply(R, remover);
        Q = Transform.multiply(remover, Q);

        //decompose into rotate/scale/skew matrices
        var result = {};
        result.translate = Transform.getTranslate(M);
        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
        if (!result.rotate[0]) {
            result.rotate[0] = 0;
            result.rotate[2] = Math.atan2(Q[4], Q[5]);
        }
        result.scale = [R[0], R[5], R[10]];
        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

        //double rotation workaround
        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
            result.rotate[1] = Math.PI - result.rotate[1];
            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
            if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;
            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
            else result.rotate[0] -= Math.PI;
            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
            else result.rotate[2] -= Math.PI;
        }

        return result;
    };

    /**
     * Weighted average between two matrices by averaging their
     *     translation, rotation, scale, skew components.
     *     f(M1,M2,t) = (1 - t) * M1 + t * M2
     *
     * @method average
     * @static
     * @param {Transform} M1 f(M1,M2,0) = M1
     * @param {Transform} M2 f(M1,M2,1) = M2
     * @param {Number} t
     * @return {Transform}
     */
    Transform.average = function average(M1, M2, t) {
        t = (t === undefined) ? 0.5 : t;
        var specM1 = Transform.interpret(M1);
        var specM2 = Transform.interpret(M2);

        var specAvg = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        };

        for (var i = 0; i < 3; i++) {
            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
        }
        return Transform.build(specAvg);
    };

    /**
     * Compose .translate, .rotate, .scale, .skew components into
     * Transform matrix
     *
     * @method build
     * @static
     * @param {matrixSpec} spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     * @return {Transform} composed transform
     */
    Transform.build = function build(spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate);
    };

    /**
     * Determine if two Transforms are component-wise equal
     *   Warning: breaks on perspective Transforms
     *
     * @method equals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.equals = function equals(a, b) {
        return !Transform.notEquals(a, b);
    };

    /**
     * Determine if two Transforms are component-wise unequal
     *   Warning: breaks on perspective Transforms
     *
     * @method notEquals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.notEquals = function notEquals(a, b) {
        if (a === b) return false;

        // shortci
        return !(a && b) ||
            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
            a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] ||
            a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] ||
            a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
    };

    /**
     * Constrain angle-trio components to range of [-pi, pi).
     *
     * @method normalizeRotation
     * @static
     * @param {Array.Number} rotation phi, theta, psi (array of floats
     *    && array.length == 3)
     * @return {Array.Number} new phi, theta, psi triplet
     *    (array of floats && array.length == 3)
     */
    Transform.normalizeRotation = function normalizeRotation(rotation) {
        var result = rotation.slice(0);
        if (result[0] === Math.PI * 0.5 || result[0] === -Math.PI * 0.5) {
            result[0] = -result[0];
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] > Math.PI * 0.5) {
            result[0] = result[0] - Math.PI;
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] < -Math.PI * 0.5) {
            result[0] = result[0] + Math.PI;
            result[1] = -Math.PI - result[1];
            result[2] -= Math.PI;
        }
        while (result[1] < -Math.PI) result[1] += 2 * Math.PI;
        while (result[1] >= Math.PI) result[1] -= 2 * Math.PI;
        while (result[2] < -Math.PI) result[2] += 2 * Math.PI;
        while (result[2] >= Math.PI) result[2] -= 2 * Math.PI;
        return result;
    };

    /**
     * (Property) Array defining a translation forward in z by 1
     *
     * @property {array} inFront
     * @static
     * @final
     */
    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1e-3, 1];

    /**
     * (Property) Array defining a translation backwards in z by 1
     *
     * @property {array} behind
     * @static
     * @final
     */
    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1e-3, 1];

    module.exports = Transform;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var EventEmitter = __webpack_require__(63);

    /**
     * EventHandler forwards received events to a set of provided callback functions.
     * It allows events to be captured, processed, and optionally piped through to other event handlers.
     *
     * @class EventHandler
     * @extends EventEmitter
     * @constructor
     */
    function EventHandler() {
        EventEmitter.apply(this, arguments);

        this.downstream = []; // downstream event handlers
        this.downstreamFn = []; // downstream functions

        this.upstream = []; // upstream event handlers
        this.upstreamListeners = {}; // upstream listeners
    }
    EventHandler.prototype = Object.create(EventEmitter.prototype);
    EventHandler.prototype.constructor = EventHandler;

    /**
     * Assign an event handler to receive an object's input events.
     *
     * @method setInputHandler
     * @static
     *
     * @param {Object} object object to mix trigger, subscribe, and unsubscribe functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setInputHandler = function setInputHandler(object, handler) {
        object.trigger = handler.trigger.bind(handler);
        if (handler.subscribe && handler.unsubscribe) {
            object.subscribe = handler.subscribe.bind(handler);
            object.unsubscribe = handler.unsubscribe.bind(handler);
        }
    };

    /**
     * Assign an event handler to receive an object's output events.
     *
     * @method setOutputHandler
     * @static
     *
     * @param {Object} object object to mix pipe, unpipe, on, addListener, and removeListener functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
        if (handler instanceof EventHandler) handler.bindThis(object);
        object.pipe = handler.pipe.bind(handler);
        object.unpipe = handler.unpipe.bind(handler);
        object.on = handler.on.bind(handler);
        object.addListener = object.on;
        object.removeListener = handler.removeListener.bind(handler);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventHandler.prototype.emit = function emit(type, event) {
        EventEmitter.prototype.emit.apply(this, arguments);
        var i = 0;
        for (i = 0; i < this.downstream.length; i++) {
            if (this.downstream[i].trigger) this.downstream[i].trigger(type, event);
        }
        for (i = 0; i < this.downstreamFn.length; i++) {
            this.downstreamFn[i](type, event);
        }
        return this;
    };

    /**
     * Alias for emit
     * @method addListener
     */
    EventHandler.prototype.trigger = EventHandler.prototype.emit;

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    EventHandler.prototype.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index < 0) downstreamCtx.push(target);

        if (target instanceof Function) target('pipe', null);
        else if (target.trigger) target.trigger('pipe', null);

        return target;
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    EventHandler.prototype.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index >= 0) {
            downstreamCtx.splice(index, 1);
            if (target instanceof Function) target('unpipe', null);
            else if (target.trigger) target.trigger('unpipe', null);
            return target;
        }
        else return false;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    EventHandler.prototype.on = function on(type, handler) {
        EventEmitter.prototype.on.apply(this, arguments);
        if (!(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (var i = 0; i < this.upstream.length; i++) {
                this.upstream[i].on(type, upstreamListener);
            }
        }
        return this;
    };

    /**
     * Alias for "on"
     * @method addListener
     */
    EventHandler.prototype.addListener = EventHandler.prototype.on;

    /**
     * Listen for events from an upstream event handler.
     *
     * @method subscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.subscribe = function subscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index < 0) {
            this.upstream.push(source);
            for (var type in this.upstreamListeners) {
                source.on(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    /**
     * Stop listening to events from an upstream event handler.
     *
     * @method unsubscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index >= 0) {
            this.upstream.splice(index, 1);
            for (var type in this.upstreamListeners) {
                source.removeListener(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    module.exports = EventHandler;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.isEmptyObject = isEmptyObject;
exports.toCSS = toCSS;
var stringify = JSON.stringify;
var parse = JSON.parse;

/**
 * Deeply clone object using serialization.
 * Expects object to be plain and without cyclic dependencies.
 *
 * http://jsperf.com/lodash-deepclone-vs-jquery-extend-deep/6
 *
 * @type {Object} obj
 * @return {Object}
 */
function clone(obj) {
  return parse(stringify(obj));
}

/**
 * Determine whether an object is empty or not.
 * More performant than a `Object.keys(obj).length > 0`
 *
 * @type {Object} obj
 * @return {Boolean}
 */
function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  } // eslint-disable-line no-unused-vars

  return true;
}

/**
 * Simple very fast UID generation based on a global counter.
 */
var uid = exports.uid = function () {
  var globalReference = typeof window == 'undefined' ? global : window;
  var namespace = '__JSS_VERSION_COUNTER__';
  if (globalReference[namespace] == null) globalReference[namespace] = 0;

  // In case we have more than one jss version.
  var versionCounter = globalReference[namespace]++;
  var ruleCounter = 0;

  /**
   * Returns a uid.
   * Ensures uniqueness if more than 1 jss version is used.
   *
   * @api public
   * @return {String}
   */
  function get() {
    return 'jss-' + versionCounter + '-' + ruleCounter++;
  }

  /**
   * Resets the counter.
   *
   * @api public
   */
  function reset() {
    ruleCounter = 0;
  }

  return { get: get, reset: reset };
}();

/**
 * Indent a string.
 *
 * http://jsperf.com/array-join-vs-for
 *
 * @param {Number} level
 * @param {String} str
 * @return {String}
 */
function indent(level, str) {
  var indentStr = '';
  for (var index = 0; index < level; index++) {
    indentStr += '  ';
  }return indentStr + str;
}

/**
 * Converts a Rule to CSS string.
 *
 * Options:
 * - `selector` use `false` to get a rule without selector
 * - `indentationLevel` level of indentation
 *
 * @param {String} selector
 * @param {Object} style
 * @param {Object} options
 * @return {String}
 */
function toCSS(selector, style) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var indentationLevel = options.indentationLevel || 0;
  var str = '';

  if (options.selector !== false) {
    str += indent(indentationLevel, selector + ' {');
    indentationLevel++;
  }

  for (var prop in style) {
    var value = style[prop];
    // We want to generate multiple style with identical property names.
    if (Array.isArray(value)) {
      for (var index = 0; index < value.length; index++) {
        str += '\n' + indent(indentationLevel, prop + ': ' + value[index] + ';');
      }
    } else str += '\n' + indent(indentationLevel, prop + ': ' + value + ';');
  }

  if (options.selector !== false) str += '\n' + indent(--indentationLevel, '}');

  return str;
}

/**
 * Get class names from a selector.
 *
 * @param {String} selector
 * @return {String}
 */
var findClassNames = exports.findClassNames = function () {
  var dotsRegExp = /[.]/g;
  var classesRegExp = /[.][^ ,]+/g;

  return function (selector) {
    var classes = selector.match(classesRegExp);

    if (!classes) return '';

    return classes.join(' ').replace(dotsRegExp, '');
  };
}();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var createDesc = __webpack_require__(46);
module.exports = __webpack_require__(9) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
/*eslint-disable new-cap */
    var MultipleTransition = __webpack_require__(60);
    var TweenTransition = __webpack_require__(61);

    /**
     * A state maintainer for a smooth transition between
     *    numerically-specified states. Example numeric states include floats or
     *    Transform objects.
     *
     * An initial state is set with the constructor or set(startState). A
     *    corresponding end state and transition are set with set(endState,
     *    transition). Subsequent calls to set(endState, transition) begin at
     *    the last state. Calls to get(timestamp) provide the interpolated state
     *    along the way.
     *
     * Note that there is no event loop here - calls to get() are the only way
     *    to find state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class Transitionable
     * @constructor
     * @param {number|Array.Number|Object.<number|string, number>} start
     *    beginning state
     */
    function Transitionable(start) {
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];

        this.state = 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._engineInstance = null;
        this._currentMethod = null;

        this.set(start);
    }

    var transitionMethods = {};

    Transitionable.register = function register(methods) {
        var success = true;
        for (var method in methods) {
            if (!Transitionable.registerMethod(method, methods[method]))
                success = false;
        }
        return success;
    };

    Transitionable.registerMethod = function registerMethod(name, engineClass) {
        if (!(name in transitionMethods)) {
            transitionMethods[name] = engineClass;
            return true;
        }
        else return false;
    };

    Transitionable.unregisterMethod = function unregisterMethod(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    function _loadNext() {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        if (this.actionQueue.length <= 0) {
            this.set(this.get()); // no update required
            return;
        }
        this.currentAction = this.actionQueue.shift();
        this._callback = this.callbackQueue.shift();

        var method = null;
        var endValue = this.currentAction[0];
        var transition = this.currentAction[1];
        if (transition instanceof Object && transition.method) {
            method = transition.method;
            if (typeof method === 'string') method = transitionMethods[method];
        }
        else {
            method = TweenTransition;
        }

        if (this._currentMethod !== method) {
            if (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE) {
                this._engineInstance = new method();
            }
            else {
                this._engineInstance = new MultipleTransition(method);
            }
            this._currentMethod = method;
        }

        this._engineInstance.reset(this.state, this.velocity);
        if (this.velocity !== undefined) transition.velocity = this.velocity;
        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endState
     *    end state to which we interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.set = function set(endState, transition, callback) {
        if (!transition) {
            this.reset(endState);
            if (callback) callback();
            return this;
        }

        var action = [endState, transition];
        this.actionQueue.push(action);
        this.callbackQueue.push(callback);
        if (!this.currentAction) _loadNext.call(this);
        return this;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startState
     *    stable state to set to
     */
    Transitionable.prototype.reset = function reset(startState, startVelocity) {
        this._currentMethod = null;
        this._engineInstance = null;
        this._callback = undefined;
        this.state = startState;
        this.velocity = startVelocity;
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];
    };

    /**
     * Add delay action to the pending action queue queue.
     *
     * @method delay
     *
     * @param {number} duration delay time (ms)
     * @param {function} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.delay = function delay(duration, callback) {
        var endValue;
        if (this.actionQueue.length) endValue = this.actionQueue[this.actionQueue.length - 1][0];
        else if (this.currentAction) endValue = this.currentAction[0];
        else endValue = this.get();

        return this.set(endValue, { duration: duration,
            curve: function() {
                return 0;
            }},
            callback
        );
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    interpolated to this point in time.
     */
    Transitionable.prototype.get = function get(timestamp) {
        if (this._engineInstance) {
            if (this._engineInstance.getVelocity)
                this.velocity = this._engineInstance.getVelocity();
            this.state = this._engineInstance.get(timestamp);
        }
        return this.state;
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     * @return {boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return !!this.currentAction;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function halt() {
        return this.set(this.get());
    };

    module.exports = Transitionable;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(45)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(5);
var ctx = __webpack_require__(13);
var hide = __webpack_require__(6);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(14);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var IE8_DOM_DEFINE = __webpack_require__(101);
var toPrimitive = __webpack_require__(102);
var dP = Object.defineProperty;

exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// loop for a given length, performing action each loop iteration. action receives the index of the loop.
exports.forLength = forLength;
function forLength(length, action) {
    for (var i = 0; i < length; i += 1) {
        action(i);
    }
}
exports["default"] = forLength;
exports.__esModule = true;
//# sourceMappingURL=forLength.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInBrowser = __webpack_require__(21);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var js = ''; /**
              * Export javascript style and css style vendor prefixes.
              * Based on "transform" support test.
              */

var css = '';

// We should not do anything if required serverside.
if (_isInBrowser2['default']) {
  // Order matters. We need to check Webkit the last one because
  // other vendors use to add Webkit prefixes to some properties
  var jsCssMap = {
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-',
    Webkit: '-webkit-'
  };
  var style = document.createElement('p').style;
  var testProp = 'Transform';

  for (var key in jsCssMap) {
    if (key + testProp in style) {
      js = key;
      css = jsCssMap[key];
      break;
    }
  }
}

/**
 * Vendor prefix string for the current browser.
 *
 * @type {{js: String, css: String}}
 * @api public
 */
exports['default'] = { js: js, css: css };

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document.nodeType === 9;

/* harmony default export */ __webpack_exports__["default"] = (isBrowser);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(97), __esModule: true };

/***/ }),
/* 23 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(109);
var defined = __webpack_require__(24);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(48)('keys');
var uid = __webpack_require__(49);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(15).f;
var has = __webpack_require__(17);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(14);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    /**
     * This namespace holds standalone functionality.
     *  Currently includes name mapping for transition curves,
     *  name mapping for origin pairs, and the after() function.
     *
     * @class Utility
     * @static
     */
    var Utility = {};

    /**
     * Table of direction array positions
     *
     * @property {object} Direction
     * @final
     */
    Utility.Direction = {
        X: 0,
        Y: 1,
        Z: 2
    };

    /**
     * Return wrapper around callback function. Once the wrapper is called N
     *   times, invoke the callback function. Arguments and scope preserved.
     *
     * @method after
     *
     * @param {number} count number of calls before callback function invoked
     * @param {Function} callback wrapped callback function
     *
     * @return {function} wrapped callback with coundown feature
     */
    Utility.after = function after(count, callback) {
        var counter = count;
        return function() {
            counter--;
            if (counter === 0) callback.apply(this, arguments);
        };
    };

    /**
     * Load a URL and return its contents in a callback
     *
     * @method loadURL
     *
     * @param {string} url URL of object
     * @param {function} callback callback to dispatch with content
     */
    Utility.loadURL = function loadURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function onreadystatechange() {
            if (this.readyState === 4) {
                if (callback) callback(this.responseText);
            }
        };
        xhr.open('GET', url);
        xhr.send();
    };

    /**
     * Create a document fragment from a string of HTML
     *
     * @method createDocumentFragmentFromHTML
     *
     * @param {string} html HTML to convert to DocumentFragment
     *
     * @return {DocumentFragment} DocumentFragment representing input HTML
     */
    Utility.createDocumentFragmentFromHTML = function createDocumentFragmentFromHTML(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        var result = document.createDocumentFragment();
        while (element.hasChildNodes()) result.appendChild(element.firstChild);
        return result;
    };

    /*
     *  Deep clone an object.
     *  @param b {Object} Object to clone
     *  @return a {Object} Cloned object.
     */
    Utility.clone = function clone(b) {
        var a;
        if (typeof b === 'object') {
            a = (b instanceof Array) ? [] : {};
            for (var key in b) {
                if (typeof b[key] === 'object' && b[key] !== null) {
                    if (b[key] instanceof Array) {
                        a[key] = new Array(b[key].length);
                        for (var i = 0; i < b[key].length; i++) {
                            a[key][i] = Utility.clone(b[key][i]);
                        }
                    }
                    else {
                      a[key] = Utility.clone(b[key]);
                    }
                }
                else {
                    a[key] = b[key];
                }
            }
        }
        else {
            a = b;
        }
        return a;
    };

    module.exports = Utility;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */


    /**
     * A library of curves which map an animation explicitly as a function of time.
     *
     * @class Easing
     */
    var Easing = {

        /**
         * @property inQuad
         * @static
         */
        inQuad: function(t) {
            return t*t;
        },

        /**
         * @property outQuad
         * @static
         */
        outQuad: function(t) {
            return -(t-=1)*t+1;
        },

        /**
         * @property inOutQuad
         * @static
         */
        inOutQuad: function(t) {
            if ((t/=.5) < 1) return .5*t*t;
            return -.5*((--t)*(t-2) - 1);
        },

        /**
         * @property inCubic
         * @static
         */
        inCubic: function(t) {
            return t*t*t;
        },

        /**
         * @property outCubic
         * @static
         */
        outCubic: function(t) {
            return ((--t)*t*t + 1);
        },

        /**
         * @property inOutCubic
         * @static
         */
        inOutCubic: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t;
            return .5*((t-=2)*t*t + 2);
        },

        /**
         * @property inQuart
         * @static
         */
        inQuart: function(t) {
            return t*t*t*t;
        },

        /**
         * @property outQuart
         * @static
         */
        outQuart: function(t) {
            return -((--t)*t*t*t - 1);
        },

        /**
         * @property inOutQuart
         * @static
         */
        inOutQuart: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t;
            return -.5 * ((t-=2)*t*t*t - 2);
        },

        /**
         * @property inQuint
         * @static
         */
        inQuint: function(t) {
            return t*t*t*t*t;
        },

        /**
         * @property outQuint
         * @static
         */
        outQuint: function(t) {
            return ((--t)*t*t*t*t + 1);
        },

        /**
         * @property inOutQuint
         * @static
         */
        inOutQuint: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t*t;
            return .5*((t-=2)*t*t*t*t + 2);
        },

        /**
         * @property inSine
         * @static
         */
        inSine: function(t) {
            return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
        },

        /**
         * @property outSine
         * @static
         */
        outSine: function(t) {
            return Math.sin(t * (Math.PI/2));
        },

        /**
         * @property inOutSine
         * @static
         */
        inOutSine: function(t) {
            return -.5*(Math.cos(Math.PI*t) - 1);
        },

        /**
         * @property inExpo
         * @static
         */
        inExpo: function(t) {
            return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
        },

        /**
         * @property outExpo
         * @static
         */
        outExpo: function(t) {
            return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
        },

        /**
         * @property inOutExpo
         * @static
         */
        inOutExpo: function(t) {
            if (t===0) return 0.0;
            if (t===1.0) return 1.0;
            if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
            return .5 * (-Math.pow(2, -10 * --t) + 2);
        },

        /**
         * @property inCirc
         * @static
         */
        inCirc: function(t) {
            return -(Math.sqrt(1 - t*t) - 1);
        },

        /**
         * @property outCirc
         * @static
         */
        outCirc: function(t) {
            return Math.sqrt(1 - (--t)*t);
        },

        /**
         * @property inOutCirc
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
         * @property outElastic
         * @static
         */
        outElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
        },

        /**
         * @property inOutElastic
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
         * @property inBack
         * @static
         */
        inBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return t*t*((s+1)*t - s);
        },

        /**
         * @property outBack
         * @static
         */
        outBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return ((--t)*t*((s+1)*t + s) + 1);
        },

        /**
         * @property inOutBack
         * @static
         */
        inOutBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
            return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
        },

        /**
         * @property inBounce
         * @static
         */
        inBounce: function(t) {
            return 1.0 - Easing.outBounce(1.0-t);
        },

        /**
         * @property outBounce
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
         * @property inOutBounce
         * @static
         */
        inOutBounce: function(t) {
            if (t < .5) return Easing.inBounce(t*2) * .5;
            return Easing.outBounce(t*2-1.0) * .5 + .5;
        }
    };

    module.exports = Easing;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var Transform = __webpack_require__(2);

    /* TODO: remove these dependencies when deprecation complete */
    var Transitionable = __webpack_require__(8);
    var TransitionableTransform = __webpack_require__(33);

    /**
     *
     *  A collection of visual changes to be
     *    applied to another renderable component. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    Modifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The Modifier's children and descendants
     *    are transformed by the amounts specified in the Modifier's properties.
     *
     * @class Modifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function Modifier(options) {
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;

        /* TODO: remove this when deprecation complete */
        this._legacyStates = {};

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            proportions: null,
            target: null
        };

        if (options) {
            if (options.transform) this.transformFrom(options.transform);
            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
            if (options.origin) this.originFrom(options.origin);
            if (options.align) this.alignFrom(options.align);
            if (options.size) this.sizeFrom(options.size);
            if (options.proportions) this.proportionsFrom(options.proportions);
        }
    }

    /**
     * Function, object, or static transform matrix which provides the transform.
     *   This is evaluated on every tick of the engine.
     *
     * @method transformFrom
     *
     * @param {Object} transform transform provider object
     * @return {Modifier} this
     */
    Modifier.prototype.transformFrom = function transformFrom(transform) {
        if (transform instanceof Function) this._transformGetter = transform;
        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
        else {
            this._transformGetter = null;
            this._output.transform = transform;
        }
        return this;
    };

    /**
     * Set function, object, or number to provide opacity, in range [0,1].
     *
     * @method opacityFrom
     *
     * @param {Object} opacity provider object
     * @return {Modifier} this
     */
    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
        if (opacity instanceof Function) this._opacityGetter = opacity;
        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
        else {
            this._opacityGetter = null;
            this._output.opacity = opacity;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide origin, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method originFrom
     *
     * @param {Object} origin provider object
     * @return {Modifier} this
     */
    Modifier.prototype.originFrom = function originFrom(origin) {
        if (origin instanceof Function) this._originGetter = origin;
        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
        else {
            this._originGetter = null;
            this._output.origin = origin;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide align, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method alignFrom
     *
     * @param {Object} align provider object
     * @return {Modifier} this
     */
    Modifier.prototype.alignFrom = function alignFrom(align) {
        if (align instanceof Function) this._alignGetter = align;
        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
        else {
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide size, as [width, height].
     *
     * @method sizeFrom
     *
     * @param {Object} size provider object
     * @return {Modifier} this
     */
    Modifier.prototype.sizeFrom = function sizeFrom(size) {
        if (size instanceof Function) this._sizeGetter = size;
        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
        else {
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide proportions, as [percent of width, percent of height].
     *
     * @method proportionsFrom
     *
     * @param {Object} proportions provider object
     * @return {Modifier} this
     */
    Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
        if (proportions instanceof Function) this._proportionGetter = proportions;
        else if (proportions instanceof Object && proportions.get) this._proportionGetter = proportions.get.bind(proportions);
        else {
            this._proportionGetter = null;
            this._output.proportions = proportions;
        }
        return this;
    };

     /**
     * Deprecated: Prefer transformFrom with static Transform, or use a TransitionableTransform.
     * @deprecated
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        if (transition || this._legacyStates.transform) {
            if (!this._legacyStates.transform) {
                this._legacyStates.transform = new TransitionableTransform(this._output.transform);
            }
            if (!this._transformGetter) this.transformFrom(this._legacyStates.transform);

            this._legacyStates.transform.set(transform, transition, callback);
            return this;
        }
        else return this.transformFrom(transform);
    };

    /**
     * Deprecated: Prefer opacityFrom with static opacity array, or use a Transitionable with that opacity.
     * @deprecated
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        if (transition || this._legacyStates.opacity) {
            if (!this._legacyStates.opacity) {
                this._legacyStates.opacity = new Transitionable(this._output.opacity);
            }
            if (!this._opacityGetter) this.opacityFrom(this._legacyStates.opacity);

            return this._legacyStates.opacity.set(opacity, transition, callback);
        }
        else return this.opacityFrom(opacity);
    };

    /**
     * Deprecated: Prefer originFrom with static origin array, or use a Transitionable with that origin.
     * @deprecated
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.origin) {

            if (!this._legacyStates.origin) {
                this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0]);
            }
            if (!this._originGetter) this.originFrom(this._legacyStates.origin);

            this._legacyStates.origin.set(origin, transition, callback);
            return this;
        }
        else return this.originFrom(origin);
    };

    /**
     * Deprecated: Prefer alignFrom with static align array, or use a Transitionable with that align.
     * @deprecated
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.align) {

            if (!this._legacyStates.align) {
                this._legacyStates.align = new Transitionable(this._output.align || [0, 0]);
            }
            if (!this._alignGetter) this.alignFrom(this._legacyStates.align);

            this._legacyStates.align.set(align, transition, callback);
            return this;
        }
        else return this.alignFrom(align);
    };

    /**
     * Deprecated: Prefer sizeFrom with static origin array, or use a Transitionable with that size.
     * @deprecated
     * @method setSize
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size && (transition || this._legacyStates.size)) {
            if (!this._legacyStates.size) {
                this._legacyStates.size = new Transitionable(this._output.size || [0, 0]);
            }
            if (!this._sizeGetter) this.sizeFrom(this._legacyStates.size);

            this._legacyStates.size.set(size, transition, callback);
            return this;
        }
        else return this.sizeFrom(size);
    };

    /**
     * Deprecated: Prefer proportionsFrom with static origin array, or use a Transitionable with those proportions.
     * @deprecated
     * @method setProportions
     * @param {Array.Number} proportions two element array of [percent of width, percent of height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setProportions = function setProportions(proportions, transition, callback) {
        if (proportions && (transition || this._legacyStates.proportions)) {
            if (!this._legacyStates.proportions) {
                this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0]);
            }
            if (!this._proportionGetter) this.proportionsFrom(this._legacyStates.proportions);

            this._legacyStates.proportions.set(proportions, transition, callback);
            return this;
        }
        else return this.proportionsFrom(proportions);
    };

    /**
     * Deprecated: Prefer to stop transform in your provider object.
     * @deprecated
     * @method halt
     */
    Modifier.prototype.halt = function halt() {
        if (this._legacyStates.transform) this._legacyStates.transform.halt();
        if (this._legacyStates.opacity) this._legacyStates.opacity.halt();
        if (this._legacyStates.origin) this._legacyStates.origin.halt();
        if (this._legacyStates.align) this._legacyStates.align.halt();
        if (this._legacyStates.size) this._legacyStates.size.halt();
        if (this._legacyStates.proportions) this._legacyStates.proportions.halt();
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;
    };

    /**
     * Deprecated: Prefer to use your provided transform or output of your transform provider.
     * @deprecated
     * @method getTransform
     * @return {Object} transform provider object
     */
    Modifier.prototype.getTransform = function getTransform() {
        return this._transformGetter();
    };

    /**
     * Deprecated: Prefer to determine the end state of your transform from your transform provider
     * @deprecated
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    Modifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
    };

    /**
     * Deprecated: Prefer to use your provided opacity or output of your opacity provider.
     * @deprecated
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    Modifier.prototype.getOpacity = function getOpacity() {
        return this._opacityGetter();
    };

    /**
     * Deprecated: Prefer to use your provided origin or output of your origin provider.
     * @deprecated
     * @method getOrigin
     * @return {Object} origin provider object
     */
    Modifier.prototype.getOrigin = function getOrigin() {
        return this._originGetter();
    };

    /**
     * Deprecated: Prefer to use your provided align or output of your align provider.
     * @deprecated
     * @method getAlign
     * @return {Object} align provider object
     */
    Modifier.prototype.getAlign = function getAlign() {
        return this._alignGetter();
    };

    /**
     * Deprecated: Prefer to use your provided size or output of your size provider.
     * @deprecated
     * @method getSize
     * @return {Object} size provider object
     */
    Modifier.prototype.getSize = function getSize() {
        return this._sizeGetter ? this._sizeGetter() : this._output.size;
    };

    /**
     * Deprecated: Prefer to use your provided proportions or output of your proportions provider.
     * @deprecated
     * @method getProportions
     * @return {Object} proportions provider object
     */
    Modifier.prototype.getProportions = function getProportions() {
        return this._proportionGetter ? this._proportionGetter() : this._output.proportions;
    };

    // call providers on tick to receive render spec elements to apply
    function _update() {
        if (this._transformGetter) this._output.transform = this._transformGetter();
        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
        if (this._originGetter) this._output.origin = this._originGetter();
        if (this._alignGetter) this._output.align = this._alignGetter();
        if (this._sizeGetter) this._output.size = this._sizeGetter();
        if (this._proportionGetter) this._output.proportions = this._proportionGetter();
    }

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Modifier.prototype.modify = function modify(target) {
        _update.call(this);
        this._output.target = target;
        return this._output;
    };

    module.exports = Modifier;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var Transitionable = __webpack_require__(8);
    var Transform = __webpack_require__(2);
    var Utility = __webpack_require__(30);

    /**
     * A class for transitioning the state of a Transform by transitioning the
     * X, Y, and Z axes of it's translate, scale, skew and rotate components
     * independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     * @param [transform=Transform.identity] {Transform} The initial transform state
     */
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice();

        this._finalTranslate = [0, 0, 0];
        this._finalRotate = [0, 0, 0];
        this._finalSkew = [0, 0, 0];
        this._finalScale = [1, 1, 1];

        this.translate = [];
        this.rotate    = [];
        this.skew      = [];
        this.scale     = [];

        for (var i=0; i<3; i+=1) {
            this.translate[i] = new Transitionable(this._finalTranslate[i]);
            this.rotate[i]    = new Transitionable(this._finalRotate[i]);
            this.skew[i]      = new Transitionable(this._finalSkew[i]);
            this.scale[i]     = new Transitionable(this._finalScale[i]);
        }

        if (transform) this.set(transform);
    }

    function _build() {
        return Transform.build({
            translate: [this.translate[0].get(), this.translate[1].get(), this.translate[2].get()],
            rotate:    [this.rotate[0].get(),    this.rotate[1].get(),    this.rotate[2].get()],
            skew:      [this.skew[0].get(),      this.skew[1].get(),      this.skew[2].get()],
            scale:     [this.scale[0].get(),     this.scale[1].get(),     this.scale[2].get()]
        });
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        });
    }

    function _countOfType(array, type) {
        var count = 0;
        for (var i=0; i<array.length; i+=1) {
            if (typeof array[i] === type+'') {
                count+=1;
            }
        }
        return count;
    }

    /**
     * An optimized way of setting only the translation component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setTranslate
     * @chainable
     *
     * @param translate {Array}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
        var numberOfAxes = _countOfType(translate, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<translate.length; i+=1) {
            if (typeof translate[i] === 'number') {
                this.translate[i].set(translate[i], transition, _callback);
                this._finalTranslate[i] = translate[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the X axis of the translation component of a Transform.
     *
     * @method setTranslateX
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateX = function setTranslateX(translate, transition, callback) {
        this.translate[0].set(translate, transition, callback);
        this._finalTranslate[0] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the Y axis of the translation component of a Transform.
     *
     * @method setTranslateY
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateY = function setTranslateY(translate, transition, callback) {
        this.translate[1].set(translate, transition, callback);
        this._finalTranslate[1] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the Z axis of the translation component of a Transform.
     *
     * @method setTranslateZ
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateZ = function setTranslateZ(translate, transition, callback) {
        this.translate[2].set(translate, transition, callback);
        this._finalTranslate[2] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the scale component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setScale
     * @chainable
     *
     * @param scale {Array}         New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
        var numberOfAxes = _countOfType(scale, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<scale.length; i+=1) {
            if (typeof scale[i] === 'number') {
                this.scale[i].set(scale[i], transition, _callback);
                this._finalScale[i] = scale[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the X axis of the scale component of a Transform.
     *
     * @method setScaleX
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleX = function setScaleX(scale, transition, callback) {
        this.scale[0].set(scale, transition, callback);
        this._finalScale[0] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the Y axis of the scale component of a Transform.
     *
     * @method setScaleY
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleY = function setScaleY(scale, transition, callback) {
        this.scale[1].set(scale, transition, callback);
        this._finalScale[1] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the Z axis of the scale component of a Transform.
     *
     * @method setScaleZ
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleZ = function setScaleZ(scale, transition, callback) {
        this.scale[2].set(scale, transition, callback);
        this._finalScale[2] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the rotational component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setRotate
     * @chainable
     *
     * @param eulerAngles {Array}   Euler angles for new rotation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
        var numberOfAxes = _countOfType(eulerAngles, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<eulerAngles.length; i+=1) {
            if (typeof eulerAngles[i] === 'number') {
                this.rotate[i].set(eulerAngles[i], transition, _callback);
                this._finalRotate[i] = eulerAngles[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the X axis of the rotational component of a Transform.
     *
     * @method setScaleX
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateX = function setRotateX(eulerAngle, transition, callback) {
        this.rotate[0].set(eulerAngle, transition, callback);
        this._finalRotate[0] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the Y axis of the rotational component of a Transform.
     *
     * @method setScaleY
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateY = function setRotateY(eulerAngle, transition, callback) {
        this.rotate[1].set(eulerAngle, transition, callback);
        this._finalRotate[1] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the Z axis of the rotational component of a Transform.
     *
     * @method setScaleZ
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateZ = function setRotateZ(eulerAngle, transition, callback) {
        this.rotate[2].set(eulerAngle, transition, callback);
        this._finalRotate[2] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the skew component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setSkew
     * @chainable
     *
     * @param skewAngles {Array}    New skew state. Axes who's values are null will not be affected.
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
        var numberOfAxes = _countOfType(skewAngles, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<skewAngles.length; i+=1) {
            if (typeof skewAngles[i] === 'number') {
                this.skew[i].set(skewAngles[i], transition, _callback);
                this._finalSkew[i] = skewAngles[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the X axis of the skew component of a Transform.
     *
     * @method setSkewX
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewX = function setSkewX(skewAngle, transition, callback) {
        this.skew[0].set(skewAngle, transition, callback);
        this._finalSkew[0] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the Y axis of the skew component of a Transform.
     *
     * @method setSkewY
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewY = function setSkewY(skewAngle, transition, callback) {
        this.skew[1].set(skewAngle, transition, callback);
        this._finalSkew[1] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the Z axis of the skew component of a Transform.
     *
     * @method setSkewZ
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewZ = function setSkewZ(skewAngle, transition, callback) {
        this.skew[2].set(skewAngle, transition, callback);
        this._finalSkew[2] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Setter for a TransitionableTransform with optional parameters to transition
     * between Transforms. Animates all axes of all components.
     *
     * @method set
     * @chainable
     *
     * @param transform {Array}     New transform state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
        var components = Transform.interpret(transform);

        this._finalTranslate = components.translate;
        this._finalRotate = components.rotate;
        this._finalSkew = components.skew;
        this._finalScale = components.scale;
        this._final = transform;

        var _callback = callback ? Utility.after(12, callback) : null;
        for (var i=0; i<3; i+=1) {
            this.translate[i].set(components.translate[i], transition, _callback);
            this.rotate[i].set(components.rotate[i], transition, _callback);
            this.skew[i].set(components.skew[i], transition, _callback);
            this.scale[i].set(components.scale[i], transition, _callback);
        }
        return this;
    };

    /**
     * Sets the default transition to use for transitioning betwen Transform states
     *
     * @method setDefaultTransition
     *
     * @param transition {Object} Transition definition
     */
    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        for (var i=0; i<3; i+=1) {
            this.translate[i].setDefault(transition);
            this.rotate[i].setDefault(transition);
            this.skew[i].setDefault(transition);
            this.scale[i].setDefault(transition);
        }
    };

    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this.isActive()) {
            return _build.call(this);
        }
        else return this._final;
    };

    /**
     * Get the destination state of the Transform
     *
     * @method getFinal
     *
     * @return Transform {Transform}
     */
    TransitionableTransform.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the TransitionableTransform is currently transitioning
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    TransitionableTransform.prototype.isActive = function isActive() {
        var isActive = false;

        for (var i=0; i<3; i+=1) {
            if (
                this.translate[i].isActive()
                || this.rotate[i].isActive()
                || this.skew[i].isActive()
                || this.scale[i].isActive()
            ) {
                isActive = true; break;
            }
        }
        return isActive;
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    TransitionableTransform.prototype.halt = function halt() {
        for (var i=0; i<3; i+=1) {
            this.translate[i].halt();
            this.rotate[i].halt();
            this.skew[i].halt();
            this.scale[i].halt();

            this._finalTranslate[i] = this.translate[i].get();
            this._finalRotate[i] = this.rotate[i].get();
            this._finalSkew[i] = this.skew[i].get();
            this._finalScale[i] = this.scale[i].get();
        }

        this._final = this.get();

        return this;
    };

    module.exports = TransitionableTransform;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var Entity = __webpack_require__(35);
    var SpecParser = __webpack_require__(62);

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._hasMultipleChildren = false;
        this._isRenderable = false;
        this._isModifier = false;

        this._resultCache = {};
        this._prevResults = {};

        this._childResult = null;

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} child renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(child) {
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
        if (this._child instanceof Array) this._child.push(childNode);
        else if (this._child) {
            this._child = [this._child, childNode];
            this._hasMultipleChildren = true;
            this._childResult = []; // to be used later
        }
        else this._child = childNode;

        return childNode;
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._hasMultipleChildren ? null : (this._child ? this._child.get() : null));
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(child) {
        this._childResult = null;
        this._hasMultipleChildren = false;
        this._isRenderable = child.render ? true : false;
        this._isModifier = child.modify ? true : false;
        this._object = child;
        this._child = null;
        if (child instanceof RenderNode) return child;
        else return this;
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child && this._child.getSize) result = this._child.getSize();
        return result;
    };

    // apply results of rendering this subtree to the document
    function _applyCommit(spec, context, cacheStorage) {
        var result = SpecParser.parse(spec, context);
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var childNode = Entity.get(id);
            var commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            if (commitResult) _applyCommit(commitResult, context, cacheStorage);
            else cacheStorage[id] = commitParams;
        }
    }

    /**
     * Commit the content change from this node to the document.
     *
     * @private
     * @method commit
     * @param {Context} context render context
     */
    RenderNode.prototype.commit = function commit(context) {
        // free up some divs from the last loop
        var prevKeys = Object.keys(this._prevResults);
        for (var i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (this._resultCache[id] === undefined) {
                var object = Entity.get(id);
                if (object.cleanup) object.cleanup(context.allocator);
            }
        }

        this._prevResults = this._resultCache;
        this._resultCache = {};
        _applyCommit(this.render(), context, this._resultCache);
    };

    /**
     * Generate a render spec from the contents of the wrapped component.
     *
     * @private
     * @method render
     *
     * @return {Object} render specification for the component subtree
     *    only under this node.
     */
    RenderNode.prototype.render = function render() {
        if (this._isRenderable) return this._object.render();

        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            var children = this._child;
            for (var i = 0; i < children.length; i++) {
                result[i] = children[i].render();
            }
        }
        else if (this._child) result = this._child.render();

        return this._isModifier ? this._object.modify(result) : result;
    };

    module.exports = RenderNode;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    /**
     * A singleton that maintains a global registry of Surfaces.
     *   Private.
     *
     * @private
     * @static
     * @class Entity
     */

    var entities = [];

    /**
     * Get entity from global index.
     *
     * @private
     * @method get
     * @param {Number} id entity registration id
     * @return {Surface} entity in the global index
     */
    function get(id) {
        return entities[id];
    }

    /**
     * Overwrite entity in the global index
     *
     * @private
     * @method set
     * @param {Number} id entity registration id
     * @param {Surface} entity to add to the global index
     */
    function set(id, entity) {
        entities[id] = entity;
    }

    /**
     * Add entity to global index
     *
     * @private
     * @method register
     * @param {Surface} entity to add to global index
     * @return {Number} new id
     */
    function register(entity) {
        var id = entities.length;
        set(id, entity);
        return id;
    }

    /**
     * Remove entity from global index
     *
     * @private
     * @method unregister
     * @param {Number} id entity registration id
     */
    function unregister(id) {
        set(id, null);
    }

    module.exports = {
        register: register,
        unregister: unregister,
        get: get,
        set: set
    };


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var EventHandler = __webpack_require__(3);

    /**
     *  A collection of methods for setting options which can be extended
     *  onto other classes.
     *
     *
     *  **** WARNING ****
     *  You can only pass through objects that will compile into valid JSON.
     *
     *  Valid options:
     *      Strings,
     *      Arrays,
     *      Objects,
     *      Numbers,
     *      Nested Objects,
     *      Nested Arrays.
     *
     *    This excludes:
     *        Document Fragments,
     *        Functions
     * @class OptionsManager
     * @constructor
     * @param {Object} value options dictionary
     */
    function OptionsManager(value) {
        this._value = value;
        this.eventOutput = null;
    }

    /**
     * Create options manager from source dictionary with arguments overriden by patch dictionary.
     *
     * @static
     * @method OptionsManager.patch
     *
     * @param {Object} source source arguments
     * @param {...Object} data argument additions and overwrites
     * @return {Object} source object
     */
    OptionsManager.patch = function patchObject(source, data) {
        var manager = new OptionsManager(source);
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
        return source;
    };

    function _createEventOutput() {
        this.eventOutput = new EventHandler();
        this.eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this.eventOutput);
    }

    /**
     * Create OptionsManager from source with arguments overriden by patches.
     *   Triggers 'change' event on this object's event handler if the state of
     *   the OptionsManager changes as a result.
     *
     * @method patch
     *
     * @param {...Object} arguments list of patch objects
     * @return {OptionsManager} this
     */
    OptionsManager.prototype.patch = function patch() {
        var myState = this._value;
        for (var i = 0; i < arguments.length; i++) {
            var data = arguments[i];
            for (var k in data) {
                if ((k in myState) && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
                    if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
                    this.key(k).patch(data[k]);
                    if (this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()});
                }
                else this.set(k, data[k]);
            }
        }
        return this;
    };

    /**
     * Alias for patch
     *
     * @method setOptions
     *
     */
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    /**
     * Return OptionsManager based on sub-object retrieved by key
     *
     * @method key
     *
     * @param {string} identifier key
     * @return {OptionsManager} new options manager with the value
     */
    OptionsManager.prototype.key = function key(identifier) {
        var result = new OptionsManager(this._value[identifier]);
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    /**
     * Look up value by key or get the full options hash
     * @method get
     *
     * @param {string} key key
     * @return {Object} associated object or full options hash
     */
    OptionsManager.prototype.get = function get(key) {
        return key ? this._value[key] : this._value;
    };

    /**
     * Alias for get
     * @method getOptions
     */
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    /**
     * Set key to value.  Outputs 'change' event if a value is overwritten.
     *
     * @method set
     *
     * @param {string} key key string
     * @param {Object} value value object
     * @return {OptionsManager} new options manager based on the value object
     */
    OptionsManager.prototype.set = function set(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if (this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value});
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    OptionsManager.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    OptionsManager.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    OptionsManager.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    /**
     * Remove handler object from set of downstream handlers.
     * Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    OptionsManager.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = OptionsManager;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var ElementOutput = __webpack_require__(68);

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class Surface
     * @constructor
     *
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on target div
     * @param {Array} [options.properties] string dictionary of CSS properties to set on target div
     * @param {Array} [options.attributes] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     */
    function Surface(options) {
        ElementOutput.call(this);

        this.options = {};

        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];
        this.size = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._trueSizeCheck = true;

        this._dirtyClasses = [];

        if (options) this.setOptions(options);

        this._currentTarget = null;
    }
    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div';
    Surface.prototype.elementClass = 'famous-surface';

    /**
     * Set HTML attributes on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setAttributes
    * @param {Object} attributes property dictionary of "key" => "value"
     */
    Surface.prototype.setAttributes = function setAttributes(attributes) {
        for (var n in attributes) {
            if (n === 'style') throw new Error('Cannot set styles via "setAttributes" as it will break Famo.us.  Use "setProperties" instead.');
            this.attributes[n] = attributes[n];
        }
        this._attributesDirty = true;
    };

    /**
     * Get HTML attributes on this Surface.
     *
     * @method getAttributes
     *
     * @return {Object} Dictionary of this Surface's attributes.
     */
    Surface.prototype.getAttributes = function getAttributes() {
        return this.attributes;
    };

    /**
     * Set CSS-style properties on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setProperties
     * @chainable
     * @param {Object} properties property dictionary of "key" => "value"
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var n in properties) {
            this.properties[n] = properties[n];
        }
        this._stylesDirty = true;
        return this;
    };

    /**
     * Get CSS-style properties on this Surface.
     *
     * @method getProperties
     *
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS-style class to the list of classes on this Surface. Note
     *   this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method addClass
     * @chainable
     * @param {string} className name of class to add
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Remove CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method removeClass
     * @chainable
     * @param {string} className name of class to remove
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Toggle CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method toggleClass
     * @param {string} className name of class to toggle
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
        return this;
    };

    /**
     * Reset class list to provided dictionary.
     * @method setClasses
     * @chainable
     * @param {Array.string} classList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var i = 0;
        var removal = [];
        for (i = 0; i < this.classList.length; i++) {
            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
        }
        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
        // duplicates are already checked by addClass()
        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
        return this;
    };

    /**
     * Get array of CSS-style classes attached to this div.
     *
     * @method getClasslist
     * @return {Array.string} array of class names
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite inner (HTML) content of this surface. Note that this
     *    causes a re-rendering if the content has changed.
     *
     * @method setContent
     * @chainable
     * @param {string|Document Fragment} content HTML content
     */
    Surface.prototype.setContent = function setContent(content) {
        if (this.content !== content) {
            this.content = content;
            this._contentDirty = true;
        }
        return this;
    };

    /**
     * Return inner (HTML) content of this surface.
     *
     * @method getContent
     *
     * @return {string} inner (HTML) content
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @chainable
     * @param {Object} [options] overrides for default options.  See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.size) this.setSize(options.size);
        if (options.classes) this.setClasses(options.classes);
        if (options.properties) this.setProperties(options.properties);
        if (options.attributes) this.setAttributes(options.attributes);
        if (options.content) this.setContent(options.content);
        return this;
    };

    //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var n in this.properties) {
            target.style[n] = this.properties[n];
        }
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var n in this.properties) {
            target.style[n] = '';
        }
    }

    // Apply values of all Famous-managed attributes to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyAttributes(target) {
        for (var n in this.attributes) {
            target.setAttribute(n, this.attributes[n]);
        }
    }

    // Clear all Famous-managed attributes from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupAttributes(target) {
        for (var n in this.attributes) {
            target.removeAttribute(n);
        }
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * One-time setup for an element to be ready for commits to document.
     *
     * @private
     * @method setup
     *
     * @param {ElementAllocator} allocator document element pool for this context
     */
    Surface.prototype.setup = function setup(allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (var i = 0; i < this.elementClass.length; i++) {
                    target.classList.add(this.elementClass[i]);
                }
            }
            else {
                target.classList.add(this.elementClass);
            }
        }
        target.style.display = '';
        this.attach(target);
        this._opacity = null;
        this._currentTarget = target;
        this._stylesDirty = true;
        this._classesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Surface.prototype.commit = function commit(context) {
        if (!this._currentTarget) this.setup(context.allocator);
        var target = this._currentTarget;
        var size = context.size;

        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            var classList = this.getClassList();
            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
            this._classesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._attributesDirty) {
            _applyAttributes.call(this, target);
            this._attributesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this.size) {
            var origSize = context.size;
            size = [this.size[0], this.size[1]];
            if (size[0] === undefined) size[0] = origSize[0];
            if (size[1] === undefined) size[1] = origSize[1];
            if (size[0] === true || size[1] === true) {
                if (size[0] === true){
                    if (this._trueSizeCheck || (this._size[0] === 0)) {
                        var width = target.offsetWidth;
                        if (this._size && this._size[0] !== width) {
                            this._size[0] = width;
                            this._sizeDirty = true;
                        }
                        size[0] = width;
                    } else {
                        if (this._size) size[0] = this._size[0];
                    }
                }
                if (size[1] === true){
                    if (this._trueSizeCheck || (this._size[1] === 0)) {
                        var height = target.offsetHeight;
                        if (this._size && this._size[1] !== height) {
                            this._size[1] = height;
                            this._sizeDirty = true;
                        }
                        size[1] = height;
                    } else {
                        if (this._size) size[1] = this._size[1];
                    }
                }
                this._trueSizeCheck = false;
            }
        }

        if (_xyNotEquals(this._size, size)) {
            if (!this._size) this._size = [0, 0];
            this._size[0] = size[0];
            this._size[1] = size[1];

            this._sizeDirty = true;
        }

        if (this._sizeDirty) {
            if (this._size) {
                target.style.width = (this.size && this.size[0] === true) ? '' : this._size[0] + 'px';
                target.style.height = (this.size && this.size[1] === true) ?  '' : this._size[1] + 'px';
            }

            this._eventOutput.emit('resize');
        }

        if (this._contentDirty) {
            this.deploy(target);
            this._eventOutput.emit('deploy');
            this._contentDirty = false;
            this._trueSizeCheck = true;
        }

        ElementOutput.prototype.commit.call(this, context);
    };

    /**
     *  Remove all Famous-relevant attributes from a document element.
     *    This is called by SurfaceManager's detach().
     *    This is in some sense the reverse of .deploy().
     *
     * @private
     * @method cleanup
     * @param {ElementAllocator} allocator
     */
    Surface.prototype.cleanup = function cleanup(allocator) {
        var i = 0;
        var target = this._currentTarget;
        this._eventOutput.emit('recall');
        this.recall(target);
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';
        _cleanupStyles.call(this, target);
        _cleanupAttributes.call(this, target);
        var classList = this.getClassList();
        _cleanupClasses.call(this, target);
        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (i = 0; i < this.elementClass.length; i++) {
                    target.classList.remove(this.elementClass[i]);
                }
            }
            else {
                target.classList.remove(this.elementClass);
            }
        }
        this.detach(target);
        this._currentTarget = null;
        allocator.deallocate(target);
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Surface.prototype.deploy = function deploy(target) {
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method recall
     */
    Surface.prototype.recall = function recall(target) {
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        this.setContent(df);
    };

    /**
     *  Get the x and y dimensions of the surface.
     *
     * @method getSize
     * @return {Array.Number} [x,y] size of surface
     */
    Surface.prototype.getSize = function getSize() {
        return this._size ? this._size : this.size;
    };

    /**
     * Set x and y dimensions of the surface.
     *
     * @method setSize
     * @chainable
     * @param {Array.Number} size as [width, height]
     */
    Surface.prototype.setSize = function setSize(size) {
        this.size = size ? [size[0], size[1]] : null;
        this._sizeDirty = true;
        return this;
    };

    module.exports = Surface;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

var _createRule2 = __webpack_require__(39);

var _createRule3 = _interopRequireDefault(_createRule2);

var _findRenderer = __webpack_require__(41);

var _findRenderer2 = _interopRequireDefault(_findRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * StyleSheet model.
 *
 * Options:
 *
 * - `media` media query - attribute of style element.
 * - `meta` meta information about this style - attribute of style element, for e.g. you could pass
 * component name for easier debugging.
 * - `named` true by default - keys are names, selectors will be generated, if false - keys are
 * global selectors.
 * - `link` link jss `Rule` instances with DOM `CSSRule` instances so that styles, can be modified
 * dynamically, false by default because it has some performance cost.
 * - `element` style element, will create one by default
 *
 * @param {Object} [rules] object with selectors and declarations
 * @param {Object} [options]
 * @api public
 */

var StyleSheet = function () {
  function StyleSheet(rules, options) {
    _classCallCheck(this, StyleSheet);

    this.options = _extends({}, options);
    if (this.options.named == null) this.options.named = true;
    this.rules = Object.create(null);
    this.classes = Object.create(null);
    this.attached = false;
    this.deployed = false;
    this.linked = false;

    var Renderer = (0, _findRenderer2.default)(this.options);
    this.options.Renderer = Renderer;
    this.renderer = new Renderer(this.options);

    for (var name in rules) {
      this.createRule(name, rules[name]);
    }
  }

  /**
   * Attach renderable to the render tree.
   *
   * @api public
   * @return {StyleSheet}
   */


  _createClass(StyleSheet, [{
    key: 'attach',
    value: function attach() {
      if (this.attached) return this;
      if (!this.deployed) this.deploy();
      this.renderer.attach();
      if (!this.linked && this.options.link) this.link();
      this.attached = true;
      return this;
    }

    /**
     * Remove renderable from render tree.
     *
     * @return {StyleSheet}
     * @api public
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached) return this;
      this.renderer.detach();
      this.attached = false;
      return this;
    }

    /**
     * Add a rule to the current stylesheet. Will insert a rule also after the stylesheet
     * has been rendered first time.
     *
     * @param {Object} [name] can be selector or name if ´options.named is true
     * @param {Object} style property/value hash
     * @return {Rule}
     * @api public
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style) {
      var rule = this.createRule(name, style);
      // Don't insert rule directly if there is no stringified version yet.
      // It will be inserted all together when .attach is called.
      if (this.deployed) {
        var renderable = this.renderer.insertRule(rule);
        if (this.options.link) rule.renderable = renderable;
      }
      return rule;
    }

    /**
     * Create rules, will render also after stylesheet was rendered the first time.
     *
     * @param {Object} rules name:style hash.
     * @return {Array} array of added rules
     * @api public
     */

  }, {
    key: 'addRules',
    value: function addRules(rules) {
      var added = [];
      for (var name in rules) {
        added.push(this.addRule(name, rules[name]));
      }
      return added;
    }

    /**
     * Get a rule.
     *
     * @param {String} name can be selector or name if `named` option is true.
     * @return {Rule}
     * @api public
     */

  }, {
    key: 'getRule',
    value: function getRule(name) {
      return this.rules[name];
    }

    /**
     * Convert rules to a CSS string.
     *
     * @param {Object} options
     * @return {String}
     * @api public
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var rules = this.rules;

      var stringified = Object.create(null);
      var str = '';
      for (var name in rules) {
        var rule = rules[name];
        // We have the same rule referenced twice if using named rules.
        // By name and by selector.
        if (stringified[rule.id]) {
          continue;
        }

        if (rule.style && (0, _utils.isEmptyObject)(rule.style)) {
          continue;
        }

        if (rule.rules && (0, _utils.isEmptyObject)(rule.rules)) {
          continue;
        }

        if (str) str += '\n';

        str += rule.toString(options);
        stringified[rule.id] = true;
      }
      return str;
    }

    /**
     * Create a rule, will not render after stylesheet was rendered the first time.
     * Will link the rule in `this.rules`.
     *
     * @see createRule
     * @api private
     */

  }, {
    key: 'createRule',
    value: function createRule(name, style, options) {
      options = _extends({}, options, {
        sheet: this,
        jss: this.options.jss,
        Renderer: this.options.Renderer
      });
      // Scope options overwrite instance options.
      if (options.named == null) options.named = this.options.named;
      var rule = (0, _createRule3.default)(name, style, options);
      this.registerRule(rule);
      options.jss.plugins.run(rule);
      return rule;
    }

    /**
     * Register a rule in `sheet.rules` and `sheet.classes` maps.
     *
     * @param {Rule} rule
     * @api public
     */

  }, {
    key: 'registerRule',
    value: function registerRule(rule) {
      // Children of container rules should not be registered.
      if (rule.options.parent) {
        // We need to register child rules of conditionals in classes, otherwise
        // user can't access generated class name if it doesn't overrides
        // a regular rule.
        if (rule.name && rule.className) {
          this.classes[rule.name] = rule.className;
        }
        return this;
      }

      if (rule.name) {
        this.rules[rule.name] = rule;
        if (rule.className) this.classes[rule.name] = rule.className;
      }
      if (rule.selector) {
        this.rules[rule.selector] = rule;
      }
      return this;
    }

    /**
     * Unregister a rule.
     *
     * @param {Rule} rule
     * @api public
     */

  }, {
    key: 'unregisterRule',
    value: function unregisterRule(rule) {
      // Children of a conditional rule are not registered.
      if (!rule.options.parent) {
        delete this.rules[rule.name];
        delete this.rules[rule.selector];
      }
      delete this.classes[rule.name];
      return this;
    }

    /**
     * Deploy pure CSS string to a renderable.
     *
     * @return {StyleSheet}
     * @api private
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      this.renderer.deploy(this);
      this.deployed = true;
      return this;
    }

    /**
     * Link renderable CSS rules with their corresponding models.
     *
     * @return {StyleSheet}
     * @api private
     */

  }, {
    key: 'link',
    value: function link() {
      var renderables = this.renderer.getRules();
      for (var selector in renderables) {
        var rule = this.rules[selector];
        if (rule) rule.renderable = renderables[selector];
      }
      this.linked = true;
      return this;
    }
  }]);

  return StyleSheet;
}();

exports.default = StyleSheet;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRule;

var _Rule = __webpack_require__(40);

var _Rule2 = _interopRequireDefault(_Rule);

var _SimpleRule = __webpack_require__(71);

var _SimpleRule2 = _interopRequireDefault(_SimpleRule);

var _KeyframeRule = __webpack_require__(72);

var _KeyframeRule2 = _interopRequireDefault(_KeyframeRule);

var _ConditionalRule = __webpack_require__(73);

var _ConditionalRule2 = _interopRequireDefault(_ConditionalRule);

var _FontFaceRule = __webpack_require__(74);

var _FontFaceRule2 = _interopRequireDefault(_FontFaceRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Map of at rules to corresponding implementation class.
 *
 * @type {Object}
 */
var atRuleClassMap = {
  '@charset': _SimpleRule2.default,
  '@import': _SimpleRule2.default,
  '@namespace': _SimpleRule2.default,
  '@keyframes': _KeyframeRule2.default,
  '@media': _ConditionalRule2.default,
  '@supports': _ConditionalRule2.default,
  '@font-face': _FontFaceRule2.default
};

var atRuleNameRegExp = /^@[^ ]+/;

/**
 * Create rule factory.
 *
 * @param {Object} [selector] if you don't pass selector - it will be generated
 * @param {Object} [style] declarations block
 * @param {Object} [options] rule options
 * @return {Object} rule
 * @api private
 */
function createRule(selector) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // Is an at-rule.
  if (selector && selector[0] === '@') {
    var name = atRuleNameRegExp.exec(selector)[0];
    var AtRule = atRuleClassMap[name];
    return new AtRule(selector, style, options);
  }

  if (options.named == null) options.named = true;
  return new _Rule2.default(selector, style, options);
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Regular rules.
 *
 * @api public
 */

var Rule = function () {
  function Rule(selector, style, options) {
    _classCallCheck(this, Rule);

    this.id = _utils.uid.get();
    this.type = 'regular';
    this.options = options;
    this.selectorText = selector || '';
    this.className = options.className || '';
    this.originalStyle = style;
    // We expect style to be plain object.
    this.style = (0, _utils.clone)(style);
    if (options.named) {
      this.name = selector;
      if (!this.className) {
        this.className = this.name ? this.name + '--' + this.id : this.id;
      }
      this.selectorText = '.' + this.className;
    }
  }

  /**
   * Set selector string.
   * Attenition: use this with caution. Most browser didn't implement selector
   * text setter, so this will result in rerendering of entire style sheet.
   *
   * @param {String} selector
   * @api public
   */


  _createClass(Rule, [{
    key: 'prop',


    /**
     * Get or set a style property.
     *
     * @param {String} name
     * @param {String|Number} [value]
     * @return {Rule|String|Number}
     * @api public
     */
    value: function prop(name, value) {
      var style = this.options.Renderer.style;
      // Its a setter.

      if (value != null) {
        this.style[name] = value;
        // Only defined if option linked is true.
        if (this.renderable) style(this.renderable, name, value);
        return this;
      }
      // Its a getter, read the value from the DOM if its not cached.
      if (this.renderable && this.style[name] == null) {
        // Cache the value after we have got it from the DOM once.
        this.style[name] = style(this.renderable, name);
      }
      return this.style[name];
    }

    /**
     * Apply rule to an element inline.
     *
     * @param {Element} renderable
     * @return {Rule}
     * @api public
     */

  }, {
    key: 'applyTo',
    value: function applyTo(renderable) {
      for (var prop in this.style) {
        var value = this.style[prop];
        var style = this.options.Renderer.style;

        if (Array.isArray(value)) {
          for (var index = 0; index < value.length; index++) {
            style(renderable, prop, value[index]);
          }
        } else style(renderable, prop, value);
      }
      return this;
    }

    /**
     * Returns JSON representation of the rule.
     * Array of values is not supported.
     *
     * @return {Object}
     * @api public
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var style = Object.create(null);
      for (var prop in this.style) {
        if (_typeof(this.style[prop]) != 'object') {
          style[prop] = this.style[prop];
        }
      }
      return style;
    }

    /**
     * Generates a CSS string.
     *
     * @see toCSS
     * @api public
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return (0, _utils.toCSS)(this.selector, this.style, options);
    }
  }, {
    key: 'selector',
    set: function set() {
      var selector = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var _options = this.options;
      var Renderer = _options.Renderer;
      var sheet = _options.sheet;

      // After we modify selector, ref by old selector needs to be removed.

      if (sheet) sheet.unregisterRule(this);

      this.selectorText = selector;
      this.className = (0, _utils.findClassNames)(selector);

      if (!this.renderable) {
        // Register the rule with new selector.
        if (sheet) sheet.registerRule(this);
        return;
      }

      var changed = Renderer.setSelector(this.renderable, selector);

      if (changed) {
        sheet.registerRule(this);
        return;
      }

      // If selector setter is not implemented, rerender the sheet.
      // We need to delete renderable from the rule, because when sheet.deploy()
      // calls rule.toString, it will get the old selector.
      delete this.renderable;
      sheet.registerRule(this).deploy().link();
    }

    /**
     * Get selector string.
     *
     * @return {String}
     * @api public
     */
    ,
    get: function get() {
      if (this.renderable) {
        return this.options.Renderer.getSelector(this.renderable);
      }

      return this.selectorText;
    }
  }]);

  return Rule;
}();

exports.default = Rule;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findRenderer;

var _DomRenderer = __webpack_require__(75);

var _DomRenderer2 = _interopRequireDefault(_DomRenderer);

var _VirtualRenderer = __webpack_require__(76);

var _VirtualRenderer2 = _interopRequireDefault(_VirtualRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Find proper renderer.
 * Option `virtual` is used to force use of VirtualRenderer even if DOM is
 * detected, used for testing only.
 *
 * @param {Object} options
 * @return {Renderer}
 * @api private
 */
function findRenderer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.Renderer) return options.Renderer;
  return options.virtual || typeof document == 'undefined' ? _VirtualRenderer2.default : _DomRenderer2.default;
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(94);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = __webpack_require__(22);

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = __webpack_require__(131);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Await for this to run code after the DOM has been parsed and loaded (but not
 * sub-resources like images, scripts, etc).
 *
 * @example
 * ```js
 * async function main() {
 *     await documentReady()
 *     console.log('Document ready!')
 * }
 * main()
 * ```
 */

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(document.readyState === 'loading')) {
                            _context.next = 3;
                            break;
                        }

                        _context.next = 3;
                        return new _promise2.default(function (resolve) {
                            document.addEventListener('DOMContentLoaded', resolve);
                        });

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function documentReady() {
        return _ref.apply(this, arguments);
    }

    return documentReady;
}();
//# sourceMappingURL=documentReady.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(44);
var $export = __webpack_require__(12);
var redefine = __webpack_require__(103);
var hide = __webpack_require__(6);
var has = __webpack_require__(17);
var Iterators = __webpack_require__(10);
var $iterCreate = __webpack_require__(104);
var setToStringTag = __webpack_require__(28);
var getPrototypeOf = __webpack_require__(112);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(23);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(7);
var aFunction = __webpack_require__(14);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(13);
var invoke = __webpack_require__(124);
var html = __webpack_require__(51);
var cel = __webpack_require__(25);
var global = __webpack_require__(0);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(18)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var newPromiseCapability = __webpack_require__(29);

module.exports = function (C, x) {
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function ot(e,t){for(var n=0,r=e.length;n<r;n++)yt(e[n],t)}function ut(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],st(r,b[ft(r)])}function at(e){return function(t){j(t)&&(yt(t,e),ot(t.querySelectorAll(w),e))}}function ft(e){var t=R.call(e,"is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!lt(n,t)?-1:r}function lt(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function ct(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Z&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ht(e){var t=at(e);return function(e){J.push(t,e.target)}}function pt(e){Y&&(Y=!1,e.currentTarget.removeEventListener(h,pt)),ot((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&mt()}function dt(e,t){var n=this;W.call(n,e,t),et.call(n,{target:n})}function vt(e,t){D(e,t),rt?rt.observe(e,V):(G&&(e.setAttribute=dt,e[i]=nt(e),e.addEventListener(p,et)),e.addEventListener(c,ct)),e.createdCallback&&Z&&(e.created=!0,e.createdCallback(),e.created=!1)}function mt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),yt(e,o))}function gt(e){throw new Error("A "+e+" type is already registered")}function yt(e,t){var n,r=ft(e);-1<r&&(it(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function bt(e){return e?(bt.prototype=e,new bt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.dispatchEvent,R=H.getAttribute,U=H.hasAttribute,z=H.removeAttribute,W=H.setAttribute,X=t.createElement,V=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},$=P||function(e){G=!1,E.removeEventListener(c,$)},J,K=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},Q=!1,G=!0,Y=!0,Z=!0,et,tt,nt,rt,it,st;O||M?(it=function(e,t){N.call(t,e)||vt(e,t)},st=vt):(it=function(e,t){e[i]||(e[i]=n(!0),vt(e,t))},st=it),B?(G=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=R.call(this,e),t.newValue=null,t[l]=t.attrChange=2,z.call(this,e),q.call(this,t)},r=function(e,t){var n=U.call(this,e),r=n&&R.call(this,e),i=new CustomEvent(c,{bubbles:!0});W.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,q.call(this,i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,q.call(t,s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,$),E.setAttribute(i,1),E.removeAttribute(i),G&&(et=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=nt(t);for(s in r){if(!(s in n))return tt(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return tt(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return tt(2,t,s,n[s],r[s],l)}},tt=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,ct(o)},nt=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),Q||(Q=!0,P?(rt=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Z&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=R.call(s,i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(at(s),at(o)),rt.observe(t,{childList:!0,subtree:!0})):(J=[],K(function E(){while(J.length)J.shift().call(null,J.shift());K(E)}),t.addEventListener("DOMNodeInserted",ht(s)),t.addEventListener("DOMNodeRemoved",ht(o))),t.addEventListener(h,pt),t.addEventListener("readystatechange",pt),t.createElement=function(e,n){var r=typeof n=="string"?n:"",i=r?X.call(t,e,r):X.call(t,e),s=""+e,o=S.call(y,(r?v:d)+(r||s).toUpperCase()),u=-1<o;return r&&(i.setAttribute("is",r=r.toLowerCase()),u&&(u=lt(s.toUpperCase(),r))),Z=!t.createElement.innerHTMLHelper,u&&st(i,b[o]),i},H.cloneNode=function(e){var t=I.call(this,!!e),n=ft(t);return-1<n&&st(t,b[n]),e&&ut(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&gt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&gt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),ot(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(59);


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/utils.js
var utils_namespaceObject = {};
__webpack_require__.d(utils_namespaceObject, "contextWithPerspective", function() { return contextWithPerspective; });
__webpack_require__.d(utils_namespaceObject, "simpleExtend", function() { return simpleExtend; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Engine__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Engine___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Engine__);
/*
 * @overview Utility functions used by infamous.
 *
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */



/**
 * Creates a [famous/src/core/Context](#famous/src/core/Context) having the specified 3D perspective.
 *
 * @param {Number} perspective The integer amount of perspective to apply to the `Context`.
 * @returns {module: famous/src/core/Context} The `Context` with the applied perspective.
 */
function contextWithPerspective(perspective) {
    const context = __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Engine___default.a.createContext();
    context.setPerspective(perspective);
    return context;
}

function simpleExtend(object) {
    var others = [], len = arguments.length - 1;
    while ( len-- > 0 ) others[ len ] = arguments[ len + 1 ];

    others.forEach(function(other) {
        for (const prop in other) {
            object[prop] = other[prop]
        }
    })
}

// CONCATENATED MODULE: ./src/Molecule.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_RenderNode__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_RenderNode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_famous_src_core_RenderNode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_TransitionableTransform__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_TransitionableTransform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_TransitionableTransform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_famous_src_core_EventHandler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_famous_src_core_EventHandler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_famous_src_core_EventHandler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_army_knife_polyfill_Function_name__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_army_knife_polyfill_Function_name___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_army_knife_polyfill_Function_name__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */










/**
 * Molecules are the basic building blocks of all UI components. Molecules
 * extend [famous/src/core/RenderNode](#famous/src/core/RenderNode), so they can be
 * added to any `RenderNode` of a famo.us render tree, and by default they will
 * also accept anything that a normal Famo.us `RenderNode` can accept via the
 * `add` method.  Classes that extend from `Molecule` might override
 * `RenderNode.add` in order to accept things like arrays of renderables in
 * stead of a single renderable.
 *
 * Molecules encapsulate the basic things you need for a component -- a
 * [famous/src/transitions/TransitionableTransform](#famous/src/transitions/TransitionableTransform)
 * for positioning things in space, and a [famous/src/core/EventHandler](#famous/src/core/EventHandler)
 * for capturing user interaction -- exposing a unified API for working with these
 * things. For now, [famous/src/core/Modifier](#famous/src/core/Modifier) is used as the interface
 * for applying transforms and sizing, but this will change in Mixed Mode
 * Famo.us.
 *
 * All components extend Molecule, but at the same time they can also use any
 * number of Molecules internally to do nice things like create layouts and
 * position multiple things in space.
 *
 * @class Molecule
 * @extends {module: famous/src/core/RenderNode}
 */
var Molecule_Molecule = (function (RenderNode) {
    function Molecule(initialOptions) {
        RenderNode.call(this)

        // "private" stuff. Not really, but regard it like so. For example, if
        // you see something like obj._.someVariable then you're accessing
        // internal stuff that wasn't designed to be accessed directly, and any
        // problem you enounter with that is your own problem. :)
        //
        // TODO: Use a WeakMap to store these at some point.
        this._ = {
            options: {}, // set and get with this.options
            defaultOptions: {}
        }

        // Add default values for this Molecule
        // TODO: Make default options static for the class.
        simpleExtend(this._.defaultOptions, {
            align: [0.5,0.5],
            origin: [0.5,0.5],
            transform: new __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_TransitionableTransform___default.a,
            handler: new __WEBPACK_IMPORTED_MODULE_3_famous_src_core_EventHandler___default.a
        })

        // set the user's initial options. This automatically creates
        // this.modifier, and adds it to this (don't forget, *this* is a
        // RenderNode, so a Molecule can add things to itself).
        //
        // NOTE: this.options is a setter property. This statement applies all
        // relevant properties to this.modifier.
        this.options = initialOptions;
    }

    if ( RenderNode ) Molecule.__proto__ = RenderNode;
    Molecule.prototype = Object.create( RenderNode && RenderNode.prototype );
    Molecule.prototype.constructor = Molecule;

    var prototypeAccessors = { options: {},transform: {} };

    /**
     * @property {Object} options The Molecule's options, which get applied to
     * `this.modifier`. This may change with Mixed Mode. Setting this property
     * overrides existing options. To extend existing options with new options,
     * use `setOptions` instead.  Unspecified options will be set to their default
     * values.
     *
     * Note: Anytime `this.options` is assigned a new value, `this.modifier` is set
     * to a new [famous/src/core/Modifier](#famous/src/core/Modifier).
     */
    prototypeAccessors.options.set = function (newOptions) {
        this.resetOptions();
        this.setOptions(newOptions);
    };
    prototypeAccessors.options.get = function () {
        return this._.options;
    };

    /**
     * @property {module: famous/src/transitions/TransitionableTransform} transform
     * The transform of this `Molecule`. The default is a
     * [famous/src/transitions/TransitionableTransform](#famous/src/transitions/TransitionableTransform).
     * Setting this property automatically puts the new transform into effect.
     * See [famous/src/core/Modifier.transformFrom](#famous/src/core/Modifier.transformFrom).
     */
    prototypeAccessors.transform.set = function (newTransform) {
        this.setOptions({transform: newTransform});
    };
    prototypeAccessors.transform.get = function () {
        return this.options.transform;
    };

    /**
     * Compounds `newOptions` into the existing options, similar to extending an
     * object and overriding only the desired properties. To override all
     * options with a set of new options, set `this.options` directly.
     *
     * An example of setting just a single option without erasing other options:
     *
     * ```js
     * const myMolecule = new Molecule()
     * myMolecule.setOptions({
     *   align: [0.2, 0.8]
     * })
     * ```
     *
     * @param {Object} newOptions An object containing the new options to apply to this `Molecule`.
     */
    Molecule.prototype.setOptions = function setOptions (newOptions) {
        var this$1 = this;

        if (typeof newOptions == 'undefined' || newOptions.constructor.name != "Object")
            { newOptions = {} }

        for (const prop in newOptions) {
            // Subject to change when Famo.us API changes.
            if (__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default.a.prototype[''+prop+'From']) {
                this$1.modifier[''+prop+'From'](newOptions[prop]);
            }

            this$1._.options[prop] = newOptions[prop];
        }
    };

    /**
     * Sets all options back to their defaults.
     *
     * Note: Anytime this is called, `this.modifier` is set to a new
     * [famous/src/core/Modifier](#famous/src/core/Modifier) having the default
     * options.
     */
    Molecule.prototype.resetOptions = function resetOptions () {
        this.modifier = new __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default.a();
        this.set(this.modifier);
        this.setOptions(this._.defaultOptions);
    };

    /**
     * Forwards events from this Molecule's [famous/src/core/EventHandler](#famous/src/core/EventHandler) to the given
     * target, which can be another `EventHandler` or `Molecule`.
     *
     * This method is equivalent to [famous/src/core/EventHandler.pipe](#famous/src/core/EventHandler.pipe),
     * acting upon `this.handler`.
     *
     * TODO v0.1.0: Let this method accept a `Molecule`, then stop doing `pipe(this._.handler)` in other places
     */
    Molecule.prototype.pipe = function pipe () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.pipe.apply(this.options.handler, args);
    };

    /**
     * Stops events from this Molecule's [famous/src/core/EventHandler](#famous/src/core/EventHandler)
     * from being sent to the given target.
     *
     * This method is equivalent to [famous/src/core/EventHandler.unpipe](#famous/src/core/EventHandler.unpipe),
     * acting upon `this.handler`.
     *
     * TODO v0.1.0: Let this method accept a `Molecule`, then stop doing `pipe(this.options.handler)` in other places
     */
    Molecule.prototype.unpipe = function unpipe () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.unpipe.apply(this.options.handler, args);
    };

    /**
     * Register an event handler for the specified event.
     * See [famous/src/core/EventHandler.on](#famous/src/core/EventHandler.on).
     */
    Molecule.prototype.on = function on () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.on.apply(this.options.handler, args);
    };

    /**
     * Unregister an event handler for the specified event.
     * See [famous/src/core/EventHandler.off](#famous/src/core/EventHandler.off).
     */
    Molecule.prototype.off = function off () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.on.apply(this.options.handler, args);
    };

    Object.defineProperties( Molecule.prototype, prototypeAccessors );

    return Molecule;
}(__WEBPACK_IMPORTED_MODULE_1_famous_src_core_RenderNode___default.a));
/* harmony default export */ var Molecule_defaultExport = (Molecule_Molecule);

// CONCATENATED MODULE: ./src/Grid.js
/* harmony import */ var Grid___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier__ = __webpack_require__(32);
/* harmony import */ var Grid___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default = __webpack_require__.n(Grid___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Transform__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_famous_src_core_Transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_army_knife_forLength__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_army_knife_forLength___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_army_knife_forLength__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */








/**
 * A scenegraph tree with a variable number of leaf node Modifiers (the grid
 * cells) that are arranged in a grid. Add any [famous/src/core/RenderNode](#famous/src/core/RenderNode)-compatible
 * item to each leafnode of the grid.
 *
 * TODO: Use Molecule instead of Modifier for the grid cells.
 * TODO: Add an options parameter, that the Molecule constructor will handle.
 *
 * @class Grid
 * @extends Molecule
 */
var Grid = (function (Molecule) {
    function Grid(columns, rows, size) {
        Molecule.call(this, {size: size});

        this.columns = columns;
        this.rows = rows;
        this.cellNodes = [];

        if (typeof this.options.size === 'undefined') { this.setOptions({size: [undefined, undefined]}); }

        __WEBPACK_IMPORTED_MODULE_3_army_knife_forLength___default()(this.columns*this.rows, this._createGridCell.bind(this));
    }

    if ( Molecule ) Grid.__proto__ = Molecule;
    Grid.prototype = Object.create( Molecule && Molecule.prototype );
    Grid.prototype.constructor = Grid;

    /**
     * Creates a grid cell at the given index.
     *
     * @private
     * @param {Number} index The integer index of the grid cell.
     */
    Grid.prototype._createGridCell = function _createGridCell (index) {
        const column = index % this.columns;
        const row = Math.floor(index / this.columns);

        let cellSize = null;
        if (typeof this.options.size[0] != 'undefined' && typeof this.options.size[1] != 'undefined') {
            cellSize = [];
            cellSize[0] = this.options.size[0]/this.columns;
            cellSize[1] = this.options.size[1]/this.rows;
        }

        const mod = new Grid___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default.a({
            align: [0,0],
            origin: [0,0],
            size: cellSize? [cellSize[0], cellSize[1]]: [undefined, undefined],
            transform: __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Transform___default.a.translate(column*cellSize[0],row*cellSize[1],0)
        });
        const mod2 = new Grid___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Modifier___default.a({
            //transform: Transform.rotateY(Math.PI/10),
            align: [0.5,0.5],
            origin: [0.5,0.5]
        });
        // FIXME: ^^^ Why do I need an extra Modifier to align stuff in the middle of the grid cells?????
        this.cellNodes.push(this.add(mod).add(mod2));
    };

    /**
     * Sets the items to be layed out in the grid.
     *
     * @param {Array} children An array of [famous/src/core/RenderNode](#famous/src/core/RenderNode)-compatible items.
     */
    Grid.prototype.setChildren = function setChildren (children) {
        __WEBPACK_IMPORTED_MODULE_3_army_knife_forLength___default()(this.columns*this.rows, function(index) {
            //this.cellNodes[index].set(null); // TODO: how do we erase previous children?
            this.cellNodes[index].add(children[index]);
        }.bind(this));
        return this;
    };

    return Grid;
}(Molecule_defaultExport));
/* harmony default export */ var Grid_defaultExport = (Grid);

// CONCATENATED MODULE: ./src/Plane.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Surface__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Surface___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Surface__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */





/**
 * Planes have the properties of [Molecules](#Molecule), plus they contain a
 * [famous/src/core/Surface](#famous/src/core/Surface) so that they ultimately render
 * onto the screen. A Surface's events are automatically piped to it's
 * [famous/src/core/EventHandler](#famous/src/core/EventHandler), inherited from
 * `Molecule`.
 *
 * @class Plane
 * @extends Molecule
 */
var Plane = (function (Molecule) {
    function Plane(initialOptions) {
        Molecule.call(this, initialOptions);

        this.surface = new __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Surface___default.a(this.options);
        this.add(this.surface);
        this.surface.pipe(this.options.handler);
    }

    if ( Molecule ) Plane.__proto__ = Molecule;
    Plane.prototype = Object.create( Molecule && Molecule.prototype );
    Plane.prototype.constructor = Plane;

    /**
     * Get the content of this Plane's [famous/src/core/Surface](#famous/src/core/Surface).
     * See [famous/src/core/Surface.getContent](#famous/src/core/Surface.getContent).
     */
    Plane.prototype.getContent = function getContent () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.surface.getContent.apply(this.surface, args);
    };

    /**
     * Set the content of this Plane's [famous/src/core/Surface](#famous/src/core/Surface).
     * See [famous/src/core/Surface.setContent](#famous/src/core/Surface.setContent).
     */
    Plane.prototype.setContent = function setContent () {
        const args = Array.prototype.splice.call(arguments, 0);
        return this.surface.setContent.apply(this.surface, args);
    };

    return Plane;
}(Molecule_defaultExport));
/* harmony default export */ var Plane_defaultExport = (Plane);

// CONCATENATED MODULE: ./src/DoubleSidedPlane.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */






/**
 * A scenegraph tree who's two leaf nodes are [Plane](#Plane) instances facing
 * opposite directions. For the purposes of these docs, in a brand new app with
 * only a single `DoubleSidedPlane` added to the context, and having no
 * rotation, "plane1" faces you and "plane2" faces away.
 *
 * @class DoubleSidedPlane
 * @extends Molecule
 */
var DoubleSidedPlane_DoubleSidedPlane = (function (Molecule) {
    function DoubleSidedPlane(initialOptions) {
        Molecule.call(this, initialOptions);

        this.children = [];
        this.plane1 = new Plane_defaultExport(this.options);
        this.plane1.transform.set(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default.a.rotate(0,0,0));
        this.setOptions({properties: {background: 'orange'}});
        this.plane2 = new Plane_defaultExport(this.options);
        this.plane2.transform.set(__WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default.a.rotate(0,Math.PI,0));

        this.children.push(this.plane1);
        this.children.push(this.plane2);
        this.add(this.plane2)
        this.add(this.plane1);
        this.plane1.pipe(this.options.handler);
        this.plane2.pipe(this.options.handler);

    }

    if ( Molecule ) DoubleSidedPlane.__proto__ = Molecule;
    DoubleSidedPlane.prototype = Object.create( Molecule && Molecule.prototype );
    DoubleSidedPlane.prototype.constructor = DoubleSidedPlane;

    /**
     * Get the content of the [famous/src/core/Surface](#famous/src/core/Surface) of each [Plane](#Plane).
     *
     * @returns {Array} An array containing two items, the content of each
     * `Plane`. The first item is from "plane1".
     */
    DoubleSidedPlane.prototype.getContent = function getContent () {
        return [this.plane1.getContent(), this.plane2.getContent()];
    };

    /**
     * Set the content of both [Plane](#Plane) instances.
     *
     * @param {Array} content An array of content, one item per `Plane`. The
     * first item is for "plane1".
     */
    DoubleSidedPlane.prototype.setContent = function setContent (content) {
        this.plane1.setContent(content[0]);
        this.plane2.setContent(content[1]);
    };

    return DoubleSidedPlane;
}(Molecule_defaultExport));
/* harmony default export */ var DoubleSidedPlane_defaultExport = (DoubleSidedPlane_DoubleSidedPlane);

// CONCATENATED MODULE: ./src/Calendar.js
/* harmony import */ var Calendar___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform__ = __webpack_require__(2);
/* harmony import */ var Calendar___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default = __webpack_require__.n(Calendar___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_transitions_Transitionable__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_transitions_Transitionable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_famous_src_transitions_Transitionable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Easing__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Easing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Easing__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_army_knife_forLength__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_army_knife_forLength___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_army_knife_forLength__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */











/**
 * A calendar widget for selecting a date (WIP).
 *
 * @class Calendar
 * @extends Molecule
 */
var Calendar_Calendar = (function (Molecule) {
    function Calendar(calendarSize, transition) {
        Molecule.call(this, {size: calendarSize});

        this.transition = transition;
        this.flipSide = 0; // 0 means the initial front faces are showing, 1 means the initial back faces are showing.
        this.columnsRows = [7,6];
        this.planes = [];

        this._initializeTransitions();
        this._createGrid();

        setTimeout( function() {
            this.transitions[this.transition]();
            setInterval(this.transitions[this.transition], 2000);
        }.bind(this) , 800);
    }

    if ( Molecule ) Calendar.__proto__ = Molecule;
    Calendar.prototype = Object.create( Molecule && Molecule.prototype );
    Calendar.prototype.constructor = Calendar;

    /**
     * Creates the grid used for the layout of the day cells.
     *
     * @private
     */
    Calendar.prototype._createGrid = function _createGrid () {
        const grid = new Grid_defaultExport(this.columnsRows[0], this.columnsRows[1], this.options.size);

        __WEBPACK_IMPORTED_MODULE_6_army_knife_forLength___default()(this.columnsRows[0]*this.columnsRows[1], function(i) {
            const plane = new DoubleSidedPlane_defaultExport({
                properties: {
                    background: 'teal',
                }
            });
            this.planes.push(plane);
        }.bind(this));

        grid.setChildren(this.planes);
        this.add(grid);
    };

    /**
     * Set up `this.transitions`, containing the available month-to-month
     * transitions.
     *
     * @private
     */
    Calendar.prototype._initializeTransitions = function _initializeTransitions () {
        this.transitions = {
            flipDiagonal: function() {
                this.flipSide = +!this.flipSide;
                // determine which dimension of the grid is shorter and which is longer.
                let shortest = 0;
                let longest;
                this.columnsRows.forEach(function(item, index) {
                    if (item < this.columnsRows[shortest])
                        { shortest = index; }
                }.bind(this));
                longest = +!shortest;

                // for each diagonal of the grid, flip those cells.
                __WEBPACK_IMPORTED_MODULE_6_army_knife_forLength___default()(this.columnsRows[0]+this.columnsRows[1]-1, function(column) {
                    __WEBPACK_IMPORTED_MODULE_6_army_knife_forLength___default()(this.columnsRows[shortest], function(row) {
                        if (column-row >= 0 && column-row < this.columnsRows[longest]) {
                            const plane = this.planes[column-row + this.columnsRows[longest]*row];
                            flipOne(plane, column);
                        }
                    }.bind(this));
                }.bind(this));

                function flipOne(item, column) {
                    if (typeof item.__targetRotation == 'undefined') {
                        item.__targetRotation = new __WEBPACK_IMPORTED_MODULE_1_famous_src_transitions_Transitionable___default.a(0);
                    }
                    const rotation = new __WEBPACK_IMPORTED_MODULE_1_famous_src_transitions_Transitionable___default.a(item.__targetRotation.get());
                    item.__targetRotation.set(item.__targetRotation.get()+Math.PI);

                    //item.get().transformFrom(function() {
                        //return Transform.rotateY(rotation.get());
                    //});
                    item.children[0].get().transformFrom(function() {
                        return Calendar___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default.a.rotateY(rotation.get());
                    });
                    item.children[1].get().transformFrom(function() {
                        return Calendar___WEBPACK_IMPORTED_MODULE_0_famous_src_core_Transform___default.a.rotateY(rotation.get()+Math.PI);
                    });

                    setTimeout(function() {
                        rotation.set(item.__targetRotation.get(), { duration: 2000, curve: __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Easing___default.a.outExpo });
                    }, 0+50*column);
                }
            }.bind(this)
        };
    };

    return Calendar;
}(Molecule_defaultExport));
/* harmony default export */ var Calendar_defaultExport = (Calendar_Calendar);

// CONCATENATED MODULE: ./src/lib/jss/index.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jss__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jss_nested__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jss_nested___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jss_nested__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jss_extend__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jss_extend___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jss_extend__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jss_px__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jss_px___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jss_px__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jss_vendor_prefixer__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jss_vendor_prefixer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jss_vendor_prefixer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jss_camel_case__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jss_camel_case___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_jss_camel_case__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jss_props_sort__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jss_props_sort___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_jss_props_sort__);









const jss = __WEBPACK_IMPORTED_MODULE_0_jss___default.a.create()

jss.use(__WEBPACK_IMPORTED_MODULE_1_jss_nested___default()())
jss.use(__WEBPACK_IMPORTED_MODULE_2_jss_extend___default()())
jss.use(__WEBPACK_IMPORTED_MODULE_3_jss_px___default()())
jss.use(__WEBPACK_IMPORTED_MODULE_4_jss_vendor_prefixer___default()())
jss.use(__WEBPACK_IMPORTED_MODULE_5_jss_camel_case___default()())
jss.use(__WEBPACK_IMPORTED_MODULE_6_jss_props_sort___default()())

/* harmony default export */ var jss_defaultExport = (jss);

// CONCATENATED MODULE: ./src/PushMenuLayout.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Surface__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Surface___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_famous_src_core_Surface__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Transitionable__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Transitionable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Transitionable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_famous_src_transitions_Easing__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_famous_src_transitions_Easing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_famous_src_transitions_Easing__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_famous_src_inputs_TouchSync__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_famous_src_inputs_TouchSync___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_famous_src_inputs_TouchSync__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_famous_src_inputs_GenericSync__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_famous_src_inputs_GenericSync___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_famous_src_inputs_GenericSync__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_army_knife_callAfter__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_army_knife_callAfter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_army_knife_callAfter__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */















/**
 * A scenegraph with two Molecule leafnodes: the menu area and the content
 * area. The menu area is hidden beyond the edge of the screen while the
 * content area is visible. Swiping in from the edge of the screen reveals the
 * menu, putting the content area out of focus. A mouse can also be used, and
 * hovering near the edge of the screen also reveals the menu.
 *
 * Note: This layout is mostly useful if it exists at the root of a context so
 * that the menu is clipped when it is closed (off to the side), otherwise the
 * menu will be visible beyond the boundary of the container that contains the
 * PushMenuLayout.
 *
 * Note: If you've called `openMenu` or `closeMenu` with a callback, the callback
 * will be canceled if a drag or hover on the menu happens before the animation
 * has completed. Please open an issue on GitHub if you have any opinion
 * against this. :) Maybe we can add a boolean option for this behavior.
 *
 * TODO: Embed working example here.
 *
 * @class PushMenuLayout
 * @extends Molecule
 */
var PushMenuLayout_PushMenuLayout = (function (Molecule) {
    function PushMenuLayout(initialOptions) {
        Molecule.call(this, initialOptions);

        // Add default values for this PushMenuLayout
        // TODO: Make default options static for the class.
        simpleExtend(this._.defaultOptions, {
            menuSide: 'left', // left or right
            menuWidth: 200,
            menuHintSize: 10, // the amount of the menu that is visible before opening the menu.
            pushAreaWidth: 40, // the area on the screen edge that the user can touch and drag to push out the menu.
            animationDuration: 1000,
            animationType: 'foldDown', // options: foldDown moveBack

            // TODO: Background color for the whole layout should be the color that the fade fades to.
            // TODO: Replace fade star/end colors with a fog color value and intensity.
            fade: true, // when content recedes, it fades into the fog.
            fadeStartColor: 'rgba(255,255,255,0)',
            fadeEndColor: 'rgba(255,255,255,1)',

            blur: false, // XXX: WIP, so false by default.
            blurRadius: 5
        })

        // TODO: performance hit, this setter is invoked in the Molecule constructor, then here again.
        this.options = initialOptions

        // TODO v0.1.0: Mark these as private.
            // TODO v0.1.0: this.contentWidth should be the width of whatever is containing
            // the layout, but we're just using it as a whole-page app for now. Get
            // size from a commit? UPDATE: See the new famous/src/views/SizeAwareView
            this.contentWidth = document.body.clientWidth - this.options.menuHintSize;

            // Changing these values outside of an instance of PushMenuLayout might
            // cause the layout to break. They are designed to be modified
            // internally only.
            this.isOpen = false;
            this.isOpening = false;
            this.isClosing = false;
            this.isAnimating = false; // keep track of whether the menu is opening or closing.
            this.isBeingDragged = false; // whether the user is dragging/pushing the menu or not.
            this.transitionCallback = undefined; // holds the callback to the current open or close menu animation.

        // Set the touch sync for pulling/pushing the menu open/closed.
        __WEBPACK_IMPORTED_MODULE_5_famous_src_inputs_GenericSync___default.a.register({
            touch: __WEBPACK_IMPORTED_MODULE_4_famous_src_inputs_TouchSync___default.a
        });

        this._createComponents();
        this._initializeEvents();
    }

    if ( Molecule ) PushMenuLayout.__proto__ = Molecule;
    PushMenuLayout.prototype = Object.create( Molecule && Molecule.prototype );
    PushMenuLayout.prototype.constructor = PushMenuLayout;

    /**
     * See Molecule.setOptions
     *
     * @override
     */
    PushMenuLayout.prototype.setOptions = function setOptions (newOptions) {
        Molecule.prototype.setOptions.call(this, newOptions)
    };

    /**
     * See Molecule.resetOptions
     *
     * @override
     */
    PushMenuLayout.prototype.resetOptions = function resetOptions () {
        Molecule.prototype.resetOptions.call(this)
    };

    /**
     * Creates the menu area, content area, `Plane` for the fade effect, etc.
     *
     * @private
     */
    PushMenuLayout.prototype._createComponents = function _createComponents () {
        var layout = this;

        this.touchSync = new __WEBPACK_IMPORTED_MODULE_5_famous_src_inputs_GenericSync___default.a(['touch']);

        this.alignment = (this.options.menuSide == "left"? 0: 1);
        this.animationTransition = new __WEBPACK_IMPORTED_MODULE_2_famous_src_transitions_Transitionable___default.a(0);

        this.mainMol = new Molecule();

        this.menuMol = new Molecule({
            size: [this.options.menuWidth,undefined]
        });
        this.menuMol.oldTransform = this.menuMol.transform;
        this.menuMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.options.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth-layout.options.menuHintSize)/*range*/ - (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/:
                            currentPosition * -(layout.options.menuWidth-layout.options.menuHintSize)/*range*/ + (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/
                    );
                    break;
                case "moveBack":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth-layout.options.menuHintSize)/*range*/ - (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/:
                            currentPosition * -(layout.options.menuWidth-layout.options.menuHintSize)/*range*/ + (layout.options.menuWidth-layout.options.menuHintSize)/*offset*/
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.menuMol);

        // contains the user's menu content.
        this.menuContentMol = new Molecule();

        this.contentMol = new Molecule({
            size: [this.contentWidth,undefined]
        });
        this.contentMol.oldTransform = this.contentMol.transform;
        this.contentMol.transform = function() { // override
            var currentPosition = layout.animationTransition.get();
            switch(layout.options.animationType) {
                case "foldDown":
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            currentPosition *  (layout.options.menuWidth - layout.options.menuHintSize)/*range*/ + layout.options.menuHintSize/*offset*/:
                            currentPosition * -(layout.options.menuWidth - layout.options.menuHintSize)/*range*/ - layout.options.menuHintSize/*offset*/
                    );
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setRotateY(
                        layout.options.menuSide == 'left'?
                            currentPosition *  Math.PI/8:
                            currentPosition * -Math.PI/8
                    );
                    break;
                case "moveBack":
                    var depth = 100;
                    // XXX: this is depending on my modifications for TransitionableTransform.
                    this.oldTransform.setTranslateX(
                        layout.options.menuSide == 'left'?
                            layout.options.menuHintSize:
                            -layout.options.menuHintSize
                    );
                    this.oldTransform.setTranslateZ(
                        currentPosition * -depth
                    );
                    break;
            }
            return this.oldTransform.get();
        }.bind(this.contentMol);

        this.menuTouchPlane = new Plane_defaultExport({
            size: [this.options.menuWidth + this.options.pushAreaWidth - this.options.menuHintSize, undefined],
            properties: {
                zIndex: '-1000' // below everything
            }
        });

        this.mainMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });
        this.menuMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });
        this.contentMol.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });

        // FIXME: WHY THE EFF must I also set align and origin on menuTouchPlane
        // when I've already set it on it's parent (this.menuMol)?????
        this.menuTouchPlane.setOptions({
            origin: [this.alignment, 0.5],
            align: [this.alignment, 0.5]
        });

        // Bring the menu content molecule and touch plane forward just
        // slightly so they're just above the content and content's fade plane,
        // so touch and mouse interaction works. HTML, the bad parts. ;)
        this.menuContentMol.transform.setTranslateZ(2);
        this.menuTouchPlane.transform.setTranslateZ(2);

        /*
         * Styles for the fadePlane
         */
        // TODO: move this somewhere else . it's specific for each animation
        this.updateStyles = function() {
            var startColor
            var endColor

            switch(this.options.animationType) {
                case "foldDown":
                    startColor = this.options.fadeStartColor
                    endColor = this.options.fadeEndColor
                    break;
                case "moveBack":
                    startColor = endColor = this.options.fadeEndColor
                    break;
            }

            var styles = {
                '.infamous-fadeLeft': {
                    background: [
                        endColor,
                        '-moz-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+endColor+'), color-stop(100%, '+startColor+'))',
                        '-webkit-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-o-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        '-ms-linear-gradient(left, '+endColor+' 0%, '+startColor+' 100%)',
                        'linear-gradient(to right, '+endColor+' 0%, '+startColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#cc000000\', endColorstr=\'#4d000000\', GradientType=1 )'
                },
                '.infamous-fadeRight': {
                    background: [
                        startColor,
                        '-moz-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-webkit-gradient(left top, right top, color-stop(0%, '+startColor+'), color-stop(100%, '+endColor+'))',
                        '-webkit-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-o-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        '-ms-linear-gradient(left, '+startColor+' 0%, '+endColor+' 100%)',
                        'linear-gradient(to right, '+startColor+' 0%, '+endColor+' 100%)'
                    ],
                    filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#4d000000\', endColorstr=\'#cc000000\', GradientType=1 )'
                }
            };

            if (this.fadeStylesheet) { this.fadeStylesheet.detach(); }
            this.fadeStylesheet = jss_defaultExport.createStyleSheet(styles);
            this.fadeStylesheet.attach();
        };

        if (this.options.fade) {
            this.updateStyles();

            this.fadePlane = new Plane_defaultExport({
                size: [undefined,undefined],
                classes: [
                    // TODO: switch to jss namespace.
                    (this.options.menuSide == 'left'? 'infamous-fadeRight': 'infamous-fadeLeft')
                ],
                properties: {
                    zIndex: '1000',
                    pointerEvents: 'none'
                }
            });

            // FIXME: Why the EFF must I also set align and origin on fadePlane when
            // I've already set it on it's parent (this.contentMol)?????
            this.fadePlane.setOptions({
                origin: [this.alignment, 0.5],
                align: [this.alignment, 0.5]
            });

            // move the fadePlane forward by 1px so it doesn't glitch out.
            // Chrome will make the fadePlane and the surface in the content
            // area (if any) blink randomly when the two surfaces are in the
            // same exact position together.
            this.fadePlane.transform.setTranslateZ(1);

            this.fadePlane.setOptions({
                opacity: this.animationTransition
            });

            // TODO: Make fadePlane a sibling to menuMol and contentMol so that
            // contentMol contains only the user;s content. This will affect
            // the code in this.render().
            this.contentMol.add(this.fadePlane);
        }

        this.add(this.mainMol);
        this.mainMol.add(this.contentMol);
        this.menuMol.add(this.menuTouchPlane);
        this.menuMol.add(this.menuContentMol);
        this.mainMol.add(this.menuMol);
        // TODO: Also create and add a background plane for the menu area so it will catch events that might fall through the menu content.
    };

    /**
     * Sets up the events for the touch and mouse interaction that opens and
     * closes the menu.
     *
     * @private
     */
    PushMenuLayout.prototype._initializeEvents = function _initializeEvents () {

        // move the menu, following the user's drag. Don't let the user drag the menu past the menu width.
        this.options.handler.on('update', function(event) { // update == drag
            this.isBeingDragged = true;

            // stop the current transitions if any, along with the current callback if any.
            this._haltAnimation(true);

            var currentPosition = this.animationTransition.get();

            // TODO: handle the right-side menu.
            switch(this.options.animationType) {
                case "foldDown":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.options.menuWidth - this.options.menuHintSize));
                    break;
                case "moveBack":
                    this.animationTransition.set(currentPosition + event.delta[0] / (this.options.menuWidth - this.options.menuHintSize));
                    break;
            }

            currentPosition = this.animationTransition.get();

            if (currentPosition > 1) {
                this.animationTransition.set(1);
            }
            else if (currentPosition < 0) {
                this.animationTransition.set(0);
            }
        }.bind(this));

        this.options.handler.on('end', function(event) {
            this.isBeingDragged = false;

            var currentPosition = this.animationTransition.get();

            if (currentPosition < 0.5) {
                this.closeMenu();
            }
            else {
                this.openMenu();
            }
        }.bind(this));

        // TODO v0.1.0: Use a SizeAwareView instead of relying on the body, since we
        // might not be directly in the body.
        window.addEventListener('resize', function(event) {
            this.contentWidth = document.body.clientWidth - this.options.menuHintSize;
            this.contentMol.setOptions({size: [this.contentWidth, undefined]});
        }.bind(this));

        /*
         * Wire up events
         * TODO: consolidate dup code here and in setMenu
         */
        this.menuTouchPlane.pipe(this.touchSync);
        this.menuTouchPlane.on('mouseenter', function() {
            if (!this.isOpening) {
                this.openMenu();
            }
        }.bind(this))
        this.menuTouchPlane.on('mouseleave', function() {
            if (!this.isClosing) {
                this.closeMenu();
            }
        }.bind(this))
        this.touchSync.pipe(this.options.handler);
    };

    /**
     * Add a scenegraph to the content area of the PushMenuLayout. You can put
     * anything you want into the content area (magical 3D things for example),
     * just be careful not to let them cover the menu or you'll block the user
     * from interacting with the menu.
     *
     * @param {module: famous/src/core/RenderNode} node A scenegraph, i.e. a
     * RenderNode with stuff in it.
     *
     * TODO: Accept plain renderables, f.e. Surfaces, etc. This change requires
     * also modifying the code in this.render() to account for renderables.
     *
     * TODO: Make a sibling method to reset the content area.
     */
    PushMenuLayout.prototype.setContent = function setContent (node) {
        this.contentMol.add(node)
    };

    /**
     * Add a scenegraph to the menu area of the PushMenuLayout. If the object
     * that you pass into setMenu is an infamous component, or a famo.us
     * Surface, then it's events will be piped to this PushMenuLayout's input
     * sync so that the user can open and close the menu with touch or mouse.
     * General advice here would be to keep whatever you put into the menu
     * contained within the boundaries of the menu or you might have touch and
     * mouse interaction outside of the menu.
     *
     * @param {module: famous/src/core/RenderNode} node A scenegraph, i.e. a
     * RenderNode with stuff in it.
     *
     * TODO: Accept plain renderables, f.e. Surfaces, etc.
     *
     * TODO: Remove old content before adding new content.
     */
    PushMenuLayout.prototype.setMenu = function setMenu (node) {
        this.menuContentMol.add(node)
        if (node instanceof Molecule) {
            node.pipe(this.touchSync)
            node.on('mouseenter', function() {
                if (!this.isOpening) {
                    this.openMenu();
                }
            }.bind(this))
            node.on('mouseleave', function() {
                if (!this.isClosing) {
                    this.closeMenu();
                }
            }.bind(this))
        }
    };

    // TODO: replace menu easing with physics so the user can throw the menu,
    // using initial velocity and drag to slow it down, and stop immediately
    // when it hits the fully-open or fully-closed positions.

    /**
     * Opens the menu.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    PushMenuLayout.prototype.openMenu = function openMenu (callback, cancelPreviousCallback) {
        this._haltAnimation(cancelPreviousCallback);

        this.isClosing = false;
        this.isOpening = true;

        this._animate('open', callback);
    };

    /**
     * Closes the menu.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    PushMenuLayout.prototype.closeMenu = function closeMenu (callback, cancelPreviousCallback) {
        this._haltAnimation(cancelPreviousCallback);

        this.isClosing = true;
        this.isOpening = false;

        this._animate('close', callback);
    };

    /**
     * Toggles the menu open or closed. If the menu is open or is opening, then it will now start
     * closing, and vice versa.
     *
     * @param {Function} callback The function to be called when the animation finishes.
     * @param {boolean} [cancelPreviousCallback=false] This is optional. If
     * true, then the callback of a previous open or close animation will be
     * canceled if that animation was still inprogress when this method is
     * called, otherwise the callback of the previous open or close animation
     * will be fired immediately before the animation for this animation begins.
     */
    PushMenuLayout.prototype.toggleMenu = function toggleMenu (callback, cancelPreviousCallback) {
        if (this.isOpen || this.isOpening) {
            this.closeMenu(callback, cancelPreviousCallback);
        }
        else if (!this.isOpen || this.isClosing) {
            this.openMenu(callback, cancelPreviousCallback);
        }
    };

    /**
     * Animates the menu to it's target state.
     *
     * @private
     * @param {String} targetState The name of the state to animate to.
     * @param {Function} callback The function to call after the animation completes.
     */
    PushMenuLayout.prototype._animate = function _animate (targetState, callback) {
        this.isAnimating = true;
        this.transitionCallback = callback;
        var _callback;

        var self = this;
        function setupCallback(numberOfTransitions) {
            // Fire callback after numberOfTransitions calls, when the 4 transitions are complete.
            _callback = __WEBPACK_IMPORTED_MODULE_9_army_knife_callAfter___default()(numberOfTransitions, function() {
                self.isAnimating = self.isOpening = self.isClosing = false;
                self.isOpen = targetState == 'open'? true: false;
                if (typeof self.transitionCallback == 'function') {
                    self.transitionCallback();
                }
                self.transitionCallback = undefined;
            }.bind(self));
        }

        setupCallback(1);
        if (targetState == 'open') {
            this.animationTransition.set(1, {duration: this.options.animationDuration, curve: __WEBPACK_IMPORTED_MODULE_3_famous_src_transitions_Easing___default.a.outExpo}, _callback);
        }
        else if (targetState == 'close') {
            this.animationTransition.set(0, {duration: this.options.animationDuration, curve: __WEBPACK_IMPORTED_MODULE_3_famous_src_transitions_Easing___default.a.outExpo}, _callback);
        }
    };

    /**
     * Halts the current animation, if any.
     *
     * @private
     * @param {boolean} [cancelCallback=false] Defaults to false. If true, the
     * halted animation's callback won't fire, otherwise it will be fired.
     */
    PushMenuLayout.prototype._haltAnimation = function _haltAnimation (cancelCallback) {
        if (this.isAnimating) {
            if (!cancelCallback && typeof this.transitionCallback == 'function') {
                this.transitionCallback();
            }
            this.transitionCallback = undefined;
            this.animationTransition.halt();
        }
    };

    /**
     * @override
     */
    PushMenuLayout.prototype.render = function render () {

        // Blur the content if this.options.blur is true, and the animation is moveBack.
        //
        // TODO: Make the item to to be blur specifiable, perhaps with a method on
        // this.
        if (this.options.blur && this.options.fade && this.options.animationType == 'moveBack') {
            let momentaryBlur = (this.animationTransition.get() * this.options.blurRadius)
            let filter = {
                "-webkit-filter": 'blur('+momentaryBlur+'px)',
                "-moz-filter":    'blur('+momentaryBlur+'px)',
                "-ms-filter":     'blur('+momentaryBlur+'px)',
                "-o-filter":      'blur('+momentaryBlur+'px)',
                filter:           'blur('+momentaryBlur+'px)'
            }

            // TODO TODO TODO v0.1.0: Make fadePlane a sibling with menu and
            // content molecules or the following breaks if fade is false.
            // Then remove the check for this.options.fade in the previous if
            // statement above.
            if (this.contentMol._child[1].get() instanceof __WEBPACK_IMPORTED_MODULE_1_famous_src_core_Surface___default.a) {
                this.contentMol.get().setProperties(filter)
            }
            else if (this.contentMol._child[1] instanceof Plane_defaultExport) {
                this.contentMol._child[1].surface.setProperties(filter)
            }
        }

        return Molecule.prototype.render.call(this)
    };

    return PushMenuLayout;
}(Molecule_defaultExport));
/* harmony default export */ var PushMenuLayout_defaultExport = (PushMenuLayout_PushMenuLayout);

// CONCATENATED MODULE: ./src/core/Observable.js

const Observable_instanceofSymbol = Symbol('instanceofSymbol')

const ObservableMixin = function (base) {
    var Observable = (function (base) {
        function Observable(options) {
            if ( options === void 0 ) options = {};

            base.call(this, options)
        }

        if ( base ) Observable.__proto__ = base;
        Observable.prototype = Object.create( base && base.prototype );
        Observable.prototype.constructor = Observable;

        Observable.prototype.on = function on (eventName, callback) {
            if (!this._eventMap)
                { this._eventMap = new Map }

            if (!this._eventMap.has(eventName))
                { this._eventMap.set(eventName, []) }

            if (typeof callback == 'function')
                { this._eventMap.get(eventName).push(callback) }
            else
                { throw new Error('Expected a function in callback argument of Observable#on.') }
        };

        Observable.prototype.off = function off (eventName, callback) {
            if (!this._eventMap || !this._eventMap.has(eventName)) { return }

            const callbacks = this._eventMap.get(eventName)

            if (callbacks.indexOf(callback) === -1) { return }

            callbacks.splice(callbacks.indexOf(callback), 1)

            if (callbacks.length === 0) { this._eventMap.delete(eventName) }

            if (this._eventMap.size === 0) { this._eventMap = null }
        };

        Observable.prototype.triggerEvent = function triggerEvent (eventName, data) {
            if (!this._eventMap || !this._eventMap.has(eventName)) { return }

            const callbacks = this._eventMap.get(eventName)

            for (let i=0, len=callbacks.length; i<len; i+=1) {
                callbacks[i](data)
            }
        };

        return Observable;
    }(base));

    Object.defineProperty(Observable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Observable) { return Object.getPrototypeOf(Observable)[Symbol.hasInstance].call(this, obj) }

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(Observable_instanceofSymbol))
                    { return true }

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Observable[Observable_instanceofSymbol] = true

    return Observable
}

const Observable = ObservableMixin((function () {
    function anonymous () {}

    return anonymous;
}()))
Observable.mixin = ObservableMixin



// CONCATENATED MODULE: ./src/core/XYZValues.js


/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The value don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
var XYZValues = (function (Observable) {
    function XYZValues(x, y, z) {
        if ( x === void 0 ) x = 0;
        if ( y === void 0 ) y = 0;
        if ( z === void 0 ) z = 0;

        Observable.call(this)
        this._x = x
        this._y = y
        this._z = z
    }

    if ( Observable ) XYZValues.__proto__ = Observable;
    XYZValues.prototype = Object.create( Observable && Observable.prototype );
    XYZValues.prototype.constructor = XYZValues;

    return XYZValues;
}(Observable));

// We set accessors manually because Buble doesn't make them configurable
// as per spec. Additionally we're maing these ones enumerable.
Object.defineProperties(XYZValues.prototype, {
    x: {
        set: function set(value) {
            this._x = value
            this.triggerEvent('valuechanged', {x: value})
        },
        get: function get() { return this._x },
        configurable: true,
        enumerable: true,
    },

    y: {
        set: function set(value) {
            this._y = value
            this.triggerEvent('valuechanged', {y: value})
        },
        get: function get() { return this._y },
        configurable: true,
        enumerable: true,
    },

    z: {
        set: function set(value) {
            this._z = value
            this.triggerEvent('valuechanged', {z: value})
        },
        get: function get() { return this._z },
        configurable: true,
        enumerable: true,
    },
})



// CONCATENATED MODULE: ./src/core/Utility.js
var Utility_namespaceObject = {};
__webpack_require__.d(Utility_namespaceObject, "epsilon", function() { return epsilon; });
__webpack_require__.d(Utility_namespaceObject, "applyCSSLabel", function() { return applyCSSLabel; });
__webpack_require__.d(Utility_namespaceObject, "animationFrame", function() { return animationFrame; });
__webpack_require__.d(Utility_namespaceObject, "makeLowercaseSetterAliases", function() { return makeLowercaseSetterAliases; });
__webpack_require__.d(Utility_namespaceObject, "observeChildren", function() { return observeChildren; });
__webpack_require__.d(Utility_namespaceObject, "getShadowRootVersion", function() { return getShadowRootVersion; });
__webpack_require__.d(Utility_namespaceObject, "hasShadowDomV0", function() { return hasShadowDomV0; });
__webpack_require__.d(Utility_namespaceObject, "hasShadowDomV1", function() { return hasShadowDomV1; });
__webpack_require__.d(Utility_namespaceObject, "getAncestorShadowRoot", function() { return getAncestorShadowRoot; });
__webpack_require__.d(Utility_namespaceObject, "traverse", function() { return traverse; });
function epsilon(value) {
    return Math.abs(value) < 0.000001 ? 0 : value;
}

function applyCSSLabel(value, label) {
    if (value === 0) {
        return '0px'
    } else if (label === '%') {
        return value * 100 + '%';
    } else if (label === 'px') {
        return value + 'px'
    }
}

function animationFrame() {
    let resolve = null
    const promise = new Promise(function (r) { return resolve = r; })
    window.requestAnimationFrame(resolve)
    return promise
}

// Create lowercase versions of each setter property.
// we care only about the setters, for now.
function makeLowercaseSetterAliases(object) {
    const props = Object.getOwnPropertyNames(object)
    for (let l=props.length, i=0; i<l; i+=1) {
        const prop = props[i]
        const lowercaseProp = prop.toLowerCase()
        if (lowercaseProp != prop) {
            const descriptor = Object.getOwnPropertyDescriptor(object, prop)
            if (typeof descriptor.set != 'undefined') {
                Object.defineProperty(object, lowercaseProp, descriptor)
            }
        }
    }
}

let childObservationHandlers = null
let childObserver = null
function observeChildren(ctx, onConnect, onDisconnect) {
    if (!childObservationHandlers) { childObservationHandlers = new Map }
    if (!childObserver) { childObserver = createChildObserver() }
    childObservationHandlers.set(ctx, {onConnect: onConnect, onDisconnect: onDisconnect})
    childObserver.observe(ctx, { childList: true })
    return true
}

// NOTE: If a child is disconnected then connected to the same parent in the
// same turn, then the onConnect and onDisconnect callbacks won't be called
// because the DOM tree will be back in the exact state as before (this is
// possible thanks to the logic associated with weightsPerTarget).
function createChildObserver() {
    return new MutationObserver(function (changes) {
        const weightsPerTarget = new Map

        // We're just counting how many times each child node was added and
        // removed from the parent we're observing.
        for (let i=0, l=changes.length; i<l; i+=1) {
            const change = changes[i]

            if (change.type != 'childList') { continue }

            if (!weightsPerTarget.has(change.target))
                { weightsPerTarget.set(change.target, new Map) }

            const weights = weightsPerTarget.get(change.target)

            var addedNodes = change.addedNodes;
            for (let l=addedNodes.length, i=0; i<l; i+=1)
                { weights.set(addedNodes[i], (weights.get(addedNodes[i]) || 0) + 1) }

            var removedNodes = change.removedNodes;
            for (let l=removedNodes.length, i=0; i<l; i+=1)
                { weights.set(removedNodes[i], (weights.get(removedNodes[i]) || 0) - 1) }
        }

        // TODO PERFORMANCE: Can these for..of loops be converted to regular for loops?
        for (var i = 0, list = weightsPerTarget; i < list.length; i += 1) {
            const ref = list[i];
          var target = ref[0];
          var weights = ref[1];

          var ref$1 = childObservationHandlers.get(target);
            var onConnect = ref$1.onConnect;
            var onDisconnect = ref$1.onDisconnect;

            for (var i$1 = 0, list$1 = weights; i$1 < list$1.length; i$1 += 1) {
                // If the number of times a child was added is greater than the
                // number of times it was removed, then the net result is that
                // it was added, so we call onConnect just once.
                const ref$2 = list$1[i$1];
              var node = ref$2[0];
              var weight = ref$2[1];

              if (weight > 0 && typeof onConnect == 'function')
                    { onConnect.call(target, node) }

                // If the number of times a child was added is less than the
                // number of times it was removed, then the net result is that
                // it was removed, so we call onConnect just once.
                else if (weight < 0 && typeof onDisconnect == 'function')
                    { onDisconnect.call(target, node) }

                // If the number of times a child was added is equal to the
                // number of times it was removed, then it was essentially left
                // in place, so we don't call anything.
            }
        }
    })
}

const hasShadowDomV0 =
    typeof Element.prototype.createShadowRoot == 'function'
    && typeof HTMLContentElement == 'function'
    ? true : false

const hasShadowDomV1 =
    typeof Element.prototype.attachShadow == 'function'
    && typeof HTMLSlotElement == 'function'
    ? true : false

function getShadowRootVersion(shadowRoot) {
    console.log('getShadowRootVersion')
    if (!shadowRoot) { return null }
    const slot = document.createElement('slot')
    shadowRoot.appendChild(slot)
    slot.appendChild(document.createElement('div'))
    const assignedNodes = slot.assignedNodes({ flatten: true })
    slot.remove()
    console.log('hmm', assignedNodes.length, assignedNodes.length > 0 ? 'v1' : 'v0')
    return assignedNodes.length > 0 ? 'v1' : 'v0'
}

function getAncestorShadowRoot(node) {
    let current = node

    while (current && !(current instanceof ShadowRoot)) {
        current = current.parentNode
    }

    return current
}

// in the future, the user will be able to toggle the HTML API.
const hasHtmlApi = true

// Traverses a tree while considering ShadowDOM disribution.
function traverse(node, isShadowChild) {
    console.log(isShadowChild ? 'distributedNode:' : 'node:', node)

    var children = node.children;
    for (let l=children.length, i=0; i<l; i+=1) {
        // skip nodes that are possiblyDistributed, i.e. they have a parent
        // that has a ShadowRoot.
        if (!hasHtmlApi || !children[i]._elementManager.element._isPossiblyDistributed)
            { traverse(children[i]) }
    }

    const shadowChildren = node._elementManager.element._shadowChildren
    if (hasHtmlApi && shadowChildren) {
        for (let l=shadowChildren.length, i=0; i<l; i+=1)
            { traverse(shadowChildren[i].imperativeCounterpart, true) }
    }
}



// CONCATENATED MODULE: ./src/core/TreeNode.js
const TreeNode_instanceofSymbol = Symbol('instanceofSymbol')

const TreeNodeMixin = function (base) {
    var TreeNode = (function (base) {
        function TreeNode(options) {
            if ( options === void 0 ) options = {};

            base.call(this, options)
            this._parent = null // default to no parent.
            this._children = [];
        }

        if ( base ) TreeNode.__proto__ = base;
        TreeNode.prototype = Object.create( base && base.prototype );
        TreeNode.prototype.constructor = TreeNode;

        var prototypeAccessors = { parent: {},children: {},childCount: {} };

        /**
         * this._parent is protected (node's can access other node._parent).
         * The user should use the addChild methods, which automatically handles
         * setting a parent.
         *
         * @readonly
         */
        prototypeAccessors.parent.get = function () {
            return this._parent
        };

        /**
         * @readonly
         */
        prototypeAccessors.children.get = function () {
            // return a new array, so that the user modifying it doesn't affect
            // this node's actual children.
            return [].concat( this._children )
        };

        /**
         * Add a child node to this TreeNode.
         *
         * @param {TreeNode} childNode The child node to add.
         */
        TreeNode.prototype.addChild = function addChild (childNode) {

            if (! (childNode instanceof TreeNode))
                { throw new TypeError('TreeNode.addChild expects the childNode argument to be a TreeNode instance.') }

            if (childNode._parent === this)
                { throw new ReferenceError('childNode is already a child of this parent.') }

            if (childNode._parent)
                { childNode._parent.removeChild(childNode) }

            childNode._parent = this;

            this._children.push(childNode);

            return this
        };

        /**
         * Add all the child nodes in the given array to this node.
         *
         * @param {Array.TreeNode} nodes The nodes to add.
         */
        TreeNode.prototype.addChildren = function addChildren (nodes) {
            var this$1 = this;

            nodes.forEach(function (node) { return this$1.addChild(node); })
            return this
        };

        /**
         * Remove a child node from this node.
         *
         * @param {TreeNode} childNode The node to remove.
         */
        TreeNode.prototype.removeChild = function removeChild (childNode) {
            if (! (childNode instanceof TreeNode))
                { throw new Error("\n                    TreeNode.removeChild expects the childNode argument to be an\n                    instance of TreeNode. There should only be TreeNodes in the\n                    tree.\n                ") }

            if (childNode._parent !== this)
                { throw new ReferenceError('childNode is not a child of this parent.') }

            childNode._parent = null
            this._children.splice(this._children.indexOf(childNode), 1);

            return this
        };

        /**
         * Remove all the child nodes in the given array from this node.
         *
         * @param {Array.TreeNode} nodes The nodes to remove.
         */
        TreeNode.prototype.removeChildren = function removeChildren (nodes) {
            var this$1 = this;

            nodes.forEach(function (node) { return this$1.removeChild(node); })
            return this
        };

        /**
         * Shortcut to remove all children.
         */
        TreeNode.prototype.removeAllChildren = function removeAllChildren () {
            this.removeChildren(this._children)
            return this
        };

        /**
         * @readonly
         * @return {number} How many children this TreeNode has.
         */
        prototypeAccessors.childCount.get = function () {
            return this._children.length
        };

        Object.defineProperties( TreeNode.prototype, prototypeAccessors );

        return TreeNode;
    }(base));

    Object.defineProperty(TreeNode, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== TreeNode) { return Object.getPrototypeOf(TreeNode)[Symbol.hasInstance].call(this, obj) }

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(TreeNode_instanceofSymbol))
                    { return true }

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    TreeNode[TreeNode_instanceofSymbol] = true

    return TreeNode
}

const TreeNode = TreeNodeMixin((function () {
    function anonymous () {}

    return anonymous;
}()))
TreeNode.mixin = TreeNodeMixin



// CONCATENATED MODULE: ./src/core/webglUtils.js
// TODO:
//  - Finish lookAt from the camera tutorial.

let targetContextMap = new WeakMap

function createWebGLContext(target, version) {
    const canvas = createCanvas('100%', '100%')
    const gl = getGl(canvas, version)

    if (gl) {
        if (targetContextMap.has(target)) { removeWebGLContext(target) }
        target.appendChild(canvas)
        targetContextMap.set(target, gl)
    }

    return gl
}

function removeWebGLContext(target) {
    const gl = targetContextMap.get(target)
    target.removeChild(gl.canvas)
}

function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    setCanvasCSSSize(canvas, width, height)
    return canvas
}

function setCanvasCSSSize(canvas, width, height) {
    canvas.style.width = width
    canvas.style.height = height
}

function setGlResolution(gl, width, height) {
    setCanvasRenderSize(gl.canvas, width, height)
    gl.viewport(0, 0, width, height)
}

function setCanvasRenderSize(canvas, width, height) {
    canvas.width = width
    canvas.height = height
}

function getGl(canvasOrSelector, version) {
    let canvas

    if (canvasOrSelector instanceof HTMLCanvasElement)
        { canvas = canvasOrSelector }

    if (!canvas)
        { canvas = document.querySelector(canvasOrSelector) }

    if (!(canvas instanceof HTMLCanvasElement)) { return false }

    if (version == 1 || version == undefined) { version = '' }
    else if (version == 2) { version = '2' }
    else { throw new Error('Invalid WebGL version.') }

    return canvas.getContext('webgl'+version)
}

function createShader(gl, type, source) {
    // Create a vertex shader object
    const shader = gl.createShader(type)

    // Attach vertex shader source code
    gl.shaderSource(shader, source)

    // Compile the vertex shader
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) { return shader }

    const error = new Error("*** Error compiling shader '" + shader + "':" + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    throw error
}

function createProgram(gl, vertexShader, fragmentShader) {
    // Create a shader program object to store
    // the combined shader program
    const program = gl.createProgram()

    // Attach a vertex shader
    gl.attachShader(program, vertexShader)

    // Attach a fragment shader
    gl.attachShader(program, fragmentShader)

    // Link both programs
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }

    console.log(' --- Error making program. GL Program Info Log:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

const v3 = {
    cross: function cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0] ]
    },

    subtract: function subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    },

    add: function add(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    },

    normalize: function normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length]
        } else {
            return [0, 0, 0]
        }
    },
}

var Geometry = function Geometry() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    (ref = this)._init.apply(ref, args)
    var ref;
};

var webglUtils_prototypeAccessors = { color: {} };

Geometry.prototype._init = function _init () {
    this.verts = null // Float32Array
    this.normals = null // Float32Array
    this._colors = null // Float32Array
    this._color = null

    this._calcVerts()
    this.color = [ 0.5, 0.5, 0.5 ]
};

// TODO handle CSS color strings with tinycolor2 from NPM
// @param {Array.number} value - array of four color values r, g, b, and a.
// TODO: don't use accept values for color alpha, use node's opacity.
webglUtils_prototypeAccessors.color.set = function (value) {
    if (!value) { return }

    this._color = value
    let color = null

    if (typeof value == 'string')
        { color = value.trim().split(' ').map(function (rgbPart) { return parseFloat(rgbPart); }) }
    else { color = value }

    // length of _colors array, considering it is four numbers per color,
    // for each vertex.
    // TODO: use a uniform instead of attributes that are all the same
    // value.
    const l = this.verts.length
    const _colorsLength = l + l/3

    const _colors = this._colors = new Float32Array(_colorsLength)

    for (let i=0; i<_colorsLength; i+=4) { // 4 color parts per vertex
        _colors[i+0]  = color[0] // r
        _colors[i+1]  = color[1] // g
        _colors[i+2]  = color[2] // b
        _colors[i+3]  = typeof color[3] == 'undefined' ? 1 : color[3] // a
    }
};
webglUtils_prototypeAccessors.color.get = function () {
    return this._color
};

Object.defineProperties( Geometry.prototype, webglUtils_prototypeAccessors );

var IsoscelesTriangle = (function (Geometry) {
    function IsoscelesTriangle () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) IsoscelesTriangle.__proto__ = Geometry;
    IsoscelesTriangle.prototype = Object.create( Geometry && Geometry.prototype );
    IsoscelesTriangle.prototype.constructor = IsoscelesTriangle;

    IsoscelesTriangle.prototype._init = function _init (width, height) {
        this.width = width // number
        this.height = height // number

        Geometry.prototype._init.call(this)
    };

    IsoscelesTriangle.prototype._calcVerts = function _calcVerts () {
        var ref = this;
        var width = ref.width;
        var height = ref.height;

        const verts = this.verts = new Float32Array([
            -width/2, 0, 0,
            width/2, 0, 0,
            0, height, 0 ])

        const normal = [0,0,1] // pointing along Z
        const normals = this.normals = new Float32Array(verts.length)

        for (let i=0, l=verts.length; i<l; i+=3) { // 3 numbers per vertex
            normals[i+0] = normal[0]
            normals[i+1] = normal[1]
            normals[i+2] = normal[2]
        }
    };

    return IsoscelesTriangle;
}(Geometry));

var SymmetricTrapezoid = (function (Geometry) {
    function SymmetricTrapezoid () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) SymmetricTrapezoid.__proto__ = Geometry;
    SymmetricTrapezoid.prototype = Object.create( Geometry && Geometry.prototype );
    SymmetricTrapezoid.prototype.constructor = SymmetricTrapezoid;

    SymmetricTrapezoid.prototype._init = function _init (baseWidth, topWidth, height) {
        this.baseWidth = baseWidth // number
        this.topWidth = topWidth // number
        this.height = height // number

        Geometry.prototype._init.call(this)
    };

    SymmetricTrapezoid.prototype._calcVerts = function _calcVerts () {
        var ref = this;
        var baseWidth = ref.baseWidth;
        var topWidth = ref.topWidth;
        var height = ref.height;

        const verts = this.verts = new Float32Array([
            -baseWidth/2, 0, 0,
            baseWidth/2, 0, 0,
            topWidth/2, height, 0,
            topWidth/2, height, 0,
            -topWidth/2, height, 0,
            -baseWidth/2, 0, 0 ])

        const normal = [0,0,1] // pointing along Z
        const normals = this.normals = new Float32Array(verts.length)

        for (let i=0, l=verts.length; i<l; i+=3) { // 3 numbers per vertex
            normals[i+0] = normal[0]
            normals[i+1] = normal[1]
            normals[i+2] = normal[2]
        }
    };

    return SymmetricTrapezoid;
}(Geometry));

var Quad = (function (Geometry) {
    function Quad () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) Quad.__proto__ = Geometry;
    Quad.prototype = Object.create( Geometry && Geometry.prototype );
    Quad.prototype.constructor = Quad;

    Quad.prototype._init = function _init (width, height) {
        this.width = width // number
        this.height = height // number

        Geometry.prototype._init.call(this)
    };

    Quad.prototype._calcVerts = function _calcVerts () {
        var ref = this;
        var width = ref.width;
        var height = ref.height;

        const verts = this.verts = new Float32Array([
            -width/2, -height/2, 0,
            width/2, -height/2, 0,
            width/2, height/2, 0,
            width/2, height/2, 0,
            -width/2, height/2, 0,
            -width/2, -height/2, 0 ])

        const normal = [0,0,1] // pointing along Z
        const normals = this.normals = new Float32Array(verts.length)

        for (let i=0, l=verts.length; i<l; i+=3) { // 3 numbers per vertex
            normals[i+0] = normal[0]
            normals[i+1] = normal[1]
            normals[i+2] = normal[2]
        }
    };

    return Quad;
}(Geometry));

var Cube = (function (Geometry) {
    function Cube () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) Cube.__proto__ = Geometry;
    Cube.prototype = Object.create( Geometry && Geometry.prototype );
    Cube.prototype.constructor = Cube;

    Cube.prototype._init = function _init (x, y, width) {
        // the top front left corner
        this.x = x // number
        this.y = y // number
        this.width = width // number

        Geometry.prototype._init.call(this)
    };

    Cube.prototype._calcVerts = function _calcVerts () {
        var ref = this;
        var x = ref.x;
        var y = ref.y;
        var width = ref.width;

        const x2 = x + width
        const y2 = y + width

        const verts = this.verts = new Float32Array([
            // front face
            x, y, 0,
            x2, y, 0,
            x2, y2, 0,
            x2, y2, 0,
            x, y2, 0,
            x, y, 0,

            // left face
            x, y, 0,
            x, y, -width,
            x, y2, -width,
            x, y2, -width,
            x, y2, 0,
            x, y, 0,

            // right face
            x2, y, 0,
            x2, y, -width,
            x2, y2, -width,
            x2, y2, -width,
            x2, y2, 0,
            x2, y, 0,

            // back face
            x, y, -width,
            x2, y, -width,
            x2, y2, -width,
            x2, y2, -width,
            x, y2, -width,
            x, y, -width,

            // top face
            x, y, 0,
            x, y, -width,
            x2, y, -width,
            x2, y, -width,
            x2, y, 0,
            x, y, 0,

            // bottom face
            x, y2, 0,
            x, y2, -width,
            x2, y2, -width,
            x2, y2, -width,
            x2, y2, 0,
            x, y2, 0 ])

        const faceNormals = [
            [0,0,1 ], // front face
            [-1,0,0 ], // left face
            [1,0,0 ], // right face
            [0,0,-1 ], // back face
            [0,-1,0 ], // top face
            [0,1,0 ] ]

        const normals = this.normals = new Float32Array(verts.length)

        for (let side=0, i=0, l=verts.length; i<l; i+=6*3, side+=1) { // 6 vertices per side, 3 numbers per vertex normal

            // first vertex
            normals[i+0]  = faceNormals[side][0]
            normals[i+1]  = faceNormals[side][1]
            normals[i+2]  = faceNormals[side][2]

            // second vertex
            normals[i+3]  = faceNormals[side][0]
            normals[i+4]  = faceNormals[side][1]
            normals[i+5]  = faceNormals[side][2]

            // third vertex
            normals[i+6]  = faceNormals[side][0]
            normals[i+7]  = faceNormals[side][1]
            normals[i+8]  = faceNormals[side][2]

            // fourth vertex
            normals[i+9]  = faceNormals[side][0]
            normals[i+10] = faceNormals[side][1]
            normals[i+11] = faceNormals[side][2]

            // fifth vertex
            normals[i+12] = faceNormals[side][0]
            normals[i+13] = faceNormals[side][1]
            normals[i+14] = faceNormals[side][2]

            // sixth vertex
            normals[i+15] = faceNormals[side][0]
            normals[i+16] = faceNormals[side][1]
            normals[i+17] = faceNormals[side][2]
        }
    };

    return Cube;
}(Geometry));

var ThreeSidedPyramid = (function (Geometry) {
    function ThreeSidedPyramid () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) ThreeSidedPyramid.__proto__ = Geometry;
    ThreeSidedPyramid.prototype = Object.create( Geometry && Geometry.prototype );
    ThreeSidedPyramid.prototype.constructor = ThreeSidedPyramid;

    ThreeSidedPyramid.prototype._init = function _init (base, height) {
        this.base = base
        this.height = height

        Geometry.prototype._init.call(this)
    };

    ThreeSidedPyramid.prototype._calcVerts = function _calcVerts () {
        var ref = this;
        var base = ref.base;
        var height = ref.height;

        // base is hypotenuse in following calculations

        // TODO: this can be replaced with a loop that can make any-sided
        // pyramid.
        const verts = this.verts = new Float32Array([
            // base
            0, 0, 0, // bottom front left
            base, 0, 0, // bottom front right
            base/2, 0, -Math.sin(degToRad(60)) * base, // bottom back

            // front
            base, 0, 0, // bottom front right
            0, 0, 0, // bottom front left
            base/2, height, ((Math.sin(degToRad(60)) * base) / (base/2)) * (base/2), // tip top

            // back left
            0, 0, 0, // bottom front left
            base/2, 0, -Math.sin(degToRad(60)) * base, // bottom back
            base/2, height, ((Math.sin(degToRad(60)) * base) / (base/2)) * (base/2), // tip top

            // back right
            base/2, 0, -Math.sin(degToRad(60)) * base, // bottom back
            base, 0, 0, // bottom front right
            base/2, height, ((Math.sin(degToRad(60)) * base) / (base/2)) * (base/2) ])

        // TODO: normals
    };

    return ThreeSidedPyramid;
}(Geometry));

var FourSidedPyramid = (function (Geometry) {
    function FourSidedPyramid () {
        Geometry.apply(this, arguments);
    }

    if ( Geometry ) FourSidedPyramid.__proto__ = Geometry;
    FourSidedPyramid.prototype = Object.create( Geometry && Geometry.prototype );
    FourSidedPyramid.prototype.constructor = FourSidedPyramid;

    FourSidedPyramid.prototype._init = function _init () {
        Geometry.prototype._init.call(this)
    };

    FourSidedPyramid.prototype._calcVerts = function _calcVerts () {
        this.verts = new Float32Array([
            -100 ,0.087303 ,-100
            ,100 ,0.087303 ,-100
            ,100 ,0.087303 ,100
            ,-100 ,0.087303 ,100
            ,100 ,0.087303 ,100
            ,100 ,0.087303 ,-100
            ,0 ,200.087 ,0
            ,100 ,0.087303 ,-100
            ,-100 ,0.087303 ,-100
            ,0 ,200.087 ,0
            ,-100 ,0.087303 ,-100
            ,-100 ,0.087303 ,100
            ,0 ,200.087 ,0
            ,-100 ,0.087303 ,100
            ,100 ,0.087303 ,100
            ,0 ,200.087 ,0
        ])

        this.normals = new Float32Array([
            0 ,-1 ,0
            ,0 ,-1 ,0
            ,0 ,-1 ,0
            ,0 ,-1 ,0
            ,0.894427 ,0.447214 ,0
            ,0.894427 ,0.447214 ,0
            ,0.894427 ,0.447214 ,0
            ,0 ,0.447214 ,-0.894427
            ,0 ,0.447214 ,-0.894427
            ,0 ,0.447214 ,-0.894427
            ,-0.894427 ,0.447214 ,0
            ,-0.894427 ,0.447214 ,0
            ,-0.894427 ,0.447214 ,0
            ,0 ,0.447214 ,0.894427
            ,0 ,0.447214 ,0.894427
            ,0 ,0.447214 ,0.894427
        ])
    };

    return FourSidedPyramid;
}(Geometry));

const m3 = {
    identity: Object.freeze([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1 ]),

    translation: function translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1 ]
    },

    rotation: function rotation(angleInRadians) {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1 ]
    },

    scaling: function scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1 ]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection: function projection(width, height) {
        // longer version, multiple matrices
        let matrix = m3.identity
        matrix = m3.multiply(m3.scaling(1/width, 1/height), matrix) // get the portion of clip space
        matrix = m3.multiply(m3.scaling(2, 2), matrix) // convert to clip space units
        matrix = m3.multiply(m3.translation(-1, -1), matrix) // Move from the center to bottom left
        matrix = m3.multiply(m3.scaling(1, -1), matrix) // move to the top left like DOM
        return matrix

        // shorter version, manual result of the longer version
        //return [
            //2 / width,        0,           0,
                //0,       -2 / height,      0,
               //-1,            1,           1
        //]
    },

    multiply: function multiply(a, b) {
        const a00 = a[0]
        const a01 = a[1]
        const a02 = a[2]
        const a10 = a[3]
        const a11 = a[4]
        const a12 = a[5]
        const a20 = a[6]
        const a21 = a[7]
        const a22 = a[8]
        const b00 = b[0]
        const b01 = b[1]
        const b02 = b[2]
        const b10 = b[3]
        const b11 = b[4]
        const b12 = b[5]
        const b20 = b[6]
        const b21 = b[7]
        const b22 = b[8]

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22 ]
    },
}

const m4 = {
    identity: Object.freeze([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1 ]),

    translation: function translation(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1 ]
    },

    xRotation: function xRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            1,  0, 0, 0,
            0,  c, s, 0,
            0, -s, c, 0,
            0,  0, 0, 1 ]
    },

    yRotation: function yRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            c, 0, -s, 0,
            0, 1,  0, 0,
            s, 0,  c, 0,
            0, 0,  0, 1 ]
    },

    zRotation: function zRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [
            c,-s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ]
    },

    scaling: function scaling(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0,  sy, 0,  0,
            0,  0,  sz, 0,
            0,  0,  0,  1 ]
    },

    inverse: function inverse(m) {
        const m00 = m[0 * 4 + 0]
        const m01 = m[0 * 4 + 1]
        const m02 = m[0 * 4 + 2]
        const m03 = m[0 * 4 + 3]
        const m10 = m[1 * 4 + 0]
        const m11 = m[1 * 4 + 1]
        const m12 = m[1 * 4 + 2]
        const m13 = m[1 * 4 + 3]
        const m20 = m[2 * 4 + 0]
        const m21 = m[2 * 4 + 1]
        const m22 = m[2 * 4 + 2]
        const m23 = m[2 * 4 + 3]
        const m30 = m[3 * 4 + 0]
        const m31 = m[3 * 4 + 1]
        const m32 = m[3 * 4 + 2]
        const m33 = m[3 * 4 + 3]
        const tmp_0  = m22 * m33
        const tmp_1  = m32 * m23
        const tmp_2  = m12 * m33
        const tmp_3  = m32 * m13
        const tmp_4  = m12 * m23
        const tmp_5  = m22 * m13
        const tmp_6  = m02 * m33
        const tmp_7  = m32 * m03
        const tmp_8  = m02 * m23
        const tmp_9  = m22 * m03
        const tmp_10 = m02 * m13
        const tmp_11 = m12 * m03
        const tmp_12 = m20 * m31
        const tmp_13 = m30 * m21
        const tmp_14 = m10 * m31
        const tmp_15 = m30 * m11
        const tmp_16 = m10 * m21
        const tmp_17 = m20 * m11
        const tmp_18 = m00 * m31
        const tmp_19 = m30 * m01
        const tmp_20 = m00 * m21
        const tmp_21 = m20 * m01
        const tmp_22 = m00 * m11
        const tmp_23 = m10 * m01

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]
    },

    transpose: function transpose(m) {
        return [
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15] ]
    },


    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection: function projection(width, height, depth) {
        // longer version, multiple matrices
        //let matrix = m4.identity
        //matrix = m4.multiply(m4.scaling(1/width, 1/height, 1/depth), matrix) // get the portion of clip space
        //matrix = m4.multiply(m4.scaling(2, 2, 2), matrix) // convert to clip space units
        //matrix = m4.multiply(m4.translation(-1, -1, 0), matrix) // Move from the center to bottom left
        //matrix = m4.multiply(m4.scaling(1, -1, 1), matrix) // move to the top left like DOM
        //return matrix

        // shorter version, manual result of the longer version
        return [
            2 / width, 0,           0,         0,
            0,         -2 / height, 0,         0,
            0,         0,           2 / depth, 0,
            -1,        1,           0,         1 ]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    orthographic: function orthographic(left, right, top, bottom, near, far) {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1 ]
    },

    perspective: function perspective(fieldOfViewInDegrees, aspect, near, far) {
        const fieldOfViewInRadians = degToRad(fieldOfViewInDegrees)
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
        const rangeInv = 1.0 / (near - far)

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]
    },

    lookAt: function lookAt(cameraPosition, target, up) {
        const zAxis = v3.normalize(v3.subtract(cameraPosition, target));
        const xAxis = v3.cross(up, zAxis);
        const yAxis = v3.cross(zAxis, xAxis);

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0], cameraPosition[1], cameraPosition[2], 1 ];
    },

    multiply: function multiply(a, b) {
        const a00 = a[0 * 4 + 0]
        const a01 = a[0 * 4 + 1]
        const a02 = a[0 * 4 + 2]
        const a03 = a[0 * 4 + 3]
        const a10 = a[1 * 4 + 0]
        const a11 = a[1 * 4 + 1]
        const a12 = a[1 * 4 + 2]
        const a13 = a[1 * 4 + 3]
        const a20 = a[2 * 4 + 0]
        const a21 = a[2 * 4 + 1]
        const a22 = a[2 * 4 + 2]
        const a23 = a[2 * 4 + 3]
        const a30 = a[3 * 4 + 0]
        const a31 = a[3 * 4 + 1]
        const a32 = a[3 * 4 + 2]
        const a33 = a[3 * 4 + 3]
        const b00 = b[0 * 4 + 0]
        const b01 = b[0 * 4 + 1]
        const b02 = b[0 * 4 + 2]
        const b03 = b[0 * 4 + 3]
        const b10 = b[1 * 4 + 0]
        const b11 = b[1 * 4 + 1]
        const b12 = b[1 * 4 + 2]
        const b13 = b[1 * 4 + 3]
        const b20 = b[2 * 4 + 0]
        const b21 = b[2 * 4 + 1]
        const b22 = b[2 * 4 + 2]
        const b23 = b[2 * 4 + 3]
        const b30 = b[3 * 4 + 0]
        const b31 = b[3 * 4 + 1]
        const b32 = b[3 * 4 + 2]
        const b33 = b[3 * 4 + 3]

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33 ]
    },
}

function degToRad(degrees) {
    return degrees * Math.PI / 180
}

const vertShaderSource = "\n    attribute vec4 a_vertexPosition;\n    uniform mat4 u_worldViewProjectionMatrix;\n\n    // TODO: awaiting on transpose() method for DOMMatrix\n    //uniform mat4 u_worldInverseTransposeMatrix; // used for correct lighting normals\n\n    attribute vec4 a_color;\n    varying vec4 v_fragColor;\n\n    attribute vec3 a_normal;\n    varying vec3 v_vertNormal;\n\n    uniform mat4 u_worldMatrix;\n\n    uniform vec3 u_lightWorldPosition;\n    varying vec3 v_surfaceToLightVector;\n\n    uniform vec3 u_cameraWorldPosition;\n    varying vec3 v_surfaceToCameraVector;\n\n    attribute vec2 a_textureCoordinate;\n    varying vec2 v_textureCoordinate;\n\n    void main() {\n        vec3 surfaceWorldPosition = (u_worldMatrix * a_vertexPosition).xyz;\n\n        // compute the vector of the surface to the pointLight\n        // and pass it to the fragment shader\n        v_surfaceToLightVector = u_lightWorldPosition - surfaceWorldPosition;\n\n        // compute the vector of the surface to the camera\n        // and pass it to the fragment shader\n        v_surfaceToCameraVector = u_cameraWorldPosition - surfaceWorldPosition;\n\n        gl_Position = u_worldViewProjectionMatrix * a_vertexPosition;\n\n        v_fragColor = a_color;\n        //v_fragColor = gl_Position * 0.5 + 0.5;\n\n        // orient the normals and pass to the fragment shader\n        //v_vertNormal = mat3(u_worldInverseTransposeMatrix) * a_normal; // TODO waiting for transpose() method on DOMMatrix\n        //alternate: v_vertNormal = (u_worldInverseTransposeMatrix * vec4(a_normal, 0)).xyz;\n        v_vertNormal = mat3(u_worldMatrix) * a_normal;\n\n        v_textureCoordinate = a_textureCoordinate;\n    }\n"

const fragShaderSource = "\n    // TODO: detect highp support, see\n    // https://github.com/greggman/webgl-fundamentals/issues/80#issuecomment-306746556\n    //precision mediump float;\n    precision highp float;\n\n    varying vec4 v_fragColor;\n    varying vec3 v_vertNormal;\n\n    varying vec3 v_surfaceToLightVector;\n\n    //// TODO: use this for directional lighting (f.e. sunlight or moonlight).\n    //uniform vec3 reverseLightDirection;\n\n    varying vec3 v_surfaceToCameraVector;\n\n    uniform float u_shininess;\n    uniform vec3 u_lightColor;\n    uniform vec3 u_specularColor;\n\n    varying vec2 v_textureCoordinate;\n    uniform sampler2D u_texture;\n    uniform bool u_hasTexture;\n\n    void main(void) {\n\n        // because v_vertNormal is a varying it's interpolated\n        // so it will not be a unit vector. Normalizing it\n        // will make it a unit vector again.\n        vec3 normal = normalize(v_vertNormal);\n\n        vec3 surfaceToCameraDirection = normalize(v_surfaceToCameraVector);\n\n        vec3 surfaceToLightDirection = normalize(v_surfaceToLightVector);\n\n        // represents the unit vector oriented at half of the angle between\n        // surfaceToLightDirection and surfaceToCameraDirection.\n        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);\n\n        float pointLight = dot(normal, surfaceToLightDirection);\n        float pointLightIntensity = 1.0; // TODO make configurable\n        //float directionalLight = dot(normal, reverseLightDirection); // TODO make configurable\n\n        //float specular = dot(normal, halfVector);\n        float specular = 0.0;\n        if (pointLight > 0.0) {\n            specular = pow(dot(normal, halfVector), u_shininess);\n        }\n\n        // TODO make configurable\n        //vec3 ambientLight = vec3(0.361, 0.184, 0.737); // teal\n        vec3 ambientLight = vec3(1.0, 1.0, 1.0); // white\n        float ambientLightIntensity = 0.3;\n\n        // TODO: user can choose color or texture, default to a color if no texture, etc.\n        // TODO: blend texture on top of color, if texture has alpha.\n        gl_FragColor = v_fragColor;\n        if (u_hasTexture) {\n            gl_FragColor = texture2D(u_texture, v_textureCoordinate);\n        }\n\n        // Lets multiply just the color portion (not the alpha) of\n        // gl_FragColor by the pointLight + directionalLight\n        //gl_FragColor.rgb *= pointLight * u_lightColor; // point light only.\n        //gl_FragColor.rgb *= directionalLight; // directional light only.\n        //gl_FragColor.rgb *= ambientLight; // ambient light only.\n        gl_FragColor.rgb *=\n            //clamp(directionalLight, 0.0, 1.0) +\n            clamp(pointLight, 0.0, 1.0) * u_lightColor * pointLightIntensity +\n            ambientLight * ambientLightIntensity;\n\n        // Just add in the specular\n        gl_FragColor.rgb += specular * u_specularColor;\n\n        //gl_FragColor.a = 0.5;\n    }\n"

// CONCATENATED MODULE: ./src/core/WebGLRenderer.js


const updateResolution = function (state) {
    const resolution = [
        parseFloat(getComputedStyle(state.gl.canvas).width) * window.devicePixelRatio,
        parseFloat(getComputedStyle(state.gl.canvas).height) * window.devicePixelRatio,
        1000 ]

    setGlResolution.apply(void 0, [ state.gl ].concat( resolution ))
    state.projectionMatrix = m4.perspective(45, resolution[0] / resolution[1], 1, 2000)
}

var WebGlRenderer = function WebGlRenderer () {};

WebGlRenderer.prototype.initGl = function initGl (scene) {
    const gl = createWebGLContext(scene)
    const state = scene.webGlRendererState
    state.gl = gl

    if (!gl) { console.log('You need WebGL.') }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource)
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
    const program = createProgram(gl, vertShader, fragShader)
    gl.useProgram(program)


    state.colorsBuffer = gl.createBuffer()
    state.colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
    gl.enableVertexAttribArray(state.colorAttributeLocation)

    state.vertexBuffer = gl.createBuffer()
    state.vertexAttributeLocation = gl.getAttribLocation(program, "a_vertexPosition")
    gl.enableVertexAttribArray(state.vertexAttributeLocation)

    state.normalsBuffer = gl.createBuffer()
    state.normalAttributeLocation = gl.getAttribLocation(program, 'a_normal')
    gl.enableVertexAttribArray(state.normalAttributeLocation)

    state.textureCoordinatesBuffer = gl.createBuffer()
    state.textureCoordinateLocation = gl.getAttribLocation(program, 'a_textureCoordinate')

    // cull_face doesn't work, because I've drawn my vertices in the wrong
    // order. They should be clockwise to be front facing (I seem to have done
    // them counter-clockwise). See "CULL_FACE" at
    // https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
    //gl.enable(gl.CULL_FACE)

    // enables depth sorting, so pixels aren't drawn in order of appearance, but order only if they are visible (on top of other pixels).
    gl.enable(gl.DEPTH_TEST)

    // enable alpha blending (transparency)
    // XXX: For blending (transparency) to work, we have to disable depth testing.
    // TODO: Maybe we have to selectively enable depth testing and disable
    // blending, or vice versa, depending on the object we want to draw...
    // ...Or perhaps we must draw things in a certain order, from back to front,
    // so we can have depth testing AND blending at the same time.
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.enable(gl.BLEND)
    //gl.disable(gl.DEPTH_TEST)

    state.projectionMatrix = m4.identity

    updateResolution(state)
    scene.on('parentsizechange', function () { return updateResolution(state); })

    state.worldViewProjectionMatrixLocation = gl.getUniformLocation(program, 'u_worldViewProjectionMatrix')
    //const worldInverseTransposeMatrixLocation = gl.getUniformLocation(program, 'u_worldInverseTransposeMatrix')
    state.worldMatrixLocation = gl.getUniformLocation(program, 'u_worldMatrix')
    //const reverseLightDirectionLocation = gl.getUniformLocation(program, 'reverseLightDirection')
    //gl.uniform3fv(reverseLightDirectionLocation, v3.normalize([0.5, 0.7, 1]))
    state.lightWorldPositionLocation = gl.getUniformLocation(program, 'u_lightWorldPosition')
    state.cameraWorldPositionLocation = gl.getUniformLocation(program, 'u_cameraWorldPosition')
    const shininessLocation = gl.getUniformLocation(program, 'u_shininess')
    const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
    const specularColorLocation = gl.getUniformLocation(program, 'u_specularColor')
    state.textureLocation = gl.getUniformLocation(program, 'u_texture')
    state.hasTextureLocation = gl.getUniformLocation(program, 'u_hasTexture')

    let shininess = 200
    gl.uniform1f(shininessLocation, shininess)

    const red = [1, 0.6, 0.6]
    const white = [1, 1, 1]

    let lightColor = white
    gl.uniform3fv(lightColorLocation, v3.normalize(lightColor))

    let specularColor = white
    gl.uniform3fv(specularColorLocation, v3.normalize(specularColor))


    state.lightAnimParam = 0
    state.lightWorldPosition = [20,30,50]
    state.cameraAngle = 0
    state.cameraRadius   = 200
};

WebGlRenderer.prototype.drawScene = function drawScene (scene) {
        var this$1 = this;

    const state = scene.webGlRendererState
    var gl = state.gl;

    // TODO: light does not affect the back side of polygons?...
    state.lightAnimParam += 0.05
    state.lightWorldPosition = [
        300*Math.sin(state.lightAnimParam),
        300*Math.sin(state.lightAnimParam*2),

        Math.abs(300*Math.cos(state.lightAnimParam))
        //300
    ]

    gl.uniform3fv(state.lightWorldPositionLocation, state.lightWorldPosition)

    let backgroundColor = scene.getAttribute('background')

    if (typeof backgroundColor == 'string')
        { backgroundColor = backgroundColor.split(' ').map(function (rgbPart) { return parseFloat(rgbPart); }) }
    else
        { backgroundColor = [0, 0, 0, 0] }

    gl.clearColor.apply(gl, backgroundColor)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // why do we need to do this?

    //state.cameraAngle++
    let cameraMatrix  = m4.identity
    cameraMatrix  = m4.multiply(cameraMatrix, m4.yRotation(state.cameraAngle))
    cameraMatrix  = m4.multiply(cameraMatrix, m4.translation(0, 0, state.cameraRadius * 1.5))
    const viewMatrix  = m4.inverse(cameraMatrix)

    state.viewProjectionMatrix = m4.multiply(state.projectionMatrix, viewMatrix)

    const cameraWorldPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]
    gl.uniform3fv(state.cameraWorldPositionLocation, cameraWorldPosition)

    // TODO: we need to use the traversal that takes into consideration ShadowDOM.
    const children = scene.imperativeCounterpart._children
    for (let i=0, l=children.length; i<l; i+=1) {
        this$1.drawNodeAndRecurse(state, children[i])
    }
};

WebGlRenderer.prototype.drawNodeAndRecurse = function drawNodeAndRecurse (state, node) {
        var this$1 = this;

    var gl = state.gl;

    const meshAttr = node.element.getAttribute('mesh')

    if (meshAttr) {
        const size = node._calculatedSize

        const svgElement = Array.from(node.element.children)
            .find(function (child) { return child instanceof SVGSVGElement; })

        const hasTexture = !!svgElement

        if (meshAttr == 'cube') {
            if (!(node.__shape instanceof Cube))
                { node.__shape = new Cube(0, 0, size.x) }
            // TODO else, like quad or symtrap
        }
        else if (meshAttr == 'quad') {
            if (!(node.__shape instanceof Quad))
                { node.__shape = new Quad(size.x, size.y) }
            else {
                node.__shape.width = size.x
                node.__shape.height = size.y
                node.__shape._calcVerts()
            }

            if (hasTexture) {

                // TODO we would create one per Geometry (and eventually multiple per
                // geometry), but for now just one texture for all quads to get it working.
                // TODO Make the texture only once, not each tick.
                if (!node.__texture) {

                    // XXX this will eventually be set with a texture map feature
                    // TODO: for now, we should at least set default
                    // coordinates for each geometry, even if that's not
                    // ideal; it's more ideal than nothing.
                    node.__shape.textureCoordinates = new Float32Array([
                        0, 0,
                        1, 0,
                        1, 1,
                        1, 1,
                        0, 1,
                        0, 0 ])

                    node.__texture = gl.createTexture()
                }

                ///// SVG TEXTURE FROM TWO.JS {
                if (!node.__two) {
                    node.__two = new Two({
                        type: Two.Types.webgl,
                        fullscreen: false,
                        autostart: false,
                    })

                    node.__two.interpret(svgElement)
                }

                node.__two.update()

                const image = node.__two.renderer.domElement
                const isPowerOf2 = function (value) { return (value & (value - 1)) == 0; }

                // copy the pixi canvas image to the texture.
                gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                // TODO: unbind from buffers and textures when done
                // using them, to prevent modification from outside

                // Mip maps can only be generated on images whose width and height are a power of 2.
                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D)
                    // TODO make filters configurable?
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                    // Using just NEAREST or LINEAR only can increase performance, for example.
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                    // TODO make filters configurable?
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                }
                ///// }

                ///// SVG TEXTURE FROM PIXI-SVG {
                //if (!node.__pixiRenderer) {
                    //node.__pixiRenderer = PIXI.autoDetectRenderer({

                        //width: node._calculatedSize.x * window.devicePixelRatio,
                        //height: node._calculatedSize.y * window.devicePixelRatio,
                        ////width: 300 * window.devicePixelRatio,
                        ////height: 300 * window.devicePixelRatio,

                        //resolution: window.devicePixelRatio,
                    //});

                    //node.__pixiStage = new PIXI.Container()
                    //window.stage = node.__pixiStage
                //}

                //node.__pixiStage.removeChild(node.__svgGraphic)

                //node.__svgGraphic = new SVG(svgElement)

                //node.__pixiStage.addChild(node.__svgGraphic)

                //node.__pixiRenderer.render(node.__pixiStage);

                //const image = node.__pixiRenderer.view
                //const isPowerOf2 = value => (value & (value - 1)) == 0

                //// copy the pixi canvas image to the texture.
                //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                //// TODO: unbind from buffers and textures when done
                //// using them, to prevent modification from outside

                //// Mip maps can only be generated on images whose width and height are a power of 2.
                //if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    //gl.generateMipmap(gl.TEXTURE_2D)
                    //// TODO make filters configurable?
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                    //// Using just NEAREST or LINEAR only can increase performance, for example.
                    ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                //}
                //else {
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                    //// TODO make filters configurable?
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                //}

                ///// }

                ///// PRE-DEFINED TEXTURE FROM IMAGE {

                //// set a temporary solid color texture for the meantime
                //// while the following texture loads.
                //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                //// Fill the texture with a 1x1 blue pixel to start with.
                //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
                //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                //const image = new Image
                //const isPowerOf2 = value => (value & (value - 1)) == 0
                //image.addEventListener('load', () => {
                    //// Now that the image has loaded copy it to the texture.
                    //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                    //// TODO: unbind from buffers and textures when done
                    //// using them, to prevent modification from outside

                    //// Mip maps can only be generated on images whose width and height are a power of 2.
                    //if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                        //gl.generateMipmap(gl.TEXTURE_2D)
                        //// TODO make filters configurable?
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                        //// Using just NEAREST or LINEAR only can increase performance, for example.
                        ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    //}
                    //else {
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                        //// TODO make filters configurable?
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    //}
                //})
                //image.src = imageUrl // imageUrl should be a data URL
                //// }
            }
        }
        else if (meshAttr == 'isotriangle') {
            if (!(node.__shape instanceof IsoscelesTriangle))
                { node.__shape = new IsoscelesTriangle(size.x, size.y) }
            // TODO else, like quad or symtrap
        }
        else if (meshAttr == 'pyramid4') {
            if (!(node.__shape instanceof FourSidedPyramid))
                { node.__shape = new FourSidedPyramid(size.x, size.y) }
            // TODO else, like quad or symtrap
        }
        else if (meshAttr == 'symtrap') {
            if (!(node.__shape instanceof SymmetricTrapezoid))
                { node.__shape = new SymmetricTrapezoid(size.x/2, size.x, size.y) }
            else {
                node.__shape.baseWidth = size.x/2
                node.__shape.topWidth = size.x
                node.__shape.height = size.y
                node.__shape._calcVerts()
            }
        }
        //else node.__shape = null
        else {
            if (!(node.__shape instanceof Quad))
                { node.__shape = new Quad(size.x, size.y) }
            else {
                node.__shape.width = size.x
                node.__shape.height = size.y
                node.__shape._calcVerts()
            }
            // TODO this will eventually be set with a texture map feature
            if (hasTexture) {
                node.__shape.textureCoordinates = new Float32Array([
                    0, 0,
                    1, 0,
                    1, 1,
                    1, 1,
                    0, 1,
                    0, 0 ])
            }
        }

        if (node.__shape) {
            // COLORS /////////////////////////////////
            node.__shape.color = node.element.getAttribute('color')

            gl.bindBuffer(gl.ARRAY_BUFFER, state.colorsBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, node.__shape._colors, gl.STATIC_DRAW)

            // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
            const colorSize = 4      // components per iteration
            const colorType = gl.FLOAT
            const normalizeColorData = false // don't normalize the data
            const colorStride = 0    // 0 = move forward colorSize * sizeof(colorType) each iteration to get the next vertex
            const colorOffset = 0    // start at the beginning of the buffer
            gl.vertexAttribPointer(
                state.colorAttributeLocation, colorSize, colorType, normalizeColorData, colorStride, colorOffset)

            // VERTICES /////////////////////////////////
            gl.bindBuffer(gl.ARRAY_BUFFER, state.vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, node.__shape.verts, gl.STATIC_DRAW)

            // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
            const vertexSize = 3      // components per iteration
            const type = gl.FLOAT
            const normalizeVertexData = false // don't normalize the data
            const stride = 0    // 0 = move forward vertexSize * sizeof(type) each iteration to get the next vertex
            const offset = 0    // start at the beginning of the buffer
            gl.vertexAttribPointer(
                state.vertexAttributeLocation, vertexSize, type, normalizeVertexData, stride, offset)

            // NORMALS /////////////////////////////////
            gl.bindBuffer(gl.ARRAY_BUFFER, state.normalsBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, node.__shape.normals, gl.STATIC_DRAW)

            // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
            const normalSize = 3      // components per iteration
            const normalType = gl.FLOAT
            const normalizeNormalsData = false // don't normalize the data
            const normalStride = 0    // 0 = move forward normalSize * sizeof(normalType) each iteration to get the next vertex
            const normalOffset = 0    // start at the beginning of the buffer
            gl.vertexAttribPointer(
                state.normalAttributeLocation, normalSize, normalType, normalizeNormalsData, normalStride, normalOffset)

            // TEXTURE COORDINATES /////////////////////////////////
            if (hasTexture) {
                gl.uniform1i(state.hasTextureLocation, +true)

                gl.bindBuffer(gl.ARRAY_BUFFER, state.textureCoordinatesBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.textureCoordinates, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const textureCoordinateSize = 2      // components per iteration
                const textureCoordinateType = gl.FLOAT
                const normalizeTextureCoordinateData = false // don't normalize the data
                const textureCoordinateStride = 0    // 0 = move forward textureCoordinateSize * sizeof(textureCoordinateType) each iteration to get the next vertex
                const textureCoordinateOffset = 0    // start at the beginning of the buffer
                gl.enableVertexAttribArray(state.textureCoordinateLocation)
                gl.vertexAttribPointer(
                    state.textureCoordinateLocation, textureCoordinateSize, textureCoordinateType, normalizeTextureCoordinateData, textureCoordinateStride, textureCoordinateOffset)

                // Tell the shader to use texture unit 0 for u_texture
                // TODO: Get index of the node's texture, but right now there's only one texture.
                gl.uniform1i(state.textureLocation, 0)
            }
            else {
                gl.uniform1i(state.hasTextureLocation, +false)
                gl.disableVertexAttribArray(state.textureCoordinateLocation)
            }

            // TRANFORMS /////////////////////////////////
            gl.uniformMatrix4fv(state.worldMatrixLocation, false, node._worldMatrix.toFloat32Array())

            // for correct lighting normals
            // TODO: waiting for transpose() method on DOMMatrix
            //const worldInverseTransposeMatrix = m4.transpose(m4.inverse(node._worldMatrix))
            //gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix)

            const worldViewProjectionMatrix = m4.multiply(state.viewProjectionMatrix, node._worldMatrix.toFloat32Array())
            gl.uniformMatrix4fv(state.worldViewProjectionMatrixLocation, false, worldViewProjectionMatrix)

            const count = node.__shape.verts.length / 3
            gl.drawArrays(gl.TRIANGLES, offset, count)
        }
    }

    const children = node._children
    for (let i=0, l=children.length; i<l; i+=1) {
        this$1.drawNodeAndRecurse(state, children[i])
    }
};

let instance = null

function getWebGlRenderer() {
    if (instance) { return instance }
    else { return instance = new WebGlRenderer }
}

// CONCATENATED MODULE: ./src/core/Motor.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_awaitbox_dom_documentReady__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_awaitbox_dom_documentReady___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_awaitbox_dom_documentReady__);






let documentIsReady = false
let webGLRenderer = null

var Motor = function Motor() {
    this._inFrame = false // true when inside a requested animation frame.
    this._rAF = null // the current animation frame, or null.
    this._animationLoopStarted = false
    this._allRenderTasks = []
    this._taskIterationIndex = 0
    this._numberOfTasks = 0
    this._nodesToBeRendered = []
    this._modifiedScenes = []

    // A set of nodes that are the root nodes of subtrees where all nodes
    // in each subtree need to have their world matrices updated.
    this._worldMatrixRootNodes = []
};

/**
 * Starts an rAF loop and runs the render tasks in the _renderTasks stack.
 * As long as there are tasks in the stack, the loop continues. When the
 * stack becomes empty due to removal of tasks, the rAF stops and the app
 * sits there doing nothing -- silence, crickets.
 */
Motor.prototype._startAnimationLoop = function _startAnimationLoop () {
        var this$1 = this;

    if (this._animationLoopStarted) { return Promise.resolve() }

    this._animationLoopStarted = true

    const logic = function () {
        // DIRECT ANIMATION LOOP ///////////////////////////////////
        // So now we can render after the scene is mounted.
        const motorLoop = function (timestamp) {
            this$1._inFrame = true

            this$1._runRenderTasks(timestamp)
            this$1._renderNodes(timestamp)

            // If any tasks are left to run, continue the animation loop.
            if (this$1._allRenderTasks.length)
                { this$1._rAF = requestAnimationFrame(motorLoop) }
            else {
                this$1._rAF = null
                this$1._animationLoopStarted = false
            }

            this$1._inFrame = false
        }

        this$1._rAF = requestAnimationFrame(motorLoop)
    }

    if (!documentIsReady) {
        return __WEBPACK_IMPORTED_MODULE_0_awaitbox_dom_documentReady___default()().then(function () {
            documentIsReady = true
            logic()
        })
    }

    logic()
    return Promise.resolve()
};
//async _startAnimationLoop() {
    //if (this._animationLoopStarted) return

    //this._animationLoopStarted = true

    //if (!documentIsReady) {
        //await documentReady()
        //documentIsReady = true
    //}

    //// DIRECT ANIMATION LOOP ///////////////////////////////////
    //// So now we can render after the scene is mounted.
    //const motorLoop = timestamp => {
        //this._inFrame = true

        //this._runRenderTasks(timestamp)
        //this._renderNodes(timestamp)

        //// If any tasks are left to run, continue the animation loop.
        //if (this._allRenderTasks.length)
            //this._rAF = requestAnimationFrame(motorLoop)
        //else {
            //this._rAF = null
            //this._animationLoopStarted = false
        //}

        //this._inFrame = false
    //}

    //this._rAF = requestAnimationFrame(motorLoop)

    //// ANIMATION LOOP USING WHILE AND AWAIT ///////////////////////////////////
    ////this._rAF = true
    ////let timestamp = null
    ////while (this._rAF) {
        ////timestamp = await animationFrame()
        ////this._inFrame = true

        ////this._runRenderTasks(timestamp)
        ////this._renderNodes(timestamp)

        ////// If any tasks are left to run, continue the animation loop.
        ////if (!this._allRenderTasks.length) {
            ////this._rAF = null
            ////this._animationLoopStarted = false
        ////}

        ////this._inFrame = false
    ////}
//}

/**
 * When a render tasks is added a new rAF loop will be started if there
 * isn't one currently.
 *
 * A render task is simply a function that will be called over and over
 * again, in the Motor's animation loop. That's all, nothing special.
 * However, if a Node setter is used inside of a render task, then the Node
 * will tell Motor that it needs to be re-rendered, which will happen at
 * the end of the current frame. If a Node setter is used outside of a
 * render task (i.e. outside of the Motor's animation loop), then the Node
 * tells Motor to re-render the Node on the next animation loop tick.
 * Basically, regardless of where the Node's setters are used (inside or
 * outside of the Motor's animation loop), rendering always happens inside
 * the loop.
 *
 * @param {Function} fn The render task to add.
 * @return {Function} A reference to the render task. Useful for saving to
 * a variable so that it can later be passed to Motor.removeRenderTask().
 */
Motor.prototype.addRenderTask = function addRenderTask (fn) {
    if (typeof fn != 'function')
        { throw new Error('Render task must be a function.') }

    if (this._allRenderTasks.includes(fn)) { return }

    this._allRenderTasks.push(fn)
    this._numberOfTasks += 1

    // If the render loop isn't started, start it.
    if (!this._animationLoopStarted)
        { this._startAnimationLoop() }

    return fn
};

Motor.prototype.removeRenderTask = function removeRenderTask (fn) {
    const taskIndex = this._allRenderTasks.indexOf(fn)

    if (taskIndex == -1) { return }

    this._allRenderTasks.splice(taskIndex, 1)
    this._numberOfTasks -= 1
    this._taskIterationIndex -= 1
};

Motor.prototype._runRenderTasks = function _runRenderTasks (timestamp) {
        var this$1 = this;

    for (this._taskIterationIndex = 0; this._taskIterationIndex < this._numberOfTasks; this._taskIterationIndex += 1) {
        const task = this$1._allRenderTasks[this$1._taskIterationIndex]

        if (task(timestamp) === false)
            { this$1.removeRenderTask(task) }
    }
};

Motor.prototype._setNodeToBeRendered = function _setNodeToBeRendered (node) {
    if (this._nodesToBeRendered.includes(node)) { return }
    this._nodesToBeRendered.push(node)
    if (!this._inFrame) { this._startAnimationLoop() }
};

Motor.prototype._renderNodes = function _renderNodes (timestamp) {
        var this$1 = this;

    if (!this._nodesToBeRendered.length) { return }

    for (let i=0, l=this._nodesToBeRendered.length; i<l; i+=1) {
        const node = this$1._nodesToBeRendered[i]

        node._render(timestamp)

        // If the node is root of a subtree containing updated nodes and
        // has no ancestors that were modified, then add it to the
        // _worldMatrixRootNodes set so we can update the world matrices of
        // all the nodes in the root node's subtree.
        if (
            // a node could be a Scene, which is not Transformable
            node instanceof Transformable_Transformable &&

            // and if ancestor is not instanceof Transformable, f.e.
            // `false` if there is no ancestor to be rendered, or Sizeable
            // if the Scene is returned.
            !(node._getAncestorToBeRendered() instanceof Transformable_Transformable) &&

            // and the node isn't already added.
            !this$1._worldMatrixRootNodes.includes(node)
        ) {
            this$1._worldMatrixRootNodes.push(node)
        }

        // keep track of which scenes are modified so we can render webgl
        // only for those scenes.
        // TODO FIXME: at this point, a node should always have a scene,
        // otherwise it should not ever be rendered here, but turns out
        // some nodes are getting into this queue without a scene. We
        // shouldn't need the conditional check for node._scene, and it
        // will save CPU by not allowing the code to get here in that case.
        if (node._scene && !this$1._modifiedScenes.includes(node._scene))
            { this$1._modifiedScenes.push(node._scene) }
    }

    // Update world matrices of the subtrees.
    const worldMatrixRootNodes = this._worldMatrixRootNodes
    for (let i=0, l=worldMatrixRootNodes.length; i<l; i+=1) {
        const subtreeRoot = worldMatrixRootNodes[i]
        subtreeRoot._calculateWorldMatricesInSubtree()
    }
    worldMatrixRootNodes.length = 0

    // render webgl of modified scenes.
    const modifiedScenes = this._modifiedScenes
    // TODO PERFORMANCE: store a list of webgl-enabled modified scenes, and
    // iterate only through those so we don't iterate over non-webgl
    // scenes.
    for (let i=0, l=modifiedScenes.length; i<l; i+=1) {
        const sceneElement = modifiedScenes[i].element
        // TODO we're temporarily storing stuff on the .element, but we
        // don't want that, we will move it to WebGLRenderer.
        if (
            sceneElement.webglEnabled &&
            ( webGLRenderer || (webGLRenderer = getWebGlRenderer()) ) // only ever call getWebGlRenderer once
        )
            { webGLRenderer.drawScene(sceneElement) }
    }
    modifiedScenes.length = 0

    const nodesToBeRendered = this._nodesToBeRendered
    for (let i=0, l=nodesToBeRendered.length; i<l; i+=1) {
        nodesToBeRendered[i]._willBeRendered = false
    }
    nodesToBeRendered.length = 0
};

// export a singleton instance rather than the class directly.
/* harmony default export */ var Motor_defaultExport = (new Motor);

// CONCATENATED MODULE: ./src/core/Sizeable.js






// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'transform', {
        set: function set(value) {
            this.webkitTransform = value
        },
        get: function get() {
            return this.webkitTransform
        },
        enumerable: true,
    })
}

const Sizeable_instanceofSymbol = Symbol('instanceofSymbol')

const SizeableMixin = function (base) {

    // Sizeable extends TreeNode because Sizeable knows about its _parent when
    // calculating proportionalSize. Also Transformable knows about it's parent
    // in order to calculate it's world matrix based on it's parent's.
    var Sizeable = (function (superclass) {
        function Sizeable(options) {
            if ( options === void 0 ) options = {};

            superclass.call(this, options)

            this._propertyFunctions = null
            this._calculatedSize = { x:0, y:0, z:0 }
            this._properties = {}
            this._setDefaultProperties()
            this._setPropertyObservers()
            this.properties = options
        }

        if ( superclass ) Sizeable.__proto__ = superclass;
        Sizeable.prototype = Object.create( superclass && superclass.prototype );
        Sizeable.prototype.constructor = Sizeable;

        Sizeable.prototype._setDefaultProperties = function _setDefaultProperties () {
            Object.assign(this._properties, {
                sizeMode:         new XYZValues('absolute', 'absolute', 'absolute'),
                absoluteSize:     new XYZValues(0, 0, 0),
                proportionalSize: new XYZValues(1, 1, 1),
            })
        };

        Sizeable.prototype._setPropertyObservers = function _setPropertyObservers () {
            var this$1 = this;

            this._properties.sizeMode.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'sizeMode'); })
            this._properties.absoluteSize.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'absoluteSize'); })
            this._properties.proportionalSize.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'proportionalSize'); })
        };

        Sizeable.prototype._calcSize = function _calcSize () {
            const calculatedSize = this._calculatedSize
            const previousSize = Object.assign({}, calculatedSize)
            const props = this._properties
            const parentSize = this._getParentSize()

            if (props.sizeMode._x == 'absolute') {
                calculatedSize.x = props.absoluteSize._x
            }
            else { // proportional
                calculatedSize.x = parentSize.x * props.proportionalSize._x
            }

            if (props.sizeMode._y == 'absolute') {
                calculatedSize.y = props.absoluteSize._y
            }
            else { // proportional
                calculatedSize.y = parentSize.y * props.proportionalSize._y
            }

            if (props.sizeMode._z == 'absolute') {
                calculatedSize.z = props.absoluteSize._z
            }
            else { // proportional
                calculatedSize.z = parentSize.z * props.proportionalSize._z
            }

            if (
                previousSize.x !== calculatedSize.x
                || previousSize.y !== calculatedSize.y
                || previousSize.z !== calculatedSize.z
            ) {
                this.triggerEvent('sizechange', Object.assign({}, calculatedSize))
            }
        };

        Sizeable.prototype._getParentSize = function _getParentSize () {
            return this._parent ? this._parent._calculatedSize : {x:0,y:0,z:0}
        };

        Sizeable.prototype._setPropertyXYZ = function _setPropertyXYZ (Class, name, newValue) {
            var this$1 = this;

            if (!(
                newValue instanceof Object ||
                newValue instanceof Array ||
                newValue instanceof Function
            )) {
                throw new TypeError(("Invalid value for " + (Class.name) + "#" + name + "."))
            }

            let change = false

            if (newValue instanceof Function) {
                // remove previous task if any.
                if (!this._propertyFunctions) { this._propertyFunctions = new Map }

                if (this._propertyFunctions.has(name))
                    { Motor_defaultExport.removeRenderTask(this._propertyFunctions.get(name)) }

                this._propertyFunctions.set(name,
                    Motor_defaultExport.addRenderTask(function (time) {
                        const result = newValue(
                            this$1._properties[name]._x,
                            this$1._properties[name]._y,
                            this$1._properties[name]._z,
                            time
                        )

                        if (result === false) {
                            this$1._propertyFunctions.delete(name)
                            return false
                        }

                        this$1[name] = result
                    })
                )
            }
            else if (newValue instanceof Array) {
                if (typeof newValue[0] != 'undefined') { this._properties[name]._x = newValue[0]; change = true }
                if (typeof newValue[1] != 'undefined') { this._properties[name]._y = newValue[1]; change = true }
                if (typeof newValue[2] != 'undefined') { this._properties[name]._z = newValue[2]; change = true }
            }
            else {
                if (typeof newValue.x != 'undefined') { this._properties[name]._x = newValue.x; change = true }
                if (typeof newValue.y != 'undefined') { this._properties[name]._y = newValue.y; change = true }
                if (typeof newValue.z != 'undefined') { this._properties[name]._z = newValue.z; change = true }
            }

            if (change) { this.triggerEvent('propertychange', name) }
        };

        Sizeable.prototype._setPropertySingle = function _setPropertySingle (Class, name, newValue, type) {
            var this$1 = this;

            if (!(typeof newValue == type || newValue instanceof Function))
                { throw new TypeError(("Invalid value for " + (Class.name) + "#" + name + ".")) }

            if (newValue instanceof Function) {
                // remove previous task if any.
                Motor_defaultExport.addRenderTask(function (time) {
                    const result = newValue(
                        this$1._properties[name],
                        time
                    )

                    if (result === false) { return false }

                    this$1[name] = result
                })
            }
            else {
                this._properties[name] = newValue
                this.triggerEvent('propertychange', name)
            }
        };

        Sizeable.prototype._render = function _render () {
            // nothing yet, but needed because ImperativeBase calls
            // `super._render()`, which will call either Transformable's
            // _render or Sizeable's _render for Node and Scene classes,
            // respectively.
        };

        return Sizeable;
    }(TreeNode.mixin(Observable.mixin(base))));

    // We set accessors manually because Buble doesn't make them configurable
    // as per spec. Additionally we're maing these ones enumerable.
    Object.defineProperties(Sizeable.prototype, {

        /**
         * Set the size mode for each axis. Possible size modes are "absolute" and "proportional".
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis sizeMode to apply.
         * @param {number} [newValue.y] The y-axis sizeMode to apply.
         * @param {number} [newValue.z] The z-axis sizeMode to apply.
         */
        sizeMode: {
            set: function set(newValue) {
                this._setPropertyXYZ(Sizeable, 'sizeMode', newValue)
            },
            get: function get() {
                return this._properties.sizeMode
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis absoluteSize to apply.
         * @param {number} [newValue.y] The y-axis absoluteSize to apply.
         * @param {number} [newValue.z] The z-axis absoluteSize to apply.
         */
        absoluteSize: {
            set: function set(newValue) {
                this._setPropertyXYZ(Sizeable, 'absoluteSize', newValue)
            },
            get: function get() {
                return this._properties.absoluteSize
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Get the actual size of the Node. This can be useful when size is
         * proportional, as the actual size of the Node depends on the size of
         * it's parent.
         *
         * @readonly
         *
         * @return {Array.number} An Oject with x, y, and z properties, each
         * property representing the computed size of the x, y, and z axes
         * respectively.
         */
        actualSize: {
            get: function get() {
                var ref = this._calculatedSize;
                var x = ref.x;
                var y = ref.y;
                var z = ref.z;
                return {x: x,y: y,z: z}
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set the size of a Node proportional to the size of it's parent Node. The
         * values are a real number between 0 and 1 inclusive where 0 means 0% of
         * the parent size and 1 means 100% of the parent size.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis proportionalSize to apply.
         * @param {number} [newValue.y] The y-axis proportionalSize to apply.
         * @param {number} [newValue.z] The z-axis proportionalSize to apply.
         */
        proportionalSize: {
            set: function set(newValue) {
                this._setPropertyXYZ(Sizeable, 'proportionalSize', newValue)
            },
            get: function get() {
                return this._properties.proportionalSize
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set all properties of a Sizeable in one method.
         *
         * @param {Object} properties Properties object - see example
         *
         * @example
         * node.properties = {
         *   sizeMode: {x:'absolute', y:'proportional', z:'absolute'},
         *   absoluteSize: {x:300, y:100, z:200},
         *   proportionalSize: {x:1, z:0.5}
         * }
         */
        properties: {
            set: function set(properties) {
                if ( properties === void 0 ) properties = {};

                if (properties.sizeMode)
                    { this.sizeMode = properties.sizeMode }

                if (properties.absoluteSize)
                    { this.absoluteSize = properties.absoluteSize }

                if (properties.proportionalSize)
                    { this.proportionalSize = properties.proportionalSize }
            },
            // no need for a properties getter.
            configurable: true,
        },
    })

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    makeLowercaseSetterAliases(Sizeable.prototype)

    Object.defineProperty(Sizeable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Sizeable) { return Object.getPrototypeOf(Sizeable)[Symbol.hasInstance].call(this, obj) }

            let currentProto = obj

            while (currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(Sizeable_instanceofSymbol))
                    { return true }

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Sizeable[Sizeable_instanceofSymbol] = true

    return Sizeable
}

const Sizeable_Sizeable = SizeableMixin((function () {
    function anonymous () {}

    return anonymous;
}()))
Sizeable_Sizeable.mixin = SizeableMixin



// CONCATENATED MODULE: ./src/core/Transformable.js




const Transformable_instanceofSymbol = Symbol('instanceofSymbol')

const TransformableMixin = function (base) {

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its _parent when calculating align adjustments.
    const ParentClass = Sizeable_Sizeable.mixin(base)
    var Transformable = (function (ParentClass) {
        function Transformable(options) {
            if ( options === void 0 ) options = {};

            ParentClass.call(this, options)

            this._worldMatrix = null
        }

        if ( ParentClass ) Transformable.__proto__ = ParentClass;
        Transformable.prototype = Object.create( ParentClass && ParentClass.prototype );
        Transformable.prototype.constructor = Transformable;

        Transformable.prototype._setDefaultProperties = function _setDefaultProperties () {
            ParentClass.prototype._setDefaultProperties.call(this)

            Object.assign(this._properties, {
                position:   new XYZValues(0, 0, 0),
                rotation:   new XYZValues(0, 0, 0),
                scale:      new XYZValues(1, 1, 1),
                origin:     new XYZValues(0.5, 0.5, 0.5),
                align:      new XYZValues(0, 0, 0),
                mountPoint: new XYZValues(0, 0, 0),
                opacity:    1,
                transform:  new window.DOMMatrix,
            })
        };

        Transformable.prototype._setPropertyObservers = function _setPropertyObservers () {
            var this$1 = this;

            ParentClass.prototype._setPropertyObservers.call(this)

            this._properties.position.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'position'); })
            this._properties.rotation.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'rotation'); })
            this._properties.scale.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'scale'); })
            this._properties.origin.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'origin'); })
            this._properties.align.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'align'); })
            this._properties.mountPoint.on('valuechanged',
                function () { return this$1.triggerEvent('propertychange', 'mountPoint'); })
        };

        /**
         * Takes all the current component values (position, rotation, etc) and
         * calculates a transformation DOMMatrix from them. See "W3C Geometry
         * Interfaces" to learn about DOMMatrix.
         *
         * @method
         * @private
         * @memberOf Node
         */
        Transformable.prototype._calculateMatrix = function _calculateMatrix () {
            const matrix = new window.DOMMatrix
            const properties = this._properties

            const alignAdjustment = [0,0,0]
            if (this._parent) { // The root Scene doesn't have a parent, for example.
                const parentSize = this._parent._calculatedSize
                var align = properties.align;
                alignAdjustment[0] = parentSize.x * align.x
                alignAdjustment[1] = parentSize.y * align.y
                alignAdjustment[2] = parentSize.z * align.z
            }

            const mountPointAdjustment = [0,0,0]
            const thisSize = this._calculatedSize
            var mountPoint = properties.mountPoint;
            mountPointAdjustment[0] = thisSize.x * mountPoint.x
            mountPointAdjustment[1] = thisSize.y * mountPoint.y
            mountPointAdjustment[2] = thisSize.z * mountPoint.z

            const appliedPosition = []
            var position = properties.position;
            appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0]
            appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1]
            appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2]

            matrix.translateSelf(appliedPosition[0], appliedPosition[1], appliedPosition[2])

            // origin calculation will go here:
            // - move by negative origin before rotating.

            // apply each axis rotation, in the x,y,z order.
            var rotation = properties.rotation;
            matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
            matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
            matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

            // origin calculation will go here:
            // - move by positive origin after rotating.

            return matrix
        };

        // TODO: fix _isIdentity in DOMMatrix, it is returning true even if false.
        Transformable.prototype._calculateWorldMatricesInSubtree = function _calculateWorldMatricesInSubtree () {
            this._calculateWorldMatrixFromParent()

            const children = this._children
            for (let i=0, l=children.length; i<l; i+=1) {
                children[i]._calculateWorldMatricesInSubtree()
            }
        };

        Transformable.prototype._calculateWorldMatrixFromParent = function _calculateWorldMatrixFromParent () {
            const parent = this._parent

            if (parent instanceof Transformable)
                //this._worldMatrix = parent._worldMatrix.multiply(this._properties.transform)
                { this._worldMatrix = this._properties.transform.multiply(parent._worldMatrix) }
            else // otherwise parent is the Scene, which is Sizeable, not Transformable
                { this._worldMatrix = this._properties.transform }
        };

        Transformable.prototype._render = function _render () {
            ParentClass.prototype._render.call(this)

            // TODO: only run this when necessary (f.e. not if only opacity
            // changed)
            this._properties.transform = this._calculateMatrix()
        };

        return Transformable;
    }(ParentClass));

    var ref = Object.getOwnPropertyDescriptor(ParentClass.prototype, 'properties');
    var superPropertiesSet = ref.set;

    // We set accessors manually because Buble doesn't make them configurable
    // as per spec. Additionally we're maing these ones enumerable.
    Object.defineProperties(Transformable.prototype, {

        /**
         * Set the position of the Transformable.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis position to apply.
         * @param {number} [newValue.y] The y-axis position to apply.
         * @param {number} [newValue.z] The z-axis position to apply.
         */
        position: {
            set: function set(newValue) {
                this._setPropertyXYZ(Transformable, 'position', newValue)
            },
            get: function get() {
                return this._properties.position
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis rotation to apply.
         * @param {number} [newValue.y] The y-axis rotation to apply.
         * @param {number} [newValue.z] The z-axis rotation to apply.
         */
        rotation: {
            set: function set(newValue) {
                this._setPropertyXYZ(Transformable, 'rotation', newValue)
            },
            get: function get() {
                return this._properties.rotation
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis scale to apply.
         * @param {number} [newValue.y] The y-axis scale to apply.
         * @param {number} [newValue.z] The z-axis scale to apply.
         */
        scale: {
            set: function set(newValue) {
                this._setPropertyXYZ(Transformable, 'scale', newValue)
            },
            get: function get() {
                return this._properties.scale
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set this Node's opacity.
         *
         * @param {number} opacity A floating point number between 0 and 1
         * (inclusive). 0 is fully transparent, 1 is fully opaque.
         */
        opacity: {
            set: function set(newValue) {
                if (!isRealNumber(newValue)) { newValue = undefined }
                this._setPropertySingle(Transformable, 'opacity', newValue, 'number')
            },
            get: function get() {
                return this._properties.opacity
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set the alignment of the Node. This determines at which point in this
         * Node's parent that this Node is mounted.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis align to apply.
         * @param {number} [newValue.y] The y-axis align to apply.
         * @param {number} [newValue.z] The z-axis align to apply.
         */
        align: {
            set: function set(newValue) {
                this._setPropertyXYZ(Transformable, 'align', newValue)
            },
            get: function get() {
                return this._properties.align
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set the mount point of the Node.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis mountPoint to apply.
         * @param {number} [newValue.y] The y-axis mountPoint to apply.
         * @param {number} [newValue.z] The z-axis mountPoint to apply.
         */
        mountPoint: {
            set: function set(newValue) {
                this._setPropertyXYZ(Transformable, 'mountPoint', newValue)
            },
            get: function get() {
                return this._properties.mountPoint
            },
            configurable: true,
            enumerable: true,
        },

        /**
         * Set all properties of a Transformable in one method.
         *
         * @param {Object} properties Properties object - see example.
         *
         * @example
         * node.properties = {
         *   position: {x:200, y:300, z:100},
         *   rotation: {z:35},
         *   scale: {y:2},
         *   opacity: .9,
         * }
         */
        properties: {
            set: function set(properties) {
                if ( properties === void 0 ) properties = {};

                superPropertiesSet.call(this, properties)

                if (properties.position)
                    { this.position = properties.position }

                if (properties.rotation)
                    { this.rotation = properties.rotation }

                if (properties.scale)
                    { this.scale = properties.scale }

                if (properties.origin)
                    { this.origin = properties.origin }

                if (properties.align)
                    { this.align = properties.align }

                if (properties.mountPoint)
                    { this.mountPoint = properties.mountPoint }

                if (properties.opacity)
                    { this.opacity = properties.opacity }
            },
            // no need for a properties getter.
            configurable: true,
        },
    })

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    makeLowercaseSetterAliases(Transformable.prototype)

    Object.defineProperty(Transformable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Transformable) { return Object.getPrototypeOf(Transformable)[Symbol.hasInstance].call(this, obj) }

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(Transformable_instanceofSymbol))
                    { return true }

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Transformable[Transformable_instanceofSymbol] = true

    return Transformable
}

function isRealNumber(num) {
    if (
        typeof num != 'number'
        || Object.is(num, NaN)
        || Object.is(num, Infinity)
    ) { return false }
    return true
}

const Transformable_Transformable = TransformableMixin((function () {
    function anonymous () {}

    return anonymous;
}()))
Transformable_Transformable.mixin = TransformableMixin



// CONCATENATED MODULE: ./src/html/node-style.js

/* harmony default export */ var node_style_defaultExport = ({

    // all items of the scene graph are hidden until they are mounted in a
    // scene (this changes to `display:block`).
    display:         'none',

    boxSizing:       'border-box',
    position:        'absolute',
    top:             0,
    left:            0,

    // Defaults to [0.5,0.5,0.5] (the Z axis doesn't apply for DOM elements,
    // but will for 3D objects in WebGL.)
    transformOrigin: '50% 50% 0', // default

    transformStyle:  'preserve-3d',
});

// CONCATENATED MODULE: ./src/html/scene-style.js


/* harmony default export */ var scene_style_defaultExport = (Object.assign({}, node_style_defaultExport,

    {position: 'relative',
    overflow: 'hidden',
    width:    '100%',
    height:   '100%',

    // Constant perspective for now.
    perspective: 1000}));

// CONCATENATED MODULE: ./src/html/web-component.js
/* global customElements */




// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof window.HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement(){}
    _HTMLElement.prototype = window.HTMLElement.prototype
    window.HTMLElement = _HTMLElement
}

const classCache = new Map

function classExtendsHTMLElement(constructor) {
    if (!constructor) { return false }
    if (constructor === HTMLElement) { return true }
    else { return classExtendsHTMLElement(constructor.prototype.__proto__ ? constructor.prototype.__proto__.constructor : null) }
}

/**
 * Creates a WebComponent base class dynamically, depending on which
 * HTMLElement class you want it to extend from. Extend from WebComponent when
 * making a new Custom Element class.
 *
 * @example
 * const WebComponent = WebComponentMixin(HTMLButtonElement)
 * class AwesomeButton extends WebComponent { ... }
 *
 * @param {Function} elementClass The class that the generated WebComponent
 * base class will extend from.
 */
function WebComponentMixin(elementClass) {
    if (!elementClass) { elementClass = HTMLElement }

    if (!classExtendsHTMLElement(elementClass)) {
        throw new TypeError(
            'The argument to WebComponentMixin must be a constructor that extends from or is HTMLElement.'
        )
    }

    // if a base class that extends the given `elementClass` has already been
    // created, return it.
    if (classCache.has(elementClass))
        { return classCache.get(elementClass) }

    // otherwise, create it.
    var WebComponent = (function (elementClass) {
        function WebComponent() {
            elementClass.call(this)

            // If the following is true, then we know the user should be using
            // `document.registerElement()` to define an element from this class.
            // `document.registerElement()` creates a new constructor, so if the
            // constructor here is being called then that means the user is not
            // instantiating a DOM HTMLElement as expected because it is required
            // that the constructor returned from `document.registerElement` be used
            // instead (this is a flaw of Custom Elements v0 which is fixed in v1
            // where class constructors can be used directly).
            if ('registerElement' in document && !('customElements' in window)) {
                throw new Error("\n                    You cannot instantiate this class directly without first registering it\n                    with `document.registerElement(...)`. See an example at http://....\n                ")
            }

            // Throw an error if no Custom Elements API exists.
            if (!('registerElement' in document) && !('customElements' in window)) {
                throw new Error("\n                    Your browser does not support the Custom Elements API. You'll\n                    need to install a polyfill. See how at http://....\n                ")
            }

            // otherwise the V1 API exists, so call the createdCallback, which
            // is what Custom Elements v0 would call by default. Subclasses of
            // WebComponent should put instantiation logic in createdCallback
            // instead of in a custom constructor if backwards compatibility is
            // to be maintained.
            this.createdCallback()
        }

        if ( elementClass ) WebComponent.__proto__ = elementClass;
        WebComponent.prototype = Object.create( elementClass && elementClass.prototype );
        WebComponent.prototype.constructor = WebComponent;

        WebComponent.prototype.createdCallback = function createdCallback () {
            this._attached = false
            this._initialized = false
            this._initialAttributeChange = false
            this._childObserver = null
            this._style = null
        };

        // Subclasses can implement these.
        WebComponent.prototype.childConnectedCallback = function childConnectedCallback (child) {};
        WebComponent.prototype.childDisconnectedCallback = function childDisconnectedCallback (child) {};

        WebComponent.prototype.connectedCallback = function connectedCallback () {
            if (elementClass.prototype.connectedCallback) { elementClass.prototype.connectedCallback.call(this) }
            this._attached = true

            if (!this._initialized) {
                this.init()
                this._initialized = true
            }
        };
        WebComponent.prototype.attachedCallback = function attachedCallback () { this.connectedCallback() }; // back-compat

        WebComponent.prototype._createStyles = function _createStyles () {
            const rule = jss_defaultExport.createRule(this.getStyles())

            rule.applyTo(this)

            return rule
        };

        WebComponent.prototype.disconnectedCallback = function disconnectedCallback () {
            var this$1 = this;

            if (elementClass.prototype.disconnectedCallback) { elementClass.prototype.disconnectedCallback.call(this) }
            this._attached = false

            // Deferr to the next tick before cleaning up in case the
            // element is actually being re-attached somewhere else within this
            // same tick (detaching and attaching is synchronous, so by
            // deferring to the next tick we'll be able to know if the element
            // was re-attached or not in order to clean up or not). Note that
            // appendChild can be used to move an element to another parent
            // element, in which case connectedCallback and disconnectedCallback
            // both get called, and in which case we don't necessarily want to
            // clean up. If the element gets re-attached before the next tick
            // (for example, gets moved), then we want to preserve the
            // stuff that would be cleaned up by an extending class' deinit
            // method by not running the following this.deinit() call.
            Promise.resolve().then(function () { // deferr to the next tick.

                // As mentioned in the previous comment, if the element was not
                // re-attached in the last tick (for example, it was moved to
                // another element), then clean up.
                if (!this$1._attached && this$1._initialized) {
                    this$1.deinit()
                }
            })
        };
        //async disconnectedCallback() {
            //if (super.disconnectedCallback) super.disconnectedCallback()
            //this._attached = false

            //// Deferr to the next tick before cleaning up in case the
            //// element is actually being re-attached somewhere else within this
            //// same tick (detaching and attaching is synchronous, so by
            //// deferring to the next tick we'll be able to know if the element
            //// was re-attached or not in order to clean up or not). Note that
            //// appendChild can be used to move an element to another parent
            //// element, in which case connectedCallback and disconnectedCallback
            //// both get called, and in which case we don't necessarily want to
            //// clean up. If the element gets re-attached before the next tick
            //// (for example, gets moved), then we want to preserve the
            //// stuff that would be cleaned up by an extending class' deinit
            //// method by not running the following this.deinit() call.
            //await Promise.resolve() // deferr to the next tick.

            //// As mentioned in the previous comment, if the element was not
            //// re-attached in the last tick (for example, it was moved to
            //// another element), then clean up.
            //if (!this._attached && this._initialized) {
                //this.deinit()
            //}
        //}
        WebComponent.prototype.detachedCallback = function detachedCallback () { this.disconnectedCallback() }; // back-compat

        /**
         * This method can be overridden by extending classes, it should return
         * JSS-compatible styling. See http://github.com/cssinjs/jss for
         * documentation.
         * @abstract
         */
        WebComponent.prototype.getStyles = function getStyles () {
            return {}
        };


        /**
         * Init is called exactly once, the first time this element is
         * connected into the DOM. When an element is disconnected then
         * connected right away within the same synchronous tick, init() is not
         * fired again. However, if an element is disconnected and the current
         * tick completes before the element is connected again, then deinit()
         * will be called (i.e. the element was not simply moved to a new
         * location, it was actually removed), then the next time that the
         * element is connected back into DOM init() will be called again.
         *
         * This is in contrast to connectedCallback and disconnectedCallback:
         * connectedCallback is guaranteed to always fire even if the elemet
         * was previously disconnected in the same synchronous tick.
         *
         * For example, ...
         *
         * Subclasses should extend this to add such logic.
         */
        WebComponent.prototype.init = function init () {
            var this$1 = this;

            if (!this._style) { this._style = this._createStyles() }

            // Handle any nodes that may have been connected before `this` node
            // was created (f.e. child nodes that were connected before the
            // custom elements were registered and which would therefore not be
            // detected by the following MutationObserver).
            if (!this._childObserver) {

                const children = this.childNodes
                if (children.length) {

                    // Timeout needed in case the Custom Element classes are
                    // registered after the elements are already defined in the
                    // DOM but not yet upgraded. This means that the `node` arg
                    // might be a `<motor-node>` but if it isn't upgraded then
                    // its API won't be available to the logic inside the
                    // childConnectedCallback. The reason this happens is
                    // because parents are upgraded first and their
                    // connectedCallbacks fired before their children are
                    // upgraded.
                    //
                    // TODO FIXME PERFORMANCE: This causes a possibly "buggy" effect where
                    // elements in a tree will appear in intervals of 5
                    // milliseconds. We want elements to be rendered instantly,
                    // in the first frame that they are present in the scene
                    // graph.
                    // How can we fix this? Maybe we can switch to a Promise microtask.
                    setTimeout(function () {
                        for (let l=children.length, i=0; i<l; i+=1) {
                            this$1.childConnectedCallback(children[i])
                        }
                    }, 5)
                }

                this._childObserver = observeChildren(this, this.childConnectedCallback, this.childDisconnectedCallback)
            }

            // fire this.attributeChangedCallback in case some attributes have
            // existed before the custom element was upgraded.
            if (!this._initialAttributeChange && this.hasAttributes()) {

                // HTMLElement#attributes is a NamedNodeMap which is not an
                // iterable, so we use Array.from. See:
                // https://github.com/zloirock/core-js/issues/234
                var ref = this;
                var attributes = ref.attributes;
                for (let l=attributes.length, i=0; i<l; i+=1)
                    { this$1.attributeChangedCallback(attributes[i].name, null, attributes[i].value) }
            }
        };

        WebComponent.prototype.attributeChangedCallback = function attributeChangedCallback () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            //console.log(' --- attributeChangedCallback', typeof args[2])
            if (elementClass.prototype.attributeChangedCallback) { elementClass.prototype.attributeChangedCallback.apply(this, args) }
            this._initialAttributeChange = true
        };

        /**
         * This is the reciprocal of init(). It will be called when an element
         * has been disconnected but not re-connected within the same tick.
         *
         * The reason that init() and deinit() exist is so that if an element is
         * moved from one place to another within the same synchronous tick,
         * that deinit and init logic will not fire unnecessarily. If logic is
         * needed in that case, then connectedCallback and disconnectedCallback
         * can be used directly instead.
         */
        WebComponent.prototype.deinit = function deinit () {
            // Nothing much at the moment, but extending classes can extend
            // this to add deintialization logic.

            this._initialized = false
        };

        return WebComponent;
    }(elementClass));

    classCache.set(elementClass, WebComponent)
    return WebComponent
}

// CONCATENATED MODULE: ./src/html/node.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_document_register_element__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_document_register_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_document_register_element__);







initMotorHTMLBase()

var node_MotorHTMLNode = (function (MotorHTMLBase) {
    function MotorHTMLNode () {
        MotorHTMLBase.apply(this, arguments);
    }

    if ( MotorHTMLBase ) MotorHTMLNode.__proto__ = MotorHTMLBase;
    MotorHTMLNode.prototype = Object.create( MotorHTMLBase && MotorHTMLBase.prototype );
    MotorHTMLNode.prototype.constructor = MotorHTMLNode;

    MotorHTMLNode.prototype.getStyles = function getStyles () {
        return node_style_defaultExport
    };

    // this is called by DeclarativeBase#init, which is called by
    // WebComponent#connectedCallback, at which point this element has a
    // parentNode.
    // @override
    MotorHTMLNode.prototype._makeImperativeCounterpart = function _makeImperativeCounterpart () {
        return new Node_Node({
            _motorHtmlCounterpart: this
        })
    };

    MotorHTMLNode.prototype.attributeChangedCallback = function attributeChangedCallback () {
        var this$1 = this;
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        MotorHTMLBase.prototype.attributeChangedCallback.apply(this, args)

        // TODO PERFORMANCE: we could possibly not stack a promise every
        // attribute change, and just cache the latest value to set it when the
        // imperativeCounterpart is ready.
        this._imperativeCounterpartPromise.then(function () {
            (ref = this$1)._updateNodeProperty.apply(ref, args)
            var ref;
        })
    };
    //async attributeChangedCallback(...args) {
        //super.attributeChangedCallback(...args)

        //// TODO PERFORMANCE: we could possibly not stack a promise every
        //// attribute change, and just cache the latest value to set it when the
        //// imperativeCounterpart is ready.
        //await this._imperativeCounterpartPromise
        //this._updateNodeProperty(...args)
    //}

    MotorHTMLNode.prototype._updateNodeProperty = function _updateNodeProperty (attribute, oldValue, newValue) {
        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                { this.imperativeCounterpart[attribute] = window.parseFloat(newValue) }
            else if (attribute.match(/sizeMode/i))
                { this.imperativeCounterpart[attribute] = parseStringArray(newValue) }
            else if (
                attribute.match(/rotation/i)
                || attribute.match(/scale/i)
                || attribute.match(/position/i)
                || attribute.match(/absoluteSize/i)
                || attribute.match(/proportionalSize/i)
                || attribute.match(/align/i)
                || attribute.match(/mountPoint/i)
                || attribute.match(/origin/i)
                || attribute.match(/skew/i)
            ) {
                this.imperativeCounterpart[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    };

    return MotorHTMLNode;
}(base_DeclarativeBase));

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Transformable_Transformable, node_MotorHTMLNode)
proxyGettersSetters(Sizeable_Sizeable, node_MotorHTMLNode)

function parseNumberArray(str) {
    checkIsNumberArrayString(str)
    const numbers = str.trim().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = numbers.length
    if (length > 0) { numbers[0] = window.parseFloat(numbers[0]) }
    if (length > 1) { numbers[1] = window.parseFloat(numbers[1]) }
    if (length > 2) { numbers[2] = window.parseFloat(numbers[2]) }
    return numbers
}

function parseStringArray(str) {
    checkIsSizeArrayString(str)
    const strings = str.trim().toLowerCase().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = strings.length
    if (length > 0) { strings[0] = strings[0] }
    if (length > 1) { strings[1] = strings[1] }
    if (length > 2) { strings[2] = strings[2] }
    return strings
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s*,){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))))|((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+))))))\s*$/g))
        { throw new Error(("Attribute must be a comma- or space-separated sequence of up to three numbers, for example \"1 2.5 3\". Yours was \"" + str + "\".")) }
}

function checkIsSizeArrayString(str) {
    if (!str.match(/^\s*(((\s*([a-zA-Z]+)\s*,){0,2}(\s*([a-zA-Z]+)))|((\s*([a-zA-Z]+)\s*){1,3}))\s*$/g))
        { throw new Error(("Attribute must be a comma- or space-separated sequence of up to three strings, for example \"absolute absolute\". Yours was \"" + str + "\".")) }
}


node_MotorHTMLNode = document.registerElement('motor-node', node_MotorHTMLNode)



// CONCATENATED MODULE: ./src/html/base.js
/* global HTMLSlotElement */





var base_DeclarativeBase

// We use this to Override HTMLElement.prototype.attachShadow in v1, and
// HTMLElement.prototype.createShadowRoot in v0, so that we can make the
// connection between parent and child on the iperative side when the HTML side
// is using shadow roots.
const observers = new WeakMap
function hijack(original) {
    return function() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        // In v0, shadow roots can be replaced, but in v1 calling attachShadow
        // on an element that already has a root throws. So, we can set this to
        // true, and if the try-catch passes then we know we have a v0 root and
        // that the root was just replaced.
        const oldRoot = this.shadowRoot
        let root = null
        try {
            root = original.call.apply(original, [ this ].concat( args ))
        }
        catch (e) { throw e }
        if (this instanceof base_DeclarativeBase) {
            this._hasShadowRoot = true
            if (oldRoot) {
                onV0ShadowRootReplaced.call(this, oldRoot)
            }
            const observer = observeChildren(root, shadowRootChildAdded.bind(this), shadowRootChildRemoved.bind(this))
            observers.set(root, observer)

            var ref = this;
            var children = ref.children;
            for (let l=children.length, i=0; i<l; i+=1) {
                if (!(children[i] instanceof base_DeclarativeBase)) { continue }
                children[i]._isPossiblyDistributed = true
            }
        }
        return root
    }
}

function shadowRootChildAdded(child) {

    // NOTE Logic here is similar to childConnectedCallback

    if (child instanceof base_DeclarativeBase) {
        this.imperativeCounterpart.addChild(child.imperativeCounterpart)
    }
    else if (
        hasShadowDomV0
        && child instanceof HTMLContentElement
    ) {
        // observe <content> elements.
    }
    else if (
        hasShadowDomV1
        && child instanceof HTMLSlotElement
    ) {
        child.addEventListener('slotchange', this)
        this._handleDistributedChildren(child)
    }
}

function shadowRootChildRemoved(child) {

    // NOTE Logic here is similar to childDisconnectedCallback

    if (child instanceof base_DeclarativeBase) {
        this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
    }
    else if (
        hasShadowDomV0
        && child instanceof HTMLContentElement
    ) {
        // unobserve <content> element
    }
    else if (
        hasShadowDomV1
        && child instanceof HTMLSlotElement
    ) {
        child.removeEventListener('slotchange', this)
        this._handleDistributedChildren(child)
        this._slotElementsAssignedNodes.delete(child)
    }
}

function onV0ShadowRootReplaced(oldRoot) {
    var this$1 = this;

    observers.get(oldRoot).disconnect()
    observers.delete(oldRoot)
    var childNodes = oldRoot.childNodes;
    for (let l=childNodes.length, i=0; i<l; i+=1) {
        const child = childNodes[i]

        if (!(child instanceof base_DeclarativeBase)) { continue }

        // We should disconnect the imperative connection (f.e. so it is not
        // rendered in WebGL)
        this$1.imperativeCounterpart.removeChild(child.imperativeCounterpart, true)
    }
}

if (HTMLElement.prototype.createShadowRoot instanceof Function)
    { HTMLElement.prototype.createShadowRoot = hijack(HTMLElement.prototype.createShadowRoot) }
if (HTMLElement.prototype.attachShadow instanceof Function)
    { HTMLElement.prototype.attachShadow = hijack(HTMLElement.prototype.attachShadow) }

initMotorHTMLBase()
function initMotorHTMLBase() {
    if (base_DeclarativeBase) { return }

    /**
     * @implements {EventListener}
     */
    base_DeclarativeBase = (function (superclass) {
        function DeclarativeBase () {
            superclass.apply(this, arguments);
        }

        if ( superclass ) DeclarativeBase.__proto__ = superclass;
        DeclarativeBase.prototype = Object.create( superclass && superclass.prototype );
        DeclarativeBase.prototype.constructor = DeclarativeBase;

        DeclarativeBase.prototype.createdCallback = function createdCallback () {
            var this$1 = this;

            superclass.prototype.createdCallback.call(this)

            this.imperativeCounterpart = null // to hold the imperative API Node instance.

            // true if this node has a shadow root (even if it is "closed", see
            // hijack function above). Once true always true because shadow
            // roots cannot be removed.
            this._hasShadowRoot = false

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            this._isPossiblyDistributed = false

            // A map of the slot elements that are children of this node and
            // their last-known assigned nodes. When a slotchange happens while
            // this node is in a shadow root and has a slot child, we can
            // detect what the difference is between the last known and the new
            // assignments, and notate the new distribution of child nodes. See
            // issue #40 for background on why we do this.
            this._slotElementsAssignedNodes = new WeakMap

            // If this node is distributed into a shadow tree, this will
            // reference the parent of the <slot> or <content> element.
            // Basically, this node will render as a child of that parent node
            // in the flat tree.
            this._shadowParent = null

            // If this element has a child <slot> or <content> element while in
            // a shadow root, then this will be a Set of the nodes distributed
            // into the <slot> or <content>, and those nodes render relatively
            // to this node in the flat tree. We instantiate this later, only
            // when/if needed.
            this._shadowChildren = null

            // We use Promise.resolve here to defer to the next microtask.
            // While we support Custom Elements v0, this is necessary because
            // the imperative Node counterpart will have already called the
            // `_associateImperativeNode` method on this element, causing the
            // next microtask's call to be a no-op. When this MotorHTML element
            // API is used instead of the Imperative counterpart, then the next
            // microtask's `_associateImperativeNode` call will not be a no-op.
            // When we drop support for v0 Custom Elements at some point, we
            // can rely on passing a constructor argument similarly to how we
            // do with motor/Node in order to detect that the constructor is
            // being called from the reciprocal API. See the constructor in
            // motor/Node.js to get see the idea.
            // TODO: renewable promise after unmount.
            this._imperativeCounterpartPromise = Promise.resolve()
                .then(function () { return this$1._associateImperativeNode(); })
            this.mountPromise = this._imperativeCounterpartPromise
                .then(function () { return this$1.imperativeCounterpart.mountPromise; })
        };

        /**
         * This method creates the association between this MotorHTMLNode instance
         * and the imperative Node instance.
         *
         * This method may get called by this.init, but can also be called by
         * the Node class if Node is used imperatively. See Node#constructor.
         *
         * @private
         *
         * @param {Object} imperativeCounterpart The imperative counterpart to
         * associate with this MotorHTML element. This parameter is only used in the
         * imperative API constructors, and this happens when using the imperative
         * form of infamous instead of the HTML interface to infamous. When the HTML
         * interface is used, this gets called first without an
         * imperativeCounterpart argument and the call to this in an imperative
         * constructor will be a noop. Basically, either this gets called first by a
         * MotorHTML element, or first by an imperative instance, depending on which
         * API is used first.
         */
        DeclarativeBase.prototype._associateImperativeNode = function _associateImperativeNode (imperativeCounterpart) {
            // if the association is made already, noop
            if (this.imperativeCounterpart) { return }

            // if called from an imperative-side class' constructor, associate
            // the passed instance.
            if (imperativeCounterpart) { this.imperativeCounterpart = imperativeCounterpart }

            // otherwise if called from a MotorHTML class without an argument
            else { this.imperativeCounterpart = this._makeImperativeCounterpart() }
        };

        /**
         * This method should be overriden by child classes. It should return the
         * imperative-side instance that the HTML-side class (this) corresponds to.
         * @abstract
         */
        DeclarativeBase.prototype._makeImperativeCounterpart = function _makeImperativeCounterpart () {
            throw new TypeError('This method should be implemented by classes extending DeclarativeBase.')
        };

        DeclarativeBase.prototype.childConnectedCallback = function childConnectedCallback (child) {

            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof node_MotorHTMLNode) {
                if (this._hasShadowRoot) { child._isPossiblyDistributed = true }

                // If ImperativeBase#addChild was called first, child's
                // _parent will already be set, so prevent recursion.
                if (child.imperativeCounterpart._parent) { return }

                this.imperativeCounterpart.addChild(child.imperativeCounterpart)
            }
            else if (
                hasShadowDomV0
                && child instanceof HTMLContentElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v0'
            ) {
                // observe <content> elements.
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v1'
            ) {
                child.addEventListener('slotchange', this)
                this._handleDistributedChildren(child)
            }
        };

        // This method is part of the EventListener interface.
        DeclarativeBase.prototype.handleEvent = function handleEvent (event) {
            if (event.type == 'slotchange') {
                const slot = event.target
                this._handleDistributedChildren(slot)
            }
        };

        DeclarativeBase.prototype._handleDistributedChildren = function _handleDistributedChildren (slot) {
            var this$1 = this;

            const diff = this._getDistributedChildDifference(slot)

            var added = diff.added;
            for (let l=added.length, i=0; i<l; i+=1) {
                const addedNode = added[i]

                if (!(addedNode instanceof DeclarativeBase)) { continue }

                // We do this because if the given slot is assigned to another
                // slot, then this logic will run again for the next slot on
                // that next slot's slotchange, so we remove the distributed
                // node from the previous shadowParent and add it to the next
                // one. If we don't do this, then the distributed node will
                // exist in multiple shadowChildren lists when there is a
                // chain of assigned slots. For more info, see
                // https://github.com/w3c/webcomponents/issues/611
                const shadowParent = addedNode._shadowParent
                if (shadowParent && shadowParent._shadowChildren) {
                    const shadowChildren = shadowParent._shadowChildren
                    shadowChildren.splice(shadowChildren.indexOf(addedNode), 1)
                    if (!shadowChildren.length)
                        { shadowParent._shadowChildren = null }
                }

                addedNode._shadowParent = this$1
                if (!this$1._shadowChildren) { this$1._shadowChildren = [] }
                this$1._shadowChildren.add(addedNode)
            }

            var removed = diff.removed;
            for (let l=removed.length, i=0; i<l; i+=1) {
                const removedNode = removed[i]

                if (!(removedNode instanceof DeclarativeBase)) { continue }

                removedNode._shadowParent = null
                this$1._shadowChildren.delete(removedNode)
                if (!this$1._shadowChildren.size) { this$1._shadowChildren = null }
            }
        };

        DeclarativeBase.prototype._getDistributedChildDifference = function _getDistributedChildDifference (slot) {
            let previousNodes

            if (this._slotElementsAssignedNodes.has(slot))
                { previousNodes = this._slotElementsAssignedNodes.get(slot) }
            else
                { previousNodes = [] }

            const newNodes = slot.assignedNodes({flatten: true})

            // save the newNodes to be used as the previousNodes for next time.
            this._slotElementsAssignedNodes.set(slot, newNodes)

            const diff = {
                removed: [],
            }

            for (let i=0, l=previousNodes.length; i<l; i+=1) {
                const oldNode = previousNodes[i]
                const newIndex = newNodes.indexOf(oldNode)

                // if it exists in the previousNodes but not the newNodes, then
                // the node was removed.
                if (!(newIndex >= 0)) {
                    diff.removed.push(oldNode)
                }

                // otherwise the node wasn't added or removed.
                else {
                    newNodes.splice(i, 1)
                }
            }

            // Remaining nodes in newNodes must have been added.
            diff.added = newNodes

            return diff
        };

        DeclarativeBase.prototype.childDisconnectedCallback = function childDisconnectedCallback (child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof node_MotorHTMLNode) {
                child._isPossiblyDistributed = false

                // If ImperativeBase#removeChild was called first, child's
                // _parent will already be null, so prevent recursion.
                if (!child.imperativeCounterpart._parent) { return }

                this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
            }
            else if (
                hasShadowDomV0
                && child instanceof HTMLContentElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v0'
            ) {
                // unobserve <content> element
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v1'
            ) {
                child.removeEventListener('slotchange', this)
                this._handleDistributedChildren(child)
                this._slotElementsAssignedNodes.delete(child)
            }
        };

        DeclarativeBase.prototype.setAttribute = function setAttribute (attr, value) {
            //if (this.tagName.toLowerCase() == 'motor-scene')
                //console.log('setting attribute', arguments[1])
            superclass.prototype.setAttribute.call(this, attr, value)
        };

        return DeclarativeBase;
    }(WebComponentMixin(window.HTMLElement)))
}

// Creates setters/getters on the TargetClass which proxy to the
// setters/getters on SourceClass.
function proxyGettersSetters(SourceClass, TargetClass) {

    // Node methods not to proxy (private underscored methods are also detected and
    // ignored).
    const methodProxyBlacklist = [
        'constructor',
        'parent',
        'children', // proxying this one would really break stuff (f.e. React)
        'element',
        'scene',
        'addChild',
        'addChildren',
        'removeChild',
        'removeChildren' ]

    const props = Object.getOwnPropertyNames(SourceClass.prototype)

    for (let l=props.length, i=0; i<l; i+=1) {
        const prop = props[i]
        if (
            // skip the blacklisted properties
            methodProxyBlacklist.indexOf(prop) >= 0

            // skip the private underscored properties
            || prop.indexOf('_') == 0

            // skip properties that are already defined.
            || TargetClass.prototype.hasOwnProperty(prop)
        ) { continue }

        const targetDescriptor = {}
        const sourceDescriptor = Object.getOwnPropertyDescriptor(SourceClass.prototype, prop)

        // if the property has a setter
        if (sourceDescriptor.set) {
            Object.assign(targetDescriptor, {
                set: function set(value) {
                    this.imperativeCounterpart[prop] = value
                }
            })
        }

        // if the property has a getter
        if (sourceDescriptor.get) {
            Object.assign(targetDescriptor, {
                get: function get() {
                    return this.imperativeCounterpart[prop]
                }
            })
        }

        Object.defineProperty(TargetClass.prototype, prop, targetDescriptor)
    }
}



// CONCATENATED MODULE: ./src/html/scene.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_awaitbox_timers_sleep__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_awaitbox_timers_sleep___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_awaitbox_timers_sleep__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_two_js_build_two__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_two_js_build_two___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_two_js_build_two__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_document_register_element__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_document_register_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_document_register_element__);










//import * as PIXI from 'pixi.js' // also sets the PIXI global.
//import SVG from 'pixi-svg' // uses the PIXI global, won't work if you don't import the main `pixi.js module`.


initMotorHTMLBase()

const privates = new WeakMap()
const _ = function (instance) {
    if (!privates.get(instance)) { privates.set(instance, {}) }
    return privates.get(instance)
}

var scene_MotorHTMLScene = (function (superclass) {
    function MotorHTMLScene () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) MotorHTMLScene.__proto__ = superclass;
    MotorHTMLScene.prototype = Object.create( superclass && superclass.prototype );
    MotorHTMLScene.prototype.constructor = MotorHTMLScene;

    MotorHTMLScene.prototype.createdCallback = function createdCallback () {
        var this$1 = this;

        superclass.prototype.createdCallback.call(this)

        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}

        // After the imperativeCounterpart is available it needs to register
        // mount into DOM. This is only for MotorHTMLScenes because their
        // imperativeCounterparts are not added to a parent Node.
        // MotorHTMLNodes get their parent connection from their parent in
        // childConnectedCallback.
        this._imperativeCounterpartPromise
            .then(function () {

                if (this$1.imperativeCounterpart._mounted) { return }

                if (this$1.parentNode)
                    { this$1.imperativeCounterpart.mount(this$1.parentNode) }
            })

        // For now, use the same program (with shaders) for all objects.
        // Basically it has position, frag colors, point light, directional
        // light, and ambient light.
        // TODO: maybe call this in `init()`, and destroy webgl stuff in
        // `deinit()`.
        // TODO: The user might enable this by setting the attribute later, so
        // we can't simply rely on having it in createdCallback, we need a
        // getter/setter like node properties.
        this.initWebGl()
    };

    // TODO: we need to deinit webgl too.
    MotorHTMLScene.prototype.initWebGl = function initWebGl () {
        var this$1 = this;

        // TODO: this needs to be cancelable too, search other codes for
        // "mountcancel" to see.
        this.mountPromise.then(function () {
            this$1.webglEnabled = !!this$1.getAttribute('webglenabled')
            if (!this$1.webglEnabled) { return }
            this$1.webGlRendererState = {}
            getWebGlRenderer().initGl(this$1)
        })
    };
    //async initWebGl() {
        //// TODO: this needs to be cancelable too, search other codes for
        //// "mountcancel" to see.
        //await this.mountPromise
        //this.webglEnabled = !!this.getAttribute('webglenabled')
        //if (!this.webglEnabled) return
        //this.webGlRendererState = {}
        //getWebGlRenderer().initGl(this)
    //}

    MotorHTMLScene.prototype._startSizePolling = function _startSizePolling () {
        // NOTE Polling is currently required because there's no other way to do this
        // reliably, not even with MutationObserver. ResizeObserver hasn't
        // landed in browsers yet.
        if (!this._sizePollTask)
            { this._sizePollTask = Motor_defaultExport.addRenderTask(this._checkSize.bind(this)) }
    };

    // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    MotorHTMLScene.prototype._checkSize = function _checkSize () {

        // The scene has a parent by the time this is called (see
        // src/core/Scene#mount where _startSizePolling is called)
        const parent = this.parentNode
        const parentSize = this._parentSize
        const style = getComputedStyle(parent)
        const width = parseFloat(style.width)
        const height = parseFloat(style.height)

        // if we have a size change, trigger parentsizechange
        if (parentSize.x != width || parentSize.y != height) {
            parentSize.x = width
            parentSize.y = height

            this.triggerEvent('parentsizechange', Object.assign({}, parentSize))
        }
    };

    MotorHTMLScene.prototype._makeImperativeCounterpart = function _makeImperativeCounterpart () {
        return new Scene_Scene({
            _motorHtmlCounterpart: this
        })
    };

    /** @override */
    MotorHTMLScene.prototype.getStyles = function getStyles () {
        return scene_style_defaultExport
    };

    MotorHTMLScene.prototype.deinit = function deinit () {
        superclass.prototype.deinit.call(this)

        this.imperativeCounterpart.unmount()
    };

    MotorHTMLScene.prototype._stopSizePolling = function _stopSizePolling () {
        Motor_defaultExport.removeRenderTask(this._sizePollTask)
        this._sizePollTask = null
    };

    return MotorHTMLScene;
}(Observable.mixin(base_DeclarativeBase)));

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Sizeable_Sizeable, scene_MotorHTMLScene)


scene_MotorHTMLScene = document.registerElement('motor-scene', scene_MotorHTMLScene)



// CONCATENATED MODULE: ./src/core/Scene.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_awaitbox_dom_documentReady__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_awaitbox_dom_documentReady___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_awaitbox_dom_documentReady__);

// although Transformable is not used in this file, importing it first prevent
// a cyclical dependeny problem when an App imports Scene before Node (Sizeable
// imports Motor imports Transformable). See:
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
// TODO: write a test that imports public interfaces in every possible
// permutation to detect circular dependency errors.








initImperativeBase()

// Scene is Sizeable, which is currently a subset of Transformable.
const Scene_ParentClass = ImperativeBase_ImperativeBase.mixin(Sizeable_Sizeable)
var Scene_Scene = (function (ParentClass) {
    function Scene(options) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

        ParentClass.call(this, options)

        // NOTE: z size is always 0, since native DOM elements are always flat.
        this._elementParentSize = {x:0, y:0, z:0}

        this._onElementParentSizeChange = function (newSize) {
            this$1._elementParentSize = newSize
            this$1._calcSize()
            this$1._needsToBeRendered()
        }

        this._calcSize()
        this._needsToBeRendered()
    }

    if ( ParentClass ) Scene.__proto__ = ParentClass;
    Scene.prototype = Object.create( ParentClass && ParentClass.prototype );
    Scene.prototype.constructor = Scene;

    Scene.prototype._setDefaultProperties = function _setDefaultProperties () {
        ParentClass.prototype._setDefaultProperties.call(this)

        Object.assign(this._properties, {
            sizeMode: new XYZValues('proportional', 'proportional', 'absolute'),
        })
    };

    Scene.prototype._startOrStopSizePolling = function _startOrStopSizePolling () {
        if (
            this._mounted &&
            (this._properties.sizeMode.x == 'proportional'
            || this._properties.sizeMode.y == 'proportional'
            || this._properties.sizeMode.z == 'proportional')
        ) {
            this._startSizePolling()
        }
        else {
            this._stopSizePolling()
        }
    };

    // observe size changes on the scene element.
    Scene.prototype._startSizePolling = function _startSizePolling () {
        if (!this._elementManager) { return }
        this._elementManager.element._startSizePolling()
        this._elementManager.element.on('parentsizechange', this._onElementParentSizeChange)
    };

    // Don't observe size changes on the scene element.
    Scene.prototype._stopSizePolling = function _stopSizePolling () {
        if (!this._elementManager) { return }
        this._elementManager.element.off('parentsizechange', this._onElementParentSizeChange)
        this._elementManager.element._stopSizePolling()
    };

    /** @override */
    Scene.prototype._getParentSize = function _getParentSize () {
        return this._mounted ? this._elementParentSize : {x:0,y:0,z:0}
    };

    /**
     * @override
     */
    Scene.prototype._makeElement = function _makeElement () {
        return new scene_MotorHTMLScene
    };

    /**
     * Mount the scene into the given target.
     * Resolves the Scene's mountPromise, which can be use to do something once
     * the scene is mounted.
     *
     * @param {string|HTMLElement} [mountPoint=document.body] If a string selector is provided,
     * the mount point will be selected from the DOM. If an HTMLElement is
     * provided, that will be the mount point. If no mount point is provided,
     * the scene will be mounted into document.body.
     */
    Scene.prototype.mount = function mount (mountPoint) {
        var this$1 = this;

        const mountLogic = function () {
            // if no mountPoint was provided, just mount onto the <body> element.
            if (mountPoint === undefined) { mountPoint = document.body }

            // if the user supplied a selector, mount there.
            else if (typeof mountPoint === 'string')
                { mountPoint = document.querySelector(mountPoint) }

            // if we have an actual mount point (the user may have supplied one)
            if (!(mountPoint instanceof window.HTMLElement))
                { throw new Error('Invalid mount point specified in Scene.mount() call. Pass a selector, an actual HTMLElement, or don\'t pass anything to mount to <body>.') }

            if (this$1._mounted) { this$1.unmount() }

            if (mountPoint !== this$1._elementManager.element.parentNode)
                { mountPoint.appendChild(this$1._elementManager.element) }

            this$1._mounted = true

            if (this$1._mountPromise) { this$1._resolveMountPromise() }

            this$1._elementManager.shouldRender()
            this$1._startOrStopSizePolling()
        }

        // Wait for the document to be ready before mounting, otherwise the
        // target mount point might not exist yet when this function is called.
        if (document.readyState == 'loading') { return __WEBPACK_IMPORTED_MODULE_5_awaitbox_dom_documentReady___default()().then(mountLogic) }
        else {
            mountLogic()
            return Promise.resolve()
        }
    };
    //async mount(mountPoint) {
        //// Wait for the document to be ready before mounting, otherwise the
        //// target mount point might not exist yet when this function is called.
        //if (document.readyState == 'loading') await documentReady()

        //// if no mountPoint was provided, just mount onto the <body> element.
        //if (mountPoint === undefined) mountPoint = document.body

        //// if the user supplied a selector, mount there.
        //else if (typeof mountPoint === 'string')
            //mountPoint = document.querySelector(mountPoint)

        //// if we have an actual mount point (the user may have supplied one)
        //if (!(mountPoint instanceof window.HTMLElement))
            //throw new Error('Invalid mount point specified in Scene.mount() call. Pass a selector, an actual HTMLElement, or don\'t pass anything to mount to <body>.')

        //if (this._mounted) this.unmount()

        //if (mountPoint !== this._elementManager.element.parentNode)
            //mountPoint.appendChild(this._elementManager.element)

        //this._mounted = true

        //if (this._mountPromise) this._resolveMountPromise()

        //this._elementManager.shouldRender()
        //this._startOrStopSizePolling()
    //}

    /**
     * Unmount the scene from it's mount point. Resets the Scene's
     * mountPromise.
     */
    Scene.prototype.unmount = function unmount () {
        if (!this._mounted) { return }

        this._elementManager.shouldNotRender()
        this._stopSizePolling()

        if (this._elementManager.element.parentNode)
            { this._elementManager.element.parentNode.removeChild(this._elementManager.element) }

        if (this._mountPromise) { this._rejectMountPromise('mountcancel') }
        this._resetMountPromise()
    };

    return Scene;
}(Scene_ParentClass));

// Here we know that `super` is Sizeable
var Scene_ref = Object.getOwnPropertyDescriptor(Sizeable_Sizeable.prototype, 'sizeMode');
var superSizeModeSet = Scene_ref.set;
var superSizeModeGet = Scene_ref.get;

Object.defineProperties(Scene_Scene.prototype, {

    // When we set the scene's size mode, we should start polling if it has
    // proportional sizing.
    sizeMode: {
        set: function(value) {
            superSizeModeSet.call(this, value)
            this._startOrStopSizePolling()
        },
        get: function() {
            return superSizeModeGet.call(this)
        },
        configurable: true,
        enumerable: true,
    }

})



// CONCATENATED MODULE: ./src/core/ImperativeBase.js






// We explicitly use `var` instead of `let` here because it is hoisted for the
// Node and Scene modules. This, along with the following initImperativeBase
// function, allows the circular dependency between this module and the Node and
// Scene modules to work. For details on why, see
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem.
var ImperativeBase_ImperativeBase

// Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.
initImperativeBase()
function initImperativeBase() {
    if (ImperativeBase_ImperativeBase) { return }

    const instanceofSymbol = Symbol('instanceofSymbol')

    /**
     * The ImperativeBase class is the base class for the Imperative version of the
     * API, for people who chose to take the all-JavaScript approach and who will
     * not use the HTML-based API (infamous/motor-html).
     *
     * In the future when there is an option to disable the HTML-DOM rendering (and
     * render only WebGL, for example) then the imperative API will be the only API
     * available since the HTML API will be turned off as a result of disabling
     * HTML rendering. Disabling both WebGL and HTML won't make sense, as we'll need
     * at least one of those to render with.
     */
    const ImperativeBaseMixin = function (base) {
        const ParentClass = base
        var ImperativeBase = (function (ParentClass) {
            function ImperativeBase(options) {
                var this$1 = this;
                if ( options === void 0 ) options = {};


                // The presence of a _motorHtmlCounterpart argument signifies that
                // the HTML interface is being used, otherwise the imperative interface
                // here is being used. For example, see MotorHTMLNode. This means the
                // Node and MotorHTMLNode classes are coupled together, but it's in the
                // name of the API that we're supporting.
                var _motorHtmlCounterpart = options._motorHtmlCounterpart;

                ParentClass.call(this, options)

                this._willBeRendered = false

                // Here we create the DOM HTMLElement associated with this
                // Imperative-API Node.
                this._elementManager = new ElementManager(
                    _motorHtmlCounterpart || this._makeElement()
                )
                this._elementManager.element._associateImperativeNode(this)

                // For Nodes, true when this Node is added to a parent AND it
                // has an anancestor Scene that is mounted into DOM. For
                // Scenes, true when mounted into DOM.
                this._mounted = false;

                // For Nodes, a promise that resolves when this Node is
                // attached to a tree that has a root Scene TreeNode *and* when
                // that root Scene has been mounted into the DOM. For Scenes,
                // resolves when mounted into DOM.
                this._mountPromise = null
                this._resolveMountPromise = null
                this._rejectMountPromise = null

                this._awaitingMountPromiseToRender = false
                this._waitingForMountConditions = false

                // See Transformable/Sizeable propertychange event.
                this.on('propertychange', function (prop) {
                    if (
                        prop == 'sizeMode' ||
                        prop == 'absoluteSize' ||
                        prop == 'proportionalSize'
                    ) {
                        this$1._calcSize()
                    }

                    this$1._needsToBeRendered()
                })
            }

            if ( ParentClass ) ImperativeBase.__proto__ = ParentClass;
            ImperativeBase.prototype = Object.create( ParentClass && ParentClass.prototype );
            ImperativeBase.prototype.constructor = ImperativeBase;

            var prototypeAccessors = { mountPromise: {},element: {} };

            /**
             * Subclasses are required to override this. It should return the HTML-API
             * counterpart for this Imperative-API instance. See Node or Scene classes
             * for example.
             *
             * @private
             */
            ImperativeBase.prototype._makeElement = function _makeElement () {
                throw new Error('Subclasses need to override ImperativeBase#_makeElement.')
            };

            /**
             * @readonly
             */
            prototypeAccessors.mountPromise.get = function () {
                var this$1 = this;

                if (!this._mountPromise) {
                    this._mountPromise = new Promise(function (resolve, reject) {
                        this$1._resolveMountPromise = resolve
                        this$1._rejectMountPromise = reject
                    })
                }

                if (!this._mounted)
                    { this._waitForMountThenResolveMountPromise() }
                else if (this._mounted)
                    { this._resolveMountPromise() }

                return this._mountPromise
            };

            ImperativeBase.prototype._waitForMountThenResolveMountPromise = function _waitForMountThenResolveMountPromise () {
                // extended in Node or Scene to await for anything that mount
                // depends on.
            };

            /**
             * @readonly
             */
            prototypeAccessors.element.get = function () {
                return this._elementManager.element
            };

            /**
             * @override
             */
            ImperativeBase.prototype.addChild = function addChild (childNode) {
                if (!(childNode instanceof ImperativeBase)) { return }

                // We cannot add Scenes to Nodes, for now.
                if (childNode instanceof Scene_Scene) {
                    throw new Error("\n                        A Scene cannot be added to another Node or Scene (at\n                        least for now). To place a Scene in a Node, just mount\n                        a new Scene onto a MotorHTMLNode with Scene.mount().\n                    ")
                }

                ParentClass.prototype.addChild.call(this, childNode)

                // Pass this parent node's Scene reference (if any, checking this cache
                // first) to the new child and the child's children.
                if (childNode._scene || childNode.scene) {
                    if (childNode._resolveScenePromise)
                        { childNode._resolveScenePromise(childNode._scene) }
                    childNode._giveSceneRefToChildren()
                }

                // Calculate sizing because proportional size might depend on
                // the new parent.
                childNode._calcSize()
                childNode._needsToBeRendered()

                // child should watch the parent for size changes.
                this.on('sizechange', childNode._onParentSizeChange)

                this._elementManager.connectChildElement(childNode)

                return this
            };

            ImperativeBase.prototype.removeChild = function removeChild (childNode, /*private use*/leaveInDom) {
                if (!(childNode instanceof Node_Node)) { return }

                ParentClass.prototype.removeChild.call(this, childNode)

                this.off('sizechange', childNode._onParentSizeChange)

                childNode._resetSceneRef()

                if (childNode._mountPromise) { childNode._rejectMountPromise('mountcancel') }
                if (childNode._mounted) { childNode._elementManager.shouldNotRender() }
                childNode._resetMountPromise()

                if (!leaveInDom)
                    { this._elementManager.disconnectChildElement(childNode) }
            };

            ImperativeBase.prototype._resetMountPromise = function _resetMountPromise () {
                this._mounted = false
                this._mountPromise = null
                this._resolveMountPromise = null
                this._rejectMountPromise = null
                const children = this._children
                for (let i=0, l=children.length; i<l; i+=1) {
                    children[i]._resetMountPromise();
                }
            };

            ImperativeBase.prototype._needsToBeRendered = function _needsToBeRendered () {
                var this$1 = this;

                if (this._awaitingMountPromiseToRender) { return Promise.resolve() }

                const logic = function () {
                    this$1._willBeRendered = true
                    Motor_defaultExport._setNodeToBeRendered(this$1)
                }

                if (!this._mounted) {
                    this._awaitingMountPromiseToRender = true

                    let possibleError = undefined

                    // try
                    return this.mountPromise

                    .then(logic)

                    // catch
                    .catch(function () {
                        if (e == 'mountcancel') { return }
                        else { possibleError = e }
                    })

                    // finally
                    .then(function () {
                        this$1._awaitingMountPromiseToRender = false

                        if (possibleError) { throw possibleError }
                    })
                }

                logic()
                return Promise.resolve()
            };
            //async _needsToBeRendered() {
                //if (this._awaitingMountPromiseToRender) return

                //if (!this._mounted) {
                    //try {
                        //this._awaitingMountPromiseToRender = true
                        //await this.mountPromise
                    //} catch(e) {
                        //if (e == 'mountcancel') return
                        //else throw e
                    //} finally {
                        //this._awaitingMountPromiseToRender = false
                    //}
                //}

                //this._willBeRendered = true
                //Motor._setNodeToBeRendered(this)
            //}

            // This method is used by Motor._renderNodes().
            ImperativeBase.prototype._getAncestorToBeRendered = function _getAncestorToBeRendered () {
                let parent = this._parent

                while (parent) {
                    if (parent._willBeRendered) { return parent }
                    parent = parent._parent
                }

                return false
            };

            ImperativeBase.prototype._render = function _render (timestamp) {
                ParentClass.prototype._render.call(this)
                // applies the transform matrix to the element's style property.
                this._elementManager.applyImperativeNodeProperties(this)
            };

            Object.defineProperties( ImperativeBase.prototype, prototypeAccessors );

            return ImperativeBase;
        }(ParentClass));

        var ref = Object.getOwnPropertyDescriptor(ParentClass.prototype, 'properties');
        var superPropertiesSet = ref.set;

        Object.defineProperties(ImperativeBase.prototype, {

            /**
             * Set all properties of an ImperativeBase instance in one method.
             *
             * @param {Object} properties Properties object - see example.
             *
             * @example
             * node.properties = {
             *   classes: ['open', 'big'],
             * }
             */
            properties: {
                set: function set(properties) {
                    if ( properties === void 0 ) properties = {};

                    superPropertiesSet.call(this, properties)

                    if (properties.classes)
                        { (ref = this._elementManager).setClasses.apply(ref, properties.classes);
                    var ref; }
                },
                configurable: true,
            },
        })

        Object.defineProperty(ImperativeBase, Symbol.hasInstance, {
            value: function(obj) {
                if (this !== ImperativeBase) { return Object.getPrototypeOf(ImperativeBase)[Symbol.hasInstance].call(this, obj) }

                let currentProto = obj

                while(currentProto) {
                    const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                    if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                        { return true }

                    currentProto = Object.getPrototypeOf(currentProto)
                }

                return false
            }
        })

        ImperativeBase[instanceofSymbol] = true

        return ImperativeBase
    }

    ImperativeBase_ImperativeBase = ImperativeBaseMixin(Sizeable_Sizeable)
    ImperativeBase_ImperativeBase.mixin = ImperativeBaseMixin

}



// CONCATENATED MODULE: ./src/core/Node.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_geometry_interfaces__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_geometry_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_geometry_interfaces__);






initImperativeBase()

var Node_Node = (function (superclass) {
    function Node (options) {
        var this$1 = this;
        if ( options === void 0 ) options = {};

        superclass.call(this, options)

        // This was when using my `multiple()` implementation, we could call
        // specific constructors using specific arguments. But, we're using
        // class-factory style mixins for now, so we don't have control over the
        // specific arguments we can pass to the constructors, so we're just
        // using a single `options` parameter in all the constructors.
        //this.callSuperConstructor(Transformable, options)
        //this.callSuperConstructor(TreeNode)
        //this.callSuperConstructor(ImperativeBase)

        this._scene = null // stores a ref to this Node's root Scene.

        // This is an internal promise that resolves when this Node is added to
        // to a scene graph that has a root Scene TreeNode. The resolved value
        // is the root Scene.
        this._scenePromise = null
        this._resolveScenePromise = null

        /**
         * @private
         * This method is defined here in the consructor as an arrow function
         * because parent Nodes pass it to Observable#on and Observable#off. If
         * it were a prototype method, then it would need to be bound when
         * passed to Observable#on, which would require keeping track of the
         * bound function reference in order to be able to pass it to
         * Observable#off later. See ImperativeBase#addChild and
         * ImperativeBase#removeChild.
         */
        this._onParentSizeChange = function () {

            // We only need to recalculate sizing and matrices if this node has
            // properties that depend on parent sizing (proportional size,
            // align, and mountPoint). mountPoint isn't obvious: if this node
            // is proportionally sized, then the mountPoint will depend on the
            // size of this element which depends on the size of this element's
            // parent.
            if (
                this$1._properties.sizeMode.x === "proportional"
                || this$1._properties.sizeMode.y === "proportional"
                || this$1._properties.sizeMode.z === "proportional"

                || this$1._properties.align.x !== 0
                || this$1._properties.align.y !== 0
                || this$1._properties.align.z !== 0
            ) {
                this$1._calcSize()
                this$1._needsToBeRendered()
            }
        }

        this._calcSize()
        this._needsToBeRendered()
    }

    if ( superclass ) Node.__proto__ = superclass;
    Node.prototype = Object.create( superclass && superclass.prototype );
    Node.prototype.constructor = Node;

    var prototypeAccessors = { scene: {} };

    /**
     * @private
     */
    Node.prototype._waitForMountThenResolveMountPromise = function _waitForMountThenResolveMountPromise () {
        var this$1 = this;

        if (this._awaitingScenePromise) { return Promise.resolve() }

        const logic = function () {
            this$1._mounted = true
            this$1._resolveMountPromise()
            this$1._elementManager.shouldRender()
        }

        this._awaitingScenePromise = true

        let possibleError = undefined

        // try
        return this._getScenePromise()
        .then(function () { return this$1._scene.mountPromise; })

        .then(logic)

        // catch
        .catch(function () {
            if (e == 'mountcancel') { return }
            else { possibleError = e }
        })

        // finally
        .then(function () {
            this$1._awaitingScenePromise = false

            if (possibleError) { throw possibleError }
        })
    };
    //async _waitForMountThenResolveMountPromise() {
        //if (this._awaitingScenePromise) return
        //try {
            //this._awaitingScenePromise = true
            //await this._getScenePromise()
            //await this._scene.mountPromise
        //} catch (e) {
            //if (e == 'mountcancel') return
            //else throw e
        //} finally {
            //this._awaitingScenePromise = false
        //}

        //this._mounted = true
        //this._resolveMountPromise()
        //this._elementManager.shouldRender()
    //}

    /**
     * @override
     */
    Node.prototype._makeElement = function _makeElement () {
        return new node_MotorHTMLNode
    };

    /**
     * @private
     * Get a promise for the node's eventual scene.
     */
    Node.prototype._getScenePromise = function _getScenePromise () {
        var this$1 = this;

        if (!this._scenePromise) {
            this._scenePromise = new Promise(function (a, b) {
                this$1._resolveScenePromise = a
            })
        }

        if (this._scene)
            { this._resolveScenePromise() }

        return this._scenePromise
    };

    /**
     * Get the Scene that this Node is in, null if no Scene. This is recursive
     * at first, then cached.
     *
     * This traverses up the scene graph tree starting at this Node and finds
     * the root Scene, if any. It caches the value for performance. If this
     * Node is removed from a parent node with parent.removeChild(), then the
     * cache is invalidated so the traversal can happen again when this Node is
     * eventually added to a new tree. This way, if the scene is cached on a
     * parent Node that we're adding this Node to then we can get that cached
     * value instead of traversing the tree.
     *
     * @readonly
     */
    prototypeAccessors.scene.get = function () {
        // NOTE: this._scene is initally null, created in the constructor.

        // if already cached, return it. Or if no parent, return it (it'll be null).
        if (this._scene || !this._parent) { return this._scene }

        // if the parent node already has a ref to the scene, use that.
        if (this._parent._scene) {
            this._scene = this._parent._scene
        }
        else if (this._parent instanceof Scene_Scene) {
            this._scene = this._parent
        }
        // otherwise call the scene getter on the parent, which triggers
        // traversal up the scene graph in order to find the root scene (null
        // if none).
        else {
            this._scene = this._parent.scene
        }

        return this._scene
    };

    /**
     * @private
     * This method to be called only when this Node has this.scene.
     * Resolves the _scenePromise for all children of the tree of this Node.
     */
    Node.prototype._giveSceneRefToChildren = function _giveSceneRefToChildren () {
        var this$1 = this;

        const children = this._children;
        for (let i=0, l=children.length; i<l; i+=1) {
            const childNode = children[i]
            childNode._scene = this$1._scene
            if (childNode._resolveScenePromise)
                { childNode._resolveScenePromise(childNode._scene) }
            childNode._giveSceneRefToChildren();
        }
    };

    Node.prototype._resetSceneRef = function _resetSceneRef () {
        this._scene = null
        this._scenePromise = null
        this._resolveScenePromise = null
        const children = this._children;
        for (let i=0, l=children.length; i<l; i+=1) {
            children[i]._resetSceneRef();
        }
    };

    Object.defineProperties( Node.prototype, prototypeAccessors );

    return Node;
}(ImperativeBase_ImperativeBase.mixin(Transformable_Transformable)));



// CONCATENATED MODULE: ./src/core/ElementManager.js



/**
 * Manages a DOM element. Exposes a set of recommended APIs for working with
 * DOM efficiently. Currently doesn't do much yet...
 */
var ElementManager = function ElementManager(element) {
    this.element = element
};

/**
 * @param {Array.string} classes An array of class names to add to the
 * managed element.
 *
 * Note: updating class names with `el.classList.add()` won't thrash the
 * layout. See: http://www.html5rocks.com/en/tutorials/speed/animations
 */
ElementManager.prototype.setClasses = function setClasses () {
        var classes = [], len = arguments.length;
        while ( len-- ) classes[ len ] = arguments[ len ];

    if (classes.length) { (ref = this.element.classList).add.apply(ref, classes) }
    return this
        var ref;
};

/**
 * Apply a style property to the element.
 *
 * @private
 * @param  {string} property The CSS property we will a apply.
 * @param  {string} valueThe value the CSS property wil have.
 */
ElementManager.prototype.applyStyle = function applyStyle (property, value) {
    this.element.style[property] = value
};

ElementManager.prototype.addChild = function addChild (childElementManager) {
    this.element.appendChild(childElementManager.element)
};

ElementManager.prototype.removeChild = function removeChild (childElementManager) {
    // This conditional check is needed incase the element was already
    // removed from the HTML-API side.
    if (childElementManager.element.parentNode === this.element)
        { this.element.removeChild(childElementManager.element) }
};

ElementManager.prototype.connectChildElement = function connectChildElement (childImperativeNode) {
    if (

        // When using the imperative API, this statement is
        // true, so the DOM elements need to be connected.
        !childImperativeNode._elementManager.element.parentNode

        // This condition is irrelevant when strictly using the
        // imperative API. However, it is possible that when
        // using the HTML API that the HTML-API node can be placed
        // somewhere that isn't another HTML-API node, and the
        // imperative Node can be gotten and used to add the
        // node to another imperative Node. In this case, the
        // HTML-API node will be added to the proper HTMLparent.
        || (childImperativeNode._elementManager.element.parentElement &&
            childImperativeNode._elementManager.element.parentElement !== this.element)

        // When an HTML-API node is already child of the
        // relevant parent, or it is child of a shadow root of
        // the relevant parent, there there's nothing to do,
        // everything is already as expected, so the following
        // conditional body is skipped.
    ) {
        this.addChild(childImperativeNode._elementManager)
    }
};

ElementManager.prototype.disconnectChildElement = function disconnectChildElement (childImperativeNode) {
    // If DeclarativeBase#removeChild was called first, we don't need to
    // call this again.
    if (!childImperativeNode._elementManager.element.parentNode) { return }

    this.removeChild(childImperativeNode._elementManager)
};

/**
 * Apply the DOMMatrix value to the style of this Node's element.
 */
ElementManager.prototype.applyTransform = function applyTransform (domMatrix) {
    var cssMatrixString = "matrix3d(\n            " + (domMatrix.m11) + ",\n            " + (domMatrix.m12) + ",\n            " + (domMatrix.m13) + ",\n            " + (domMatrix.m14) + ",\n            " + (domMatrix.m21) + ",\n            " + (domMatrix.m22) + ",\n            " + (domMatrix.m23) + ",\n            " + (domMatrix.m24) + ",\n            " + (domMatrix.m31) + ",\n            " + (domMatrix.m32) + ",\n            " + (domMatrix.m33) + ",\n            " + (domMatrix.m34) + ",\n            " + (domMatrix.m41) + ",\n            " + (domMatrix.m42) + ",\n            " + (domMatrix.m43) + ",\n            " + (domMatrix.m44) + "\n        )";

    this.applyStyle('transform', cssMatrixString)
};

/**
 * [applySize description]
 */
ElementManager.prototype.applySize = function applySize (size) {
    var x = size.x;
        var y = size.y;

    this.applyStyle('width', (x + "px"))
    this.applyStyle('height', (y + "px"))

    // NOTE: we ignore the Z axis on elements, since they are flat.
};

ElementManager.prototype.applyOpacity = function applyOpacity (opacity) {
    this.applyStyle('opacity', opacity)
};

ElementManager.prototype.applyImperativeNodeProperties = function applyImperativeNodeProperties (node) {

    // Only Node is Transformable
    if (node instanceof Node_Node) {
        this.applyOpacity(node._properties.opacity)
        this.applyTransform(node._properties.transform)
    }

    // But both Node and Scene are Sizeable
    this.applySize(node._calculatedSize)
};

ElementManager.prototype.shouldRender = function shouldRender () {
        var this$1 = this;

    const task = Motor_defaultExport.addRenderTask(function () {
        this$1.applyStyle('display', 'block')
        Motor_defaultExport.removeRenderTask(task)
    })
};

ElementManager.prototype.shouldNotRender = function shouldNotRender () {
        var this$1 = this;

    const task = Motor_defaultExport.addRenderTask(function () {
        this$1.applyStyle('display', 'none')
        Motor_defaultExport.removeRenderTask(task)
    })
};



// CONCATENATED MODULE: ./src/core/index.js
var core_namespaceObject = {};
__webpack_require__.d(core_namespaceObject, "ElementManager", function() { return ElementManager; });
__webpack_require__.d(core_namespaceObject, "Motor", function() { return Motor_defaultExport; });
__webpack_require__.d(core_namespaceObject, "Node", function() { return Node_Node; });
__webpack_require__.d(core_namespaceObject, "Scene", function() { return Scene_Scene; });
__webpack_require__.d(core_namespaceObject, "Sizeable", function() { return Sizeable_Sizeable; });
__webpack_require__.d(core_namespaceObject, "Transformable", function() { return Transformable_Transformable; });
__webpack_require__.d(core_namespaceObject, "TreeNode", function() { return TreeNode; });
__webpack_require__.d(core_namespaceObject, "XYZValues", function() { return XYZValues; });
__webpack_require__.d(core_namespaceObject, "Utility", function() { return Utility_namespaceObject; });













// CONCATENATED MODULE: ./src/components/PushPaneLayout.js


var PushPaneLayout = (function (Node) {
    function PushPaneLayout() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        console.log(' -- PushPaneLayout created')
        Node.apply(this, args)
    }

    if ( Node ) PushPaneLayout.__proto__ = Node;
    PushPaneLayout.prototype = Object.create( Node && Node.prototype );
    PushPaneLayout.prototype.constructor = PushPaneLayout;

    return PushPaneLayout;
}(Node_Node));

/* harmony default export */ var PushPaneLayout_defaultExport = (PushPaneLayout);

// CONCATENATED MODULE: ./src/html/push-pane-layout.js



var push_pane_layout_MotorHTMLPushPaneLayout = (function (MotorHTMLNode) {
    function MotorHTMLPushPaneLayout () {
        MotorHTMLNode.apply(this, arguments);
    }

    if ( MotorHTMLNode ) MotorHTMLPushPaneLayout.__proto__ = MotorHTMLNode;
    MotorHTMLPushPaneLayout.prototype = Object.create( MotorHTMLNode && MotorHTMLNode.prototype );
    MotorHTMLPushPaneLayout.prototype.constructor = MotorHTMLPushPaneLayout;

    MotorHTMLPushPaneLayout.prototype.createdCallback = function createdCallback () {
        console.log(' -- MotorHTMLPushPaneLayout created')
        MotorHTMLNode.prototype.createdCallback.call(this)
    };

    // @override
    MotorHTMLPushPaneLayout.prototype._makeImperativeCounterpart = function _makeImperativeCounterpart () {
        return new PushPaneLayout_defaultExport({}, this)
    };

    return MotorHTMLPushPaneLayout;
}(node_MotorHTMLNode));



// CONCATENATED MODULE: ./src/html/index.js
var html_namespaceObject = {};
__webpack_require__.d(html_namespaceObject, "MotorHTMLBase", function() { return base_DeclarativeBase; });
__webpack_require__.d(html_namespaceObject, "MotorHTMLNode", function() { return node_MotorHTMLNode; });
__webpack_require__.d(html_namespaceObject, "MotorHTMLPushPaneLayout", function() { return push_pane_layout_MotorHTMLPushPaneLayout; });
__webpack_require__.d(html_namespaceObject, "MotorHTMLScene", function() { return scene_MotorHTMLScene; });
__webpack_require__.d(html_namespaceObject, "WebComponent", function() { return WebComponentMixin; });








// CONCATENATED MODULE: ./src/components/Cube.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_army_knife_forLength__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_army_knife_forLength___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_army_knife_forLength__);
/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */



/**
 * A scenegraph tree that lays things out in a cube form.
 *
 * XXX: Rename to CubeLayout?
 *
 * @class Cube
 * @extends Node
 */
var Cube_Cube = (function (Node) {
    function Cube(size, options) {
        var this$1 = this;


        // cubes, the same size on all sides
        Node.call(this, Object.assign({}, {absoluteSize: [size, size, size]}, options));

        //GenericSync.register({
            //mouse: MouseSync,
            //touch: TouchSync
        //});

        this.size = size;
        this.sides = [];

        __WEBPACK_IMPORTED_MODULE_0_army_knife_forLength___default()(6, function (n) { return this$1._createCubeSide(n); });
    }

    if ( Node ) Cube.__proto__ = Node;
    Cube.prototype = Object.create( Node && Node.prototype );
    Cube.prototype.constructor = Cube;

    /**
     * Creates the 6 sides of the cube (the leafnodes of the scenegraph).
     *
     * @private
     * @param {Number} index The index (a integer between 0 and 5) that specifies which side to create.
     */
    Cube.prototype._createCubeSide = function _createCubeSide (index) {
        const rotator = new Node({
            align: [0.5, 0.5],
            mountPoint: [0.5, 0.5],
        })

        const side = new Node({
            align: [0.5, 0.5],
            mountPoint: [0.5, 0.5],
            absoluteSize: [this.size, this.size],
        })

        this.sides.push(side)

        rotator.addChild(side)

        // XXX: make a new GenericSync-like thing?
        //const sync = new GenericSync(['mouse','touch']);
        //side.pipe(sync);
        //sync.pipe(this.options.handler);

        // rotate and place each side.
        if (index < 4) // 4 sides
            { rotator.rotation.y = 90 * index }
        else // top/bottom
            { rotator.rotation.x = 90 * ( index % 2 ? -1 : 1 ) }

        side.position.z = this.size / 2

        this.addChild(rotator)
    };

    /**
     * Set the content for the sides of the cube.
     *
     * @param {Array} content An array containing [Node](#infamous/motor/Node)
     * instances to place in the cube sides. Only the first 6 items are used,
     * the rest are ignored.
     */
    Cube.prototype.setContent = function setContent (content) {
        var this$1 = this;

        __WEBPACK_IMPORTED_MODULE_0_army_knife_forLength___default()(6, function (index) {
            //this.cubeSideNodes[index].set(null); // TODO: how do we erase previous content?
            this$1.sides[index].addChild(content[index])
        })
        return this;
    };

    return Cube;
}(Node_Node));
/* harmony default export */ var Cube_defaultExport = (Cube_Cube);

// CONCATENATED MODULE: ./src/components/index.js
var components_namespaceObject = {};
__webpack_require__.d(components_namespaceObject, "Cube", function() { return Cube_defaultExport; });
__webpack_require__.d(components_namespaceObject, "PushPaneLayout", function() { return PushPaneLayout_defaultExport; });





// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Calendar", function() { return Calendar_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "DoubleSidedPlane", function() { return DoubleSidedPlane_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Grid", function() { return Grid_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Molecule", function() { return Molecule_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Plane", function() { return Plane_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PushMenuLayout", function() { return PushMenuLayout_defaultExport; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "utils", function() { return utils_namespaceObject; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "core", function() { return core_namespaceObject; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "html", function() { return html_namespaceObject; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "components", function() { return components_namespaceObject; });














const version = '17.0.4'
/* harmony export (immutable) */ __webpack_exports__["version"] = version;



/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
/*eslint-disable new-cap */
    var Utility = __webpack_require__(30);

    /**
     * Transition meta-method to support transitioning multiple
     *   values with scalar-only methods.
     *
     *
     * @class MultipleTransition
     * @constructor
     *
     * @param {Object} method Transionable class to multiplex
     */
    function MultipleTransition(method) {
        this.method = method;
        this._instances = [];
        this.state = [];
    }

    MultipleTransition.SUPPORTS_MULTIPLE = true;

    /**
     * Get the state of each transition.
     *
     * @method get
     *
     * @return state {Number|Array} state array
     */
    MultipleTransition.prototype.get = function get() {
        for (var i = 0; i < this._instances.length; i++) {
            this.state[i] = this._instances[i].get();
        }
        return this.state;
    };

    /**
     * Set the end states with a shared transition, with optional callback.
     *
     * @method set
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var _allCallback = Utility.after(endState.length, callback);
        for (var i = 0; i < endState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].set(endState[i], transition, _allCallback);
        }
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     *
     * @param  {Number|Array} startState Start state
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        for (var i = 0; i < startState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].reset(startState[i]);
        }
    };

    module.exports = MultipleTransition;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */


    /**
     *
     * A state maintainer for a smooth transition between
     *    numerically-specified states.  Example numeric states include floats or
     *    Transfornm objects.
     *
     *    An initial state is set with the constructor or set(startValue). A
     *    corresponding end state and transition are set with set(endValue,
     *    transition). Subsequent calls to set(endValue, transition) begin at
     *    the last state. Calls to get(timestamp) provide the _interpolated state
     *    along the way.
     *
     *   Note that there is no event loop here - calls to get() are the only way
     *    to find out state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class TweenTransition
     * @constructor
     *
     * @param {Object} options TODO
     *    beginning state
     */
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._startTime = 0;
        this._startValue = 0;
        this._updateTime = 0;
        this._endValue = 0;
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._callback = undefined;
        this.state = 0;
        this.velocity = undefined;
    }

    /**
     * Transition curves mapping independent variable t from domain [0,1] to a
     *    range within [0,1]. Includes functions 'linear', 'easeIn', 'easeOut',
     *    'easeInOut', 'easeOutBounce', 'spring'.
     *
     * @property {object} Curve
     * @final
     */
    TweenTransition.Curves = {
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

    TweenTransition.SUPPORTS_MULTIPLE = true;
    TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0 /* considered only if positive */
    };

    var registeredCurves = {};

    /**
     * Add "unit" curve to internal dictionary of registered curves.
     *
     * @method registerCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @param {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     * @return {boolean} false if key is taken, else true
     */
    TweenTransition.registerCurve = function registerCurve(curveName, curve) {
        if (!registeredCurves[curveName]) {
            registeredCurves[curveName] = curve;
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Remove object with key "curveName" from internal dictionary of registered
     *    curves.
     *
     * @method unregisterCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {boolean} false if key has no dictionary value
     */
    TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
        if (registeredCurves[curveName]) {
            delete registeredCurves[curveName];
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Retrieve function with key "curveName" from internal dictionary of
     *    registered curves. Default curves are defined in the
     *    TweenTransition.Curves array, where the values represent
     *    unitCurve functions.
     *
     * @method getCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurve = function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    };

    /**
     * Retrieve all available curves.
     *
     * @method getCurves
     *
     * @static
     *
     * @return {object} curve functions of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurves = function getCurves() {
        return registeredCurves;
    };

     // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _clone(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Array) return obj.slice(0);
            else return Object.create(obj);
        }
        else return obj;
    }

    // Fill in missing properties in "transition" with those in defaultTransition, and
    //   convert internal named curve to function object, returning as new
    //   object.
    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        if (defaultTransition.duration) result.duration = defaultTransition.duration;
        if (defaultTransition.speed) result.speed = defaultTransition.speed;
        if (transition instanceof Object) {
            if (transition.duration !== undefined) result.duration = transition.duration;
            if (transition.curve) result.curve = transition.curve;
            if (transition.speed) result.speed = transition.speed;
        }
        if (typeof result.curve === 'string') result.curve = TweenTransition.getCurve(result.curve);
        return result;
    }

    /**
     * Set internal options, overriding any default options.
     *
     * @method setOptions
     *
     *
     * @param {Object} options options object
     * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
     * @param {Number} [options.duration] duration in ms
     * @param {Number} [options.speed] speed in pixels per ms
     */
    TweenTransition.prototype.setOptions = function setOptions(options) {
        if (options.curve !== undefined) this.options.curve = options.curve;
        if (options.duration !== undefined) this.options.duration = options.duration;
        if (options.speed !== undefined) this.options.speed = options.speed;
    };

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
     *    end state to which we _interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    TweenTransition.prototype.set = function set(endValue, transition, callback) {
        if (!transition) {
            this.reset(endValue);
            if (callback) callback();
            return;
        }

        this._startValue = _clone(this.get());
        transition = _normalize(transition, this.options);
        if (transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed;
            }
            else {
                transition.duration = Math.abs(endValue - startValue) / transition.speed;
            }
        }

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
     *
     * @param {number|Array.Number|Object.<number, number>} startValue
     *    starting state
     * @param {number} startVelocity
     *    starting velocity
     */
    TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        this.state = _clone(startValue);
        this.velocity = _clone(startVelocity);
        this._startTime = 0;
        this._duration = 0;
        this._updateTime = 0;
        this._startValue = this.state;
        this._startVelocity = this.velocity;
        this._endValue = this.state;
        this._active = false;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     *
     * @returns {Number} velocity
     */
    TweenTransition.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    _interpolated to this point in time.
     */
    TweenTransition.prototype.get = function get(timestamp) {
        this.update(timestamp);
        return this.state;
    };

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity;
        var eps = 1e-7;
        var speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++){
                if (typeof current[i] === 'number')
                    velocity[i] = speed * (current[i] - start[i]) / duration;
                else
                    velocity[i] = 0;
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

    /**
     * Update internal state to the provided timestamp. This may invoke the last
     *    callback and begin a new action.
     *
     * @method update
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     */
    TweenTransition.prototype.update = function update(timestamp) {
        if (!this._active) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return;
        }

        if (!timestamp) timestamp = Date.now();
        if (this._updateTime >= timestamp) return;
        this._updateTime = timestamp;

        var timeSinceStart = timestamp - this._startTime;
        if (timeSinceStart >= this._duration) {
            this.state = this._endValue;
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
            this._active = false;
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
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     *
     * @return {boolean}
     */
    TweenTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     *
     */
    TweenTransition.prototype.halt = function halt() {
        this.reset(this.get());
    };

    // Register all the default curves
    TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
    TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
    TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
    TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
    TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
    TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);

    TweenTransition.customCurve = function customCurve(v1, v2) {
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    };

    module.exports = TweenTransition;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var Transform = __webpack_require__(2);

    /**
     *
     * This object translates the rendering instructions ("render specs")
     *   that renderable components generate into document update
     *   instructions ("update specs").  Private.
     *
     * @private
     * @class SpecParser
     * @constructor
     */
    function SpecParser() {
        this.result = {};
    }
    SpecParser._instance = new SpecParser();

    /**
     * Convert a render spec coming from the context's render chain to an
     *    update spec for the update chain. This is the only major entry point
     *    for a consumer of this class.
     *
     * @method parse
     * @static
     * @private
     *
     * @param {renderSpec} spec input render spec
     * @param {Object} context context to do the parse in
     * @return {Object} the resulting update spec (if no callback
     *   specified, else none)
     */
    SpecParser.parse = function parse(spec, context) {
        return SpecParser._instance.parse(spec, context);
    };

    /**
     * Convert a renderSpec coming from the context's render chain to an update
     *    spec for the update chain. This is the only major entrypoint for a
     *    consumer of this class.
     *
     * @method parse
     *
     * @private
     * @param {renderSpec} spec input render spec
     * @param {Context} context
     * @return {updateSpec} the resulting update spec
     */
    SpecParser.prototype.parse = function parse(spec, context) {
        this.reset();
        this._parseSpec(spec, context, Transform.identity);
        return this.result;
    };

    /**
     * Prepare SpecParser for re-use (or first use) by setting internal state
     *  to blank.
     *
     * @private
     * @method reset
     */
    SpecParser.prototype.reset = function reset() {
        this.result = {};
    };

    // Multiply matrix M by vector v
    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    var _zeroZero = [0, 0];

    // From the provided renderSpec tree, recursively compose opacities,
    //    origins, transforms, and sizes corresponding to each surface id from
    //    the provided renderSpec tree structure. On completion, those
    //    properties of 'this' object should be ready to use to build an
    //    updateSpec.
    SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;

        if (typeof spec === 'number') {
            id = spec;
            transform = parentContext.transform;
            align = parentContext.align || _zeroZero;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            };
        }
        else if (!spec) { // placed here so 0 will be cached earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                this._parseSpec(spec[i], parentContext, sizeContext);
            }
        }
        else {
            target = spec.target;
            transform = parentContext.transform;
            opacity = parentContext.opacity;
            origin = parentContext.origin;
            align = parentContext.align;
            size = parentContext.size;
            var nextSizeContext = sizeContext;

            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;
            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);
            if (spec.origin) {
                origin = spec.origin;
                nextSizeContext = parentContext.transform;
            }
            if (spec.align) align = spec.align;

            if (spec.size || spec.proportions) {
                var parentSize = size;
                size = [size[0], size[1]];

                if (spec.size) {
                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
                }

                if (spec.proportions) {
                    if (spec.proportions[0] !== undefined) size[0] = size[0] * spec.proportions[0];
                    if (spec.proportions[1] !== undefined) size[1] = size[1] * spec.proportions[1];
                }

                if (parentSize) {
                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                }

                nextSizeContext = parentContext.transform;
                origin = null;
                align = null;
            }

            this._parseSpec(target, {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size
            }, nextSizeContext);
        }
    };

    module.exports = SpecParser;


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    /**
     * EventEmitter represents a channel for events.
     *
     * @class EventEmitter
     * @constructor
     */
    function EventEmitter() {
        this.listeners = {};
        this._owner = this;
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventEmitter.prototype.emit = function emit(type, event) {
        var handlers = this.listeners[type];
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this._owner, event);
            }
        }
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
   EventEmitter.prototype.on = function on(type, handler) {
        if (!(type in this.listeners)) this.listeners[type] = [];
        var index = this.listeners[type].indexOf(handler);
        if (index < 0) this.listeners[type].push(handler);
        return this;
    };

    /**
     * Alias for "on".
     * @method addListener
     */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

   /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventEmitter} this
     */
    EventEmitter.prototype.removeListener = function removeListener(type, handler) {
        var listener = this.listeners[type];
        if (listener !== undefined) {
            var index = listener.indexOf(handler);
            if (index >= 0) listener.splice(index, 1);
        }
        return this;
    };

    /**
     * Call event handlers with this set to owner.
     *
     * @method bindThis
     *
     * @param {Object} owner object this EventEmitter belongs to
     */
    EventEmitter.prototype.bindThis = function bindThis(owner) {
        this._owner = owner;
    };

    module.exports = EventEmitter;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */


    /**
     * The singleton object initiated upon process
     *   startup which manages all active Context instances, runs
     *   the render dispatch loop, and acts as a listener and dispatcher
     *   for events.  All methods are therefore static.
     *
     *   On static initialization, window.requestAnimationFrame is called with
     *     the event loop function.
     *
     *   Note: Any window in which Engine runs will prevent default
     *     scrolling behavior on the 'touchmove' event.
     *
     * @static
     * @class Engine
     */
    var Context = __webpack_require__(65);
    var EventHandler = __webpack_require__(3);
    var OptionsManager = __webpack_require__(36);

    var Engine = {};

    var contexts = [];

    var nextTickQueue = [];

    var currentFrame = 0;
    var nextTickFrame = 0;

    var deferQueue = [];

    var lastTime = Date.now();
    var frameTime;
    var frameTimeLimit;
    var loopEnabled = true;
    var eventForwarders = {};
    var eventHandler = new EventHandler();

    var options = {
        containerType: 'div',
        containerClass: 'famous-container',
        fpsCap: undefined,
        runLoop: true,
        appMode: true
    };
    var optionsManager = new OptionsManager(options);

    /** @const */
    var MAX_DEFER_FRAME_TIME = 10;

    /**
     * Inside requestAnimationFrame loop, step() is called, which:
     *   calculates current FPS (throttling loop if it is over limit set in setFPSCap),
     *   emits dataless 'prerender' event on start of loop,
     *   calls in order any one-shot functions registered by nextTick on last loop,
     *   calls Context.update on all Context objects registered,
     *   and emits dataless 'postrender' event on end of loop.
     *
     * @static
     * @private
     * @method step
     */
    Engine.step = function step() {
        currentFrame++;
        nextTickFrame = currentFrame;

        var currentTime = Date.now();

        // skip frame if we're over our framerate cap
        if (frameTimeLimit && currentTime - lastTime < frameTimeLimit) return;

        var i = 0;

        frameTime = currentTime - lastTime;
        lastTime = currentTime;

        eventHandler.emit('prerender');

        // empty the queue
        var numFunctions = nextTickQueue.length;
        while (numFunctions--) (nextTickQueue.shift())(currentFrame);

        // limit total execution time for deferrable functions
        while (deferQueue.length && (Date.now() - currentTime) < MAX_DEFER_FRAME_TIME) {
            deferQueue.shift().call(this);
        }

        for (i = 0; i < contexts.length; i++) contexts[i].update();

        eventHandler.emit('postrender');
    };

    // engage requestAnimationFrame
    function loop() {
        if (options.runLoop) {
            Engine.step();
            window.requestAnimationFrame(loop);
        }
        else loopEnabled = false;
    }
    window.requestAnimationFrame(loop);

    //
    // Upon main document window resize (unless on an "input" HTML element):
    //   scroll to the top left corner of the window,
    //   and for each managed Context: emit the 'resize' event and update its size.
    // @param {Object=} event document event
    //
    function handleResize(event) {
        for (var i = 0; i < contexts.length; i++) {
            contexts[i].emit('resize');
        }
        eventHandler.emit('resize');
    }
    window.addEventListener('resize', handleResize, false);
    handleResize();

    /**
     * Initialize famous for app mode
     *
     * @static
     * @private
     * @method initialize
     */
    function initialize() {
        // prevent scrolling via browser
        window.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, true);

        addRootClasses();
    }
    var initialized = false;

    function addRootClasses() {
        if (!document.body) {
            Engine.nextTick(addRootClasses);
            return;
        }

        document.body.classList.add('famous-root');
        document.documentElement.classList.add('famous-root');
    }

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Engine.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(Engine);
        else return eventHandler.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Engine.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(Engine);
        else return eventHandler.unpipe(target);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @static
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Engine.on = function on(type, handler) {
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);

            addEngineListener(type, eventForwarders[type]);
        }
        return eventHandler.on(type, handler);
    };

    function addEngineListener(type, forwarder) {
        if (!document.body) {
            Engine.nextTick(addEventListener.bind(this, type, forwarder));
            return;
        }

        document.body.addEventListener(type, forwarder);
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Engine.emit = function emit(type, event) {
        return eventHandler.emit(type, event);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @static
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Engine.removeListener = function removeListener(type, handler) {
        return eventHandler.removeListener(type, handler);
    };

    /**
     * Return the current calculated frames per second of the Engine.
     *
     * @static
     * @method getFPS
     *
     * @return {Number} calculated fps
     */
    Engine.getFPS = function getFPS() {
        return 1000 / frameTime;
    };

    /**
     * Set the maximum fps at which the system should run. If internal render
     *    loop is called at a greater frequency than this FPSCap, Engine will
     *    throttle render and update until this rate is achieved.
     *
     * @static
     * @method setFPSCap
     *
     * @param {Number} fps maximum frames per second
     */
    Engine.setFPSCap = function setFPSCap(fps) {
        frameTimeLimit = Math.floor(1000 / fps);
    };

    /**
     * Return engine options.
     *
     * @static
     * @method getOptions
     * @param {string} key
     * @return {Object} engine options
     */
    Engine.getOptions = function getOptions(key) {
        return optionsManager.getOptions(key);
    };

    /**
     * Set engine options
     *
     * @static
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.fpsCap]  maximum fps at which the system should run
     * @param {boolean} [options.runLoop=true] whether the run loop should continue
     * @param {string} [options.containerType="div"] type of container element.  Defaults to 'div'.
     * @param {string} [options.containerClass="famous-container"] type of container element.  Defaults to 'famous-container'.
     */
    Engine.setOptions = function setOptions(options) {
        return optionsManager.setOptions.apply(optionsManager, arguments);
    };

    /**
     * Creates a new Context for rendering and event handling with
     *    provided document element as top of each tree. This will be tracked by the
     *    process-wide Engine.
     *
     * @static
     * @method createContext
     *
     * @param {Node} el will be top of Famo.us document element tree
     * @return {Context} new Context within el
     */
    Engine.createContext = function createContext(el) {
        if (!initialized && options.appMode) Engine.nextTick(initialize);

        var needMountContainer = false;
        if (!el) {
            el = document.createElement(options.containerType);
            el.classList.add(options.containerClass);
            needMountContainer = true;
        }

        var context = new Context(el);
        Engine.registerContext(context);

        if (needMountContainer) mount(context, el);

        return context;
    };

    function mount(context, el) {
        if (!document.body) {
            Engine.nextTick(mount.bind(this, context, el));
            return;
        }

        document.body.appendChild(el);
        context.emit('resize');
    }

    /**
     * Registers an existing context to be updated within the run loop.
     *
     * @static
     * @method registerContext
     *
     * @param {Context} context Context to register
     * @return {FamousContext} provided context
     */
    Engine.registerContext = function registerContext(context) {
        contexts.push(context);
        return context;
    };

    /**
     * Returns a list of all contexts.
     *
     * @static
     * @method getContexts
     * @return {Array} contexts that are updated on each tick
     */
    Engine.getContexts = function getContexts() {
        return contexts;
    };

    /**
     * Removes a context from the run loop. Note: this does not do any
     *     cleanup.
     *
     * @static
     * @method deregisterContext
     *
     * @param {Context} context Context to deregister
     */
    Engine.deregisterContext = function deregisterContext(context) {
        var i = contexts.indexOf(context);
        if (i >= 0) contexts.splice(i, 1);
    };

    /**
     * Queue a function to be executed on the next tick of the
     *    Engine.
     *
     * @static
     * @method nextTick
     *
     * @param {function(Object)} fn function accepting window object
     */
    Engine.nextTick = function nextTick(fn) {
        nextTickQueue.push(fn);
    };

    /**
     * Queue a function to be executed sometime soon, at a time that is
     *    unlikely to affect frame rate.
     *
     * @static
     * @method defer
     *
     * @param {Function} fn
     */
    Engine.defer = function defer(fn) {
        deferQueue.push(fn);
    };

    optionsManager.on('change', function(data) {
        if (data.id === 'fpsCap') Engine.setFPSCap(data.value);
        else if (data.id === 'runLoop') {
            // kick off the loop only if it was stopped
            if (!loopEnabled && data.value) {
                loopEnabled = true;
                window.requestAnimationFrame(loop);
            }
        }
    });

    module.exports = Engine;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var RenderNode = __webpack_require__(34);
    var EventHandler = __webpack_require__(3);
    var ElementAllocator = __webpack_require__(66);
    var Transform = __webpack_require__(2);
    var Transitionable = __webpack_require__(8);

    var _zeroZero = [0, 0];
    var usePrefix = !('perspective' in document.documentElement.style);

    function _getElementSize() {
        var element = this.container;
        return [element.clientWidth, element.clientHeight];
    }

    var _setPerspective = usePrefix ? function(element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
    } : function(element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
    };

    /**
     * The top-level container for a Famous-renderable piece of the document.
     *   It is directly updated by the process-wide Engine object, and manages one
     *   render tree root, which can contain other renderables.
     *
     * @class Context
     * @constructor
     * @private
     * @param {Node} container Element in which content will be inserted
     */
    function Context(container) {
        this.container = container;
        this._allocator = new ElementAllocator(container);

        this._node = new RenderNode();
        this._eventOutput = new EventHandler();
        this._size = _getElementSize.call(this);

        this._perspectiveState = new Transitionable(0);
        this._perspective = undefined;

        this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _zeroZero,
            align: _zeroZero,
            size: this._size
        };

        this._eventOutput.on('resize', function() {
            this.setSize(_getElementSize.call(this));
        }.bind(this));

    }

    // Note: Unused
    Context.prototype.getAllocator = function getAllocator() {
        return this._allocator;
    };

    /**
     * Add renderables to this Context's render tree.
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    Context.prototype.add = function add(obj) {
        return this._node.add(obj);
    };

    /**
     * Move this Context to another containing document element.
     *
     * @method migrate
     *
     * @param {Node} container Element to which content will be migrated
     */
    Context.prototype.migrate = function migrate(container) {
        if (container === this.container) return;
        this.container = container;
        this._allocator.migrate(container);
    };

    /**
     * Gets viewport size for Context.
     *
     * @method getSize
     *
     * @return {Array.Number} viewport size as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Sets viewport size for Context.
     *
     * @method setSize
     *
     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
     */
    Context.prototype.setSize = function setSize(size) {
        if (!size) size = _getElementSize.call(this);
        this._size[0] = size[0];
        this._size[1] = size[1];
    };

    /**
     * Commit this Context's content changes to the document.
     *
     * @private
     * @method update
     * @param {Object} contextParameters engine commit specification
     */
    Context.prototype.update = function update(contextParameters) {
        if (contextParameters) {
            if (contextParameters.transform) this._nodeContext.transform = contextParameters.transform;
            if (contextParameters.opacity) this._nodeContext.opacity = contextParameters.opacity;
            if (contextParameters.origin) this._nodeContext.origin = contextParameters.origin;
            if (contextParameters.align) this._nodeContext.align = contextParameters.align;
            if (contextParameters.size) this._nodeContext.size = contextParameters.size;
        }
        var perspective = this._perspectiveState.get();
        if (perspective !== this._perspective) {
            _setPerspective(this.container, perspective);
            this._perspective = perspective;
        }

        this._node.commit(this._nodeContext);
    };

    /**
     * Get current perspective of this context in pixels.
     *
     * @method getPerspective
     * @return {Number} depth perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspectiveState.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param {Number} perspective in pixels
     * @param {Object} [transition] Transitionable object for applying the change
     * @param {function(Object)} callback function called on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Context.prototype.emit = function emit(type, event) {
        return this._eventOutput.emit(type, event);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Context.prototype.on = function on(type, handler) {
        return this._eventOutput.on(type, handler);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Context.prototype.removeListener = function removeListener(type, handler) {
        return this._eventOutput.removeListener(type, handler);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Context.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Context.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    module.exports = Context;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */


    /**
     * Internal helper object to Context that handles the process of
     *   creating and allocating DOM elements within a managed div.
     *   Private.
     *
     * @class ElementAllocator
     * @constructor
     * @private
     * @param {Node} container document element in which Famo.us content will be inserted
     */
    function ElementAllocator(container) {
        if (!container) container = document.createDocumentFragment();
        this.container = container;
        this.detachedNodes = {};
        this.nodeCount = 0;
    }

    /**
     * Move the document elements from their original container to a new one.
     *
     * @private
     * @method migrate
     *
     * @param {Node} container document element to which Famo.us content will be migrated
     */
    ElementAllocator.prototype.migrate = function migrate(container) {
        var oldContainer = this.container;
        if (container === oldContainer) return;

        if (oldContainer instanceof DocumentFragment) {
            container.appendChild(oldContainer);
        }
        else {
            while (oldContainer.hasChildNodes()) {
                container.appendChild(oldContainer.firstChild);
            }
        }

        this.container = container;
    };

    /**
     * Allocate an element of specified type from the pool.
     *
     * @private
     * @method allocate
     *
     * @param {string} type type of element, e.g. 'div'
     * @return {Node} allocated document element
     */
    ElementAllocator.prototype.allocate = function allocate(type) {
        type = type.toLowerCase();
        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
        var nodeStore = this.detachedNodes[type];
        var result;
        if (nodeStore.length > 0) {
            result = nodeStore.pop();
        }
        else {
            result = document.createElement(type);
            this.container.appendChild(result);
        }
        this.nodeCount++;
        return result;
    };

    /**
     * De-allocate an element of specified type to the pool.
     *
     * @private
     * @method deallocate
     *
     * @param {Node} element document element to deallocate
     */
    ElementAllocator.prototype.deallocate = function deallocate(element) {
        var nodeType = element.nodeName.toLowerCase();
        var nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element);
        this.nodeCount--;
    };

    /**
     * Get count of total allocated nodes in the document.
     *
     * @private
     * @method getNodeCount
     *
     * @return {Number} total node count
     */
    ElementAllocator.prototype.getNodeCount = function getNodeCount() {
        return this.nodeCount;
    };

    module.exports = ElementAllocator;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Polyfill for Function.name on browsers that do not support it (IE):
// See: http://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie
if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, "name", {
        get: function () {
            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];

            // For better performance only parse once, and then cache the
            // result through a new accessor for repeated access.
            Object.defineProperty(this, "name", { value: name });

            return name;
        }
    });
}
//# sourceMappingURL=polyfill.Function.name.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var Entity = __webpack_require__(35);
    var EventHandler = __webpack_require__(3);
    var Transform = __webpack_require__(2);

    var usePrefix = !('transform' in document.documentElement.style);
    var devicePixelRatio = window.devicePixelRatio || 1;

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class ElementOutput
     * @constructor
     *
     * @param {Node} element document parent of this container
     */
    function ElementOutput(element) {
        this._matrix = null;
        this._opacity = 1;
        this._origin = null;
        this._size = null;

        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);

        /** @ignore */
        this.eventForwarder = function eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        this.id = Entity.register(this);
        this._element = null;
        this._sizeDirty = false;
        this._originDirty = false;
        this._transformDirty = false;

        this._invisible = false;
        if (element) this.attach(element);
    }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler callback
     * @return {EventHandler} this
     */
    ElementOutput.prototype.on = function on(type, fn) {
        if (this._element) this._element.addEventListener(type, this.eventForwarder);
        this._eventOutput.on(type, fn);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    ElementOutput.prototype.removeListener = function removeListener(type, fn) {
        this._eventOutput.removeListener(type, fn);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} [event] event data
     * @return {EventHandler} this
     */
    ElementOutput.prototype.emit = function emit(type, event) {
        if (event && !event.origin) event.origin = this;
        var handled = this._eventOutput.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    ElementOutput.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    ElementOutput.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    ElementOutput.prototype.render = function render() {
        return this.id;
    };

    //  Attach Famous event handling to document events emanating from target
    //    document element.  This occurs just after attachment to the document.
    //    Calling this enables methods like #on and #pipe.
    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.addEventListener(i, this.eventForwarder);
        }
    }

    //  Detach Famous event handling from document events emanating from target
    //  document element.  This occurs just before detach from the document.
    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.removeEventListener(i, this.eventForwarder);
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {FamousMatrix} m matrix
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    /**
     * Directly apply given FamousMatrix to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setMatrix
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setMatrix;
    if (usePrefix) {
        _setMatrix = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setMatrix = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    // Directly apply given origin coordinates to the document element as the
    // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

    // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    ElementOutput.prototype.commit = function commit(context) {
        var target = this._element;
        if (!target) return;

        var matrix = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        if (!matrix && this._matrix) {
            this._matrix = null;
            this._opacity = 0;
            _setInvisible(target);
            return;
        }

        if (_xyNotEquals(this._origin, origin)) this._originDirty = true;
        if (Transform.notEquals(this._matrix, matrix)) this._transformDirty = true;

        if (this._invisible) {
            this._invisible = false;
            this._element.style.display = '';
        }

        if (this._opacity !== opacity) {
            this._opacity = opacity;
            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
        }

        if (this._transformDirty || this._originDirty || this._sizeDirty) {
            if (this._sizeDirty) this._sizeDirty = false;

            if (this._originDirty) {
                if (origin) {
                    if (!this._origin) this._origin = [0, 0];
                    this._origin[0] = origin[0];
                    this._origin[1] = origin[1];
                }
                else this._origin = null;
                _setOrigin(target, this._origin);
                this._originDirty = false;
            }

            if (!matrix) matrix = Transform.identity;
            this._matrix = matrix;
            var aaMatrix = this._size ? Transform.thenMove(matrix, [-this._size[0]*origin[0], -this._size[1]*origin[1], 0]) : matrix;
            _setMatrix(target, aaMatrix);
            this._transformDirty = false;
        }
    };

    ElementOutput.prototype.cleanup = function cleanup() {
        if (this._element) {
            this._invisible = true;
            this._element.style.display = 'none';
        }
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method attach
     * @param {Node} target document parent of this container
     */
    ElementOutput.prototype.attach = function attach(target) {
        this._element = target;
        _addEventListeners.call(this, target);
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method detach
     */
    ElementOutput.prototype.detach = function detach() {
        var target = this._element;
        if (target) {
            _removeEventListeners.call(this, target);
            if (this._invisible) {
                this._invisible = false;
                this._element.style.display = '';
            }
        }
        this._element = null;
        return target;
    };

    module.exports = ElementOutput;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rule = exports.StyleSheet = exports.Jss = undefined;

var _Jss = __webpack_require__(70);

var _Jss2 = _interopRequireDefault(_Jss);

var _StyleSheet = __webpack_require__(38);

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _Rule = __webpack_require__(40);

var _Rule2 = _interopRequireDefault(_Rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jss = new _Jss2.default();

// Hotfix for babel 5 migration, will be removed in version 4.0.0
/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014-2016
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */
module.exports = exports = jss;

// For testing only.
exports.Jss = _Jss2.default;
exports.StyleSheet = _StyleSheet2.default;
exports.Rule = _Rule2.default;
exports.default = jss;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StyleSheet = __webpack_require__(38);

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _PluginsRegistry = __webpack_require__(77);

var _PluginsRegistry2 = _interopRequireDefault(_PluginsRegistry);

var _SheetsRegistry = __webpack_require__(78);

var _SheetsRegistry2 = _interopRequireDefault(_SheetsRegistry);

var _utils = __webpack_require__(4);

var _createRule2 = __webpack_require__(39);

var _createRule3 = _interopRequireDefault(_createRule2);

var _findRenderer = __webpack_require__(41);

var _findRenderer2 = _interopRequireDefault(_findRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main Jss class.
 *
 * @api public
 */

var Jss = function () {
  function Jss() {
    _classCallCheck(this, Jss);

    this.sheets = new _SheetsRegistry2.default();
    this.plugins = new _PluginsRegistry2.default();
    this.uid = _utils.uid;
    this.version = '3.11.1';
  }

  /**
   * Creates a new instance of Jss.
   *
   * @see Jss
   * @api public
   */


  _createClass(Jss, [{
    key: 'create',
    value: function create() {
      return new Jss();
    }

    /**
     * Create a stylesheet.
     *
     * @see StyleSheet
     * @api public
     */

  }, {
    key: 'createStyleSheet',
    value: function createStyleSheet(rules, options) {
      var sheet = new _StyleSheet2.default(rules, _extends({}, options, { jss: this }));
      this.sheets.add(sheet);
      return sheet;
    }

    /**
     * Create a rule.
     *
     * @see createRule
     * @api public
     */

  }, {
    key: 'createRule',
    value: function createRule(selector, style, options) {
      // Enable rule without selector.
      if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') {
        options = style;
        style = selector;
        selector = null;
      }
      var rule = (0, _createRule3.default)(selector, style, _extends({}, options, {
        jss: this,
        Renderer: (0, _findRenderer2.default)(options)
      }));
      this.plugins.run(rule);
      return rule;
    }

    /**
     * Register plugin. Passed function will be invoked with a rule instance.
     *
     * @param {Function} plugins
     * @api public
     */

  }, {
    key: 'use',
    value: function use() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      plugins.forEach(function (plugin) {
        return _this.plugins.use(plugin);
      });
      return this;
    }
  }]);

  return Jss;
}();

exports.default = Jss;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rule like @charset, @import, @namespace.
 *
 * @api public
 */

var SimpleRule = function () {
  function SimpleRule(name, value, options) {
    _classCallCheck(this, SimpleRule);

    this.id = _utils.uid.get();
    this.type = 'simple';
    this.name = name;
    this.value = value;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api public
   */


  _createClass(SimpleRule, [{
    key: 'toString',
    value: function toString() {
      if (Array.isArray(this.value)) {
        var str = '';
        for (var index = 0; index < this.value.length; index++) {
          str += this.name + ' ' + this.value[index] + ';';
          if (this.value[index + 1]) str += '\n';
        }
        return str;
      }

      return this.name + ' ' + this.value + ';';
    }
  }]);

  return SimpleRule;
}();

exports.default = SimpleRule;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Keyframe rule.
 *
 * @api private
 */

var KeyframeRule = function () {
  function KeyframeRule(selector, frames, options) {
    _classCallCheck(this, KeyframeRule);

    this.id = _utils.uid.get();
    this.type = 'keyframe';
    this.selector = selector;
    this.options = options;
    this.frames = this.formatFrames(frames);
  }

  /**
   * Creates formatted frames where every frame value is a rule instance.
   *
   * @api private
   */


  _createClass(KeyframeRule, [{
    key: 'formatFrames',
    value: function formatFrames(frames) {
      var newFrames = Object.create(null);
      for (var name in frames) {
        var options = _extends({}, this.options, { named: false, parent: this });
        newFrames[name] = this.options.jss.createRule(name, frames[name], options);
      }
      return newFrames;
    }

    /**
     * Generates a CSS string.
     *
     * @return {String}
     * @api private
     */

  }, {
    key: 'toString',
    value: function toString() {
      var str = this.selector + ' {\n';
      var options = { indentationLevel: 1 };
      for (var name in this.frames) {
        str += this.frames[name].toString(options) + '\n';
      }
      str += '}';
      return str;
    }
  }]);

  return KeyframeRule;
}();

exports.default = KeyframeRule;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Conditional rule for @media, @supports
 *
 * @api public
 */

var ConditionalRule = function () {
  function ConditionalRule(selector, styles, options) {
    _classCallCheck(this, ConditionalRule);

    this.id = _utils.uid.get();
    this.type = 'conditional';
    this.selector = selector;
    this.options = options;
    this.rules = Object.create(null);
    for (var name in styles) {
      this.createRule(name, styles[name]);
    }
  }

  /**
   * A conditional rule always contains child rules.
   *
   * @param {Object} styles
   * @return {Array} rules
   * @api public
   */


  _createClass(ConditionalRule, [{
    key: 'createRule',
    value: function createRule(name, style, options) {
      var newOptions = _extends({}, this.options, { parent: this });
      var _newOptions = newOptions;
      var sheet = _newOptions.sheet;
      var jss = _newOptions.jss;
      // We have already a rule in the current style sheet with this name,
      // This new rule is supposed to overwrite the first one, for this we need
      // to ensure it will have the same className/selector.

      var existingRule = sheet && sheet.getRule(name);
      var className = existingRule ? existingRule.className : null;
      if (className || options) {
        newOptions = _extends({}, newOptions, { className: className }, options);
      }
      var rule = (sheet || jss).createRule(name, style, newOptions);
      this.rules[name] = rule;
      return rule;
    }

    /**
     * Generates a CSS string.
     *
     * @return {String}
     * @api public
     */

  }, {
    key: 'toString',
    value: function toString() {
      var str = this.selector + ' {\n';
      for (var name in this.rules) {
        var rule = this.rules[name];
        if (rule.style && (0, _utils.isEmptyObject)(rule.style)) {
          continue;
        }
        var ruleStr = rule.toString({ indentationLevel: 1 });
        str += ruleStr + '\n';
      }
      str += '}';
      return str;
    }
  }]);

  return ConditionalRule;
}();

exports.default = ConditionalRule;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Font-face rules.
 *
 * @api public
 */

var Rule = function () {
  function Rule(selector, style, options) {
    _classCallCheck(this, Rule);

    this.id = _utils.uid.get();
    this.type = 'font-face';
    this.options = options;
    this.selector = selector;
    this.style = style;
  }

  /**
   * Generates a CSS string.
   *
   * @see toCSS
   * @api public
   */


  _createClass(Rule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.style)) {
        var str = '';
        for (var index = 0; index < this.style.length; index++) {
          str += (0, _utils.toCSS)(this.selector, this.style[index], options);
          if (this.style[index + 1]) str += '\n';
        }
        return str;
      }

      return (0, _utils.toCSS)(this.selector, this.style, options);
    }
  }]);

  return Rule;
}();

exports.default = Rule;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */

var DomRenderer = function () {
  _createClass(DomRenderer, null, [{
    key: 'style',
    value: function style(element, name, value) {
      try {
        if (value == null) return element.style[name];
        element.style[name] = value;
      } catch (err) {
        // IE8 may throw if property is unknown.
        return false;
      }
      return true;
    }
  }, {
    key: 'setSelector',
    value: function setSelector(cssRule, selector) {
      cssRule.selectorText = selector;

      // Return false if setter was not successful.
      // Currently works in chrome only.
      return cssRule.selectorText === selector;
    }
  }, {
    key: 'getSelector',
    value: function getSelector(cssRule) {
      return cssRule.selectorText;
    }
  }]);

  function DomRenderer(options) {
    _classCallCheck(this, DomRenderer);

    this.head = document.head || document.getElementsByTagName('head')[0];
    this.element = options.element || document.createElement('style');
    // IE8 will not have `styleSheet` prop without `type and `styleSheet.cssText`
    // is the only way to render on IE8.
    this.element.type = 'text/css';
    if (options.media) this.element.setAttribute('media', options.media);
    if (options.meta) this.element.setAttribute('data-meta', options.meta);
  }

  /**
   * Insert style element into render tree.
   *
   * @api private
   */


  _createClass(DomRenderer, [{
    key: 'attach',
    value: function attach() {
      if (this.element.parendNode) return;
      this.head.appendChild(this.element);
    }

    /**
     * Remove style element from render tree.
     *
     * @api private
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.element.parentNode.removeChild(this.element);
    }

    /**
     * Inject CSS string into element.
     *
     * @param {String} cssStr
     * @api private
     */

  }, {
    key: 'deploy',
    value: function deploy(sheet) {
      var css = '\n' + sheet.toString() + '\n';
      if ('sheet' in this.element) this.element.innerHTML = css;
      // On IE8 the only way to render is `styleSheet.cssText`.
      else if ('styleSheet' in this.element) this.element.styleSheet.cssText = css;
    }

    /**
     * Insert a rule into element.
     *
     * @param {Rule} rule
     * @return {CSSStyleRule}
     * @api private
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule) {
      // IE8 has only `styleSheet` and `styleSheet.rules`
      var sheet = this.element.sheet || this.element.styleSheet;
      var cssRules = sheet.cssRules || sheet.rules;
      var nextIndex = cssRules.length;
      if (sheet.insertRule) sheet.insertRule(rule.toString(), nextIndex);else sheet.addRule(rule.selector, rule.toString({ selector: false }), nextIndex);
      return cssRules[nextIndex];
    }

    /**
     * Get all rules elements.
     *
     * @return {Object} rules map, where key is selector, CSSStyleRule is value.
     * @api private
     */

  }, {
    key: 'getRules',
    value: function getRules() {
      // IE8 has only `styleSheet` and `styleSheet.rules`
      var sheet = this.element.sheet || this.element.styleSheet;
      var cssRules = sheet.rules || sheet.cssRules;
      var rules = Object.create(null);
      for (var index = 0; index < cssRules.length; index++) {
        var cssRule = cssRules[index];
        rules[cssRule.selectorText] = cssRule;
      }
      return rules;
    }
  }]);

  return DomRenderer;
}();

exports.default = DomRenderer;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rendering backend to do nothing in nodejs.
 */

var VirtualRenderer = function () {
  function VirtualRenderer() {
    _classCallCheck(this, VirtualRenderer);
  }

  _createClass(VirtualRenderer, [{
    key: "attach",
    value: function attach() {}
  }, {
    key: "detach",
    value: function detach() {}
  }, {
    key: "deploy",
    value: function deploy() {}
  }, {
    key: "insertRule",
    value: function insertRule() {}
  }, {
    key: "getRules",
    value: function getRules() {
      return {};
    }
  }], [{
    key: "style",
    value: function style() {}
  }, {
    key: "setSelector",
    value: function setSelector() {}
  }, {
    key: "getSelector",
    value: function getSelector() {}
  }]);

  return VirtualRenderer;
}();

exports.default = VirtualRenderer;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Register a plugin, run a plugin.
 *
 * @api public
 */

var PluginsRegistry = function () {
  function PluginsRegistry() {
    _classCallCheck(this, PluginsRegistry);

    this.registry = [];
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   * @api public
   */


  _createClass(PluginsRegistry, [{
    key: "use",
    value: function use(fn) {
      this.registry.push(fn);
    }

    /**
     * Execute all registered plugins.
     *
     * @param {Rule} rule
     * @api private
     */

  }, {
    key: "run",
    value: function run(rule) {
      for (var index = 0; index < this.registry.length; index++) {
        this.registry[index](rule);
      }
    }
  }]);

  return PluginsRegistry;
}();

exports.default = PluginsRegistry;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sheets registry to access them all at one place.
 *
 * @api public
 */

var SheetsRegistry = function () {
  function SheetsRegistry() {
    _classCallCheck(this, SheetsRegistry);

    this.registry = [];
  }

  /**
   * Register a style sheet.
   *
   * @param {StyleSheet} sheet
   * @api public
   */


  _createClass(SheetsRegistry, [{
    key: 'add',
    value: function add(sheet) {
      this.registry.push(sheet);
    }

    /**
     * Returns CSS string with all Style Sheets.
     *
     * @param {StyleSheet} sheet
     * @api public
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.registry.map(function (sheet) {
        return sheet.toString(options);
      }).join('\n');
    }
  }]);

  return SheetsRegistry;
}();

exports.default = SheetsRegistry;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = jssNested;
var regExp = /&/g;

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssNested() {
  return function (rule) {
    if (rule.type !== 'regular') return;
    var _rule$options = rule.options;
    var sheet = _rule$options.sheet;
    var jss = _rule$options.jss;
    var parent = _rule$options.parent;

    var container = sheet || jss;
    var options = void 0;

    if (parent && parent.type === 'conditional') {
      container = parent;
    }

    for (var prop in rule.style) {
      if (prop[0] === '&') {
        if (!options) options = _extends({}, rule.options, { named: false });
        var name = prop.replace(regExp, rule.selector);
        container.createRule(name, rule.style[prop], options);
        delete rule.style[prop];
      }
    }
  };
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jssExtend;
/**
 * Handle `extend` property.
 *
 * @param {Rule} rule
 * @api public
 */
function jssExtend() {
  function extend(rule, newStyle, style) {
    if (typeof style.extend == 'string') {
      if (rule.options && rule.options.sheet) {
        var refRule = rule.options.sheet.getRule(style.extend);
        if (refRule) extend(rule, newStyle, refRule.originalStyle);
      }
    } else if (Array.isArray(style.extend)) {
      for (var index = 0; index < style.extend.length; index++) {
        extend(rule, newStyle, style.extend[index]);
      }
    } else {
      for (var prop in style.extend) {
        if (prop === 'extend') extend(rule, newStyle, style.extend.extend);else newStyle[prop] = style.extend[prop];
      }
    }

    // Copy base style.
    for (var _prop in style) {
      if (_prop !== 'extend') newStyle[_prop] = style[_prop];
    }

    return newStyle;
  }

  return function (rule) {
    if (!rule.style || !rule.style.extend) return;
    rule.style = extend(rule, {}, rule.style);
  };
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Don't automatically add 'px' to these possibly-unitless properties.
// Borrowed from jquery.


exports.__esModule = true;
exports['default'] = jssPx;
var cssNumber = {
  'animation-iteration-count': true,
  'box-ordinal-group': true,
  'column-count': true,
  'fill-opacity': true,
  'flex': true,
  'flex-grow': true,
  'flex-order': true,
  'flex-shrink': true,
  'font-weight': true,
  'line-height': true,
  'opacity': true,
  'order': true,
  'orphans': true,
  'stop-opacity': true,
  'tab-size': 1,
  'widows': true,
  'z-index': true,
  'zoom': true
};

/**
 * Add px to numeric values.
 *
 * @param {Rule} rule
 * @api public
 */

function jssPx() {
  return function (rule) {
    var style = rule.style;

    if (!style) return;
    for (var prop in style) {
      if (!cssNumber[prop] && typeof style[prop] == 'number') {
        style[prop] += 'px';
      }
    }
  };
}

module.exports = exports['default'];

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports['default'] = jssVendorPrefixer;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _cssVendor = __webpack_require__(83);

var vendor = _interopRequireWildcard(_cssVendor);

/**
 * Add vendor prefix to a property name when needed.
 *
 * @param {Rule} rule
 * @api public
 */

function jssVendorPrefixer() {
  return function (rule) {
    if (rule.type === 'keyframe') {
      rule.selector = '@' + vendor.prefix.css + 'keyframes' + rule.selector.substr(10);
      return;
    }

    if (rule.type !== 'regular') return;

    for (var prop in rule.style) {
      var value = rule.style[prop];

      var changeProp = false;
      var supportedProp = vendor.supportedProperty(prop);
      if (supportedProp && supportedProp !== prop) changeProp = true;

      var changeValue = false;
      var supportedValue = vendor.supportedValue(supportedProp, value);
      if (supportedValue && supportedValue !== value) changeValue = true;

      if (changeProp || changeValue) {
        if (changeProp) delete rule.style[prop];
        rule.style[supportedProp || prop] = supportedValue || value;
      }
    }
  };
}

module.exports = exports['default'];

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedValue = exports.supportedProperty = exports.prefix = undefined;

var _prefix = __webpack_require__(20);

var _prefix2 = _interopRequireDefault(_prefix);

var _supportedProperty = __webpack_require__(84);

var _supportedProperty2 = _interopRequireDefault(_supportedProperty);

var _supportedValue = __webpack_require__(86);

var _supportedValue2 = _interopRequireDefault(_supportedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  prefix: _prefix2['default'],
  supportedProperty: _supportedProperty2['default'],
  supportedValue: _supportedValue2['default']
}; /**
    * CSS Vendor prefix detection and property feature testing.
    *
    * @copyright Oleg Slobodskoi 2015
    * @website https://github.com/jsstyles/css-vendor
    * @license MIT
    */

exports.prefix = _prefix2['default'];
exports.supportedProperty = _supportedProperty2['default'];
exports.supportedValue = _supportedValue2['default'];

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedProperty;

var _isInBrowser = __webpack_require__(21);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = __webpack_require__(20);

var _prefix2 = _interopRequireDefault(_prefix);

var _camelize = __webpack_require__(85);

var _camelize2 = _interopRequireDefault(_camelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var el = void 0;
var cache = {};

if (_isInBrowser2['default']) {
  el = document.createElement('p');

  /**
   * We test every property on vendor prefix requirement.
   * Once tested, result is cached. It gives us up to 70% perf boost.
   * http://jsperf.com/element-style-object-access-vs-plain-object
   *
   * Prefill cache with known css properties to reduce amount of
   * properties we need to feature test at runtime.
   * http://davidwalsh.name/vendor-prefix
   */
  var computed = window.getComputedStyle(document.documentElement, '');
  for (var key in computed) {
    if (!isNaN(key)) cache[computed[key]] = computed[key];
  }
}

/**
 * Test if a property is supported, returns supported property with vendor
 * prefix if required. Returns `false` if not supported.
 *
 * @param {String} prop dash separated
 * @return {String|Boolean}
 * @api public
 */
function supportedProperty(prop) {
  // For server-side rendering.
  if (!el) return prop;

  // We have not tested this prop yet, lets do the test.
  if (cache[prop] != null) return cache[prop];

  // Camelization is required because we can't test using
  // css syntax for e.g. in FF.
  // Test if property is supported as it is.
  if ((0, _camelize2['default'])(prop) in el.style) {
    cache[prop] = prop;
  }
  // Test if property is supported with vendor prefix.
  else if (_prefix2['default'].js + (0, _camelize2['default'])('-' + prop) in el.style) {
      cache[prop] = _prefix2['default'].css + prop;
    } else {
      cache[prop] = false;
    }

  return cache[prop];
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = camelize;
var regExp = /[-\s]+(.)?/g;

/**
 * Convert dash separated strings to camel cased.
 *
 * @param {String} str
 * @return {String}
 */
function camelize(str) {
  return str.replace(regExp, toUpper);
}

function toUpper(match, c) {
  return c ? c.toUpperCase() : '';
}

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedValue;

var _isInBrowser = __webpack_require__(21);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = __webpack_require__(20);

var _prefix2 = _interopRequireDefault(_prefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var cache = {};
var el = void 0;

if (_isInBrowser2['default']) el = document.createElement('p');

/**
 * Returns prefixed value if needed. Returns `false` if value is not supported.
 *
 * @param {String} property
 * @param {String} value
 * @return {String|Boolean}
 * @api public
 */
function supportedValue(property, value) {
  // For server-side rendering.
  if (!el) return value;

  // It is a string or a number as a string like '1'.
  // We want only prefixable values here.
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) return value;

  var cacheKey = property + value;

  if (cache[cacheKey] != null) return cache[cacheKey];

  // IE can even throw an error in some cases, for e.g. style.content = 'bar'
  try {
    // Test value as it is.
    el.style[property] = value;
  } catch (err) {
    cache[cacheKey] = false;
    return false;
  }

  // Value is supported as it is.
  if (el.style[property] !== '') {
    cache[cacheKey] = value;
  } else {
    // Test value with vendor prefix.
    value = _prefix2['default'].css + value;

    // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
    if (value === '-ms-flex') value = '-ms-flexbox';

    el.style[property] = value;

    // Value is supported with vendor prefix.
    if (el.style[property] !== '') cache[cacheKey] = value;
  }

  if (!cache[cacheKey]) cache[cacheKey] = false;

  // Reset style value.
  el.style[property] = '';

  return cache[cacheKey];
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var regExp = /([A-Z])/g;

/**
 * Replace a string passed from String#replace.
 * @param {String} str
 * @return {String}
 */
function replace(str) {
  return '-' + str.toLowerCase();
}

/**
 * Convert camel cased properties of a single style to dasherized.
 *
 * @param {Object} style
 * @return {Object} convertedStyle
 */
function convertCase(style) {
  var convertedStyle = {};
  for (var prop in style) {
    var value = style[prop];
    prop = prop.replace(regExp, replace);
    convertedStyle[prop] = value;
  }
  return convertedStyle;
}

/**
 * Allow camel cased property names by converting them back to dasherized.
 *
 * @param {Rule} rule
 */

exports.default = function () {
  return function jssCamelCase(rule) {
    var style = rule.style;

    if (!style) return;
    if (Array.isArray(style)) {
      // Handle rules like @font-face, which can have multiple styles in an array
      for (var index = 0; index < style.length; index++) {
        style[index] = convertCase(style[index]);
      }
    } else {
      rule.style = convertCase(style);
    }
  };
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jssPropsSort;
/**
 * Sort props by length.
 *
 * @param {Rule} rule
 * @api public
 */
function jssPropsSort() {
  function sort(prop0, prop1) {
    return prop0.length > prop1.length;
  }

  return function (rule) {
    var style = rule.style;
    var type = rule.type;

    if (!style || type !== 'regular') return;
    var newStyle = {};
    var props = Object.keys(style).sort(sort);
    for (var prop in props) {
      newStyle[props[prop]] = style[props[prop]];
    }
    rule.style = newStyle;
  };
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
    var TouchTracker = __webpack_require__(90);
    var EventHandler = __webpack_require__(3);
    var OptionsManager = __webpack_require__(36);

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with delta, position, velocity, acceleration, clientX, clientY, count, and touch id.
     *   Useful for dealing with inputs on touch devices. Designed to be used either as standalone, or
     *   included in a GenericSync.
     *
     * @class TouchSync
     * @constructor
     *
     * @example
     *   var Surface = require('../core/Surface');
     *   var TouchSync = require('../inputs/TouchSync');
     *
     *   var surface = new Surface({ size: [100, 100] });
     *   var touchSync = new TouchSync();
     *   surface.pipe(touchSync);
     *
     *   touchSync.on('start', function (e) { // react to start });
     *   touchSync.on('update', function (e) { // react to update });
     *   touchSync.on('end', function (e) { // react to end });*
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
     * @param [options.scale] {Number}       constant factor to scale velocity output
     * @param [options.touchLimit] {Number}  touchLimit upper bound for emitting events based on number of touches
     */
    function TouchSync(options) {
        this.options =  Object.create(TouchSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker({
            touchLimit: this.options.touchLimit
        });

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', _handleStart.bind(this));
        this._touchTracker.on('trackmove', _handleMove.bind(this));
        this._touchTracker.on('trackend', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        this._position = null; // to be deprecated
    }

    TouchSync.DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1
    };

    TouchSync.DIRECTION_X = 0;
    TouchSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by trackstart.
     *  @method _handleStart
     *  @private
     */
    function _handleStart(data) {
        var velocity;
        var delta;
        if (this.options.direction !== undefined){
            this._position = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            this._position = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touch = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    /**
     *  Triggered by trackmove.
     *  @method _handleMove
     *  @private
     */
    function _handleMove(data) {
        var history = data.history;

        var currHistory = history[history.length - 1];
        var prevHistory = history[history.length - 2];

        var distantHistory = history[history.length - this.options.velocitySampleLength] ?
          history[history.length - this.options.velocitySampleLength] :
          history[history.length - 2];

        var distantTime = distantHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = currHistory.x - prevHistory.x;
        var diffY = currHistory.y - prevHistory.y;

        var velDiffX = currHistory.x - distantHistory.x;
        var velDiffY = currHistory.y - distantHistory.y;

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;

            if (Math.abs(velDiffX) > Math.abs(velDiffY)) velDiffY = 0;
            else velDiffX = 0;
        }

        var diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME);

        var velX = velDiffX / diffTime;
        var velY = velDiffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === TouchSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.clientX  = data.x;
        payload.clientY  = data.y;
        payload.count    = data.count;
        payload.touch    = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    /**
     *  Triggered by trackend.
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    TouchSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    TouchSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    module.exports = TouchSync;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
    var EventHandler = __webpack_require__(3);

    var _now = Date.now;

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        };
    }

    function _handleStart(event) {
        if (event.touches.length > this.touchLimit) return;
        this.isTouched = true;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = _timestampTouch(touch, event, null);
            this.eventOutput.emit('trackstart', data);
            if (!this.selective && !this.touchHistory[touch.identifier]) this.track(data);
        }
    }

    function _handleMove(event) {
        if (event.touches.length > this.touchLimit) return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this.eventOutput.emit('trackmove', data);
            }
        }
    }

    function _handleEnd(event) {
        if (!this.isTouched) return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.eventOutput.emit('trackend', data);
                delete this.touchHistory[touch.identifier];
            }
        }

        this.isTouched = false;
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit('trackend', {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            });
            delete this.touchHistory[i];
        }
    }

    /**
     * Helper to TouchSync – tracks piped in touch events, organizes touch
     *   events by ID, and emits track events back to TouchSync.
     *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
     *
     * @class TouchTracker
     * @constructor
     * @param {Object} options default options overrides
     * @param [options.selective] {Boolean} selective if false, saves state for each touch
     * @param [options.touchLimit] {Number} touchLimit upper bound for emitting events based on number of touches
     */
    function TouchTracker(options) {
        this.selective = options.selective;
        this.touchLimit = options.touchLimit || 1;

        this.touchHistory = {};

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('touchstart', _handleStart.bind(this));
        this.eventInput.on('touchmove', _handleMove.bind(this));
        this.eventInput.on('touchend', _handleEnd.bind(this));
        this.eventInput.on('touchcancel', _handleEnd.bind(this));
        this.eventInput.on('unpipe', _handleUnpipe.bind(this));

        this.isTouched = false;
    }

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.touchHistory[data.identifier] = [data];
    };

    module.exports = TouchTracker;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

    var EventHandler = __webpack_require__(3);

    /**
     * Combines multiple types of sync classes (e.g. mouse, touch,
     *  scrolling) into one standardized interface for inclusion in widgets.
     *
     *  Sync classes are first registered with a key, and then can be accessed
     *  globally by key.
     *
     *  Emits 'start', 'update' and 'end' events as a union of the sync class
     *  providers.
     *
     * @class GenericSync
     * @constructor
     * @param syncs {Object|Array} object with fields {sync key : sync options}
     *    or an array of registered sync keys
     * @param [options] {Object|Array} options object to set on all syncs
     */
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._syncs = {};
        if (syncs) this.addSync(syncs);
        if (options) this.setOptions(options);
    }

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;
    GenericSync.DIRECTION_Z = 2;

    // Global registry of sync classes. Append only.
    var registry = {};

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param syncObject {Object} an object of {sync key : sync options} fields
     */
    GenericSync.register = function register(syncObject) {
        for (var key in syncObject){
            if (registry[key]){ // skip redundant registration
                if (registry[key] !== syncObject[key]) // only if same registered class
                    throw new Error('Conflicting sync classes for key: ' + key);
            }
            else registry[key] = syncObject[key];
        }
    };

    /**
     * Helper to set options on all sync instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    GenericSync.prototype.setOptions = function(options) {
        for (var key in this._syncs){
            this._syncs[key].setOptions(options);
        }
    };

    /**
     * Pipe events to a sync class
     *
     * @method pipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.pipeSync = function pipeToSync(key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync);
        sync.pipe(this._eventOutput);
    };

    /**
     * Unpipe events from a sync class
     *
     * @method unpipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync);
        sync.unpipe(this._eventOutput);
    };

    function _addSingleSync(key, options) {
        if (!registry[key]) return;
        this._syncs[key] = new (registry[key])(options);
        this.pipeSync(key);
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param syncs {Object|Array.String} an array of registered sync keys
     *    or an object with fields {sync key : sync options}
     */
    GenericSync.prototype.addSync = function addSync(syncs) {
        if (syncs instanceof Array)
            for (var i = 0; i < syncs.length; i++)
                _addSingleSync.call(this, syncs[i]);
        else if (syncs instanceof Object)
            for (var key in syncs)
                _addSingleSync.call(this, key, syncs[key]);
    };

    module.exports = GenericSync;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.callAfter = callAfter;
function callAfter(times, callback) {
    var count = 0;
    return function () {
        if (++count == times) {
            if (typeof callback == "function") {
                callback.apply(this, arguments);
            }
        }
    };
}
exports["default"] = callAfter;
exports.__esModule = true;
//# sourceMappingURL=callAfter.js.map

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GeometryInterfaces"] = factory();
	else
		root["GeometryInterfaces"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _DOMMatrix = __webpack_require__(1);

	var _DOMMatrix2 = _interopRequireDefault(_DOMMatrix);

	var _DOMMatrixReadOnly = __webpack_require__(2);

	var _DOMMatrixReadOnly2 = _interopRequireDefault(_DOMMatrixReadOnly);

	var _DOMPoint = __webpack_require__(4);

	var _global = null;

	// browser
	if (typeof window != 'undefined') {
	    _global = window;
	} else if (typeof global != 'undefined') {
	    _global = global;
	}

	if (_global) {
	    _global.DOMMatrix = _DOMMatrix2['default'];
	    _global.DOMMatrixReadOnly = _DOMMatrixReadOnly2['default'];
	    _global.DOMPoint = _DOMPoint.DOMPoint;
	    _global.DOMPointReadOnly = _DOMPoint.DOMPointReadOnly;
	}

	exports.DOMMatrix = _DOMMatrix2['default'];
	exports.DOMMatrixReadOnly = _DOMMatrixReadOnly2['default'];
	exports.DOMPoint = _DOMPoint.DOMPoint;
	exports.DOMPointReadOnly = _DOMPoint.DOMPointReadOnly;
	//# sourceMappingURL=index.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x14, _x15, _x16) { var _again = true; _function: while (_again) { var object = _x14, property = _x15, receiver = _x16; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x14 = parent; _x15 = property; _x16 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _DOMMatrixReadOnly2 = __webpack_require__(2);

	var _DOMMatrixReadOnly3 = _interopRequireDefault(_DOMMatrixReadOnly2);

	var _utilities = __webpack_require__(3);

	var DOMMatrix = (function (_DOMMatrixReadOnly) {
	    _inherits(DOMMatrix, _DOMMatrixReadOnly);

	    function DOMMatrix(arg) {
	        _classCallCheck(this, DOMMatrix);

	        var numArgs = arguments.length;
	        if (numArgs === 0) {
	            _get(Object.getPrototypeOf(DOMMatrix.prototype), 'constructor', this).call(this, [1, 0, 0, 1, 0, 0]);
	        } else if (numArgs === 1) {
	            if (typeof arg == 'string') {
	                throw new Error('CSS transformList arg not yet implemented.');
	                // TODO validate that syntax of transformList matches transform-list (http://www.w3.org/TR/css-transforms-1/#typedef-transform-list).
	            } else if (arg instanceof DOMMatrix) {
	                    _get(Object.getPrototypeOf(DOMMatrix.prototype), 'constructor', this).call(this, arg._matrix);
	                } else if (arg instanceof Float32Array || arg instanceof Float64Array || arg instanceof Array) {
	                    _get(Object.getPrototypeOf(DOMMatrix.prototype), 'constructor', this).call(this, arg);
	                }
	        } else {
	            throw new Error('Wrong number of arguments to DOMMatrix constructor.');
	        }
	    }

	    // Mutable transform methods

	    _createClass(DOMMatrix, [{
	        key: 'multiplySelf',
	        value: function multiplySelf(other) {
	            if (!(other instanceof DOMMatrix)) throw new Error('The argument to multiplySelf must be an instance of DOMMatrix');

	            // TODO: avoid creating a new array, just apply values directly.
	            (0, _utilities.multiplyAndApply)(this, other, this);

	            if (!other.is2D) this._is2D = false;

	            return this;
	        }
	    }, {
	        key: 'preMultiplySelf',
	        value: function preMultiplySelf(other) {
	            if (!(other instanceof DOMMatrix)) throw new Error('The argument to multiplySelf must be an instance of DOMMatrix');

	            // TODO: avoid creating a new array, just apply values directly.
	            (0, _utilities.multiplyAndApply)(other, this, this);

	            if (!other.is2D) this._is2D = false;

	            return this;
	        }
	    }, {
	        key: 'translateSelf',
	        value: function translateSelf(tx, ty) {
	            var tz = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            // TODO: check args are numbers

	            if (arguments.length === 1) throw new Error('The first two arguments (X and Y translation values) are required (the third, Z translation, is optional).');

	            // http://www.w3.org/TR/2012/WD-css3-transforms-20120911/#Translate3dDefined
	            var translationMatrix = new DOMMatrix([
	            // column-major:
	            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);

	            this.multiplySelf(translationMatrix);

	            if (tz != 0) {
	                this._is2D = false;
	            }

	            return this;
	        }
	    }, {
	        key: 'scaleSelf',
	        value: function scaleSelf(scale) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            this.translateSelf(originX, originY);

	            this.multiplySelf(new DOMMatrix([
	            // 2D:
	            /*a*/scale, /*b*/0,
	            /*c*/0, /*d*/scale,
	            /*e*/0, /*f*/0]));

	            this.translateSelf(-originX, -originY);
	            return this;
	        }
	    }, {
	        key: 'scale3dSelf',
	        value: function scale3dSelf(scale) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	            var originZ = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	            this.translateSelf(originX, originY, originZ);

	            this.multiplySelf(new DOMMatrix([
	            // 3D
	            scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1]));

	            this.translateSelf(-originX, -originY, -originZ);
	            return this;
	        }
	    }, {
	        key: 'scaleNonUniformSelf',
	        value: function scaleNonUniformSelf(scaleX) {
	            var scaleY = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	            var scaleZ = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	            var originX = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	            var originY = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
	            var originZ = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

	            this.translateSelf(originX, originY, originZ);

	            this.multiplySelf(new DOMMatrix([
	            // 3D
	            scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, scaleZ, 0, 0, 0, 0, 1]));

	            this.translateSelf(-originX, -originY, -originZ);

	            if (scaleZ !== 1 || originZ !== 0) this._is2D = false;

	            return this;
	        }
	    }, {
	        key: 'rotateSelf',
	        value: function rotateSelf(angle) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            this.translateSelf(originX, originY);

	            // axis of rotation
	            var x = 0;
	            var y = 0;
	            var z = 1;
	            // We're rotating around the Z axis.

	            this.rotateAxisAngleSelf(x, y, z, angle);

	            this.translateSelf(-originX, -originY);
	            return this;
	        }

	        // TODO
	    }, {
	        key: 'rotateFromVectorSelf',
	        value: function rotateFromVectorSelf(x, y) {
	            throw new Error('rotateFromVectorSelf is not implemented yet.');
	        }
	    }, {
	        key: 'rotateAxisAngleSelf',
	        value: function rotateAxisAngleSelf(x, y, z, angle) {
	            var rotationMatrix = new DOMMatrix((0, _utilities.rotateAxisAngleArray)(x, y, z, angle));
	            this.multiplySelf(rotationMatrix);
	            return this;
	        }
	    }, {
	        key: 'skewXSelf',
	        value: function skewXSelf(sx) {
	            throw new Error('skewXSelf is not implemented yet.');
	        }
	    }, {
	        key: 'skewYSelf',
	        value: function skewYSelf(sy) {
	            throw new Error('skewYSelf is not implemented yet.');
	        }
	    }, {
	        key: 'invertSelf',
	        value: function invertSelf() {
	            throw new Error('invertSelf is not implemented yet.');
	        }
	    }, {
	        key: 'setMatrixValue',
	        value: function setMatrixValue( /*DOMString*/transformList) {
	            throw new Error('setMatrixValue is not implemented yet.');
	        }
	    }, {
	        key: 'a',
	        get: function get() {
	            return this.m11;
	        },
	        set: function set(value) {
	            this.m11 = value;
	        }
	    }, {
	        key: 'b',
	        get: function get() {
	            return this.m12;
	        },
	        set: function set(value) {
	            this.m12 = value;
	        }
	    }, {
	        key: 'c',
	        get: function get() {
	            return this.m21;
	        },
	        set: function set(value) {
	            this.m21 = value;
	        }
	    }, {
	        key: 'd',
	        get: function get() {
	            return this.m22;
	        },
	        set: function set(value) {
	            this.m22 = value;
	        }
	    }, {
	        key: 'e',
	        get: function get() {
	            return this.m41;
	        },
	        set: function set(value) {
	            this.m41 = value;
	        }
	    }, {
	        key: 'f',
	        get: function get() {
	            return this.m42;
	        },
	        set: function set(value) {
	            this.m42 = value;
	        }
	    }, {
	        key: 'm11',
	        get: function get() {
	            return this._matrix[0];
	        },
	        set: function set(value) {
	            this._matrix[0] = value;
	        }
	    }, {
	        key: 'm12',
	        get: function get() {
	            return this._matrix[4];
	        },
	        set: function set(value) {
	            this._matrix[4] = value;
	        }
	    }, {
	        key: 'm13',
	        get: function get() {
	            return this._matrix[8];
	        },
	        set: function set(value) {
	            this._matrix[8] = value;
	        }
	    }, {
	        key: 'm14',
	        get: function get() {
	            return this._matrix[12];
	        },
	        set: function set(value) {
	            this._matrix[12] = value;
	        }
	    }, {
	        key: 'm21',
	        get: function get() {
	            return this._matrix[1];
	        },
	        set: function set(value) {
	            this._matrix[1] = value;
	        }
	    }, {
	        key: 'm22',
	        get: function get() {
	            return this._matrix[5];
	        },
	        set: function set(value) {
	            this._matrix[5] = value;
	        }
	    }, {
	        key: 'm23',
	        get: function get() {
	            return this._matrix[9];
	        },
	        set: function set(value) {
	            this._matrix[9] = value;
	        }
	    }, {
	        key: 'm24',
	        get: function get() {
	            return this._matrix[13];
	        },
	        set: function set(value) {
	            this._matrix[13] = value;
	        }
	    }, {
	        key: 'm31',
	        get: function get() {
	            return this._matrix[2];
	        },
	        set: function set(value) {
	            this._matrix[2] = value;
	        }
	    }, {
	        key: 'm32',
	        get: function get() {
	            return this._matrix[6];
	        },
	        set: function set(value) {
	            this._matrix[6] = value;
	        }
	    }, {
	        key: 'm33',
	        get: function get() {
	            return this._matrix[10];
	        },
	        set: function set(value) {
	            this._matrix[10] = value;
	        }
	    }, {
	        key: 'm34',
	        get: function get() {
	            return this._matrix[14];
	        },
	        set: function set(value) {
	            this._matrix[14] = value;
	        }
	    }, {
	        key: 'm41',
	        get: function get() {
	            return this._matrix[3];
	        },
	        set: function set(value) {
	            this._matrix[3] = value;
	        }
	    }, {
	        key: 'm42',
	        get: function get() {
	            return this._matrix[7];
	        },
	        set: function set(value) {
	            this._matrix[7] = value;
	        }
	    }, {
	        key: 'm43',
	        get: function get() {
	            return this._matrix[11];
	        },
	        set: function set(value) {
	            this._matrix[11] = value;
	        }
	    }, {
	        key: 'm44',
	        get: function get() {
	            return this._matrix[15];
	        },
	        set: function set(value) {
	            this._matrix[15] = value;
	        }
	    }]);

	    return DOMMatrix;
	})(_DOMMatrixReadOnly3['default']);

	exports['default'] = DOMMatrix;
	module.exports = exports['default'];
	//# sourceMappingURL=DOMMatrix.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _DOMMatrix = __webpack_require__(1);

	var _DOMMatrix2 = _interopRequireDefault(_DOMMatrix);

	var _utilities = __webpack_require__(3);

	// This matrix is represented internally in row-major format so that it is easy
	// to look at visually. In a pair of coordinates (as in "m23") the first number
	// is the column and the second is the row (so "m23" means column 2 row 3).
	var identity = [
	/*m11*/1, /*m21*/0, /*m31*/0, /*m41*/0,
	/*m12*/0, /*m22*/1, /*m32*/0, /*m42*/0,
	/*m13*/0, /*m23*/0, /*m33*/1, /*m43*/0,
	/*m14*/0, /*m24*/0, /*m34*/0, /*m44*/1];

	var DOMMatrixReadOnly = (function () {

	    /**
	     * @param {Array.number} numberSequence An array of numbers. If the array
	     * has 6 items, then those items set the values of m11, m12, m21, m22, m41,
	     * m42 in that order (or the values a, b, c, d, e, f if you're using those
	     * aliases) and this.is2D is true. If the array has 16 items (in
	     * column-major order), then they set all the values of the underlying
	     * matrix (m11 to m44) and this.is2D is set false. Arrays of other lengths
	     * throw an error.
	     */

	    function DOMMatrixReadOnly() {
	        var numberSequence = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	        _classCallCheck(this, DOMMatrixReadOnly);

	        if (!(this instanceof _DOMMatrix2['default'])) throw new TypeError('DOMMatrixReadOnly can\'t be instantiated directly. Use DOMMatrix instead.');

	        var length = numberSequence.length;

	        if (length === undefined || !(length === 6 || length === 16)) throw new TypeError('DOMMatrix constructor argument "numberSequence" must be an array-like with 6 or 16 numbers.');

	        this._matrix = new Float64Array(identity);
	        this._isIdentity = true;
	        this._is2D = length === 6 ? true : false;

	        (0, _utilities.applyArrayValuesToDOMMatrix)(numberSequence, this);
	    }

	    // Immutable transform methods -------------------------------------------

	    _createClass(DOMMatrixReadOnly, [{
	        key: 'translate',
	        value: function translate(tx, ty) {
	            var tz = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            return new _DOMMatrix2['default'](this).translateSelf(tx, ty, tz);
	        }
	    }, {
	        key: 'scale',
	        value: function scale(_scale) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            return new _DOMMatrix2['default'](this).scaleSelf(_scale, originX, originY);
	        }
	    }, {
	        key: 'scale3d',
	        value: function scale3d(scale) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	            var originZ = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	            return new _DOMMatrix2['default'](this).scale3dSelf(scale, originX, originY, originZ);
	        }
	    }, {
	        key: 'scaleNonUniform',
	        value: function scaleNonUniform(scaleX) {
	            var scaleY = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	            var scaleZ = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	            var originX = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
	            var originY = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
	            var originZ = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

	            return new _DOMMatrix2['default'](this).scaleNonUniformSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate(angle) {
	            var originX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	            var originY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	            return new _DOMMatrix2['default'](this).rotateSelf(angle, originX, originY);
	        }

	        // TODO
	    }, {
	        key: 'rotateFromVector',
	        value: function rotateFromVector(x, y) {
	            throw new Error('rotateFromVector is not implemented yet.');
	        }
	    }, {
	        key: 'rotateAxisAngle',
	        value: function rotateAxisAngle(x, y, z, angle) {
	            return new _DOMMatrix2['default'](this).rotateAxisAngleSelf(x, y, z, angle);
	        }
	    }, {
	        key: 'skewX',
	        value: function skewX(sx) {
	            throw new Error('skewX is not implemented yet.');
	        }
	    }, {
	        key: 'skewY',
	        value: function skewY(sy) {
	            throw new Error('skewY is not implemented yet.');
	        }
	    }, {
	        key: 'multiply',
	        value: function multiply(other) {
	            return new _DOMMatrix2['default'](this).multiplySelf(other);
	        }
	    }, {
	        key: 'flipX',
	        value: function flipX() {
	            throw new Error('flipX is not implemented yet.');
	        }
	    }, {
	        key: 'flipY',
	        value: function flipY() {
	            throw new Error('flipY is not implemented yet.');
	        }
	    }, {
	        key: 'inverse',
	        value: function inverse() {
	            throw new Error('inverse is not implemented yet.');
	        }
	    }, {
	        key: 'transformPoint',
	        value: function transformPoint( /*optional DOMPointInit*/point) {
	            throw new Error('transformPoint is not implemented yet.');
	        }
	    }, {
	        key: 'toFloat32Array',
	        value: function toFloat32Array() {
	            return Float32Array.from(this._matrix);
	        }
	    }, {
	        key: 'toFloat64Array',
	        value: function toFloat64Array() {
	            return Float64Array.from(this._matrix);
	        }

	        //stringifier() {} // What's this?

	    }, {
	        key: 'is2D',
	        get: function get() {
	            return this._is2D;
	        }

	        /*
	         * TODO: make sure this matches the spec.
	         * TODO: Instead of calculating here, perhaps calculate and set
	         * this._isIdentity in other operations, and simply return the internal one
	         * here.
	         */
	    }, {
	        key: 'isIdentity',
	        get: function get() {
	            for (var i = 0, len = this._matrix.length; i < len; i += 1) {
	                if (this._matrix[i] != identity[i]) return this._isIdentity = false;
	            }

	            return this._isIdentity = true;
	        }
	    }, {
	        key: 'a',
	        get: function get() {
	            return this.m11;
	        }
	    }, {
	        key: 'b',
	        get: function get() {
	            return this.m12;
	        }
	    }, {
	        key: 'c',
	        get: function get() {
	            return this.m21;
	        }
	    }, {
	        key: 'd',
	        get: function get() {
	            return this.m22;
	        }
	    }, {
	        key: 'e',
	        get: function get() {
	            return this.m41;
	        }
	    }, {
	        key: 'f',
	        get: function get() {
	            return this.m42;
	        }
	    }, {
	        key: 'm11',
	        get: function get() {
	            return this._matrix[0];
	        }
	    }, {
	        key: 'm12',
	        get: function get() {
	            return this._matrix[4];
	        }
	    }, {
	        key: 'm13',
	        get: function get() {
	            return this._matrix[8];
	        }
	    }, {
	        key: 'm14',
	        get: function get() {
	            return this._matrix[12];
	        }
	    }, {
	        key: 'm21',
	        get: function get() {
	            return this._matrix[1];
	        }
	    }, {
	        key: 'm22',
	        get: function get() {
	            return this._matrix[5];
	        }
	    }, {
	        key: 'm23',
	        get: function get() {
	            return this._matrix[9];
	        }
	    }, {
	        key: 'm24',
	        get: function get() {
	            return this._matrix[13];
	        }
	    }, {
	        key: 'm31',
	        get: function get() {
	            return this._matrix[2];
	        }
	    }, {
	        key: 'm32',
	        get: function get() {
	            return this._matrix[6];
	        }
	    }, {
	        key: 'm33',
	        get: function get() {
	            return this._matrix[10];
	        }
	    }, {
	        key: 'm34',
	        get: function get() {
	            return this._matrix[14];
	        }
	    }, {
	        key: 'm41',
	        get: function get() {
	            return this._matrix[3];
	        }
	    }, {
	        key: 'm42',
	        get: function get() {
	            return this._matrix[7];
	        }
	    }, {
	        key: 'm43',
	        get: function get() {
	            return this._matrix[11];
	        }
	    }, {
	        key: 'm44',
	        get: function get() {
	            return this._matrix[15];
	        }
	    }]);

	    return DOMMatrixReadOnly;
	})();

	exports['default'] = DOMMatrixReadOnly;
	module.exports = exports['default'];
	//# sourceMappingURL=DOMMatrixReadOnly.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	
	// A reusable array, to avoid allocating new arrays during multiplication.
	// in column-major order:
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.multiplyAndApply = multiplyAndApply;
	exports.applyArrayValuesToDOMMatrix = applyArrayValuesToDOMMatrix;
	exports.rotateAxisAngleArray = rotateAxisAngleArray;
	var scratch = [
	/*m11*/0, /*m12*/0, /*m13*/0, /*m14*/0,
	/*m21*/0, /*m22*/0, /*m23*/0, /*m24*/0,
	/*m31*/0, /*m32*/0, /*m33*/0, /*m34*/0,
	/*m41*/0, /*m42*/0, /*m43*/0, /*m44*/0];

	function multiplyAndApply(A, B, target) {

	    //XXX: Are the following calculations faster hard coded (current), or as a loop?

	    scratch[0] = A.m11 * B.m11 + A.m21 * B.m12 + A.m31 * B.m13 + A.m41 * B.m14;
	    scratch[4] = A.m11 * B.m21 + A.m21 * B.m22 + A.m31 * B.m23 + A.m41 * B.m24;
	    scratch[8] = A.m11 * B.m31 + A.m21 * B.m32 + A.m31 * B.m33 + A.m41 * B.m34;
	    scratch[12] = A.m11 * B.m41 + A.m21 * B.m42 + A.m31 * B.m43 + A.m41 * B.m44;

	    scratch[1] = A.m12 * B.m11 + A.m22 * B.m12 + A.m32 * B.m13 + A.m42 * B.m14;
	    scratch[5] = A.m12 * B.m21 + A.m22 * B.m22 + A.m32 * B.m23 + A.m42 * B.m24;
	    scratch[9] = A.m12 * B.m31 + A.m22 * B.m32 + A.m32 * B.m33 + A.m42 * B.m34;
	    scratch[13] = A.m12 * B.m41 + A.m22 * B.m42 + A.m32 * B.m43 + A.m42 * B.m44;

	    scratch[2] = A.m13 * B.m11 + A.m23 * B.m12 + A.m33 * B.m13 + A.m43 * B.m14;
	    scratch[6] = A.m13 * B.m21 + A.m23 * B.m22 + A.m33 * B.m23 + A.m43 * B.m24;
	    scratch[10] = A.m13 * B.m31 + A.m23 * B.m32 + A.m33 * B.m33 + A.m43 * B.m34;
	    scratch[14] = A.m13 * B.m41 + A.m23 * B.m42 + A.m33 * B.m43 + A.m43 * B.m44;

	    scratch[3] = A.m14 * B.m11 + A.m24 * B.m12 + A.m34 * B.m13 + A.m44 * B.m14;
	    scratch[7] = A.m14 * B.m21 + A.m24 * B.m22 + A.m34 * B.m23 + A.m44 * B.m24;
	    scratch[11] = A.m14 * B.m31 + A.m24 * B.m32 + A.m34 * B.m33 + A.m44 * B.m34;
	    scratch[15] = A.m14 * B.m41 + A.m24 * B.m42 + A.m34 * B.m43 + A.m44 * B.m44;

	    applyArrayValuesToDOMMatrix(scratch, target);
	}

	function applyArrayValuesToDOMMatrix(array, matrix) {
	    var length = array.length;

	    if (length === 6) {
	        matrix.m11 = array[0];
	        matrix.m12 = array[1];
	        matrix.m21 = array[2];
	        matrix.m22 = array[3];
	        matrix.m41 = array[4];
	        matrix.m42 = array[5];
	    } else if (length === 16) {
	        matrix.m11 = array[0];
	        matrix.m12 = array[1];
	        matrix.m13 = array[2];
	        matrix.m14 = array[3];
	        matrix.m21 = array[4];
	        matrix.m22 = array[5];
	        matrix.m23 = array[6];
	        matrix.m24 = array[7];
	        matrix.m31 = array[8];
	        matrix.m32 = array[9];
	        matrix.m33 = array[10];
	        matrix.m34 = array[11];
	        matrix.m41 = array[12];
	        matrix.m42 = array[13];
	        matrix.m43 = array[14];
	        matrix.m44 = array[15];
	    }
	}

	function rotateAxisAngleArray(x, y, z, angle) {
	    var sin = Math.sin;
	    var cos = Math.cos;
	    var pow = Math.pow;

	    var halfAngle = degreesToRadians(angle / 2);

	    // TODO: should we provide a 6-item array here to signify 2D when the
	    // rotation is about the Z axis (for example when calling rotateSelf)?
	    // TODO: Performance can be improved by first detecting when x, y, or z of
	    // the axis are zero or 1, and using a pre-simplified version of the
	    // folowing math based on that condition.
	    // TODO: Performance can be improved by using different equations (use trig
	    // identities to find alternate formulas).
	    return [1 - 2 * (y * y + z * z) * pow(sin(halfAngle), 2), 2 * (x * y * pow(sin(halfAngle), 2) + z * sin(halfAngle) * cos(halfAngle)), 2 * (x * z * pow(sin(halfAngle), 2) - y * sin(halfAngle) * cos(halfAngle)), 0, 2 * (x * y * pow(sin(halfAngle), 2) - z * sin(halfAngle) * cos(halfAngle)), 1 - 2 * (x * x + z * z) * pow(sin(halfAngle), 2), 2 * (y * z * pow(sin(halfAngle), 2) + x * sin(halfAngle) * cos(halfAngle)), 0, 2 * (x * z * pow(sin(halfAngle), 2) + y * sin(halfAngle) * cos(halfAngle)), 2 * (y * z * pow(sin(halfAngle), 2) - x * sin(halfAngle) * cos(halfAngle)), 1 - 2 * (x * x + y * y) * pow(sin(halfAngle), 2), 0, 0, 0, 0, 1];
	}

	function degreesToRadians(degrees) {
	    return Math.PI / 180 * degrees;
	}
	//# sourceMappingURL=utilities.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var privatesMap = undefined;
	var _ = function _(o) {
	    if (!privatesMap) {
	        privatesMap = new WeakMap();
	        var privates = {};
	        privatesMap.set(o, privates);
	        return privates;
	    } else {
	        var privates = privatesMap.get(o);

	        if (privates === undefined) {
	            privates = {};
	            privatesMap.set(o, privates);
	        }

	        return privates;
	    }
	};

	var DOMPointReadOnly = (function () {
	    function DOMPointReadOnly(x, y, z, w) {
	        _classCallCheck(this, DOMPointReadOnly);

	        if (arguments.length === 1) {
	            if (!isDOMPointInit(x)) throw new TypeError('Expected an object with x, y, z, and w properties');

	            _(this).x = x.x;
	            _(this).y = x.y;
	            _(this).z = x.z;
	            _(this).w = x.w;
	        } else if (arguments.length === 4) {
	            _(this).x = x || 0;
	            _(this).y = y || 0;
	            _(this).z = z || 0;
	            _(this).w = w || 0;
	        } else {
	            throw new TypeError('Expected 1 or 4 arguments');
	        }
	    }

	    _createClass(DOMPointReadOnly, [{
	        key: 'matrixTransform',
	        value: function matrixTransform(matrix) {
	            var result = new this.constructor(this);
	            // TODO
	            //const x
	            //const y
	            //const z
	            //const w

	            return result;
	        }
	    }, {
	        key: 'x',
	        get: function get() {
	            return _(this).x;
	        }
	    }, {
	        key: 'y',
	        get: function get() {
	            return _(this).y;
	        }
	    }, {
	        key: 'z',
	        get: function get() {
	            return _(this).z;
	        }
	    }, {
	        key: 'w',
	        get: function get() {
	            return _(this).w;
	        }
	    }], [{
	        key: 'fromPoint',
	        value: function fromPoint(other) {
	            return new this(other);
	        }
	    }]);

	    return DOMPointReadOnly;
	})();

	exports.DOMPointReadOnly = DOMPointReadOnly;

	var DOMPoint = (function (_DOMPointReadOnly) {
	    _inherits(DOMPoint, _DOMPointReadOnly);

	    function DOMPoint() {
	        _classCallCheck(this, DOMPoint);

	        _get(Object.getPrototypeOf(DOMPoint.prototype), 'constructor', this).apply(this, arguments);
	    }

	    _createClass(DOMPoint, [{
	        key: 'x',
	        set: function set(value) {
	            _(this).x = value;
	        }
	    }, {
	        key: 'y',
	        set: function set(value) {
	            _(this).y = value;
	        }
	    }, {
	        key: 'z',
	        set: function set(value) {
	            _(this).z = value;
	        }
	    }, {
	        key: 'w',
	        set: function set(value) {
	            _(this).w = value;
	        }
	    }]);

	    return DOMPoint;
	})(DOMPointReadOnly);

	exports.DOMPoint = DOMPoint;
	exports['default'] = DOMPoint;

	function isDOMPointInit(o) {
	    if (typeof o != 'object') return false;

	    if ('x' in o && 'y' in o && 'z' in o && 'w' in o) return true;

	    return false;
	}
	//# sourceMappingURL=DOMPoint.js.map

/***/ })
/******/ ])
});
;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(95);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(96);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(98);
__webpack_require__(99);
__webpack_require__(114);
__webpack_require__(118);
__webpack_require__(129);
__webpack_require__(130);
module.exports = __webpack_require__(5).Promise;


/***/ }),
/* 98 */
/***/ (function(module, exports) {



/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(100)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(43)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);
var defined = __webpack_require__(24);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(9) && !__webpack_require__(45)(function () {
  return Object.defineProperty(__webpack_require__(25)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(16);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(105);
var descriptor = __webpack_require__(46);
var setToStringTag = __webpack_require__(28);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(6)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(7);
var dPs = __webpack_require__(106);
var enumBugKeys = __webpack_require__(50);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(25)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(51).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(15);
var anObject = __webpack_require__(7);
var getKeys = __webpack_require__(107);

module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(108);
var enumBugKeys = __webpack_require__(50);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(17);
var toIObject = __webpack_require__(26);
var arrayIndexOf = __webpack_require__(110)(false);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(26);
var toLength = __webpack_require__(47);
var toAbsoluteIndex = __webpack_require__(111);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(23);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(17);
var toObject = __webpack_require__(113);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(24);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(115);
var global = __webpack_require__(0);
var hide = __webpack_require__(6);
var Iterators = __webpack_require__(10);
var TO_STRING_TAG = __webpack_require__(1)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(116);
var step = __webpack_require__(117);
var Iterators = __webpack_require__(10);
var toIObject = __webpack_require__(26);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(43)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(44);
var global = __webpack_require__(0);
var ctx = __webpack_require__(13);
var classof = __webpack_require__(52);
var $export = __webpack_require__(12);
var isObject = __webpack_require__(16);
var aFunction = __webpack_require__(14);
var anInstance = __webpack_require__(119);
var forOf = __webpack_require__(120);
var speciesConstructor = __webpack_require__(53);
var task = __webpack_require__(54).set;
var microtask = __webpack_require__(125)();
var newPromiseCapabilityModule = __webpack_require__(29);
var perform = __webpack_require__(55);
var promiseResolve = __webpack_require__(56);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var sameConstructor = LIBRARY ? function (a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
} : function (a, b) {
  return a === b;
};
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(126)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return sameConstructor($Promise, C)
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(28)($Promise, PROMISE);
__webpack_require__(127)(PROMISE);
Wrapper = __webpack_require__(5)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    return promiseResolve(this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(128)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(13);
var call = __webpack_require__(121);
var isArrayIter = __webpack_require__(122);
var anObject = __webpack_require__(7);
var toLength = __webpack_require__(47);
var getIterFn = __webpack_require__(123);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(7);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(10);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(52);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(10);
module.exports = __webpack_require__(5).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 124 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var macrotask = __webpack_require__(54).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(18)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(6);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(0);
var core = __webpack_require__(5);
var dP = __webpack_require__(15);
var DESCRIPTORS = __webpack_require__(9);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(12);
var core = __webpack_require__(5);
var global = __webpack_require__(0);
var speciesConstructor = __webpack_require__(53);
var promiseResolve = __webpack_require__(56);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(12);
var newPromiseCapability = __webpack_require__(29);
var perform = __webpack_require__(55);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(22);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = __webpack_require__(22);

var _promise2 = _interopRequireDefault(_promise);

exports.default = sleep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Await for a certain amount of time.
 *
 * @example
 * ```js
 * async function main() {
 *     await sleep(10000)
 *     console.log('Logged after 10000 milliseconds!')
 * }
 * main()
 * ```
 */

function sleep(duration) {
  var resolve = null;
  var promise = new _promise2.default(function (r) {
    return resolve = r;
  });
  setTimeout(resolve, duration);
  return promise;
}
//# sourceMappingURL=sleep.js.map

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * two.js
 * a two-dimensional drawing api meant for modern browsers. It is renderer
 * agnostic enabling the same api for rendering in multiple contexts: webgl,
 * canvas2d, and svg.
 *
 * Copyright (c) 2012 - 2017 jonobr1 / http://jonobr1.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

this.Two = (function(previousTwo) {

  var root = typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : null;
  var _ = {
    // http://underscorejs.org/ • 1.8.3
    _indexAmount: 0,
    natural: {
      slice: Array.prototype.slice,
      indexOf: Array.prototype.indexOf,
      keys: Object.keys,
      bind: Function.prototype.bind,
      create: Object.create
    },
    identity: function(value) {
      return value;
    },
    isArguments: function(obj) {
      return toString.call(obj) === '[object Arguments]';
    },
    isFunction: function(obj) {
      return toString.call(obj) === '[object Function]';
    },
    isString: function(obj) {
      return toString.call(obj) === '[object String]';
    },
    isNumber: function(obj) {
      return toString.call(obj) === '[object Number]';
    },
    isDate: function(obj) {
      return toString.call(obj) === '[object Date]';
    },
    isRegExp: function(obj) {
      return toString.call(obj) === '[object RegExp]';
    },
    isError: function(obj) {
      return toString.call(obj) === '[object Error]';
    },
    isFinite: function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    },
    isNaN: function(obj) {
      return _.isNumber(obj) && obj !== +obj;
    },
    isBoolean: function(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    },
    isNull: function(obj) {
      return obj === null;
    },
    isUndefined: function(obj) {
      return obj === void 0;
    },
    isEmpty: function(obj) {
      if (obj == null) return true;
      if (isArrayLike && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
      return _.keys(obj).length === 0;
    },
    isElement: function(obj) {
      return !!(obj && obj.nodeType === 1);
    },
    isArray: Array.isArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    },
    isObject: function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    },
    toArray: function(obj) {
      if (!obj) {
        return [];
      }
      if (_.isArray(obj)) {
        return slice.call(obj);
      }
      if (isArrayLike(obj)) {
        return _.map(obj, _.identity);
      }
      return _.values(obj);
    },
    range: function(start, stop, step) {
      if (stop == null) {
        stop = start || 0;
        start = 0;
      }
      step = step || 1;

      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);

      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }

      return range;
    },
    indexOf: function(list, item) {
      if (!!_.natural.indexOf) {
        return _.natural.indexOf.call(list, item);
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i] === item) {
          return i;
        }
      }
      return -1;
    },
    has: function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    },
    bind: function(func, ctx) {
      var natural = _.natural.bind;
      if (natural && func.bind === natural) {
        return natural.apply(func, slice.call(arguments, 1));
      }
      var args = slice.call(arguments, 2);
      return function() {
        func.apply(ctx, args);
      };
    },
    extend: function(base) {
      var sources = slice.call(arguments, 1);
      for (var i = 0; i < sources.length; i++) {
        var obj = sources[i];
        for (var k in obj) {
          base[k] = obj[k];
        }
      }
      return base;
    },
    defaults: function(base) {
      var sources = slice.call(arguments, 1);
      for (var i = 0; i < sources.length; i++) {
        var obj = sources[i];
        for (var k in obj) {
          if (base[k] === void 0) {
            base[k] = obj[k];
          }
        }
      }
      return base;
    },
    keys: function(obj) {
      if (!_.isObject(obj)) {
        return [];
      }
      if (_.natural.keys) {
        return _.natural.keys(obj);
      }
      var keys = [];
      for (var k in obj) {
        if (_.has(obj, k)) {
          keys.push(k);
        }
      }
      return keys;
    },
    values: function(obj) {
      var keys = _.keys(obj);
      var values = [];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        values.push(obj[k]);
      }
      return values;
    },
    each: function(obj, iteratee, context) {
      var ctx = context || this;
      var keys = !isArrayLike(obj) && _.keys(obj);
      var length = (keys || obj).length;
      for (var i = 0; i < length; i++) {
        var k = keys ? keys[i] : i;
        iteratee.call(ctx, obj[k], k, obj);
      }
      return obj;
    },
    map: function(obj, iteratee, context) {
      var ctx = context || this;
      var keys = !isArrayLike(obj) && _.keys(obj);
      var length = (keys || obj).length;
      var result = [];
      for (var i = 0; i < length; i++) {
        var k = keys ? keys[i] : i;
        result[i] = iteratee.call(ctx, obj[k], k, obj);
      }
      return result;
    },
    once: function(func) {
      var init = false;
      return function() {
        if (!!init) {
          return func;
        }
        init = true;
        return func.apply(this, arguments);
      }
    },
    after: function(times, func) {
      return function() {
        while (--times < 1) {
          return func.apply(this, arguments);
        }
      }
    },
    uniqueId: function(prefix) {
      var id = ++_._indexAmount + '';
      return prefix ? prefix + id : id;
    }
  };

  /**
   * Constants
   */

  var sin = Math.sin,
    cos = Math.cos,
    atan2 = Math.atan2,
    sqrt = Math.sqrt,
    round = Math.round,
    abs = Math.abs,
    PI = Math.PI,
    TWO_PI = PI * 2,
    HALF_PI = PI / 2,
    pow = Math.pow,
    min = Math.min,
    max = Math.max;

  /**
   * Localized variables
   */

  var count = 0;
  var slice = _.natural.slice;
  var perf = ((root.performance && root.performance.now) ? root.performance : Date);
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = function(obj) {
    return obj == null ? void 0 : obj['length'];
  };
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  /**
   * Cross browser dom events.
   */
  var dom = {

    temp: (root.document ? root.document.createElement('div') : {}),

    hasEventListeners: _.isFunction(root.addEventListener),

    bind: function(elem, event, func, bool) {
      if (this.hasEventListeners) {
        elem.addEventListener(event, func, !!bool);
      } else {
        elem.attachEvent('on' + event, func);
      }
      return dom;
    },

    unbind: function(elem, event, func, bool) {
      if (dom.hasEventListeners) {
        elem.removeEventListeners(event, func, !!bool);
      } else {
        elem.detachEvent('on' + event, func);
      }
      return dom;
    },

    getRequestAnimationFrame: function() {

      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      var request = root.requestAnimationFrame, cancel;

      if(!request) {
        for (var i = 0; i < vendors.length; i++) {
          request = root[vendors[i] + 'RequestAnimationFrame'] || request;
          cancel = root[vendors[i] + 'CancelAnimationFrame']
            || root[vendors[i] + 'CancelRequestAnimationFrame'] || cancel;
        }

        request = request || function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = root.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
        // cancel = cancel || function(id) {
        //   clearTimeout(id);
        // };
      }

      request.init = _.once(loop);

      return request;

    }

  };

  /**
   * @class
   */
  var Two = root.Two = function(options) {

    // Determine what Renderer to use and setup a scene.

    var params = _.defaults(options || {}, {
      fullscreen: false,
      width: 640,
      height: 480,
      type: Two.Types.svg,
      autostart: false
    });

    _.each(params, function(v, k) {
      if (k === 'fullscreen' || k === 'autostart') {
        return;
      }
      this[k] = v;
    }, this);

    // Specified domElement overrides type declaration only if the element does not support declared renderer type.
    if (_.isElement(params.domElement)) {
      var tagName = params.domElement.tagName.toLowerCase();
      // TODO: Reconsider this if statement's logic.
      if (!/^(CanvasRenderer-canvas|WebGLRenderer-canvas|SVGRenderer-svg)$/.test(this.type+'-'+tagName)) {
        this.type = Two.Types[tagName];
      }
    }

    this.renderer = new Two[this.type](this);
    Two.Utils.setPlaying.call(this, params.autostart);
    this.frameCount = 0;

    if (params.fullscreen) {

      var fitted = _.bind(fitToWindow, this);
      _.extend(document.body.style, {
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed'
      });
      _.extend(this.renderer.domElement.style, {
        display: 'block',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed'
      });
      dom.bind(root, 'resize', fitted);
      fitted();


    } else if (!_.isElement(params.domElement)) {

      this.renderer.setSize(params.width, params.height, this.ratio);
      this.width = params.width;
      this.height = params.height;

    }

    this.scene = this.renderer.scene;

    Two.Instances.push(this);
    raf.init();

  };

  _.extend(Two, {

    /**
     * Access to root in other files.
     */

    root: root,

    /**
     * Primitive
     */

    Array: root.Float32Array || Array,

    Types: {
      webgl: 'WebGLRenderer',
      svg: 'SVGRenderer',
      canvas: 'CanvasRenderer'
    },

    Version: 'v0.7.0',

    Identifier: 'two_',

    Properties: {
      hierarchy: 'hierarchy',
      demotion: 'demotion'
    },

    Events: {
      play: 'play',
      pause: 'pause',
      update: 'update',
      render: 'render',
      resize: 'resize',
      change: 'change',
      remove: 'remove',
      insert: 'insert',
      order: 'order',
      load: 'load'
    },

    Commands: {
      move: 'M',
      line: 'L',
      curve: 'C',
      close: 'Z'
    },

    Resolution: 8,

    Instances: [],

    noConflict: function() {
      root.Two = previousTwo;
      return this;
    },

    uniqueId: function() {
      var id = count;
      count++;
      return id;
    },

    Utils: _.extend(_, {

      performance: perf,

      defineProperty: function(property) {

        var object = this;
        var secret = '_' + property;
        var flag = '_flag' + property.charAt(0).toUpperCase() + property.slice(1);

        Object.defineProperty(object, property, {
          enumerable: true,
          get: function() {
            return this[secret];
          },
          set: function(v) {
            this[secret] = v;
            this[flag] = true;
          }
        });

      },

      /**
       * Release an arbitrary class' events from the two.js corpus and recurse
       * through its children and or vertices.
       */
      release: function(obj) {

        if (!_.isObject(obj)) {
          return;
        }

        if (_.isFunction(obj.unbind)) {
          obj.unbind();
        }

        if (obj.vertices) {
          if (_.isFunction(obj.vertices.unbind)) {
            obj.vertices.unbind();
          }
          _.each(obj.vertices, function(v) {
            if (_.isFunction(v.unbind)) {
              v.unbind();
            }
          });
        }

        if (obj.children) {
          _.each(obj.children, function(obj) {
            Two.Utils.release(obj);
          });
        }

      },

      xhr: function(path, callback) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
          }
        };

        xhr.send();
        return xhr;

      },

      Curve: {

        CollinearityEpsilon: pow(10, -30),

        RecursionLimit: 16,

        CuspLimit: 0,

        Tolerance: {
          distance: 0.25,
          angle: 0,
          epsilon: 0.01
        },

        // Lookup tables for abscissas and weights with values for n = 2 .. 16.
        // As values are symmetric, only store half of them and adapt algorithm
        // to factor in symmetry.
        abscissas: [
          [  0.5773502691896257645091488],
          [0,0.7745966692414833770358531],
          [  0.3399810435848562648026658,0.8611363115940525752239465],
          [0,0.5384693101056830910363144,0.9061798459386639927976269],
          [  0.2386191860831969086305017,0.6612093864662645136613996,0.9324695142031520278123016],
          [0,0.4058451513773971669066064,0.7415311855993944398638648,0.9491079123427585245261897],
          [  0.1834346424956498049394761,0.5255324099163289858177390,0.7966664774136267395915539,0.9602898564975362316835609],
          [0,0.3242534234038089290385380,0.6133714327005903973087020,0.8360311073266357942994298,0.9681602395076260898355762],
          [  0.1488743389816312108848260,0.4333953941292471907992659,0.6794095682990244062343274,0.8650633666889845107320967,0.9739065285171717200779640],
          [0,0.2695431559523449723315320,0.5190961292068118159257257,0.7301520055740493240934163,0.8870625997680952990751578,0.9782286581460569928039380],
          [  0.1252334085114689154724414,0.3678314989981801937526915,0.5873179542866174472967024,0.7699026741943046870368938,0.9041172563704748566784659,0.9815606342467192506905491],
          [0,0.2304583159551347940655281,0.4484927510364468528779129,0.6423493394403402206439846,0.8015780907333099127942065,0.9175983992229779652065478,0.9841830547185881494728294],
          [  0.1080549487073436620662447,0.3191123689278897604356718,0.5152486363581540919652907,0.6872929048116854701480198,0.8272013150697649931897947,0.9284348836635735173363911,0.9862838086968123388415973],
          [0,0.2011940939974345223006283,0.3941513470775633698972074,0.5709721726085388475372267,0.7244177313601700474161861,0.8482065834104272162006483,0.9372733924007059043077589,0.9879925180204854284895657],
          [  0.0950125098376374401853193,0.2816035507792589132304605,0.4580167776572273863424194,0.6178762444026437484466718,0.7554044083550030338951012,0.8656312023878317438804679,0.9445750230732325760779884,0.9894009349916499325961542]
        ],

        weights: [
          [1],
          [0.8888888888888888888888889,0.5555555555555555555555556],
          [0.6521451548625461426269361,0.3478548451374538573730639],
          [0.5688888888888888888888889,0.4786286704993664680412915,0.2369268850561890875142640],
          [0.4679139345726910473898703,0.3607615730481386075698335,0.1713244923791703450402961],
          [0.4179591836734693877551020,0.3818300505051189449503698,0.2797053914892766679014678,0.1294849661688696932706114],
          [0.3626837833783619829651504,0.3137066458778872873379622,0.2223810344533744705443560,0.1012285362903762591525314],
          [0.3302393550012597631645251,0.3123470770400028400686304,0.2606106964029354623187429,0.1806481606948574040584720,0.0812743883615744119718922],
          [0.2955242247147528701738930,0.2692667193099963550912269,0.2190863625159820439955349,0.1494513491505805931457763,0.0666713443086881375935688],
          [0.2729250867779006307144835,0.2628045445102466621806889,0.2331937645919904799185237,0.1862902109277342514260976,0.1255803694649046246346943,0.0556685671161736664827537],
          [0.2491470458134027850005624,0.2334925365383548087608499,0.2031674267230659217490645,0.1600783285433462263346525,0.1069393259953184309602547,0.0471753363865118271946160],
          [0.2325515532308739101945895,0.2262831802628972384120902,0.2078160475368885023125232,0.1781459807619457382800467,0.1388735102197872384636018,0.0921214998377284479144218,0.0404840047653158795200216],
          [0.2152638534631577901958764,0.2051984637212956039659241,0.1855383974779378137417166,0.1572031671581935345696019,0.1215185706879031846894148,0.0801580871597602098056333,0.0351194603317518630318329],
          [0.2025782419255612728806202,0.1984314853271115764561183,0.1861610000155622110268006,0.1662692058169939335532009,0.1395706779261543144478048,0.1071592204671719350118695,0.0703660474881081247092674,0.0307532419961172683546284],
          [0.1894506104550684962853967,0.1826034150449235888667637,0.1691565193950025381893121,0.1495959888165767320815017,0.1246289712555338720524763,0.0951585116824927848099251,0.0622535239386478928628438,0.0271524594117540948517806]
        ]

      },

      /**
       * Account for high dpi rendering.
       * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
       */

      devicePixelRatio: root.devicePixelRatio || 1,

      getBackingStoreRatio: function(ctx) {
        return ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1;
      },

      getRatio: function(ctx) {
        return Two.Utils.devicePixelRatio / getBackingStoreRatio(ctx);
      },

      /**
       * Properly defer play calling until after all objects
       * have been updated with their newest styles.
       */
      setPlaying: function(b) {

        this.playing = !!b;
        return this;

      },

      /**
       * Return the computed matrix of a nested object.
       * TODO: Optimize traversal.
       */
      getComputedMatrix: function(object, matrix) {

        matrix = (matrix && matrix.identity()) || new Two.Matrix();
        var parent = object, matrices = [];

        while (parent && parent._matrix) {
          matrices.push(parent._matrix);
          parent = parent.parent;
        }

        matrices.reverse();

        _.each(matrices, function(m) {

          var e = m.elements;
          matrix.multiply(
            e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9]);

        });

        return matrix;

      },

      deltaTransformPoint: function(matrix, x, y) {

        var dx = x * matrix.a + y * matrix.c + 0;
        var dy = x * matrix.b + y * matrix.d + 0;

        return new Two.Vector(dx, dy);

      },

      /**
       * https://gist.github.com/2052247
       */
      decomposeMatrix: function(matrix) {

        // calculate delta transform point
        var px = Two.Utils.deltaTransformPoint(matrix, 0, 1);
        var py = Two.Utils.deltaTransformPoint(matrix, 1, 0);

        // calculate skew
        var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
        var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

        return {
            translateX: matrix.e,
            translateY: matrix.f,
            scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
            scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
            skewX: skewX,
            skewY: skewY,
            rotation: skewX // rotation is the same as skew x
        };

      },

      /**
       * Walk through item properties and pick the ones of interest.
       * Will try to resolve styles applied via CSS
       *
       * TODO: Reverse calculate `Two.Gradient`s for fill / stroke
       * of any given path.
       */
      applySvgAttributes: function(node, elem) {

        var attributes = {}, styles = {}, i, key, value, attr;

        // Not available in non browser environments
        if (getComputedStyle) {
          // Convert CSSStyleDeclaration to a normal object
          var computedStyles = getComputedStyle(node);
          i = computedStyles.length;

          while (i--) {
            key = computedStyles[i];
            value = computedStyles[key];
            // Gecko returns undefined for unset properties
            // Webkit returns the default value
            if (value !== undefined) {
              styles[key] = value;
            }
          }
        }

        // Convert NodeMap to a normal object
        i = node.attributes.length;
        while (i--) {
          attr = node.attributes[i];
          attributes[attr.nodeName] = attr.value;
        }

        // Getting the correct opacity is a bit tricky, since SVG path elements don't
        // support opacity as an attribute, but you can apply it via CSS.
        // So we take the opacity and set (stroke/fill)-opacity to the same value.
        if (!_.isUndefined(styles.opacity)) {
          styles['stroke-opacity'] = styles.opacity;
          styles['fill-opacity'] = styles.opacity;
        }

        // Merge attributes and applied styles (attributes take precedence)
        _.extend(styles, attributes);

        // Similarly visibility is influenced by the value of both display and visibility.
        // Calculate a unified value here which defaults to `true`.
        styles.visible = !(_.isUndefined(styles.display) && styles.display === 'none')
          || (_.isUndefined(styles.visibility) && styles.visibility === 'hidden');

        // Now iterate the whole thing
        for (key in styles) {
          value = styles[key];

          switch (key) {
            case 'transform':
              // TODO: Check this out https://github.com/paperjs/paper.js/blob/master/src/svg/SVGImport.js#L313
              if (value === 'none') break;
              var m = node.getCTM ? node.getCTM() : null;

              // Might happen when transform string is empty or not valid.
              if (m === null) break;

              // // Option 1: edit the underlying matrix and don't force an auto calc.
              // var m = node.getCTM();
              // elem._matrix.manual = true;
              // elem._matrix.set(m.a, m.b, m.c, m.d, m.e, m.f);

              // Option 2: Decompose and infer Two.js related properties.
              var transforms = Two.Utils.decomposeMatrix(node.getCTM());

              elem.translation.set(transforms.translateX, transforms.translateY);
              elem.rotation = transforms.rotation;
              // Warning: Two.js elements only support uniform scalars...
              elem.scale = transforms.scaleX;

              var x = parseFloat((styles.x + '').replace('px'));
              var y = parseFloat((styles.y + '').replace('px'));

              // Override based on attributes.
              if (x) {
                elem.translation.x = x;
              }

              if (y) {
                elem.translation.y = y;
              }

              break;
            case 'visible':
              elem.visible = value;
              break;
            case 'stroke-linecap':
              elem.cap = value;
              break;
            case 'stroke-linejoin':
              elem.join = value;
              break;
            case 'stroke-miterlimit':
              elem.miter = value;
              break;
            case 'stroke-width':
              elem.linewidth = parseFloat(value);
              break;
            case 'stroke-opacity':
            case 'fill-opacity':
            case 'opacity':
              elem.opacity = parseFloat(value);
              break;
            case 'fill':
            case 'stroke':
              if (/url\(\#.*\)/i.test(value)) {
                elem[key] = this.getById(
                  value.replace(/url\(\#(.*)\)/i, '$1'));
              } else {
                elem[key] = (value === 'none') ? 'transparent' : value;
              }
              break;
            case 'id':
              elem.id = value;
              break;
            case 'class':
              elem.classList = value.split(' ');
              break;
          }
        }

        return elem;

      },

      /**
       * Read any number of SVG node types and create Two equivalents of them.
       */
      read: {

        svg: function() {
          return Two.Utils.read.g.apply(this, arguments);
        },

        g: function(node) {

          var group = new Two.Group();

          // Switched up order to inherit more specific styles
          Two.Utils.applySvgAttributes.call(this, node, group);

          for (var i = 0, l = node.childNodes.length; i < l; i++) {
            var n = node.childNodes[i];
            var tag = n.nodeName;
            if (!tag) return;

            var tagName = tag.replace(/svg\:/ig, '').toLowerCase();

            if (tagName in Two.Utils.read) {
              var o = Two.Utils.read[tagName].call(group, n);
              group.add(o);
            }
          }

          return group;

        },

        polygon: function(node, open) {

          var points = node.getAttribute('points');

          var verts = [];
          points.replace(/(-?[\d\.?]+)[,|\s](-?[\d\.?]+)/g, function(match, p1, p2) {
            verts.push(new Two.Anchor(parseFloat(p1), parseFloat(p2)));
          });

          var poly = new Two.Path(verts, !open).noStroke();
          poly.fill = 'black';

          return Two.Utils.applySvgAttributes.call(this, node, poly);

        },

        polyline: function(node) {
          return Two.Utils.read.polygon.call(this, node, true);
        },

        path: function(node) {

          var path = node.getAttribute('d');

          // Create a Two.Path from the paths.

          var coord = new Two.Anchor();
          var control, coords;
          var closed = false, relative = false;
          var commands = path.match(/[a-df-z][^a-df-z]*/ig);
          var last = commands.length - 1;

          // Split up polybeziers

          _.each(commands.slice(0), function(command, i) {

            var type = command[0];
            var lower = type.toLowerCase();
            var items = command.slice(1).trim().split(/[\s,]+|(?=\s?[+\-])/);
            var pre, post, result = [], bin;

            if (i <= 0) {
              commands = [];
            }

            switch (lower) {
              case 'h':
              case 'v':
                if (items.length > 1) {
                  bin = 1;
                }
                break;
              case 'm':
              case 'l':
              case 't':
                if (items.length > 2) {
                  bin = 2;
                }
                break;
              case 's':
              case 'q':
                if (items.length > 4) {
                  bin = 4;
                }
                break;
              case 'c':
                if (items.length > 6) {
                  bin = 6;
                }
                break;
              case 'a':
                // TODO: Handle Ellipses
                break;
            }

            if (bin) {

              for (var j = 0, l = items.length, times = 0; j < l; j+=bin) {

                var ct = type;
                if (times > 0) {

                  switch (type) {
                    case 'm':
                      ct = 'l';
                      break;
                    case 'M':
                      ct = 'L';
                      break;
                  }

                }

                result.push([ct].concat(items.slice(j, j + bin)).join(' '));
                times++;

              }

              commands = Array.prototype.concat.apply(commands, result);

            } else {

              commands.push(command);

            }

          });

          // Create the vertices for our Two.Path

          var points = [];
          _.each(commands, function(command, i) {

            var result, x, y;
            var type = command[0];
            var lower = type.toLowerCase();

            coords = command.slice(1).trim();
            coords = coords.replace(/(-?\d+(?:\.\d*)?)[eE]([+\-]?\d+)/g, function(match, n1, n2) {
              return parseFloat(n1) * pow(10, n2);
            });
            coords = coords.split(/[\s,]+|(?=\s?[+\-])/);
            relative = type === lower;

            var x1, y1, x2, y2, x3, y3, x4, y4, reflection;

            switch (lower) {

              case 'z':
                if (i >= last) {
                  closed = true;
                } else {
                  x = coord.x;
                  y = coord.y;
                  result = new Two.Anchor(
                    x, y,
                    undefined, undefined,
                    undefined, undefined,
                    Two.Commands.close
                  );
                }
                break;

              case 'm':
              case 'l':

                x = parseFloat(coords[0]);
                y = parseFloat(coords[1]);

                result = new Two.Anchor(
                  x, y,
                  undefined, undefined,
                  undefined, undefined,
                  lower === 'm' ? Two.Commands.move : Two.Commands.line
                );

                if (relative) {
                  result.addSelf(coord);
                }

                // result.controls.left.copy(result);
                // result.controls.right.copy(result);

                coord = result;
                break;

              case 'h':
              case 'v':

                var a = lower === 'h' ? 'x' : 'y';
                var b = a === 'x' ? 'y' : 'x';

                result = new Two.Anchor(
                  undefined, undefined,
                  undefined, undefined,
                  undefined, undefined,
                  Two.Commands.line
                );
                result[a] = parseFloat(coords[0]);
                result[b] = coord[b];

                if (relative) {
                  result[a] += coord[a];
                }

                // result.controls.left.copy(result);
                // result.controls.right.copy(result);

                coord = result;
                break;

              case 'c':
              case 's':

                x1 = coord.x;
                y1 = coord.y;

                if (!control) {
                  control = new Two.Vector();//.copy(coord);
                }

                if (lower === 'c') {

                  x2 = parseFloat(coords[0]);
                  y2 = parseFloat(coords[1]);
                  x3 = parseFloat(coords[2]);
                  y3 = parseFloat(coords[3]);
                  x4 = parseFloat(coords[4]);
                  y4 = parseFloat(coords[5]);

                } else {

                  // Calculate reflection control point for proper x2, y2
                  // inclusion.

                  reflection = getReflection(coord, control, relative);

                  x2 = reflection.x;
                  y2 = reflection.y;
                  x3 = parseFloat(coords[0]);
                  y3 = parseFloat(coords[1]);
                  x4 = parseFloat(coords[2]);
                  y4 = parseFloat(coords[3]);

                }

                if (relative) {
                  x2 += x1;
                  y2 += y1;
                  x3 += x1;
                  y3 += y1;
                  x4 += x1;
                  y4 += y1;
                }

                if (!_.isObject(coord.controls)) {
                  Two.Anchor.AppendCurveProperties(coord);
                }

                coord.controls.right.set(x2 - coord.x, y2 - coord.y);
                result = new Two.Anchor(
                  x4, y4,
                  x3 - x4, y3 - y4,
                  undefined, undefined,
                  Two.Commands.curve
                );

                coord = result;
                control = result.controls.left;

                break;

              case 't':
              case 'q':

                x1 = coord.x;
                y1 = coord.y;

                if (!control) {
                  control = new Two.Vector();//.copy(coord);
                }

                if (control.isZero()) {
                  x2 = x1;
                  y2 = y1;
                } else {
                  x2 = control.x;
                  y1 = control.y;
                }

                if (lower === 'q') {

                  x3 = parseFloat(coords[0]);
                  y3 = parseFloat(coords[1]);
                  x4 = parseFloat(coords[1]);
                  y4 = parseFloat(coords[2]);

                } else {

                  reflection = getReflection(coord, control, relative);

                  x3 = reflection.x;
                  y3 = reflection.y;
                  x4 = parseFloat(coords[0]);
                  y4 = parseFloat(coords[1]);

                }

                if (relative) {
                  x2 += x1;
                  y2 += y1;
                  x3 += x1;
                  y3 += y1;
                  x4 += x1;
                  y4 += y1;
                }

                if (!_.isObject(coord.controls)) {
                  Two.Anchor.AppendCurveProperties(coord);
                }

                coord.controls.right.set(x2 - coord.x, y2 - coord.y);
                result = new Two.Anchor(
                  x4, y4,
                  x3 - x4, y3 - y4,
                  undefined, undefined,
                  Two.Commands.curve
                );

                coord = result;
                control = result.controls.left;

                break;

              case 'a':

                // throw new Two.Utils.Error('not yet able to interpret Elliptical Arcs.');
                x1 = coord.x;
                y1 = coord.y;

                var rx = parseFloat(coords[0]);
                var ry = parseFloat(coords[1]);
                var xAxisRotation = parseFloat(coords[2]) * Math.PI / 180;
                var largeArcFlag = parseFloat(coords[3]);
                var sweepFlag = parseFloat(coords[4]);

                x4 = parseFloat(coords[5]);
                y4 = parseFloat(coords[6]);

                if (relative) {
                  x4 += x1;
                  y4 += y1;
                }

                // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

                // Calculate midpoint mx my
                var mx = (x4 - x1) / 2;
                var my = (y4 - y1) / 2;

                // Calculate x1' y1' F.6.5.1
                var _x = mx * Math.cos(xAxisRotation) + my * Math.sin(xAxisRotation);
                var _y = - mx * Math.sin(xAxisRotation) + my * Math.cos(xAxisRotation);

                var rx2 = rx * rx;
                var ry2 = ry * ry;
                var _x2 = _x * _x;
                var _y2 = _y * _y;

                // adjust radii
                var l = _x2 / rx2 + _y2 / ry2;
                if (l > 1) {
                  rx *= Math.sqrt(l);
                  ry *= Math.sqrt(l);
                }

                var amp = Math.sqrt((rx2 * ry2 - rx2 * _y2 - ry2 * _x2) / (rx2 * _y2 + ry2 * _x2));

                if (_.isNaN(amp)) {
                  amp = 0;
                } else if (largeArcFlag != sweepFlag && amp > 0) {
                  amp *= -1;
                }

                // Calculate cx' cy' F.6.5.2
                var _cx = amp * rx * _y / ry;
                var _cy = - amp * ry * _x / rx;

                // Calculate cx cy F.6.5.3
                var cx = _cx * Math.cos(xAxisRotation) - _cy * Math.sin(xAxisRotation) + (x1 + x4) / 2;
                var cy = _cx * Math.sin(xAxisRotation) + _cy * Math.cos(xAxisRotation) + (y1 + y4) / 2;

                // vector magnitude
                var m = function(v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
                // ratio between two vectors
                var r = function(u, v) { return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v)) }
                // angle between two vectors
                var a = function(u, v) { return (u[0] * v[1] < u[1] * v[0] ? - 1 : 1) * Math.acos(r(u,v)); }

                // Calculate theta1 and delta theta F.6.5.4 + F.6.5.5
                var t1 = a([1, 0], [(_x - _cx) / rx, (_y - _cy) / ry]);
                var u = [(_x - _cx) / rx, (_y - _cy) / ry];
                var v = [( - _x - _cx) / rx, ( - _y - _cy) / ry];
                var dt = a(u, v);

                if (r(u, v) <= -1) dt = Math.PI;
                if (r(u, v) >= 1) dt = 0;

                // F.6.5.6
                if (largeArcFlag)  {
                  dt = mod(dt, Math.PI * 2);
                }

                if (sweepFlag && dt > 0) {
                  dt -= Math.PI * 2;
                }

                var length = Two.Resolution;

                // Save a projection of our rotation and translation to apply
                // to the set of points.
                var projection = new Two.Matrix()
                  .translate(cx, cy)
                  .rotate(xAxisRotation);

                // Create a resulting array of Two.Anchor's to export to the
                // the path.
                result = _.map(_.range(length), function(i) {
                  var pct = 1 - (i / (length - 1));
                  var theta = pct * dt + t1;
                  var x = rx * Math.cos(theta);
                  var y = ry * Math.sin(theta);
                  var projected = projection.multiply(x, y, 1);
                  return new Two.Anchor(projected.x, projected.y, false, false, false, false, Two.Commands.line);;
                });

                result.push(new Two.Anchor(x4, y4, false, false, false, false, Two.Commands.line));

                coord = result[result.length - 1];
                control = coord.controls.left;

                break;

            }

            if (result) {
              if (_.isArray(result)) {
                points = points.concat(result);
              } else {
                points.push(result);
              }
            }

          });

          if (points.length <= 1) {
            return;
          }

          var poly = new Two.Path(points, closed, undefined, true).noStroke();
          poly.fill = 'black';

          return Two.Utils.applySvgAttributes.call(this, node, poly);

        },

        circle: function(node) {

          var x = parseFloat(node.getAttribute('cx'));
          var y = parseFloat(node.getAttribute('cy'));
          var r = parseFloat(node.getAttribute('r'));

          var circle = new Two.Circle(x, y, r).noStroke();
          circle.fill = 'black';

          return Two.Utils.applySvgAttributes.call(this, node, circle);

        },

        ellipse: function(node) {

          var x = parseFloat(node.getAttribute('cx'));
          var y = parseFloat(node.getAttribute('cy'));
          var width = parseFloat(node.getAttribute('rx'));
          var height = parseFloat(node.getAttribute('ry'));

          var ellipse = new Two.Ellipse(x, y, width, height).noStroke();
          ellipse.fill = 'black';

          return Two.Utils.applySvgAttributes.call(this, node, ellipse);

        },

        rect: function(node) {

          var x = parseFloat(node.getAttribute('x')) || 0;
          var y = parseFloat(node.getAttribute('y')) || 0;
          var width = parseFloat(node.getAttribute('width'));
          var height = parseFloat(node.getAttribute('height'));

          var w2 = width / 2;
          var h2 = height / 2;

          var rect = new Two.Rectangle(x + w2, y + h2, width, height)
            .noStroke();
          rect.fill = 'black';

          return Two.Utils.applySvgAttributes.call(this, node, rect);

        },

        line: function(node) {

          var x1 = parseFloat(node.getAttribute('x1'));
          var y1 = parseFloat(node.getAttribute('y1'));
          var x2 = parseFloat(node.getAttribute('x2'));
          var y2 = parseFloat(node.getAttribute('y2'));

          var line = new Two.Line(x1, y1, x2, y2).noFill();

          return Two.Utils.applySvgAttributes.call(this, node, line);

        },

        lineargradient: function(node) {

          var x1 = parseFloat(node.getAttribute('x1'));
          var y1 = parseFloat(node.getAttribute('y1'));
          var x2 = parseFloat(node.getAttribute('x2'));
          var y2 = parseFloat(node.getAttribute('y2'));

          var ox = (x2 + x1) / 2;
          var oy = (y2 + y1) / 2;

          var stops = [];
          for (var i = 0; i < node.children.length; i++) {

            var child = node.children[i];

            var offset = parseFloat(child.getAttribute('offset'));
            var color = child.getAttribute('stop-color');
            var opacity = child.getAttribute('stop-opacity');
            var style = child.getAttribute('style');

            if (_.isNull(color)) {
              var matches = style ? style.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/) : false;
              color = matches && matches.length > 1 ? matches[1] : undefined;
            }

            if (_.isNull(opacity)) {
              var matches = style ? style.match(/stop\-opacity\:\s?([0-9\.\-]*)/) : false;
              opacity = matches && matches.length > 1 ? parseFloat(matches[1]) : 1;
            }

            stops.push(new Two.Gradient.Stop(offset, color, opacity));

          }

          var gradient = new Two.LinearGradient(x1 - ox, y1 - oy, x2 - ox,
            y2 - oy, stops);

          return Two.Utils.applySvgAttributes.call(this, node, gradient);

        },

        radialgradient: function(node) {

          var cx = parseFloat(node.getAttribute('cx')) || 0;
          var cy = parseFloat(node.getAttribute('cy')) || 0;
          var r = parseFloat(node.getAttribute('r'));

          var fx = parseFloat(node.getAttribute('fx'));
          var fy = parseFloat(node.getAttribute('fy'));

          if (_.isNaN(fx)) {
            fx = cx;
          }

          if (_.isNaN(fy)) {
            fy = cy;
          }

          var ox = Math.abs(cx + fx) / 2;
          var oy = Math.abs(cy + fy) / 2;

          var stops = [];
          for (var i = 0; i < node.children.length; i++) {

            var child = node.children[i];

            var offset = parseFloat(child.getAttribute('offset'));
            var color = child.getAttribute('stop-color');
            var opacity = child.getAttribute('stop-opacity');
            var style = child.getAttribute('style');

            if (_.isNull(color)) {
              var matches = style ? style.match(/stop\-color\:\s?([\#a-fA-F0-9]*)/) : false;
              color = matches && matches.length > 1 ? matches[1] : undefined;
            }

            if (_.isNull(opacity)) {
              var matches = style ? style.match(/stop\-opacity\:\s?([0-9\.\-]*)/) : false;
              opacity = matches && matches.length > 1 ? parseFloat(matches[1]) : 1;
            }

            stops.push(new Two.Gradient.Stop(offset, color, opacity));

          }

          var gradient = new Two.RadialGradient(cx - ox, cy - oy, r,
            stops, fx - ox, fy - oy);

          return Two.Utils.applySvgAttributes.call(this, node, gradient);

        }

      },

      /**
       * Given 2 points (a, b) and corresponding control point for each
       * return an array of points that represent points plotted along
       * the curve. Number points determined by limit.
       */
      subdivide: function(x1, y1, x2, y2, x3, y3, x4, y4, limit) {

        limit = limit || Two.Utils.Curve.RecursionLimit;
        var amount = limit + 1;

        // TODO: Issue 73
        // Don't recurse if the end points are identical
        if (x1 === x4 && y1 === y4) {
          return [new Two.Anchor(x4, y4)];
        }

        return _.map(_.range(0, amount), function(i) {

          var t = i / amount;
          var x = getPointOnCubicBezier(t, x1, x2, x3, x4);
          var y = getPointOnCubicBezier(t, y1, y2, y3, y4);

          return new Two.Anchor(x, y);

        });

      },

      getPointOnCubicBezier: function(t, a, b, c, d) {
        var k = 1 - t;
        return (k * k * k * a) + (3 * k * k * t * b) + (3 * k * t * t * c) +
           (t * t * t * d);
      },

      /**
       * Given 2 points (a, b) and corresponding control point for each
       * return a float that represents the length of the curve using
       * Gauss-Legendre algorithm. Limit iterations of calculation by `limit`.
       */
      getCurveLength: function(x1, y1, x2, y2, x3, y3, x4, y4, limit) {

        // TODO: Better / fuzzier equality check
        // Linear calculation
        if (x1 === x2 && y1 === y2 && x3 === x4 && y3 === y4) {
          var dx = x4 - x1;
          var dy = y4 - y1;
          return sqrt(dx * dx + dy * dy);
        }

        // Calculate the coefficients of a Bezier derivative.
        var ax = 9 * (x2 - x3) + 3 * (x4 - x1),
          bx = 6 * (x1 + x3) - 12 * x2,
          cx = 3 * (x2 - x1),

          ay = 9 * (y2 - y3) + 3 * (y4 - y1),
          by = 6 * (y1 + y3) - 12 * y2,
          cy = 3 * (y2 - y1);

        var integrand = function(t) {
          // Calculate quadratic equations of derivatives for x and y
          var dx = (ax * t + bx) * t + cx,
            dy = (ay * t + by) * t + cy;
          return sqrt(dx * dx + dy * dy);
        };

        return integrate(
          integrand, 0, 1, limit || Two.Utils.Curve.RecursionLimit
        );

      },

      /**
       * Integration for `getCurveLength` calculations. Referenced from
       * Paper.js: https://github.com/paperjs/paper.js/blob/master/src/util/Numerical.js#L101
       */
      integrate: function(f, a, b, n) {
        var x = Two.Utils.Curve.abscissas[n - 2],
          w = Two.Utils.Curve.weights[n - 2],
          A = 0.5 * (b - a),
          B = A + a,
          i = 0,
          m = (n + 1) >> 1,
          sum = n & 1 ? w[i++] * f(B) : 0; // Handle odd n
        while (i < m) {
          var Ax = A * x[i];
          sum += w[i++] * (f(B + Ax) + f(B - Ax));
        }
        return A * sum;
      },

      /**
       * Creates a set of points that have u, v values for anchor positions
       */
      getCurveFromPoints: function(points, closed) {

        var l = points.length, last = l - 1;

        for (var i = 0; i < l; i++) {

          var point = points[i];

          if (!_.isObject(point.controls)) {
            Two.Anchor.AppendCurveProperties(point);
          }

          var prev = closed ? mod(i - 1, l) : max(i - 1, 0);
          var next = closed ? mod(i + 1, l) : min(i + 1, last);

          var a = points[prev];
          var b = point;
          var c = points[next];
          getControlPoints(a, b, c);

          b._command = i === 0 ? Two.Commands.move : Two.Commands.curve;

          b.controls.left.x = _.isNumber(b.controls.left.x) ? b.controls.left.x : b.x;
          b.controls.left.y = _.isNumber(b.controls.left.y) ? b.controls.left.y : b.y;

          b.controls.right.x = _.isNumber(b.controls.right.x) ? b.controls.right.x : b.x;
          b.controls.right.y = _.isNumber(b.controls.right.y) ? b.controls.right.y : b.y;

        }

      },

      /**
       * Given three coordinates return the control points for the middle, b,
       * vertex.
       */
      getControlPoints: function(a, b, c) {

        var a1 = angleBetween(a, b);
        var a2 = angleBetween(c, b);

        var d1 = distanceBetween(a, b);
        var d2 = distanceBetween(c, b);

        var mid = (a1 + a2) / 2;

        // So we know which angle corresponds to which side.

        b.u = _.isObject(b.controls.left) ? b.controls.left : new Two.Vector(0, 0);
        b.v = _.isObject(b.controls.right) ? b.controls.right : new Two.Vector(0, 0);

        // TODO: Issue 73
        if (d1 < 0.0001 || d2 < 0.0001) {
          if (!b._relative) {
            b.controls.left.copy(b);
            b.controls.right.copy(b);
          }
          return b;
        }

        d1 *= 0.33; // Why 0.33?
        d2 *= 0.33;

        if (a2 < a1) {
          mid += HALF_PI;
        } else {
          mid -= HALF_PI;
        }

        b.controls.left.x = cos(mid) * d1;
        b.controls.left.y = sin(mid) * d1;

        mid -= PI;

        b.controls.right.x = cos(mid) * d2;
        b.controls.right.y = sin(mid) * d2;

        if (!b._relative) {
          b.controls.left.x += b.x;
          b.controls.left.y += b.y;
          b.controls.right.x += b.x;
          b.controls.right.y += b.y;
        }

        return b;

      },

      /**
       * Get the reflection of a point "b" about point "a". Where "a" is in
       * absolute space and "b" is relative to "a".
       *
       * http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes
       */
      getReflection: function(a, b, relative) {

        return new Two.Vector(
          2 * a.x - (b.x + a.x) - (relative ? a.x : 0),
          2 * a.y - (b.y + a.y) - (relative ? a.y : 0)
        );

      },

      getAnchorsFromArcData: function(center, xAxisRotation, rx, ry, ts, td, ccw) {

        var matrix = new Two.Matrix()
          .translate(center.x, center.y)
          .rotate(xAxisRotation);

        var l = Two.Resolution;

        return _.map(_.range(l), function(i) {

          var pct = (i + 1) / l;
          if (!!ccw) {
            pct = 1 - pct;
          }

          var theta = pct * td + ts;
          var x = rx * Math.cos(theta);
          var y = ry * Math.sin(theta);

          // x += center.x;
          // y += center.y;

          var anchor = new Two.Anchor(x, y);
          Two.Anchor.AppendCurveProperties(anchor);
          anchor.command = Two.Commands.line;

          // TODO: Calculate control points here...

          return anchor;

        });

      },

      ratioBetween: function(A, B) {

        return (A.x * B.x + A.y * B.y) / (A.length() * B.length());

      },

      angleBetween: function(A, B) {

        var dx, dy;

        if (arguments.length >= 4) {

          dx = arguments[0] - arguments[2];
          dy = arguments[1] - arguments[3];

          return atan2(dy, dx);

        }

        dx = A.x - B.x;
        dy = A.y - B.y;

        return atan2(dy, dx);

      },

      distanceBetweenSquared: function(p1, p2) {

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;

        return dx * dx + dy * dy;

      },

      distanceBetween: function(p1, p2) {

        return sqrt(distanceBetweenSquared(p1, p2));

      },

      lerp: function(a, b, t) {
        return t * (b - a) + a;
      },

      // A pretty fast toFixed(3) alternative
      // See http://jsperf.com/parsefloat-tofixed-vs-math-round/18
      toFixed: function(v) {
        return Math.floor(v * 1000) / 1000;
      },

      mod: function(v, l) {

        while (v < 0) {
          v += l;
        }

        return v % l;

      },

      /**
       * Array like collection that triggers inserted and removed events
       * removed : pop / shift / splice
       * inserted : push / unshift / splice (with > 2 arguments)
       */
      Collection: function() {

        Array.call(this);

        if (arguments.length > 1) {
          Array.prototype.push.apply(this, arguments);
        } else if (arguments[0] && Array.isArray(arguments[0])) {
          Array.prototype.push.apply(this, arguments[0]);
        }

      },

      // Custom Error Throwing for Two.js

      Error: function(message) {
        this.name = 'two.js';
        this.message = message;
      },

      Events: {

        on: function(name, callback) {

          this._events || (this._events = {});
          var list = this._events[name] || (this._events[name] = []);

          list.push(callback);

          return this;

        },

        off: function(name, callback) {

          if (!this._events) {
            return this;
          }
          if (!name && !callback) {
            this._events = {};
            return this;
          }

          var names = name ? [name] : _.keys(this._events);
          for (var i = 0, l = names.length; i < l; i++) {

            var name = names[i];
            var list = this._events[name];

            if (!!list) {
              var events = [];
              if (callback) {
                for (var j = 0, k = list.length; j < k; j++) {
                  var ev = list[j];
                  ev = ev.callback ? ev.callback : ev;
                  if (callback && callback !== ev) {
                    events.push(ev);
                  }
                }
              }
              this._events[name] = events;
            }
          }

          return this;
        },

        trigger: function(name) {
          if (!this._events) return this;
          var args = slice.call(arguments, 1);
          var events = this._events[name];
          if (events) trigger(this, events, args);
          return this;
        },

        listen: function (obj, name, callback) {

          var bound = this;

          if (obj) {
            var ev = function () {
              callback.apply(bound, arguments);
            };

            // add references about the object that assigned this listener
            ev.obj = obj;
            ev.name = name;
            ev.callback = callback;

            obj.on(name, ev);
          }

          return this;

        },

        ignore: function (obj, name, callback) {

          obj.off(name, callback);

          return this;

        }

      }

    })

  });

  Two.Utils.Events.bind = Two.Utils.Events.on;
  Two.Utils.Events.unbind = Two.Utils.Events.off;

  var trigger = function(obj, events, args) {
    var method;
    switch (args.length) {
    case 0:
      method = function(i) {
        events[i].call(obj, args[0]);
      };
      break;
    case 1:
      method = function(i) {
        events[i].call(obj, args[0], args[1]);
      };
      break;
    case 2:
      method = function(i) {
        events[i].call(obj, args[0], args[1], args[2]);
      };
      break;
    case 3:
      method = function(i) {
        events[i].call(obj, args[0], args[1], args[2], args[3]);
      };
      break;
    default:
      method = function(i) {
        events[i].apply(obj, args);
      };
    }
    for (var i = 0; i < events.length; i++) {
      method(i);
    }
  };

  Two.Utils.Error.prototype = new Error();
  Two.Utils.Error.prototype.constructor = Two.Utils.Error;

  Two.Utils.Collection.prototype = new Array();
  Two.Utils.Collection.prototype.constructor = Two.Utils.Collection;

  _.extend(Two.Utils.Collection.prototype, Two.Utils.Events, {

    pop: function() {
      var popped = Array.prototype.pop.apply(this, arguments);
      this.trigger(Two.Events.remove, [popped]);
      return popped;
    },

    shift: function() {
      var shifted = Array.prototype.shift.apply(this, arguments);
      this.trigger(Two.Events.remove, [shifted]);
      return shifted;
    },

    push: function() {
      var pushed = Array.prototype.push.apply(this, arguments);
      this.trigger(Two.Events.insert, arguments);
      return pushed;
    },

    unshift: function() {
      var unshifted = Array.prototype.unshift.apply(this, arguments);
      this.trigger(Two.Events.insert, arguments);
      return unshifted;
    },

    splice: function() {
      var spliced = Array.prototype.splice.apply(this, arguments);
      var inserted;

      this.trigger(Two.Events.remove, spliced);

      if (arguments.length > 2) {
        inserted = this.slice(arguments[0], arguments[0] + arguments.length - 2);
        this.trigger(Two.Events.insert, inserted);
        this.trigger(Two.Events.order);
      }
      return spliced;
    },

    sort: function() {
      Array.prototype.sort.apply(this, arguments);
      this.trigger(Two.Events.order);
      return this;
    },

    reverse: function() {
      Array.prototype.reverse.apply(this, arguments);
      this.trigger(Two.Events.order);
      return this;
    }

  });

  // Localize utils

  var distanceBetween = Two.Utils.distanceBetween,
    getAnchorsFromArcData = Two.Utils.getAnchorsFromArcData,
    distanceBetweenSquared = Two.Utils.distanceBetweenSquared,
    ratioBetween = Two.Utils.ratioBetween,
    angleBetween = Two.Utils.angleBetween,
    getControlPoints = Two.Utils.getControlPoints,
    getCurveFromPoints = Two.Utils.getCurveFromPoints,
    solveSegmentIntersection = Two.Utils.solveSegmentIntersection,
    decoupleShapes = Two.Utils.decoupleShapes,
    mod = Two.Utils.mod,
    getBackingStoreRatio = Two.Utils.getBackingStoreRatio,
    getPointOnCubicBezier = Two.Utils.getPointOnCubicBezier,
    getCurveLength = Two.Utils.getCurveLength,
    integrate = Two.Utils.integrate,
    getReflection = Two.Utils.getReflection;

  _.extend(Two.prototype, Two.Utils.Events, {

    appendTo: function(elem) {

      elem.appendChild(this.renderer.domElement);
      return this;

    },

    play: function() {

      Two.Utils.setPlaying.call(this, true);
      return this.trigger(Two.Events.play);

    },

    pause: function() {

      this.playing = false;
      return this.trigger(Two.Events.pause);

    },

    /**
     * Update positions and calculations in one pass before rendering.
     */
    update: function() {

      var animated = !!this._lastFrame;
      var now = perf.now();

      this.frameCount++;

      if (animated) {
        this.timeDelta = parseFloat((now - this._lastFrame).toFixed(3));
      }
      this._lastFrame = now;

      var width = this.width;
      var height = this.height;
      var renderer = this.renderer;

      // Update width / height for the renderer
      if (width !== renderer.width || height !== renderer.height) {
        renderer.setSize(width, height, this.ratio);
      }

      this.trigger(Two.Events.update, this.frameCount, this.timeDelta);

      return this.render();

    },

    /**
     * Render all drawable - visible objects of the scene.
     */
    render: function() {

      this.renderer.render();
      return this.trigger(Two.Events.render, this.frameCount);

    },

    /**
     * Convenience Methods
     */

    add: function(o) {

      var objects = o;
      if (!(objects instanceof Array)) {
        objects = _.toArray(arguments);
      }

      this.scene.add(objects);
      return this;

    },

    remove: function(o) {

      var objects = o;
      if (!(objects instanceof Array)) {
        objects = _.toArray(arguments);
      }

      this.scene.remove(objects);

      return this;

    },

    clear: function() {

      this.scene.remove(_.toArray(this.scene.children));
      return this;

    },

    makeLine: function(x1, y1, x2, y2) {

      var line = new Two.Line(x1, y1, x2, y2);
      this.scene.add(line);

      return line;

    },

    makeRectangle: function(x, y, width, height) {

      var rect = new Two.Rectangle(x, y, width, height);
      this.scene.add(rect);

      return rect;

    },

    makeRoundedRectangle: function(x, y, width, height, sides) {

      var rect = new Two.RoundedRectangle(x, y, width, height, sides);
      this.scene.add(rect);

      return rect;

    },

    makeCircle: function(ox, oy, r) {

      var circle = new Two.Circle(ox, oy, r);
      this.scene.add(circle);

      return circle;

    },

    makeEllipse: function(ox, oy, rx, ry) {

      var ellipse = new Two.Ellipse(ox, oy, rx, ry);
      this.scene.add(ellipse);

      return ellipse;

    },

    makeStar: function(ox, oy, or, ir, sides) {

      var star = new Two.Star(ox, oy, or, ir, sides);
      this.scene.add(star);

      return star;

    },

    makeCurve: function(p) {

      var l = arguments.length, points = p;
      if (!_.isArray(p)) {
        points = [];
        for (var i = 0; i < l; i+=2) {
          var x = arguments[i];
          if (!_.isNumber(x)) {
            break;
          }
          var y = arguments[i + 1];
          points.push(new Two.Anchor(x, y));
        }
      }

      var last = arguments[l - 1];
      var curve = new Two.Path(points, !(_.isBoolean(last) ? last : undefined), true);
      var rect = curve.getBoundingClientRect();
      curve.center().translation
        .set(rect.left + rect.width / 2, rect.top + rect.height / 2);

      this.scene.add(curve);

      return curve;

    },

    makePolygon: function(ox, oy, r, sides) {

      var poly = new Two.Polygon(ox, oy, r, sides);
      this.scene.add(poly);

      return poly;

    },

    /*
    * Make an Arc Segment
    */

    makeArcSegment: function(ox, oy, ir, or, sa, ea, res) {
      var arcSegment = new Two.ArcSegment(ox, oy, ir, or, sa, ea, res);
      this.scene.add(arcSegment);
      return arcSegment;
    },

    /**
     * Convenience method to make and draw a Two.Path.
     */
    makePath: function(p) {

      var l = arguments.length, points = p;
      if (!_.isArray(p)) {
        points = [];
        for (var i = 0; i < l; i+=2) {
          var x = arguments[i];
          if (!_.isNumber(x)) {
            break;
          }
          var y = arguments[i + 1];
          points.push(new Two.Anchor(x, y));
        }
      }

      var last = arguments[l - 1];
      var path = new Two.Path(points, !(_.isBoolean(last) ? last : undefined));
      var rect = path.getBoundingClientRect();
      path.center().translation
        .set(rect.left + rect.width / 2, rect.top + rect.height / 2);

      this.scene.add(path);

      return path;

    },

    /**
     * Convenience method to make and add a Two.Text.
     */
    makeText: function(message, x, y, styles) {
      var text = new Two.Text(message, x, y, styles);
      this.add(text);
      return text;
    },

    /**
     * Convenience method to make and add a Two.LinearGradient.
     */
    makeLinearGradient: function(x1, y1, x2, y2 /* stops */) {

      var stops = slice.call(arguments, 4);
      var gradient = new Two.LinearGradient(x1, y1, x2, y2, stops);

      this.add(gradient);

      return gradient;

    },

    /**
     * Convenience method to make and add a Two.RadialGradient.
     */
    makeRadialGradient: function(x1, y1, r /* stops */) {

      var stops = slice.call(arguments, 3);
      var gradient = new Two.RadialGradient(x1, y1, r, stops);

      this.add(gradient);

      return gradient;

    },

    makeSprite: function(path, x, y, cols, rows, frameRate, autostart) {

      var sprite = new Two.Sprite(path, x, y, cols, rows, frameRate);
      if (!!autostart) {
        sprite.play();
      }
      this.add(sprite);

      return sprite;

    },

    makeImageSequence: function(paths, x, y, frameRate, autostart) {

      var imageSequence = new Two.ImageSequence(paths, x, y, frameRate);
      if (!!autostart) {
        imageSequence.play();
      }
      this.add(imageSequence);

      return imageSequence;

    },

    makeTexture: function(path, callback) {

      var texture = new Two.Texture(path, callback);
      return texture;

    },

    makeGroup: function(o) {

      var objects = o;
      if (!(objects instanceof Array)) {
        objects = _.toArray(arguments);
      }

      var group = new Two.Group();
      this.scene.add(group);
      group.add(objects);

      return group;

    },

    /**
     * Interpret an SVG Node and add it to this instance's scene. The
     * distinction should be made that this doesn't `import` svg's, it solely
     * interprets them into something compatible for Two.js — this is slightly
     * different than a direct transcription.
     *
     * @param {Object} svgNode - The node to be parsed
     * @param {Boolean} shallow - Don't create a top-most group but
     *                                    append all contents directly
     */
    interpret: function(svgNode, shallow) {

      var tag = svgNode.tagName.toLowerCase();

      if (!(tag in Two.Utils.read)) {
        return null;
      }

      var node = Two.Utils.read[tag].call(this, svgNode);

      if (shallow && node instanceof Two.Group) {
        this.add(node.children);
      } else {
        this.add(node);
      }

      return node;

    },

    /**
     * Load an SVG file / text and interpret.
     */
    load: function(text, callback) {

      var nodes = [], elem, i;

      if (/.*\.svg/ig.test(text)) {

        Two.Utils.xhr(text, _.bind(function(data) {

          dom.temp.innerHTML = data;
          for (i = 0; i < dom.temp.children.length; i++) {
            elem = dom.temp.children[i];
            nodes.push(this.interpret(elem));
          }

          callback(nodes.length <= 1 ? nodes[0] : nodes,
            dom.temp.children.length <= 1 ? dom.temp.children[0] : dom.temp.children);

        }, this));

        return this;

      }

      dom.temp.innerHTML = text;
      for (i = 0; i < dom.temp.children.length; i++) {
        elem = dom.temp.children[i];
        nodes.push(this.interpret(elem));
      }

      callback(nodes.length <= 1 ? nodes[0] : nodes,
        dom.temp.children.length <= 1 ? dom.temp.children[0] : dom.temp.children);

      return this;

    }

  });

  function fitToWindow() {

    var wr = document.body.getBoundingClientRect();

    var width = this.width = wr.width;
    var height = this.height = wr.height;

    this.renderer.setSize(width, height, this.ratio);
    this.trigger(Two.Events.resize, width, height);

  }

  // Request Animation Frame

  var raf = dom.getRequestAnimationFrame();

  function loop() {

    raf(loop);

    for (var i = 0; i < Two.Instances.length; i++) {
      var t = Two.Instances[i];
      if (t.playing) {
        t.update();
      }
    }

  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return Two;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Two;
  }

  return Two;

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var Registry = Two.Registry = function() {

    this.map = {};

  };

  _.extend(Registry, {

  });

  _.extend(Registry.prototype, {

    add: function(id, obj) {
      this.map[id] = obj;
      return this;
    },

    remove: function(id) {
      delete this.map[id];
      return this;
    },

    get: function(id) {
      return this.map[id];
    },

    contains: function(id) {
      return id in this.map;
    }

  });

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var Vector = Two.Vector = function(x, y) {

    this.x = x || 0;
    this.y = y || 0;

  };

  _.extend(Vector, {

    zero: new Two.Vector()

  });

  _.extend(Vector.prototype, Two.Utils.Events, {

    set: function(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },

    copy: function(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    },

    clear: function() {
      this.x = 0;
      this.y = 0;
      return this;
    },

    clone: function() {
      return new Vector(this.x, this.y);
    },

    add: function(v1, v2) {
      this.x = v1.x + v2.x;
      this.y = v1.y + v2.y;
      return this;
    },

    addSelf: function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },

    sub: function(v1, v2) {
      this.x = v1.x - v2.x;
      this.y = v1.y - v2.y;
      return this;
    },

    subSelf: function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },

    multiplySelf: function(v) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    },

    multiplyScalar: function(s) {
      this.x *= s;
      this.y *= s;
      return this;
    },

    divideScalar: function(s) {
      if (s) {
        this.x /= s;
        this.y /= s;
      } else {
        this.set(0, 0);
      }
      return this;
    },

    negate: function() {
      return this.multiplyScalar(-1);
    },

    dot: function(v) {
      return this.x * v.x + this.y * v.y;
    },

    lengthSquared: function() {
      return this.x * this.x + this.y * this.y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    normalize: function() {
      return this.divideScalar(this.length());
    },

    distanceTo: function(v) {
      return Math.sqrt(this.distanceToSquared(v));
    },

    distanceToSquared: function(v) {
      var dx = this.x - v.x,
          dy = this.y - v.y;
      return dx * dx + dy * dy;
    },

    setLength: function(l) {
      return this.normalize().multiplyScalar(l);
    },

    equals: function(v, eps) {
      eps = (typeof eps === 'undefined') ?  0.0001 : eps;
      return (this.distanceTo(v) < eps);
    },

    lerp: function(v, t) {
      var x = (v.x - this.x) * t + this.x;
      var y = (v.y - this.y) * t + this.y;
      return this.set(x, y);
    },

    isZero: function(eps) {
      eps = (typeof eps === 'undefined') ?  0.0001 : eps;
      return (this.length() < eps);
    },

    toString: function() {
      return this.x + ', ' + this.y;
    },

    toObject: function() {
      return { x: this.x, y: this.y };
    },

    rotate: function (radians) {
      var cos = Math.cos(radians);
      var sin = Math.sin(radians);
      this.x = this.x * cos - this.y * sin;
      this.y = this.x * sin + this.y * cos;
      return this;
    }

  });

  var BoundProto = {

    set: function(x, y) {
      this._x = x;
      this._y = y;
      return this.trigger(Two.Events.change);
    },

    copy: function(v) {
      this._x = v.x;
      this._y = v.y;
      return this.trigger(Two.Events.change);
    },

    clear: function() {
      this._x = 0;
      this._y = 0;
      return this.trigger(Two.Events.change);
    },

    clone: function() {
      return new Vector(this._x, this._y);
    },

    add: function(v1, v2) {
      this._x = v1.x + v2.x;
      this._y = v1.y + v2.y;
      return this.trigger(Two.Events.change);
    },

    addSelf: function(v) {
      this._x += v.x;
      this._y += v.y;
      return this.trigger(Two.Events.change);
    },

    sub: function(v1, v2) {
      this._x = v1.x - v2.x;
      this._y = v1.y - v2.y;
      return this.trigger(Two.Events.change);
    },

    subSelf: function(v) {
      this._x -= v.x;
      this._y -= v.y;
      return this.trigger(Two.Events.change);
    },

    multiplySelf: function(v) {
      this._x *= v.x;
      this._y *= v.y;
      return this.trigger(Two.Events.change);
    },

    multiplyScalar: function(s) {
      this._x *= s;
      this._y *= s;
      return this.trigger(Two.Events.change);
    },

    divideScalar: function(s) {
      if (s) {
        this._x /= s;
        this._y /= s;
        return this.trigger(Two.Events.change);
      }
      return this.clear();
    },

    negate: function() {
      return this.multiplyScalar(-1);
    },

    dot: function(v) {
      return this._x * v.x + this._y * v.y;
    },

    lengthSquared: function() {
      return this._x * this._x + this._y * this._y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    normalize: function() {
      return this.divideScalar(this.length());
    },

    distanceTo: function(v) {
      return Math.sqrt(this.distanceToSquared(v));
    },

    distanceToSquared: function(v) {
      var dx = this._x - v.x,
          dy = this._y - v.y;
      return dx * dx + dy * dy;
    },

    setLength: function(l) {
      return this.normalize().multiplyScalar(l);
    },

    equals: function(v, eps) {
      eps = (typeof eps === 'undefined') ?  0.0001 : eps;
      return (this.distanceTo(v) < eps);
    },

    lerp: function(v, t) {
      var x = (v.x - this._x) * t + this._x;
      var y = (v.y - this._y) * t + this._y;
      return this.set(x, y);
    },

    isZero: function(eps) {
      eps = (typeof eps === 'undefined') ?  0.0001 : eps;
      return (this.length() < eps);
    },

    toString: function() {
      return this._x + ', ' + this._y;
    },

    toObject: function() {
      return { x: this._x, y: this._y };
    },

    rotate: function (radians) {
      var cos = Math.cos(radians);
      var sin = Math.sin(radians);
      this._x = this._x * cos - this._y * sin;
      this._y = this._x * sin + this._y * cos;
      return this;
    }

  };

  var xgs = {
    enumerable: true,
    get: function() {
      return this._x;
    },
    set: function(v) {
      this._x = v;
      this.trigger(Two.Events.change, 'x');
    }
  };

  var ygs = {
    enumerable: true,
    get: function() {
      return this._y;
    },
    set: function(v) {
      this._y = v;
      this.trigger(Two.Events.change, 'y');
    }
  };

  /**
   * Override Backbone bind / on in order to add properly broadcasting.
   * This allows Two.Vector to not broadcast events unless event listeners
   * are explicity bound to it.
   */

  Two.Vector.prototype.bind = Two.Vector.prototype.on = function() {

    if (!this._bound) {
      this._x = this.x;
      this._y = this.y;
      Object.defineProperty(this, 'x', xgs);
      Object.defineProperty(this, 'y', ygs);
      _.extend(this, BoundProto);
      this._bound = true; // Reserved for event initialization check
    }

    Two.Utils.Events.bind.apply(this, arguments);

    return this;

  };

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  // Localized variables
  var commands = Two.Commands;
  var _ = Two.Utils;

  /**
   * An object that holds 3 `Two.Vector`s, the anchor point and its
   * corresponding handles: `left` and `right`.
   */
  var Anchor = Two.Anchor = function(x, y, ux, uy, vx, vy, command) {

    Two.Vector.call(this, x, y);

    this._broadcast = _.bind(function() {
      this.trigger(Two.Events.change);
    }, this);

    this._command = command || commands.move;
    this._relative = true;

    if (!command) {
      return this;
    }

    Anchor.AppendCurveProperties(this);

    if (_.isNumber(ux)) {
      this.controls.left.x = ux;
    }
    if (_.isNumber(uy)) {
      this.controls.left.y = uy;
    }
    if (_.isNumber(vx)) {
      this.controls.right.x = vx;
    }
    if (_.isNumber(vy)) {
      this.controls.right.y = vy;
    }

  };

  _.extend(Anchor, {

    AppendCurveProperties: function(anchor) {
      anchor.controls = {
        left: new Two.Vector(0, 0),
        right: new Two.Vector(0, 0)
      };
    }

  });

  var AnchorProto = {

    listen: function() {

      if (!_.isObject(this.controls)) {
        Anchor.AppendCurveProperties(this);
      }

      this.controls.left.bind(Two.Events.change, this._broadcast);
      this.controls.right.bind(Two.Events.change, this._broadcast);

      return this;

    },

    ignore: function() {

      this.controls.left.unbind(Two.Events.change, this._broadcast);
      this.controls.right.unbind(Two.Events.change, this._broadcast);

      return this;

    },

    clone: function() {

      var controls = this.controls;

      var clone = new Two.Anchor(
        this.x,
        this.y,
        controls && controls.left.x,
        controls && controls.left.y,
        controls && controls.right.x,
        controls && controls.right.y,
        this.command
      );
      clone.relative = this._relative;
      return clone;

    },

    toObject: function() {
      var o = {
        x: this.x,
        y: this.y
      };
      if (this._command) {
        o.command = this._command;
      }
      if (this._relative) {
        o.relative = this._relative;
      }
      if (this.controls) {
        o.controls = {
          left: this.controls.left.toObject(),
          right: this.controls.right.toObject()
        };
      }
      return o;
    },

    toString: function() {
      if (!this.controls) {
        return [this._x, this._y].join(', ');
      }
      return [this._x, this._y, this.controls.left.x, this.controls.left.y,
        this.controls.right.x, this.controls.right.y].join(', ');
    }

  };

  Object.defineProperty(Anchor.prototype, 'command', {

    enumerable: true,

    get: function() {
      return this._command;
    },

    set: function(c) {
      this._command = c;
      if (this._command === commands.curve && !_.isObject(this.controls)) {
        Anchor.AppendCurveProperties(this);
      }
      return this.trigger(Two.Events.change);
    }

  });

  Object.defineProperty(Anchor.prototype, 'relative', {

    enumerable: true,

    get: function() {
      return this._relative;
    },

    set: function(b) {
      if (this._relative == b) {
        return this;
      }
      this._relative = !!b;
      return this.trigger(Two.Events.change);
    }

  });

  _.extend(Anchor.prototype, Two.Vector.prototype, AnchorProto);

  // Make it possible to bind and still have the Anchor specific
  // inheritance from Two.Vector
  Two.Anchor.prototype.bind = Two.Anchor.prototype.on = function() {
    Two.Vector.prototype.bind.apply(this, arguments);
    _.extend(this, AnchorProto);
  };

  Two.Anchor.prototype.unbind = Two.Anchor.prototype.off = function() {
    Two.Vector.prototype.unbind.apply(this, arguments);
    _.extend(this, AnchorProto);
  };

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  /**
   * Constants
   */
  var cos = Math.cos, sin = Math.sin, tan = Math.tan;
  var _ = Two.Utils;

  /**
   * Two.Matrix contains an array of elements that represent
   * the two dimensional 3 x 3 matrix as illustrated below:
   *
   * =====
   * a b c
   * d e f
   * g h i  // this row is not really used in 2d transformations
   * =====
   *
   * String order is for transform strings: a, d, b, e, c, f
   *
   * @class
   */
  var Matrix = Two.Matrix = function(a, b, c, d, e, f) {

    this.elements = new Two.Array(9);

    var elements = a;
    if (!_.isArray(elements)) {
      elements = _.toArray(arguments);
    }

    // initialize the elements with default values.

    this.identity().set(elements);

  };

  _.extend(Matrix, {

    Identity: [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ],

    /**
     * Multiply two matrix 3x3 arrays
     */
    Multiply: function(A, B, C) {

      if (B.length <= 3) { // Multiply Vector

        var x, y, z, e = A;

        var a = B[0] || 0,
            b = B[1] || 0,
            c = B[2] || 0;

        // Go down rows first
        // a, d, g, b, e, h, c, f, i

        x = e[0] * a + e[1] * b + e[2] * c;
        y = e[3] * a + e[4] * b + e[5] * c;
        z = e[6] * a + e[7] * b + e[8] * c;

        return { x: x, y: y, z: z };

      }

      var A0 = A[0], A1 = A[1], A2 = A[2];
      var A3 = A[3], A4 = A[4], A5 = A[5];
      var A6 = A[6], A7 = A[7], A8 = A[8];

      var B0 = B[0], B1 = B[1], B2 = B[2];
      var B3 = B[3], B4 = B[4], B5 = B[5];
      var B6 = B[6], B7 = B[7], B8 = B[8];

      C = C || new Two.Array(9);

      C[0] = A0 * B0 + A1 * B3 + A2 * B6;
      C[1] = A0 * B1 + A1 * B4 + A2 * B7;
      C[2] = A0 * B2 + A1 * B5 + A2 * B8;
      C[3] = A3 * B0 + A4 * B3 + A5 * B6;
      C[4] = A3 * B1 + A4 * B4 + A5 * B7;
      C[5] = A3 * B2 + A4 * B5 + A5 * B8;
      C[6] = A6 * B0 + A7 * B3 + A8 * B6;
      C[7] = A6 * B1 + A7 * B4 + A8 * B7;
      C[8] = A6 * B2 + A7 * B5 + A8 * B8;

      return C;

    }

  });

  _.extend(Matrix.prototype, Two.Utils.Events, {

    /**
     * Takes an array of elements or the arguments list itself to
     * set and update the current matrix's elements. Only updates
     * specified values.
     */
    set: function(a) {

      var elements = a;
      if (!_.isArray(elements)) {
        elements = _.toArray(arguments);
      }

      _.extend(this.elements, elements);

      return this.trigger(Two.Events.change);

    },

    /**
     * Turn matrix to identity, like resetting.
     */
    identity: function() {

      this.set(Matrix.Identity);

      return this;

    },

    /**
     * Multiply scalar or multiply by another matrix.
     */
    multiply: function(a, b, c, d, e, f, g, h, i) {

      var elements = arguments, l = elements.length;

      // Multiply scalar

      if (l <= 1) {

        _.each(this.elements, function(v, i) {
          this.elements[i] = v * a;
        }, this);

        return this.trigger(Two.Events.change);

      }

      if (l <= 3) { // Multiply Vector

        var x, y, z;
        a = a || 0;
        b = b || 0;
        c = c || 0;
        e = this.elements;

        // Go down rows first
        // a, d, g, b, e, h, c, f, i

        x = e[0] * a + e[1] * b + e[2] * c;
        y = e[3] * a + e[4] * b + e[5] * c;
        z = e[6] * a + e[7] * b + e[8] * c;

        return { x: x, y: y, z: z };

      }

      // Multiple matrix

      var A = this.elements;
      var B = elements;

      var A0 = A[0], A1 = A[1], A2 = A[2];
      var A3 = A[3], A4 = A[4], A5 = A[5];
      var A6 = A[6], A7 = A[7], A8 = A[8];

      var B0 = B[0], B1 = B[1], B2 = B[2];
      var B3 = B[3], B4 = B[4], B5 = B[5];
      var B6 = B[6], B7 = B[7], B8 = B[8];

      this.elements[0] = A0 * B0 + A1 * B3 + A2 * B6;
      this.elements[1] = A0 * B1 + A1 * B4 + A2 * B7;
      this.elements[2] = A0 * B2 + A1 * B5 + A2 * B8;

      this.elements[3] = A3 * B0 + A4 * B3 + A5 * B6;
      this.elements[4] = A3 * B1 + A4 * B4 + A5 * B7;
      this.elements[5] = A3 * B2 + A4 * B5 + A5 * B8;

      this.elements[6] = A6 * B0 + A7 * B3 + A8 * B6;
      this.elements[7] = A6 * B1 + A7 * B4 + A8 * B7;
      this.elements[8] = A6 * B2 + A7 * B5 + A8 * B8;

      return this.trigger(Two.Events.change);

    },

    inverse: function(out) {

      var a = this.elements;
      out = out || new Two.Matrix();

      var a00 = a[0], a01 = a[1], a02 = a[2];
      var a10 = a[3], a11 = a[4], a12 = a[5];
      var a20 = a[6], a21 = a[7], a22 = a[8];

      var b01 = a22 * a11 - a12 * a21;
      var b11 = -a22 * a10 + a12 * a20;
      var b21 = a21 * a10 - a11 * a20;

      // Calculate the determinant
      var det = a00 * b01 + a01 * b11 + a02 * b21;

      if (!det) {
        return null;
      }

      det = 1.0 / det;

      out.elements[0] = b01 * det;
      out.elements[1] = (-a22 * a01 + a02 * a21) * det;
      out.elements[2] = (a12 * a01 - a02 * a11) * det;
      out.elements[3] = b11 * det;
      out.elements[4] = (a22 * a00 - a02 * a20) * det;
      out.elements[5] = (-a12 * a00 + a02 * a10) * det;
      out.elements[6] = b21 * det;
      out.elements[7] = (-a21 * a00 + a01 * a20) * det;
      out.elements[8] = (a11 * a00 - a01 * a10) * det;

      return out;

    },

    /**
     * Set a scalar onto the matrix.
     */
    scale: function(sx, sy) {

      var l = arguments.length;
      if (l <= 1) {
        sy = sx;
      }

      return this.multiply(sx, 0, 0, 0, sy, 0, 0, 0, 1);

    },

    /**
     * Rotate the matrix.
     */
    rotate: function(radians) {

      var c = cos(radians);
      var s = sin(radians);

      return this.multiply(c, -s, 0, s, c, 0, 0, 0, 1);

    },

    /**
     * Translate the matrix.
     */
    translate: function(x, y) {

      return this.multiply(1, 0, x, 0, 1, y, 0, 0, 1);

    },

    /*
     * Skew the matrix by an angle in the x axis direction.
     */
    skewX: function(radians) {

      var a = tan(radians);

      return this.multiply(1, a, 0, 0, 1, 0, 0, 0, 1);

    },

    /*
     * Skew the matrix by an angle in the y axis direction.
     */
    skewY: function(radians) {

      var a = tan(radians);

      return this.multiply(1, 0, 0, a, 1, 0, 0, 0, 1);

    },

    /**
     * Create a transform string to be used with rendering apis.
     */
    toString: function(fullMatrix) {
      var temp = [];

      this.toArray(fullMatrix, temp);

      return temp.join(' ');

    },

    /**
     * Create a transform array to be used with rendering apis.
     */
    toArray: function(fullMatrix, output) {

     var elements = this.elements;
     var hasOutput = !!output;

     var a = parseFloat(elements[0].toFixed(3));
     var b = parseFloat(elements[1].toFixed(3));
     var c = parseFloat(elements[2].toFixed(3));
     var d = parseFloat(elements[3].toFixed(3));
     var e = parseFloat(elements[4].toFixed(3));
     var f = parseFloat(elements[5].toFixed(3));

      if (!!fullMatrix) {

        var g = parseFloat(elements[6].toFixed(3));
        var h = parseFloat(elements[7].toFixed(3));
        var i = parseFloat(elements[8].toFixed(3));

        if (hasOutput) {
          output[0] = a;
          output[1] = d;
          output[2] = g;
          output[3] = b;
          output[4] = e;
          output[5] = h;
          output[6] = c;
          output[7] = f;
          output[8] = i;
          return;
        }

        return [
          a, d, g, b, e, h, c, f, i
        ];
      }

      if (hasOutput) {
        output[0] = a;
        output[1] = d;
        output[2] = b;
        output[3] = e;
        output[4] = c;
        output[5] = f;
        return;
      }

      return [
        a, d, b, e, c, f  // Specific format see LN:19
      ];

    },

    /**
     * Clone the current matrix.
     */
    clone: function() {
      var a, b, c, d, e, f, g, h, i;

      a = this.elements[0];
      b = this.elements[1];
      c = this.elements[2];
      d = this.elements[3];
      e = this.elements[4];
      f = this.elements[5];
      g = this.elements[6];
      h = this.elements[7];
      i = this.elements[8];

      return new Two.Matrix(a, b, c, d, e, f, g, h, i);

    }

  });

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  // Localize variables
  var mod = Two.Utils.mod, toFixed = Two.Utils.toFixed;
  var _ = Two.Utils;

  var svg = {

    version: 1.1,

    ns: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',

    alignments: {
      left: 'start',
      center: 'middle',
      right: 'end'
    },

    /**
     * Create an svg namespaced element.
     */
    createElement: function(name, attrs) {
      var tag = name;
      var elem = document.createElementNS(this.ns, tag);
      if (tag === 'svg') {
        attrs = _.defaults(attrs || {}, {
          version: this.version
        });
      }
      if (!_.isEmpty(attrs)) {
        svg.setAttributes(elem, attrs);
      }
      return elem;
    },

    /**
     * Add attributes from an svg element.
     */
    setAttributes: function(elem, attrs) {
      var keys = Object.keys(attrs);
      for (var i = 0; i < keys.length; i++) {
        elem.setAttribute(keys[i], attrs[keys[i]]);
      }
      return this;
    },

    /**
     * Remove attributes from an svg element.
     */
    removeAttributes: function(elem, attrs) {
      for (var key in attrs) {
        elem.removeAttribute(key);
      }
      return this;
    },

    /**
     * Turn a set of vertices into a string for the d property of a path
     * element. It is imperative that the string collation is as fast as
     * possible, because this call will be happening multiple times a
     * second.
     */
    toString: function(points, closed) {

      var l = points.length,
        last = l - 1,
        d, // The elusive last Two.Commands.move point
        ret = '';

      for (var i = 0; i < l; i++) {
        var b = points[i];
        var command;
        var prev = closed ? mod(i - 1, l) : Math.max(i - 1, 0);
        var next = closed ? mod(i + 1, l) : Math.min(i + 1, last);

        var a = points[prev];
        var c = points[next];

        var vx, vy, ux, uy, ar, bl, br, cl;

        // Access x and y directly,
        // bypassing the getter
        var x = toFixed(b._x);
        var y = toFixed(b._y);

        switch (b._command) {

          case Two.Commands.close:
            command = Two.Commands.close;
            break;

          case Two.Commands.curve:

            ar = (a.controls && a.controls.right) || Two.Vector.zero;
            bl = (b.controls && b.controls.left) || Two.Vector.zero;

            if (a._relative) {
              vx = toFixed((ar.x + a.x));
              vy = toFixed((ar.y + a.y));
            } else {
              vx = toFixed(ar.x);
              vy = toFixed(ar.y);
            }

            if (b._relative) {
              ux = toFixed((bl.x + b.x));
              uy = toFixed((bl.y + b.y));
            } else {
              ux = toFixed(bl.x);
              uy = toFixed(bl.y);
            }

            command = ((i === 0) ? Two.Commands.move : Two.Commands.curve) +
              ' ' + vx + ' ' + vy + ' ' + ux + ' ' + uy + ' ' + x + ' ' + y;
            break;

          case Two.Commands.move:
            d = b;
            command = Two.Commands.move + ' ' + x + ' ' + y;
            break;

          default:
            command = b._command + ' ' + x + ' ' + y;

        }

        // Add a final point and close it off

        if (i >= last && closed) {

          if (b._command === Two.Commands.curve) {

            // Make sure we close to the most previous Two.Commands.move
            c = d;

            br = (b.controls && b.controls.right) || b;
            cl = (c.controls && c.controls.left) || c;

            if (b._relative) {
              vx = toFixed((br.x + b.x));
              vy = toFixed((br.y + b.y));
            } else {
              vx = toFixed(br.x);
              vy = toFixed(br.y);
            }

            if (c._relative) {
              ux = toFixed((cl.x + c.x));
              uy = toFixed((cl.y + c.y));
            } else {
              ux = toFixed(cl.x);
              uy = toFixed(cl.y);
            }

            x = toFixed(c.x);
            y = toFixed(c.y);

            command +=
              ' C ' + vx + ' ' + vy + ' ' + ux + ' ' + uy + ' ' + x + ' ' + y;
          }

          command += ' Z';

        }

        ret += command + ' ';

      }

      return ret;

    },

    getClip: function(shape) {

      var clip = shape._renderer.clip;

      if (!clip) {

        var root = shape;

        while (root.parent) {
          root = root.parent;
        }

        clip = shape._renderer.clip = svg.createElement('clipPath');
        root.defs.appendChild(clip);

      }

      return clip;

    },

    group: {

      // TODO: Can speed up.
      // TODO: How does this effect a f
      appendChild: function(object) {

        var elem = object._renderer.elem;

        if (!elem) {
          return;
        }

        var tag = elem.nodeName;

        if (!tag || /(radial|linear)gradient/i.test(tag) || object._clip) {
          return;
        }

        this.elem.appendChild(elem);

      },

      removeChild: function(object) {

        var elem = object._renderer.elem;

        if (!elem || elem.parentNode != this.elem) {
          return;
        }

        var tag = elem.nodeName;

        if (!tag) {
          return;
        }

        // Defer subtractions while clipping.
        if (object._clip) {
          return;
        }

        this.elem.removeChild(elem);

      },

      orderChild: function(object) {
        this.elem.appendChild(object._renderer.elem);
      },

      renderChild: function(child) {
        svg[child._renderer.type].render.call(child, this);
      },

      render: function(domElement) {

        this._update();

        // Shortcut for hidden objects.
        // Doesn't reset the flags, so changes are stored and
        // applied once the object is visible again
        if (this._opacity === 0 && !this._flagOpacity) {
          return this;
        }

        if (!this._renderer.elem) {
          this._renderer.elem = svg.createElement('g', {
            id: this.id
          });
          domElement.appendChild(this._renderer.elem);
        }

        // _Update styles for the <g>
        var flagMatrix = this._matrix.manual || this._flagMatrix;
        var context = {
          domElement: domElement,
          elem: this._renderer.elem
        };

        if (flagMatrix) {
          this._renderer.elem.setAttribute('transform', 'matrix(' + this._matrix.toString() + ')');
        }

        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          svg[child._renderer.type].render.call(child, domElement);
        }

        if (this._flagOpacity) {
          this._renderer.elem.setAttribute('opacity', this._opacity);
        }

        if (this._flagAdditions) {
          this.additions.forEach(svg.group.appendChild, context);
        }

        if (this._flagSubtractions) {
          this.subtractions.forEach(svg.group.removeChild, context);
        }

        if (this._flagOrder) {
          this.children.forEach(svg.group.orderChild, context);
        }

        /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */

        // if (this._flagClip) {

        //   clip = svg.getClip(this);
        //   elem = this._renderer.elem;

        //   if (this._clip) {
        //     elem.removeAttribute('id');
        //     clip.setAttribute('id', this.id);
        //     clip.appendChild(elem);
        //   } else {
        //     clip.removeAttribute('id');
        //     elem.setAttribute('id', this.id);
        //     this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
        //   }

        // }

        if (this._flagMask) {
          if (this._mask) {
            this._renderer.elem.setAttribute('clip-path', 'url(#' + this._mask.id + ')');
          } else {
            this._renderer.elem.removeAttribute('clip-path');
          }
        }

        return this.flagReset();

      }

    },

    path: {

      render: function(domElement) {

        this._update();

        // Shortcut for hidden objects.
        // Doesn't reset the flags, so changes are stored and
        // applied once the object is visible again
        if (this._opacity === 0 && !this._flagOpacity) {
          return this;
        }

        // Collect any attribute that needs to be changed here
        var changed = {};

        var flagMatrix = this._matrix.manual || this._flagMatrix;

        if (flagMatrix) {
          changed.transform = 'matrix(' + this._matrix.toString() + ')';
        }

        if (this._flagVertices) {
          var vertices = svg.toString(this._vertices, this._closed);
          changed.d = vertices;
        }

        if (this._fill && this._fill._renderer) {
          this._fill._update();
          svg[this._fill._renderer.type].render.call(this._fill, domElement, true);
        }

        if (this._flagFill) {
          changed.fill = this._fill && this._fill.id
            ? 'url(#' + this._fill.id + ')' : this._fill;
        }

        if (this._stroke && this._stroke._renderer) {
          this._stroke._update();
          svg[this._stroke._renderer.type].render.call(this._stroke, domElement, true);
        }

        if (this._flagStroke) {
          changed.stroke = this._stroke && this._stroke.id
            ? 'url(#' + this._stroke.id + ')' : this._stroke;
        }

        if (this._flagLinewidth) {
          changed['stroke-width'] = this._linewidth;
        }

        if (this._flagOpacity) {
          changed['stroke-opacity'] = this._opacity;
          changed['fill-opacity'] = this._opacity;
        }

        if (this._flagVisible) {
          changed.visibility = this._visible ? 'visible' : 'hidden';
        }

        if (this._flagCap) {
          changed['stroke-linecap'] = this._cap;
        }

        if (this._flagJoin) {
          changed['stroke-linejoin'] = this._join;
        }

        if (this._flagMiter) {
          changed['stroke-miterlimit'] = this._miter;
        }

        // If there is no attached DOM element yet,
        // create it with all necessary attributes.
        if (!this._renderer.elem) {

          changed.id = this.id;
          this._renderer.elem = svg.createElement('path', changed);
          domElement.appendChild(this._renderer.elem);

        // Otherwise apply all pending attributes
        } else {
          svg.setAttributes(this._renderer.elem, changed);
        }

        if (this._flagClip) {

          var clip = svg.getClip(this);
          var elem = this._renderer.elem;

          if (this._clip) {
            elem.removeAttribute('id');
            clip.setAttribute('id', this.id);
            clip.appendChild(elem);
          } else {
            clip.removeAttribute('id');
            elem.setAttribute('id', this.id);
            this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
          }

        }

        /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */

        // if (this._flagMask) {
        //   if (this._mask) {
        //     elem.setAttribute('clip-path', 'url(#' + this._mask.id + ')');
        //   } else {
        //     elem.removeAttribute('clip-path');
        //   }
        // }

        return this.flagReset();

      }

    },

    text: {

      render: function(domElement) {

        this._update();

        var changed = {};

        var flagMatrix = this._matrix.manual || this._flagMatrix;

        if (flagMatrix) {
          changed.transform = 'matrix(' + this._matrix.toString() + ')';
        }

        if (this._flagFamily) {
          changed['font-family'] = this._family;
        }
        if (this._flagSize) {
          changed['font-size'] = this._size;
        }
        if (this._flagLeading) {
          changed['line-height'] = this._leading;
        }
        if (this._flagAlignment) {
          changed['text-anchor'] = svg.alignments[this._alignment] || this._alignment;
        }
        if (this._flagBaseline) {
          changed['alignment-baseline'] = changed['dominant-baseline'] = this._baseline;
        }
        if (this._flagStyle) {
          changed['font-style'] = this._style;
        }
        if (this._flagWeight) {
          changed['font-weight'] = this._weight;
        }
        if (this._flagDecoration) {
          changed['text-decoration'] = this._decoration;
        }
        if (this._fill && this._fill._renderer) {
          this._fill._update();
          svg[this._fill._renderer.type].render.call(this._fill, domElement, true);
        }
        if (this._flagFill) {
          changed.fill = this._fill && this._fill.id
            ? 'url(#' + this._fill.id + ')' : this._fill;
        }
        if (this._stroke && this._stroke._renderer) {
          this._stroke._update();
          svg[this._stroke._renderer.type].render.call(this._stroke, domElement, true);
        }
        if (this._flagStroke) {
          changed.stroke = this._stroke && this._stroke.id
            ? 'url(#' + this._stroke.id + ')' : this._stroke;
        }
        if (this._flagLinewidth) {
          changed['stroke-width'] = this._linewidth;
        }
        if (this._flagOpacity) {
          changed.opacity = this._opacity;
        }
        if (this._flagVisible) {
          changed.visibility = this._visible ? 'visible' : 'hidden';
        }

        if (!this._renderer.elem) {

          changed.id = this.id;

          this._renderer.elem = svg.createElement('text', changed);
          domElement.defs.appendChild(this._renderer.elem);

        } else {

          svg.setAttributes(this._renderer.elem, changed);

        }

        if (this._flagClip) {

          var clip = svg.getClip(this);
          var elem = this._renderer.elem;

          if (this._clip) {
            elem.removeAttribute('id');
            clip.setAttribute('id', this.id);
            clip.appendChild(elem);
          } else {
            clip.removeAttribute('id');
            elem.setAttribute('id', this.id);
            this.parent._renderer.elem.appendChild(elem); // TODO: should be insertBefore
          }

        }

        if (this._flagValue) {
          this._renderer.elem.textContent = this._value;
        }

        return this.flagReset();

      }

    },

    'linear-gradient': {

      render: function(domElement, silent) {

        if (!silent) {
          this._update();
        }

        var changed = {};

        if (this._flagEndPoints) {
          changed.x1 = this.left._x;
          changed.y1 = this.left._y;
          changed.x2 = this.right._x;
          changed.y2 = this.right._y;
        }

        if (this._flagSpread) {
          changed.spreadMethod = this._spread;
        }

        // If there is no attached DOM element yet,
        // create it with all necessary attributes.
        if (!this._renderer.elem) {

          changed.id = this.id;
          changed.gradientUnits = 'userSpaceOnUse';
          this._renderer.elem = svg.createElement('linearGradient', changed);
          domElement.defs.appendChild(this._renderer.elem);

        // Otherwise apply all pending attributes
        } else {

          svg.setAttributes(this._renderer.elem, changed);

        }

        if (this._flagStops) {

          var lengthChanged = this._renderer.elem.childNodes.length
            !== this.stops.length;

          if (lengthChanged) {
            this._renderer.elem.childNodes.length = 0;
          }

          for (var i = 0; i < this.stops.length; i++) {

            var stop = this.stops[i];
            var attrs = {};

            if (stop._flagOffset) {
              attrs.offset = 100 * stop._offset + '%';
            }
            if (stop._flagColor) {
              attrs['stop-color'] = stop._color;
            }
            if (stop._flagOpacity) {
              attrs['stop-opacity'] = stop._opacity;
            }

            if (!stop._renderer.elem) {
              stop._renderer.elem = svg.createElement('stop', attrs);
            } else {
              svg.setAttributes(stop._renderer.elem, attrs);
            }

            if (lengthChanged) {
              this._renderer.elem.appendChild(stop._renderer.elem);
            }
            stop.flagReset();

          }

        }

        return this.flagReset();

      }

    },

    'radial-gradient': {

      render: function(domElement, silent) {

        if (!silent) {
          this._update();
        }

        var changed = {};

        if (this._flagCenter) {
          changed.cx = this.center._x;
          changed.cy = this.center._y;
        }
        if (this._flagFocal) {
          changed.fx = this.focal._x;
          changed.fy = this.focal._y;
        }

        if (this._flagRadius) {
          changed.r = this._radius;
        }

        if (this._flagSpread) {
          changed.spreadMethod = this._spread;
        }

        // If there is no attached DOM element yet,
        // create it with all necessary attributes.
        if (!this._renderer.elem) {

          changed.id = this.id;
          changed.gradientUnits = 'userSpaceOnUse';
          this._renderer.elem = svg.createElement('radialGradient', changed);
          domElement.defs.appendChild(this._renderer.elem);

        // Otherwise apply all pending attributes
        } else {

          svg.setAttributes(this._renderer.elem, changed);

        }

        if (this._flagStops) {

          var lengthChanged = this._renderer.elem.childNodes.length
            !== this.stops.length;

          if (lengthChanged) {
            this._renderer.elem.childNodes.length = 0;
          }

          for (var i = 0; i < this.stops.length; i++) {

            var stop = this.stops[i];
            var attrs = {};

            if (stop._flagOffset) {
              attrs.offset = 100 * stop._offset + '%';
            }
            if (stop._flagColor) {
              attrs['stop-color'] = stop._color;
            }
            if (stop._flagOpacity) {
              attrs['stop-opacity'] = stop._opacity;
            }

            if (!stop._renderer.elem) {
              stop._renderer.elem = svg.createElement('stop', attrs);
            } else {
              svg.setAttributes(stop._renderer.elem, attrs);
            }

            if (lengthChanged) {
              this._renderer.elem.appendChild(stop._renderer.elem);
            }
            stop.flagReset();

          }

        }

        return this.flagReset();

      }

    },

    texture: {

      render: function(domElement, silent) {

        if (!silent) {
          this._update();
        }

        var changed = {};
        var styles = {};
        var image = this.image;

        if (this._flagLoaded && this.loaded) {

          switch (image.nodeName.toLowerCase()) {

            case 'canvas':
              styles.href = image.toDataURL('image/png');
              break;
            case 'img':
            case 'image':
              styles.href = this.src;
              break;

          }

        }

        if (this._flagOffset || this._flagLoaded || this._flagScale) {

          changed.x = this._offset.x;
          changed.y = this._offset.y;

          if (image) {

            changed.x -= image.width / 2;
            changed.y -= image.height / 2;

            if (this._scale instanceof Two.Vector) {
              changed.x *= this._scale.x;
              changed.y *= this._scale.y;
            } else {
              changed.x *= this._scale;
              changed.y *= this._scale;
            }
          }

        }

        if (this._flagScale || this._flagLoaded || this._flagRepeat) {

          changed.width = 0;
          changed.height = 0;

          if (image) {

            changed.width = image.width;
            changed.height = image.height;

            // TODO: Hack / Bandaid
            switch (this._repeat) {
              case 'no-repeat':
                changed.width += 1;
                changed.height += 1;
                break;
            }

            if (this._scale instanceof Two.Vector) {
              changed.width *= this._scale.x;
              changed.height *= this._scale.y;
            } else {
              changed.width *= this._scale;
              changed.height *= this._scale;
            }
          }

        }

        if (this._flagScale || this._flagLoaded) {
          if (!this._renderer.image) {
            this._renderer.image = svg.createElement('image', styles);
          } else if (!_.isEmpty(styles)) {
            svg.setAttributes(this._renderer.image, styles);
          }
        }

        if (!this._renderer.elem) {

          changed.id = this.id;
          changed.patternUnits = 'userSpaceOnUse';
          this._renderer.elem = svg.createElement('pattern', changed);
          domElement.defs.appendChild(this._renderer.elem);

        } else if (!_.isEmpty(changed)) {

          svg.setAttributes(this._renderer.elem, changed);

        }

        if (this._renderer.elem && this._renderer.image && !this._renderer.appended) {
          this._renderer.elem.appendChild(this._renderer.image);
          this._renderer.appended = true;
        }

        return this.flagReset();

      }

    }

  };

  /**
   * @class
   */
  var Renderer = Two[Two.Types.svg] = function(params) {

    this.domElement = params.domElement || svg.createElement('svg');

    this.scene = new Two.Group();
    this.scene.parent = this;

    this.defs = svg.createElement('defs');
    this.domElement.appendChild(this.defs);
    this.domElement.defs = this.defs;
    this.domElement.style.overflow = 'hidden';

  };

  _.extend(Renderer, {

    Utils: svg

  });

  _.extend(Renderer.prototype, Two.Utils.Events, {

    setSize: function(width, height) {

      this.width = width;
      this.height = height;

      svg.setAttributes(this.domElement, {
        width: width,
        height: height
      });

      return this;

    },

    render: function() {

      svg.group.render.call(this.scene, this.domElement);

      return this;

    }

  });

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  /**
   * Constants
   */
  var mod = Two.Utils.mod, toFixed = Two.Utils.toFixed;
  var getRatio = Two.Utils.getRatio;
  var _ = Two.Utils;

  // Returns true if this is a non-transforming matrix
  var isDefaultMatrix = function (m) {
    return (m[0] == 1 && m[3] == 0 && m[1] == 0 && m[4] == 1 && m[2] == 0 && m[5] == 0);
  };

  var canvas = {

    isHidden: /(none|transparent)/i,

    alignments: {
      left: 'start',
      middle: 'center',
      right: 'end'
    },

    shim: function(elem) {
      elem.tagName = 'canvas';
      elem.nodeType = 1;
      return elem;
    },

    group: {

      renderChild: function(child) {
        canvas[child._renderer.type].render.call(child, this.ctx, true, this.clip);
      },

      render: function(ctx) {

        // TODO: Add a check here to only invoke _update if need be.
        this._update();

        var matrix = this._matrix.elements;
        var parent = this.parent;
        this._renderer.opacity = this._opacity * (parent && parent._renderer ? parent._renderer.opacity : 1);

        var defaultMatrix = isDefaultMatrix(matrix);

        var mask = this._mask;
        // var clip = this._clip;

        if (!this._renderer.context) {
          this._renderer.context = {};
        }

        this._renderer.context.ctx = ctx;
        // this._renderer.context.clip = clip;

        if (!defaultMatrix) {
          ctx.save();
          ctx.transform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
        }

        if (mask) {
          canvas[mask._renderer.type].render.call(mask, ctx, true);
        }

        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          canvas[child._renderer.type].render.call(child, ctx);
        }

        if (!defaultMatrix) {
          ctx.restore();
        }

       /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */

        // if (clip) {
        //   ctx.clip();
        // }

        return this.flagReset();

      }

    },

    path: {

      render: function(ctx, forced, parentClipped) {

        var matrix, stroke, linewidth, fill, opacity, visible, cap, join, miter,
            closed, commands, length, last, next, prev, a, b, c, d, ux, uy, vx, vy,
            ar, bl, br, cl, x, y, mask, clip, defaultMatrix, isOffset;

        // TODO: Add a check here to only invoke _update if need be.
        this._update();

        matrix = this._matrix.elements;
        stroke = this._stroke;
        linewidth = this._linewidth;
        fill = this._fill;
        opacity = this._opacity * this.parent._renderer.opacity;
        visible = this._visible;
        cap = this._cap;
        join = this._join;
        miter = this._miter;
        closed = this._closed;
        commands = this._vertices; // Commands
        length = commands.length;
        last = length - 1;
        defaultMatrix = isDefaultMatrix(matrix);

        // mask = this._mask;
        clip = this._clip;

        if (!forced && (!visible || clip)) {
          return this;
        }

        // Transform
        if (!defaultMatrix) {
          ctx.save();
          ctx.transform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
        }

       /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */

        // if (mask) {
        //   canvas[mask._renderer.type].render.call(mask, ctx, true);
        // }

        // Styles
        if (fill) {
          if (_.isString(fill)) {
            ctx.fillStyle = fill;
          } else {
            canvas[fill._renderer.type].render.call(fill, ctx);
            ctx.fillStyle = fill._renderer.effect;
          }
        }
        if (stroke) {
          if (_.isString(stroke)) {
            ctx.strokeStyle = stroke;
          } else {
            canvas[stroke._renderer.type].render.call(stroke, ctx);
            ctx.strokeStyle = stroke._renderer.effect;
          }
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
        if (miter) {
          ctx.miterLimit = miter;
        }
        if (join) {
          ctx.lineJoin = join;
        }
        if (cap) {
          ctx.lineCap = cap;
        }
        if (_.isNumber(opacity)) {
          ctx.globalAlpha = opacity;
        }

        ctx.beginPath();

        for (var i = 0; i < commands.length; i++) {

          b = commands[i];

          x = toFixed(b._x);
          y = toFixed(b._y);

          switch (b._command) {

            case Two.Commands.close:
              ctx.closePath();
              break;

            case Two.Commands.curve:

              prev = closed ? mod(i - 1, length) : Math.max(i - 1, 0);
              next = closed ? mod(i + 1, length) : Math.min(i + 1, last);

              a = commands[prev];
              c = commands[next];
              ar = (a.controls && a.controls.right) || Two.Vector.zero;
              bl = (b.controls && b.controls.left) || Two.Vector.zero;

              if (a._relative) {
                vx = (ar.x + toFixed(a._x));
                vy = (ar.y + toFixed(a._y));
              } else {
                vx = toFixed(ar.x);
                vy = toFixed(ar.y);
              }

              if (b._relative) {
                ux = (bl.x + toFixed(b._x));
                uy = (bl.y + toFixed(b._y));
              } else {
                ux = toFixed(bl.x);
                uy = toFixed(bl.y);
              }

              ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

              if (i >= last && closed) {

                c = d;

                br = (b.controls && b.controls.right) || Two.Vector.zero;
                cl = (c.controls && c.controls.left) || Two.Vector.zero;

                if (b._relative) {
                  vx = (br.x + toFixed(b._x));
                  vy = (br.y + toFixed(b._y));
                } else {
                  vx = toFixed(br.x);
                  vy = toFixed(br.y);
                }

                if (c._relative) {
                  ux = (cl.x + toFixed(c._x));
                  uy = (cl.y + toFixed(c._y));
                } else {
                  ux = toFixed(cl.x);
                  uy = toFixed(cl.y);
                }

                x = toFixed(c._x);
                y = toFixed(c._y);

                ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

              }

              break;

            case Two.Commands.line:
              ctx.lineTo(x, y);
              break;

            case Two.Commands.move:
              d = b;
              ctx.moveTo(x, y);
              break;

          }
        }

        // Loose ends

        if (closed) {
          ctx.closePath();
        }

        if (!clip && !parentClipped) {
          if (!canvas.isHidden.test(fill)) {
            isOffset = fill._renderer && fill._renderer.offset
            if (isOffset) {
              ctx.save();
              ctx.translate(
                - fill._renderer.offset.x, - fill._renderer.offset.y);
              ctx.scale(fill._renderer.scale.x, fill._renderer.scale.y);
            }
            ctx.fill();
            if (isOffset) {
              ctx.restore();
            }
          }
          if (!canvas.isHidden.test(stroke)) {
            isOffset = stroke._renderer && stroke._renderer.offset;
            if (isOffset) {
              ctx.save();
              ctx.translate(
                - stroke._renderer.offset.x, - stroke._renderer.offset.y);
              ctx.scale(stroke._renderer.scale.x, stroke._renderer.scale.y);
              ctx.lineWidth = linewidth / stroke._renderer.scale.x;
            }
            ctx.stroke();
            if (isOffset) {
              ctx.restore();
            }
          }
        }

        if (!defaultMatrix) {
          ctx.restore();
        }

        if (clip && !parentClipped) {
          ctx.clip();
        }

        return this.flagReset();

      }

    },

    text: {

      render: function(ctx, forced, parentClipped) {

        // TODO: Add a check here to only invoke _update if need be.
        this._update();

        var matrix = this._matrix.elements;
        var stroke = this._stroke;
        var linewidth = this._linewidth;
        var fill = this._fill;
        var opacity = this._opacity * this.parent._renderer.opacity;
        var visible = this._visible;
        var defaultMatrix = isDefaultMatrix(matrix);
        var isOffset = fill._renderer && fill._renderer.offset
          && stroke._renderer && stroke._renderer.offset;

        var a, b, c, d, e, sx, sy;

        // mask = this._mask;
        var clip = this._clip;

        if (!forced && (!visible || clip)) {
          return this;
        }

        // Transform
        if (!defaultMatrix) {
          ctx.save();
          ctx.transform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5]);
        }

       /**
         * Commented two-way functionality of clips / masks with groups and
         * polygons. Uncomment when this bug is fixed:
         * https://code.google.com/p/chromium/issues/detail?id=370951
         */

        // if (mask) {
        //   canvas[mask._renderer.type].render.call(mask, ctx, true);
        // }

        if (!isOffset) {
          ctx.font = [this._style, this._weight, this._size + 'px/' +
            this._leading + 'px', this._family].join(' ');
        }

        ctx.textAlign = canvas.alignments[this._alignment] || this._alignment;
        ctx.textBaseline = this._baseline;

        // Styles
        if (fill) {
          if (_.isString(fill)) {
            ctx.fillStyle = fill;
          } else {
            canvas[fill._renderer.type].render.call(fill, ctx);
            ctx.fillStyle = fill._renderer.effect;
          }
        }
        if (stroke) {
          if (_.isString(stroke)) {
            ctx.strokeStyle = stroke;
          } else {
            canvas[stroke._renderer.type].render.call(stroke, ctx);
            ctx.strokeStyle = stroke._renderer.effect;
          }
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
        if (_.isNumber(opacity)) {
          ctx.globalAlpha = opacity;
        }

        if (!clip && !parentClipped) {

          if (!canvas.isHidden.test(fill)) {

            if (fill._renderer && fill._renderer.offset) {

              sx = toFixed(fill._renderer.scale.x);
              sy = toFixed(fill._renderer.scale.y);

              ctx.save();
              ctx.translate( - toFixed(fill._renderer.offset.x),
                - toFixed(fill._renderer.offset.y));
              ctx.scale(sx, sy);

              a = this._size / fill._renderer.scale.y;
              b = this._leading / fill._renderer.scale.y;
              ctx.font = [this._style, this._weight, toFixed(a) + 'px/',
                toFixed(b) + 'px', this._family].join(' ');

              c = fill._renderer.offset.x / fill._renderer.scale.x;
              d = fill._renderer.offset.y / fill._renderer.scale.y;

              ctx.fillText(this.value, toFixed(c), toFixed(d));
              ctx.restore();

            } else {
              ctx.fillText(this.value, 0, 0);
            }

          }

          if (!canvas.isHidden.test(stroke)) {

            if (stroke._renderer && stroke._renderer.offset) {

              sx = toFixed(stroke._renderer.scale.x);
              sy = toFixed(stroke._renderer.scale.y);

              ctx.save();
              ctx.translate(- toFixed(stroke._renderer.offset.x),
                - toFixed(stroke._renderer.offset.y));
              ctx.scale(sx, sy);

              a = this._size / stroke._renderer.scale.y;
              b = this._leading / stroke._renderer.scale.y;
              ctx.font = [this._style, this._weight, toFixed(a) + 'px/',
                toFixed(b) + 'px', this._family].join(' ');

              c = stroke._renderer.offset.x / stroke._renderer.scale.x;
              d = stroke._renderer.offset.y / stroke._renderer.scale.y;
              e = linewidth / stroke._renderer.scale.x;

              ctx.lineWidth = toFixed(e);
              ctx.strokeText(this.value, toFixed(c), toFixed(d));
              ctx.restore();

            } else {
              ctx.strokeText(this.value, 0, 0);
            }
          }
        }

        if (!defaultMatrix) {
          ctx.restore();
        }

        // TODO: Test for text
        if (clip && !parentClipped) {
          ctx.clip();
        }

        return this.flagReset();

      }

    },

    'linear-gradient': {

      render: function(ctx) {

        this._update();

        if (!this._renderer.effect || this._flagEndPoints || this._flagStops) {

          this._renderer.effect = ctx.createLinearGradient(
            this.left._x, this.left._y,
            this.right._x, this.right._y
          );

          for (var i = 0; i < this.stops.length; i++) {
            var stop = this.stops[i];
            this._renderer.effect.addColorStop(stop._offset, stop._color);
          }

        }

        return this.flagReset();

      }

    },

    'radial-gradient': {

      render: function(ctx) {

        this._update();

        if (!this._renderer.effect || this._flagCenter || this._flagFocal
            || this._flagRadius || this._flagStops) {

          this._renderer.effect = ctx.createRadialGradient(
            this.center._x, this.center._y, 0,
            this.focal._x, this.focal._y, this._radius
          );

          for (var i = 0; i < this.stops.length; i++) {
            var stop = this.stops[i];
            this._renderer.effect.addColorStop(stop._offset, stop._color);
          }

        }

        return this.flagReset();

      }

    },

    texture: {

      render: function(ctx) {

        this._update();

        var image = this.image;
        var repeat;

        if (!this._renderer.effect || ((this._flagLoaded || this._flagImage || this._flagRepeat) && this.loaded)) {
          this._renderer.effect = ctx.createPattern(this.image, this._repeat);
        }

        if (this._flagOffset || this._flagLoaded || this._flagScale) {

          if (!(this._renderer.offset instanceof Two.Vector)) {
            this._renderer.offset = new Two.Vector();
          }

          this._renderer.offset.x = this._offset.x;
          this._renderer.offset.y = this._offset.y;

          if (image) {

            this._renderer.offset.x -= image.width / 2;
            this._renderer.offset.y += image.height / 2;

            if (this._scale instanceof Two.Vector) {
              this._renderer.offset.x *= this._scale.x;
              this._renderer.offset.y *= this._scale.y;
            } else {
              this._renderer.offset.x *= this._scale;
              this._renderer.offset.y *= this._scale;
            }
          }

        }

        if (this._flagScale || this._flagLoaded) {

          if (!(this._renderer.scale instanceof Two.Vector)) {
            this._renderer.scale = new Two.Vector();
          }

          if (this._scale instanceof Two.Vector) {
            this._renderer.scale.copy(this._scale);
          } else {
            this._renderer.scale.set(this._scale, this._scale);
          }

        }

        return this.flagReset();

      }

    }

  };

  var Renderer = Two[Two.Types.canvas] = function(params) {
    // Smoothing property. Defaults to true
    // Set it to false when working with pixel art.
    // false can lead to better performance, since it would use a cheaper interpolation algorithm.
    // It might not make a big difference on GPU backed canvases.
    var smoothing = (params.smoothing !== false);
    this.domElement = params.domElement || document.createElement('canvas');
    this.ctx = this.domElement.getContext('2d');
    this.overdraw = params.overdraw || false;

    if (!_.isUndefined(this.ctx.imageSmoothingEnabled)) {
      this.ctx.imageSmoothingEnabled = smoothing;
    }

    // Everything drawn on the canvas needs to be added to the scene.
    this.scene = new Two.Group();
    this.scene.parent = this;
  };


  _.extend(Renderer, {

    Utils: canvas

  });

  _.extend(Renderer.prototype, Two.Utils.Events, {

    setSize: function(width, height, ratio) {

      this.width = width;
      this.height = height;

      this.ratio = _.isUndefined(ratio) ? getRatio(this.ctx) : ratio;

      this.domElement.width = width * this.ratio;
      this.domElement.height = height * this.ratio;

      if (this.domElement.style) {
        _.extend(this.domElement.style, {
          width: width + 'px',
          height: height + 'px'
        });
      }

      return this;

    },

    render: function() {

      var isOne = this.ratio === 1;

      if (!isOne) {
        this.ctx.save();
        this.ctx.scale(this.ratio, this.ratio);
      }

      if (!this.overdraw) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      canvas.group.render.call(this.scene, this.ctx);

      if (!isOne) {
        this.ctx.restore();
      }

      return this;

    }

  });

  function resetTransform(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  /**
   * Constants
   */

  var root = Two.root,
    multiplyMatrix = Two.Matrix.Multiply,
    mod = Two.Utils.mod,
    identity = [1, 0, 0, 0, 1, 0, 0, 0, 1],
    transformation = new Two.Array(9),
    getRatio = Two.Utils.getRatio,
    getComputedMatrix = Two.Utils.getComputedMatrix,
    toFixed = Two.Utils.toFixed,
    _ = Two.Utils;

  var webgl = {

    isHidden: /(none|transparent)/i,

    canvas: (root.document ? root.document.createElement('canvas') : { getContext: _.identity }),

    alignments: {
      left: 'start',
      middle: 'center',
      right: 'end'
    },

    matrix: new Two.Matrix(),

    uv: new Two.Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1
    ]),

    group: {

      removeChild: function(child, gl) {
        if (child.children) {
          for (var i = 0; i < child.children.length; i++) {
            webgl.group.removeChild(child.children[i], gl);
          }
          return;
        }
        // Deallocate texture to free up gl memory.
        gl.deleteTexture(child._renderer.texture);
        delete child._renderer.texture;
      },

      renderChild: function(child) {
        webgl[child._renderer.type].render.call(child, this.gl, this.program);
      },

      render: function(gl, program) {

        this._update();

        var parent = this.parent;
        var flagParentMatrix = (parent._matrix && parent._matrix.manual) || parent._flagMatrix;
        var flagMatrix = this._matrix.manual || this._flagMatrix;

        if (flagParentMatrix || flagMatrix) {

          if (!this._renderer.matrix) {
            this._renderer.matrix = new Two.Array(9);
          }

          // Reduce amount of object / array creation / deletion
          this._matrix.toArray(true, transformation);

          multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);
          this._renderer.scale = this._scale * parent._renderer.scale;

          if (flagParentMatrix) {
            this._flagMatrix = true;
          }

        }

        if (this._mask) {

          gl.enable(gl.STENCIL_TEST);
          gl.stencilFunc(gl.ALWAYS, 1, 1);

          gl.colorMask(false, false, false, true);
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

          webgl[this._mask._renderer.type].render.call(this._mask, gl, program, this);

          gl.colorMask(true, true, true, true);
          gl.stencilFunc(gl.NOTEQUAL, 0, 1);
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        }

        this._flagOpacity = parent._flagOpacity || this._flagOpacity;

        this._renderer.opacity = this._opacity
          * (parent && parent._renderer ? parent._renderer.opacity : 1);

        if (this._flagSubtractions) {
          for (var i = 0; i < this.subtractions.length; i++) {
            webgl.group.removeChild(this.subtractions[i], gl);
          }
        }

        this.children.forEach(webgl.group.renderChild, {
          gl: gl,
          program: program
        });

        if (this._mask) {

          gl.colorMask(false, false, false, false);
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

          webgl[this._mask._renderer.type].render.call(this._mask, gl, program, this);

          gl.colorMask(true, true, true, true);
          gl.stencilFunc(gl.NOTEQUAL, 0, 1);
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

          gl.disable(gl.STENCIL_TEST);

        }

        return this.flagReset();

      }

    },

    path: {

      updateCanvas: function(elem) {

        var next, prev, a, c, ux, uy, vx, vy, ar, bl, br, cl, x, y;
        var isOffset;

        var commands = elem._vertices;
        var canvas = this.canvas;
        var ctx = this.ctx;

        // Styles
        var scale = elem._renderer.scale;
        var stroke = elem._stroke;
        var linewidth = elem._linewidth;
        var fill = elem._fill;
        var opacity = elem._renderer.opacity || elem._opacity;
        var cap = elem._cap;
        var join = elem._join;
        var miter = elem._miter;
        var closed = elem._closed;
        var length = commands.length;
        var last = length - 1;

        canvas.width = Math.max(Math.ceil(elem._renderer.rect.width * scale), 1);
        canvas.height = Math.max(Math.ceil(elem._renderer.rect.height * scale), 1);

        var centroid = elem._renderer.rect.centroid;
        var cx = centroid.x;
        var cy = centroid.y;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (fill) {
          if (_.isString(fill)) {
            ctx.fillStyle = fill;
          } else {
            webgl[fill._renderer.type].render.call(fill, ctx, elem);
            ctx.fillStyle = fill._renderer.effect;
          }
        }
        if (stroke) {
          if (_.isString(stroke)) {
            ctx.strokeStyle = stroke;
          } else {
            webgl[stroke._renderer.type].render.call(stroke, ctx, elem);
            ctx.strokeStyle = stroke._renderer.effect;
          }
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
        if (miter) {
          ctx.miterLimit = miter;
        }
        if (join) {
          ctx.lineJoin = join;
        }
        if (cap) {
          ctx.lineCap = cap;
        }
        if (_.isNumber(opacity)) {
          ctx.globalAlpha = opacity;
        }

        var d;
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(cx, cy);

        ctx.beginPath();
        for (var i = 0; i < commands.length; i++) {

          b = commands[i];

          x = toFixed(b._x);
          y = toFixed(b._y);

          switch (b._command) {

            case Two.Commands.close:
              ctx.closePath();
              break;

            case Two.Commands.curve:

              prev = closed ? mod(i - 1, length) : Math.max(i - 1, 0);
              next = closed ? mod(i + 1, length) : Math.min(i + 1, last);

              a = commands[prev];
              c = commands[next];
              ar = (a.controls && a.controls.right) || Two.Vector.zero;
              bl = (b.controls && b.controls.left) || Two.Vector.zero;

              if (a._relative) {
                vx = toFixed((ar.x + a._x));
                vy = toFixed((ar.y + a._y));
              } else {
                vx = toFixed(ar.x);
                vy = toFixed(ar.y);
              }

              if (b._relative) {
                ux = toFixed((bl.x + b._x));
                uy = toFixed((bl.y + b._y));
              } else {
                ux = toFixed(bl.x);
                uy = toFixed(bl.y);
              }

              ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

              if (i >= last && closed) {

                c = d;

                br = (b.controls && b.controls.right) || Two.Vector.zero;
                cl = (c.controls && c.controls.left) || Two.Vector.zero;

                if (b._relative) {
                  vx = toFixed((br.x + b._x));
                  vy = toFixed((br.y + b._y));
                } else {
                  vx = toFixed(br.x);
                  vy = toFixed(br.y);
                }

                if (c._relative) {
                  ux = toFixed((cl.x + c._x));
                  uy = toFixed((cl.y + c._y));
                } else {
                  ux = toFixed(cl.x);
                  uy = toFixed(cl.y);
                }

                x = toFixed(c._x);
                y = toFixed(c._y);

                ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

              }

              break;

            case Two.Commands.line:
              ctx.lineTo(x, y);
              break;

            case Two.Commands.move:
              d = b;
              ctx.moveTo(x, y);
              break;

          }

        }

        // Loose ends

        if (closed) {
          ctx.closePath();
        }

        if (!webgl.isHidden.test(fill)) {
          isOffset = fill._renderer && fill._renderer.offset
          if (isOffset) {
            ctx.save();
            ctx.translate(
              - fill._renderer.offset.x, - fill._renderer.offset.y);
            ctx.scale(fill._renderer.scale.x, fill._renderer.scale.y);
          }
          ctx.fill();
          if (isOffset) {
            ctx.restore();
          }
        }

        if (!webgl.isHidden.test(stroke)) {
          isOffset = stroke._renderer && stroke._renderer.offset;
          if (isOffset) {
            ctx.save();
            ctx.translate(
              - stroke._renderer.offset.x, - stroke._renderer.offset.y);
            ctx.scale(stroke._renderer.scale.x, stroke._renderer.scale.y);
            ctx.lineWidth = linewidth / stroke._renderer.scale.x;
          }
          ctx.stroke();
          if (isOffset) {
            ctx.restore();
          }
        }

        ctx.restore();

      },

      /**
       * Returns the rect of a set of verts. Typically takes vertices that are
       * "centered" around 0 and returns them to be anchored upper-left.
       */
      getBoundingClientRect: function(vertices, border, rect) {

        var left = Infinity, right = -Infinity,
            top = Infinity, bottom = -Infinity,
            width, height;

        vertices.forEach(function(v) {

          var x = v.x, y = v.y, controls = v.controls;
          var a, b, c, d, cl, cr;

          top = Math.min(y, top);
          left = Math.min(x, left);
          right = Math.max(x, right);
          bottom = Math.max(y, bottom);

          if (!v.controls) {
            return;
          }

          cl = controls.left;
          cr = controls.right;

          if (!cl || !cr) {
            return;
          }

          a = v._relative ? cl.x + x : cl.x;
          b = v._relative ? cl.y + y : cl.y;
          c = v._relative ? cr.x + x : cr.x;
          d = v._relative ? cr.y + y : cr.y;

          if (!a || !b || !c || !d) {
            return;
          }

          top = Math.min(b, d, top);
          left = Math.min(a, c, left);
          right = Math.max(a, c, right);
          bottom = Math.max(b, d, bottom);

        });

        // Expand borders

        if (_.isNumber(border)) {
          top -= border;
          left -= border;
          right += border;
          bottom += border;
        }

        width = right - left;
        height = bottom - top;

        rect.top = top;
        rect.left = left;
        rect.right = right;
        rect.bottom = bottom;
        rect.width = width;
        rect.height = height;

        if (!rect.centroid) {
          rect.centroid = {};
        }

        rect.centroid.x = - left;
        rect.centroid.y = - top;

      },

      render: function(gl, program, forcedParent) {

        if (!this._visible || !this._opacity) {
          return this;
        }

        this._update();

        // Calculate what changed

        var parent = this.parent;
        var flagParentMatrix = parent._matrix.manual || parent._flagMatrix;
        var flagMatrix = this._matrix.manual || this._flagMatrix;
        var flagTexture = this._flagVertices || this._flagFill
          || (this._fill instanceof Two.LinearGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagEndPoints))
          || (this._fill instanceof Two.RadialGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagRadius || this._fill._flagCenter || this._fill._flagFocal))
          || (this._fill instanceof Two.Texture && (this._fill._flagLoaded && this._fill.loaded || this._fill._flagOffset || this._fill._flagScale))
          || (this._stroke instanceof Two.LinearGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagEndPoints))
          || (this._stroke instanceof Two.RadialGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagRadius || this._stroke._flagCenter || this._stroke._flagFocal))
          || (this._stroke instanceof Two.Texture && (this._stroke._flagLoaded && this._stroke.loaded || this._stroke._flagOffset || this._fill._flagScale))
          || this._flagStroke || this._flagLinewidth || this._flagOpacity
          || parent._flagOpacity || this._flagVisible || this._flagCap
          || this._flagJoin || this._flagMiter || this._flagScale
          || !this._renderer.texture;

        if (flagParentMatrix || flagMatrix) {

          if (!this._renderer.matrix) {
            this._renderer.matrix = new Two.Array(9);
          }

          // Reduce amount of object / array creation / deletion

          this._matrix.toArray(true, transformation);

          multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);
          this._renderer.scale = this._scale * parent._renderer.scale;

        }

        if (flagTexture) {

          if (!this._renderer.rect) {
            this._renderer.rect = {};
          }

          if (!this._renderer.triangles) {
            this._renderer.triangles = new Two.Array(12);
          }

          this._renderer.opacity = this._opacity * parent._renderer.opacity;

          webgl.path.getBoundingClientRect(this._vertices, this._linewidth, this._renderer.rect);
          webgl.getTriangles(this._renderer.rect, this._renderer.triangles);

          webgl.updateBuffer.call(webgl, gl, this, program);
          webgl.updateTexture.call(webgl, gl, this);

        }

        // if (this._mask) {
        //   webgl[this._mask._renderer.type].render.call(mask, gl, program, this);
        // }

        if (this._clip && !forcedParent) {
          return;
        }

        // Draw Texture

        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderer.textureCoordsBuffer);

        gl.vertexAttribPointer(program.textureCoords, 2, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, this._renderer.texture);


        // Draw Rect

        gl.uniformMatrix3fv(program.matrix, false, this._renderer.matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderer.buffer);

        gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        return this.flagReset();

      }

    },

    text: {

      updateCanvas: function(elem) {

        var canvas = this.canvas;
        var ctx = this.ctx;

        // Styles
        var scale = elem._renderer.scale;
        var stroke = elem._stroke;
        var linewidth = elem._linewidth * scale;
        var fill = elem._fill;
        var opacity = elem._renderer.opacity || elem._opacity;

        canvas.width = Math.max(Math.ceil(elem._renderer.rect.width * scale), 1);
        canvas.height = Math.max(Math.ceil(elem._renderer.rect.height * scale), 1);

        var centroid = elem._renderer.rect.centroid;
        var cx = centroid.x;
        var cy = centroid.y;

        var a, b, c, d, e, sx, sy;
        var isOffset = fill._renderer && fill._renderer.offset
          && stroke._renderer && stroke._renderer.offset;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isOffset) {
          ctx.font = [elem._style, elem._weight, elem._size + 'px/' +
            elem._leading + 'px', elem._family].join(' ');
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Styles
        if (fill) {
          if (_.isString(fill)) {
            ctx.fillStyle = fill;
          } else {
            webgl[fill._renderer.type].render.call(fill, ctx, elem);
            ctx.fillStyle = fill._renderer.effect;
          }
        }
        if (stroke) {
          if (_.isString(stroke)) {
            ctx.strokeStyle = stroke;
          } else {
            webgl[stroke._renderer.type].render.call(stroke, ctx, elem);
            ctx.strokeStyle = stroke._renderer.effect;
          }
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
        if (_.isNumber(opacity)) {
          ctx.globalAlpha = opacity;
        }

        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(cx, cy);

        if (!webgl.isHidden.test(fill)) {

          if (fill._renderer && fill._renderer.offset) {

            sx = toFixed(fill._renderer.scale.x);
            sy = toFixed(fill._renderer.scale.y);

            ctx.save();
            ctx.translate( - toFixed(fill._renderer.offset.x),
              - toFixed(fill._renderer.offset.y));
            ctx.scale(sx, sy);

            a = elem._size / fill._renderer.scale.y;
            b = elem._leading / fill._renderer.scale.y;
            ctx.font = [elem._style, elem._weight, toFixed(a) + 'px/',
              toFixed(b) + 'px', elem._family].join(' ');

            c = fill._renderer.offset.x / fill._renderer.scale.x;
            d = fill._renderer.offset.y / fill._renderer.scale.y;

            ctx.fillText(elem.value, toFixed(c), toFixed(d));
            ctx.restore();

          } else {
            ctx.fillText(elem.value, 0, 0);
          }

        }

        if (!webgl.isHidden.test(stroke)) {

          if (stroke._renderer && stroke._renderer.offset) {

            sx = toFixed(stroke._renderer.scale.x);
            sy = toFixed(stroke._renderer.scale.y);

            ctx.save();
            ctx.translate(- toFixed(stroke._renderer.offset.x),
              - toFixed(stroke._renderer.offset.y));
            ctx.scale(sx, sy);

            a = elem._size / stroke._renderer.scale.y;
            b = elem._leading / stroke._renderer.scale.y;
            ctx.font = [elem._style, elem._weight, toFixed(a) + 'px/',
              toFixed(b) + 'px', elem._family].join(' ');

            c = stroke._renderer.offset.x / stroke._renderer.scale.x;
            d = stroke._renderer.offset.y / stroke._renderer.scale.y;
            e = linewidth / stroke._renderer.scale.x;

            ctx.lineWidth = toFixed(e);
            ctx.strokeText(elem.value, toFixed(c), toFixed(d));
            ctx.restore();

          } else {
            ctx.strokeText(elem.value, 0, 0);
          }

        }

        ctx.restore();

      },

      getBoundingClientRect: function(elem, rect) {

        var ctx = webgl.ctx;

        ctx.font = [elem._style, elem._weight, elem._size + 'px/' +
          elem._leading + 'px', elem._family].join(' ');

        ctx.textAlign = 'center';
        ctx.textBaseline = elem._baseline;

        // TODO: Estimate this better
        var width = ctx.measureText(elem._value).width;
        var height = Math.max(elem._size || elem._leading);

        if (this._linewidth && !webgl.isHidden.test(this._stroke)) {
          // width += this._linewidth; // TODO: Not sure if the `measure` calcs this.
          height += this._linewidth;
        }

        var w = width / 2;
        var h = height / 2;

        switch (webgl.alignments[elem._alignment] || elem._alignment) {

          case webgl.alignments.left:
            rect.left = 0;
            rect.right = width;
            break;
          case webgl.alignments.right:
            rect.left = - width;
            rect.right = 0;
            break;
          default:
            rect.left = - w;
            rect.right = w;
        }

        // TODO: Gradients aren't inherited...
        switch (elem._baseline) {
          case 'bottom':
            rect.top = - height;
            rect.bottom = 0;
            break;
          case 'top':
            rect.top = 0;
            rect.bottom = height;
            break;
          default:
            rect.top = - h;
            rect.bottom = h;
        }

        rect.width = width;
        rect.height = height;

        if (!rect.centroid) {
          rect.centroid = {};
        }

        // TODO:
        rect.centroid.x = w;
        rect.centroid.y = h;

      },

      render: function(gl, program, forcedParent) {

        if (!this._visible || !this._opacity) {
          return this;
        }

        this._update();

        // Calculate what changed

        var parent = this.parent;
        var flagParentMatrix = parent._matrix.manual || parent._flagMatrix;
        var flagMatrix = this._matrix.manual || this._flagMatrix;
        var flagTexture = this._flagVertices || this._flagFill
          || (this._fill instanceof Two.LinearGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagEndPoints))
          || (this._fill instanceof Two.RadialGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagRadius || this._fill._flagCenter || this._fill._flagFocal))
          || (this._fill instanceof Two.Texture && (this._fill._flagLoaded && this._fill.loaded))
          || (this._stroke instanceof Two.LinearGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagEndPoints))
          || (this._stroke instanceof Two.RadialGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagRadius || this._stroke._flagCenter || this._stroke._flagFocal))
          || (this._texture instanceof Two.Texture && (this._texture._flagLoaded && this._texture.loaded))
          || this._flagStroke || this._flagLinewidth || this._flagOpacity
          || parent._flagOpacity || this._flagVisible || this._flagScale
          || this._flagValue || this._flagFamily || this._flagSize
          || this._flagLeading || this._flagAlignment || this._flagBaseline
          || this._flagStyle || this._flagWeight || this._flagDecoration
          || !this._renderer.texture;

        if (flagParentMatrix || flagMatrix) {

          if (!this._renderer.matrix) {
            this._renderer.matrix = new Two.Array(9);
          }

          // Reduce amount of object / array creation / deletion

          this._matrix.toArray(true, transformation);

          multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);
          this._renderer.scale = this._scale * parent._renderer.scale;

        }

        if (flagTexture) {

          if (!this._renderer.rect) {
            this._renderer.rect = {};
          }

          if (!this._renderer.triangles) {
            this._renderer.triangles = new Two.Array(12);
          }

          this._renderer.opacity = this._opacity * parent._renderer.opacity;

          webgl.text.getBoundingClientRect(this, this._renderer.rect);
          webgl.getTriangles(this._renderer.rect, this._renderer.triangles);

          webgl.updateBuffer.call(webgl, gl, this, program);
          webgl.updateTexture.call(webgl, gl, this);

        }

        // if (this._mask) {
        //   webgl[this._mask._renderer.type].render.call(mask, gl, program, this);
        // }

        if (this._clip && !forcedParent) {
          return;
        }

        // Draw Texture

        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderer.textureCoordsBuffer);

        gl.vertexAttribPointer(program.textureCoords, 2, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, this._renderer.texture);


        // Draw Rect

        gl.uniformMatrix3fv(program.matrix, false, this._renderer.matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderer.buffer);

        gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        return this.flagReset();

      }

    },

    'linear-gradient': {

      render: function(ctx, elem) {

        if (!ctx.canvas.getContext('2d')) {
          return;
        }

        this._update();

        if (!this._renderer.effect || this._flagEndPoints || this._flagStops) {

          this._renderer.effect = ctx.createLinearGradient(
            this.left._x, this.left._y,
            this.right._x, this.right._y
          );

          for (var i = 0; i < this.stops.length; i++) {
            var stop = this.stops[i];
            this._renderer.effect.addColorStop(stop._offset, stop._color);
          }

        }

        return this.flagReset();

      }

    },

    'radial-gradient': {

      render: function(ctx, elem) {

        if (!ctx.canvas.getContext('2d')) {
          return;
        }

        this._update();

        if (!this._renderer.effect || this._flagCenter || this._flagFocal
            || this._flagRadius || this._flagStops) {

          this._renderer.effect = ctx.createRadialGradient(
            this.center._x, this.center._y, 0,
            this.focal._x, this.focal._y, this._radius
          );

          for (var i = 0; i < this.stops.length; i++) {
            var stop = this.stops[i];
            this._renderer.effect.addColorStop(stop._offset, stop._color);
          }

        }

        return this.flagReset();

      }

    },

    texture: {

      render: function(ctx, elem) {

        if (!ctx.canvas.getContext('2d')) {
          return;
        }

        this._update();

        var image = this.image;
        var repeat;

        if (!this._renderer.effect || ((this._flagLoaded || this._flagRepeat) && this.loaded)) {
          this._renderer.effect = ctx.createPattern(image, this._repeat);
        }

        if (this._flagOffset || this._flagLoaded || this._flagScale) {

          if (!(this._renderer.offset instanceof Two.Vector)) {
            this._renderer.offset = new Two.Vector();
          }

          this._renderer.offset.x = this._offset.x;
          this._renderer.offset.y = this._offset.y;

          if (image) {

            this._renderer.offset.x -= image.width / 2;
            this._renderer.offset.y += image.height / 2;

            if (this._scale instanceof Two.Vector) {
              this._renderer.offset.x *= this._scale.x;
              this._renderer.offset.y *= this._scale.y;
            } else {
              this._renderer.offset.x *= this._scale;
              this._renderer.offset.y *= this._scale;
            }
          }

        }

        if (this._flagScale || this._flagLoaded) {

          if (!(this._renderer.scale instanceof Two.Vector)) {
            this._renderer.scale = new Two.Vector();
          }

          if (this._scale instanceof Two.Vector) {
            this._renderer.scale.copy(this._scale);
          } else {
            this._renderer.scale.set(this._scale, this._scale);
          }

        }

        return this.flagReset();

      }

    },

    getTriangles: function(rect, triangles) {

      var top = rect.top,
          left = rect.left,
          right = rect.right,
          bottom = rect.bottom;

      // First Triangle

      triangles[0] = left;
      triangles[1] = top;

      triangles[2] = right;
      triangles[3] = top;

      triangles[4] = left;
      triangles[5] = bottom;

      // Second Triangle

      triangles[6] = left;
      triangles[7] = bottom;

      triangles[8] = right;
      triangles[9] = top;

      triangles[10] = right;
      triangles[11] = bottom;

    },

    updateTexture: function(gl, elem) {

      this[elem._renderer.type].updateCanvas.call(webgl, elem);

      if (elem._renderer.texture) {
        gl.deleteTexture(elem._renderer.texture);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, elem._renderer.textureCoordsBuffer);

      // TODO: Is this necessary every time or can we do once?
      // TODO: Create a registry for textures
      elem._renderer.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, elem._renderer.texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      if (this.canvas.width <= 0 || this.canvas.height <= 0) {
        return;
      }

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);

    },

    updateBuffer: function(gl, elem, program) {

      if (_.isObject(elem._renderer.buffer)) {
        gl.deleteBuffer(elem._renderer.buffer);
      }

      elem._renderer.buffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, elem._renderer.buffer);
      gl.enableVertexAttribArray(program.position);

      gl.bufferData(gl.ARRAY_BUFFER, elem._renderer.triangles, gl.STATIC_DRAW);

      if (_.isObject(elem._renderer.textureCoordsBuffer)) {
        gl.deleteBuffer(elem._renderer.textureCoordsBuffer);
      }

      elem._renderer.textureCoordsBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, elem._renderer.textureCoordsBuffer);
      gl.enableVertexAttribArray(program.textureCoords);

      gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.STATIC_DRAW);

    },

    program: {

      create: function(gl, shaders) {
        var program, linked, error;
        program = gl.createProgram();
        _.each(shaders, function(s) {
          gl.attachShader(program, s);
        });

        gl.linkProgram(program);
        linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
          error = gl.getProgramInfoLog(program);
          gl.deleteProgram(program);
          throw new Two.Utils.Error('unable to link program: ' + error);
        }

        return program;

      }

    },

    shaders: {

      create: function(gl, source, type) {
        var shader, compiled, error;
        shader = gl.createShader(gl[type]);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
          error = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Two.Utils.Error('unable to compile shader ' + shader + ': ' + error);
        }

        return shader;

      },

      types: {
        vertex: 'VERTEX_SHADER',
        fragment: 'FRAGMENT_SHADER'
      },

      vertex: [
        'attribute vec2 a_position;',
        'attribute vec2 a_textureCoords;',
        '',
        'uniform mat3 u_matrix;',
        'uniform vec2 u_resolution;',
        '',
        'varying vec2 v_textureCoords;',
        '',
        'void main() {',
        '   vec2 projected = (u_matrix * vec3(a_position, 1.0)).xy;',
        '   vec2 normal = projected / u_resolution;',
        '   vec2 clipspace = (normal * 2.0) - 1.0;',
        '',
        '   gl_Position = vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);',
        '   v_textureCoords = a_textureCoords;',
        '}'
      ].join('\n'),

      fragment: [
        'precision mediump float;',
        '',
        'uniform sampler2D u_image;',
        'varying vec2 v_textureCoords;',
        '',
        'void main() {',
        '  gl_FragColor = texture2D(u_image, v_textureCoords);',
        '}'
      ].join('\n')

    },

    TextureRegistry: new Two.Registry()

  };

  webgl.ctx = webgl.canvas.getContext('2d');

  var Renderer = Two[Two.Types.webgl] = function(options) {

    var params, gl, vs, fs;
    this.domElement = options.domElement || document.createElement('canvas');

    // Everything drawn on the canvas needs to come from the stage.
    this.scene = new Two.Group();
    this.scene.parent = this;

    this._renderer = {
      matrix: new Two.Array(identity),
      scale: 1,
      opacity: 1
    };
    this._flagMatrix = true;

    // http://games.greggman.com/game/webgl-and-alpha/
    // http://www.khronos.org/registry/webgl/specs/latest/#5.2
    params = _.defaults(options || {}, {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      stencil: true,
      preserveDrawingBuffer: true,
      overdraw: false
    });

    this.overdraw = params.overdraw;

    gl = this.ctx = this.domElement.getContext('webgl', params) ||
      this.domElement.getContext('experimental-webgl', params);

    if (!this.ctx) {
      throw new Two.Utils.Error(
        'unable to create a webgl context. Try using another renderer.');
    }

    // Compile Base Shaders to draw in pixel space.
    vs = webgl.shaders.create(
      gl, webgl.shaders.vertex, webgl.shaders.types.vertex);
    fs = webgl.shaders.create(
      gl, webgl.shaders.fragment, webgl.shaders.types.fragment);

    this.program = webgl.program.create(gl, [vs, fs]);
    gl.useProgram(this.program);

    // Create and bind the drawing buffer

    // look up where the vertex data needs to go.
    this.program.position = gl.getAttribLocation(this.program, 'a_position');
    this.program.matrix = gl.getUniformLocation(this.program, 'u_matrix');
    this.program.textureCoords = gl.getAttribLocation(this.program, 'a_textureCoords');

    // Copied from Three.js WebGLRenderer
    gl.disable(gl.DEPTH_TEST);

    // Setup some initial statements of the gl context
    gl.enable(gl.BLEND);

    // https://code.google.com/p/chromium/issues/detail?id=316393
    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, gl.TRUE);

    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

  };

  _.extend(Renderer, {

    Utils: webgl

  });

  _.extend(Renderer.prototype, Two.Utils.Events, {

    setSize: function(width, height, ratio) {

      this.width = width;
      this.height = height;

      this.ratio = _.isUndefined(ratio) ? getRatio(this.ctx) : ratio;

      this.domElement.width = width * this.ratio;
      this.domElement.height = height * this.ratio;

      _.extend(this.domElement.style, {
        width: width + 'px',
        height: height + 'px'
      });

      width *= this.ratio;
      height *= this.ratio;

      // Set for this.stage parent scaling to account for HDPI
      this._renderer.matrix[0] = this._renderer.matrix[4] = this._renderer.scale = this.ratio;

      this._flagMatrix = true;

      this.ctx.viewport(0, 0, width, height);

      var resolutionLocation = this.ctx.getUniformLocation(
        this.program, 'u_resolution');
      this.ctx.uniform2f(resolutionLocation, width, height);

      return this;

    },

    render: function() {

      var gl = this.ctx;

      if (!this.overdraw) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }

      webgl.group.render.call(this.scene, gl, this.program);
      this._flagMatrix = false;

      return this;

    }

  });

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var Shape = Two.Shape = function() {

    // Private object for renderer specific variables.
    this._renderer = {};
    this._renderer.flagMatrix = _.bind(Shape.FlagMatrix, this);
    this.isShape = true;

    this.id = Two.Identifier + Two.uniqueId();
    this.classList = [];

    // Define matrix properties which all inherited
    // objects of Shape have.

    this._matrix = new Two.Matrix();

    this.translation = new Two.Vector();
    this.rotation = 0;
    this.scale = 1;

  };

  _.extend(Shape, {

    FlagMatrix: function() {
      this._flagMatrix = true;
    },

    MakeObservable: function(object) {

      Object.defineProperty(object, 'translation', {
        enumerable: true,
        get: function() {
          return this._translation;
        },
        set: function(v) {
          if (this._translation) {
            this._translation.unbind(Two.Events.change, this._renderer.flagMatrix);
          }
          this._translation = v;
          this._translation.bind(Two.Events.change, this._renderer.flagMatrix);
          Shape.FlagMatrix.call(this);
        }
      });

      Object.defineProperty(object, 'rotation', {
        enumerable: true,
        get: function() {
          return this._rotation;
        },
        set: function(v) {
          this._rotation = v;
          this._flagMatrix = true;
        }
      });

      Object.defineProperty(object, 'scale', {
        enumerable: true,
        get: function() {
          return this._scale;
        },
        set: function(v) {

          if (this._scale instanceof Two.Vector) {
            this._scale.unbind(Two.Events.change, this._renderer.flagMatrix);
          }

          this._scale = v;

          if (this._scale instanceof Two.Vector) {
            this._scale.bind(Two.Events.change, this._renderer.flagMatrix);
          }

          this._flagMatrix = true;
          this._flagScale = true;

        }
      });

    }

  });

  _.extend(Shape.prototype, Two.Utils.Events, {

    // Flags

    _flagMatrix: true,
    _flagScale: false,

    // _flagMask: false,
    // _flagClip: false,

    // Underlying Properties

    _rotation: 0,
    _scale: 1,
    _translation: null,

    // _mask: null,
    // _clip: false,

    addTo: function(group) {
      group.add(this);
      return this;
    },

    clone: function() {
      var clone = new Shape();
      clone.translation.copy(this.translation);
      clone.rotation = this.rotation;
      clone.scale = this.scale;
      _.each(Shape.Properties, function(k) {
        clone[k] = this[k];
      }, this);
      return clone._update();
    },

    /**
     * To be called before render that calculates and collates all information
     * to be as up-to-date as possible for the render. Called once a frame.
     */
    _update: function(deep) {

      if (!this._matrix.manual && this._flagMatrix) {

        this._matrix
          .identity()
          .translate(this.translation.x, this.translation.y);

          if (this._scale instanceof Two.Vector) {
            this._matrix.scale(this._scale.x, this._scale.y);
          } else {
            this._matrix.scale(this._scale);
          }

          this._matrix.rotate(this.rotation);

      }

      if (deep) {
        // Bubble up to parents mainly for `getBoundingClientRect` method.
        if (this.parent && this.parent._update) {
          this.parent._update();
        }
      }

      return this;

    },

    flagReset: function() {

      this._flagMatrix = this._flagScale = false;

      return this;

    }

  });

  Shape.MakeObservable(Shape.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  /**
   * Constants
   */

  var min = Math.min, max = Math.max, round = Math.round,
    getComputedMatrix = Two.Utils.getComputedMatrix;

  var commands = {};
  var _ = Two.Utils;

  _.each(Two.Commands, function(v, k) {
    commands[k] = new RegExp(v);
  });

  var Path = Two.Path = function(vertices, closed, curved, manual) {

    Two.Shape.call(this);

    this._renderer.type = 'path';
    this._renderer.flagVertices = _.bind(Path.FlagVertices, this);
    this._renderer.bindVertices = _.bind(Path.BindVertices, this);
    this._renderer.unbindVertices = _.bind(Path.UnbindVertices, this);

    this._renderer.flagFill = _.bind(Path.FlagFill, this);
    this._renderer.flagStroke = _.bind(Path.FlagStroke, this);

    this._closed = !!closed;
    this._curved = !!curved;

    this.beginning = 0;
    this.ending = 1;

    // Style properties

    this.fill = '#fff';
    this.stroke = '#000';
    this.linewidth = 1.0;
    this.opacity = 1.0;
    this.visible = true;

    this.cap = 'butt';      // Default of Adobe Illustrator
    this.join = 'miter';    // Default of Adobe Illustrator
    this.miter = 4;         // Default of Adobe Illustrator

    this._vertices = [];
    this.vertices = vertices;

    // Determines whether or not two.js should calculate curves, lines, and
    // commands automatically for you or to let the developer manipulate them
    // for themselves.
    this.automatic = !manual;

  };

  _.extend(Path, {

    Properties: [
      'fill',
      'stroke',
      'linewidth',
      'opacity',
      'visible',
      'cap',
      'join',
      'miter',

      'closed',
      'curved',
      'automatic',
      'beginning',
      'ending'
    ],

    FlagVertices: function() {
      this._flagVertices = true;
      this._flagLength = true;
    },

    BindVertices: function(items) {

      // This function is called a lot
      // when importing a large SVG
      var i = items.length;
      while (i--) {
        items[i].bind(Two.Events.change, this._renderer.flagVertices);
      }

      this._renderer.flagVertices();

    },

    UnbindVertices: function(items) {

      var i = items.length;
      while (i--) {
        items[i].unbind(Two.Events.change, this._renderer.flagVertices);
      }

      this._renderer.flagVertices();

    },

    FlagFill: function() {
      this._flagFill = true;
    },

    FlagStroke: function() {
      this._flagStroke = true;
    },

    MakeObservable: function(object) {

      Two.Shape.MakeObservable(object);

      // Only the 6 defined properties are flagged like this. The subsequent
      // properties behave differently and need to be hand written.
      _.each(Path.Properties.slice(2, 8), Two.Utils.defineProperty, object);

      Object.defineProperty(object, 'fill', {
        enumerable: true,
        get: function() {
          return this._fill;
        },
        set: function(f) {

          if (this._fill instanceof Two.Gradient
            || this._fill instanceof Two.LinearGradient
            || this._fill instanceof Two.RadialGradient
            || this._fill instanceof Two.Texture) {
            this._fill.unbind(Two.Events.change, this._renderer.flagFill);
          }

          this._fill = f;
          this._flagFill = true;

          if (this._fill instanceof Two.Gradient
            || this._fill instanceof Two.LinearGradient
            || this._fill instanceof Two.RadialGradient
            || this._fill instanceof Two.Texture) {
            this._fill.bind(Two.Events.change, this._renderer.flagFill);
          }

        }
      });

      Object.defineProperty(object, 'stroke', {
        enumerable: true,
        get: function() {
          return this._stroke;
        },
        set: function(f) {

          if (this._stroke instanceof Two.Gradient
            || this._stroke instanceof Two.LinearGradient
            || this._stroke instanceof Two.RadialGradient
            || this._stroke instanceof Two.Texture) {
            this._stroke.unbind(Two.Events.change, this._renderer.flagStroke);
          }

          this._stroke = f;
          this._flagStroke = true;

          if (this._stroke instanceof Two.Gradient
            || this._stroke instanceof Two.LinearGradient
            || this._stroke instanceof Two.RadialGradient
            || this._stroke instanceof Two.Texture) {
            this._stroke.bind(Two.Events.change, this._renderer.flagStroke);
          }

        }
      });

      Object.defineProperty(object, 'length', {
        get: function() {
          if (this._flagLength) {
            this._updateLength();
          }
          return this._length;
        }
      });

      Object.defineProperty(object, 'closed', {
        enumerable: true,
        get: function() {
          return this._closed;
        },
        set: function(v) {
          this._closed = !!v;
          this._flagVertices = true;
        }
      });

      Object.defineProperty(object, 'curved', {
        enumerable: true,
        get: function() {
          return this._curved;
        },
        set: function(v) {
          this._curved = !!v;
          this._flagVertices = true;
        }
      });

      Object.defineProperty(object, 'automatic', {
        enumerable: true,
        get: function() {
          return this._automatic;
        },
        set: function(v) {
          if (v === this._automatic) {
            return;
          }
          this._automatic = !!v;
          var method = this._automatic ? 'ignore' : 'listen';
          _.each(this.vertices, function(v) {
            v[method]();
          });
        }
      });

      Object.defineProperty(object, 'beginning', {
        enumerable: true,
        get: function() {
          return this._beginning;
        },
        set: function(v) {
          this._beginning = v;
          this._flagVertices = true;
        }
      });

      Object.defineProperty(object, 'ending', {
        enumerable: true,
        get: function() {
          return this._ending;
        },
        set: function(v) {
          this._ending = v;
          this._flagVertices = true;
        }
      });

      Object.defineProperty(object, 'vertices', {

        enumerable: true,

        get: function() {
          return this._collection;
        },

        set: function(vertices) {

          var updateVertices = this._renderer.flagVertices;
          var bindVertices = this._renderer.bindVertices;
          var unbindVertices = this._renderer.unbindVertices;

          // Remove previous listeners
          if (this._collection) {
            this._collection
              .unbind(Two.Events.insert, bindVertices)
              .unbind(Two.Events.remove, unbindVertices);
          }

          // Create new Collection with copy of vertices
          this._collection = new Two.Utils.Collection((vertices || []).slice(0));

          // Listen for Collection changes and bind / unbind
          this._collection
            .bind(Two.Events.insert, bindVertices)
            .bind(Two.Events.remove, unbindVertices);

          // Bind Initial Vertices
          bindVertices(this._collection);

        }

      });

      Object.defineProperty(object, 'clip', {
        enumerable: true,
        get: function() {
          return this._clip;
        },
        set: function(v) {
          this._clip = v;
          this._flagClip = true;
        }
      });

    }

  });

  _.extend(Path.prototype, Two.Shape.prototype, {

    // Flags
    // http://en.wikipedia.org/wiki/Flag

    _flagVertices: true,
    _flagLength: true,

    _flagFill: true,
    _flagStroke: true,
    _flagLinewidth: true,
    _flagOpacity: true,
    _flagVisible: true,

    _flagCap: true,
    _flagJoin: true,
    _flagMiter: true,

    _flagClip: false,

    // Underlying Properties

    _length: 0,

    _fill: '#fff',
    _stroke: '#000',
    _linewidth: 1.0,
    _opacity: 1.0,
    _visible: true,

    _cap: 'round',
    _join: 'round',
    _miter: 4,

    _closed: true,
    _curved: false,
    _automatic: true,
    _beginning: 0,
    _ending: 1.0,

    _clip: false,

    clone: function(parent) {

      parent = parent || this.parent;

      var points = _.map(this.vertices, function(v) {
        return v.clone();
      });

      var clone = new Path(points, this.closed, this.curved, !this.automatic);

      _.each(Two.Path.Properties, function(k) {
        clone[k] = this[k];
      }, this);

      clone.translation.copy(this.translation);
      clone.rotation = this.rotation;
      clone.scale = this.scale;

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    toObject: function() {

      var result = {
        vertices: _.map(this.vertices, function(v) {
          return v.toObject();
        })
      };

      _.each(Two.Shape.Properties, function(k) {
        result[k] = this[k];
      }, this);

      result.translation = this.translation.toObject;
      result.rotation = this.rotation;
      result.scale = this.scale;

      return result;

    },

    noFill: function() {
      this.fill = 'transparent';
      return this;
    },

    noStroke: function() {
      this.stroke = 'transparent';
      return this;
    },

    /**
     * Orient the vertices of the shape to the upper lefthand
     * corner of the path.
     */
    corner: function() {

      var rect = this.getBoundingClientRect(true);

      rect.centroid = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      _.each(this.vertices, function(v) {
        v.addSelf(rect.centroid);
      });

      return this;

    },

    /**
     * Orient the vertices of the shape to the center of the
     * path.
     */
    center: function() {

      var rect = this.getBoundingClientRect(true);

      rect.centroid = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      _.each(this.vertices, function(v) {
        v.subSelf(rect.centroid);
      });

      // this.translation.addSelf(rect.centroid);

      return this;

    },

    /**
     * Remove self from the scene / parent.
     */
    remove: function() {

      if (!this.parent) {
        return this;
      }

      this.parent.remove(this);

      return this;

    },

    /**
     * Return an object with top, left, right, bottom, width, and height
     * parameters of the group.
     */
    getBoundingClientRect: function(shallow) {
      var matrix, border, l, x, y, i, v;

      var left = Infinity, right = -Infinity,
          top = Infinity, bottom = -Infinity;

      // TODO: Update this to not __always__ update. Just when it needs to.
      this._update(true);

      matrix = !!shallow ? this._matrix : getComputedMatrix(this);

      border = this.linewidth / 2;
      l = this._vertices.length;

      if (l <= 0) {
        v = matrix.multiply(0, 0, 1);
        return {
          top: v.y,
          left: v.x,
          right: v.x,
          bottom: v.y,
          width: 0,
          height: 0
        };
      }

      for (i = 0; i < l; i++) {
        v = this._vertices[i];

        x = v.x;
        y = v.y;

        v = matrix.multiply(x, y, 1);
        top = min(v.y - border, top);
        left = min(v.x - border, left);
        right = max(v.x + border, right);
        bottom = max(v.y + border, bottom);
      }

      return {
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        width: right - left,
        height: bottom - top
      };

    },

    /**
     * Given a float `t` from 0 to 1, return a point or assign a passed `obj`'s
     * coordinates to that percentage on this Two.Path's curve.
     */
    getPointAt: function(t, obj) {
      var x, x1, x2, x3, x4, y, y1, y2, y3, y4, left, right;
      var target = this.length * Math.min(Math.max(t, 0), 1);
      var length = this.vertices.length;
      var last = length - 1;

      var a = null;
      var b = null;

      for (var i = 0, l = this._lengths.length, sum = 0; i < l; i++) {

        if (sum + this._lengths[i] > target) {
          a = this.vertices[this.closed ? Two.Utils.mod(i, length) : i];
          b = this.vertices[Math.min(Math.max(i - 1, 0), last)];
          target -= sum;
          t = target / this._lengths[i];
          break;
        }

        sum += this._lengths[i];

      }

      if (_.isNull(a) || _.isNull(b)) {
        return null;
      }

      right = b.controls && b.controls.right;
      left = a.controls && a.controls.left;

      x1 = b.x;
      y1 = b.y;
      x2 = (right || b).x;
      y2 = (right || b).y;
      x3 = (left || a).x;
      y3 = (left || a).y;
      x4 = a.x;
      y4 = a.y;

      if (right && b._relative) {
        x2 += b.x;
        y2 += b.y;
      }

      if (left && a._relative) {
        x3 += a.x;
        y3 += a.y;
      }

      x = Two.Utils.getPointOnCubicBezier(t, x1, x2, x3, x4);
      y = Two.Utils.getPointOnCubicBezier(t, y1, y2, y3, y4);

      if (_.isObject(obj)) {
        obj.x = x;
        obj.y = y;
        return obj;
      }

      return new Two.Vector(x, y);

    },

    /**
     * Based on closed / curved and sorting of vertices plot where all points
     * should be and where the respective handles should be too.
     */
    plot: function() {

      if (this.curved) {
        Two.Utils.getCurveFromPoints(this._vertices, this.closed);
        return this;
      }

      for (var i = 0; i < this._vertices.length; i++) {
        this._vertices[i]._command = i === 0 ? Two.Commands.move : Two.Commands.line;
      }

      return this;

    },

    subdivide: function(limit) {
      //TODO: DRYness (function below)
      this._update();

      var last = this.vertices.length - 1;
      var b = this.vertices[last];
      var closed = this._closed || this.vertices[last]._command === Two.Commands.close;
      var points = [];
      _.each(this.vertices, function(a, i) {

        if (i <= 0 && !closed) {
          b = a;
          return;
        }

        if (a.command === Two.Commands.move) {
          points.push(new Two.Anchor(b.x, b.y));
          if (i > 0) {
            points[points.length - 1].command = Two.Commands.line;
          }
          b = a;
          return;
        }

        var verts = getSubdivisions(a, b, limit);
        points = points.concat(verts);

        // Assign commands to all the verts
        _.each(verts, function(v, i) {
          if (i <= 0 && b.command === Two.Commands.move) {
            v.command = Two.Commands.move;
          } else {
            v.command = Two.Commands.line;
          }
        });

        if (i >= last) {

          // TODO: Add check if the two vectors in question are the same values.
          if (this._closed && this._automatic) {

            b = a;

            verts = getSubdivisions(a, b, limit);
            points = points.concat(verts);

            // Assign commands to all the verts
            _.each(verts, function(v, i) {
              if (i <= 0 && b.command === Two.Commands.move) {
                v.command = Two.Commands.move;
              } else {
                v.command = Two.Commands.line;
              }
            });

          } else if (closed) {
            points.push(new Two.Anchor(a.x, a.y));
          }

          points[points.length - 1].command = closed ? Two.Commands.close : Two.Commands.line;

        }

        b = a;

      }, this);

      this._automatic = false;
      this._curved = false;
      this.vertices = points;

      return this;

    },

    _updateLength: function(limit) {
      //TODO: DRYness (function above)
      this._update();

      var last = this.vertices.length - 1;
      var b = this.vertices[last];
      var closed = this._closed || this.vertices[last]._command === Two.Commands.close;
      var sum = 0;

      if (_.isUndefined(this._lengths)) {
        this._lengths = [];
      }

      _.each(this.vertices, function(a, i) {

        if ((i <= 0 && !closed) || a.command === Two.Commands.move) {
          b = a;
          this._lengths[i] = 0;
          return;
        }

        this._lengths[i] = getCurveLength(a, b, limit);
        sum += this._lengths[i];

        if (i >= last && closed) {

          b = a;

          this._lengths[i + 1] = getCurveLength(a, b, limit);
          sum += this._lengths[i + 1];

        }

        b = a;

      }, this);

      this._length = sum;

      return this;

    },

    _update: function() {

      if (this._flagVertices) {

        var l = this.vertices.length;
        var last = l - 1, v;

        // TODO: Should clamp this so that `ia` and `ib`
        // cannot select non-verts.
        var ia = round((this._beginning) * last);
        var ib = round((this._ending) * last);

        this._vertices.length = 0;

        for (var i = ia; i < ib + 1; i++) {
          v = this.vertices[i];
          this._vertices.push(v);
        }

        if (this._automatic) {
          this.plot();
        }

      }

      Two.Shape.prototype._update.apply(this, arguments);

      return this;

    },

    flagReset: function() {

      this._flagVertices =  this._flagFill =  this._flagStroke =
         this._flagLinewidth = this._flagOpacity = this._flagVisible =
         this._flagCap = this._flagJoin = this._flagMiter =
         this._flagClip = false;

      Two.Shape.prototype.flagReset.call(this);

      return this;

    }

  });

  Path.MakeObservable(Path.prototype);

  /**
   * Utility functions
   */

  function getCurveLength(a, b, limit) {
    // TODO: DRYness
    var x1, x2, x3, x4, y1, y2, y3, y4;

    var right = b.controls && b.controls.right;
    var left = a.controls && a.controls.left;

    x1 = b.x;
    y1 = b.y;
    x2 = (right || b).x;
    y2 = (right || b).y;
    x3 = (left || a).x;
    y3 = (left || a).y;
    x4 = a.x;
    y4 = a.y;

    if (right && b._relative) {
      x2 += b.x;
      y2 += b.y;
    }

    if (left && a._relative) {
      x3 += a.x;
      y3 += a.y;
    }

    return Two.Utils.getCurveLength(x1, y1, x2, y2, x3, y3, x4, y4, limit);

  }

  function getSubdivisions(a, b, limit) {
    // TODO: DRYness
    var x1, x2, x3, x4, y1, y2, y3, y4;

    var right = b.controls && b.controls.right;
    var left = a.controls && a.controls.left;

    x1 = b.x;
    y1 = b.y;
    x2 = (right || b).x;
    y2 = (right || b).y;
    x3 = (left || a).x;
    y3 = (left || a).y;
    x4 = a.x;
    y4 = a.y;

    if (right && b._relative) {
      x2 += b.x;
      y2 += b.y;
    }

    if (left && a._relative) {
      x3 += a.x;
      y3 += a.y;
    }

    return Two.Utils.subdivide(x1, y1, x2, y2, x3, y3, x4, y4, limit);

  }

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path;
  var _ = Two.Utils;

  var Line = Two.Line = function(x1, y1, x2, y2) {

    var width = x2 - x1;
    var height = y2 - y1;

    var w2 = width / 2;
    var h2 = height / 2;

    Path.call(this, [
        new Two.Anchor(- w2, - h2),
        new Two.Anchor(w2, h2)
    ]);

    this.translation.set(x1 + w2, y1 + h2);

  };

  _.extend(Line.prototype, Path.prototype);

  Path.MakeObservable(Line.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path;
  var _ = Two.Utils;

  var Rectangle = Two.Rectangle = function(x, y, width, height) {

    Path.call(this, [
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor()
    ], true);

    this.width = width;
    this.height = height;
    this._update();

    this.translation.set(x, y);

  };

  _.extend(Rectangle, {

    Properties: ['width', 'height'],

    MakeObservable: function(obj) {
      Path.MakeObservable(obj);
      _.each(Rectangle.Properties, Two.Utils.defineProperty, obj);
    }

  });

  _.extend(Rectangle.prototype, Path.prototype, {

    _width: 0,
    _height: 0,

    _flagWidth: 0,
    _flagHeight: 0,

    _update: function() {

      if (this._flagWidth || this._flagHeight) {

        var xr = this._width / 2;
        var yr = this._height / 2;

        this.vertices[0].set(-xr, -yr);
        this.vertices[1].set(xr, -yr);
        this.vertices[2].set(xr, yr);
        this.vertices[3].set(-xr, yr);

      }

      Path.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      this._flagWidth = this._flagHeight = false;
      Path.prototype.flagReset.call(this);

      return this;

    }

  });

  Rectangle.MakeObservable(Rectangle.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path, TWO_PI = Math.PI * 2, cos = Math.cos, sin = Math.sin;
  var _ = Two.Utils;

  var Ellipse = Two.Ellipse = function(ox, oy, rx, ry) {

    if (!_.isNumber(ry)) {
      ry = rx;
    }

    var amount = Two.Resolution;

    var points = _.map(_.range(amount), function(i) {
      return new Two.Anchor();
    }, this);

    Path.call(this, points, true, true);

    this.width = rx * 2;
    this.height = ry * 2;

    this._update();
    this.translation.set(ox, oy);

  };

  _.extend(Ellipse, {

    Properties: ['width', 'height'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(Ellipse.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(Ellipse.prototype, Path.prototype, {

    _width: 0,
    _height: 0,

    _flagWidth: false,
    _flagHeight: false,

    _update: function() {

      if (this._flagWidth || this._flagHeight) {
        for (var i = 0, l = this.vertices.length; i < l; i++) {
          var pct = i / l;
          var theta = pct * TWO_PI;
          var x = this._width * cos(theta) / 2;
          var y = this._height * sin(theta) / 2;
          this.vertices[i].set(x, y);
        }
      }

      Path.prototype._update.call(this);
      return this;

    },

    flagReset: function() {

      this._flagWidth = this._flagHeight = false;

      Path.prototype.flagReset.call(this);
      return this;

    }

  });

  Ellipse.MakeObservable(Ellipse.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path, TWO_PI = Math.PI * 2, cos = Math.cos, sin = Math.sin;
  var _ = Two.Utils;

  var Circle = Two.Circle = function(ox, oy, r) {

    var amount = Two.Resolution;

    var points = _.map(_.range(amount), function(i) {
      return new Two.Anchor();
    }, this);

    Path.call(this, points, true, true);

    this.radius = r;

    this._update();
    this.translation.set(ox, oy);

  };

  _.extend(Circle, {

    Properties: ['radius'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(Circle.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(Circle.prototype, Path.prototype, {

    _radius: 0,
    _flagRadius: false,

    _update: function() {

      if (this._flagRadius) {
        for (var i = 0, l = this.vertices.length; i < l; i++) {
          var pct = i / l;
          var theta = pct * TWO_PI;
          var x = this._radius * cos(theta);
          var y = this._radius * sin(theta);
          this.vertices[i].set(x, y);
        }
      }

      Path.prototype._update.call(this);
      return this;

    },

    flagReset: function() {

      this._flagRadius = false;

      Path.prototype.flagReset.call(this);
      return this;

    }

  });

  Circle.MakeObservable(Circle.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path, TWO_PI = Math.PI * 2, cos = Math.cos, sin = Math.sin;
  var _ = Two.Utils;

  var Polygon = Two.Polygon = function(ox, oy, r, sides) {

    sides = Math.max(sides || 0, 3);

    var points = _.map(_.range(sides), function(i) {
      return new Two.Anchor();
    });

    Path.call(this, points, true);

    this.width = r * 2;
    this.height = r * 2;
    this.sides = sides;

    this._update();
    this.translation.set(ox, oy);

  };

  _.extend(Polygon, {

    Properties: ['width', 'height', 'sides'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(Polygon.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(Polygon.prototype, Path.prototype, {

    _width: 0,
    _height: 0,
    _sides: 0,

    _flagWidth: false,
    _flagHeight: false,
    _flagSides: false,

    _update: function() {

      if (this._flagWidth || this._flagHeight || this._flagSides) {

        var sides = this._sides;
        var amount = this.vertices.length;

        if (amount > sides) {
          this.vertices.splice(sides - 1, amount - sides);
        }

        for (var i = 0; i < sides; i++) {

          var pct = (i + 0.5) / sides;
          var theta = TWO_PI * pct + Math.PI / 2;
          var x = this._width * cos(theta);
          var y = this._height * sin(theta);

          if (i >= amount) {
            this.vertices.push(new Two.Anchor(x, y));
          } else {
            this.vertices[i].set(x, y);
          }

        }

      }

      Path.prototype._update.call(this);
      return this;

    },

    flagReset: function() {

      this._flagWidth = this._flagHeight = this._flagSides = false;
      Path.prototype.flagReset.call(this);

      return this;

    }

  });

  Polygon.MakeObservable(Polygon.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path, PI = Math.PI, TWO_PI = Math.PI * 2, HALF_PI = Math.PI / 2,
    cos = Math.cos, sin = Math.sin, abs = Math.abs, _ = Two.Utils;

  var ArcSegment = Two.ArcSegment = function(ox, oy, ir, or, sa, ea, res) {

    var points = _.map(_.range(res || (Two.Resolution * 3)), function() {
      return new Two.Anchor();
    });

    Path.call(this, points, false, false, true);

    this.innerRadius = ir;
    this.outerRadius = or;

    this.startAngle = sa;
    this.endAngle = ea;

    this._update();
    this.translation.set(ox, oy);

  }

  _.extend(ArcSegment, {

    Properties: ['startAngle', 'endAngle', 'innerRadius', 'outerRadius'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(ArcSegment.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(ArcSegment.prototype, Path.prototype, {

    _flagStartAngle: false,
    _flagEndAngle: false,
    _flagInnerRadius: false,
    _flagOuterRadius: false,

    _startAngle: 0,
    _endAngle: TWO_PI,
    _innerRadius: 0,
    _outerRadius: 0,

    _update: function() {

      if (this._flagStartAngle || this._flagEndAngle || this._flagInnerRadius
        || this._flagOuterRadius) {

        var sa = this._startAngle;
        var ea = this._endAngle;

        var ir = this._innerRadius;
        var or = this._outerRadius;

        var connected = mod(sa, TWO_PI) === mod(ea, TWO_PI);
        var punctured = ir > 0;

        var vertices = this.vertices;
        var length = (punctured ? vertices.length / 2 : vertices.length);
        var command, id = 0;

        if (connected) {
          length--;
        } else if (!punctured) {
          length -= 2;
        }

        /**
         * Outer Circle
         */
        for (var i = 0, last = length - 1; i < length; i++) {

          var pct = i / last;
          var v = vertices[id];
          var theta = pct * (ea - sa) + sa;
          var step = (ea - sa) / length;

          var x = or * Math.cos(theta);
          var y = or * Math.sin(theta);

          switch (i) {
            case 0:
              command = Two.Commands.move;
              break;
            default:
              command = Two.Commands.curve;
          }

          v.command = command;
          v.x = x;
          v.y = y;
          v.controls.left.clear();
          v.controls.right.clear();

          if (v.command === Two.Commands.curve) {
            var amp = or * step / Math.PI;
            v.controls.left.x = amp * Math.cos(theta - HALF_PI);
            v.controls.left.y = amp * Math.sin(theta - HALF_PI);
            v.controls.right.x = amp * Math.cos(theta + HALF_PI);
            v.controls.right.y = amp * Math.sin(theta + HALF_PI);
            if (i === 1) {
              v.controls.left.multiplyScalar(2);
            }
            if (i === last) {
              v.controls.right.multiplyScalar(2);
            }
          }

          id++;

        }

        if (punctured) {

          if (connected) {
            vertices[id].command = Two.Commands.close;
            id++;
          } else {
            length--;
            last = length - 1;
          }

          /**
           * Inner Circle
           */
          for (i = 0; i < length; i++) {

            pct = i / last;
            v = vertices[id];
            theta = (1 - pct) * (ea - sa) + sa;
            step = (ea - sa) / length;

            x = ir * Math.cos(theta);
            y = ir * Math.sin(theta);
            command = Two.Commands.curve;
            if (i <= 0) {
              command = connected ? Two.Commands.move : Two.Commands.line;
            }

            v.command = command;
            v.x = x;
            v.y = y;
            v.controls.left.clear();
            v.controls.right.clear();

            if (v.command === Two.Commands.curve) {
              amp = ir * step / Math.PI;
              v.controls.left.x = amp * Math.cos(theta + HALF_PI);
              v.controls.left.y = amp * Math.sin(theta + HALF_PI);
              v.controls.right.x = amp * Math.cos(theta - HALF_PI);
              v.controls.right.y = amp * Math.sin(theta - HALF_PI);
              if (i === 1) {
                v.controls.left.multiplyScalar(2);
              }
              if (i === last) {
                v.controls.right.multiplyScalar(2);
              }
            }

            id++;

          }

        } else if (!connected) {

          vertices[id].command = Two.Commands.line;
          vertices[id].x = 0;
          vertices[id].y = 0;
          id++;

        }

        /**
         * Final Point
         */
        vertices[id].command = Two.Commands.close;

      }

      Path.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      Path.prototype.flagReset.call(this);

      this._flagStartAngle = this._flagEndAngle
        = this._flagInnerRadius = this._flagOuterRadius = false;

      return this;

    }

  });

  ArcSegment.MakeObservable(ArcSegment.prototype);

  function mod(v, l) {
    while (v < 0) {
      v += l;
    }
    return v % l;
  }

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path, TWO_PI = Math.PI * 2, cos = Math.cos, sin = Math.sin;
  var _ = Two.Utils;

  var Star = Two.Star = function(ox, oy, or, ir, sides) {

    if (!_.isNumber(ir)) {
      ir = or / 2;
    }

    if (!_.isNumber(sides) || sides <= 0) {
      sides = 5;
    }

    var length = sides * 2;

    var points = _.map(_.range(length), function(i) {
      return new Two.Anchor();
    });

    Path.call(this, points, true);

    this.innerRadius = ir;
    this.outerRadius = or;
    this.sides = sides;

    this._update();
    this.translation.set(ox, oy);

  };

  _.extend(Star, {

    Properties: ['innerRadius', 'outerRadius', 'sides'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(Star.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(Star.prototype, Path.prototype, {

    _innerRadius: 0,
    _outerRadius: 0,
    _sides: 0,

    _flagInnerRadius: false,
    _flagOuterRadius: false,
    _flagSides: false,

    _update: function() {

      if (this._flagInnerRadius || this._flagOuterRadius || this._flagSides) {

        var sides = this._sides * 2;
        var amount = this.vertices.length;

        if (amount > sides) {
          this.vertices.splice(sides - 1, amount - sides);
        }

        for (var i = 0; i < sides; i++) {

          var pct = (i + 0.5) / sides;
          var theta = TWO_PI * pct;
          var r = (i % 2 ? this._innerRadius : this._outerRadius);
          var x = r * cos(theta);
          var y = r * sin(theta);

          if (i >= amount) {
            this.vertices.push(new Two.Anchor(x, y));
          } else {
            this.vertices[i].set(x, y);
          }

        }

      }

      Path.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      this._flagInnerRadius = this._flagOuterRadius = this._flagSides = false;
      Path.prototype.flagReset.call(this);

      return this;

    }

  });

  Star.MakeObservable(Star.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var Path = Two.Path;
  var _ = Two.Utils;

  var RoundedRectangle = Two.RoundedRectangle = function(ox, oy, width, height, radius) {

    if (!_.isNumber(radius)) {
      radius = Math.floor(Math.min(width, height) / 12);
    }

    var amount = 10;

    var points = _.map(_.range(amount), function(i) {
      return new Two.Anchor(0, 0, 0, 0, 0, 0,
        i === 0 ? Two.Commands.move : Two.Commands.curve);
    });

    points[points.length - 1].command = Two.Commands.close;

    Path.call(this, points, false, false, true);

    this.width = width;
    this.height = height;
    this.radius = radius;

    this._update();
    this.translation.set(ox, oy);

  };

  _.extend(RoundedRectangle, {

    Properties: ['width', 'height', 'radius'],

    MakeObservable: function(obj) {

      Path.MakeObservable(obj);
      _.each(RoundedRectangle.Properties, Two.Utils.defineProperty, obj);

    }

  });

  _.extend(RoundedRectangle.prototype, Path.prototype, {

    _width: 0,
    _height: 0,
    _radius: 0,

    _flagWidth: false,
    _flagHeight: false,
    _flagRadius: false,

    _update: function() {

      if (this._flagWidth || this._flagHeight || this._flagRadius) {

        var width = this._width;
        var height = this._height;
        var radius = Math.min(Math.max(this._radius, 0),
          Math.min(width, height));

        var v;
        var w = width / 2;
        var h = height / 2;

        v = this.vertices[0];
        v.x = - (w - radius);
        v.y = - h;

        // Upper Right Corner

        v = this.vertices[1];
        v.x = (w - radius);
        v.y = - h;
        v.controls.left.clear();
        v.controls.right.x = radius;
        v.controls.right.y = 0;

        v = this.vertices[2];
        v.x = w;
        v.y = - (h - radius);
        v.controls.right.clear();
        v.controls.left.clear();

        // Bottom Right Corner

        v = this.vertices[3];
        v.x = w;
        v.y = (h - radius);
        v.controls.left.clear();
        v.controls.right.x = 0;
        v.controls.right.y = radius;

        v = this.vertices[4];
        v.x = (w - radius);
        v.y = h;
        v.controls.right.clear();
        v.controls.left.clear();

        // Bottom Left Corner

        v = this.vertices[5];
        v.x = - (w - radius);
        v.y = h;
        v.controls.left.clear();
        v.controls.right.x = - radius;
        v.controls.right.y = 0;

        v = this.vertices[6];
        v.x = - w;
        v.y = (h - radius);
        v.controls.left.clear();
        v.controls.right.clear();

        // Upper Left Corner

        v = this.vertices[7];
        v.x = - w;
        v.y = - (h - radius);
        v.controls.left.clear();
        v.controls.right.x = 0;
        v.controls.right.y = - radius;

        v = this.vertices[8];
        v.x = - (w - radius);
        v.y = - h;
        v.controls.left.clear();
        v.controls.right.clear();

        v = this.vertices[9];
        v.copy(this.vertices[8]);

      }

      Path.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      this._flagWidth = this._flagHeight = this._flagRadius = false;
      Path.prototype.flagReset.call(this);

      return this;

    }

  });

  RoundedRectangle.MakeObservable(RoundedRectangle.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var root = Two.root;
  var getComputedMatrix = Two.Utils.getComputedMatrix;
  var _ = Two.Utils;

  var canvas = (root.document ? root.document.createElement('canvas') : { getContext: _.identity });
  var ctx = canvas.getContext('2d');

  var Text = Two.Text = function(message, x, y, styles) {

    Two.Shape.call(this);

    this._renderer.type = 'text';
    this._renderer.flagFill = _.bind(Text.FlagFill, this);
    this._renderer.flagStroke = _.bind(Text.FlagStroke, this);

    this.value = message;

    if (_.isNumber(x)) {
        this.translation.x = x;
    }
    if (_.isNumber(y)) {
        this.translation.y = y;
    }

    if (!_.isObject(styles)) {
      return this;
    }

    _.each(Two.Text.Properties, function(property) {

      if (property in styles) {
        this[property] = styles[property];
      }

    }, this);

  };

  _.extend(Two.Text, {

    Properties: [
      'value', 'family', 'size', 'leading', 'alignment', 'linewidth', 'style',
      'weight', 'decoration', 'baseline', 'opacity', 'visible', 'fill', 'stroke'
    ],

    FlagFill: function() {
      this._flagFill = true;
    },

    FlagStroke: function() {
      this._flagStroke = true;
    },

    MakeObservable: function(object) {

      Two.Shape.MakeObservable(object);

      _.each(Two.Text.Properties.slice(0, 12), Two.Utils.defineProperty, object);

      Object.defineProperty(object, 'fill', {
        enumerable: true,
        get: function() {
          return this._fill;
        },
        set: function(f) {

          if (this._fill instanceof Two.Gradient
            || this._fill instanceof Two.LinearGradient
            || this._fill instanceof Two.RadialGradient
            || this._fill instanceof Two.Texture) {
            this._fill.unbind(Two.Events.change, this._renderer.flagFill);
          }

          this._fill = f;
          this._flagFill = true;

          if (this._fill instanceof Two.Gradient
            || this._fill instanceof Two.LinearGradient
            || this._fill instanceof Two.RadialGradient
            || this._fill instanceof Two.Texture) {
            this._fill.bind(Two.Events.change, this._renderer.flagFill);
          }

        }
      });

      Object.defineProperty(object, 'stroke', {
        enumerable: true,
        get: function() {
          return this._stroke;
        },
        set: function(f) {

          if (this._stroke instanceof Two.Gradient
            || this._stroke instanceof Two.LinearGradient
            || this._stroke instanceof Two.RadialGradient
            || this._stroke instanceof Two.Texture) {
            this._stroke.unbind(Two.Events.change, this._renderer.flagStroke);
          }

          this._stroke = f;
          this._flagStroke = true;

          if (this._stroke instanceof Two.Gradient
            || this._stroke instanceof Two.LinearGradient
            || this._stroke instanceof Two.RadialGradient
            || this._stroke instanceof Two.Texture) {
            this._stroke.bind(Two.Events.change, this._renderer.flagStroke);
          }

        }
      });

      Object.defineProperty(object, 'clip', {
        enumerable: true,
        get: function() {
          return this._clip;
        },
        set: function(v) {
          this._clip = v;
          this._flagClip = true;
        }
      });

    }

  });

  _.extend(Two.Text.prototype, Two.Shape.prototype, {

    // Flags
    // http://en.wikipedia.org/wiki/Flag

    _flagValue: true,
    _flagFamily: true,
    _flagSize: true,
    _flagLeading: true,
    _flagAlignment: true,
    _flagBaseline: true,
    _flagStyle: true,
    _flagWeight: true,
    _flagDecoration: true,

    _flagFill: true,
    _flagStroke: true,
    _flagLinewidth: true,
    _flagOpacity: true,
    _flagVisible: true,

    _flagClip: false,

    // Underlying Properties

    _value: '',
    _family: 'sans-serif',
    _size: 13,
    _leading: 17,
    _alignment: 'center',
    _baseline: 'middle',
    _style: 'normal',
    _weight: 500,
    _decoration: 'none',

    _fill: '#000',
    _stroke: 'transparent',
    _linewidth: 1,
    _opacity: 1,
    _visible: true,

    _clip: false,

    remove: function() {

      if (!this.parent) {
        return this;
      }

      this.parent.remove(this);

      return this;

    },

    clone: function(parent) {

      var parent = parent || this.parent;

      var clone = new Two.Text(this.value);
      clone.translation.copy(this.translation);
      clone.rotation = this.rotation;
      clone.scale = this.scale;

      _.each(Two.Text.Properties, function(property) {
        clone[property] = this[property];
      }, this);

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    toObject: function() {

      var result = {
        translation: this.translation.toObject(),
        rotation: this.rotation,
        scale: this.scale
      };

      _.each(Two.Text.Properties, function(property) {
        result[property] = this[property];
      }, this);

      return result;

    },

    noStroke: function() {
      this.stroke = 'transparent';
      return this;
    },

    noFill: function() {
      this.fill = 'transparent';
      return this;
    },

    /**
     * A shim to not break `getBoundingClientRect` calls. TODO: Implement a
     * way to calculate proper bounding boxes of `Two.Text`.
     */
    getBoundingClientRect: function(shallow) {

      var matrix, border, l, x, y, i, v;

      var left = Infinity, right = -Infinity,
          top = Infinity, bottom = -Infinity;

      // TODO: Update this to not __always__ update. Just when it needs to.
      this._update(true);

      matrix = !!shallow ? this._matrix : getComputedMatrix(this);

      v = matrix.multiply(0, 0, 1);

      return {
        top: v.x,
        left: v.y,
        right: v.x,
        bottom: v.y,
        width: 0,
        height: 0
      };

    },

    flagReset: function() {

      this._flagValue = this._flagFamily = this._flagSize =
        this._flagLeading = this._flagAlignment = this._flagFill =
        this._flagStroke = this._flagLinewidth = this._flagOpaicty =
        this._flagVisible = this._flagClip = this._flagDecoration =
        this._flagBaseline = false;

      Two.Shape.prototype.flagReset.call(this);

      return this;

    }

  });

  Two.Text.MakeObservable(Two.Text.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var Stop = Two.Stop = function(offset, color, opacity) {

    this._renderer = {};
    this._renderer.type = 'stop';

    this.offset = _.isNumber(offset) ? offset
      : Stop.Index <= 0 ? 0 : 1;

    this.opacity = _.isNumber(opacity) ? opacity : 1;

    this.color = _.isString(color) ? color
      : Stop.Index <= 0 ? '#fff' : '#000';

    Stop.Index = (Stop.Index + 1) % 2;

  };

  _.extend(Stop, {

    Index: 0,

    Properties: [
      'offset',
      'opacity',
      'color'
    ],

    MakeObservable: function(object) {

      _.each(Stop.Properties, function(property) {

        var object = this;
        var secret = '_' + property;
        var flag = '_flag' + property.charAt(0).toUpperCase() + property.slice(1);

        Object.defineProperty(object, property, {
          enumerable: true,
          get: function() {
            return this[secret];
          },
          set: function(v) {
            this[secret] = v;
            this[flag] = true;
            if (this.parent) {
              this.parent._flagStops = true;
            }
          }
        });

      }, object);

    }

  });

  _.extend(Stop.prototype, Two.Utils.Events, {

    clone: function() {

      var clone = new Stop();

      _.each(Stop.Properties, function(property) {
        clone[property] = this[property];
      }, this);

      return clone;

    },

    toObject: function() {

      var result = {};

      _.each(Stop.Properties, function(k) {
        result[k] = this[k];
      }, this);

      return result;

    },

    flagReset: function() {

      this._flagOffset = this._flagColor = this._flagOpacity = false;

      return this;

    }

  });

  Stop.MakeObservable(Stop.prototype);

  var Gradient = Two.Gradient = function(stops) {

    this._renderer = {};
    this._renderer.type = 'gradient';

    this.id = Two.Identifier + Two.uniqueId();
    this.classList = [];

    this._renderer.flagStops = _.bind(Gradient.FlagStops, this);
    this._renderer.bindStops = _.bind(Gradient.BindStops, this);
    this._renderer.unbindStops = _.bind(Gradient.UnbindStops, this);

    this.spread = 'pad';

    this.stops = stops;

  };

  _.extend(Gradient, {

    Stop: Stop,

    Properties: [
      'spread'
    ],

    MakeObservable: function(object) {

      _.each(Gradient.Properties, Two.Utils.defineProperty, object);

      Object.defineProperty(object, 'stops', {

        enumerable: true,

        get: function() {
          return this._stops;
        },

        set: function(stops) {

          var updateStops = this._renderer.flagStops;
          var bindStops = this._renderer.bindStops;
          var unbindStops = this._renderer.unbindStops;

          // Remove previous listeners
          if (this._stops) {
            this._stops
              .unbind(Two.Events.insert, bindStops)
              .unbind(Two.Events.remove, unbindStops);
          }

          // Create new Collection with copy of Stops
          this._stops = new Two.Utils.Collection((stops || []).slice(0));

          // Listen for Collection changes and bind / unbind
          this._stops
            .bind(Two.Events.insert, bindStops)
            .bind(Two.Events.remove, unbindStops);

          // Bind Initial Stops
          bindStops(this._stops);

        }

      });

    },

    FlagStops: function() {
      this._flagStops = true;
    },

    BindStops: function(items) {

      // This function is called a lot
      // when importing a large SVG
      var i = items.length;
      while(i--) {
        items[i].bind(Two.Events.change, this._renderer.flagStops);
        items[i].parent = this;
      }

      this._renderer.flagStops();

    },

    UnbindStops: function(items) {

      var i = items.length;
      while(i--) {
        items[i].unbind(Two.Events.change, this._renderer.flagStops);
        delete items[i].parent;
      }

      this._renderer.flagStops();

    }

  });

  _.extend(Gradient.prototype, Two.Utils.Events, {

    _flagStops: false,
    _flagSpread: false,

    clone: function(parent) {

      parent = parent || this.parent;

      var stops = _.map(this.stops, function(s) {
        return s.clone();
      });

      var clone = new Gradient(stops);

      _.each(Two.Gradient.Properties, function(k) {
        clone[k] = this[k];
      }, this);

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    toObject: function() {

      var result = {
        stops: _.map(this.stops, function(s) {
          return s.toObject();
        })
      };

      _.each(Gradient.Properties, function(k) {
        result[k] = this[k];
      }, this);

      return result;

    },

    _update: function() {

      if (this._flagSpread || this._flagStops) {
        this.trigger(Two.Events.change);
      }

      return this;

    },

    flagReset: function() {

      this._flagSpread = this._flagStops = false;

      return this;

    }

  });

  Gradient.MakeObservable(Gradient.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var LinearGradient = Two.LinearGradient = function(x1, y1, x2, y2, stops) {

    Two.Gradient.call(this, stops);

    this._renderer.type = 'linear-gradient';

    var flagEndPoints = _.bind(LinearGradient.FlagEndPoints, this);
    this.left = new Two.Vector().bind(Two.Events.change, flagEndPoints);
    this.right = new Two.Vector().bind(Two.Events.change, flagEndPoints);

    if (_.isNumber(x1)) {
      this.left.x = x1;
    }
    if (_.isNumber(y1)) {
      this.left.y = y1;
    }
    if (_.isNumber(x2)) {
      this.right.x = x2;
    }
    if (_.isNumber(y2)) {
      this.right.y = y2;
    }

  };

  _.extend(LinearGradient, {

    Stop: Two.Gradient.Stop,

    MakeObservable: function(object) {
      Two.Gradient.MakeObservable(object);
    },

    FlagEndPoints: function() {
      this._flagEndPoints = true;
    }

  });

  _.extend(LinearGradient.prototype, Two.Gradient.prototype, {

    _flagEndPoints: false,

    clone: function(parent) {

      parent = parent || this.parent;

      var stops = _.map(this.stops, function(stop) {
        return stop.clone();
      });

      var clone = new LinearGradient(this.left._x, this.left._y,
        this.right._x, this.right._y, stops);

      _.each(Two.Gradient.Properties, function(k) {
        clone[k] = this[k];
      }, this);

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    toObject: function() {

      var result = Two.Gradient.prototype.toObject.call(this);

      result.left = this.left.toObject();
      result.right = this.right.toObject();

      return result;

    },

    _update: function() {

      if (this._flagEndPoints || this._flagSpread || this._flagStops) {
        this.trigger(Two.Events.change);
      }

      return this;

    },

    flagReset: function() {

      this._flagEndPoints = false;

      Two.Gradient.prototype.flagReset.call(this);

      return this;

    }

  });

  LinearGradient.MakeObservable(LinearGradient.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;

  var RadialGradient = Two.RadialGradient = function(cx, cy, r, stops, fx, fy) {

    Two.Gradient.call(this, stops);

    this._renderer.type = 'radial-gradient';

    this.center = new Two.Vector()
      .bind(Two.Events.change, _.bind(function() {
        this._flagCenter = true;
      }, this));

    this.radius = _.isNumber(r) ? r : 20;

    this.focal = new Two.Vector()
      .bind(Two.Events.change, _.bind(function() {
        this._flagFocal = true;
      }, this));

    if (_.isNumber(cx)) {
      this.center.x = cx;
    }
    if (_.isNumber(cy)) {
      this.center.y = cy;
    }

    this.focal.copy(this.center);

    if (_.isNumber(fx)) {
      this.focal.x = fx;
    }
    if (_.isNumber(fy)) {
      this.focal.y = fy;
    }

  };

  _.extend(RadialGradient, {

    Stop: Two.Gradient.Stop,

    Properties: [
      'radius'
    ],

    MakeObservable: function(object) {

      Two.Gradient.MakeObservable(object);

      _.each(RadialGradient.Properties, Two.Utils.defineProperty, object);

    }

  });

  _.extend(RadialGradient.prototype, Two.Gradient.prototype, {

    _flagRadius: false,
    _flagCenter: false,
    _flagFocal: false,

    clone: function(parent) {

      parent = parent || this.parent;

      var stops = _.map(this.stops, function(stop) {
        return stop.clone();
      });

      var clone = new RadialGradient(this.center._x, this.center._y,
          this._radius, stops, this.focal._x, this.focal._y);

      _.each(Two.Gradient.Properties.concat(RadialGradient.Properties), function(k) {
        clone[k] = this[k];
      }, this);

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    toObject: function() {

      var result = Two.Gradient.prototype.toObject.call(this);

      _.each(RadialGradient.Properties, function(k) {
        result[k] = this[k];
      }, this);

      result.center = this.center.toObject();
      result.focal = this.focal.toObject();

      return result;

    },

    _update: function() {

      if (this._flagRadius || this._flatCenter || this._flagFocal
        || this._flagSpread || this._flagStops) {
        this.trigger(Two.Events.change);
      }

      return this;

    },

    flagReset: function() {

      this._flagRadius = this._flagCenter = this._flagFocal = false;

      Two.Gradient.prototype.flagReset.call(this);

      return this;

    }

  });

  RadialGradient.MakeObservable(RadialGradient.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;
  var regex = {
    video: /\.(mp4|webm)$/i,
    image: /\.(jpe?g|png|gif|tiff)$/i
  };

  var Texture = Two.Texture = function(src, callback) {

    this._renderer = {};
    this._renderer.type = 'texture';
    this._renderer.flagOffset = _.bind(Texture.FlagOffset, this);
    this._renderer.flagScale = _.bind(Texture.FlagScale, this);

    this.id = Two.Identifier + Two.uniqueId();
    this.classList = [];

    this.offset = new Two.Vector();

    if (_.isFunction(callback)) {
      var loaded = _.bind(function() {
        this.unbind(Two.Events.load, loaded);
        if (_.isFunction(callback)) {
          callback();
        }
      }, this);
      this.bind(Two.Events.load, loaded);
    }

    if (_.isString(src)) {
      this.src = src;
    } else if (_.isElement(src)) {
      this.image = src;
    }

    this._update();

  };

  _.extend(Texture, {

    Properties: [
      'src',
      'image',
      'loaded',
      'repeat'
    ],

    ImageRegistry: new Two.Registry(),

    getImage: function(src) {

      if (Texture.ImageRegistry.contains(src)) {
        return Texture.ImageRegistry.get(src);
      }

      var image;

      if (regex.video.test(src)) {
        image = document.createElement('video');
      } else {
        image = document.createElement('img');
      }

      image.crossOrigin = 'anonymous';

      return image;

    },

    Register: {
      canvas: function(texture, callback) {
        texture._src = '#' + texture.id;
        Texture.ImageRegistry.add(texture.src, texture.image);
        if (_.isFunction(callback)) {
          callback();
        }
      },
      img: function(texture, callback) {

        var loaded = function(e) {
          texture.image.removeEventListener('load', loaded, false);
          texture.image.removeEventListener('error', error, false);
          if (_.isFunction(callback)) {
            callback();
          }
        };
        var error = function(e) {
          texture.image.removeEventListener('load', loaded, false);
          texture.image.removeEventListener('error', error, false);
          throw new Two.Utils.Error('unable to load ' + texture.src);
        };

        texture.image.addEventListener('load', loaded, false);
        texture.image.addEventListener('error', error, false);
        texture.image.setAttribute('two-src', texture.src);
        Texture.ImageRegistry.add(texture.src, texture.image);
        texture.image.src = texture.src;

      },
      video: function(texture, callback) {

        var loaded = function(e) {
          texture.image.removeEventListener('load', loaded, false);
          texture.image.removeEventListener('error', error, false);
          texture.image.width = texture.image.videoWidth;
          texture.image.height = texture.image.videoHeight;
          texture.image.play();
          if (_.isFunction(callback)) {
            callback();
          }
        };
        var error = function(e) {
          texture.image.removeEventListener('load', loaded, false);
          texture.image.removeEventListener('error', error, false);
          throw new Two.Utils.Error('unable to load ' + texture.src);
        };

        texture.image.addEventListener('canplaythrough', loaded, false);
        texture.image.addEventListener('error', error, false);
        texture.image.setAttribute('two-src', texture.src);
        Texture.ImageRegistry.add(texture.src, texture.image);
        texture.image.src = texture.src;
        texture.image.loop = true;
        texture.image.load();

      }
    },

    load: function(texture, callback) {

      var src = texture.src;
      var image = texture.image;
      var tag = image && image.nodeName.toLowerCase();

      if (texture._flagImage) {
        if (/canvas/i.test(tag)) {
          Texture.Register.canvas(texture, callback);
        } else {
          texture._src = image.getAttribute('two-src') || image.src;
          Texture.Register[tag](texture, callback);
        }
      }

      if (texture._flagSrc) {
        if (!image) {
          texture.image = Texture.getImage(texture.src);
        }
        tag = texture.image.nodeName.toLowerCase();
        Texture.Register[tag](texture, callback);
      }

    },

    FlagOffset: function() {
      this._flagOffset = true;
    },

    FlagScale: function() {
      this._flagScale = true;
    },

    MakeObservable: function(object) {

      _.each(Texture.Properties, Two.Utils.defineProperty, object);

      Object.defineProperty(object, 'offset', {
        enumerable: true,
        get: function() {
          return this._offset;
        },
        set: function(v) {
          if (this._offset) {
            this._offset.unbind(Two.Events.change, this._renderer.flagOffset);
          }
          this._offset = v;
          this._offset.bind(Two.Events.change, this._renderer.flagOffset);
          this._flagOffset = true;
        }
      });

      Object.defineProperty(object, 'scale', {
        enumerable: true,
        get: function() {
          return this._scale;
        },
        set: function(v) {

          if (this._scale instanceof Two.Vector) {
            this._scale.unbind(Two.Events.change, this._renderer.flagScale);
          }

          this._scale = v;

          if (this._scale instanceof Two.Vector) {
            this._scale.bind(Two.Events.change, this._renderer.flagScale);
          }

          this._flagScale = true;

        }
      });

    }

  });

  _.extend(Texture.prototype, Two.Utils.Events, Two.Shape.prototype, {

    _flagSrc: false,
    _flagImage: false,
    _flagLoaded: false,
    _flagRepeat: false,

    _flagOffset: false,
    _flagScale: false,

    _src: '',
    _image: null,
    _loaded: false,
    _repeat: 'no-repeat',

    _scale: 1,
    _offset: null,

    clone: function() {
      return new Texture(this.src);
    },

    toObject: function() {
      return {
        src: this.src,
        image: this.image
      }
    },

    _update: function() {

      if (this._flagSrc || this._flagImage) {
        this.trigger(Two.Events.change);
        this.loaded = false;
        Texture.load(this, _.bind(function() {
          this.loaded = true;
          this
            .trigger(Two.Events.change)
            .trigger(Two.Events.load);
        }, this));
      }

      if (this.image.readyState >= 4) {
        this._flagImage = true;
      }

      return this;

    },

    flagReset: function() {

      this._flagSrc = this._flagImage = this._flagLoaded
        = this._flagScale = this._flagOffset = false;

      return this;

    }

  });

  Texture.MakeObservable(Texture.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;
  var Path = Two.Path;
  var Rectangle = Two.Rectangle;

  var Sprite = Two.Sprite = function(path, ox, oy, cols, rows, frameRate) {

    Path.call(this, [
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor()
    ], true);

    this.noStroke();
    this.noFill();

    if (path instanceof Two.Texture) {
      this.texture = path;
    } else if (_.isString(path)) {
      this.texture = new Two.Texture(path);
    }

    this._update();
    this.translation.set(ox || 0, oy || 0);

    if (_.isNumber(cols)) {
      this.columns = cols;
    }
    if (_.isNumber(rows)) {
      this.rows = rows;
    }
    if (_.isNumber(frameRate)) {
      this.frameRate = frameRate;
    }

  };

  _.extend(Sprite, {

    Properties: [
      'texture', 'columns', 'rows', 'frameRate'
    ],

    MakeObservable: function(obj) {

      Rectangle.MakeObservable(obj);
      _.each(Sprite.Properties, Two.Utils.defineProperty, obj);

    }

  })

  _.extend(Sprite.prototype, Rectangle.prototype, {

    _flagTexture: false,
    _flagColumns: false,
    _flagRows: false,
    _flagFrameRate: false,

    // Private variables
    _amount: 1,
    _duration: 0,
    _index: 0,
    _startTime: 0,
    _playing: false,
    _firstFrame: 0,
    _lastFrame: 0,
    _loop: true,

    // Exposed through getter-setter
    _texture: null,
    _columns: 1,
    _rows: 1,
    _frameRate: 0,

    play: function(firstFrame, lastFrame, onLastFrame) {

      this._playing = true;
      this._firstFrame = 0;
      this._lastFrame = this.amount - 1;
      this._startTime = _.performance.now();

      if (_.isNumber(firstFrame)) {
        this._firstFrame = firstFrame;
      }
      if (_.isNumber(lastFrame)) {
        this._lastFrame = lastFrame;
      }
      if (_.isFunction(onLastFrame)) {
        this._onLastFrame = onLastFrame;
      } else {
        delete this._onLastFrame;
      }

      return this;

    },

    pause: function() {

      this._playing = false;
      return this;

    },

    stop: function() {

      this._playing = false;
      this._index = 0;

      return this;

    },

    clone: function(parent) {

      parent = parent || this.parent;

      var clone = new Sprite(
        this.texture, this.translation.x, this.translation.y,
        this.columns, this.rows, this.frameRate
      );

      if (this.playing) {
        clone.play(this._firstFrame, this._lastFrame);
        clone._loop = this._loop;
      }

      if (parent) {
        parent.add(clone);
      }

      return clone;

    },

    _update: function() {

      var effect = this._texture;
      var cols = this._columns;
      var rows = this._rows;

      var width, height, elapsed, amount, duration;
      var index, iw, ih, isRange;

      if (this._flagColumns || this._flagRows) {
        this._amount = this._columns * this._rows;
      }

      if (this._flagFrameRate) {
        this._duration = 1000 * this._amount / this._frameRate;
      }

      if (this._flagTexture) {
        this.fill = this._texture;
      }

      if (this._texture.loaded) {

        iw = effect.image.width;
        ih = effect.image.height;

        width = iw / cols;
        height = ih / rows;
        amount = this._amount;

        if (this.width !== width) {
          this.width = width;
        }
        if (this.height !== height) {
          this.height = height;
        }

        if (this._playing && this._frameRate > 0) {

          if (_.isNaN(this._lastFrame)) {
            this._lastFrame = amount - 1;
          }

          // TODO: Offload perf logic to instance of `Two`.
          elapsed = _.performance.now() - this._startTime;
          duration = 1000 * (this._lastFrame - this._firstFrame)
            / this._frameRate;

          if (this._loop) {
            elapsed = elapsed % duration;
          } else {
            elapsed = Math.min(elapsed, duration);
          }

          index = _.lerp(this._firstFrame, this._lastFrame, elapsed / duration);
          index = Math.floor(index);

          if (index !== this._index) {
            this._index = index;
            if (index >= this._lastFrame - 1 && this._onLastFrame) {
              this._onLastFrame();  // Shortcut for chainable sprite animations
            }
          }

        }

        var ox = (iw - width) / 2 + width * ((this._index % cols) + 1);
        var oy = height * Math.floor((this._index / cols))
          - (ih - height) / 2;

        // TODO: Improve performance
        if (ox !== effect.offset.x) {
          effect.offset.x = ox;
        }
        if (oy !== effect.offset.y) {
          effect.offset.y = oy;
        }

      }

      Rectangle.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      this._flagTexture = this._flagColumns = this._flagRows
        = this._flagFrameRate = false;

      Rectangle.prototype.flagReset.call(this);

      return this;
    }


  });

  Sprite.MakeObservable(Sprite.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  var _ = Two.Utils;
  var Path = Two.Path;
  var Rectangle = Two.Rectangle;

  var ImageSequence = Two.ImageSequence = function(paths, ox, oy, frameRate) {

    Path.call(this, [
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor(),
      new Two.Anchor()
    ], true);

    this._renderer.flagTextures = _.bind(ImageSequence.FlagTextures, this);
    this._renderer.bindTextures = _.bind(ImageSequence.BindTextures, this);
    this._renderer.unbindTextures = _.bind(ImageSequence.UnbindTextures, this);

    this.noStroke();
    this.noFill();

    this.textures = _.map(paths, ImageSequence.GenerateTexture, this);

    this._update();
    this.translation.set(ox || 0, oy || 0);

    if (_.isNumber(frameRate)) {
      this.frameRate = frameRate;
    } else {
      this.frameRate = ImageSequence.DefaultFrameRate;
    }

  };

  _.extend(ImageSequence, {

    Properties: [
      'frameRate'
    ],

    DefaultFrameRate: 30,

    FlagTextures: function() {
      this._flagTextures = true;
    },

    BindTextures: function(items) {

      var i = items.length;
      while (i--) {
        items[i].bind(Two.Events.change, this._renderer.flagTextures);
      }

      this._renderer.flagTextures();

    },

    UnbindTextures: function(items) {

      var i = items.length;
      while (i--) {
        items[i].unbind(Two.Events.change, this._renderer.flagTextures);
      }

      this._renderer.flagTextures();

    },

    MakeObservable: function(obj) {

      Rectangle.MakeObservable(obj);
      _.each(ImageSequence.Properties, Two.Utils.defineProperty, obj);

      Object.defineProperty(obj, 'textures', {

        enumerable: true,

        get: function() {
          return this._textures;
        },

        set: function(textures) {

          var updateTextures = this._renderer.flagTextures;
          var bindTextures = this._renderer.bindTextures;
          var unbindTextures = this._renderer.unbindTextures;

          // Remove previous listeners
          if (this._textures) {
            this._textures
              .unbind(Two.Events.insert, bindTextures)
              .unbind(Two.Events.remove, unbindTextures);
          }

          // Create new Collection with copy of vertices
          this._textures = new Two.Utils.Collection((textures || []).slice(0));

          // Listen for Collection changes and bind / unbind
          this._textures
            .bind(Two.Events.insert, bindTextures)
            .bind(Two.Events.remove, unbindTextures);

          // Bind Initial Textures
          bindTextures(this._textures);

        }

      });

    },

    GenerateTexture: function(obj) {
      if (obj instanceof Two.Texture) {
        return obj;
      } else if (_.isString(obj)) {
        return new Two.Texture(obj);
      }
    }

  });

  _.extend(ImageSequence.prototype, Rectangle.prototype, {

    _flagTextures: false,
    _flagFrameRate: false,

    // Private variables
    _amount: 1,
    _duration: 0,
    _index: 0,
    _startTime: 0,
    _playing: false,
    _firstFrame: 0,
    _lastFrame: 0,
    _loop: true,

    // Exposed through getter-setter
    _textures: null,
    _frameRate: 0,

    play: function(firstFrame, lastFrame, onLastFrame) {

      this._playing = true;
      this._firstFrame = 0;
      this._lastFrame = this.amount - 1;
      this._startTime = _.performance.now();

      if (_.isNumber(firstFrame)) {
        this._firstFrame = firstFrame;
      }
      if (_.isNumber(lastFrame)) {
        this._lastFrame = lastFrame;
      }
      if (_.isFunction(onLastFrame)) {
        this._onLastFrame = onLastFrame;
      } else {
        delete this._onLastFrame;
      }

      return this;

    },

    pause: function() {

      this._playing = false;
      return this;

    },

    stop: function() {

      this._playing = false;
      this._index = 0;

      return this;

    },

    clone: function(parent) {

      parent = parent || this.parent;

      var clone = new ImageSequence(this.textures, this.translation.x,
        this.translation.y, this.frameRate)

        clone._loop = this._loop;

        if (this._playing) {
          clone.play();
        }

        if (parent) {
          parent.add(clone);
        }

        return clone;

    },

    _update: function() {

      var effects = this._textures;
      var width, height, elapsed, amount, duration, texture;
      var index;

      if (this._flagTextures) {
        this._amount = effects.length;
      }

      if (this._flagFrameRate) {
        this._duration = 1000 * this._amount / this._frameRate;
      }

      if (this._playing && this._frameRate > 0) {

        amount = this._amount;

        if (_.isNaN(this._lastFrame)) {
          this._lastFrame = amount - 1;
        }

        // TODO: Offload perf logic to instance of `Two`.
        elapsed = _.performance.now() - this._startTime;
        duration = 1000 * (this._lastFrame - this._firstFrame)
          / this._frameRate;

        if (this._loop) {
          elapsed = elapsed % duration;
        } else {
          elapsed = Math.min(elapsed, duration);
        }

        index = _.lerp(this._firstFrame, this._lastFrame, elapsed / duration);
        index = Math.floor(index);

        if (index !== this._index) {

          this._index = index;
          texture = effects[this._index];

          if (texture.loaded) {

            width = texture.image.width;
            height = texture.image.height;

            if (this.width !== width) {
              this.width = width;
            }
            if (this.height !== height) {
              this.height = height;
            }

            this.fill = texture;

            if (index >= this._lastFrame - 1 && this._onLastFrame) {
              this._onLastFrame();  // Shortcut for chainable sprite animations
            }

          }

        }

      } else if (!(this.fill instanceof Two.Texture)) {

        texture = effects[this._index];

        if (texture.loaded) {

          width = texture.image.width;
          height = texture.image.height;

          if (this.width !== width) {
            this.width = width;
          }
          if (this.height !== height) {
            this.height = height;
          }

          this.fill = texture;

        }

      }

      Rectangle.prototype._update.call(this);

      return this;

    },

    flagReset: function() {

      this._flagTextures = this._flagFrameRate = false;
      Rectangle.prototype.flagReset.call(this);

      return this;

    }

  });

  ImageSequence.MakeObservable(ImageSequence.prototype);

})((typeof global !== 'undefined' ? global : this).Two);

(function(Two) {

  /**
   * Constants
   */
  var min = Math.min, max = Math.max;
  var _ = Two.Utils;

  /**
   * A children collection which is accesible both by index and by object id
   * @constructor
   */
  var Children = function() {

    Two.Utils.Collection.apply(this, arguments);

    Object.defineProperty(this, '_events', {
      value : {},
      enumerable: false
    });

    this.ids = {};

    this.on(Two.Events.insert, this.attach);
    this.on(Two.Events.remove, this.detach);
    Children.prototype.attach.apply(this, arguments);

  };

  Children.prototype = new Two.Utils.Collection();
  Children.prototype.constructor = Children;

  _.extend(Children.prototype, {

    attach: function(children) {
      for (var i = 0; i < children.length; i++) {
        this.ids[children[i].id] = children[i];
      }
      return this;
    },

    detach: function(children) {
      for (var i = 0; i < children.length; i++) {
        delete this.ids[children[i].id];
      }
      return this;
    }

  });

  var Group = Two.Group = function() {

    Two.Shape.call(this, true);

    this._renderer.type = 'group';

    this.additions = [];
    this.subtractions = [];

    this.children = arguments;

  };

  _.extend(Group, {

    Children: Children,

    InsertChildren: function(children) {
      for (var i = 0; i < children.length; i++) {
        replaceParent.call(this, children[i], this);
      }
    },

    RemoveChildren: function(children) {
      for (var i = 0; i < children.length; i++) {
        replaceParent.call(this, children[i]);
      }
    },

    OrderChildren: function(children) {
      this._flagOrder = true;
    },

    MakeObservable: function(object) {

      var properties = Two.Path.Properties.slice(0);
      var oi = _.indexOf(properties, 'opacity');

      if (oi >= 0) {

        properties.splice(oi, 1);

        Object.defineProperty(object, 'opacity', {

          enumerable: true,

          get: function() {
            return this._opacity;
          },

          set: function(v) {
            // Only set flag if there is an actual difference
            this._flagOpacity = (this._opacity != v);
            this._opacity = v;
          }

        });

      }

      Two.Shape.MakeObservable(object);
      Group.MakeGetterSetters(object, properties);

      Object.defineProperty(object, 'children', {

        enumerable: true,

        get: function() {
          return this._children;
        },

        set: function(children) {

          var insertChildren = _.bind(Group.InsertChildren, this);
          var removeChildren = _.bind(Group.RemoveChildren, this);
          var orderChildren = _.bind(Group.OrderChildren, this);

          if (this._children) {
            this._children.unbind();
          }

          this._children = new Children(children);
          this._children.bind(Two.Events.insert, insertChildren);
          this._children.bind(Two.Events.remove, removeChildren);
          this._children.bind(Two.Events.order, orderChildren);

        }

      });

      Object.defineProperty(object, 'mask', {

        enumerable: true,

        get: function() {
          return this._mask;
        },

        set: function(v) {
          this._mask = v;
          this._flagMask = true;
          if (!v.clip) {
            v.clip = true;
          }
        }

      });

    },

    MakeGetterSetters: function(group, properties) {

      if (!_.isArray(properties)) {
        properties = [properties];
      }

      _.each(properties, function(k) {
        Group.MakeGetterSetter(group, k);
      });

    },

    MakeGetterSetter: function(group, k) {

      var secret = '_' + k;

      Object.defineProperty(group, k, {

        enumerable: true,

        get: function() {
          return this[secret];
        },

        set: function(v) {
          this[secret] = v;
          _.each(this.children, function(child) { // Trickle down styles
            child[k] = v;
          });
        }

      });

    }

  });

  _.extend(Group.prototype, Two.Shape.prototype, {

    // Flags
    // http://en.wikipedia.org/wiki/Flag

    _flagAdditions: false,
    _flagSubtractions: false,
    _flagOrder: false,
    _flagOpacity: true,

    _flagMask: false,

    // Underlying Properties

    _fill: '#fff',
    _stroke: '#000',
    _linewidth: 1.0,
    _opacity: 1.0,
    _visible: true,

    _cap: 'round',
    _join: 'round',
    _miter: 4,

    _closed: true,
    _curved: false,
    _automatic: true,
    _beginning: 0,
    _ending: 1.0,

    _mask: null,

    /**
     * TODO: Group has a gotcha in that it's at the moment required to be bound to
     * an instance of two in order to add elements correctly. This needs to
     * be rethought and fixed.
     */
    clone: function(parent) {

      parent = parent || this.parent;

      var group = new Group();
      var children = _.map(this.children, function(child) {
        return child.clone(group);
      });

      group.add(children);

      group.opacity = this.opacity;

      if (this.mask) {
        group.mask = this.mask;
      }

      group.translation.copy(this.translation);
      group.rotation = this.rotation;
      group.scale = this.scale;

      if (parent) {
        parent.add(group);
      }

      return group;

    },

    /**
     * Export the data from the instance of Two.Group into a plain JavaScript
     * object. This also makes all children plain JavaScript objects. Great
     * for turning into JSON and storing in a database.
     */
    toObject: function() {

      var result = {
        children: [],
        translation: this.translation.toObject(),
        rotation: this.rotation,
        scale: this.scale,
        opacity: this.opacity,
        mask: (this.mask ? this.mask.toObject() : null)
      };

      _.each(this.children, function(child, i) {
        result.children[i] = child.toObject();
      }, this);

      return result;

    },

    /**
     * Anchor all children to the upper left hand corner
     * of the group.
     */
    corner: function() {

      var rect = this.getBoundingClientRect(true),
       corner = { x: rect.left, y: rect.top };

      this.children.forEach(function(child) {
        child.translation.subSelf(corner);
      });

      return this;

    },

    /**
     * Anchors all children around the center of the group,
     * effectively placing the shape around the unit circle.
     */
    center: function() {

      var rect = this.getBoundingClientRect(true);

      rect.centroid = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      this.children.forEach(function(child) {
        if (child.isShape) {
          child.translation.subSelf(rect.centroid);
        }
      });

      // this.translation.copy(rect.centroid);

      return this;

    },

    /**
     * Recursively search for id. Returns the first element found.
     * Returns null if none found.
     */
    getById: function (id) {
      var search = function (node, id) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          var i = node.children.length;
          while (i--) {
            var found = search(node.children[i], id);
            if (found) return found;
          }
        }

      };
      return search(this, id) || null;
    },

    /**
     * Recursively search for classes. Returns an array of matching elements.
     * Empty array if none found.
     */
    getByClassName: function (cl) {
      var found = [];
      var search = function (node, cl) {
        if (node.classList.indexOf(cl) != -1) {
          found.push(node);
        } else if (node.children) {
          node.children.forEach(function (child) {
            search(child, cl);
          });
        }
        return found;
      };
      return search(this, cl);
    },

    /**
     * Recursively search for children of a specific type,
     * e.g. Two.Polygon. Pass a reference to this type as the param.
     * Returns an empty array if none found.
     */
    getByType: function(type) {
      var found = [];
      var search = function (node, type) {
        for (var id in node.children) {
          if (node.children[id] instanceof type) {
            found.push(node.children[id]);
          } else if (node.children[id] instanceof Two.Group) {
            search(node.children[id], type);
          }
        }
        return found;
      };
      return search(this, type);
    },

    /**
     * Add objects to the group.
     */
    add: function(objects) {

      // Allow to pass multiple objects either as array or as multiple arguments
      // If it's an array also create copy of it in case we're getting passed
      // a childrens array directly.
      if (!(objects instanceof Array)) {
        objects = _.toArray(arguments);
      } else {
        objects = objects.slice();
      }

      // Add the objects
      for (var i = 0; i < objects.length; i++) {
        if (!(objects[i] && objects[i].id)) continue;
        this.children.push(objects[i]);
      }

      return this;

    },

    /**
     * Remove objects from the group.
     */
    remove: function(objects) {

      var l = arguments.length,
        grandparent = this.parent;

      // Allow to call remove without arguments
      // This will detach the object from the scene.
      if (l <= 0 && grandparent) {
        grandparent.remove(this);
        return this;
      }

      // Allow to pass multiple objects either as array or as multiple arguments
      // If it's an array also create copy of it in case we're getting passed
      // a childrens array directly.
      if (!(objects instanceof Array)) {
        objects = _.toArray(arguments);
      } else {
        objects = objects.slice();
      }

      // Remove the objects
      for (var i = 0; i < objects.length; i++) {
        if (!objects[i] || !(this.children.ids[objects[i].id])) continue;
        this.children.splice(_.indexOf(this.children, objects[i]), 1);
      }

      return this;

    },

    /**
     * Return an object with top, left, right, bottom, width, and height
     * parameters of the group.
     */
    getBoundingClientRect: function(shallow) {
      var rect;

      // TODO: Update this to not __always__ update. Just when it needs to.
      this._update(true);

      // Variables need to be defined here, because of nested nature of groups.
      var left = Infinity, right = -Infinity,
          top = Infinity, bottom = -Infinity;

      this.children.forEach(function(child) {

        if (/(linear-gradient|radial-gradient|gradient)/.test(child._renderer.type)) {
          return;
        }

        rect = child.getBoundingClientRect(shallow);

        if (!_.isNumber(rect.top)   || !_.isNumber(rect.left)   ||
            !_.isNumber(rect.right) || !_.isNumber(rect.bottom)) {
          return;
        }

        top = min(rect.top, top);
        left = min(rect.left, left);
        right = max(rect.right, right);
        bottom = max(rect.bottom, bottom);

      }, this);

      return {
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        width: right - left,
        height: bottom - top
      };

    },

    /**
     * Trickle down of noFill
     */
    noFill: function() {
      this.children.forEach(function(child) {
        child.noFill();
      });
      return this;
    },

    /**
     * Trickle down of noStroke
     */
    noStroke: function() {
      this.children.forEach(function(child) {
        child.noStroke();
      });
      return this;
    },

    /**
     * Trickle down subdivide
     */
    subdivide: function() {
      var args = arguments;
      this.children.forEach(function(child) {
        child.subdivide.apply(child, args);
      });
      return this;
    },

    flagReset: function() {

      if (this._flagAdditions) {
        this.additions.length = 0;
        this._flagAdditions = false;
      }

      if (this._flagSubtractions) {
        this.subtractions.length = 0;
        this._flagSubtractions = false;
      }

      this._flagOrder = this._flagMask = this._flagOpacity = false;

      Two.Shape.prototype.flagReset.call(this);

      return this;

    }

  });

  Group.MakeObservable(Group.prototype);

  /**
   * Helper function used to sync parent-child relationship within the
   * `Two.Group.children` object.
   *
   * Set the parent of the passed object to another object
   * and updates parent-child relationships
   * Calling with one arguments will simply remove the parenting
   */
  function replaceParent(child, newParent) {

    var parent = child.parent;
    var index;

    if (parent === newParent) {
      this.additions.push(child);
      this._flagAdditions = true;
      return;
    }

    if (parent && parent.children.ids[child.id]) {

      index = _.indexOf(parent.children, child);
      parent.children.splice(index, 1);

      // If we're passing from one parent to another...
      index = _.indexOf(parent.additions, child);

      if (index >= 0) {
        parent.additions.splice(index, 1);
      } else {
        parent.subtractions.push(child);
        parent._flagSubtractions = true;
      }

    }

    if (newParent) {
      child.parent = newParent;
      this.additions.push(child);
      this._flagAdditions = true;
      return;
    }

    // If we're passing from one parent to another...
    index = _.indexOf(this.additions, child);

    if (index >= 0) {
      this.additions.splice(index, 1);
    } else {
      this.subtractions.push(child);
      this._flagSubtractions = true;
    }

    delete child.parent;

  }

})((typeof global !== 'undefined' ? global : this).Two);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ })
/******/ ]);
});
//# sourceMappingURL=global.js.map