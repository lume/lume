"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushPaneLayout = exports.default = void 0;

var _Node = _interopRequireDefault(require("../core/Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PushPaneLayout extends _Node.default {
  constructor(...args) {
    super(...args);
    console.log(' -- PushPaneLayout created (TODO)');
  }

}

exports.PushPaneLayout = exports.default = PushPaneLayout;
PushPaneLayout.defaultElementName = 'i-push-pane-layout';