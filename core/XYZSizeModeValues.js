"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XYZSizeModeValues = exports.default = void 0;

var _XYZStringValues = _interopRequireDefault(require("./XYZStringValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO it would be cool if we can have compiletime type errors when the values
// aren't SizeModeValues. At the moment we'll get only runtime errors.
class XYZSizeModeValues extends _XYZStringValues.default {
  get default() {
    return {
      x: 'literal',
      y: 'literal',
      z: 'literal'
    };
  }

  get allowedValues() {
    return ['literal', 'proportional'];
  }

  checkValue(prop, value) {
    if (!super.checkValue(prop, value)) return false;
    if (!this.allowedValues.includes(value)) throw new TypeError(`Expected ${prop} to be one of 'literal' or 'proportional'. Received: '${value}'`);
    return true;
  }

}

exports.XYZSizeModeValues = exports.default = XYZSizeModeValues;