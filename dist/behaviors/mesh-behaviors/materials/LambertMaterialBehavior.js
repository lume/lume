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
import { stringAttribute } from '@lume/element';
import 'element-behaviors';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { MaterialBehavior } from './MaterialBehavior.js';
/**
 * @behavior lambert-material
 * @class LambertMaterialBehavior -
 * The `lambert-material` behavior gives any mesh a [Lambertian lighting model](https://en.wikipedia.org/wiki/Lambertian_reflectance)
 * for its material. It uses a
 * [THREE.MeshLambertMaterial](https://threejs.org/docs/index.html?q=lambert#api/en/materials/MeshLambertMaterial) under the hood.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = meshExample({material: 'lambert', color: 'skyblue'})
 * </script>
 *
 * @extends MaterialBehavior
 */
let LambertMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MaterialBehavior;
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _specularMap_decorators;
    let _specularMap_initializers = [];
    let _specularMap_extraInitializers = [];
    var LambertMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _texture_decorators = [stringAttribute, receiver];
            _specularMap_decorators = [stringAttribute, receiver];
            __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(null, null, _specularMap_decorators, { kind: "field", name: "specularMap", static: false, private: false, access: { has: obj => "specularMap" in obj, get: obj => obj.specularMap, set: (obj, value) => { obj.specularMap = value; } }, metadata: _metadata }, _specularMap_initializers, _specularMap_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LambertMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        texture = __runInitializers(this, _texture_initializers, '');
        specularMap = (__runInitializers(this, _texture_extraInitializers), __runInitializers(this, _specularMap_initializers, ''));
        _createComponent() {
            return new MeshLambertMaterial({ color: 0x00ff00 });
        }
        connectedCallback() {
            super.connectedCallback();
            this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
            this._handleTexture(() => this.specularMap, (mat, tex) => (mat.specularMap = tex), mat => !!mat.specularMap, () => { }, true);
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _specularMap_extraInitializers);
        }
    };
    return LambertMaterialBehavior = _classThis;
})();
export { LambertMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('lambert-material'))
    elementBehaviors.define('lambert-material', LambertMaterialBehavior);
//# sourceMappingURL=LambertMaterialBehavior.js.map