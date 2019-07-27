define(function(require, exports, module){
    var identity = [1, 0, 0, 0];

    /**
     * Quaternion is a singleton with helper methods for quaternionic math.
     *  Quaternions are represented as 4-dimensional arrays [w, x, y, z].
     *
     * @class Quaternion
     * @namespace Camera
     * @static
     * @private
     */
    var Quaternion = {};

    /**
     * Create a quaternion. Either provide a quaternion to clone, otherwise
     *  the identity quaternion is returned.
     *
     * @method create
     * @static
     * @param [q] {Array}       Given quaternion
     * @return {Quaternion}     Created quaternion
     */
    Quaternion.create = function create(q){
        return (q || identity).slice();
    }

    /**
     * Set a quaternion with coordinates from a given quaternion.
     *
     * @method set
     * @static
     * @param q {Array}         Given quaternion
     * @param out {Quaternion}  The resulting quaternion
     */
    Quaternion.set = function(q, out){
        out[0] = q[0];
        out[1] = q[1];
        out[2] = q[2];
        out[3] = q[3];
    }

    /**
     * Output a quaternion that represents a rotation of a given angle about a given axis.
     *
     * @method fromAngleAxis
     * @static
     * @param values {Array}    Values in the form of [angle, x, y, z]
     *                          where [x, y, z] is the axis of rotation,
     *                          and angle is the angle about this axis.
     * @param out {Quaternion}  The resulting quaternion
     */
    Quaternion.fromAngleAxis = function fromAngleAxis(values, out) {
        var angle = values[0];

        var x = values[1];
        var y = values[2];
        var z = values[3];

        var len = Math.hypot(x, y, z);

        if (len === 0) {
            out[0] = 1;
            out[1] = out[2] = out[3] = 0;
        }
        else {
            var halfAngle = 0.5 * angle;
            var s = Math.sin(halfAngle) / len;
            out[0] = Math.cos(halfAngle);
            out[1] = s * x;
            out[2] = s * y;
            out[3] = s * z;
        }
    };

    /**
     * Output a quaternion from given Euler angles [x, y, z].
     *
     * @method fromEulerAngles
     * @static
     * @param angles {Array}    Euler angles [x, y, z]
     * @param out {Quaternion}  The resulting quaternion
     */
    Quaternion.fromEulerAngles = function fromEulerAngles(angles, out) {
        var hx = 0.5 * angles[0];
        var hy = 0.5 * angles[1];
        var hz = 0.5 * angles[2];

        var sx = Math.sin(hx);
        var sy = Math.sin(hy);
        var sz = Math.sin(hz);
        var cx = Math.cos(hx);
        var cy = Math.cos(hy);
        var cz = Math.cos(hz);

        out[0] = cx * cy * cz - sx * sy * sz;
        out[1] = sx * cy * cz + cx * sy * sz;
        out[2] = cx * sy * cz - sx * cy * sz;
        out[3] = cx * cy * sz + sx * sy * cz;
    };

    /**
     * Sum two quaternions.
     *
     * @method sum
     * @static
     * @param q1 {Quaternion}
     * @param q2 {Quaternion}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.sum = function sum(q1, q2, out) {
        out[0] = q1[0] + q2[0];
        out[1] = q1[1] + q2[1];
        out[2] = q1[2] + q2[2];
        out[3] = q1[3] + q2[3];
    };

    /**
     * Multiply two quaternions.
     *
     * @method multiply
     * @static
     * @param q1 {Quaternion}
     * @param q2 {Quaternion}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.multiply = function multiply(q1, q2, out) {
        var w1 = q1[0];
        var x1 = q1[1];
        var y1 = q1[2];
        var z1 = q1[3];

        var w2 = q2[0];
        var x2 = q2[1];
        var y2 = q2[2];
        var z2 = q2[3];

        out[0] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        out[1] = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
        out[2] = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
        out[3] = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    };

    /**
     * Scale a quaternion.
     *
     * @method scalarMultiply
     * @static
     * @param q1 {Quaternion}
     * @param s {Number}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.scalarMultiply = function scalarMultiply(q, s, out) {
        out[0] = s * q[0];
        out[1] = s * q[1];
        out[2] = s * q[2];
        out[3] = s * q[3];
    };

    /**
     * Conjugate a quaternion.
     *
     * @method conjugate
     * @static
     * @param q {Quaternion}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.conjugate = function conjugate(q, out) {
        out[0] =  q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        out[3] = -q[3];
    };

    /**
     * Negate a quaternion.
     *
     * @method negate
     * @static
     * @param q {Quaternion}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.negate = function negate(q, out) {
        out[0] = -q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        out[3] = -q[3];
    };

    /**
     * Normalize a quaternion to be of unit length.
     *
     * @method normalize
     * @static
     * @param q {Quaternion}
     * @param out {Quaternion} The resulting quaternion
     */
    Quaternion.normalize = function normalize(q, out) {
        var len = Quaternion.length(q);
        Quaternion.scalarMultiply(q, 1 / len, out);
    };

    /**
     * Spherical linear interpolation between quaternions with a given weight.
     *
     * @method slerp
     * @static
     * @param start {Quaternion}    Starting quaternion
     * @param end {Quaternion}      Ending quaternion
     * @param t {Number}            Weight of interpolation
     * @param out {Quaternion}      The resulting quaternion
     */
    Quaternion.slerp = function slerp(start, end, t, out) {
        if (t === 0)
            Quaternion.set(start, out);
        else if (t === 1)
            Quaternion.set(end, out);
        else {
            var scaleFrom, scaleTo;
            var cosTheta = Quaternion.dot(start, end);

            if (cosTheta < 1) {
                var theta = Math.acos(cosTheta);
                var sinTheta = Math.sin(theta);
                scaleFrom = Math.sin((1 - t) * theta) / sinTheta;
                scaleTo = Math.sin(t * theta) / sinTheta;
            }
            else {
                scaleFrom = 1 - t;
                scaleTo = t;
            }

            var result1 = [];
            var result2 = [];
            Quaternion.scalarMultiply(start, scaleFrom, result1)
            Quaternion.scalarMultiply(end, scaleTo, result2),
            Quaternion.sum(result1, result2, out);
        }
    };

    /**
     * Get the length of a quaternion.
     *
     * @method length
     * @static
     * @param q {Quaternion}
     * @return length {Quaternion}
     */
    Quaternion.length = function length(q) {
        return Math.hypot.apply(null, q);
    };

    /**
     * Dot product of two quaternions.
     *
     * @method dot
     * @static
     * @param q1 {Quaternion}
     * @param q2 {Quaternion}
     * @return {Number}
     */
    Quaternion.dot = function dot(q1, q2) {
        return q1[0] * q2[0] + q1[1] * q2[1] + q1[2] * q2[2] + q1[3] * q2[3];
    };

    /**
     * Calculate the corresponding matrix transform from a quaternion.
     *
     * @method toTransform
     * @static
     * @param q {Quaternion}
     * @return {Transform}
     */
    Quaternion.toTransform = function toTransform(q) {
        var w = q[0];
        var x = q[1];
        var y = q[2];
        var z = q[3];

        var xx = x * x;
        var yy = y * y;
        var zz = z * z;
        var xy = x * y;
        var xz = x * z;
        var yz = y * z;
        var wx = w * x;
        var wy = w * y;
        var wz = w * z;

        return [
            1 - 2 * (yy + zz),
            2 * (xy - wz),
            2 * (xz + wy),
            0,
            2 * (xy + wz),
            1 - 2 * (xx + zz),
            2 * (yz - wx),
            0,
            2 * (xz - wy),
            2 * (yz + wx),
            1 - 2 * (xx + yy),
            0,
            0, 0, 0, 1
        ];
    };

    /**
     * Calculate the corresponding euler angles from a quaternion.
     *
     * @method toEulerAngles
     * @static
     * @param q {Quaternion}
     * @return {Array}
     */
    Quaternion.toEulerAngles = function toEulerAngles(q) {
        var w = q[0];
        var x = q[1];
        var y = q[2];
        var z = q[3];

        var xx = x * x;
        var yy = y * y;
        var zz = z * z;

        var ty = 2 * (x * z + y * w);
        ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

        return [
            Math.atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy)),
            Math.asin(ty),
            Math.atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz))
        ];
    };

    /**
     * Calculate the corresponding angle/axis representation of a quaternion.
     *
     * @method toAngleAxis
     * @static
     * @param q {Quaternion}
     * @return {Array}
     */
    Quaternion.toAngleAxis = function toAngleAxis(q){
        var len = Quaternion.length(q);
        var halfAngle = Math.acos(q[0]);

        if (halfAngle === 0) {
            return [0, 1, 0, 0];
        }

        var s = len / Math.sin(halfAngle);

        var angle = 2 * halfAngle;
        var x = s * q[1];
        var y = s * q[2];
        var z = s * q[3];

        return [angle, x, y, z];
    }

    /**
     * Get the angle associated with the quaternion rotation.
     *
     * @method getAngle
     * @static
     * @param q {Quaternion}    Quaternion
     * @return {Number}         Angle
     */
    Quaternion.getAngle = function getAngle(q){
        return 2 * Math.acos(q[0]);
    }

    /**
     * Get the axis associated with the quaternion rotation.
     *
     * @method getAxis
     * @static
     * @param q {Quaternion}    Quaternion
     * @return {Array}          Axis
     */
    Quaternion.getAxis = function getAngle(q){
        var len = Quaternion.length(q);
        var halfAngle = Math.acos(q[0]);

        if (halfAngle === 0) {
            return [1, 0, 0];
        }

        var s = len / Math.sin(halfAngle);

        var x = s * q[1];
        var y = s * q[2];
        var z = s * q[3];

        return [x, y, z];
    }

    /**
     * Set the angle of a quaternion, keeping its axis constant.
     *
     * @method setAngle
     * @static
     * @param q {Quaternion}    Quaternion
     * @param angle {Number}    New angle
     * @param out {Quaternion}  The resulting quaternion
     */
    Quaternion.setAngle = function getAngle(q, angle, out){
        var axis = Quaternion.getAxis(q);
        axis.unshift(angle);
        Quaternion.fromAngleAxis(axis, out);
    }

    /**
     * Rotate a vector (3-dimensional array) by a quaternion.
     *  v' = ~q * v * q.
     *
     * @method rotateVector
     * @static
     * @param q {Quaternion}    Quaternion representing rotation
     * @param v {Array}         Vector. 3-dimensional array [x, y, z]
     * @return {Array}          Rotated vector
     */
    Quaternion.rotateVector = function rotateVector(q, v) {
        var result = [];
        var w = [0, v[0], v[1], v[2]];

        Quaternion.conjugate(q, result);
        Quaternion.multiply(result, w, result);
        Quaternion.multiply(result, q, result);

        result.shift();
        return result;
    };

    module.exports = Quaternion;
});
