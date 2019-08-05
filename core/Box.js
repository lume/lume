"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Box = exports.default = void 0;

var _Mesh = _interopRequireDefault(require("./Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Box extends _Mesh.default {}

exports.Box = exports.default = Box;
Box.defaultElementName = 'i-box';
Box.defaultBehaviors = {
  'box-geometry': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-geometry'));
  },
  'phong-material': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-material'));
  }
};