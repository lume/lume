"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxGeometryBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseGeometryBehavior = _interopRequireDefault(require("./BaseGeometryBehavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BoxGeometryBehavior extends _BaseGeometryBehavior.default {
  _createComponent() {
    return new _three.BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, this.element.calculatedSize.z);
  }

}

exports.BoxGeometryBehavior = exports.default = BoxGeometryBehavior;
elementBehaviors.define('box-geometry', BoxGeometryBehavior);