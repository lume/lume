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
import { onCleanup, untrack } from 'solid-js';
import { booleanAttribute, element, numberAttribute } from '@lume/element';
import { Camera as ThreeCamera } from 'three/src/cameras/Camera.js';
import { Element3D } from '../core/Element3D.js';
import { OrthographicCamera, PerspectiveCamera } from 'three';
// | 'lookAt' // TODO
/**
 * @class Camera
 *
 * Base class for all camera elements, f.e. [`<lume-perspective-camera>`](./PerspectiveCamera).
 *
 * @extends Element3D
 */
let Camera = (() => {
    let _classDecorators = [element];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _aspect_decorators;
    let _aspect_initializers = [];
    let _aspect_extraInitializers = [];
    let _near_decorators;
    let _near_initializers = [];
    let _near_extraInitializers = [];
    let _far_decorators;
    let _far_initializers = [];
    let _far_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _zoom_decorators;
    let _zoom_initializers = [];
    let _zoom_extraInitializers = [];
    var Camera = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _aspect_decorators = [numberAttribute];
            _near_decorators = [numberAttribute];
            _far_decorators = [numberAttribute];
            _active_decorators = [booleanAttribute];
            _zoom_decorators = [numberAttribute];
            __esDecorate(null, null, _aspect_decorators, { kind: "field", name: "aspect", static: false, private: false, access: { has: obj => "aspect" in obj, get: obj => obj.aspect, set: (obj, value) => { obj.aspect = value; } }, metadata: _metadata }, _aspect_initializers, _aspect_extraInitializers);
            __esDecorate(null, null, _near_decorators, { kind: "field", name: "near", static: false, private: false, access: { has: obj => "near" in obj, get: obj => obj.near, set: (obj, value) => { obj.near = value; } }, metadata: _metadata }, _near_initializers, _near_extraInitializers);
            __esDecorate(null, null, _far_decorators, { kind: "field", name: "far", static: false, private: false, access: { has: obj => "far" in obj, get: obj => obj.far, set: (obj, value) => { obj.far = value; } }, metadata: _metadata }, _far_initializers, _far_extraInitializers);
            __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
            __esDecorate(null, null, _zoom_decorators, { kind: "field", name: "zoom", static: false, private: false, access: { has: obj => "zoom" in obj, get: obj => obj.zoom, set: (obj, value) => { obj.zoom = value; } }, metadata: _metadata }, _zoom_initializers, _zoom_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Camera = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
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
        near = (__runInitializers(this, _aspect_extraInitializers), __runInitializers(this, _near_initializers, 1
        /**
         * @property {number} far
         *
         * *attribute*
         *
         * Default: `3000`
         *
         * Anything further from the camera than this value will not be rendered.
         */
        ));
        /**
         * @property {number} far
         *
         * *attribute*
         *
         * Default: `3000`
         *
         * Anything further from the camera than this value will not be rendered.
         */
        far = (__runInitializers(this, _near_extraInitializers), __runInitializers(this, _far_initializers, 3000
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
        ));
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
        active = (__runInitializers(this, _far_extraInitializers), __runInitializers(this, _active_initializers, false
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
        ));
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
        zoom = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _zoom_initializers, 1
        // TODO lookat property
        // @attribute lookAt: string | Element3D | null = null
        ));
        // TODO lookat property
        // @attribute lookAt: string | Element3D | null = null
        connectedCallback() {
            super.connectedCallback();
            let lastScene = this.scene;
            // Run logic once the scene exists.
            this.createEffect(() => {
                // If we have a scene, we're composed, otherwise we're not (could be connected, but not slotted)
                if (!this.scene || !this.active)
                    return;
                lastScene = this.scene;
                untrack(() => this.scene._addCamera(this));
                onCleanup(() => {
                    lastScene._removeCamera(this);
                    lastScene = null;
                });
            });
            if (this.three instanceof PerspectiveCamera || this.three instanceof OrthographicCamera) {
                const camera = this.three || OrthographicCamera;
                this.createEffect(() => {
                    camera.near = this.near;
                    camera.updateProjectionMatrix();
                    this.needsUpdate();
                });
                this.createEffect(() => {
                    camera.far = this.far;
                    camera.updateProjectionMatrix();
                    this.needsUpdate();
                });
                this.createEffect(() => {
                    camera.zoom = this.zoom;
                    camera.updateProjectionMatrix();
                    this.needsUpdate();
                });
            }
        }
        // This is not called because this class is abstract and should be extended
        // by concrete camera elements, but it provides types for locations that use
        // `Camera` as a type place holder f.e. in the `Scene` class.
        makeThreeObject3d() {
            return new ThreeCamera();
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _zoom_extraInitializers);
        }
    };
    return Camera = _classThis;
})();
export { Camera };
//# sourceMappingURL=Camera.js.map