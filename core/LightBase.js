"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LightBase = exports.default = void 0;

var _three = require("three");

var _Node = _interopRequireDefault(require("./Node"));

var _props = require("./props");

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

// base class for light elements.
class LightBase extends _Node.default {
  // TODO we shouldn't need to define passInitialValuesToThree, the default
  // value of the props should automatically be in place.
  passInitialValuesToThree() {
    this.three.color = this.color;
    this.three.intensity = this.intensity;
  }

  updated(oldProps, modifiedProps) {
    super.updated(oldProps, modifiedProps);
    if (!this.isConnected) return;
    this.needsUpdate();
  }

}

exports.LightBase = exports.default = LightBase;
LightBase.props = _objectSpread({}, _Node.default.props || {}, {
  color: (0, _props.mapPropTo)(_objectSpread({}, _props.props.THREE.Color, {
    default: new _three.Color('white')
  }), self => self.three),
  intensity: (0, _props.mapPropTo)(_objectSpread({}, _props.props.number, {
    default: 1
  }), self => self.three)
});