(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.boxer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var XCSSMatrix = require('./lib/XCSSMatrix.js');
module.exports = XCSSMatrix;

},{"./lib/XCSSMatrix.js":3}],2:[function(require,module,exports){
var vector = require('./utils/vector');
module.exports = Vector4;

/**
 * A 4 dimensional vector
 * @author Joe Lambert
 * @constructor
 */
function Vector4(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
  this.checkValues();
}

/**
 * Ensure that values are not undefined
 * @author Joe Lambert
 * @returns null
 */

Vector4.prototype.checkValues = function() {
  this.x = this.x || 0;
  this.y = this.y || 0;
  this.z = this.z || 0;
  this.w = this.w || 0;
};

/**
 * Get the length of the vector
 * @author Joe Lambert
 * @returns {float}
 */

Vector4.prototype.length = function() {
  this.checkValues();
  return vector.length(this);
};


/**
 * Get a normalised representation of the vector
 * @author Joe Lambert
 * @returns {Vector4}
 */

Vector4.prototype.normalize = function() {
	return vector.normalize(this);
};


/**
 * Vector Dot-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {float} The Dot-Product of this and v.
 */

Vector4.prototype.dot = function(v) {
  return vector.dot(this, v);
};


/**
 * Vector Cross-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {Vector4} The Cross-Product of this and v.
 */

Vector4.prototype.cross = function(v) {
  return vector.cross(this, v);
};


/**
 * Helper function required for matrix decomposition
 * A Javascript implementation of pseudo code available from http://www.w3.org/TR/css3-2d-transforms/#matrix-decomposition
 * @param {Vector4} aPoint A 3D point
 * @param {float} ascl
 * @param {float} bscl
 * @author Joe Lambert
 * @returns {Vector4}
 */

Vector4.prototype.combine = function(bPoint, ascl, bscl) {
  return vector.combine(this, bPoint, ascl, bscl);
};

Vector4.prototype.multiplyByMatrix = function (matrix) {
  return vector.multiplyByMatrix(this, matrix);
};

},{"./utils/vector":7}],3:[function(require,module,exports){
var utils = {
    angles: require('./utils/angle'),
    matrix: require('./utils/matrix'),
    transp: require('./utils/cssTransformString'),
    funcs: {
        // Given a function `fn`, return a function which calls `fn` with only 1
        //   argument, no matter how many are given.
        // Most useful where you only want the first value from a map/foreach/etc
        onlyFirstArg: function (fn, context) {
            context = context || this;

            return function (first) {
                return fn.call(context, first);
            };
        }
    }
};


/**
 *  Given a CSS transform string (like `rotate(3rad)`, or
 *    `matrix(1, 0, 0, 0, 1, 0)`), return an instance compatible with
 *    [`WebKitCSSMatrix`](http://developer.apple.com/library/safari/documentation/AudioVideo/Reference/WebKitCSSMatrixClassReference/WebKitCSSMatrix/WebKitCSSMatrix.html)
 *  @constructor
 *  @param {string} domstr - a string representation of a 2D or 3D transform matrix
 *    in the form given by the CSS transform property, i.e. just like the
 *    output from [[@link#toString]].
 *  @member {number} a - The first 2D vector value.
 *  @member {number} b - The second 2D vector value.
 *  @member {number} c - The third 2D vector value.
 *  @member {number} d - The fourth 2D vector value.
 *  @member {number} e - The fifth 2D vector value.
 *  @member {number} f - The sixth 2D vector value.
 *  @member {number} m11 - The 3D matrix value in the first row and first column.
 *  @member {number} m12 - The 3D matrix value in the first row and second column.
 *  @member {number} m13 - The 3D matrix value in the first row and third column.
 *  @member {number} m14 - The 3D matrix value in the first row and fourth column.
 *  @member {number} m21 - The 3D matrix value in the second row and first column.
 *  @member {number} m22 - The 3D matrix value in the second row and second column.
 *  @member {number} m23 - The 3D matrix value in the second row and third column.
 *  @member {number} m24 - The 3D matrix value in the second row and fourth column.
 *  @member {number} m31 - The 3D matrix value in the third row and first column.
 *  @member {number} m32 - The 3D matrix value in the third row and second column.
 *  @member {number} m33 - The 3D matrix value in the third row and third column.
 *  @member {number} m34 - The 3D matrix value in the third row and fourth column.
 *  @member {number} m41 - The 3D matrix value in the fourth row and first column.
 *  @member {number} m42 - The 3D matrix value in the fourth row and second column.
 *  @member {number} m43 - The 3D matrix value in the fourth row and third column.
 *  @member {number} m44 - The 3D matrix value in the fourth row and fourth column.
 *  @returns {XCSSMatrix} matrix
 */
function XCSSMatrix(domstr) {
    this.m11 = this.m22 = this.m33 = this.m44 = 1;

               this.m12 = this.m13 = this.m14 =
    this.m21 =            this.m23 = this.m24 =
    this.m31 = this.m32 =            this.m34 =
    this.m41 = this.m42 = this.m43            = 0;

    if (typeof domstr === 'string') {
        this.setMatrixValue(domstr);
    }
}

/**
 *  XCSSMatrix.displayName = 'XCSSMatrix'
 */
XCSSMatrix.displayName = 'XCSSMatrix';

var points2d = ['a', 'b', 'c', 'd', 'e', 'f'];
var points3d = [
    'm11', 'm12', 'm13', 'm14',
    'm21', 'm22', 'm23', 'm24',
    'm31', 'm32', 'm33', 'm34',
    'm41', 'm42', 'm43', 'm44'
];

([
    ['m11', 'a'],
    ['m12', 'b'],
    ['m21', 'c'],
    ['m22', 'd'],
    ['m41', 'e'],
    ['m42', 'f']
]).forEach(function (pair) {
    var key3d = pair[0], key2d = pair[1];

    Object.defineProperty(XCSSMatrix.prototype, key2d, {
        set: function (val) {
            this[key3d] = val;
        },

        get: function () {
            return this[key3d];
        },
        enumerable : true,
        configurable : true
    });
});


/**
 *  Multiply one matrix by another
 *  @method
 *  @member
 *  @param {XCSSMatrix} otherMatrix - The matrix to multiply this one by.
 */
XCSSMatrix.prototype.multiply = function (otherMatrix) {
    return utils.matrix.multiply(this, otherMatrix);
};

/**
 *  If the matrix is invertible, returns its inverse, otherwise returns null.
 *  @method
 *  @member
 *  @returns {XCSSMatrix|null}
 */
XCSSMatrix.prototype.inverse = function () {
    return utils.matrix.inverse(this);
};

/**
 *  Returns the result of rotating the matrix by a given vector.
 *
 *  If only the first argument is provided, the matrix is only rotated about
 *  the z axis.
 *  @method
 *  @member
 *  @param {number} rotX - The rotation around the x axis.
 *  @param {number} rotY - The rotation around the y axis. If undefined, the x component is used.
 *  @param {number} rotZ - The rotation around the z axis. If undefined, the x component is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.rotate = function (rx, ry, rz) {

    if (typeof rx !== 'number' || isNaN(rx)) rx = 0;

    if ((typeof ry !== 'number' || isNaN(ry)) &&
        (typeof rz !== 'number' || isNaN(rz))) {
        rz = rx;
        rx = 0;
        ry = 0;
    }

    if (typeof ry !== 'number' || isNaN(ry)) ry = 0;
    if (typeof rz !== 'number' || isNaN(rz)) rz = 0;

    rx = utils.angles.deg2rad(rx);
    ry = utils.angles.deg2rad(ry);
    rz = utils.angles.deg2rad(rz);

    var tx = new XCSSMatrix(),
        ty = new XCSSMatrix(),
        tz = new XCSSMatrix(),
        sinA, cosA, sq;

    rz /= 2;
    sinA  = Math.sin(rz);
    cosA  = Math.cos(rz);
    sq = sinA * sinA;

    // Matrices are identity outside the assigned values
    tz.m11 = tz.m22 = 1 - 2 * sq;
    tz.m12 = tz.m21 = 2 * sinA * cosA;
    tz.m21 *= -1;

    ry /= 2;
    sinA  = Math.sin(ry);
    cosA  = Math.cos(ry);
    sq = sinA * sinA;

    ty.m11 = ty.m33 = 1 - 2 * sq;
    ty.m13 = ty.m31 = 2 * sinA * cosA;
    ty.m13 *= -1;

    rx /= 2;
    sinA = Math.sin(rx);
    cosA = Math.cos(rx);
    sq = sinA * sinA;

    tx.m22 = tx.m33 = 1 - 2 * sq;
    tx.m23 = tx.m32 = 2 * sinA * cosA;
    tx.m32 *= -1;

    var identityMatrix = new XCSSMatrix(); // returns identity matrix by default
    var isIdentity     = this.toString() === identityMatrix.toString();
    var rotatedMatrix  = isIdentity ?
            tz.multiply(ty).multiply(tx) :
            this.multiply(tx).multiply(ty).multiply(tz);

    return rotatedMatrix;
};

/**
 *  Returns the result of rotating the matrix around a given vector by a given
 *  angle.
 *
 *  If the given vector is the origin vector then the matrix is rotated by the
 *  given angle around the z axis.
 *  @method
 *  @member
 *  @param {number} rotX - The rotation around the x axis.
 *  @param {number} rotY - The rotation around the y axis. If undefined, the x component is used.
 *  @param {number} rotZ - The rotation around the z axis. If undefined, the x component is used.
 *  @param {number} angle - The angle of rotation about the axis vector, in degrees.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.rotateAxisAngle = function (x, y, z, a) {
    if (typeof x !== 'number' || isNaN(x)) x = 0;
    if (typeof y !== 'number' || isNaN(y)) y = 0;
    if (typeof z !== 'number' || isNaN(z)) z = 0;
    if (typeof a !== 'number' || isNaN(a)) a = 0;
    if (x === 0 && y === 0 && z === 0) z = 1;
    a = (utils.angles.deg2rad(a) || 0) / 2;
    var t         = new XCSSMatrix(),
        len       = Math.sqrt(x * x + y * y + z * z),
        cosA      = Math.cos(a),
        sinA      = Math.sin(a),
        sq        = sinA * sinA,
        sc        = sinA * cosA,
        precision = function(v) { return parseFloat((v).toFixed(6)); },
        x2, y2, z2;

    // Bad vector, use something sensible
    if (len === 0) {
        x = 0;
        y = 0;
        z = 1;
    } else if (len !== 1) {
        x /= len;
        y /= len;
        z /= len;
    }

    // Optimise cases where axis is along major axis
    if (x === 1 && y === 0 && z === 0) {
        t.m22 = t.m33 = 1 - 2 * sq;
        t.m23 = t.m32 = 2 * sc;
        t.m32 *= -1;
    } else if (x === 0 && y === 1 && z === 0) {
        t.m11 = t.m33 = 1 - 2 * sq;
        t.m13 = t.m31 = 2 * sc;
        t.m13 *= -1;
    } else if (x === 0 && y === 0 && z === 1) {
        t.m11 = t.m22 = 1 - 2 * sq;
        t.m12 = t.m21 = 2 * sc;
        t.m21 *= -1;
    } else {
        x2  = x * x;
        y2  = y * y;
        z2  = z * z;
        // http://dev.w3.org/csswg/css-transforms/#mathematical-description
        t.m11 = precision(1 - 2 * (y2 + z2) * sq);
        t.m12 = precision(2 * (x * y * sq + z * sc));
        t.m13 = precision(2 * (x * z * sq - y * sc));
        t.m21 = precision(2 * (x * y * sq - z * sc));
        t.m22 = precision(1 - 2 * (x2 + z2) * sq);
        t.m23 = precision(2 * (y * z * sq + x * sc));
        t.m31 = precision(2 * (x * z * sq + y * sc));
        t.m32 = precision(2 * (y * z * sq - x * sc));
        t.m33 = precision(1 - 2 * (x2 + y2) * sq);
    }

    return this.multiply(t);
};

/**
 *  Returns the result of scaling the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} scaleX - the scaling factor in the x axis.
 *  @param {number} scaleY - the scaling factor in the y axis. If undefined, the x component is used.
 *  @param {number} scaleZ - the scaling factor in the z axis. If undefined, 1 is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.scale = function (scaleX, scaleY, scaleZ) {
    var transform = new XCSSMatrix();

    if (typeof scaleX !== 'number' || isNaN(scaleX)) scaleX = 1;
    if (typeof scaleY !== 'number' || isNaN(scaleY)) scaleY = scaleX;
    if (typeof scaleZ !== 'number' || isNaN(scaleZ)) scaleZ = 1;

    transform.m11 = scaleX;
    transform.m22 = scaleY;
    transform.m33 = scaleZ;

    return this.multiply(transform);
};

/**
 *  Returns the result of skewing the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} skewX - The scaling factor in the x axis.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.skewX = function (degrees) {
    var radians   = utils.angles.deg2rad(degrees);
    var transform = new XCSSMatrix();

    transform.c = Math.tan(radians);

    return this.multiply(transform);
};

/**
 *  Returns the result of skewing the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} skewY - the scaling factor in the x axis.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.skewY = function (degrees) {
    var radians   = utils.angles.deg2rad(degrees);
    var transform = new XCSSMatrix();

    transform.b = Math.tan(radians);

    return this.multiply(transform);
};

/**
 *  Returns the result of translating the matrix by a given vector.
 *  @method
 *  @member
 *  @param {number} x - The x component of the vector.
 *  @param {number} y - The y component of the vector.
 *  @param {number} z - The z component of the vector. If undefined, 0 is used.
 *  @returns XCSSMatrix
 */
XCSSMatrix.prototype.translate = function (x, y, z) {
    var t = new XCSSMatrix();

    if (typeof x !== 'number' || isNaN(x)) x = 0;
    if (typeof y !== 'number' || isNaN(y)) y = 0;
    if (typeof z !== 'number' || isNaN(z)) z = 0;

    t.m41 = x;
    t.m42 = y;
    t.m43 = z;

    return this.multiply(t);
};

/**
 *  Sets the matrix values using a string representation, such as that produced
 *  by the [[XCSSMatrix#toString]] method.
 *  @method
 *  @member
 *  @params {string} domstr - A string representation of a 2D or 3D transform matrix
 *    in the form given by the CSS transform property, i.e. just like the
 *    output from [[XCSSMatrix#toString]].
 *  @returns undefined
 */
XCSSMatrix.prototype.setMatrixValue = function (domstr) {

    var matrixString = toMatrixString(domstr.trim());
    var matrixObject = utils.transp.statementToObject(matrixString);

    if (!matrixObject) return;

    var is3d   = matrixObject.key === utils.transp.matrixFn3d;
    var keygen = is3d ? indextoKey3d : indextoKey2d;
    var values = matrixObject.value;
    var count  = values.length;

    if ((is3d && count !== 16) || !(is3d || count === 6)) return;

    values.forEach(function (obj, i) {
        var key = keygen(i);
        this[key] = obj.value;
    }, this);
};

function indextoKey2d (index) {
    return String.fromCharCode(index + 97); // ASCII char 97 == 'a'
}

function indextoKey3d (index) {
    return ('m' + (Math.floor(index / 4) + 1)) + (index % 4 + 1);
}
/**
 *  Returns a string representation of the matrix.
 *  @method
 *  @memberof XCSSMatrix
 *  @returns {string} matrixString - a string like `matrix(1.000000, 0.000000, 0.000000, 1.000000, 0.000000, 0.000000)`
 *
 **/
XCSSMatrix.prototype.toString = function () {
    var points, prefix;

    if (utils.matrix.isAffine(this)) {
        prefix = utils.transp.matrixFn2d;
        points = points2d;
    } else {
        prefix = utils.transp.matrixFn3d;
        points = points3d;
    }

    return prefix + '(' +
        points.map(function (p) {
            return this[p].toFixed(6);
        }, this) .join(', ') +
        ')';
};

// ====== toMatrixString ====== //
var jsFunctions = {
    matrix: function (m, o) {
        var m2 = new XCSSMatrix(o.unparsed);

        return m.multiply(m2);
    },
    matrix3d: function (m, o) {
        var m2 = new XCSSMatrix(o.unparsed);

        return m.multiply(m2);
    },

    perspective: function (m, o) {
        var m2 = new XCSSMatrix();
        m2.m34 -= 1 / o.value[0].value;

        return m.multiply(m2);
    },

    rotate: function (m, o) {
        return m.rotate.apply(m, o.value.map(objectValues));
    },
    rotate3d: function (m, o) {
        return m.rotateAxisAngle.apply(m, o.value.map(objectValues));
    },
    rotateX: function (m, o) {
        return m.rotate.apply(m, [o.value[0].value, 0, 0]);
    },
    rotateY: function (m, o) {
        return m.rotate.apply(m, [0, o.value[0].value, 0]);
    },
    rotateZ: function (m, o) {
        return m.rotate.apply(m, [0, 0, o.value[0].value]);
    },

    scale: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scale3d: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scaleX: function (m, o) {
        return m.scale.apply(m, o.value.map(objectValues));
    },
    scaleY: function (m, o) {
        return m.scale.apply(m, [0, o.value[0].value, 0]);
    },
    scaleZ: function (m, o) {
        return m.scale.apply(m, [0, 0, o.value[0].value]);
    },

    skew: function (m, o) {
        var mX = new XCSSMatrix('skewX(' + o.value[0].unparsed + ')');
        var mY = new XCSSMatrix('skewY(' + (o.value[1]&&o.value[1].unparsed || 0) + ')');
        var sM = 'matrix(1.00000, '+ mY.b +', '+ mX.c +', 1.000000, 0.000000, 0.000000)';
        var m2 = new XCSSMatrix(sM);

        return m.multiply(m2);
    },
    skewX: function (m, o) {
        return m.skewX.apply(m, [o.value[0].value]);
    },
    skewY: function (m, o) {
        return m.skewY.apply(m, [o.value[0].value]);
    },

    translate: function (m, o) {
        return m.translate.apply(m, o.value.map(objectValues));
    },
    translate3d: function (m, o) {
        return m.translate.apply(m, o.value.map(objectValues));
    },
    translateX: function (m, o) {
        return m.translate.apply(m, [o.value[0].value, 0, 0]);
    },
    translateY: function (m, o) {
        return m.translate.apply(m, [0, o.value[0].value, 0]);
    },
    translateZ: function (m, o) {
        return m.translate.apply(m, [0, 0, o.value[0].value]);
    }
};

function objectValues(obj) {
    return obj.value;
}

function cssFunctionToJsFunction(cssFunctionName) {
    return jsFunctions[cssFunctionName];
}

function parsedToDegrees(parsed) {
    if (parsed.units === 'rad') {
        parsed.value = utils.angles.rad2deg(parsed.value);
        parsed.units = 'deg';
    }
    else if (parsed.units === 'grad') {
        parsed.value = utils.angles.grad2deg(parsed.value);
        parsed.units = 'deg';
    }

    return parsed;
}

function transformMatrix(matrix, operation) {
    // convert to degrees because all CSSMatrix methods expect degrees
    operation.value = operation.value.map(parsedToDegrees);

    var jsFunction = cssFunctionToJsFunction(operation.key);
    var result     = jsFunction(matrix, operation);

    return result || matrix;
}

/**
 *  Tranforms a `el.style.WebkitTransform`-style string
 *  (like `rotate(18rad) translate3d(50px, 100px, 10px)`)
 *  into a `getComputedStyle(el)`-style matrix string
 *  (like `matrix3d(0.660316, -0.750987, 0, 0, 0.750987, 0.660316, 0, 0, 0, 0, 1, 0, 108.114560, 28.482308, 10, 1)`)
 *  @private
 *  @method
 *  @param {string} transformString - `el.style.WebkitTransform`-style string (like `rotate(18rad) translate3d(50px, 100px, 10px)`)
 */
function toMatrixString(transformString) {
    var statements = utils.transp.stringToStatements(transformString);

    if (statements.length === 1 && (/^matrix/).test(transformString)) {
        return transformString;
    }

    // We only want the statement to pass to `utils.transp.statementToObject`
    //   not the other values (index, list) from `map`
    var statementToObject = utils.funcs.onlyFirstArg(utils.transp.statementToObject);
    var operations        = statements.map(statementToObject);
    var startingMatrix    = new XCSSMatrix();
    var transformedMatrix = operations.reduce(transformMatrix, startingMatrix);
    var matrixString      = transformedMatrix.toString();

    return matrixString;
}

module.exports = XCSSMatrix;

},{"./utils/angle":4,"./utils/cssTransformString":5,"./utils/matrix":6}],4:[function(require,module,exports){
module.exports = {
  deg2rad: deg2rad,
  rad2deg: rad2deg,
  grad2deg: grad2deg
};

/**
 *  Converts angles in degrees, which are used by the external API, to angles
 *  in radians used in internal calculations.
 *  @param {number} angle - An angle in degrees.
 *  @returns {number} radians
 */
function deg2rad(angle) {
    return angle * Math.PI / 180;
}

function rad2deg(radians) {
    return radians * (180 / Math.PI);
}

function grad2deg(gradians) {
    // 400 gradians in 360 degrees
    return gradians / (400 / 360);
}

},{}],5:[function(require,module,exports){
module.exports = {
    matrixFn2d: 'matrix',
    matrixFn3d: 'matrix3d',
    valueToObject: valueToObject,
    statementToObject: statementToObject,
    stringToStatements: stringToStatements
};

function valueToObject(value) {
    var units = /([\-\+]?[0-9]+[\.0-9]*)(deg|rad|grad|px|%)*/;
    var parts = value.match(units) || [];

    return {
        value: parseFloat(parts[1]),
        units: parts[2],
        unparsed: value
    };
}

function statementToObject(statement, skipValues) {
    var nameAndArgs    = /(\w+)\(([^\)]+)\)/i;
    var statementParts = statement.toString().match(nameAndArgs).slice(1);
    var functionName   = statementParts[0];
    var stringValues   = statementParts[1].split(/, ?/);
    var parsedValues   = !skipValues && stringValues.map(valueToObject);

    return {
        key: functionName,
        value: parsedValues || stringValues,
        unparsed: statement
    };
}

function stringToStatements(transformString) {
    var functionSignature   = /(\w+)\([^\)]+\)/ig;
    var transformStatements = transformString.match(functionSignature) || [];

    return transformStatements;
}

},{}],6:[function(require,module,exports){
module.exports = {
  determinant2x2: determinant2x2,
  determinant3x3: determinant3x3,
  determinant4x4: determinant4x4,
  isAffine: isAffine,
  isIdentityOrTranslation: isIdentityOrTranslation,
  adjoint: adjoint,
  inverse: inverse,
  multiply: multiply,
  decompose: decompose
};

/**
 *  Calculates the determinant of a 2x2 matrix.
 *  @param {number} a - Top-left value of the matrix.
 *  @param {number} b - Top-right value of the matrix.
 *  @param {number} c - Bottom-left value of the matrix.
 *  @param {number} d - Bottom-right value of the matrix.
 *  @returns {number}
 */
function determinant2x2(a, b, c, d) {
    return a * d - b * c;
}

/**
 *  Calculates the determinant of a 3x3 matrix.
 *  @param {number} a1 - Matrix value in position [1, 1].
 *  @param {number} a2 - Matrix value in position [1, 2].
 *  @param {number} a3 - Matrix value in position [1, 3].
 *  @param {number} b1 - Matrix value in position [2, 1].
 *  @param {number} b2 - Matrix value in position [2, 2].
 *  @param {number} b3 - Matrix value in position [2, 3].
 *  @param {number} c1 - Matrix value in position [3, 1].
 *  @param {number} c2 - Matrix value in position [3, 2].
 *  @param {number} c3 - Matrix value in position [3, 3].
 *  @returns {number}
 */
function determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3) {

    return a1 * determinant2x2(b2, b3, c2, c3) -
           b1 * determinant2x2(a2, a3, c2, c3) +
           c1 * determinant2x2(a2, a3, b2, b3);
}

/**
 *  Calculates the determinant of a 4x4 matrix.
 *  @param {XCSSMatrix} matrix - The matrix to calculate the determinant of.
 *  @returns {number}
 */
function determinant4x4(matrix) {
    var
        m = matrix,
        // Assign to individual variable names to aid selecting correct elements
        a1 = m.m11, b1 = m.m21, c1 = m.m31, d1 = m.m41,
        a2 = m.m12, b2 = m.m22, c2 = m.m32, d2 = m.m42,
        a3 = m.m13, b3 = m.m23, c3 = m.m33, d3 = m.m43,
        a4 = m.m14, b4 = m.m24, c4 = m.m34, d4 = m.m44;

    return a1 * determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) -
           b1 * determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) +
           c1 * determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) -
           d1 * determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
}

/**
 *  Determines whether the matrix is affine.
 *  @returns {boolean}
 */
function isAffine(matrix) {
    return matrix.m13 === 0 && matrix.m14 === 0 &&
           matrix.m23 === 0 && matrix.m24 === 0 &&
           matrix.m31 === 0 && matrix.m32 === 0 &&
           matrix.m33 === 1 && matrix.m34 === 0 &&
           matrix.m43 === 0 && matrix.m44 === 1;
}

/**
 *  Returns whether the matrix is the identity matrix or a translation matrix.
 *  @return {boolean}
 */
function isIdentityOrTranslation(matrix) {
    var m = matrix;

    return m.m11 === 1 && m.m12 === 0 && m.m13 === 0 && m.m14 === 0 &&
           m.m21 === 0 && m.m22 === 1 && m.m23 === 0 && m.m24 === 0 &&
           m.m31 === 0 && m.m31 === 0 && m.m33 === 1 && m.m34 === 0 &&
    /* m41, m42 and m43 are the translation points */   m.m44 === 1;
}

/**
 *  Returns the adjoint matrix.
 *  @return {XCSSMatrix}
 */
function adjoint(matrix) {
    var m = matrix,
        // make `result` the same type as the given metric
        result = new matrix.constructor(),

        a1 = m.m11, b1 = m.m12, c1 = m.m13, d1 = m.m14,
        a2 = m.m21, b2 = m.m22, c2 = m.m23, d2 = m.m24,
        a3 = m.m31, b3 = m.m32, c3 = m.m33, d3 = m.m34,
        a4 = m.m41, b4 = m.m42, c4 = m.m43, d4 = m.m44;

    // Row column labeling reversed since we transpose rows & columns
    result.m11 =  determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
    result.m21 = -determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
    result.m31 =  determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
    result.m41 = -determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);

    result.m12 = -determinant3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
    result.m22 =  determinant3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
    result.m32 = -determinant3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
    result.m42 =  determinant3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);

    result.m13 =  determinant3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
    result.m23 = -determinant3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
    result.m33 =  determinant3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
    result.m43 = -determinant3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);

    result.m14 = -determinant3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
    result.m24 =  determinant3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
    result.m34 = -determinant3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
    result.m44 =  determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);

    return result;
}

function inverse(matrix) {
  var inv;

  if (isIdentityOrTranslation(matrix)) {
      inv = new matrix.constructor();

      if (!(matrix.m41 === 0 && matrix.m42 === 0 && matrix.m43 === 0)) {
          inv.m41 = -matrix.m41;
          inv.m42 = -matrix.m42;
          inv.m43 = -matrix.m43;
      }

      return inv;
  }

  // Calculate the adjoint matrix
  var result = adjoint(matrix);

  // Calculate the 4x4 determinant
  var det = determinant4x4(matrix);

  // If the determinant is zero, then the inverse matrix is not unique
  if (Math.abs(det) < 1e-8) return null;

  // Scale the adjoint matrix to get the inverse
  for (var i = 1; i < 5; i++) {
      for (var j = 1; j < 5; j++) {
          result[('m' + i) + j] /= det;
      }
  }

  return result;
}

function multiply(matrix, otherMatrix) {
  if (!otherMatrix) return null;

  var a = otherMatrix,
      b = matrix,
      c = new matrix.constructor();

  c.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41;
  c.m12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42;
  c.m13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43;
  c.m14 = a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44;

  c.m21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41;
  c.m22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42;
  c.m23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43;
  c.m24 = a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44;

  c.m31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41;
  c.m32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42;
  c.m33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43;
  c.m34 = a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44;

  c.m41 = a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41;
  c.m42 = a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42;
  c.m43 = a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43;
  c.m44 = a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44;

  return c;
}

function transpose(matrix) {
  var result = new matrix.constructor();
  var rows = 4, cols = 4;
  var i = cols, j;
  while (i) {
    j = rows;
    while (j) {
      result['m' + i + j] = matrix['m'+ j + i];
      j--;
    }
    i--;
  }
  return result;
}

/*
  Input:  matrix      ; a 4x4 matrix
  Output: translation ; a 3 component vector
          scale       ; a 3 component vector
          skew        ; skew factors XY,XZ,YZ represented as a 3 component vector
          perspective ; a 4 component vector
          rotate  ; a 4 component vector
  Returns false if the matrix cannot be decomposed, true if it can
*/
var Vector4 = require('../Vector4.js');
function decompose(matrix) {
  var perspectiveMatrix, rightHandSide, inversePerspectiveMatrix, transposedInversePerspectiveMatrix,
      perspective, translate, row, i, len, scale, skew, pdum3, rotate;

  // Normalize the matrix.
  if (matrix.m33 == 0) { return false; }

  for (i = 1; i <= 4; i++) {
    for (j = 1; j < 4; j++) {
      matrix['m'+i+j] /= matrix.m44;
    }
  }

  // perspectiveMatrix is used to solve for perspective, but it also provides
  // an easy way to test for singularity of the upper 3x3 component.
  perspectiveMatrix = matrix;
  perspectiveMatrix.m14 = 0;
  perspectiveMatrix.m24 = 0;
  perspectiveMatrix.m34 = 0;
  perspectiveMatrix.m44 = 1;

  if (determinant4x4(perspectiveMatrix) == 0) {
    return false;
  }

  // First, isolate perspective.
  if (matrix.m14 != 0 || matrix.m24 != 0 || matrix.m34 != 0) {
    // rightHandSide is the right hand side of the equation.
    rightHandSide = new Vector4(matrix.m14, matrix.m24, matrix.m34, matrix.m44);

    // Solve the equation by inverting perspectiveMatrix and multiplying
    // rightHandSide by the inverse.
    inversePerspectiveMatrix = inverse(perspectiveMatrix);
    transposedInversePerspectiveMatrix = transpose(inversePerspectiveMatrix);
    perspective = rightHandSide.multiplyByMatrix(transposedInversePerspectiveMatrix);
  }
  else {
    // No perspective.
    perspective = new Vector4(0, 0, 0, 1);
  }

  // Next take care of translation
  translate = new Vector4(matrix.m41, matrix.m42, matrix.m43);

  // Now get scale and shear. 'row' is a 3 element array of 3 component vectors
  row = [ new Vector4(), new Vector4(), new Vector4() ];
  for (i = 1, len = row.length; i < len; i++) {
    row[i-1].x = matrix['m'+i+'1'];
    row[i-1].y = matrix['m'+i+'2'];
    row[i-1].z = matrix['m'+i+'3'];
  }

  // Compute X scale factor and normalize first row.
  scale = new Vector4();
  skew = new Vector4();

  scale.x = row[0].length();
  row[0] = row[0].normalize();

  // Compute XY shear factor and make 2nd row orthogonal to 1st.
  skew.x = row[0].dot(row[1]);
  row[1] = row[1].combine(row[0], 1.0, -skew.x);

  // Now, compute Y scale and normalize 2nd row.
  scale.y = row[1].length();
  row[1] = row[1].normalize();
  skew.x /= scale.y;

  // Compute XZ and YZ shears, orthogonalize 3rd row
  skew.y = row[0].dot(row[2]);
  row[2] = row[2].combine(row[0], 1.0, -skew.y);
  skew.z = row[1].dot(row[2]);
  row[2] = row[2].combine(row[1], 1.0, -skew.z);

  // Next, get Z scale and normalize 3rd row.
  scale.z = row[2].length();
  row[2] = row[2].normalize();
  skew.y = (skew.y / scale.z) || 0;
  skew.z = (skew.z / scale.z) || 0;

  // At this point, the matrix (in rows) is orthonormal.
  // Check for a coordinate system flip.  If the determinant
  // is -1, then negate the matrix and the scaling factors.
  pdum3 = row[1].cross(row[2]);
  if (row[0].dot(pdum3) < 0) {
    for (i = 0; i < 3; i++) {
      scale.x *= -1;
      row[i].x *= -1;
      row[i].y *= -1;
      row[i].z *= -1;
    }
  }

  // Now, get the rotations out
  // FROM W3C
  rotate = new Vector4();
  rotate.x = 0.5 * Math.sqrt(Math.max(1 + row[0].x - row[1].y - row[2].z, 0));
  rotate.y = 0.5 * Math.sqrt(Math.max(1 - row[0].x + row[1].y - row[2].z, 0));
  rotate.z = 0.5 * Math.sqrt(Math.max(1 - row[0].x - row[1].y + row[2].z, 0));
  rotate.w = 0.5 * Math.sqrt(Math.max(1 + row[0].x + row[1].y + row[2].z, 0));

  // if (row[2].y > row[1].z) rotate[0] = -rotate[0];
  // if (row[0].z > row[2].x) rotate[1] = -rotate[1];
  // if (row[1].x > row[0].y) rotate[2] = -rotate[2];

  // FROM MORF.JS
  rotate.y = Math.asin(-row[0].z);
  if (Math.cos(rotate.y) != 0) {
    rotate.x = Math.atan2(row[1].z, row[2].z);
    rotate.z = Math.atan2(row[0].y, row[0].x);
  } else {
    rotate.x = Math.atan2(-row[2].x, row[1].y);
    rotate.z = 0;
  }

  // FROM http://blog.bwhiting.co.uk/?p=26
  // scale.x2 = Math.sqrt(matrix.m11*matrix.m11 + matrix.m21*matrix.m21 + matrix.m31*matrix.m31);
  // scale.y2 = Math.sqrt(matrix.m12*matrix.m12 + matrix.m22*matrix.m22 + matrix.m32*matrix.m32);
  // scale.z2 = Math.sqrt(matrix.m13*matrix.m13 + matrix.m23*matrix.m23 + matrix.m33*matrix.m33);

  // rotate.x2 = Math.atan2(matrix.m23/scale.z2, matrix.m33/scale.z2);
  // rotate.y2 = -Math.asin(matrix.m13/scale.z2);
  // rotate.z2 = Math.atan2(matrix.m12/scale.y2, matrix.m11/scale.x2);

  return {
    perspective : perspective,
    translate   : translate,
    skew        : skew,
    scale       : scale,
    rotate      : rotate
  };
}

},{"../Vector4.js":2}],7:[function(require,module,exports){
module.exports = {
  length           : length,
  normalize        : normalize,
  dot              : dot,
  cross            : cross,
  combine          : combine,
  multiplyByMatrix : multiplyByMatrix
};

/**
 * Get the length of the vector
 * @author Joe Lambert
 * @returns {float}
 */

function length(vector) {
  return Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
}


/**
 * Get a normalized representation of the vector
 * @author Joe Lambert
 * @returns {Vector4}
 */

function normalize(vector) {
  var len = length(vector),
    v = new vector.constructor(vector.x / len, vector.y / len, vector.z / len);

  return v;
}


/**
 * Vector Dot-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {float} The Dot-Product of a and b.
 */

function dot(a, b) {
  return a.x*b.x + a.y*b.y + a.z*b.z + a.w*b.w;
}


/**
 * Vector Cross-Product
 * @param {Vector4} v The second vector to apply the product to
 * @author Joe Lambert
 * @returns {Vector4} The Cross-Product of a and b.
 */

function cross(a, b) {
  return new a.constructor(
    (a.y * b.z) - (a.z * b.y),
    (a.z * b.x) - (a.x * b.z),
    (a.x * b.y) - (a.y * b.x)
  );
}


/**
 * Helper function required for matrix decomposition
 * A Javascript implementation of pseudo code available from http://www.w3.org/TR/css3-2d-transforms/#matrix-decomposition
 * @param {Vector4} aPoint A 3D point
 * @param {float} ascl
 * @param {float} bscl
 * @author Joe Lambert
 * @returns {Vector4}
 */

function combine(aPoint, bPoint, ascl, bscl) {
  return new aPoint.constructor(
    (ascl * aPoint.x) + (bscl * bPoint.x),
    (ascl * aPoint.y) + (bscl * bPoint.y),
    (ascl * aPoint.z) + (bscl * bPoint.z)
  );
}

function multiplyByMatrix(vector, matrix) {
  return new vector.constructor(
    (matrix.m11 * vector.x) + (matrix.m12 * vector.y) + (matrix.m13 * vector.z),
    (matrix.m21 * vector.x) + (matrix.m22 * vector.y) + (matrix.m23 * vector.z),
    (matrix.m31 * vector.x) + (matrix.m32 * vector.y) + (matrix.m33 * vector.z)
  );
}

},{}],8:[function(require,module,exports){
// Component handles storing the state of a Component that is attached to a Node.
var Component = function(node){
    this.node = node ? node : null;
}

module.exports = Component;

},{}],9:[function(require,module,exports){
var Component = require('./Component');
var Matrix = require('xcssmatrix');

var DOMComponent = function(node, elem, container){
    this.node = node.id ? node.id : node;
    this.elem = elem ? elem : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    this.elem.classList.add(this.node);
    this.elem.classList.add('node');
    container.appendChild(this.elem);

    this.transform(node);
};

DOMComponent.prototype = Object.create(Component.prototype);
DOMComponent.prototype.constructor = Component;



DOMComponent.prototype.transform = function(node){



  // var matrix = new Matrix('translate3d('+node.translate[0]+'px,'+node.translate[1]+'px,'+node.translate[2]+'px) '+
  //                         'scale3d('+node.scale[0]+'%,'+node.scale[1]+'%,'+node.scale[2]+'%) '+
  //                         'rotateX('+node.rotate[0]+'deg) '+
  //                         'rotateY('+node.rotate[1]+'deg) '+
  //                         'rotateZ('+node.rotate[2]+'deg)');
  var matrix = new Matrix();
  if(node.translate) {
    matrix = matrix.translate(node.translate[0],node.translate[1],node.translate[2]);
  }
  if(node.scale) {
    matrix = matrix.scale(node.scale[0], node.scale[1], node.scale[2]);
  }
  if(node.rotate) {
    matrix = matrix.rotate(node.rotate[0], node.rotate[1], node.rotate[2]);
  }
  this.elem.style.webkitTransform = matrix.toString();

  // if(node.opacity) {
  //   this.elem.style.opacity = node.opacity;
  // }
  // if(node.position) {
  //   this.elem.style.position = node.position;
  // }
  // if(node.size) {
  //   this.elem.style.width = node.size[0]+'px';
  //   this.elem.style.height = node.size[1]+'px';
  // }
  // if(node.origin) {
  //   this.elem.style.transformOrigin = node.origin[0]+'%,'+node.origin[1]+'%,'+node.origin[2]+'%';
  // }
  //TODO: Figure out how to get browser to output css matrix3D transform



};

module.exports = DOMComponent;

},{"./Component":8,"xcssmatrix":1}],10:[function(require,module,exports){
module.exports = {
    Component: require('./Component'),
    DOMComponent: require('./DOMComponent')
};

},{"./Component":8,"./DOMComponent":9}],11:[function(require,module,exports){

var Engine = function(){

    this.time = performance.now();
    this._worker = null;
    this.updateQueue = [];

}

Engine.prototype.init = function(worker){
    window.requestAnimationFrame(this.tick.bind(this));
    if(worker){
        this._worker = worker;
        this._worker.postMessage({init:'done'});
    }
}

Engine.prototype.tick = function(time){

    var item;
    this.time = performance.now();

    if(this._worker){
        this._worker.postMessage({frame:this.time});
    }

    while (this.updateQueue.length) {
      item = this.updateQueue.shift();
      if (item && item.update) item.update(this.time);
      if (item && item.onUpdate) item.onUpdate(this.time);
    }

    window.requestAnimationFrame(this.tick.bind(this));

}


module.exports = new Engine();

},{}],12:[function(require,module,exports){
// Node handles storing the state of a node on the Scene Graph.
var Transitionable = require('../transitions/Transitionable');
var Curves = require('../transitions/Curves');

var _observableCallback = {};

var Node = function(conf, parent){

    this.transitionables = {};

    if(conf){
        this.serialize(conf);
    } else {
        this.setDefaults();
    }

    parent ? this.parent = parent : this.parent = null;

};

Node.prototype.setDefaults = function(conf){
    this.position = 'absolute';
    this.translate = [0,0,0];
    this.origin = [0.0,0.0,0.0];
    this.align = [0.0,0.0,0.0];
    this.size = [0,0,0];
    this.scale = [1.0,1.0,1.0];
    this.rotate = [0,0,0];
    this.opacity = 1.0;
};

Node.prototype.serialize = function(conf){
    this.id = conf.id ? conf.id : null;
    this.position = conf.position ? conf.position : 'absolute';
    this.translate = conf.translate ? conf.translate : [0,0,0];
    this.origin = conf.origin ? conf.origin : [0.0,0.0,0.0];
    this.align = conf.align ? conf.align : [0.0,0.0,0.0];
    this.size = conf.size ? conf.size : [0,0,0];
    this.scale = conf.scale ? conf.scale : [1.0,1.0,1.0];
    this.rotate = conf.rotate ? conf.rotate : [0,0,0];
    this.opacity = conf.opacity ? conf.opacity : 1.0;
    this.observe(this.id, this);
    conf.transition ? this.setTransitionable(conf.transition) : false;
};

Node.prototype.getProperties = function(){
    return {
        position: this.position,
        translate: this.translate,
        origin: this.origin,
        align: this.align,
        size: this.size,
        scale: this.scale,
        rotate: this.rotate,
        opacity: this.opacity,
        transitionables: this.transitionables//,
        //observables: this.observables
    }
};

Node.prototype.setPosition = function(pos){
    this.position = pos;
};

Node.prototype.getPosition = function(){
    return this.position;
};

Node.prototype.setTranslation = function(pos){
    this.translate = pos;
};

Node.prototype.getTranslation = function(){
    return this.translate;
};

Node.prototype.setSize = function(size){
    this.size = size;
};

Node.prototype.getSize = function(){
    return this.size;
};

Node.prototype.setScale = function(scale){
    this.scale = scale;
};

Node.prototype.getScale = function(){
    return this.scale;
};

Node.prototype.setOrigin = function(origin){
    this.origin = origin;
};

Node.prototype.getOrigin = function(){
    return this.origin;
};

Node.prototype.setAlign = function(align){
    this.align = align;
};

Node.prototype.getAlign = function(){
    return this.align;
};

Node.prototype.setRotation = function(rotation){
    this.rotation = rotation;
};

Node.prototype.getRotation = function(){
    return this.rotation;
};

Node.prototype.setOpacity = function(opacity){
    this.opacity = opacity;
};

Node.prototype.getOpacity = function(){
    return this.opacity;
};

Node.prototype.setTransitionable = function(conf){
    var n  = this;

    n.transitionables[conf.t] = conf;
    n.transitionables[conf.t].transition = new Transitionable(conf.from);
    n.transitionables[conf.t].transition.set(conf.to);
    //n.transitionables[conf.t].transition.set(conf.to);
    if(conf.delay) {
      n.transit(conf);
    } else {
      n.transitionables[conf.t]
       .transition
       .from(conf.from)
       .to(conf.to, conf.curve, conf.duration);
    }


    this[conf.t] = conf.to;
    n.transitionables[conf.t].transition.id = this.id;
    n.transitionables[conf.t].transition.param = conf.t;
    this.observe(this.id+'-'+conf.t, n.transitionables[conf.t].transition);
    //console.log(conf.t, this[conf.t], n.transitionables[conf.t].transition.get());
    //TODO: figure out a better way to update Transitionable
    setInterval(function(){
      n.transitionables[conf.t].transition.get();
    },10);

};

Node.prototype.transit = function(conf){
    var n  = this;
    if(conf.delay) {

      n.transitionables[conf.t].transition.from(conf.from).delay(conf.delay).to(conf.to, conf.curve, conf.duration);
    }
};

Node.prototype.observe = function(id, obj) {
      var n = this;
      _observableCallback[id] = function(changes){
          changes.forEach(function(change) {
            if(change.type === 'update' && change.name !== 'id') {
              //TODO:broadcast change to scene

              if(change.object.constructor.name === 'Transitionable'){
                n[change.object.param] = change.oldValue;
              } else {
                n.parent.update({
                              message:{
                                prop: change.name,
                                val: change.oldValue
                              },
                              node: n.id
                            });
                // console.log({
                //               message:{
                //                 prop: change.name,
                //                 val: change.oldValue
                //               },
                //               node: n.id
                //             });
              }

            }
          });
      };
      Object.observe(obj, _observableCallback[id]);

};

Node.prototype.unobserve = function(param) {
    Object.unobserve(this, _observableCallback[this.id]);
};


Node.prototype.eventManager = function(){

  var events = {};
  var hasEvent = events.hasOwnProperty;

  return {
    sub: function(ev, listener) {

      this.observe(ev, this);
      // Create the event's object if not yet created
      if(!hasEvent.call(events, ev)) events[ev] = [];

      // Add the listener to queue
      var index = events[ev].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          this.unobserve(ev);
          delete events[ev][index];
        }
      };
    },
    pub: function(ev, info) {
      // If the event doesn't exist, or there's no listeners in queue, just leave
      if(!hasEvent.call(events, ev)) return;

      // Cycle through events queue, fire!
      events[ev].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
};

module.exports = Node;

},{"../transitions/Curves":22,"../transitions/Transitionable":23}],13:[function(require,module,exports){
var cxt = self;

var Scene = function(graph){

    this.graph = graph || {};
    this.length = 0;

}

Scene.prototype.init = function(worker) {
    if(worker){
        this.worker = worker;
    }
    console.log(this.worker);
}

Scene.prototype.addChild = function(node){
    node.id = 'node-'+this.length;
    this.length++;
    this.graph[node.id] = node;
}


Scene.prototype.fetchNode = function(id) {
    return this.graph[id];
}

Scene.prototype.find = function(query) {
    var queryArray = [];
    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    queryArray.push(this.graph[prop]);
                }
            }
        }
    }
    return queryArray;
}

Scene.prototype.findOne = function(query) {

    for(q in query){
        for(prop in this.graph) {
            for(p in this.graph[prop]){
                if (p === q && this.graph[prop][p] === query[q]) {
                    return this.graph[prop];
                }
            }
        }
    }

}


Scene.prototype.update = function(change){
  cxt.postMessage(JSON.parse(JSON.stringify(change)));
}

module.exports = new Scene();

},{}],14:[function(require,module,exports){
module.exports = {
    Engine: require('./Engine'),
    Scene: require('./Scene'),
    Node: require('./Node')
};

},{"./Engine":11,"./Node":12,"./Scene":13}],15:[function(require,module,exports){
module.exports = {
    core: require('./core'),
    components: require('./components'),
    math: require('./math'),
    transitions: require('./transitions')
};

},{"./components":10,"./core":14,"./math":21,"./transitions":24}],16:[function(require,module,exports){
/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

'use strict';

/**
 * A 3x3 numerical matrix, represented as an array.
 *
 * @class Mat33
 *
 * @param {Array} values a 3x3 matrix flattened
 */
function Mat33(values) {
    this.values = values || [1,0,0,0,1,0,0,0,1];
}

/**
 * Return the values in the Mat33 as an array.
 *
 * @method
 *
 * @return {Array} matrix values as array of rows.
 */
Mat33.prototype.get = function get() {
    return this.values;
};

/**
 * Set the values of the current Mat33.
 *
 * @method
 *
 * @param {Array} values Array of nine numbers to set in the Mat33.
 *
 * @return {Mat33} this
 */
Mat33.prototype.set = function set(values) {
    this.values = values;
    return this;
};

/**
 * Copy the values of the input Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix The Mat33 to copy.
 * 
 * @return {Mat33} this
 */
Mat33.prototype.copy = function copy(matrix) {
    var A = this.values;
    var B = matrix.values;

    A[0] = B[0];
    A[1] = B[1];
    A[2] = B[2];
    A[3] = B[3];
    A[4] = B[4];
    A[5] = B[5];
    A[6] = B[6];
    A[7] = B[7];
    A[8] = B[8];

    return this;
};

/**
 * Take this Mat33 as A, input vector V as a column vector, and return Mat33 product (A)(V).
 *
 * @method
 *
 * @param {Vec3} v Vector to rotate.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The input vector after multiplication.
 */
Mat33.prototype.vectorMultiply = function vectorMultiply(v, output) {
    var M = this.values;
    var v0 = v.x;
    var v1 = v.y;
    var v2 = v.z;

    output.x = M[0]*v0 + M[1]*v1 + M[2]*v2;
    output.y = M[3]*v0 + M[4]*v1 + M[5]*v2;
    output.z = M[6]*v0 + M[7]*v1 + M[8]*v2;

    return output;
};

/**
 * Multiply the provided Mat33 with the current Mat33.  Result is (this) * (matrix).
 *
 * @method
 *
 * @param {Mat33} matrix Input Mat33 to multiply on the right.
 *
 * @return {Mat33} this
 */
Mat33.prototype.multiply = function multiply(matrix) {
    var A = this.values;
    var B = matrix.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    A[0] = A0*B0 + A1*B3 + A2*B6;
    A[1] = A0*B1 + A1*B4 + A2*B7;
    A[2] = A0*B2 + A1*B5 + A2*B8;
    A[3] = A3*B0 + A4*B3 + A5*B6;
    A[4] = A3*B1 + A4*B4 + A5*B7;
    A[5] = A3*B2 + A4*B5 + A5*B8;
    A[6] = A6*B0 + A7*B3 + A8*B6;
    A[7] = A6*B1 + A7*B4 + A8*B7;
    A[8] = A6*B2 + A7*B5 + A8*B8;

    return this;
};

/**
 * Transposes the Mat33.
 *
 * @method
 *
 * @return {Mat33} this
 */
Mat33.prototype.transpose = function transpose() {
    var M = this.values;

    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];

    M[1] = M3;
    M[2] = M6;
    M[3] = M1;
    M[5] = M7;
    M[6] = M2;
    M[7] = M5;

    return this;
};

/**
 * The determinant of the Mat33.
 *
 * @method
 *
 * @return {Number} The determinant.
 */
Mat33.prototype.getDeterminant = function getDeterminant() {
    var M = this.values;

    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M[0]*(M4*M8 - M5*M7) -
              M[1]*(M3*M8 - M5*M6) +
              M[2]*(M3*M7 - M4*M6);

    return det;
};

/**
 * The inverse of the Mat33.
 *
 * @method
 *
 * @return {Mat33} this
 */
Mat33.prototype.inverse = function inverse() {
    var M = this.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7) -
              M1*(M3*M8 - M5*M6) +
              M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-40) return null;

    det = 1 / det;

    M[0] = (M4*M8 - M5*M7) * det;
    M[3] = (-M3*M8 + M5*M6) * det;
    M[6] = (M3*M7 - M4*M6) * det;
    M[1] = (-M1*M8 + M2*M7) * det;
    M[4] = (M0*M8 - M2*M6) * det;
    M[7] = (-M0*M7 + M1*M6) * det;
    M[2] = (M1*M5 - M2*M4) * det;
    M[5] = (-M0*M5 + M2*M3) * det;
    M[8] = (M0*M4 - M1*M3) * det;

    return this;
};

/**
 * Clones the input Mat33.
 *
 * @method
 *
 * @param {Mat33} m Mat33 to clone.
 *
 * @return {Mat33} New copy of the original Mat33.
 */
Mat33.clone = function clone(m) {
    return new Mat33(m.values.slice());
};

/**
 * The inverse of the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to invert.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the invert.
 */
Mat33.inverse = function inverse(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7) -
              M1*(M3*M8 - M5*M6) +
              M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-40) return null;

    det = 1 / det;

    result[0] = (M4*M8 - M5*M7) * det;
    result[3] = (-M3*M8 + M5*M6) * det;
    result[6] = (M3*M7 - M4*M6) * det;
    result[1] = (-M1*M8 + M2*M7) * det;
    result[4] = (M0*M8 - M2*M6) * det;
    result[7] = (-M0*M7 + M1*M6) * det;
    result[2] = (M1*M5 - M2*M4) * det;
    result[5] = (-M0*M5 + M2*M3) * det;
    result[8] = (M0*M4 - M1*M3) * det;

    return output;
};

/**
 * Transposes the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to transpose.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the transpose.
 */
Mat33.transpose = function transpose(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    result[0] = M0;
    result[1] = M3;
    result[2] = M6;
    result[3] = M1;
    result[4] = M4;
    result[5] = M7;
    result[6] = M2;
    result[7] = M5;
    result[8] = M8;

    return output;
};

/**
 * Add the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the addition.
 */
Mat33.add = function add(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 + B0;
    result[1] = A1 + B1;
    result[2] = A2 + B2;
    result[3] = A3 + B3;
    result[4] = A4 + B4;
    result[5] = A5 + B5;
    result[6] = A6 + B6;
    result[7] = A7 + B7;
    result[8] = A8 + B8;

    return output;
};

/**
 * Subtract the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the subtraction.
 */
Mat33.subtract = function subtract(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 - B0;
    result[1] = A1 - B1;
    result[2] = A2 - B2;
    result[3] = A3 - B3;
    result[4] = A4 - B4;
    result[5] = A5 - B5;
    result[6] = A6 - B6;
    result[7] = A7 - B7;
    result[8] = A8 - B8;

    return output;
};
/**
 * Multiply the provided Mat33 M2 with this Mat33.  Result is (this) * (M2).
 *
 * @method
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} the result of the multiplication.
 */
Mat33.multiply = function multiply(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0*B0 + A1*B3 + A2*B6;
    result[1] = A0*B1 + A1*B4 + A2*B7;
    result[2] = A0*B2 + A1*B5 + A2*B8;
    result[3] = A3*B0 + A4*B3 + A5*B6;
    result[4] = A3*B1 + A4*B4 + A5*B7;
    result[5] = A3*B2 + A4*B5 + A5*B8;
    result[6] = A6*B0 + A7*B3 + A8*B6;
    result[7] = A6*B1 + A7*B4 + A8*B7;
    result[8] = A6*B2 + A7*B5 + A8*B8;

    return output;
};

module.exports = Mat33;

},{}],17:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

'use strict';

var sin = Math.sin;
var cos = Math.cos;
var asin = Math.asin;
var acos = Math.acos;
var atan2 = Math.atan2;
var sqrt = Math.sqrt;

/**
 * A vector-like object used to represent rotations. If theta is the angle of
 * rotation, and (x', y', z') is a normalized vector representing the axis of
 * rotation, then w = cos(theta/2), x = sin(theta/2)*x', y = sin(theta/2)*y',
 * and z = sin(theta/2)*z'.
 *
 * @class Quaternion
 *
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
function Quaternion(w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

/**
 * Multiply the current Quaternion by input Quaternion q.
 * Left-handed multiplication.
 *
 * @method
 *
 * @param {Quaternion} q The Quaternion to multiply by on the right.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.multiply = function multiply(q) {
    var x1 = this.x;
    var y1 = this.y;
    var z1 = this.z;
    var w1 = this.w;
    var x2 = q.x;
    var y2 = q.y;
    var z2 = q.z;
    var w2 = q.w || 0;

    this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    this.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    this.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    this.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return this;
};

/**
 * Multiply the current Quaternion by input Quaternion q on the left, i.e. q * this.
 * Left-handed multiplication.
 *
 * @method
 *
 * @param {Quaternion} q The Quaternion to multiply by on the left.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.leftMultiply = function leftMultiply(q) {
    var x1 = q.x;
    var y1 = q.y;
    var z1 = q.z;
    var w1 = q.w || 0;
    var x2 = this.x;
    var y2 = this.y;
    var z2 = this.z;
    var w2 = this.w;

    this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
    this.x = x1*w2 + x2*w1 + y2*z1 - y1*z2;
    this.y = y1*w2 + y2*w1 + x1*z2 - x2*z1;
    this.z = z1*w2 + z2*w1 + x2*y1 - x1*y2;
    return this;
};

/**
 * Apply the current Quaternion to input Vec3 v, according to
 * v' = ~q * v * q.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The rotated version of the Vec3.
 */
Quaternion.prototype.rotateVector = function rotateVector(v, output) {
    var cw = this.w;
    var cx = -this.x;
    var cy = -this.y;
    var cz = -this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Invert the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.invert = function invert() {
    this.w = -this.w;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * Conjugate the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.conjugate = function conjugate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * Compute the length (norm) of the current Quaternion.
 *
 * @method
 *
 * @return {Number} length of the Quaternion
 */
Quaternion.prototype.length = function length() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return sqrt(w * w + x * x + y * y + z * z);
};

/**
 * Alter the current Quaternion to be of unit length;
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.normalize = function normalize() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return this;
    length = 1 / length;
    this.w *= length;
    this.x *= length;
    this.y *= length;
    this.z *= length;
    return this;
};

/**
 * Set the w, x, y, z components of the current Quaternion.
 *
 * @method
 *
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.set = function set(w, x ,y, z) {
    if (w != null) this.w = w;
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;
    return this;
};

/**
 * Copy input Quaternion q onto the current Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.copy = function copy(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
};

/**
 * Reset the current Quaternion.
 *
 * @method
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.clear = function clear() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * The dot product. Can be used to determine the cosine of the angle between
 * the two rotations, assuming both Quaternions are of unit length.
 *
 * @method
 *
 * @param {Quaternion} q The other Quaternion.
 *
 * @return {Number} the resulting dot product
 */
Quaternion.prototype.dot = function dot(q) {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
};

/**
 * Spherical linear interpolation.
 *
 * @method
 *
 * @param {Quaternion} q The final orientation.
 * @param {Number} t The tween parameter.
 * @param {Vec3} output Vec3 in which to put the result.
 *
 * @return {Quaternion} The quaternion the slerp results were saved to
 */
Quaternion.prototype.slerp = function slerp(q, t, output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var qw = q.w;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;

    var omega;
    var cosomega;
    var sinomega;
    var scaleFrom;
    var scaleTo;

    cosomega = w * qw + x * qx + y * qy + z * qz;
    if ((1.0 - cosomega) > 1e-5) {
        omega = acos(cosomega);
        sinomega = sin(omega);
        scaleFrom = sin((1.0 - t) * omega) / sinomega;
        scaleTo = sin(t * omega) / sinomega;
    }
    else {
        scaleFrom = 1.0 - t;
        scaleTo = t;
    }

    output.w = w * scaleFrom + qw * scaleTo;
    output.x = x * scaleFrom + qx * scaleTo;
    output.y = y * scaleFrom + qy * scaleTo;
    output.z = z * scaleFrom + qz * scaleTo;

    return output;
};

/**
 * Get the Mat33 matrix corresponding to the current Quaternion.
 *
 * @method
 *
 * @param {Object} output Object to process the Transform matrix
 *
 * @return {Array} the Quaternion as a Transform matrix
 */
Quaternion.prototype.toMatrix = function toMatrix(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x*x;
    var yy = y*y;
    var zz = z*z;
    var xy = x*y;
    var xz = x*z;
    var yz = y*z;

    return output.set([
        1 - 2 * (yy + zz), 2 * (xy - w*z), 2 * (xz + w*y),
        2 * (xy + w*z), 1 - 2 * (xx + zz), 2 * (yz - w*x),
        2 * (xz - w*y), 2 * (yz + w*x), 1 - 2 * (xx + yy)
    ]);
};

/**
 * The rotation angles about the x, y, and z axes corresponding to the
 * current Quaternion, when applied in the ZYX order.
 *
 * @method
 *
 * @param {Vec3} output Vec3 in which to put the result.
 *
 * @return {Vec3} the Vec3 the result was stored in
 */
Quaternion.prototype.toEuler = function toEuler(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x * x;
    var yy = y * y;
    var zz = z * z;

    var ty = 2 * (x * z + y * w);
    ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

    output.x = atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
    output.y = asin(ty);
    output.z = atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));

    return output;
};

/**
 * The Quaternion corresponding to the Euler angles x, y, and z,
 * applied in the ZYX order.
 *
 * @method
 *
 * @param {Number} x The angle of rotation about the x axis.
 * @param {Number} y The angle of rotation about the y axis.
 * @param {Number} z The angle of rotation about the z axis.
 * @param {Quaternion} output Quaternion in which to put the result.
 *
 * @return {Quaternion} The equivalent Quaternion.
 */
Quaternion.prototype.fromEuler = function fromEuler(x, y, z) {
    var hx = x * 0.5;
    var hy = y * 0.5;
    var hz = z * 0.5;

    var sx = sin(hx);
    var sy = sin(hy);
    var sz = sin(hz);
    var cx = cos(hx);
    var cy = cos(hy);
    var cz = cos(hz);

    this.w = cx * cy * cz - sx * sy * sz;
    this.x = sx * cy * cz + cx * sy * sz;
    this.y = cx * sy * cz - sx * cy * sz;
    this.z = cx * cy * sz + sx * sy * cz;

    return this;
};

/**
 * Alter the current Quaternion to reflect a rotation of input angle about
 * input axis x, y, and z.
 *
 * @method
 *
 * @param {Number} angle The angle of rotation.
 * @param {Vec3} x The axis of rotation.
 * @param {Vec3} y The axis of rotation.
 * @param {Vec3} z The axis of rotation.
 *
 * @return {Quaternion} this
 */
Quaternion.prototype.fromAngleAxis = function fromAngleAxis(angle, x, y, z) {
    var len = sqrt(x * x + y * y + z * z);
    if (len === 0) {
        this.w = 1;
        this.x = this.y = this.z = 0;
    }
    else {
        len = 1 / len;
        var halfTheta = angle * 0.5;
        var s = sin(halfTheta);
        this.w = cos(halfTheta);
        this.x = s * x * len;
        this.y = s * y * len;
        this.z = s * z * len;
    }
    return this;
};

/**
 * Multiply the input Quaternions.
 * Left-handed coordinate system multiplication.
 *
 * @method
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The product of multiplication.
 */
Quaternion.multiply = function multiply(q1, q2, output) {
    var w1 = q1.w || 0;
    var x1 = q1.x;
    var y1 = q1.y;
    var z1 = q1.z;

    var w2 = q2.w || 0;
    var x2 = q2.x;
    var y2 = q2.y;
    var z2 = q2.z;

    output.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    output.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    output.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    output.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return output;
};

/**
 * Normalize the input quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The normalized quaternion.
 */
Quaternion.normalize = function normalize(q, output) {
    var w = q.w;
    var x = q.x;
    var y = q.y;
    var z = q.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return this;
    length = 1 / length;
    output.w *= length;
    output.x *= length;
    output.y *= length;
    output.z *= length;
    return output;
};

/**
 * The conjugate of the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The conjugate Quaternion.
 */
Quaternion.conjugate = function conjugate(q, output) {
    output.w = q.w;
    output.x = -q.x;
    output.y = -q.y;
    output.z = -q.z;
    return output;
};

/**
 * Clone the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q the reference Quaternion.
 *
 * @return {Quaternion} The cloned Quaternion.
 */
Quaternion.clone = function clone(q) {
    return new Quaternion(q.w, q.x, q.y, q.z);
};

/**
 * The dot product of the two input Quaternions.
 *
 * @method
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 *
 * @return {Number} The dot product of the two Quaternions.
 */
Quaternion.dot = function dot(q1, q2) {
    return q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
};

module.exports = Quaternion;

},{}],18:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

var Vec3 = require('./Vec3');


var Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ?  new Vec3(origin[0],origin[1],origin[2]) : new Vec3();
	this.direction = ( direction !== undefined ) ? new Vec3(direction[0],direction[1],direction[2]) : new Vec3();

};

Ray.prototype.set = function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

};

Ray.prototype.copy = function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

};

Ray.prototype.at =  function ( t ) {

    var result = new Vec3();

    return result.copy( this.direction ).scale( t ).add( this.origin );

};


Ray.prototype.intersectSphere = function (center, radius) {

	// from http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/

	var vec = new Vec3();
    var c = new Vec3(center[0],center[1],center[2]);

	vec.subVectors( c, this.origin );

	var tca = vec.dot( this.direction );

	var d2 = vec.dot( vec ) - tca * tca;

	var radius2 = radius * radius;

	if ( d2 > radius2 ) return null;

	var thc = Math.sqrt( radius2 - d2 );

	// t0 = first intersect point - entrance on front of sphere
	var t0 = tca - thc;

	// t1 = second intersect point - exit point on back of sphere
	var t1 = tca + thc;

	// test to see if both t0 and t1 are behind the ray - if so, return null
	if ( t0 < 0 && t1 < 0 ) return null;

	// test to see if t0 is behind the ray:
	// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
	// in order to always return an intersect point that is in front of the ray.
	if ( t0 < 0 ) return this.at( t1 );

	// else t0 is in front of the ray, so return the first collision point scaled by t0
	return this.at( t0 );

};

Ray.prototype.intersectBox = function(center, size) {

    var tmin,
        tmax,
        tymin,
        tymax,
        tzmin,
        tzmax,
        box,
        out,
        invdirx = 1 / this.direction.x,
        invdiry = 1 / this.direction.y,
        invdirz = 1 / this.direction.z;

    box = {
        min: {
            x: center[0]-(size[0]/2),
            y: center[1]-(size[1]/2),
            z: center[2]-(size[2]/2)
        },
        max: {
            x: center[0]+(size[0]/2),
            y: center[1]+(size[1]/2),
            z: center[2]+(size[2]/2)
        }
    };

    if ( invdirx >= 0 ) {

        tmin = ( box.min.x - this.origin.x ) * invdirx;
        tmax = ( box.max.x - this.origin.x ) * invdirx;

    } else {

        tmin = ( box.max.x - this.origin.x ) * invdirx;
        tmax = ( box.min.x - this.origin.x ) * invdirx;
    }

    if ( invdiry >= 0 ) {

        tymin = ( box.min.y - this.origin.y ) * invdiry;
        tymax = ( box.max.y - this.origin.y ) * invdiry;

    } else {

        tymin = ( box.max.y - this.origin.y ) * invdiry;
        tymax = ( box.min.y - this.origin.y ) * invdiry;
    }

    if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

    if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

    if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

    if ( invdirz >= 0 ) {

        tzmin = ( box.min.z - this.origin.z ) * invdirz;
        tzmax = ( box.max.z - this.origin.z ) * invdirz;

    } else {

        tzmin = ( box.max.z - this.origin.z ) * invdirz;
        tzmax = ( box.min.z - this.origin.z ) * invdirz;
    }

    if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

    if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

    if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;


    if ( tmax < 0 ) return null;

    out = this.direction.scale(tmin >= 0 ? tmin : tmax);
    return out.add(out, this.origin, out);

};


Ray.prototype.equals = function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

};

Ray.prototype.clone = function () {

		return new Ray().copy( this );

};


module.exports = Ray;

},{"./Vec3":20}],19:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

'use strict';

/**
 * A two-dimensional vector.
 *
 * @class Vec2
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 */
var Vec2 = function(x, y) {
    if (x instanceof Array || x instanceof Float32Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
    }
    else {
        this.x = x || 0;
        this.y = y || 0;
    }
};

/**
 * Set the components of the current Vec2.
 *
 * @method
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 *
 * @return {Vec2} this
 */
Vec2.prototype.set = function set(x, y) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    return this;
};

/**
 * Add the input v to the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to add.
 *
 * @return {Vec2} this
 */
Vec2.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

/**
 * Subtract the input v from the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to subtract.
 *
 * @return {Vec2} this
 */
Vec2.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

/**
 * Scale the current Vec2 by a scalar or Vec2.
 *
 * @method
 *
 * @param {Number|Vec2} s The Number or vec2 by which to scale.
 *
 * @return {Vec2} this
 */
Vec2.prototype.scale = function scale(s) {
    if (s instanceof Vec2) {
        this.x *= s.x;
        this.y *= s.y;
    }
    else {
        this.x *= s;
        this.y *= s;
    }
    return this;
};

/**
 * Rotate the Vec2 counter-clockwise by theta about the z-axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec2} this
 */
Vec2.prototype.rotate = function(theta) {
    var x = this.x;
    var y = this.y;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */
Vec2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * The cross product of of the current Vec2 with the input Vec2.
 *
 * @method
 *
 * @param {Number} v The other Vec2.
 *
 * @return {Vec2} this
 */
Vec2.prototype.cross = function(v) {
    return this.x * v.y - this.y * v.x;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */
Vec2.prototype.invert = function invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
};

/**
 * Apply a function component-wise to the current Vec2.
 *
 * @method
 *
 * @param {Function} fn Function to apply.
 *
 * @return {Vec2} this
 */
Vec2.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    return this;
};

/**
 * Get the magnitude of the current Vec2.
 *
 * @method
 *
 * @return {Number} the length of the vector
 */
Vec2.prototype.length = function length() {
    var x = this.x;
    var y = this.y;

    return Math.sqrt(x * x + y * y);
};

/**
 * Copy the input onto the current Vec2.
 *
 * @method
 *
 * @param {Vec2} v Vec2 to copy
 *
 * @return {Vec2} this
 */
Vec2.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
};

/**
 * Reset the current Vec2.
 *
 * @method
 *
 * @return {Vec2} this
 */
Vec2.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec2 is exactly 0.
 *
 * @method
 *
 * @return {Boolean} whether or not the length is 0
 */
Vec2.prototype.isZero = function isZero() {
    if (this.x !== 0 || this.y !== 0) return false;
    else return true;
};

/**
 * The array form of the current Vec2.
 *
 * @method
 *
 * @return {Array} the Vec to as an array
 */
Vec2.prototype.toArray = function toArray() {
    return [this.x, this.y];
};

/**
 * Normalize the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The normalized Vec2.
 */
Vec2.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;

    var length = Math.sqrt(x * x + y * y) || 1;
    length = 1 / length;
    output.x = v.x * length;
    output.y = v.y * length;

    return output;
};

/**
 * Clone the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to clone.
 *
 * @return {Vec2} The cloned Vec2.
 */
Vec2.clone = function clone(v) {
    return new Vec2(v.x, v.y);
};

/**
 * Add the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the addition.
 */
Vec2.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;

    return output;
};

/**
 * Subtract the second Vec2 from the first.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the subtraction.
 */
Vec2.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    return output;
};

/**
 * Scale the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Number} s Number to scale by.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the scaling.
 */
Vec2.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    return output;
};

/**
 * The dot product of the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 *
 * @return {Number} The dot product.
 */
Vec2.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * The cross product of the input Vec2's.
 *
 * @method
 *
 * @param {Number} v1 The left Vec2.
 * @param {Number} v2 The right Vec2.
 *
 * @return {Number} The z-component of the cross product.
 */
Vec2.cross = function(v1,v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

module.exports = Vec2;

},{}],20:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

'use strict';

/**
 * A three-dimensional vector.
 *
 * @class Vec3
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
var Vec3 = function(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

/**
 * Set the components of the current Vec3.
 *
 * @method
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 *
 * @return {Vec3} this
 */
Vec3.prototype.set = function set(x, y, z) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;

    return this;
};

/**
 * Add the input v to the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to add.
 *
 * @return {Vec3} this
 */
Vec3.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
};

/**
 * Subtract the input v from the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to subtract.
 *
 * @return {Vec3} this
 */
Vec3.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
};

/**
 * Subtract the input a from b and create new vector.
 *
 * @method
 *
 * @param {Vec3} a The Vec3 to subtract.
 * @param {Vec3} b The Vec3 to subtract.
 *
 * @return {Vec3} this
 */
Vec3.prototype.subVectors = function ( a, b ) {

	this.x = a.x - b.x;
	this.y = a.y - b.y;
	this.z = a.z - b.z;

	return this;

};

/**
 * Rotate the current Vec3 by theta clockwise about the x axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateX = function rotateX(theta) {
    var y = this.y;
    var z = this.z;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.y = y * cosTheta - z * sinTheta;
    this.z = y * sinTheta + z * cosTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the y axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateY = function rotateY(theta) {
    var x = this.x;
    var z = this.z;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = z * sinTheta + x * cosTheta;
    this.z = z * cosTheta - x * sinTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the z axis.
 *
 * @method
 *
 * @param {Number} theta Angle by which to rotate.
 *
 * @return {Vec3} this
 */
Vec3.prototype.rotateZ = function rotateZ(theta) {
    var x = this.x;
    var y = this.y;

    var cosTheta = Math.cos(theta);
    var sinTheta = Math.sin(theta);

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 *
 * @method
 *
 * @param {Vec3} v The other Vec3.
 *
 * @return {Vec3} this
 */
Vec3.prototype.dot = function dot(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 * Stores the result in the current Vec3.
 *
 * @method cross
 *
 * @param {Vec3} v The other Vec3
 *
 * @return {Vec3} this
 */
Vec3.prototype.cross = function cross(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    this.x = y * vz - z * vy;
    this.y = z * vx - x * vz;
    this.z = x * vy - y * vx;
    return this;
};

/**
 * Scale the current Vec3 by a scalar.
 *
 * @method
 *
 * @param {Number} s The Number by which to scale
 *
 * @return {Vec3} this
 */
Vec3.prototype.scale = function scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec3.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.invert = function invert() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
};

/**
 * Apply a function component-wise to the current Vec3.
 *
 * @method
 *
 * @param {Function} fn Function to apply.
 *
 * @return {Vec3} this
 */
Vec3.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    this.z = fn(this.z);

    return this;
};

/**
 * The magnitude of the current Vec3.
 *
 * @method
 *
 * @return {Number} the magnitude of the Vec3
 */
Vec3.prototype.length = function length() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return Math.sqrt(x * x + y * y + z * z);
};

/**
 * The magnitude squared of the current Vec3.
 *
 * @method
 *
 * @return {Number} magnitude of the Vec3 squared
 */
Vec3.prototype.lengthSq = function lengthSq() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return x * x + y * y + z * z;
};

/**
 * Copy the input onto the current Vec3.
 *
 * @method
 *
 * @param {Vec3} v Vec3 to copy
 *
 * @return {Vec3} this
 */
Vec3.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

/**
 * Reset the current Vec3.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec3 is exactly 0.
 *
 * @method
 *
 * @return {Boolean} whether or not the magnitude is zero
 */
Vec3.prototype.isZero = function isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
};

/**
 * The array form of the current Vec3.
 *
 * @method
 *
 * @return {Array} a three element array representing the components of the Vec3
 */
Vec3.prototype.toArray = function toArray() {
    return [this.x, this.y, this.z];
};

/**
 * Preserve the orientation but change the length of the current Vec3 to 1.
 *
 * @method
 *
 * @return {Vec3} this
 */
Vec3.prototype.normalize = function normalize() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var len = Math.sqrt(x * x + y * y + z * z) || 1;
    len = 1 / len;

    this.x *= len;
    this.y *= len;
    this.z *= len;
    return this;
};

/**
 * Apply the rotation corresponding to the input (unit) Quaternion
 * to the current Vec3.
 *
 * @method
 *
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply
 *
 * @return {Vec3} this
 */
Vec3.prototype.applyRotation = function applyRotation(q) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = this.x;
    var vy = this.y;
    var vz = this.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    this.x = tx * w + x * tw + y * tz - ty * z;
    this.y = ty * w + y * tw + tx * z - x * tz;
    this.z = tz * w + z * tw + x * ty - tx * y;
    return this;
};

/**
 * Apply the input Mat33 the the current Vec3.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to apply
 *
 * @return {Vec3} this
 */
Vec3.prototype.applyMatrix = function applyMatrix(matrix) {
    var M = matrix.get();

    var x = this.x;
    var y = this.y;
    var z = this.z;

    this.x = M[0]*x + M[1]*y + M[2]*z;
    this.y = M[3]*x + M[4]*y + M[5]*z;
    this.z = M[6]*x + M[7]*y + M[8]*z;
    return this;
};

/**
 * Normalize the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The normalize Vec3.
 */
Vec3.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;
    var z = v.z;

    var length = Math.sqrt(x * x + y * y + z * z) || 1;
    length = 1 / length;

    output.x = x * length;
    output.y = y * length;
    output.z = z * length;
    return output;
};

/**
 * Apply a rotation to the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The rotated version of the input Vec3.
 */
Vec3.applyRotation = function applyRotation(v, q, output) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Clone the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to clone.
 *
 * @return {Vec3} The cloned Vec3.
 */
Vec3.clone = function clone(v) {
    return new Vec3(v.x, v.y, v.z);
};

/**
 * Add the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the addition.
 */
Vec3.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;
    output.z = v1.z + v2.z;
    return output;
};

/**
 * Subtract the second Vec3 from the first.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the subtraction.
 */
Vec3.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    output.z = v1.z - v2.z;
    return output;
};

/**
 * Scale the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the scaling.
 */
Vec3.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    output.z = v.z * s;
    return output;
};

/**
 * Scale and add the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the scaling.
 */
Vec3.prototype.scaleAndAdd = function scaleAndAdd(a, b, s) {
    this.x = a.x + (b.x * s);
    this.y = a.y + (b.y * s);
    this.z = a.z + (b.z * s);
};


/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
Vec3.prototype.squaredDistance = function squaredDistance(b) {
    var x = b.x - this.x,
        y = b.y - this.y,
        z = b.z - this.z;
    return x*x + y*y + z*z
};

Vec3.prototype.distanceTo = function ( v ) {

    return Math.sqrt( this.squaredDistance( v ) );

};

/**
 * The dot product of the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 *
 * @return {Number} The dot product.
 */
Vec3.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * The (right-handed) cross product of the input Vec3's.
 * v1 x v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.cross = function cross(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    output.x = y1 * z2 - z1 * y2;
    output.y = z1 * x2 - x1 * z2;
    output.z = x1 * y2 - y1 * x2;
    return output;
};

/**
 * The projection of v1 onto v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.project = function project(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    var scale = x1 * x2 + y1 * y2 + z1 * z2;
    scale /= x2 * x2 + y2 * y2 + z2 * z2;

    output.x = x2 * scale;
    output.y = y2 * scale;
    output.z = z2 * scale;

    return output;
};

Vec3.prototype.createFromArray = function(a){
    this.x = a[0] || 0;
    this.y = a[1] || 0;
    this.z = a[2] || 0;
};

module.exports = Vec3;

},{}],21:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

module.exports = {
    Mat33: require('./Mat33'),
    Quaternion: require('./Quaternion'),
    Vec2: require('./Vec2'),
    Vec3: require('./Vec3'),
    Ray: require('./Ray')
};

},{"./Mat33":16,"./Quaternion":17,"./Ray":18,"./Vec2":19,"./Vec3":20}],22:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

/*jshint -W008 */

'use strict';

/**
 * A library of curves which map an animation explicitly as a function of time.
 *
 * @namespace
 * @property {Function} linear
 * @property {Function} easeIn
 * @property {Function} easeOut
 * @property {Function} easeInOut
 * @property {Function} easeOutBounce
 * @property {Function} spring
 * @property {Function} inQuad
 * @property {Function} outQuad
 * @property {Function} inOutQuad
 * @property {Function} inCubic
 * @property {Function} outCubic
 * @property {Function} inOutCubic
 * @property {Function} inQuart
 * @property {Function} outQuart
 * @property {Function} inOutQuart
 * @property {Function} inQuint
 * @property {Function} outQuint
 * @property {Function} inOutQuint
 * @property {Function} inSine
 * @property {Function} outSine
 * @property {Function} inOutSine
 * @property {Function} inExpo
 * @property {Function} outExpo
 * @property {Function} inOutExp
 * @property {Function} inCirc
 * @property {Function} outCirc
 * @property {Function} inOutCirc
 * @property {Function} inElastic
 * @property {Function} outElastic
 * @property {Function} inOutElastic
 * @property {Function} inBounce
 * @property {Function} outBounce
 * @property {Function} inOutBounce
 * @property {Function} flat            - Useful for delaying the execution of
 *                                        a subsequent transition.
 */
var Curves = {
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
    },

    inQuad: function(t) {
        return t*t;
    },

    outQuad: function(t) {
        return -(t-=1)*t+1;
    },

    inOutQuad: function(t) {
        if ((t/=.5) < 1) return .5*t*t;
        return -.5*((--t)*(t-2) - 1);
    },

    inCubic: function(t) {
        return t*t*t;
    },

    outCubic: function(t) {
        return ((--t)*t*t + 1);
    },

    inOutCubic: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t;
        return .5*((t-=2)*t*t + 2);
    },

    inQuart: function(t) {
        return t*t*t*t;
    },

    outQuart: function(t) {
        return -((--t)*t*t*t - 1);
    },

    inOutQuart: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t;
        return -.5 * ((t-=2)*t*t*t - 2);
    },

    inQuint: function(t) {
        return t*t*t*t*t;
    },

    outQuint: function(t) {
        return ((--t)*t*t*t*t + 1);
    },

    inOutQuint: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t*t;
        return .5*((t-=2)*t*t*t*t + 2);
    },

    inSine: function(t) {
        return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
    },

    outSine: function(t) {
        return Math.sin(t * (Math.PI/2));
    },

    inOutSine: function(t) {
        return -.5*(Math.cos(Math.PI*t) - 1);
    },

    inExpo: function(t) {
        return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
    },

    outExpo: function(t) {
        return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
    },

    inOutExpo: function(t) {
        if (t===0) return 0.0;
        if (t===1.0) return 1.0;
        if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    },

    inCirc: function(t) {
        return -(Math.sqrt(1 - t*t) - 1);
    },

    outCirc: function(t) {
        return Math.sqrt(1 - (--t)*t);
    },

    inOutCirc: function(t) {
        if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
        return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },

    inElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
    },

    outElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
    },

    inOutElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
    },

    inBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return t*t*((s+1)*t - s);
    },

    outBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return ((--t)*t*((s+1)*t + s) + 1);
    },

    inOutBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
        return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },

    inBounce: function(t) {
        return 1.0 - Curves.outBounce(1.0-t);
    },

    outBounce: function(t) {
        if (t < (1/2.75)) {
            return (7.5625*t*t);
        }
        else if (t < (2/2.75)) {
            return (7.5625*(t-=(1.5/2.75))*t + .75);
        }
        else if (t < (2.5/2.75)) {
            return (7.5625*(t-=(2.25/2.75))*t + .9375);
        }
        else {
            return (7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    },

    inOutBounce: function(t) {
        if (t < .5) return Curves.inBounce(t*2) * .5;
        return Curves.outBounce(t*2-1.0) * .5 + .5;
    },

    flat: function() {
        return 0;
    }
};

module.exports = Curves;

},{}],23:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
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
 */

'use strict';

var Curves = require('./Curves');
var Engine = require('../core/Engine');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */
function Transitionable(initialState) {
    this._queue = [];
    this._from = null;
    this._state = null;
    this._startedAt = null;
    this._pausedAt = null;
    this.id = null;
    this.param = null;
    if (initialState != null) this.from(initialState);
    Engine.updateQueue.push(this);
}

/**
 * Registers a transition to be pushed onto the internal queue.
 *
 * @method to
 * @chainable
 *
 * @param  {Number|Array.Number}    finalState              final state to
 *                                                          transiton to
 * @param  {String|Function}        [curve=Curves.linear]   easing function
 *                                                          used for
 *                                                          interpolating
 *                                                          [0, 1]
 * @param  {Number}                 [duration=100]          duration of
 *                                                          transition
 * @param  {Function}               [callback]              callback function
 *                                                          to be called after
 *                                                          the transition is
 *                                                          complete
 * @param  {String}                 [method]                method used for
 *                                                          interpolation
 *                                                          (e.g. slerp)
 * @return {Transitionable}         this
 */
Transitionable.prototype.to = function to(finalState, curve, duration, callback, method) {

    curve = curve != null && curve.constructor === String ? Curves[curve] : curve;
    if (this._queue.length === 0) {
        this._startedAt = performance.now();
        this._pausedAt = null;
    }

    this._queue.push(
        finalState,
        curve != null ? curve : Curves.linear,
        duration != null ? duration : 100,
        callback,
        method
    );

    return this;
};

/**
 * Resets the transition queue to a stable initial state.
 *
 * @method from
 * @chainable
 *
 * @param  {Number|Array.Number}    initialState    initial state to
 *                                                  transition from
 * @return {Transitionable}         this
 */
Transitionable.prototype.from = function from(initialState) {
    this._state = initialState;
    this._from = this._sync(null, this._state);
    this._queue.length = 0;
    this._startedAt = performance.now();
    this._pausedAt = null;
    return this;
};

/**
 * Delays the execution of the subsequent transition for a certain period of
 * time.
 *
 * @method delay
 * @chainable
 *
 * @param {Number}      duration    delay time in ms
 * @param {Function}    [callback]  Zero-argument function to call on observed
 *                                  completion (t=1)
 * @return {Transitionable}         this
 */
Transitionable.prototype.delay = function delay(duration, callback) {
    var endState = this._queue.length > 0 ? this._queue[this._queue.length - 5] : this._state;
    return this.to(endState, Curves.flat, duration, callback);
};

/**
 * Overrides current transition.
 *
 * @method override
 * @chainable
 *
 * @param  {Number|Array.Number}    [finalState]    final state to transiton to
 * @param  {String|Function}        [curve]         easing function used for
 *                                                  interpolating [0, 1]
 * @param  {Number}                 [duration]      duration of transition
 * @param  {Function}               [callback]      callback function to be
 *                                                  called after the transition
 *                                                  is complete
 * @param {String}                  [method]        optional method used for
 *                                                  interpolating between the
 *                                                  values. Set to `slerp` for
 *                                                  spherical linear
 *                                                  interpolation.
 * @return {Transitionable}         this
 */
Transitionable.prototype.override = function override(finalState, curve, duration, callback, method) {
    if (this._queue.length > 0) {
        if (finalState != null) this._queue[0] = finalState;
        if (curve != null)      this._queue[1] = curve.constructor === String ? Curves[curve] : curve;
        if (duration != null)   this._queue[2] = duration;
        if (callback != null)   this._queue[3] = callback;
        if (method != null)     this._queue[4] = method;
    }
    return this;
};


/**
 * Used for interpolating between the start and end state of the currently
 * running transition
 *
 * @method  _interpolate
 * @private
 *
 * @param  {Object|Array|Number} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Object|Array|Number} from       Start state of current transition.
 * @param  {Object|Array|Number} to         End state of current transition.
 * @param  {Number} progress                Progress of the current transition,
 *                                          in [0, 1]
 * @param  {String} method                  Method used for interpolation (e.g.
 *                                          slerp)
 * @return {Object|Array|Number}            output
 */
Transitionable.prototype._interpolate = function _interpolate(output, from, to, progress, method) {
    if (to instanceof Object) {
        if (method === 'slerp') {
            var x, y, z, w;
            var qx, qy, qz, qw;
            var omega, cosomega, sinomega, scaleFrom, scaleTo;

            x = from[0];
            y = from[1];
            z = from[2];
            w = from[3];

            qx = to[0];
            qy = to[1];
            qz = to[2];
            qw = to[3];

            if (progress === 1) {
                output[0] = qx;
                output[1] = qy;
                output[2] = qz;
                output[3] = qw;
                return output;
            }

            cosomega = w * qw + x * qx + y * qy + z * qz;
            if ((1.0 - cosomega) > 1e-5) {
                omega = Math.acos(cosomega);
                sinomega = Math.sin(omega);
                scaleFrom = Math.sin((1.0 - progress) * omega) / sinomega;
                scaleTo = Math.sin(progress * omega) / sinomega;
            }
            else {
                scaleFrom = 1.0 - progress;
                scaleTo = progress;
            }

            output[0] = x * scaleFrom + qx * scaleTo;
            output[1] = y * scaleFrom + qy * scaleTo;
            output[2] = z * scaleFrom + qz * scaleTo;
            output[3] = w * scaleFrom + qw * scaleTo;
        }
        else if (to instanceof Array) {
            for (var i = 0, len = to.length; i < len; i++) {
                output[i] = this._interpolate(output[i], from[i], to[i], progress, method);
            }
        }
        else {
            for (var key in to) {
                output[key] = this._interpolate(output[key], from[key], to[key], progress, method);
            }
        }
    }
    else {
        output = from + progress * (to - from);
    }
    return output;
};


/**
 * Internal helper method used for synchronizing the current, absolute state of
 * a transition to a given output array, object literal or number. Supports
 * nested state objects by through recursion.
 *
 * @method  _sync
 * @private
 *
 * @param  {Number|Array|Object} output     Where to write to (in order to avoid
 *                                          object allocation and therefore GC).
 * @param  {Number|Array|Object} input      Input state to proxy onto the
 *                                          output.
 * @return {Number|Array|Object} output     Passed in output object.
 */
Transitionable.prototype._sync = function _sync(output, input) {
    if (typeof input === 'number') output = input;
    else if (input instanceof Array) {
        if (output == null) output = [];
        for (var i = 0, len = input.length; i < len; i++) {
            output[i] = _sync(output[i], input[i]);
        }
    }
    else if (input instanceof Object) {
        if (output == null) output = {};
        for (var key in input) {
            output[key] = _sync(output[key], input[key]);
        }
    }
    return output;
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {Number=} t               Evaluate the curve at a normalized version
 *                                  of this time. If omitted, use current time
 *                                  (Unix epoch time retrieved from Clock).
 * @return {Number|Array.Number}    Beginning state interpolated to this point
 *                                  in time.
 */
Transitionable.prototype.get = function get(t) {
    if (this._queue.length === 0) return this._state;

    t = this._pausedAt ? this._pausedAt : t;
    t = t ? t : performance.now();

    var progress = (t - this._startedAt) / this._queue[2];
    this._state = this._interpolate(
        this._state,
        this._from,
        this._queue[0],
        this._queue[1](progress > 1 ? 1 : progress),
        this._queue[4]
    );
    var state = this._state;
    if (progress >= 1) {
        this._startedAt = this._startedAt + this._queue[2];
        this._from = this._sync(this._from, this._state);
        this._queue.shift();
        this._queue.shift();
        this._queue.shift();
        var callback = this._queue.shift();
        this._queue.shift();
        if (callback) callback();
    }
    return progress > 1 ? this.get() : state;
};

/**
 * Is there at least one transition pending completion?
 *
 * @method isActive
 *
 * @return {Boolean}    Boolean indicating whether there is at least one pending
 *                      transition. Paused transitions are still being
 *                      considered active.
 */
Transitionable.prototype.isActive = function isActive() {
    return this._queue.length > 0;
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.halt = function halt() {
    return this.from(this.get());
};

/**
 * Pause transition. This will not erase any actions.
 *
 * @method pause
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.pause = function pause() {
    this._pausedAt = performance.now();
    return this;
};

/**
 * Has the current action been paused?
 *
 * @method isPaused
 * @chainable
 *
 * @return {Boolean} if the current action has been paused
 */
Transitionable.prototype.isPaused = function isPaused() {
    return !!this._pausedAt;
};

/**
 * Resume a previously paused transition.
 *
 * @method resume
 * @chainable
 *
 * @return {Transitionable} this
 */
Transitionable.prototype.resume = function resume() {
    var diff = this._pausedAt - this._startedAt;
    this._startedAt = performance.now() - diff;
    this._pausedAt = null;
    return this;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 * @deprecated Use `.from` instead!
 *
 * @param {Number|Array.Number|Object.<number, number>} start
 *    stable state to set to
 * @return {Transitionable}                             this
 */
Transitionable.prototype.reset = function(start) {
    return this.from(start);
};

/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 * @chainable
 * @deprecated Use `.to` instead!
 *
 * @param {Number|FamousEngineMatrix|Array.Number|Object.<number, number>} state
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 * @return {Transitionable} this
 */
Transitionable.prototype.set = function(state, transition, callback) {
    if (transition == null) {
        this.from(state);
        if (callback) callback();
    }
    else {
        this.to(state, transition.curve, transition.duration, callback, transition.method);
    }
    return this;
};


module.exports = Transitionable;

},{"../core/Engine":11,"./Curves":22}],24:[function(require,module,exports){
module.exports = {
    Curves: require('./Curves'),
    Transitionable: require('./Transitionable')
};

},{"./Curves":22,"./Transitionable":23}]},{},[15])(15)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hjc3NtYXRyaXgvbGliL1ZlY3RvcjQuanMiLCJub2RlX21vZHVsZXMveGNzc21hdHJpeC9saWIvWENTU01hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2xpYi91dGlscy9hbmdsZS5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2xpYi91dGlscy9jc3NUcmFuc2Zvcm1TdHJpbmcuanMiLCJub2RlX21vZHVsZXMveGNzc21hdHJpeC9saWIvdXRpbHMvbWF0cml4LmpzIiwibm9kZV9tb2R1bGVzL3hjc3NtYXRyaXgvbGliL3V0aWxzL3ZlY3Rvci5qcyIsInNyYy9jb21wb25lbnRzL0NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL0RPTUNvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2NvcmUvRW5naW5lLmpzIiwic3JjL2NvcmUvTm9kZS5qcyIsInNyYy9jb3JlL1NjZW5lLmpzIiwic3JjL2NvcmUvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF0aC9NYXQzMy5qcyIsInNyYy9tYXRoL1F1YXRlcm5pb24uanMiLCJzcmMvbWF0aC9SYXkuanMiLCJzcmMvbWF0aC9WZWMyLmpzIiwic3JjL21hdGgvVmVjMy5qcyIsInNyYy9tYXRoL2luZGV4LmpzIiwic3JjL3RyYW5zaXRpb25zL0N1cnZlcy5qcyIsInNyYy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZS5qcyIsInNyYy90cmFuc2l0aW9ucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5cEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBYQ1NTTWF0cml4ID0gcmVxdWlyZSgnLi9saWIvWENTU01hdHJpeC5qcycpO1xubW9kdWxlLmV4cG9ydHMgPSBYQ1NTTWF0cml4O1xuIiwidmFyIHZlY3RvciA9IHJlcXVpcmUoJy4vdXRpbHMvdmVjdG9yJyk7XG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjQ7XG5cbi8qKlxuICogQSA0IGRpbWVuc2lvbmFsIHZlY3RvclxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFZlY3RvcjQoeCwgeSwgeiwgdykge1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xuICB0aGlzLnogPSB6O1xuICB0aGlzLncgPSB3O1xuICB0aGlzLmNoZWNrVmFsdWVzKCk7XG59XG5cbi8qKlxuICogRW5zdXJlIHRoYXQgdmFsdWVzIGFyZSBub3QgdW5kZWZpbmVkXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyBudWxsXG4gKi9cblxuVmVjdG9yNC5wcm90b3R5cGUuY2hlY2tWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy54ID0gdGhpcy54IHx8IDA7XG4gIHRoaXMueSA9IHRoaXMueSB8fCAwO1xuICB0aGlzLnogPSB0aGlzLnogfHwgMDtcbiAgdGhpcy53ID0gdGhpcy53IHx8IDA7XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3JcbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtmbG9hdH1cbiAqL1xuXG5WZWN0b3I0LnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jaGVja1ZhbHVlcygpO1xuICByZXR1cm4gdmVjdG9yLmxlbmd0aCh0aGlzKTtcbn07XG5cblxuLyoqXG4gKiBHZXQgYSBub3JtYWxpc2VkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtWZWN0b3I0fVxuICovXG5cblZlY3RvcjQucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdmVjdG9yLm5vcm1hbGl6ZSh0aGlzKTtcbn07XG5cblxuLyoqXG4gKiBWZWN0b3IgRG90LVByb2R1Y3RcbiAqIEBwYXJhbSB7VmVjdG9yNH0gdiBUaGUgc2Vjb25kIHZlY3RvciB0byBhcHBseSB0aGUgcHJvZHVjdCB0b1xuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge2Zsb2F0fSBUaGUgRG90LVByb2R1Y3Qgb2YgdGhpcyBhbmQgdi5cbiAqL1xuXG5WZWN0b3I0LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB2ZWN0b3IuZG90KHRoaXMsIHYpO1xufTtcblxuXG4vKipcbiAqIFZlY3RvciBDcm9zcy1Qcm9kdWN0XG4gKiBAcGFyYW0ge1ZlY3RvcjR9IHYgVGhlIHNlY29uZCB2ZWN0b3IgdG8gYXBwbHkgdGhlIHByb2R1Y3QgdG9cbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtWZWN0b3I0fSBUaGUgQ3Jvc3MtUHJvZHVjdCBvZiB0aGlzIGFuZCB2LlxuICovXG5cblZlY3RvcjQucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdmVjdG9yLmNyb3NzKHRoaXMsIHYpO1xufTtcblxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiByZXF1aXJlZCBmb3IgbWF0cml4IGRlY29tcG9zaXRpb25cbiAqIEEgSmF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBwc2V1ZG8gY29kZSBhdmFpbGFibGUgZnJvbSBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLTJkLXRyYW5zZm9ybXMvI21hdHJpeC1kZWNvbXBvc2l0aW9uXG4gKiBAcGFyYW0ge1ZlY3RvcjR9IGFQb2ludCBBIDNEIHBvaW50XG4gKiBAcGFyYW0ge2Zsb2F0fSBhc2NsXG4gKiBAcGFyYW0ge2Zsb2F0fSBic2NsXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyB7VmVjdG9yNH1cbiAqL1xuXG5WZWN0b3I0LnByb3RvdHlwZS5jb21iaW5lID0gZnVuY3Rpb24oYlBvaW50LCBhc2NsLCBic2NsKSB7XG4gIHJldHVybiB2ZWN0b3IuY29tYmluZSh0aGlzLCBiUG9pbnQsIGFzY2wsIGJzY2wpO1xufTtcblxuVmVjdG9yNC5wcm90b3R5cGUubXVsdGlwbHlCeU1hdHJpeCA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcbiAgcmV0dXJuIHZlY3Rvci5tdWx0aXBseUJ5TWF0cml4KHRoaXMsIG1hdHJpeCk7XG59O1xuIiwidmFyIHV0aWxzID0ge1xuICAgIGFuZ2xlczogcmVxdWlyZSgnLi91dGlscy9hbmdsZScpLFxuICAgIG1hdHJpeDogcmVxdWlyZSgnLi91dGlscy9tYXRyaXgnKSxcbiAgICB0cmFuc3A6IHJlcXVpcmUoJy4vdXRpbHMvY3NzVHJhbnNmb3JtU3RyaW5nJyksXG4gICAgZnVuY3M6IHtcbiAgICAgICAgLy8gR2l2ZW4gYSBmdW5jdGlvbiBgZm5gLCByZXR1cm4gYSBmdW5jdGlvbiB3aGljaCBjYWxscyBgZm5gIHdpdGggb25seSAxXG4gICAgICAgIC8vICAgYXJndW1lbnQsIG5vIG1hdHRlciBob3cgbWFueSBhcmUgZ2l2ZW4uXG4gICAgICAgIC8vIE1vc3QgdXNlZnVsIHdoZXJlIHlvdSBvbmx5IHdhbnQgdGhlIGZpcnN0IHZhbHVlIGZyb20gYSBtYXAvZm9yZWFjaC9ldGNcbiAgICAgICAgb25seUZpcnN0QXJnOiBmdW5jdGlvbiAoZm4sIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0IHx8IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbChjb250ZXh0LCBmaXJzdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vKipcbiAqICBHaXZlbiBhIENTUyB0cmFuc2Zvcm0gc3RyaW5nIChsaWtlIGByb3RhdGUoM3JhZClgLCBvclxuICogICAgYG1hdHJpeCgxLCAwLCAwLCAwLCAxLCAwKWApLCByZXR1cm4gYW4gaW5zdGFuY2UgY29tcGF0aWJsZSB3aXRoXG4gKiAgICBbYFdlYktpdENTU01hdHJpeGBdKGh0dHA6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2xpYnJhcnkvc2FmYXJpL2RvY3VtZW50YXRpb24vQXVkaW9WaWRlby9SZWZlcmVuY2UvV2ViS2l0Q1NTTWF0cml4Q2xhc3NSZWZlcmVuY2UvV2ViS2l0Q1NTTWF0cml4L1dlYktpdENTU01hdHJpeC5odG1sKVxuICogIEBjb25zdHJ1Y3RvclxuICogIEBwYXJhbSB7c3RyaW5nfSBkb21zdHIgLSBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIDJEIG9yIDNEIHRyYW5zZm9ybSBtYXRyaXhcbiAqICAgIGluIHRoZSBmb3JtIGdpdmVuIGJ5IHRoZSBDU1MgdHJhbnNmb3JtIHByb3BlcnR5LCBpLmUuIGp1c3QgbGlrZSB0aGVcbiAqICAgIG91dHB1dCBmcm9tIFtbQGxpbmsjdG9TdHJpbmddXS5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IGEgLSBUaGUgZmlyc3QgMkQgdmVjdG9yIHZhbHVlLlxuICogIEBtZW1iZXIge251bWJlcn0gYiAtIFRoZSBzZWNvbmQgMkQgdmVjdG9yIHZhbHVlLlxuICogIEBtZW1iZXIge251bWJlcn0gYyAtIFRoZSB0aGlyZCAyRCB2ZWN0b3IgdmFsdWUuXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBkIC0gVGhlIGZvdXJ0aCAyRCB2ZWN0b3IgdmFsdWUuXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBlIC0gVGhlIGZpZnRoIDJEIHZlY3RvciB2YWx1ZS5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IGYgLSBUaGUgc2l4dGggMkQgdmVjdG9yIHZhbHVlLlxuICogIEBtZW1iZXIge251bWJlcn0gbTExIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgZmlyc3Qgcm93IGFuZCBmaXJzdCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMTIgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBmaXJzdCByb3cgYW5kIHNlY29uZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMTMgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBmaXJzdCByb3cgYW5kIHRoaXJkIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0xNCAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZpcnN0IHJvdyBhbmQgZm91cnRoIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0yMSAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHNlY29uZCByb3cgYW5kIGZpcnN0IGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0yMiAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHNlY29uZCByb3cgYW5kIHNlY29uZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMjMgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBzZWNvbmQgcm93IGFuZCB0aGlyZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMjQgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBzZWNvbmQgcm93IGFuZCBmb3VydGggY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTMxIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgdGhpcmQgcm93IGFuZCBmaXJzdCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMzIgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSB0aGlyZCByb3cgYW5kIHNlY29uZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMzMgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSB0aGlyZCByb3cgYW5kIHRoaXJkIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0zNCAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHRoaXJkIHJvdyBhbmQgZm91cnRoIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG00MSAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZvdXJ0aCByb3cgYW5kIGZpcnN0IGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG00MiAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZvdXJ0aCByb3cgYW5kIHNlY29uZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtNDMgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBmb3VydGggcm93IGFuZCB0aGlyZCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtNDQgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBmb3VydGggcm93IGFuZCBmb3VydGggY29sdW1uLlxuICogIEByZXR1cm5zIHtYQ1NTTWF0cml4fSBtYXRyaXhcbiAqL1xuZnVuY3Rpb24gWENTU01hdHJpeChkb21zdHIpIHtcbiAgICB0aGlzLm0xMSA9IHRoaXMubTIyID0gdGhpcy5tMzMgPSB0aGlzLm00NCA9IDE7XG5cbiAgICAgICAgICAgICAgIHRoaXMubTEyID0gdGhpcy5tMTMgPSB0aGlzLm0xNCA9XG4gICAgdGhpcy5tMjEgPSAgICAgICAgICAgIHRoaXMubTIzID0gdGhpcy5tMjQgPVxuICAgIHRoaXMubTMxID0gdGhpcy5tMzIgPSAgICAgICAgICAgIHRoaXMubTM0ID1cbiAgICB0aGlzLm00MSA9IHRoaXMubTQyID0gdGhpcy5tNDMgICAgICAgICAgICA9IDA7XG5cbiAgICBpZiAodHlwZW9mIGRvbXN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5zZXRNYXRyaXhWYWx1ZShkb21zdHIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiAgWENTU01hdHJpeC5kaXNwbGF5TmFtZSA9ICdYQ1NTTWF0cml4J1xuICovXG5YQ1NTTWF0cml4LmRpc3BsYXlOYW1lID0gJ1hDU1NNYXRyaXgnO1xuXG52YXIgcG9pbnRzMmQgPSBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJ107XG52YXIgcG9pbnRzM2QgPSBbXG4gICAgJ20xMScsICdtMTInLCAnbTEzJywgJ20xNCcsXG4gICAgJ20yMScsICdtMjInLCAnbTIzJywgJ20yNCcsXG4gICAgJ20zMScsICdtMzInLCAnbTMzJywgJ20zNCcsXG4gICAgJ200MScsICdtNDInLCAnbTQzJywgJ200NCdcbl07XG5cbihbXG4gICAgWydtMTEnLCAnYSddLFxuICAgIFsnbTEyJywgJ2InXSxcbiAgICBbJ20yMScsICdjJ10sXG4gICAgWydtMjInLCAnZCddLFxuICAgIFsnbTQxJywgJ2UnXSxcbiAgICBbJ200MicsICdmJ11cbl0pLmZvckVhY2goZnVuY3Rpb24gKHBhaXIpIHtcbiAgICB2YXIga2V5M2QgPSBwYWlyWzBdLCBrZXkyZCA9IHBhaXJbMV07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoWENTU01hdHJpeC5wcm90b3R5cGUsIGtleTJkLCB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgdGhpc1trZXkzZF0gPSB2YWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1trZXkzZF07XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGUgOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGUgOiB0cnVlXG4gICAgfSk7XG59KTtcblxuXG4vKipcbiAqICBNdWx0aXBseSBvbmUgbWF0cml4IGJ5IGFub3RoZXJcbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7WENTU01hdHJpeH0gb3RoZXJNYXRyaXggLSBUaGUgbWF0cml4IHRvIG11bHRpcGx5IHRoaXMgb25lIGJ5LlxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdGhlck1hdHJpeCkge1xuICAgIHJldHVybiB1dGlscy5tYXRyaXgubXVsdGlwbHkodGhpcywgb3RoZXJNYXRyaXgpO1xufTtcblxuLyoqXG4gKiAgSWYgdGhlIG1hdHJpeCBpcyBpbnZlcnRpYmxlLCByZXR1cm5zIGl0cyBpbnZlcnNlLCBvdGhlcndpc2UgcmV0dXJucyBudWxsLlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHJldHVybnMge1hDU1NNYXRyaXh8bnVsbH1cbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdXRpbHMubWF0cml4LmludmVyc2UodGhpcyk7XG59O1xuXG4vKipcbiAqICBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygcm90YXRpbmcgdGhlIG1hdHJpeCBieSBhIGdpdmVuIHZlY3Rvci5cbiAqXG4gKiAgSWYgb25seSB0aGUgZmlyc3QgYXJndW1lbnQgaXMgcHJvdmlkZWQsIHRoZSBtYXRyaXggaXMgb25seSByb3RhdGVkIGFib3V0XG4gKiAgdGhlIHogYXhpcy5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7bnVtYmVyfSByb3RYIC0gVGhlIHJvdGF0aW9uIGFyb3VuZCB0aGUgeCBheGlzLlxuICogIEBwYXJhbSB7bnVtYmVyfSByb3RZIC0gVGhlIHJvdGF0aW9uIGFyb3VuZCB0aGUgeSBheGlzLiBJZiB1bmRlZmluZWQsIHRoZSB4IGNvbXBvbmVudCBpcyB1c2VkLlxuICogIEBwYXJhbSB7bnVtYmVyfSByb3RaIC0gVGhlIHJvdGF0aW9uIGFyb3VuZCB0aGUgeiBheGlzLiBJZiB1bmRlZmluZWQsIHRoZSB4IGNvbXBvbmVudCBpcyB1c2VkLlxuICogIEByZXR1cm5zIFhDU1NNYXRyaXhcbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKHJ4LCByeSwgcnopIHtcblxuICAgIGlmICh0eXBlb2YgcnggIT09ICdudW1iZXInIHx8IGlzTmFOKHJ4KSkgcnggPSAwO1xuXG4gICAgaWYgKCh0eXBlb2YgcnkgIT09ICdudW1iZXInIHx8IGlzTmFOKHJ5KSkgJiZcbiAgICAgICAgKHR5cGVvZiByeiAhPT0gJ251bWJlcicgfHwgaXNOYU4ocnopKSkge1xuICAgICAgICByeiA9IHJ4O1xuICAgICAgICByeCA9IDA7XG4gICAgICAgIHJ5ID0gMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHJ5ICE9PSAnbnVtYmVyJyB8fCBpc05hTihyeSkpIHJ5ID0gMDtcbiAgICBpZiAodHlwZW9mIHJ6ICE9PSAnbnVtYmVyJyB8fCBpc05hTihyeikpIHJ6ID0gMDtcblxuICAgIHJ4ID0gdXRpbHMuYW5nbGVzLmRlZzJyYWQocngpO1xuICAgIHJ5ID0gdXRpbHMuYW5nbGVzLmRlZzJyYWQocnkpO1xuICAgIHJ6ID0gdXRpbHMuYW5nbGVzLmRlZzJyYWQocnopO1xuXG4gICAgdmFyIHR4ID0gbmV3IFhDU1NNYXRyaXgoKSxcbiAgICAgICAgdHkgPSBuZXcgWENTU01hdHJpeCgpLFxuICAgICAgICB0eiA9IG5ldyBYQ1NTTWF0cml4KCksXG4gICAgICAgIHNpbkEsIGNvc0EsIHNxO1xuXG4gICAgcnogLz0gMjtcbiAgICBzaW5BICA9IE1hdGguc2luKHJ6KTtcbiAgICBjb3NBICA9IE1hdGguY29zKHJ6KTtcbiAgICBzcSA9IHNpbkEgKiBzaW5BO1xuXG4gICAgLy8gTWF0cmljZXMgYXJlIGlkZW50aXR5IG91dHNpZGUgdGhlIGFzc2lnbmVkIHZhbHVlc1xuICAgIHR6Lm0xMSA9IHR6Lm0yMiA9IDEgLSAyICogc3E7XG4gICAgdHoubTEyID0gdHoubTIxID0gMiAqIHNpbkEgKiBjb3NBO1xuICAgIHR6Lm0yMSAqPSAtMTtcblxuICAgIHJ5IC89IDI7XG4gICAgc2luQSAgPSBNYXRoLnNpbihyeSk7XG4gICAgY29zQSAgPSBNYXRoLmNvcyhyeSk7XG4gICAgc3EgPSBzaW5BICogc2luQTtcblxuICAgIHR5Lm0xMSA9IHR5Lm0zMyA9IDEgLSAyICogc3E7XG4gICAgdHkubTEzID0gdHkubTMxID0gMiAqIHNpbkEgKiBjb3NBO1xuICAgIHR5Lm0xMyAqPSAtMTtcblxuICAgIHJ4IC89IDI7XG4gICAgc2luQSA9IE1hdGguc2luKHJ4KTtcbiAgICBjb3NBID0gTWF0aC5jb3MocngpO1xuICAgIHNxID0gc2luQSAqIHNpbkE7XG5cbiAgICB0eC5tMjIgPSB0eC5tMzMgPSAxIC0gMiAqIHNxO1xuICAgIHR4Lm0yMyA9IHR4Lm0zMiA9IDIgKiBzaW5BICogY29zQTtcbiAgICB0eC5tMzIgKj0gLTE7XG5cbiAgICB2YXIgaWRlbnRpdHlNYXRyaXggPSBuZXcgWENTU01hdHJpeCgpOyAvLyByZXR1cm5zIGlkZW50aXR5IG1hdHJpeCBieSBkZWZhdWx0XG4gICAgdmFyIGlzSWRlbnRpdHkgICAgID0gdGhpcy50b1N0cmluZygpID09PSBpZGVudGl0eU1hdHJpeC50b1N0cmluZygpO1xuICAgIHZhciByb3RhdGVkTWF0cml4ICA9IGlzSWRlbnRpdHkgP1xuICAgICAgICAgICAgdHoubXVsdGlwbHkodHkpLm11bHRpcGx5KHR4KSA6XG4gICAgICAgICAgICB0aGlzLm11bHRpcGx5KHR4KS5tdWx0aXBseSh0eSkubXVsdGlwbHkodHopO1xuXG4gICAgcmV0dXJuIHJvdGF0ZWRNYXRyaXg7XG59O1xuXG4vKipcbiAqICBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygcm90YXRpbmcgdGhlIG1hdHJpeCBhcm91bmQgYSBnaXZlbiB2ZWN0b3IgYnkgYSBnaXZlblxuICogIGFuZ2xlLlxuICpcbiAqICBJZiB0aGUgZ2l2ZW4gdmVjdG9yIGlzIHRoZSBvcmlnaW4gdmVjdG9yIHRoZW4gdGhlIG1hdHJpeCBpcyByb3RhdGVkIGJ5IHRoZVxuICogIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgeiBheGlzLlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFggLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB4IGF4aXMuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFkgLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB5IGF4aXMuIElmIHVuZGVmaW5lZCwgdGhlIHggY29tcG9uZW50IGlzIHVzZWQuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFogLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB6IGF4aXMuIElmIHVuZGVmaW5lZCwgdGhlIHggY29tcG9uZW50IGlzIHVzZWQuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGFib3V0IHRoZSBheGlzIHZlY3RvciwgaW4gZGVncmVlcy5cbiAqICBAcmV0dXJucyBYQ1NTTWF0cml4XG4gKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLnJvdGF0ZUF4aXNBbmdsZSA9IGZ1bmN0aW9uICh4LCB5LCB6LCBhKSB7XG4gICAgaWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJyB8fCBpc05hTih4KSkgeCA9IDA7XG4gICAgaWYgKHR5cGVvZiB5ICE9PSAnbnVtYmVyJyB8fCBpc05hTih5KSkgeSA9IDA7XG4gICAgaWYgKHR5cGVvZiB6ICE9PSAnbnVtYmVyJyB8fCBpc05hTih6KSkgeiA9IDA7XG4gICAgaWYgKHR5cGVvZiBhICE9PSAnbnVtYmVyJyB8fCBpc05hTihhKSkgYSA9IDA7XG4gICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCAmJiB6ID09PSAwKSB6ID0gMTtcbiAgICBhID0gKHV0aWxzLmFuZ2xlcy5kZWcycmFkKGEpIHx8IDApIC8gMjtcbiAgICB2YXIgdCAgICAgICAgID0gbmV3IFhDU1NNYXRyaXgoKSxcbiAgICAgICAgbGVuICAgICAgID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiksXG4gICAgICAgIGNvc0EgICAgICA9IE1hdGguY29zKGEpLFxuICAgICAgICBzaW5BICAgICAgPSBNYXRoLnNpbihhKSxcbiAgICAgICAgc3EgICAgICAgID0gc2luQSAqIHNpbkEsXG4gICAgICAgIHNjICAgICAgICA9IHNpbkEgKiBjb3NBLFxuICAgICAgICBwcmVjaXNpb24gPSBmdW5jdGlvbih2KSB7IHJldHVybiBwYXJzZUZsb2F0KCh2KS50b0ZpeGVkKDYpKTsgfSxcbiAgICAgICAgeDIsIHkyLCB6MjtcblxuICAgIC8vIEJhZCB2ZWN0b3IsIHVzZSBzb21ldGhpbmcgc2Vuc2libGVcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIHggPSAwO1xuICAgICAgICB5ID0gMDtcbiAgICAgICAgeiA9IDE7XG4gICAgfSBlbHNlIGlmIChsZW4gIT09IDEpIHtcbiAgICAgICAgeCAvPSBsZW47XG4gICAgICAgIHkgLz0gbGVuO1xuICAgICAgICB6IC89IGxlbjtcbiAgICB9XG5cbiAgICAvLyBPcHRpbWlzZSBjYXNlcyB3aGVyZSBheGlzIGlzIGFsb25nIG1ham9yIGF4aXNcbiAgICBpZiAoeCA9PT0gMSAmJiB5ID09PSAwICYmIHogPT09IDApIHtcbiAgICAgICAgdC5tMjIgPSB0Lm0zMyA9IDEgLSAyICogc3E7XG4gICAgICAgIHQubTIzID0gdC5tMzIgPSAyICogc2M7XG4gICAgICAgIHQubTMyICo9IC0xO1xuICAgIH0gZWxzZSBpZiAoeCA9PT0gMCAmJiB5ID09PSAxICYmIHogPT09IDApIHtcbiAgICAgICAgdC5tMTEgPSB0Lm0zMyA9IDEgLSAyICogc3E7XG4gICAgICAgIHQubTEzID0gdC5tMzEgPSAyICogc2M7XG4gICAgICAgIHQubTEzICo9IC0xO1xuICAgIH0gZWxzZSBpZiAoeCA9PT0gMCAmJiB5ID09PSAwICYmIHogPT09IDEpIHtcbiAgICAgICAgdC5tMTEgPSB0Lm0yMiA9IDEgLSAyICogc3E7XG4gICAgICAgIHQubTEyID0gdC5tMjEgPSAyICogc2M7XG4gICAgICAgIHQubTIxICo9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHgyICA9IHggKiB4O1xuICAgICAgICB5MiAgPSB5ICogeTtcbiAgICAgICAgejIgID0geiAqIHo7XG4gICAgICAgIC8vIGh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2Nzcy10cmFuc2Zvcm1zLyNtYXRoZW1hdGljYWwtZGVzY3JpcHRpb25cbiAgICAgICAgdC5tMTEgPSBwcmVjaXNpb24oMSAtIDIgKiAoeTIgKyB6MikgKiBzcSk7XG4gICAgICAgIHQubTEyID0gcHJlY2lzaW9uKDIgKiAoeCAqIHkgKiBzcSArIHogKiBzYykpO1xuICAgICAgICB0Lm0xMyA9IHByZWNpc2lvbigyICogKHggKiB6ICogc3EgLSB5ICogc2MpKTtcbiAgICAgICAgdC5tMjEgPSBwcmVjaXNpb24oMiAqICh4ICogeSAqIHNxIC0geiAqIHNjKSk7XG4gICAgICAgIHQubTIyID0gcHJlY2lzaW9uKDEgLSAyICogKHgyICsgejIpICogc3EpO1xuICAgICAgICB0Lm0yMyA9IHByZWNpc2lvbigyICogKHkgKiB6ICogc3EgKyB4ICogc2MpKTtcbiAgICAgICAgdC5tMzEgPSBwcmVjaXNpb24oMiAqICh4ICogeiAqIHNxICsgeSAqIHNjKSk7XG4gICAgICAgIHQubTMyID0gcHJlY2lzaW9uKDIgKiAoeSAqIHogKiBzcSAtIHggKiBzYykpO1xuICAgICAgICB0Lm0zMyA9IHByZWNpc2lvbigxIC0gMiAqICh4MiArIHkyKSAqIHNxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseSh0KTtcbn07XG5cbi8qKlxuICogIFJldHVybnMgdGhlIHJlc3VsdCBvZiBzY2FsaW5nIHRoZSBtYXRyaXggYnkgYSBnaXZlbiB2ZWN0b3IuXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJcbiAqICBAcGFyYW0ge251bWJlcn0gc2NhbGVYIC0gdGhlIHNjYWxpbmcgZmFjdG9yIGluIHRoZSB4IGF4aXMuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHNjYWxlWSAtIHRoZSBzY2FsaW5nIGZhY3RvciBpbiB0aGUgeSBheGlzLiBJZiB1bmRlZmluZWQsIHRoZSB4IGNvbXBvbmVudCBpcyB1c2VkLlxuICogIEBwYXJhbSB7bnVtYmVyfSBzY2FsZVogLSB0aGUgc2NhbGluZyBmYWN0b3IgaW4gdGhlIHogYXhpcy4gSWYgdW5kZWZpbmVkLCAxIGlzIHVzZWQuXG4gKiAgQHJldHVybnMgWENTU01hdHJpeFxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIChzY2FsZVgsIHNjYWxlWSwgc2NhbGVaKSB7XG4gICAgdmFyIHRyYW5zZm9ybSA9IG5ldyBYQ1NTTWF0cml4KCk7XG5cbiAgICBpZiAodHlwZW9mIHNjYWxlWCAhPT0gJ251bWJlcicgfHwgaXNOYU4oc2NhbGVYKSkgc2NhbGVYID0gMTtcbiAgICBpZiAodHlwZW9mIHNjYWxlWSAhPT0gJ251bWJlcicgfHwgaXNOYU4oc2NhbGVZKSkgc2NhbGVZID0gc2NhbGVYO1xuICAgIGlmICh0eXBlb2Ygc2NhbGVaICE9PSAnbnVtYmVyJyB8fCBpc05hTihzY2FsZVopKSBzY2FsZVogPSAxO1xuXG4gICAgdHJhbnNmb3JtLm0xMSA9IHNjYWxlWDtcbiAgICB0cmFuc2Zvcm0ubTIyID0gc2NhbGVZO1xuICAgIHRyYW5zZm9ybS5tMzMgPSBzY2FsZVo7XG5cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseSh0cmFuc2Zvcm0pO1xufTtcblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIHNrZXdpbmcgdGhlIG1hdHJpeCBieSBhIGdpdmVuIHZlY3Rvci5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7bnVtYmVyfSBza2V3WCAtIFRoZSBzY2FsaW5nIGZhY3RvciBpbiB0aGUgeCBheGlzLlxuICogIEByZXR1cm5zIFhDU1NNYXRyaXhcbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUuc2tld1ggPSBmdW5jdGlvbiAoZGVncmVlcykge1xuICAgIHZhciByYWRpYW5zICAgPSB1dGlscy5hbmdsZXMuZGVnMnJhZChkZWdyZWVzKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gbmV3IFhDU1NNYXRyaXgoKTtcblxuICAgIHRyYW5zZm9ybS5jID0gTWF0aC50YW4ocmFkaWFucyk7XG5cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseSh0cmFuc2Zvcm0pO1xufTtcblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIHNrZXdpbmcgdGhlIG1hdHJpeCBieSBhIGdpdmVuIHZlY3Rvci5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7bnVtYmVyfSBza2V3WSAtIHRoZSBzY2FsaW5nIGZhY3RvciBpbiB0aGUgeCBheGlzLlxuICogIEByZXR1cm5zIFhDU1NNYXRyaXhcbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUuc2tld1kgPSBmdW5jdGlvbiAoZGVncmVlcykge1xuICAgIHZhciByYWRpYW5zICAgPSB1dGlscy5hbmdsZXMuZGVnMnJhZChkZWdyZWVzKTtcbiAgICB2YXIgdHJhbnNmb3JtID0gbmV3IFhDU1NNYXRyaXgoKTtcblxuICAgIHRyYW5zZm9ybS5iID0gTWF0aC50YW4ocmFkaWFucyk7XG5cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseSh0cmFuc2Zvcm0pO1xufTtcblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIHRyYW5zbGF0aW5nIHRoZSBtYXRyaXggYnkgYSBnaXZlbiB2ZWN0b3IuXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJcbiAqICBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yLlxuICogIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHogLSBUaGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3Rvci4gSWYgdW5kZWZpbmVkLCAwIGlzIHVzZWQuXG4gKiAgQHJldHVybnMgWENTU01hdHJpeFxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIHZhciB0ID0gbmV3IFhDU1NNYXRyaXgoKTtcblxuICAgIGlmICh0eXBlb2YgeCAhPT0gJ251bWJlcicgfHwgaXNOYU4oeCkpIHggPSAwO1xuICAgIGlmICh0eXBlb2YgeSAhPT0gJ251bWJlcicgfHwgaXNOYU4oeSkpIHkgPSAwO1xuICAgIGlmICh0eXBlb2YgeiAhPT0gJ251bWJlcicgfHwgaXNOYU4oeikpIHogPSAwO1xuXG4gICAgdC5tNDEgPSB4O1xuICAgIHQubTQyID0geTtcbiAgICB0Lm00MyA9IHo7XG5cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseSh0KTtcbn07XG5cbi8qKlxuICogIFNldHMgdGhlIG1hdHJpeCB2YWx1ZXMgdXNpbmcgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24sIHN1Y2ggYXMgdGhhdCBwcm9kdWNlZFxuICogIGJ5IHRoZSBbW1hDU1NNYXRyaXgjdG9TdHJpbmddXSBtZXRob2QuXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJcbiAqICBAcGFyYW1zIHtzdHJpbmd9IGRvbXN0ciAtIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgMkQgb3IgM0QgdHJhbnNmb3JtIG1hdHJpeFxuICogICAgaW4gdGhlIGZvcm0gZ2l2ZW4gYnkgdGhlIENTUyB0cmFuc2Zvcm0gcHJvcGVydHksIGkuZS4ganVzdCBsaWtlIHRoZVxuICogICAgb3V0cHV0IGZyb20gW1tYQ1NTTWF0cml4I3RvU3RyaW5nXV0uXG4gKiAgQHJldHVybnMgdW5kZWZpbmVkXG4gKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLnNldE1hdHJpeFZhbHVlID0gZnVuY3Rpb24gKGRvbXN0cikge1xuXG4gICAgdmFyIG1hdHJpeFN0cmluZyA9IHRvTWF0cml4U3RyaW5nKGRvbXN0ci50cmltKCkpO1xuICAgIHZhciBtYXRyaXhPYmplY3QgPSB1dGlscy50cmFuc3Auc3RhdGVtZW50VG9PYmplY3QobWF0cml4U3RyaW5nKTtcblxuICAgIGlmICghbWF0cml4T2JqZWN0KSByZXR1cm47XG5cbiAgICB2YXIgaXMzZCAgID0gbWF0cml4T2JqZWN0LmtleSA9PT0gdXRpbHMudHJhbnNwLm1hdHJpeEZuM2Q7XG4gICAgdmFyIGtleWdlbiA9IGlzM2QgPyBpbmRleHRvS2V5M2QgOiBpbmRleHRvS2V5MmQ7XG4gICAgdmFyIHZhbHVlcyA9IG1hdHJpeE9iamVjdC52YWx1ZTtcbiAgICB2YXIgY291bnQgID0gdmFsdWVzLmxlbmd0aDtcblxuICAgIGlmICgoaXMzZCAmJiBjb3VudCAhPT0gMTYpIHx8ICEoaXMzZCB8fCBjb3VudCA9PT0gNikpIHJldHVybjtcblxuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChvYmosIGkpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWdlbihpKTtcbiAgICAgICAgdGhpc1trZXldID0gb2JqLnZhbHVlO1xuICAgIH0sIHRoaXMpO1xufTtcblxuZnVuY3Rpb24gaW5kZXh0b0tleTJkIChpbmRleCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGluZGV4ICsgOTcpOyAvLyBBU0NJSSBjaGFyIDk3ID09ICdhJ1xufVxuXG5mdW5jdGlvbiBpbmRleHRvS2V5M2QgKGluZGV4KSB7XG4gICAgcmV0dXJuICgnbScgKyAoTWF0aC5mbG9vcihpbmRleCAvIDQpICsgMSkpICsgKGluZGV4ICUgNCArIDEpO1xufVxuLyoqXG4gKiAgUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4LlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyb2YgWENTU01hdHJpeFxuICogIEByZXR1cm5zIHtzdHJpbmd9IG1hdHJpeFN0cmluZyAtIGEgc3RyaW5nIGxpa2UgYG1hdHJpeCgxLjAwMDAwMCwgMC4wMDAwMDAsIDAuMDAwMDAwLCAxLjAwMDAwMCwgMC4wMDAwMDAsIDAuMDAwMDAwKWBcbiAqXG4gKiovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9pbnRzLCBwcmVmaXg7XG5cbiAgICBpZiAodXRpbHMubWF0cml4LmlzQWZmaW5lKHRoaXMpKSB7XG4gICAgICAgIHByZWZpeCA9IHV0aWxzLnRyYW5zcC5tYXRyaXhGbjJkO1xuICAgICAgICBwb2ludHMgPSBwb2ludHMyZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwcmVmaXggPSB1dGlscy50cmFuc3AubWF0cml4Rm4zZDtcbiAgICAgICAgcG9pbnRzID0gcG9pbnRzM2Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArICcoJyArXG4gICAgICAgIHBvaW50cy5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3BdLnRvRml4ZWQoNik7XG4gICAgICAgIH0sIHRoaXMpIC5qb2luKCcsICcpICtcbiAgICAgICAgJyknO1xufTtcblxuLy8gPT09PT09IHRvTWF0cml4U3RyaW5nID09PT09PSAvL1xudmFyIGpzRnVuY3Rpb25zID0ge1xuICAgIG1hdHJpeDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgdmFyIG0yID0gbmV3IFhDU1NNYXRyaXgoby51bnBhcnNlZCk7XG5cbiAgICAgICAgcmV0dXJuIG0ubXVsdGlwbHkobTIpO1xuICAgIH0sXG4gICAgbWF0cml4M2Q6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHZhciBtMiA9IG5ldyBYQ1NTTWF0cml4KG8udW5wYXJzZWQpO1xuXG4gICAgICAgIHJldHVybiBtLm11bHRpcGx5KG0yKTtcbiAgICB9LFxuXG4gICAgcGVyc3BlY3RpdmU6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHZhciBtMiA9IG5ldyBYQ1NTTWF0cml4KCk7XG4gICAgICAgIG0yLm0zNCAtPSAxIC8gby52YWx1ZVswXS52YWx1ZTtcblxuICAgICAgICByZXR1cm4gbS5tdWx0aXBseShtMik7XG4gICAgfSxcblxuICAgIHJvdGF0ZTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0ucm90YXRlLmFwcGx5KG0sIG8udmFsdWUubWFwKG9iamVjdFZhbHVlcykpO1xuICAgIH0sXG4gICAgcm90YXRlM2Q6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnJvdGF0ZUF4aXNBbmdsZS5hcHBseShtLCBvLnZhbHVlLm1hcChvYmplY3RWYWx1ZXMpKTtcbiAgICB9LFxuICAgIHJvdGF0ZVg6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnJvdGF0ZS5hcHBseShtLCBbby52YWx1ZVswXS52YWx1ZSwgMCwgMF0pO1xuICAgIH0sXG4gICAgcm90YXRlWTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0ucm90YXRlLmFwcGx5KG0sIFswLCBvLnZhbHVlWzBdLnZhbHVlLCAwXSk7XG4gICAgfSxcbiAgICByb3RhdGVaOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5yb3RhdGUuYXBwbHkobSwgWzAsIDAsIG8udmFsdWVbMF0udmFsdWVdKTtcbiAgICB9LFxuXG4gICAgc2NhbGU6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnNjYWxlLmFwcGx5KG0sIG8udmFsdWUubWFwKG9iamVjdFZhbHVlcykpO1xuICAgIH0sXG4gICAgc2NhbGUzZDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0uc2NhbGUuYXBwbHkobSwgby52YWx1ZS5tYXAob2JqZWN0VmFsdWVzKSk7XG4gICAgfSxcbiAgICBzY2FsZVg6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnNjYWxlLmFwcGx5KG0sIG8udmFsdWUubWFwKG9iamVjdFZhbHVlcykpO1xuICAgIH0sXG4gICAgc2NhbGVZOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5zY2FsZS5hcHBseShtLCBbMCwgby52YWx1ZVswXS52YWx1ZSwgMF0pO1xuICAgIH0sXG4gICAgc2NhbGVaOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5zY2FsZS5hcHBseShtLCBbMCwgMCwgby52YWx1ZVswXS52YWx1ZV0pO1xuICAgIH0sXG5cbiAgICBza2V3OiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICB2YXIgbVggPSBuZXcgWENTU01hdHJpeCgnc2tld1goJyArIG8udmFsdWVbMF0udW5wYXJzZWQgKyAnKScpO1xuICAgICAgICB2YXIgbVkgPSBuZXcgWENTU01hdHJpeCgnc2tld1koJyArIChvLnZhbHVlWzFdJiZvLnZhbHVlWzFdLnVucGFyc2VkIHx8IDApICsgJyknKTtcbiAgICAgICAgdmFyIHNNID0gJ21hdHJpeCgxLjAwMDAwLCAnKyBtWS5iICsnLCAnKyBtWC5jICsnLCAxLjAwMDAwMCwgMC4wMDAwMDAsIDAuMDAwMDAwKSc7XG4gICAgICAgIHZhciBtMiA9IG5ldyBYQ1NTTWF0cml4KHNNKTtcblxuICAgICAgICByZXR1cm4gbS5tdWx0aXBseShtMik7XG4gICAgfSxcbiAgICBza2V3WDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0uc2tld1guYXBwbHkobSwgW28udmFsdWVbMF0udmFsdWVdKTtcbiAgICB9LFxuICAgIHNrZXdZOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5za2V3WS5hcHBseShtLCBbby52YWx1ZVswXS52YWx1ZV0pO1xuICAgIH0sXG5cbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnRyYW5zbGF0ZS5hcHBseShtLCBvLnZhbHVlLm1hcChvYmplY3RWYWx1ZXMpKTtcbiAgICB9LFxuICAgIHRyYW5zbGF0ZTNkOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS50cmFuc2xhdGUuYXBwbHkobSwgby52YWx1ZS5tYXAob2JqZWN0VmFsdWVzKSk7XG4gICAgfSxcbiAgICB0cmFuc2xhdGVYOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS50cmFuc2xhdGUuYXBwbHkobSwgW28udmFsdWVbMF0udmFsdWUsIDAsIDBdKTtcbiAgICB9LFxuICAgIHRyYW5zbGF0ZVk6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnRyYW5zbGF0ZS5hcHBseShtLCBbMCwgby52YWx1ZVswXS52YWx1ZSwgMF0pO1xuICAgIH0sXG4gICAgdHJhbnNsYXRlWjogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0udHJhbnNsYXRlLmFwcGx5KG0sIFswLCAwLCBvLnZhbHVlWzBdLnZhbHVlXSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gb2JqZWN0VmFsdWVzKG9iaikge1xuICAgIHJldHVybiBvYmoudmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNzc0Z1bmN0aW9uVG9Kc0Z1bmN0aW9uKGNzc0Z1bmN0aW9uTmFtZSkge1xuICAgIHJldHVybiBqc0Z1bmN0aW9uc1tjc3NGdW5jdGlvbk5hbWVdO1xufVxuXG5mdW5jdGlvbiBwYXJzZWRUb0RlZ3JlZXMocGFyc2VkKSB7XG4gICAgaWYgKHBhcnNlZC51bml0cyA9PT0gJ3JhZCcpIHtcbiAgICAgICAgcGFyc2VkLnZhbHVlID0gdXRpbHMuYW5nbGVzLnJhZDJkZWcocGFyc2VkLnZhbHVlKTtcbiAgICAgICAgcGFyc2VkLnVuaXRzID0gJ2RlZyc7XG4gICAgfVxuICAgIGVsc2UgaWYgKHBhcnNlZC51bml0cyA9PT0gJ2dyYWQnKSB7XG4gICAgICAgIHBhcnNlZC52YWx1ZSA9IHV0aWxzLmFuZ2xlcy5ncmFkMmRlZyhwYXJzZWQudmFsdWUpO1xuICAgICAgICBwYXJzZWQudW5pdHMgPSAnZGVnJztcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1NYXRyaXgobWF0cml4LCBvcGVyYXRpb24pIHtcbiAgICAvLyBjb252ZXJ0IHRvIGRlZ3JlZXMgYmVjYXVzZSBhbGwgQ1NTTWF0cml4IG1ldGhvZHMgZXhwZWN0IGRlZ3JlZXNcbiAgICBvcGVyYXRpb24udmFsdWUgPSBvcGVyYXRpb24udmFsdWUubWFwKHBhcnNlZFRvRGVncmVlcyk7XG5cbiAgICB2YXIganNGdW5jdGlvbiA9IGNzc0Z1bmN0aW9uVG9Kc0Z1bmN0aW9uKG9wZXJhdGlvbi5rZXkpO1xuICAgIHZhciByZXN1bHQgICAgID0ganNGdW5jdGlvbihtYXRyaXgsIG9wZXJhdGlvbik7XG5cbiAgICByZXR1cm4gcmVzdWx0IHx8IG1hdHJpeDtcbn1cblxuLyoqXG4gKiAgVHJhbmZvcm1zIGEgYGVsLnN0eWxlLldlYmtpdFRyYW5zZm9ybWAtc3R5bGUgc3RyaW5nXG4gKiAgKGxpa2UgYHJvdGF0ZSgxOHJhZCkgdHJhbnNsYXRlM2QoNTBweCwgMTAwcHgsIDEwcHgpYClcbiAqICBpbnRvIGEgYGdldENvbXB1dGVkU3R5bGUoZWwpYC1zdHlsZSBtYXRyaXggc3RyaW5nXG4gKiAgKGxpa2UgYG1hdHJpeDNkKDAuNjYwMzE2LCAtMC43NTA5ODcsIDAsIDAsIDAuNzUwOTg3LCAwLjY2MDMxNiwgMCwgMCwgMCwgMCwgMSwgMCwgMTA4LjExNDU2MCwgMjguNDgyMzA4LCAxMCwgMSlgKVxuICogIEBwcml2YXRlXG4gKiAgQG1ldGhvZFxuICogIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1TdHJpbmcgLSBgZWwuc3R5bGUuV2Via2l0VHJhbnNmb3JtYC1zdHlsZSBzdHJpbmcgKGxpa2UgYHJvdGF0ZSgxOHJhZCkgdHJhbnNsYXRlM2QoNTBweCwgMTAwcHgsIDEwcHgpYClcbiAqL1xuZnVuY3Rpb24gdG9NYXRyaXhTdHJpbmcodHJhbnNmb3JtU3RyaW5nKSB7XG4gICAgdmFyIHN0YXRlbWVudHMgPSB1dGlscy50cmFuc3Auc3RyaW5nVG9TdGF0ZW1lbnRzKHRyYW5zZm9ybVN0cmluZyk7XG5cbiAgICBpZiAoc3RhdGVtZW50cy5sZW5ndGggPT09IDEgJiYgKC9ebWF0cml4LykudGVzdCh0cmFuc2Zvcm1TdHJpbmcpKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1TdHJpbmc7XG4gICAgfVxuXG4gICAgLy8gV2Ugb25seSB3YW50IHRoZSBzdGF0ZW1lbnQgdG8gcGFzcyB0byBgdXRpbHMudHJhbnNwLnN0YXRlbWVudFRvT2JqZWN0YFxuICAgIC8vICAgbm90IHRoZSBvdGhlciB2YWx1ZXMgKGluZGV4LCBsaXN0KSBmcm9tIGBtYXBgXG4gICAgdmFyIHN0YXRlbWVudFRvT2JqZWN0ID0gdXRpbHMuZnVuY3Mub25seUZpcnN0QXJnKHV0aWxzLnRyYW5zcC5zdGF0ZW1lbnRUb09iamVjdCk7XG4gICAgdmFyIG9wZXJhdGlvbnMgICAgICAgID0gc3RhdGVtZW50cy5tYXAoc3RhdGVtZW50VG9PYmplY3QpO1xuICAgIHZhciBzdGFydGluZ01hdHJpeCAgICA9IG5ldyBYQ1NTTWF0cml4KCk7XG4gICAgdmFyIHRyYW5zZm9ybWVkTWF0cml4ID0gb3BlcmF0aW9ucy5yZWR1Y2UodHJhbnNmb3JtTWF0cml4LCBzdGFydGluZ01hdHJpeCk7XG4gICAgdmFyIG1hdHJpeFN0cmluZyAgICAgID0gdHJhbnNmb3JtZWRNYXRyaXgudG9TdHJpbmcoKTtcblxuICAgIHJldHVybiBtYXRyaXhTdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gWENTU01hdHJpeDtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWcycmFkOiBkZWcycmFkLFxuICByYWQyZGVnOiByYWQyZGVnLFxuICBncmFkMmRlZzogZ3JhZDJkZWdcbn07XG5cbi8qKlxuICogIENvbnZlcnRzIGFuZ2xlcyBpbiBkZWdyZWVzLCB3aGljaCBhcmUgdXNlZCBieSB0aGUgZXh0ZXJuYWwgQVBJLCB0byBhbmdsZXNcbiAqICBpbiByYWRpYW5zIHVzZWQgaW4gaW50ZXJuYWwgY2FsY3VsYXRpb25zLlxuICogIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSAtIEFuIGFuZ2xlIGluIGRlZ3JlZXMuXG4gKiAgQHJldHVybnMge251bWJlcn0gcmFkaWFuc1xuICovXG5mdW5jdGlvbiBkZWcycmFkKGFuZ2xlKSB7XG4gICAgcmV0dXJuIGFuZ2xlICogTWF0aC5QSSAvIDE4MDtcbn1cblxuZnVuY3Rpb24gcmFkMmRlZyhyYWRpYW5zKSB7XG4gICAgcmV0dXJuIHJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSk7XG59XG5cbmZ1bmN0aW9uIGdyYWQyZGVnKGdyYWRpYW5zKSB7XG4gICAgLy8gNDAwIGdyYWRpYW5zIGluIDM2MCBkZWdyZWVzXG4gICAgcmV0dXJuIGdyYWRpYW5zIC8gKDQwMCAvIDM2MCk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBtYXRyaXhGbjJkOiAnbWF0cml4JyxcbiAgICBtYXRyaXhGbjNkOiAnbWF0cml4M2QnLFxuICAgIHZhbHVlVG9PYmplY3Q6IHZhbHVlVG9PYmplY3QsXG4gICAgc3RhdGVtZW50VG9PYmplY3Q6IHN0YXRlbWVudFRvT2JqZWN0LFxuICAgIHN0cmluZ1RvU3RhdGVtZW50czogc3RyaW5nVG9TdGF0ZW1lbnRzXG59O1xuXG5mdW5jdGlvbiB2YWx1ZVRvT2JqZWN0KHZhbHVlKSB7XG4gICAgdmFyIHVuaXRzID0gLyhbXFwtXFwrXT9bMC05XStbXFwuMC05XSopKGRlZ3xyYWR8Z3JhZHxweHwlKSovO1xuICAgIHZhciBwYXJ0cyA9IHZhbHVlLm1hdGNoKHVuaXRzKSB8fCBbXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBwYXJzZUZsb2F0KHBhcnRzWzFdKSxcbiAgICAgICAgdW5pdHM6IHBhcnRzWzJdLFxuICAgICAgICB1bnBhcnNlZDogdmFsdWVcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzdGF0ZW1lbnRUb09iamVjdChzdGF0ZW1lbnQsIHNraXBWYWx1ZXMpIHtcbiAgICB2YXIgbmFtZUFuZEFyZ3MgICAgPSAvKFxcdyspXFwoKFteXFwpXSspXFwpL2k7XG4gICAgdmFyIHN0YXRlbWVudFBhcnRzID0gc3RhdGVtZW50LnRvU3RyaW5nKCkubWF0Y2gobmFtZUFuZEFyZ3MpLnNsaWNlKDEpO1xuICAgIHZhciBmdW5jdGlvbk5hbWUgICA9IHN0YXRlbWVudFBhcnRzWzBdO1xuICAgIHZhciBzdHJpbmdWYWx1ZXMgICA9IHN0YXRlbWVudFBhcnRzWzFdLnNwbGl0KC8sID8vKTtcbiAgICB2YXIgcGFyc2VkVmFsdWVzICAgPSAhc2tpcFZhbHVlcyAmJiBzdHJpbmdWYWx1ZXMubWFwKHZhbHVlVG9PYmplY3QpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBmdW5jdGlvbk5hbWUsXG4gICAgICAgIHZhbHVlOiBwYXJzZWRWYWx1ZXMgfHwgc3RyaW5nVmFsdWVzLFxuICAgICAgICB1bnBhcnNlZDogc3RhdGVtZW50XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gc3RyaW5nVG9TdGF0ZW1lbnRzKHRyYW5zZm9ybVN0cmluZykge1xuICAgIHZhciBmdW5jdGlvblNpZ25hdHVyZSAgID0gLyhcXHcrKVxcKFteXFwpXStcXCkvaWc7XG4gICAgdmFyIHRyYW5zZm9ybVN0YXRlbWVudHMgPSB0cmFuc2Zvcm1TdHJpbmcubWF0Y2goZnVuY3Rpb25TaWduYXR1cmUpIHx8IFtdO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybVN0YXRlbWVudHM7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGV0ZXJtaW5hbnQyeDI6IGRldGVybWluYW50MngyLFxuICBkZXRlcm1pbmFudDN4MzogZGV0ZXJtaW5hbnQzeDMsXG4gIGRldGVybWluYW50NHg0OiBkZXRlcm1pbmFudDR4NCxcbiAgaXNBZmZpbmU6IGlzQWZmaW5lLFxuICBpc0lkZW50aXR5T3JUcmFuc2xhdGlvbjogaXNJZGVudGl0eU9yVHJhbnNsYXRpb24sXG4gIGFkam9pbnQ6IGFkam9pbnQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG11bHRpcGx5OiBtdWx0aXBseSxcbiAgZGVjb21wb3NlOiBkZWNvbXBvc2Vcbn07XG5cbi8qKlxuICogIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgMngyIG1hdHJpeC5cbiAqICBAcGFyYW0ge251bWJlcn0gYSAtIFRvcC1sZWZ0IHZhbHVlIG9mIHRoZSBtYXRyaXguXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGIgLSBUb3AtcmlnaHQgdmFsdWUgb2YgdGhlIG1hdHJpeC5cbiAqICBAcGFyYW0ge251bWJlcn0gYyAtIEJvdHRvbS1sZWZ0IHZhbHVlIG9mIHRoZSBtYXRyaXguXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGQgLSBCb3R0b20tcmlnaHQgdmFsdWUgb2YgdGhlIG1hdHJpeC5cbiAqICBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBkZXRlcm1pbmFudDJ4MihhLCBiLCBjLCBkKSB7XG4gICAgcmV0dXJuIGEgKiBkIC0gYiAqIGM7XG59XG5cbi8qKlxuICogIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgM3gzIG1hdHJpeC5cbiAqICBAcGFyYW0ge251bWJlcn0gYTEgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzEsIDFdLlxuICogIEBwYXJhbSB7bnVtYmVyfSBhMiAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMSwgMl0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGEzIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFsxLCAzXS5cbiAqICBAcGFyYW0ge251bWJlcn0gYjEgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzIsIDFdLlxuICogIEBwYXJhbSB7bnVtYmVyfSBiMiAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMiwgMl0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGIzIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFsyLCAzXS5cbiAqICBAcGFyYW0ge251bWJlcn0gYzEgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzMsIDFdLlxuICogIEBwYXJhbSB7bnVtYmVyfSBjMiAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMywgMl0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGMzIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFszLCAzXS5cbiAqICBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBkZXRlcm1pbmFudDN4MyhhMSwgYTIsIGEzLCBiMSwgYjIsIGIzLCBjMSwgYzIsIGMzKSB7XG5cbiAgICByZXR1cm4gYTEgKiBkZXRlcm1pbmFudDJ4MihiMiwgYjMsIGMyLCBjMykgLVxuICAgICAgICAgICBiMSAqIGRldGVybWluYW50MngyKGEyLCBhMywgYzIsIGMzKSArXG4gICAgICAgICAgIGMxICogZGV0ZXJtaW5hbnQyeDIoYTIsIGEzLCBiMiwgYjMpO1xufVxuXG4vKipcbiAqICBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIDR4NCBtYXRyaXguXG4gKiAgQHBhcmFtIHtYQ1NTTWF0cml4fSBtYXRyaXggLSBUaGUgbWF0cml4IHRvIGNhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnQgb2YuXG4gKiAgQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZGV0ZXJtaW5hbnQ0eDQobWF0cml4KSB7XG4gICAgdmFyXG4gICAgICAgIG0gPSBtYXRyaXgsXG4gICAgICAgIC8vIEFzc2lnbiB0byBpbmRpdmlkdWFsIHZhcmlhYmxlIG5hbWVzIHRvIGFpZCBzZWxlY3RpbmcgY29ycmVjdCBlbGVtZW50c1xuICAgICAgICBhMSA9IG0ubTExLCBiMSA9IG0ubTIxLCBjMSA9IG0ubTMxLCBkMSA9IG0ubTQxLFxuICAgICAgICBhMiA9IG0ubTEyLCBiMiA9IG0ubTIyLCBjMiA9IG0ubTMyLCBkMiA9IG0ubTQyLFxuICAgICAgICBhMyA9IG0ubTEzLCBiMyA9IG0ubTIzLCBjMyA9IG0ubTMzLCBkMyA9IG0ubTQzLFxuICAgICAgICBhNCA9IG0ubTE0LCBiNCA9IG0ubTI0LCBjNCA9IG0ubTM0LCBkNCA9IG0ubTQ0O1xuXG4gICAgcmV0dXJuIGExICogZGV0ZXJtaW5hbnQzeDMoYjIsIGIzLCBiNCwgYzIsIGMzLCBjNCwgZDIsIGQzLCBkNCkgLVxuICAgICAgICAgICBiMSAqIGRldGVybWluYW50M3gzKGEyLCBhMywgYTQsIGMyLCBjMywgYzQsIGQyLCBkMywgZDQpICtcbiAgICAgICAgICAgYzEgKiBkZXRlcm1pbmFudDN4MyhhMiwgYTMsIGE0LCBiMiwgYjMsIGI0LCBkMiwgZDMsIGQ0KSAtXG4gICAgICAgICAgIGQxICogZGV0ZXJtaW5hbnQzeDMoYTIsIGEzLCBhNCwgYjIsIGIzLCBiNCwgYzIsIGMzLCBjNCk7XG59XG5cbi8qKlxuICogIERldGVybWluZXMgd2hldGhlciB0aGUgbWF0cml4IGlzIGFmZmluZS5cbiAqICBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNBZmZpbmUobWF0cml4KSB7XG4gICAgcmV0dXJuIG1hdHJpeC5tMTMgPT09IDAgJiYgbWF0cml4Lm0xNCA9PT0gMCAmJlxuICAgICAgICAgICBtYXRyaXgubTIzID09PSAwICYmIG1hdHJpeC5tMjQgPT09IDAgJiZcbiAgICAgICAgICAgbWF0cml4Lm0zMSA9PT0gMCAmJiBtYXRyaXgubTMyID09PSAwICYmXG4gICAgICAgICAgIG1hdHJpeC5tMzMgPT09IDEgJiYgbWF0cml4Lm0zNCA9PT0gMCAmJlxuICAgICAgICAgICBtYXRyaXgubTQzID09PSAwICYmIG1hdHJpeC5tNDQgPT09IDE7XG59XG5cbi8qKlxuICogIFJldHVybnMgd2hldGhlciB0aGUgbWF0cml4IGlzIHRoZSBpZGVudGl0eSBtYXRyaXggb3IgYSB0cmFuc2xhdGlvbiBtYXRyaXguXG4gKiAgQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNJZGVudGl0eU9yVHJhbnNsYXRpb24obWF0cml4KSB7XG4gICAgdmFyIG0gPSBtYXRyaXg7XG5cbiAgICByZXR1cm4gbS5tMTEgPT09IDEgJiYgbS5tMTIgPT09IDAgJiYgbS5tMTMgPT09IDAgJiYgbS5tMTQgPT09IDAgJiZcbiAgICAgICAgICAgbS5tMjEgPT09IDAgJiYgbS5tMjIgPT09IDEgJiYgbS5tMjMgPT09IDAgJiYgbS5tMjQgPT09IDAgJiZcbiAgICAgICAgICAgbS5tMzEgPT09IDAgJiYgbS5tMzEgPT09IDAgJiYgbS5tMzMgPT09IDEgJiYgbS5tMzQgPT09IDAgJiZcbiAgICAvKiBtNDEsIG00MiBhbmQgbTQzIGFyZSB0aGUgdHJhbnNsYXRpb24gcG9pbnRzICovICAgbS5tNDQgPT09IDE7XG59XG5cbi8qKlxuICogIFJldHVybnMgdGhlIGFkam9pbnQgbWF0cml4LlxuICogIEByZXR1cm4ge1hDU1NNYXRyaXh9XG4gKi9cbmZ1bmN0aW9uIGFkam9pbnQobWF0cml4KSB7XG4gICAgdmFyIG0gPSBtYXRyaXgsXG4gICAgICAgIC8vIG1ha2UgYHJlc3VsdGAgdGhlIHNhbWUgdHlwZSBhcyB0aGUgZ2l2ZW4gbWV0cmljXG4gICAgICAgIHJlc3VsdCA9IG5ldyBtYXRyaXguY29uc3RydWN0b3IoKSxcblxuICAgICAgICBhMSA9IG0ubTExLCBiMSA9IG0ubTEyLCBjMSA9IG0ubTEzLCBkMSA9IG0ubTE0LFxuICAgICAgICBhMiA9IG0ubTIxLCBiMiA9IG0ubTIyLCBjMiA9IG0ubTIzLCBkMiA9IG0ubTI0LFxuICAgICAgICBhMyA9IG0ubTMxLCBiMyA9IG0ubTMyLCBjMyA9IG0ubTMzLCBkMyA9IG0ubTM0LFxuICAgICAgICBhNCA9IG0ubTQxLCBiNCA9IG0ubTQyLCBjNCA9IG0ubTQzLCBkNCA9IG0ubTQ0O1xuXG4gICAgLy8gUm93IGNvbHVtbiBsYWJlbGluZyByZXZlcnNlZCBzaW5jZSB3ZSB0cmFuc3Bvc2Ugcm93cyAmIGNvbHVtbnNcbiAgICByZXN1bHQubTExID0gIGRldGVybWluYW50M3gzKGIyLCBiMywgYjQsIGMyLCBjMywgYzQsIGQyLCBkMywgZDQpO1xuICAgIHJlc3VsdC5tMjEgPSAtZGV0ZXJtaW5hbnQzeDMoYTIsIGEzLCBhNCwgYzIsIGMzLCBjNCwgZDIsIGQzLCBkNCk7XG4gICAgcmVzdWx0Lm0zMSA9ICBkZXRlcm1pbmFudDN4MyhhMiwgYTMsIGE0LCBiMiwgYjMsIGI0LCBkMiwgZDMsIGQ0KTtcbiAgICByZXN1bHQubTQxID0gLWRldGVybWluYW50M3gzKGEyLCBhMywgYTQsIGIyLCBiMywgYjQsIGMyLCBjMywgYzQpO1xuXG4gICAgcmVzdWx0Lm0xMiA9IC1kZXRlcm1pbmFudDN4MyhiMSwgYjMsIGI0LCBjMSwgYzMsIGM0LCBkMSwgZDMsIGQ0KTtcbiAgICByZXN1bHQubTIyID0gIGRldGVybWluYW50M3gzKGExLCBhMywgYTQsIGMxLCBjMywgYzQsIGQxLCBkMywgZDQpO1xuICAgIHJlc3VsdC5tMzIgPSAtZGV0ZXJtaW5hbnQzeDMoYTEsIGEzLCBhNCwgYjEsIGIzLCBiNCwgZDEsIGQzLCBkNCk7XG4gICAgcmVzdWx0Lm00MiA9ICBkZXRlcm1pbmFudDN4MyhhMSwgYTMsIGE0LCBiMSwgYjMsIGI0LCBjMSwgYzMsIGM0KTtcblxuICAgIHJlc3VsdC5tMTMgPSAgZGV0ZXJtaW5hbnQzeDMoYjEsIGIyLCBiNCwgYzEsIGMyLCBjNCwgZDEsIGQyLCBkNCk7XG4gICAgcmVzdWx0Lm0yMyA9IC1kZXRlcm1pbmFudDN4MyhhMSwgYTIsIGE0LCBjMSwgYzIsIGM0LCBkMSwgZDIsIGQ0KTtcbiAgICByZXN1bHQubTMzID0gIGRldGVybWluYW50M3gzKGExLCBhMiwgYTQsIGIxLCBiMiwgYjQsIGQxLCBkMiwgZDQpO1xuICAgIHJlc3VsdC5tNDMgPSAtZGV0ZXJtaW5hbnQzeDMoYTEsIGEyLCBhNCwgYjEsIGIyLCBiNCwgYzEsIGMyLCBjNCk7XG5cbiAgICByZXN1bHQubTE0ID0gLWRldGVybWluYW50M3gzKGIxLCBiMiwgYjMsIGMxLCBjMiwgYzMsIGQxLCBkMiwgZDMpO1xuICAgIHJlc3VsdC5tMjQgPSAgZGV0ZXJtaW5hbnQzeDMoYTEsIGEyLCBhMywgYzEsIGMyLCBjMywgZDEsIGQyLCBkMyk7XG4gICAgcmVzdWx0Lm0zNCA9IC1kZXRlcm1pbmFudDN4MyhhMSwgYTIsIGEzLCBiMSwgYjIsIGIzLCBkMSwgZDIsIGQzKTtcbiAgICByZXN1bHQubTQ0ID0gIGRldGVybWluYW50M3gzKGExLCBhMiwgYTMsIGIxLCBiMiwgYjMsIGMxLCBjMiwgYzMpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaW52ZXJzZShtYXRyaXgpIHtcbiAgdmFyIGludjtcblxuICBpZiAoaXNJZGVudGl0eU9yVHJhbnNsYXRpb24obWF0cml4KSkge1xuICAgICAgaW52ID0gbmV3IG1hdHJpeC5jb25zdHJ1Y3RvcigpO1xuXG4gICAgICBpZiAoIShtYXRyaXgubTQxID09PSAwICYmIG1hdHJpeC5tNDIgPT09IDAgJiYgbWF0cml4Lm00MyA9PT0gMCkpIHtcbiAgICAgICAgICBpbnYubTQxID0gLW1hdHJpeC5tNDE7XG4gICAgICAgICAgaW52Lm00MiA9IC1tYXRyaXgubTQyO1xuICAgICAgICAgIGludi5tNDMgPSAtbWF0cml4Lm00MztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGludjtcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSB0aGUgYWRqb2ludCBtYXRyaXhcbiAgdmFyIHJlc3VsdCA9IGFkam9pbnQobWF0cml4KTtcblxuICAvLyBDYWxjdWxhdGUgdGhlIDR4NCBkZXRlcm1pbmFudFxuICB2YXIgZGV0ID0gZGV0ZXJtaW5hbnQ0eDQobWF0cml4KTtcblxuICAvLyBJZiB0aGUgZGV0ZXJtaW5hbnQgaXMgemVybywgdGhlbiB0aGUgaW52ZXJzZSBtYXRyaXggaXMgbm90IHVuaXF1ZVxuICBpZiAoTWF0aC5hYnMoZGV0KSA8IDFlLTgpIHJldHVybiBudWxsO1xuXG4gIC8vIFNjYWxlIHRoZSBhZGpvaW50IG1hdHJpeCB0byBnZXQgdGhlIGludmVyc2VcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCA1OyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgNTsgaisrKSB7XG4gICAgICAgICAgcmVzdWx0WygnbScgKyBpKSArIGpdIC89IGRldDtcbiAgICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KG1hdHJpeCwgb3RoZXJNYXRyaXgpIHtcbiAgaWYgKCFvdGhlck1hdHJpeCkgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGEgPSBvdGhlck1hdHJpeCxcbiAgICAgIGIgPSBtYXRyaXgsXG4gICAgICBjID0gbmV3IG1hdHJpeC5jb25zdHJ1Y3RvcigpO1xuXG4gIGMubTExID0gYS5tMTEgKiBiLm0xMSArIGEubTEyICogYi5tMjEgKyBhLm0xMyAqIGIubTMxICsgYS5tMTQgKiBiLm00MTtcbiAgYy5tMTIgPSBhLm0xMSAqIGIubTEyICsgYS5tMTIgKiBiLm0yMiArIGEubTEzICogYi5tMzIgKyBhLm0xNCAqIGIubTQyO1xuICBjLm0xMyA9IGEubTExICogYi5tMTMgKyBhLm0xMiAqIGIubTIzICsgYS5tMTMgKiBiLm0zMyArIGEubTE0ICogYi5tNDM7XG4gIGMubTE0ID0gYS5tMTEgKiBiLm0xNCArIGEubTEyICogYi5tMjQgKyBhLm0xMyAqIGIubTM0ICsgYS5tMTQgKiBiLm00NDtcblxuICBjLm0yMSA9IGEubTIxICogYi5tMTEgKyBhLm0yMiAqIGIubTIxICsgYS5tMjMgKiBiLm0zMSArIGEubTI0ICogYi5tNDE7XG4gIGMubTIyID0gYS5tMjEgKiBiLm0xMiArIGEubTIyICogYi5tMjIgKyBhLm0yMyAqIGIubTMyICsgYS5tMjQgKiBiLm00MjtcbiAgYy5tMjMgPSBhLm0yMSAqIGIubTEzICsgYS5tMjIgKiBiLm0yMyArIGEubTIzICogYi5tMzMgKyBhLm0yNCAqIGIubTQzO1xuICBjLm0yNCA9IGEubTIxICogYi5tMTQgKyBhLm0yMiAqIGIubTI0ICsgYS5tMjMgKiBiLm0zNCArIGEubTI0ICogYi5tNDQ7XG5cbiAgYy5tMzEgPSBhLm0zMSAqIGIubTExICsgYS5tMzIgKiBiLm0yMSArIGEubTMzICogYi5tMzEgKyBhLm0zNCAqIGIubTQxO1xuICBjLm0zMiA9IGEubTMxICogYi5tMTIgKyBhLm0zMiAqIGIubTIyICsgYS5tMzMgKiBiLm0zMiArIGEubTM0ICogYi5tNDI7XG4gIGMubTMzID0gYS5tMzEgKiBiLm0xMyArIGEubTMyICogYi5tMjMgKyBhLm0zMyAqIGIubTMzICsgYS5tMzQgKiBiLm00MztcbiAgYy5tMzQgPSBhLm0zMSAqIGIubTE0ICsgYS5tMzIgKiBiLm0yNCArIGEubTMzICogYi5tMzQgKyBhLm0zNCAqIGIubTQ0O1xuXG4gIGMubTQxID0gYS5tNDEgKiBiLm0xMSArIGEubTQyICogYi5tMjEgKyBhLm00MyAqIGIubTMxICsgYS5tNDQgKiBiLm00MTtcbiAgYy5tNDIgPSBhLm00MSAqIGIubTEyICsgYS5tNDIgKiBiLm0yMiArIGEubTQzICogYi5tMzIgKyBhLm00NCAqIGIubTQyO1xuICBjLm00MyA9IGEubTQxICogYi5tMTMgKyBhLm00MiAqIGIubTIzICsgYS5tNDMgKiBiLm0zMyArIGEubTQ0ICogYi5tNDM7XG4gIGMubTQ0ID0gYS5tNDEgKiBiLm0xNCArIGEubTQyICogYi5tMjQgKyBhLm00MyAqIGIubTM0ICsgYS5tNDQgKiBiLm00NDtcblxuICByZXR1cm4gYztcbn1cblxuZnVuY3Rpb24gdHJhbnNwb3NlKG1hdHJpeCkge1xuICB2YXIgcmVzdWx0ID0gbmV3IG1hdHJpeC5jb25zdHJ1Y3RvcigpO1xuICB2YXIgcm93cyA9IDQsIGNvbHMgPSA0O1xuICB2YXIgaSA9IGNvbHMsIGo7XG4gIHdoaWxlIChpKSB7XG4gICAgaiA9IHJvd3M7XG4gICAgd2hpbGUgKGopIHtcbiAgICAgIHJlc3VsdFsnbScgKyBpICsgal0gPSBtYXRyaXhbJ20nKyBqICsgaV07XG4gICAgICBqLS07XG4gICAgfVxuICAgIGktLTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKlxuICBJbnB1dDogIG1hdHJpeCAgICAgIDsgYSA0eDQgbWF0cml4XG4gIE91dHB1dDogdHJhbnNsYXRpb24gOyBhIDMgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgIHNjYWxlICAgICAgIDsgYSAzIGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICBza2V3ICAgICAgICA7IHNrZXcgZmFjdG9ycyBYWSxYWixZWiByZXByZXNlbnRlZCBhcyBhIDMgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgIHBlcnNwZWN0aXZlIDsgYSA0IGNvbXBvbmVudCB2ZWN0b3JcbiAgICAgICAgICByb3RhdGUgIDsgYSA0IGNvbXBvbmVudCB2ZWN0b3JcbiAgUmV0dXJucyBmYWxzZSBpZiB0aGUgbWF0cml4IGNhbm5vdCBiZSBkZWNvbXBvc2VkLCB0cnVlIGlmIGl0IGNhblxuKi9cbnZhciBWZWN0b3I0ID0gcmVxdWlyZSgnLi4vVmVjdG9yNC5qcycpO1xuZnVuY3Rpb24gZGVjb21wb3NlKG1hdHJpeCkge1xuICB2YXIgcGVyc3BlY3RpdmVNYXRyaXgsIHJpZ2h0SGFuZFNpZGUsIGludmVyc2VQZXJzcGVjdGl2ZU1hdHJpeCwgdHJhbnNwb3NlZEludmVyc2VQZXJzcGVjdGl2ZU1hdHJpeCxcbiAgICAgIHBlcnNwZWN0aXZlLCB0cmFuc2xhdGUsIHJvdywgaSwgbGVuLCBzY2FsZSwgc2tldywgcGR1bTMsIHJvdGF0ZTtcblxuICAvLyBOb3JtYWxpemUgdGhlIG1hdHJpeC5cbiAgaWYgKG1hdHJpeC5tMzMgPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICBmb3IgKGkgPSAxOyBpIDw9IDQ7IGkrKykge1xuICAgIGZvciAoaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgIG1hdHJpeFsnbScraStqXSAvPSBtYXRyaXgubTQ0O1xuICAgIH1cbiAgfVxuXG4gIC8vIHBlcnNwZWN0aXZlTWF0cml4IGlzIHVzZWQgdG8gc29sdmUgZm9yIHBlcnNwZWN0aXZlLCBidXQgaXQgYWxzbyBwcm92aWRlc1xuICAvLyBhbiBlYXN5IHdheSB0byB0ZXN0IGZvciBzaW5ndWxhcml0eSBvZiB0aGUgdXBwZXIgM3gzIGNvbXBvbmVudC5cbiAgcGVyc3BlY3RpdmVNYXRyaXggPSBtYXRyaXg7XG4gIHBlcnNwZWN0aXZlTWF0cml4Lm0xNCA9IDA7XG4gIHBlcnNwZWN0aXZlTWF0cml4Lm0yNCA9IDA7XG4gIHBlcnNwZWN0aXZlTWF0cml4Lm0zNCA9IDA7XG4gIHBlcnNwZWN0aXZlTWF0cml4Lm00NCA9IDE7XG5cbiAgaWYgKGRldGVybWluYW50NHg0KHBlcnNwZWN0aXZlTWF0cml4KSA9PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRmlyc3QsIGlzb2xhdGUgcGVyc3BlY3RpdmUuXG4gIGlmIChtYXRyaXgubTE0ICE9IDAgfHwgbWF0cml4Lm0yNCAhPSAwIHx8IG1hdHJpeC5tMzQgIT0gMCkge1xuICAgIC8vIHJpZ2h0SGFuZFNpZGUgaXMgdGhlIHJpZ2h0IGhhbmQgc2lkZSBvZiB0aGUgZXF1YXRpb24uXG4gICAgcmlnaHRIYW5kU2lkZSA9IG5ldyBWZWN0b3I0KG1hdHJpeC5tMTQsIG1hdHJpeC5tMjQsIG1hdHJpeC5tMzQsIG1hdHJpeC5tNDQpO1xuXG4gICAgLy8gU29sdmUgdGhlIGVxdWF0aW9uIGJ5IGludmVydGluZyBwZXJzcGVjdGl2ZU1hdHJpeCBhbmQgbXVsdGlwbHlpbmdcbiAgICAvLyByaWdodEhhbmRTaWRlIGJ5IHRoZSBpbnZlcnNlLlxuICAgIGludmVyc2VQZXJzcGVjdGl2ZU1hdHJpeCA9IGludmVyc2UocGVyc3BlY3RpdmVNYXRyaXgpO1xuICAgIHRyYW5zcG9zZWRJbnZlcnNlUGVyc3BlY3RpdmVNYXRyaXggPSB0cmFuc3Bvc2UoaW52ZXJzZVBlcnNwZWN0aXZlTWF0cml4KTtcbiAgICBwZXJzcGVjdGl2ZSA9IHJpZ2h0SGFuZFNpZGUubXVsdGlwbHlCeU1hdHJpeCh0cmFuc3Bvc2VkSW52ZXJzZVBlcnNwZWN0aXZlTWF0cml4KTtcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBObyBwZXJzcGVjdGl2ZS5cbiAgICBwZXJzcGVjdGl2ZSA9IG5ldyBWZWN0b3I0KDAsIDAsIDAsIDEpO1xuICB9XG5cbiAgLy8gTmV4dCB0YWtlIGNhcmUgb2YgdHJhbnNsYXRpb25cbiAgdHJhbnNsYXRlID0gbmV3IFZlY3RvcjQobWF0cml4Lm00MSwgbWF0cml4Lm00MiwgbWF0cml4Lm00Myk7XG5cbiAgLy8gTm93IGdldCBzY2FsZSBhbmQgc2hlYXIuICdyb3cnIGlzIGEgMyBlbGVtZW50IGFycmF5IG9mIDMgY29tcG9uZW50IHZlY3RvcnNcbiAgcm93ID0gWyBuZXcgVmVjdG9yNCgpLCBuZXcgVmVjdG9yNCgpLCBuZXcgVmVjdG9yNCgpIF07XG4gIGZvciAoaSA9IDEsIGxlbiA9IHJvdy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJvd1tpLTFdLnggPSBtYXRyaXhbJ20nK2krJzEnXTtcbiAgICByb3dbaS0xXS55ID0gbWF0cml4WydtJytpKycyJ107XG4gICAgcm93W2ktMV0ueiA9IG1hdHJpeFsnbScraSsnMyddO1xuICB9XG5cbiAgLy8gQ29tcHV0ZSBYIHNjYWxlIGZhY3RvciBhbmQgbm9ybWFsaXplIGZpcnN0IHJvdy5cbiAgc2NhbGUgPSBuZXcgVmVjdG9yNCgpO1xuICBza2V3ID0gbmV3IFZlY3RvcjQoKTtcblxuICBzY2FsZS54ID0gcm93WzBdLmxlbmd0aCgpO1xuICByb3dbMF0gPSByb3dbMF0ubm9ybWFsaXplKCk7XG5cbiAgLy8gQ29tcHV0ZSBYWSBzaGVhciBmYWN0b3IgYW5kIG1ha2UgMm5kIHJvdyBvcnRob2dvbmFsIHRvIDFzdC5cbiAgc2tldy54ID0gcm93WzBdLmRvdChyb3dbMV0pO1xuICByb3dbMV0gPSByb3dbMV0uY29tYmluZShyb3dbMF0sIDEuMCwgLXNrZXcueCk7XG5cbiAgLy8gTm93LCBjb21wdXRlIFkgc2NhbGUgYW5kIG5vcm1hbGl6ZSAybmQgcm93LlxuICBzY2FsZS55ID0gcm93WzFdLmxlbmd0aCgpO1xuICByb3dbMV0gPSByb3dbMV0ubm9ybWFsaXplKCk7XG4gIHNrZXcueCAvPSBzY2FsZS55O1xuXG4gIC8vIENvbXB1dGUgWFogYW5kIFlaIHNoZWFycywgb3J0aG9nb25hbGl6ZSAzcmQgcm93XG4gIHNrZXcueSA9IHJvd1swXS5kb3Qocm93WzJdKTtcbiAgcm93WzJdID0gcm93WzJdLmNvbWJpbmUocm93WzBdLCAxLjAsIC1za2V3LnkpO1xuICBza2V3LnogPSByb3dbMV0uZG90KHJvd1syXSk7XG4gIHJvd1syXSA9IHJvd1syXS5jb21iaW5lKHJvd1sxXSwgMS4wLCAtc2tldy56KTtcblxuICAvLyBOZXh0LCBnZXQgWiBzY2FsZSBhbmQgbm9ybWFsaXplIDNyZCByb3cuXG4gIHNjYWxlLnogPSByb3dbMl0ubGVuZ3RoKCk7XG4gIHJvd1syXSA9IHJvd1syXS5ub3JtYWxpemUoKTtcbiAgc2tldy55ID0gKHNrZXcueSAvIHNjYWxlLnopIHx8IDA7XG4gIHNrZXcueiA9IChza2V3LnogLyBzY2FsZS56KSB8fCAwO1xuXG4gIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBtYXRyaXggKGluIHJvd3MpIGlzIG9ydGhvbm9ybWFsLlxuICAvLyBDaGVjayBmb3IgYSBjb29yZGluYXRlIHN5c3RlbSBmbGlwLiAgSWYgdGhlIGRldGVybWluYW50XG4gIC8vIGlzIC0xLCB0aGVuIG5lZ2F0ZSB0aGUgbWF0cml4IGFuZCB0aGUgc2NhbGluZyBmYWN0b3JzLlxuICBwZHVtMyA9IHJvd1sxXS5jcm9zcyhyb3dbMl0pO1xuICBpZiAocm93WzBdLmRvdChwZHVtMykgPCAwKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgc2NhbGUueCAqPSAtMTtcbiAgICAgIHJvd1tpXS54ICo9IC0xO1xuICAgICAgcm93W2ldLnkgKj0gLTE7XG4gICAgICByb3dbaV0ueiAqPSAtMTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3csIGdldCB0aGUgcm90YXRpb25zIG91dFxuICAvLyBGUk9NIFczQ1xuICByb3RhdGUgPSBuZXcgVmVjdG9yNCgpO1xuICByb3RhdGUueCA9IDAuNSAqIE1hdGguc3FydChNYXRoLm1heCgxICsgcm93WzBdLnggLSByb3dbMV0ueSAtIHJvd1syXS56LCAwKSk7XG4gIHJvdGF0ZS55ID0gMC41ICogTWF0aC5zcXJ0KE1hdGgubWF4KDEgLSByb3dbMF0ueCArIHJvd1sxXS55IC0gcm93WzJdLnosIDApKTtcbiAgcm90YXRlLnogPSAwLjUgKiBNYXRoLnNxcnQoTWF0aC5tYXgoMSAtIHJvd1swXS54IC0gcm93WzFdLnkgKyByb3dbMl0ueiwgMCkpO1xuICByb3RhdGUudyA9IDAuNSAqIE1hdGguc3FydChNYXRoLm1heCgxICsgcm93WzBdLnggKyByb3dbMV0ueSArIHJvd1syXS56LCAwKSk7XG5cbiAgLy8gaWYgKHJvd1syXS55ID4gcm93WzFdLnopIHJvdGF0ZVswXSA9IC1yb3RhdGVbMF07XG4gIC8vIGlmIChyb3dbMF0ueiA+IHJvd1syXS54KSByb3RhdGVbMV0gPSAtcm90YXRlWzFdO1xuICAvLyBpZiAocm93WzFdLnggPiByb3dbMF0ueSkgcm90YXRlWzJdID0gLXJvdGF0ZVsyXTtcblxuICAvLyBGUk9NIE1PUkYuSlNcbiAgcm90YXRlLnkgPSBNYXRoLmFzaW4oLXJvd1swXS56KTtcbiAgaWYgKE1hdGguY29zKHJvdGF0ZS55KSAhPSAwKSB7XG4gICAgcm90YXRlLnggPSBNYXRoLmF0YW4yKHJvd1sxXS56LCByb3dbMl0ueik7XG4gICAgcm90YXRlLnogPSBNYXRoLmF0YW4yKHJvd1swXS55LCByb3dbMF0ueCk7XG4gIH0gZWxzZSB7XG4gICAgcm90YXRlLnggPSBNYXRoLmF0YW4yKC1yb3dbMl0ueCwgcm93WzFdLnkpO1xuICAgIHJvdGF0ZS56ID0gMDtcbiAgfVxuXG4gIC8vIEZST00gaHR0cDovL2Jsb2cuYndoaXRpbmcuY28udWsvP3A9MjZcbiAgLy8gc2NhbGUueDIgPSBNYXRoLnNxcnQobWF0cml4Lm0xMSptYXRyaXgubTExICsgbWF0cml4Lm0yMSptYXRyaXgubTIxICsgbWF0cml4Lm0zMSptYXRyaXgubTMxKTtcbiAgLy8gc2NhbGUueTIgPSBNYXRoLnNxcnQobWF0cml4Lm0xMiptYXRyaXgubTEyICsgbWF0cml4Lm0yMiptYXRyaXgubTIyICsgbWF0cml4Lm0zMiptYXRyaXgubTMyKTtcbiAgLy8gc2NhbGUuejIgPSBNYXRoLnNxcnQobWF0cml4Lm0xMyptYXRyaXgubTEzICsgbWF0cml4Lm0yMyptYXRyaXgubTIzICsgbWF0cml4Lm0zMyptYXRyaXgubTMzKTtcblxuICAvLyByb3RhdGUueDIgPSBNYXRoLmF0YW4yKG1hdHJpeC5tMjMvc2NhbGUuejIsIG1hdHJpeC5tMzMvc2NhbGUuejIpO1xuICAvLyByb3RhdGUueTIgPSAtTWF0aC5hc2luKG1hdHJpeC5tMTMvc2NhbGUuejIpO1xuICAvLyByb3RhdGUuejIgPSBNYXRoLmF0YW4yKG1hdHJpeC5tMTIvc2NhbGUueTIsIG1hdHJpeC5tMTEvc2NhbGUueDIpO1xuXG4gIHJldHVybiB7XG4gICAgcGVyc3BlY3RpdmUgOiBwZXJzcGVjdGl2ZSxcbiAgICB0cmFuc2xhdGUgICA6IHRyYW5zbGF0ZSxcbiAgICBza2V3ICAgICAgICA6IHNrZXcsXG4gICAgc2NhbGUgICAgICAgOiBzY2FsZSxcbiAgICByb3RhdGUgICAgICA6IHJvdGF0ZVxuICB9O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxlbmd0aCAgICAgICAgICAgOiBsZW5ndGgsXG4gIG5vcm1hbGl6ZSAgICAgICAgOiBub3JtYWxpemUsXG4gIGRvdCAgICAgICAgICAgICAgOiBkb3QsXG4gIGNyb3NzICAgICAgICAgICAgOiBjcm9zcyxcbiAgY29tYmluZSAgICAgICAgICA6IGNvbWJpbmUsXG4gIG11bHRpcGx5QnlNYXRyaXggOiBtdWx0aXBseUJ5TWF0cml4XG59O1xuXG4vKipcbiAqIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3JcbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtmbG9hdH1cbiAqL1xuXG5mdW5jdGlvbiBsZW5ndGgodmVjdG9yKSB7XG4gIHJldHVybiBNYXRoLnNxcnQodmVjdG9yLngqdmVjdG9yLnggKyB2ZWN0b3IueSp2ZWN0b3IueSArIHZlY3Rvci56KnZlY3Rvci56KTtcbn1cblxuXG4vKipcbiAqIEdldCBhIG5vcm1hbGl6ZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge1ZlY3RvcjR9XG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplKHZlY3Rvcikge1xuICB2YXIgbGVuID0gbGVuZ3RoKHZlY3RvciksXG4gICAgdiA9IG5ldyB2ZWN0b3IuY29uc3RydWN0b3IodmVjdG9yLnggLyBsZW4sIHZlY3Rvci55IC8gbGVuLCB2ZWN0b3IueiAvIGxlbik7XG5cbiAgcmV0dXJuIHY7XG59XG5cblxuLyoqXG4gKiBWZWN0b3IgRG90LVByb2R1Y3RcbiAqIEBwYXJhbSB7VmVjdG9yNH0gdiBUaGUgc2Vjb25kIHZlY3RvciB0byBhcHBseSB0aGUgcHJvZHVjdCB0b1xuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge2Zsb2F0fSBUaGUgRG90LVByb2R1Y3Qgb2YgYSBhbmQgYi5cbiAqL1xuXG5mdW5jdGlvbiBkb3QoYSwgYikge1xuICByZXR1cm4gYS54KmIueCArIGEueSpiLnkgKyBhLnoqYi56ICsgYS53KmIudztcbn1cblxuXG4vKipcbiAqIFZlY3RvciBDcm9zcy1Qcm9kdWN0XG4gKiBAcGFyYW0ge1ZlY3RvcjR9IHYgVGhlIHNlY29uZCB2ZWN0b3IgdG8gYXBwbHkgdGhlIHByb2R1Y3QgdG9cbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtWZWN0b3I0fSBUaGUgQ3Jvc3MtUHJvZHVjdCBvZiBhIGFuZCBiLlxuICovXG5cbmZ1bmN0aW9uIGNyb3NzKGEsIGIpIHtcbiAgcmV0dXJuIG5ldyBhLmNvbnN0cnVjdG9yKFxuICAgIChhLnkgKiBiLnopIC0gKGEueiAqIGIueSksXG4gICAgKGEueiAqIGIueCkgLSAoYS54ICogYi56KSxcbiAgICAoYS54ICogYi55KSAtIChhLnkgKiBiLngpXG4gICk7XG59XG5cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gcmVxdWlyZWQgZm9yIG1hdHJpeCBkZWNvbXBvc2l0aW9uXG4gKiBBIEphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgcHNldWRvIGNvZGUgYXZhaWxhYmxlIGZyb20gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy0yZC10cmFuc2Zvcm1zLyNtYXRyaXgtZGVjb21wb3NpdGlvblxuICogQHBhcmFtIHtWZWN0b3I0fSBhUG9pbnQgQSAzRCBwb2ludFxuICogQHBhcmFtIHtmbG9hdH0gYXNjbFxuICogQHBhcmFtIHtmbG9hdH0gYnNjbFxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge1ZlY3RvcjR9XG4gKi9cblxuZnVuY3Rpb24gY29tYmluZShhUG9pbnQsIGJQb2ludCwgYXNjbCwgYnNjbCkge1xuICByZXR1cm4gbmV3IGFQb2ludC5jb25zdHJ1Y3RvcihcbiAgICAoYXNjbCAqIGFQb2ludC54KSArIChic2NsICogYlBvaW50LngpLFxuICAgIChhc2NsICogYVBvaW50LnkpICsgKGJzY2wgKiBiUG9pbnQueSksXG4gICAgKGFzY2wgKiBhUG9pbnQueikgKyAoYnNjbCAqIGJQb2ludC56KVxuICApO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBseUJ5TWF0cml4KHZlY3RvciwgbWF0cml4KSB7XG4gIHJldHVybiBuZXcgdmVjdG9yLmNvbnN0cnVjdG9yKFxuICAgIChtYXRyaXgubTExICogdmVjdG9yLngpICsgKG1hdHJpeC5tMTIgKiB2ZWN0b3IueSkgKyAobWF0cml4Lm0xMyAqIHZlY3Rvci56KSxcbiAgICAobWF0cml4Lm0yMSAqIHZlY3Rvci54KSArIChtYXRyaXgubTIyICogdmVjdG9yLnkpICsgKG1hdHJpeC5tMjMgKiB2ZWN0b3IueiksXG4gICAgKG1hdHJpeC5tMzEgKiB2ZWN0b3IueCkgKyAobWF0cml4Lm0zMiAqIHZlY3Rvci55KSArIChtYXRyaXgubTMzICogdmVjdG9yLnopXG4gICk7XG59XG4iLCIvLyBDb21wb25lbnQgaGFuZGxlcyBzdG9yaW5nIHRoZSBzdGF0ZSBvZiBhIENvbXBvbmVudCB0aGF0IGlzIGF0dGFjaGVkIHRvIGEgTm9kZS5cbnZhciBDb21wb25lbnQgPSBmdW5jdGlvbihub2RlKXtcbiAgICB0aGlzLm5vZGUgPSBub2RlID8gbm9kZSA6IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50O1xuIiwidmFyIENvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ29tcG9uZW50Jyk7XG52YXIgTWF0cml4ID0gcmVxdWlyZSgneGNzc21hdHJpeCcpO1xuXG52YXIgRE9NQ29tcG9uZW50ID0gZnVuY3Rpb24obm9kZSwgZWxlbSwgY29udGFpbmVyKXtcbiAgICB0aGlzLm5vZGUgPSBub2RlLmlkID8gbm9kZS5pZCA6IG5vZGU7XG4gICAgdGhpcy5lbGVtID0gZWxlbSA/IGVsZW0gOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHZhciBjb250YWluZXIgPSBjb250YWluZXIgPyBjb250YWluZXIgOiBkb2N1bWVudC5ib2R5O1xuXG4gICAgdGhpcy5lbGVtLmRhdGFzZXQubm9kZSA9IHRoaXMubm9kZTtcbiAgICB0aGlzLmVsZW0uY2xhc3NMaXN0LmFkZCh0aGlzLm5vZGUpO1xuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKCdub2RlJyk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbSk7XG5cbiAgICB0aGlzLnRyYW5zZm9ybShub2RlKTtcbn07XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudC5wcm90b3R5cGUpO1xuRE9NQ29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudDtcblxuXG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24obm9kZSl7XG5cblxuXG4gIC8vIHZhciBtYXRyaXggPSBuZXcgTWF0cml4KCd0cmFuc2xhdGUzZCgnK25vZGUudHJhbnNsYXRlWzBdKydweCwnK25vZGUudHJhbnNsYXRlWzFdKydweCwnK25vZGUudHJhbnNsYXRlWzJdKydweCkgJytcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ3NjYWxlM2QoJytub2RlLnNjYWxlWzBdKyclLCcrbm9kZS5zY2FsZVsxXSsnJSwnK25vZGUuc2NhbGVbMl0rJyUpICcrXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICdyb3RhdGVYKCcrbm9kZS5yb3RhdGVbMF0rJ2RlZykgJytcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVkoJytub2RlLnJvdGF0ZVsxXSsnZGVnKSAnK1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAncm90YXRlWignK25vZGUucm90YXRlWzJdKydkZWcpJyk7XG4gIHZhciBtYXRyaXggPSBuZXcgTWF0cml4KCk7XG4gIGlmKG5vZGUudHJhbnNsYXRlKSB7XG4gICAgbWF0cml4ID0gbWF0cml4LnRyYW5zbGF0ZShub2RlLnRyYW5zbGF0ZVswXSxub2RlLnRyYW5zbGF0ZVsxXSxub2RlLnRyYW5zbGF0ZVsyXSk7XG4gIH1cbiAgaWYobm9kZS5zY2FsZSkge1xuICAgIG1hdHJpeCA9IG1hdHJpeC5zY2FsZShub2RlLnNjYWxlWzBdLCBub2RlLnNjYWxlWzFdLCBub2RlLnNjYWxlWzJdKTtcbiAgfVxuICBpZihub2RlLnJvdGF0ZSkge1xuICAgIG1hdHJpeCA9IG1hdHJpeC5yb3RhdGUobm9kZS5yb3RhdGVbMF0sIG5vZGUucm90YXRlWzFdLCBub2RlLnJvdGF0ZVsyXSk7XG4gIH1cbiAgdGhpcy5lbGVtLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IG1hdHJpeC50b1N0cmluZygpO1xuXG4gIC8vIGlmKG5vZGUub3BhY2l0eSkge1xuICAvLyAgIHRoaXMuZWxlbS5zdHlsZS5vcGFjaXR5ID0gbm9kZS5vcGFjaXR5O1xuICAvLyB9XG4gIC8vIGlmKG5vZGUucG9zaXRpb24pIHtcbiAgLy8gICB0aGlzLmVsZW0uc3R5bGUucG9zaXRpb24gPSBub2RlLnBvc2l0aW9uO1xuICAvLyB9XG4gIC8vIGlmKG5vZGUuc2l6ZSkge1xuICAvLyAgIHRoaXMuZWxlbS5zdHlsZS53aWR0aCA9IG5vZGUuc2l6ZVswXSsncHgnO1xuICAvLyAgIHRoaXMuZWxlbS5zdHlsZS5oZWlnaHQgPSBub2RlLnNpemVbMV0rJ3B4JztcbiAgLy8gfVxuICAvLyBpZihub2RlLm9yaWdpbikge1xuICAvLyAgIHRoaXMuZWxlbS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBub2RlLm9yaWdpblswXSsnJSwnK25vZGUub3JpZ2luWzFdKyclLCcrbm9kZS5vcmlnaW5bMl0rJyUnO1xuICAvLyB9XG4gIC8vVE9ETzogRmlndXJlIG91dCBob3cgdG8gZ2V0IGJyb3dzZXIgdG8gb3V0cHV0IGNzcyBtYXRyaXgzRCB0cmFuc2Zvcm1cblxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NQ29tcG9uZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ29tcG9uZW50OiByZXF1aXJlKCcuL0NvbXBvbmVudCcpLFxuICAgIERPTUNvbXBvbmVudDogcmVxdWlyZSgnLi9ET01Db21wb25lbnQnKVxufTtcbiIsIlxudmFyIEVuZ2luZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLnRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLl93b3JrZXIgPSBudWxsO1xuICAgIHRoaXMudXBkYXRlUXVldWUgPSBbXTtcblxufVxuXG5FbmdpbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih3b3JrZXIpe1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xuICAgIGlmKHdvcmtlcil7XG4gICAgICAgIHRoaXMuX3dvcmtlciA9IHdvcmtlcjtcbiAgICAgICAgdGhpcy5fd29ya2VyLnBvc3RNZXNzYWdlKHtpbml0Oidkb25lJ30pO1xuICAgIH1cbn1cblxuRW5naW5lLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24odGltZSl7XG5cbiAgICB2YXIgaXRlbTtcbiAgICB0aGlzLnRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGlmKHRoaXMuX3dvcmtlcil7XG4gICAgICAgIHRoaXMuX3dvcmtlci5wb3N0TWVzc2FnZSh7ZnJhbWU6dGhpcy50aW1lfSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHRoaXMudXBkYXRlUXVldWUubGVuZ3RoKSB7XG4gICAgICBpdGVtID0gdGhpcy51cGRhdGVRdWV1ZS5zaGlmdCgpO1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbS51cGRhdGUpIGl0ZW0udXBkYXRlKHRoaXMudGltZSk7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtLm9uVXBkYXRlKSBpdGVtLm9uVXBkYXRlKHRoaXMudGltZSk7XG4gICAgfVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFbmdpbmUoKTtcbiIsIi8vIE5vZGUgaGFuZGxlcyBzdG9yaW5nIHRoZSBzdGF0ZSBvZiBhIG5vZGUgb24gdGhlIFNjZW5lIEdyYXBoLlxudmFyIFRyYW5zaXRpb25hYmxlID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbmFibGUnKTtcbnZhciBDdXJ2ZXMgPSByZXF1aXJlKCcuLi90cmFuc2l0aW9ucy9DdXJ2ZXMnKTtcblxudmFyIF9vYnNlcnZhYmxlQ2FsbGJhY2sgPSB7fTtcblxudmFyIE5vZGUgPSBmdW5jdGlvbihjb25mLCBwYXJlbnQpe1xuXG4gICAgdGhpcy50cmFuc2l0aW9uYWJsZXMgPSB7fTtcblxuICAgIGlmKGNvbmYpe1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZShjb25mKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERlZmF1bHRzKCk7XG4gICAgfVxuXG4gICAgcGFyZW50ID8gdGhpcy5wYXJlbnQgPSBwYXJlbnQgOiB0aGlzLnBhcmVudCA9IG51bGw7XG5cbn07XG5cbk5vZGUucHJvdG90eXBlLnNldERlZmF1bHRzID0gZnVuY3Rpb24oY29uZil7XG4gICAgdGhpcy5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy50cmFuc2xhdGUgPSBbMCwwLDBdO1xuICAgIHRoaXMub3JpZ2luID0gWzAuMCwwLjAsMC4wXTtcbiAgICB0aGlzLmFsaWduID0gWzAuMCwwLjAsMC4wXTtcbiAgICB0aGlzLnNpemUgPSBbMCwwLDBdO1xuICAgIHRoaXMuc2NhbGUgPSBbMS4wLDEuMCwxLjBdO1xuICAgIHRoaXMucm90YXRlID0gWzAsMCwwXTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbihjb25mKXtcbiAgICB0aGlzLmlkID0gY29uZi5pZCA/IGNvbmYuaWQgOiBudWxsO1xuICAgIHRoaXMucG9zaXRpb24gPSBjb25mLnBvc2l0aW9uID8gY29uZi5wb3NpdGlvbiA6ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy50cmFuc2xhdGUgPSBjb25mLnRyYW5zbGF0ZSA/IGNvbmYudHJhbnNsYXRlIDogWzAsMCwwXTtcbiAgICB0aGlzLm9yaWdpbiA9IGNvbmYub3JpZ2luID8gY29uZi5vcmlnaW4gOiBbMC4wLDAuMCwwLjBdO1xuICAgIHRoaXMuYWxpZ24gPSBjb25mLmFsaWduID8gY29uZi5hbGlnbiA6IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5zaXplID0gY29uZi5zaXplID8gY29uZi5zaXplIDogWzAsMCwwXTtcbiAgICB0aGlzLnNjYWxlID0gY29uZi5zY2FsZSA/IGNvbmYuc2NhbGUgOiBbMS4wLDEuMCwxLjBdO1xuICAgIHRoaXMucm90YXRlID0gY29uZi5yb3RhdGUgPyBjb25mLnJvdGF0ZSA6IFswLDAsMF07XG4gICAgdGhpcy5vcGFjaXR5ID0gY29uZi5vcGFjaXR5ID8gY29uZi5vcGFjaXR5IDogMS4wO1xuICAgIHRoaXMub2JzZXJ2ZSh0aGlzLmlkLCB0aGlzKTtcbiAgICBjb25mLnRyYW5zaXRpb24gPyB0aGlzLnNldFRyYW5zaXRpb25hYmxlKGNvbmYudHJhbnNpdGlvbikgOiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgICB0cmFuc2xhdGU6IHRoaXMudHJhbnNsYXRlLFxuICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luLFxuICAgICAgICBhbGlnbjogdGhpcy5hbGlnbixcbiAgICAgICAgc2l6ZTogdGhpcy5zaXplLFxuICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgcm90YXRlOiB0aGlzLnJvdGF0ZSxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5vcGFjaXR5LFxuICAgICAgICB0cmFuc2l0aW9uYWJsZXM6IHRoaXMudHJhbnNpdGlvbmFibGVzLy8sXG4gICAgICAgIC8vb2JzZXJ2YWJsZXM6IHRoaXMub2JzZXJ2YWJsZXNcbiAgICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKHBvcyl7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24ocG9zKXtcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IHBvcztcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldFRyYW5zbGF0aW9uID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24oc2l6ZSl7XG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnNpemU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRTY2FsZSA9IGZ1bmN0aW9uKHNjYWxlKXtcbiAgICB0aGlzLnNjYWxlID0gc2NhbGU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRTY2FsZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuc2NhbGU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRPcmlnaW4gPSBmdW5jdGlvbihvcmlnaW4pe1xuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0T3JpZ2luID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5vcmlnaW47XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRBbGlnbiA9IGZ1bmN0aW9uKGFsaWduKXtcbiAgICB0aGlzLmFsaWduID0gYWxpZ247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRBbGlnbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuYWxpZ247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKHJvdGF0aW9uKXtcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMucm90YXRpb247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRPcGFjaXR5ID0gZnVuY3Rpb24ob3BhY2l0eSl7XG4gICAgdGhpcy5vcGFjaXR5ID0gb3BhY2l0eTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLm9wYWNpdHk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRUcmFuc2l0aW9uYWJsZSA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIHZhciBuICA9IHRoaXM7XG5cbiAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdID0gY29uZjtcbiAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdLnRyYW5zaXRpb24gPSBuZXcgVHJhbnNpdGlvbmFibGUoY29uZi5mcm9tKTtcbiAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdLnRyYW5zaXRpb24uc2V0KGNvbmYudG8pO1xuICAgIC8vbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLnNldChjb25mLnRvKTtcbiAgICBpZihjb25mLmRlbGF5KSB7XG4gICAgICBuLnRyYW5zaXQoY29uZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG4udHJhbnNpdGlvbmFibGVzW2NvbmYudF1cbiAgICAgICAudHJhbnNpdGlvblxuICAgICAgIC5mcm9tKGNvbmYuZnJvbSlcbiAgICAgICAudG8oY29uZi50bywgY29uZi5jdXJ2ZSwgY29uZi5kdXJhdGlvbik7XG4gICAgfVxuXG5cbiAgICB0aGlzW2NvbmYudF0gPSBjb25mLnRvO1xuICAgIG4udHJhbnNpdGlvbmFibGVzW2NvbmYudF0udHJhbnNpdGlvbi5pZCA9IHRoaXMuaWQ7XG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLnBhcmFtID0gY29uZi50O1xuICAgIHRoaXMub2JzZXJ2ZSh0aGlzLmlkKyctJytjb25mLnQsIG4udHJhbnNpdGlvbmFibGVzW2NvbmYudF0udHJhbnNpdGlvbik7XG4gICAgLy9jb25zb2xlLmxvZyhjb25mLnQsIHRoaXNbY29uZi50XSwgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLmdldCgpKTtcbiAgICAvL1RPRE86IGZpZ3VyZSBvdXQgYSBiZXR0ZXIgd2F5IHRvIHVwZGF0ZSBUcmFuc2l0aW9uYWJsZVxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdLnRyYW5zaXRpb24uZ2V0KCk7XG4gICAgfSwxMCk7XG5cbn07XG5cbk5vZGUucHJvdG90eXBlLnRyYW5zaXQgPSBmdW5jdGlvbihjb25mKXtcbiAgICB2YXIgbiAgPSB0aGlzO1xuICAgIGlmKGNvbmYuZGVsYXkpIHtcblxuICAgICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLmZyb20oY29uZi5mcm9tKS5kZWxheShjb25mLmRlbGF5KS50byhjb25mLnRvLCBjb25mLmN1cnZlLCBjb25mLmR1cmF0aW9uKTtcbiAgICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oaWQsIG9iaikge1xuICAgICAgdmFyIG4gPSB0aGlzO1xuICAgICAgX29ic2VydmFibGVDYWxsYmFja1tpZF0gPSBmdW5jdGlvbihjaGFuZ2VzKXtcbiAgICAgICAgICBjaGFuZ2VzLmZvckVhY2goZnVuY3Rpb24oY2hhbmdlKSB7XG4gICAgICAgICAgICBpZihjaGFuZ2UudHlwZSA9PT0gJ3VwZGF0ZScgJiYgY2hhbmdlLm5hbWUgIT09ICdpZCcpIHtcbiAgICAgICAgICAgICAgLy9UT0RPOmJyb2FkY2FzdCBjaGFuZ2UgdG8gc2NlbmVcblxuICAgICAgICAgICAgICBpZihjaGFuZ2Uub2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdUcmFuc2l0aW9uYWJsZScpe1xuICAgICAgICAgICAgICAgIG5bY2hhbmdlLm9iamVjdC5wYXJhbV0gPSBjaGFuZ2Uub2xkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbi5wYXJlbnQudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wOiBjaGFuZ2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBjaGFuZ2Uub2xkVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBuLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgbWVzc2FnZTp7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHByb3A6IGNoYW5nZS5uYW1lLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB2YWw6IGNoYW5nZS5vbGRWYWx1ZVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgIG5vZGU6IG4uaWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgT2JqZWN0Lm9ic2VydmUob2JqLCBfb2JzZXJ2YWJsZUNhbGxiYWNrW2lkXSk7XG5cbn07XG5cbk5vZGUucHJvdG90eXBlLnVub2JzZXJ2ZSA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgT2JqZWN0LnVub2JzZXJ2ZSh0aGlzLCBfb2JzZXJ2YWJsZUNhbGxiYWNrW3RoaXMuaWRdKTtcbn07XG5cblxuTm9kZS5wcm90b3R5cGUuZXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24oKXtcblxuICB2YXIgZXZlbnRzID0ge307XG4gIHZhciBoYXNFdmVudCA9IGV2ZW50cy5oYXNPd25Qcm9wZXJ0eTtcblxuICByZXR1cm4ge1xuICAgIHN1YjogZnVuY3Rpb24oZXYsIGxpc3RlbmVyKSB7XG5cbiAgICAgIHRoaXMub2JzZXJ2ZShldiwgdGhpcyk7XG4gICAgICAvLyBDcmVhdGUgdGhlIGV2ZW50J3Mgb2JqZWN0IGlmIG5vdCB5ZXQgY3JlYXRlZFxuICAgICAgaWYoIWhhc0V2ZW50LmNhbGwoZXZlbnRzLCBldikpIGV2ZW50c1tldl0gPSBbXTtcblxuICAgICAgLy8gQWRkIHRoZSBsaXN0ZW5lciB0byBxdWV1ZVxuICAgICAgdmFyIGluZGV4ID0gZXZlbnRzW2V2XS5wdXNoKGxpc3RlbmVyKSAtIDE7XG5cbiAgICAgIC8vIFByb3ZpZGUgaGFuZGxlIGJhY2sgZm9yIHJlbW92YWwgb2YgdG9waWNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGhpcy51bm9ic2VydmUoZXYpO1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbZXZdW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIHB1YjogZnVuY3Rpb24oZXYsIGluZm8pIHtcbiAgICAgIC8vIElmIHRoZSBldmVudCBkb2Vzbid0IGV4aXN0LCBvciB0aGVyZSdzIG5vIGxpc3RlbmVycyBpbiBxdWV1ZSwganVzdCBsZWF2ZVxuICAgICAgaWYoIWhhc0V2ZW50LmNhbGwoZXZlbnRzLCBldikpIHJldHVybjtcblxuICAgICAgLy8gQ3ljbGUgdGhyb3VnaCBldmVudHMgcXVldWUsIGZpcmUhXG4gICAgICBldmVudHNbZXZdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgXHRcdGl0ZW0oaW5mbyAhPSB1bmRlZmluZWQgPyBpbmZvIDoge30pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuIiwidmFyIGN4dCA9IHNlbGY7XG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uKGdyYXBoKXtcblxuICAgIHRoaXMuZ3JhcGggPSBncmFwaCB8fCB7fTtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG5cbn1cblxuU2NlbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih3b3JrZXIpIHtcbiAgICBpZih3b3JrZXIpe1xuICAgICAgICB0aGlzLndvcmtlciA9IHdvcmtlcjtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy53b3JrZXIpO1xufVxuXG5TY2VuZS5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbihub2RlKXtcbiAgICBub2RlLmlkID0gJ25vZGUtJyt0aGlzLmxlbmd0aDtcbiAgICB0aGlzLmxlbmd0aCsrO1xuICAgIHRoaXMuZ3JhcGhbbm9kZS5pZF0gPSBub2RlO1xufVxuXG5cblNjZW5lLnByb3RvdHlwZS5mZXRjaE5vZGUgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiB0aGlzLmdyYXBoW2lkXTtcbn1cblxuU2NlbmUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihxdWVyeSkge1xuICAgIHZhciBxdWVyeUFycmF5ID0gW107XG4gICAgZm9yKHEgaW4gcXVlcnkpe1xuICAgICAgICBmb3IocHJvcCBpbiB0aGlzLmdyYXBoKSB7XG4gICAgICAgICAgICBmb3IocCBpbiB0aGlzLmdyYXBoW3Byb3BdKXtcbiAgICAgICAgICAgICAgICBpZiAocCA9PT0gcSAmJiB0aGlzLmdyYXBoW3Byb3BdW3BdID09PSBxdWVyeVtxXSkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeUFycmF5LnB1c2godGhpcy5ncmFwaFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeUFycmF5O1xufVxuXG5TY2VuZS5wcm90b3R5cGUuZmluZE9uZSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cbiAgICBmb3IocSBpbiBxdWVyeSl7XG4gICAgICAgIGZvcihwcm9wIGluIHRoaXMuZ3JhcGgpIHtcbiAgICAgICAgICAgIGZvcihwIGluIHRoaXMuZ3JhcGhbcHJvcF0pe1xuICAgICAgICAgICAgICAgIGlmIChwID09PSBxICYmIHRoaXMuZ3JhcGhbcHJvcF1bcF0gPT09IHF1ZXJ5W3FdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdyYXBoW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cblNjZW5lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihjaGFuZ2Upe1xuICBjeHQucG9zdE1lc3NhZ2UoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjaGFuZ2UpKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFNjZW5lKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBFbmdpbmU6IHJlcXVpcmUoJy4vRW5naW5lJyksXG4gICAgU2NlbmU6IHJlcXVpcmUoJy4vU2NlbmUnKSxcbiAgICBOb2RlOiByZXF1aXJlKCcuL05vZGUnKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvcmU6IHJlcXVpcmUoJy4vY29yZScpLFxuICAgIGNvbXBvbmVudHM6IHJlcXVpcmUoJy4vY29tcG9uZW50cycpLFxuICAgIG1hdGg6IHJlcXVpcmUoJy4vbWF0aCcpLFxuICAgIHRyYW5zaXRpb25zOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zJylcbn07XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICogXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKiBcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgM3gzIG51bWVyaWNhbCBtYXRyaXgsIHJlcHJlc2VudGVkIGFzIGFuIGFycmF5LlxuICpcbiAqIEBjbGFzcyBNYXQzM1xuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBhIDN4MyBtYXRyaXggZmxhdHRlbmVkXG4gKi9cbmZ1bmN0aW9uIE1hdDMzKHZhbHVlcykge1xuICAgIHRoaXMudmFsdWVzID0gdmFsdWVzIHx8IFsxLDAsMCwwLDEsMCwwLDAsMV07XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSB2YWx1ZXMgaW4gdGhlIE1hdDMzIGFzIGFuIGFycmF5LlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gbWF0cml4IHZhbHVlcyBhcyBhcnJheSBvZiByb3dzLlxuICovXG5NYXQzMy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIGN1cnJlbnQgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBBcnJheSBvZiBuaW5lIG51bWJlcnMgdG8gc2V0IGluIHRoZSBNYXQzMy5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhpc1xuICovXG5NYXQzMy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHZhbHVlcykge1xuICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXggVGhlIE1hdDMzIHRvIGNvcHkuXG4gKiBcbiAqIEByZXR1cm4ge01hdDMzfSB0aGlzXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weShtYXRyaXgpIHtcbiAgICB2YXIgQSA9IHRoaXMudmFsdWVzO1xuICAgIHZhciBCID0gbWF0cml4LnZhbHVlcztcblxuICAgIEFbMF0gPSBCWzBdO1xuICAgIEFbMV0gPSBCWzFdO1xuICAgIEFbMl0gPSBCWzJdO1xuICAgIEFbM10gPSBCWzNdO1xuICAgIEFbNF0gPSBCWzRdO1xuICAgIEFbNV0gPSBCWzVdO1xuICAgIEFbNl0gPSBCWzZdO1xuICAgIEFbN10gPSBCWzddO1xuICAgIEFbOF0gPSBCWzhdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRha2UgdGhpcyBNYXQzMyBhcyBBLCBpbnB1dCB2ZWN0b3IgViBhcyBhIGNvbHVtbiB2ZWN0b3IsIGFuZCByZXR1cm4gTWF0MzMgcHJvZHVjdCAoQSkoVikuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBWZWN0b3IgdG8gcm90YXRlLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSBpbnB1dCB2ZWN0b3IgYWZ0ZXIgbXVsdGlwbGljYXRpb24uXG4gKi9cbk1hdDMzLnByb3RvdHlwZS52ZWN0b3JNdWx0aXBseSA9IGZ1bmN0aW9uIHZlY3Rvck11bHRpcGx5KHYsIG91dHB1dCkge1xuICAgIHZhciBNID0gdGhpcy52YWx1ZXM7XG4gICAgdmFyIHYwID0gdi54O1xuICAgIHZhciB2MSA9IHYueTtcbiAgICB2YXIgdjIgPSB2Lno7XG5cbiAgICBvdXRwdXQueCA9IE1bMF0qdjAgKyBNWzFdKnYxICsgTVsyXSp2MjtcbiAgICBvdXRwdXQueSA9IE1bM10qdjAgKyBNWzRdKnYxICsgTVs1XSp2MjtcbiAgICBvdXRwdXQueiA9IE1bNl0qdjAgKyBNWzddKnYxICsgTVs4XSp2MjtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIE11bHRpcGx5IHRoZSBwcm92aWRlZCBNYXQzMyB3aXRoIHRoZSBjdXJyZW50IE1hdDMzLiAgUmVzdWx0IGlzICh0aGlzKSAqIChtYXRyaXgpLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXggSW5wdXQgTWF0MzMgdG8gbXVsdGlwbHkgb24gdGhlIHJpZ2h0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSB0aGlzXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KG1hdHJpeCkge1xuICAgIHZhciBBID0gdGhpcy52YWx1ZXM7XG4gICAgdmFyIEIgPSBtYXRyaXgudmFsdWVzO1xuXG4gICAgdmFyIEEwID0gQVswXTtcbiAgICB2YXIgQTEgPSBBWzFdO1xuICAgIHZhciBBMiA9IEFbMl07XG4gICAgdmFyIEEzID0gQVszXTtcbiAgICB2YXIgQTQgPSBBWzRdO1xuICAgIHZhciBBNSA9IEFbNV07XG4gICAgdmFyIEE2ID0gQVs2XTtcbiAgICB2YXIgQTcgPSBBWzddO1xuICAgIHZhciBBOCA9IEFbOF07XG5cbiAgICB2YXIgQjAgPSBCWzBdO1xuICAgIHZhciBCMSA9IEJbMV07XG4gICAgdmFyIEIyID0gQlsyXTtcbiAgICB2YXIgQjMgPSBCWzNdO1xuICAgIHZhciBCNCA9IEJbNF07XG4gICAgdmFyIEI1ID0gQls1XTtcbiAgICB2YXIgQjYgPSBCWzZdO1xuICAgIHZhciBCNyA9IEJbN107XG4gICAgdmFyIEI4ID0gQls4XTtcblxuICAgIEFbMF0gPSBBMCpCMCArIEExKkIzICsgQTIqQjY7XG4gICAgQVsxXSA9IEEwKkIxICsgQTEqQjQgKyBBMipCNztcbiAgICBBWzJdID0gQTAqQjIgKyBBMSpCNSArIEEyKkI4O1xuICAgIEFbM10gPSBBMypCMCArIEE0KkIzICsgQTUqQjY7XG4gICAgQVs0XSA9IEEzKkIxICsgQTQqQjQgKyBBNSpCNztcbiAgICBBWzVdID0gQTMqQjIgKyBBNCpCNSArIEE1KkI4O1xuICAgIEFbNl0gPSBBNipCMCArIEE3KkIzICsgQTgqQjY7XG4gICAgQVs3XSA9IEE2KkIxICsgQTcqQjQgKyBBOCpCNztcbiAgICBBWzhdID0gQTYqQjIgKyBBNypCNSArIEE4KkI4O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRyYW5zcG9zZXMgdGhlIE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhpc1xuICovXG5NYXQzMy5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24gdHJhbnNwb3NlKCkge1xuICAgIHZhciBNID0gdGhpcy52YWx1ZXM7XG5cbiAgICB2YXIgTTEgPSBNWzFdO1xuICAgIHZhciBNMiA9IE1bMl07XG4gICAgdmFyIE0zID0gTVszXTtcbiAgICB2YXIgTTUgPSBNWzVdO1xuICAgIHZhciBNNiA9IE1bNl07XG4gICAgdmFyIE03ID0gTVs3XTtcblxuICAgIE1bMV0gPSBNMztcbiAgICBNWzJdID0gTTY7XG4gICAgTVszXSA9IE0xO1xuICAgIE1bNV0gPSBNNztcbiAgICBNWzZdID0gTTI7XG4gICAgTVs3XSA9IE01O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRoZSBkZXRlcm1pbmFudCBvZiB0aGUgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIGRldGVybWluYW50LlxuICovXG5NYXQzMy5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiBnZXREZXRlcm1pbmFudCgpIHtcbiAgICB2YXIgTSA9IHRoaXMudmFsdWVzO1xuXG4gICAgdmFyIE0zID0gTVszXTtcbiAgICB2YXIgTTQgPSBNWzRdO1xuICAgIHZhciBNNSA9IE1bNV07XG4gICAgdmFyIE02ID0gTVs2XTtcbiAgICB2YXIgTTcgPSBNWzddO1xuICAgIHZhciBNOCA9IE1bOF07XG5cbiAgICB2YXIgZGV0ID0gTVswXSooTTQqTTggLSBNNSpNNykgLVxuICAgICAgICAgICAgICBNWzFdKihNMypNOCAtIE01Kk02KSArXG4gICAgICAgICAgICAgIE1bMl0qKE0zKk03IC0gTTQqTTYpO1xuXG4gICAgcmV0dXJuIGRldDtcbn07XG5cbi8qKlxuICogVGhlIGludmVyc2Ugb2YgdGhlIE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gdGhpc1xuICovXG5NYXQzMy5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uIGludmVyc2UoKSB7XG4gICAgdmFyIE0gPSB0aGlzLnZhbHVlcztcblxuICAgIHZhciBNMCA9IE1bMF07XG4gICAgdmFyIE0xID0gTVsxXTtcbiAgICB2YXIgTTIgPSBNWzJdO1xuICAgIHZhciBNMyA9IE1bM107XG4gICAgdmFyIE00ID0gTVs0XTtcbiAgICB2YXIgTTUgPSBNWzVdO1xuICAgIHZhciBNNiA9IE1bNl07XG4gICAgdmFyIE03ID0gTVs3XTtcbiAgICB2YXIgTTggPSBNWzhdO1xuXG4gICAgdmFyIGRldCA9IE0wKihNNCpNOCAtIE01Kk03KSAtXG4gICAgICAgICAgICAgIE0xKihNMypNOCAtIE01Kk02KSArXG4gICAgICAgICAgICAgIE0yKihNMypNNyAtIE00Kk02KTtcblxuICAgIGlmIChNYXRoLmFicyhkZXQpIDwgMWUtNDApIHJldHVybiBudWxsO1xuXG4gICAgZGV0ID0gMSAvIGRldDtcblxuICAgIE1bMF0gPSAoTTQqTTggLSBNNSpNNykgKiBkZXQ7XG4gICAgTVszXSA9ICgtTTMqTTggKyBNNSpNNikgKiBkZXQ7XG4gICAgTVs2XSA9IChNMypNNyAtIE00Kk02KSAqIGRldDtcbiAgICBNWzFdID0gKC1NMSpNOCArIE0yKk03KSAqIGRldDtcbiAgICBNWzRdID0gKE0wKk04IC0gTTIqTTYpICogZGV0O1xuICAgIE1bN10gPSAoLU0wKk03ICsgTTEqTTYpICogZGV0O1xuICAgIE1bMl0gPSAoTTEqTTUgLSBNMipNNCkgKiBkZXQ7XG4gICAgTVs1XSA9ICgtTTAqTTUgKyBNMipNMykgKiBkZXQ7XG4gICAgTVs4XSA9IChNMCpNNCAtIE0xKk0zKSAqIGRldDtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDbG9uZXMgdGhlIGlucHV0IE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtIE1hdDMzIHRvIGNsb25lLlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSBOZXcgY29weSBvZiB0aGUgb3JpZ2luYWwgTWF0MzMuXG4gKi9cbk1hdDMzLmNsb25lID0gZnVuY3Rpb24gY2xvbmUobSkge1xuICAgIHJldHVybiBuZXcgTWF0MzMobS52YWx1ZXMuc2xpY2UoKSk7XG59O1xuXG4vKipcbiAqIFRoZSBpbnZlcnNlIG9mIHRoZSBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4IE1hdDMzIHRvIGludmVydC5cbiAqIEBwYXJhbSB7TWF0MzN9IG91dHB1dCBNYXQzMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSBUaGUgTWF0MzMgYWZ0ZXIgdGhlIGludmVydC5cbiAqL1xuTWF0MzMuaW52ZXJzZSA9IGZ1bmN0aW9uIGludmVyc2UobWF0cml4LCBvdXRwdXQpIHtcbiAgICB2YXIgTSA9IG1hdHJpeC52YWx1ZXM7XG4gICAgdmFyIHJlc3VsdCA9IG91dHB1dC52YWx1ZXM7XG5cbiAgICB2YXIgTTAgPSBNWzBdO1xuICAgIHZhciBNMSA9IE1bMV07XG4gICAgdmFyIE0yID0gTVsyXTtcbiAgICB2YXIgTTMgPSBNWzNdO1xuICAgIHZhciBNNCA9IE1bNF07XG4gICAgdmFyIE01ID0gTVs1XTtcbiAgICB2YXIgTTYgPSBNWzZdO1xuICAgIHZhciBNNyA9IE1bN107XG4gICAgdmFyIE04ID0gTVs4XTtcblxuICAgIHZhciBkZXQgPSBNMCooTTQqTTggLSBNNSpNNykgLVxuICAgICAgICAgICAgICBNMSooTTMqTTggLSBNNSpNNikgK1xuICAgICAgICAgICAgICBNMiooTTMqTTcgLSBNNCpNNik7XG5cbiAgICBpZiAoTWF0aC5hYnMoZGV0KSA8IDFlLTQwKSByZXR1cm4gbnVsbDtcblxuICAgIGRldCA9IDEgLyBkZXQ7XG5cbiAgICByZXN1bHRbMF0gPSAoTTQqTTggLSBNNSpNNykgKiBkZXQ7XG4gICAgcmVzdWx0WzNdID0gKC1NMypNOCArIE01Kk02KSAqIGRldDtcbiAgICByZXN1bHRbNl0gPSAoTTMqTTcgLSBNNCpNNikgKiBkZXQ7XG4gICAgcmVzdWx0WzFdID0gKC1NMSpNOCArIE0yKk03KSAqIGRldDtcbiAgICByZXN1bHRbNF0gPSAoTTAqTTggLSBNMipNNikgKiBkZXQ7XG4gICAgcmVzdWx0WzddID0gKC1NMCpNNyArIE0xKk02KSAqIGRldDtcbiAgICByZXN1bHRbMl0gPSAoTTEqTTUgLSBNMipNNCkgKiBkZXQ7XG4gICAgcmVzdWx0WzVdID0gKC1NMCpNNSArIE0yKk0zKSAqIGRldDtcbiAgICByZXN1bHRbOF0gPSAoTTAqTTQgLSBNMSpNMykgKiBkZXQ7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2VzIHRoZSBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4IE1hdDMzIHRvIHRyYW5zcG9zZS5cbiAqIEBwYXJhbSB7TWF0MzN9IG91dHB1dCBNYXQzMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSBUaGUgTWF0MzMgYWZ0ZXIgdGhlIHRyYW5zcG9zZS5cbiAqL1xuTWF0MzMudHJhbnNwb3NlID0gZnVuY3Rpb24gdHJhbnNwb3NlKG1hdHJpeCwgb3V0cHV0KSB7XG4gICAgdmFyIE0gPSBtYXRyaXgudmFsdWVzO1xuICAgIHZhciByZXN1bHQgPSBvdXRwdXQudmFsdWVzO1xuXG4gICAgdmFyIE0wID0gTVswXTtcbiAgICB2YXIgTTEgPSBNWzFdO1xuICAgIHZhciBNMiA9IE1bMl07XG4gICAgdmFyIE0zID0gTVszXTtcbiAgICB2YXIgTTQgPSBNWzRdO1xuICAgIHZhciBNNSA9IE1bNV07XG4gICAgdmFyIE02ID0gTVs2XTtcbiAgICB2YXIgTTcgPSBNWzddO1xuICAgIHZhciBNOCA9IE1bOF07XG5cbiAgICByZXN1bHRbMF0gPSBNMDtcbiAgICByZXN1bHRbMV0gPSBNMztcbiAgICByZXN1bHRbMl0gPSBNNjtcbiAgICByZXN1bHRbM10gPSBNMTtcbiAgICByZXN1bHRbNF0gPSBNNDtcbiAgICByZXN1bHRbNV0gPSBNNztcbiAgICByZXN1bHRbNl0gPSBNMjtcbiAgICByZXN1bHRbN10gPSBNNTtcbiAgICByZXN1bHRbOF0gPSBNODtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgcHJvdmlkZWQgTWF0MzMncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MSBUaGUgbGVmdCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDIgVGhlIHJpZ2h0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gb3V0cHV0IE1hdDMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IFRoZSByZXN1bHQgb2YgdGhlIGFkZGl0aW9uLlxuICovXG5NYXQzMy5hZGQgPSBmdW5jdGlvbiBhZGQobWF0cml4MSwgbWF0cml4Miwgb3V0cHV0KSB7XG4gICAgdmFyIEEgPSBtYXRyaXgxLnZhbHVlcztcbiAgICB2YXIgQiA9IG1hdHJpeDIudmFsdWVzO1xuICAgIHZhciByZXN1bHQgPSBvdXRwdXQudmFsdWVzO1xuXG4gICAgdmFyIEEwID0gQVswXTtcbiAgICB2YXIgQTEgPSBBWzFdO1xuICAgIHZhciBBMiA9IEFbMl07XG4gICAgdmFyIEEzID0gQVszXTtcbiAgICB2YXIgQTQgPSBBWzRdO1xuICAgIHZhciBBNSA9IEFbNV07XG4gICAgdmFyIEE2ID0gQVs2XTtcbiAgICB2YXIgQTcgPSBBWzddO1xuICAgIHZhciBBOCA9IEFbOF07XG5cbiAgICB2YXIgQjAgPSBCWzBdO1xuICAgIHZhciBCMSA9IEJbMV07XG4gICAgdmFyIEIyID0gQlsyXTtcbiAgICB2YXIgQjMgPSBCWzNdO1xuICAgIHZhciBCNCA9IEJbNF07XG4gICAgdmFyIEI1ID0gQls1XTtcbiAgICB2YXIgQjYgPSBCWzZdO1xuICAgIHZhciBCNyA9IEJbN107XG4gICAgdmFyIEI4ID0gQls4XTtcblxuICAgIHJlc3VsdFswXSA9IEEwICsgQjA7XG4gICAgcmVzdWx0WzFdID0gQTEgKyBCMTtcbiAgICByZXN1bHRbMl0gPSBBMiArIEIyO1xuICAgIHJlc3VsdFszXSA9IEEzICsgQjM7XG4gICAgcmVzdWx0WzRdID0gQTQgKyBCNDtcbiAgICByZXN1bHRbNV0gPSBBNSArIEI1O1xuICAgIHJlc3VsdFs2XSA9IEE2ICsgQjY7XG4gICAgcmVzdWx0WzddID0gQTcgKyBCNztcbiAgICByZXN1bHRbOF0gPSBBOCArIEI4O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIHByb3ZpZGVkIE1hdDMzJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDEgVGhlIGxlZnQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgyIFRoZSByaWdodCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG91dHB1dCBNYXQzMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSBUaGUgcmVzdWx0IG9mIHRoZSBzdWJ0cmFjdGlvbi5cbiAqL1xuTWF0MzMuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdChtYXRyaXgxLCBtYXRyaXgyLCBvdXRwdXQpIHtcbiAgICB2YXIgQSA9IG1hdHJpeDEudmFsdWVzO1xuICAgIHZhciBCID0gbWF0cml4Mi52YWx1ZXM7XG4gICAgdmFyIHJlc3VsdCA9IG91dHB1dC52YWx1ZXM7XG5cbiAgICB2YXIgQTAgPSBBWzBdO1xuICAgIHZhciBBMSA9IEFbMV07XG4gICAgdmFyIEEyID0gQVsyXTtcbiAgICB2YXIgQTMgPSBBWzNdO1xuICAgIHZhciBBNCA9IEFbNF07XG4gICAgdmFyIEE1ID0gQVs1XTtcbiAgICB2YXIgQTYgPSBBWzZdO1xuICAgIHZhciBBNyA9IEFbN107XG4gICAgdmFyIEE4ID0gQVs4XTtcblxuICAgIHZhciBCMCA9IEJbMF07XG4gICAgdmFyIEIxID0gQlsxXTtcbiAgICB2YXIgQjIgPSBCWzJdO1xuICAgIHZhciBCMyA9IEJbM107XG4gICAgdmFyIEI0ID0gQls0XTtcbiAgICB2YXIgQjUgPSBCWzVdO1xuICAgIHZhciBCNiA9IEJbNl07XG4gICAgdmFyIEI3ID0gQls3XTtcbiAgICB2YXIgQjggPSBCWzhdO1xuXG4gICAgcmVzdWx0WzBdID0gQTAgLSBCMDtcbiAgICByZXN1bHRbMV0gPSBBMSAtIEIxO1xuICAgIHJlc3VsdFsyXSA9IEEyIC0gQjI7XG4gICAgcmVzdWx0WzNdID0gQTMgLSBCMztcbiAgICByZXN1bHRbNF0gPSBBNCAtIEI0O1xuICAgIHJlc3VsdFs1XSA9IEE1IC0gQjU7XG4gICAgcmVzdWx0WzZdID0gQTYgLSBCNjtcbiAgICByZXN1bHRbN10gPSBBNyAtIEI3O1xuICAgIHJlc3VsdFs4XSA9IEE4IC0gQjg7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcbi8qKlxuICogTXVsdGlwbHkgdGhlIHByb3ZpZGVkIE1hdDMzIE0yIHdpdGggdGhpcyBNYXQzMy4gIFJlc3VsdCBpcyAodGhpcykgKiAoTTIpLlxuICpcbiAqIEBtZXRob2RcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDEgVGhlIGxlZnQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgyIFRoZSByaWdodCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG91dHB1dCBNYXQzMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSB0aGUgcmVzdWx0IG9mIHRoZSBtdWx0aXBsaWNhdGlvbi5cbiAqL1xuTWF0MzMubXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseShtYXRyaXgxLCBtYXRyaXgyLCBvdXRwdXQpIHtcbiAgICB2YXIgQSA9IG1hdHJpeDEudmFsdWVzO1xuICAgIHZhciBCID0gbWF0cml4Mi52YWx1ZXM7XG4gICAgdmFyIHJlc3VsdCA9IG91dHB1dC52YWx1ZXM7XG5cbiAgICB2YXIgQTAgPSBBWzBdO1xuICAgIHZhciBBMSA9IEFbMV07XG4gICAgdmFyIEEyID0gQVsyXTtcbiAgICB2YXIgQTMgPSBBWzNdO1xuICAgIHZhciBBNCA9IEFbNF07XG4gICAgdmFyIEE1ID0gQVs1XTtcbiAgICB2YXIgQTYgPSBBWzZdO1xuICAgIHZhciBBNyA9IEFbN107XG4gICAgdmFyIEE4ID0gQVs4XTtcblxuICAgIHZhciBCMCA9IEJbMF07XG4gICAgdmFyIEIxID0gQlsxXTtcbiAgICB2YXIgQjIgPSBCWzJdO1xuICAgIHZhciBCMyA9IEJbM107XG4gICAgdmFyIEI0ID0gQls0XTtcbiAgICB2YXIgQjUgPSBCWzVdO1xuICAgIHZhciBCNiA9IEJbNl07XG4gICAgdmFyIEI3ID0gQls3XTtcbiAgICB2YXIgQjggPSBCWzhdO1xuXG4gICAgcmVzdWx0WzBdID0gQTAqQjAgKyBBMSpCMyArIEEyKkI2O1xuICAgIHJlc3VsdFsxXSA9IEEwKkIxICsgQTEqQjQgKyBBMipCNztcbiAgICByZXN1bHRbMl0gPSBBMCpCMiArIEExKkI1ICsgQTIqQjg7XG4gICAgcmVzdWx0WzNdID0gQTMqQjAgKyBBNCpCMyArIEE1KkI2O1xuICAgIHJlc3VsdFs0XSA9IEEzKkIxICsgQTQqQjQgKyBBNSpCNztcbiAgICByZXN1bHRbNV0gPSBBMypCMiArIEE0KkI1ICsgQTUqQjg7XG4gICAgcmVzdWx0WzZdID0gQTYqQjAgKyBBNypCMyArIEE4KkI2O1xuICAgIHJlc3VsdFs3XSA9IEE2KkIxICsgQTcqQjQgKyBBOCpCNztcbiAgICByZXN1bHRbOF0gPSBBNipCMiArIEE3KkI1ICsgQTgqQjg7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXQzMztcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHNpbiA9IE1hdGguc2luO1xudmFyIGNvcyA9IE1hdGguY29zO1xudmFyIGFzaW4gPSBNYXRoLmFzaW47XG52YXIgYWNvcyA9IE1hdGguYWNvcztcbnZhciBhdGFuMiA9IE1hdGguYXRhbjI7XG52YXIgc3FydCA9IE1hdGguc3FydDtcblxuLyoqXG4gKiBBIHZlY3Rvci1saWtlIG9iamVjdCB1c2VkIHRvIHJlcHJlc2VudCByb3RhdGlvbnMuIElmIHRoZXRhIGlzIHRoZSBhbmdsZSBvZlxuICogcm90YXRpb24sIGFuZCAoeCcsIHknLCB6JykgaXMgYSBub3JtYWxpemVkIHZlY3RvciByZXByZXNlbnRpbmcgdGhlIGF4aXMgb2ZcbiAqIHJvdGF0aW9uLCB0aGVuIHcgPSBjb3ModGhldGEvMiksIHggPSBzaW4odGhldGEvMikqeCcsIHkgPSBzaW4odGhldGEvMikqeScsXG4gKiBhbmQgeiA9IHNpbih0aGV0YS8yKSp6Jy5cbiAqXG4gKiBAY2xhc3MgUXVhdGVybmlvblxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFRoZSB3IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFRoZSB6IGNvbXBvbmVudC5cbiAqL1xuZnVuY3Rpb24gUXVhdGVybmlvbih3LCB4LCB5LCB6KSB7XG4gICAgdGhpcy53ID0gdyB8fCAxO1xuICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgdGhpcy56ID0geiB8fCAwO1xufVxuXG4vKipcbiAqIE11bHRpcGx5IHRoZSBjdXJyZW50IFF1YXRlcm5pb24gYnkgaW5wdXQgUXVhdGVybmlvbiBxLlxuICogTGVmdC1oYW5kZWQgbXVsdGlwbGljYXRpb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgUXVhdGVybmlvbiB0byBtdWx0aXBseSBieSBvbiB0aGUgcmlnaHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KHEpIHtcbiAgICB2YXIgeDEgPSB0aGlzLng7XG4gICAgdmFyIHkxID0gdGhpcy55O1xuICAgIHZhciB6MSA9IHRoaXMuejtcbiAgICB2YXIgdzEgPSB0aGlzLnc7XG4gICAgdmFyIHgyID0gcS54O1xuICAgIHZhciB5MiA9IHEueTtcbiAgICB2YXIgejIgPSBxLno7XG4gICAgdmFyIHcyID0gcS53IHx8IDA7XG5cbiAgICB0aGlzLncgPSB3MSAqIHcyIC0geDEgKiB4MiAtIHkxICogeTIgLSB6MSAqIHoyO1xuICAgIHRoaXMueCA9IHgxICogdzIgKyB4MiAqIHcxICsgeTIgKiB6MSAtIHkxICogejI7XG4gICAgdGhpcy55ID0geTEgKiB3MiArIHkyICogdzEgKyB4MSAqIHoyIC0geDIgKiB6MTtcbiAgICB0aGlzLnogPSB6MSAqIHcyICsgejIgKiB3MSArIHgyICogeTEgLSB4MSAqIHkyO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB0aGUgY3VycmVudCBRdWF0ZXJuaW9uIGJ5IGlucHV0IFF1YXRlcm5pb24gcSBvbiB0aGUgbGVmdCwgaS5lLiBxICogdGhpcy5cbiAqIExlZnQtaGFuZGVkIG11bHRpcGxpY2F0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIFF1YXRlcm5pb24gdG8gbXVsdGlwbHkgYnkgb24gdGhlIGxlZnQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5sZWZ0TXVsdGlwbHkgPSBmdW5jdGlvbiBsZWZ0TXVsdGlwbHkocSkge1xuICAgIHZhciB4MSA9IHEueDtcbiAgICB2YXIgeTEgPSBxLnk7XG4gICAgdmFyIHoxID0gcS56O1xuICAgIHZhciB3MSA9IHEudyB8fCAwO1xuICAgIHZhciB4MiA9IHRoaXMueDtcbiAgICB2YXIgeTIgPSB0aGlzLnk7XG4gICAgdmFyIHoyID0gdGhpcy56O1xuICAgIHZhciB3MiA9IHRoaXMudztcblxuICAgIHRoaXMudyA9IHcxKncyIC0geDEqeDIgLSB5MSp5MiAtIHoxKnoyO1xuICAgIHRoaXMueCA9IHgxKncyICsgeDIqdzEgKyB5Mip6MSAtIHkxKnoyO1xuICAgIHRoaXMueSA9IHkxKncyICsgeTIqdzEgKyB4MSp6MiAtIHgyKnoxO1xuICAgIHRoaXMueiA9IHoxKncyICsgejIqdzEgKyB4Mip5MSAtIHgxKnkyO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBseSB0aGUgY3VycmVudCBRdWF0ZXJuaW9uIHRvIGlucHV0IFZlYzMgdiwgYWNjb3JkaW5nIHRvXG4gKiB2JyA9IH5xICogdiAqIHEuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgcmVmZXJlbmNlIFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJvdGF0ZWQgdmVyc2lvbiBvZiB0aGUgVmVjMy5cbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUucm90YXRlVmVjdG9yID0gZnVuY3Rpb24gcm90YXRlVmVjdG9yKHYsIG91dHB1dCkge1xuICAgIHZhciBjdyA9IHRoaXMudztcbiAgICB2YXIgY3ggPSAtdGhpcy54O1xuICAgIHZhciBjeSA9IC10aGlzLnk7XG4gICAgdmFyIGN6ID0gLXRoaXMuejtcblxuICAgIHZhciB2eCA9IHYueDtcbiAgICB2YXIgdnkgPSB2Lnk7XG4gICAgdmFyIHZ6ID0gdi56O1xuXG4gICAgdmFyIHR3ID0gLWN4ICogdnggLSBjeSAqIHZ5IC0gY3ogKiB2ejtcbiAgICB2YXIgdHggPSB2eCAqIGN3ICsgdnkgKiBjeiAtIGN5ICogdno7XG4gICAgdmFyIHR5ID0gdnkgKiBjdyArIGN4ICogdnogLSB2eCAqIGN6O1xuICAgIHZhciB0eiA9IHZ6ICogY3cgKyB2eCAqIGN5IC0gY3ggKiB2eTtcblxuICAgIHZhciB3ID0gY3c7XG4gICAgdmFyIHggPSAtY3g7XG4gICAgdmFyIHkgPSAtY3k7XG4gICAgdmFyIHogPSAtY3o7XG5cbiAgICBvdXRwdXQueCA9IHR4ICogdyArIHggKiB0dyArIHkgKiB0eiAtIHR5ICogejtcbiAgICBvdXRwdXQueSA9IHR5ICogdyArIHkgKiB0dyArIHR4ICogeiAtIHggKiB0ejtcbiAgICBvdXRwdXQueiA9IHR6ICogdyArIHogKiB0dyArIHggKiB0eSAtIHR4ICogeTtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBJbnZlcnQgdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiBpbnZlcnQoKSB7XG4gICAgdGhpcy53ID0gLXRoaXMudztcbiAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgdGhpcy56ID0gLXRoaXMuejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29uanVnYXRlIHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuY29uanVnYXRlID0gZnVuY3Rpb24gY29uanVnYXRlKCkge1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICB0aGlzLnogPSAtdGhpcy56O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBsZW5ndGggKG5vcm0pIG9mIHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gbGVuZ3RoIG9mIHRoZSBRdWF0ZXJuaW9uXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcbiAgICByZXR1cm4gc3FydCh3ICogdyArIHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG59O1xuXG4vKipcbiAqIEFsdGVyIHRoZSBjdXJyZW50IFF1YXRlcm5pb24gdG8gYmUgb2YgdW5pdCBsZW5ndGg7XG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKCkge1xuICAgIHZhciB3ID0gdGhpcy53O1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuICAgIHZhciBsZW5ndGggPSBzcXJ0KHcgKiB3ICsgeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcztcbiAgICBsZW5ndGggPSAxIC8gbGVuZ3RoO1xuICAgIHRoaXMudyAqPSBsZW5ndGg7XG4gICAgdGhpcy54ICo9IGxlbmd0aDtcbiAgICB0aGlzLnkgKj0gbGVuZ3RoO1xuICAgIHRoaXMueiAqPSBsZW5ndGg7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgdywgeCwgeSwgeiBjb21wb25lbnRzIG9mIHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFRoZSB3IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFRoZSB6IGNvbXBvbmVudC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCh3LCB4ICx5LCB6KSB7XG4gICAgaWYgKHcgIT0gbnVsbCkgdGhpcy53ID0gdztcbiAgICBpZiAoeCAhPSBudWxsKSB0aGlzLnggPSB4O1xuICAgIGlmICh5ICE9IG51bGwpIHRoaXMueSA9IHk7XG4gICAgaWYgKHogIT0gbnVsbCkgdGhpcy56ID0gejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29weSBpbnB1dCBRdWF0ZXJuaW9uIHEgb250byB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIHJlZmVyZW5jZSBRdWF0ZXJuaW9uLlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkocSkge1xuICAgIHRoaXMudyA9IHEudztcbiAgICB0aGlzLnggPSBxLng7XG4gICAgdGhpcy55ID0gcS55O1xuICAgIHRoaXMueiA9IHEuejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXQgdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHRoaXMudyA9IDE7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMueiA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdC4gQ2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjb3NpbmUgb2YgdGhlIGFuZ2xlIGJldHdlZW5cbiAqIHRoZSB0d28gcm90YXRpb25zLCBhc3N1bWluZyBib3RoIFF1YXRlcm5pb25zIGFyZSBvZiB1bml0IGxlbmd0aC5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSBvdGhlciBRdWF0ZXJuaW9uLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gdGhlIHJlc3VsdGluZyBkb3QgcHJvZHVjdFxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiBkb3QocSkge1xuICAgIHJldHVybiB0aGlzLncgKiBxLncgKyB0aGlzLnggKiBxLnggKyB0aGlzLnkgKiBxLnkgKyB0aGlzLnogKiBxLno7XG59O1xuXG4vKipcbiAqIFNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSBmaW5hbCBvcmllbnRhdGlvbi5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0IFRoZSB0d2VlbiBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHB1dCB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBxdWF0ZXJuaW9uIHRoZSBzbGVycCByZXN1bHRzIHdlcmUgc2F2ZWQgdG9cbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuc2xlcnAgPSBmdW5jdGlvbiBzbGVycChxLCB0LCBvdXRwdXQpIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciBxdyA9IHEudztcbiAgICB2YXIgcXggPSBxLng7XG4gICAgdmFyIHF5ID0gcS55O1xuICAgIHZhciBxeiA9IHEuejtcblxuICAgIHZhciBvbWVnYTtcbiAgICB2YXIgY29zb21lZ2E7XG4gICAgdmFyIHNpbm9tZWdhO1xuICAgIHZhciBzY2FsZUZyb207XG4gICAgdmFyIHNjYWxlVG87XG5cbiAgICBjb3NvbWVnYSA9IHcgKiBxdyArIHggKiBxeCArIHkgKiBxeSArIHogKiBxejtcbiAgICBpZiAoKDEuMCAtIGNvc29tZWdhKSA+IDFlLTUpIHtcbiAgICAgICAgb21lZ2EgPSBhY29zKGNvc29tZWdhKTtcbiAgICAgICAgc2lub21lZ2EgPSBzaW4ob21lZ2EpO1xuICAgICAgICBzY2FsZUZyb20gPSBzaW4oKDEuMCAtIHQpICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgICAgIHNjYWxlVG8gPSBzaW4odCAqIG9tZWdhKSAvIHNpbm9tZWdhO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2NhbGVGcm9tID0gMS4wIC0gdDtcbiAgICAgICAgc2NhbGVUbyA9IHQ7XG4gICAgfVxuXG4gICAgb3V0cHV0LncgPSB3ICogc2NhbGVGcm9tICsgcXcgKiBzY2FsZVRvO1xuICAgIG91dHB1dC54ID0geCAqIHNjYWxlRnJvbSArIHF4ICogc2NhbGVUbztcbiAgICBvdXRwdXQueSA9IHkgKiBzY2FsZUZyb20gKyBxeSAqIHNjYWxlVG87XG4gICAgb3V0cHV0LnogPSB6ICogc2NhbGVGcm9tICsgcXogKiBzY2FsZVRvO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBNYXQzMyBtYXRyaXggY29ycmVzcG9uZGluZyB0byB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3V0cHV0IE9iamVjdCB0byBwcm9jZXNzIHRoZSBUcmFuc2Zvcm0gbWF0cml4XG4gKlxuICogQHJldHVybiB7QXJyYXl9IHRoZSBRdWF0ZXJuaW9uIGFzIGEgVHJhbnNmb3JtIG1hdHJpeFxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS50b01hdHJpeCA9IGZ1bmN0aW9uIHRvTWF0cml4KG91dHB1dCkge1xuICAgIHZhciB3ID0gdGhpcy53O1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIHh4ID0geCp4O1xuICAgIHZhciB5eSA9IHkqeTtcbiAgICB2YXIgenogPSB6Kno7XG4gICAgdmFyIHh5ID0geCp5O1xuICAgIHZhciB4eiA9IHgqejtcbiAgICB2YXIgeXogPSB5Kno7XG5cbiAgICByZXR1cm4gb3V0cHV0LnNldChbXG4gICAgICAgIDEgLSAyICogKHl5ICsgenopLCAyICogKHh5IC0gdyp6KSwgMiAqICh4eiArIHcqeSksXG4gICAgICAgIDIgKiAoeHkgKyB3KnopLCAxIC0gMiAqICh4eCArIHp6KSwgMiAqICh5eiAtIHcqeCksXG4gICAgICAgIDIgKiAoeHogLSB3KnkpLCAyICogKHl6ICsgdyp4KSwgMSAtIDIgKiAoeHggKyB5eSlcbiAgICBdKTtcbn07XG5cbi8qKlxuICogVGhlIHJvdGF0aW9uIGFuZ2xlcyBhYm91dCB0aGUgeCwgeSwgYW5kIHogYXhlcyBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICogY3VycmVudCBRdWF0ZXJuaW9uLCB3aGVuIGFwcGxpZWQgaW4gdGhlIFpZWCBvcmRlci5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwdXQgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGUgVmVjMyB0aGUgcmVzdWx0IHdhcyBzdG9yZWQgaW5cbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUudG9FdWxlciA9IGZ1bmN0aW9uIHRvRXVsZXIob3V0cHV0KSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgeHggPSB4ICogeDtcbiAgICB2YXIgeXkgPSB5ICogeTtcbiAgICB2YXIgenogPSB6ICogejtcblxuICAgIHZhciB0eSA9IDIgKiAoeCAqIHogKyB5ICogdyk7XG4gICAgdHkgPSB0eSA8IC0xID8gLTEgOiB0eSA+IDEgPyAxIDogdHk7XG5cbiAgICBvdXRwdXQueCA9IGF0YW4yKDIgKiAoeCAqIHcgLSB5ICogeiksIDEgLSAyICogKHh4ICsgeXkpKTtcbiAgICBvdXRwdXQueSA9IGFzaW4odHkpO1xuICAgIG91dHB1dC56ID0gYXRhbjIoMiAqICh6ICogdyAtIHggKiB5KSwgMSAtIDIgKiAoeXkgKyB6eikpO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogVGhlIFF1YXRlcm5pb24gY29ycmVzcG9uZGluZyB0byB0aGUgRXVsZXIgYW5nbGVzIHgsIHksIGFuZCB6LFxuICogYXBwbGllZCBpbiB0aGUgWllYIG9yZGVyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgYW5nbGUgb2Ygcm90YXRpb24gYWJvdXQgdGhlIHggYXhpcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSBhbmdsZSBvZiByb3RhdGlvbiBhYm91dCB0aGUgeSBheGlzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHogVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGFib3V0IHRoZSB6IGF4aXMuXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IG91dHB1dCBRdWF0ZXJuaW9uIGluIHdoaWNoIHRvIHB1dCB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBlcXVpdmFsZW50IFF1YXRlcm5pb24uXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmZyb21FdWxlciA9IGZ1bmN0aW9uIGZyb21FdWxlcih4LCB5LCB6KSB7XG4gICAgdmFyIGh4ID0geCAqIDAuNTtcbiAgICB2YXIgaHkgPSB5ICogMC41O1xuICAgIHZhciBoeiA9IHogKiAwLjU7XG5cbiAgICB2YXIgc3ggPSBzaW4oaHgpO1xuICAgIHZhciBzeSA9IHNpbihoeSk7XG4gICAgdmFyIHN6ID0gc2luKGh6KTtcbiAgICB2YXIgY3ggPSBjb3MoaHgpO1xuICAgIHZhciBjeSA9IGNvcyhoeSk7XG4gICAgdmFyIGN6ID0gY29zKGh6KTtcblxuICAgIHRoaXMudyA9IGN4ICogY3kgKiBjeiAtIHN4ICogc3kgKiBzejtcbiAgICB0aGlzLnggPSBzeCAqIGN5ICogY3ogKyBjeCAqIHN5ICogc3o7XG4gICAgdGhpcy55ID0gY3ggKiBzeSAqIGN6IC0gc3ggKiBjeSAqIHN6O1xuICAgIHRoaXMueiA9IGN4ICogY3kgKiBzeiArIHN4ICogc3kgKiBjejtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBbHRlciB0aGUgY3VycmVudCBRdWF0ZXJuaW9uIHRvIHJlZmxlY3QgYSByb3RhdGlvbiBvZiBpbnB1dCBhbmdsZSBhYm91dFxuICogaW5wdXQgYXhpcyB4LCB5LCBhbmQgei5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlIFRoZSBhbmdsZSBvZiByb3RhdGlvbi5cbiAqIEBwYXJhbSB7VmVjM30geCBUaGUgYXhpcyBvZiByb3RhdGlvbi5cbiAqIEBwYXJhbSB7VmVjM30geSBUaGUgYXhpcyBvZiByb3RhdGlvbi5cbiAqIEBwYXJhbSB7VmVjM30geiBUaGUgYXhpcyBvZiByb3RhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmZyb21BbmdsZUF4aXMgPSBmdW5jdGlvbiBmcm9tQW5nbGVBeGlzKGFuZ2xlLCB4LCB5LCB6KSB7XG4gICAgdmFyIGxlbiA9IHNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICAgIHRoaXMudyA9IDE7XG4gICAgICAgIHRoaXMueCA9IHRoaXMueSA9IHRoaXMueiA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB2YXIgaGFsZlRoZXRhID0gYW5nbGUgKiAwLjU7XG4gICAgICAgIHZhciBzID0gc2luKGhhbGZUaGV0YSk7XG4gICAgICAgIHRoaXMudyA9IGNvcyhoYWxmVGhldGEpO1xuICAgICAgICB0aGlzLnggPSBzICogeCAqIGxlbjtcbiAgICAgICAgdGhpcy55ID0gcyAqIHkgKiBsZW47XG4gICAgICAgIHRoaXMueiA9IHMgKiB6ICogbGVuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdGhlIGlucHV0IFF1YXRlcm5pb25zLlxuICogTGVmdC1oYW5kZWQgY29vcmRpbmF0ZSBzeXN0ZW0gbXVsdGlwbGljYXRpb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcTEgVGhlIGxlZnQgUXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcTIgVGhlIHJpZ2h0IFF1YXRlcm5pb24uXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IG91dHB1dCBRdWF0ZXJuaW9uIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIHByb2R1Y3Qgb2YgbXVsdGlwbGljYXRpb24uXG4gKi9cblF1YXRlcm5pb24ubXVsdGlwbHkgPSBmdW5jdGlvbiBtdWx0aXBseShxMSwgcTIsIG91dHB1dCkge1xuICAgIHZhciB3MSA9IHExLncgfHwgMDtcbiAgICB2YXIgeDEgPSBxMS54O1xuICAgIHZhciB5MSA9IHExLnk7XG4gICAgdmFyIHoxID0gcTEuejtcblxuICAgIHZhciB3MiA9IHEyLncgfHwgMDtcbiAgICB2YXIgeDIgPSBxMi54O1xuICAgIHZhciB5MiA9IHEyLnk7XG4gICAgdmFyIHoyID0gcTIuejtcblxuICAgIG91dHB1dC53ID0gdzEgKiB3MiAtIHgxICogeDIgLSB5MSAqIHkyIC0gejEgKiB6MjtcbiAgICBvdXRwdXQueCA9IHgxICogdzIgKyB4MiAqIHcxICsgeTIgKiB6MSAtIHkxICogejI7XG4gICAgb3V0cHV0LnkgPSB5MSAqIHcyICsgeTIgKiB3MSArIHgxICogejIgLSB4MiAqIHoxO1xuICAgIG91dHB1dC56ID0gejEgKiB3MiArIHoyICogdzEgKyB4MiAqIHkxIC0geDEgKiB5MjtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGlucHV0IHF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgcmVmZXJlbmNlIFF1YXRlcm5pb24uXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IG91dHB1dCBRdWF0ZXJuaW9uIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIG5vcm1hbGl6ZWQgcXVhdGVybmlvbi5cbiAqL1xuUXVhdGVybmlvbi5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUocSwgb3V0cHV0KSB7XG4gICAgdmFyIHcgPSBxLnc7XG4gICAgdmFyIHggPSBxLng7XG4gICAgdmFyIHkgPSBxLnk7XG4gICAgdmFyIHogPSBxLno7XG4gICAgdmFyIGxlbmd0aCA9IHNxcnQodyAqIHcgKyB4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIGlmIChsZW5ndGggPT09IDApIHJldHVybiB0aGlzO1xuICAgIGxlbmd0aCA9IDEgLyBsZW5ndGg7XG4gICAgb3V0cHV0LncgKj0gbGVuZ3RoO1xuICAgIG91dHB1dC54ICo9IGxlbmd0aDtcbiAgICBvdXRwdXQueSAqPSBsZW5ndGg7XG4gICAgb3V0cHV0LnogKj0gbGVuZ3RoO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFRoZSBjb25qdWdhdGUgb2YgdGhlIGlucHV0IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgcmVmZXJlbmNlIFF1YXRlcm5pb24uXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IG91dHB1dCBRdWF0ZXJuaW9uIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIGNvbmp1Z2F0ZSBRdWF0ZXJuaW9uLlxuICovXG5RdWF0ZXJuaW9uLmNvbmp1Z2F0ZSA9IGZ1bmN0aW9uIGNvbmp1Z2F0ZShxLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQudyA9IHEudztcbiAgICBvdXRwdXQueCA9IC1xLng7XG4gICAgb3V0cHV0LnkgPSAtcS55O1xuICAgIG91dHB1dC56ID0gLXEuejtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBDbG9uZSB0aGUgaW5wdXQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIHRoZSByZWZlcmVuY2UgUXVhdGVybmlvbi5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgY2xvbmVkIFF1YXRlcm5pb24uXG4gKi9cblF1YXRlcm5pb24uY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShxKSB7XG4gICAgcmV0dXJuIG5ldyBRdWF0ZXJuaW9uKHEudywgcS54LCBxLnksIHEueik7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgdHdvIGlucHV0IFF1YXRlcm5pb25zLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHExIFRoZSBsZWZ0IFF1YXRlcm5pb24uXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEyIFRoZSByaWdodCBRdWF0ZXJuaW9uLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB0d28gUXVhdGVybmlvbnMuXG4gKi9cblF1YXRlcm5pb24uZG90ID0gZnVuY3Rpb24gZG90KHExLCBxMikge1xuICAgIHJldHVybiBxMS53ICogcTIudyArIHExLnggKiBxMi54ICsgcTEueSAqIHEyLnkgKyBxMS56ICogcTIuejtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVhdGVybmlvbjtcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBWZWMzID0gcmVxdWlyZSgnLi9WZWMzJyk7XG5cblxudmFyIFJheSA9IGZ1bmN0aW9uICggb3JpZ2luLCBkaXJlY3Rpb24gKSB7XG5cblx0dGhpcy5vcmlnaW4gPSAoIG9yaWdpbiAhPT0gdW5kZWZpbmVkICkgPyAgbmV3IFZlYzMob3JpZ2luWzBdLG9yaWdpblsxXSxvcmlnaW5bMl0pIDogbmV3IFZlYzMoKTtcblx0dGhpcy5kaXJlY3Rpb24gPSAoIGRpcmVjdGlvbiAhPT0gdW5kZWZpbmVkICkgPyBuZXcgVmVjMyhkaXJlY3Rpb25bMF0sZGlyZWN0aW9uWzFdLGRpcmVjdGlvblsyXSkgOiBuZXcgVmVjMygpO1xuXG59O1xuXG5SYXkucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICggb3JpZ2luLCBkaXJlY3Rpb24gKSB7XG5cblx0XHR0aGlzLm9yaWdpbi5jb3B5KCBvcmlnaW4gKTtcblx0XHR0aGlzLmRpcmVjdGlvbi5jb3B5KCBkaXJlY3Rpb24gKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXG59O1xuXG5SYXkucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoIHJheSApIHtcblxuXHRcdHRoaXMub3JpZ2luLmNvcHkoIHJheS5vcmlnaW4gKTtcblx0XHR0aGlzLmRpcmVjdGlvbi5jb3B5KCByYXkuZGlyZWN0aW9uICk7XG5cblx0XHRyZXR1cm4gdGhpcztcblxufTtcblxuUmF5LnByb3RvdHlwZS5hdCA9ICBmdW5jdGlvbiAoIHQgKSB7XG5cbiAgICB2YXIgcmVzdWx0ID0gbmV3IFZlYzMoKTtcblxuICAgIHJldHVybiByZXN1bHQuY29weSggdGhpcy5kaXJlY3Rpb24gKS5zY2FsZSggdCApLmFkZCggdGhpcy5vcmlnaW4gKTtcblxufTtcblxuXG5SYXkucHJvdG90eXBlLmludGVyc2VjdFNwaGVyZSA9IGZ1bmN0aW9uIChjZW50ZXIsIHJhZGl1cykge1xuXG5cdC8vIGZyb20gaHR0cDovL3d3dy5zY3JhdGNoYXBpeGVsLmNvbS9sZXNzb25zLzNkLWJhc2ljLWxlc3NvbnMvbGVzc29uLTctaW50ZXJzZWN0aW5nLXNpbXBsZS1zaGFwZXMvcmF5LXNwaGVyZS1pbnRlcnNlY3Rpb24vXG5cblx0dmFyIHZlYyA9IG5ldyBWZWMzKCk7XG4gICAgdmFyIGMgPSBuZXcgVmVjMyhjZW50ZXJbMF0sY2VudGVyWzFdLGNlbnRlclsyXSk7XG5cblx0dmVjLnN1YlZlY3RvcnMoIGMsIHRoaXMub3JpZ2luICk7XG5cblx0dmFyIHRjYSA9IHZlYy5kb3QoIHRoaXMuZGlyZWN0aW9uICk7XG5cblx0dmFyIGQyID0gdmVjLmRvdCggdmVjICkgLSB0Y2EgKiB0Y2E7XG5cblx0dmFyIHJhZGl1czIgPSByYWRpdXMgKiByYWRpdXM7XG5cblx0aWYgKCBkMiA+IHJhZGl1czIgKSByZXR1cm4gbnVsbDtcblxuXHR2YXIgdGhjID0gTWF0aC5zcXJ0KCByYWRpdXMyIC0gZDIgKTtcblxuXHQvLyB0MCA9IGZpcnN0IGludGVyc2VjdCBwb2ludCAtIGVudHJhbmNlIG9uIGZyb250IG9mIHNwaGVyZVxuXHR2YXIgdDAgPSB0Y2EgLSB0aGM7XG5cblx0Ly8gdDEgPSBzZWNvbmQgaW50ZXJzZWN0IHBvaW50IC0gZXhpdCBwb2ludCBvbiBiYWNrIG9mIHNwaGVyZVxuXHR2YXIgdDEgPSB0Y2EgKyB0aGM7XG5cblx0Ly8gdGVzdCB0byBzZWUgaWYgYm90aCB0MCBhbmQgdDEgYXJlIGJlaGluZCB0aGUgcmF5IC0gaWYgc28sIHJldHVybiBudWxsXG5cdGlmICggdDAgPCAwICYmIHQxIDwgMCApIHJldHVybiBudWxsO1xuXG5cdC8vIHRlc3QgdG8gc2VlIGlmIHQwIGlzIGJlaGluZCB0aGUgcmF5OlxuXHQvLyBpZiBpdCBpcywgdGhlIHJheSBpcyBpbnNpZGUgdGhlIHNwaGVyZSwgc28gcmV0dXJuIHRoZSBzZWNvbmQgZXhpdCBwb2ludCBzY2FsZWQgYnkgdDEsXG5cdC8vIGluIG9yZGVyIHRvIGFsd2F5cyByZXR1cm4gYW4gaW50ZXJzZWN0IHBvaW50IHRoYXQgaXMgaW4gZnJvbnQgb2YgdGhlIHJheS5cblx0aWYgKCB0MCA8IDAgKSByZXR1cm4gdGhpcy5hdCggdDEgKTtcblxuXHQvLyBlbHNlIHQwIGlzIGluIGZyb250IG9mIHRoZSByYXksIHNvIHJldHVybiB0aGUgZmlyc3QgY29sbGlzaW9uIHBvaW50IHNjYWxlZCBieSB0MFxuXHRyZXR1cm4gdGhpcy5hdCggdDAgKTtcblxufTtcblxuUmF5LnByb3RvdHlwZS5pbnRlcnNlY3RCb3ggPSBmdW5jdGlvbihjZW50ZXIsIHNpemUpIHtcblxuICAgIHZhciB0bWluLFxuICAgICAgICB0bWF4LFxuICAgICAgICB0eW1pbixcbiAgICAgICAgdHltYXgsXG4gICAgICAgIHR6bWluLFxuICAgICAgICB0em1heCxcbiAgICAgICAgYm94LFxuICAgICAgICBvdXQsXG4gICAgICAgIGludmRpcnggPSAxIC8gdGhpcy5kaXJlY3Rpb24ueCxcbiAgICAgICAgaW52ZGlyeSA9IDEgLyB0aGlzLmRpcmVjdGlvbi55LFxuICAgICAgICBpbnZkaXJ6ID0gMSAvIHRoaXMuZGlyZWN0aW9uLno7XG5cbiAgICBib3ggPSB7XG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgeDogY2VudGVyWzBdLShzaXplWzBdLzIpLFxuICAgICAgICAgICAgeTogY2VudGVyWzFdLShzaXplWzFdLzIpLFxuICAgICAgICAgICAgejogY2VudGVyWzJdLShzaXplWzJdLzIpXG4gICAgICAgIH0sXG4gICAgICAgIG1heDoge1xuICAgICAgICAgICAgeDogY2VudGVyWzBdKyhzaXplWzBdLzIpLFxuICAgICAgICAgICAgeTogY2VudGVyWzFdKyhzaXplWzFdLzIpLFxuICAgICAgICAgICAgejogY2VudGVyWzJdKyhzaXplWzJdLzIpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCBpbnZkaXJ4ID49IDAgKSB7XG5cbiAgICAgICAgdG1pbiA9ICggYm94Lm1pbi54IC0gdGhpcy5vcmlnaW4ueCApICogaW52ZGlyeDtcbiAgICAgICAgdG1heCA9ICggYm94Lm1heC54IC0gdGhpcy5vcmlnaW4ueCApICogaW52ZGlyeDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdG1pbiA9ICggYm94Lm1heC54IC0gdGhpcy5vcmlnaW4ueCApICogaW52ZGlyeDtcbiAgICAgICAgdG1heCA9ICggYm94Lm1pbi54IC0gdGhpcy5vcmlnaW4ueCApICogaW52ZGlyeDtcbiAgICB9XG5cbiAgICBpZiAoIGludmRpcnkgPj0gMCApIHtcblxuICAgICAgICB0eW1pbiA9ICggYm94Lm1pbi55IC0gdGhpcy5vcmlnaW4ueSApICogaW52ZGlyeTtcbiAgICAgICAgdHltYXggPSAoIGJveC5tYXgueSAtIHRoaXMub3JpZ2luLnkgKSAqIGludmRpcnk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHR5bWluID0gKCBib3gubWF4LnkgLSB0aGlzLm9yaWdpbi55ICkgKiBpbnZkaXJ5O1xuICAgICAgICB0eW1heCA9ICggYm94Lm1pbi55IC0gdGhpcy5vcmlnaW4ueSApICogaW52ZGlyeTtcbiAgICB9XG5cbiAgICBpZiAoICggdG1pbiA+IHR5bWF4ICkgfHwgKCB0eW1pbiA+IHRtYXggKSApIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCB0eW1pbiA+IHRtaW4gfHwgdG1pbiAhPT0gdG1pbiApIHRtaW4gPSB0eW1pbjtcblxuICAgIGlmICggdHltYXggPCB0bWF4IHx8IHRtYXggIT09IHRtYXggKSB0bWF4ID0gdHltYXg7XG5cbiAgICBpZiAoIGludmRpcnogPj0gMCApIHtcblxuICAgICAgICB0em1pbiA9ICggYm94Lm1pbi56IC0gdGhpcy5vcmlnaW4ueiApICogaW52ZGlyejtcbiAgICAgICAgdHptYXggPSAoIGJveC5tYXgueiAtIHRoaXMub3JpZ2luLnogKSAqIGludmRpcno7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHR6bWluID0gKCBib3gubWF4LnogLSB0aGlzLm9yaWdpbi56ICkgKiBpbnZkaXJ6O1xuICAgICAgICB0em1heCA9ICggYm94Lm1pbi56IC0gdGhpcy5vcmlnaW4ueiApICogaW52ZGlyejtcbiAgICB9XG5cbiAgICBpZiAoICggdG1pbiA+IHR6bWF4ICkgfHwgKCB0em1pbiA+IHRtYXggKSApIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCB0em1pbiA+IHRtaW4gfHwgdG1pbiAhPT0gdG1pbiApIHRtaW4gPSB0em1pbjtcblxuICAgIGlmICggdHptYXggPCB0bWF4IHx8IHRtYXggIT09IHRtYXggKSB0bWF4ID0gdHptYXg7XG5cblxuICAgIGlmICggdG1heCA8IDAgKSByZXR1cm4gbnVsbDtcblxuICAgIG91dCA9IHRoaXMuZGlyZWN0aW9uLnNjYWxlKHRtaW4gPj0gMCA/IHRtaW4gOiB0bWF4KTtcbiAgICByZXR1cm4gb3V0LmFkZChvdXQsIHRoaXMub3JpZ2luLCBvdXQpO1xuXG59O1xuXG5cblJheS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKCByYXkgKSB7XG5cblx0XHRyZXR1cm4gcmF5Lm9yaWdpbi5lcXVhbHMoIHRoaXMub3JpZ2luICkgJiYgcmF5LmRpcmVjdGlvbi5lcXVhbHMoIHRoaXMuZGlyZWN0aW9uICk7XG5cbn07XG5cblJheS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRyZXR1cm4gbmV3IFJheSgpLmNvcHkoIHRoaXMgKTtcblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheTtcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIHR3by1kaW1lbnNpb25hbCB2ZWN0b3IuXG4gKlxuICogQGNsYXNzIFZlYzJcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKi9cbnZhciBWZWMyID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkgfHwgeCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkge1xuICAgICAgICB0aGlzLnggPSB4WzBdIHx8IDA7XG4gICAgICAgIHRoaXMueSA9IHhbMV0gfHwgMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuICAgIH1cbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCh4LCB5KSB7XG4gICAgaWYgKHggIT0gbnVsbCkgdGhpcy54ID0geDtcbiAgICBpZiAoeSAhPSBudWxsKSB0aGlzLnkgPSB5O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGlucHV0IHYgdG8gdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFRoZSBWZWMyIHRvIGFkZC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCh2KSB7XG4gICAgdGhpcy54ICs9IHYueDtcbiAgICB0aGlzLnkgKz0gdi55O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgaW5wdXQgdiBmcm9tIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBUaGUgVmVjMiB0byBzdWJ0cmFjdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3Qodikge1xuICAgIHRoaXMueCAtPSB2Lng7XG4gICAgdGhpcy55IC09IHYueTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2NhbGUgdGhlIGN1cnJlbnQgVmVjMiBieSBhIHNjYWxhciBvciBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcnxWZWMyfSBzIFRoZSBOdW1iZXIgb3IgdmVjMiBieSB3aGljaCB0byBzY2FsZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gc2NhbGUocykge1xuICAgIGlmIChzIGluc3RhbmNlb2YgVmVjMikge1xuICAgICAgICB0aGlzLnggKj0gcy54O1xuICAgICAgICB0aGlzLnkgKj0gcy55O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy54ICo9IHM7XG4gICAgICAgIHRoaXMueSAqPSBzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUm90YXRlIHRoZSBWZWMyIGNvdW50ZXItY2xvY2t3aXNlIGJ5IHRoZXRhIGFib3V0IHRoZSB6LWF4aXMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aGV0YSBBbmdsZSBieSB3aGljaCB0byByb3RhdGUuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbih0aGV0YSkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuXG4gICAgdmFyIGNvc1RoZXRhID0gTWF0aC5jb3ModGhldGEpO1xuICAgIHZhciBzaW5UaGV0YSA9IE1hdGguc2luKHRoZXRhKTtcblxuICAgIHRoaXMueCA9IHggKiBjb3NUaGV0YSAtIHkgKiBzaW5UaGV0YTtcbiAgICB0aGlzLnkgPSB4ICogc2luVGhldGEgKyB5ICogY29zVGhldGE7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIG9mIHRoZSBjdXJyZW50IFZlYzIgd2l0aCB0aGUgaW5wdXQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHYgVGhlIG90aGVyIFZlYzIuXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcbn07XG5cbi8qKlxuICogVGhlIGNyb3NzIHByb2R1Y3Qgb2Ygb2YgdGhlIGN1cnJlbnQgVmVjMiB3aXRoIHRoZSBpbnB1dCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdiBUaGUgb3RoZXIgVmVjMi5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24odikge1xuICAgIHJldHVybiB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XG59O1xuXG4vKipcbiAqIFByZXNlcnZlIHRoZSBtYWduaXR1ZGUgYnV0IGludmVydCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiBpbnZlcnQoKSB7XG4gICAgdGhpcy54ICo9IC0xO1xuICAgIHRoaXMueSAqPSAtMTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwbHkgYSBmdW5jdGlvbiBjb21wb25lbnQtd2lzZSB0byB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBhcHBseS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcChmbikge1xuICAgIHRoaXMueCA9IGZuKHRoaXMueCk7XG4gICAgdGhpcy55ID0gZm4odGhpcy55KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IHRoZSBtYWduaXR1ZGUgb2YgdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSB0aGUgbGVuZ3RoIG9mIHRoZSB2ZWN0b3JcbiAqL1xuVmVjMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKCkge1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgaW5wdXQgb250byB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVmVjMiB0byBjb3B5XG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSh2KSB7XG4gICAgdGhpcy54ID0gdi54O1xuICAgIHRoaXMueSA9IHYueTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXQgdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7VmVjMn0gdGhpc1xuICovXG5WZWMyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgbWFnbml0dWRlIG9mIHRoZSBjdXJyZW50IFZlYzIgaXMgZXhhY3RseSAwLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIG9yIG5vdCB0aGUgbGVuZ3RoIGlzIDBcbiAqL1xuVmVjMi5wcm90b3R5cGUuaXNaZXJvID0gZnVuY3Rpb24gaXNaZXJvKCkge1xuICAgIGlmICh0aGlzLnggIT09IDAgfHwgdGhpcy55ICE9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogVGhlIGFycmF5IGZvcm0gb2YgdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7QXJyYXl9IHRoZSBWZWMgdG8gYXMgYW4gYXJyYXlcbiAqL1xuVmVjMi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgaW5wdXQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFRoZSByZWZlcmVuY2UgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gb3V0cHV0IFZlYzIgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSBUaGUgbm9ybWFsaXplZCBWZWMyLlxuICovXG5WZWMyLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZSh2LCBvdXRwdXQpIHtcbiAgICB2YXIgeCA9IHYueDtcbiAgICB2YXIgeSA9IHYueTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSkgfHwgMTtcbiAgICBsZW5ndGggPSAxIC8gbGVuZ3RoO1xuICAgIG91dHB1dC54ID0gdi54ICogbGVuZ3RoO1xuICAgIG91dHB1dC55ID0gdi55ICogbGVuZ3RoO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogQ2xvbmUgdGhlIGlucHV0IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBUaGUgVmVjMiB0byBjbG9uZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSBUaGUgY2xvbmVkIFZlYzIuXG4gKi9cblZlYzIuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSh2KSB7XG4gICAgcmV0dXJuIG5ldyBWZWMyKHYueCwgdi55KTtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBpbnB1dCBWZWMyJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdjEgVGhlIGxlZnQgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gdjIgVGhlIHJpZ2h0IFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dHB1dCBWZWMyIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gVGhlIHJlc3VsdCBvZiB0aGUgYWRkaXRpb24uXG4gKi9cblZlYzIuYWRkID0gZnVuY3Rpb24gYWRkKHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2MS54ICsgdjIueDtcbiAgICBvdXRwdXQueSA9IHYxLnkgKyB2Mi55O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIHNlY29uZCBWZWMyIGZyb20gdGhlIGZpcnN0LlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYxIFRoZSBsZWZ0IFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IHYyIFRoZSByaWdodCBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSBvdXRwdXQgVmVjMiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IFRoZSByZXN1bHQgb2YgdGhlIHN1YnRyYWN0aW9uLlxuICovXG5WZWMyLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QodjEsIHYyLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYxLnggLSB2Mi54O1xuICAgIG91dHB1dC55ID0gdjEueSAtIHYyLnk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU2NhbGUgdGhlIGlucHV0IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBUaGUgcmVmZXJlbmNlIFZlYzIuXG4gKiBAcGFyYW0ge051bWJlcn0gcyBOdW1iZXIgdG8gc2NhbGUgYnkuXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dHB1dCBWZWMyIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gVGhlIHJlc3VsdCBvZiB0aGUgc2NhbGluZy5cbiAqL1xuVmVjMi5zY2FsZSA9IGZ1bmN0aW9uIHNjYWxlKHYsIHMsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdi54ICogcztcbiAgICBvdXRwdXQueSA9IHYueSAqIHM7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSBpbnB1dCBWZWMyJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdjEgVGhlIGxlZnQgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gdjIgVGhlIHJpZ2h0IFZlYzIuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXG4gKi9cblZlYzIuZG90ID0gZnVuY3Rpb24gZG90KHYxLCB2Mikge1xuICAgIHJldHVybiB2MS54ICogdjIueCArIHYxLnkgKiB2Mi55O1xufTtcblxuLyoqXG4gKiBUaGUgY3Jvc3MgcHJvZHVjdCBvZiB0aGUgaW5wdXQgVmVjMidzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdjEgVGhlIGxlZnQgVmVjMi5cbiAqIEBwYXJhbSB7TnVtYmVyfSB2MiBUaGUgcmlnaHQgVmVjMi5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSB6LWNvbXBvbmVudCBvZiB0aGUgY3Jvc3MgcHJvZHVjdC5cbiAqL1xuVmVjMi5jcm9zcyA9IGZ1bmN0aW9uKHYxLHYyKSB7XG4gICAgcmV0dXJuIHYxLnggKiB2Mi55IC0gdjEueSAqIHYyLng7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzI7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSB0aHJlZS1kaW1lbnNpb25hbCB2ZWN0b3IuXG4gKlxuICogQGNsYXNzIFZlYzNcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geiBUaGUgeiBjb21wb25lbnQuXG4gKi9cbnZhciBWZWMzID0gZnVuY3Rpb24oeCwgeSwgeil7XG4gICAgdGhpcy54ID0geCB8fCAwO1xuICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICB0aGlzLnogPSB6IHx8IDA7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQuXG4gKiBAcGFyYW0ge051bWJlcn0geiBUaGUgeiBjb21wb25lbnQuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoeCwgeSwgeikge1xuICAgIGlmICh4ICE9IG51bGwpIHRoaXMueCA9IHg7XG4gICAgaWYgKHkgIT0gbnVsbCkgdGhpcy55ID0geTtcbiAgICBpZiAoeiAhPSBudWxsKSB0aGlzLnogPSB6O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgaW5wdXQgdiB0byB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIFZlYzMgdG8gYWRkLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKHYpIHtcbiAgICB0aGlzLnggKz0gdi54O1xuICAgIHRoaXMueSArPSB2Lnk7XG4gICAgdGhpcy56ICs9IHYuejtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgaW5wdXQgdiBmcm9tIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgVmVjMyB0byBzdWJ0cmFjdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3Qodikge1xuICAgIHRoaXMueCAtPSB2Lng7XG4gICAgdGhpcy55IC09IHYueTtcbiAgICB0aGlzLnogLT0gdi56O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBpbnB1dCBhIGZyb20gYiBhbmQgY3JlYXRlIG5ldyB2ZWN0b3IuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gYSBUaGUgVmVjMyB0byBzdWJ0cmFjdC5cbiAqIEBwYXJhbSB7VmVjM30gYiBUaGUgVmVjMyB0byBzdWJ0cmFjdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnN1YlZlY3RvcnMgPSBmdW5jdGlvbiAoIGEsIGIgKSB7XG5cblx0dGhpcy54ID0gYS54IC0gYi54O1xuXHR0aGlzLnkgPSBhLnkgLSBiLnk7XG5cdHRoaXMueiA9IGEueiAtIGIuejtcblxuXHRyZXR1cm4gdGhpcztcblxufTtcblxuLyoqXG4gKiBSb3RhdGUgdGhlIGN1cnJlbnQgVmVjMyBieSB0aGV0YSBjbG9ja3dpc2UgYWJvdXQgdGhlIHggYXhpcy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRoZXRhIEFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnJvdGF0ZVggPSBmdW5jdGlvbiByb3RhdGVYKHRoZXRhKSB7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgdGhpcy55ID0geSAqIGNvc1RoZXRhIC0geiAqIHNpblRoZXRhO1xuICAgIHRoaXMueiA9IHkgKiBzaW5UaGV0YSArIHogKiBjb3NUaGV0YTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSb3RhdGUgdGhlIGN1cnJlbnQgVmVjMyBieSB0aGV0YSBjbG9ja3dpc2UgYWJvdXQgdGhlIHkgYXhpcy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRoZXRhIEFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnJvdGF0ZVkgPSBmdW5jdGlvbiByb3RhdGVZKHRoZXRhKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgdGhpcy54ID0geiAqIHNpblRoZXRhICsgeCAqIGNvc1RoZXRhO1xuICAgIHRoaXMueiA9IHogKiBjb3NUaGV0YSAtIHggKiBzaW5UaGV0YTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSb3RhdGUgdGhlIGN1cnJlbnQgVmVjMyBieSB0aGV0YSBjbG9ja3dpc2UgYWJvdXQgdGhlIHogYXhpcy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRoZXRhIEFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnJvdGF0ZVogPSBmdW5jdGlvbiByb3RhdGVaKHRoZXRhKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG5cbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgdGhpcy54ID0geCAqIGNvc1RoZXRhIC0geSAqIHNpblRoZXRhO1xuICAgIHRoaXMueSA9IHggKiBzaW5UaGV0YSArIHkgKiBjb3NUaGV0YTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIGN1cnJlbnQgVmVjMyB3aXRoIGlucHV0IFZlYzMgdi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSBvdGhlciBWZWMzLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gZG90KHYpIHtcbiAgICByZXR1cm4gdGhpcy54KnYueCArIHRoaXMueSp2LnkgKyB0aGlzLnoqdi56O1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIGN1cnJlbnQgVmVjMyB3aXRoIGlucHV0IFZlYzMgdi5cbiAqIFN0b3JlcyB0aGUgcmVzdWx0IGluIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZCBjcm9zc1xuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgb3RoZXIgVmVjM1xuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiBjcm9zcyh2KSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgdnggPSB2Lng7XG4gICAgdmFyIHZ5ID0gdi55O1xuICAgIHZhciB2eiA9IHYuejtcblxuICAgIHRoaXMueCA9IHkgKiB2eiAtIHogKiB2eTtcbiAgICB0aGlzLnkgPSB6ICogdnggLSB4ICogdno7XG4gICAgdGhpcy56ID0geCAqIHZ5IC0geSAqIHZ4O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTY2FsZSB0aGUgY3VycmVudCBWZWMzIGJ5IGEgc2NhbGFyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gcyBUaGUgTnVtYmVyIGJ5IHdoaWNoIHRvIHNjYWxlXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIHNjYWxlKHMpIHtcbiAgICB0aGlzLnggKj0gcztcbiAgICB0aGlzLnkgKj0gcztcbiAgICB0aGlzLnogKj0gcztcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQcmVzZXJ2ZSB0aGUgbWFnbml0dWRlIGJ1dCBpbnZlcnQgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuaW52ZXJ0ID0gZnVuY3Rpb24gaW52ZXJ0KCkge1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICB0aGlzLnogPSAtdGhpcy56O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFwcGx5IGEgZnVuY3Rpb24gY29tcG9uZW50LXdpc2UgdG8gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gYXBwbHkuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAoZm4pIHtcbiAgICB0aGlzLnggPSBmbih0aGlzLngpO1xuICAgIHRoaXMueSA9IGZuKHRoaXMueSk7XG4gICAgdGhpcy56ID0gZm4odGhpcy56KTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUaGUgbWFnbml0dWRlIG9mIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gdGhlIG1hZ25pdHVkZSBvZiB0aGUgVmVjM1xuICovXG5WZWMzLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgoKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG59O1xuXG4vKipcbiAqIFRoZSBtYWduaXR1ZGUgc3F1YXJlZCBvZiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IG1hZ25pdHVkZSBvZiB0aGUgVmVjMyBzcXVhcmVkXG4gKi9cblZlYzMucHJvdG90eXBlLmxlbmd0aFNxID0gZnVuY3Rpb24gbGVuZ3RoU3EoKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSBpbnB1dCBvbnRvIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBWZWMzIHRvIGNvcHlcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5KHYpIHtcbiAgICB0aGlzLnggPSB2Lng7XG4gICAgdGhpcy55ID0gdi55O1xuICAgIHRoaXMueiA9IHYuejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXQgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLnogPSAwO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBtYWduaXR1ZGUgb2YgdGhlIGN1cnJlbnQgVmVjMyBpcyBleGFjdGx5IDAuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgb3Igbm90IHRoZSBtYWduaXR1ZGUgaXMgemVyb1xuICovXG5WZWMzLnByb3RvdHlwZS5pc1plcm8gPSBmdW5jdGlvbiBpc1plcm8oKSB7XG4gICAgcmV0dXJuIHRoaXMueCA9PT0gMCAmJiB0aGlzLnkgPT09IDAgJiYgdGhpcy56ID09PSAwO1xufTtcblxuLyoqXG4gKiBUaGUgYXJyYXkgZm9ybSBvZiB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gYSB0aHJlZSBlbGVtZW50IGFycmF5IHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50cyBvZiB0aGUgVmVjM1xuICovXG5WZWMzLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55LCB0aGlzLnpdO1xufTtcblxuLyoqXG4gKiBQcmVzZXJ2ZSB0aGUgb3JpZW50YXRpb24gYnV0IGNoYW5nZSB0aGUgbGVuZ3RoIG9mIHRoZSBjdXJyZW50IFZlYzMgdG8gMS5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUoKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgbGVuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeikgfHwgMTtcbiAgICBsZW4gPSAxIC8gbGVuO1xuXG4gICAgdGhpcy54ICo9IGxlbjtcbiAgICB0aGlzLnkgKj0gbGVuO1xuICAgIHRoaXMueiAqPSBsZW47XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFwcGx5IHRoZSByb3RhdGlvbiBjb3JyZXNwb25kaW5nIHRvIHRoZSBpbnB1dCAodW5pdCkgUXVhdGVybmlvblxuICogdG8gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFVuaXQgUXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uIHRvIGFwcGx5XG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5hcHBseVJvdGF0aW9uID0gZnVuY3Rpb24gYXBwbHlSb3RhdGlvbihxKSB7XG4gICAgdmFyIGN3ID0gcS53O1xuICAgIHZhciBjeCA9IC1xLng7XG4gICAgdmFyIGN5ID0gLXEueTtcbiAgICB2YXIgY3ogPSAtcS56O1xuXG4gICAgdmFyIHZ4ID0gdGhpcy54O1xuICAgIHZhciB2eSA9IHRoaXMueTtcbiAgICB2YXIgdnogPSB0aGlzLno7XG5cbiAgICB2YXIgdHcgPSAtY3ggKiB2eCAtIGN5ICogdnkgLSBjeiAqIHZ6O1xuICAgIHZhciB0eCA9IHZ4ICogY3cgKyB2eSAqIGN6IC0gY3kgKiB2ejtcbiAgICB2YXIgdHkgPSB2eSAqIGN3ICsgY3ggKiB2eiAtIHZ4ICogY3o7XG4gICAgdmFyIHR6ID0gdnogKiBjdyArIHZ4ICogY3kgLSBjeCAqIHZ5O1xuXG4gICAgdmFyIHcgPSBjdztcbiAgICB2YXIgeCA9IC1jeDtcbiAgICB2YXIgeSA9IC1jeTtcbiAgICB2YXIgeiA9IC1jejtcblxuICAgIHRoaXMueCA9IHR4ICogdyArIHggKiB0dyArIHkgKiB0eiAtIHR5ICogejtcbiAgICB0aGlzLnkgPSB0eSAqIHcgKyB5ICogdHcgKyB0eCAqIHogLSB4ICogdHo7XG4gICAgdGhpcy56ID0gdHogKiB3ICsgeiAqIHR3ICsgeCAqIHR5IC0gdHggKiB5O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBseSB0aGUgaW5wdXQgTWF0MzMgdGhlIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeCBNYXQzMyB0byBhcHBseVxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuYXBwbHlNYXRyaXggPSBmdW5jdGlvbiBhcHBseU1hdHJpeChtYXRyaXgpIHtcbiAgICB2YXIgTSA9IG1hdHJpeC5nZXQoKTtcblxuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdGhpcy54ID0gTVswXSp4ICsgTVsxXSp5ICsgTVsyXSp6O1xuICAgIHRoaXMueSA9IE1bM10qeCArIE1bNF0qeSArIE1bNV0qejtcbiAgICB0aGlzLnogPSBNWzZdKnggKyBNWzddKnkgKyBNWzhdKno7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgaW5wdXQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSByZWZlcmVuY2UgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgbm9ybWFsaXplIFZlYzMuXG4gKi9cblZlYzMubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKHYsIG91dHB1dCkge1xuICAgIHZhciB4ID0gdi54O1xuICAgIHZhciB5ID0gdi55O1xuICAgIHZhciB6ID0gdi56O1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopIHx8IDE7XG4gICAgbGVuZ3RoID0gMSAvIGxlbmd0aDtcblxuICAgIG91dHB1dC54ID0geCAqIGxlbmd0aDtcbiAgICBvdXRwdXQueSA9IHkgKiBsZW5ndGg7XG4gICAgb3V0cHV0LnogPSB6ICogbGVuZ3RoO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEFwcGx5IGEgcm90YXRpb24gdG8gdGhlIGlucHV0IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgcmVmZXJlbmNlIFZlYzMuXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVW5pdCBRdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24gdG8gYXBwbHkuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJvdGF0ZWQgdmVyc2lvbiBvZiB0aGUgaW5wdXQgVmVjMy5cbiAqL1xuVmVjMy5hcHBseVJvdGF0aW9uID0gZnVuY3Rpb24gYXBwbHlSb3RhdGlvbih2LCBxLCBvdXRwdXQpIHtcbiAgICB2YXIgY3cgPSBxLnc7XG4gICAgdmFyIGN4ID0gLXEueDtcbiAgICB2YXIgY3kgPSAtcS55O1xuICAgIHZhciBjeiA9IC1xLno7XG5cbiAgICB2YXIgdnggPSB2Lng7XG4gICAgdmFyIHZ5ID0gdi55O1xuICAgIHZhciB2eiA9IHYuejtcblxuICAgIHZhciB0dyA9IC1jeCAqIHZ4IC0gY3kgKiB2eSAtIGN6ICogdno7XG4gICAgdmFyIHR4ID0gdnggKiBjdyArIHZ5ICogY3ogLSBjeSAqIHZ6O1xuICAgIHZhciB0eSA9IHZ5ICogY3cgKyBjeCAqIHZ6IC0gdnggKiBjejtcbiAgICB2YXIgdHogPSB2eiAqIGN3ICsgdnggKiBjeSAtIGN4ICogdnk7XG5cbiAgICB2YXIgdyA9IGN3O1xuICAgIHZhciB4ID0gLWN4O1xuICAgIHZhciB5ID0gLWN5O1xuICAgIHZhciB6ID0gLWN6O1xuXG4gICAgb3V0cHV0LnggPSB0eCAqIHcgKyB4ICogdHcgKyB5ICogdHogLSB0eSAqIHo7XG4gICAgb3V0cHV0LnkgPSB0eSAqIHcgKyB5ICogdHcgKyB0eCAqIHogLSB4ICogdHo7XG4gICAgb3V0cHV0LnogPSB0eiAqIHcgKyB6ICogdHcgKyB4ICogdHkgLSB0eCAqIHk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogQ2xvbmUgdGhlIGlucHV0IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgVmVjMyB0byBjbG9uZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgY2xvbmVkIFZlYzMuXG4gKi9cblZlYzMuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZSh2KSB7XG4gICAgcmV0dXJuIG5ldyBWZWMzKHYueCwgdi55LCB2LnopO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGlucHV0IFZlYzMncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2MSBUaGUgbGVmdCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSB2MiBUaGUgcmlnaHQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcmVzdWx0IG9mIHRoZSBhZGRpdGlvbi5cbiAqL1xuVmVjMy5hZGQgPSBmdW5jdGlvbiBhZGQodjEsIHYyLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYxLnggKyB2Mi54O1xuICAgIG91dHB1dC55ID0gdjEueSArIHYyLnk7XG4gICAgb3V0cHV0LnogPSB2MS56ICsgdjIuejtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgc2Vjb25kIFZlYzMgZnJvbSB0aGUgZmlyc3QuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdjEgVGhlIGxlZnQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gdjIgVGhlIHJpZ2h0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJlc3VsdCBvZiB0aGUgc3VidHJhY3Rpb24uXG4gKi9cblZlYzMuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCh2MSwgdjIsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdjEueCAtIHYyLng7XG4gICAgb3V0cHV0LnkgPSB2MS55IC0gdjIueTtcbiAgICBvdXRwdXQueiA9IHYxLnogLSB2Mi56O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlIHRoZSBpbnB1dCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIHJlZmVyZW5jZSBWZWMzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHMgTnVtYmVyIHRvIHNjYWxlIGJ5LlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByZXN1bHQgb2YgdGhlIHNjYWxpbmcuXG4gKi9cblZlYzMuc2NhbGUgPSBmdW5jdGlvbiBzY2FsZSh2LCBzLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYueCAqIHM7XG4gICAgb3V0cHV0LnkgPSB2LnkgKiBzO1xuICAgIG91dHB1dC56ID0gdi56ICogcztcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTY2FsZSBhbmQgYWRkIHRoZSBpbnB1dCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIHJlZmVyZW5jZSBWZWMzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHMgTnVtYmVyIHRvIHNjYWxlIGJ5LlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByZXN1bHQgb2YgdGhlIHNjYWxpbmcuXG4gKi9cblZlYzMucHJvdG90eXBlLnNjYWxlQW5kQWRkID0gZnVuY3Rpb24gc2NhbGVBbmRBZGQoYSwgYiwgcykge1xuICAgIHRoaXMueCA9IGEueCArIChiLnggKiBzKTtcbiAgICB0aGlzLnkgPSBhLnkgKyAoYi55ICogcyk7XG4gICAgdGhpcy56ID0gYS56ICsgKGIueiAqIHMpO1xufTtcblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xuVmVjMy5wcm90b3R5cGUuc3F1YXJlZERpc3RhbmNlID0gZnVuY3Rpb24gc3F1YXJlZERpc3RhbmNlKGIpIHtcbiAgICB2YXIgeCA9IGIueCAtIHRoaXMueCxcbiAgICAgICAgeSA9IGIueSAtIHRoaXMueSxcbiAgICAgICAgeiA9IGIueiAtIHRoaXMuejtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6XG59O1xuXG5WZWMzLnByb3RvdHlwZS5kaXN0YW5jZVRvID0gZnVuY3Rpb24gKCB2ICkge1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCggdGhpcy5zcXVhcmVkRGlzdGFuY2UoIHYgKSApO1xuXG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgaW5wdXQgVmVjMydzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYxIFRoZSBsZWZ0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IHYyIFRoZSByaWdodCBWZWMzLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0LlxuICovXG5WZWMzLmRvdCA9IGZ1bmN0aW9uIGRvdCh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEueCAqIHYyLnggKyB2MS55ICogdjIueSArIHYxLnogKiB2Mi56O1xufTtcblxuLyoqXG4gKiBUaGUgKHJpZ2h0LWhhbmRlZCkgY3Jvc3MgcHJvZHVjdCBvZiB0aGUgaW5wdXQgVmVjMydzLlxuICogdjEgeCB2Mi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2MSBUaGUgbGVmdCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSB2MiBUaGUgcmlnaHQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSBvYmplY3QgdGhlIHJlc3VsdCBvZiB0aGUgY3Jvc3MgcHJvZHVjdCB3YXMgcGxhY2VkIGludG9cbiAqL1xuVmVjMy5jcm9zcyA9IGZ1bmN0aW9uIGNyb3NzKHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgdmFyIHgxID0gdjEueDtcbiAgICB2YXIgeTEgPSB2MS55O1xuICAgIHZhciB6MSA9IHYxLno7XG4gICAgdmFyIHgyID0gdjIueDtcbiAgICB2YXIgeTIgPSB2Mi55O1xuICAgIHZhciB6MiA9IHYyLno7XG5cbiAgICBvdXRwdXQueCA9IHkxICogejIgLSB6MSAqIHkyO1xuICAgIG91dHB1dC55ID0gejEgKiB4MiAtIHgxICogejI7XG4gICAgb3V0cHV0LnogPSB4MSAqIHkyIC0geTEgKiB4MjtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBUaGUgcHJvamVjdGlvbiBvZiB2MSBvbnRvIHYyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYxIFRoZSBsZWZ0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IHYyIFRoZSByaWdodCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCB0aGUgcmVzdWx0IG9mIHRoZSBjcm9zcyBwcm9kdWN0IHdhcyBwbGFjZWQgaW50b1xuICovXG5WZWMzLnByb2plY3QgPSBmdW5jdGlvbiBwcm9qZWN0KHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgdmFyIHgxID0gdjEueDtcbiAgICB2YXIgeTEgPSB2MS55O1xuICAgIHZhciB6MSA9IHYxLno7XG4gICAgdmFyIHgyID0gdjIueDtcbiAgICB2YXIgeTIgPSB2Mi55O1xuICAgIHZhciB6MiA9IHYyLno7XG5cbiAgICB2YXIgc2NhbGUgPSB4MSAqIHgyICsgeTEgKiB5MiArIHoxICogejI7XG4gICAgc2NhbGUgLz0geDIgKiB4MiArIHkyICogeTIgKyB6MiAqIHoyO1xuXG4gICAgb3V0cHV0LnggPSB4MiAqIHNjYWxlO1xuICAgIG91dHB1dC55ID0geTIgKiBzY2FsZTtcbiAgICBvdXRwdXQueiA9IHoyICogc2NhbGU7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuVmVjMy5wcm90b3R5cGUuY3JlYXRlRnJvbUFycmF5ID0gZnVuY3Rpb24oYSl7XG4gICAgdGhpcy54ID0gYVswXSB8fCAwO1xuICAgIHRoaXMueSA9IGFbMV0gfHwgMDtcbiAgICB0aGlzLnogPSBhWzJdIHx8IDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlYzM7XG4iLCIvKipcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBNYXQzMzogcmVxdWlyZSgnLi9NYXQzMycpLFxuICAgIFF1YXRlcm5pb246IHJlcXVpcmUoJy4vUXVhdGVybmlvbicpLFxuICAgIFZlYzI6IHJlcXVpcmUoJy4vVmVjMicpLFxuICAgIFZlYzM6IHJlcXVpcmUoJy4vVmVjMycpLFxuICAgIFJheTogcmVxdWlyZSgnLi9SYXknKVxufTtcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qanNoaW50IC1XMDA4ICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGxpYnJhcnkgb2YgY3VydmVzIHdoaWNoIG1hcCBhbiBhbmltYXRpb24gZXhwbGljaXRseSBhcyBhIGZ1bmN0aW9uIG9mIHRpbWUuXG4gKlxuICogQG5hbWVzcGFjZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gbGluZWFyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlSW5cbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVhc2VPdXRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVhc2VJbk91dFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZWFzZU91dEJvdW5jZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gc3ByaW5nXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpblF1YWRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dFF1YWRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0UXVhZFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5DdWJpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0Q3ViaWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0Q3ViaWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluUXVhcnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dFF1YXJ0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dFF1YXJ0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpblF1aW50XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRRdWludFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRRdWludFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5TaW5lXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRTaW5lXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dFNpbmVcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluRXhwb1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0RXhwb1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRFeHBcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluQ2lyY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0Q2lyY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRDaXJjXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkVsYXN0aWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEVsYXN0aWNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0RWxhc3RpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5Cb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dEJvdW5jZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRCb3VuY2VcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGZsYXQgICAgICAgICAgICAtIFVzZWZ1bCBmb3IgZGVsYXlpbmcgdGhlIGV4ZWN1dGlvbiBvZlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBzdWJzZXF1ZW50IHRyYW5zaXRpb24uXG4gKi9cbnZhciBDdXJ2ZXMgPSB7XG4gICAgbGluZWFyOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH0sXG5cbiAgICBlYXNlSW46IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdDtcbiAgICB9LFxuXG4gICAgZWFzZU91dDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCooMi10KTtcbiAgICB9LFxuXG4gICAgZWFzZUluT3V0OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICh0IDw9IDAuNSkgcmV0dXJuIDIqdCp0O1xuICAgICAgICBlbHNlIHJldHVybiAtMip0KnQgKyA0KnQgLSAxO1xuICAgIH0sXG5cbiAgICBlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KigzIC0gMip0KTtcbiAgICB9LFxuXG4gICAgc3ByaW5nOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAoMSAtIHQpICogTWF0aC5zaW4oNiAqIE1hdGguUEkgKiB0KSArIHQ7XG4gICAgfSxcblxuICAgIGluUXVhZDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0O1xuICAgIH0sXG5cbiAgICBvdXRRdWFkOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtKHQtPTEpKnQrMTtcbiAgICB9LFxuXG4gICAgaW5PdXRRdWFkOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdDtcbiAgICAgICAgcmV0dXJuIC0uNSooKC0tdCkqKHQtMikgLSAxKTtcbiAgICB9LFxuXG4gICAgaW5DdWJpYzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0KnQ7XG4gICAgfSxcblxuICAgIG91dEN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAoKC0tdCkqdCp0ICsgMSk7XG4gICAgfSxcblxuICAgIGluT3V0Q3ViaWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUqdCp0KnQ7XG4gICAgICAgIHJldHVybiAuNSooKHQtPTIpKnQqdCArIDIpO1xuICAgIH0sXG5cbiAgICBpblF1YXJ0OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQqdCp0O1xuICAgIH0sXG5cbiAgICBvdXRRdWFydDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLSgoLS10KSp0KnQqdCAtIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dFF1YXJ0OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41KnQqdCp0KnQ7XG4gICAgICAgIHJldHVybiAtLjUgKiAoKHQtPTIpKnQqdCp0IC0gMik7XG4gICAgfSxcblxuICAgIGluUXVpbnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdCp0KnQqdDtcbiAgICB9LFxuXG4gICAgb3V0UXVpbnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuICgoLS10KSp0KnQqdCp0ICsgMSk7XG4gICAgfSxcblxuICAgIGluT3V0UXVpbnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUqdCp0KnQqdCp0O1xuICAgICAgICByZXR1cm4gLjUqKCh0LT0yKSp0KnQqdCp0ICsgMik7XG4gICAgfSxcblxuICAgIGluU2luZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLTEuMCpNYXRoLmNvcyh0ICogKE1hdGguUEkvMikpICsgMS4wO1xuICAgIH0sXG5cbiAgICBvdXRTaW5lOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNpbih0ICogKE1hdGguUEkvMikpO1xuICAgIH0sXG5cbiAgICBpbk91dFNpbmU6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0uNSooTWF0aC5jb3MoTWF0aC5QSSp0KSAtIDEpO1xuICAgIH0sXG5cbiAgICBpbkV4cG86IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuICh0PT09MCkgPyAwLjAgOiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpO1xuICAgIH0sXG5cbiAgICBvdXRFeHBvOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAodD09PTEuMCkgPyAxLjAgOiAoLU1hdGgucG93KDIsIC0xMCAqIHQpICsgMSk7XG4gICAgfSxcblxuICAgIGluT3V0RXhwbzogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodD09PTApIHJldHVybiAwLjA7XG4gICAgICAgIGlmICh0PT09MS4wKSByZXR1cm4gMS4wO1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSk7XG4gICAgICAgIHJldHVybiAuNSAqICgtTWF0aC5wb3coMiwgLTEwICogLS10KSArIDIpO1xuICAgIH0sXG5cbiAgICBpbkNpcmM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSk7XG4gICAgfSxcblxuICAgIG91dENpcmM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gKC0tdCkqdCk7XG4gICAgfSxcblxuICAgIGluT3V0Q2lyYzogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAtLjUgKiAoTWF0aC5zcXJ0KDEgLSB0KnQpIC0gMSk7XG4gICAgICAgIHJldHVybiAuNSAqIChNYXRoLnNxcnQoMSAtICh0LT0yKSp0KSArIDEpO1xuICAgIH0sXG5cbiAgICBpbkVsYXN0aWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPTEuMDtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wOyAgaWYgKHQ9PT0xKSByZXR1cm4gMS4wOyAgaWYgKCFwKSBwPS4zO1xuICAgICAgICBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbigxLjAvYSk7XG4gICAgICAgIHJldHVybiAtKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oKHQtcykqKDIqTWF0aC5QSSkvIHApKTtcbiAgICB9LFxuXG4gICAgb3V0RWxhc3RpYzogZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9MS4wO1xuICAgICAgICBpZiAodD09PTApIHJldHVybiAwLjA7ICBpZiAodD09PTEpIHJldHVybiAxLjA7ICBpZiAoIXApIHA9LjM7XG4gICAgICAgIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luKDEuMC9hKTtcbiAgICAgICAgcmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqdCkgKiBNYXRoLnNpbigodC1zKSooMipNYXRoLlBJKS9wKSArIDEuMDtcbiAgICB9LFxuXG4gICAgaW5PdXRFbGFzdGljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT0xLjA7XG4gICAgICAgIGlmICh0PT09MCkgcmV0dXJuIDAuMDsgIGlmICgodC89LjUpPT09MikgcmV0dXJuIDEuMDsgIGlmICghcCkgcD0oLjMqMS41KTtcbiAgICAgICAgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4oMS4wL2EpO1xuICAgICAgICBpZiAodCA8IDEpIHJldHVybiAtLjUqKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oKHQtcykqKDIqTWF0aC5QSSkvcCkpO1xuICAgICAgICByZXR1cm4gYSpNYXRoLnBvdygyLC0xMCoodC09MSkpICogTWF0aC5zaW4oKHQtcykqKDIqTWF0aC5QSSkvcCkqLjUgKyAxLjA7XG4gICAgfSxcblxuICAgIGluQmFjazogZnVuY3Rpb24odCwgcykge1xuICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcbiAgICAgICAgcmV0dXJuIHQqdCooKHMrMSkqdCAtIHMpO1xuICAgIH0sXG5cbiAgICBvdXRCYWNrOiBmdW5jdGlvbih0LCBzKSB7XG4gICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuICAgICAgICByZXR1cm4gKCgtLXQpKnQqKChzKzEpKnQgKyBzKSArIDEpO1xuICAgIH0sXG5cbiAgICBpbk91dEJhY2s6IGZ1bmN0aW9uKHQsIHMpIHtcbiAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41Kih0KnQqKCgocyo9KDEuNTI1KSkrMSkqdCAtIHMpKTtcbiAgICAgICAgcmV0dXJuIC41KigodC09MikqdCooKChzKj0oMS41MjUpKSsxKSp0ICsgcykgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5Cb3VuY2U6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIDEuMCAtIEN1cnZlcy5vdXRCb3VuY2UoMS4wLXQpO1xuICAgIH0sXG5cbiAgICBvdXRCb3VuY2U6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKHQgPCAoMS8yLjc1KSkge1xuICAgICAgICAgICAgcmV0dXJuICg3LjU2MjUqdCp0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0IDwgKDIvMi43NSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0IDwgKDIuNS8yLjc1KSkge1xuICAgICAgICAgICAgcmV0dXJuICg3LjU2MjUqKHQtPSgyLjI1LzIuNzUpKSp0ICsgLjkzNzUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICg3LjU2MjUqKHQtPSgyLjYyNS8yLjc1KSkqdCArIC45ODQzNzUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluT3V0Qm91bmNlOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICh0IDwgLjUpIHJldHVybiBDdXJ2ZXMuaW5Cb3VuY2UodCoyKSAqIC41O1xuICAgICAgICByZXR1cm4gQ3VydmVzLm91dEJvdW5jZSh0KjItMS4wKSAqIC41ICsgLjU7XG4gICAgfSxcblxuICAgIGZsYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEN1cnZlcztcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEN1cnZlcyA9IHJlcXVpcmUoJy4vQ3VydmVzJyk7XG52YXIgRW5naW5lID0gcmVxdWlyZSgnLi4vY29yZS9FbmdpbmUnKTtcblxuLyoqXG4gKiBBIHN0YXRlIG1haW50YWluZXIgZm9yIGEgc21vb3RoIHRyYW5zaXRpb24gYmV0d2VlblxuICogICAgbnVtZXJpY2FsbHktc3BlY2lmaWVkIHN0YXRlcy4gRXhhbXBsZSBudW1lcmljIHN0YXRlcyBpbmNsdWRlIGZsb2F0cyBhbmRcbiAqICAgIGFycmF5cyBvZiBmbG9hdHMgb2JqZWN0cy5cbiAqXG4gKiBBbiBpbml0aWFsIHN0YXRlIGlzIHNldCB3aXRoIHRoZSBjb25zdHJ1Y3RvciBvciB1c2luZ1xuICogICAgIHtAbGluayBUcmFuc2l0aW9uYWJsZSNmcm9tfS4gU3Vic2VxdWVudCB0cmFuc2l0aW9ucyBjb25zaXN0IG9mIGFuXG4gKiAgICAgaW50ZXJtZWRpYXRlIHN0YXRlLCBlYXNpbmcgY3VydmUsIGR1cmF0aW9uIGFuZCBjYWxsYmFjay4gVGhlIGZpbmFsIHN0YXRlXG4gKiAgICAgb2YgZWFjaCB0cmFuc2l0aW9uIGlzIHRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBzdWJzZXF1ZW50IG9uZS4gQ2FsbHMgdG9cbiAqICAgICB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZ2V0fSBwcm92aWRlIHRoZSBpbnRlcnBvbGF0ZWQgc3RhdGUgYWxvbmcgdGhlIHdheS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlcmUgaXMgbm8gZXZlbnQgbG9vcCBoZXJlIC0gY2FsbHMgdG8ge0BsaW5rIFRyYW5zaXRpb25hYmxlI2dldH1cbiAqICAgIGFyZSB0aGUgb25seSB3YXkgdG8gZmluZCBzdGF0ZSBwcm9qZWN0ZWQgdG8gdGhlIGN1cnJlbnQgKG9yIHByb3ZpZGVkKVxuICogICAgdGltZSBhbmQgYXJlIHRoZSBvbmx5IHdheSB0byB0cmlnZ2VyIGNhbGxiYWNrcyBhbmQgbXV0YXRlIHRoZSBpbnRlcm5hbFxuICogICAgdHJhbnNpdGlvbiBxdWV1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHQgPSBuZXcgVHJhbnNpdGlvbmFibGUoWzAsIDBdKTtcbiAqIHRcbiAqICAgICAudG8oWzEwMCwgMF0sICdsaW5lYXInLCAxMDAwKVxuICogICAgIC5kZWxheSgxMDAwKVxuICogICAgIC50byhbMjAwLCAwXSwgJ291dEJvdW5jZScsIDEwMDApO1xuICpcbiAqIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAqIGRpdi5zdHlsZS5iYWNrZ3JvdW5kID0gJ2JsdWUnO1xuICogZGl2LnN0eWxlLndpZHRoID0gJzEwMHB4JztcbiAqIGRpdi5zdHlsZS5oZWlnaHQgPSAnMTAwcHgnO1xuICogZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICpcbiAqIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICogICAgIHQuaXNQYXVzZWQoKSA/IHQucmVzdW1lKCkgOiB0LnBhdXNlKCk7XG4gKiB9KTtcbiAqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gbG9vcCgpIHtcbiAqICAgICBkaXYuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIHQuZ2V0KClbMF0gKyAncHgpJyArICcgdHJhbnNsYXRlWSgnICsgdC5nZXQoKVsxXSArICdweCknO1xuICogICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAqIH0pO1xuICpcbiAqIEBjbGFzcyBUcmFuc2l0aW9uYWJsZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge051bWJlcnxBcnJheS5OdW1iZXJ9IGluaXRpYWxTdGF0ZSAgICBpbml0aWFsIHN0YXRlIHRvIHRyYW5zaXRpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gLSBlcXVpdmFsZW50IHRvIGEgcHVyc3VhbnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludm9jYXRpb24gb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtAbGluayBUcmFuc2l0aW9uYWJsZSNmcm9tfVxuICovXG5mdW5jdGlvbiBUcmFuc2l0aW9uYWJsZShpbml0aWFsU3RhdGUpIHtcbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2Zyb20gPSBudWxsO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9zdGFydGVkQXQgPSBudWxsO1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICB0aGlzLmlkID0gbnVsbDtcbiAgICB0aGlzLnBhcmFtID0gbnVsbDtcbiAgICBpZiAoaW5pdGlhbFN0YXRlICE9IG51bGwpIHRoaXMuZnJvbShpbml0aWFsU3RhdGUpO1xuICAgIEVuZ2luZS51cGRhdGVRdWV1ZS5wdXNoKHRoaXMpO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhIHRyYW5zaXRpb24gdG8gYmUgcHVzaGVkIG9udG8gdGhlIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBtZXRob2QgdG9cbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBmaW5hbFN0YXRlICAgICAgICAgICAgICBmaW5hbCBzdGF0ZSB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdG9uIHRvXG4gKiBAcGFyYW0gIHtTdHJpbmd8RnVuY3Rpb259ICAgICAgICBbY3VydmU9Q3VydmVzLmxpbmVhcl0gICBlYXNpbmcgZnVuY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZWQgZm9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW5nXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbMCwgMV1cbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFtkdXJhdGlvbj0xMDBdICAgICAgICAgIGR1cmF0aW9uIG9mXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgICAgICBbY2FsbGJhY2tdICAgICAgICAgICAgICBjYWxsYmFjayBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYmUgY2FsbGVkIGFmdGVyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdHJhbnNpdGlvbiBpc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgICAgIFttZXRob2RdICAgICAgICAgICAgICAgIG1ldGhvZCB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGUuZy4gc2xlcnApXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIHRvKGZpbmFsU3RhdGUsIGN1cnZlLCBkdXJhdGlvbiwgY2FsbGJhY2ssIG1ldGhvZCkge1xuXG4gICAgY3VydmUgPSBjdXJ2ZSAhPSBudWxsICYmIGN1cnZlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcgPyBDdXJ2ZXNbY3VydmVdIDogY3VydmU7XG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9zdGFydGVkQXQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX3F1ZXVlLnB1c2goXG4gICAgICAgIGZpbmFsU3RhdGUsXG4gICAgICAgIGN1cnZlICE9IG51bGwgPyBjdXJ2ZSA6IEN1cnZlcy5saW5lYXIsXG4gICAgICAgIGR1cmF0aW9uICE9IG51bGwgPyBkdXJhdGlvbiA6IDEwMCxcbiAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgIG1ldGhvZFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVzZXRzIHRoZSB0cmFuc2l0aW9uIHF1ZXVlIHRvIGEgc3RhYmxlIGluaXRpYWwgc3RhdGUuXG4gKlxuICogQG1ldGhvZCBmcm9tXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgaW5pdGlhbFN0YXRlICAgIGluaXRpYWwgc3RhdGUgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uIGZyb21cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbiBmcm9tKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuX3N0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIHRoaXMuX2Zyb20gPSB0aGlzLl9zeW5jKG51bGwsIHRoaXMuX3N0YXRlKTtcbiAgICB0aGlzLl9xdWV1ZS5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRGVsYXlzIHRoZSBleGVjdXRpb24gb2YgdGhlIHN1YnNlcXVlbnQgdHJhbnNpdGlvbiBmb3IgYSBjZXJ0YWluIHBlcmlvZCBvZlxuICogdGltZS5cbiAqXG4gKiBAbWV0aG9kIGRlbGF5XG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgZHVyYXRpb24gICAgZGVsYXkgdGltZSBpbiBtc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgW2NhbGxiYWNrXSAgWmVyby1hcmd1bWVudCBmdW5jdGlvbiB0byBjYWxsIG9uIG9ic2VydmVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uICh0PTEpXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5kZWxheSA9IGZ1bmN0aW9uIGRlbGF5KGR1cmF0aW9uLCBjYWxsYmFjaykge1xuICAgIHZhciBlbmRTdGF0ZSA9IHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDAgPyB0aGlzLl9xdWV1ZVt0aGlzLl9xdWV1ZS5sZW5ndGggLSA1XSA6IHRoaXMuX3N0YXRlO1xuICAgIHJldHVybiB0aGlzLnRvKGVuZFN0YXRlLCBDdXJ2ZXMuZmxhdCwgZHVyYXRpb24sIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogT3ZlcnJpZGVzIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqXG4gKiBAbWV0aG9kIG92ZXJyaWRlXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgW2ZpbmFsU3RhdGVdICAgIGZpbmFsIHN0YXRlIHRvIHRyYW5zaXRvbiB0b1xuICogQHBhcmFtICB7U3RyaW5nfEZ1bmN0aW9ufSAgICAgICAgW2N1cnZlXSAgICAgICAgIGVhc2luZyBmdW5jdGlvbiB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpbmcgWzAsIDFdXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbZHVyYXRpb25dICAgICAgZHVyYXRpb24gb2YgdHJhbnNpdGlvblxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgICAgICAgICAgW2NhbGxiYWNrXSAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVkIGFmdGVyIHRoZSB0cmFuc2l0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgY29tcGxldGVcbiAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICAgICAgICAgIFttZXRob2RdICAgICAgICBvcHRpb25hbCBtZXRob2QgdXNlZCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLiBTZXQgdG8gYHNsZXJwYCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGhlcmljYWwgbGluZWFyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGlvbi5cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLm92ZXJyaWRlID0gZnVuY3Rpb24gb3ZlcnJpZGUoZmluYWxTdGF0ZSwgY3VydmUsIGR1cmF0aW9uLCBjYWxsYmFjaywgbWV0aG9kKSB7XG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKGZpbmFsU3RhdGUgIT0gbnVsbCkgdGhpcy5fcXVldWVbMF0gPSBmaW5hbFN0YXRlO1xuICAgICAgICBpZiAoY3VydmUgIT0gbnVsbCkgICAgICB0aGlzLl9xdWV1ZVsxXSA9IGN1cnZlLmNvbnN0cnVjdG9yID09PSBTdHJpbmcgPyBDdXJ2ZXNbY3VydmVdIDogY3VydmU7XG4gICAgICAgIGlmIChkdXJhdGlvbiAhPSBudWxsKSAgIHRoaXMuX3F1ZXVlWzJdID0gZHVyYXRpb247XG4gICAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSAgIHRoaXMuX3F1ZXVlWzNdID0gY2FsbGJhY2s7XG4gICAgICAgIGlmIChtZXRob2QgIT0gbnVsbCkgICAgIHRoaXMuX3F1ZXVlWzRdID0gbWV0aG9kO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBVc2VkIGZvciBpbnRlcnBvbGF0aW5nIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgc3RhdGUgb2YgdGhlIGN1cnJlbnRseVxuICogcnVubmluZyB0cmFuc2l0aW9uXG4gKlxuICogQG1ldGhvZCAgX2ludGVycG9sYXRlXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheXxOdW1iZXJ9IG91dHB1dCAgICAgV2hlcmUgdG8gd3JpdGUgdG8gKGluIG9yZGVyIHRvIGF2b2lkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCBhbGxvY2F0aW9uIGFuZCB0aGVyZWZvcmUgR0MpLlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fE51bWJlcn0gZnJvbSAgICAgICBTdGFydCBzdGF0ZSBvZiBjdXJyZW50IHRyYW5zaXRpb24uXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl8TnVtYmVyfSB0byAgICAgICAgIEVuZCBzdGF0ZSBvZiBjdXJyZW50IHRyYW5zaXRpb24uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHByb2dyZXNzICAgICAgICAgICAgICAgIFByb2dyZXNzIG9mIHRoZSBjdXJyZW50IHRyYW5zaXRpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIFswLCAxXVxuICogQHBhcmFtICB7U3RyaW5nfSBtZXRob2QgICAgICAgICAgICAgICAgICBNZXRob2QgdXNlZCBmb3IgaW50ZXJwb2xhdGlvbiAoZS5nLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGVycClcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheXxOdW1iZXJ9ICAgICAgICAgICAgb3V0cHV0XG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5faW50ZXJwb2xhdGUgPSBmdW5jdGlvbiBfaW50ZXJwb2xhdGUob3V0cHV0LCBmcm9tLCB0bywgcHJvZ3Jlc3MsIG1ldGhvZCkge1xuICAgIGlmICh0byBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSAnc2xlcnAnKSB7XG4gICAgICAgICAgICB2YXIgeCwgeSwgeiwgdztcbiAgICAgICAgICAgIHZhciBxeCwgcXksIHF6LCBxdztcbiAgICAgICAgICAgIHZhciBvbWVnYSwgY29zb21lZ2EsIHNpbm9tZWdhLCBzY2FsZUZyb20sIHNjYWxlVG87XG5cbiAgICAgICAgICAgIHggPSBmcm9tWzBdO1xuICAgICAgICAgICAgeSA9IGZyb21bMV07XG4gICAgICAgICAgICB6ID0gZnJvbVsyXTtcbiAgICAgICAgICAgIHcgPSBmcm9tWzNdO1xuXG4gICAgICAgICAgICBxeCA9IHRvWzBdO1xuICAgICAgICAgICAgcXkgPSB0b1sxXTtcbiAgICAgICAgICAgIHF6ID0gdG9bMl07XG4gICAgICAgICAgICBxdyA9IHRvWzNdO1xuXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMF0gPSBxeDtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMV0gPSBxeTtcbiAgICAgICAgICAgICAgICBvdXRwdXRbMl0gPSBxejtcbiAgICAgICAgICAgICAgICBvdXRwdXRbM10gPSBxdztcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3NvbWVnYSA9IHcgKiBxdyArIHggKiBxeCArIHkgKiBxeSArIHogKiBxejtcbiAgICAgICAgICAgIGlmICgoMS4wIC0gY29zb21lZ2EpID4gMWUtNSkge1xuICAgICAgICAgICAgICAgIG9tZWdhID0gTWF0aC5hY29zKGNvc29tZWdhKTtcbiAgICAgICAgICAgICAgICBzaW5vbWVnYSA9IE1hdGguc2luKG9tZWdhKTtcbiAgICAgICAgICAgICAgICBzY2FsZUZyb20gPSBNYXRoLnNpbigoMS4wIC0gcHJvZ3Jlc3MpICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgICAgICAgICAgICAgc2NhbGVUbyA9IE1hdGguc2luKHByb2dyZXNzICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZyb20gPSAxLjAgLSBwcm9ncmVzcztcbiAgICAgICAgICAgICAgICBzY2FsZVRvID0gcHJvZ3Jlc3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dHB1dFswXSA9IHggKiBzY2FsZUZyb20gKyBxeCAqIHNjYWxlVG87XG4gICAgICAgICAgICBvdXRwdXRbMV0gPSB5ICogc2NhbGVGcm9tICsgcXkgKiBzY2FsZVRvO1xuICAgICAgICAgICAgb3V0cHV0WzJdID0geiAqIHNjYWxlRnJvbSArIHF6ICogc2NhbGVUbztcbiAgICAgICAgICAgIG91dHB1dFszXSA9IHcgKiBzY2FsZUZyb20gKyBxdyAqIHNjYWxlVG87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodG8gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRvLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldID0gdGhpcy5faW50ZXJwb2xhdGUob3V0cHV0W2ldLCBmcm9tW2ldLCB0b1tpXSwgcHJvZ3Jlc3MsIG1ldGhvZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdG8pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IHRoaXMuX2ludGVycG9sYXRlKG91dHB1dFtrZXldLCBmcm9tW2tleV0sIHRvW2tleV0sIHByb2dyZXNzLCBtZXRob2QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSBmcm9tICsgcHJvZ3Jlc3MgKiAodG8gLSBmcm9tKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuLyoqXG4gKiBJbnRlcm5hbCBoZWxwZXIgbWV0aG9kIHVzZWQgZm9yIHN5bmNocm9uaXppbmcgdGhlIGN1cnJlbnQsIGFic29sdXRlIHN0YXRlIG9mXG4gKiBhIHRyYW5zaXRpb24gdG8gYSBnaXZlbiBvdXRwdXQgYXJyYXksIG9iamVjdCBsaXRlcmFsIG9yIG51bWJlci4gU3VwcG9ydHNcbiAqIG5lc3RlZCBzdGF0ZSBvYmplY3RzIGJ5IHRocm91Z2ggcmVjdXJzaW9uLlxuICpcbiAqIEBtZXRob2QgIF9zeW5jXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEBwYXJhbSAge051bWJlcnxBcnJheXxPYmplY3R9IG91dHB1dCAgICAgV2hlcmUgdG8gd3JpdGUgdG8gKGluIG9yZGVyIHRvIGF2b2lkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCBhbGxvY2F0aW9uIGFuZCB0aGVyZWZvcmUgR0MpLlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5fE9iamVjdH0gaW5wdXQgICAgICBJbnB1dCBzdGF0ZSB0byBwcm94eSBvbnRvIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuXG4gKiBAcmV0dXJuIHtOdW1iZXJ8QXJyYXl8T2JqZWN0fSBvdXRwdXQgICAgIFBhc3NlZCBpbiBvdXRwdXQgb2JqZWN0LlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuX3N5bmMgPSBmdW5jdGlvbiBfc3luYyhvdXRwdXQsIGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIG91dHB1dCA9IGlucHV0O1xuICAgIGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgaWYgKG91dHB1dCA9PSBudWxsKSBvdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGlucHV0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBfc3luYyhvdXRwdXRbaV0sIGlucHV0W2ldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICBpZiAob3V0cHV0ID09IG51bGwpIG91dHB1dCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIG91dHB1dFtrZXldID0gX3N5bmMob3V0cHV0W2tleV0sIGlucHV0W2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEdldCBpbnRlcnBvbGF0ZWQgc3RhdGUgb2YgY3VycmVudCBhY3Rpb24gYXQgcHJvdmlkZWQgdGltZS4gSWYgdGhlIGxhc3RcbiAqICAgIGFjdGlvbiBoYXMgY29tcGxldGVkLCBpbnZva2UgaXRzIGNhbGxiYWNrLlxuICpcbiAqIEBtZXRob2QgZ2V0XG4gKlxuICogQHBhcmFtIHtOdW1iZXI9fSB0ICAgICAgICAgICAgICAgRXZhbHVhdGUgdGhlIGN1cnZlIGF0IGEgbm9ybWFsaXplZCB2ZXJzaW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiB0aGlzIHRpbWUuIElmIG9taXR0ZWQsIHVzZSBjdXJyZW50IHRpbWVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChVbml4IGVwb2NoIHRpbWUgcmV0cmlldmVkIGZyb20gQ2xvY2spLlxuICogQHJldHVybiB7TnVtYmVyfEFycmF5Lk51bWJlcn0gICAgQmVnaW5uaW5nIHN0YXRlIGludGVycG9sYXRlZCB0byB0aGlzIHBvaW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aW1lLlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0KHQpIHtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5fc3RhdGU7XG5cbiAgICB0ID0gdGhpcy5fcGF1c2VkQXQgPyB0aGlzLl9wYXVzZWRBdCA6IHQ7XG4gICAgdCA9IHQgPyB0IDogcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSAodCAtIHRoaXMuX3N0YXJ0ZWRBdCkgLyB0aGlzLl9xdWV1ZVsyXTtcbiAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuX2ludGVycG9sYXRlKFxuICAgICAgICB0aGlzLl9zdGF0ZSxcbiAgICAgICAgdGhpcy5fZnJvbSxcbiAgICAgICAgdGhpcy5fcXVldWVbMF0sXG4gICAgICAgIHRoaXMuX3F1ZXVlWzFdKHByb2dyZXNzID4gMSA/IDEgOiBwcm9ncmVzcyksXG4gICAgICAgIHRoaXMuX3F1ZXVlWzRdXG4gICAgKTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9zdGF0ZTtcbiAgICBpZiAocHJvZ3Jlc3MgPj0gMSkge1xuICAgICAgICB0aGlzLl9zdGFydGVkQXQgPSB0aGlzLl9zdGFydGVkQXQgKyB0aGlzLl9xdWV1ZVsyXTtcbiAgICAgICAgdGhpcy5fZnJvbSA9IHRoaXMuX3N5bmModGhpcy5fZnJvbSwgdGhpcy5fc3RhdGUpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9ncmVzcyA+IDEgPyB0aGlzLmdldCgpIDogc3RhdGU7XG59O1xuXG4vKipcbiAqIElzIHRoZXJlIGF0IGxlYXN0IG9uZSB0cmFuc2l0aW9uIHBlbmRpbmcgY29tcGxldGlvbj9cbiAqXG4gKiBAbWV0aG9kIGlzQWN0aXZlXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIHBlbmRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24uIFBhdXNlZCB0cmFuc2l0aW9ucyBhcmUgc3RpbGwgYmVpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgIGNvbnNpZGVyZWQgYWN0aXZlLlxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaXNBY3RpdmUgPSBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWUubGVuZ3RoID4gMDtcbn07XG5cbi8qKlxuICogSGFsdCB0cmFuc2l0aW9uIGF0IGN1cnJlbnQgc3RhdGUgYW5kIGVyYXNlIGFsbCBwZW5kaW5nIGFjdGlvbnMuXG4gKlxuICogQG1ldGhvZCBoYWx0XG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9IHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmhhbHQgPSBmdW5jdGlvbiBoYWx0KCkge1xuICAgIHJldHVybiB0aGlzLmZyb20odGhpcy5nZXQoKSk7XG59O1xuXG4vKipcbiAqIFBhdXNlIHRyYW5zaXRpb24uIFRoaXMgd2lsbCBub3QgZXJhc2UgYW55IGFjdGlvbnMuXG4gKlxuICogQG1ldGhvZCBwYXVzZVxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEhhcyB0aGUgY3VycmVudCBhY3Rpb24gYmVlbiBwYXVzZWQ/XG4gKlxuICogQG1ldGhvZCBpc1BhdXNlZFxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIHRoZSBjdXJyZW50IGFjdGlvbiBoYXMgYmVlbiBwYXVzZWRcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmlzUGF1c2VkID0gZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fcGF1c2VkQXQ7XG59O1xuXG4vKipcbiAqIFJlc3VtZSBhIHByZXZpb3VzbHkgcGF1c2VkIHRyYW5zaXRpb24uXG4gKlxuICogQG1ldGhvZCByZXN1bWVcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gcmVzdW1lKCkge1xuICAgIHZhciBkaWZmID0gdGhpcy5fcGF1c2VkQXQgLSB0aGlzLl9zdGFydGVkQXQ7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCkgLSBkaWZmO1xuICAgIHRoaXMuX3BhdXNlZEF0ID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2FuY2VsIGFsbCB0cmFuc2l0aW9ucyBhbmQgcmVzZXQgdG8gYSBzdGFibGUgc3RhdGVcbiAqXG4gKiBAbWV0aG9kIHJlc2V0XG4gKiBAY2hhaW5hYmxlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYC5mcm9tYCBpbnN0ZWFkIVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5Lk51bWJlcnxPYmplY3QuPG51bWJlciwgbnVtYmVyPn0gc3RhcnRcbiAqICAgIHN0YWJsZSBzdGF0ZSB0byBzZXQgdG9cbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHJldHVybiB0aGlzLmZyb20oc3RhcnQpO1xufTtcblxuLyoqXG4gKiBBZGQgdHJhbnNpdGlvbiB0byBlbmQgc3RhdGUgdG8gdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdHJhbnNpdGlvbnMuIFNwZWNpYWxcbiAqICAgIFVzZTogY2FsbGluZyB3aXRob3V0IGEgdHJhbnNpdGlvbiByZXNldHMgdGhlIG9iamVjdCB0byB0aGF0IHN0YXRlIHdpdGhcbiAqICAgIG5vIHBlbmRpbmcgYWN0aW9uc1xuICpcbiAqIEBtZXRob2Qgc2V0XG4gKiBAY2hhaW5hYmxlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYC50b2AgaW5zdGVhZCFcbiAqXG4gKiBAcGFyYW0ge051bWJlcnxGYW1vdXNFbmdpbmVNYXRyaXh8QXJyYXkuTnVtYmVyfE9iamVjdC48bnVtYmVyLCBudW1iZXI+fSBzdGF0ZVxuICogICAgZW5kIHN0YXRlIHRvIHdoaWNoIHdlIGludGVycG9sYXRlXG4gKiBAcGFyYW0ge3RyYW5zaXRpb249fSB0cmFuc2l0aW9uIG9iamVjdCBvZiB0eXBlIHtkdXJhdGlvbjogbnVtYmVyLCBjdXJ2ZTpcbiAqICAgIGZbMCwxXSAtPiBbMCwxXSBvciBuYW1lfS4gSWYgdHJhbnNpdGlvbiBpcyBvbWl0dGVkLCBjaGFuZ2Ugd2lsbCBiZVxuICogICAgaW5zdGFudGFuZW91cy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKT19IGNhbGxiYWNrIFplcm8tYXJndW1lbnQgZnVuY3Rpb24gdG8gY2FsbCBvbiBvYnNlcnZlZFxuICogICAgY29tcGxldGlvbiAodD0xKVxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9IHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHN0YXRlLCB0cmFuc2l0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0cmFuc2l0aW9uID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5mcm9tKHN0YXRlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy50byhzdGF0ZSwgdHJhbnNpdGlvbi5jdXJ2ZSwgdHJhbnNpdGlvbi5kdXJhdGlvbiwgY2FsbGJhY2ssIHRyYW5zaXRpb24ubWV0aG9kKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNpdGlvbmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDdXJ2ZXM6IHJlcXVpcmUoJy4vQ3VydmVzJyksXG4gICAgVHJhbnNpdGlvbmFibGU6IHJlcXVpcmUoJy4vVHJhbnNpdGlvbmFibGUnKVxufTtcbiJdfQ==
