"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlaneGeometryBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseGeometryBehavior = _interopRequireDefault(require("./BaseGeometryBehavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlaneGeometryBehavior extends _BaseGeometryBehavior.default {
  _createComponent() {
    return new _three.PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y);
  }

}

exports.PlaneGeometryBehavior = exports.default = PlaneGeometryBehavior;
elementBehaviors.define('plane-geometry', PlaneGeometryBehavior);