"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mesh = exports.default = void 0;

var _three = require("three");

var _Node = _interopRequireDefault(require("./Node"));

var _props = require("./props");

require("../html/behaviors/BasicMaterialBehavior");

require("../html/behaviors/PhongMaterialBehavior");

require("../html/behaviors/DOMNodeMaterialBehavior");

require("../html/behaviors/BoxGeometryBehavior");

require("../html/behaviors/SphereGeometryBehavior");

require("../html/behaviors/PlaneGeometryBehavior");

require("../html/behaviors/DOMNodeGeometryBehavior");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

// TODO:
// - [ ] API for registering new behaviors as they pertain to our API, built on top
//   of element-behaviors.
// - [x] Ability specify default initial behaviors. Make this generic, or on top of
//   element-behaviors? DONE, with DefaultBehaviors class
// - [x] generic ability to specify custom element attribute types, as an addon to
//   Custom Elements. We can use the same mechanism to specify types for behaviors too? DONE, with WithUpdate class.
class Mesh extends _Node.default {
  passInitialValuesToThree() {
    this.three.castShadow = this.castShadow;
    console.log(' ?????????????????? Mesh, pass initial values to three', this.three.castShadow);
    this.three.receiveShadow = this.receiveShadow;
  }

  updated(oldProps, modifiedProps) {
    super.updated(oldProps, modifiedProps);
    if (!this.isConnected) return;

    if (modifiedProps.castShadow) {
      this.needsUpdate();
    }

    if (modifiedProps.receiveShadow) {
      // TODO handle material arrays
      ;
      this.three.material.needsUpdate = true;
      this.needsUpdate();
    }
  }

  _makeThreeObject3d() {
    return new _three.Mesh();
  }

}

exports.Mesh = exports.default = Mesh;
Mesh.defaultElementName = 'i-mesh'; // TODO NAMING: It would be neat to be able to return an array of classes
// as well, so that it can be agnostic of the naming. Either way should
// work.

Mesh.defaultBehaviors = {
  'box-geometry': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-geometry'));
  },
  'phong-material': initialBehaviors => {
    return !initialBehaviors.some(b => b.endsWith('-material'));
  }
};
Mesh.props = _objectSpread({}, _Node.default.props || {}, {
  castShadow: _objectSpread({}, (0, _props.mapPropTo)(_props.props.boolean, self => self.three), {
    default: true
  }),
  receiveShadow: _objectSpread({}, (0, _props.mapPropTo)(_props.props.boolean, self => self.three), {
    default: true
  })
});