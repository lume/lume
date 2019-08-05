"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MTLLoader = void 0;

require("./make-global");

require("three/examples/js/loaders/MTLLoader");

var _getGlobal = require("../../utils/getGlobal");

const global = (0, _getGlobal.getGlobal)(); // TODO get MTLLoader type from somewhere? Or make one.

const MTLLoader = global.THREE.MTLLoader;
exports.MTLLoader = MTLLoader;