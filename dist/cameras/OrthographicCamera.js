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
import { OrthographicCamera as ThreeOrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Camera } from './Camera.js';
import { autoDefineElements } from '../LumeConfig.js';
/**
 * @class OrthographicCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * Camera that uses orthographic projection.
 *
 * In this projection mode, an object's size in the rendered image stays constant regardless of
 * its distance from the camera.
 *
 * This can be useful for rendering 2D scenes and UI elements, amongst other things.
 *
 * @extends Camera
 */
let OrthographicCamera = (() => {
    let _classDecorators = [element('lume-orthographic-camera', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Camera;
    let _left_decorators;
    let _left_initializers = [];
    let _left_extraInitializers = [];
    let _right_decorators;
    let _right_initializers = [];
    let _right_extraInitializers = [];
    let _top_decorators;
    let _top_initializers = [];
    let _top_extraInitializers = [];
    let _bottom_decorators;
    let _bottom_initializers = [];
    let _bottom_extraInitializers = [];
    var OrthographicCamera = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _left_decorators = [numberAttribute];
            _right_decorators = [numberAttribute];
            _top_decorators = [numberAttribute];
            _bottom_decorators = [numberAttribute];
            __esDecorate(null, null, _left_decorators, { kind: "field", name: "left", static: false, private: false, access: { has: obj => "left" in obj, get: obj => obj.left, set: (obj, value) => { obj.left = value; } }, metadata: _metadata }, _left_initializers, _left_extraInitializers);
            __esDecorate(null, null, _right_decorators, { kind: "field", name: "right", static: false, private: false, access: { has: obj => "right" in obj, get: obj => obj.right, set: (obj, value) => { obj.right = value; } }, metadata: _metadata }, _right_initializers, _right_extraInitializers);
            __esDecorate(null, null, _top_decorators, { kind: "field", name: "top", static: false, private: false, access: { has: obj => "top" in obj, get: obj => obj.top, set: (obj, value) => { obj.top = value; } }, metadata: _metadata }, _top_initializers, _top_extraInitializers);
            __esDecorate(null, null, _bottom_decorators, { kind: "field", name: "bottom", static: false, private: false, access: { has: obj => "bottom" in obj, get: obj => obj.bottom, set: (obj, value) => { obj.bottom = value; } }, metadata: _metadata }, _bottom_initializers, _bottom_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            OrthographicCamera = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} left
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum left plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        left = __runInitializers(this, _left_initializers, 0
        /**
         * @property {number} right
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum right plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        );
        /**
         * @property {number} right
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum right plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        right = (__runInitializers(this, _left_extraInitializers), __runInitializers(this, _right_initializers, 0
        /**
         * @property {number} top
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum top plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        ));
        /**
         * @property {number} top
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum top plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        top = (__runInitializers(this, _right_extraInitializers), __runInitializers(this, _top_initializers, 0
        /**
         * @property {number} bottom
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum bottom plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        ));
        /**
         * @property {number} bottom
         *
         * *attribute*
         *
         * Default: `0`
         *
         * Camera frustum bottom plane.
         *
         * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
         * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
         */
        bottom = (__runInitializers(this, _top_extraInitializers), __runInitializers(this, _bottom_initializers, 0));
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                this.three.left = this.left;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.right = this.right;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.top = this.top;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.bottom = this.bottom;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
            this.createEffect(() => {
                if (!this.scene) {
                    return;
                }
                if (this.left || this.right || this.top || this.bottom) {
                    this.three.updateProjectionMatrix();
                    this.needsUpdate();
                    return;
                }
                // Auto set camera.
                this.three.left = -this.scene.calculatedSize.x / 2;
                this.three.right = this.scene.calculatedSize.x / 2;
                this.three.top = this.scene.calculatedSize.y / 2;
                this.three.bottom = -this.scene.calculatedSize.y / 2;
                this.three.updateProjectionMatrix();
                this.needsUpdate();
            });
        }
        makeThreeObject3d() {
            return new ThreeOrthographicCamera();
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _bottom_extraInitializers);
        }
    };
    return OrthographicCamera = _classThis;
})();
export { OrthographicCamera };
//# sourceMappingURL=OrthographicCamera.js.map