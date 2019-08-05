"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjModel = exports.default = void 0;

var _Node = _interopRequireDefault(require("./Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// defines the `<i-obj-model>` element, which is short for `<i-node has="obj-model">`
class ObjModel extends _Node.default {}

exports.ObjModel = exports.default = ObjModel;
ObjModel.defaultElementName = 'i-obj-model';
ObjModel.defaultBehaviors = ['obj-model'];