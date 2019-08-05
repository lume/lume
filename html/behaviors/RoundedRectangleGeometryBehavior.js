"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RoundedRectangleGeometryBehavior = void 0;

require("element-behaviors");

var _three = require("three");

var _BaseGeometryBehavior = _interopRequireDefault(require("./BaseGeometryBehavior"));

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

class RoundedRectangleGeometryBehavior extends _BaseGeometryBehavior.default {
  // static get requiredElementType() {
  //     return RoundedRectangle
  // }
  // element!: RoundedRectangle
  updated(oldProps, modifiedProps) {
    super.updated(oldProps, modifiedProps);

    if (modifiedProps.cornerRadius) {
      // TODO this is extra work if super.updated already called this. See
      // if we can make resetMeshComponent operate only once per microtick
      // (batch them).
      this.resetMeshComponent();
    }
  }

  _createComponent() {
    const roundedRectShape = new _three.Shape();
    roundedRect(roundedRectShape, -this.element.calculatedSize.x / 2, -this.element.calculatedSize.y / 2, this.element.calculatedSize.x, this.element.calculatedSize.y, this.element.cornerRadius); // return new ShapeGeometry(roundedRectShape)

    return new _three.ExtrudeGeometry(roundedRectShape, {
      depth: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    });
  }

}

exports.RoundedRectangleGeometryBehavior = RoundedRectangleGeometryBehavior;
RoundedRectangleGeometryBehavior.props = _objectSpread({}, _BaseGeometryBehavior.default.props, {
  cornerRadius: (0, _props.changePropContext)(_props.props.number, self => self.element)
});
elementBehaviors.define('rounded-rectangle-geometry', RoundedRectangleGeometryBehavior); // from Three.js example: https://github.com/mrdoob/three.js/blob/159a40648ee86755220491d4f0bae202235a341c/examples/webgl_geometry_shapes.html#L237

function roundedRect(shape, x, y, width, height, radius) {
  // shape.moveTo(x, y + radius)
  // shape.lineTo(x, y + height - radius)
  // shape.quadraticCurveTo(x, y + height, x + radius, y + height)
  // shape.lineTo(x + width - radius, y + height)
  // shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
  // shape.lineTo(x + width, y + radius)
  // shape.quadraticCurveTo(x + width, y, x + width - radius, y)
  // shape.lineTo(x + radius, y)
  // shape.quadraticCurveTo(x, y, x, y + radius)
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true);
  shape.lineTo(x + width - radius, y + height);
  shape.absarc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true);
  shape.lineTo(x + width, y + radius);
  shape.absarc(x + width - radius, y + radius, radius, 0, -Math.PI / 2, true);
  shape.lineTo(x + radius, y);
  shape.absarc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true);
}