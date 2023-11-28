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
import { createEffect, createRoot, untrack } from 'solid-js';
import { numberAttribute, booleanAttribute, element } from '@lume/element';
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
// | 'lookAt' // TODO
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
 *   example.code = perspectiveCameraExample
 * </script>
 *
 * @extends Element3D
 */
let PerspectiveCamera = (() => {
    let _classDecorators = [element('lume-perspective-camera', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _instanceExtraInitializers = [];
    let _fov_decorators;
    let _fov_initializers = [];
    let _aspect_decorators;
    let _aspect_initializers = [];
    let _near_decorators;
    let _near_initializers = [];
    let _far_decorators;
    let _far_initializers = [];
    let _zoom_decorators;
    let _zoom_initializers = [];
    let _active_decorators;
    let _active_initializers = [];
    var PerspectiveCamera = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _fov_decorators = [numberAttribute];
            _aspect_decorators = [numberAttribute];
            _near_decorators = [numberAttribute];
            _far_decorators = [numberAttribute];
            _zoom_decorators = [numberAttribute];
            _active_decorators = [booleanAttribute];
            __esDecorate(null, null, _fov_decorators, { kind: "field", name: "fov", static: false, private: false, access: { has: obj => "fov" in obj, get: obj => obj.fov, set: (obj, value) => { obj.fov = value; } }, metadata: _metadata }, _fov_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _aspect_decorators, { kind: "field", name: "aspect", static: false, private: false, access: { has: obj => "aspect" in obj, get: obj => obj.aspect, set: (obj, value) => { obj.aspect = value; } }, metadata: _metadata }, _aspect_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _near_decorators, { kind: "field", name: "near", static: false, private: false, access: { has: obj => "near" in obj, get: obj => obj.near, set: (obj, value) => { obj.near = value; } }, metadata: _metadata }, _near_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _far_decorators, { kind: "field", name: "far", static: false, private: false, access: { has: obj => "far" in obj, get: obj => obj.far, set: (obj, value) => { obj.far = value; } }, metadata: _metadata }, _far_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _zoom_decorators, { kind: "field", name: "zoom", static: false, private: false, access: { has: obj => "zoom" in obj, get: obj => obj.zoom, set: (obj, value) => { obj.zoom = value; } }, metadata: _metadata }, _zoom_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _instanceExtraInitializers);
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
         * Default: `50`
         *
         * The camera's field of view angle, in degrees, when [`zoom`](#zoom) level
         * is `1`.
         */
        fov = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _fov_initializers, 50
        /**
         * @property {number} aspect
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A value of `0` sets the aspect ratio to automatic, based on the
         * dimensions of a scene.  You normally don't want to modify this, but in
         * case of stretched or squished display, this can be adjusted appropriately
         * to unstretch or unsquish the view of the 3d world.
         */
        ));
        /**
         * @property {number} aspect
         *
         * *attribute*
         *
         * Default: `0`
         *
         * A value of `0` sets the aspect ratio to automatic, based on the
         * dimensions of a scene.  You normally don't want to modify this, but in
         * case of stretched or squished display, this can be adjusted appropriately
         * to unstretch or unsquish the view of the 3d world.
         */
        aspect = __runInitializers(this, _aspect_initializers, 0
        /**
         * @property {number} near
         *
         * *attribute*
         *
         * Default: `1`
         *
         * Anything closer to the camera than this value will not be rendered.
         */
        );
        /**
         * @property {number} near
         *
         * *attribute*
         *
         * Default: `1`
         *
         * Anything closer to the camera than this value will not be rendered.
         */
        near = __runInitializers(this, _near_initializers, 1
        /**
         * @property {number} far
         *
         * *attribute*
         *
         * Default: `3000`
         *
         * Anything further from the camera than this value will not be rendered.
         */
        );
        /**
         * @property {number} far
         *
         * *attribute*
         *
         * Default: `3000`
         *
         * Anything further from the camera than this value will not be rendered.
         */
        far = __runInitializers(this, _far_initializers, 3000
        /**
         * @property {number} zoom
         *
         * *attribute*
         *
         * Default: `1`
         *
         * The zoom level of the camera modifies the effective field of view.
         * Increasing the zoom will decrease the effective field of view, and vice
         * versa. At zoom level `1`, the effective field of view is equivalent to
         * [`fov`](#fov).
         */
        );
        /**
         * @property {number} zoom
         *
         * *attribute*
         *
         * Default: `1`
         *
         * The zoom level of the camera modifies the effective field of view.
         * Increasing the zoom will decrease the effective field of view, and vice
         * versa. At zoom level `1`, the effective field of view is equivalent to
         * [`fov`](#fov).
         */
        zoom = __runInitializers(this, _zoom_initializers, 1
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the camera will be used as the viewport into the 3D scene,
         * instead of the scene's default camera. When set back to `false`, the last
         * camera that was set (and is still) active will be used, or if no other
         * cameras are active the scene's default camera will be used.
         */
        );
        /**
         * @property {boolean} active
         *
         * *attribute*
         *
         * Default: `false`
         *
         * When `true`, the camera will be used as the viewport into the 3D scene,
         * instead of the scene's default camera. When set back to `false`, the last
         * camera that was set (and is still) active will be used, or if no other
         * cameras are active the scene's default camera will be used.
         */
        active = __runInitializers(this, _active_initializers, false
        // TODO lookat property
        // @attribute lookat: string | Element3D | null = null
        );
        // TODO lookat property
        // @attribute lookat: string | Element3D | null = null
        connectedCallback() {
            super.connectedCallback();
            // Run logic once the scene exists.
            createRoot(dispose => {
                createEffect(() => {
                    if (!this.scene)
                        return;
                    untrack(() => {
                        this.#lastKnownScene = this.scene;
                        this.#setSceneCamera(this.active ? undefined : 'unset');
                        queueMicrotask(() => dispose());
                    });
                });
            });
            // TODO ^ once(condition) to make the above simpler, F.e.:
            //
            // once(() => this.scene).then(() => {
            // 	this.__lastKnownScene = this.scene
            // 	this.__setSceneCamera(this.active ? undefined : 'unset')
            // })
            this.createEffect(() => {
                this.three.fov = this.fov;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                // Any value other than zero means the user supplied an aspect
                // ratio manually. Stop auto-aspect in that case.
                if (this.aspect !== 0) {
                    this.three.aspect = this.aspect;
                    this.three.updateProjectionMatrix();
                    return;
                }
                let aspect = 0;
                if (this.scene)
                    aspect = this.scene.calculatedSize.x / this.scene.calculatedSize.y;
                // in case of a 0 or NaN (f.e. 0 / 0 == NaN)
                if (!aspect)
                    aspect = 16 / 9;
                this.three.aspect = aspect;
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
            this.createEffect(() => {
                const active = this.active;
                untrack(() => {
                    this.#setSceneCamera(active ? undefined : 'unset');
                });
                this.needsUpdate(); // TODO need this? Cameras don't render as anything, maybe they don't need an update in this case.
            });
        }
        makeThreeObject3d() {
            return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000);
        }
        // TODO make sure this works. Camera should switch to scene's default on
        // removal of last camera, etc.
        disconnectedCallback() {
            super.disconnectedCallback();
            this.#setSceneCamera('unset');
            this.#lastKnownScene = null;
        }
        #lastKnownScene = null;
        #setSceneCamera(unset) {
            if (unset) {
                if (this.#lastKnownScene)
                    this.#lastKnownScene._removeCamera(this);
            }
            else {
                if (!this.scene || !this.isConnected)
                    return;
                this.scene._addCamera(this);
            }
        }
    };
    return PerspectiveCamera = _classThis;
})();
export { PerspectiveCamera };
//# sourceMappingURL=PerspectiveCamera.js.map