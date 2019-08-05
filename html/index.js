"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useDefaultNames: true
};
exports.useDefaultNames = useDefaultNames;

var _DeclarativeBase = require("./DeclarativeBase");

Object.keys(_DeclarativeBase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DeclarativeBase[key];
    }
  });
});

var _HTMLNode = require("./HTMLNode");

Object.keys(_HTMLNode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HTMLNode[key];
    }
  });
});

var _HTMLScene = require("./HTMLScene");

Object.keys(_HTMLScene).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HTMLScene[key];
    }
  });
});

var _WebComponent = require("./WebComponent");

Object.keys(_WebComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _WebComponent[key];
    }
  });
});

var _Scene = _interopRequireDefault(require("../core/Scene"));

var _Node = _interopRequireDefault(require("../core/Node"));

var _Mesh = _interopRequireDefault(require("../core/Mesh"));

var _Box = _interopRequireDefault(require("../core/Box"));

var _Sphere = _interopRequireDefault(require("../core/Sphere"));

var _Plane = _interopRequireDefault(require("../core/Plane"));

var _PointLight = _interopRequireDefault(require("../core/PointLight"));

var _DOMNode = _interopRequireDefault(require("../core/DOMNode"));

var _DOMPlane = _interopRequireDefault(require("../core/DOMPlane"));

var _AmbientLight = _interopRequireDefault(require("../core/AmbientLight"));

var _Camera = _interopRequireDefault(require("../core/Camera"));

var _AutoLayoutNode = _interopRequireDefault(require("../layout/AutoLayoutNode"));

var _ObjModel = _interopRequireDefault(require("../core/ObjModel"));

var _behaviors = require("./behaviors");

Object.keys(_behaviors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _behaviors[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export HTMLPushPaneLayout from './HTMLPushPaneLayout'
// import PushPaneLayout from '../components/PushPaneLayout'
function useDefaultNames() {
  const classes = [_Scene.default, _Node.default, _Mesh.default, _Box.default, _Sphere.default, _Plane.default, _PointLight.default, _DOMNode.default, _DOMPlane.default, _AmbientLight.default, _Camera.default, _AutoLayoutNode.default, _ObjModel.default];

  for (const constructor of classes) {
    if (!customElements.get(constructor.defaultElementName)) constructor.define();
  }
}