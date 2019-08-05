"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMaterialBehavior = exports.default = void 0;

var _BaseMeshBehavior = _interopRequireDefault(require("./BaseMeshBehavior"));

var _props = require("../../core/props");

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

// base class for geometry behaviors
class BaseMaterialBehavior extends _BaseMeshBehavior.default {
  constructor() {
    super(...arguments);
    this.type = 'material';
  }

  updated(_oldProps, modifiedProps) {
    const {
      color,
      opacity
    } = modifiedProps;
    if (color) this.updateMaterial('color');

    if (opacity) {
      this.updateMaterial('opacity');
      this.updateMaterial('transparent');
    }
  }

  get transparent() {
    if (this.opacity < 1) return true;else return false;
  }

  updateMaterial(propName) {
    // The following type casting isn't type safe, but we can't type
    // everything we can do in JavaScript. It at leat shows our intent, but
    // swap "color" with "opacity", "transparent", etc.
    // TODO support Material[]
    ;
    this.element.three.material[propName] = this[propName];
    this.element.needsUpdate();
  }

}

exports.BaseMaterialBehavior = exports.default = BaseMaterialBehavior;
BaseMaterialBehavior.props = {
  color: _props.props.THREE.Color,
  opacity: _objectSpread({}, _props.props.number, {
    default: 1
  })
};