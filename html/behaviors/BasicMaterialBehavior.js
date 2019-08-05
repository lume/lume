"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicMaterialBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseMaterialBehavior = _interopRequireDefault(require("./BaseMaterialBehavior"));

var _MaterialTexture = _interopRequireDefault(require("./MaterialTexture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BasicMaterialBehavior extends _MaterialTexture.default.mixin(_BaseMaterialBehavior.default) {
  _createComponent() {
    return new _three.MeshBasicMaterial({
      color: 0x00ff00
    });
  }

}

exports.BasicMaterialBehavior = exports.default = BasicMaterialBehavior;
elementBehaviors.define('basic-material', BasicMaterialBehavior);