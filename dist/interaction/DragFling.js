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
import { Settable } from '../utils/Settable.js';
import { clamp } from '../math/clamp.js';
let DragFling = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Settable(Effects);
    let _instanceExtraInitializers = [];
    let __x_decorators;
    let __x_initializers = [];
    let __y_decorators;
    let __y_initializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _pointerTypes_decorators;
    let _pointerTypes_initializers = [];
    var DragFling = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __x_decorators = [signal];
            __y_decorators = [signal];
            _target_decorators = [signal];
            _pointerTypes_decorators = [signal];
            __esDecorate(null, null, __x_decorators, { kind: "field", name: "_x", static: false, private: false, access: { has: obj => "_x" in obj, get: obj => obj._x, set: (obj, value) => { obj._x = value; } }, metadata: _metadata }, __x_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __y_decorators, { kind: "field", name: "_y", static: false, private: false, access: { has: obj => "_y" in obj, get: obj => obj._y, set: (obj, value) => { obj._y = value; } }, metadata: _metadata }, __y_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _pointerTypes_decorators, { kind: "field", name: "pointerTypes", static: false, private: false, access: { has: obj => "pointerTypes" in obj, get: obj => obj.pointerTypes, set: (obj, value) => { obj.pointerTypes = value; } }, metadata: _metadata }, _pointerTypes_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DragFling = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        _x = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __x_initializers, 0
        /**
         * During drag, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value.
         */
        ));
        /**
         * During drag, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value.
         */
        get x() {
            return this._x;
        }
        set x(val) {
            this.#stopAnimation();
            this._x = val;
        }
        _y = __runInitializers(this, __y_initializers, 0
        /**
         * During drag, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value.
         */
        );
        /**
         * During drag, this value will change. It is a signal so that it can be
         * observed. Set this value initially if you want to start at a certain
         * value.
         */
        get y() {
            return this._y;
        }
        set y(val) {
            this.#stopAnimation();
            this._y = val;
        }
        minX = -Infinity;
        maxX = Infinity;
        minY = -Infinity;
        maxY = Infinity;
        target = __runInitializers(this, _target_initializers, document.documentElement);
        sensitivity = 1;
        epsilon = 0.01;
        /**
         * Portion of the change in value that is removed each frame to
         * cause slowdown. Between 0 and 1.
         */
        slowdownAmount = 0.05;
        invertY = false;
        invertX = false;
        /**
         * The allowed pointer types to use for dragging ('mouse', 'pen', or
         * 'touch'). Default is all of them.
         */
        pointerTypes = __runInitializers(this, _pointerTypes_initializers, ['mouse', 'pen', 'touch']);
        #task;
        #interacting = (() => {
            const [get, set] = createSignal(false);
            return { get, set };
        })();
        get interacting() {
            return this.#interacting.get();
        }
        #isStarted = (() => {
            const [get, set] = createSignal(false);
            return { get, set };
        })();
        get isStarted() {
            return this.#isStarted.get();
        }
        #aborter = new AbortController();
        #mainPointer = -1;
        #pointerCount = 0;
        // The last X/Y only for a single pointer (the rest are ignored).
        #lastX = 0;
        #lastY = 0;
        #deltaX = 0;
        #deltaY = 0;
        #moveTimestamp = 0;
        #onDown = (event) => {
            // @ts-expect-error event.pointerTypes is just 'string'
            if (!this.pointerTypes.includes(event.pointerType))
                return;
            // When using a mouse, drag only with left button (TODO: make it configurable)
            if (event.pointerType === 'mouse' && event.button !== 0)
                return;
            this.#pointerCount++;
            if (this.#pointerCount === 1)
                this.#mainPointer = event.pointerId;
            else
                return;
            // Capture for mouse only because it can go outside the window, and
            // letting go outside the window will cause pointerup not to be handled.
            // On mobile the pointer doesn't go out of the window, and is basically
            // already captured within the whole display. Plus if we capture on
            // mobile then the tilt card won't tilt, and the links won't be
            // clickable, because capture will prevent pointerdown from happening on
            // the cards.
            if (event.pointerType === 'mouse')
                this.target.setPointerCapture(this.#mainPointer);
            this.#stopAnimation();
            this.#lastX = event.x;
            this.#lastY = event.y;
            this.#deltaX = 0;
            this.#deltaY = 0;
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.target.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
            this.target.addEventListener('pointerup', this.#onUp, { signal: this.#aborter.signal });
            this.#interacting.set(true);
        };
        #onMove = (event) => {
            if (event.pointerId !== this.#mainPointer)
                return;
            this.#moveTimestamp = performance.now();
            // We're not simply using event.movementX and event.movementY
            // because of a Safari bug:
            // https://bugs.webkit.org/show_bug.cgi?id=248119
            const movementX = event.x - this.#lastX;
            const movementY = event.y - this.#lastY;
            this.#lastX = event.x;
            this.#lastY = event.y;
            this.#deltaX = movementX * this.sensitivity * (this.invertX ? -1 : 1);
            this._x = clamp(this._x + this.#deltaX, this.minX, this.maxX);
            this.#deltaY = movementY * this.sensitivity * (this.invertY ? -1 : 1);
            this._y = clamp(this._y + this.#deltaY, this.minY, this.maxY);
        };
        #onUp = () => {
            this.#pointerCount--;
            if (this.#pointerCount === 0) {
                if (this.target.hasPointerCapture(this.#mainPointer))
                    this.target.releasePointerCapture(this.#mainPointer);
                this.#mainPointer = -1;
                this.target.removeEventListener('pointerup', this.#onUp);
            }
            // stop dragging
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.target.removeEventListener('pointermove', this.#onMove);
            this.#interacting.set(false);
            if ((this.#deltaX === 0 && this.#deltaY === 0) || performance.now() - this.#moveTimestamp > 100)
                return;
            // slow the rotation down based on former drag speed
            Motor.addRenderTask((_t, dt) => {
                const fpsRatio = dt / 16.6666;
                // Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
                this.#deltaX *= 1 - fpsRatio * this.slowdownAmount;
                this.#deltaY *= 1 - fpsRatio * this.slowdownAmount;
                // stop rotation once the delta is small enough that we
                // no longer notice the rotation.
                if (Math.abs(this.#deltaX) < this.epsilon && Math.abs(this.#deltaY) < this.epsilon)
                    return false;
                this._x = clamp(this._x + this.#deltaX, this.minX, this.maxX);
                this._y = clamp(this._y + this.#deltaY, this.minY, this.maxY);
                return;
            });
        };
        #onDragStart = (event) => event.preventDefault();
        start() {
            if (untrack(this.#isStarted.get))
                return this;
            this.#isStarted.set(true);
            this.createEffect(() => {
                // any time the these change restart event handling
                this.target;
                this.pointerTypes;
                this.#aborter = new AbortController();
                // any time the target changes make new events on that target
                // @ts-expect-error, whyyyy TypeScript TODO fix TypeScript lib.dom types.
                this.target.addEventListener('pointerdown', this.#onDown, { signal: this.#aborter.signal });
                // Hack needed for Chrome (works fine in Firefox) otherwise
                // pointercancel breaks the drag handling. See
                // https://crbug.com/1166044
                // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
                this.target.addEventListener('dragstart', this.#onDragStart, { signal: this.#aborter.signal });
                this.target.addEventListener('pointercancel', () => {
                    console.error('Pointercancel should not be happening. If so, please kindly open an issue at https://github.com/lume/lume/issues.');
                }, { signal: this.#aborter.signal });
                onCleanup(() => {
                    this.#mainPointer = -1;
                    this.#pointerCount = 0;
                    this.#stopAnimation();
                    this.#aborter.abort();
                    this.#interacting.set(false);
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
            if (this.#task)
                Motor.removeRenderTask(this.#task);
        }
    };
    return DragFling = _classThis;
})();
export { DragFling };
//# sourceMappingURL=DragFling.js.map