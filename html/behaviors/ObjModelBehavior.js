"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjModelBehavior = exports.default = void 0;

require("element-behaviors");

var _OBJLoader = require("../../lib/three/OBJLoader");

var _MTLLoader = require("../../lib/three/MTLLoader");

var _Events = require("../../core/Events");

var _Behavior = _interopRequireDefault(require("./Behavior"));

var _three = require("../../utils/three");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ObjModelBehavior extends _Behavior.default {
  constructor() {
    super(...arguments);
    this.__materialIsFromMaterialBehavior = false;
  }

  updated(_oldProps, modifiedProps) {
    if (modifiedProps.obj || modifiedProps.mtl) {
      // TODO if only mtl changes, maybe we can update only the material
      // instead of reloading the whole object?
      if (!this.obj) return;

      this.__cleanup();

      this.__loadObj();
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    this.model = null; // TODO TS augment the THREE module so 'as any' is not needed

    this.objLoader = new _OBJLoader.OBJLoader(); // TODO types for loaders

    this.mtlLoader = new _MTLLoader.MTLLoader(this.objLoader.manager); // Allow cross-origin images to be loaded.

    this.mtlLoader.crossOrigin = '';

    this.objLoader.manager.onLoad = () => {
      this.element.needsUpdate();
    };
  }

  async disconnectedCallback() {
    super.disconnectedCallback();

    this.__cleanup();
  }

  __cleanup() {
    if (!this.model) return;
    (0, _three.disposeObjectTree)(this.model, {
      destroyMaterial: !this.__materialIsFromMaterialBehavior
    });
    this.__materialIsFromMaterialBehavior = false;
  }

  __loadObj() {
    const {
      obj,
      mtl,
      mtlLoader,
      objLoader
    } = this;

    if (mtl) {
      mtlLoader.setTexturePath(mtl.substr(0, mtl.lastIndexOf('/') + 1));
      mtlLoader.load(mtl, materials => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(obj, model => this.__setModel(model));
      });
    } else {
      objLoader.load(obj, model => {
        let materialBehavior = this.element.behaviors.get('basic-material');
        if (!materialBehavior) materialBehavior = this.element.behaviors.get('phong-material');
        if (!materialBehavior) materialBehavior = this.element.behaviors.get('standard-material');
        if (!materialBehavior) materialBehavior = this.element.behaviors.get('lambert-material');

        if (materialBehavior) {
          this.__materialIsFromMaterialBehavior = true; // TODO this part only works on Mesh elements at the
          // moment. We will update the geometry and material
          // behaviors to work in tandem with or without a mesh
          // behavior, and other behaviors can use the geometry or
          // material features.

          model.traverse(child => {
            if ((0, _three.isRenderItem)(child)) {
              console.log(materialBehavior.getMeshComponent('material'));
              child.material = materialBehavior.getMeshComponent('material');
            }
          });
        } else {
          // if no material, make a default one with random color
          (0, _three.setRandomColorPhongMaterial)(model);
        }

        this.__setModel(model);
      });
    }
  }

  __setModel(model) {
    this.element.three.add(this.model = model);
    this.element.emit(_Events.Events.MODEL_LOAD, {
      format: 'obj',
      model: model
    });
    this.element.needsUpdate();
  }

}

exports.ObjModelBehavior = exports.default = ObjModelBehavior;
ObjModelBehavior.props = {
  obj: String,
  mtl: String
};
elementBehaviors.define('obj-model', ObjModelBehavior);