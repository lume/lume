"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMNodeMaterialBehavior = exports.default = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseMaterialBehavior = _interopRequireDefault(require("./BaseMaterialBehavior"));

var _MaterialTexture = _interopRequireDefault(require("./MaterialTexture"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DOMNodeMaterialBehavior extends _MaterialTexture.default.mixin(_BaseMaterialBehavior.default) {
  _createComponent() {
    // TODO PERFORMANCE we can re-use a single material for
    // all the DOM planes rather than a new material per
    // plane.
    return new _three.MeshPhongMaterial({
      opacity: 0.5,
      color: new _three.Color(0x111111),
      blending: _three.NoBlending
    });
  }

}

exports.DOMNodeMaterialBehavior = exports.default = DOMNodeMaterialBehavior;
elementBehaviors.define('domnode-material', DOMNodeMaterialBehavior);