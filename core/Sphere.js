"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sphere = exports.default = void 0;

var _Mesh = _interopRequireDefault(require("./Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Sphere extends _Mesh.default {}

exports.Sphere = exports.default = Sphere;
Sphere.defaultElementName = 'i-sphere';
Sphere.defaultBehaviors = {
  'sphere-geometry': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-geometry'));
  },
  'phong-material': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-material'));
  }
};