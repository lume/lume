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
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
/**
 * @class LineBasicMaterialBehavior -
 *
 * Behavior: `line-material`
 *
 * This is the default material behavior for
 * [`<lume-line>`](../../../meshes/Line.md) elements. It renders a series of
 * points as a simple colored line, optionally with a texture for coloring. It is
 * backed by Three.js `LineBasicMaterial` underneath. This is typically paired with
 * [`LineGeometryBehavior`](../geometries/LineGeometryBehavior.md).
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends MaterialBehavior
 */
let LineBasicMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MaterialBehavior;
    let _instanceExtraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    var LineBasicMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _texture_decorators = [stringAttribute, receiver];
            __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LineBasicMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {string} texture - A texture to set color along the line.
         * Useful when supplying UVs to the geometry being used along with this
         * material. Most likely you'll supply UVs by copying data from a modeling
         * program like Blender, probably not something you'd program manually.
         */
        texture = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _texture_initializers, ''));
        _createComponent() {
            return new LineBasicMaterial();
        }
        connectedCallback() {
            super.connectedCallback();
            this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
        }
    };
    return LineBasicMaterialBehavior = _classThis;
})();
export { LineBasicMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('line-material'))
    elementBehaviors.define('line-material', LineBasicMaterialBehavior);
//# sourceMappingURL=LineBasicMaterialBehavior.js.map