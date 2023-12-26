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
import { numberAttribute, element } from '@lume/element';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Camera } from './Camera.js';
import { autoDefineElements } from '../LumeConfig.js';
import { defaultScenePerspective } from '../constants.js';
// TODO auto-adjust position of three camera based on scene.perspective relative to element's origin. See Scene.perspective.
/**
 * @class PerspectiveCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * A perspective camera is very similar to a camera in the real world: it has a
 * field of view (fov) such that more things in the world are visible further away from
 * the camera, while less can fit into view closer to the camera.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = perspectiveCameraExample
 * </script>
 *
 * @extends Camera
 */
let PerspectiveCamera = (() => {
    let _classDecorators = [element('lume-perspective-camera', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Camera;
    let _instanceExtraInitializers = [];
    let _fov_decorators;
    let _fov_initializers = [];
    var PerspectiveCamera = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _fov_decorators = [numberAttribute];
            __esDecorate(null, null, _fov_decorators, { kind: "field", name: "fov", static: false, private: false, access: { has: obj => "fov" in obj, get: obj => obj.fov, set: (obj, value) => { obj.fov = value; } }, metadata: _metadata }, _fov_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PerspectiveCamera = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} fov
         *
         * *attribute*
         *
         * Default: `0`
         *
         * The camera's field of view angle, in degrees, when the [`zoom`](#zoom)
         * level is `1`.
         *
         * A value of `0` means automatic fov based on the current Scene's
         * [`.perspective`](../core/Scene#perspective), matching the behavior of [CSS
         * `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
         */
        fov = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _fov_initializers, 0));
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                if (this.fov !== 0) {
                    this.three.fov = this.fov;
                    this.three.updateProjectionMatrix();
                    this.needsUpdate();
                    return;
                }
                // AUTO FOV //////////////////////////
                // Uses the scene `perspective` to match behavior of CSS `perspective`
                const perspective = this.scene?.perspective ?? defaultScenePerspective;
                const sceneSize = this.scene?.calculatedSize ?? { x: 1, y: 1, z: 0 };
                // This math is what sets the FOV of the default camera so that a
                // viewport-sized plane will fit exactly within the view when it is
                // positioned at the world origin 0,0,0, as described in the
                // `perspective` property's description.
                // For more details: https://discourse.threejs.org/t/269/28
                this.three.fov = (180 * (2 * Math.atan(sceneSize.y / 2 / perspective))) / Math.PI;
                ////////////////////////////
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                // Any value other than zero means the user supplied an aspect
                // ratio manually. Stop auto-aspect in that case.
                if (this.aspect !== 0) {
                    this.three.aspect = this.aspect;
                    this.three.updateProjectionMatrix();
                    this.needsUpdate();
                    return;
                }
                // AUTO ASPECT /////////////////////////////
                const sceneSize = this.scene?.calculatedSize || { x: 1, y: 1 };
                // '|| 1' in case of a 0 or NaN (f.e. 0 / 0 == NaN)
                this.three.aspect = sceneSize.x / sceneSize.y || 1;
                ////////////////////////////
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.near = this.near;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.far = this.far;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.zoom = this.zoom;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
        }
        makeThreeObject3d() {
            return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000);
        }
    };
    return PerspectiveCamera = _classThis;
})();
export { PerspectiveCamera };
//# sourceMappingURL=PerspectiveCamera.js.map