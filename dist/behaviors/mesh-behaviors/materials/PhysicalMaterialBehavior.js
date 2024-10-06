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
import { numberAttribute, stringAttribute } from '@lume/element';
import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { StandardMaterialBehavior } from './StandardMaterialBehavior.js';
/**
 * @class PhysicalMaterialBehavior -
 *
 * An extension of the [`StandardMaterialBehavior`](./StandardMaterialBehavior), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends MaterialBehavior
 */
let PhysicalMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = StandardMaterialBehavior;
    let _clearcoat_decorators;
    let _clearcoat_initializers = [];
    let _clearcoat_extraInitializers = [];
    let _clearcoatRoughness_decorators;
    let _clearcoatRoughness_initializers = [];
    let _clearcoatRoughness_extraInitializers = [];
    let _refractiveIndex_decorators;
    let _refractiveIndex_initializers = [];
    let _refractiveIndex_extraInitializers = [];
    let _reflectivity_decorators;
    let _reflectivity_initializers = [];
    let _reflectivity_extraInitializers = [];
    let _transmission_decorators;
    let _transmission_initializers = [];
    let _transmission_extraInitializers = [];
    let _transmissionMap_decorators;
    let _transmissionMap_initializers = [];
    let _transmissionMap_extraInitializers = [];
    var PhysicalMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _clearcoat_decorators = [numberAttribute, receiver];
            _clearcoatRoughness_decorators = [numberAttribute, receiver];
            _refractiveIndex_decorators = [numberAttribute, receiver];
            _reflectivity_decorators = [numberAttribute, receiver];
            _transmission_decorators = [numberAttribute, receiver];
            _transmissionMap_decorators = [stringAttribute, receiver];
            __esDecorate(null, null, _clearcoat_decorators, { kind: "field", name: "clearcoat", static: false, private: false, access: { has: obj => "clearcoat" in obj, get: obj => obj.clearcoat, set: (obj, value) => { obj.clearcoat = value; } }, metadata: _metadata }, _clearcoat_initializers, _clearcoat_extraInitializers);
            __esDecorate(null, null, _clearcoatRoughness_decorators, { kind: "field", name: "clearcoatRoughness", static: false, private: false, access: { has: obj => "clearcoatRoughness" in obj, get: obj => obj.clearcoatRoughness, set: (obj, value) => { obj.clearcoatRoughness = value; } }, metadata: _metadata }, _clearcoatRoughness_initializers, _clearcoatRoughness_extraInitializers);
            __esDecorate(null, null, _refractiveIndex_decorators, { kind: "field", name: "refractiveIndex", static: false, private: false, access: { has: obj => "refractiveIndex" in obj, get: obj => obj.refractiveIndex, set: (obj, value) => { obj.refractiveIndex = value; } }, metadata: _metadata }, _refractiveIndex_initializers, _refractiveIndex_extraInitializers);
            __esDecorate(null, null, _reflectivity_decorators, { kind: "field", name: "reflectivity", static: false, private: false, access: { has: obj => "reflectivity" in obj, get: obj => obj.reflectivity, set: (obj, value) => { obj.reflectivity = value; } }, metadata: _metadata }, _reflectivity_initializers, _reflectivity_extraInitializers);
            __esDecorate(null, null, _transmission_decorators, { kind: "field", name: "transmission", static: false, private: false, access: { has: obj => "transmission" in obj, get: obj => obj.transmission, set: (obj, value) => { obj.transmission = value; } }, metadata: _metadata }, _transmission_initializers, _transmission_extraInitializers);
            __esDecorate(null, null, _transmissionMap_decorators, { kind: "field", name: "transmissionMap", static: false, private: false, access: { has: obj => "transmissionMap" in obj, get: obj => obj.transmissionMap, set: (obj, value) => { obj.transmissionMap = value; } }, metadata: _metadata }, _transmissionMap_initializers, _transmissionMap_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PhysicalMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // WIP
        clearcoat = __runInitializers(this, _clearcoat_initializers, 0
        // clearcoatMap
        // clearcoatNormalMap
        // clearcoatNormalScale
        );
        // clearcoatMap
        // clearcoatNormalMap
        // clearcoatNormalScale
        clearcoatRoughness = (__runInitializers(this, _clearcoat_extraInitializers), __runInitializers(this, _clearcoatRoughness_initializers, 0
        // clearcoatRoughnessMap
        // defines
        ));
        // clearcoatRoughnessMap
        // defines
        refractiveIndex = (__runInitializers(this, _clearcoatRoughness_extraInitializers), __runInitializers(this, _refractiveIndex_initializers, 1.5));
        reflectivity = (__runInitializers(this, _refractiveIndex_extraInitializers), __runInitializers(this, _reflectivity_initializers, 0.5
        // @numberAttribute @receiver sheen = 0 // TODO update to latest three to enable this
        // @numberAttribute @receiver sheenRoughness = 0
        // sheenRoughnessMap
        // sheenColor
        // sheenColorMap
        // @numberAttribute @receiver specularIntensity = 0
        // specularIntensityMap
        // specularColor
        // specularColorMap
        ));
        // @numberAttribute @receiver sheen = 0 // TODO update to latest three to enable this
        // @numberAttribute @receiver sheenRoughness = 0
        // sheenRoughnessMap
        // sheenColor
        // sheenColorMap
        // @numberAttribute @receiver specularIntensity = 0
        // specularIntensityMap
        // specularColor
        // specularColorMap
        transmission = (__runInitializers(this, _reflectivity_extraInitializers), __runInitializers(this, _transmission_initializers, 0));
        transmissionMap = (__runInitializers(this, _transmission_extraInitializers), __runInitializers(this, _transmissionMap_initializers, ''));
        _createComponent() {
            return new MeshPhysicalMaterial({});
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.clearcoat = this.clearcoat;
                mat.clearcoatRoughness = this.clearcoatRoughness;
                mat.ior = this.refractiveIndex;
                mat.reflectivity = this.reflectivity;
                mat.transmission = this.transmission;
                // TODO Needed?
                // mat.needsUpdate = true
                this.element.needsUpdate();
            });
            this._handleTexture(() => this.transmissionMap, (mat, tex) => (mat.transmissionMap = tex), mat => !!mat.transmissionMap);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _transmissionMap_extraInitializers);
        }
    };
    return PhysicalMaterialBehavior = _classThis;
})();
export { PhysicalMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('physical-material'))
    elementBehaviors.define('physical-material', PhysicalMaterialBehavior);
//# sourceMappingURL=PhysicalMaterialBehavior.js.map