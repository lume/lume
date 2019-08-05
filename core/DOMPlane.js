"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMPlane = exports.default = void 0;

var _DOMNode = _interopRequireDefault(require("./DOMNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This class is an alias for DOMNode/i-dom-node
class DOMPlane extends _DOMNode.default {}

exports.DOMPlane = exports.default = DOMPlane;
DOMPlane.defaultElementName = 'i-dom-plane';