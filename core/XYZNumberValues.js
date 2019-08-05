"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XYZNumberValues = exports.default = void 0;

var _XYZValues = _interopRequireDefault(require("./XYZValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XYZNumberValues extends _XYZValues.default {
  get default() {
    return {
      x: 0,
      y: 0,
      z: 0
    };
  }

  deserializeValue(_prop, value) {
    return Number(value);
  }

  checkValue(prop, value) {
    if (!super.checkValue(prop, value)) return false; // this allows undefined values to be ignored. So we can for example do
    // things like v.fromObject({z: 123}) to set only z

    if (value === undefined) return false; // but if any value is supplied, it needs to be a valid number

    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`);
    return true;
  }

}

exports.XYZNumberValues = exports.default = XYZNumberValues;