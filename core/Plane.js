"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plane = exports.default = void 0;

var _Mesh = _interopRequireDefault(require("./Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Plane extends _Mesh.default {}

exports.Plane = exports.default = Plane;
Plane.defaultElementName = 'i-plane';
Plane.defaultBehaviors = {
  'plane-geometry': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-geometry'));
  },
  'phong-material': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-material'));
  }
};