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
import { untrack } from 'solid-js';
import { attribute, stringAttribute } from '@lume/element';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
// @ts-ignore, no type def
import default_vertex from 'three/src/renderers/shaders/ShaderChunk/default_vertex.glsl.js';
// @ts-ignore, no type def
import default_fragment from 'three/src/renderers/shaders/ShaderChunk/default_fragment.glsl.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { MaterialBehavior } from './MaterialBehavior.js';
let ShaderMaterialBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MaterialBehavior;
    let _instanceExtraInitializers = [];
    let _get_uniforms_decorators;
    let _vertexShader_decorators;
    let _vertexShader_initializers = [];
    let _fragmentShader_decorators;
    let _fragmentShader_initializers = [];
    var ShaderMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_uniforms_decorators = [attribute, receiver];
            _vertexShader_decorators = [stringAttribute, receiver];
            _fragmentShader_decorators = [stringAttribute, receiver];
            __esDecorate(this, null, _get_uniforms_decorators, { kind: "getter", name: "uniforms", static: false, private: false, access: { has: obj => "uniforms" in obj, get: obj => obj.uniforms }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _vertexShader_decorators, { kind: "field", name: "vertexShader", static: false, private: false, access: { has: obj => "vertexShader" in obj, get: obj => obj.vertexShader, set: (obj, value) => { obj.vertexShader = value; } }, metadata: _metadata }, _vertexShader_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fragmentShader_decorators, { kind: "field", name: "fragmentShader", static: false, private: false, access: { has: obj => "fragmentShader" in obj, get: obj => obj.fragmentShader, set: (obj, value) => { obj.fragmentShader = value; } }, metadata: _metadata }, _fragmentShader_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ShaderMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // TODO: Perhaps instead of accepting string objects for HTML attributes,
        // we can create specific uniform-foo attributes for each uniform, and have
        // specific data handling and type definitions for each one. This would
        // make it easier to animate particular uniforms instead of replacing the
        // whole object each time.
        get uniforms() {
            return this.#uniforms;
        }
        set uniforms(u) {
            console.log('set uniforms', this.element.tagName, this.element.id, u);
            if (!u) {
                this.#uniforms = {};
                return;
            }
            if (typeof u === 'string') {
                try {
                    this.#uniforms = JSON.parse(u);
                }
                catch (e) {
                    console.warn('Unparsable uniform value:', u);
                }
            }
            else {
                this.#uniforms = u;
            }
        }
        #uniforms = (__runInitializers(this, _instanceExtraInitializers), {});
        attributeChangedCallback(name, oldVal, newVal) {
            console.log('attribute changed:', name, oldVal, newVal);
            super.attributeChangedCallback?.(name, oldVal, newVal);
        }
        vertexShader = __runInitializers(this, _vertexShader_initializers, default_vertex);
        fragmentShader = __runInitializers(this, _fragmentShader_initializers, default_fragment);
        _createComponent() {
            // untrack because we update the properties on the material instance in the effect in loadGL
            return untrack(() => {
                return new ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: this.vertexShader,
                    fragmentShader: this.fragmentShader,
                });
            });
        }
        loadGL() {
            this.createEffect(() => {
                const mat = this.meshComponent;
                if (!mat)
                    return;
                console.log('uniforms:', this.uniforms);
                mat.uniforms = this.uniforms;
                mat.vertexShader = this.vertexShader || default_vertex;
                mat.fragmentShader = this.fragmentShader || default_fragment;
                mat.needsUpdate = true;
                this.element.needsUpdate();
            });
            super.loadGL();
        }
    };
    return ShaderMaterialBehavior = _classThis;
})();
export { ShaderMaterialBehavior };
if (globalThis.window?.document && !elementBehaviors.has('shader-material'))
    elementBehaviors.define('shader-material', ShaderMaterialBehavior);
//# sourceMappingURL=ShaderMaterialBehavior.js.map