"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMNodeGeometryBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseGeometryBehavior = _interopRequireDefault(require("./BaseGeometryBehavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DOMNodeGeometryBehavior extends _BaseGeometryBehavior.default {
  _createComponent() {
    // We have to use a BoxGeometry instead of a
    // PlaneGeometry because Three.js is not capable of
    // casting shadows from Planes, at least until we find
    // another way. Unfortunately, this increases polygon
    // count by a factor of 6. See issue
    // https://github.com/mrdoob/three.js/issues/9315
    return new _three.BoxGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, 1);
  }

}

exports.DOMNodeGeometryBehavior = exports.default = DOMNodeGeometryBehavior;
elementBehaviors.define('domnode-geometry', DOMNodeGeometryBehavior);