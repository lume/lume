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
import { createSignal, onCleanup, untrack } from 'solid-js';
import { Effects, reactive, signal } from 'classy-solid';
import { Motor } from '../core/Motor.js';
import { clamp } from '../math/clamp.js';
// @ts-ignore
window.debug = true;
let ScrollFling = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Effects;
    let _instanceExtraInitializers = [];
    let __x_decorators;
    let __x_initializers = [];
    let __y_decorators;
    let __y_initializers = [];
    let _hasInteracted_decorators;
    let _hasInteracted_initializers = [];
    var ScrollFling = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __x_decorators = [signal];
            __y_decorators = [signal];
            _hasInteracted_decorators = [signal];
            __esDecorate(null, null, __x_decorators, { kind: "field", name: "_x", static: false, private: false, access: { has: obj => "_x" in obj, get: obj => obj._x, set: (obj, value) => { obj._x = value; } }, metadata: _metadata }, __x_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __y_decorators, { kind: "field", name: "_y", static: false, private: false, access: { has: obj => "_y" in obj, get: obj => obj._y, set: (obj, value) => { obj._y = value; } }, metadata: _metadata }, __y_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _hasInteracted_decorators, { kind: "field", name: "hasInteracted", static: false, private: false, access: { has: obj => "hasInteracted" in obj, get: obj => obj.hasInteracted, set: (obj, value) => { obj.hasInteracted = value; } }, metadata: _metadata }, _hasInteracted_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ScrollFling = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        _x = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __x_initializers, 0
        /**
         * During scroll, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value. Setting the value immediately stops any smoothing animation.
         */
        ));
        /**
         * During scroll, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value. Setting the value immediately stops any smoothing animation.
         */
        get x() {
            return this._x;
        }
        set x(val) {
            this.#stopAnimation();
            this._x = val;
            this.#targetX = val;
        }
        _y = __runInitializers(this, __y_initializers, 0
        /**
         * During scroll, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value. Setting the value immediately stops any smoothing animation.
         */
        );
        /**
         * During scroll, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value. Setting the value immediately stops any smoothing animation.
         */
        get y() {
            return this._y;
        }
        set y(val) {
            this.#stopAnimation();
            this._y = val;
            this.#targetY = val;
        }
        minX = -Infinity;
        maxX = Infinity;
        minY = -Infinity;
        maxY = Infinity;
        target = document.documentElement;
        sensitivity = 1;
        hasInteracted = __runInitializers(this, _hasInteracted_initializers, false);
        epsilon = 0.01;
        /**
         * The portion to lerp towards the target values each frame. Between 0 and 1.
         */
        lerpAmount = 0.3;
        #targetX = 0;
        #targetY = 0;
        #task;
        #isStarted = (() => {
            const { 0: get, 1: set } = createSignal(false);
            return { get, set };
        })();
        get isStarted() {
            return this.#isStarted.get();
        }
        #aborter = new AbortController();
        constructor(options = {}) {
            super();
            Object.assign(this, options);
            this.#targetX = this._x;
            this.#targetY = this._y;
        }
        #onWheel = (event) => {
            this.hasInteracted = true;
            event.preventDefault();
            const dx = event.deltaX * this.sensitivity;
            const dy = event.deltaY * this.sensitivity;
            this.#targetX = clamp(this.#targetX + dx, this.minX, this.maxX);
            this.#targetY = clamp(this.#targetY + dy, this.minY, this.maxY);
            this.#stopAnimation();
            // lerp towards the target values
            this.#task = Motor.addRenderTask((_t, dt) => {
                const dx = this.#targetX - this._x;
                const dy = this.#targetY - this._y;
                const fpsRatio = dt / 16.6666;
                // Multiply by fpsRatio so that the lerpAmount is consistent over time no matter the fps.
                this._x += dx * fpsRatio * this.lerpAmount;
                this._y += dy * fpsRatio * this.lerpAmount;
                // Stop the fling update loop once the deltas are small enough
                // that we no longer notice a change.
                if (Math.abs(dx) < this.epsilon && Math.abs(dy) < this.epsilon)
                    return false;
            });
        };
        start() {
            if (untrack(this.#isStarted.get))
                return this;
            this.#isStarted.set(true);
            this.createEffect(() => {
                this.target; // any time the target changes make new events on that target
                this.#aborter = new AbortController();
                // @ts-expect-error, whyyyyy TypeScript
                this.target.addEventListener('wheel', this.#onWheel, { signal: this.#aborter.signal });
                onCleanup(() => {
                    this.#stopAnimation();
                    this.#aborter.abort();
                });
            });
            return this;
        }
        stop() {
            if (!untrack(this.#isStarted.get))
                return this;
            this.#isStarted.set(false);
            this.stopEffects();
            return this;
        }
        #stopAnimation() {
            // Stop any current animation, if any.
            if (this.#task)
                Motor.removeRenderTask(this.#task);
        }
    };
    return ScrollFling = _classThis;
})();
export { ScrollFling };
// @ts-ignore
window.debug = false;
//# sourceMappingURL=ScrollFling.js.map