// Useful info on THREE.Plane not covered in Three.js docs:
// https://www.columbia.edu/~njn2118/journal/2019/2/18.html
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
import { element } from '@lume/element';
import { Plane } from 'three/src/math/Plane.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { createSignal } from 'solid-js';
import { Element3D } from './Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
// Make the clip plane clip anything in front of it (towards the default
// camera). Three.js clips anything along -Z, so we negate Z to clip along +Z
// towards the camera by default.
const clipNormal = [0, 0, -1];
/**
 * @class ClipPlane
 *
 * Element: `lume-clip-plane`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to clip an
 * element on one side of the plane. The plane is infinite.
 *
 * To visualize a portion of the plane, we can place a `<lume-plane>` as a
 * child of a `<lume-clip-plane>`, as in the below example.
 *
 * To clip an element, add a
 * [`clip-planes`](../behaviors/mesh-behaviors/ClipPlanesBehavior) behavior to the
 * element with the `has=""` attribute, then assign any number of connected
 * `<lume-clip-plane>` elements to the element's `clipPlanes` property.
 *
 * <div id="clipPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#clipPlaneExample', data: { code: clipPlaneExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends Element3D
 */
let ClipPlane = (() => {
    let _classDecorators = [element('lume-clip-plane', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    var ClipPlane = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClipPlane = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #plane = createSignal(null);
        #inversePlane = createSignal(null);
        // The __clip and __inverseClip properties are used by `ClipPlanesBehavior`
        /**
         * *reactive* *readonly*
         *
         * Returns the underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
         * for the scene and the element participates in rendering.
         */
        get __clip() {
            return this.#plane[0]();
        }
        /**
         * *reactive* *readonly*
         *
         * Returns the inverse underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
         * for the scene and the element participates in rendering.
         */
        get __inverseClip() {
            return this.#inversePlane[0]();
        }
        _loadGL() {
            if (!super._loadGL())
                return false;
            this.#plane[1](new Plane(new Vector3(...clipNormal)));
            this.#inversePlane[1](new Plane(new Vector3(...clipNormal).negate()));
            return true;
        }
        _unloadGL() {
            if (!super._unloadGL())
                return false;
            this.#plane[1](null);
            this.#inversePlane[1](null);
            return true;
        }
        updateWorldMatrices() {
            super.updateWorldMatrices();
            const plane = this.#plane[0]();
            const inverse = this.#inversePlane[0]();
            // These only exist if WebGL mode is enabled.
            if (!plane || !inverse)
                return;
            plane.normal.set(...clipNormal);
            plane.constant = 0;
            inverse.normal.set(...clipNormal).negate();
            inverse.constant = 0;
            // Clip planes are world-positioned.
            plane.applyMatrix4(this.three.matrixWorld);
            inverse.applyMatrix4(this.three.matrixWorld);
        }
    };
    return ClipPlane = _classThis;
})();
export { ClipPlane };
//# sourceMappingURL=ClipPlane.js.map