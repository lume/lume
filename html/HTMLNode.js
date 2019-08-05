"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLNode = exports.default = void 0;

var _HTMLNode = _interopRequireDefault(require("./HTMLNode.style"));

var _DeclarativeBase = _interopRequireWildcard(require("./DeclarativeBase"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _DeclarativeBase.initDeclarativeBase)();

class HTMLNode extends _DeclarativeBase.default {
  getStyles() {
    return _HTMLNode.default;
  }

}

exports.HTMLNode = exports.default = HTMLNode;