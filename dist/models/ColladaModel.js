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
import { element, stringAttribute } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { disposeObjectTree } from '../utils/three.js';
import { Events } from '../core/Events.js';
import { onCleanup } from 'solid-js';
/**
 * @element lume-collada-model
 * @class ColladaModel -
 *
 * Defines the `<lume-collada-model>` element for loading 3D models in the
 * Collada format (`.dae` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-collada-model id="myModel" src="path/to/model.dae"></lume-collada-model>
 * </lume-scene>
 * <script>
 *   myModel.on('MODEL_LOAD', () => console.log('loaded'))
 * </script>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * scene.webgl = true
 * document.body.append(scene)
 * const model = new ColladaModel
 * model.src = 'path/to/model.dae'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 *
 * @extends Element3D
 */
let ColladaModel = (() => {
    let _classDecorators = [element('lume-collada-model', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _src_decorators;
    let _src_initializers = [];
    let _src_extraInitializers = [];
    var ColladaModel = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [stringAttribute];
            __esDecorate(null, null, _src_decorators, { kind: "field", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _src_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ColladaModel = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** Path to a .dae file. */
        src = __runInitializers(this, _src_initializers, '');
        loader = (__runInitializers(this, _src_extraInitializers), new ColladaLoader());
        model;
        // This is incremented any time we need to cancel a pending load() (f.e. on
        // src change, or on disconnect), so that the loader will ignore the
        // result when a version change has happened.
        #version = 0;
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                this.src;
                this.#loadModel();
                onCleanup(() => {
                    if (this.model)
                        disposeObjectTree(this.model.scene);
                    this.model = undefined;
                    // Increment this in case the loader is still loading, so it will ignore the result.
                    this.#version++;
                });
            });
        }
        #loadModel() {
            const { src } = this;
            const version = this.#version;
            if (!src)
                return;
            // In the following colladaLoader.load() callbacks, if version doesn't
            // match, it means this.src or this.dracoDecoder changed while
            // a previous model was loading, in which case we ignore that
            // result and wait for the next model to load.
            this.loader.load(src, model => version === this.#version && this.#setModel(model), progress => version === this.#version && this.emit(Events.PROGRESS, progress), error => version === this.#version && this.#onError(error));
        }
        #onError(error) {
            const message = `Failed to load ${this.tagName.toLowerCase()} with src "${this.src}". See the following error.`;
            console.warn(message);
            const err = error instanceof ErrorEvent && error.error ? error.error : error;
            console.error(err);
            this.emit(Events.MODEL_ERROR, err);
        }
        #setModel(model) {
            this.model = model;
            this.three.add(model.scene);
            this.emit(Events.MODEL_LOAD, { format: 'collada', model });
            this.needsUpdate();
        }
    };
    return ColladaModel = _classThis;
})();
export { ColladaModel };
//# sourceMappingURL=ColladaModel.js.map