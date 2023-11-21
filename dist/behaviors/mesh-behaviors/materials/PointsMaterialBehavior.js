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
import { booleanAttribute, numberAttribute, stringAttribute } from '@lume/element';
import 'element-behaviors';
import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let PointsMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MaterialBehavior;
    let _instanceExtraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _sizeAttenuation_decorators;
    let _sizeAttenuation_initializers = [];
    let _pointSize_decorators;
    let _pointSize_initializers = [];
    var PointsMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _texture_decorators = [stringAttribute, receiver];
            _sizeAttenuation_decorators = [booleanAttribute, receiver];
            _pointSize_decorators = [numberAttribute, receiver];
            __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _sizeAttenuation_decorators, { kind: "field", name: "sizeAttenuation", static: false, private: false, access: { has: obj => "sizeAttenuation" in obj, get: obj => obj.sizeAttenuation, set: (obj, value) => { obj.sizeAttenuation = value; } }, metadata: _metadata }, _sizeAttenuation_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _pointSize_decorators, { kind: "field", name: "pointSize", static: false, private: false, access: { has: obj => "pointSize" in obj, get: obj => obj.pointSize, set: (obj, value) => { obj.pointSize = value; } }, metadata: _metadata }, _pointSize_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PointsMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        texture = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _texture_initializers, ''));
        sizeAttenuation = __runInitializers(this, _sizeAttenuation_initializers, true);
        pointSize = __runInitializers(this, _pointSize_initializers, 1);
        _createComponent() {
            return new PointsMaterial({ color: 0x00ff00 });
        }
        loadGL() {
            super.loadGL();
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                mat.sizeAttenuation = this.sizeAttenuation;
                mat.size = this.pointSize;
                this.element.needsUpdate();
            });
            this._handleTexture(() => this.texture, (mat, tex) => (mat.map = tex), mat => !!mat.map, () => { }, true);
        }
    };
    return PointsMaterialBehavior = _classThis;
})();
export { PointsMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('points-material'))
    elementBehaviors.define('points-material', PointsMaterialBehavior);
//# sourceMappingURL=PointsMaterialBehavior.js.map