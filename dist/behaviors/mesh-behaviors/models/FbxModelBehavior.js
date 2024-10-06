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
import { stringAttribute, booleanAttribute } from '@lume/element';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { createEffect, createMemo, onCleanup, untrack } from 'solid-js';
import { Box3 } from 'three/src/math/Box3.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { disposeObjectTree } from '../../../utils/three/dispose.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { Events } from '../../../core/Events.js';
import { ModelBehavior } from './ModelBehavior.js';
import { LoadEvent } from '../../../models/LoadEvent.js';
import { FbxModel } from '../../../models/FbxModel.js';
import { ErrorEvent, normalizeError } from '../../../models/ErrorEvent.js';
/**
 * A behavior containing the logic that loads FBX models for `<lume-fbx-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-fbx-model>` element.
 * @extends ModelBehavior
 */
let FbxModelBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = ModelBehavior;
    let _src_decorators;
    let _src_initializers = [];
    let _src_extraInitializers = [];
    let _centerGeometry_decorators;
    let _centerGeometry_initializers = [];
    let _centerGeometry_extraInitializers = [];
    var FbxModelBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [stringAttribute, receiver];
            _centerGeometry_decorators = [booleanAttribute, receiver];
            __esDecorate(null, null, _src_decorators, { kind: "field", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _src_extraInitializers);
            __esDecorate(null, null, _centerGeometry_decorators, { kind: "field", name: "centerGeometry", static: false, private: false, access: { has: obj => "centerGeometry" in obj, get: obj => obj.centerGeometry, set: (obj, value) => { obj.centerGeometry = value; } }, metadata: _metadata }, _centerGeometry_initializers, _centerGeometry_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FbxModelBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** Path to a .fbx file. */
        src = __runInitializers(this, _src_initializers, ''
        /**
         * @attribute
         * @property {boolean} centerGeometry - When `true`, all geometry of the
         * loaded model will be centered at the local origin.
         *
         * Note, changing this value at runtime is expensive because the whole model
         * will be re-created. We improve this by tracking the initial center
         * position to revert to when centerGeometry goes back to `false` (PRs
         * welcome!).
         */
        );
        /**
         * @attribute
         * @property {boolean} centerGeometry - When `true`, all geometry of the
         * loaded model will be centered at the local origin.
         *
         * Note, changing this value at runtime is expensive because the whole model
         * will be re-created. We improve this by tracking the initial center
         * position to revert to when centerGeometry goes back to `false` (PRs
         * welcome!).
         */
        centerGeometry = (__runInitializers(this, _src_extraInitializers), __runInitializers(this, _centerGeometry_initializers, false));
        loader = (__runInitializers(this, _centerGeometry_extraInitializers), new FBXLoader());
        requiredElementType() {
            return [FbxModel];
        }
        // This is incremented any time we need to cancel a pending load() (f.e. on
        // src change, or on disconnect), so that the loader will ignore the
        // result when a version change has happened.
        #version = 0;
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                // Using memos here because re-creating models on same-value updates
                // would cost a lot.
                // TODO memoize in other model classes like we do here.
                const src = createMemo(() => this.src); // TODO use @memo from classy-solid
                const center = createMemo(() => this.centerGeometry);
                createEffect(() => {
                    src();
                    center();
                    untrack(() => this.#loadModel());
                    onCleanup(() => {
                        if (this.element.threeModel)
                            disposeObjectTree(this.element.threeModel);
                        this.model = undefined;
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
            // In the following loader.load() callbacks, if #version doesn't
            // match, it means this.src or this.dracoDecoder changed while
            // a previous model was loading, in which case we ignore that
            // result and wait for the next model to load.
            this.loader.load(src, model => version === this.#version && this.#setModel(model), progress => version === this.#version &&
                (this.element.emit(Events.PROGRESS, progress), this.element.dispatchEvent(progress)), error => version === this.#version && this.#onError(error));
        }
        #onError(error) {
            const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}". See the following error.`;
            console.warn(message);
            const err = normalizeError(error);
            console.error(err);
            this.element.emit(Events.MODEL_ERROR, err);
            this.element.dispatchEvent(new ErrorEvent(err));
        }
        #setModel(model) {
            if (this.centerGeometry) {
                const box = new Box3();
                box.setFromObject(model);
                const center = new Vector3();
                box.getCenter(center);
                model.position.copy(center.negate());
            }
            this.element.three.add(model);
            this.model = model;
            this.element.threeModel = model;
            this.element.emit(Events.MODEL_LOAD, { format: 'fbx', model });
            this.element.dispatchEvent(new LoadEvent());
            this.element.needsUpdate();
        }
    };
    return FbxModelBehavior = _classThis;
})();
export { FbxModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('fbx-model'))
    elementBehaviors.define('fbx-model', FbxModelBehavior);
//# sourceMappingURL=FbxModelBehavior.js.map