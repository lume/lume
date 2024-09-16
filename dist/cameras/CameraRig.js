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
    let _verticalAngle_extraInitializers = [];
    let _get_initialPolarAngle_decorators;
    let _minVerticalAngle_decorators;
    let _minVerticalAngle_initializers = [];
    let _minVerticalAngle_extraInitializers = [];
    let _get_minPolarAngle_decorators;
    let _maxVerticalAngle_decorators;
    let _maxVerticalAngle_initializers = [];
    let _maxVerticalAngle_extraInitializers = [];
    let _get_maxPolarAngle_decorators;
    let _horizontalAngle_decorators;
    let _horizontalAngle_initializers = [];
    let _horizontalAngle_extraInitializers = [];
    let _minHorizontalAngle_decorators;
    let _minHorizontalAngle_initializers = [];
    let _minHorizontalAngle_extraInitializers = [];
    let _maxHorizontalAngle_decorators;
    let _maxHorizontalAngle_initializers = [];
    let _maxHorizontalAngle_extraInitializers = [];
    let _distance_decorators;
    let _distance_initializers = [];
    let _distance_extraInitializers = [];
    let ___appliedDistance_decorators;
    let ___appliedDistance_initializers = [];
    let ___appliedDistance_extraInitializers = [];
    let _get_initialDistance_decorators;
    let _minDistance_decorators;
    let _minDistance_initializers = [];
    let _minDistance_extraInitializers = [];
    let ___appliedMinDistance_decorators;
    let ___appliedMinDistance_initializers = [];
    let ___appliedMinDistance_extraInitializers = [];
    let _maxDistance_decorators;
    let _maxDistance_initializers = [];
    let _maxDistance_extraInitializers = [];
    let ___appliedMaxDistance_decorators;
    let ___appliedMaxDistance_initializers = [];
    let ___appliedMaxDistance_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _dollySpeed_decorators;
    let _dollySpeed_initializers = [];
    let _dollySpeed_extraInitializers = [];
    let _interactive_decorators;
    let _interactive_initializers = [];
    let _interactive_extraInitializers = [];
    let _rotationSpeed_decorators;
    let _rotationSpeed_initializers = [];
    let _rotationSpeed_extraInitializers = [];
    let _dynamicDolly_decorators;
    let _dynamicDolly_initializers = [];
    let _dynamicDolly_extraInitializers = [];
    let _dynamicRotation_decorators;
    let _dynamicRotation_initializers = [];
    let _dynamicRotation_extraInitializers = [];
    let _dollyEpsilon_decorators;
    let _dollyEpsilon_initializers = [];
    let _dollyEpsilon_extraInitializers = [];
    let _dollyScrollLerp_decorators;
    let _dollyScrollLerp_initializers = [];
    let _dollyScrollLerp_extraInitializers = [];
    let _dollyPinchSlowdown_decorators;
    let _dollyPinchSlowdown_initializers = [];
    let _dollyPinchSlowdown_extraInitializers = [];
    let _rotationEpsilon_decorators;
    let _rotationEpsilon_initializers = [];
    let _rotationEpsilon_extraInitializers = [];
    let _rotationSlowdown_decorators;
    let _rotationSlowdown_initializers = [];
    let _rotationSlowdown_extraInitializers = [];
    let _threeCamera_decorators;
    let _threeCamera_initializers = [];
    let _threeCamera_extraInitializers = [];
    let _rotationYTarget_decorators;
    let _rotationYTarget_initializers = [];
    let _rotationYTarget_extraInitializers = [];
    let _rotationXTarget_decorators;
    let _rotationXTarget_initializers = [];
    let _rotationXTarget_extraInitializers = [];
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
            _rotationSpeed_decorators = [numberAttribute];
            _dynamicDolly_decorators = [booleanAttribute];
            _dynamicRotation_decorators = [booleanAttribute];
            _dollyEpsilon_decorators = [numberAttribute];
            _dollyScrollLerp_decorators = [numberAttribute];
            _dollyPinchSlowdown_decorators = [numberAttribute];
            _rotationEpsilon_decorators = [numberAttribute];
            _rotationSlowdown_decorators = [numberAttribute];
            _threeCamera_decorators = [signal];
            _rotationYTarget_decorators = [signal];
            _rotationXTarget_decorators = [signal];
            __esDecorate(this, null, _get_initialPolarAngle_decorators, { kind: "getter", name: "initialPolarAngle", static: false, private: false, access: { has: obj => "initialPolarAngle" in obj, get: obj => obj.initialPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_minPolarAngle_decorators, { kind: "getter", name: "minPolarAngle", static: false, private: false, access: { has: obj => "minPolarAngle" in obj, get: obj => obj.minPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_maxPolarAngle_decorators, { kind: "getter", name: "maxPolarAngle", static: false, private: false, access: { has: obj => "maxPolarAngle" in obj, get: obj => obj.maxPolarAngle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_initialDistance_decorators, { kind: "getter", name: "initialDistance", static: false, private: false, access: { has: obj => "initialDistance" in obj, get: obj => obj.initialDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _verticalAngle_decorators, { kind: "field", name: "verticalAngle", static: false, private: false, access: { has: obj => "verticalAngle" in obj, get: obj => obj.verticalAngle, set: (obj, value) => { obj.verticalAngle = value; } }, metadata: _metadata }, _verticalAngle_initializers, _verticalAngle_extraInitializers);
            __esDecorate(null, null, _minVerticalAngle_decorators, { kind: "field", name: "minVerticalAngle", static: false, private: false, access: { has: obj => "minVerticalAngle" in obj, get: obj => obj.minVerticalAngle, set: (obj, value) => { obj.minVerticalAngle = value; } }, metadata: _metadata }, _minVerticalAngle_initializers, _minVerticalAngle_extraInitializers);
            __esDecorate(null, null, _maxVerticalAngle_decorators, { kind: "field", name: "maxVerticalAngle", static: false, private: false, access: { has: obj => "maxVerticalAngle" in obj, get: obj => obj.maxVerticalAngle, set: (obj, value) => { obj.maxVerticalAngle = value; } }, metadata: _metadata }, _maxVerticalAngle_initializers, _maxVerticalAngle_extraInitializers);
            __esDecorate(null, null, _horizontalAngle_decorators, { kind: "field", name: "horizontalAngle", static: false, private: false, access: { has: obj => "horizontalAngle" in obj, get: obj => obj.horizontalAngle, set: (obj, value) => { obj.horizontalAngle = value; } }, metadata: _metadata }, _horizontalAngle_initializers, _horizontalAngle_extraInitializers);
            __esDecorate(null, null, _minHorizontalAngle_decorators, { kind: "field", name: "minHorizontalAngle", static: false, private: false, access: { has: obj => "minHorizontalAngle" in obj, get: obj => obj.minHorizontalAngle, set: (obj, value) => { obj.minHorizontalAngle = value; } }, metadata: _metadata }, _minHorizontalAngle_initializers, _minHorizontalAngle_extraInitializers);
            __esDecorate(null, null, _maxHorizontalAngle_decorators, { kind: "field", name: "maxHorizontalAngle", static: false, private: false, access: { has: obj => "maxHorizontalAngle" in obj, get: obj => obj.maxHorizontalAngle, set: (obj, value) => { obj.maxHorizontalAngle = value; } }, metadata: _metadata }, _maxHorizontalAngle_initializers, _maxHorizontalAngle_extraInitializers);
            __esDecorate(null, null, _distance_decorators, { kind: "field", name: "distance", static: false, private: false, access: { has: obj => "distance" in obj, get: obj => obj.distance, set: (obj, value) => { obj.distance = value; } }, metadata: _metadata }, _distance_initializers, _distance_extraInitializers);
            __esDecorate(null, null, ___appliedDistance_decorators, { kind: "field", name: "__appliedDistance", static: false, private: false, access: { has: obj => "__appliedDistance" in obj, get: obj => obj.__appliedDistance, set: (obj, value) => { obj.__appliedDistance = value; } }, metadata: _metadata }, ___appliedDistance_initializers, ___appliedDistance_extraInitializers);
            __esDecorate(null, null, _minDistance_decorators, { kind: "field", name: "minDistance", static: false, private: false, access: { has: obj => "minDistance" in obj, get: obj => obj.minDistance, set: (obj, value) => { obj.minDistance = value; } }, metadata: _metadata }, _minDistance_initializers, _minDistance_extraInitializers);
            __esDecorate(null, null, ___appliedMinDistance_decorators, { kind: "field", name: "__appliedMinDistance", static: false, private: false, access: { has: obj => "__appliedMinDistance" in obj, get: obj => obj.__appliedMinDistance, set: (obj, value) => { obj.__appliedMinDistance = value; } }, metadata: _metadata }, ___appliedMinDistance_initializers, ___appliedMinDistance_extraInitializers);
            __esDecorate(null, null, _maxDistance_decorators, { kind: "field", name: "maxDistance", static: false, private: false, access: { has: obj => "maxDistance" in obj, get: obj => obj.maxDistance, set: (obj, value) => { obj.maxDistance = value; } }, metadata: _metadata }, _maxDistance_initializers, _maxDistance_extraInitializers);
            __esDecorate(null, null, ___appliedMaxDistance_decorators, { kind: "field", name: "__appliedMaxDistance", static: false, private: false, access: { has: obj => "__appliedMaxDistance" in obj, get: obj => obj.__appliedMaxDistance, set: (obj, value) => { obj.__appliedMaxDistance = value; } }, metadata: _metadata }, ___appliedMaxDistance_initializers, ___appliedMaxDistance_extraInitializers);
            __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
            __esDecorate(null, null, _dollySpeed_decorators, { kind: "field", name: "dollySpeed", static: false, private: false, access: { has: obj => "dollySpeed" in obj, get: obj => obj.dollySpeed, set: (obj, value) => { obj.dollySpeed = value; } }, metadata: _metadata }, _dollySpeed_initializers, _dollySpeed_extraInitializers);
            __esDecorate(null, null, _interactive_decorators, { kind: "field", name: "interactive", static: false, private: false, access: { has: obj => "interactive" in obj, get: obj => obj.interactive, set: (obj, value) => { obj.interactive = value; } }, metadata: _metadata }, _interactive_initializers, _interactive_extraInitializers);
            __esDecorate(null, null, _rotationSpeed_decorators, { kind: "field", name: "rotationSpeed", static: false, private: false, access: { has: obj => "rotationSpeed" in obj, get: obj => obj.rotationSpeed, set: (obj, value) => { obj.rotationSpeed = value; } }, metadata: _metadata }, _rotationSpeed_initializers, _rotationSpeed_extraInitializers);
            __esDecorate(null, null, _dynamicDolly_decorators, { kind: "field", name: "dynamicDolly", static: false, private: false, access: { has: obj => "dynamicDolly" in obj, get: obj => obj.dynamicDolly, set: (obj, value) => { obj.dynamicDolly = value; } }, metadata: _metadata }, _dynamicDolly_initializers, _dynamicDolly_extraInitializers);
            __esDecorate(null, null, _dynamicRotation_decorators, { kind: "field", name: "dynamicRotation", static: false, private: false, access: { has: obj => "dynamicRotation" in obj, get: obj => obj.dynamicRotation, set: (obj, value) => { obj.dynamicRotation = value; } }, metadata: _metadata }, _dynamicRotation_initializers, _dynamicRotation_extraInitializers);
            __esDecorate(null, null, _dollyEpsilon_decorators, { kind: "field", name: "dollyEpsilon", static: false, private: false, access: { has: obj => "dollyEpsilon" in obj, get: obj => obj.dollyEpsilon, set: (obj, value) => { obj.dollyEpsilon = value; } }, metadata: _metadata }, _dollyEpsilon_initializers, _dollyEpsilon_extraInitializers);
            __esDecorate(null, null, _dollyScrollLerp_decorators, { kind: "field", name: "dollyScrollLerp", static: false, private: false, access: { has: obj => "dollyScrollLerp" in obj, get: obj => obj.dollyScrollLerp, set: (obj, value) => { obj.dollyScrollLerp = value; } }, metadata: _metadata }, _dollyScrollLerp_initializers, _dollyScrollLerp_extraInitializers);
            __esDecorate(null, null, _dollyPinchSlowdown_decorators, { kind: "field", name: "dollyPinchSlowdown", static: false, private: false, access: { has: obj => "dollyPinchSlowdown" in obj, get: obj => obj.dollyPinchSlowdown, set: (obj, value) => { obj.dollyPinchSlowdown = value; } }, metadata: _metadata }, _dollyPinchSlowdown_initializers, _dollyPinchSlowdown_extraInitializers);
            __esDecorate(null, null, _rotationEpsilon_decorators, { kind: "field", name: "rotationEpsilon", static: false, private: false, access: { has: obj => "rotationEpsilon" in obj, get: obj => obj.rotationEpsilon, set: (obj, value) => { obj.rotationEpsilon = value; } }, metadata: _metadata }, _rotationEpsilon_initializers, _rotationEpsilon_extraInitializers);
            __esDecorate(null, null, _rotationSlowdown_decorators, { kind: "field", name: "rotationSlowdown", static: false, private: false, access: { has: obj => "rotationSlowdown" in obj, get: obj => obj.rotationSlowdown, set: (obj, value) => { obj.rotationSlowdown = value; } }, metadata: _metadata }, _rotationSlowdown_initializers, _rotationSlowdown_extraInitializers);
            __esDecorate(null, null, _threeCamera_decorators, { kind: "field", name: "threeCamera", static: false, private: false, access: { has: obj => "threeCamera" in obj, get: obj => obj.threeCamera, set: (obj, value) => { obj.threeCamera = value; } }, metadata: _metadata }, _threeCamera_initializers, _threeCamera_extraInitializers);
            __esDecorate(null, null, _rotationYTarget_decorators, { kind: "field", name: "rotationYTarget", static: false, private: false, access: { has: obj => "rotationYTarget" in obj, get: obj => obj.rotationYTarget, set: (obj, value) => { obj.rotationYTarget = value; } }, metadata: _metadata }, _rotationYTarget_initializers, _rotationYTarget_extraInitializers);
            __esDecorate(null, null, _rotationXTarget_decorators, { kind: "field", name: "rotationXTarget", static: false, private: false, access: { has: obj => "rotationXTarget" in obj, get: obj => obj.rotationXTarget, set: (obj, value) => { obj.rotationXTarget = value; } }, metadata: _metadata }, _rotationXTarget_initializers, _rotationXTarget_extraInitializers);
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
        minVerticalAngle = (__runInitializers(this, _verticalAngle_extraInitializers), __runInitializers(this, _minVerticalAngle_initializers, -90
        /**
         * @deprecated minPolarAngle has been renamed to minVerticalAngle.
         * @property {number} minPolarAngle
         *
         * *deprecated*: minPolarAngle has been renamed to minVerticalAngle.
         */
        ));
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
        maxVerticalAngle = (__runInitializers(this, _minVerticalAngle_extraInitializers), __runInitializers(this, _maxVerticalAngle_initializers, 90
        /**
         * @deprecated maxPolarAngle has been renamed to maxVerticalAngle.
         * @property {number} maxPolarAngle
         *
         * *deprecated*: maxPolarAngle has been renamed to maxVerticalAngle.
         */
        ));
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
        horizontalAngle = (__runInitializers(this, _maxVerticalAngle_extraInitializers), __runInitializers(this, _horizontalAngle_initializers, 0
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
        ));
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
        minHorizontalAngle = (__runInitializers(this, _horizontalAngle_extraInitializers), __runInitializers(this, _minHorizontalAngle_initializers, -Infinity
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
        ));
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
        maxHorizontalAngle = (__runInitializers(this, _minHorizontalAngle_extraInitializers), __runInitializers(this, _maxHorizontalAngle_initializers, Infinity
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
        ));
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
        distance = (__runInitializers(this, _maxHorizontalAngle_extraInitializers), __runInitializers(this, _distance_initializers, -1));
        __appliedDistance = (__runInitializers(this, _distance_extraInitializers), __runInitializers(this, ___appliedDistance_initializers, defaultScenePerspective
        /**
         * @deprecated initialDistance has been renamed to distance.
         * @property {number} initialDistance
         *
         * *deprecated*: initialDistance has been renamed to distance.
         */
        ));
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
        minDistance = (__runInitializers(this, ___appliedDistance_extraInitializers), __runInitializers(this, _minDistance_initializers, -1));
        __appliedMinDistance = (__runInitializers(this, _minDistance_extraInitializers), __runInitializers(this, ___appliedMinDistance_initializers, 200
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
        ));
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
        maxDistance = (__runInitializers(this, ___appliedMinDistance_extraInitializers), __runInitializers(this, _maxDistance_initializers, -1));
        __appliedMaxDistance = (__runInitializers(this, _maxDistance_extraInitializers), __runInitializers(this, ___appliedMaxDistance_initializers, 800
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
         */
        ));
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `true`
         *
         * When `true`, the underlying camera is set to [`active`](./PerspectiveCamera#active).
         */
        active = (__runInitializers(this, ___appliedMaxDistance_extraInitializers), __runInitializers(this, _active_initializers, true
        /**
         * @property {number} dollySpeed
         *
         * *attribute*
         *
         * Default: `1`
         */
        ));
        /**
         * @property {number} dollySpeed
         *
         * *attribute*
         *
         * Default: `1`
         */
        dollySpeed = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _dollySpeed_initializers, 1
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
        ));
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
        interactive = (__runInitializers(this, _dollySpeed_extraInitializers), __runInitializers(this, _interactive_initializers, true
        /**
         * @property {number} rotationSpeed
         *
         * *attribute*
         *
         * Default: `1`
         *
         * How much the camera rotates while dragging.
         */
        ));
        /**
         * @property {number} rotationSpeed
         *
         * *attribute*
         *
         * Default: `1`
         *
         * How much the camera rotates while dragging.
         */
        rotationSpeed = (__runInitializers(this, _interactive_extraInitializers), __runInitializers(this, _rotationSpeed_initializers, 1
        /**
         * @property {boolean} dynamicDolly
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the effective dolly speed will be changed based on the
         * camera's distance to `minDistance`. Getting closer to `minDistance` will
         * lower the effective dolly speed towards zero. This is useful when zoomed
         * into an object and having the dolly movements not be disproportionately
         * huge while viewing fine details of the object.
         */
        ));
        /**
         * @property {boolean} dynamicDolly
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the effective dolly speed will be changed based on the
         * camera's distance to `minDistance`. Getting closer to `minDistance` will
         * lower the effective dolly speed towards zero. This is useful when zoomed
         * into an object and having the dolly movements not be disproportionately
         * huge while viewing fine details of the object.
         */
        dynamicDolly = (__runInitializers(this, _rotationSpeed_extraInitializers), __runInitializers(this, _dynamicDolly_initializers, false
        /**
         * @property {boolean} dynamicRotation
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the effective rotation speed will be changed based on the
         * camera's distance to `minDistance`. Getting closer to `minDistance` will
         * lower the effective rotation speed to allow for finer control. This is useful
         * zoomed in to see fine details of an object and having the rotation not be
         * disproportionately huge, for example when zooming into a 3D globe.
         */
        ));
        /**
         * @property {boolean} dynamicRotation
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the effective rotation speed will be changed based on the
         * camera's distance to `minDistance`. Getting closer to `minDistance` will
         * lower the effective rotation speed to allow for finer control. This is useful
         * zoomed in to see fine details of an object and having the rotation not be
         * disproportionately huge, for example when zooming into a 3D globe.
         */
        dynamicRotation = (__runInitializers(this, _dynamicDolly_extraInitializers), __runInitializers(this, _dynamicRotation_initializers, false
        /**
         * @property {number} dollyEpsilon
         *
         * *attribute*
         *
         * Default: `0.01`
         *
         * The threshold for when to stop dolly smoothing animation (lerp). When the
         * delta between actual dolly position and target dolly position is below
         * this number, animation stops. Set this to a high value to prevent
         * smoothing.
         */
        ));
        /**
         * @property {number} dollyEpsilon
         *
         * *attribute*
         *
         * Default: `0.01`
         *
         * The threshold for when to stop dolly smoothing animation (lerp). When the
         * delta between actual dolly position and target dolly position is below
         * this number, animation stops. Set this to a high value to prevent
         * smoothing.
         */
        dollyEpsilon = (__runInitializers(this, _dynamicRotation_extraInitializers), __runInitializers(this, _dollyEpsilon_initializers, 0.01
        /**
         * @property {number} dollyScrollLerp
         *
         * *attribute*
         *
         * Default: `0.3`
         *
         * The portion to lerp towards the dolly target position each frame after
         * scrolling to dolly the camera. Between 0 and 1.
         */
        ));
        /**
         * @property {number} dollyScrollLerp
         *
         * *attribute*
         *
         * Default: `0.3`
         *
         * The portion to lerp towards the dolly target position each frame after
         * scrolling to dolly the camera. Between 0 and 1.
         */
        dollyScrollLerp = (__runInitializers(this, _dollyEpsilon_extraInitializers), __runInitializers(this, _dollyScrollLerp_initializers, 0.3
        /**
         * @property {number} dollyPinchSlowdown
         *
         * *attribute*
         *
         * Default: `0.05`
         *
         * Portion of the dolly speed to remove each frame to slow down the dolly
         * animation after pinching to dolly the camera, i.e. how much to lerp
         * towards zero motion. Between 0 and 1.
         */
        ));
        /**
         * @property {number} dollyPinchSlowdown
         *
         * *attribute*
         *
         * Default: `0.05`
         *
         * Portion of the dolly speed to remove each frame to slow down the dolly
         * animation after pinching to dolly the camera, i.e. how much to lerp
         * towards zero motion. Between 0 and 1.
         */
        dollyPinchSlowdown = (__runInitializers(this, _dollyScrollLerp_extraInitializers), __runInitializers(this, _dollyPinchSlowdown_initializers, 0.05
        /**
         * @property {number} rotationEpsilon
         *
         * *attribute*
         *
         * Default: `0.01`
         *
         * The threshold for when to stop intertial rotation slowdown animation.
         * When the current frame's change in rotation goes below this number,
         * animation stops. Set this to a high value to prevent inertial slowdown.
         */
        ));
        /**
         * @property {number} rotationEpsilon
         *
         * *attribute*
         *
         * Default: `0.01`
         *
         * The threshold for when to stop intertial rotation slowdown animation.
         * When the current frame's change in rotation goes below this number,
         * animation stops. Set this to a high value to prevent inertial slowdown.
         */
        rotationEpsilon = (__runInitializers(this, _dollyPinchSlowdown_extraInitializers), __runInitializers(this, _rotationEpsilon_initializers, 0.01
        /**
         * @property {number} rotationSlowdown
         *
         * *attribute*
         *
         * Default: `0.05`
         *
         * Portion of the rotational speed to remove each frame to slow down the
         * rotation after dragging to rotate the camera, i.e. how much to lerp
         * towards zero motion. Between 0 and 1.
         */
        ));
        /**
         * @property {number} rotationSlowdown
         *
         * *attribute*
         *
         * Default: `0.05`
         *
         * Portion of the rotational speed to remove each frame to slow down the
         * rotation after dragging to rotate the camera, i.e. how much to lerp
         * towards zero motion. Between 0 and 1.
         */
        rotationSlowdown = (__runInitializers(this, _rotationEpsilon_extraInitializers), __runInitializers(this, _rotationSlowdown_initializers, 0.05));
        threeCamera = (__runInitializers(this, _rotationSlowdown_extraInitializers), __runInitializers(this, _threeCamera_initializers, void 0));
        /** @deprecated Use `.threeCamera` instead. */
        get cam() {
            return this.threeCamera;
        }
        rotationYTarget = (__runInitializers(this, _threeCamera_extraInitializers), __runInitializers(this, _rotationYTarget_initializers, void 0));
        rotationXTarget = (__runInitializers(this, _rotationYTarget_extraInitializers), __runInitializers(this, _rotationXTarget_initializers, void 0));
        flingRotation = (__runInitializers(this, _rotationXTarget_extraInitializers), new FlingRotation());
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
                // Sync __appliedDistance to scrollFling.y and vice versa
                syncSignals(() => this.__appliedDistance, (d) => (this.__appliedDistance = d), () => this.scrollFling.y, (y) => (this.scrollFling.y = y));
                // Sync scrollFling.y to pinchFling.x and vice versa
                syncSignals(() => this.scrollFling.y, (y) => (this.scrollFling.y = y), () => this.pinchFling.x, (x) => (this.pinchFling.x = x));
                this.createEffect(() => {
                    flingRotation.minFlingRotationX = this.minVerticalAngle;
                    flingRotation.maxFlingRotationX = this.maxVerticalAngle;
                    flingRotation.minFlingRotationY = this.minHorizontalAngle;
                    flingRotation.maxFlingRotationY = this.maxHorizontalAngle;
                    flingRotation.factor = this.rotationSpeed;
                    flingRotation.epsilon = this.rotationEpsilon;
                    flingRotation.slowdownAmount = this.rotationSlowdown;
                    scrollFling.minY = pinchFling.minX = this.__appliedMinDistance;
                    scrollFling.maxY = pinchFling.maxX = this.__appliedMaxDistance;
                    scrollFling.sensitivity = pinchFling.sensitivity = this.dollySpeed;
                    scrollFling.epsilon = pinchFling.epsilon = this.dollyEpsilon;
                    scrollFling.lerpAmount = this.dollyScrollLerp;
                    pinchFling.slowdownAmount = this.dollyPinchSlowdown;
                });
                this.createEffect(() => {
                    if (!this.dynamicDolly)
                        return;
                    // Dolly speed when position is at minDistance
                    const minDollySpeed = 0.001;
                    // Dolly speed when position is at maxDistance
                    const maxDollySpeed = 2 * this.dollySpeed;
                    // Scroll sensitivity is linear between min/max dolly speed and min/max distance.
                    const sens = ((maxDollySpeed - minDollySpeed) / (this.maxDistance - this.minDistance)) *
                        (this.threeCamera.position.z - this.minDistance) +
                        minDollySpeed;
                    scrollFling.sensitivity = sens < minDollySpeed ? minDollySpeed : sens;
                });
                this.createEffect(() => {
                    if (!this.dynamicRotation)
                        return;
                    // This only depends on the size of the scene and the FOV of the camera. The only
                    // issue is the camera's FOV is not reactive and is set by the scene at some point.
                    // In the case where the camera's FOV is not set yet, use the scene's perspective.
                    const perspective = this.threeCamera.three.fov
                        ? this.scene.calculatedSize.y / 2 / Math.tan((this.threeCamera.three.fov * Math.PI) / 360)
                        : this.scene.perspective;
                    // Plane positioned at origin facing camera with width equal to `minDistance`.
                    // `minDistance` is doubled because the expected `minDistance` should barely touch
                    // the object, whose size would be double `minDistance`.
                    const planeSize = (perspective * (this.minDistance * 2)) / this.threeCamera.position.z;
                    const degreesPerPixel = 180 / planeSize;
                    // Counteract the FlingRotation's delta modifier to get exact angular movement.
                    const sens = (1 / 0.15) * degreesPerPixel * this.rotationSpeed;
                    this.flingRotation.factor = sens <= 0 ? 1 : sens;
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
						far="100000"
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