"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.XYZAnyValues = void 0;

var _XYZValues = _interopRequireDefault(require("./XYZValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class XYZAnyValues extends _XYZValues.default {
  get default() {
    return {
      x: undefined,
      y: undefined,
      z: undefined
    };
  }

}

exports.XYZAnyValues = XYZAnyValues;
var _default = XYZAnyValues;
exports.default = _default;