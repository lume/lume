"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SphereGeometryBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseGeometryBehavior = _interopRequireDefault(require("./BaseGeometryBehavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SphereGeometryBehavior extends _BaseGeometryBehavior.default {
  _createComponent() {
    return new _three.SphereGeometry(this.element.calculatedSize.x / 2, 32, 32);
  }

}

exports.SphereGeometryBehavior = exports.default = SphereGeometryBehavior;
elementBehaviors.define('sphere-geometry', SphereGeometryBehavior);