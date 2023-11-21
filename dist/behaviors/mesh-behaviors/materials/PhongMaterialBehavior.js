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
import { Color } from 'three/src/math/Color.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { numberAttribute, stringAttribute, booleanAttribute } from '@lume/element';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { MaterialBehavior } from './MaterialBehavior.js';
/**
 * @class PhongMaterialBehavior -
 *
 * A cheaper type of material with less realism, based on older principles,
 * [named after computer graphics pioneer Bui Tuong
 * Phong](https://en.wikipedia.org/wiki/Phong_shading), not as realistic as
 * [`StandardMaterialBehavior`](./StandardMaterialBehavior) or
 * [`PhysicalMaterialBehavior`](./PhysicalMaterialBehavior) can be with their
 * "physically-based rendering (PBR)" algorithms.
 *
 * Backed by Three.js [`THREE.MeshPhongMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhongMaterial).
 *
 * @extends MaterialBehavior
 */
let PhongMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MaterialBehavior;
    let _instanceExtraInitializers = [];
    let _alphaMap_decorators;
    let _alphaMap_initializers = [];
    let _aoMap_decorators;
    let _aoMap_initializers = [];
    let _aoMapIntensity_decorators;
    let _aoMapIntensity_initializers = [];
    let _bumpMap_decorators;
    let _bumpMap_initializers = [];
    let _bumpScale_decorators;
    let _bumpScale_initializers = [];
    let _displacementMap_decorators;
    let _displacementMap_initializers = [];
    let _displacementScale_decorators;
    let _displacementScale_initializers = [];
    let _displacementBias_decorators;
    let _displacementBias_initializers = [];
    let _emissiveMap_decorators;
    let _emissiveMap_initializers = [];
    let _get_emissive_decorators;
    let _emissiveIntensity_decorators;
    let _emissiveIntensity_initializers = [];
    let _envMap_decorators;
    let _envMap_initializers = [];
    let _flatShading_decorators;
    let _flatShading_initializers = [];
    let _lightMap_decorators;
    let _lightMap_initializers = [];
    let _lightMapIntensity_decorators;
    let _lightMapIntensity_initializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _normalMap_decorators;
    let _normalMap_initializers = [];
    let _normalScale_decorators;
    let _normalScale_initializers = [];
    let _reflectivity_decorators;
    let _reflectivity_initializers = [];
    let _specularMap_decorators;
    let _specularMap_initializers = [];
    let _get_specular_decorators;
    let _shininess_decorators;
    let _shininess_initializers = [];
    var PhongMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _alphaMap_decorators = [stringAttribute, receiver];
            _aoMap_decorators = [stringAttribute, receiver];
            _aoMapIntensity_decorators = [numberAttribute, receiver];
            _bumpMap_decorators = [stringAttribute, receiver];
            _bumpScale_decorators = [numberAttribute, receiver];
            _displacementMap_decorators = [stringAttribute, receiver];
            _displacementScale_decorators = [numberAttribute, receiver];
            _displacementBias_decorators = [numberAttribute, receiver];
            _emissiveMap_decorators = [stringAttribute, receiver];
            _get_emissive_decorators = [stringAttribute, receiver];
            _emissiveIntensity_decorators = [numberAttribute, receiver];
            _envMap_decorators = [stringAttribute, receiver];
            _flatShading_decorators = [booleanAttribute, receiver];
            _lightMap_decorators = [stringAttribute, receiver];
            _lightMapIntensity_decorators = [numberAttribute, receiver];
            _texture_decorators = [stringAttribute, receiver];
            _normalMap_decorators = [stringAttribute, receiver];
            _normalScale_decorators = [numberAttribute, receiver];
            _reflectivity_decorators = [numberAttribute, receiver];
            _specularMap_decorators = [stringAttribute, receiver];
            _get_specular_decorators = [stringAttribute, receiver];
            _shininess_decorators = [numberAttribute, receiver];
            __esDecorate(this, null, _get_emissive_decorators, { kind: "getter", name: "emissive", static: false, private: false, access: { has: obj => "emissive" in obj, get: obj => obj.emissive }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_specular_decorators, { kind: "getter", name: "specular", static: false, private: false, access: { has: obj => "specular" in obj, get: obj => obj.specular }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _alphaMap_decorators, { kind: "field", name: "alphaMap", static: false, private: false, access: { has: obj => "alphaMap" in obj, get: obj => obj.alphaMap, set: (obj, value) => { obj.alphaMap = value; } }, metadata: _metadata }, _alphaMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _aoMap_decorators, { kind: "field", name: "aoMap", static: false, private: false, access: { has: obj => "aoMap" in obj, get: obj => obj.aoMap, set: (obj, value) => { obj.aoMap = value; } }, metadata: _metadata }, _aoMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _aoMapIntensity_decorators, { kind: "field", name: "aoMapIntensity", static: false, private: false, access: { has: obj => "aoMapIntensity" in obj, get: obj => obj.aoMapIntensity, set: (obj, value) => { obj.aoMapIntensity = value; } }, metadata: _metadata }, _aoMapIntensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _bumpMap_decorators, { kind: "field", name: "bumpMap", static: false, private: false, access: { has: obj => "bumpMap" in obj, get: obj => obj.bumpMap, set: (obj, value) => { obj.bumpMap = value; } }, metadata: _metadata }, _bumpMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _bumpScale_decorators, { kind: "field", name: "bumpScale", static: false, private: false, access: { has: obj => "bumpScale" in obj, get: obj => obj.bumpScale, set: (obj, value) => { obj.bumpScale = value; } }, metadata: _metadata }, _bumpScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementMap_decorators, { kind: "field", name: "displacementMap", static: false, private: false, access: { has: obj => "displacementMap" in obj, get: obj => obj.displacementMap, set: (obj, value) => { obj.displacementMap = value; } }, metadata: _metadata }, _displacementMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementScale_decorators, { kind: "field", name: "displacementScale", static: false, private: false, access: { has: obj => "displacementScale" in obj, get: obj => obj.displacementScale, set: (obj, value) => { obj.displacementScale = value; } }, metadata: _metadata }, _displacementScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementBias_decorators, { kind: "field", name: "displacementBias", static: false, private: false, access: { has: obj => "displacementBias" in obj, get: obj => obj.displacementBias, set: (obj, value) => { obj.displacementBias = value; } }, metadata: _metadata }, _displacementBias_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _emissiveMap_decorators, { kind: "field", name: "emissiveMap", static: false, private: false, access: { has: obj => "emissiveMap" in obj, get: obj => obj.emissiveMap, set: (obj, value) => { obj.emissiveMap = value; } }, metadata: _metadata }, _emissiveMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _emissiveIntensity_decorators, { kind: "field", name: "emissiveIntensity", static: false, private: false, access: { has: obj => "emissiveIntensity" in obj, get: obj => obj.emissiveIntensity, set: (obj, value) => { obj.emissiveIntensity = value; } }, metadata: _metadata }, _emissiveIntensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _envMap_decorators, { kind: "field", name: "envMap", static: false, private: false, access: { has: obj => "envMap" in obj, get: obj => obj.envMap, set: (obj, value) => { obj.envMap = value; } }, metadata: _metadata }, _envMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _flatShading_decorators, { kind: "field", name: "flatShading", static: false, private: false, access: { has: obj => "flatShading" in obj, get: obj => obj.flatShading, set: (obj, value) => { obj.flatShading = value; } }, metadata: _metadata }, _flatShading_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _lightMap_decorators, { kind: "field", name: "lightMap", static: false, private: false, access: { has: obj => "lightMap" in obj, get: obj => obj.lightMap, set: (obj, value) => { obj.lightMap = value; } }, metadata: _metadata }, _lightMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _lightMapIntensity_decorators, { kind: "field", name: "lightMapIntensity", static: false, private: false, access: { has: obj => "lightMapIntensity" in obj, get: obj => obj.lightMapIntensity, set: (obj, value) => { obj.lightMapIntensity = value; } }, metadata: _metadata }, _lightMapIntensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _normalMap_decorators, { kind: "field", name: "normalMap", static: false, private: false, access: { has: obj => "normalMap" in obj, get: obj => obj.normalMap, set: (obj, value) => { obj.normalMap = value; } }, metadata: _metadata }, _normalMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _normalScale_decorators, { kind: "field", name: "normalScale", static: false, private: false, access: { has: obj => "normalScale" in obj, get: obj => obj.normalScale, set: (obj, value) => { obj.normalScale = value; } }, metadata: _metadata }, _normalScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _reflectivity_decorators, { kind: "field", name: "reflectivity", static: false, private: false, access: { has: obj => "reflectivity" in obj, get: obj => obj.reflectivity, set: (obj, value) => { obj.reflectivity = value; } }, metadata: _metadata }, _reflectivity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _specularMap_decorators, { kind: "field", name: "specularMap", static: false, private: false, access: { has: obj => "specularMap" in obj, get: obj => obj.specularMap, set: (obj, value) => { obj.specularMap = value; } }, metadata: _metadata }, _specularMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shininess_decorators, { kind: "field", name: "shininess", static: false, private: false, access: { has: obj => "shininess" in obj, get: obj => obj.shininess, set: (obj, value) => { obj.shininess = value; } }, metadata: _metadata }, _shininess_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PhongMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        alphaMap = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _alphaMap_initializers, ''));
        aoMap = __runInitializers(this, _aoMap_initializers, '');
        aoMapIntensity = __runInitializers(this, _aoMapIntensity_initializers, 1);
        bumpMap = __runInitializers(this, _bumpMap_initializers, '');
        bumpScale = __runInitializers(this, _bumpScale_initializers, 1
        // combine
        );
        // combine
        displacementMap = __runInitializers(this, _displacementMap_initializers, '');
        displacementScale = __runInitializers(this, _displacementScale_initializers, 1);
        displacementBias = __runInitializers(this, _displacementBias_initializers, 0);
        emissiveMap = __runInitializers(this, _emissiveMap_initializers, ''
        // TODO this is not DRY, similar to the .color and .specular properties, consolidate.
        );
        // TODO this is not DRY, similar to the .color and .specular properties, consolidate.
        get emissive() {
            return this.#emissive;
        }
        set emissive(val) {
            if (typeof val === 'object')
                this.#emissive = val.getStyle();
            else
                this.#emissive = val;
        }
        #emissive = 'black';
        emissiveIntensity = __runInitializers(this, _emissiveIntensity_initializers, 1);
        envMap = __runInitializers(this, _envMap_initializers, '');
        flatShading = __runInitializers(this, _flatShading_initializers, false);
        lightMap = __runInitializers(this, _lightMap_initializers, '');
        lightMapIntensity = __runInitializers(this, _lightMapIntensity_initializers, 1);
        texture = __runInitializers(this, _texture_initializers, ''); // map
        normalMap = __runInitializers(this, _normalMap_initializers, ''
        // normalMapType
        );
        // normalMapType
        normalScale = __runInitializers(this, _normalScale_initializers, 1);
        reflectivity = __runInitializers(this, _reflectivity_initializers, 1);
        specularMap = __runInitializers(this, _specularMap_initializers, '');
        get specular() {
            return this.#specular;
        }
        set specular(val) {
            if (typeof val === 'object')
                this.#specular = val.getStyle();
            else
                this.#specular = val;
        }
        #specular = '#111';
        shininess = __runInitializers(this, _shininess_initializers, 30);
        _createComponent() {
            return new MeshPhongMaterial({
                color: 0x00ff00,
            });
        }
        loadGL() {
            super.loadGL();
            this.createEffect(() => {
                console.log('bumpScale effect');
            });
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.aoMapIntensity = this.aoMapIntensity;
                mat.bumpScale = this.bumpScale;
                mat.displacementScale = this.displacementScale;
                mat.displacementBias = this.displacementBias;
                mat.emissiveIntensity = this.emissiveIntensity;
                mat.flatShading = this.flatShading;
                mat.lightMapIntensity = this.lightMapIntensity;
                mat.normalScale.set(this.normalScale, this.normalScale);
                mat.reflectivity = this.reflectivity;
                mat.shininess = this.shininess;
                // TODO Needed?
                // mat.needsUpdate = true
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                this.meshComponent?.emissive.set(this.emissive);
                this.element.needsUpdate();
            });
            this.createEffect(() => {
                this.meshComponent?.specular.set(this.specular);
                this.element.needsUpdate();
            });
            this._handleTexture(() => this.alphaMap, (mat, tex) => (mat.alphaMap = tex), mat => !!mat.alphaMap);
            this._handleTexture(() => this.aoMap, (mat, tex) => (mat.aoMap = tex), mat => !!mat.aoMap);
            this._handleTexture(() => this.bumpMap, (mat, tex) => (mat.bumpMap = tex), mat => !!mat.bumpMap);
            this._handleTexture(() => this.displacementMap, (mat, tex) => (mat.displacementMap = tex), mat => !!mat.displacementMap);
            this._handleTexture(() => this.emissiveMap, (mat, tex) => (mat.emissiveMap = tex), mat => !!mat.emissiveMap, () => { }, true);
            this._handleTexture(() => this.envMap, (mat, tex) => (mat.envMap = tex), mat => !!mat.envMap);
            this._handleTexture(() => this.lightMap, (mat, tex) => (mat.lightMap = tex), mat => !!mat.lightMap);
            this._handleTexture(() => this.texture, // map
            (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
            this._handleTexture(() => this.normalMap, (mat, tex) => (mat.normalMap = tex), mat => !!mat.normalMap);
            this._handleTexture(() => this.specularMap, (mat, tex) => (mat.specularMap = tex), mat => !!mat.specularMap, () => { }, true);
        }
    };
    return PhongMaterialBehavior = _classThis;
})();
export { PhongMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('phong-material'))
    elementBehaviors.define('phong-material', PhongMaterialBehavior);
//# sourceMappingURL=PhongMaterialBehavior.js.map