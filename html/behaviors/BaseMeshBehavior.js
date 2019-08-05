"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseMeshBehavior = exports.default = void 0;

var _three = require("three");

var _Behavior = _interopRequireDefault(require("./Behavior"));

var _Events = require("../../core/Events");

var _Mesh = _interopRequireDefault(require("../../core/Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
class BaseMeshBehavior extends _Behavior.default {
  constructor() {
    super(...arguments);
    this._glLoaded = false;
    this._cssLoaded = false;
  } // use a getter because Mesh is undefined at module evaluation time due
  // to a circular dependency.


  get requiredElementType() {
    return _Mesh.default;
  }

  get glLoaded() {
    return this._glLoaded;
  }

  get cssLoaded() {
    return this._cssLoaded;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.loadGL();
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    this.unloadGL();
  }

  loadGL() {
    if (!this.element.three) return;
    if (this._glLoaded) return;
    this._glLoaded = true;
    this.resetMeshComponent();
    this.triggerUpdateForAllProps();
    this.element.needsUpdate();
  }

  unloadGL() {
    if (!this._glLoaded) return;
    this._glLoaded = false; // if the behavior is being disconnected, but the element still has GL
    // mode (.three), then leave the element with a default mesh GL
    // component to be rendered.

    if (this.element.three) this.__setDefaultComponent(this.element, this.type);else this.__disposeMeshComponent(this.element, this.type);
    this.element.needsUpdate();
  }

  resetMeshComponent() {
    // TODO We might have to defer so that calculatedSize is already calculated
    // (note, resetMeshComponent is only called when the size prop has
    // changed)
    this.__setMeshComponent(this.element, this.type, this._createComponent());

    this.element.needsUpdate();
  }

  getMeshComponent(name) {
    return this.element.three[name];
  }

  _createComponent() {
    throw new Error('`_createComponent()` is not implemented by subclass.');
  }

  _listenToElement() {
    super._listenToElement();

    this.element.on(_Events.Events.BEHAVIOR_GL_LOAD, this.loadGL, this);
    this.element.on(_Events.Events.BEHAVIOR_GL_UNLOAD, this.unloadGL, this);
  }

  _unlistenToElement() {
    super._unlistenToElement();

    this.element.off(_Events.Events.BEHAVIOR_GL_LOAD, this.loadGL);
    this.element.off(_Events.Events.BEHAVIOR_GL_UNLOAD, this.unloadGL);
  } // records the initial size of the geometry, so that we have a
  // reference for how much scale to apply when accepting new sizes from
  // the user.
  // TODO
  // private __initialSize: null,


  __disposeMeshComponent(element, name) {
    // TODO handle material arrays
    if (element.three[name]) element.three[name].dispose();
  }

  __setMeshComponent(element, name, newComponent) {
    this.__disposeMeshComponent(element, name); // the following type casting is not type safe, but shows what we intend
    // (we can't type this sort of JavaScript in TypeScript)


    element.three[name] = newComponent; // or element.three[name as 'material'] = newComponent as Material
  }

  __setDefaultComponent(element, name) {
    this.__setMeshComponent(element, name, this.__makeDefaultComponent(element, name));
  }

  __makeDefaultComponent(element, name) {
    switch (name) {
      case 'geometry':
        return new _three.BoxGeometry(element.calculatedSize.x, element.calculatedSize.y, element.calculatedSize.z);

      case 'material':
        return new _three.MeshPhongMaterial({
          color: 0xff6600
        });
    }
  }

}

exports.BaseMeshBehavior = exports.default = BaseMeshBehavior;