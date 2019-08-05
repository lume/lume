"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XYZStringValues = exports.default = void 0;

var _XYZValues = _interopRequireDefault(require("./XYZValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XYZStringValues extends _XYZValues.default {
  get default() {
    return {
      x: '',
      y: '',
      z: ''
    };
  }

  checkValue(prop, value) {
    if (!super.checkValue(prop, value)) return false; // this allows undefined values to be ignored. So we can for example do
    // things like v.fromObject({z: 123}) to set only z

    if (value === undefined) return false;
    if (typeof value !== 'string') throw new TypeError(`Expected ${prop} to be a string. Received: ${value}`);
    return true;
  }

}

exports.XYZStringValues = exports.default = XYZStringValues;