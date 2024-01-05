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
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { booleanAttribute, numberAttribute, stringAttribute } from '@lume/element';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { MaterialBehavior } from './MaterialBehavior.js';
/**
 * @class StandardMaterialBehavior -
 *
 * A standard physically based material, using Metallic-Roughness workflow.
 *
 * Backed by Three.js [`THREE.MeshStandardMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshStandardMaterial)
 *
 * @extends MaterialBehavior
 */
let StandardMaterialBehavior = (() => {
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
    let _texture_decorators;
    let _texture_initializers = [];
    let _normalMap_decorators;
    let _normalMap_initializers = [];
    let _normalScale_decorators;
    let _normalScale_initializers = [];
    let _metalness_decorators;
    let _metalness_initializers = [];
    let _metalnessMap_decorators;
    let _metalnessMap_initializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughnessMap_decorators;
    let _roughnessMap_initializers = [];
    let _vertexTangents_decorators;
    let _vertexTangents_initializers = [];
    let _morphTargets_decorators;
    let _morphTargets_initializers = [];
    let _morphNormals_decorators;
    let _morphNormals_initializers = [];
    var StandardMaterialBehavior = class extends _classSuper {
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
            _texture_decorators = [stringAttribute, receiver];
            _normalMap_decorators = [stringAttribute, receiver];
            _normalScale_decorators = [numberAttribute, receiver];
            _metalness_decorators = [numberAttribute, receiver];
            _metalnessMap_decorators = [stringAttribute, receiver];
            _roughness_decorators = [numberAttribute, receiver];
            _roughnessMap_decorators = [stringAttribute, receiver];
            _vertexTangents_decorators = [booleanAttribute, receiver];
            _morphTargets_decorators = [booleanAttribute, receiver];
            _morphNormals_decorators = [booleanAttribute, receiver];
            __esDecorate(null, null, _alphaMap_decorators, { kind: "field", name: "alphaMap", static: false, private: false, access: { has: obj => "alphaMap" in obj, get: obj => obj.alphaMap, set: (obj, value) => { obj.alphaMap = value; } }, metadata: _metadata }, _alphaMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _aoMap_decorators, { kind: "field", name: "aoMap", static: false, private: false, access: { has: obj => "aoMap" in obj, get: obj => obj.aoMap, set: (obj, value) => { obj.aoMap = value; } }, metadata: _metadata }, _aoMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _aoMapIntensity_decorators, { kind: "field", name: "aoMapIntensity", static: false, private: false, access: { has: obj => "aoMapIntensity" in obj, get: obj => obj.aoMapIntensity, set: (obj, value) => { obj.aoMapIntensity = value; } }, metadata: _metadata }, _aoMapIntensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _bumpMap_decorators, { kind: "field", name: "bumpMap", static: false, private: false, access: { has: obj => "bumpMap" in obj, get: obj => obj.bumpMap, set: (obj, value) => { obj.bumpMap = value; } }, metadata: _metadata }, _bumpMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _bumpScale_decorators, { kind: "field", name: "bumpScale", static: false, private: false, access: { has: obj => "bumpScale" in obj, get: obj => obj.bumpScale, set: (obj, value) => { obj.bumpScale = value; } }, metadata: _metadata }, _bumpScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementMap_decorators, { kind: "field", name: "displacementMap", static: false, private: false, access: { has: obj => "displacementMap" in obj, get: obj => obj.displacementMap, set: (obj, value) => { obj.displacementMap = value; } }, metadata: _metadata }, _displacementMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementScale_decorators, { kind: "field", name: "displacementScale", static: false, private: false, access: { has: obj => "displacementScale" in obj, get: obj => obj.displacementScale, set: (obj, value) => { obj.displacementScale = value; } }, metadata: _metadata }, _displacementScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _displacementBias_decorators, { kind: "field", name: "displacementBias", static: false, private: false, access: { has: obj => "displacementBias" in obj, get: obj => obj.displacementBias, set: (obj, value) => { obj.displacementBias = value; } }, metadata: _metadata }, _displacementBias_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _normalMap_decorators, { kind: "field", name: "normalMap", static: false, private: false, access: { has: obj => "normalMap" in obj, get: obj => obj.normalMap, set: (obj, value) => { obj.normalMap = value; } }, metadata: _metadata }, _normalMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _normalScale_decorators, { kind: "field", name: "normalScale", static: false, private: false, access: { has: obj => "normalScale" in obj, get: obj => obj.normalScale, set: (obj, value) => { obj.normalScale = value; } }, metadata: _metadata }, _normalScale_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _metalness_decorators, { kind: "field", name: "metalness", static: false, private: false, access: { has: obj => "metalness" in obj, get: obj => obj.metalness, set: (obj, value) => { obj.metalness = value; } }, metadata: _metadata }, _metalness_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _metalnessMap_decorators, { kind: "field", name: "metalnessMap", static: false, private: false, access: { has: obj => "metalnessMap" in obj, get: obj => obj.metalnessMap, set: (obj, value) => { obj.metalnessMap = value; } }, metadata: _metadata }, _metalnessMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _roughness_decorators, { kind: "field", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _roughnessMap_decorators, { kind: "field", name: "roughnessMap", static: false, private: false, access: { has: obj => "roughnessMap" in obj, get: obj => obj.roughnessMap, set: (obj, value) => { obj.roughnessMap = value; } }, metadata: _metadata }, _roughnessMap_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _vertexTangents_decorators, { kind: "field", name: "vertexTangents", static: false, private: false, access: { has: obj => "vertexTangents" in obj, get: obj => obj.vertexTangents, set: (obj, value) => { obj.vertexTangents = value; } }, metadata: _metadata }, _vertexTangents_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _morphTargets_decorators, { kind: "field", name: "morphTargets", static: false, private: false, access: { has: obj => "morphTargets" in obj, get: obj => obj.morphTargets, set: (obj, value) => { obj.morphTargets = value; } }, metadata: _metadata }, _morphTargets_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _morphNormals_decorators, { kind: "field", name: "morphNormals", static: false, private: false, access: { has: obj => "morphNormals" in obj, get: obj => obj.morphNormals, set: (obj, value) => { obj.morphNormals = value; } }, metadata: _metadata }, _morphNormals_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            StandardMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        alphaMap = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _alphaMap_initializers, ''));
        aoMap = __runInitializers(this, _aoMap_initializers, '');
        aoMapIntensity = __runInitializers(this, _aoMapIntensity_initializers, 1);
        bumpMap = __runInitializers(this, _bumpMap_initializers, '');
        bumpScale = __runInitializers(this, _bumpScale_initializers, 1);
        displacementMap = __runInitializers(this, _displacementMap_initializers, '');
        displacementScale = __runInitializers(this, _displacementScale_initializers, 1);
        displacementBias = __runInitializers(this, _displacementBias_initializers, 0
        // emissive?: Color | string | number;
        // envMap?: Texture | null;
        // @numberAttribute @receiver envMapIntensity?: number
        // @numberAttribute @receiver emissiveIntensity?: number
        // emissiveMap?: Texture | null;
        // lightMap?: Texture | null;
        // @numberAttribute @receiver lightMapIntensity?: number
        );
        // emissive?: Color | string | number;
        // envMap?: Texture | null;
        // @numberAttribute @receiver envMapIntensity?: number
        // @numberAttribute @receiver emissiveIntensity?: number
        // emissiveMap?: Texture | null;
        // lightMap?: Texture | null;
        // @numberAttribute @receiver lightMapIntensity?: number
        texture = __runInitializers(this, _texture_initializers, ''); // map
        normalMap = __runInitializers(this, _normalMap_initializers, ''
        // normalMapType
        );
        // normalMapType
        normalScale = __runInitializers(this, _normalScale_initializers, 1);
        metalness = __runInitializers(this, _metalness_initializers, 0);
        metalnessMap = __runInitializers(this, _metalnessMap_initializers, ''
        // @numberAttribute @receiver refractionRatio?: number
        );
        // @numberAttribute @receiver refractionRatio?: number
        roughness = __runInitializers(this, _roughness_initializers, 1);
        roughnessMap = __runInitializers(this, _roughnessMap_initializers, ''
        // wireframe?: boolean
        // @numberAttribute @receiver wireframeLinewidth?: number // Not supported because the WebGL line width is always 1.
        // @booleanAttribute @receiver skinning: boolean = false
        );
        // wireframe?: boolean
        // @numberAttribute @receiver wireframeLinewidth?: number // Not supported because the WebGL line width is always 1.
        // @booleanAttribute @receiver skinning: boolean = false
        vertexTangents = __runInitializers(this, _vertexTangents_initializers, false);
        morphTargets = __runInitializers(this, _morphTargets_initializers, false);
        morphNormals = __runInitializers(this, _morphNormals_initializers, false);
        _createComponent() {
            return new MeshStandardMaterial();
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.aoMapIntensity = this.aoMapIntensity;
                mat.bumpScale = this.bumpScale;
                mat.displacementScale = this.displacementScale;
                mat.displacementBias = this.displacementBias;
                mat.normalScale.set(this.normalScale, this.normalScale);
                mat.metalness = this.metalness;
                // mat.morphNormals = this.morphNormals
                // mat.morphTargets = this.morphTargets
                mat.roughness = this.roughness;
                // mat.vertexTangents = this.vertexTangents
                // TODO Needed?
                // mat.needsUpdate = true
                this.element.needsUpdate();
            });
            this._handleTexture(() => this.alphaMap, (mat, tex) => (mat.alphaMap = tex), mat => !!mat.alphaMap);
            this._handleTexture(() => this.aoMap, (mat, tex) => (mat.aoMap = tex), mat => !!mat.aoMap);
            this._handleTexture(() => this.bumpMap, (mat, tex) => (mat.bumpMap = tex), mat => !!mat.bumpMap);
            this._handleTexture(() => this.displacementMap, (mat, tex) => (mat.displacementMap = tex), mat => !!mat.displacementMap);
            this._handleTexture(() => this.texture, // map
            (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
            this._handleTexture(() => this.normalMap, (mat, tex) => (mat.normalMap = tex), mat => !!mat.normalMap);
            this._handleTexture(() => this.metalnessMap, (mat, tex) => (mat.metalnessMap = tex), mat => !!mat.metalnessMap);
            this._handleTexture(() => this.roughnessMap, (mat, tex) => (mat.roughnessMap = tex), mat => !!mat.roughnessMap);
        }
    };
    return StandardMaterialBehavior = _classThis;
})();
export { StandardMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('standard-material'))
    elementBehaviors.define('standard-material', StandardMaterialBehavior);
//# sourceMappingURL=StandardMaterialBehavior.js.map