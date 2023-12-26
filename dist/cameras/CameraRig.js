// TODO the interaction in here can be separated into a DragFling class, then
// this class can apply DragFling to X and Y rotations. We can use DragFling for
// implementing a scrollable area.
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
import { onCleanup } from 'solid-js';
import html from 'solid-js/html';
import { signal, syncSignals } from 'classy-solid';
import { element, numberAttribute, booleanAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
import { defaultScenePerspective } from '../constants.js';
// TODO allow overriding the camera props, and make the default camera overridable via <slot>
/**
 * @class CameraRig
 *
 * Element: `<lume-camera-rig>`
 *
 * The [`<lume-camera-rig>`](./CameraRig) element is much like a real-life
 * camera rig that contains a camera on it: it has controls to allow the user to
 * rotate and dolly the camera around in physical space more easily, in a
 * particular and specific. In the following example, try draging to rotate,
 * scrolling to zoom:
 *
 * <live-code id="example"></live-code>
 *
 * ## Slots
 *
 * - default (no name): Allows children of the camera rig to render as children
 * of the camera rig, like with elements that don't have a ShadowDOM.
 * - `camera-child`: Allows children of the camera rig to render relative to the
 * camera rig's underlying camera.
 */
let CameraRig = (() => {
    let _classDecorators = [element('lume-camera-rig', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _instanceExtraInitializers = [];
    let _verticalAngle_decorators;
    let _verticalAngle_initializers = [];
    let _get_initialPolarAngle_decorators;
    let _minVerticalAngle_decorators;
    let _minVerticalAngle_initializers = [];
    let _get_minPolarAngle_decorators;
    let _maxVerticalAngle_decorators;
    let _maxVerticalAngle_initializers = [];
    let _get_maxPolarAngle_decorators;
    let _horizontalAngle_decorators;
    let _horizontalAngle_initializers = [];
    let _minHorizontalAngle_decorators;
    let _minHorizontalAngle_initializers = [];
    let _maxHorizontalAngle_decorators;
    let _maxHorizontalAngle_initializers = [];
    let _distance_decorators;
    let _distance_initializers = [];
    let ___appliedDistance_decorators;
    let ___appliedDistance_initializers = [];
    let _get_initialDistance_decorators;
    let _minDistance_decorators;
    let _minDistance_initializers = [];
    let ___appliedMinDistance_decorators;
    let ___appliedMinDistance_initializers = [];
    let _maxDistance_decorators;
    let _maxDistance_initializers = [];
    let ___appliedMaxDistance_decorators;
    let ___appliedMaxDistance_initializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _dollySpeed_decorators;
    let _dollySpeed_initializers = [];
    let _interactive_decorators;
    let _interactive_initializers = [];
    let _threeCamera_decorators;
    let _threeCamera_initializers = [];
    let _rotationYTarget_decorators;
    let _rotationYTarget_initializers = [];
    let _rotationXTarget_decorators;
    let _rotationXTarget_initializers = [];
    var CameraRig = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _verticalAngle_decorators = [numberAttribute];
            _get_initialPolarAngle_decorators = [numberAttribute];
            _minVerticalAngle_decorators = [numberAttribute];
            _get_minPolarAngle_decorators = [numberAttribute];
            _maxVerticalAngle_decorators = [numberAttribute];
            _get_maxPolarAngle_decorators = [numberAttribute];
            _horizontalAngle_decorators = [numberAttribute];
            _minHorizontalAngle_decorators = [numberAttribute];
            _maxHorizontalAngle_decorators = [numberAttribute];
            _distance_decorators = [numberAttribute];
            ___appliedDistance_decorators = [signal];
            _get_initialDistance_decorators = [numberAttribute];
            _minDistance_decorators = [numberAttribute];
            ___appliedMinDistance_decorators = [signal];
            _maxDistance_decorators = [numberAttribute];
            ___appliedMaxDistance_decorators = [signal];
            _active_decorators = [booleanAttribute];
            _dollySpeed_decorators = [numberAttribute];
            _interactive_decorators = [booleanAttribute];
            _threeCamera_decorators = [signal];
            _rotationYTarget_decorators = [signal];
            _rotationXTarget_decorators = [signal];
            __esDecorate(this, null, _get_initialPolarAngle_decorators, { kind: "getter", name: "initialPolarAngle", static: false, private: false, access: { has: obj => "initialPolarAngle" in obj, get: obj => obj.initialPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_minPolarAngle_decorators, { kind: "getter", name: "minPolarAngle", static: false, private: false, access: { has: obj => "minPolarAngle" in obj, get: obj => obj.minPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_maxPolarAngle_decorators, { kind: "getter", name: "maxPolarAngle", static: false, private: false, access: { has: obj => "maxPolarAngle" in obj, get: obj => obj.maxPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_initialDistance_decorators, { kind: "getter", name: "initialDistance", static: false, private: false, access: { has: obj => "initialDistance" in obj, get: obj => obj.initialDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _verticalAngle_decorators, { kind: "field", name: "verticalAngle", static: false, private: false, access: { has: obj => "verticalAngle" in obj, get: obj => obj.verticalAngle, set: (obj, value) => { obj.verticalAngle = value; } }, metadata: _metadata }, _verticalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _minVerticalAngle_decorators, { kind: "field", name: "minVerticalAngle", static: false, private: false, access: { has: obj => "minVerticalAngle" in obj, get: obj => obj.minVerticalAngle, set: (obj, value) => { obj.minVerticalAngle = value; } }, metadata: _metadata }, _minVerticalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _maxVerticalAngle_decorators, { kind: "field", name: "maxVerticalAngle", static: false, private: false, access: { has: obj => "maxVerticalAngle" in obj, get: obj => obj.maxVerticalAngle, set: (obj, value) => { obj.maxVerticalAngle = value; } }, metadata: _metadata }, _maxVerticalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _horizontalAngle_decorators, { kind: "field", name: "horizontalAngle", static: false, private: false, access: { has: obj => "horizontalAngle" in obj, get: obj => obj.horizontalAngle, set: (obj, value) => { obj.horizontalAngle = value; } }, metadata: _metadata }, _horizontalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _minHorizontalAngle_decorators, { kind: "field", name: "minHorizontalAngle", static: false, private: false, access: { has: obj => "minHorizontalAngle" in obj, get: obj => obj.minHorizontalAngle, set: (obj, value) => { obj.minHorizontalAngle = value; } }, metadata: _metadata }, _minHorizontalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _maxHorizontalAngle_decorators, { kind: "field", name: "maxHorizontalAngle", static: false, private: false, access: { has: obj => "maxHorizontalAngle" in obj, get: obj => obj.maxHorizontalAngle, set: (obj, value) => { obj.maxHorizontalAngle = value; } }, metadata: _metadata }, _maxHorizontalAngle_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _distance_decorators, { kind: "field", name: "distance", static: false, private: false, access: { has: obj => "distance" in obj, get: obj => obj.distance, set: (obj, value) => { obj.distance = value; } }, metadata: _metadata }, _distance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___appliedDistance_decorators, { kind: "field", name: "__appliedDistance", static: false, private: false, access: { has: obj => "__appliedDistance" in obj, get: obj => obj.__appliedDistance, set: (obj, value) => { obj.__appliedDistance = value; } }, metadata: _metadata }, ___appliedDistance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _minDistance_decorators, { kind: "field", name: "minDistance", static: false, private: false, access: { has: obj => "minDistance" in obj, get: obj => obj.minDistance, set: (obj, value) => { obj.minDistance = value; } }, metadata: _metadata }, _minDistance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___appliedMinDistance_decorators, { kind: "field", name: "__appliedMinDistance", static: false, private: false, access: { has: obj => "__appliedMinDistance" in obj, get: obj => obj.__appliedMinDistance, set: (obj, value) => { obj.__appliedMinDistance = value; } }, metadata: _metadata }, ___appliedMinDistance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _maxDistance_decorators, { kind: "field", name: "maxDistance", static: false, private: false, access: { has: obj => "maxDistance" in obj, get: obj => obj.maxDistance, set: (obj, value) => { obj.maxDistance = value; } }, metadata: _metadata }, _maxDistance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, ___appliedMaxDistance_decorators, { kind: "field", name: "__appliedMaxDistance", static: false, private: false, access: { has: obj => "__appliedMaxDistance" in obj, get: obj => obj.__appliedMaxDistance, set: (obj, value) => { obj.__appliedMaxDistance = value; } }, metadata: _metadata }, ___appliedMaxDistance_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _dollySpeed_decorators, { kind: "field", name: "dollySpeed", static: false, private: false, access: { has: obj => "dollySpeed" in obj, get: obj => obj.dollySpeed, set: (obj, value) => { obj.dollySpeed = value; } }, metadata: _metadata }, _dollySpeed_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _interactive_decorators, { kind: "field", name: "interactive", static: false, private: false, access: { has: obj => "interactive" in obj, get: obj => obj.interactive, set: (obj, value) => { obj.interactive = value; } }, metadata: _metadata }, _interactive_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _threeCamera_decorators, { kind: "field", name: "threeCamera", static: false, private: false, access: { has: obj => "threeCamera" in obj, get: obj => obj.threeCamera, set: (obj, value) => { obj.threeCamera = value; } }, metadata: _metadata }, _threeCamera_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _rotationYTarget_decorators, { kind: "field", name: "rotationYTarget", static: false, private: false, access: { has: obj => "rotationYTarget" in obj, get: obj => obj.rotationYTarget, set: (obj, value) => { obj.rotationYTarget = value; } }, metadata: _metadata }, _rotationYTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _rotationXTarget_decorators, { kind: "field", name: "rotationXTarget", static: false, private: false, access: { has: obj => "rotationXTarget" in obj, get: obj => obj.rotationXTarget, set: (obj, value) => { obj.rotationXTarget = value; } }, metadata: _metadata }, _rotationXTarget_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CameraRig = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {true} hasShadow
         *
         * *override* *readonly*
         *
         * This is `true` because this element has a `ShadowRoot` with the mentioned
         * [`slots`](#slots).
         */
        hasShadow = (__runInitializers(this, _instanceExtraInitializers), true);
        /**
         * @property {number} verticalAngle
         *
         * *attribute*
         *
         * Default: `0`
         *
         * The vertical angle of the camera (rotation around a horizontal axis). When the user drags up or
         * down, the camera will move up and down as it rotates around the center.
         * The camera is always looking at the center.
         */
        verticalAngle = __runInitializers(this, _verticalAngle_initializers, 0
        /**
         * @deprecated initialPolarAngle has been renamed to verticalAngle.
         * @property {number} initialPolarAngle
         *
         * *deprecated*: initialPolarAngle has been renamed to verticalAngle.
         */
        );
        /**
         * @deprecated initialPolarAngle has been renamed to verticalAngle.
         * @property {number} initialPolarAngle
         *
         * *deprecated*: initialPolarAngle has been renamed to verticalAngle.
         */
        get initialPolarAngle() {
            return this.verticalAngle;
        }
        set initialPolarAngle(value) {
            this.verticalAngle = value;
        }
        /**
         * @property {number} minVerticalAngle
         *
         * *attribute*
         *
         * Default: `-90`
         *
         * The lowest angle that the camera will rotate vertically.
         */
        minVerticalAngle = __runInitializers(this, _minVerticalAngle_initializers, -90
        /**
         * @deprecated minPolarAngle has been renamed to minVerticalAngle.
         * @property {number} minPolarAngle
         *
         * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
         */
        );
        /**
         * @deprecated minPolarAngle has been renamed to minVerticalAngle.
         * @property {number} minPolarAngle
         *
         * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
         */
        get minPolarAngle() {
            return this.minVerticalAngle;
        }
        set minPolarAngle(value) {
            this.minVerticalAngle = value;
        }
        /**
         * @property {number} maxVerticalAngle
         *
         * *attribute*
         *
         * Default: `90`
         *
         * The highest angle that the camera will rotate vertically.
         *
         * <live-code id="verticalExample"></live-code>
         *
         * <script>
         *   example.content = cameraRigExample
         *   verticalExample.content = cameraRigVerticalRotationExample
         * </script>
         */
        maxVerticalAngle = __runInitializers(this, _maxVerticalAngle_initializers, 90
        /**
         * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
         * @property {number} maxPolarAngle
         *
         * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
         */
        );
        /**
         * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
         * @property {number} maxPolarAngle
         *
         * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
         */
        get maxPolarAngle() {
            return this.maxVerticalAngle;
        }
        set maxPolarAngle(value) {
            this.maxVerticalAngle = value;
        }
        /**
         * @property {number} horizontalAngle
         *
         * *attribute*
         *
         * Default: `0`
         *
         * The horizontal angle of the camera (rotation around a vertical axis). When the user drags left or
         * right, the camera will move left or right as it rotates around the center.
         * The camera is always looking at the center.
         */
        horizontalAngle = __runInitializers(this, _horizontalAngle_initializers, 0
        /**
         * @property {number} minHorizontalAngle
         *
         * *attribute*
         *
         * Default: `-Infinity`
         *
         * The smallest angle that the camera will be allowed to rotate to
         * horizontally. The default of `-Infinity` means the camera will rotate
         * laterally around the focus point indefinitely.
         */
        );
        /**
         * @property {number} minHorizontalAngle
         *
         * *attribute*
         *
         * Default: `-Infinity`
         *
         * The smallest angle that the camera will be allowed to rotate to
         * horizontally. The default of `-Infinity` means the camera will rotate
         * laterally around the focus point indefinitely.
         */
        minHorizontalAngle = __runInitializers(this, _minHorizontalAngle_initializers, -Infinity
        /**
         * @property {number} maxHorizontalAngle
         *
         * *attribute*
         *
         * Default: `Infinity`
         *
         * The largest angle that the camera will be allowed to rotate to
         * horizontally. The default of `Infinity` means the camera will rotate
         * laterally around the focus point indefinitely.
         */
        );
        /**
         * @property {number} maxHorizontalAngle
         *
         * *attribute*
         *
         * Default: `Infinity`
         *
         * The largest angle that the camera will be allowed to rotate to
         * horizontally. The default of `Infinity` means the camera will rotate
         * laterally around the focus point indefinitely.
         */
        maxHorizontalAngle = __runInitializers(this, _maxHorizontalAngle_initializers, Infinity
        /**
         * @property {number} distance
         *
         * *attribute*
         *
         * Default: `-1`
         *
         * The distance that the camera will be away from the center point.
         * When the performing a scroll gesture, the camera will zoom by moving
         * towards or away from the center point (i.e. dollying).
         *
         * A value of `-1` means automatic distance based on the current scene's
         * [`.perspective`](../core/Scene#perspective), matching the behavior of
         * [CSS `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
         */
        );
        /**
         * @property {number} distance
         *
         * *attribute*
         *
         * Default: `-1`
         *
         * The distance that the camera will be away from the center point.
         * When the performing a scroll gesture, the camera will zoom by moving
         * towards or away from the center point (i.e. dollying).
         *
         * A value of `-1` means automatic distance based on the current scene's
         * [`.perspective`](../core/Scene#perspective), matching the behavior of
         * [CSS `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
         */
        distance = __runInitializers(this, _distance_initializers, -1);
        __appliedDistance = __runInitializers(this, ___appliedDistance_initializers, defaultScenePerspective
        /**
         * @deprecated initialDistance has been renamed to distance.
         * @property {number} initialDistance
         *
         * *deprecated*: initialDistance has been renamed to distance.
         */
        );
        /**
         * @deprecated initialDistance has been renamed to distance.
         * @property {number} initialDistance
         *
         * *deprecated*: initialDistance has been renamed to distance.
         */
        get initialDistance() {
            return this.distance;
        }
        set initialDistance(value) {
            this.distance = value;
        }
        /**
         * @property {number} minDistance
         *
         * *attribute*
         *
         * Default: `-1`
         *
         * The smallest distance (a non-zero value) the camera can get to the center point when zooming
         * by scrolling.
         *
         * A value of `-1` means the value will automatically be half of whatever
         * the [`.distance`](#distance) value is.
         */
        minDistance = __runInitializers(this, _minDistance_initializers, -1);
        __appliedMinDistance = __runInitializers(this, ___appliedMinDistance_initializers, 200
        /**
         * @property {number} maxDistance
         *
         * *attribute*
         *
         * Default: `-1`
         *
         * The largest distance (a non-zero value) the camera can get from the
         * center point when zooming out by scrolling or with pinch gesture.
         *
         * A value of `-1` means the value will automatically be double of whatever
         * the [`.distance`](#distance) value is.
         */
        );
        /**
         * @property {number} maxDistance
         *
         * *attribute*
         *
         * Default: `-1`
         *
         * The largest distance (a non-zero value) the camera can get from the
         * center point when zooming out by scrolling or with pinch gesture.
         *
         * A value of `-1` means the value will automatically be double of whatever
         * the [`.distance`](#distance) value is.
         */
        maxDistance = __runInitializers(this, _maxDistance_initializers, -1);
        __appliedMaxDistance = __runInitializers(this, ___appliedMaxDistance_initializers, 800
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
         */
        );
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
         */
        active = __runInitializers(this, _active_initializers, true
        /**
         * @property {number} dollySpeed
         *
         * *attribute*
         *
         * Default: `1`
         */
        );
        /**
         * @property {number} dollySpeed
         *
         * *attribute*
         *
         * Default: `1`
         */
        dollySpeed = __runInitializers(this, _dollySpeed_initializers, 1
        /**
         * @property {boolean} interactive
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `false`, user interaction (ability to zoom or rotate the camera) is
         * disabled, but the camera rig can still be manipulated programmatically.
         */
        );
        /**
         * @property {boolean} interactive
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `false`, user interaction (ability to zoom or rotate the camera) is
         * disabled, but the camera rig can still be manipulated programmatically.
         */
        interactive = __runInitializers(this, _interactive_initializers, true);
        threeCamera = __runInitializers(this, _threeCamera_initializers, void 0);
        /** @deprecated Use `.threeCamera` instead. */
        get cam() {
            return this.threeCamera;
        }
        rotationYTarget = __runInitializers(this, _rotationYTarget_initializers, void 0);
        rotationXTarget = __runInitializers(this, _rotationXTarget_initializers, void 0);
        flingRotation = new FlingRotation();
        scrollFling = new ScrollFling();
        pinchFling = new PinchFling();
        get #derivedInputDistance() {
            return this.distance !== -1 ? this.distance : this.scene?.perspective ?? defaultScenePerspective;
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                // We start interaction if we have a scene (we're in the composed
                // tree) and have the needed DOM nodes.
                if (!(this.scene && this.rotationYTarget && this.rotationXTarget && this.threeCamera))
                    return;
                // TODO replace with @memo once that's out in classy-solid
                this.createEffect(() => {
                    this.__appliedDistance = this.#derivedInputDistance;
                    this.__appliedMinDistance = this.minDistance !== -1 ? this.minDistance : this.#derivedInputDistance / 2;
                    this.__appliedMaxDistance = this.maxDistance !== -1 ? this.maxDistance : this.#derivedInputDistance * 2;
                });
                // We set position here instead of in the template, otherwise
                // pre-upgrade values from the template running before element
                // upgrade (due to how Solid templates using cloneNode making them
                // non-upgraded until connected) will override the initial
                // __appliedDistance value.
                this.createEffect(() => (this.threeCamera.position.z = this.__appliedDistance));
                const { scrollFling, pinchFling, flingRotation } = this;
                flingRotation.interactionInitiator = this.scene;
                flingRotation.interactionContainer = this.scene;
                flingRotation.rotationYTarget = this.rotationYTarget;
                flingRotation.rotationXTarget = this.rotationXTarget;
                scrollFling.target = this.scene;
                pinchFling.target = this.scene;
                syncSignals(() => this.__appliedDistance, (d) => (this.__appliedDistance = d), () => this.scrollFling.y, (y) => (this.scrollFling.y = y));
                syncSignals(() => this.scrollFling.y, (y) => (this.scrollFling.y = y), () => this.pinchFling.x, (x) => (this.pinchFling.x = x));
                this.createEffect(() => {
                    flingRotation.minFlingRotationX = this.minVerticalAngle;
                    flingRotation.maxFlingRotationX = this.maxVerticalAngle;
                    flingRotation.minFlingRotationY = this.minHorizontalAngle;
                    flingRotation.maxFlingRotationY = this.maxHorizontalAngle;
                    scrollFling.minY = pinchFling.minX = this.__appliedMinDistance;
                    scrollFling.maxY = pinchFling.maxX = this.__appliedMaxDistance;
                    scrollFling.sensitivity = pinchFling.sensitivity = this.dollySpeed;
                });
                this.createEffect(() => {
                    if (this.interactive && !this.pinchFling?.interacting)
                        flingRotation.start();
                    else
                        flingRotation.stop();
                });
                this.createEffect(() => {
                    if (this.interactive) {
                        scrollFling.start();
                        pinchFling.start();
                    }
                    else {
                        scrollFling.stop();
                        pinchFling.stop();
                    }
                });
                onCleanup(() => {
                    this.flingRotation.stop();
                    this.scrollFling.stop();
                    this.pinchFling.stop();
                });
            });
        }
        template = () => html `
		<lume-element3d
			id="cameraY"
			ref=${(el) => (this.rotationYTarget = el)}
			size="1 1 1"
			size-mode="proportional proportional proportional"
			rotation=${() => [0, this.horizontalAngle, 0]}
		>
			<lume-element3d
				id="cameraX"
				ref=${(el) => (this.rotationXTarget = el)}
				size="1 1 1"
				rotation=${() => [this.verticalAngle, 0, 0]}
				size-mode="proportional proportional proportional"
			>
				<slot
					name="camera"
					TODO="determine semantics for overriding the internal camera (this slot is not documented yet)"
				>
					<lume-perspective-camera
						ref=${(cam) => (this.threeCamera = cam)}
						id="camera-rig-perspective-camera"
						active=${() => this.active}
						comment="We don't set position here because it triggers the pre-upgrade handling due to the template running before perspective-camera is upgraded (due to Solid specifics) which causes the initial value to override the initial position calculated from scene.perspective."
						xposition=${() => [0, 0, this.__appliedDistance]}
						align-point="0.5 0.5 0.5"
						far="10000"
					>
						<slot name="camera-child"></slot>
					</lume-perspective-camera>
				</slot>
			</lume-element3d>
		</lume-element3d>

		<slot></slot>
	`;
    };
    return CameraRig = _classThis;
})();
export { CameraRig };
//# sourceMappingURL=CameraRig.js.map