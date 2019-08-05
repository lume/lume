"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OBJLoader = void 0;

require("./make-global");

require("three/examples/js/loaders/OBJLoader");

var _getGlobal = require("../../utils/getGlobal");

const global = (0, _getGlobal.getGlobal)(); // TODO get OBJLoader type from somewhere? Or make one.

const OBJLoader = global.THREE.OBJLoader;
exports.OBJLoader = OBJLoader;