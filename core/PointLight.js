"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointLight = exports.default = void 0;

var _three = require("three");

var _LightBase = _interopRequireDefault(require("./LightBase"));

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

class PointLight extends _LightBase.default {
  passInitialValuesToThree() {
    super.passInitialValuesToThree();
    const light = this.three;
    light.distance = this.distance;
    light.decay = this.decay;
    light.castShadow = this.castShadow;
    console.log(' ?????????????????????????????? PointLight, pass initial values to three', light.castShadow);
    const shadow = light.shadow;
    shadow.mapSize.width = this.shadowMapWidth;
    shadow.mapSize.height = this.shadowMapHeight;
    shadow.radius = this.shadowRadius;
    shadow.bias = this.shadowBias; // TODO: auto-adjust near and far planes like we will with Camera,
    // unless the user supplies a manual value.

    shadow.camera.near = this.shadowCameraNear;
    shadow.camera.far = this.shadowCameraFar;
  }

  updated(oldProps, modifiedProps) {
    super.updated(oldProps, modifiedProps);
    if (!this.isConnected) return;
    const shadow = this.three.shadow;
    if (modifiedProps.shadowMapWidth) shadow.mapSize.width = this.shadowMapWidth;
    if (modifiedProps.shadowMapHeight) shadow.mapSize.height = this.shadowMapHeight;
    if (modifiedProps.shadowRadius) shadow.radius = this.shadowRadius;
    if (modifiedProps.shadowBias) shadow.bias = this.shadowBias;
    if (modifiedProps.shadowCameraNear) shadow.camera.near = this.shadowCameraNear;
    if (modifiedProps.shadowCameraFar) shadow.camera.far = this.shadowCameraFar;
  }

  _makeThreeObject3d() {
    return new _three.PointLight();
  }

}

exports.PointLight = exports.default = PointLight;
PointLight.defaultElementName = 'i-point-light';
PointLight.props = _objectSpread({}, _LightBase.default.props, {
  distance: (0, _props.mapPropTo)(_objectSpread({}, _props.props.number, {
    default: 0
  }), self => self.three),
  decay: (0, _props.mapPropTo)(_objectSpread({}, _props.props.number, {
    default: 1
  }), self => self.three),
  castShadow: (0, _props.mapPropTo)(_objectSpread({}, _props.props.boolean, {
    default: true
  }), self => self.three),
  shadowMapWidth: _objectSpread({}, _props.props.number, {
    default: 512
  }),
  shadowMapHeight: _objectSpread({}, _props.props.number, {
    default: 512
  }),
  shadowRadius: _objectSpread({}, _props.props.number, {
    default: 3
  }),
  shadowBias: _objectSpread({}, _props.props.number, {
    default: 0
  }),
  shadowCameraNear: _objectSpread({}, _props.props.number, {
    default: 1
  }),
  shadowCameraFar: _objectSpread({}, _props.props.number, {
    default: 2000
  })
});