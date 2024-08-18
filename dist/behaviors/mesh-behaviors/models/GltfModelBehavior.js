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
import { createEffect, createMemo, onCleanup, untrack } from 'solid-js';
import { attribute, booleanAttribute, stringAttribute } from '@lume/element';
import { Scene } from 'three/src/scenes/Scene.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3 } from 'three/src/math/Box3.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { disposeObjectTree } from '../../../utils/three.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { Events } from '../../../core/Events.js';
import { ModelBehavior } from './ModelBehavior.js';
import { LoadEvent } from '../../../models/LoadEvent.js';
import { GltfModel } from '../../../models/GltfModel.js';
import { ErrorEvent, normalizeError } from '../../../models/ErrorEvent.js';
/**
 * The recommended CDN for retrieving Draco decoder files.
 * More info: https://github.com/google/draco#wasm-and-javascript-decoders
 */
const defaultDracoDecoder = 'https://www.gstatic.com/draco/v1/decoders/';
/** One DRACOLoader per draco decoder URL. */
let dracoLoaders = new Map();
/**
 * A behavior containing the logic that loads glTF models for `<lume-gltf-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-gltf-model>` element.
 * @extends ModelBehavior
 */
let GltfModelBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = ModelBehavior;
    let _instanceExtraInitializers = [];
    let _src_decorators;
    let _src_initializers = [];
    let _dracoDecoder_decorators;
    let _dracoDecoder_initializers = [];
    let _centerGeometry_decorators;
    let _centerGeometry_initializers = [];
    var GltfModelBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [attribute, receiver];
            _dracoDecoder_decorators = [stringAttribute, receiver];
            _centerGeometry_decorators = [booleanAttribute, receiver];
            __esDecorate(null, null, _src_decorators, { kind: "field", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _dracoDecoder_decorators, { kind: "field", name: "dracoDecoder", static: false, private: false, access: { has: obj => "dracoDecoder" in obj, get: obj => obj.dracoDecoder, set: (obj, value) => { obj.dracoDecoder = value; } }, metadata: _metadata }, _dracoDecoder_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _centerGeometry_decorators, { kind: "field", name: "centerGeometry", static: false, private: false, access: { has: obj => "centerGeometry" in obj, get: obj => obj.centerGeometry, set: (obj, value) => { obj.centerGeometry = value; } }, metadata: _metadata }, _centerGeometry_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GltfModelBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** @property {string | null} src - Path to a `.gltf` or `.glb` file. */
        src = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _src_initializers, ''
        /**
         * @property {string | null} dracoDecoder -
         *
         * `attribute`
         *
         * Path to the draco decoder that
         * will unpack decode compressed assets of the GLTF file. This does not need
         * to be supplied unless you explicitly know you need it.
         */
        ));
        /**
         * @property {string | null} dracoDecoder -
         *
         * `attribute`
         *
         * Path to the draco decoder that
         * will unpack decode compressed assets of the GLTF file. This does not need
         * to be supplied unless you explicitly know you need it.
         */
        dracoDecoder = __runInitializers(this, _dracoDecoder_initializers, defaultDracoDecoder
        /**
         * @property {boolean} centerGeometry -
         *
         * `attribute`
         *
         * When `true`, all geometry of the
         * loaded model will be centered at the local origin.
         *
         * Note, changing this value at runtime is expensive because the whole model
         * will be re-created. We improve this by tracking the initial center
         * position to revert to when centerGeometry goes back to `false` (PRs
         * welcome!).
         */
        );
        /**
         * @property {boolean} centerGeometry -
         *
         * `attribute`
         *
         * When `true`, all geometry of the
         * loaded model will be centered at the local origin.
         *
         * Note, changing this value at runtime is expensive because the whole model
         * will be re-created. We improve this by tracking the initial center
         * position to revert to when centerGeometry goes back to `false` (PRs
         * welcome!).
         */
        centerGeometry = __runInitializers(this, _centerGeometry_initializers, false);
        loader = new GLTFLoader();
        requiredElementType() {
            return [GltfModel];
        }
        // This is incremented any time we need to cancel a pending load() (f.e. on
        // src change, or on disconnect), so that the loader will ignore the
        // result when a version change has happened.
        #version = 0;
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const decoderPath = createMemo(() => this.dracoDecoder);
                createEffect(() => {
                    if (!decoderPath())
                        return;
                    const dracoLoader = getDracoLoader(decoderPath());
                    this.loader.dracoLoader = dracoLoader;
                    onCleanup(() => {
                        disposeDracoLoader(decoderPath());
                        this.loader.dracoLoader = null;
                    });
                });
                // Use memos to avoid effect re-runs triggered by same-value
                // changes, or else models may be loaded multiple times (expensive).
                const gltfPath = createMemo(() => this.src);
                const center = createMemo(() => this.centerGeometry);
                createEffect(() => {
                    gltfPath();
                    decoderPath();
                    center();
                    untrack(() => this.#loadModel());
                    onCleanup(() => {
                        if (this.element.threeModel)
                            disposeObjectTree(this.element.threeModel.scene);
                        this.model = null;
                        this.element.threeModel = null;
                        // Increment this in case the loader is still loading, so it will ignore the result.
                        this.#version++;
                    });
                });
            });
        }
        #loadModel() {
            const { src } = this;
            const version = this.#version;
            if (!src)
                return;
            // In the following gltfLoader.load() callbacks, if #version doesn't
            // match, it means this.src or this.dracoDecoder changed while
            // a previous model was loading, in which case we ignore that
            // result and wait for the next model to load.
            this.loader.load(src, model => version == this.#version && this.#setModel(model), progress => version == this.#version &&
                (this.element.emit(Events.PROGRESS, progress), this.element.dispatchEvent(progress)), error => version == this.#version && this.#onError(error));
        }
        #onError(error) {
            const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}" and dracoDecoder "${this.dracoDecoder}". See the following error.`;
            console.warn(message);
            const err = normalizeError(error);
            console.error(err);
            this.element.emit(Events.MODEL_ERROR, err);
            this.element.dispatchEvent(new ErrorEvent(err));
        }
        #setModel(model) {
            model.scene = model.scene || new Scene().add(...model.scenes);
            if (this.centerGeometry) {
                const box = new Box3();
                box.setFromObject(model.scene);
                const center = new Vector3();
                box.getCenter(center);
                model.scene.position.copy(center.negate());
            }
            this.element.three.add(model.scene);
            this.model = model;
            this.element.threeModel = model;
            this.element.emit(Events.MODEL_LOAD, { format: 'gltf', model });
            this.element.dispatchEvent(new LoadEvent());
            this.element.needsUpdate();
        }
    };
    return GltfModelBehavior = _classThis;
})();
export { GltfModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('gltf-model'))
    elementBehaviors.define('gltf-model', GltfModelBehavior);
function getDracoLoader(url) {
    let dracoLoader;
    if (!dracoLoaders.has(url)) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(url);
        dracoLoaders.set(url, { count: 1, dracoLoader });
    }
    else {
        const ref = dracoLoaders.get(url);
        ref.count++;
        dracoLoader = ref.dracoLoader;
    }
    return dracoLoader;
}
function disposeDracoLoader(url) {
    if (!dracoLoaders.has(url))
        return;
    const ref = dracoLoaders.get(url);
    ref.count--;
    if (!ref.count) {
        ref.dracoLoader.dispose();
        dracoLoaders.delete(url);
    }
}
//# sourceMappingURL=GltfModelBehavior.js.map