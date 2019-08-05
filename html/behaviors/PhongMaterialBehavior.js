"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhongMaterialBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseMaterialBehavior = _interopRequireDefault(require("./BaseMaterialBehavior"));

var _MaterialTexture = _interopRequireDefault(require("./MaterialTexture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PhongMaterialBehavior extends _MaterialTexture.default.mixin(_BaseMaterialBehavior.default) {
  _createComponent() {
    return new _three.MeshPhongMaterial({
      color: 0x00ff00
    });
  }

}

exports.PhongMaterialBehavior = exports.default = PhongMaterialBehavior;
elementBehaviors.define('phong-material', PhongMaterialBehavior);