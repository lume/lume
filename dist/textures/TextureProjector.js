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
import { signal } from 'classy-solid';
import { booleanAttribute, element, stringAttribute } from '@lume/element';
import { createEffect } from 'solid-js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
// | 'frontFacesOnly'
/**
 * @class TextureProjector
 *
 * Element: `<lume-texture-projector>`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to project a
 * texture onto mesh elements that have `projected-material` behaviors.
 *
 * For now only one `<lume-texture-projector>` can be associated to a mesh, and
 * only with an orthographic projection (perpendicular to the plane, i.e. along
 * the direction the plane is facing). Later on we'll support perspective
 * projection and multiple projections.
 *
 * To project a texture onto a mesh element, add a
 * [`projected-material`](../behaviors/mesh-behaviors/ProjectedMaterialBehavior)
 * behavior to the element using the `has=""` attribute, then assign an array of
 * `<lume-texture-projector>` elements, or a string of comma-separated CSS
 * selectors, to the element's `projectedTextures` property. The equivalent
 * dash-case attribute accepts only the string of selectors. Only the first
 * texture is used, for now.
 *
 * <div id="projectedTextureExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#projectedTextureExample', data: { code: projectedTextureExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends Element3D
 */
let TextureProjector = (() => {
    let _classDecorators = [element('lume-texture-projector', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _instanceExtraInitializers = [];
    let _src_decorators;
    let _src_initializers = [];
    let _fitment_decorators;
    let _fitment_initializers = [];
    let _frontFacesOnly_decorators;
    let _frontFacesOnly_initializers = [];
    let __camera_decorators;
    let __camera_initializers = [];
    var TextureProjector = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _src_decorators = [stringAttribute];
            _fitment_decorators = [stringAttribute];
            _frontFacesOnly_decorators = [booleanAttribute];
            __camera_decorators = [signal];
            __esDecorate(null, null, _src_decorators, { kind: "field", name: "src", static: false, private: false, access: { has: obj => "src" in obj, get: obj => obj.src, set: (obj, value) => { obj.src = value; } }, metadata: _metadata }, _src_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _fitment_decorators, { kind: "field", name: "fitment", static: false, private: false, access: { has: obj => "fitment" in obj, get: obj => obj.fitment, set: (obj, value) => { obj.fitment = value; } }, metadata: _metadata }, _fitment_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _frontFacesOnly_decorators, { kind: "field", name: "frontFacesOnly", static: false, private: false, access: { has: obj => "frontFacesOnly" in obj, get: obj => obj.frontFacesOnly, set: (obj, value) => { obj.frontFacesOnly = value; } }, metadata: _metadata }, _frontFacesOnly_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, __camera_decorators, { kind: "field", name: "_camera", static: false, private: false, access: { has: obj => "_camera" in obj, get: obj => obj._camera, set: (obj, value) => { obj._camera = value; } }, metadata: _metadata }, __camera_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TextureProjector = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // This element is only a data and camera container, and
        // ProjectedMaterialBehavior reacts to the properties.
        // TODO selector or ref to <video>, <img>, and other elements. If a animated
        // (f.e. <video>) the texture should reflect that accordingly.
        /**
         * @property {string} src
         *
         * `attribute`
         *
         * Default: `''`
         *
         * The path to an image to be used as a projected
         * texture.
         */
        src = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _src_initializers, ''
        /**
         * @property {'cover' | 'contain'} fitment
         *
         * `attribute`
         *
         * Default: `'cover'`
         *
         * Fitment of the image within the size area on X and Y. Similar to the CSS
         * object-fit property, but supporting only "cover" and "contain" fitments.
         */
        ));
        /**
         * @property {'cover' | 'contain'} fitment
         *
         * `attribute`
         *
         * Default: `'cover'`
         *
         * Fitment of the image within the size area on X and Y. Similar to the CSS
         * object-fit property, but supporting only "cover" and "contain" fitments.
         */
        fitment = __runInitializers(this, _fitment_initializers, 'cover'
        /* FIXME - documentation not exposed yet, experimental, does not work yet due to this issue:
         * https://github.com/marcofugaro/three-projected-material/issues/46
         *
         * @property {boolean} frontFacesOnly
         *
         * `attribute`
         *
         * Default: `false`
         *
         * If `true`, the texture is projected only onto faces facing the projector
         * (this element), similar to a real life projector. Otherwise, the
         * projection hits all surfaces, even those facing away from the projector
         * (this element).
         */
        );
        /* FIXME - documentation not exposed yet, experimental, does not work yet due to this issue:
         * https://github.com/marcofugaro/three-projected-material/issues/46
         *
         * @property {boolean} frontFacesOnly
         *
         * `attribute`
         *
         * Default: `false`
         *
         * If `true`, the texture is projected only onto faces facing the projector
         * (this element), similar to a real life projector. Otherwise, the
         * projection hits all surfaces, even those facing away from the projector
         * (this element).
         */
        frontFacesOnly = __runInitializers(this, _frontFacesOnly_initializers, false
        // textureScale?: number
        // textureOffset?: Vector2
        // TODO support also perspective projection
        );
        // textureScale?: number
        // textureOffset?: Vector2
        // TODO support also perspective projection
        _camera = __runInitializers(this, __camera_initializers, null);
        _loadGL() {
            if (!super._loadGL())
                return false;
            this._camera = new OrthographicCamera();
            this.three.add(this._camera);
            // setTimeout(() => {
            // 	setInterval(() => {
            // 		this.three.remove(this._camera!)
            // 		this._camera =
            // 			this._camera instanceof OrthographicCamera ? new PerspectiveCamera() : new OrthographicCamera()
            // 		this.three.add(this._camera)
            // 	}, 500)
            // }, 3000)
            // Motor.addRenderTask(() => {
            // 	this._camera!.rotation.y += 0.005
            // })
            this.createGLEffect(() => {
                // CAM HELPER
                // const sphere = new Mesh(new SphereGeometry(10), new MeshPhongMaterial({color: 'white'}))
                // this._camera!.add(sphere)
                // const helper = new CameraHelper(this._camera!)
                // this.scene?.three.add(helper)
                // createEffect(() => {
                // 	this.version
                // 	this._camera?.updateProjectionMatrix()
                // 	helper.update()
                // })
                createEffect(() => {
                    const size = this.calculatedSize;
                    const cam = this._camera;
                    if (cam instanceof OrthographicCamera) {
                        cam.left = -size.x / 2;
                        cam.right = size.x / 2;
                        cam.top = size.y / 2; // positive Y is up in Three
                        cam.bottom = -size.y / 2;
                        // cam.near and cam.far don't matter for projection when using OrthographicCamera
                    }
                    else {
                        cam.near = 1;
                        cam.far = 10000;
                        cam.aspect = 1;
                        cam.fov = 45;
                    }
                    cam.updateProjectionMatrix();
                    // CAM HELPER
                    // helperCamera.copy(cam)
                    // helperCamera.updateProjectionMatrix()
                    // helper.update()
                    this.needsUpdate();
                });
            });
            return true;
        }
        _unloadGL() {
            if (!super._unloadGL())
                return false;
            this.three.remove(this._camera);
            this._camera = null;
            return true;
        }
    };
    return TextureProjector = _classThis;
})();
export { TextureProjector };
//# sourceMappingURL=TextureProjector.js.map