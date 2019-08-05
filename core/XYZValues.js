"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XYZValues = exports.default = void 0;

var _Observable = _interopRequireDefault(require("./Observable"));

var _regexr = _interopRequireDefault(require("regexr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultValues = {
  x: undefined,
  y: undefined,
  z: undefined
};
/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The values don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */

class XYZValues extends _Observable.default {
  constructor(x, y, z) {
    super();
    this._x = undefined;
    this._y = undefined;
    this._z = undefined;

    this.__from(x, y, z);
  }

  get _default() {
    return this.default || defaultValues;
  }

  __from(x, y, z) {
    if (x === undefined && y === undefined && z === undefined) {
      this.fromDefault();
    } else if (Array.isArray(x)) {
      this.fromArray(x);
    } else if (typeof x === 'object' && x !== null && x !== this) {
      this.fromObject(x);
    } else if (typeof x === 'string' && y === undefined && z === undefined) {
      this.fromString(x);
    } else this.set(x, y, z);

    return this;
  }

  from(x, y, z) {
    return this.__from(x, y, z);
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  fromArray(array) {
    this.set(array[0], array[1], array[2]);
    return this;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  fromObject(object) {
    this.set(object.x, object.y, object.z);
    return this;
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

  fromString(string, separator = '') {
    this.fromArray(this.stringToArray(string, separator));
    return this;
  }

  toString(separator = '') {
    if (separator) {
      return `${this.x}${separator} ${this.y}${separator} ${this.z}`;
    } else {
      return `${this.x} ${this.y} ${this.z}`;
    }
  }
  /**
   * Defines how to deserialize an incoming string being set onto one of the
   * x, y, or z properties. Subclasses should override this.
   * @param _prop The property name (x, y, or z)
   * @param value The value to be deserialized
   */


  deserializeValue(_prop, value) {
    return value;
  }

  stringToArray(string, separator = '') {
    const values = string.trim().split(_regexr.default`/(?:\s*${_regexr.default.escape(separator) || ','}\s*)|(?:\s+)/g`);
    const result = [];
    const length = values.length;
    if (length > 0) result[0] = this.deserializeValue('x', values[0]);
    if (length > 1) result[1] = this.deserializeValue('y', values[1]);
    if (length > 2) result[2] = this.deserializeValue('z', values[2]);
    return result;
  }

  fromDefault() {
    // console.log('default values:', this.default)
    this.set(this._default.x, this._default.y, this._default.z);
    return this;
  }
  /**
   * Subclasses extend this to implement type checks. Return true if the
   * value should be assigned, false otherwise. A subclass could also throw
   * an error when receiving an unexpected values.
   * @param prop
   * @param value
   */


  checkValue(_prop, _value) {
    return true;
  }

  set x(value) {
    if (!this.checkValue('x', value)) return;
    this._x = value;
    this.trigger('valuechanged', 'x');
  }

  get x() {
    return this._x;
  }

  set y(value) {
    if (!this.checkValue('y', value)) return;
    this._y = value;
    this.trigger('valuechanged', 'y');
  }

  get y() {
    return this._y;
  }

  set z(value) {
    if (!this.checkValue('z', value)) return;
    this._z = value;
    this.trigger('valuechanged', 'z');
  }

  get z() {
    return this._z;
  }

}

exports.XYZValues = exports.default = XYZValues;