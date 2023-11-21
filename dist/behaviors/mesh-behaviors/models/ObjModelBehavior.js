var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import 'element-behaviors';
import { stringAttribute } from '@lume/element';
import { disposeObjectTree, setRandomColorPhongMaterial, isRenderItem } from '../../../utils/three.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
let ObjModelBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderableBehavior;
    let _instanceExtraInitializers = [];
    let _obj_decorators;
    let _obj_initializers = [];
    let _mtl_decorators;
    let _mtl_initializers = [];
    var ObjModelBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _obj_decorators = [stringAttribute, receiver];
            _mtl_decorators = [stringAttribute, receiver];
            __esDecorate(null, null, _obj_decorators, { kind: "field", name: "obj", static: false, private: false, access: { has: obj => "obj" in obj, get: obj => obj.obj, set: (obj, value) => { obj.obj = value; } }, metadata: _metadata }, _obj_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _mtl_decorators, { kind: "field", name: "mtl", static: false, private: false, access: { has: obj => "mtl" in obj, get: obj => obj.mtl, set: (obj, value) => { obj.mtl = value; } }, metadata: _metadata }, _mtl_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ObjModelBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        obj = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _obj_initializers, ''));
        mtl = __runInitializers(this, _mtl_initializers, '');
        model;
        objLoader;
        mtlLoader;
        // This is incremented any time we need a pending load() to cancel (f.e. on
        // src change, or unloadGL cycle), so that the loader will ignore the
        // result when a version change has happened.
        #version = 0;
        loadGL() {
            this.objLoader = new OBJLoader(); // TODO types for loaders
            this.mtlLoader = new MTLLoader(this.objLoader.manager);
            // Allow cross-origin images to be loaded.
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
                // TODO We can update only the material or model specifically
                // instead of reloading the whole object.
                this.#loadModel();
            });
            firstRun = false;
        }
        unloadGL() {
            this.#cleanupModel();
            // Increment this in case the loader is still loading, so it will ignore the result.
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
                mtlLoader.load(mtl, materials => {
                    if (version !== this.#version)
                        return;
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
            // If the OBJ model does not have an MTL, then use the material behavior if any.
            if (!hasMtl) {
                // TODO Simplify this by getting based on type.
                let materialBehavior = this.element.behaviors.get('basic-material');
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('phong-material');
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('standard-material');
                if (!materialBehavior)
                    materialBehavior = this.element.behaviors.get('lambert-material');
                if (materialBehavior) {
                    this.#materialIsFromMaterialBehavior = true;
                    // TODO this part only works on Mesh elements at the
                    // moment. We will update the geometry and material
                    // behaviors to work in tandem with or without a mesh
                    // behavior, and other behaviors can use the geometry or
                    // material features.
                    model.traverse((child) => {
                        if (isRenderItem(child)) {
                            child.material = materialBehavior.meshComponent || thro(new Error('Expected a material'));
                        }
                    });
                }
                else {
                    // if no material, make a default one with random color
                    setRandomColorPhongMaterial(model);
                }
            }
            this.model = model;
            this.element.three.add(model);
            this.element.emit(Events.MODEL_LOAD, { format: 'obj', model });
            this.element.needsUpdate();
        }
    };
    return ObjModelBehavior = _classThis;
})();
export { ObjModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('obj-model'))
    elementBehaviors.define('obj-model', ObjModelBehavior);
const thro = (err) => {
    throw err;
};
//# sourceMappingURL=ObjModelBehavior.js.map