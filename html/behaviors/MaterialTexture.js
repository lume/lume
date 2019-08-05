"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MaterialTexture = void 0;

var _lowclass = require("lowclass");

var _three = require("three");

var _WithUpdate = _interopRequireDefault(require("../WithUpdate"));

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

/**
 * Mixin class for adding textures to a mesh behavior
 */
function MaterialTextureMixin(Base) {
  // TODO, use a Pick<> of HTMLElement instead, pick just parts WithUpdate needs.
  class MaterialTexture extends _WithUpdate.default.mixin((0, _lowclass.Constructor)(Base)) {
    updated(oldProps, modifiedProps) {
      super.updated && super.updated(oldProps, modifiedProps);
      const {
        texture
      } = modifiedProps;

      if (texture && this.texture) {
        // TODO default material color (if not specified) when there's a
        // texture should be white
        const texture = new _three.TextureLoader().load(this.texture, () => this.element.needsUpdate());
        this.element.three.material.map = texture;
        this.element.needsUpdate();
      }
    }

  }

  MaterialTexture.props = _objectSpread({}, Base.props || {}, {
    texture: String
  });
  return MaterialTexture;
}

const MaterialTexture = (0, _lowclass.Mixin)(MaterialTextureMixin);
exports.MaterialTexture = MaterialTexture;
var _default = MaterialTexture;
exports.default = _default;