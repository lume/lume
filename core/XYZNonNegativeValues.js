"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XYZNonNegativeValues = exports.default = void 0;

var _XYZNumberValues = _interopRequireDefault(require("./XYZNumberValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XYZNonNegativeValues extends _XYZNumberValues.default {
  checkValue(prop, value) {
    if (!super.checkValue(prop, value)) return false;
    if (value < 0) throw new TypeError(`Expected ${prop} not to be negative. Received: ${value}`);
    return true;
  }

}

exports.XYZNonNegativeValues = exports.default = XYZNonNegativeValues;