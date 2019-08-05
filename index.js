"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true,
  Class: true,
  Mixin: true
};
Object.defineProperty(exports, "Class", {
  enumerable: true,
  get: function () {
    return _lowclass.Class;
  }
});
Object.defineProperty(exports, "Mixin", {
  enumerable: true,
  get: function () {
    return _lowclass.Mixin;
  }
});
exports.version = void 0;

var _lowclass = require("lowclass");

var _core = require("./core");

Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _core[key];
    }
  });
});

var _html = require("./html");

Object.keys(_html).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _html[key];
    }
  });
});

var _components = require("./components");

Object.keys(_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _components[key];
    }
  });
});

var _layout = require("./layout");

Object.keys(_layout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _layout[key];
    }
  });
});
// TODO optimize concatenation in global build
// TODO consolidate duplicate Babel helpers
const version = '21.0.6';
exports.version = version;