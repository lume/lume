// TODO FlingRotation's interaction and tree structure are horribly coupled.
// Instead we can implement DragFling, similar to ScrollFling and PinchFling,
// and use that for rotation. Then if we even keep FlingRotation, we can just
// have it accept a single element to rotate, and it would apply DragFling (or
// whichever fling is provided, easy to compose things).
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { effect, Effects, signal } from 'classy-solid';
import { onCleanup, untrack } from 'solid-js';
import { clamp } from '../math/clamp.js';
let FlingRotation = (() => {
    let _classSuper = Effects;
    let _instanceExtraInitializers = [];
    let _rotationYTarget_decorators;
    let _rotationYTarget_initializers = [];
    let _rotationYTarget_extraInitializers = [];
    let _rotationXTarget_decorators;
    let _rotationXTarget_initializers = [];
    let _rotationXTarget_extraInitializers = [];
    let _interactionInitiator_decorators;
    let _interactionInitiator_initializers = [];
    let _interactionInitiator_extraInitializers = [];
    let _interactionContainer_decorators;
    let _interactionContainer_initializers = [];
    let _interactionContainer_extraInitializers = [];
    let _private_isStarted_decorators;
    let _private_isStarted_initializers = [];
    let _private_isStarted_extraInitializers = [];
    let _private_isStarted_descriptor;
    let _flingRotationEffect_decorators;
    let ___init_effects_ignore_decorators;
    let ___init_effects_ignore_initializers = [];
    let ___init_effects_ignore_extraInitializers = [];
    return class FlingRotation extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _rotationYTarget_decorators = [signal];
            _rotationXTarget_decorators = [signal];
            _interactionInitiator_decorators = [signal];
            _interactionContainer_decorators = [signal];
            _private_isStarted_decorators = [signal];
            _flingRotationEffect_decorators = [effect];
            ___init_effects_ignore_decorators = [signal];
            __esDecorate(this, _private_isStarted_descriptor = { get: __setFunctionName(function () { return this.#isStarted_accessor_storage; }, "#isStarted", "get"), set: __setFunctionName(function (value) { this.#isStarted_accessor_storage = value; }, "#isStarted", "set") }, _private_isStarted_decorators, { kind: "accessor", name: "#isStarted", static: false, private: true, access: { has: obj => #isStarted in obj, get: obj => obj.#isStarted, set: (obj, value) => { obj.#isStarted = value; } }, metadata: _metadata }, _private_isStarted_initializers, _private_isStarted_extraInitializers);
            __esDecorate(this, null, _flingRotationEffect_decorators, { kind: "method", name: "flingRotationEffect", static: false, private: false, access: { has: obj => "flingRotationEffect" in obj, get: obj => obj.flingRotationEffect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _rotationYTarget_decorators, { kind: "field", name: "rotationYTarget", static: false, private: false, access: { has: obj => "rotationYTarget" in obj, get: obj => obj.rotationYTarget, set: (obj, value) => { obj.rotationYTarget = value; } }, metadata: _metadata }, _rotationYTarget_initializers, _rotationYTarget_extraInitializers);
            __esDecorate(null, null, _rotationXTarget_decorators, { kind: "field", name: "rotationXTarget", static: false, private: false, access: { has: obj => "rotationXTarget" in obj, get: obj => obj.rotationXTarget, set: (obj, value) => { obj.rotationXTarget = value; } }, metadata: _metadata }, _rotationXTarget_initializers, _rotationXTarget_extraInitializers);
            __esDecorate(null, null, _interactionInitiator_decorators, { kind: "field", name: "interactionInitiator", static: false, private: false, access: { has: obj => "interactionInitiator" in obj, get: obj => obj.interactionInitiator, set: (obj, value) => { obj.interactionInitiator = value; } }, metadata: _metadata }, _interactionInitiator_initializers, _interactionInitiator_extraInitializers);
            __esDecorate(null, null, _interactionContainer_decorators, { kind: "field", name: "interactionContainer", static: false, private: false, access: { has: obj => "interactionContainer" in obj, get: obj => obj.interactionContainer, set: (obj, value) => { obj.interactionContainer = value; } }, metadata: _metadata }, _interactionContainer_initializers, _interactionContainer_extraInitializers);
            __esDecorate(null, null, ___init_effects_ignore_decorators, { kind: "field", name: "__init_effects_ignore", static: false, private: false, access: { has: obj => "__init_effects_ignore" in obj, get: obj => obj.__init_effects_ignore, set: (obj, value) => { obj.__init_effects_ignore = value; } }, metadata: _metadata }, ___init_effects_ignore_initializers, ___init_effects_ignore_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /** The object that will be rotated on Y. Required. */
        rotationYTarget = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _rotationYTarget_initializers, void 0));
        /**
         * The object that will be rotated on X. Defaults to the element inside the
         * rotationYTarget (it's like a gimball).
         */
        rotationXTarget = (__runInitializers(this, _rotationYTarget_extraInitializers), __runInitializers(this, _rotationXTarget_initializers, void 0));
        /**
         * The element on which the pointer should be placed down on in order to
         * initiate drag tracking. This falls back to interactionContainer if not
         * specified.
         */
        interactionInitiator = (__runInitializers(this, _rotationXTarget_extraInitializers), __runInitializers(this, _interactionInitiator_initializers, void 0));
        /**
         * The area in which drag tacking will happen. Defaults to
         * document.documentElement for tracking in the whole viewport.
         */
        // TODO we only need the initiator (just call it target) and we can remove
        // this in favor of pointer capture.
        interactionContainer = (__runInitializers(this, _interactionInitiator_extraInitializers), __runInitializers(this, _interactionContainer_initializers, document.documentElement
        /**
         * The X rotation can not go below this value. Defaults to -90 which means
         * facing straight up.
         */
        ));
        /**
         * The X rotation can not go below this value. Defaults to -90 which means
         * facing straight up.
         */
        minFlingRotationX = (__runInitializers(this, _interactionContainer_extraInitializers), -90);
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
        epsilon = 0.01;
        /**
         * Portion of the change in rotation that is removed each frame to
         * cause slowdown. Between 0 and 1.
         */
        slowdownAmount = 0.05;
        #aborter = new AbortController();
        constructor(options = {}) {
            super();
            __runInitializers(this, ___init_effects_ignore_extraInitializers);
            Object.assign(this, options);
        }
        #firstPointer = -1;
        // The last X/Y only for a single pointer (the rest are ignored).
        #lastX = 0;
        #lastY = 0;
        #deltaX = 0;
        #deltaY = 0;
        #moveTimestamp = 0;
        #isStarted_accessor_storage = __runInitializers(this, _private_isStarted_initializers, false);
        get #isStarted() { return _private_isStarted_descriptor.get.call(this); }
        set #isStarted(value) { return _private_isStarted_descriptor.set.call(this, value); }
        get isStarted() {
            return this.#isStarted;
        }
        #onPointerDown = (__runInitializers(this, _private_isStarted_extraInitializers), (event) => {
            if (this.#firstPointer !== -1)
                return;
            this.#firstPointer = event.pointerId;
            event.preventDefault();
            captureTarget(this.interactionContainer).setPointerCapture(this.#firstPointer);
            this.#stopAnimation();
            this.#lastX = event.x;
            this.#lastY = event.y;
            this.#deltaX = 0;
            this.#deltaY = 0;
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('pointerup', this.#onPointerUp, { signal: this.#aborter.signal });
            // Chrome bug workaround: pointerleave is fired after pointerup
            // normally, after letting go outside the target element and when
            // pointer capture was used. But in Chrome the pointerup event fails to
            // fire if a pointermove happened in the same tick as the pointerup, so
            // we also run onPointerUp in pointerleave to catch the Chrome edge
            // case. https://issues.chromium.org/issues/40919532
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('pointerleave', this.#onPointerUp, { signal: this.#aborter.signal });
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('pointercancel', this.#onInteractionLost, { signal: this.#aborter.signal });
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.addEventListener('lostpointercapture', this.#onPointerUp, { signal: this.#aborter.signal });
        });
        #onMove = (event) => {
            if (this.#firstPointer === -1)
                return;
            if (event.pointerId !== this.#firstPointer)
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
        #onPointerUp = (event) => {
            if (this.#firstPointer === -1)
                return;
            if (event.pointerId !== this.#firstPointer)
                return;
            this.#firstPointer = -1;
            // TODO this may not be needed, capture is automatically released if
            // the capture pointer goes up. Test and confirm.
            if (captureTarget(this.interactionContainer).hasPointerCapture(this.#firstPointer))
                captureTarget(this.interactionContainer).releasePointerCapture(this.#firstPointer);
            // stop dragging
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointermove', this.#onMove);
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointerup', this.#onPointerUp);
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointerleave', this.#onPointerUp);
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointercancel', this.#onInteractionLost);
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('lostpointercapture', this.#onPointerUp);
            if ((this.#deltaX === 0 && this.#deltaY === 0) || performance.now() - this.#moveTimestamp > 100)
                return;
            // slow the rotation down based on former drag speed
            this.rotationXTarget.rotation = (x, y, z, _t, dt) => {
                const fpsRatio = dt / 16.6666;
                // Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
                this.#deltaX *= 1 - fpsRatio * this.slowdownAmount;
                // stop rotation once the delta is small enough that we
                // no longer notice the rotation.
                if (Math.abs(this.#deltaX) < this.epsilon)
                    return false;
                return [clamp(x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z];
            };
            this.rotationYTarget.rotation = (x, y, z, _t, dt) => {
                const fpsRatio = dt / 16.6666;
                // Multiply by fpsRatio so that the slowdownAmount is consistent over time no matter the fps.
                this.#deltaY *= 1 - fpsRatio * this.slowdownAmount;
                // stop rotation once the delta is small enough that we
                // no longer notice the rotation.
                if (Math.abs(this.#deltaY) < this.epsilon)
                    return false;
                return [x, clamp(y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY), z];
            };
        };
        // Hack needed for Chrome (works fine in Firefox) otherwise
        // pointercancel breaks the drag handling. See
        // https://crbug.com/1166044
        #onInteractionLost = (event) => {
            console.error('Pointer interaction lost. If this happened while the app was focused, please kindly open an issue at https://github.com/lume/lume/issues.');
            this.#onPointerUp(event);
        };
        #onDragStart = (event) => event.preventDefault();
        start() {
            if (untrack(() => this.#isStarted))
                return this;
            this.#isStarted = true;
            this.startEffects();
            return this;
        }
        flingRotationEffect() {
            // We need all these things for interaction to continue.
            if (!(this.rotationYTarget && this.rotationXTarget && this.interactionContainer))
                return;
            this.#aborter = new AbortController();
            const initiator = this.interactionInitiator ?? this.interactionContainer;
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent. TODO fix TypeScript lib.dom types.
            initiator.addEventListener('pointerdown', this.#onPointerDown, { signal: this.#aborter.signal });
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            initiator.addEventListener('dragstart', this.#onDragStart, { signal: this.#aborter.signal });
            onCleanup(() => {
                this.#firstPointer = -1;
                this.#stopAnimation();
                this.#aborter.abort();
            });
        }
        stop() {
            if (!untrack(() => this.#isStarted))
                return this;
            this.#isStarted = false;
            // CONTINUE Fix/update/delete all stopEffects() usage.
            this.stopEffects();
            return this;
        }
        #stopAnimation() {
            // Stop any current animation.
            this.rotationXTarget.rotation = () => false;
            this.rotationYTarget.rotation = () => false;
        }
        // @ts-expect-error Dummy signal field finalizes effects after private fields to prevent TDZ
        __init_effects_ignore = __runInitializers(this, ___init_effects_ignore_initializers, 0);
    };
})();
export { FlingRotation };
function captureTarget(target) {
    return target instanceof Window || target instanceof Document
        ? document.documentElement
        : target;
}
//# sourceMappingURL=FlingRotation.js.map