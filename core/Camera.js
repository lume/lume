"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerspectiveCamera = exports.default = void 0;

var _three = require("three");

var _props = require("./props");

var _Node = _interopRequireDefault(require("./Node"));

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

// TODO: update this to have a CSS3D-perspective-like API like with the Scene's
// default camera.
class PerspectiveCamera extends _Node.default {
  constructor() {
    super(...arguments);
    this.__lastKnownScene = null;
    this.__startedAutoAspect = false;
  }

  updated(oldProps, modifiedProps) {
    super.updated(oldProps, modifiedProps);
    if (!this.isConnected) return;

    if (modifiedProps.active) {
      this.__setSceneCamera(this.active ? undefined : 'unset');
    }

    if (modifiedProps.aspect) {
      if (!this.aspect) // default aspect value based on the scene size.
        this.__startAutoAspect();else this.__stopAutoAspect();
    } // TODO handle the other props here, remove attributeChangedCallback

  }

  connectedCallback() {
    super.connectedCallback();
    this.__lastKnownScene = this.scene;
  } // TODO, unmountedCallback functionality. issue #150


  unmountedCallback() {}

  attributeChangedCallback(attr, oldVal, newVal) {
    super.attributeChangedCallback(attr, oldVal, newVal);

    if (typeof newVal == 'string') {
      this.__attributeAddedOrChanged(attr, newVal);
    } else {
      this.__attributeRemoved(attr);
    }
  }

  _makeThreeObject3d() {
    return new _three.PerspectiveCamera(75, 16 / 9, 1, 1000);
  } // TODO replace with unmountedCallback #150


  _deinit() {
    super._deinit && super._deinit(); // TODO we want to call this in the upcoming
    // unmountedCallback, but for now it's harmless but
    // will run unnecessary logic. #150

    this.__setSceneCamera('unset');

    this.__lastKnownScene = null;
  } // TODO CAMERA-DEFAULTS, get defaults from somewhere common.


  __attributeRemoved(attr) {
    const three = this.three;

    if (attr == 'fov') {
      three.fov = 75;
      three.updateProjectionMatrix();
    } else if (attr == 'aspect') {
      this.__startAutoAspect();

      three.aspect = this.__getDefaultAspect();
      three.updateProjectionMatrix();
    } else if (attr == 'near') {
      three.near = 0.1;
      three.updateProjectionMatrix();
    } else if (attr == 'far') {
      three.far = 1000;
      three.updateProjectionMatrix();
    } else if (attr == 'zoom') {
      three.zoom = 1;
      three.updateProjectionMatrix();
    } else if (attr == 'active') {
      this.__setSceneCamera('unset');
    }
  }

  __attributeAddedOrChanged(attr, newVal) {
    const three = this.three;

    if (attr == 'fov') {
      three.fov = parseFloat(newVal);
      three.updateProjectionMatrix();
    } else if (attr == 'aspect') {
      this.__stopAutoAspect();

      three.aspect = parseFloat(newVal);
      three.updateProjectionMatrix();
    } else if (attr == 'near') {
      three.near = parseFloat(newVal);
      three.updateProjectionMatrix();
    } else if (attr == 'far') {
      three.far = parseFloat(newVal);
      three.updateProjectionMatrix();
    } else if (attr == 'zoom') {
      three.zoom = parseFloat(newVal);
      three.updateProjectionMatrix();
    } else if (attr == 'active') {
      this.__setSceneCamera();
    }
  }

  __startAutoAspect() {
    if (!this.__startedAutoAspect) {
      this.__startedAutoAspect = true;
      this.scene.on('sizechange', this.__updateAspectOnSceneResize, this);
    }
  }

  __stopAutoAspect() {
    if (this.__startedAutoAspect) {
      this.__startedAutoAspect = false;
      this.scene.off('sizechange', this.__updateAspectOnSceneResize);
    }
  }

  __updateAspectOnSceneResize({
    x,
    y
  }) {
    ;
    this.three.aspect = x / y;
  }

  __getDefaultAspect() {
    let result = 0;

    if (this.scene) {
      result = this.scene.calculatedSize.x / this.scene.calculatedSize.y;
    } // in case of a 0 or NaN (0 / 0 == NaN)


    if (!result) result = 16 / 9;
    return result;
  }

  __setSceneCamera(unset) {
    if (unset) {
      // TODO: unset might be triggered before the scene was mounted, so
      // there might not be a last known scene. We won't need this check
      // when we add unmountedCallback. #150
      if (this.__lastKnownScene) this.__lastKnownScene // @ts-ignore: call protected method
      ._removeCamera(this);
    } else {
      if (!this.scene || !this.isConnected) return;

      this.scene // @ts-ignore: call protected method
      ._addCamera( //
      this);
    }
  }

}

exports.PerspectiveCamera = exports.default = PerspectiveCamera;
PerspectiveCamera.defaultElementName = 'i-perspective-camera'; // TODO remove attributeChangedCallback, replace with updated based on these props

PerspectiveCamera.props = _objectSpread({}, _Node.default.props || {}, {
  fov: _objectSpread({}, _props.props.number, {
    default: 75
  }),
  aspect: _objectSpread({}, _props.props.number, {
    default() {
      return this._getDefaultAspect();
    },

    deserialize(val) {
      val == null ? this.constructor.props.aspect.default.call(this) : _props.props.number.deserialize(val);
    }

  }),
  near: _objectSpread({}, _props.props.number, {
    default: 0.1
  }),
  far: _objectSpread({}, _props.props.number, {
    default: 1000
  }),
  zoom: _objectSpread({}, _props.props.number, {
    default: 1
  }),
  active: _objectSpread({}, _props.props.boolean, {
    default: false
  })
});