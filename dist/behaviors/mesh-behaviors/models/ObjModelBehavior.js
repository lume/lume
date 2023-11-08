var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'element-behaviors';
import { reactive, stringAttribute } from '../../attribute.js';
import { disposeObjectTree, setRandomColorPhongMaterial, isRenderItem } from '../../../utils/three.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
let ObjModelBehavior = class ObjModelBehavior extends RenderableBehavior {
    obj = '';
    mtl = '';
    model;
    objLoader;
    mtlLoader;
    #version = 0;
    loadGL() {
        this.objLoader = new OBJLoader();
        this.mtlLoader = new MTLLoader(this.objLoader.manager);
        this.mtlLoader.crossOrigin = '';
        this.objLoader.manager.onLoad = () => {
            this.element.needsUpdate();
        };
        let firstRun = true;
        this.createEffect(() => {
            this.mtl;
            this.obj;
            if (!firstRun)
                this.#cleanupModel();
            this.#version++;
            this.#loadModel();
        });
        firstRun = false;
    }
    unloadGL() {
        this.#cleanupModel();
        this.#version++;
    }
    #materialIsFromMaterialBehavior = false;
    #cleanupModel() {
        if (this.model) {
            disposeObjectTree(this.model, {
                destroyMaterial: !this.#materialIsFromMaterialBehavior,
            });
        }
        this.#materialIsFromMaterialBehavior = false;
        this.model = undefined;
    }
    #loadModel() {
        const { obj, mtl, mtlLoader, objLoader } = this;
        const version = this.#version;
        if (!obj)
            return;
        if (mtl) {
            mtlLoader.setResourcePath(mtl.substr(0, mtl.lastIndexOf('/') + 1));
            console.log('load mtl');
            mtlLoader.load(mtl, materials => {
                if (version !== this.#version)
                    return;
                console.log('loaded mtl:', materials);
                materials.preload();
                objLoader.setMaterials(materials);
                this.#loadObj(version, true);
            });
        }
        else {
            this.#loadObj(version, false);
        }
    }
    #loadObj(version, hasMtl) {
        this.objLoader.load(this.obj, model => version == this.#version && this.#setModel(model, hasMtl), progress => version === this.#version && this.element.emit(Events.PROGRESS, progress), error => version === this.#version && this.#onError(error));
    }
    #onError(error) {
        const message = `Failed to load ${this.element.tagName.toLowerCase()} with obj value "${this.obj}" and mtl value "${this.mtl}". See the following error.`;
        console.warn(message);
        const err = error instanceof ErrorEvent && error.error ? error.error : error;
        console.error(err);
        this.element.emit(Events.MODEL_ERROR, err);
    }
    #setModel(model, hasMtl) {
        if (!hasMtl) {
            let materialBehavior = this.element.behaviors.get('basic-material');
            if (!materialBehavior)
                materialBehavior = this.element.behaviors.get('phong-material');
            if (!materialBehavior)
                materialBehavior = this.element.behaviors.get('standard-material');
            if (!materialBehavior)
                materialBehavior = this.element.behaviors.get('lambert-material');
            if (materialBehavior) {
                this.#materialIsFromMaterialBehavior = true;
                model.traverse((child) => {
                    console.log('isRenderItem?', isRenderItem(child));
                    if (isRenderItem(child)) {
                        child.material = materialBehavior.meshComponent || thro(new Error('Expected a material'));
                    }
                });
            }
            else {
                console.log('Set random material');
                setRandomColorPhongMaterial(model);
            }
        }
        this.model = model;
        this.element.three.add(model);
        this.element.emit(Events.MODEL_LOAD, { format: 'obj', model });
        this.element.needsUpdate();
    }
};
__decorate([
    stringAttribute('')
], ObjModelBehavior.prototype, "obj", void 0);
__decorate([
    stringAttribute('')
], ObjModelBehavior.prototype, "mtl", void 0);
ObjModelBehavior = __decorate([
    reactive
], ObjModelBehavior);
export { ObjModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('obj-model'))
    elementBehaviors.define('obj-model', ObjModelBehavior);
const thro = (err) => {
    throw err;
};
//# sourceMappingURL=ObjModelBehavior.js.map