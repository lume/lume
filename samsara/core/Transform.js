/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {

    /**
     * A library for creating and composing CSS3 matrix transforms.
     *  A Transform is a 16 element float array `t = [t0, ..., t15]`
     *  that corresponds to a 4x4 transformation matrix (in row-major order)
     *
     *  ```
     *    ┌               ┐
     *    │ t0  t1  t2  0 │
     *    │ t4  t5  t6  0 │
     *    │ t8  t9  t10 0 │
     *    │ t12 t13 t14 1 │
     *    └               ┘
     *  ```
     *
     *  This matrix is a data structure encoding a combination of translation,
     *  scale, skew and rotation components.
     *
     *  Note: these matrices are transposes from their mathematical counterparts.
     *
     *  @example
     *
     *      var layoutNode = var LayoutNode({
     *          transform : Transform.translate([100,200,50])
     *      });
     *
     *  @example
     *
     *      var transitionable = new Transitionable(0);
     *
     *      var transform = transitionable.map(function(value){
     *          return Transform.scaleX(value);
     *      });
     *
     *      var layoutNode = var LayoutNode({
     *          transform : transform
     *      });
     *
     *      transitionable.set(100, {duration : 500});
     *
     * @class Transform
     * @static
     */
    var Transform = {};

    /**
     * Identity transform.
     *
     * @property identity {Array}
     * @static
     * @final
     */
    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    //TODO: why do inFront/behind need to translate by >1 to overcome DOM order?
    /**
     * Transform for moving a renderable in front of another renderable in the z-direction.
     *
     * @property inFront {Array}
     * @static
     * @final
     */
    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1.001, 1];

    /**
     * Transform for moving a renderable behind another renderable in the z-direction.
     *
     * @property behind {Array}
     * @static
     * @final
     */
    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.001, 1];

    /**
     * Compose Transform arrays via matrix multiplication.
     *
     * @method compose
     * @static
     * @param t1 {Transform} Left Transform
     * @param t2 {Transform} Right Transform
     * @return {Array}
     */
    Transform.compose = function multiply(t1, t2) {
        if (t1 === Transform.identity) return t2.slice();
        if (t2 === Transform.identity) return t1.slice();
        return [
            t1[0] * t2[0] + t1[4] * t2[1] + t1[8] * t2[2],
            t1[1] * t2[0] + t1[5] * t2[1] + t1[9] * t2[2],
            t1[2] * t2[0] + t1[6] * t2[1] + t1[10] * t2[2],
            0,
            t1[0] * t2[4] + t1[4] * t2[5] + t1[8] * t2[6],
            t1[1] * t2[4] + t1[5] * t2[5] + t1[9] * t2[6],
            t1[2] * t2[4] + t1[6] * t2[5] + t1[10] * t2[6],
            0,
            t1[0] * t2[8] + t1[4] * t2[9] + t1[8] * t2[10],
            t1[1] * t2[8] + t1[5] * t2[9] + t1[9] * t2[10],
            t1[2] * t2[8] + t1[6] * t2[9] + t1[10] * t2[10],
            0,
            t1[0] * t2[12] + t1[4] * t2[13] + t1[8] * t2[14] + t1[12],
            t1[1] * t2[12] + t1[5] * t2[13] + t1[9] * t2[14] + t1[13],
            t1[2] * t2[12] + t1[6] * t2[13] + t1[10] * t2[14] + t1[14],
            1
        ];
    };

    /**
     * Convenience method to Compose several Transform arrays.
     *
     * @method composeMany
     * @static
     * @param {...Transform}    Transform arrays
     * @return {Array}
     */
    Transform.composeMany = function composeMany(){
        if (arguments.length > 2){
            var first = arguments[0];
            var second = arguments[1];
            Array.prototype.shift.call(arguments);
            arguments[0] = Transform.compose(first, second);
            return Transform.composeMany.apply(null, arguments);
        }
        else return Transform.compose.apply(null, arguments);
    };

    /**
     * Translate a Transform after the Transform is applied.
     *
     * @method thenMove
     * @static
     * @param t {Transform}     Transform
     * @param v {Number[]}      Array of [x,y,z] translation components
     * @return {Array}
     */
    Transform.thenMove = function thenMove(t, v) {
        if (!v[2]) v[2] = 0;
        return [t[0], t[1], t[2], 0, t[4], t[5], t[6], 0, t[8], t[9], t[10], 0, t[12] + v[0], t[13] + v[1], t[14] + v[2], 1];
    };

    /**
     * Translate a Transform before the Transform is applied.
     *
     * @method moveThen
     * @static
     * @param v {Number[]}      Array of [x,y,z] translation components
     * @param t {Transform}     Transform
     * @return {Array}
     */
    Transform.moveThen = function moveThen(v, t) {
        if (!v[2]) v[2] = 0;
        var t0 = v[0] * t[0] + v[1] * t[4] + v[2] * t[8];
        var t1 = v[0] * t[1] + v[1] * t[5] + v[2] * t[9];
        var t2 = v[0] * t[2] + v[1] * t[6] + v[2] * t[10];
        return Transform.thenMove(t, [t0, t1, t2]);
    };

    /**
     * Return a Transform which represents translation by a translation vector.
     *
     * @method translate
     * @static
     * @param v {Number[]}      Translation vector [x,y,z]
     * @return {Array}
     */
    Transform.translate = function translate(v) {
        var x = v[0] || 0;
        var y = v[1] || 0;
        var z = v[2] || 0;
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    };

    /**
     * Return a Transform which represents translation in the x-direction.
     *
     * @method translateX
     * @static
     * @param x {Number}        Translation amount
     */
    Transform.translateX = function translateX(x) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1];
    };

    /**
     * Return a Transform which represents translation in the y-direction.
     *
     * @method translateY
     * @static
     * @param y {Number}        Translation amount
     */
    Transform.translateY = function translateY(y) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, y, 0, 1];
    };

    /**
     * Return a Transform which represents translation in the z-direction.
     *
     * @method translateZ
     * @static
     * @param z {Number}        Translation amount
     */
    Transform.translateZ = function translateZ(z) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1];
    };

    /**
     * Return a Transform which represents a scaling by specified amounts in each dimension.
     *
     * @method scale
     * @static
     * @param v {Number[]}      Scale vector [x,y,z]
     * @return {Array}
     */
    Transform.scale = function scale(v) {
        var x = (v[0] !== undefined) ? v[0] : 1;
        var y = (v[1] !== undefined) ? v[1] : 1;
        var z = (v[2] !== undefined) ? v[2] : 1;
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents scaling in the x-direction.
     *
     * @method scaleX
     * @static
     * @param x {Number}        Scale amount
     */
    Transform.scaleX = function scaleX(x) {
        return [x, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents scaling in the y-direction.
     *
     * @method scaleY
     * @static
     * @param y {Number}        Scale amount
     */
    Transform.scaleY = function scaleY(y) {
        return [1, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents scaling in the z-direction.
     *
     * @method scaleZ
     * @static
     * @param z {Number}        Scale amount
     */
    Transform.scaleZ = function scaleZ(z) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    };

    /**
     * Scale a Transform after the Transform is applied.
     *
     * @method thenScale
     * @static
     * @param t {Transform}     Transform
     * @param v {Number[]}      Array of [x,y,z] scale components
     * @return {Array}
     */
    Transform.thenScale = function thenScale(t, v) {
        var x = (v[0] !== undefined) ? v[0] : 1;
        var y = (v[1] !== undefined) ? v[1] : 1;
        var z = (v[2] !== undefined) ? v[2] : 1;
        return [
            x * t[0],  y * t[1],  z * t[2],  0,
            x * t[4],  y * t[5],  z * t[6],  0,
            x * t[8],  y * t[9],  z * t[10], 0,
            x * t[12], y * t[13], z * t[14], 1
        ];
    };

    /**
     * Return a Transform representing a clockwise rotation around the x-axis.
     *
     * @method rotateX
     * @static
     * @param angle {Number}    Angle in radians
     * @return {Array}
     */
    Transform.rotateX = function rotateX(angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representing a clockwise rotation around the y-axis.
     *
     * @method rotateY
     * @static
     * @param angle {Number}    Angle in radians
     * @return {Array}
     */
    Transform.rotateY = function rotateY(angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representing a clockwise rotation around the z-axis.
     *
     * @method rotateX
     * @static
     * @param angle {Number}    Angle in radians
     * @return {Array}
     */
    Transform.rotateZ = function rotateZ(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the x-direction
     *
     * @method skewX
     * @static
     * @param angle {Number}    The angle between the top and left sides
     * @return {Array}
     */
    Transform.skewX = function skewX(angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the y-direction
     *
     * @method skewY
     * @static
     * @param angle {Number}    The angle between the bottom and right sides
     * @return {Array}
     */
    Transform.skewY = function skewY(angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents an axis-angle rotation.
     *
     * @method rotateAxis
     * @static
     * @param v {Number[]}   Unit vector representing the axis to rotate about
     * @param angle {Number} Radians to rotate clockwise about the axis
     * @return {Array}
     */
    Transform.rotateAxis = function rotateAxis(v, angle) {
        var sinTheta = Math.sin(angle);
        var cosTheta = 1 - Math.cos(angle);
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

        return [
            xxV + cosTheta, xyV + zs, xzV - ys, 0,
            xyV - zs, yyV + cosTheta, yzV + xs, 0,
            xzV + ys, yzV - xs, zzV + cosTheta, 0,
            0, 0, 0, 1
        ];
    };

    /**
     * Return a Transform which represents a Transform applied about an origin point.
     *  Useful for rotating and scaling relative to an origin.
     *
     * @method aboutOrigin
     * @static
     * @param v {Number[]}          Origin point [x,y,z]
     * @param t {Transform}         Transform
     * @return {Array}
     */
    Transform.aboutOrigin = function aboutOrigin(v, t) {
        v[2] = v[2] || 0;
        var t0 = v[0] - (v[0] * t[0] + v[1] * t[4] + v[2] * t[8]);
        var t1 = v[1] - (v[0] * t[1] + v[1] * t[5] + v[2] * t[9]);
        var t2 = v[2] - (v[0] * t[2] + v[1] * t[6] + v[2] * t[10]);
        return Transform.thenMove(t, [t0, t1, t2]);
    };

    /**
     * Return translation vector component of the given Transform.
     *
     * @method getTranslate
     * @static
     * @param t {Transform}         Transform
     * @return {Number[]}
     */
    Transform.getTranslate = function getTranslate(t) {
        return [t[12], t[13], t[14]];
    };

    /**
     * Return inverse Transform for given Transform.
     *   Note: will provide incorrect results if Transform is not invertible.
     *
     * @method inverse
     * @static
     * @param t {Transform} Transform
     * @return {Array}
     */
    Transform.inverse = function inverse(t) {
        // only need to consider 3x3 section for affine
        var c0 = t[5] * t[10] - t[6] * t[9];
        var c1 = t[4] * t[10] - t[6] * t[8];
        var c2 = t[4] * t[9]  - t[5] * t[8];
        var c4 = t[1] * t[10] - t[2] * t[9];
        var c5 = t[0] * t[10] - t[2] * t[8];
        var c6 = t[0] * t[9]  - t[1] * t[8];
        var c8 = t[1] * t[6]  - t[2] * t[5];
        var c9 = t[0] * t[6]  - t[2] * t[4];
        var c10 = t[0] * t[5] - t[1] * t[4];
        var detM = t[0] * c0 - t[1] * c1 + t[2] * c2;
        var invD = 1 / detM;
        var result = [
            invD  * c0, -invD * c4,  invD * c8,  0,
            -invD * c1,  invD * c5, -invD * c9,  0,
            invD  * c2, -invD * c6,  invD * c10, 0,
            0, 0, 0, 1
        ];
        result[12] = -t[12] * result[0] - t[13] * result[4] - t[14] * result[8];
        result[13] = -t[12] * result[1] - t[13] * result[5] - t[14] * result[9];
        result[14] = -t[12] * result[2] - t[13] * result[6] - t[14] * result[10];
        return result;
    };

    /**
     * Returns the transpose of a Transform.
     *
     * @method transpose
     * @static
     * @param t {Transform}     Transform
     * @return {Array}
     */
    Transform.transpose = function transpose(t) {
        return [t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]];
    };

    function normSquared(v) {
        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }
    function norm(v) {
        return Math.sqrt(normSquared(v));
    }
    function sign(n) {
        return (n < 0) ? -1 : 1;
    }

    /**
     * Decompose Transform into separate `translate`, `rotate`, `scale` and `skew` components.
     *
     * @method interpret
     * @static
     * @private
     * @param t {Transform}     Transform
     * @return {Object}
     */
    Transform.interpret = function interpret(t) {
        // QR decomposition via Householder reflections
        // FIRST ITERATION

        //default Q1 to the identity matrix;
        var x = [t[0], t[1], t[2]];                // first column vector
        var sgn = sign(x[0]);                      // sign of first component of x (for stability)
        var xNorm = norm(x);                       // norm of first column vector
        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
        var mult = 2 / normSquared(v);             // mult = 2/v'v

        //bail out if our Matrix is singular
        if (mult >= Infinity) {
            return {
                translate: Transform.getTranslate(t),
                rotate: [0, 0, 0],
                scale: [0, 0, 0],
                skew: [0, 0, 0]
            };
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
        var MQ1 = Transform.compose(Q1, t);

        // SECOND ITERATION on (1,1) minor
        var x2 = [MQ1[5], MQ1[6]];
        var sgn2 = sign(x2[0]);                    // sign of first component of x (for stability)
        var x2Norm = norm(x2);                     // norm of first column vector
        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];   // v = x + sign(x[0])|x|e1
        var mult2 = 2 / normSquared(v2);           // mult = 2/v'v

        //evaluate Q2 = I - 2vv'/v'v
        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonal
        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

        //off diagonals
        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
        Q2[9] = Q2[6];                      // 1,2 entry

        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
        var Q = Transform.compose(Q2, Q1);      //note: really Q transpose
        var R = Transform.compose(Q, t);

        //remove negative scaling
        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.compose(R, remover);
        Q = Transform.compose(remover, Q);

        // decompose into rotate/scale/skew matrices
        var result = {};
        result.translate = Transform.getTranslate(t);
        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
        if (!result.rotate[0]) {
            result.rotate[0] = 0;
            result.rotate[2] = Math.atan2(Q[4], Q[5]);
        }
        result.scale = [R[0], R[5], R[10]];
        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

        // double rotation workaround
        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
            result.rotate[1] = Math.PI - result.rotate[1];

            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
            else if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;

            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
            else result.rotate[0] -= Math.PI;

            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
            else result.rotate[2] -= Math.PI;
        }

        return result;
    };

    /**
     * Compose .translate, .rotate, .scale and .skew components into a Transform matrix.
     *  The "inverse" of .interpret.
     *
     * @method build
     * @static
     * @private
     * @param spec {Object} Object with keys "translate, rotate, scale, skew" and their vector values
     * @return {Array}
     */
    Transform.build = function build(spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(
            Transform.compose(Transform.compose(rotateMatrix, skewMatrix), scaleMatrix),
            spec.translate
        );
    };

    /**
     * Weighted average between two matrices by averaging their
     *  translation, rotation, scale, skew components.
     *  f(M1,M2,t) = (1 - t) * M1 + t * M2
     *
     * @method average
     * @static
     * @param M1 {Transform}    M1 = f(M1,M2,0) Transform
     * @param M2 {Transform}    M2 = f(M1,M2,1) Transform
     * @param [t=1/2] {Number}
     * @return {Array}
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
     * Determine if two Transforms are component-wise equal.
     *
     * @method equals
     * @static
     * @param a {Transform}     Transform
     * @param b {Transform}     Transform
     * @return {Boolean}
     */
    Transform.equals = function equals(a, b) {
        return !Transform.notEquals(a, b);
    };

    /**
     * Determine if two Transforms are component-wise unequal
     *
     * @method notEquals
     * @static
     * @param a {Transform}     Transform
     * @param b {Transform}     Transform
     * @return {Boolean}
     */
    Transform.notEquals = function notEquals(a, b) {
        if (a === b) return false;

        return !(a && b) ||
            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
            a[0]  !== b[0]  || a[1]  !== b[1]  || a[2]  !== b[2]  ||
            a[4]  !== b[4]  || a[5]  !== b[5]  || a[6]  !== b[6]  ||
            a[8]  !== b[8]  || a[9]  !== b[9]  || a[10] !== b[10];
    };

    module.exports = Transform;
});
