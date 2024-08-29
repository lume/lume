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
import { createEffect, onCleanup } from 'solid-js';
import { Settable } from '../utils/Settable.js';
import { DragFling } from './DragFling.js';
/**
 * Rotates the `rotationXTarget` element on X, and the `rotationYTarget` element
 * on Y, to make interactive rotation of an object.
 */
let FlingRotation = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Settable(Effects);
    let _instanceExtraInitializers = [];
    let _rotationYTarget_decorators;
    let _rotationYTarget_initializers = [];
    let _rotationXTarget_decorators;
    let _rotationXTarget_initializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _minRotationX_decorators;
    let _minRotationX_initializers = [];
    let _maxRotationX_decorators;
    let _maxRotationX_initializers = [];
    let _minRotationY_decorators;
    let _minRotationY_initializers = [];
    let _maxRotationY_decorators;
    let _maxRotationY_initializers = [];
    let _sensitivity_decorators;
    let _sensitivity_initializers = [];
    let _epsilon_decorators;
    let _epsilon_initializers = [];
    let _slowdownAmount_decorators;
    let _slowdownAmount_initializers = [];
    let _pointerTypes_decorators;
    let _pointerTypes_initializers = [];
    var FlingRotation = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _rotationYTarget_decorators = [signal];
            _rotationXTarget_decorators = [signal];
            _target_decorators = [signal];
            _minRotationX_decorators = [signal];
            _maxRotationX_decorators = [signal];
            _minRotationY_decorators = [signal];
            _maxRotationY_decorators = [signal];
            _sensitivity_decorators = [signal];
            _epsilon_decorators = [signal];
            _slowdownAmount_decorators = [signal];
            _pointerTypes_decorators = [signal];
            __esDecorate(null, null, _rotationYTarget_decorators, { kind: "field", name: "rotationYTarget", static: false, private: false, access: { has: obj => "rotationYTarget" in obj, get: obj => obj.rotationYTarget, set: (obj, value) => { obj.rotationYTarget = value; } }, metadata: _metadata }, _rotationYTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _rotationXTarget_decorators, { kind: "field", name: "rotationXTarget", static: false, private: false, access: { has: obj => "rotationXTarget" in obj, get: obj => obj.rotationXTarget, set: (obj, value) => { obj.rotationXTarget = value; } }, metadata: _metadata }, _rotationXTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _minRotationX_decorators, { kind: "field", name: "minRotationX", static: false, private: false, access: { has: obj => "minRotationX" in obj, get: obj => obj.minRotationX, set: (obj, value) => { obj.minRotationX = value; } }, metadata: _metadata }, _minRotationX_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _maxRotationX_decorators, { kind: "field", name: "maxRotationX", static: false, private: false, access: { has: obj => "maxRotationX" in obj, get: obj => obj.maxRotationX, set: (obj, value) => { obj.maxRotationX = value; } }, metadata: _metadata }, _maxRotationX_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _minRotationY_decorators, { kind: "field", name: "minRotationY", static: false, private: false, access: { has: obj => "minRotationY" in obj, get: obj => obj.minRotationY, set: (obj, value) => { obj.minRotationY = value; } }, metadata: _metadata }, _minRotationY_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _maxRotationY_decorators, { kind: "field", name: "maxRotationY", static: false, private: false, access: { has: obj => "maxRotationY" in obj, get: obj => obj.maxRotationY, set: (obj, value) => { obj.maxRotationY = value; } }, metadata: _metadata }, _maxRotationY_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _sensitivity_decorators, { kind: "field", name: "sensitivity", static: false, private: false, access: { has: obj => "sensitivity" in obj, get: obj => obj.sensitivity, set: (obj, value) => { obj.sensitivity = value; } }, metadata: _metadata }, _sensitivity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _epsilon_decorators, { kind: "field", name: "epsilon", static: false, private: false, access: { has: obj => "epsilon" in obj, get: obj => obj.epsilon, set: (obj, value) => { obj.epsilon = value; } }, metadata: _metadata }, _epsilon_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _slowdownAmount_decorators, { kind: "field", name: "slowdownAmount", static: false, private: false, access: { has: obj => "slowdownAmount" in obj, get: obj => obj.slowdownAmount, set: (obj, value) => { obj.slowdownAmount = value; } }, metadata: _metadata }, _slowdownAmount_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _pointerTypes_decorators, { kind: "field", name: "pointerTypes", static: false, private: false, access: { has: obj => "pointerTypes" in obj, get: obj => obj.pointerTypes, set: (obj, value) => { obj.pointerTypes = value; } }, metadata: _metadata }, _pointerTypes_initializers, _instanceExtraInitializers);
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
         * The element that will used for drag handling, defaults to
         * rotationXTarget. You could set it to a <lume-scene>, for example, to make
         * the rotation interaction start anywhere in a scene, not specifically on
         * the object to be rotated.
         */
        target = __runInitializers(this, _target_initializers, void 0);
        /**
         * The X rotation can not go below this value. Defaults to -90 which means
         * facing straight up.
         */
        minRotationX = __runInitializers(this, _minRotationX_initializers, -90
        /**
         * The X rotation can not go above this value. Defaults to 90 which means
         * facing straight down.
         */
        );
        /**
         * The X rotation can not go above this value. Defaults to 90 which means
         * facing straight down.
         */
        maxRotationX = __runInitializers(this, _maxRotationX_initializers, 90
        /**
         * The Y rotation can not go below this value. Defaults to -Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        );
        /**
         * The Y rotation can not go below this value. Defaults to -Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        minRotationY = __runInitializers(this, _minRotationY_initializers, -Infinity
        /**
         * The Y rotation can not go below this value. Defaults to Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        );
        /**
         * The Y rotation can not go below this value. Defaults to Infinity which
         * means the camera can keep rotating laterally around the focus point
         * indefinitely.
         */
        maxRotationY = __runInitializers(this, _maxRotationY_initializers, Infinity);
        sensitivity = __runInitializers(this, _sensitivity_initializers, 1);
        epsilon = __runInitializers(this, _epsilon_initializers, 0.01
        /**
         * Portion of the change in rotation that is removed each frame to
         * cause slowdown. Between 0 and 1.
         */
        );
        /**
         * Portion of the change in rotation that is removed each frame to
         * cause slowdown. Between 0 and 1.
         */
        slowdownAmount = __runInitializers(this, _slowdownAmount_initializers, 0.05
        /**
         * The allowed pointer types to use for dragging ('mouse', 'pen', or
         * 'touch'). Default is all of them.
         */
        );
        /**
         * The allowed pointer types to use for dragging ('mouse', 'pen', or
         * 'touch'). Default is all of them.
         */
        pointerTypes = __runInitializers(this, _pointerTypes_initializers, ['mouse', 'pen', 'touch']);
        #isStarted = false;
        start() {
            if (this.#isStarted)
                return this;
            this.#isStarted = true;
            this.createEffect(() => {
                // We need all these things for interaction to continue.
                if (!(this.rotationYTarget && this.rotationXTarget && this.target))
                    return;
                const dragFling = new DragFling().set({ target: this.target, pointerTypes: this.pointerTypes });
                dragFling.start();
                onCleanup(() => dragFling.stop());
                createEffect(() => {
                    dragFling.set({
                        minX: this.minRotationY,
                        maxX: this.maxRotationY,
                        minY: this.minRotationX,
                        maxY: this.maxRotationX,
                        sensitivity: this.sensitivity,
                        epsilon: this.epsilon,
                        slowdownAmount: this.slowdownAmount,
                    });
                });
                createEffect(() => {
                    this.rotationXTarget.rotation.x = dragFling.y;
                    this.rotationYTarget.rotation.y = -dragFling.x;
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