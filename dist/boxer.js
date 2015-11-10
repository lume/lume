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
    this._node = node;
    this.elem = elem ? elem : document.createElement('div');

    var container = container ? container : document.body;

    this.elem.dataset.node = this.node;
    this.elem.classList.add(this.node);
    this.elem.classList.add('node');
    container.appendChild(this.elem);

    Object.observe(this._node, function(changes){
        this.transform(this._node);
    }.bind(this));

    var prefix = function () {
      var styles = window.getComputedStyle(document.documentElement, ''),
        transform,
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        if(dom ==='Moz'){
          transform = 'transform';
        } else if(dom ==='WebKit'){
          transform = 'webkitTransform';
        } else if(dom ==='MS'){
          transform = 'msTransform';
        } else if (dom ==='O'){
          transform = 'OTransform';
        } else {
          transform = 'transform';
        }
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1),
        transform: transform
      };
    };
    //
    this.vendor = prefix();

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
  this.elem.style[this.vendor.transform]= matrix.toString();

  if(node.opacity) {
    this.elem.style.opacity = node.opacity;
  }
  // if(node.position) {
  //   this.elem.style.position = node.position;
  // }
  if(node.size) {
    this.elem.style.width = node.size[0]+'px';
    this.elem.style.height = node.size[1]+'px';
  }
  if(node.origin) {
    //this.elem.style.transformOrigin = node.origin[0]+'%,'+node.origin[1]+'%';//','+node.origin[2]+'%';
  }
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

    this.time = 0;
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
    this.observe(this.id+'-'+conf.t, n.transitionables[conf.t].transition.get());
    //console.log(conf.t, this[conf.t], n.transitionables[conf.t].transition.get());
    //TODO: figure out a better way to update Transitionable
    //TODO: unobserve object, clearInerval


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

              //console.log(change.object);
              if(change.object.constructor.name === 'Array'){

                //n[change.object.param] = change.object;
                //console.log(change);
                n.parent.update({
                              message:{
                                prop: 'rotate',
                                val: change.object
                              },
                              node: n.id
                            });
              }
              else if(change.object.constructor.name === 'Transitionable'){
                n[change.object.param] = change.oldValue;
              } else {
                // console.log({
                //               message:{
                //                 prop: change.name,
                //                 val: change.oldValue
                //               },
                //               node: n.id
                //             });
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

Node.prototype.update = function(frame){
  for(var id in this.transitionables) {
    this.transitionables[id].transition.get();
  }
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

Scene.prototype.tick = function(frame){
  for(var node in this.graph) {
    this.graph[node].update(frame);
  }
}

Scene.prototype.update = function(change){
  cxt.postMessage(JSON.parse(JSON.stringify(change)));
}

module.exports = new Scene();

},{}],14:[function(require,module,exports){
/*
  Tested against Chromium build with Object.observe and acts EXACTLY the same,
  though Chromium build is MUCH faster

  Trying to stay as close to the spec as possible,
  this is a work in progress, feel free to comment/update

  Specification:
    http://wiki.ecmascript.org/doku.php?id=harmony:observe

  Built using parts of:
    https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js

  Limits so far;
    Built using polling... Will update again with polling/getter&setters to make things better at some point

TODO:
  Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
*/
if(!Object.observe){
  (function(extend, global){
    "use strict";
    var isCallable = (function(toString){
        var s = toString.call(toString),
            u = typeof u;
        return typeof global.alert === "object" ?
          function isCallable(f){
            return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
          }:
          function isCallable(f){
            return s === toString.call(f);
          }
        ;
    })(extend.prototype.toString);
    // isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM node
    var isNode = function isNode(o){
      return (
        typeof Node === "object" ? o instanceof Node :
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
      );
    }
    //Returns true if it is a DOM element
    var isElement = function isElement(o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
    }
    var _isImmediateSupported = (function(){
      return !!global.setImmediate;
    })();
    var _doCheckCallback = (function(){
      if(_isImmediateSupported){
        return function _doCheckCallback(f){
          return setImmediate(f);
        };
      }else{
        return function _doCheckCallback(f){
          return setTimeout(f, 10);
        };
      }
    })();
    var _clearCheckCallback = (function(){
      if(_isImmediateSupported){
        return function _clearCheckCallback(id){
          clearImmediate(id);
        };
      }else{
        return function _clearCheckCallback(id){
          clearTimeout(id);
        };
      }
    })();
    var isNumeric=function isNumeric(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var sameValue = function sameValue(x, y){
      if(x===y){
        return x !== 0 || 1 / x === 1 / y;
      }
      return x !== x && y !== y;
    };
    var isAccessorDescriptor = function isAccessorDescriptor(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('get' in desc || 'set' in desc);
    };
    var isDataDescriptor = function isDataDescriptor(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('value' in desc || 'writable' in desc);
    };

    var validateArguments = function validateArguments(O, callback, accept){
      if(typeof(O)!=='object'){
        // Throw Error
        throw new TypeError("Object.observeObject called on non-object");
      }
      if(isCallable(callback)===false){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting function");
      }
      if(Object.isFrozen(callback)===true){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting unfrozen function");
      }
      if (accept !== undefined) {
        if (!Array.isArray(accept)) {
          throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array");
        }
      }
    };

    var Observer = (function Observer(){
      var wraped = [];
      var Observer = function Observer(O, callback, accept){
        validateArguments(O, callback, accept);
        if (!accept) {
          accept = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];
        }
        Object.getNotifier(O).addListener(callback, accept);
        if(wraped.indexOf(O)===-1){
          wraped.push(O);
        }else{
          Object.getNotifier(O)._checkPropertyListing();
        }
      };

      Observer.prototype.deliverChangeRecords = function Observer_deliverChangeRecords(O){
        Object.getNotifier(O).deliverChangeRecords();
      };

      wraped.lastScanned = 0;
      var f = (function f(wrapped){
              return function _f(){
                var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
                for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
                  if(_indexes.indexOf(wrapped[i]) > -1){
                    Object.getNotifier(wrapped[i])._checkPropertyListing();
                    takingTooLong=((new Date())-startTime)>100; // make sure we don't take more than 100 milliseconds to scan all objects
                  }else{
                    wrapped.splice(i, 1);
                    i--;
                    l--;
                  }
                }
                wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
                _doCheckCallback(_f);
              };
            })(wraped);
      _doCheckCallback(f);
      return Observer;
    })();

    var Notifier = function Notifier(watching){
    var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
      var self = this;
      Object.defineProperty(self, '_watching', {
                  enumerable: true,
                  get: (function(watched){
                    return function(){
                      return watched;
                    };
                  })(watching)
                });
      var wrapProperty = function wrapProperty(object, prop){
        var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor(object, prop);
        if((prop==='getNotifier')||isAccessorDescriptor(descriptor)||(!descriptor.enumerable)){
          return false;
        }
        if((object instanceof Array)&&isNumeric(prop)){
          var idx = properties.length;
          properties[idx] = prop;
          values[idx] = object[prop];
          return true;
        }
        (function(idx, prop){
          properties[idx] = prop;
          values[idx] = object[prop];
          function getter(){
            return values[getter.info.idx];
          }
          function setter(value){
            if(!sameValue(values[setter.info.idx], value)){
              Object.getNotifier(object).queueUpdate(object, prop, 'update', values[setter.info.idx]);
              values[setter.info.idx] = value;
            }
          }
          getter.info = setter.info = {
            idx: idx
          };
          Object.defineProperty(object, prop, {
            get: getter,
            set: setter
          });
        })(properties.length, prop);
        return true;
      };
      self._checkPropertyListing = function _checkPropertyListing(dontQueueUpdates){
        var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
        var newKeys = [], oldKeys = properties.slice(0), updates = [];
        var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

        if(object instanceof Array){
          aLength = self._oldLength;//object.length;
          //aLength = object.length;
        }

        for(i=0; i<l; i++){
          prop = keys[i];
          value = object[prop];
          propType = typeof(value);
          if((idx = properties.indexOf(prop))===-1){
            if(wrapProperty(object, prop)&&queueUpdates){
              self.queueUpdate(object, prop, 'add', null, object[prop]);
            }
          }else{
            if(!(object instanceof Array)||(isNumeric(prop))){
              if(values[idx] !== value){
                if(queueUpdates){
                  self.queueUpdate(object, prop, 'update', values[idx], value);
                }
                values[idx] = value;
              }
            }
            oldKeys.splice(oldKeys.indexOf(prop), 1);
          }
        }

        if(object instanceof Array && object.length !== aLength){
          if(queueUpdates){
            self.queueUpdate(object, 'length', 'update', aLength, object);
          }
          self._oldLength = object.length;
        }

        if(queueUpdates){
          l = oldKeys.length;
          for(i=0; i<l; i++){
            idx = properties.indexOf(oldKeys[i]);
            self.queueUpdate(object, oldKeys[i], 'delete', values[idx]);
            properties.splice(idx,1);
            values.splice(idx,1);
            for(var i=idx;i<properties.length;i++){
              if(!(properties[i] in object))
                continue;
              var getter = Object.getOwnPropertyDescriptor(object,properties[i]).get;
              if(!getter)
                continue;
              var info = getter.info;
              info.idx = i;
            }
          };
        }
      };
      self.addListener = function Notifier_addListener(callback, accept){
        var idx = _listeners.indexOf(callback);
        if(idx===-1){
          _listeners.push(callback);
          _acceptLists.push(accept);
        }
        else {
          _acceptLists[idx] = accept;
        }
      };
      self.removeListener = function Notifier_removeListener(callback){
        var idx = _listeners.indexOf(callback);
        if(idx>-1){
          _listeners.splice(idx, 1);
          _acceptLists.splice(idx, 1);
        }
      };
      self.listeners = function Notifier_listeners(){
        return _listeners;
      };
      self.queueUpdate = function Notifier_queueUpdate(what, prop, type, was){
        this.queueUpdates([{
          type: type,
          object: what,
          name: prop,
          oldValue: was
        }]);
      };
      self.queueUpdates = function Notifier_queueUpdates(updates){
        var self = this, i = 0, l = updates.length||0, update;
        for(i=0; i<l; i++){
          update = updates[i];
          _updates.push(update);
        }
        if(_updater){
          _clearCheckCallback(_updater);
        }
        _updater = _doCheckCallback(function(){
          _updater = false;
          self.deliverChangeRecords();
        });
      };
      self.deliverChangeRecords = function Notifier_deliverChangeRecords(){
        var i = 0, l = _listeners.length,
            //keepRunning = true, removed as it seems the actual implementation doesn't do this
            // In response to BUG #5
            retval;
        for(i=0; i<l; i++){
          if(_listeners[i]){
            var currentUpdates;
            if (_acceptLists[i]) {
              currentUpdates = [];
              for (var j = 0, updatesLength = _updates.length; j < updatesLength; j++) {
                if (_acceptLists[i].indexOf(_updates[j].type) !== -1) {
                  currentUpdates.push(_updates[j]);
                }
              }
            }
            else {
              currentUpdates = _updates;
            }
            if (currentUpdates.length) {
              if(_listeners[i]===console.log){
                console.log(currentUpdates);
              }else{
                _listeners[i](currentUpdates);
              }
            }
          }
        }
        _updates=[];
      };
      self.notify = function Notifier_notify(changeRecord) {
        if (typeof changeRecord !== "object" || typeof changeRecord.type !== "string") {
          throw new TypeError("Invalid changeRecord with non-string 'type' property");
        }
        changeRecord.object = watching;
        self.queueUpdates([changeRecord]);
      };
      self._checkPropertyListing(true);
    };

    var _notifiers=[], _indexes=[];
    extend.getNotifier = function Object_getNotifier(O){
    var idx = _indexes.indexOf(O), notifier = idx>-1?_notifiers[idx]:false;
      if(!notifier){
        idx = _indexes.length;
        _indexes[idx] = O;
        notifier = _notifiers[idx] = new Notifier(O);
      }
      return notifier;
    };
    extend.observe = function Object_observe(O, callback, accept){
      // For Bug 4, can't observe DOM elements tested against canry implementation and matches
      if(!isElement(O)){
        return new Observer(O, callback, accept);
      }
    };
    extend.unobserve = function Object_unobserve(O, callback){
      validateArguments(O, callback);
      var idx = _indexes.indexOf(O),
          notifier = idx>-1?_notifiers[idx]:false;
      if (!notifier){
        return;
      }
      notifier.removeListener(callback);
      if (notifier.listeners().length === 0){
        _indexes.splice(idx, 1);
        _notifiers.splice(idx, 1);
      }
    };
  })(Object, this);
}

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hjc3NtYXRyaXgvbGliL1ZlY3RvcjQuanMiLCJub2RlX21vZHVsZXMveGNzc21hdHJpeC9saWIvWENTU01hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2xpYi91dGlscy9hbmdsZS5qcyIsIm5vZGVfbW9kdWxlcy94Y3NzbWF0cml4L2xpYi91dGlscy9jc3NUcmFuc2Zvcm1TdHJpbmcuanMiLCJub2RlX21vZHVsZXMveGNzc21hdHJpeC9saWIvdXRpbHMvbWF0cml4LmpzIiwibm9kZV9tb2R1bGVzL3hjc3NtYXRyaXgvbGliL3V0aWxzL3ZlY3Rvci5qcyIsInNyYy9jb21wb25lbnRzL0NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL0RPTUNvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2NvcmUvRW5naW5lLmpzIiwic3JjL2NvcmUvTm9kZS5qcyIsInNyYy9jb3JlL1NjZW5lLmpzIiwic3JjL2NvcmUvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF0aC9NYXQzMy5qcyIsInNyYy9tYXRoL1F1YXRlcm5pb24uanMiLCJzcmMvbWF0aC9SYXkuanMiLCJzcmMvbWF0aC9WZWMyLmpzIiwic3JjL21hdGgvVmVjMy5qcyIsInNyYy9tYXRoL2luZGV4LmpzIiwic3JjL3RyYW5zaXRpb25zL0N1cnZlcy5qcyIsInNyYy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uYWJsZS5qcyIsInNyYy90cmFuc2l0aW9ucy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFhDU1NNYXRyaXggPSByZXF1aXJlKCcuL2xpYi9YQ1NTTWF0cml4LmpzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IFhDU1NNYXRyaXg7XG4iLCJ2YXIgdmVjdG9yID0gcmVxdWlyZSgnLi91dGlscy92ZWN0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yNDtcblxuLyoqXG4gKiBBIDQgZGltZW5zaW9uYWwgdmVjdG9yXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVmVjdG9yNCh4LCB5LCB6LCB3KSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG4gIHRoaXMueiA9IHo7XG4gIHRoaXMudyA9IHc7XG4gIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbn1cblxuLyoqXG4gKiBFbnN1cmUgdGhhdCB2YWx1ZXMgYXJlIG5vdCB1bmRlZmluZWRcbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIG51bGxcbiAqL1xuXG5WZWN0b3I0LnByb3RvdHlwZS5jaGVja1ZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnggPSB0aGlzLnggfHwgMDtcbiAgdGhpcy55ID0gdGhpcy55IHx8IDA7XG4gIHRoaXMueiA9IHRoaXMueiB8fCAwO1xuICB0aGlzLncgPSB0aGlzLncgfHwgMDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3RvclxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge2Zsb2F0fVxuICovXG5cblZlY3RvcjQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNoZWNrVmFsdWVzKCk7XG4gIHJldHVybiB2ZWN0b3IubGVuZ3RoKHRoaXMpO1xufTtcblxuXG4vKipcbiAqIEdldCBhIG5vcm1hbGlzZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge1ZlY3RvcjR9XG4gKi9cblxuVmVjdG9yNC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB2ZWN0b3Iubm9ybWFsaXplKHRoaXMpO1xufTtcblxuXG4vKipcbiAqIFZlY3RvciBEb3QtUHJvZHVjdFxuICogQHBhcmFtIHtWZWN0b3I0fSB2IFRoZSBzZWNvbmQgdmVjdG9yIHRvIGFwcGx5IHRoZSBwcm9kdWN0IHRvXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyB7ZmxvYXR9IFRoZSBEb3QtUHJvZHVjdCBvZiB0aGlzIGFuZCB2LlxuICovXG5cblZlY3RvcjQucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHZlY3Rvci5kb3QodGhpcywgdik7XG59O1xuXG5cbi8qKlxuICogVmVjdG9yIENyb3NzLVByb2R1Y3RcbiAqIEBwYXJhbSB7VmVjdG9yNH0gdiBUaGUgc2Vjb25kIHZlY3RvciB0byBhcHBseSB0aGUgcHJvZHVjdCB0b1xuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge1ZlY3RvcjR9IFRoZSBDcm9zcy1Qcm9kdWN0IG9mIHRoaXMgYW5kIHYuXG4gKi9cblxuVmVjdG9yNC5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB2ZWN0b3IuY3Jvc3ModGhpcywgdik7XG59O1xuXG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHJlcXVpcmVkIGZvciBtYXRyaXggZGVjb21wb3NpdGlvblxuICogQSBKYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHBzZXVkbyBjb2RlIGF2YWlsYWJsZSBmcm9tIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtMmQtdHJhbnNmb3Jtcy8jbWF0cml4LWRlY29tcG9zaXRpb25cbiAqIEBwYXJhbSB7VmVjdG9yNH0gYVBvaW50IEEgM0QgcG9pbnRcbiAqIEBwYXJhbSB7ZmxvYXR9IGFzY2xcbiAqIEBwYXJhbSB7ZmxvYXR9IGJzY2xcbiAqIEBhdXRob3IgSm9lIExhbWJlcnRcbiAqIEByZXR1cm5zIHtWZWN0b3I0fVxuICovXG5cblZlY3RvcjQucHJvdG90eXBlLmNvbWJpbmUgPSBmdW5jdGlvbihiUG9pbnQsIGFzY2wsIGJzY2wpIHtcbiAgcmV0dXJuIHZlY3Rvci5jb21iaW5lKHRoaXMsIGJQb2ludCwgYXNjbCwgYnNjbCk7XG59O1xuXG5WZWN0b3I0LnByb3RvdHlwZS5tdWx0aXBseUJ5TWF0cml4ID0gZnVuY3Rpb24gKG1hdHJpeCkge1xuICByZXR1cm4gdmVjdG9yLm11bHRpcGx5QnlNYXRyaXgodGhpcywgbWF0cml4KTtcbn07XG4iLCJ2YXIgdXRpbHMgPSB7XG4gICAgYW5nbGVzOiByZXF1aXJlKCcuL3V0aWxzL2FuZ2xlJyksXG4gICAgbWF0cml4OiByZXF1aXJlKCcuL3V0aWxzL21hdHJpeCcpLFxuICAgIHRyYW5zcDogcmVxdWlyZSgnLi91dGlscy9jc3NUcmFuc2Zvcm1TdHJpbmcnKSxcbiAgICBmdW5jczoge1xuICAgICAgICAvLyBHaXZlbiBhIGZ1bmN0aW9uIGBmbmAsIHJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIGNhbGxzIGBmbmAgd2l0aCBvbmx5IDFcbiAgICAgICAgLy8gICBhcmd1bWVudCwgbm8gbWF0dGVyIGhvdyBtYW55IGFyZSBnaXZlbi5cbiAgICAgICAgLy8gTW9zdCB1c2VmdWwgd2hlcmUgeW91IG9ubHkgd2FudCB0aGUgZmlyc3QgdmFsdWUgZnJvbSBhIG1hcC9mb3JlYWNoL2V0Y1xuICAgICAgICBvbmx5Rmlyc3RBcmc6IGZ1bmN0aW9uIChmbiwgY29udGV4dCkge1xuICAgICAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwgdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmaXJzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKGNvbnRleHQsIGZpcnN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8qKlxuICogIEdpdmVuIGEgQ1NTIHRyYW5zZm9ybSBzdHJpbmcgKGxpa2UgYHJvdGF0ZSgzcmFkKWAsIG9yXG4gKiAgICBgbWF0cml4KDEsIDAsIDAsIDAsIDEsIDApYCksIHJldHVybiBhbiBpbnN0YW5jZSBjb21wYXRpYmxlIHdpdGhcbiAqICAgIFtgV2ViS2l0Q1NTTWF0cml4YF0oaHR0cDovL2RldmVsb3Blci5hcHBsZS5jb20vbGlicmFyeS9zYWZhcmkvZG9jdW1lbnRhdGlvbi9BdWRpb1ZpZGVvL1JlZmVyZW5jZS9XZWJLaXRDU1NNYXRyaXhDbGFzc1JlZmVyZW5jZS9XZWJLaXRDU1NNYXRyaXgvV2ViS2l0Q1NTTWF0cml4Lmh0bWwpXG4gKiAgQGNvbnN0cnVjdG9yXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGRvbXN0ciAtIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgMkQgb3IgM0QgdHJhbnNmb3JtIG1hdHJpeFxuICogICAgaW4gdGhlIGZvcm0gZ2l2ZW4gYnkgdGhlIENTUyB0cmFuc2Zvcm0gcHJvcGVydHksIGkuZS4ganVzdCBsaWtlIHRoZVxuICogICAgb3V0cHV0IGZyb20gW1tAbGluayN0b1N0cmluZ11dLlxuICogIEBtZW1iZXIge251bWJlcn0gYSAtIFRoZSBmaXJzdCAyRCB2ZWN0b3IgdmFsdWUuXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBiIC0gVGhlIHNlY29uZCAyRCB2ZWN0b3IgdmFsdWUuXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBjIC0gVGhlIHRoaXJkIDJEIHZlY3RvciB2YWx1ZS5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IGQgLSBUaGUgZm91cnRoIDJEIHZlY3RvciB2YWx1ZS5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IGUgLSBUaGUgZmlmdGggMkQgdmVjdG9yIHZhbHVlLlxuICogIEBtZW1iZXIge251bWJlcn0gZiAtIFRoZSBzaXh0aCAyRCB2ZWN0b3IgdmFsdWUuXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMTEgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSBmaXJzdCByb3cgYW5kIGZpcnN0IGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0xMiAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZpcnN0IHJvdyBhbmQgc2Vjb25kIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0xMyAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZpcnN0IHJvdyBhbmQgdGhpcmQgY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTE0IC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgZmlyc3Qgcm93IGFuZCBmb3VydGggY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTIxIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgc2Vjb25kIHJvdyBhbmQgZmlyc3QgY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTIyIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgc2Vjb25kIHJvdyBhbmQgc2Vjb25kIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0yMyAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHNlY29uZCByb3cgYW5kIHRoaXJkIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0yNCAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHNlY29uZCByb3cgYW5kIGZvdXJ0aCBjb2x1bW4uXG4gKiAgQG1lbWJlciB7bnVtYmVyfSBtMzEgLSBUaGUgM0QgbWF0cml4IHZhbHVlIGluIHRoZSB0aGlyZCByb3cgYW5kIGZpcnN0IGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0zMiAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHRoaXJkIHJvdyBhbmQgc2Vjb25kIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG0zMyAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIHRoaXJkIHJvdyBhbmQgdGhpcmQgY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTM0IC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgdGhpcmQgcm93IGFuZCBmb3VydGggY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTQxIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgZm91cnRoIHJvdyBhbmQgZmlyc3QgY29sdW1uLlxuICogIEBtZW1iZXIge251bWJlcn0gbTQyIC0gVGhlIDNEIG1hdHJpeCB2YWx1ZSBpbiB0aGUgZm91cnRoIHJvdyBhbmQgc2Vjb25kIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG00MyAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZvdXJ0aCByb3cgYW5kIHRoaXJkIGNvbHVtbi5cbiAqICBAbWVtYmVyIHtudW1iZXJ9IG00NCAtIFRoZSAzRCBtYXRyaXggdmFsdWUgaW4gdGhlIGZvdXJ0aCByb3cgYW5kIGZvdXJ0aCBjb2x1bW4uXG4gKiAgQHJldHVybnMge1hDU1NNYXRyaXh9IG1hdHJpeFxuICovXG5mdW5jdGlvbiBYQ1NTTWF0cml4KGRvbXN0cikge1xuICAgIHRoaXMubTExID0gdGhpcy5tMjIgPSB0aGlzLm0zMyA9IHRoaXMubTQ0ID0gMTtcblxuICAgICAgICAgICAgICAgdGhpcy5tMTIgPSB0aGlzLm0xMyA9IHRoaXMubTE0ID1cbiAgICB0aGlzLm0yMSA9ICAgICAgICAgICAgdGhpcy5tMjMgPSB0aGlzLm0yNCA9XG4gICAgdGhpcy5tMzEgPSB0aGlzLm0zMiA9ICAgICAgICAgICAgdGhpcy5tMzQgPVxuICAgIHRoaXMubTQxID0gdGhpcy5tNDIgPSB0aGlzLm00MyAgICAgICAgICAgID0gMDtcblxuICAgIGlmICh0eXBlb2YgZG9tc3RyID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnNldE1hdHJpeFZhbHVlKGRvbXN0cik7XG4gICAgfVxufVxuXG4vKipcbiAqICBYQ1NTTWF0cml4LmRpc3BsYXlOYW1lID0gJ1hDU1NNYXRyaXgnXG4gKi9cblhDU1NNYXRyaXguZGlzcGxheU5hbWUgPSAnWENTU01hdHJpeCc7XG5cbnZhciBwb2ludHMyZCA9IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnXTtcbnZhciBwb2ludHMzZCA9IFtcbiAgICAnbTExJywgJ20xMicsICdtMTMnLCAnbTE0JyxcbiAgICAnbTIxJywgJ20yMicsICdtMjMnLCAnbTI0JyxcbiAgICAnbTMxJywgJ20zMicsICdtMzMnLCAnbTM0JyxcbiAgICAnbTQxJywgJ200MicsICdtNDMnLCAnbTQ0J1xuXTtcblxuKFtcbiAgICBbJ20xMScsICdhJ10sXG4gICAgWydtMTInLCAnYiddLFxuICAgIFsnbTIxJywgJ2MnXSxcbiAgICBbJ20yMicsICdkJ10sXG4gICAgWydtNDEnLCAnZSddLFxuICAgIFsnbTQyJywgJ2YnXVxuXSkuZm9yRWFjaChmdW5jdGlvbiAocGFpcikge1xuICAgIHZhciBrZXkzZCA9IHBhaXJbMF0sIGtleTJkID0gcGFpclsxXTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShYQ1NTTWF0cml4LnByb3RvdHlwZSwga2V5MmQsIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICB0aGlzW2tleTNkXSA9IHZhbDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW2tleTNkXTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZSA6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgICB9KTtcbn0pO1xuXG5cbi8qKlxuICogIE11bHRpcGx5IG9uZSBtYXRyaXggYnkgYW5vdGhlclxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHBhcmFtIHtYQ1NTTWF0cml4fSBvdGhlck1hdHJpeCAtIFRoZSBtYXRyaXggdG8gbXVsdGlwbHkgdGhpcyBvbmUgYnkuXG4gKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gKG90aGVyTWF0cml4KSB7XG4gICAgcmV0dXJuIHV0aWxzLm1hdHJpeC5tdWx0aXBseSh0aGlzLCBvdGhlck1hdHJpeCk7XG59O1xuXG4vKipcbiAqICBJZiB0aGUgbWF0cml4IGlzIGludmVydGlibGUsIHJldHVybnMgaXRzIGludmVyc2UsIG90aGVyd2lzZSByZXR1cm5zIG51bGwuXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJcbiAqICBAcmV0dXJucyB7WENTU01hdHJpeHxudWxsfVxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1dGlscy5tYXRyaXguaW52ZXJzZSh0aGlzKTtcbn07XG5cbi8qKlxuICogIFJldHVybnMgdGhlIHJlc3VsdCBvZiByb3RhdGluZyB0aGUgbWF0cml4IGJ5IGEgZ2l2ZW4gdmVjdG9yLlxuICpcbiAqICBJZiBvbmx5IHRoZSBmaXJzdCBhcmd1bWVudCBpcyBwcm92aWRlZCwgdGhlIG1hdHJpeCBpcyBvbmx5IHJvdGF0ZWQgYWJvdXRcbiAqICB0aGUgeiBheGlzLlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFggLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB4IGF4aXMuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFkgLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB5IGF4aXMuIElmIHVuZGVmaW5lZCwgdGhlIHggY29tcG9uZW50IGlzIHVzZWQuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHJvdFogLSBUaGUgcm90YXRpb24gYXJvdW5kIHRoZSB6IGF4aXMuIElmIHVuZGVmaW5lZCwgdGhlIHggY29tcG9uZW50IGlzIHVzZWQuXG4gKiAgQHJldHVybnMgWENTU01hdHJpeFxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAocngsIHJ5LCByeikge1xuXG4gICAgaWYgKHR5cGVvZiByeCAhPT0gJ251bWJlcicgfHwgaXNOYU4ocngpKSByeCA9IDA7XG5cbiAgICBpZiAoKHR5cGVvZiByeSAhPT0gJ251bWJlcicgfHwgaXNOYU4ocnkpKSAmJlxuICAgICAgICAodHlwZW9mIHJ6ICE9PSAnbnVtYmVyJyB8fCBpc05hTihyeikpKSB7XG4gICAgICAgIHJ6ID0gcng7XG4gICAgICAgIHJ4ID0gMDtcbiAgICAgICAgcnkgPSAwO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcnkgIT09ICdudW1iZXInIHx8IGlzTmFOKHJ5KSkgcnkgPSAwO1xuICAgIGlmICh0eXBlb2YgcnogIT09ICdudW1iZXInIHx8IGlzTmFOKHJ6KSkgcnogPSAwO1xuXG4gICAgcnggPSB1dGlscy5hbmdsZXMuZGVnMnJhZChyeCk7XG4gICAgcnkgPSB1dGlscy5hbmdsZXMuZGVnMnJhZChyeSk7XG4gICAgcnogPSB1dGlscy5hbmdsZXMuZGVnMnJhZChyeik7XG5cbiAgICB2YXIgdHggPSBuZXcgWENTU01hdHJpeCgpLFxuICAgICAgICB0eSA9IG5ldyBYQ1NTTWF0cml4KCksXG4gICAgICAgIHR6ID0gbmV3IFhDU1NNYXRyaXgoKSxcbiAgICAgICAgc2luQSwgY29zQSwgc3E7XG5cbiAgICByeiAvPSAyO1xuICAgIHNpbkEgID0gTWF0aC5zaW4ocnopO1xuICAgIGNvc0EgID0gTWF0aC5jb3MocnopO1xuICAgIHNxID0gc2luQSAqIHNpbkE7XG5cbiAgICAvLyBNYXRyaWNlcyBhcmUgaWRlbnRpdHkgb3V0c2lkZSB0aGUgYXNzaWduZWQgdmFsdWVzXG4gICAgdHoubTExID0gdHoubTIyID0gMSAtIDIgKiBzcTtcbiAgICB0ei5tMTIgPSB0ei5tMjEgPSAyICogc2luQSAqIGNvc0E7XG4gICAgdHoubTIxICo9IC0xO1xuXG4gICAgcnkgLz0gMjtcbiAgICBzaW5BICA9IE1hdGguc2luKHJ5KTtcbiAgICBjb3NBICA9IE1hdGguY29zKHJ5KTtcbiAgICBzcSA9IHNpbkEgKiBzaW5BO1xuXG4gICAgdHkubTExID0gdHkubTMzID0gMSAtIDIgKiBzcTtcbiAgICB0eS5tMTMgPSB0eS5tMzEgPSAyICogc2luQSAqIGNvc0E7XG4gICAgdHkubTEzICo9IC0xO1xuXG4gICAgcnggLz0gMjtcbiAgICBzaW5BID0gTWF0aC5zaW4ocngpO1xuICAgIGNvc0EgPSBNYXRoLmNvcyhyeCk7XG4gICAgc3EgPSBzaW5BICogc2luQTtcblxuICAgIHR4Lm0yMiA9IHR4Lm0zMyA9IDEgLSAyICogc3E7XG4gICAgdHgubTIzID0gdHgubTMyID0gMiAqIHNpbkEgKiBjb3NBO1xuICAgIHR4Lm0zMiAqPSAtMTtcblxuICAgIHZhciBpZGVudGl0eU1hdHJpeCA9IG5ldyBYQ1NTTWF0cml4KCk7IC8vIHJldHVybnMgaWRlbnRpdHkgbWF0cml4IGJ5IGRlZmF1bHRcbiAgICB2YXIgaXNJZGVudGl0eSAgICAgPSB0aGlzLnRvU3RyaW5nKCkgPT09IGlkZW50aXR5TWF0cml4LnRvU3RyaW5nKCk7XG4gICAgdmFyIHJvdGF0ZWRNYXRyaXggID0gaXNJZGVudGl0eSA/XG4gICAgICAgICAgICB0ei5tdWx0aXBseSh0eSkubXVsdGlwbHkodHgpIDpcbiAgICAgICAgICAgIHRoaXMubXVsdGlwbHkodHgpLm11bHRpcGx5KHR5KS5tdWx0aXBseSh0eik7XG5cbiAgICByZXR1cm4gcm90YXRlZE1hdHJpeDtcbn07XG5cbi8qKlxuICogIFJldHVybnMgdGhlIHJlc3VsdCBvZiByb3RhdGluZyB0aGUgbWF0cml4IGFyb3VuZCBhIGdpdmVuIHZlY3RvciBieSBhIGdpdmVuXG4gKiAgYW5nbGUuXG4gKlxuICogIElmIHRoZSBnaXZlbiB2ZWN0b3IgaXMgdGhlIG9yaWdpbiB2ZWN0b3IgdGhlbiB0aGUgbWF0cml4IGlzIHJvdGF0ZWQgYnkgdGhlXG4gKiAgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSB6IGF4aXMuXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJcbiAqICBAcGFyYW0ge251bWJlcn0gcm90WCAtIFRoZSByb3RhdGlvbiBhcm91bmQgdGhlIHggYXhpcy5cbiAqICBAcGFyYW0ge251bWJlcn0gcm90WSAtIFRoZSByb3RhdGlvbiBhcm91bmQgdGhlIHkgYXhpcy4gSWYgdW5kZWZpbmVkLCB0aGUgeCBjb21wb25lbnQgaXMgdXNlZC5cbiAqICBAcGFyYW0ge251bWJlcn0gcm90WiAtIFRoZSByb3RhdGlvbiBhcm91bmQgdGhlIHogYXhpcy4gSWYgdW5kZWZpbmVkLCB0aGUgeCBjb21wb25lbnQgaXMgdXNlZC5cbiAqICBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2Ygcm90YXRpb24gYWJvdXQgdGhlIGF4aXMgdmVjdG9yLCBpbiBkZWdyZWVzLlxuICogIEByZXR1cm5zIFhDU1NNYXRyaXhcbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUucm90YXRlQXhpc0FuZ2xlID0gZnVuY3Rpb24gKHgsIHksIHosIGEpIHtcbiAgICBpZiAodHlwZW9mIHggIT09ICdudW1iZXInIHx8IGlzTmFOKHgpKSB4ID0gMDtcbiAgICBpZiAodHlwZW9mIHkgIT09ICdudW1iZXInIHx8IGlzTmFOKHkpKSB5ID0gMDtcbiAgICBpZiAodHlwZW9mIHogIT09ICdudW1iZXInIHx8IGlzTmFOKHopKSB6ID0gMDtcbiAgICBpZiAodHlwZW9mIGEgIT09ICdudW1iZXInIHx8IGlzTmFOKGEpKSBhID0gMDtcbiAgICBpZiAoeCA9PT0gMCAmJiB5ID09PSAwICYmIHogPT09IDApIHogPSAxO1xuICAgIGEgPSAodXRpbHMuYW5nbGVzLmRlZzJyYWQoYSkgfHwgMCkgLyAyO1xuICAgIHZhciB0ICAgICAgICAgPSBuZXcgWENTU01hdHJpeCgpLFxuICAgICAgICBsZW4gICAgICAgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSxcbiAgICAgICAgY29zQSAgICAgID0gTWF0aC5jb3MoYSksXG4gICAgICAgIHNpbkEgICAgICA9IE1hdGguc2luKGEpLFxuICAgICAgICBzcSAgICAgICAgPSBzaW5BICogc2luQSxcbiAgICAgICAgc2MgICAgICAgID0gc2luQSAqIGNvc0EsXG4gICAgICAgIHByZWNpc2lvbiA9IGZ1bmN0aW9uKHYpIHsgcmV0dXJuIHBhcnNlRmxvYXQoKHYpLnRvRml4ZWQoNikpOyB9LFxuICAgICAgICB4MiwgeTIsIHoyO1xuXG4gICAgLy8gQmFkIHZlY3RvciwgdXNlIHNvbWV0aGluZyBzZW5zaWJsZVxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgeCA9IDA7XG4gICAgICAgIHkgPSAwO1xuICAgICAgICB6ID0gMTtcbiAgICB9IGVsc2UgaWYgKGxlbiAhPT0gMSkge1xuICAgICAgICB4IC89IGxlbjtcbiAgICAgICAgeSAvPSBsZW47XG4gICAgICAgIHogLz0gbGVuO1xuICAgIH1cblxuICAgIC8vIE9wdGltaXNlIGNhc2VzIHdoZXJlIGF4aXMgaXMgYWxvbmcgbWFqb3IgYXhpc1xuICAgIGlmICh4ID09PSAxICYmIHkgPT09IDAgJiYgeiA9PT0gMCkge1xuICAgICAgICB0Lm0yMiA9IHQubTMzID0gMSAtIDIgKiBzcTtcbiAgICAgICAgdC5tMjMgPSB0Lm0zMiA9IDIgKiBzYztcbiAgICAgICAgdC5tMzIgKj0gLTE7XG4gICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPT09IDEgJiYgeiA9PT0gMCkge1xuICAgICAgICB0Lm0xMSA9IHQubTMzID0gMSAtIDIgKiBzcTtcbiAgICAgICAgdC5tMTMgPSB0Lm0zMSA9IDIgKiBzYztcbiAgICAgICAgdC5tMTMgKj0gLTE7XG4gICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPT09IDAgJiYgeiA9PT0gMSkge1xuICAgICAgICB0Lm0xMSA9IHQubTIyID0gMSAtIDIgKiBzcTtcbiAgICAgICAgdC5tMTIgPSB0Lm0yMSA9IDIgKiBzYztcbiAgICAgICAgdC5tMjEgKj0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgeDIgID0geCAqIHg7XG4gICAgICAgIHkyICA9IHkgKiB5O1xuICAgICAgICB6MiAgPSB6ICogejtcbiAgICAgICAgLy8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLXRyYW5zZm9ybXMvI21hdGhlbWF0aWNhbC1kZXNjcmlwdGlvblxuICAgICAgICB0Lm0xMSA9IHByZWNpc2lvbigxIC0gMiAqICh5MiArIHoyKSAqIHNxKTtcbiAgICAgICAgdC5tMTIgPSBwcmVjaXNpb24oMiAqICh4ICogeSAqIHNxICsgeiAqIHNjKSk7XG4gICAgICAgIHQubTEzID0gcHJlY2lzaW9uKDIgKiAoeCAqIHogKiBzcSAtIHkgKiBzYykpO1xuICAgICAgICB0Lm0yMSA9IHByZWNpc2lvbigyICogKHggKiB5ICogc3EgLSB6ICogc2MpKTtcbiAgICAgICAgdC5tMjIgPSBwcmVjaXNpb24oMSAtIDIgKiAoeDIgKyB6MikgKiBzcSk7XG4gICAgICAgIHQubTIzID0gcHJlY2lzaW9uKDIgKiAoeSAqIHogKiBzcSArIHggKiBzYykpO1xuICAgICAgICB0Lm0zMSA9IHByZWNpc2lvbigyICogKHggKiB6ICogc3EgKyB5ICogc2MpKTtcbiAgICAgICAgdC5tMzIgPSBwcmVjaXNpb24oMiAqICh5ICogeiAqIHNxIC0geCAqIHNjKSk7XG4gICAgICAgIHQubTMzID0gcHJlY2lzaW9uKDEgLSAyICogKHgyICsgeTIpICogc3EpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHQpO1xufTtcblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIHNjYWxpbmcgdGhlIG1hdHJpeCBieSBhIGdpdmVuIHZlY3Rvci5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7bnVtYmVyfSBzY2FsZVggLSB0aGUgc2NhbGluZyBmYWN0b3IgaW4gdGhlIHggYXhpcy5cbiAqICBAcGFyYW0ge251bWJlcn0gc2NhbGVZIC0gdGhlIHNjYWxpbmcgZmFjdG9yIGluIHRoZSB5IGF4aXMuIElmIHVuZGVmaW5lZCwgdGhlIHggY29tcG9uZW50IGlzIHVzZWQuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHNjYWxlWiAtIHRoZSBzY2FsaW5nIGZhY3RvciBpbiB0aGUgeiBheGlzLiBJZiB1bmRlZmluZWQsIDEgaXMgdXNlZC5cbiAqICBAcmV0dXJucyBYQ1NTTWF0cml4XG4gKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gKHNjYWxlWCwgc2NhbGVZLCBzY2FsZVopIHtcbiAgICB2YXIgdHJhbnNmb3JtID0gbmV3IFhDU1NNYXRyaXgoKTtcblxuICAgIGlmICh0eXBlb2Ygc2NhbGVYICE9PSAnbnVtYmVyJyB8fCBpc05hTihzY2FsZVgpKSBzY2FsZVggPSAxO1xuICAgIGlmICh0eXBlb2Ygc2NhbGVZICE9PSAnbnVtYmVyJyB8fCBpc05hTihzY2FsZVkpKSBzY2FsZVkgPSBzY2FsZVg7XG4gICAgaWYgKHR5cGVvZiBzY2FsZVogIT09ICdudW1iZXInIHx8IGlzTmFOKHNjYWxlWikpIHNjYWxlWiA9IDE7XG5cbiAgICB0cmFuc2Zvcm0ubTExID0gc2NhbGVYO1xuICAgIHRyYW5zZm9ybS5tMjIgPSBzY2FsZVk7XG4gICAgdHJhbnNmb3JtLm0zMyA9IHNjYWxlWjtcblxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHRyYW5zZm9ybSk7XG59O1xuXG4vKipcbiAqICBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygc2tld2luZyB0aGUgbWF0cml4IGJ5IGEgZ2l2ZW4gdmVjdG9yLlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHNrZXdYIC0gVGhlIHNjYWxpbmcgZmFjdG9yIGluIHRoZSB4IGF4aXMuXG4gKiAgQHJldHVybnMgWENTU01hdHJpeFxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5za2V3WCA9IGZ1bmN0aW9uIChkZWdyZWVzKSB7XG4gICAgdmFyIHJhZGlhbnMgICA9IHV0aWxzLmFuZ2xlcy5kZWcycmFkKGRlZ3JlZXMpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBuZXcgWENTU01hdHJpeCgpO1xuXG4gICAgdHJhbnNmb3JtLmMgPSBNYXRoLnRhbihyYWRpYW5zKTtcblxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHRyYW5zZm9ybSk7XG59O1xuXG4vKipcbiAqICBSZXR1cm5zIHRoZSByZXN1bHQgb2Ygc2tld2luZyB0aGUgbWF0cml4IGJ5IGEgZ2l2ZW4gdmVjdG9yLlxuICogIEBtZXRob2RcbiAqICBAbWVtYmVyXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHNrZXdZIC0gdGhlIHNjYWxpbmcgZmFjdG9yIGluIHRoZSB4IGF4aXMuXG4gKiAgQHJldHVybnMgWENTU01hdHJpeFxuICovXG5YQ1NTTWF0cml4LnByb3RvdHlwZS5za2V3WSA9IGZ1bmN0aW9uIChkZWdyZWVzKSB7XG4gICAgdmFyIHJhZGlhbnMgICA9IHV0aWxzLmFuZ2xlcy5kZWcycmFkKGRlZ3JlZXMpO1xuICAgIHZhciB0cmFuc2Zvcm0gPSBuZXcgWENTU01hdHJpeCgpO1xuXG4gICAgdHJhbnNmb3JtLmIgPSBNYXRoLnRhbihyYWRpYW5zKTtcblxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHRyYW5zZm9ybSk7XG59O1xuXG4vKipcbiAqICBSZXR1cm5zIHRoZSByZXN1bHQgb2YgdHJhbnNsYXRpbmcgdGhlIG1hdHJpeCBieSBhIGdpdmVuIHZlY3Rvci5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3Rvci5cbiAqICBAcGFyYW0ge251bWJlcn0geiAtIFRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yLiBJZiB1bmRlZmluZWQsIDAgaXMgdXNlZC5cbiAqICBAcmV0dXJucyBYQ1NTTWF0cml4XG4gKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgdmFyIHQgPSBuZXcgWENTU01hdHJpeCgpO1xuXG4gICAgaWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJyB8fCBpc05hTih4KSkgeCA9IDA7XG4gICAgaWYgKHR5cGVvZiB5ICE9PSAnbnVtYmVyJyB8fCBpc05hTih5KSkgeSA9IDA7XG4gICAgaWYgKHR5cGVvZiB6ICE9PSAnbnVtYmVyJyB8fCBpc05hTih6KSkgeiA9IDA7XG5cbiAgICB0Lm00MSA9IHg7XG4gICAgdC5tNDIgPSB5O1xuICAgIHQubTQzID0gejtcblxuICAgIHJldHVybiB0aGlzLm11bHRpcGx5KHQpO1xufTtcblxuLyoqXG4gKiAgU2V0cyB0aGUgbWF0cml4IHZhbHVlcyB1c2luZyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiwgc3VjaCBhcyB0aGF0IHByb2R1Y2VkXG4gKiAgYnkgdGhlIFtbWENTU01hdHJpeCN0b1N0cmluZ11dIG1ldGhvZC5cbiAqICBAbWV0aG9kXG4gKiAgQG1lbWJlclxuICogIEBwYXJhbXMge3N0cmluZ30gZG9tc3RyIC0gQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSAyRCBvciAzRCB0cmFuc2Zvcm0gbWF0cml4XG4gKiAgICBpbiB0aGUgZm9ybSBnaXZlbiBieSB0aGUgQ1NTIHRyYW5zZm9ybSBwcm9wZXJ0eSwgaS5lLiBqdXN0IGxpa2UgdGhlXG4gKiAgICBvdXRwdXQgZnJvbSBbW1hDU1NNYXRyaXgjdG9TdHJpbmddXS5cbiAqICBAcmV0dXJucyB1bmRlZmluZWRcbiAqL1xuWENTU01hdHJpeC5wcm90b3R5cGUuc2V0TWF0cml4VmFsdWUgPSBmdW5jdGlvbiAoZG9tc3RyKSB7XG5cbiAgICB2YXIgbWF0cml4U3RyaW5nID0gdG9NYXRyaXhTdHJpbmcoZG9tc3RyLnRyaW0oKSk7XG4gICAgdmFyIG1hdHJpeE9iamVjdCA9IHV0aWxzLnRyYW5zcC5zdGF0ZW1lbnRUb09iamVjdChtYXRyaXhTdHJpbmcpO1xuXG4gICAgaWYgKCFtYXRyaXhPYmplY3QpIHJldHVybjtcblxuICAgIHZhciBpczNkICAgPSBtYXRyaXhPYmplY3Qua2V5ID09PSB1dGlscy50cmFuc3AubWF0cml4Rm4zZDtcbiAgICB2YXIga2V5Z2VuID0gaXMzZCA/IGluZGV4dG9LZXkzZCA6IGluZGV4dG9LZXkyZDtcbiAgICB2YXIgdmFsdWVzID0gbWF0cml4T2JqZWN0LnZhbHVlO1xuICAgIHZhciBjb3VudCAgPSB2YWx1ZXMubGVuZ3RoO1xuXG4gICAgaWYgKChpczNkICYmIGNvdW50ICE9PSAxNikgfHwgIShpczNkIHx8IGNvdW50ID09PSA2KSkgcmV0dXJuO1xuXG4gICAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKG9iaiwgaSkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Z2VuKGkpO1xuICAgICAgICB0aGlzW2tleV0gPSBvYmoudmFsdWU7XG4gICAgfSwgdGhpcyk7XG59O1xuXG5mdW5jdGlvbiBpbmRleHRvS2V5MmQgKGluZGV4KSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoaW5kZXggKyA5Nyk7IC8vIEFTQ0lJIGNoYXIgOTcgPT0gJ2EnXG59XG5cbmZ1bmN0aW9uIGluZGV4dG9LZXkzZCAoaW5kZXgpIHtcbiAgICByZXR1cm4gKCdtJyArIChNYXRoLmZsb29yKGluZGV4IC8gNCkgKyAxKSkgKyAoaW5kZXggJSA0ICsgMSk7XG59XG4vKipcbiAqICBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXguXG4gKiAgQG1ldGhvZFxuICogIEBtZW1iZXJvZiBYQ1NTTWF0cml4XG4gKiAgQHJldHVybnMge3N0cmluZ30gbWF0cml4U3RyaW5nIC0gYSBzdHJpbmcgbGlrZSBgbWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApYFxuICpcbiAqKi9cblhDU1NNYXRyaXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb2ludHMsIHByZWZpeDtcblxuICAgIGlmICh1dGlscy5tYXRyaXguaXNBZmZpbmUodGhpcykpIHtcbiAgICAgICAgcHJlZml4ID0gdXRpbHMudHJhbnNwLm1hdHJpeEZuMmQ7XG4gICAgICAgIHBvaW50cyA9IHBvaW50czJkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHByZWZpeCA9IHV0aWxzLnRyYW5zcC5tYXRyaXhGbjNkO1xuICAgICAgICBwb2ludHMgPSBwb2ludHMzZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4ICsgJygnICtcbiAgICAgICAgcG9pbnRzLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbcF0udG9GaXhlZCg2KTtcbiAgICAgICAgfSwgdGhpcykgLmpvaW4oJywgJykgK1xuICAgICAgICAnKSc7XG59O1xuXG4vLyA9PT09PT0gdG9NYXRyaXhTdHJpbmcgPT09PT09IC8vXG52YXIganNGdW5jdGlvbnMgPSB7XG4gICAgbWF0cml4OiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICB2YXIgbTIgPSBuZXcgWENTU01hdHJpeChvLnVucGFyc2VkKTtcblxuICAgICAgICByZXR1cm4gbS5tdWx0aXBseShtMik7XG4gICAgfSxcbiAgICBtYXRyaXgzZDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgdmFyIG0yID0gbmV3IFhDU1NNYXRyaXgoby51bnBhcnNlZCk7XG5cbiAgICAgICAgcmV0dXJuIG0ubXVsdGlwbHkobTIpO1xuICAgIH0sXG5cbiAgICBwZXJzcGVjdGl2ZTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgdmFyIG0yID0gbmV3IFhDU1NNYXRyaXgoKTtcbiAgICAgICAgbTIubTM0IC09IDEgLyBvLnZhbHVlWzBdLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiBtLm11bHRpcGx5KG0yKTtcbiAgICB9LFxuXG4gICAgcm90YXRlOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5yb3RhdGUuYXBwbHkobSwgby52YWx1ZS5tYXAob2JqZWN0VmFsdWVzKSk7XG4gICAgfSxcbiAgICByb3RhdGUzZDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0ucm90YXRlQXhpc0FuZ2xlLmFwcGx5KG0sIG8udmFsdWUubWFwKG9iamVjdFZhbHVlcykpO1xuICAgIH0sXG4gICAgcm90YXRlWDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0ucm90YXRlLmFwcGx5KG0sIFtvLnZhbHVlWzBdLnZhbHVlLCAwLCAwXSk7XG4gICAgfSxcbiAgICByb3RhdGVZOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5yb3RhdGUuYXBwbHkobSwgWzAsIG8udmFsdWVbMF0udmFsdWUsIDBdKTtcbiAgICB9LFxuICAgIHJvdGF0ZVo6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnJvdGF0ZS5hcHBseShtLCBbMCwgMCwgby52YWx1ZVswXS52YWx1ZV0pO1xuICAgIH0sXG5cbiAgICBzY2FsZTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0uc2NhbGUuYXBwbHkobSwgby52YWx1ZS5tYXAob2JqZWN0VmFsdWVzKSk7XG4gICAgfSxcbiAgICBzY2FsZTNkOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5zY2FsZS5hcHBseShtLCBvLnZhbHVlLm1hcChvYmplY3RWYWx1ZXMpKTtcbiAgICB9LFxuICAgIHNjYWxlWDogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0uc2NhbGUuYXBwbHkobSwgby52YWx1ZS5tYXAob2JqZWN0VmFsdWVzKSk7XG4gICAgfSxcbiAgICBzY2FsZVk6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnNjYWxlLmFwcGx5KG0sIFswLCBvLnZhbHVlWzBdLnZhbHVlLCAwXSk7XG4gICAgfSxcbiAgICBzY2FsZVo6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnNjYWxlLmFwcGx5KG0sIFswLCAwLCBvLnZhbHVlWzBdLnZhbHVlXSk7XG4gICAgfSxcblxuICAgIHNrZXc6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHZhciBtWCA9IG5ldyBYQ1NTTWF0cml4KCdza2V3WCgnICsgby52YWx1ZVswXS51bnBhcnNlZCArICcpJyk7XG4gICAgICAgIHZhciBtWSA9IG5ldyBYQ1NTTWF0cml4KCdza2V3WSgnICsgKG8udmFsdWVbMV0mJm8udmFsdWVbMV0udW5wYXJzZWQgfHwgMCkgKyAnKScpO1xuICAgICAgICB2YXIgc00gPSAnbWF0cml4KDEuMDAwMDAsICcrIG1ZLmIgKycsICcrIG1YLmMgKycsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApJztcbiAgICAgICAgdmFyIG0yID0gbmV3IFhDU1NNYXRyaXgoc00pO1xuXG4gICAgICAgIHJldHVybiBtLm11bHRpcGx5KG0yKTtcbiAgICB9LFxuICAgIHNrZXdYOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS5za2V3WC5hcHBseShtLCBbby52YWx1ZVswXS52YWx1ZV0pO1xuICAgIH0sXG4gICAgc2tld1k6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnNrZXdZLmFwcGx5KG0sIFtvLnZhbHVlWzBdLnZhbHVlXSk7XG4gICAgfSxcblxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0udHJhbnNsYXRlLmFwcGx5KG0sIG8udmFsdWUubWFwKG9iamVjdFZhbHVlcykpO1xuICAgIH0sXG4gICAgdHJhbnNsYXRlM2Q6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnRyYW5zbGF0ZS5hcHBseShtLCBvLnZhbHVlLm1hcChvYmplY3RWYWx1ZXMpKTtcbiAgICB9LFxuICAgIHRyYW5zbGF0ZVg6IGZ1bmN0aW9uIChtLCBvKSB7XG4gICAgICAgIHJldHVybiBtLnRyYW5zbGF0ZS5hcHBseShtLCBbby52YWx1ZVswXS52YWx1ZSwgMCwgMF0pO1xuICAgIH0sXG4gICAgdHJhbnNsYXRlWTogZnVuY3Rpb24gKG0sIG8pIHtcbiAgICAgICAgcmV0dXJuIG0udHJhbnNsYXRlLmFwcGx5KG0sIFswLCBvLnZhbHVlWzBdLnZhbHVlLCAwXSk7XG4gICAgfSxcbiAgICB0cmFuc2xhdGVaOiBmdW5jdGlvbiAobSwgbykge1xuICAgICAgICByZXR1cm4gbS50cmFuc2xhdGUuYXBwbHkobSwgWzAsIDAsIG8udmFsdWVbMF0udmFsdWVdKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBvYmplY3RWYWx1ZXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai52YWx1ZTtcbn1cblxuZnVuY3Rpb24gY3NzRnVuY3Rpb25Ub0pzRnVuY3Rpb24oY3NzRnVuY3Rpb25OYW1lKSB7XG4gICAgcmV0dXJuIGpzRnVuY3Rpb25zW2Nzc0Z1bmN0aW9uTmFtZV07XG59XG5cbmZ1bmN0aW9uIHBhcnNlZFRvRGVncmVlcyhwYXJzZWQpIHtcbiAgICBpZiAocGFyc2VkLnVuaXRzID09PSAncmFkJykge1xuICAgICAgICBwYXJzZWQudmFsdWUgPSB1dGlscy5hbmdsZXMucmFkMmRlZyhwYXJzZWQudmFsdWUpO1xuICAgICAgICBwYXJzZWQudW5pdHMgPSAnZGVnJztcbiAgICB9XG4gICAgZWxzZSBpZiAocGFyc2VkLnVuaXRzID09PSAnZ3JhZCcpIHtcbiAgICAgICAgcGFyc2VkLnZhbHVlID0gdXRpbHMuYW5nbGVzLmdyYWQyZGVnKHBhcnNlZC52YWx1ZSk7XG4gICAgICAgIHBhcnNlZC51bml0cyA9ICdkZWcnO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZWQ7XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybU1hdHJpeChtYXRyaXgsIG9wZXJhdGlvbikge1xuICAgIC8vIGNvbnZlcnQgdG8gZGVncmVlcyBiZWNhdXNlIGFsbCBDU1NNYXRyaXggbWV0aG9kcyBleHBlY3QgZGVncmVlc1xuICAgIG9wZXJhdGlvbi52YWx1ZSA9IG9wZXJhdGlvbi52YWx1ZS5tYXAocGFyc2VkVG9EZWdyZWVzKTtcblxuICAgIHZhciBqc0Z1bmN0aW9uID0gY3NzRnVuY3Rpb25Ub0pzRnVuY3Rpb24ob3BlcmF0aW9uLmtleSk7XG4gICAgdmFyIHJlc3VsdCAgICAgPSBqc0Z1bmN0aW9uKG1hdHJpeCwgb3BlcmF0aW9uKTtcblxuICAgIHJldHVybiByZXN1bHQgfHwgbWF0cml4O1xufVxuXG4vKipcbiAqICBUcmFuZm9ybXMgYSBgZWwuc3R5bGUuV2Via2l0VHJhbnNmb3JtYC1zdHlsZSBzdHJpbmdcbiAqICAobGlrZSBgcm90YXRlKDE4cmFkKSB0cmFuc2xhdGUzZCg1MHB4LCAxMDBweCwgMTBweClgKVxuICogIGludG8gYSBgZ2V0Q29tcHV0ZWRTdHlsZShlbClgLXN0eWxlIG1hdHJpeCBzdHJpbmdcbiAqICAobGlrZSBgbWF0cml4M2QoMC42NjAzMTYsIC0wLjc1MDk4NywgMCwgMCwgMC43NTA5ODcsIDAuNjYwMzE2LCAwLCAwLCAwLCAwLCAxLCAwLCAxMDguMTE0NTYwLCAyOC40ODIzMDgsIDEwLCAxKWApXG4gKiAgQHByaXZhdGVcbiAqICBAbWV0aG9kXG4gKiAgQHBhcmFtIHtzdHJpbmd9IHRyYW5zZm9ybVN0cmluZyAtIGBlbC5zdHlsZS5XZWJraXRUcmFuc2Zvcm1gLXN0eWxlIHN0cmluZyAobGlrZSBgcm90YXRlKDE4cmFkKSB0cmFuc2xhdGUzZCg1MHB4LCAxMDBweCwgMTBweClgKVxuICovXG5mdW5jdGlvbiB0b01hdHJpeFN0cmluZyh0cmFuc2Zvcm1TdHJpbmcpIHtcbiAgICB2YXIgc3RhdGVtZW50cyA9IHV0aWxzLnRyYW5zcC5zdHJpbmdUb1N0YXRlbWVudHModHJhbnNmb3JtU3RyaW5nKTtcblxuICAgIGlmIChzdGF0ZW1lbnRzLmxlbmd0aCA9PT0gMSAmJiAoL15tYXRyaXgvKS50ZXN0KHRyYW5zZm9ybVN0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybVN0cmluZztcbiAgICB9XG5cbiAgICAvLyBXZSBvbmx5IHdhbnQgdGhlIHN0YXRlbWVudCB0byBwYXNzIHRvIGB1dGlscy50cmFuc3Auc3RhdGVtZW50VG9PYmplY3RgXG4gICAgLy8gICBub3QgdGhlIG90aGVyIHZhbHVlcyAoaW5kZXgsIGxpc3QpIGZyb20gYG1hcGBcbiAgICB2YXIgc3RhdGVtZW50VG9PYmplY3QgPSB1dGlscy5mdW5jcy5vbmx5Rmlyc3RBcmcodXRpbHMudHJhbnNwLnN0YXRlbWVudFRvT2JqZWN0KTtcbiAgICB2YXIgb3BlcmF0aW9ucyAgICAgICAgPSBzdGF0ZW1lbnRzLm1hcChzdGF0ZW1lbnRUb09iamVjdCk7XG4gICAgdmFyIHN0YXJ0aW5nTWF0cml4ICAgID0gbmV3IFhDU1NNYXRyaXgoKTtcbiAgICB2YXIgdHJhbnNmb3JtZWRNYXRyaXggPSBvcGVyYXRpb25zLnJlZHVjZSh0cmFuc2Zvcm1NYXRyaXgsIHN0YXJ0aW5nTWF0cml4KTtcbiAgICB2YXIgbWF0cml4U3RyaW5nICAgICAgPSB0cmFuc2Zvcm1lZE1hdHJpeC50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIG1hdHJpeFN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBYQ1NTTWF0cml4O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZzJyYWQ6IGRlZzJyYWQsXG4gIHJhZDJkZWc6IHJhZDJkZWcsXG4gIGdyYWQyZGVnOiBncmFkMmRlZ1xufTtcblxuLyoqXG4gKiAgQ29udmVydHMgYW5nbGVzIGluIGRlZ3JlZXMsIHdoaWNoIGFyZSB1c2VkIGJ5IHRoZSBleHRlcm5hbCBBUEksIHRvIGFuZ2xlc1xuICogIGluIHJhZGlhbnMgdXNlZCBpbiBpbnRlcm5hbCBjYWxjdWxhdGlvbnMuXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gQW4gYW5nbGUgaW4gZGVncmVlcy5cbiAqICBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5zXG4gKi9cbmZ1bmN0aW9uIGRlZzJyYWQoYW5nbGUpIHtcbiAgICByZXR1cm4gYW5nbGUgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5mdW5jdGlvbiByYWQyZGVnKHJhZGlhbnMpIHtcbiAgICByZXR1cm4gcmFkaWFucyAqICgxODAgLyBNYXRoLlBJKTtcbn1cblxuZnVuY3Rpb24gZ3JhZDJkZWcoZ3JhZGlhbnMpIHtcbiAgICAvLyA0MDAgZ3JhZGlhbnMgaW4gMzYwIGRlZ3JlZXNcbiAgICByZXR1cm4gZ3JhZGlhbnMgLyAoNDAwIC8gMzYwKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIG1hdHJpeEZuMmQ6ICdtYXRyaXgnLFxuICAgIG1hdHJpeEZuM2Q6ICdtYXRyaXgzZCcsXG4gICAgdmFsdWVUb09iamVjdDogdmFsdWVUb09iamVjdCxcbiAgICBzdGF0ZW1lbnRUb09iamVjdDogc3RhdGVtZW50VG9PYmplY3QsXG4gICAgc3RyaW5nVG9TdGF0ZW1lbnRzOiBzdHJpbmdUb1N0YXRlbWVudHNcbn07XG5cbmZ1bmN0aW9uIHZhbHVlVG9PYmplY3QodmFsdWUpIHtcbiAgICB2YXIgdW5pdHMgPSAvKFtcXC1cXCtdP1swLTldK1tcXC4wLTldKikoZGVnfHJhZHxncmFkfHB4fCUpKi87XG4gICAgdmFyIHBhcnRzID0gdmFsdWUubWF0Y2godW5pdHMpIHx8IFtdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHBhcnNlRmxvYXQocGFydHNbMV0pLFxuICAgICAgICB1bml0czogcGFydHNbMl0sXG4gICAgICAgIHVucGFyc2VkOiB2YWx1ZVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHN0YXRlbWVudFRvT2JqZWN0KHN0YXRlbWVudCwgc2tpcFZhbHVlcykge1xuICAgIHZhciBuYW1lQW5kQXJncyAgICA9IC8oXFx3KylcXCgoW15cXCldKylcXCkvaTtcbiAgICB2YXIgc3RhdGVtZW50UGFydHMgPSBzdGF0ZW1lbnQudG9TdHJpbmcoKS5tYXRjaChuYW1lQW5kQXJncykuc2xpY2UoMSk7XG4gICAgdmFyIGZ1bmN0aW9uTmFtZSAgID0gc3RhdGVtZW50UGFydHNbMF07XG4gICAgdmFyIHN0cmluZ1ZhbHVlcyAgID0gc3RhdGVtZW50UGFydHNbMV0uc3BsaXQoLywgPy8pO1xuICAgIHZhciBwYXJzZWRWYWx1ZXMgICA9ICFza2lwVmFsdWVzICYmIHN0cmluZ1ZhbHVlcy5tYXAodmFsdWVUb09iamVjdCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgdmFsdWU6IHBhcnNlZFZhbHVlcyB8fCBzdHJpbmdWYWx1ZXMsXG4gICAgICAgIHVucGFyc2VkOiBzdGF0ZW1lbnRcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdUb1N0YXRlbWVudHModHJhbnNmb3JtU3RyaW5nKSB7XG4gICAgdmFyIGZ1bmN0aW9uU2lnbmF0dXJlICAgPSAvKFxcdyspXFwoW15cXCldK1xcKS9pZztcbiAgICB2YXIgdHJhbnNmb3JtU3RhdGVtZW50cyA9IHRyYW5zZm9ybVN0cmluZy5tYXRjaChmdW5jdGlvblNpZ25hdHVyZSkgfHwgW107XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtU3RhdGVtZW50cztcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkZXRlcm1pbmFudDJ4MjogZGV0ZXJtaW5hbnQyeDIsXG4gIGRldGVybWluYW50M3gzOiBkZXRlcm1pbmFudDN4MyxcbiAgZGV0ZXJtaW5hbnQ0eDQ6IGRldGVybWluYW50NHg0LFxuICBpc0FmZmluZTogaXNBZmZpbmUsXG4gIGlzSWRlbnRpdHlPclRyYW5zbGF0aW9uOiBpc0lkZW50aXR5T3JUcmFuc2xhdGlvbixcbiAgYWRqb2ludDogYWRqb2ludCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICBkZWNvbXBvc2U6IGRlY29tcG9zZVxufTtcblxuLyoqXG4gKiAgQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSAyeDIgbWF0cml4LlxuICogIEBwYXJhbSB7bnVtYmVyfSBhIC0gVG9wLWxlZnQgdmFsdWUgb2YgdGhlIG1hdHJpeC5cbiAqICBAcGFyYW0ge251bWJlcn0gYiAtIFRvcC1yaWdodCB2YWx1ZSBvZiB0aGUgbWF0cml4LlxuICogIEBwYXJhbSB7bnVtYmVyfSBjIC0gQm90dG9tLWxlZnQgdmFsdWUgb2YgdGhlIG1hdHJpeC5cbiAqICBAcGFyYW0ge251bWJlcn0gZCAtIEJvdHRvbS1yaWdodCB2YWx1ZSBvZiB0aGUgbWF0cml4LlxuICogIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGRldGVybWluYW50MngyKGEsIGIsIGMsIGQpIHtcbiAgICByZXR1cm4gYSAqIGQgLSBiICogYztcbn1cblxuLyoqXG4gKiAgQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSAzeDMgbWF0cml4LlxuICogIEBwYXJhbSB7bnVtYmVyfSBhMSAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMSwgMV0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGEyIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFsxLCAyXS5cbiAqICBAcGFyYW0ge251bWJlcn0gYTMgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzEsIDNdLlxuICogIEBwYXJhbSB7bnVtYmVyfSBiMSAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMiwgMV0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGIyIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFsyLCAyXS5cbiAqICBAcGFyYW0ge251bWJlcn0gYjMgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzIsIDNdLlxuICogIEBwYXJhbSB7bnVtYmVyfSBjMSAtIE1hdHJpeCB2YWx1ZSBpbiBwb3NpdGlvbiBbMywgMV0uXG4gKiAgQHBhcmFtIHtudW1iZXJ9IGMyIC0gTWF0cml4IHZhbHVlIGluIHBvc2l0aW9uIFszLCAyXS5cbiAqICBAcGFyYW0ge251bWJlcn0gYzMgLSBNYXRyaXggdmFsdWUgaW4gcG9zaXRpb24gWzMsIDNdLlxuICogIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGRldGVybWluYW50M3gzKGExLCBhMiwgYTMsIGIxLCBiMiwgYjMsIGMxLCBjMiwgYzMpIHtcblxuICAgIHJldHVybiBhMSAqIGRldGVybWluYW50MngyKGIyLCBiMywgYzIsIGMzKSAtXG4gICAgICAgICAgIGIxICogZGV0ZXJtaW5hbnQyeDIoYTIsIGEzLCBjMiwgYzMpICtcbiAgICAgICAgICAgYzEgKiBkZXRlcm1pbmFudDJ4MihhMiwgYTMsIGIyLCBiMyk7XG59XG5cbi8qKlxuICogIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgNHg0IG1hdHJpeC5cbiAqICBAcGFyYW0ge1hDU1NNYXRyaXh9IG1hdHJpeCAtIFRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudCBvZi5cbiAqICBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBkZXRlcm1pbmFudDR4NChtYXRyaXgpIHtcbiAgICB2YXJcbiAgICAgICAgbSA9IG1hdHJpeCxcbiAgICAgICAgLy8gQXNzaWduIHRvIGluZGl2aWR1YWwgdmFyaWFibGUgbmFtZXMgdG8gYWlkIHNlbGVjdGluZyBjb3JyZWN0IGVsZW1lbnRzXG4gICAgICAgIGExID0gbS5tMTEsIGIxID0gbS5tMjEsIGMxID0gbS5tMzEsIGQxID0gbS5tNDEsXG4gICAgICAgIGEyID0gbS5tMTIsIGIyID0gbS5tMjIsIGMyID0gbS5tMzIsIGQyID0gbS5tNDIsXG4gICAgICAgIGEzID0gbS5tMTMsIGIzID0gbS5tMjMsIGMzID0gbS5tMzMsIGQzID0gbS5tNDMsXG4gICAgICAgIGE0ID0gbS5tMTQsIGI0ID0gbS5tMjQsIGM0ID0gbS5tMzQsIGQ0ID0gbS5tNDQ7XG5cbiAgICByZXR1cm4gYTEgKiBkZXRlcm1pbmFudDN4MyhiMiwgYjMsIGI0LCBjMiwgYzMsIGM0LCBkMiwgZDMsIGQ0KSAtXG4gICAgICAgICAgIGIxICogZGV0ZXJtaW5hbnQzeDMoYTIsIGEzLCBhNCwgYzIsIGMzLCBjNCwgZDIsIGQzLCBkNCkgK1xuICAgICAgICAgICBjMSAqIGRldGVybWluYW50M3gzKGEyLCBhMywgYTQsIGIyLCBiMywgYjQsIGQyLCBkMywgZDQpIC1cbiAgICAgICAgICAgZDEgKiBkZXRlcm1pbmFudDN4MyhhMiwgYTMsIGE0LCBiMiwgYjMsIGI0LCBjMiwgYzMsIGM0KTtcbn1cblxuLyoqXG4gKiAgRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBtYXRyaXggaXMgYWZmaW5lLlxuICogIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0FmZmluZShtYXRyaXgpIHtcbiAgICByZXR1cm4gbWF0cml4Lm0xMyA9PT0gMCAmJiBtYXRyaXgubTE0ID09PSAwICYmXG4gICAgICAgICAgIG1hdHJpeC5tMjMgPT09IDAgJiYgbWF0cml4Lm0yNCA9PT0gMCAmJlxuICAgICAgICAgICBtYXRyaXgubTMxID09PSAwICYmIG1hdHJpeC5tMzIgPT09IDAgJiZcbiAgICAgICAgICAgbWF0cml4Lm0zMyA9PT0gMSAmJiBtYXRyaXgubTM0ID09PSAwICYmXG4gICAgICAgICAgIG1hdHJpeC5tNDMgPT09IDAgJiYgbWF0cml4Lm00NCA9PT0gMTtcbn1cblxuLyoqXG4gKiAgUmV0dXJucyB3aGV0aGVyIHRoZSBtYXRyaXggaXMgdGhlIGlkZW50aXR5IG1hdHJpeCBvciBhIHRyYW5zbGF0aW9uIG1hdHJpeC5cbiAqICBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0lkZW50aXR5T3JUcmFuc2xhdGlvbihtYXRyaXgpIHtcbiAgICB2YXIgbSA9IG1hdHJpeDtcblxuICAgIHJldHVybiBtLm0xMSA9PT0gMSAmJiBtLm0xMiA9PT0gMCAmJiBtLm0xMyA9PT0gMCAmJiBtLm0xNCA9PT0gMCAmJlxuICAgICAgICAgICBtLm0yMSA9PT0gMCAmJiBtLm0yMiA9PT0gMSAmJiBtLm0yMyA9PT0gMCAmJiBtLm0yNCA9PT0gMCAmJlxuICAgICAgICAgICBtLm0zMSA9PT0gMCAmJiBtLm0zMSA9PT0gMCAmJiBtLm0zMyA9PT0gMSAmJiBtLm0zNCA9PT0gMCAmJlxuICAgIC8qIG00MSwgbTQyIGFuZCBtNDMgYXJlIHRoZSB0cmFuc2xhdGlvbiBwb2ludHMgKi8gICBtLm00NCA9PT0gMTtcbn1cblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgYWRqb2ludCBtYXRyaXguXG4gKiAgQHJldHVybiB7WENTU01hdHJpeH1cbiAqL1xuZnVuY3Rpb24gYWRqb2ludChtYXRyaXgpIHtcbiAgICB2YXIgbSA9IG1hdHJpeCxcbiAgICAgICAgLy8gbWFrZSBgcmVzdWx0YCB0aGUgc2FtZSB0eXBlIGFzIHRoZSBnaXZlbiBtZXRyaWNcbiAgICAgICAgcmVzdWx0ID0gbmV3IG1hdHJpeC5jb25zdHJ1Y3RvcigpLFxuXG4gICAgICAgIGExID0gbS5tMTEsIGIxID0gbS5tMTIsIGMxID0gbS5tMTMsIGQxID0gbS5tMTQsXG4gICAgICAgIGEyID0gbS5tMjEsIGIyID0gbS5tMjIsIGMyID0gbS5tMjMsIGQyID0gbS5tMjQsXG4gICAgICAgIGEzID0gbS5tMzEsIGIzID0gbS5tMzIsIGMzID0gbS5tMzMsIGQzID0gbS5tMzQsXG4gICAgICAgIGE0ID0gbS5tNDEsIGI0ID0gbS5tNDIsIGM0ID0gbS5tNDMsIGQ0ID0gbS5tNDQ7XG5cbiAgICAvLyBSb3cgY29sdW1uIGxhYmVsaW5nIHJldmVyc2VkIHNpbmNlIHdlIHRyYW5zcG9zZSByb3dzICYgY29sdW1uc1xuICAgIHJlc3VsdC5tMTEgPSAgZGV0ZXJtaW5hbnQzeDMoYjIsIGIzLCBiNCwgYzIsIGMzLCBjNCwgZDIsIGQzLCBkNCk7XG4gICAgcmVzdWx0Lm0yMSA9IC1kZXRlcm1pbmFudDN4MyhhMiwgYTMsIGE0LCBjMiwgYzMsIGM0LCBkMiwgZDMsIGQ0KTtcbiAgICByZXN1bHQubTMxID0gIGRldGVybWluYW50M3gzKGEyLCBhMywgYTQsIGIyLCBiMywgYjQsIGQyLCBkMywgZDQpO1xuICAgIHJlc3VsdC5tNDEgPSAtZGV0ZXJtaW5hbnQzeDMoYTIsIGEzLCBhNCwgYjIsIGIzLCBiNCwgYzIsIGMzLCBjNCk7XG5cbiAgICByZXN1bHQubTEyID0gLWRldGVybWluYW50M3gzKGIxLCBiMywgYjQsIGMxLCBjMywgYzQsIGQxLCBkMywgZDQpO1xuICAgIHJlc3VsdC5tMjIgPSAgZGV0ZXJtaW5hbnQzeDMoYTEsIGEzLCBhNCwgYzEsIGMzLCBjNCwgZDEsIGQzLCBkNCk7XG4gICAgcmVzdWx0Lm0zMiA9IC1kZXRlcm1pbmFudDN4MyhhMSwgYTMsIGE0LCBiMSwgYjMsIGI0LCBkMSwgZDMsIGQ0KTtcbiAgICByZXN1bHQubTQyID0gIGRldGVybWluYW50M3gzKGExLCBhMywgYTQsIGIxLCBiMywgYjQsIGMxLCBjMywgYzQpO1xuXG4gICAgcmVzdWx0Lm0xMyA9ICBkZXRlcm1pbmFudDN4MyhiMSwgYjIsIGI0LCBjMSwgYzIsIGM0LCBkMSwgZDIsIGQ0KTtcbiAgICByZXN1bHQubTIzID0gLWRldGVybWluYW50M3gzKGExLCBhMiwgYTQsIGMxLCBjMiwgYzQsIGQxLCBkMiwgZDQpO1xuICAgIHJlc3VsdC5tMzMgPSAgZGV0ZXJtaW5hbnQzeDMoYTEsIGEyLCBhNCwgYjEsIGIyLCBiNCwgZDEsIGQyLCBkNCk7XG4gICAgcmVzdWx0Lm00MyA9IC1kZXRlcm1pbmFudDN4MyhhMSwgYTIsIGE0LCBiMSwgYjIsIGI0LCBjMSwgYzIsIGM0KTtcblxuICAgIHJlc3VsdC5tMTQgPSAtZGV0ZXJtaW5hbnQzeDMoYjEsIGIyLCBiMywgYzEsIGMyLCBjMywgZDEsIGQyLCBkMyk7XG4gICAgcmVzdWx0Lm0yNCA9ICBkZXRlcm1pbmFudDN4MyhhMSwgYTIsIGEzLCBjMSwgYzIsIGMzLCBkMSwgZDIsIGQzKTtcbiAgICByZXN1bHQubTM0ID0gLWRldGVybWluYW50M3gzKGExLCBhMiwgYTMsIGIxLCBiMiwgYjMsIGQxLCBkMiwgZDMpO1xuICAgIHJlc3VsdC5tNDQgPSAgZGV0ZXJtaW5hbnQzeDMoYTEsIGEyLCBhMywgYjEsIGIyLCBiMywgYzEsIGMyLCBjMyk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpbnZlcnNlKG1hdHJpeCkge1xuICB2YXIgaW52O1xuXG4gIGlmIChpc0lkZW50aXR5T3JUcmFuc2xhdGlvbihtYXRyaXgpKSB7XG4gICAgICBpbnYgPSBuZXcgbWF0cml4LmNvbnN0cnVjdG9yKCk7XG5cbiAgICAgIGlmICghKG1hdHJpeC5tNDEgPT09IDAgJiYgbWF0cml4Lm00MiA9PT0gMCAmJiBtYXRyaXgubTQzID09PSAwKSkge1xuICAgICAgICAgIGludi5tNDEgPSAtbWF0cml4Lm00MTtcbiAgICAgICAgICBpbnYubTQyID0gLW1hdHJpeC5tNDI7XG4gICAgICAgICAgaW52Lm00MyA9IC1tYXRyaXgubTQzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW52O1xuICB9XG5cbiAgLy8gQ2FsY3VsYXRlIHRoZSBhZGpvaW50IG1hdHJpeFxuICB2YXIgcmVzdWx0ID0gYWRqb2ludChtYXRyaXgpO1xuXG4gIC8vIENhbGN1bGF0ZSB0aGUgNHg0IGRldGVybWluYW50XG4gIHZhciBkZXQgPSBkZXRlcm1pbmFudDR4NChtYXRyaXgpO1xuXG4gIC8vIElmIHRoZSBkZXRlcm1pbmFudCBpcyB6ZXJvLCB0aGVuIHRoZSBpbnZlcnNlIG1hdHJpeCBpcyBub3QgdW5pcXVlXG4gIGlmIChNYXRoLmFicyhkZXQpIDwgMWUtOCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gU2NhbGUgdGhlIGFkam9pbnQgbWF0cml4IHRvIGdldCB0aGUgaW52ZXJzZVxuICBmb3IgKHZhciBpID0gMTsgaSA8IDU7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICByZXN1bHRbKCdtJyArIGkpICsgal0gLz0gZGV0O1xuICAgICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbXVsdGlwbHkobWF0cml4LCBvdGhlck1hdHJpeCkge1xuICBpZiAoIW90aGVyTWF0cml4KSByZXR1cm4gbnVsbDtcblxuICB2YXIgYSA9IG90aGVyTWF0cml4LFxuICAgICAgYiA9IG1hdHJpeCxcbiAgICAgIGMgPSBuZXcgbWF0cml4LmNvbnN0cnVjdG9yKCk7XG5cbiAgYy5tMTEgPSBhLm0xMSAqIGIubTExICsgYS5tMTIgKiBiLm0yMSArIGEubTEzICogYi5tMzEgKyBhLm0xNCAqIGIubTQxO1xuICBjLm0xMiA9IGEubTExICogYi5tMTIgKyBhLm0xMiAqIGIubTIyICsgYS5tMTMgKiBiLm0zMiArIGEubTE0ICogYi5tNDI7XG4gIGMubTEzID0gYS5tMTEgKiBiLm0xMyArIGEubTEyICogYi5tMjMgKyBhLm0xMyAqIGIubTMzICsgYS5tMTQgKiBiLm00MztcbiAgYy5tMTQgPSBhLm0xMSAqIGIubTE0ICsgYS5tMTIgKiBiLm0yNCArIGEubTEzICogYi5tMzQgKyBhLm0xNCAqIGIubTQ0O1xuXG4gIGMubTIxID0gYS5tMjEgKiBiLm0xMSArIGEubTIyICogYi5tMjEgKyBhLm0yMyAqIGIubTMxICsgYS5tMjQgKiBiLm00MTtcbiAgYy5tMjIgPSBhLm0yMSAqIGIubTEyICsgYS5tMjIgKiBiLm0yMiArIGEubTIzICogYi5tMzIgKyBhLm0yNCAqIGIubTQyO1xuICBjLm0yMyA9IGEubTIxICogYi5tMTMgKyBhLm0yMiAqIGIubTIzICsgYS5tMjMgKiBiLm0zMyArIGEubTI0ICogYi5tNDM7XG4gIGMubTI0ID0gYS5tMjEgKiBiLm0xNCArIGEubTIyICogYi5tMjQgKyBhLm0yMyAqIGIubTM0ICsgYS5tMjQgKiBiLm00NDtcblxuICBjLm0zMSA9IGEubTMxICogYi5tMTEgKyBhLm0zMiAqIGIubTIxICsgYS5tMzMgKiBiLm0zMSArIGEubTM0ICogYi5tNDE7XG4gIGMubTMyID0gYS5tMzEgKiBiLm0xMiArIGEubTMyICogYi5tMjIgKyBhLm0zMyAqIGIubTMyICsgYS5tMzQgKiBiLm00MjtcbiAgYy5tMzMgPSBhLm0zMSAqIGIubTEzICsgYS5tMzIgKiBiLm0yMyArIGEubTMzICogYi5tMzMgKyBhLm0zNCAqIGIubTQzO1xuICBjLm0zNCA9IGEubTMxICogYi5tMTQgKyBhLm0zMiAqIGIubTI0ICsgYS5tMzMgKiBiLm0zNCArIGEubTM0ICogYi5tNDQ7XG5cbiAgYy5tNDEgPSBhLm00MSAqIGIubTExICsgYS5tNDIgKiBiLm0yMSArIGEubTQzICogYi5tMzEgKyBhLm00NCAqIGIubTQxO1xuICBjLm00MiA9IGEubTQxICogYi5tMTIgKyBhLm00MiAqIGIubTIyICsgYS5tNDMgKiBiLm0zMiArIGEubTQ0ICogYi5tNDI7XG4gIGMubTQzID0gYS5tNDEgKiBiLm0xMyArIGEubTQyICogYi5tMjMgKyBhLm00MyAqIGIubTMzICsgYS5tNDQgKiBiLm00MztcbiAgYy5tNDQgPSBhLm00MSAqIGIubTE0ICsgYS5tNDIgKiBiLm0yNCArIGEubTQzICogYi5tMzQgKyBhLm00NCAqIGIubTQ0O1xuXG4gIHJldHVybiBjO1xufVxuXG5mdW5jdGlvbiB0cmFuc3Bvc2UobWF0cml4KSB7XG4gIHZhciByZXN1bHQgPSBuZXcgbWF0cml4LmNvbnN0cnVjdG9yKCk7XG4gIHZhciByb3dzID0gNCwgY29scyA9IDQ7XG4gIHZhciBpID0gY29scywgajtcbiAgd2hpbGUgKGkpIHtcbiAgICBqID0gcm93cztcbiAgICB3aGlsZSAoaikge1xuICAgICAgcmVzdWx0WydtJyArIGkgKyBqXSA9IG1hdHJpeFsnbScrIGogKyBpXTtcbiAgICAgIGotLTtcbiAgICB9XG4gICAgaS0tO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qXG4gIElucHV0OiAgbWF0cml4ICAgICAgOyBhIDR4NCBtYXRyaXhcbiAgT3V0cHV0OiB0cmFuc2xhdGlvbiA7IGEgMyBjb21wb25lbnQgdmVjdG9yXG4gICAgICAgICAgc2NhbGUgICAgICAgOyBhIDMgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgIHNrZXcgICAgICAgIDsgc2tldyBmYWN0b3JzIFhZLFhaLFlaIHJlcHJlc2VudGVkIGFzIGEgMyBjb21wb25lbnQgdmVjdG9yXG4gICAgICAgICAgcGVyc3BlY3RpdmUgOyBhIDQgY29tcG9uZW50IHZlY3RvclxuICAgICAgICAgIHJvdGF0ZSAgOyBhIDQgY29tcG9uZW50IHZlY3RvclxuICBSZXR1cm5zIGZhbHNlIGlmIHRoZSBtYXRyaXggY2Fubm90IGJlIGRlY29tcG9zZWQsIHRydWUgaWYgaXQgY2FuXG4qL1xudmFyIFZlY3RvcjQgPSByZXF1aXJlKCcuLi9WZWN0b3I0LmpzJyk7XG5mdW5jdGlvbiBkZWNvbXBvc2UobWF0cml4KSB7XG4gIHZhciBwZXJzcGVjdGl2ZU1hdHJpeCwgcmlnaHRIYW5kU2lkZSwgaW52ZXJzZVBlcnNwZWN0aXZlTWF0cml4LCB0cmFuc3Bvc2VkSW52ZXJzZVBlcnNwZWN0aXZlTWF0cml4LFxuICAgICAgcGVyc3BlY3RpdmUsIHRyYW5zbGF0ZSwgcm93LCBpLCBsZW4sIHNjYWxlLCBza2V3LCBwZHVtMywgcm90YXRlO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgbWF0cml4LlxuICBpZiAobWF0cml4Lm0zMyA9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGZvciAoaSA9IDE7IGkgPD0gNDsgaSsrKSB7XG4gICAgZm9yIChqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgbWF0cml4WydtJytpK2pdIC89IG1hdHJpeC5tNDQ7XG4gICAgfVxuICB9XG5cbiAgLy8gcGVyc3BlY3RpdmVNYXRyaXggaXMgdXNlZCB0byBzb2x2ZSBmb3IgcGVyc3BlY3RpdmUsIGJ1dCBpdCBhbHNvIHByb3ZpZGVzXG4gIC8vIGFuIGVhc3kgd2F5IHRvIHRlc3QgZm9yIHNpbmd1bGFyaXR5IG9mIHRoZSB1cHBlciAzeDMgY29tcG9uZW50LlxuICBwZXJzcGVjdGl2ZU1hdHJpeCA9IG1hdHJpeDtcbiAgcGVyc3BlY3RpdmVNYXRyaXgubTE0ID0gMDtcbiAgcGVyc3BlY3RpdmVNYXRyaXgubTI0ID0gMDtcbiAgcGVyc3BlY3RpdmVNYXRyaXgubTM0ID0gMDtcbiAgcGVyc3BlY3RpdmVNYXRyaXgubTQ0ID0gMTtcblxuICBpZiAoZGV0ZXJtaW5hbnQ0eDQocGVyc3BlY3RpdmVNYXRyaXgpID09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBGaXJzdCwgaXNvbGF0ZSBwZXJzcGVjdGl2ZS5cbiAgaWYgKG1hdHJpeC5tMTQgIT0gMCB8fCBtYXRyaXgubTI0ICE9IDAgfHwgbWF0cml4Lm0zNCAhPSAwKSB7XG4gICAgLy8gcmlnaHRIYW5kU2lkZSBpcyB0aGUgcmlnaHQgaGFuZCBzaWRlIG9mIHRoZSBlcXVhdGlvbi5cbiAgICByaWdodEhhbmRTaWRlID0gbmV3IFZlY3RvcjQobWF0cml4Lm0xNCwgbWF0cml4Lm0yNCwgbWF0cml4Lm0zNCwgbWF0cml4Lm00NCk7XG5cbiAgICAvLyBTb2x2ZSB0aGUgZXF1YXRpb24gYnkgaW52ZXJ0aW5nIHBlcnNwZWN0aXZlTWF0cml4IGFuZCBtdWx0aXBseWluZ1xuICAgIC8vIHJpZ2h0SGFuZFNpZGUgYnkgdGhlIGludmVyc2UuXG4gICAgaW52ZXJzZVBlcnNwZWN0aXZlTWF0cml4ID0gaW52ZXJzZShwZXJzcGVjdGl2ZU1hdHJpeCk7XG4gICAgdHJhbnNwb3NlZEludmVyc2VQZXJzcGVjdGl2ZU1hdHJpeCA9IHRyYW5zcG9zZShpbnZlcnNlUGVyc3BlY3RpdmVNYXRyaXgpO1xuICAgIHBlcnNwZWN0aXZlID0gcmlnaHRIYW5kU2lkZS5tdWx0aXBseUJ5TWF0cml4KHRyYW5zcG9zZWRJbnZlcnNlUGVyc3BlY3RpdmVNYXRyaXgpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIE5vIHBlcnNwZWN0aXZlLlxuICAgIHBlcnNwZWN0aXZlID0gbmV3IFZlY3RvcjQoMCwgMCwgMCwgMSk7XG4gIH1cblxuICAvLyBOZXh0IHRha2UgY2FyZSBvZiB0cmFuc2xhdGlvblxuICB0cmFuc2xhdGUgPSBuZXcgVmVjdG9yNChtYXRyaXgubTQxLCBtYXRyaXgubTQyLCBtYXRyaXgubTQzKTtcblxuICAvLyBOb3cgZ2V0IHNjYWxlIGFuZCBzaGVhci4gJ3JvdycgaXMgYSAzIGVsZW1lbnQgYXJyYXkgb2YgMyBjb21wb25lbnQgdmVjdG9yc1xuICByb3cgPSBbIG5ldyBWZWN0b3I0KCksIG5ldyBWZWN0b3I0KCksIG5ldyBWZWN0b3I0KCkgXTtcbiAgZm9yIChpID0gMSwgbGVuID0gcm93Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcm93W2ktMV0ueCA9IG1hdHJpeFsnbScraSsnMSddO1xuICAgIHJvd1tpLTFdLnkgPSBtYXRyaXhbJ20nK2krJzInXTtcbiAgICByb3dbaS0xXS56ID0gbWF0cml4WydtJytpKyczJ107XG4gIH1cblxuICAvLyBDb21wdXRlIFggc2NhbGUgZmFjdG9yIGFuZCBub3JtYWxpemUgZmlyc3Qgcm93LlxuICBzY2FsZSA9IG5ldyBWZWN0b3I0KCk7XG4gIHNrZXcgPSBuZXcgVmVjdG9yNCgpO1xuXG4gIHNjYWxlLnggPSByb3dbMF0ubGVuZ3RoKCk7XG4gIHJvd1swXSA9IHJvd1swXS5ub3JtYWxpemUoKTtcblxuICAvLyBDb21wdXRlIFhZIHNoZWFyIGZhY3RvciBhbmQgbWFrZSAybmQgcm93IG9ydGhvZ29uYWwgdG8gMXN0LlxuICBza2V3LnggPSByb3dbMF0uZG90KHJvd1sxXSk7XG4gIHJvd1sxXSA9IHJvd1sxXS5jb21iaW5lKHJvd1swXSwgMS4wLCAtc2tldy54KTtcblxuICAvLyBOb3csIGNvbXB1dGUgWSBzY2FsZSBhbmQgbm9ybWFsaXplIDJuZCByb3cuXG4gIHNjYWxlLnkgPSByb3dbMV0ubGVuZ3RoKCk7XG4gIHJvd1sxXSA9IHJvd1sxXS5ub3JtYWxpemUoKTtcbiAgc2tldy54IC89IHNjYWxlLnk7XG5cbiAgLy8gQ29tcHV0ZSBYWiBhbmQgWVogc2hlYXJzLCBvcnRob2dvbmFsaXplIDNyZCByb3dcbiAgc2tldy55ID0gcm93WzBdLmRvdChyb3dbMl0pO1xuICByb3dbMl0gPSByb3dbMl0uY29tYmluZShyb3dbMF0sIDEuMCwgLXNrZXcueSk7XG4gIHNrZXcueiA9IHJvd1sxXS5kb3Qocm93WzJdKTtcbiAgcm93WzJdID0gcm93WzJdLmNvbWJpbmUocm93WzFdLCAxLjAsIC1za2V3LnopO1xuXG4gIC8vIE5leHQsIGdldCBaIHNjYWxlIGFuZCBub3JtYWxpemUgM3JkIHJvdy5cbiAgc2NhbGUueiA9IHJvd1syXS5sZW5ndGgoKTtcbiAgcm93WzJdID0gcm93WzJdLm5vcm1hbGl6ZSgpO1xuICBza2V3LnkgPSAoc2tldy55IC8gc2NhbGUueikgfHwgMDtcbiAgc2tldy56ID0gKHNrZXcueiAvIHNjYWxlLnopIHx8IDA7XG5cbiAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIG1hdHJpeCAoaW4gcm93cykgaXMgb3J0aG9ub3JtYWwuXG4gIC8vIENoZWNrIGZvciBhIGNvb3JkaW5hdGUgc3lzdGVtIGZsaXAuICBJZiB0aGUgZGV0ZXJtaW5hbnRcbiAgLy8gaXMgLTEsIHRoZW4gbmVnYXRlIHRoZSBtYXRyaXggYW5kIHRoZSBzY2FsaW5nIGZhY3RvcnMuXG4gIHBkdW0zID0gcm93WzFdLmNyb3NzKHJvd1syXSk7XG4gIGlmIChyb3dbMF0uZG90KHBkdW0zKSA8IDApIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBzY2FsZS54ICo9IC0xO1xuICAgICAgcm93W2ldLnggKj0gLTE7XG4gICAgICByb3dbaV0ueSAqPSAtMTtcbiAgICAgIHJvd1tpXS56ICo9IC0xO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdywgZ2V0IHRoZSByb3RhdGlvbnMgb3V0XG4gIC8vIEZST00gVzNDXG4gIHJvdGF0ZSA9IG5ldyBWZWN0b3I0KCk7XG4gIHJvdGF0ZS54ID0gMC41ICogTWF0aC5zcXJ0KE1hdGgubWF4KDEgKyByb3dbMF0ueCAtIHJvd1sxXS55IC0gcm93WzJdLnosIDApKTtcbiAgcm90YXRlLnkgPSAwLjUgKiBNYXRoLnNxcnQoTWF0aC5tYXgoMSAtIHJvd1swXS54ICsgcm93WzFdLnkgLSByb3dbMl0ueiwgMCkpO1xuICByb3RhdGUueiA9IDAuNSAqIE1hdGguc3FydChNYXRoLm1heCgxIC0gcm93WzBdLnggLSByb3dbMV0ueSArIHJvd1syXS56LCAwKSk7XG4gIHJvdGF0ZS53ID0gMC41ICogTWF0aC5zcXJ0KE1hdGgubWF4KDEgKyByb3dbMF0ueCArIHJvd1sxXS55ICsgcm93WzJdLnosIDApKTtcblxuICAvLyBpZiAocm93WzJdLnkgPiByb3dbMV0ueikgcm90YXRlWzBdID0gLXJvdGF0ZVswXTtcbiAgLy8gaWYgKHJvd1swXS56ID4gcm93WzJdLngpIHJvdGF0ZVsxXSA9IC1yb3RhdGVbMV07XG4gIC8vIGlmIChyb3dbMV0ueCA+IHJvd1swXS55KSByb3RhdGVbMl0gPSAtcm90YXRlWzJdO1xuXG4gIC8vIEZST00gTU9SRi5KU1xuICByb3RhdGUueSA9IE1hdGguYXNpbigtcm93WzBdLnopO1xuICBpZiAoTWF0aC5jb3Mocm90YXRlLnkpICE9IDApIHtcbiAgICByb3RhdGUueCA9IE1hdGguYXRhbjIocm93WzFdLnosIHJvd1syXS56KTtcbiAgICByb3RhdGUueiA9IE1hdGguYXRhbjIocm93WzBdLnksIHJvd1swXS54KTtcbiAgfSBlbHNlIHtcbiAgICByb3RhdGUueCA9IE1hdGguYXRhbjIoLXJvd1syXS54LCByb3dbMV0ueSk7XG4gICAgcm90YXRlLnogPSAwO1xuICB9XG5cbiAgLy8gRlJPTSBodHRwOi8vYmxvZy5id2hpdGluZy5jby51ay8/cD0yNlxuICAvLyBzY2FsZS54MiA9IE1hdGguc3FydChtYXRyaXgubTExKm1hdHJpeC5tMTEgKyBtYXRyaXgubTIxKm1hdHJpeC5tMjEgKyBtYXRyaXgubTMxKm1hdHJpeC5tMzEpO1xuICAvLyBzY2FsZS55MiA9IE1hdGguc3FydChtYXRyaXgubTEyKm1hdHJpeC5tMTIgKyBtYXRyaXgubTIyKm1hdHJpeC5tMjIgKyBtYXRyaXgubTMyKm1hdHJpeC5tMzIpO1xuICAvLyBzY2FsZS56MiA9IE1hdGguc3FydChtYXRyaXgubTEzKm1hdHJpeC5tMTMgKyBtYXRyaXgubTIzKm1hdHJpeC5tMjMgKyBtYXRyaXgubTMzKm1hdHJpeC5tMzMpO1xuXG4gIC8vIHJvdGF0ZS54MiA9IE1hdGguYXRhbjIobWF0cml4Lm0yMy9zY2FsZS56MiwgbWF0cml4Lm0zMy9zY2FsZS56Mik7XG4gIC8vIHJvdGF0ZS55MiA9IC1NYXRoLmFzaW4obWF0cml4Lm0xMy9zY2FsZS56Mik7XG4gIC8vIHJvdGF0ZS56MiA9IE1hdGguYXRhbjIobWF0cml4Lm0xMi9zY2FsZS55MiwgbWF0cml4Lm0xMS9zY2FsZS54Mik7XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJzcGVjdGl2ZSA6IHBlcnNwZWN0aXZlLFxuICAgIHRyYW5zbGF0ZSAgIDogdHJhbnNsYXRlLFxuICAgIHNrZXcgICAgICAgIDogc2tldyxcbiAgICBzY2FsZSAgICAgICA6IHNjYWxlLFxuICAgIHJvdGF0ZSAgICAgIDogcm90YXRlXG4gIH07XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbGVuZ3RoICAgICAgICAgICA6IGxlbmd0aCxcbiAgbm9ybWFsaXplICAgICAgICA6IG5vcm1hbGl6ZSxcbiAgZG90ICAgICAgICAgICAgICA6IGRvdCxcbiAgY3Jvc3MgICAgICAgICAgICA6IGNyb3NzLFxuICBjb21iaW5lICAgICAgICAgIDogY29tYmluZSxcbiAgbXVsdGlwbHlCeU1hdHJpeCA6IG11bHRpcGx5QnlNYXRyaXhcbn07XG5cbi8qKlxuICogR2V0IHRoZSBsZW5ndGggb2YgdGhlIHZlY3RvclxuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge2Zsb2F0fVxuICovXG5cbmZ1bmN0aW9uIGxlbmd0aCh2ZWN0b3IpIHtcbiAgcmV0dXJuIE1hdGguc3FydCh2ZWN0b3IueCp2ZWN0b3IueCArIHZlY3Rvci55KnZlY3Rvci55ICsgdmVjdG9yLnoqdmVjdG9yLnopO1xufVxuXG5cbi8qKlxuICogR2V0IGEgbm9ybWFsaXplZCByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyB7VmVjdG9yNH1cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUodmVjdG9yKSB7XG4gIHZhciBsZW4gPSBsZW5ndGgodmVjdG9yKSxcbiAgICB2ID0gbmV3IHZlY3Rvci5jb25zdHJ1Y3Rvcih2ZWN0b3IueCAvIGxlbiwgdmVjdG9yLnkgLyBsZW4sIHZlY3Rvci56IC8gbGVuKTtcblxuICByZXR1cm4gdjtcbn1cblxuXG4vKipcbiAqIFZlY3RvciBEb3QtUHJvZHVjdFxuICogQHBhcmFtIHtWZWN0b3I0fSB2IFRoZSBzZWNvbmQgdmVjdG9yIHRvIGFwcGx5IHRoZSBwcm9kdWN0IHRvXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyB7ZmxvYXR9IFRoZSBEb3QtUHJvZHVjdCBvZiBhIGFuZCBiLlxuICovXG5cbmZ1bmN0aW9uIGRvdChhLCBiKSB7XG4gIHJldHVybiBhLngqYi54ICsgYS55KmIueSArIGEueipiLnogKyBhLncqYi53O1xufVxuXG5cbi8qKlxuICogVmVjdG9yIENyb3NzLVByb2R1Y3RcbiAqIEBwYXJhbSB7VmVjdG9yNH0gdiBUaGUgc2Vjb25kIHZlY3RvciB0byBhcHBseSB0aGUgcHJvZHVjdCB0b1xuICogQGF1dGhvciBKb2UgTGFtYmVydFxuICogQHJldHVybnMge1ZlY3RvcjR9IFRoZSBDcm9zcy1Qcm9kdWN0IG9mIGEgYW5kIGIuXG4gKi9cblxuZnVuY3Rpb24gY3Jvc3MoYSwgYikge1xuICByZXR1cm4gbmV3IGEuY29uc3RydWN0b3IoXG4gICAgKGEueSAqIGIueikgLSAoYS56ICogYi55KSxcbiAgICAoYS56ICogYi54KSAtIChhLnggKiBiLnopLFxuICAgIChhLnggKiBiLnkpIC0gKGEueSAqIGIueClcbiAgKTtcbn1cblxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiByZXF1aXJlZCBmb3IgbWF0cml4IGRlY29tcG9zaXRpb25cbiAqIEEgSmF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBwc2V1ZG8gY29kZSBhdmFpbGFibGUgZnJvbSBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLTJkLXRyYW5zZm9ybXMvI21hdHJpeC1kZWNvbXBvc2l0aW9uXG4gKiBAcGFyYW0ge1ZlY3RvcjR9IGFQb2ludCBBIDNEIHBvaW50XG4gKiBAcGFyYW0ge2Zsb2F0fSBhc2NsXG4gKiBAcGFyYW0ge2Zsb2F0fSBic2NsXG4gKiBAYXV0aG9yIEpvZSBMYW1iZXJ0XG4gKiBAcmV0dXJucyB7VmVjdG9yNH1cbiAqL1xuXG5mdW5jdGlvbiBjb21iaW5lKGFQb2ludCwgYlBvaW50LCBhc2NsLCBic2NsKSB7XG4gIHJldHVybiBuZXcgYVBvaW50LmNvbnN0cnVjdG9yKFxuICAgIChhc2NsICogYVBvaW50LngpICsgKGJzY2wgKiBiUG9pbnQueCksXG4gICAgKGFzY2wgKiBhUG9pbnQueSkgKyAoYnNjbCAqIGJQb2ludC55KSxcbiAgICAoYXNjbCAqIGFQb2ludC56KSArIChic2NsICogYlBvaW50LnopXG4gICk7XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5QnlNYXRyaXgodmVjdG9yLCBtYXRyaXgpIHtcbiAgcmV0dXJuIG5ldyB2ZWN0b3IuY29uc3RydWN0b3IoXG4gICAgKG1hdHJpeC5tMTEgKiB2ZWN0b3IueCkgKyAobWF0cml4Lm0xMiAqIHZlY3Rvci55KSArIChtYXRyaXgubTEzICogdmVjdG9yLnopLFxuICAgIChtYXRyaXgubTIxICogdmVjdG9yLngpICsgKG1hdHJpeC5tMjIgKiB2ZWN0b3IueSkgKyAobWF0cml4Lm0yMyAqIHZlY3Rvci56KSxcbiAgICAobWF0cml4Lm0zMSAqIHZlY3Rvci54KSArIChtYXRyaXgubTMyICogdmVjdG9yLnkpICsgKG1hdHJpeC5tMzMgKiB2ZWN0b3IueilcbiAgKTtcbn1cbiIsIi8vIENvbXBvbmVudCBoYW5kbGVzIHN0b3JpbmcgdGhlIHN0YXRlIG9mIGEgQ29tcG9uZW50IHRoYXQgaXMgYXR0YWNoZWQgdG8gYSBOb2RlLlxudmFyIENvbXBvbmVudCA9IGZ1bmN0aW9uKG5vZGUpe1xuICAgIHRoaXMubm9kZSA9IG5vZGUgPyBub2RlIDogbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnQ7XG4iLCJ2YXIgQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9Db21wb25lbnQnKTtcbnZhciBNYXRyaXggPSByZXF1aXJlKCd4Y3NzbWF0cml4Jyk7XG5cbnZhciBET01Db21wb25lbnQgPSBmdW5jdGlvbihub2RlLCBlbGVtLCBjb250YWluZXIpe1xuICAgIHRoaXMubm9kZSA9IG5vZGUuaWQgPyBub2RlLmlkIDogbm9kZTtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLmVsZW0gPSBlbGVtID8gZWxlbSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdmFyIGNvbnRhaW5lciA9IGNvbnRhaW5lciA/IGNvbnRhaW5lciA6IGRvY3VtZW50LmJvZHk7XG5cbiAgICB0aGlzLmVsZW0uZGF0YXNldC5ub2RlID0gdGhpcy5ub2RlO1xuICAgIHRoaXMuZWxlbS5jbGFzc0xpc3QuYWRkKHRoaXMubm9kZSk7XG4gICAgdGhpcy5lbGVtLmNsYXNzTGlzdC5hZGQoJ25vZGUnKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtKTtcblxuICAgIE9iamVjdC5vYnNlcnZlKHRoaXMuX25vZGUsIGZ1bmN0aW9uKGNoYW5nZXMpe1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSh0aGlzLl9ub2RlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdmFyIHByZWZpeCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICcnKSxcbiAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgICAgIC5qb2luKCcnKVxuICAgICAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgICAgIClbMV0sXG4gICAgICAgIGRvbSA9ICgnV2ViS2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgICAgICBpZihkb20gPT09J01veicpe1xuICAgICAgICAgIHRyYW5zZm9ybSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICB9IGVsc2UgaWYoZG9tID09PSdXZWJLaXQnKXtcbiAgICAgICAgICB0cmFuc2Zvcm0gPSAnd2Via2l0VHJhbnNmb3JtJztcbiAgICAgICAgfSBlbHNlIGlmKGRvbSA9PT0nTVMnKXtcbiAgICAgICAgICB0cmFuc2Zvcm0gPSAnbXNUcmFuc2Zvcm0nO1xuICAgICAgICB9IGVsc2UgaWYgKGRvbSA9PT0nTycpe1xuICAgICAgICAgIHRyYW5zZm9ybSA9ICdPVHJhbnNmb3JtJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmFuc2Zvcm0gPSAndHJhbnNmb3JtJztcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZG9tOiBkb20sXG4gICAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKSxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1cbiAgICAgIH07XG4gICAgfTtcbiAgICAvL1xuICAgIHRoaXMudmVuZG9yID0gcHJlZml4KCk7XG5cbiAgICB0aGlzLnRyYW5zZm9ybShub2RlKTtcbn07XG5cbkRPTUNvbXBvbmVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENvbXBvbmVudC5wcm90b3R5cGUpO1xuRE9NQ29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbXBvbmVudDtcblxuXG5ET01Db21wb25lbnQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKG5vZGUpe1xuXG5cblxuICAvLyB2YXIgbWF0cml4ID0gbmV3IE1hdHJpeCgndHJhbnNsYXRlM2QoJytub2RlLnRyYW5zbGF0ZVswXSsncHgsJytub2RlLnRyYW5zbGF0ZVsxXSsncHgsJytub2RlLnRyYW5zbGF0ZVsyXSsncHgpICcrXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICdzY2FsZTNkKCcrbm9kZS5zY2FsZVswXSsnJSwnK25vZGUuc2NhbGVbMV0rJyUsJytub2RlLnNjYWxlWzJdKyclKSAnK1xuICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAncm90YXRlWCgnK25vZGUucm90YXRlWzBdKydkZWcpICcrXG4gIC8vICAgICAgICAgICAgICAgICAgICAgICAgICdyb3RhdGVZKCcrbm9kZS5yb3RhdGVbMV0rJ2RlZykgJytcbiAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdGF0ZVooJytub2RlLnJvdGF0ZVsyXSsnZGVnKScpO1xuICB2YXIgbWF0cml4ID0gbmV3IE1hdHJpeCgpO1xuICBpZihub2RlLnRyYW5zbGF0ZSkge1xuICAgIG1hdHJpeCA9IG1hdHJpeC50cmFuc2xhdGUobm9kZS50cmFuc2xhdGVbMF0sbm9kZS50cmFuc2xhdGVbMV0sbm9kZS50cmFuc2xhdGVbMl0pO1xuICB9XG4gIGlmKG5vZGUuc2NhbGUpIHtcbiAgICBtYXRyaXggPSBtYXRyaXguc2NhbGUobm9kZS5zY2FsZVswXSwgbm9kZS5zY2FsZVsxXSwgbm9kZS5zY2FsZVsyXSk7XG4gIH1cbiAgaWYobm9kZS5yb3RhdGUpIHtcbiAgICBtYXRyaXggPSBtYXRyaXgucm90YXRlKG5vZGUucm90YXRlWzBdLCBub2RlLnJvdGF0ZVsxXSwgbm9kZS5yb3RhdGVbMl0pO1xuICB9XG4gIHRoaXMuZWxlbS5zdHlsZVt0aGlzLnZlbmRvci50cmFuc2Zvcm1dPSBtYXRyaXgudG9TdHJpbmcoKTtcblxuICBpZihub2RlLm9wYWNpdHkpIHtcbiAgICB0aGlzLmVsZW0uc3R5bGUub3BhY2l0eSA9IG5vZGUub3BhY2l0eTtcbiAgfVxuICAvLyBpZihub2RlLnBvc2l0aW9uKSB7XG4gIC8vICAgdGhpcy5lbGVtLnN0eWxlLnBvc2l0aW9uID0gbm9kZS5wb3NpdGlvbjtcbiAgLy8gfVxuICBpZihub2RlLnNpemUpIHtcbiAgICB0aGlzLmVsZW0uc3R5bGUud2lkdGggPSBub2RlLnNpemVbMF0rJ3B4JztcbiAgICB0aGlzLmVsZW0uc3R5bGUuaGVpZ2h0ID0gbm9kZS5zaXplWzFdKydweCc7XG4gIH1cbiAgaWYobm9kZS5vcmlnaW4pIHtcbiAgICAvL3RoaXMuZWxlbS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBub2RlLm9yaWdpblswXSsnJSwnK25vZGUub3JpZ2luWzFdKyclJzsvLycsJytub2RlLm9yaWdpblsyXSsnJSc7XG4gIH1cbiAgLy9UT0RPOiBGaWd1cmUgb3V0IGhvdyB0byBnZXQgYnJvd3NlciB0byBvdXRwdXQgY3NzIG1hdHJpeDNEIHRyYW5zZm9ybVxuXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBET01Db21wb25lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDb21wb25lbnQ6IHJlcXVpcmUoJy4vQ29tcG9uZW50JyksXG4gICAgRE9NQ29tcG9uZW50OiByZXF1aXJlKCcuL0RPTUNvbXBvbmVudCcpXG59O1xuIiwiXG52YXIgRW5naW5lID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMudGltZSA9IDA7XG4gICAgdGhpcy5fd29ya2VyID0gbnVsbDtcbiAgICB0aGlzLnVwZGF0ZVF1ZXVlID0gW107XG5cbn1cblxuRW5naW5lLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24od29ya2VyKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKTtcbiAgICBpZih3b3JrZXIpe1xuICAgICAgICB0aGlzLl93b3JrZXIgPSB3b3JrZXI7XG4gICAgICAgIHRoaXMuX3dvcmtlci5wb3N0TWVzc2FnZSh7aW5pdDonZG9uZSd9KTtcbiAgICB9XG59XG5cbkVuZ2luZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKHRpbWUpe1xuXG4gICAgdmFyIGl0ZW07XG4gICAgdGhpcy50aW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICBpZih0aGlzLl93b3JrZXIpe1xuICAgICAgICB0aGlzLl93b3JrZXIucG9zdE1lc3NhZ2Uoe2ZyYW1lOnRoaXMudGltZX0pO1xuICAgIH1cblxuICAgIHdoaWxlICh0aGlzLnVwZGF0ZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgaXRlbSA9IHRoaXMudXBkYXRlUXVldWUuc2hpZnQoKTtcbiAgICAgIGlmIChpdGVtICYmIGl0ZW0udXBkYXRlKSBpdGVtLnVwZGF0ZSh0aGlzLnRpbWUpO1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5vblVwZGF0ZSkgaXRlbS5vblVwZGF0ZSh0aGlzLnRpbWUpO1xuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRW5naW5lKCk7XG4iLCIvLyBOb2RlIGhhbmRsZXMgc3RvcmluZyB0aGUgc3RhdGUgb2YgYSBub2RlIG9uIHRoZSBTY2VuZSBHcmFwaC5cbnZhciBUcmFuc2l0aW9uYWJsZSA9IHJlcXVpcmUoJy4uL3RyYW5zaXRpb25zL1RyYW5zaXRpb25hYmxlJyk7XG52YXIgQ3VydmVzID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbnMvQ3VydmVzJyk7XG5cbnZhciBfb2JzZXJ2YWJsZUNhbGxiYWNrID0ge307XG5cbnZhciBOb2RlID0gZnVuY3Rpb24oY29uZiwgcGFyZW50KXtcblxuICAgIHRoaXMudHJhbnNpdGlvbmFibGVzID0ge307XG5cbiAgICBpZihjb25mKXtcbiAgICAgICAgdGhpcy5zZXJpYWxpemUoY29uZik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREZWZhdWx0cygpO1xuICAgIH1cblxuICAgIHBhcmVudCA/IHRoaXMucGFyZW50ID0gcGFyZW50IDogdGhpcy5wYXJlbnQgPSBudWxsO1xuXG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXREZWZhdWx0cyA9IGZ1bmN0aW9uKGNvbmYpe1xuICAgIHRoaXMucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMudHJhbnNsYXRlID0gWzAsMCwwXTtcbiAgICB0aGlzLm9yaWdpbiA9IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5hbGlnbiA9IFswLjAsMC4wLDAuMF07XG4gICAgdGhpcy5zaXplID0gWzAsMCwwXTtcbiAgICB0aGlzLnNjYWxlID0gWzEuMCwxLjAsMS4wXTtcbiAgICB0aGlzLnJvdGF0ZSA9IFswLDAsMF07XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oY29uZil7XG4gICAgdGhpcy5pZCA9IGNvbmYuaWQgPyBjb25mLmlkIDogbnVsbDtcbiAgICB0aGlzLnBvc2l0aW9uID0gY29uZi5wb3NpdGlvbiA/IGNvbmYucG9zaXRpb24gOiAnYWJzb2x1dGUnO1xuICAgIHRoaXMudHJhbnNsYXRlID0gY29uZi50cmFuc2xhdGUgPyBjb25mLnRyYW5zbGF0ZSA6IFswLDAsMF07XG4gICAgdGhpcy5vcmlnaW4gPSBjb25mLm9yaWdpbiA/IGNvbmYub3JpZ2luIDogWzAuMCwwLjAsMC4wXTtcbiAgICB0aGlzLmFsaWduID0gY29uZi5hbGlnbiA/IGNvbmYuYWxpZ24gOiBbMC4wLDAuMCwwLjBdO1xuICAgIHRoaXMuc2l6ZSA9IGNvbmYuc2l6ZSA/IGNvbmYuc2l6ZSA6IFswLDAsMF07XG4gICAgdGhpcy5zY2FsZSA9IGNvbmYuc2NhbGUgPyBjb25mLnNjYWxlIDogWzEuMCwxLjAsMS4wXTtcbiAgICB0aGlzLnJvdGF0ZSA9IGNvbmYucm90YXRlID8gY29uZi5yb3RhdGUgOiBbMCwwLDBdO1xuICAgIHRoaXMub3BhY2l0eSA9IGNvbmYub3BhY2l0eSA/IGNvbmYub3BhY2l0eSA6IDEuMDtcbiAgICB0aGlzLm9ic2VydmUodGhpcy5pZCwgdGhpcyk7XG4gICAgY29uZi50cmFuc2l0aW9uID8gdGhpcy5zZXRUcmFuc2l0aW9uYWJsZShjb25mLnRyYW5zaXRpb24pIDogZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgdHJhbnNsYXRlOiB0aGlzLnRyYW5zbGF0ZSxcbiAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgYWxpZ246IHRoaXMuYWxpZ24sXG4gICAgICAgIHNpemU6IHRoaXMuc2l6ZSxcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgIHJvdGF0ZTogdGhpcy5yb3RhdGUsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMub3BhY2l0eSxcbiAgICAgICAgdHJhbnNpdGlvbmFibGVzOiB0aGlzLnRyYW5zaXRpb25hYmxlcy8vLFxuICAgICAgICAvL29ic2VydmFibGVzOiB0aGlzLm9ic2VydmFibGVzXG4gICAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbihwb3Mpe1xuICAgIHRoaXMucG9zaXRpb24gPSBwb3M7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKHBvcyl7XG4gICAgdGhpcy50cmFuc2xhdGUgPSBwb3M7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uKHNpemUpe1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5zaXplO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0U2NhbGUgPSBmdW5jdGlvbihzY2FsZSl7XG4gICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0U2NhbGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnNjYWxlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0T3JpZ2luID0gZnVuY3Rpb24ob3JpZ2luKXtcbiAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbn07XG5cbk5vZGUucHJvdG90eXBlLmdldE9yaWdpbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMub3JpZ2luO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0QWxpZ24gPSBmdW5jdGlvbihhbGlnbil7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0QWxpZ24gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLmFsaWduO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0Um90YXRpb24gPSBmdW5jdGlvbihyb3RhdGlvbil7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uO1xufTtcblxuTm9kZS5wcm90b3R5cGUuZ2V0Um90YXRpb24gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnJvdGF0aW9uO1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0T3BhY2l0eSA9IGZ1bmN0aW9uKG9wYWNpdHkpe1xuICAgIHRoaXMub3BhY2l0eSA9IG9wYWNpdHk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5O1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0VHJhbnNpdGlvbmFibGUgPSBmdW5jdGlvbihjb25mKXtcbiAgICB2YXIgbiAgPSB0aGlzO1xuXG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XSA9IGNvbmY7XG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uID0gbmV3IFRyYW5zaXRpb25hYmxlKGNvbmYuZnJvbSk7XG4gICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLnNldChjb25mLnRvKTtcbiAgICAvL24udHJhbnNpdGlvbmFibGVzW2NvbmYudF0udHJhbnNpdGlvbi5zZXQoY29uZi50byk7XG4gICAgaWYoY29uZi5kZWxheSkge1xuICAgICAgbi50cmFuc2l0KGNvbmYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdXG4gICAgICAgLnRyYW5zaXRpb25cbiAgICAgICAuZnJvbShjb25mLmZyb20pXG4gICAgICAgLnRvKGNvbmYudG8sIGNvbmYuY3VydmUsIGNvbmYuZHVyYXRpb24pO1xuICAgIH1cblxuICAgIHRoaXNbY29uZi50XSA9IGNvbmYudG87XG5cbiAgICBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdLnRyYW5zaXRpb24uaWQgPSB0aGlzLmlkO1xuICAgIG4udHJhbnNpdGlvbmFibGVzW2NvbmYudF0udHJhbnNpdGlvbi5wYXJhbSA9IGNvbmYudDtcbiAgICB0aGlzLm9ic2VydmUodGhpcy5pZCsnLScrY29uZi50LCBuLnRyYW5zaXRpb25hYmxlc1tjb25mLnRdLnRyYW5zaXRpb24uZ2V0KCkpO1xuICAgIC8vY29uc29sZS5sb2coY29uZi50LCB0aGlzW2NvbmYudF0sIG4udHJhbnNpdGlvbmFibGVzW2NvbmYudF0udHJhbnNpdGlvbi5nZXQoKSk7XG4gICAgLy9UT0RPOiBmaWd1cmUgb3V0IGEgYmV0dGVyIHdheSB0byB1cGRhdGUgVHJhbnNpdGlvbmFibGVcbiAgICAvL1RPRE86IHVub2JzZXJ2ZSBvYmplY3QsIGNsZWFySW5lcnZhbFxuXG5cbn07XG5cbk5vZGUucHJvdG90eXBlLnRyYW5zaXQgPSBmdW5jdGlvbihjb25mKXtcbiAgICB2YXIgbiAgPSB0aGlzO1xuICAgIGlmKGNvbmYuZGVsYXkpIHtcblxuICAgICAgbi50cmFuc2l0aW9uYWJsZXNbY29uZi50XS50cmFuc2l0aW9uLmZyb20oY29uZi5mcm9tKS5kZWxheShjb25mLmRlbGF5KS50byhjb25mLnRvLCBjb25mLmN1cnZlLCBjb25mLmR1cmF0aW9uKTtcbiAgICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oaWQsIG9iaikge1xuICAgICAgdmFyIG4gPSB0aGlzO1xuXG4gICAgICBfb2JzZXJ2YWJsZUNhbGxiYWNrW2lkXSA9IGZ1bmN0aW9uKGNoYW5nZXMpe1xuICAgICAgICAgIGNoYW5nZXMuZm9yRWFjaChmdW5jdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmKGNoYW5nZS50eXBlID09PSAndXBkYXRlJyAmJiBjaGFuZ2UubmFtZSAhPT0gJ2lkJykge1xuXG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2hhbmdlLm9iamVjdCk7XG4gICAgICAgICAgICAgIGlmKGNoYW5nZS5vYmplY3QuY29uc3RydWN0b3IubmFtZSA9PT0gJ0FycmF5Jyl7XG5cbiAgICAgICAgICAgICAgICAvL25bY2hhbmdlLm9iamVjdC5wYXJhbV0gPSBjaGFuZ2Uub2JqZWN0O1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coY2hhbmdlKTtcbiAgICAgICAgICAgICAgICBuLnBhcmVudC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3A6ICdyb3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWw6IGNoYW5nZS5vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiBuLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSBpZihjaGFuZ2Uub2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09ICdUcmFuc2l0aW9uYWJsZScpe1xuICAgICAgICAgICAgICAgIG5bY2hhbmdlLm9iamVjdC5wYXJhbV0gPSBjaGFuZ2Uub2xkVmFsdWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coe1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgbWVzc2FnZTp7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHByb3A6IGNoYW5nZS5uYW1lLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB2YWw6IGNoYW5nZS5vbGRWYWx1ZVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgIG5vZGU6IG4uaWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBuLnBhcmVudC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3A6IGNoYW5nZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWw6IGNoYW5nZS5vbGRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IG4uaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBtZXNzYWdlOntcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgcHJvcDogY2hhbmdlLm5hbWUsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHZhbDogY2hhbmdlLm9sZFZhbHVlXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgbm9kZTogbi5pZFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBPYmplY3Qub2JzZXJ2ZShvYmosIF9vYnNlcnZhYmxlQ2FsbGJhY2tbaWRdKTtcblxufTtcblxuTm9kZS5wcm90b3R5cGUudW5vYnNlcnZlID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICBPYmplY3QudW5vYnNlcnZlKHRoaXMsIF9vYnNlcnZhYmxlQ2FsbGJhY2tbdGhpcy5pZF0pO1xufTtcblxuXG5Ob2RlLnByb3RvdHlwZS5ldmVudE1hbmFnZXIgPSBmdW5jdGlvbigpe1xuXG4gIHZhciBldmVudHMgPSB7fTtcbiAgdmFyIGhhc0V2ZW50ID0gZXZlbnRzLmhhc093blByb3BlcnR5O1xuXG4gIHJldHVybiB7XG4gICAgc3ViOiBmdW5jdGlvbihldiwgbGlzdGVuZXIpIHtcblxuICAgICAgdGhpcy5vYnNlcnZlKGV2LCB0aGlzKTtcbiAgICAgIC8vIENyZWF0ZSB0aGUgZXZlbnQncyBvYmplY3QgaWYgbm90IHlldCBjcmVhdGVkXG4gICAgICBpZighaGFzRXZlbnQuY2FsbChldmVudHMsIGV2KSkgZXZlbnRzW2V2XSA9IFtdO1xuXG4gICAgICAvLyBBZGQgdGhlIGxpc3RlbmVyIHRvIHF1ZXVlXG4gICAgICB2YXIgaW5kZXggPSBldmVudHNbZXZdLnB1c2gobGlzdGVuZXIpIC0gMTtcblxuICAgICAgLy8gUHJvdmlkZSBoYW5kbGUgYmFjayBmb3IgcmVtb3ZhbCBvZiB0b3BpY1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGlzLnVub2JzZXJ2ZShldik7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1tldl1baW5kZXhdO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgcHViOiBmdW5jdGlvbihldiwgaW5mbykge1xuICAgICAgLy8gSWYgdGhlIGV2ZW50IGRvZXNuJ3QgZXhpc3QsIG9yIHRoZXJlJ3Mgbm8gbGlzdGVuZXJzIGluIHF1ZXVlLCBqdXN0IGxlYXZlXG4gICAgICBpZighaGFzRXZlbnQuY2FsbChldmVudHMsIGV2KSkgcmV0dXJuO1xuXG4gICAgICAvLyBDeWNsZSB0aHJvdWdoIGV2ZW50cyBxdWV1ZSwgZmlyZSFcbiAgICAgIGV2ZW50c1tldl0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBcdFx0aXRlbShpbmZvICE9IHVuZGVmaW5lZCA/IGluZm8gOiB7fSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuXG5Ob2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihmcmFtZSl7XG4gIGZvcih2YXIgaWQgaW4gdGhpcy50cmFuc2l0aW9uYWJsZXMpIHtcbiAgICB0aGlzLnRyYW5zaXRpb25hYmxlc1tpZF0udHJhbnNpdGlvbi5nZXQoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuIiwidmFyIGN4dCA9IHNlbGY7XG5cbnZhciBTY2VuZSA9IGZ1bmN0aW9uKGdyYXBoKXtcblxuICAgIHRoaXMuZ3JhcGggPSBncmFwaCB8fCB7fTtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG5cbn1cblxuU2NlbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih3b3JrZXIpIHtcbiAgICBpZih3b3JrZXIpe1xuICAgICAgICB0aGlzLndvcmtlciA9IHdvcmtlcjtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy53b3JrZXIpO1xufVxuXG5TY2VuZS5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbihub2RlKXtcbiAgICBub2RlLmlkID0gJ25vZGUtJyt0aGlzLmxlbmd0aDtcbiAgICB0aGlzLmxlbmd0aCsrO1xuICAgIHRoaXMuZ3JhcGhbbm9kZS5pZF0gPSBub2RlO1xufVxuXG5cblNjZW5lLnByb3RvdHlwZS5mZXRjaE5vZGUgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiB0aGlzLmdyYXBoW2lkXTtcbn1cblxuU2NlbmUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihxdWVyeSkge1xuICAgIHZhciBxdWVyeUFycmF5ID0gW107XG4gICAgZm9yKHEgaW4gcXVlcnkpe1xuICAgICAgICBmb3IocHJvcCBpbiB0aGlzLmdyYXBoKSB7XG4gICAgICAgICAgICBmb3IocCBpbiB0aGlzLmdyYXBoW3Byb3BdKXtcbiAgICAgICAgICAgICAgICBpZiAocCA9PT0gcSAmJiB0aGlzLmdyYXBoW3Byb3BdW3BdID09PSBxdWVyeVtxXSkge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeUFycmF5LnB1c2godGhpcy5ncmFwaFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBxdWVyeUFycmF5O1xufVxuXG5TY2VuZS5wcm90b3R5cGUuZmluZE9uZSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cbiAgICBmb3IocSBpbiBxdWVyeSl7XG4gICAgICAgIGZvcihwcm9wIGluIHRoaXMuZ3JhcGgpIHtcbiAgICAgICAgICAgIGZvcihwIGluIHRoaXMuZ3JhcGhbcHJvcF0pe1xuICAgICAgICAgICAgICAgIGlmIChwID09PSBxICYmIHRoaXMuZ3JhcGhbcHJvcF1bcF0gPT09IHF1ZXJ5W3FdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdyYXBoW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5TY2VuZS5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKGZyYW1lKXtcbiAgZm9yKHZhciBub2RlIGluIHRoaXMuZ3JhcGgpIHtcbiAgICB0aGlzLmdyYXBoW25vZGVdLnVwZGF0ZShmcmFtZSk7XG4gIH1cbn1cblxuU2NlbmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNoYW5nZSl7XG4gIGN4dC5wb3N0TWVzc2FnZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNoYW5nZSkpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2NlbmUoKTtcbiIsIi8qXG4gIFRlc3RlZCBhZ2FpbnN0IENocm9taXVtIGJ1aWxkIHdpdGggT2JqZWN0Lm9ic2VydmUgYW5kIGFjdHMgRVhBQ1RMWSB0aGUgc2FtZSxcbiAgdGhvdWdoIENocm9taXVtIGJ1aWxkIGlzIE1VQ0ggZmFzdGVyXG5cbiAgVHJ5aW5nIHRvIHN0YXkgYXMgY2xvc2UgdG8gdGhlIHNwZWMgYXMgcG9zc2libGUsXG4gIHRoaXMgaXMgYSB3b3JrIGluIHByb2dyZXNzLCBmZWVsIGZyZWUgdG8gY29tbWVudC91cGRhdGVcblxuICBTcGVjaWZpY2F0aW9uOlxuICAgIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZVxuXG4gIEJ1aWx0IHVzaW5nIHBhcnRzIG9mOlxuICAgIGh0dHBzOi8vZ2l0aHViLmNvbS90dmN1dHNlbS9oYXJtb255LXJlZmxlY3QvYmxvYi9tYXN0ZXIvZXhhbXBsZXMvb2JzZXJ2ZXIuanNcblxuICBMaW1pdHMgc28gZmFyO1xuICAgIEJ1aWx0IHVzaW5nIHBvbGxpbmcuLi4gV2lsbCB1cGRhdGUgYWdhaW4gd2l0aCBwb2xsaW5nL2dldHRlciZzZXR0ZXJzIHRvIG1ha2UgdGhpbmdzIGJldHRlciBhdCBzb21lIHBvaW50XG5cblRPRE86XG4gIEFkZCBzdXBwb3J0IGZvciBPYmplY3QucHJvdG90eXBlLndhdGNoIC0+IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC93YXRjaFxuKi9cbmlmKCFPYmplY3Qub2JzZXJ2ZSl7XG4gIChmdW5jdGlvbihleHRlbmQsIGdsb2JhbCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGlzQ2FsbGFibGUgPSAoZnVuY3Rpb24odG9TdHJpbmcpe1xuICAgICAgICB2YXIgcyA9IHRvU3RyaW5nLmNhbGwodG9TdHJpbmcpLFxuICAgICAgICAgICAgdSA9IHR5cGVvZiB1O1xuICAgICAgICByZXR1cm4gdHlwZW9mIGdsb2JhbC5hbGVydCA9PT0gXCJvYmplY3RcIiA/XG4gICAgICAgICAgZnVuY3Rpb24gaXNDYWxsYWJsZShmKXtcbiAgICAgICAgICAgIHJldHVybiBzID09PSB0b1N0cmluZy5jYWxsKGYpIHx8ICghIWYgJiYgdHlwZW9mIGYudG9TdHJpbmcgPT0gdSAmJiB0eXBlb2YgZi52YWx1ZU9mID09IHUgJiYgL15cXHMqXFxiZnVuY3Rpb25cXGIvLnRlc3QoXCJcIiArIGYpKTtcbiAgICAgICAgICB9OlxuICAgICAgICAgIGZ1bmN0aW9uIGlzQ2FsbGFibGUoZil7XG4gICAgICAgICAgICByZXR1cm4gcyA9PT0gdG9TdHJpbmcuY2FsbChmKTtcbiAgICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9KShleHRlbmQucHJvdG90eXBlLnRvU3RyaW5nKTtcbiAgICAvLyBpc05vZGUgJiBpc0VsZW1lbnQgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM4NDI4Ni9qYXZhc2NyaXB0LWlzZG9tLWhvdy1kby15b3UtY2hlY2staWYtYS1qYXZhc2NyaXB0LW9iamVjdC1pcy1hLWRvbS1vYmplY3RcbiAgICAvL1JldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIERPTSBub2RlXG4gICAgdmFyIGlzTm9kZSA9IGZ1bmN0aW9uIGlzTm9kZShvKXtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHR5cGVvZiBOb2RlID09PSBcIm9iamVjdFwiID8gbyBpbnN0YW5jZW9mIE5vZGUgOlxuICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvLm5vZGVUeXBlID09PSBcIm51bWJlclwiICYmIHR5cGVvZiBvLm5vZGVOYW1lPT09XCJzdHJpbmdcIlxuICAgICAgKTtcbiAgICB9XG4gICAgLy9SZXR1cm5zIHRydWUgaWYgaXQgaXMgYSBET00gZWxlbWVudFxuICAgIHZhciBpc0VsZW1lbnQgPSBmdW5jdGlvbiBpc0VsZW1lbnQobyl7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIgPyBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiAvL0RPTTJcbiAgICAgICAgbyAmJiB0eXBlb2YgbyA9PT0gXCJvYmplY3RcIiAmJiBvICE9PSBudWxsICYmIG8ubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG8ubm9kZU5hbWU9PT1cInN0cmluZ1wiXG4gICAgKTtcbiAgICB9XG4gICAgdmFyIF9pc0ltbWVkaWF0ZVN1cHBvcnRlZCA9IChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuICEhZ2xvYmFsLnNldEltbWVkaWF0ZTtcbiAgICB9KSgpO1xuICAgIHZhciBfZG9DaGVja0NhbGxiYWNrID0gKGZ1bmN0aW9uKCl7XG4gICAgICBpZihfaXNJbW1lZGlhdGVTdXBwb3J0ZWQpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX2RvQ2hlY2tDYWxsYmFjayhmKXtcbiAgICAgICAgICByZXR1cm4gc2V0SW1tZWRpYXRlKGYpO1xuICAgICAgICB9O1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfZG9DaGVja0NhbGxiYWNrKGYpe1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGYsIDEwKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KSgpO1xuICAgIHZhciBfY2xlYXJDaGVja0NhbGxiYWNrID0gKGZ1bmN0aW9uKCl7XG4gICAgICBpZihfaXNJbW1lZGlhdGVTdXBwb3J0ZWQpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX2NsZWFyQ2hlY2tDYWxsYmFjayhpZCl7XG4gICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgICAgICB9O1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfY2xlYXJDaGVja0NhbGxiYWNrKGlkKXtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pKCk7XG4gICAgdmFyIGlzTnVtZXJpYz1mdW5jdGlvbiBpc051bWVyaWMobil7XG4gICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH07XG4gICAgdmFyIHNhbWVWYWx1ZSA9IGZ1bmN0aW9uIHNhbWVWYWx1ZSh4LCB5KXtcbiAgICAgIGlmKHg9PT15KXtcbiAgICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9O1xuICAgIHZhciBpc0FjY2Vzc29yRGVzY3JpcHRvciA9IGZ1bmN0aW9uIGlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2Mpe1xuICAgICAgaWYgKHR5cGVvZihkZXNjKSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gKCdnZXQnIGluIGRlc2MgfHwgJ3NldCcgaW4gZGVzYyk7XG4gICAgfTtcbiAgICB2YXIgaXNEYXRhRGVzY3JpcHRvciA9IGZ1bmN0aW9uIGlzRGF0YURlc2NyaXB0b3IoZGVzYyl7XG4gICAgICBpZiAodHlwZW9mKGRlc2MpID09PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoJ3ZhbHVlJyBpbiBkZXNjIHx8ICd3cml0YWJsZScgaW4gZGVzYyk7XG4gICAgfTtcblxuICAgIHZhciB2YWxpZGF0ZUFyZ3VtZW50cyA9IGZ1bmN0aW9uIHZhbGlkYXRlQXJndW1lbnRzKE8sIGNhbGxiYWNrLCBhY2NlcHQpe1xuICAgICAgaWYodHlwZW9mKE8pIT09J29iamVjdCcpe1xuICAgICAgICAvLyBUaHJvdyBFcnJvclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0Lm9ic2VydmVPYmplY3QgY2FsbGVkIG9uIG5vbi1vYmplY3RcIik7XG4gICAgICB9XG4gICAgICBpZihpc0NhbGxhYmxlKGNhbGxiYWNrKT09PWZhbHNlKXtcbiAgICAgICAgLy8gVGhyb3cgRXJyb3JcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5vYnNlcnZlT2JqZWN0OiBFeHBlY3RpbmcgZnVuY3Rpb25cIik7XG4gICAgICB9XG4gICAgICBpZihPYmplY3QuaXNGcm96ZW4oY2FsbGJhY2spPT09dHJ1ZSl7XG4gICAgICAgIC8vIFRocm93IEVycm9yXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJPYmplY3Qub2JzZXJ2ZU9iamVjdDogRXhwZWN0aW5nIHVuZnJvemVuIGZ1bmN0aW9uXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGFjY2VwdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhY2NlcHQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5vYnNlcnZlT2JqZWN0OiBFeHBlY3RpbmcgYWNjZXB0TGlzdCBpbiB0aGUgZm9ybSBvZiBhbiBhcnJheVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gT2JzZXJ2ZXIoKXtcbiAgICAgIHZhciB3cmFwZWQgPSBbXTtcbiAgICAgIHZhciBPYnNlcnZlciA9IGZ1bmN0aW9uIE9ic2VydmVyKE8sIGNhbGxiYWNrLCBhY2NlcHQpe1xuICAgICAgICB2YWxpZGF0ZUFyZ3VtZW50cyhPLCBjYWxsYmFjaywgYWNjZXB0KTtcbiAgICAgICAgaWYgKCFhY2NlcHQpIHtcbiAgICAgICAgICBhY2NlcHQgPSBbXCJhZGRcIiwgXCJ1cGRhdGVcIiwgXCJkZWxldGVcIiwgXCJyZWNvbmZpZ3VyZVwiLCBcInNldFByb3RvdHlwZVwiLCBcInByZXZlbnRFeHRlbnNpb25zXCJdO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5nZXROb3RpZmllcihPKS5hZGRMaXN0ZW5lcihjYWxsYmFjaywgYWNjZXB0KTtcbiAgICAgICAgaWYod3JhcGVkLmluZGV4T2YoTyk9PT0tMSl7XG4gICAgICAgICAgd3JhcGVkLnB1c2goTyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIE9iamVjdC5nZXROb3RpZmllcihPKS5fY2hlY2tQcm9wZXJ0eUxpc3RpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgT2JzZXJ2ZXIucHJvdG90eXBlLmRlbGl2ZXJDaGFuZ2VSZWNvcmRzID0gZnVuY3Rpb24gT2JzZXJ2ZXJfZGVsaXZlckNoYW5nZVJlY29yZHMoTyl7XG4gICAgICAgIE9iamVjdC5nZXROb3RpZmllcihPKS5kZWxpdmVyQ2hhbmdlUmVjb3JkcygpO1xuICAgICAgfTtcblxuICAgICAgd3JhcGVkLmxhc3RTY2FubmVkID0gMDtcbiAgICAgIHZhciBmID0gKGZ1bmN0aW9uIGYod3JhcHBlZCl7XG4gICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBfZigpe1xuICAgICAgICAgICAgICAgIHZhciBpID0gMCwgbCA9IHdyYXBwZWQubGVuZ3RoLCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLCB0YWtpbmdUb29Mb25nPWZhbHNlO1xuICAgICAgICAgICAgICAgIGZvcihpPXdyYXBwZWQubGFzdFNjYW5uZWQ7IChpPGwpJiYoIXRha2luZ1Rvb0xvbmcpOyBpKyspe1xuICAgICAgICAgICAgICAgICAgaWYoX2luZGV4ZXMuaW5kZXhPZih3cmFwcGVkW2ldKSA+IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmdldE5vdGlmaWVyKHdyYXBwZWRbaV0pLl9jaGVja1Byb3BlcnR5TGlzdGluZygpO1xuICAgICAgICAgICAgICAgICAgICB0YWtpbmdUb29Mb25nPSgobmV3IERhdGUoKSktc3RhcnRUaW1lKT4xMDA7IC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCB0YWtlIG1vcmUgdGhhbiAxMDAgbWlsbGlzZWNvbmRzIHRvIHNjYW4gYWxsIG9iamVjdHNcbiAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVkLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgICAgICBsLS07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdyYXBwZWQubGFzdFNjYW5uZWQ9aTxsP2k6MDsgLy8gcmVzZXQgd3JhcHBlZCBzbyB3ZSBjYW4gbWFrZSBzdXJlIHRoYXQgd2UgcGljayB0aGluZ3MgYmFjayB1cFxuICAgICAgICAgICAgICAgIF9kb0NoZWNrQ2FsbGJhY2soX2YpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkod3JhcGVkKTtcbiAgICAgIF9kb0NoZWNrQ2FsbGJhY2soZik7XG4gICAgICByZXR1cm4gT2JzZXJ2ZXI7XG4gICAgfSkoKTtcblxuICAgIHZhciBOb3RpZmllciA9IGZ1bmN0aW9uIE5vdGlmaWVyKHdhdGNoaW5nKXtcbiAgICB2YXIgX2xpc3RlbmVycyA9IFtdLCBfYWNjZXB0TGlzdHMgPSBbXSwgX3VwZGF0ZXMgPSBbXSwgX3VwZGF0ZXIgPSBmYWxzZSwgcHJvcGVydGllcyA9IFtdLCB2YWx1ZXMgPSBbXTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCAnX3dhdGNoaW5nJywge1xuICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGdldDogKGZ1bmN0aW9uKHdhdGNoZWQpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2F0Y2hlZDtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIH0pKHdhdGNoaW5nKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgdmFyIHdyYXBQcm9wZXJ0eSA9IGZ1bmN0aW9uIHdyYXBQcm9wZXJ0eShvYmplY3QsIHByb3Ape1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2Yob2JqZWN0W3Byb3BdKSwgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wKTtcbiAgICAgICAgaWYoKHByb3A9PT0nZ2V0Tm90aWZpZXInKXx8aXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzY3JpcHRvcil8fCghZGVzY3JpcHRvci5lbnVtZXJhYmxlKSl7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKChvYmplY3QgaW5zdGFuY2VvZiBBcnJheSkmJmlzTnVtZXJpYyhwcm9wKSl7XG4gICAgICAgICAgdmFyIGlkeCA9IHByb3BlcnRpZXMubGVuZ3RoO1xuICAgICAgICAgIHByb3BlcnRpZXNbaWR4XSA9IHByb3A7XG4gICAgICAgICAgdmFsdWVzW2lkeF0gPSBvYmplY3RbcHJvcF07XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uKGlkeCwgcHJvcCl7XG4gICAgICAgICAgcHJvcGVydGllc1tpZHhdID0gcHJvcDtcbiAgICAgICAgICB2YWx1ZXNbaWR4XSA9IG9iamVjdFtwcm9wXTtcbiAgICAgICAgICBmdW5jdGlvbiBnZXR0ZXIoKXtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbZ2V0dGVyLmluZm8uaWR4XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZnVuY3Rpb24gc2V0dGVyKHZhbHVlKXtcbiAgICAgICAgICAgIGlmKCFzYW1lVmFsdWUodmFsdWVzW3NldHRlci5pbmZvLmlkeF0sIHZhbHVlKSl7XG4gICAgICAgICAgICAgIE9iamVjdC5nZXROb3RpZmllcihvYmplY3QpLnF1ZXVlVXBkYXRlKG9iamVjdCwgcHJvcCwgJ3VwZGF0ZScsIHZhbHVlc1tzZXR0ZXIuaW5mby5pZHhdKTtcbiAgICAgICAgICAgICAgdmFsdWVzW3NldHRlci5pbmZvLmlkeF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZ2V0dGVyLmluZm8gPSBzZXR0ZXIuaW5mbyA9IHtcbiAgICAgICAgICAgIGlkeDogaWR4XG4gICAgICAgICAgfTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wLCB7XG4gICAgICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgICAgIHNldDogc2V0dGVyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKHByb3BlcnRpZXMubGVuZ3RoLCBwcm9wKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgICAgc2VsZi5fY2hlY2tQcm9wZXJ0eUxpc3RpbmcgPSBmdW5jdGlvbiBfY2hlY2tQcm9wZXJ0eUxpc3RpbmcoZG9udFF1ZXVlVXBkYXRlcyl7XG4gICAgICAgIHZhciBvYmplY3QgPSBzZWxmLl93YXRjaGluZywga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCksIGk9MCwgbD1rZXlzLmxlbmd0aDtcbiAgICAgICAgdmFyIG5ld0tleXMgPSBbXSwgb2xkS2V5cyA9IHByb3BlcnRpZXMuc2xpY2UoMCksIHVwZGF0ZXMgPSBbXTtcbiAgICAgICAgdmFyIHByb3AsIHF1ZXVlVXBkYXRlcyA9ICFkb250UXVldWVVcGRhdGVzLCBwcm9wVHlwZSwgdmFsdWUsIGlkeCwgYUxlbmd0aDtcblxuICAgICAgICBpZihvYmplY3QgaW5zdGFuY2VvZiBBcnJheSl7XG4gICAgICAgICAgYUxlbmd0aCA9IHNlbGYuX29sZExlbmd0aDsvL29iamVjdC5sZW5ndGg7XG4gICAgICAgICAgLy9hTGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpPTA7IGk8bDsgaSsrKXtcbiAgICAgICAgICBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtwcm9wXTtcbiAgICAgICAgICBwcm9wVHlwZSA9IHR5cGVvZih2YWx1ZSk7XG4gICAgICAgICAgaWYoKGlkeCA9IHByb3BlcnRpZXMuaW5kZXhPZihwcm9wKSk9PT0tMSl7XG4gICAgICAgICAgICBpZih3cmFwUHJvcGVydHkob2JqZWN0LCBwcm9wKSYmcXVldWVVcGRhdGVzKXtcbiAgICAgICAgICAgICAgc2VsZi5xdWV1ZVVwZGF0ZShvYmplY3QsIHByb3AsICdhZGQnLCBudWxsLCBvYmplY3RbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgaWYoIShvYmplY3QgaW5zdGFuY2VvZiBBcnJheSl8fChpc051bWVyaWMocHJvcCkpKXtcbiAgICAgICAgICAgICAgaWYodmFsdWVzW2lkeF0gIT09IHZhbHVlKXtcbiAgICAgICAgICAgICAgICBpZihxdWV1ZVVwZGF0ZXMpe1xuICAgICAgICAgICAgICAgICAgc2VsZi5xdWV1ZVVwZGF0ZShvYmplY3QsIHByb3AsICd1cGRhdGUnLCB2YWx1ZXNbaWR4XSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZXNbaWR4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbGRLZXlzLnNwbGljZShvbGRLZXlzLmluZGV4T2YocHJvcCksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5ICYmIG9iamVjdC5sZW5ndGggIT09IGFMZW5ndGgpe1xuICAgICAgICAgIGlmKHF1ZXVlVXBkYXRlcyl7XG4gICAgICAgICAgICBzZWxmLnF1ZXVlVXBkYXRlKG9iamVjdCwgJ2xlbmd0aCcsICd1cGRhdGUnLCBhTGVuZ3RoLCBvYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLl9vbGRMZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYocXVldWVVcGRhdGVzKXtcbiAgICAgICAgICBsID0gb2xkS2V5cy5sZW5ndGg7XG4gICAgICAgICAgZm9yKGk9MDsgaTxsOyBpKyspe1xuICAgICAgICAgICAgaWR4ID0gcHJvcGVydGllcy5pbmRleE9mKG9sZEtleXNbaV0pO1xuICAgICAgICAgICAgc2VsZi5xdWV1ZVVwZGF0ZShvYmplY3QsIG9sZEtleXNbaV0sICdkZWxldGUnLCB2YWx1ZXNbaWR4XSk7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnNwbGljZShpZHgsMSk7XG4gICAgICAgICAgICB2YWx1ZXMuc3BsaWNlKGlkeCwxKTtcbiAgICAgICAgICAgIGZvcih2YXIgaT1pZHg7aTxwcm9wZXJ0aWVzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICBpZighKHByb3BlcnRpZXNbaV0gaW4gb2JqZWN0KSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LHByb3BlcnRpZXNbaV0pLmdldDtcbiAgICAgICAgICAgICAgaWYoIWdldHRlcilcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgdmFyIGluZm8gPSBnZXR0ZXIuaW5mbztcbiAgICAgICAgICAgICAgaW5mby5pZHggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZWxmLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gTm90aWZpZXJfYWRkTGlzdGVuZXIoY2FsbGJhY2ssIGFjY2VwdCl7XG4gICAgICAgIHZhciBpZHggPSBfbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuICAgICAgICBpZihpZHg9PT0tMSl7XG4gICAgICAgICAgX2xpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICBfYWNjZXB0TGlzdHMucHVzaChhY2NlcHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIF9hY2NlcHRMaXN0c1tpZHhdID0gYWNjZXB0O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIE5vdGlmaWVyX3JlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKXtcbiAgICAgICAgdmFyIGlkeCA9IF9saXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgIGlmKGlkeD4tMSl7XG4gICAgICAgICAgX2xpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICBfYWNjZXB0TGlzdHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZWxmLmxpc3RlbmVycyA9IGZ1bmN0aW9uIE5vdGlmaWVyX2xpc3RlbmVycygpe1xuICAgICAgICByZXR1cm4gX2xpc3RlbmVycztcbiAgICAgIH07XG4gICAgICBzZWxmLnF1ZXVlVXBkYXRlID0gZnVuY3Rpb24gTm90aWZpZXJfcXVldWVVcGRhdGUod2hhdCwgcHJvcCwgdHlwZSwgd2FzKXtcbiAgICAgICAgdGhpcy5xdWV1ZVVwZGF0ZXMoW3tcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIG9iamVjdDogd2hhdCxcbiAgICAgICAgICBuYW1lOiBwcm9wLFxuICAgICAgICAgIG9sZFZhbHVlOiB3YXNcbiAgICAgICAgfV0pO1xuICAgICAgfTtcbiAgICAgIHNlbGYucXVldWVVcGRhdGVzID0gZnVuY3Rpb24gTm90aWZpZXJfcXVldWVVcGRhdGVzKHVwZGF0ZXMpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIGkgPSAwLCBsID0gdXBkYXRlcy5sZW5ndGh8fDAsIHVwZGF0ZTtcbiAgICAgICAgZm9yKGk9MDsgaTxsOyBpKyspe1xuICAgICAgICAgIHVwZGF0ZSA9IHVwZGF0ZXNbaV07XG4gICAgICAgICAgX3VwZGF0ZXMucHVzaCh1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmKF91cGRhdGVyKXtcbiAgICAgICAgICBfY2xlYXJDaGVja0NhbGxiYWNrKF91cGRhdGVyKTtcbiAgICAgICAgfVxuICAgICAgICBfdXBkYXRlciA9IF9kb0NoZWNrQ2FsbGJhY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICBfdXBkYXRlciA9IGZhbHNlO1xuICAgICAgICAgIHNlbGYuZGVsaXZlckNoYW5nZVJlY29yZHMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgc2VsZi5kZWxpdmVyQ2hhbmdlUmVjb3JkcyA9IGZ1bmN0aW9uIE5vdGlmaWVyX2RlbGl2ZXJDaGFuZ2VSZWNvcmRzKCl7XG4gICAgICAgIHZhciBpID0gMCwgbCA9IF9saXN0ZW5lcnMubGVuZ3RoLFxuICAgICAgICAgICAgLy9rZWVwUnVubmluZyA9IHRydWUsIHJlbW92ZWQgYXMgaXQgc2VlbXMgdGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBkb2Vzbid0IGRvIHRoaXNcbiAgICAgICAgICAgIC8vIEluIHJlc3BvbnNlIHRvIEJVRyAjNVxuICAgICAgICAgICAgcmV0dmFsO1xuICAgICAgICBmb3IoaT0wOyBpPGw7IGkrKyl7XG4gICAgICAgICAgaWYoX2xpc3RlbmVyc1tpXSl7XG4gICAgICAgICAgICB2YXIgY3VycmVudFVwZGF0ZXM7XG4gICAgICAgICAgICBpZiAoX2FjY2VwdExpc3RzW2ldKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRVcGRhdGVzID0gW107XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCB1cGRhdGVzTGVuZ3RoID0gX3VwZGF0ZXMubGVuZ3RoOyBqIDwgdXBkYXRlc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9hY2NlcHRMaXN0c1tpXS5pbmRleE9mKF91cGRhdGVzW2pdLnR5cGUpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgY3VycmVudFVwZGF0ZXMucHVzaChfdXBkYXRlc1tqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY3VycmVudFVwZGF0ZXMgPSBfdXBkYXRlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdXJyZW50VXBkYXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgaWYoX2xpc3RlbmVyc1tpXT09PWNvbnNvbGUubG9nKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50VXBkYXRlcyk7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIF9saXN0ZW5lcnNbaV0oY3VycmVudFVwZGF0ZXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF91cGRhdGVzPVtdO1xuICAgICAgfTtcbiAgICAgIHNlbGYubm90aWZ5ID0gZnVuY3Rpb24gTm90aWZpZXJfbm90aWZ5KGNoYW5nZVJlY29yZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNoYW5nZVJlY29yZCAhPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2hhbmdlUmVjb3JkLnR5cGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBjaGFuZ2VSZWNvcmQgd2l0aCBub24tc3RyaW5nICd0eXBlJyBwcm9wZXJ0eVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjaGFuZ2VSZWNvcmQub2JqZWN0ID0gd2F0Y2hpbmc7XG4gICAgICAgIHNlbGYucXVldWVVcGRhdGVzKFtjaGFuZ2VSZWNvcmRdKTtcbiAgICAgIH07XG4gICAgICBzZWxmLl9jaGVja1Byb3BlcnR5TGlzdGluZyh0cnVlKTtcbiAgICB9O1xuXG4gICAgdmFyIF9ub3RpZmllcnM9W10sIF9pbmRleGVzPVtdO1xuICAgIGV4dGVuZC5nZXROb3RpZmllciA9IGZ1bmN0aW9uIE9iamVjdF9nZXROb3RpZmllcihPKXtcbiAgICB2YXIgaWR4ID0gX2luZGV4ZXMuaW5kZXhPZihPKSwgbm90aWZpZXIgPSBpZHg+LTE/X25vdGlmaWVyc1tpZHhdOmZhbHNlO1xuICAgICAgaWYoIW5vdGlmaWVyKXtcbiAgICAgICAgaWR4ID0gX2luZGV4ZXMubGVuZ3RoO1xuICAgICAgICBfaW5kZXhlc1tpZHhdID0gTztcbiAgICAgICAgbm90aWZpZXIgPSBfbm90aWZpZXJzW2lkeF0gPSBuZXcgTm90aWZpZXIoTyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm90aWZpZXI7XG4gICAgfTtcbiAgICBleHRlbmQub2JzZXJ2ZSA9IGZ1bmN0aW9uIE9iamVjdF9vYnNlcnZlKE8sIGNhbGxiYWNrLCBhY2NlcHQpe1xuICAgICAgLy8gRm9yIEJ1ZyA0LCBjYW4ndCBvYnNlcnZlIERPTSBlbGVtZW50cyB0ZXN0ZWQgYWdhaW5zdCBjYW5yeSBpbXBsZW1lbnRhdGlvbiBhbmQgbWF0Y2hlc1xuICAgICAgaWYoIWlzRWxlbWVudChPKSl7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIoTywgY2FsbGJhY2ssIGFjY2VwdCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBleHRlbmQudW5vYnNlcnZlID0gZnVuY3Rpb24gT2JqZWN0X3Vub2JzZXJ2ZShPLCBjYWxsYmFjayl7XG4gICAgICB2YWxpZGF0ZUFyZ3VtZW50cyhPLCBjYWxsYmFjayk7XG4gICAgICB2YXIgaWR4ID0gX2luZGV4ZXMuaW5kZXhPZihPKSxcbiAgICAgICAgICBub3RpZmllciA9IGlkeD4tMT9fbm90aWZpZXJzW2lkeF06ZmFsc2U7XG4gICAgICBpZiAoIW5vdGlmaWVyKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbm90aWZpZXIucmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2spO1xuICAgICAgaWYgKG5vdGlmaWVyLmxpc3RlbmVycygpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgIF9pbmRleGVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICBfbm90aWZpZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKE9iamVjdCwgdGhpcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEVuZ2luZTogcmVxdWlyZSgnLi9FbmdpbmUnKSxcbiAgICBTY2VuZTogcmVxdWlyZSgnLi9TY2VuZScpLFxuICAgIE5vZGU6IHJlcXVpcmUoJy4vTm9kZScpXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29yZTogcmVxdWlyZSgnLi9jb3JlJyksXG4gICAgY29tcG9uZW50czogcmVxdWlyZSgnLi9jb21wb25lbnRzJyksXG4gICAgbWF0aDogcmVxdWlyZSgnLi9tYXRoJyksXG4gICAgdHJhbnNpdGlvbnM6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMnKVxufTtcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKiBcbiAqIENvcHlyaWdodCAoYykgMjAxNSBGYW1vdXMgSW5kdXN0cmllcyBJbmMuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSAzeDMgbnVtZXJpY2FsIG1hdHJpeCwgcmVwcmVzZW50ZWQgYXMgYW4gYXJyYXkuXG4gKlxuICogQGNsYXNzIE1hdDMzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIGEgM3gzIG1hdHJpeCBmbGF0dGVuZWRcbiAqL1xuZnVuY3Rpb24gTWF0MzModmFsdWVzKSB7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXMgfHwgWzEsMCwwLDAsMSwwLDAsMCwxXTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHZhbHVlcyBpbiB0aGUgTWF0MzMgYXMgYW4gYXJyYXkuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBtYXRyaXggdmFsdWVzIGFzIGFycmF5IG9mIHJvd3MuXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHZhbHVlcyBvZiB0aGUgY3VycmVudCBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIEFycmF5IG9mIG5pbmUgbnVtYmVycyB0byBzZXQgaW4gdGhlIE1hdDMzLlxuICpcbiAqIEByZXR1cm4ge01hdDMzfSB0aGlzXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQodmFsdWVzKSB7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBvZiB0aGUgaW5wdXQgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeCBUaGUgTWF0MzMgdG8gY29weS5cbiAqIFxuICogQHJldHVybiB7TWF0MzN9IHRoaXNcbiAqL1xuTWF0MzMucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5KG1hdHJpeCkge1xuICAgIHZhciBBID0gdGhpcy52YWx1ZXM7XG4gICAgdmFyIEIgPSBtYXRyaXgudmFsdWVzO1xuXG4gICAgQVswXSA9IEJbMF07XG4gICAgQVsxXSA9IEJbMV07XG4gICAgQVsyXSA9IEJbMl07XG4gICAgQVszXSA9IEJbM107XG4gICAgQVs0XSA9IEJbNF07XG4gICAgQVs1XSA9IEJbNV07XG4gICAgQVs2XSA9IEJbNl07XG4gICAgQVs3XSA9IEJbN107XG4gICAgQVs4XSA9IEJbOF07XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGFrZSB0aGlzIE1hdDMzIGFzIEEsIGlucHV0IHZlY3RvciBWIGFzIGEgY29sdW1uIHZlY3RvciwgYW5kIHJldHVybiBNYXQzMyBwcm9kdWN0IChBKShWKS5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFZlY3RvciB0byByb3RhdGUuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIGlucHV0IHZlY3RvciBhZnRlciBtdWx0aXBsaWNhdGlvbi5cbiAqL1xuTWF0MzMucHJvdG90eXBlLnZlY3Rvck11bHRpcGx5ID0gZnVuY3Rpb24gdmVjdG9yTXVsdGlwbHkodiwgb3V0cHV0KSB7XG4gICAgdmFyIE0gPSB0aGlzLnZhbHVlcztcbiAgICB2YXIgdjAgPSB2Lng7XG4gICAgdmFyIHYxID0gdi55O1xuICAgIHZhciB2MiA9IHYuejtcblxuICAgIG91dHB1dC54ID0gTVswXSp2MCArIE1bMV0qdjEgKyBNWzJdKnYyO1xuICAgIG91dHB1dC55ID0gTVszXSp2MCArIE1bNF0qdjEgKyBNWzVdKnYyO1xuICAgIG91dHB1dC56ID0gTVs2XSp2MCArIE1bN10qdjEgKyBNWzhdKnYyO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdGhlIHByb3ZpZGVkIE1hdDMzIHdpdGggdGhlIGN1cnJlbnQgTWF0MzMuICBSZXN1bHQgaXMgKHRoaXMpICogKG1hdHJpeCkuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeCBJbnB1dCBNYXQzMyB0byBtdWx0aXBseSBvbiB0aGUgcmlnaHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IHRoaXNcbiAqL1xuTWF0MzMucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkobWF0cml4KSB7XG4gICAgdmFyIEEgPSB0aGlzLnZhbHVlcztcbiAgICB2YXIgQiA9IG1hdHJpeC52YWx1ZXM7XG5cbiAgICB2YXIgQTAgPSBBWzBdO1xuICAgIHZhciBBMSA9IEFbMV07XG4gICAgdmFyIEEyID0gQVsyXTtcbiAgICB2YXIgQTMgPSBBWzNdO1xuICAgIHZhciBBNCA9IEFbNF07XG4gICAgdmFyIEE1ID0gQVs1XTtcbiAgICB2YXIgQTYgPSBBWzZdO1xuICAgIHZhciBBNyA9IEFbN107XG4gICAgdmFyIEE4ID0gQVs4XTtcblxuICAgIHZhciBCMCA9IEJbMF07XG4gICAgdmFyIEIxID0gQlsxXTtcbiAgICB2YXIgQjIgPSBCWzJdO1xuICAgIHZhciBCMyA9IEJbM107XG4gICAgdmFyIEI0ID0gQls0XTtcbiAgICB2YXIgQjUgPSBCWzVdO1xuICAgIHZhciBCNiA9IEJbNl07XG4gICAgdmFyIEI3ID0gQls3XTtcbiAgICB2YXIgQjggPSBCWzhdO1xuXG4gICAgQVswXSA9IEEwKkIwICsgQTEqQjMgKyBBMipCNjtcbiAgICBBWzFdID0gQTAqQjEgKyBBMSpCNCArIEEyKkI3O1xuICAgIEFbMl0gPSBBMCpCMiArIEExKkI1ICsgQTIqQjg7XG4gICAgQVszXSA9IEEzKkIwICsgQTQqQjMgKyBBNSpCNjtcbiAgICBBWzRdID0gQTMqQjEgKyBBNCpCNCArIEE1KkI3O1xuICAgIEFbNV0gPSBBMypCMiArIEE0KkI1ICsgQTUqQjg7XG4gICAgQVs2XSA9IEE2KkIwICsgQTcqQjMgKyBBOCpCNjtcbiAgICBBWzddID0gQTYqQjEgKyBBNypCNCArIEE4KkI3O1xuICAgIEFbOF0gPSBBNipCMiArIEE3KkI1ICsgQTgqQjg7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVHJhbnNwb3NlcyB0aGUgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge01hdDMzfSB0aGlzXG4gKi9cbk1hdDMzLnByb3RvdHlwZS50cmFuc3Bvc2UgPSBmdW5jdGlvbiB0cmFuc3Bvc2UoKSB7XG4gICAgdmFyIE0gPSB0aGlzLnZhbHVlcztcblxuICAgIHZhciBNMSA9IE1bMV07XG4gICAgdmFyIE0yID0gTVsyXTtcbiAgICB2YXIgTTMgPSBNWzNdO1xuICAgIHZhciBNNSA9IE1bNV07XG4gICAgdmFyIE02ID0gTVs2XTtcbiAgICB2YXIgTTcgPSBNWzddO1xuXG4gICAgTVsxXSA9IE0zO1xuICAgIE1bMl0gPSBNNjtcbiAgICBNWzNdID0gTTE7XG4gICAgTVs1XSA9IE03O1xuICAgIE1bNl0gPSBNMjtcbiAgICBNWzddID0gTTU7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGhlIGRldGVybWluYW50IG9mIHRoZSBNYXQzMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBUaGUgZGV0ZXJtaW5hbnQuXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5nZXREZXRlcm1pbmFudCA9IGZ1bmN0aW9uIGdldERldGVybWluYW50KCkge1xuICAgIHZhciBNID0gdGhpcy52YWx1ZXM7XG5cbiAgICB2YXIgTTMgPSBNWzNdO1xuICAgIHZhciBNNCA9IE1bNF07XG4gICAgdmFyIE01ID0gTVs1XTtcbiAgICB2YXIgTTYgPSBNWzZdO1xuICAgIHZhciBNNyA9IE1bN107XG4gICAgdmFyIE04ID0gTVs4XTtcblxuICAgIHZhciBkZXQgPSBNWzBdKihNNCpNOCAtIE01Kk03KSAtXG4gICAgICAgICAgICAgIE1bMV0qKE0zKk04IC0gTTUqTTYpICtcbiAgICAgICAgICAgICAgTVsyXSooTTMqTTcgLSBNNCpNNik7XG5cbiAgICByZXR1cm4gZGV0O1xufTtcblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiB0aGUgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge01hdDMzfSB0aGlzXG4gKi9cbk1hdDMzLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24gaW52ZXJzZSgpIHtcbiAgICB2YXIgTSA9IHRoaXMudmFsdWVzO1xuXG4gICAgdmFyIE0wID0gTVswXTtcbiAgICB2YXIgTTEgPSBNWzFdO1xuICAgIHZhciBNMiA9IE1bMl07XG4gICAgdmFyIE0zID0gTVszXTtcbiAgICB2YXIgTTQgPSBNWzRdO1xuICAgIHZhciBNNSA9IE1bNV07XG4gICAgdmFyIE02ID0gTVs2XTtcbiAgICB2YXIgTTcgPSBNWzddO1xuICAgIHZhciBNOCA9IE1bOF07XG5cbiAgICB2YXIgZGV0ID0gTTAqKE00Kk04IC0gTTUqTTcpIC1cbiAgICAgICAgICAgICAgTTEqKE0zKk04IC0gTTUqTTYpICtcbiAgICAgICAgICAgICAgTTIqKE0zKk03IC0gTTQqTTYpO1xuXG4gICAgaWYgKE1hdGguYWJzKGRldCkgPCAxZS00MCkgcmV0dXJuIG51bGw7XG5cbiAgICBkZXQgPSAxIC8gZGV0O1xuXG4gICAgTVswXSA9IChNNCpNOCAtIE01Kk03KSAqIGRldDtcbiAgICBNWzNdID0gKC1NMypNOCArIE01Kk02KSAqIGRldDtcbiAgICBNWzZdID0gKE0zKk03IC0gTTQqTTYpICogZGV0O1xuICAgIE1bMV0gPSAoLU0xKk04ICsgTTIqTTcpICogZGV0O1xuICAgIE1bNF0gPSAoTTAqTTggLSBNMipNNikgKiBkZXQ7XG4gICAgTVs3XSA9ICgtTTAqTTcgKyBNMSpNNikgKiBkZXQ7XG4gICAgTVsyXSA9IChNMSpNNSAtIE0yKk00KSAqIGRldDtcbiAgICBNWzVdID0gKC1NMCpNNSArIE0yKk0zKSAqIGRldDtcbiAgICBNWzhdID0gKE0wKk00IC0gTTEqTTMpICogZGV0O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENsb25lcyB0aGUgaW5wdXQgTWF0MzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TWF0MzN9IG0gTWF0MzMgdG8gY2xvbmUuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IE5ldyBjb3B5IG9mIHRoZSBvcmlnaW5hbCBNYXQzMy5cbiAqL1xuTWF0MzMuY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShtKSB7XG4gICAgcmV0dXJuIG5ldyBNYXQzMyhtLnZhbHVlcy5zbGljZSgpKTtcbn07XG5cbi8qKlxuICogVGhlIGludmVyc2Ugb2YgdGhlIE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXggTWF0MzMgdG8gaW52ZXJ0LlxuICogQHBhcmFtIHtNYXQzM30gb3V0cHV0IE1hdDMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IFRoZSBNYXQzMyBhZnRlciB0aGUgaW52ZXJ0LlxuICovXG5NYXQzMy5pbnZlcnNlID0gZnVuY3Rpb24gaW52ZXJzZShtYXRyaXgsIG91dHB1dCkge1xuICAgIHZhciBNID0gbWF0cml4LnZhbHVlcztcbiAgICB2YXIgcmVzdWx0ID0gb3V0cHV0LnZhbHVlcztcblxuICAgIHZhciBNMCA9IE1bMF07XG4gICAgdmFyIE0xID0gTVsxXTtcbiAgICB2YXIgTTIgPSBNWzJdO1xuICAgIHZhciBNMyA9IE1bM107XG4gICAgdmFyIE00ID0gTVs0XTtcbiAgICB2YXIgTTUgPSBNWzVdO1xuICAgIHZhciBNNiA9IE1bNl07XG4gICAgdmFyIE03ID0gTVs3XTtcbiAgICB2YXIgTTggPSBNWzhdO1xuXG4gICAgdmFyIGRldCA9IE0wKihNNCpNOCAtIE01Kk03KSAtXG4gICAgICAgICAgICAgIE0xKihNMypNOCAtIE01Kk02KSArXG4gICAgICAgICAgICAgIE0yKihNMypNNyAtIE00Kk02KTtcblxuICAgIGlmIChNYXRoLmFicyhkZXQpIDwgMWUtNDApIHJldHVybiBudWxsO1xuXG4gICAgZGV0ID0gMSAvIGRldDtcblxuICAgIHJlc3VsdFswXSA9IChNNCpNOCAtIE01Kk03KSAqIGRldDtcbiAgICByZXN1bHRbM10gPSAoLU0zKk04ICsgTTUqTTYpICogZGV0O1xuICAgIHJlc3VsdFs2XSA9IChNMypNNyAtIE00Kk02KSAqIGRldDtcbiAgICByZXN1bHRbMV0gPSAoLU0xKk04ICsgTTIqTTcpICogZGV0O1xuICAgIHJlc3VsdFs0XSA9IChNMCpNOCAtIE0yKk02KSAqIGRldDtcbiAgICByZXN1bHRbN10gPSAoLU0wKk03ICsgTTEqTTYpICogZGV0O1xuICAgIHJlc3VsdFsyXSA9IChNMSpNNSAtIE0yKk00KSAqIGRldDtcbiAgICByZXN1bHRbNV0gPSAoLU0wKk01ICsgTTIqTTMpICogZGV0O1xuICAgIHJlc3VsdFs4XSA9IChNMCpNNCAtIE0xKk0zKSAqIGRldDtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zcG9zZXMgdGhlIE1hdDMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXggTWF0MzMgdG8gdHJhbnNwb3NlLlxuICogQHBhcmFtIHtNYXQzM30gb3V0cHV0IE1hdDMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IFRoZSBNYXQzMyBhZnRlciB0aGUgdHJhbnNwb3NlLlxuICovXG5NYXQzMy50cmFuc3Bvc2UgPSBmdW5jdGlvbiB0cmFuc3Bvc2UobWF0cml4LCBvdXRwdXQpIHtcbiAgICB2YXIgTSA9IG1hdHJpeC52YWx1ZXM7XG4gICAgdmFyIHJlc3VsdCA9IG91dHB1dC52YWx1ZXM7XG5cbiAgICB2YXIgTTAgPSBNWzBdO1xuICAgIHZhciBNMSA9IE1bMV07XG4gICAgdmFyIE0yID0gTVsyXTtcbiAgICB2YXIgTTMgPSBNWzNdO1xuICAgIHZhciBNNCA9IE1bNF07XG4gICAgdmFyIE01ID0gTVs1XTtcbiAgICB2YXIgTTYgPSBNWzZdO1xuICAgIHZhciBNNyA9IE1bN107XG4gICAgdmFyIE04ID0gTVs4XTtcblxuICAgIHJlc3VsdFswXSA9IE0wO1xuICAgIHJlc3VsdFsxXSA9IE0zO1xuICAgIHJlc3VsdFsyXSA9IE02O1xuICAgIHJlc3VsdFszXSA9IE0xO1xuICAgIHJlc3VsdFs0XSA9IE00O1xuICAgIHJlc3VsdFs1XSA9IE03O1xuICAgIHJlc3VsdFs2XSA9IE0yO1xuICAgIHJlc3VsdFs3XSA9IE01O1xuICAgIHJlc3VsdFs4XSA9IE04O1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBwcm92aWRlZCBNYXQzMydzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge01hdDMzfSBtYXRyaXgxIFRoZSBsZWZ0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MiBUaGUgcmlnaHQgTWF0MzMuXG4gKiBAcGFyYW0ge01hdDMzfSBvdXRwdXQgTWF0MzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtNYXQzM30gVGhlIHJlc3VsdCBvZiB0aGUgYWRkaXRpb24uXG4gKi9cbk1hdDMzLmFkZCA9IGZ1bmN0aW9uIGFkZChtYXRyaXgxLCBtYXRyaXgyLCBvdXRwdXQpIHtcbiAgICB2YXIgQSA9IG1hdHJpeDEudmFsdWVzO1xuICAgIHZhciBCID0gbWF0cml4Mi52YWx1ZXM7XG4gICAgdmFyIHJlc3VsdCA9IG91dHB1dC52YWx1ZXM7XG5cbiAgICB2YXIgQTAgPSBBWzBdO1xuICAgIHZhciBBMSA9IEFbMV07XG4gICAgdmFyIEEyID0gQVsyXTtcbiAgICB2YXIgQTMgPSBBWzNdO1xuICAgIHZhciBBNCA9IEFbNF07XG4gICAgdmFyIEE1ID0gQVs1XTtcbiAgICB2YXIgQTYgPSBBWzZdO1xuICAgIHZhciBBNyA9IEFbN107XG4gICAgdmFyIEE4ID0gQVs4XTtcblxuICAgIHZhciBCMCA9IEJbMF07XG4gICAgdmFyIEIxID0gQlsxXTtcbiAgICB2YXIgQjIgPSBCWzJdO1xuICAgIHZhciBCMyA9IEJbM107XG4gICAgdmFyIEI0ID0gQls0XTtcbiAgICB2YXIgQjUgPSBCWzVdO1xuICAgIHZhciBCNiA9IEJbNl07XG4gICAgdmFyIEI3ID0gQls3XTtcbiAgICB2YXIgQjggPSBCWzhdO1xuXG4gICAgcmVzdWx0WzBdID0gQTAgKyBCMDtcbiAgICByZXN1bHRbMV0gPSBBMSArIEIxO1xuICAgIHJlc3VsdFsyXSA9IEEyICsgQjI7XG4gICAgcmVzdWx0WzNdID0gQTMgKyBCMztcbiAgICByZXN1bHRbNF0gPSBBNCArIEI0O1xuICAgIHJlc3VsdFs1XSA9IEE1ICsgQjU7XG4gICAgcmVzdWx0WzZdID0gQTYgKyBCNjtcbiAgICByZXN1bHRbN10gPSBBNyArIEI3O1xuICAgIHJlc3VsdFs4XSA9IEE4ICsgQjg7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgcHJvdmlkZWQgTWF0MzMncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MSBUaGUgbGVmdCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDIgVGhlIHJpZ2h0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gb3V0cHV0IE1hdDMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IFRoZSByZXN1bHQgb2YgdGhlIHN1YnRyYWN0aW9uLlxuICovXG5NYXQzMy5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KG1hdHJpeDEsIG1hdHJpeDIsIG91dHB1dCkge1xuICAgIHZhciBBID0gbWF0cml4MS52YWx1ZXM7XG4gICAgdmFyIEIgPSBtYXRyaXgyLnZhbHVlcztcbiAgICB2YXIgcmVzdWx0ID0gb3V0cHV0LnZhbHVlcztcblxuICAgIHZhciBBMCA9IEFbMF07XG4gICAgdmFyIEExID0gQVsxXTtcbiAgICB2YXIgQTIgPSBBWzJdO1xuICAgIHZhciBBMyA9IEFbM107XG4gICAgdmFyIEE0ID0gQVs0XTtcbiAgICB2YXIgQTUgPSBBWzVdO1xuICAgIHZhciBBNiA9IEFbNl07XG4gICAgdmFyIEE3ID0gQVs3XTtcbiAgICB2YXIgQTggPSBBWzhdO1xuXG4gICAgdmFyIEIwID0gQlswXTtcbiAgICB2YXIgQjEgPSBCWzFdO1xuICAgIHZhciBCMiA9IEJbMl07XG4gICAgdmFyIEIzID0gQlszXTtcbiAgICB2YXIgQjQgPSBCWzRdO1xuICAgIHZhciBCNSA9IEJbNV07XG4gICAgdmFyIEI2ID0gQls2XTtcbiAgICB2YXIgQjcgPSBCWzddO1xuICAgIHZhciBCOCA9IEJbOF07XG5cbiAgICByZXN1bHRbMF0gPSBBMCAtIEIwO1xuICAgIHJlc3VsdFsxXSA9IEExIC0gQjE7XG4gICAgcmVzdWx0WzJdID0gQTIgLSBCMjtcbiAgICByZXN1bHRbM10gPSBBMyAtIEIzO1xuICAgIHJlc3VsdFs0XSA9IEE0IC0gQjQ7XG4gICAgcmVzdWx0WzVdID0gQTUgLSBCNTtcbiAgICByZXN1bHRbNl0gPSBBNiAtIEI2O1xuICAgIHJlc3VsdFs3XSA9IEE3IC0gQjc7XG4gICAgcmVzdWx0WzhdID0gQTggLSBCODtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuLyoqXG4gKiBNdWx0aXBseSB0aGUgcHJvdmlkZWQgTWF0MzMgTTIgd2l0aCB0aGlzIE1hdDMzLiAgUmVzdWx0IGlzICh0aGlzKSAqIChNMikuXG4gKlxuICogQG1ldGhvZFxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4MSBUaGUgbGVmdCBNYXQzMy5cbiAqIEBwYXJhbSB7TWF0MzN9IG1hdHJpeDIgVGhlIHJpZ2h0IE1hdDMzLlxuICogQHBhcmFtIHtNYXQzM30gb3V0cHV0IE1hdDMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7TWF0MzN9IHRoZSByZXN1bHQgb2YgdGhlIG11bHRpcGxpY2F0aW9uLlxuICovXG5NYXQzMy5tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KG1hdHJpeDEsIG1hdHJpeDIsIG91dHB1dCkge1xuICAgIHZhciBBID0gbWF0cml4MS52YWx1ZXM7XG4gICAgdmFyIEIgPSBtYXRyaXgyLnZhbHVlcztcbiAgICB2YXIgcmVzdWx0ID0gb3V0cHV0LnZhbHVlcztcblxuICAgIHZhciBBMCA9IEFbMF07XG4gICAgdmFyIEExID0gQVsxXTtcbiAgICB2YXIgQTIgPSBBWzJdO1xuICAgIHZhciBBMyA9IEFbM107XG4gICAgdmFyIEE0ID0gQVs0XTtcbiAgICB2YXIgQTUgPSBBWzVdO1xuICAgIHZhciBBNiA9IEFbNl07XG4gICAgdmFyIEE3ID0gQVs3XTtcbiAgICB2YXIgQTggPSBBWzhdO1xuXG4gICAgdmFyIEIwID0gQlswXTtcbiAgICB2YXIgQjEgPSBCWzFdO1xuICAgIHZhciBCMiA9IEJbMl07XG4gICAgdmFyIEIzID0gQlszXTtcbiAgICB2YXIgQjQgPSBCWzRdO1xuICAgIHZhciBCNSA9IEJbNV07XG4gICAgdmFyIEI2ID0gQls2XTtcbiAgICB2YXIgQjcgPSBCWzddO1xuICAgIHZhciBCOCA9IEJbOF07XG5cbiAgICByZXN1bHRbMF0gPSBBMCpCMCArIEExKkIzICsgQTIqQjY7XG4gICAgcmVzdWx0WzFdID0gQTAqQjEgKyBBMSpCNCArIEEyKkI3O1xuICAgIHJlc3VsdFsyXSA9IEEwKkIyICsgQTEqQjUgKyBBMipCODtcbiAgICByZXN1bHRbM10gPSBBMypCMCArIEE0KkIzICsgQTUqQjY7XG4gICAgcmVzdWx0WzRdID0gQTMqQjEgKyBBNCpCNCArIEE1KkI3O1xuICAgIHJlc3VsdFs1XSA9IEEzKkIyICsgQTQqQjUgKyBBNSpCODtcbiAgICByZXN1bHRbNl0gPSBBNipCMCArIEE3KkIzICsgQTgqQjY7XG4gICAgcmVzdWx0WzddID0gQTYqQjEgKyBBNypCNCArIEE4KkI3O1xuICAgIHJlc3VsdFs4XSA9IEE2KkIyICsgQTcqQjUgKyBBOCpCODtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdDMzO1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2luID0gTWF0aC5zaW47XG52YXIgY29zID0gTWF0aC5jb3M7XG52YXIgYXNpbiA9IE1hdGguYXNpbjtcbnZhciBhY29zID0gTWF0aC5hY29zO1xudmFyIGF0YW4yID0gTWF0aC5hdGFuMjtcbnZhciBzcXJ0ID0gTWF0aC5zcXJ0O1xuXG4vKipcbiAqIEEgdmVjdG9yLWxpa2Ugb2JqZWN0IHVzZWQgdG8gcmVwcmVzZW50IHJvdGF0aW9ucy4gSWYgdGhldGEgaXMgdGhlIGFuZ2xlIG9mXG4gKiByb3RhdGlvbiwgYW5kICh4JywgeScsIHonKSBpcyBhIG5vcm1hbGl6ZWQgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgYXhpcyBvZlxuICogcm90YXRpb24sIHRoZW4gdyA9IGNvcyh0aGV0YS8yKSwgeCA9IHNpbih0aGV0YS8yKSp4JywgeSA9IHNpbih0aGV0YS8yKSp5JyxcbiAqIGFuZCB6ID0gc2luKHRoZXRhLzIpKnonLlxuICpcbiAqIEBjbGFzcyBRdWF0ZXJuaW9uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVGhlIHcgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHogVGhlIHogY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBRdWF0ZXJuaW9uKHcsIHgsIHksIHopIHtcbiAgICB0aGlzLncgPSB3IHx8IDE7XG4gICAgdGhpcy54ID0geCB8fCAwO1xuICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICB0aGlzLnogPSB6IHx8IDA7XG59XG5cbi8qKlxuICogTXVsdGlwbHkgdGhlIGN1cnJlbnQgUXVhdGVybmlvbiBieSBpbnB1dCBRdWF0ZXJuaW9uIHEuXG4gKiBMZWZ0LWhhbmRlZCBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSBRdWF0ZXJuaW9uIHRvIG11bHRpcGx5IGJ5IG9uIHRoZSByaWdodC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkocSkge1xuICAgIHZhciB4MSA9IHRoaXMueDtcbiAgICB2YXIgeTEgPSB0aGlzLnk7XG4gICAgdmFyIHoxID0gdGhpcy56O1xuICAgIHZhciB3MSA9IHRoaXMudztcbiAgICB2YXIgeDIgPSBxLng7XG4gICAgdmFyIHkyID0gcS55O1xuICAgIHZhciB6MiA9IHEuejtcbiAgICB2YXIgdzIgPSBxLncgfHwgMDtcblxuICAgIHRoaXMudyA9IHcxICogdzIgLSB4MSAqIHgyIC0geTEgKiB5MiAtIHoxICogejI7XG4gICAgdGhpcy54ID0geDEgKiB3MiArIHgyICogdzEgKyB5MiAqIHoxIC0geTEgKiB6MjtcbiAgICB0aGlzLnkgPSB5MSAqIHcyICsgeTIgKiB3MSArIHgxICogejIgLSB4MiAqIHoxO1xuICAgIHRoaXMueiA9IHoxICogdzIgKyB6MiAqIHcxICsgeDIgKiB5MSAtIHgxICogeTI7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE11bHRpcGx5IHRoZSBjdXJyZW50IFF1YXRlcm5pb24gYnkgaW5wdXQgUXVhdGVybmlvbiBxIG9uIHRoZSBsZWZ0LCBpLmUuIHEgKiB0aGlzLlxuICogTGVmdC1oYW5kZWQgbXVsdGlwbGljYXRpb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgUXVhdGVybmlvbiB0byBtdWx0aXBseSBieSBvbiB0aGUgbGVmdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmxlZnRNdWx0aXBseSA9IGZ1bmN0aW9uIGxlZnRNdWx0aXBseShxKSB7XG4gICAgdmFyIHgxID0gcS54O1xuICAgIHZhciB5MSA9IHEueTtcbiAgICB2YXIgejEgPSBxLno7XG4gICAgdmFyIHcxID0gcS53IHx8IDA7XG4gICAgdmFyIHgyID0gdGhpcy54O1xuICAgIHZhciB5MiA9IHRoaXMueTtcbiAgICB2YXIgejIgPSB0aGlzLno7XG4gICAgdmFyIHcyID0gdGhpcy53O1xuXG4gICAgdGhpcy53ID0gdzEqdzIgLSB4MSp4MiAtIHkxKnkyIC0gejEqejI7XG4gICAgdGhpcy54ID0geDEqdzIgKyB4Mip3MSArIHkyKnoxIC0geTEqejI7XG4gICAgdGhpcy55ID0geTEqdzIgKyB5Mip3MSArIHgxKnoyIC0geDIqejE7XG4gICAgdGhpcy56ID0gejEqdzIgKyB6Mip3MSArIHgyKnkxIC0geDEqeTI7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFwcGx5IHRoZSBjdXJyZW50IFF1YXRlcm5pb24gdG8gaW5wdXQgVmVjMyB2LCBhY2NvcmRpbmcgdG9cbiAqIHYnID0gfnEgKiB2ICogcS5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSByZWZlcmVuY2UgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcm90YXRlZCB2ZXJzaW9uIG9mIHRoZSBWZWMzLlxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5yb3RhdGVWZWN0b3IgPSBmdW5jdGlvbiByb3RhdGVWZWN0b3Iodiwgb3V0cHV0KSB7XG4gICAgdmFyIGN3ID0gdGhpcy53O1xuICAgIHZhciBjeCA9IC10aGlzLng7XG4gICAgdmFyIGN5ID0gLXRoaXMueTtcbiAgICB2YXIgY3ogPSAtdGhpcy56O1xuXG4gICAgdmFyIHZ4ID0gdi54O1xuICAgIHZhciB2eSA9IHYueTtcbiAgICB2YXIgdnogPSB2Lno7XG5cbiAgICB2YXIgdHcgPSAtY3ggKiB2eCAtIGN5ICogdnkgLSBjeiAqIHZ6O1xuICAgIHZhciB0eCA9IHZ4ICogY3cgKyB2eSAqIGN6IC0gY3kgKiB2ejtcbiAgICB2YXIgdHkgPSB2eSAqIGN3ICsgY3ggKiB2eiAtIHZ4ICogY3o7XG4gICAgdmFyIHR6ID0gdnogKiBjdyArIHZ4ICogY3kgLSBjeCAqIHZ5O1xuXG4gICAgdmFyIHcgPSBjdztcbiAgICB2YXIgeCA9IC1jeDtcbiAgICB2YXIgeSA9IC1jeTtcbiAgICB2YXIgeiA9IC1jejtcblxuICAgIG91dHB1dC54ID0gdHggKiB3ICsgeCAqIHR3ICsgeSAqIHR6IC0gdHkgKiB6O1xuICAgIG91dHB1dC55ID0gdHkgKiB3ICsgeSAqIHR3ICsgdHggKiB6IC0geCAqIHR6O1xuICAgIG91dHB1dC56ID0gdHogKiB3ICsgeiAqIHR3ICsgeCAqIHR5IC0gdHggKiB5O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIEludmVydCB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uIGludmVydCgpIHtcbiAgICB0aGlzLncgPSAtdGhpcy53O1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICB0aGlzLnogPSAtdGhpcy56O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb25qdWdhdGUgdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5jb25qdWdhdGUgPSBmdW5jdGlvbiBjb25qdWdhdGUoKSB7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHRoaXMueiA9IC10aGlzLno7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxlbmd0aCAobm9ybSkgb2YgdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBsZW5ndGggb2YgdGhlIFF1YXRlcm5pb25cbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKCkge1xuICAgIHZhciB3ID0gdGhpcy53O1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuICAgIHJldHVybiBzcXJ0KHcgKiB3ICsgeCAqIHggKyB5ICogeSArIHogKiB6KTtcbn07XG5cbi8qKlxuICogQWx0ZXIgdGhlIGN1cnJlbnQgUXVhdGVybmlvbiB0byBiZSBvZiB1bml0IGxlbmd0aDtcbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUoKSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG4gICAgdmFyIGxlbmd0aCA9IHNxcnQodyAqIHcgKyB4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIGlmIChsZW5ndGggPT09IDApIHJldHVybiB0aGlzO1xuICAgIGxlbmd0aCA9IDEgLyBsZW5ndGg7XG4gICAgdGhpcy53ICo9IGxlbmd0aDtcbiAgICB0aGlzLnggKj0gbGVuZ3RoO1xuICAgIHRoaXMueSAqPSBsZW5ndGg7XG4gICAgdGhpcy56ICo9IGxlbmd0aDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSB3LCB4LCB5LCB6IGNvbXBvbmVudHMgb2YgdGhlIGN1cnJlbnQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVGhlIHcgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHogVGhlIHogY29tcG9uZW50LlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHcsIHggLHksIHopIHtcbiAgICBpZiAodyAhPSBudWxsKSB0aGlzLncgPSB3O1xuICAgIGlmICh4ICE9IG51bGwpIHRoaXMueCA9IHg7XG4gICAgaWYgKHkgIT0gbnVsbCkgdGhpcy55ID0geTtcbiAgICBpZiAoeiAhPSBudWxsKSB0aGlzLnogPSB6O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb3B5IGlucHV0IFF1YXRlcm5pb24gcSBvbnRvIHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBUaGUgcmVmZXJlbmNlIFF1YXRlcm5pb24uXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gdGhpc1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weShxKSB7XG4gICAgdGhpcy53ID0gcS53O1xuICAgIHRoaXMueCA9IHEueDtcbiAgICB0aGlzLnkgPSBxLnk7XG4gICAgdGhpcy56ID0gcS56O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgY3VycmVudCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSB0aGlzXG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy53ID0gMTtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy56ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0LiBDYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGNvc2luZSBvZiB0aGUgYW5nbGUgYmV0d2VlblxuICogdGhlIHR3byByb3RhdGlvbnMsIGFzc3VtaW5nIGJvdGggUXVhdGVybmlvbnMgYXJlIG9mIHVuaXQgbGVuZ3RoLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIG90aGVyIFF1YXRlcm5pb24uXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSB0aGUgcmVzdWx0aW5nIGRvdCBwcm9kdWN0XG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uIGRvdChxKSB7XG4gICAgcmV0dXJuIHRoaXMudyAqIHEudyArIHRoaXMueCAqIHEueCArIHRoaXMueSAqIHEueSArIHRoaXMueiAqIHEuejtcbn07XG5cbi8qKlxuICogU3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVGhlIGZpbmFsIG9yaWVudGF0aW9uLlxuICogQHBhcmFtIHtOdW1iZXJ9IHQgVGhlIHR3ZWVuIHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcHV0IHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIHF1YXRlcm5pb24gdGhlIHNsZXJwIHJlc3VsdHMgd2VyZSBzYXZlZCB0b1xuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS5zbGVycCA9IGZ1bmN0aW9uIHNsZXJwKHEsIHQsIG91dHB1dCkge1xuICAgIHZhciB3ID0gdGhpcy53O1xuICAgIHZhciB4ID0gdGhpcy54O1xuICAgIHZhciB5ID0gdGhpcy55O1xuICAgIHZhciB6ID0gdGhpcy56O1xuXG4gICAgdmFyIHF3ID0gcS53O1xuICAgIHZhciBxeCA9IHEueDtcbiAgICB2YXIgcXkgPSBxLnk7XG4gICAgdmFyIHF6ID0gcS56O1xuXG4gICAgdmFyIG9tZWdhO1xuICAgIHZhciBjb3NvbWVnYTtcbiAgICB2YXIgc2lub21lZ2E7XG4gICAgdmFyIHNjYWxlRnJvbTtcbiAgICB2YXIgc2NhbGVUbztcblxuICAgIGNvc29tZWdhID0gdyAqIHF3ICsgeCAqIHF4ICsgeSAqIHF5ICsgeiAqIHF6O1xuICAgIGlmICgoMS4wIC0gY29zb21lZ2EpID4gMWUtNSkge1xuICAgICAgICBvbWVnYSA9IGFjb3MoY29zb21lZ2EpO1xuICAgICAgICBzaW5vbWVnYSA9IHNpbihvbWVnYSk7XG4gICAgICAgIHNjYWxlRnJvbSA9IHNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICAgICAgc2NhbGVUbyA9IHNpbih0ICogb21lZ2EpIC8gc2lub21lZ2E7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzY2FsZUZyb20gPSAxLjAgLSB0O1xuICAgICAgICBzY2FsZVRvID0gdDtcbiAgICB9XG5cbiAgICBvdXRwdXQudyA9IHcgKiBzY2FsZUZyb20gKyBxdyAqIHNjYWxlVG87XG4gICAgb3V0cHV0LnggPSB4ICogc2NhbGVGcm9tICsgcXggKiBzY2FsZVRvO1xuICAgIG91dHB1dC55ID0geSAqIHNjYWxlRnJvbSArIHF5ICogc2NhbGVUbztcbiAgICBvdXRwdXQueiA9IHogKiBzY2FsZUZyb20gKyBxeiAqIHNjYWxlVG87XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIE1hdDMzIG1hdHJpeCBjb3JyZXNwb25kaW5nIHRvIHRoZSBjdXJyZW50IFF1YXRlcm5pb24uXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvdXRwdXQgT2JqZWN0IHRvIHByb2Nlc3MgdGhlIFRyYW5zZm9ybSBtYXRyaXhcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIFF1YXRlcm5pb24gYXMgYSBUcmFuc2Zvcm0gbWF0cml4XG4gKi9cblF1YXRlcm5pb24ucHJvdG90eXBlLnRvTWF0cml4ID0gZnVuY3Rpb24gdG9NYXRyaXgob3V0cHV0KSB7XG4gICAgdmFyIHcgPSB0aGlzLnc7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB2YXIgeHggPSB4Kng7XG4gICAgdmFyIHl5ID0geSp5O1xuICAgIHZhciB6eiA9IHoqejtcbiAgICB2YXIgeHkgPSB4Knk7XG4gICAgdmFyIHh6ID0geCp6O1xuICAgIHZhciB5eiA9IHkqejtcblxuICAgIHJldHVybiBvdXRwdXQuc2V0KFtcbiAgICAgICAgMSAtIDIgKiAoeXkgKyB6eiksIDIgKiAoeHkgLSB3KnopLCAyICogKHh6ICsgdyp5KSxcbiAgICAgICAgMiAqICh4eSArIHcqeiksIDEgLSAyICogKHh4ICsgenopLCAyICogKHl6IC0gdyp4KSxcbiAgICAgICAgMiAqICh4eiAtIHcqeSksIDIgKiAoeXogKyB3KngpLCAxIC0gMiAqICh4eCArIHl5KVxuICAgIF0pO1xufTtcblxuLyoqXG4gKiBUaGUgcm90YXRpb24gYW5nbGVzIGFib3V0IHRoZSB4LCB5LCBhbmQgeiBheGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlXG4gKiBjdXJyZW50IFF1YXRlcm5pb24sIHdoZW4gYXBwbGllZCBpbiB0aGUgWllYIG9yZGVyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHB1dCB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoZSBWZWMzIHRoZSByZXN1bHQgd2FzIHN0b3JlZCBpblxuICovXG5RdWF0ZXJuaW9uLnByb3RvdHlwZS50b0V1bGVyID0gZnVuY3Rpb24gdG9FdWxlcihvdXRwdXQpIHtcbiAgICB2YXIgdyA9IHRoaXMudztcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciB4eCA9IHggKiB4O1xuICAgIHZhciB5eSA9IHkgKiB5O1xuICAgIHZhciB6eiA9IHogKiB6O1xuXG4gICAgdmFyIHR5ID0gMiAqICh4ICogeiArIHkgKiB3KTtcbiAgICB0eSA9IHR5IDwgLTEgPyAtMSA6IHR5ID4gMSA/IDEgOiB0eTtcblxuICAgIG91dHB1dC54ID0gYXRhbjIoMiAqICh4ICogdyAtIHkgKiB6KSwgMSAtIDIgKiAoeHggKyB5eSkpO1xuICAgIG91dHB1dC55ID0gYXNpbih0eSk7XG4gICAgb3V0cHV0LnogPSBhdGFuMigyICogKHogKiB3IC0geCAqIHkpLCAxIC0gMiAqICh5eSArIHp6KSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBUaGUgUXVhdGVybmlvbiBjb3JyZXNwb25kaW5nIHRvIHRoZSBFdWxlciBhbmdsZXMgeCwgeSwgYW5kIHosXG4gKiBhcHBsaWVkIGluIHRoZSBaWVggb3JkZXIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSBhbmdsZSBvZiByb3RhdGlvbiBhYm91dCB0aGUgeCBheGlzLlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGFib3V0IHRoZSB5IGF4aXMuXG4gKiBAcGFyYW0ge051bWJlcn0geiBUaGUgYW5nbGUgb2Ygcm90YXRpb24gYWJvdXQgdGhlIHogYXhpcy5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gb3V0cHV0IFF1YXRlcm5pb24gaW4gd2hpY2ggdG8gcHV0IHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7UXVhdGVybmlvbn0gVGhlIGVxdWl2YWxlbnQgUXVhdGVybmlvbi5cbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuZnJvbUV1bGVyID0gZnVuY3Rpb24gZnJvbUV1bGVyKHgsIHksIHopIHtcbiAgICB2YXIgaHggPSB4ICogMC41O1xuICAgIHZhciBoeSA9IHkgKiAwLjU7XG4gICAgdmFyIGh6ID0geiAqIDAuNTtcblxuICAgIHZhciBzeCA9IHNpbihoeCk7XG4gICAgdmFyIHN5ID0gc2luKGh5KTtcbiAgICB2YXIgc3ogPSBzaW4oaHopO1xuICAgIHZhciBjeCA9IGNvcyhoeCk7XG4gICAgdmFyIGN5ID0gY29zKGh5KTtcbiAgICB2YXIgY3ogPSBjb3MoaHopO1xuXG4gICAgdGhpcy53ID0gY3ggKiBjeSAqIGN6IC0gc3ggKiBzeSAqIHN6O1xuICAgIHRoaXMueCA9IHN4ICogY3kgKiBjeiArIGN4ICogc3kgKiBzejtcbiAgICB0aGlzLnkgPSBjeCAqIHN5ICogY3ogLSBzeCAqIGN5ICogc3o7XG4gICAgdGhpcy56ID0gY3ggKiBjeSAqIHN6ICsgc3ggKiBzeSAqIGN6O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFsdGVyIHRoZSBjdXJyZW50IFF1YXRlcm5pb24gdG8gcmVmbGVjdCBhIHJvdGF0aW9uIG9mIGlucHV0IGFuZ2xlIGFib3V0XG4gKiBpbnB1dCBheGlzIHgsIHksIGFuZCB6LlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gYW5nbGUgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uLlxuICogQHBhcmFtIHtWZWMzfSB4IFRoZSBheGlzIG9mIHJvdGF0aW9uLlxuICogQHBhcmFtIHtWZWMzfSB5IFRoZSBheGlzIG9mIHJvdGF0aW9uLlxuICogQHBhcmFtIHtWZWMzfSB6IFRoZSBheGlzIG9mIHJvdGF0aW9uLlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IHRoaXNcbiAqL1xuUXVhdGVybmlvbi5wcm90b3R5cGUuZnJvbUFuZ2xlQXhpcyA9IGZ1bmN0aW9uIGZyb21BbmdsZUF4aXMoYW5nbGUsIHgsIHksIHopIHtcbiAgICB2YXIgbGVuID0gc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgdGhpcy53ID0gMTtcbiAgICAgICAgdGhpcy54ID0gdGhpcy55ID0gdGhpcy56ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHZhciBoYWxmVGhldGEgPSBhbmdsZSAqIDAuNTtcbiAgICAgICAgdmFyIHMgPSBzaW4oaGFsZlRoZXRhKTtcbiAgICAgICAgdGhpcy53ID0gY29zKGhhbGZUaGV0YSk7XG4gICAgICAgIHRoaXMueCA9IHMgKiB4ICogbGVuO1xuICAgICAgICB0aGlzLnkgPSBzICogeSAqIGxlbjtcbiAgICAgICAgdGhpcy56ID0gcyAqIHogKiBsZW47XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB0aGUgaW5wdXQgUXVhdGVybmlvbnMuXG4gKiBMZWZ0LWhhbmRlZCBjb29yZGluYXRlIHN5c3RlbSBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxMSBUaGUgbGVmdCBRdWF0ZXJuaW9uLlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxMiBUaGUgcmlnaHQgUXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gb3V0cHV0IFF1YXRlcm5pb24gaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgcHJvZHVjdCBvZiBtdWx0aXBsaWNhdGlvbi5cbiAqL1xuUXVhdGVybmlvbi5tdWx0aXBseSA9IGZ1bmN0aW9uIG11bHRpcGx5KHExLCBxMiwgb3V0cHV0KSB7XG4gICAgdmFyIHcxID0gcTEudyB8fCAwO1xuICAgIHZhciB4MSA9IHExLng7XG4gICAgdmFyIHkxID0gcTEueTtcbiAgICB2YXIgejEgPSBxMS56O1xuXG4gICAgdmFyIHcyID0gcTIudyB8fCAwO1xuICAgIHZhciB4MiA9IHEyLng7XG4gICAgdmFyIHkyID0gcTIueTtcbiAgICB2YXIgejIgPSBxMi56O1xuXG4gICAgb3V0cHV0LncgPSB3MSAqIHcyIC0geDEgKiB4MiAtIHkxICogeTIgLSB6MSAqIHoyO1xuICAgIG91dHB1dC54ID0geDEgKiB3MiArIHgyICogdzEgKyB5MiAqIHoxIC0geTEgKiB6MjtcbiAgICBvdXRwdXQueSA9IHkxICogdzIgKyB5MiAqIHcxICsgeDEgKiB6MiAtIHgyICogejE7XG4gICAgb3V0cHV0LnogPSB6MSAqIHcyICsgejIgKiB3MSArIHgyICogeTEgLSB4MSAqIHkyO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGUgaW5wdXQgcXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSByZWZlcmVuY2UgUXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gb3V0cHV0IFF1YXRlcm5pb24gaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgbm9ybWFsaXplZCBxdWF0ZXJuaW9uLlxuICovXG5RdWF0ZXJuaW9uLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZShxLCBvdXRwdXQpIHtcbiAgICB2YXIgdyA9IHEudztcbiAgICB2YXIgeCA9IHEueDtcbiAgICB2YXIgeSA9IHEueTtcbiAgICB2YXIgeiA9IHEuejtcbiAgICB2YXIgbGVuZ3RoID0gc3FydCh3ICogdyArIHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXM7XG4gICAgbGVuZ3RoID0gMSAvIGxlbmd0aDtcbiAgICBvdXRwdXQudyAqPSBsZW5ndGg7XG4gICAgb3V0cHV0LnggKj0gbGVuZ3RoO1xuICAgIG91dHB1dC55ICo9IGxlbmd0aDtcbiAgICBvdXRwdXQueiAqPSBsZW5ndGg7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogVGhlIGNvbmp1Z2F0ZSBvZiB0aGUgaW5wdXQgUXVhdGVybmlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtRdWF0ZXJuaW9ufSBxIFRoZSByZWZlcmVuY2UgUXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gb3V0cHV0IFF1YXRlcm5pb24gaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtRdWF0ZXJuaW9ufSBUaGUgY29uanVnYXRlIFF1YXRlcm5pb24uXG4gKi9cblF1YXRlcm5pb24uY29uanVnYXRlID0gZnVuY3Rpb24gY29uanVnYXRlKHEsIG91dHB1dCkge1xuICAgIG91dHB1dC53ID0gcS53O1xuICAgIG91dHB1dC54ID0gLXEueDtcbiAgICBvdXRwdXQueSA9IC1xLnk7XG4gICAgb3V0cHV0LnogPSAtcS56O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIENsb25lIHRoZSBpbnB1dCBRdWF0ZXJuaW9uLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgdGhlIHJlZmVyZW5jZSBRdWF0ZXJuaW9uLlxuICpcbiAqIEByZXR1cm4ge1F1YXRlcm5pb259IFRoZSBjbG9uZWQgUXVhdGVybmlvbi5cbiAqL1xuUXVhdGVybmlvbi5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKHEpIHtcbiAgICByZXR1cm4gbmV3IFF1YXRlcm5pb24ocS53LCBxLngsIHEueSwgcS56KTtcbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSB0d28gaW5wdXQgUXVhdGVybmlvbnMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcTEgVGhlIGxlZnQgUXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcTIgVGhlIHJpZ2h0IFF1YXRlcm5pb24uXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIHR3byBRdWF0ZXJuaW9ucy5cbiAqL1xuUXVhdGVybmlvbi5kb3QgPSBmdW5jdGlvbiBkb3QocTEsIHEyKSB7XG4gICAgcmV0dXJuIHExLncgKiBxMi53ICsgcTEueCAqIHEyLnggKyBxMS55ICogcTIueSArIHExLnogKiBxMi56O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWF0ZXJuaW9uO1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIFZlYzMgPSByZXF1aXJlKCcuL1ZlYzMnKTtcblxuXG52YXIgUmF5ID0gZnVuY3Rpb24gKCBvcmlnaW4sIGRpcmVjdGlvbiApIHtcblxuXHR0aGlzLm9yaWdpbiA9ICggb3JpZ2luICE9PSB1bmRlZmluZWQgKSA/ICBuZXcgVmVjMyhvcmlnaW5bMF0sb3JpZ2luWzFdLG9yaWdpblsyXSkgOiBuZXcgVmVjMygpO1xuXHR0aGlzLmRpcmVjdGlvbiA9ICggZGlyZWN0aW9uICE9PSB1bmRlZmluZWQgKSA/IG5ldyBWZWMzKGRpcmVjdGlvblswXSxkaXJlY3Rpb25bMV0sZGlyZWN0aW9uWzJdKSA6IG5ldyBWZWMzKCk7XG5cbn07XG5cblJheS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCBvcmlnaW4sIGRpcmVjdGlvbiApIHtcblxuXHRcdHRoaXMub3JpZ2luLmNvcHkoIG9yaWdpbiApO1xuXHRcdHRoaXMuZGlyZWN0aW9uLmNvcHkoIGRpcmVjdGlvbiApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cbn07XG5cblJheS5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICggcmF5ICkge1xuXG5cdFx0dGhpcy5vcmlnaW4uY29weSggcmF5Lm9yaWdpbiApO1xuXHRcdHRoaXMuZGlyZWN0aW9uLmNvcHkoIHJheS5kaXJlY3Rpb24gKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXG59O1xuXG5SYXkucHJvdG90eXBlLmF0ID0gIGZ1bmN0aW9uICggdCApIHtcblxuICAgIHZhciByZXN1bHQgPSBuZXcgVmVjMygpO1xuXG4gICAgcmV0dXJuIHJlc3VsdC5jb3B5KCB0aGlzLmRpcmVjdGlvbiApLnNjYWxlKCB0ICkuYWRkKCB0aGlzLm9yaWdpbiApO1xuXG59O1xuXG5cblJheS5wcm90b3R5cGUuaW50ZXJzZWN0U3BoZXJlID0gZnVuY3Rpb24gKGNlbnRlciwgcmFkaXVzKSB7XG5cblx0Ly8gZnJvbSBodHRwOi8vd3d3LnNjcmF0Y2hhcGl4ZWwuY29tL2xlc3NvbnMvM2QtYmFzaWMtbGVzc29ucy9sZXNzb24tNy1pbnRlcnNlY3Rpbmctc2ltcGxlLXNoYXBlcy9yYXktc3BoZXJlLWludGVyc2VjdGlvbi9cblxuXHR2YXIgdmVjID0gbmV3IFZlYzMoKTtcbiAgICB2YXIgYyA9IG5ldyBWZWMzKGNlbnRlclswXSxjZW50ZXJbMV0sY2VudGVyWzJdKTtcblxuXHR2ZWMuc3ViVmVjdG9ycyggYywgdGhpcy5vcmlnaW4gKTtcblxuXHR2YXIgdGNhID0gdmVjLmRvdCggdGhpcy5kaXJlY3Rpb24gKTtcblxuXHR2YXIgZDIgPSB2ZWMuZG90KCB2ZWMgKSAtIHRjYSAqIHRjYTtcblxuXHR2YXIgcmFkaXVzMiA9IHJhZGl1cyAqIHJhZGl1cztcblxuXHRpZiAoIGQyID4gcmFkaXVzMiApIHJldHVybiBudWxsO1xuXG5cdHZhciB0aGMgPSBNYXRoLnNxcnQoIHJhZGl1czIgLSBkMiApO1xuXG5cdC8vIHQwID0gZmlyc3QgaW50ZXJzZWN0IHBvaW50IC0gZW50cmFuY2Ugb24gZnJvbnQgb2Ygc3BoZXJlXG5cdHZhciB0MCA9IHRjYSAtIHRoYztcblxuXHQvLyB0MSA9IHNlY29uZCBpbnRlcnNlY3QgcG9pbnQgLSBleGl0IHBvaW50IG9uIGJhY2sgb2Ygc3BoZXJlXG5cdHZhciB0MSA9IHRjYSArIHRoYztcblxuXHQvLyB0ZXN0IHRvIHNlZSBpZiBib3RoIHQwIGFuZCB0MSBhcmUgYmVoaW5kIHRoZSByYXkgLSBpZiBzbywgcmV0dXJuIG51bGxcblx0aWYgKCB0MCA8IDAgJiYgdDEgPCAwICkgcmV0dXJuIG51bGw7XG5cblx0Ly8gdGVzdCB0byBzZWUgaWYgdDAgaXMgYmVoaW5kIHRoZSByYXk6XG5cdC8vIGlmIGl0IGlzLCB0aGUgcmF5IGlzIGluc2lkZSB0aGUgc3BoZXJlLCBzbyByZXR1cm4gdGhlIHNlY29uZCBleGl0IHBvaW50IHNjYWxlZCBieSB0MSxcblx0Ly8gaW4gb3JkZXIgdG8gYWx3YXlzIHJldHVybiBhbiBpbnRlcnNlY3QgcG9pbnQgdGhhdCBpcyBpbiBmcm9udCBvZiB0aGUgcmF5LlxuXHRpZiAoIHQwIDwgMCApIHJldHVybiB0aGlzLmF0KCB0MSApO1xuXG5cdC8vIGVsc2UgdDAgaXMgaW4gZnJvbnQgb2YgdGhlIHJheSwgc28gcmV0dXJuIHRoZSBmaXJzdCBjb2xsaXNpb24gcG9pbnQgc2NhbGVkIGJ5IHQwXG5cdHJldHVybiB0aGlzLmF0KCB0MCApO1xuXG59O1xuXG5SYXkucHJvdG90eXBlLmludGVyc2VjdEJveCA9IGZ1bmN0aW9uKGNlbnRlciwgc2l6ZSkge1xuXG4gICAgdmFyIHRtaW4sXG4gICAgICAgIHRtYXgsXG4gICAgICAgIHR5bWluLFxuICAgICAgICB0eW1heCxcbiAgICAgICAgdHptaW4sXG4gICAgICAgIHR6bWF4LFxuICAgICAgICBib3gsXG4gICAgICAgIG91dCxcbiAgICAgICAgaW52ZGlyeCA9IDEgLyB0aGlzLmRpcmVjdGlvbi54LFxuICAgICAgICBpbnZkaXJ5ID0gMSAvIHRoaXMuZGlyZWN0aW9uLnksXG4gICAgICAgIGludmRpcnogPSAxIC8gdGhpcy5kaXJlY3Rpb24uejtcblxuICAgIGJveCA9IHtcbiAgICAgICAgbWluOiB7XG4gICAgICAgICAgICB4OiBjZW50ZXJbMF0tKHNpemVbMF0vMiksXG4gICAgICAgICAgICB5OiBjZW50ZXJbMV0tKHNpemVbMV0vMiksXG4gICAgICAgICAgICB6OiBjZW50ZXJbMl0tKHNpemVbMl0vMilcbiAgICAgICAgfSxcbiAgICAgICAgbWF4OiB7XG4gICAgICAgICAgICB4OiBjZW50ZXJbMF0rKHNpemVbMF0vMiksXG4gICAgICAgICAgICB5OiBjZW50ZXJbMV0rKHNpemVbMV0vMiksXG4gICAgICAgICAgICB6OiBjZW50ZXJbMl0rKHNpemVbMl0vMilcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIGludmRpcnggPj0gMCApIHtcblxuICAgICAgICB0bWluID0gKCBib3gubWluLnggLSB0aGlzLm9yaWdpbi54ICkgKiBpbnZkaXJ4O1xuICAgICAgICB0bWF4ID0gKCBib3gubWF4LnggLSB0aGlzLm9yaWdpbi54ICkgKiBpbnZkaXJ4O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICB0bWluID0gKCBib3gubWF4LnggLSB0aGlzLm9yaWdpbi54ICkgKiBpbnZkaXJ4O1xuICAgICAgICB0bWF4ID0gKCBib3gubWluLnggLSB0aGlzLm9yaWdpbi54ICkgKiBpbnZkaXJ4O1xuICAgIH1cblxuICAgIGlmICggaW52ZGlyeSA+PSAwICkge1xuXG4gICAgICAgIHR5bWluID0gKCBib3gubWluLnkgLSB0aGlzLm9yaWdpbi55ICkgKiBpbnZkaXJ5O1xuICAgICAgICB0eW1heCA9ICggYm94Lm1heC55IC0gdGhpcy5vcmlnaW4ueSApICogaW52ZGlyeTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdHltaW4gPSAoIGJveC5tYXgueSAtIHRoaXMub3JpZ2luLnkgKSAqIGludmRpcnk7XG4gICAgICAgIHR5bWF4ID0gKCBib3gubWluLnkgLSB0aGlzLm9yaWdpbi55ICkgKiBpbnZkaXJ5O1xuICAgIH1cblxuICAgIGlmICggKCB0bWluID4gdHltYXggKSB8fCAoIHR5bWluID4gdG1heCApICkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoIHR5bWluID4gdG1pbiB8fCB0bWluICE9PSB0bWluICkgdG1pbiA9IHR5bWluO1xuXG4gICAgaWYgKCB0eW1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCApIHRtYXggPSB0eW1heDtcblxuICAgIGlmICggaW52ZGlyeiA+PSAwICkge1xuXG4gICAgICAgIHR6bWluID0gKCBib3gubWluLnogLSB0aGlzLm9yaWdpbi56ICkgKiBpbnZkaXJ6O1xuICAgICAgICB0em1heCA9ICggYm94Lm1heC56IC0gdGhpcy5vcmlnaW4ueiApICogaW52ZGlyejtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdHptaW4gPSAoIGJveC5tYXgueiAtIHRoaXMub3JpZ2luLnogKSAqIGludmRpcno7XG4gICAgICAgIHR6bWF4ID0gKCBib3gubWluLnogLSB0aGlzLm9yaWdpbi56ICkgKiBpbnZkaXJ6O1xuICAgIH1cblxuICAgIGlmICggKCB0bWluID4gdHptYXggKSB8fCAoIHR6bWluID4gdG1heCApICkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoIHR6bWluID4gdG1pbiB8fCB0bWluICE9PSB0bWluICkgdG1pbiA9IHR6bWluO1xuXG4gICAgaWYgKCB0em1heCA8IHRtYXggfHwgdG1heCAhPT0gdG1heCApIHRtYXggPSB0em1heDtcblxuXG4gICAgaWYgKCB0bWF4IDwgMCApIHJldHVybiBudWxsO1xuXG4gICAgb3V0ID0gdGhpcy5kaXJlY3Rpb24uc2NhbGUodG1pbiA+PSAwID8gdG1pbiA6IHRtYXgpO1xuICAgIHJldHVybiBvdXQuYWRkKG91dCwgdGhpcy5vcmlnaW4sIG91dCk7XG5cbn07XG5cblxuUmF5LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAoIHJheSApIHtcblxuXHRcdHJldHVybiByYXkub3JpZ2luLmVxdWFscyggdGhpcy5vcmlnaW4gKSAmJiByYXkuZGlyZWN0aW9uLmVxdWFscyggdGhpcy5kaXJlY3Rpb24gKTtcblxufTtcblxuUmF5LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHJldHVybiBuZXcgUmF5KCkuY29weSggdGhpcyApO1xuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5O1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgdHdvLWRpbWVuc2lvbmFsIHZlY3Rvci5cbiAqXG4gKiBAY2xhc3MgVmVjMlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqL1xudmFyIFZlYzIgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSB8fCB4IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5KSB7XG4gICAgICAgIHRoaXMueCA9IHhbMF0gfHwgMDtcbiAgICAgICAgdGhpcy55ID0geFsxXSB8fCAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy54ID0geCB8fCAwO1xuICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgfVxufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50LlxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KHgsIHkpIHtcbiAgICBpZiAoeCAhPSBudWxsKSB0aGlzLnggPSB4O1xuICAgIGlmICh5ICE9IG51bGwpIHRoaXMueSA9IHk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgaW5wdXQgdiB0byB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVGhlIFZlYzIgdG8gYWRkLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKHYpIHtcbiAgICB0aGlzLnggKz0gdi54O1xuICAgIHRoaXMueSArPSB2Lnk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBpbnB1dCB2IGZyb20gdGhlIGN1cnJlbnQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFRoZSBWZWMyIHRvIHN1YnRyYWN0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCh2KSB7XG4gICAgdGhpcy54IC09IHYueDtcbiAgICB0aGlzLnkgLT0gdi55O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTY2FsZSB0aGUgY3VycmVudCBWZWMyIGJ5IGEgc2NhbGFyIG9yIFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfFZlYzJ9IHMgVGhlIE51bWJlciBvciB2ZWMyIGJ5IHdoaWNoIHRvIHNjYWxlLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiBzY2FsZShzKSB7XG4gICAgaWYgKHMgaW5zdGFuY2VvZiBWZWMyKSB7XG4gICAgICAgIHRoaXMueCAqPSBzLng7XG4gICAgICAgIHRoaXMueSAqPSBzLnk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnggKj0gcztcbiAgICAgICAgdGhpcy55ICo9IHM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSb3RhdGUgdGhlIFZlYzIgY291bnRlci1jbG9ja3dpc2UgYnkgdGhldGEgYWJvdXQgdGhlIHotYXhpcy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRoZXRhIEFuZ2xlIGJ5IHdoaWNoIHRvIHJvdGF0ZS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKHRoZXRhKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG5cbiAgICB2YXIgY29zVGhldGEgPSBNYXRoLmNvcyh0aGV0YSk7XG4gICAgdmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuXG4gICAgdGhpcy54ID0geCAqIGNvc1RoZXRhIC0geSAqIHNpblRoZXRhO1xuICAgIHRoaXMueSA9IHggKiBzaW5UaGV0YSArIHkgKiBjb3NUaGV0YTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2Ygb2YgdGhlIGN1cnJlbnQgVmVjMiB3aXRoIHRoZSBpbnB1dCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdiBUaGUgb3RoZXIgVmVjMi5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xufTtcblxuLyoqXG4gKiBUaGUgY3Jvc3MgcHJvZHVjdCBvZiBvZiB0aGUgY3VycmVudCBWZWMyIHdpdGggdGhlIGlucHV0IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2IFRoZSBvdGhlciBWZWMyLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueDtcbn07XG5cbi8qKlxuICogUHJlc2VydmUgdGhlIG1hZ25pdHVkZSBidXQgaW52ZXJ0IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmludmVydCA9IGZ1bmN0aW9uIGludmVydCgpIHtcbiAgICB0aGlzLnggKj0gLTE7XG4gICAgdGhpcy55ICo9IC0xO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBcHBseSBhIGZ1bmN0aW9uIGNvbXBvbmVudC13aXNlIHRvIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGFwcGx5LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IHRoaXNcbiAqL1xuVmVjMi5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwKGZuKSB7XG4gICAgdGhpcy54ID0gZm4odGhpcy54KTtcbiAgICB0aGlzLnkgPSBmbih0aGlzLnkpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBsZW5ndGggb2YgdGhlIHZlY3RvclxuICovXG5WZWMyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgoKSB7XG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSBpbnB1dCBvbnRvIHRoZSBjdXJyZW50IFZlYzIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdiBWZWMyIHRvIGNvcHlcbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5KHYpIHtcbiAgICB0aGlzLnggPSB2Lng7XG4gICAgdGhpcy55ID0gdi55O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSB0aGlzXG4gKi9cblZlYzIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBtYWduaXR1ZGUgb2YgdGhlIGN1cnJlbnQgVmVjMiBpcyBleGFjdGx5IDAuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgb3Igbm90IHRoZSBsZW5ndGggaXMgMFxuICovXG5WZWMyLnByb3RvdHlwZS5pc1plcm8gPSBmdW5jdGlvbiBpc1plcm8oKSB7XG4gICAgaWYgKHRoaXMueCAhPT0gMCB8fCB0aGlzLnkgIT09IDApIHJldHVybiBmYWxzZTtcbiAgICBlbHNlIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBUaGUgYXJyYXkgZm9ybSBvZiB0aGUgY3VycmVudCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gdGhlIFZlYyB0byBhcyBhbiBhcnJheVxuICovXG5WZWMyLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICByZXR1cm4gW3RoaXMueCwgdGhpcy55XTtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBpbnB1dCBWZWMyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzJ9IHYgVGhlIHJlZmVyZW5jZSBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSBvdXRwdXQgVmVjMiBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBub3JtYWxpemVkIFZlYzIuXG4gKi9cblZlYzIubm9ybWFsaXplID0gZnVuY3Rpb24gbm9ybWFsaXplKHYsIG91dHB1dCkge1xuICAgIHZhciB4ID0gdi54O1xuICAgIHZhciB5ID0gdi55O1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KSB8fCAxO1xuICAgIGxlbmd0aCA9IDEgLyBsZW5ndGg7XG4gICAgb3V0cHV0LnggPSB2LnggKiBsZW5ndGg7XG4gICAgb3V0cHV0LnkgPSB2LnkgKiBsZW5ndGg7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBDbG9uZSB0aGUgaW5wdXQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFRoZSBWZWMyIHRvIGNsb25lLlxuICpcbiAqIEByZXR1cm4ge1ZlYzJ9IFRoZSBjbG9uZWQgVmVjMi5cbiAqL1xuVmVjMi5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKHYpIHtcbiAgICByZXR1cm4gbmV3IFZlYzIodi54LCB2LnkpO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGlucHV0IFZlYzIncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2MSBUaGUgbGVmdCBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSB2MiBUaGUgcmlnaHQgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gb3V0cHV0IFZlYzIgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSBUaGUgcmVzdWx0IG9mIHRoZSBhZGRpdGlvbi5cbiAqL1xuVmVjMi5hZGQgPSBmdW5jdGlvbiBhZGQodjEsIHYyLCBvdXRwdXQpIHtcbiAgICBvdXRwdXQueCA9IHYxLnggKyB2Mi54O1xuICAgIG91dHB1dC55ID0gdjEueSArIHYyLnk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGUgc2Vjb25kIFZlYzIgZnJvbSB0aGUgZmlyc3QuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjMn0gdjEgVGhlIGxlZnQgVmVjMi5cbiAqIEBwYXJhbSB7VmVjMn0gdjIgVGhlIHJpZ2h0IFZlYzIuXG4gKiBAcGFyYW0ge1ZlYzJ9IG91dHB1dCBWZWMyIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjMn0gVGhlIHJlc3VsdCBvZiB0aGUgc3VidHJhY3Rpb24uXG4gKi9cblZlYzIuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCh2MSwgdjIsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdjEueCAtIHYyLng7XG4gICAgb3V0cHV0LnkgPSB2MS55IC0gdjIueTtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBTY2FsZSB0aGUgaW5wdXQgVmVjMi5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2IFRoZSByZWZlcmVuY2UgVmVjMi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBzIE51bWJlciB0byBzY2FsZSBieS5cbiAqIEBwYXJhbSB7VmVjMn0gb3V0cHV0IFZlYzIgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMyfSBUaGUgcmVzdWx0IG9mIHRoZSBzY2FsaW5nLlxuICovXG5WZWMyLnNjYWxlID0gZnVuY3Rpb24gc2NhbGUodiwgcywgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2LnggKiBzO1xuICAgIG91dHB1dC55ID0gdi55ICogcztcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBUaGUgZG90IHByb2R1Y3Qgb2YgdGhlIGlucHV0IFZlYzIncy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMyfSB2MSBUaGUgbGVmdCBWZWMyLlxuICogQHBhcmFtIHtWZWMyfSB2MiBUaGUgcmlnaHQgVmVjMi5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdC5cbiAqL1xuVmVjMi5kb3QgPSBmdW5jdGlvbiBkb3QodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLnggKiB2Mi54ICsgdjEueSAqIHYyLnk7XG59O1xuXG4vKipcbiAqIFRoZSBjcm9zcyBwcm9kdWN0IG9mIHRoZSBpbnB1dCBWZWMyJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2MSBUaGUgbGVmdCBWZWMyLlxuICogQHBhcmFtIHtOdW1iZXJ9IHYyIFRoZSByaWdodCBWZWMyLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gVGhlIHotY29tcG9uZW50IG9mIHRoZSBjcm9zcyBwcm9kdWN0LlxuICovXG5WZWMyLmNyb3NzID0gZnVuY3Rpb24odjEsdjIpIHtcbiAgICByZXR1cm4gdjEueCAqIHYyLnkgLSB2MS55ICogdjIueDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMjtcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIHRocmVlLWRpbWVuc2lvbmFsIHZlY3Rvci5cbiAqXG4gKiBAY2xhc3MgVmVjM1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFRoZSB6IGNvbXBvbmVudC5cbiAqL1xudmFyIFZlYzMgPSBmdW5jdGlvbih4LCB5LCB6KXtcbiAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgdGhpcy55ID0geSB8fCAwO1xuICAgIHRoaXMueiA9IHogfHwgMDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudC5cbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFRoZSB6IGNvbXBvbmVudC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCh4LCB5LCB6KSB7XG4gICAgaWYgKHggIT0gbnVsbCkgdGhpcy54ID0geDtcbiAgICBpZiAoeSAhPSBudWxsKSB0aGlzLnkgPSB5O1xuICAgIGlmICh6ICE9IG51bGwpIHRoaXMueiA9IHo7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkIHRoZSBpbnB1dCB2IHRvIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgVmVjMyB0byBhZGQuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQodikge1xuICAgIHRoaXMueCArPSB2Lng7XG4gICAgdGhpcy55ICs9IHYueTtcbiAgICB0aGlzLnogKz0gdi56O1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBpbnB1dCB2IGZyb20gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSBWZWMzIHRvIHN1YnRyYWN0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCh2KSB7XG4gICAgdGhpcy54IC09IHYueDtcbiAgICB0aGlzLnkgLT0gdi55O1xuICAgIHRoaXMueiAtPSB2Lno7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhlIGlucHV0IGEgZnJvbSBiIGFuZCBjcmVhdGUgbmV3IHZlY3Rvci5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSBhIFRoZSBWZWMzIHRvIHN1YnRyYWN0LlxuICogQHBhcmFtIHtWZWMzfSBiIFRoZSBWZWMzIHRvIHN1YnRyYWN0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuc3ViVmVjdG9ycyA9IGZ1bmN0aW9uICggYSwgYiApIHtcblxuXHR0aGlzLnggPSBhLnggLSBiLng7XG5cdHRoaXMueSA9IGEueSAtIGIueTtcblx0dGhpcy56ID0gYS56IC0gYi56O1xuXG5cdHJldHVybiB0aGlzO1xuXG59O1xuXG4vKipcbiAqIFJvdGF0ZSB0aGUgY3VycmVudCBWZWMzIGJ5IHRoZXRhIGNsb2Nrd2lzZSBhYm91dCB0aGUgeCBheGlzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGhldGEgQW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUucm90YXRlWCA9IGZ1bmN0aW9uIHJvdGF0ZVgodGhldGEpIHtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICB0aGlzLnkgPSB5ICogY29zVGhldGEgLSB6ICogc2luVGhldGE7XG4gICAgdGhpcy56ID0geSAqIHNpblRoZXRhICsgeiAqIGNvc1RoZXRhO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSB0aGUgY3VycmVudCBWZWMzIGJ5IHRoZXRhIGNsb2Nrd2lzZSBhYm91dCB0aGUgeSBheGlzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGhldGEgQW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUucm90YXRlWSA9IGZ1bmN0aW9uIHJvdGF0ZVkodGhldGEpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICB0aGlzLnggPSB6ICogc2luVGhldGEgKyB4ICogY29zVGhldGE7XG4gICAgdGhpcy56ID0geiAqIGNvc1RoZXRhIC0geCAqIHNpblRoZXRhO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSB0aGUgY3VycmVudCBWZWMzIGJ5IHRoZXRhIGNsb2Nrd2lzZSBhYm91dCB0aGUgeiBheGlzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdGhldGEgQW5nbGUgYnkgd2hpY2ggdG8gcm90YXRlLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUucm90YXRlWiA9IGZ1bmN0aW9uIHJvdGF0ZVoodGhldGEpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcblxuICAgIHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcbiAgICB2YXIgc2luVGhldGEgPSBNYXRoLnNpbih0aGV0YSk7XG5cbiAgICB0aGlzLnggPSB4ICogY29zVGhldGEgLSB5ICogc2luVGhldGE7XG4gICAgdGhpcy55ID0geCAqIHNpblRoZXRhICsgeSAqIGNvc1RoZXRhO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgY3VycmVudCBWZWMzIHdpdGggaW5wdXQgVmVjMyB2LlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIG90aGVyIFZlYzMuXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiBkb3Qodikge1xuICAgIHJldHVybiB0aGlzLngqdi54ICsgdGhpcy55KnYueSArIHRoaXMueip2Lno7XG59O1xuXG4vKipcbiAqIFRoZSBkb3QgcHJvZHVjdCBvZiB0aGUgY3VycmVudCBWZWMzIHdpdGggaW5wdXQgVmVjMyB2LlxuICogU3RvcmVzIHRoZSByZXN1bHQgaW4gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kIGNyb3NzXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSBvdGhlciBWZWMzXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uIGNyb3NzKHYpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciB2eCA9IHYueDtcbiAgICB2YXIgdnkgPSB2Lnk7XG4gICAgdmFyIHZ6ID0gdi56O1xuXG4gICAgdGhpcy54ID0geSAqIHZ6IC0geiAqIHZ5O1xuICAgIHRoaXMueSA9IHogKiB2eCAtIHggKiB2ejtcbiAgICB0aGlzLnogPSB4ICogdnkgLSB5ICogdng7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNjYWxlIHRoZSBjdXJyZW50IFZlYzMgYnkgYSBzY2FsYXIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzIFRoZSBOdW1iZXIgYnkgd2hpY2ggdG8gc2NhbGVcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLnNjYWxlID0gZnVuY3Rpb24gc2NhbGUocykge1xuICAgIHRoaXMueCAqPSBzO1xuICAgIHRoaXMueSAqPSBzO1xuICAgIHRoaXMueiAqPSBzO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFByZXNlcnZlIHRoZSBtYWduaXR1ZGUgYnV0IGludmVydCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5pbnZlcnQgPSBmdW5jdGlvbiBpbnZlcnQoKSB7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHRoaXMueiA9IC10aGlzLno7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwbHkgYSBmdW5jdGlvbiBjb21wb25lbnQtd2lzZSB0byB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBhcHBseS5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcChmbikge1xuICAgIHRoaXMueCA9IGZuKHRoaXMueCk7XG4gICAgdGhpcy55ID0gZm4odGhpcy55KTtcbiAgICB0aGlzLnogPSBmbih0aGlzLnopO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFRoZSBtYWduaXR1ZGUgb2YgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSB0aGUgbWFnbml0dWRlIG9mIHRoZSBWZWMzXG4gKi9cblZlYzMucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCgpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbn07XG5cbi8qKlxuICogVGhlIG1hZ25pdHVkZSBzcXVhcmVkIG9mIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gbWFnbml0dWRlIG9mIHRoZSBWZWMzIHNxdWFyZWRcbiAqL1xuVmVjMy5wcm90b3R5cGUubGVuZ3RoU3EgPSBmdW5jdGlvbiBsZW5ndGhTcSgpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHo7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIGlucHV0IG9udG8gdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFZlYzMgdG8gY29weVxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IHRoaXNcbiAqL1xuVmVjMy5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkodikge1xuICAgIHRoaXMueCA9IHYueDtcbiAgICB0aGlzLnkgPSB2Lnk7XG4gICAgdGhpcy56ID0gdi56O1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXNldCB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMueiA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3VycmVudCBWZWMzIGlzIGV4YWN0bHkgMC5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciBvciBub3QgdGhlIG1hZ25pdHVkZSBpcyB6ZXJvXG4gKi9cblZlYzMucHJvdG90eXBlLmlzWmVybyA9IGZ1bmN0aW9uIGlzWmVybygpIHtcbiAgICByZXR1cm4gdGhpcy54ID09PSAwICYmIHRoaXMueSA9PT0gMCAmJiB0aGlzLnogPT09IDA7XG59O1xuXG4vKipcbiAqIFRoZSBhcnJheSBmb3JtIG9mIHRoZSBjdXJyZW50IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBhIHRocmVlIGVsZW1lbnQgYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBjb21wb25lbnRzIG9mIHRoZSBWZWMzXG4gKi9cblZlYzMucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMuel07XG59O1xuXG4vKipcbiAqIFByZXNlcnZlIHRoZSBvcmllbnRhdGlvbiBidXQgY2hhbmdlIHRoZSBsZW5ndGggb2YgdGhlIGN1cnJlbnQgVmVjMyB0byAxLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIG5vcm1hbGl6ZSgpIHtcbiAgICB2YXIgeCA9IHRoaXMueDtcbiAgICB2YXIgeSA9IHRoaXMueTtcbiAgICB2YXIgeiA9IHRoaXMuejtcblxuICAgIHZhciBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSB8fCAxO1xuICAgIGxlbiA9IDEgLyBsZW47XG5cbiAgICB0aGlzLnggKj0gbGVuO1xuICAgIHRoaXMueSAqPSBsZW47XG4gICAgdGhpcy56ICo9IGxlbjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQXBwbHkgdGhlIHJvdGF0aW9uIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGlucHV0ICh1bml0KSBRdWF0ZXJuaW9uXG4gKiB0byB0aGUgY3VycmVudCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1F1YXRlcm5pb259IHEgVW5pdCBRdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb24gdG8gYXBwbHlcbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSB0aGlzXG4gKi9cblZlYzMucHJvdG90eXBlLmFwcGx5Um90YXRpb24gPSBmdW5jdGlvbiBhcHBseVJvdGF0aW9uKHEpIHtcbiAgICB2YXIgY3cgPSBxLnc7XG4gICAgdmFyIGN4ID0gLXEueDtcbiAgICB2YXIgY3kgPSAtcS55O1xuICAgIHZhciBjeiA9IC1xLno7XG5cbiAgICB2YXIgdnggPSB0aGlzLng7XG4gICAgdmFyIHZ5ID0gdGhpcy55O1xuICAgIHZhciB2eiA9IHRoaXMuejtcblxuICAgIHZhciB0dyA9IC1jeCAqIHZ4IC0gY3kgKiB2eSAtIGN6ICogdno7XG4gICAgdmFyIHR4ID0gdnggKiBjdyArIHZ5ICogY3ogLSBjeSAqIHZ6O1xuICAgIHZhciB0eSA9IHZ5ICogY3cgKyBjeCAqIHZ6IC0gdnggKiBjejtcbiAgICB2YXIgdHogPSB2eiAqIGN3ICsgdnggKiBjeSAtIGN4ICogdnk7XG5cbiAgICB2YXIgdyA9IGN3O1xuICAgIHZhciB4ID0gLWN4O1xuICAgIHZhciB5ID0gLWN5O1xuICAgIHZhciB6ID0gLWN6O1xuXG4gICAgdGhpcy54ID0gdHggKiB3ICsgeCAqIHR3ICsgeSAqIHR6IC0gdHkgKiB6O1xuICAgIHRoaXMueSA9IHR5ICogdyArIHkgKiB0dyArIHR4ICogeiAtIHggKiB0ejtcbiAgICB0aGlzLnogPSB0eiAqIHcgKyB6ICogdHcgKyB4ICogdHkgLSB0eCAqIHk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFwcGx5IHRoZSBpbnB1dCBNYXQzMyB0aGUgdGhlIGN1cnJlbnQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtNYXQzM30gbWF0cml4IE1hdDMzIHRvIGFwcGx5XG4gKlxuICogQHJldHVybiB7VmVjM30gdGhpc1xuICovXG5WZWMzLnByb3RvdHlwZS5hcHBseU1hdHJpeCA9IGZ1bmN0aW9uIGFwcGx5TWF0cml4KG1hdHJpeCkge1xuICAgIHZhciBNID0gbWF0cml4LmdldCgpO1xuXG4gICAgdmFyIHggPSB0aGlzLng7XG4gICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgdmFyIHogPSB0aGlzLno7XG5cbiAgICB0aGlzLnggPSBNWzBdKnggKyBNWzFdKnkgKyBNWzJdKno7XG4gICAgdGhpcy55ID0gTVszXSp4ICsgTVs0XSp5ICsgTVs1XSp6O1xuICAgIHRoaXMueiA9IE1bNl0qeCArIE1bN10qeSArIE1bOF0qejtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIHRoZSBpbnB1dCBWZWMzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYgVGhlIHJlZmVyZW5jZSBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSBub3JtYWxpemUgVmVjMy5cbiAqL1xuVmVjMy5ub3JtYWxpemUgPSBmdW5jdGlvbiBub3JtYWxpemUodiwgb3V0cHV0KSB7XG4gICAgdmFyIHggPSB2Lng7XG4gICAgdmFyIHkgPSB2Lnk7XG4gICAgdmFyIHogPSB2Lno7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeikgfHwgMTtcbiAgICBsZW5ndGggPSAxIC8gbGVuZ3RoO1xuXG4gICAgb3V0cHV0LnggPSB4ICogbGVuZ3RoO1xuICAgIG91dHB1dC55ID0geSAqIGxlbmd0aDtcbiAgICBvdXRwdXQueiA9IHogKiBsZW5ndGg7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogQXBwbHkgYSByb3RhdGlvbiB0byB0aGUgaW5wdXQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSByZWZlcmVuY2UgVmVjMy5cbiAqIEBwYXJhbSB7UXVhdGVybmlvbn0gcSBVbml0IFF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvbiB0byBhcHBseS5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcm90YXRlZCB2ZXJzaW9uIG9mIHRoZSBpbnB1dCBWZWMzLlxuICovXG5WZWMzLmFwcGx5Um90YXRpb24gPSBmdW5jdGlvbiBhcHBseVJvdGF0aW9uKHYsIHEsIG91dHB1dCkge1xuICAgIHZhciBjdyA9IHEudztcbiAgICB2YXIgY3ggPSAtcS54O1xuICAgIHZhciBjeSA9IC1xLnk7XG4gICAgdmFyIGN6ID0gLXEuejtcblxuICAgIHZhciB2eCA9IHYueDtcbiAgICB2YXIgdnkgPSB2Lnk7XG4gICAgdmFyIHZ6ID0gdi56O1xuXG4gICAgdmFyIHR3ID0gLWN4ICogdnggLSBjeSAqIHZ5IC0gY3ogKiB2ejtcbiAgICB2YXIgdHggPSB2eCAqIGN3ICsgdnkgKiBjeiAtIGN5ICogdno7XG4gICAgdmFyIHR5ID0gdnkgKiBjdyArIGN4ICogdnogLSB2eCAqIGN6O1xuICAgIHZhciB0eiA9IHZ6ICogY3cgKyB2eCAqIGN5IC0gY3ggKiB2eTtcblxuICAgIHZhciB3ID0gY3c7XG4gICAgdmFyIHggPSAtY3g7XG4gICAgdmFyIHkgPSAtY3k7XG4gICAgdmFyIHogPSAtY3o7XG5cbiAgICBvdXRwdXQueCA9IHR4ICogdyArIHggKiB0dyArIHkgKiB0eiAtIHR5ICogejtcbiAgICBvdXRwdXQueSA9IHR5ICogdyArIHkgKiB0dyArIHR4ICogeiAtIHggKiB0ejtcbiAgICBvdXRwdXQueiA9IHR6ICogdyArIHogKiB0dyArIHggKiB0eSAtIHR4ICogeTtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuLyoqXG4gKiBDbG9uZSB0aGUgaW5wdXQgVmVjMy5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2IFRoZSBWZWMzIHRvIGNsb25lLlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSBjbG9uZWQgVmVjMy5cbiAqL1xuVmVjMy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKHYpIHtcbiAgICByZXR1cm4gbmV3IFZlYzModi54LCB2LnksIHYueik7XG59O1xuXG4vKipcbiAqIEFkZCB0aGUgaW5wdXQgVmVjMydzLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYxIFRoZSBsZWZ0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IHYyIFRoZSByaWdodCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge1ZlYzN9IFRoZSByZXN1bHQgb2YgdGhlIGFkZGl0aW9uLlxuICovXG5WZWMzLmFkZCA9IGZ1bmN0aW9uIGFkZCh2MSwgdjIsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdjEueCArIHYyLng7XG4gICAgb3V0cHV0LnkgPSB2MS55ICsgdjIueTtcbiAgICBvdXRwdXQueiA9IHYxLnogKyB2Mi56O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoZSBzZWNvbmQgVmVjMyBmcm9tIHRoZSBmaXJzdC5cbiAqXG4gKiBAbWV0aG9kXG4gKlxuICogQHBhcmFtIHtWZWMzfSB2MSBUaGUgbGVmdCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSB2MiBUaGUgcmlnaHQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gb3V0cHV0IFZlYzMgaW4gd2hpY2ggdG8gcGxhY2UgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIHtWZWMzfSBUaGUgcmVzdWx0IG9mIHRoZSBzdWJ0cmFjdGlvbi5cbiAqL1xuVmVjMy5zdWJ0cmFjdCA9IGZ1bmN0aW9uIHN1YnRyYWN0KHYxLCB2Miwgb3V0cHV0KSB7XG4gICAgb3V0cHV0LnggPSB2MS54IC0gdjIueDtcbiAgICBvdXRwdXQueSA9IHYxLnkgLSB2Mi55O1xuICAgIG91dHB1dC56ID0gdjEueiAtIHYyLno7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogU2NhbGUgdGhlIGlucHV0IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgcmVmZXJlbmNlIFZlYzMuXG4gKiBAcGFyYW0ge051bWJlcn0gcyBOdW1iZXIgdG8gc2NhbGUgYnkuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJlc3VsdCBvZiB0aGUgc2NhbGluZy5cbiAqL1xuVmVjMy5zY2FsZSA9IGZ1bmN0aW9uIHNjYWxlKHYsIHMsIG91dHB1dCkge1xuICAgIG91dHB1dC54ID0gdi54ICogcztcbiAgICBvdXRwdXQueSA9IHYueSAqIHM7XG4gICAgb3V0cHV0LnogPSB2LnogKiBzO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlIGFuZCBhZGQgdGhlIGlucHV0IFZlYzMuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdiBUaGUgcmVmZXJlbmNlIFZlYzMuXG4gKiBAcGFyYW0ge051bWJlcn0gcyBOdW1iZXIgdG8gc2NhbGUgYnkuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7VmVjM30gVGhlIHJlc3VsdCBvZiB0aGUgc2NhbGluZy5cbiAqL1xuVmVjMy5wcm90b3R5cGUuc2NhbGVBbmRBZGQgPSBmdW5jdGlvbiBzY2FsZUFuZEFkZChhLCBiLCBzKSB7XG4gICAgdGhpcy54ID0gYS54ICsgKGIueCAqIHMpO1xuICAgIHRoaXMueSA9IGEueSArIChiLnkgKiBzKTtcbiAgICB0aGlzLnogPSBhLnogKyAoYi56ICogcyk7XG59O1xuXG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICovXG5WZWMzLnByb3RvdHlwZS5zcXVhcmVkRGlzdGFuY2UgPSBmdW5jdGlvbiBzcXVhcmVkRGlzdGFuY2UoYikge1xuICAgIHZhciB4ID0gYi54IC0gdGhpcy54LFxuICAgICAgICB5ID0gYi55IC0gdGhpcy55LFxuICAgICAgICB6ID0gYi56IC0gdGhpcy56O1xuICAgIHJldHVybiB4KnggKyB5KnkgKyB6Knpcbn07XG5cblZlYzMucHJvdG90eXBlLmRpc3RhbmNlVG8gPSBmdW5jdGlvbiAoIHYgKSB7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCB0aGlzLnNxdWFyZWREaXN0YW5jZSggdiApICk7XG5cbn07XG5cbi8qKlxuICogVGhlIGRvdCBwcm9kdWN0IG9mIHRoZSBpbnB1dCBWZWMzJ3MuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdjEgVGhlIGxlZnQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gdjIgVGhlIHJpZ2h0IFZlYzMuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBUaGUgZG90IHByb2R1Y3QuXG4gKi9cblZlYzMuZG90ID0gZnVuY3Rpb24gZG90KHYxLCB2Mikge1xuICAgIHJldHVybiB2MS54ICogdjIueCArIHYxLnkgKiB2Mi55ICsgdjEueiAqIHYyLno7XG59O1xuXG4vKipcbiAqIFRoZSAocmlnaHQtaGFuZGVkKSBjcm9zcyBwcm9kdWN0IG9mIHRoZSBpbnB1dCBWZWMzJ3MuXG4gKiB2MSB4IHYyLlxuICpcbiAqIEBtZXRob2RcbiAqXG4gKiBAcGFyYW0ge1ZlYzN9IHYxIFRoZSBsZWZ0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IHYyIFRoZSByaWdodCBWZWMzLlxuICogQHBhcmFtIHtWZWMzfSBvdXRwdXQgVmVjMyBpbiB3aGljaCB0byBwbGFjZSB0aGUgcmVzdWx0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGhlIG9iamVjdCB0aGUgcmVzdWx0IG9mIHRoZSBjcm9zcyBwcm9kdWN0IHdhcyBwbGFjZWQgaW50b1xuICovXG5WZWMzLmNyb3NzID0gZnVuY3Rpb24gY3Jvc3ModjEsIHYyLCBvdXRwdXQpIHtcbiAgICB2YXIgeDEgPSB2MS54O1xuICAgIHZhciB5MSA9IHYxLnk7XG4gICAgdmFyIHoxID0gdjEuejtcbiAgICB2YXIgeDIgPSB2Mi54O1xuICAgIHZhciB5MiA9IHYyLnk7XG4gICAgdmFyIHoyID0gdjIuejtcblxuICAgIG91dHB1dC54ID0geTEgKiB6MiAtIHoxICogeTI7XG4gICAgb3V0cHV0LnkgPSB6MSAqIHgyIC0geDEgKiB6MjtcbiAgICBvdXRwdXQueiA9IHgxICogeTIgLSB5MSAqIHgyO1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG4vKipcbiAqIFRoZSBwcm9qZWN0aW9uIG9mIHYxIG9udG8gdjIuXG4gKlxuICogQG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7VmVjM30gdjEgVGhlIGxlZnQgVmVjMy5cbiAqIEBwYXJhbSB7VmVjM30gdjIgVGhlIHJpZ2h0IFZlYzMuXG4gKiBAcGFyYW0ge1ZlYzN9IG91dHB1dCBWZWMzIGluIHdoaWNoIHRvIHBsYWNlIHRoZSByZXN1bHQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0aGUgb2JqZWN0IHRoZSByZXN1bHQgb2YgdGhlIGNyb3NzIHByb2R1Y3Qgd2FzIHBsYWNlZCBpbnRvXG4gKi9cblZlYzMucHJvamVjdCA9IGZ1bmN0aW9uIHByb2plY3QodjEsIHYyLCBvdXRwdXQpIHtcbiAgICB2YXIgeDEgPSB2MS54O1xuICAgIHZhciB5MSA9IHYxLnk7XG4gICAgdmFyIHoxID0gdjEuejtcbiAgICB2YXIgeDIgPSB2Mi54O1xuICAgIHZhciB5MiA9IHYyLnk7XG4gICAgdmFyIHoyID0gdjIuejtcblxuICAgIHZhciBzY2FsZSA9IHgxICogeDIgKyB5MSAqIHkyICsgejEgKiB6MjtcbiAgICBzY2FsZSAvPSB4MiAqIHgyICsgeTIgKiB5MiArIHoyICogejI7XG5cbiAgICBvdXRwdXQueCA9IHgyICogc2NhbGU7XG4gICAgb3V0cHV0LnkgPSB5MiAqIHNjYWxlO1xuICAgIG91dHB1dC56ID0gejIgKiBzY2FsZTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5WZWMzLnByb3RvdHlwZS5jcmVhdGVGcm9tQXJyYXkgPSBmdW5jdGlvbihhKXtcbiAgICB0aGlzLnggPSBhWzBdIHx8IDA7XG4gICAgdGhpcy55ID0gYVsxXSB8fCAwO1xuICAgIHRoaXMueiA9IGFbMl0gfHwgMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmVjMztcbiIsIi8qKlxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEZhbW91cyBJbmR1c3RyaWVzIEluYy5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE1hdDMzOiByZXF1aXJlKCcuL01hdDMzJyksXG4gICAgUXVhdGVybmlvbjogcmVxdWlyZSgnLi9RdWF0ZXJuaW9uJyksXG4gICAgVmVjMjogcmVxdWlyZSgnLi9WZWMyJyksXG4gICAgVmVjMzogcmVxdWlyZSgnLi9WZWMzJyksXG4gICAgUmF5OiByZXF1aXJlKCcuL1JheScpXG59O1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLypqc2hpbnQgLVcwMDggKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgbGlicmFyeSBvZiBjdXJ2ZXMgd2hpY2ggbWFwIGFuIGFuaW1hdGlvbiBleHBsaWNpdGx5IGFzIGEgZnVuY3Rpb24gb2YgdGltZS5cbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBsaW5lYXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGVhc2VJblxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZWFzZU91dFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZWFzZUluT3V0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBlYXNlT3V0Qm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBzcHJpbmdcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluUXVhZFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0UXVhZFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRRdWFkXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkN1YmljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRDdWJpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRDdWJpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5RdWFydFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0UXVhcnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0UXVhcnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluUXVpbnRcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dFF1aW50XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dFF1aW50XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpblNpbmVcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IG91dFNpbmVcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluT3V0U2luZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5FeHBvXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRFeHBvXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEV4cFxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5DaXJjXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBvdXRDaXJjXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dENpcmNcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluRWxhc3RpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0RWxhc3RpY1xuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gaW5PdXRFbGFzdGljXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbkJvdW5jZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gb3V0Qm91bmNlXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBpbk91dEJvdW5jZVxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZmxhdCAgICAgICAgICAgIC0gVXNlZnVsIGZvciBkZWxheWluZyB0aGUgZXhlY3V0aW9uIG9mXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIHN1YnNlcXVlbnQgdHJhbnNpdGlvbi5cbiAqL1xudmFyIEN1cnZlcyA9IHtcbiAgICBsaW5lYXI6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfSxcblxuICAgIGVhc2VJbjogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0O1xuICAgIH0sXG5cbiAgICBlYXNlT3V0OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KigyLXQpO1xuICAgIH0sXG5cbiAgICBlYXNlSW5PdXQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKHQgPD0gMC41KSByZXR1cm4gMip0KnQ7XG4gICAgICAgIGVsc2UgcmV0dXJuIC0yKnQqdCArIDQqdCAtIDE7XG4gICAgfSxcblxuICAgIGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqKDMgLSAyKnQpO1xuICAgIH0sXG5cbiAgICBzcHJpbmc6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuICgxIC0gdCkgKiBNYXRoLnNpbig2ICogTWF0aC5QSSAqIHQpICsgdDtcbiAgICB9LFxuXG4gICAgaW5RdWFkOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQ7XG4gICAgfSxcblxuICAgIG91dFF1YWQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIC0odC09MSkqdCsxO1xuICAgIH0sXG5cbiAgICBpbk91dFF1YWQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUqdCp0O1xuICAgICAgICByZXR1cm4gLS41KigoLS10KSoodC0yKSAtIDEpO1xuICAgIH0sXG5cbiAgICBpbkN1YmljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiB0KnQqdDtcbiAgICB9LFxuXG4gICAgb3V0Q3ViaWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuICgoLS10KSp0KnQgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRDdWJpYzogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQqdDtcbiAgICAgICAgcmV0dXJuIC41KigodC09MikqdCp0ICsgMik7XG4gICAgfSxcblxuICAgIGluUXVhcnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQqdCp0KnQ7XG4gICAgfSxcblxuICAgIG91dFF1YXJ0OiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtKCgtLXQpKnQqdCp0IC0gMSk7XG4gICAgfSxcblxuICAgIGluT3V0UXVhcnQ6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUqdCp0KnQqdDtcbiAgICAgICAgcmV0dXJuIC0uNSAqICgodC09MikqdCp0KnQgLSAyKTtcbiAgICB9LFxuXG4gICAgaW5RdWludDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdCp0KnQqdCp0O1xuICAgIH0sXG5cbiAgICBvdXRRdWludDogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKCgtLXQpKnQqdCp0KnQgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRRdWludDogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAoKHQvPS41KSA8IDEpIHJldHVybiAuNSp0KnQqdCp0KnQ7XG4gICAgICAgIHJldHVybiAuNSooKHQtPTIpKnQqdCp0KnQgKyAyKTtcbiAgICB9LFxuXG4gICAgaW5TaW5lOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiAtMS4wKk1hdGguY29zKHQgKiAoTWF0aC5QSS8yKSkgKyAxLjA7XG4gICAgfSxcblxuICAgIG91dFNpbmU6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc2luKHQgKiAoTWF0aC5QSS8yKSk7XG4gICAgfSxcblxuICAgIGluT3V0U2luZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLS41KihNYXRoLmNvcyhNYXRoLlBJKnQpIC0gMSk7XG4gICAgfSxcblxuICAgIGluRXhwbzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gKHQ9PT0wKSA/IDAuMCA6IE1hdGgucG93KDIsIDEwICogKHQgLSAxKSk7XG4gICAgfSxcblxuICAgIG91dEV4cG86IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuICh0PT09MS4wKSA/IDEuMCA6ICgtTWF0aC5wb3coMiwgLTEwICogdCkgKyAxKTtcbiAgICB9LFxuXG4gICAgaW5PdXRFeHBvOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICh0PT09MCkgcmV0dXJuIDAuMDtcbiAgICAgICAgaWYgKHQ9PT0xLjApIHJldHVybiAxLjA7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC41ICogTWF0aC5wb3coMiwgMTAgKiAodCAtIDEpKTtcbiAgICAgICAgcmV0dXJuIC41ICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLXQpICsgMik7XG4gICAgfSxcblxuICAgIGluQ2lyYzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gLShNYXRoLnNxcnQoMSAtIHQqdCkgLSAxKTtcbiAgICB9LFxuXG4gICAgb3V0Q2lyYzogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSAoLS10KSp0KTtcbiAgICB9LFxuXG4gICAgaW5PdXRDaXJjOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGlmICgodC89LjUpIDwgMSkgcmV0dXJuIC0uNSAqIChNYXRoLnNxcnQoMSAtIHQqdCkgLSAxKTtcbiAgICAgICAgcmV0dXJuIC41ICogKE1hdGguc3FydCgxIC0gKHQtPTIpKnQpICsgMSk7XG4gICAgfSxcblxuICAgIGluRWxhc3RpYzogZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9MS4wO1xuICAgICAgICBpZiAodD09PTApIHJldHVybiAwLjA7ICBpZiAodD09PTEpIHJldHVybiAxLjA7ICBpZiAoIXApIHA9LjM7XG4gICAgICAgIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luKDEuMC9hKTtcbiAgICAgICAgcmV0dXJuIC0oYSpNYXRoLnBvdygyLDEwKih0LT0xKSkgKiBNYXRoLnNpbigodC1zKSooMipNYXRoLlBJKS8gcCkpO1xuICAgIH0sXG5cbiAgICBvdXRFbGFzdGljOiBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT0xLjA7XG4gICAgICAgIGlmICh0PT09MCkgcmV0dXJuIDAuMDsgIGlmICh0PT09MSkgcmV0dXJuIDEuMDsgIGlmICghcCkgcD0uMztcbiAgICAgICAgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4oMS4wL2EpO1xuICAgICAgICByZXR1cm4gYSpNYXRoLnBvdygyLC0xMCp0KSAqIE1hdGguc2luKCh0LXMpKigyKk1hdGguUEkpL3ApICsgMS4wO1xuICAgIH0sXG5cbiAgICBpbk91dEVsYXN0aWM6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHM9MS43MDE1ODt2YXIgcD0wO3ZhciBhPTEuMDtcbiAgICAgICAgaWYgKHQ9PT0wKSByZXR1cm4gMC4wOyAgaWYgKCh0Lz0uNSk9PT0yKSByZXR1cm4gMS4wOyAgaWYgKCFwKSBwPSguMyoxLjUpO1xuICAgICAgICBzID0gcC8oMipNYXRoLlBJKSAqIE1hdGguYXNpbigxLjAvYSk7XG4gICAgICAgIGlmICh0IDwgMSkgcmV0dXJuIC0uNSooYSpNYXRoLnBvdygyLDEwKih0LT0xKSkgKiBNYXRoLnNpbigodC1zKSooMipNYXRoLlBJKS9wKSk7XG4gICAgICAgIHJldHVybiBhKk1hdGgucG93KDIsLTEwKih0LT0xKSkgKiBNYXRoLnNpbigodC1zKSooMipNYXRoLlBJKS9wKSouNSArIDEuMDtcbiAgICB9LFxuXG4gICAgaW5CYWNrOiBmdW5jdGlvbih0LCBzKSB7XG4gICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuICAgICAgICByZXR1cm4gdCp0KigocysxKSp0IC0gcyk7XG4gICAgfSxcblxuICAgIG91dEJhY2s6IGZ1bmN0aW9uKHQsIHMpIHtcbiAgICAgICAgaWYgKHMgPT09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XG4gICAgICAgIHJldHVybiAoKC0tdCkqdCooKHMrMSkqdCArIHMpICsgMSk7XG4gICAgfSxcblxuICAgIGluT3V0QmFjazogZnVuY3Rpb24odCwgcykge1xuICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcbiAgICAgICAgaWYgKCh0Lz0uNSkgPCAxKSByZXR1cm4gLjUqKHQqdCooKChzKj0oMS41MjUpKSsxKSp0IC0gcykpO1xuICAgICAgICByZXR1cm4gLjUqKCh0LT0yKSp0KigoKHMqPSgxLjUyNSkpKzEpKnQgKyBzKSArIDIpO1xuICAgIH0sXG5cbiAgICBpbkJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gMS4wIC0gQ3VydmVzLm91dEJvdW5jZSgxLjAtdCk7XG4gICAgfSxcblxuICAgIG91dEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICBpZiAodCA8ICgxLzIuNzUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDcuNTYyNSp0KnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHQgPCAoMi8yLjc1KSkge1xuICAgICAgICAgICAgcmV0dXJuICg3LjU2MjUqKHQtPSgxLjUvMi43NSkpKnQgKyAuNzUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHQgPCAoMi41LzIuNzUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKDcuNTYyNSoodC09KDIuNjI1LzIuNzUpKSp0ICsgLjk4NDM3NSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5PdXRCb3VuY2U6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgaWYgKHQgPCAuNSkgcmV0dXJuIEN1cnZlcy5pbkJvdW5jZSh0KjIpICogLjU7XG4gICAgICAgIHJldHVybiBDdXJ2ZXMub3V0Qm91bmNlKHQqMi0xLjApICogLjUgKyAuNTtcbiAgICB9LFxuXG4gICAgZmxhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ3VydmVzO1xuIiwiLyoqXG4gKiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgRmFtb3VzIEluZHVzdHJpZXMgSW5jLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ3VydmVzID0gcmVxdWlyZSgnLi9DdXJ2ZXMnKTtcbnZhciBFbmdpbmUgPSByZXF1aXJlKCcuLi9jb3JlL0VuZ2luZScpO1xuXG4vKipcbiAqIEEgc3RhdGUgbWFpbnRhaW5lciBmb3IgYSBzbW9vdGggdHJhbnNpdGlvbiBiZXR3ZWVuXG4gKiAgICBudW1lcmljYWxseS1zcGVjaWZpZWQgc3RhdGVzLiBFeGFtcGxlIG51bWVyaWMgc3RhdGVzIGluY2x1ZGUgZmxvYXRzIGFuZFxuICogICAgYXJyYXlzIG9mIGZsb2F0cyBvYmplY3RzLlxuICpcbiAqIEFuIGluaXRpYWwgc3RhdGUgaXMgc2V0IHdpdGggdGhlIGNvbnN0cnVjdG9yIG9yIHVzaW5nXG4gKiAgICAge0BsaW5rIFRyYW5zaXRpb25hYmxlI2Zyb219LiBTdWJzZXF1ZW50IHRyYW5zaXRpb25zIGNvbnNpc3Qgb2YgYW5cbiAqICAgICBpbnRlcm1lZGlhdGUgc3RhdGUsIGVhc2luZyBjdXJ2ZSwgZHVyYXRpb24gYW5kIGNhbGxiYWNrLiBUaGUgZmluYWwgc3RhdGVcbiAqICAgICBvZiBlYWNoIHRyYW5zaXRpb24gaXMgdGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIHN1YnNlcXVlbnQgb25lLiBDYWxscyB0b1xuICogICAgIHtAbGluayBUcmFuc2l0aW9uYWJsZSNnZXR9IHByb3ZpZGUgdGhlIGludGVycG9sYXRlZCBzdGF0ZSBhbG9uZyB0aGUgd2F5LlxuICpcbiAqIE5vdGUgdGhhdCB0aGVyZSBpcyBubyBldmVudCBsb29wIGhlcmUgLSBjYWxscyB0byB7QGxpbmsgVHJhbnNpdGlvbmFibGUjZ2V0fVxuICogICAgYXJlIHRoZSBvbmx5IHdheSB0byBmaW5kIHN0YXRlIHByb2plY3RlZCB0byB0aGUgY3VycmVudCAob3IgcHJvdmlkZWQpXG4gKiAgICB0aW1lIGFuZCBhcmUgdGhlIG9ubHkgd2F5IHRvIHRyaWdnZXIgY2FsbGJhY2tzIGFuZCBtdXRhdGUgdGhlIGludGVybmFsXG4gKiAgICB0cmFuc2l0aW9uIHF1ZXVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgdCA9IG5ldyBUcmFuc2l0aW9uYWJsZShbMCwgMF0pO1xuICogdFxuICogICAgIC50byhbMTAwLCAwXSwgJ2xpbmVhcicsIDEwMDApXG4gKiAgICAgLmRlbGF5KDEwMDApXG4gKiAgICAgLnRvKFsyMDAsIDBdLCAnb3V0Qm91bmNlJywgMTAwMCk7XG4gKlxuICogdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICogZGl2LnN0eWxlLmJhY2tncm91bmQgPSAnYmx1ZSc7XG4gKiBkaXYuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xuICogZGl2LnN0eWxlLmhlaWdodCA9ICcxMDBweCc7XG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gKlxuICogZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gKiAgICAgdC5pc1BhdXNlZCgpID8gdC5yZXN1bWUoKSA6IHQucGF1c2UoKTtcbiAqIH0pO1xuICpcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiBsb29wKCkge1xuICogICAgIGRpdi5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgdC5nZXQoKVswXSArICdweCknICsgJyB0cmFuc2xhdGVZKCcgKyB0LmdldCgpWzFdICsgJ3B4KSc7XG4gKiAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICogfSk7XG4gKlxuICogQGNsYXNzIFRyYW5zaXRpb25hYmxlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5Lk51bWJlcn0gaW5pdGlhbFN0YXRlICAgIGluaXRpYWwgc3RhdGUgdG8gdHJhbnNpdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAtIGVxdWl2YWxlbnQgdG8gYSBwdXJzdWFudFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52b2NhdGlvbiBvZlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge0BsaW5rIFRyYW5zaXRpb25hYmxlI2Zyb219XG4gKi9cbmZ1bmN0aW9uIFRyYW5zaXRpb25hYmxlKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuX3F1ZXVlID0gW107XG4gICAgdGhpcy5fZnJvbSA9IG51bGw7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IG51bGw7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIHRoaXMuaWQgPSBudWxsO1xuICAgIHRoaXMucGFyYW0gPSBudWxsO1xuICAgIGlmIChpbml0aWFsU3RhdGUgIT0gbnVsbCkgdGhpcy5mcm9tKGluaXRpYWxTdGF0ZSk7XG4gICAgRW5naW5lLnVwZGF0ZVF1ZXVlLnB1c2godGhpcyk7XG59XG5cbi8qKlxuICogUmVnaXN0ZXJzIGEgdHJhbnNpdGlvbiB0byBiZSBwdXNoZWQgb250byB0aGUgaW50ZXJuYWwgcXVldWUuXG4gKlxuICogQG1ldGhvZCB0b1xuICogQGNoYWluYWJsZVxuICpcbiAqIEBwYXJhbSAge051bWJlcnxBcnJheS5OdW1iZXJ9ICAgIGZpbmFsU3RhdGUgICAgICAgICAgICAgIGZpbmFsIHN0YXRlIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0b24gdG9cbiAqIEBwYXJhbSAge1N0cmluZ3xGdW5jdGlvbn0gICAgICAgIFtjdXJ2ZT1DdXJ2ZXMubGluZWFyXSAgIGVhc2luZyBmdW5jdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZCBmb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFswLCAxXVxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW2R1cmF0aW9uPTEwMF0gICAgICAgICAgZHVyYXRpb24gb2ZcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICAgICAgICAgICAgIFtjYWxsYmFja10gICAgICAgICAgICAgIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBiZSBjYWxsZWQgYWZ0ZXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB0cmFuc2l0aW9uIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZVxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgW21ldGhvZF0gICAgICAgICAgICAgICAgbWV0aG9kIHVzZWQgZm9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZS5nLiBzbGVycClcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLnRvID0gZnVuY3Rpb24gdG8oZmluYWxTdGF0ZSwgY3VydmUsIGR1cmF0aW9uLCBjYWxsYmFjaywgbWV0aG9kKSB7XG5cbiAgICBjdXJ2ZSA9IGN1cnZlICE9IG51bGwgJiYgY3VydmUuY29uc3RydWN0b3IgPT09IFN0cmluZyA/IEN1cnZlc1tjdXJ2ZV0gOiBjdXJ2ZTtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB0aGlzLl9wYXVzZWRBdCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fcXVldWUucHVzaChcbiAgICAgICAgZmluYWxTdGF0ZSxcbiAgICAgICAgY3VydmUgIT0gbnVsbCA/IGN1cnZlIDogQ3VydmVzLmxpbmVhcixcbiAgICAgICAgZHVyYXRpb24gIT0gbnVsbCA/IGR1cmF0aW9uIDogMTAwLFxuICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgbWV0aG9kXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXNldHMgdGhlIHRyYW5zaXRpb24gcXVldWUgdG8gYSBzdGFibGUgaW5pdGlhbCBzdGF0ZS5cbiAqXG4gKiBAbWV0aG9kIGZyb21cbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBpbml0aWFsU3RhdGUgICAgaW5pdGlhbCBzdGF0ZSB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gZnJvbVxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuZnJvbSA9IGZ1bmN0aW9uIGZyb20oaW5pdGlhbFN0YXRlKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gICAgdGhpcy5fZnJvbSA9IHRoaXMuX3N5bmMobnVsbCwgdGhpcy5fc3RhdGUpO1xuICAgIHRoaXMuX3F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fc3RhcnRlZEF0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEZWxheXMgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgc3Vic2VxdWVudCB0cmFuc2l0aW9uIGZvciBhIGNlcnRhaW4gcGVyaW9kIG9mXG4gKiB0aW1lLlxuICpcbiAqIEBtZXRob2QgZGVsYXlcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gICAgICBkdXJhdGlvbiAgICBkZWxheSB0aW1lIGluIG1zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBbY2FsbGJhY2tdICBaZXJvLWFyZ3VtZW50IGZ1bmN0aW9uIHRvIGNhbGwgb24gb2JzZXJ2ZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb24gKHQ9MSlcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSAgICAgICAgIHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLmRlbGF5ID0gZnVuY3Rpb24gZGVsYXkoZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gICAgdmFyIGVuZFN0YXRlID0gdGhpcy5fcXVldWUubGVuZ3RoID4gMCA/IHRoaXMuX3F1ZXVlW3RoaXMuX3F1ZXVlLmxlbmd0aCAtIDVdIDogdGhpcy5fc3RhdGU7XG4gICAgcmV0dXJuIHRoaXMudG8oZW5kU3RhdGUsIEN1cnZlcy5mbGF0LCBkdXJhdGlvbiwgY2FsbGJhY2spO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZXMgY3VycmVudCB0cmFuc2l0aW9uLlxuICpcbiAqIEBtZXRob2Qgb3ZlcnJpZGVcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBbZmluYWxTdGF0ZV0gICAgZmluYWwgc3RhdGUgdG8gdHJhbnNpdG9uIHRvXG4gKiBAcGFyYW0gIHtTdHJpbmd8RnVuY3Rpb259ICAgICAgICBbY3VydmVdICAgICAgICAgZWFzaW5nIGZ1bmN0aW9uIHVzZWQgZm9yXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwb2xhdGluZyBbMCwgMV1cbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFtkdXJhdGlvbl0gICAgICBkdXJhdGlvbiBvZiB0cmFuc2l0aW9uXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgICAgICBbY2FsbGJhY2tdICAgICAgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBjb21wbGV0ZVxuICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgW21ldGhvZF0gICAgICAgIG9wdGlvbmFsIG1ldGhvZCB1c2VkIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpbmcgYmV0d2VlbiB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMuIFNldCB0byBgc2xlcnBgIGZvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwaGVyaWNhbCBsaW5lYXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uLlxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbiBvdmVycmlkZShmaW5hbFN0YXRlLCBjdXJ2ZSwgZHVyYXRpb24sIGNhbGxiYWNrLCBtZXRob2QpIHtcbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoZmluYWxTdGF0ZSAhPSBudWxsKSB0aGlzLl9xdWV1ZVswXSA9IGZpbmFsU3RhdGU7XG4gICAgICAgIGlmIChjdXJ2ZSAhPSBudWxsKSAgICAgIHRoaXMuX3F1ZXVlWzFdID0gY3VydmUuY29uc3RydWN0b3IgPT09IFN0cmluZyA/IEN1cnZlc1tjdXJ2ZV0gOiBjdXJ2ZTtcbiAgICAgICAgaWYgKGR1cmF0aW9uICE9IG51bGwpICAgdGhpcy5fcXVldWVbMl0gPSBkdXJhdGlvbjtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpICAgdGhpcy5fcXVldWVbM10gPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKG1ldGhvZCAhPSBudWxsKSAgICAgdGhpcy5fcXVldWVbNF0gPSBtZXRob2Q7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFVzZWQgZm9yIGludGVycG9sYXRpbmcgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBzdGF0ZSBvZiB0aGUgY3VycmVudGx5XG4gKiBydW5uaW5nIHRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kICBfaW50ZXJwb2xhdGVcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fE51bWJlcn0gb3V0cHV0ICAgICBXaGVyZSB0byB3cml0ZSB0byAoaW4gb3JkZXIgdG8gYXZvaWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IGFsbG9jYXRpb24gYW5kIHRoZXJlZm9yZSBHQykuXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl8TnVtYmVyfSBmcm9tICAgICAgIFN0YXJ0IHN0YXRlIG9mIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqIEBwYXJhbSAge09iamVjdHxBcnJheXxOdW1iZXJ9IHRvICAgICAgICAgRW5kIHN0YXRlIG9mIGN1cnJlbnQgdHJhbnNpdGlvbi5cbiAqIEBwYXJhbSAge051bWJlcn0gcHJvZ3Jlc3MgICAgICAgICAgICAgICAgUHJvZ3Jlc3Mgb2YgdGhlIGN1cnJlbnQgdHJhbnNpdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gWzAsIDFdXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZCAgICAgICAgICAgICAgICAgIE1ldGhvZCB1c2VkIGZvciBpbnRlcnBvbGF0aW9uIChlLmcuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsZXJwKVxuICogQHJldHVybiB7T2JqZWN0fEFycmF5fE51bWJlcn0gICAgICAgICAgICBvdXRwdXRcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLl9pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIF9pbnRlcnBvbGF0ZShvdXRwdXQsIGZyb20sIHRvLCBwcm9ncmVzcywgbWV0aG9kKSB7XG4gICAgaWYgKHRvIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09ICdzbGVycCcpIHtcbiAgICAgICAgICAgIHZhciB4LCB5LCB6LCB3O1xuICAgICAgICAgICAgdmFyIHF4LCBxeSwgcXosIHF3O1xuICAgICAgICAgICAgdmFyIG9tZWdhLCBjb3NvbWVnYSwgc2lub21lZ2EsIHNjYWxlRnJvbSwgc2NhbGVUbztcblxuICAgICAgICAgICAgeCA9IGZyb21bMF07XG4gICAgICAgICAgICB5ID0gZnJvbVsxXTtcbiAgICAgICAgICAgIHogPSBmcm9tWzJdO1xuICAgICAgICAgICAgdyA9IGZyb21bM107XG5cbiAgICAgICAgICAgIHF4ID0gdG9bMF07XG4gICAgICAgICAgICBxeSA9IHRvWzFdO1xuICAgICAgICAgICAgcXogPSB0b1syXTtcbiAgICAgICAgICAgIHF3ID0gdG9bM107XG5cbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIG91dHB1dFswXSA9IHF4O1xuICAgICAgICAgICAgICAgIG91dHB1dFsxXSA9IHF5O1xuICAgICAgICAgICAgICAgIG91dHB1dFsyXSA9IHF6O1xuICAgICAgICAgICAgICAgIG91dHB1dFszXSA9IHF3O1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvc29tZWdhID0gdyAqIHF3ICsgeCAqIHF4ICsgeSAqIHF5ICsgeiAqIHF6O1xuICAgICAgICAgICAgaWYgKCgxLjAgLSBjb3NvbWVnYSkgPiAxZS01KSB7XG4gICAgICAgICAgICAgICAgb21lZ2EgPSBNYXRoLmFjb3MoY29zb21lZ2EpO1xuICAgICAgICAgICAgICAgIHNpbm9tZWdhID0gTWF0aC5zaW4ob21lZ2EpO1xuICAgICAgICAgICAgICAgIHNjYWxlRnJvbSA9IE1hdGguc2luKCgxLjAgLSBwcm9ncmVzcykgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICAgICAgICAgICAgICBzY2FsZVRvID0gTWF0aC5zaW4ocHJvZ3Jlc3MgKiBvbWVnYSkgLyBzaW5vbWVnYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlRnJvbSA9IDEuMCAtIHByb2dyZXNzO1xuICAgICAgICAgICAgICAgIHNjYWxlVG8gPSBwcm9ncmVzcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0cHV0WzBdID0geCAqIHNjYWxlRnJvbSArIHF4ICogc2NhbGVUbztcbiAgICAgICAgICAgIG91dHB1dFsxXSA9IHkgKiBzY2FsZUZyb20gKyBxeSAqIHNjYWxlVG87XG4gICAgICAgICAgICBvdXRwdXRbMl0gPSB6ICogc2NhbGVGcm9tICsgcXogKiBzY2FsZVRvO1xuICAgICAgICAgICAgb3V0cHV0WzNdID0gdyAqIHNjYWxlRnJvbSArIHF3ICogc2NhbGVUbztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0byBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdG8ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRbaV0gPSB0aGlzLl9pbnRlcnBvbGF0ZShvdXRwdXRbaV0sIGZyb21baV0sIHRvW2ldLCBwcm9ncmVzcywgbWV0aG9kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0bykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gdGhpcy5faW50ZXJwb2xhdGUob3V0cHV0W2tleV0sIGZyb21ba2V5XSwgdG9ba2V5XSwgcHJvZ3Jlc3MsIG1ldGhvZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IGZyb20gKyBwcm9ncmVzcyAqICh0byAtIGZyb20pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuXG4vKipcbiAqIEludGVybmFsIGhlbHBlciBtZXRob2QgdXNlZCBmb3Igc3luY2hyb25pemluZyB0aGUgY3VycmVudCwgYWJzb2x1dGUgc3RhdGUgb2ZcbiAqIGEgdHJhbnNpdGlvbiB0byBhIGdpdmVuIG91dHB1dCBhcnJheSwgb2JqZWN0IGxpdGVyYWwgb3IgbnVtYmVyLiBTdXBwb3J0c1xuICogbmVzdGVkIHN0YXRlIG9iamVjdHMgYnkgdGhyb3VnaCByZWN1cnNpb24uXG4gKlxuICogQG1ldGhvZCAgX3N5bmNcbiAqIEBwcml2YXRlXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfEFycmF5fE9iamVjdH0gb3V0cHV0ICAgICBXaGVyZSB0byB3cml0ZSB0byAoaW4gb3JkZXIgdG8gYXZvaWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IGFsbG9jYXRpb24gYW5kIHRoZXJlZm9yZSBHQykuXG4gKiBAcGFyYW0gIHtOdW1iZXJ8QXJyYXl8T2JqZWN0fSBpbnB1dCAgICAgIElucHV0IHN0YXRlIHRvIHByb3h5IG9udG8gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5cbiAqIEByZXR1cm4ge051bWJlcnxBcnJheXxPYmplY3R9IG91dHB1dCAgICAgUGFzc2VkIGluIG91dHB1dCBvYmplY3QuXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5fc3luYyA9IGZ1bmN0aW9uIF9zeW5jKG91dHB1dCwgaW5wdXQpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykgb3V0cHV0ID0gaW5wdXQ7XG4gICAgZWxzZSBpZiAoaW5wdXQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBpZiAob3V0cHV0ID09IG51bGwpIG91dHB1dCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gaW5wdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG91dHB1dFtpXSA9IF9zeW5jKG91dHB1dFtpXSwgaW5wdXRbaV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGlucHV0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIGlmIChvdXRwdXQgPT0gbnVsbCkgb3V0cHV0ID0ge307XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBfc3luYyhvdXRwdXRba2V5XSwgaW5wdXRba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbi8qKlxuICogR2V0IGludGVycG9sYXRlZCBzdGF0ZSBvZiBjdXJyZW50IGFjdGlvbiBhdCBwcm92aWRlZCB0aW1lLiBJZiB0aGUgbGFzdFxuICogICAgYWN0aW9uIGhhcyBjb21wbGV0ZWQsIGludm9rZSBpdHMgY2FsbGJhY2suXG4gKlxuICogQG1ldGhvZCBnZXRcbiAqXG4gKiBAcGFyYW0ge051bWJlcj19IHQgICAgICAgICAgICAgICBFdmFsdWF0ZSB0aGUgY3VydmUgYXQgYSBub3JtYWxpemVkIHZlcnNpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgdGltZS4gSWYgb21pdHRlZCwgdXNlIGN1cnJlbnQgdGltZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFVuaXggZXBvY2ggdGltZSByZXRyaWV2ZWQgZnJvbSBDbG9jaykuXG4gKiBAcmV0dXJuIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfSAgICBCZWdpbm5pbmcgc3RhdGUgaW50ZXJwb2xhdGVkIHRvIHRoaXMgcG9pbnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRpbWUuXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQodCkge1xuICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLl9zdGF0ZTtcblxuICAgIHQgPSB0aGlzLl9wYXVzZWRBdCA/IHRoaXMuX3BhdXNlZEF0IDogdDtcbiAgICB0ID0gdCA/IHQgOiBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIHZhciBwcm9ncmVzcyA9ICh0IC0gdGhpcy5fc3RhcnRlZEF0KSAvIHRoaXMuX3F1ZXVlWzJdO1xuICAgIHRoaXMuX3N0YXRlID0gdGhpcy5faW50ZXJwb2xhdGUoXG4gICAgICAgIHRoaXMuX3N0YXRlLFxuICAgICAgICB0aGlzLl9mcm9tLFxuICAgICAgICB0aGlzLl9xdWV1ZVswXSxcbiAgICAgICAgdGhpcy5fcXVldWVbMV0ocHJvZ3Jlc3MgPiAxID8gMSA6IHByb2dyZXNzKSxcbiAgICAgICAgdGhpcy5fcXVldWVbNF1cbiAgICApO1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgIGlmIChwcm9ncmVzcyA+PSAxKSB7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWRBdCA9IHRoaXMuX3N0YXJ0ZWRBdCArIHRoaXMuX3F1ZXVlWzJdO1xuICAgICAgICB0aGlzLl9mcm9tID0gdGhpcy5fc3luYyh0aGlzLl9mcm9tLCB0aGlzLl9zdGF0ZSk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2dyZXNzID4gMSA/IHRoaXMuZ2V0KCkgOiBzdGF0ZTtcbn07XG5cbi8qKlxuICogSXMgdGhlcmUgYXQgbGVhc3Qgb25lIHRyYW5zaXRpb24gcGVuZGluZyBjb21wbGV0aW9uP1xuICpcbiAqIEBtZXRob2QgaXNBY3RpdmVcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgcGVuZGluZ1xuICogICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi4gUGF1c2VkIHRyYW5zaXRpb25zIGFyZSBzdGlsbCBiZWluZ1xuICogICAgICAgICAgICAgICAgICAgICAgY29uc2lkZXJlZCBhY3RpdmUuXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZS5sZW5ndGggPiAwO1xufTtcblxuLyoqXG4gKiBIYWx0IHRyYW5zaXRpb24gYXQgY3VycmVudCBzdGF0ZSBhbmQgZXJhc2UgYWxsIHBlbmRpbmcgYWN0aW9ucy5cbiAqXG4gKiBAbWV0aG9kIGhhbHRcbiAqIEBjaGFpbmFibGVcbiAqXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaGFsdCA9IGZ1bmN0aW9uIGhhbHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbSh0aGlzLmdldCgpKTtcbn07XG5cbi8qKlxuICogUGF1c2UgdHJhbnNpdGlvbi4gVGhpcyB3aWxsIG5vdCBlcmFzZSBhbnkgYWN0aW9ucy5cbiAqXG4gKiBAbWV0aG9kIHBhdXNlXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9IHRoaXNcbiAqL1xuVHJhbnNpdGlvbmFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gcGF1c2UoKSB7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSGFzIHRoZSBjdXJyZW50IGFjdGlvbiBiZWVuIHBhdXNlZD9cbiAqXG4gKiBAbWV0aG9kIGlzUGF1c2VkXG4gKiBAY2hhaW5hYmxlXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gaWYgdGhlIGN1cnJlbnQgYWN0aW9uIGhhcyBiZWVuIHBhdXNlZFxuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuaXNQYXVzZWQgPSBmdW5jdGlvbiBpc1BhdXNlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9wYXVzZWRBdDtcbn07XG5cbi8qKlxuICogUmVzdW1lIGEgcHJldmlvdXNseSBwYXVzZWQgdHJhbnNpdGlvbi5cbiAqXG4gKiBAbWV0aG9kIHJlc3VtZVxuICogQGNoYWluYWJsZVxuICpcbiAqIEByZXR1cm4ge1RyYW5zaXRpb25hYmxlfSB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiByZXN1bWUoKSB7XG4gICAgdmFyIGRpZmYgPSB0aGlzLl9wYXVzZWRBdCAtIHRoaXMuX3N0YXJ0ZWRBdDtcbiAgICB0aGlzLl9zdGFydGVkQXQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIGRpZmY7XG4gICAgdGhpcy5fcGF1c2VkQXQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDYW5jZWwgYWxsIHRyYW5zaXRpb25zIGFuZCByZXNldCB0byBhIHN0YWJsZSBzdGF0ZVxuICpcbiAqIEBtZXRob2QgcmVzZXRcbiAqIEBjaGFpbmFibGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgLmZyb21gIGluc3RlYWQhXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXkuTnVtYmVyfE9iamVjdC48bnVtYmVyLCBudW1iZXI+fSBzdGFydFxuICogICAgc3RhYmxlIHN0YXRlIHRvIHNldCB0b1xuICogQHJldHVybiB7VHJhbnNpdGlvbmFibGV9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzXG4gKi9cblRyYW5zaXRpb25hYmxlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbShzdGFydCk7XG59O1xuXG4vKipcbiAqIEFkZCB0cmFuc2l0aW9uIHRvIGVuZCBzdGF0ZSB0byB0aGUgcXVldWUgb2YgcGVuZGluZyB0cmFuc2l0aW9ucy4gU3BlY2lhbFxuICogICAgVXNlOiBjYWxsaW5nIHdpdGhvdXQgYSB0cmFuc2l0aW9uIHJlc2V0cyB0aGUgb2JqZWN0IHRvIHRoYXQgc3RhdGUgd2l0aFxuICogICAgbm8gcGVuZGluZyBhY3Rpb25zXG4gKlxuICogQG1ldGhvZCBzZXRcbiAqIEBjaGFpbmFibGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgLnRvYCBpbnN0ZWFkIVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfEZhbW91c0VuZ2luZU1hdHJpeHxBcnJheS5OdW1iZXJ8T2JqZWN0LjxudW1iZXIsIG51bWJlcj59IHN0YXRlXG4gKiAgICBlbmQgc3RhdGUgdG8gd2hpY2ggd2UgaW50ZXJwb2xhdGVcbiAqIEBwYXJhbSB7dHJhbnNpdGlvbj19IHRyYW5zaXRpb24gb2JqZWN0IG9mIHR5cGUge2R1cmF0aW9uOiBudW1iZXIsIGN1cnZlOlxuICogICAgZlswLDFdIC0+IFswLDFdIG9yIG5hbWV9LiBJZiB0cmFuc2l0aW9uIGlzIG9taXR0ZWQsIGNoYW5nZSB3aWxsIGJlXG4gKiAgICBpbnN0YW50YW5lb3VzLlxuICogQHBhcmFtIHtmdW5jdGlvbigpPX0gY2FsbGJhY2sgWmVyby1hcmd1bWVudCBmdW5jdGlvbiB0byBjYWxsIG9uIG9ic2VydmVkXG4gKiAgICBjb21wbGV0aW9uICh0PTEpXG4gKiBAcmV0dXJuIHtUcmFuc2l0aW9uYWJsZX0gdGhpc1xuICovXG5UcmFuc2l0aW9uYWJsZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oc3RhdGUsIHRyYW5zaXRpb24sIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRyYW5zaXRpb24gPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZyb20oc3RhdGUpO1xuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLnRvKHN0YXRlLCB0cmFuc2l0aW9uLmN1cnZlLCB0cmFuc2l0aW9uLmR1cmF0aW9uLCBjYWxsYmFjaywgdHJhbnNpdGlvbi5tZXRob2QpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2l0aW9uYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEN1cnZlczogcmVxdWlyZSgnLi9DdXJ2ZXMnKSxcbiAgICBUcmFuc2l0aW9uYWJsZTogcmVxdWlyZSgnLi9UcmFuc2l0aW9uYWJsZScpXG59O1xuIl19
