"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AmbientLight = exports.default = void 0;

var _LightBase = _interopRequireDefault(require("./LightBase"));

var _three = require("three");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AmbientLight extends _LightBase.default {
  _makeThreeObject3d() {
    const light = new _three.AmbientLight();
    light.intensity = 1; // default

    return light;
  }

}

exports.AmbientLight = exports.default = AmbientLight;
AmbientLight.defaultElementName = 'i-ambient-light';