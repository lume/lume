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
import { stringAttribute } from '@lume/element';
import { onCleanup } from 'solid-js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { disposeObjectTree } from '../../../utils/three.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { Events } from '../../../core/Events.js';
import { RenderableBehavior } from '../../RenderableBehavior.js';
let TdsModelBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderableBehavior;
    let _src_decorators;
    let _src_initializers = [];
    let _src_extraInitializers = [];
    var TdsModelBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [stringAttribute, receiver];
            __esDecorate(null, null, _src_decorators, { kind: "field", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _src_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TdsModelBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** Path to a .3ds file. */
        src = __runInitializers(this, _src_initializers, '');
        loader = (__runInitializers(this, _src_extraInitializers), new TDSLoader());
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
                        disposeObjectTree(this.model);
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
            // In the following loader.load() callbacks, if #version doesn't
            // match, it means this.src or this.dracoDecoder changed while
            // a previous model was loading, in which case we ignore that
            // result and wait for the next model to load.
            this.loader.load(src, model => version === this.#version && this.#setModel(model), progress => version === this.#version && this.element.emit(Events.PROGRESS, progress), error => version === this.#version && this.#onError(error));
        }
        #onError(error) {
            const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}". See the following error.`;
            console.warn(message);
            const err = error instanceof ErrorEvent && error.error ? error.error : error;
            console.error(err);
            this.element.emit(Events.MODEL_ERROR, err);
        }
        #setModel(model) {
            this.model = model;
            this.element.three.add(model);
            this.element.emit(Events.MODEL_LOAD, { format: '3ds', model });
            this.element.needsUpdate();
        }
    };
    return TdsModelBehavior = _classThis;
})();
export { TdsModelBehavior };
if (globalThis.window?.document && !elementBehaviors.has('3ds-model'))
    elementBehaviors.define('3ds-model', TdsModelBehavior);
//# sourceMappingURL=TdsModelBehavior.js.map