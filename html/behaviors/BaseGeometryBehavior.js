"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseGeometryBehavior = exports.default = void 0;

var _BaseMeshBehavior = _interopRequireDefault(require("./BaseMeshBehavior"));

var _props = require("../../core/props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// base class for geometry behaviors
class BaseGeometryBehavior extends _BaseMeshBehavior.default {
  constructor() {
    super(...arguments);
    this.type = 'geometry';
  }

  updated(_oldProps, modifiedProps) {
    const {
      size,
      sizeMode
    } = modifiedProps;

    if (size || sizeMode) {
      this.__updateGeometryOnSizeChange(this.size);
    }
  }

  _listenToElement() {
    super._listenToElement(); // TODO the following three events can be replaced with a single propchange:size event


    this.element.on('sizechange', this.__onSizeValueChanged, this);
    this.element.size.on('valuechanged', this.__onSizeValueChanged, this);
    this.element.sizeMode.on('valuechanged', this.__onSizeValueChanged, this);
  }

  _unlistenToElement() {
    super._unlistenToElement();

    this.element.off('sizechange', this.__onSizeValueChanged);
    this.element.size.off('valuechanged', this.__onSizeValueChanged);
    this.element.sizeMode.off('valuechanged', this.__onSizeValueChanged);
  }

  __onSizeValueChanged() {
    // tells WithUpdate (from BaseMeshBehavior) which prop
    // changed and makes it finally trigger our updated method
    // this.size = this.size
    this.triggerUpdateForProp('size');
  } // NOTE we may use the x, y, z args to calculate scale when/if we
  // implement size under the hood as an Object3D.scale.


  __updateGeometryOnSizeChange(_size) {
    // TODO PERFORMANCE, resetMeshComponent creates a new geometry.
    // Re-creating geometries is wasteful, re-use them when possible, and
    // add instancing. Maybe we use Object3D.scale as an implementation
    // detail of our `size` prop.
    this.resetMeshComponent();
  }

}

exports.BaseGeometryBehavior = exports.default = BaseGeometryBehavior;
BaseGeometryBehavior.props = {
  // if we have no props defined here, WithUpdate breaks
  size: (0, _props.changePropContext)(_props.props.XYZNonNegativeValues, self => self.element),
  sizeMode: (0, _props.changePropContext)(_props.props.XYZSizeModeValues, self => self.element)
};