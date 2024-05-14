// TODO FlingRotation's interaction and tree structure are horribly coupled.
// Instead we can implement DragFling, similar to ScrollFling and PinchFling,
// and use that for rotation. Then if we even keep FlingRotation, we can just
// have it accept a single element to rotate, and it would apply DragFling (or
// whichever fling is provided, easy to compose things).
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
import { Effects, reactive, signal } from 'classy-solid';
import { onCleanup } from 'solid-js';
import { clamp } from '../math/clamp.js';
let FlingRotation = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Effects;
    let _instanceExtraInitializers = [];
    let _rotationYTarget_decorators;
    let _rotationYTarget_initializers = [];
    let _rotationXTarget_decorators;
    let _rotationXTarget_initializers = [];
    let _interactionInitiator_decorators;
    let _interactionInitiator_initializers = [];
    let _interactionContainer_decorators;
    let _interactionContainer_initializers = [];
    var FlingRotation = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _rotationYTarget_decorators = [signal];
            _rotationXTarget_decorators = [signal];
            _interactionInitiator_decorators = [signal];
            _interactionContainer_decorators = [signal];
            __esDecorate(null, null, _rotationYTarget_decorators, { kind: "field", name: "rotationYTarget", static: false, private: false, access: { has: obj => "rotationYTarget" in obj, get: obj => obj.rotationYTarget, set: (obj, value) => { obj.rotationYTarget = value; } }, metadata: _metadata }, _rotationYTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _rotationXTarget_decorators, { kind: "field", name: "rotationXTarget", static: false, private: false, access: { has: obj => "rotationXTarget" in obj, get: obj => obj.rotationXTarget, set: (obj, value) => { obj.rotationXTarget = value; } }, metadata: _metadata }, _rotationXTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _interactionInitiator_decorators, { kind: "field", name: "interactionInitiator", static: false, private: false, access: { has: obj => "interactionInitiator" in obj, get: obj => obj.interactionInitiator, set: (obj, value) => { obj.interactionInitiator = value; } }, metadata: _metadata }, _interactionInitiator_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _interactionContainer_decorators, { kind: "field", name: "interactionContainer", static: false, private: false, access: { has: obj => "interactionContainer" in obj, get: obj => obj.interactionContainer, set: (obj, value) => { obj.interactionContainer = value; } }, metadata: _metadata }, _interactionContainer_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FlingRotation = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** The object that will be rotated on Y. Required. */
        rotationYTarget = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _rotationYTarget_initializers, void 0));
        /**
         * The object that will be rotated on X. Defaults to the element inside the
         * rotationYTarget (it's like a gimball).
         */
        rotationXTarget = __runInitializers(this, _rotationXTarget_initializers, void 0);
        /**
         * The element on which the pointer should be placed down on in order to
         * initiate drag tracking. This defaults to rotationXTarget.
         */
        interactionInitiator = __runInitializers(this, _interactionInitiator_initializers, void 0);
        /**
         * The area in which drag tacking will happen. Defaults to
         * document.documentElement for tracking in the whole viewport.
         */
        // TODO we only need the initiator (just call it target) and we can remove
        // this in favor of pointer capture.
        interactionContainer = __runInitializers(this, _interactionContainer_initializers, document.documentElement
        /**
         * The X rotation can not go below this value. Defaults to -90 which means
         * facing straight up.
         */
        );
        /**
         * The X rotation can not go below this value. Defaults to -90 which means
         * facing straight up.
         */
        minFlingRotationX = -90;
        /**
         * The X rotation can not go above this value. Defaults to 90 which means
         * facing straight down.
         */
        maxFlingRotationX = 90;
        /**
         * The Y rotation can not go below this value. Defaults to -Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        minFlingRotationY = -Infinity;
        /**
         * The Y rotation can not go below this value. Defaults to Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        maxFlingRotationY = Infinity;
        factor = 1;
        #aborter = new AbortController();
        constructor(options = {}) {
            super();
            Object.assign(this, options);
        }
        #mainPointer = -1;
        #pointerCount = 0;
        // The last X/Y only for a single pointer (the rest are ignored).
        #lastX = 0;
        #lastY = 0;
        #deltaX = 0;
        #deltaY = 0;
        #moveTimestamp = 0;
        #onPointerDown = (event) => {
            this.#pointerCount++;
            if (this.#pointerCount === 1)
                this.#mainPointer = event.pointerId;
            else
                return;
            this.interactionContainer.setPointerCapture(this.#mainPointer);
            // Stop rotation if any.
            this.rotationXTarget.rotation = () => false;
            this.rotationYTarget.rotation = () => false;
            this.#lastX = event.x;
            this.#lastY = event.y;
            this.#deltaX = 0;
            this.#deltaY = 0;
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
            this.interactionContainer.addEventListener('pointerup', this.#onPointerUp, { signal: this.#aborter.signal });
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
            this.#deltaX = movementY * 0.15 * this.factor;
            this.rotationXTarget.rotation.x = clamp(this.rotationXTarget.rotation.x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX);
            this.#deltaY = -movementX * 0.15 * this.factor;
            this.rotationYTarget.rotation.y = clamp(this.rotationYTarget.rotation.y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY);
        };
        #onPointerUp = () => {
            this.#pointerCount--;
            if (this.#pointerCount === 0) {
                if (this.interactionContainer.hasPointerCapture(this.#mainPointer))
                    this.interactionContainer.releasePointerCapture(this.#mainPointer);
                this.#mainPointer = -1;
                this.interactionContainer.removeEventListener('pointerup', this.#onPointerUp);
            }
            // stop dragging
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointermove', this.#onMove);
            if ((this.#deltaX === 0 && this.#deltaY === 0) || performance.now() - this.#moveTimestamp > 100)
                return;
            // slow the rotation down based on former drag speed
            this.rotationXTarget.rotation = (x, y, z) => {
                this.#deltaX = this.#deltaX * 0.95;
                // stop rotation once the delta is small enough that we
                // no longer notice the rotation.
                if (Math.abs(this.#deltaX) < 0.01)
                    return false;
                return [clamp(x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z];
            };
            this.rotationYTarget.rotation = (x, y, z) => {
                this.#deltaY = this.#deltaY * 0.95;
                // stop rotation once the delta is small enough that we
                // no longer notice the rotation.
                if (Math.abs(this.#deltaY) < 0.01)
                    return false;
                return [x, clamp(y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY), z];
            };
        };
        #onDragStart = (event) => event.preventDefault();
        #isStarted = false;
        start() {
            if (this.#isStarted)
                return this;
            this.#isStarted = true;
            this.createEffect(() => {
                // We need all these things for interaction to continue.
                if (!(this.rotationYTarget && this.rotationXTarget && this.interactionInitiator && this.interactionContainer))
                    return;
                this.#aborter = new AbortController();
                // @ts-expect-error, whyyyy TypeScript TODO fix TypeScript lib.dom types.
                this.interactionInitiator.addEventListener('pointerdown', this.#onPointerDown, { signal: this.#aborter.signal });
                // Hack needed for Chrome (works fine in Firefox) otherwise
                // pointercancel breaks the drag handling. See
                // https://crbug.com/1166044
                // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
                this.interactionInitiator.addEventListener('dragstart', this.#onDragStart, { signal: this.#aborter.signal });
                this.interactionInitiator.addEventListener('pointercancel', () => {
                    console.error('Pointercancel should not be happening. If so, please kindly open an issue at https://github.com/lume/lume/issues.');
                }, { signal: this.#aborter.signal });
                onCleanup(() => {
                    this.#mainPointer = -1;
                    this.#pointerCount = 0;
                    // Stop any current animation.
                    this.rotationXTarget.rotation = () => false;
                    this.rotationYTarget.rotation = () => false;
                    this.#aborter.abort();
                });
            });
            return this;
        }
        stop() {
            if (!this.#isStarted)
                return this;
            this.#isStarted = false;
            this.stopEffects();
            return this;
        }
    };
    return FlingRotation = _classThis;
})();
export { FlingRotation };
//# sourceMappingURL=FlingRotation.js.map