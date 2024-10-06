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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { onCleanup, untrack } from 'solid-js';
import { Effects, reactive, signal } from 'classy-solid';
import { Motor } from '../core/Motor.js';
import { clamp } from '../math/clamp.js';
import { Settable } from '../utils/Settable.js';
let PinchFling = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Settable(Effects);
    let _x_decorators;
    let _x_initializers = [];
    let _x_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _hasInteracted_decorators;
    let _hasInteracted_initializers = [];
    let _hasInteracted_extraInitializers = [];
    let _private_interacting_decorators;
    let _private_interacting_initializers = [];
    let _private_interacting_extraInitializers = [];
    let _private_interacting_descriptor;
    let _private_isStarted_decorators;
    let _private_isStarted_initializers = [];
    let _private_isStarted_extraInitializers = [];
    let _private_isStarted_descriptor;
    var PinchFling = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _x_decorators = [signal];
            _target_decorators = [signal];
            _hasInteracted_decorators = [signal];
            _private_interacting_decorators = [signal];
            _private_isStarted_decorators = [signal];
            __esDecorate(this, _private_interacting_descriptor = { get: __setFunctionName(function () { return this.#interacting_accessor_storage; }, "#interacting", "get"), set: __setFunctionName(function (value) { this.#interacting_accessor_storage = value; }, "#interacting", "set") }, _private_interacting_decorators, { kind: "accessor", name: "#interacting", static: false, private: true, access: { has: obj => #interacting in obj, get: obj => obj.#interacting, set: (obj, value) => { obj.#interacting = value; } }, metadata: _metadata }, _private_interacting_initializers, _private_interacting_extraInitializers);
            __esDecorate(this, _private_isStarted_descriptor = { get: __setFunctionName(function () { return this.#isStarted_accessor_storage; }, "#isStarted", "get"), set: __setFunctionName(function (value) { this.#isStarted_accessor_storage = value; }, "#isStarted", "set") }, _private_isStarted_decorators, { kind: "accessor", name: "#isStarted", static: false, private: true, access: { has: obj => #isStarted in obj, get: obj => obj.#isStarted, set: (obj, value) => { obj.#isStarted = value; } }, metadata: _metadata }, _private_isStarted_initializers, _private_isStarted_extraInitializers);
            __esDecorate(null, null, _x_decorators, { kind: "field", name: "x", static: false, private: false, access: { has: obj => "x" in obj, get: obj => obj.x, set: (obj, value) => { obj.x = value; } }, metadata: _metadata }, _x_initializers, _x_extraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(null, null, _hasInteracted_decorators, { kind: "field", name: "hasInteracted", static: false, private: false, access: { has: obj => "hasInteracted" in obj, get: obj => obj.hasInteracted, set: (obj, value) => { obj.hasInteracted = value; } }, metadata: _metadata }, _hasInteracted_initializers, _hasInteracted_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PinchFling = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * During pinch, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value.
         */
        x = __runInitializers(this, _x_initializers, 0);
        minX = (__runInitializers(this, _x_extraInitializers), -Infinity);
        maxX = Infinity;
        target = __runInitializers(this, _target_initializers, document.documentElement);
        sensitivity = (__runInitializers(this, _target_extraInitializers), 1);
        hasInteracted = __runInitializers(this, _hasInteracted_initializers, false);
        epsilon = (__runInitializers(this, _hasInteracted_extraInitializers), 0.01);
        /**
         * Portion of the change in value that is removed each frame to
         * cause slowdown. Between 0 and 1.
         */
        slowdownAmount = 0.05;
        #task;
        #interacting_accessor_storage = __runInitializers(this, _private_interacting_initializers, false);
        get #interacting() { return _private_interacting_descriptor.get.call(this); }
        set #interacting(value) { return _private_interacting_descriptor.set.call(this, value); }
        get interacting() {
            return this.#interacting;
        }
        #isStarted_accessor_storage = (__runInitializers(this, _private_interacting_extraInitializers), __runInitializers(this, _private_isStarted_initializers, false));
        get #isStarted() { return _private_isStarted_descriptor.get.call(this); }
        set #isStarted(value) { return _private_isStarted_descriptor.set.call(this, value); }
        get isStarted() {
            return this.#isStarted;
        }
        #aborter = (__runInitializers(this, _private_isStarted_extraInitializers), new AbortController());
        #onPinch = (dx) => {
            this.hasInteracted = true;
            dx = dx * this.sensitivity;
            this.x = clamp(this.x + dx, this.minX, this.maxX);
            if (dx === 0)
                return;
            if (this.#task)
                Motor.removeRenderTask(this.#task);
            // slow the rotation down based on former drag speed
            this.#task = Motor.addRenderTask((_t, dt) => {
                const fpsRatio = dt / 16.6666;
                // Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
                dx *= 1 - fpsRatio * this.slowdownAmount;
                this.x = clamp(this.x + dx, this.minX, this.maxX);
                // Stop the rotation update loop once the deltas are small enough
                // that we no longer notice a change.
                if (Math.abs(dx) < this.epsilon)
                    return false;
            });
        };
        #pointers = new Map();
        #onDown = (event) => {
            event.clientX;
            this.#pointers.set(event.pointerId, {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
            });
            if (this.#pointers.size === 2) {
                // go two fingers
                // @ts-expect-error TypeScript type for `event` is wrong
                this.target.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
                this.#interacting = true;
            }
        };
        #lastDistance = -1;
        #onMove = (event) => {
            if (!this.#pointers.has(event.pointerId))
                return;
            if (this.#pointers.size < 2)
                return;
            const [one, two] = this.#pointers.values();
            if (!one || !two)
                throw 'not possible';
            if (event.pointerId === one.id) {
                one.x = event.clientX;
                one.y = event.clientY;
            }
            else {
                two.x = event.clientX;
                two.y = event.clientY;
            }
            const distance = Math.abs(Math.sqrt((two.x - one.x) ** 2 + (two.y - one.y) ** 2));
            if (this.#lastDistance === -1)
                this.#lastDistance = distance;
            const dx = this.#lastDistance - distance;
            this.#onPinch(dx);
            this.#lastDistance = distance;
        };
        #onUp = (event) => {
            if (!this.#pointers.has(event.pointerId))
                return;
            this.#pointers.delete(event.pointerId);
            this.#lastDistance = -1;
            if (this.#pointers.size === 1) {
                // @ts-expect-error TypeScript type for `event` is wrong
                this.target.removeEventListener('pointermove', this.#onMove);
                this.#interacting = false;
            }
        };
        start() {
            if (untrack(() => this.#isStarted))
                return this;
            this.#isStarted = true;
            this.createEffect(() => {
                this.target; // any time the target changes make new events on that target
                this.#aborter = new AbortController();
                // @ts-expect-error, whyyyyy TypeScript
                this.target.addEventListener('pointerdown', this.#onDown, { signal: this.#aborter.signal });
                // @ts-expect-error, whyyyyy TypeScript
                this.target.addEventListener('pointerup', this.#onUp, { signal: this.#aborter.signal });
                onCleanup(() => {
                    // Stop any current animation, if any.
                    if (this.#task)
                        Motor.removeRenderTask(this.#task);
                    this.#aborter.abort();
                    this.#interacting = false;
                });
            });
            return this;
        }
        stop() {
            if (!untrack(() => this.#isStarted))
                return this;
            this.#isStarted = false;
            this.stopEffects();
            return this;
        }
    };
    return PinchFling = _classThis;
})();
export { PinchFling };
//# sourceMappingURL=PinchFling.js.map