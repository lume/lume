"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMNode = exports.default = void 0;

var _Mesh = _interopRequireDefault(require("./Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DOMNode extends _Mesh.default {
  get isDOMNode() {
    return true;
  }

}

exports.DOMNode = exports.default = DOMNode;
DOMNode.defaultElementName = 'i-dom-node';
DOMNode.defaultBehaviors = {
  'domnode-geometry': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-geometry'));
  },
  'domnode-material': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-material'));
  }
};