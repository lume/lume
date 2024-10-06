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
import { numberAttribute, booleanAttribute, element } from '@lume/element';
import { Light } from './Light.js';
/**
 * @abstract
 * @class LightWithShadow -
 *
 * `abstract`
 *
 * An abstract base class for light elements that can cast shadows, such as
 * [PointLight](./PointLight), [SpotLight](./SpotLight), and
 * [DirectionalLight](./DirectionalLight).
 *
 * Lights that can have shadows have a shadow camera for shadow projection. The
 * camera can be a perspective camera or an orthographic camera depending on the
 * type of light. The properties in this class are common for either type of
 * shadow camera.
 *
 * @extends Light
 */
let LightWithShadow = (() => {
    let _classDecorators = [element];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Light;
    let _castShadow_decorators;
    let _castShadow_initializers = [];
    let _castShadow_extraInitializers = [];
    let _shadowMapWidth_decorators;
    let _shadowMapWidth_initializers = [];
    let _shadowMapWidth_extraInitializers = [];
    let _shadowMapHeight_decorators;
    let _shadowMapHeight_initializers = [];
    let _shadowMapHeight_extraInitializers = [];
    let _shadowRadius_decorators;
    let _shadowRadius_initializers = [];
    let _shadowRadius_extraInitializers = [];
    let _shadowBias_decorators;
    let _shadowBias_initializers = [];
    let _shadowBias_extraInitializers = [];
    let _shadowNormalBias_decorators;
    let _shadowNormalBias_initializers = [];
    let _shadowNormalBias_extraInitializers = [];
    let _shadowCameraNear_decorators;
    let _shadowCameraNear_initializers = [];
    let _shadowCameraNear_extraInitializers = [];
    let _shadowCameraFar_decorators;
    let _shadowCameraFar_initializers = [];
    let _shadowCameraFar_extraInitializers = [];
    var LightWithShadow = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _castShadow_decorators = [booleanAttribute];
            _shadowMapWidth_decorators = [numberAttribute];
            _shadowMapHeight_decorators = [numberAttribute];
            _shadowRadius_decorators = [numberAttribute];
            _shadowBias_decorators = [numberAttribute];
            _shadowNormalBias_decorators = [numberAttribute];
            _shadowCameraNear_decorators = [numberAttribute];
            _shadowCameraFar_decorators = [numberAttribute];
            __esDecorate(null, null, _castShadow_decorators, { kind: "field", name: "castShadow", static: false, private: false, access: { has: obj => "castShadow" in obj, get: obj => obj.castShadow, set: (obj, value) => { obj.castShadow = value; } }, metadata: _metadata }, _castShadow_initializers, _castShadow_extraInitializers);
            __esDecorate(null, null, _shadowMapWidth_decorators, { kind: "field", name: "shadowMapWidth", static: false, private: false, access: { has: obj => "shadowMapWidth" in obj, get: obj => obj.shadowMapWidth, set: (obj, value) => { obj.shadowMapWidth = value; } }, metadata: _metadata }, _shadowMapWidth_initializers, _shadowMapWidth_extraInitializers);
            __esDecorate(null, null, _shadowMapHeight_decorators, { kind: "field", name: "shadowMapHeight", static: false, private: false, access: { has: obj => "shadowMapHeight" in obj, get: obj => obj.shadowMapHeight, set: (obj, value) => { obj.shadowMapHeight = value; } }, metadata: _metadata }, _shadowMapHeight_initializers, _shadowMapHeight_extraInitializers);
            __esDecorate(null, null, _shadowRadius_decorators, { kind: "field", name: "shadowRadius", static: false, private: false, access: { has: obj => "shadowRadius" in obj, get: obj => obj.shadowRadius, set: (obj, value) => { obj.shadowRadius = value; } }, metadata: _metadata }, _shadowRadius_initializers, _shadowRadius_extraInitializers);
            __esDecorate(null, null, _shadowBias_decorators, { kind: "field", name: "shadowBias", static: false, private: false, access: { has: obj => "shadowBias" in obj, get: obj => obj.shadowBias, set: (obj, value) => { obj.shadowBias = value; } }, metadata: _metadata }, _shadowBias_initializers, _shadowBias_extraInitializers);
            __esDecorate(null, null, _shadowNormalBias_decorators, { kind: "field", name: "shadowNormalBias", static: false, private: false, access: { has: obj => "shadowNormalBias" in obj, get: obj => obj.shadowNormalBias, set: (obj, value) => { obj.shadowNormalBias = value; } }, metadata: _metadata }, _shadowNormalBias_initializers, _shadowNormalBias_extraInitializers);
            __esDecorate(null, null, _shadowCameraNear_decorators, { kind: "field", name: "shadowCameraNear", static: false, private: false, access: { has: obj => "shadowCameraNear" in obj, get: obj => obj.shadowCameraNear, set: (obj, value) => { obj.shadowCameraNear = value; } }, metadata: _metadata }, _shadowCameraNear_initializers, _shadowCameraNear_extraInitializers);
            __esDecorate(null, null, _shadowCameraFar_decorators, { kind: "field", name: "shadowCameraFar", static: false, private: false, access: { has: obj => "shadowCameraFar" in obj, get: obj => obj.shadowCameraFar, set: (obj, value) => { obj.shadowCameraFar = value; } }, metadata: _metadata }, _shadowCameraFar_initializers, _shadowCameraFar_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LightWithShadow = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {boolean} castShadow -
         *
         * `attribute`
         *
         * Default: `true`
         *
         * When `true` a light will cast dynamic shadows from objects that cast
         * shadow onto objects that receive shadow.
         *
         * Note: Lights are expensive (requires rendering the scene once per light),
         * and qill require adjustments to a light's shadow camera to get it right
         * and to avoid shadow on unnecessary objects. By default, all objects cast
         * and receive shadows, but it can be useful to turn off shadow features for
         * objects that don't need shadow features to get more performance (f.e. see
         * [`Mesh.castShadow`](../meshes/Mesh#castShadow) and
         * [`Mesh.receiveShadow`](../meshes/Mesh#receiveShadow)).
         */
        castShadow = __runInitializers(this, _castShadow_initializers, true
        // These map to THREE.LightShadow properties.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/LightShadow
        /**
         * @property {number} shadowMapWidth -
         *
         * `attribute`
         *
         * Default: `512`
         *
         * The width of the shadow map used for projecting shadows.
         *
         * Higher values give better quality shadows at the cost of computation
         * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
         * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
         * for a given device, although the width and height don't have to be the
         * same (for example (512, 1024) is valid).
         */
        );
        // These map to THREE.LightShadow properties.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/LightShadow
        /**
         * @property {number} shadowMapWidth -
         *
         * `attribute`
         *
         * Default: `512`
         *
         * The width of the shadow map used for projecting shadows.
         *
         * Higher values give better quality shadows at the cost of computation
         * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
         * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
         * for a given device, although the width and height don't have to be the
         * same (for example (512, 1024) is valid).
         */
        shadowMapWidth = (__runInitializers(this, _castShadow_extraInitializers), __runInitializers(this, _shadowMapWidth_initializers, 512
        /**
         * @property {number} shadowMapHeight -
         *
         * `attribute`
         *
         * Default: `512`
         *
         * The height of the shadow map used for projecting shadows.
         *
         * Higher values give better quality shadows at the cost of computation
         * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
         * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
         * for a given device, although the width and height don't have to be the
         * same (for example (512, 1024) is valid).
         */
        ));
        /**
         * @property {number} shadowMapHeight -
         *
         * `attribute`
         *
         * Default: `512`
         *
         * The height of the shadow map used for projecting shadows.
         *
         * Higher values give better quality shadows at the cost of computation
         * time. Values must be powers of 2 (256, 512, 1024, etc), up to the
         * [`WebGLRenderer.capabilities.maxTextureSize`](https://threejs.org/docs/index.html?q=lightshadow#api/en/renderers/WebGLRenderer.capabilities)
         * for a given device, although the width and height don't have to be the
         * same (for example (512, 1024) is valid).
         */
        shadowMapHeight = (__runInitializers(this, _shadowMapWidth_extraInitializers), __runInitializers(this, _shadowMapHeight_initializers, 512
        /**
         * @property {number} shadowRadius -
         *
         * `attribute`
         *
         * Default: `3`
         *
         * Setting this to values greater than `1` will blur the edges of the shadow.
         * High values will cause unwanted banding effects in the shadows - a
         * greater width and height of the shadow map will allow for a higher radius
         * to be used before these effects become visible.
         *
         * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
         * `"pcfsoft"`, the radius has no effect and it is recommended to increase
         * softness by decreasing the shadow map width and height instead.
         *
         * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
         * `"basic"`, radius also has no effect, and there is no further way to
         * adjust shadow softness.
         */
        ));
        /**
         * @property {number} shadowRadius -
         *
         * `attribute`
         *
         * Default: `3`
         *
         * Setting this to values greater than `1` will blur the edges of the shadow.
         * High values will cause unwanted banding effects in the shadows - a
         * greater width and height of the shadow map will allow for a higher radius
         * to be used before these effects become visible.
         *
         * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
         * `"pcfsoft"`, the radius has no effect and it is recommended to increase
         * softness by decreasing the shadow map width and height instead.
         *
         * When [Scene.shadowmapType](../core/Scene#shadowmapType) is set to
         * `"basic"`, radius also has no effect, and there is no further way to
         * adjust shadow softness.
         */
        shadowRadius = (__runInitializers(this, _shadowMapHeight_extraInitializers), __runInitializers(this, _shadowRadius_initializers, 3
        // TODO make our own guide on shadow acne with live examples.
        /**
         * @property {number} shadowBias -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * Shadow bias adjusts the depth of a shadow pixel, which is useful for
         * avoiding shadow rendering artifacts (f.e. "shadow acne" when a
         * surface both creates and receives a shadow on itself). Very tiny
         * adjustments (in the order of 0.0001) may help reduce these artifacts..
         *
         * This topic is too complex to explain in a paragraph. Here are several
         * nice resources for understanding this:
         *
         * - https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping
         * - https://docs.unity3d.com/540/Documentation/Manual/ShadowOverview.html
         * - https://digitalrune.github.io/DigitalRune-Documentation/html/3f4d959e-9c98-4a97-8d85-7a73c26145d7.htm
         * - https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps
         */
        ));
        // TODO make our own guide on shadow acne with live examples.
        /**
         * @property {number} shadowBias -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * Shadow bias adjusts the depth of a shadow pixel, which is useful for
         * avoiding shadow rendering artifacts (f.e. "shadow acne" when a
         * surface both creates and receives a shadow on itself). Very tiny
         * adjustments (in the order of 0.0001) may help reduce these artifacts..
         *
         * This topic is too complex to explain in a paragraph. Here are several
         * nice resources for understanding this:
         *
         * - https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping
         * - https://docs.unity3d.com/540/Documentation/Manual/ShadowOverview.html
         * - https://digitalrune.github.io/DigitalRune-Documentation/html/3f4d959e-9c98-4a97-8d85-7a73c26145d7.htm
         * - https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps
         */
        shadowBias = (__runInitializers(this, _shadowRadius_extraInitializers), __runInitializers(this, _shadowBias_initializers, 0
        /**
         * @property {number} shadowNormalBias -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * This is similarly useful for the same reason as
         * [`shadowBias`](#shadowBias) in preventing visual self-shadowing
         * artifacts. This moves shadow pixels into a surface based on the surface
         * normal.
         *
         * Increasing this value can be used to reduce shadow acne especially in
         * large scenes where light shines onto geometry at a shallow angle. The
         * downside is that shadows may appear warped with larger values.
         */
        ));
        /**
         * @property {number} shadowNormalBias -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * This is similarly useful for the same reason as
         * [`shadowBias`](#shadowBias) in preventing visual self-shadowing
         * artifacts. This moves shadow pixels into a surface based on the surface
         * normal.
         *
         * Increasing this value can be used to reduce shadow acne especially in
         * large scenes where light shines onto geometry at a shallow angle. The
         * downside is that shadows may appear warped with larger values.
         */
        shadowNormalBias = (__runInitializers(this, _shadowBias_extraInitializers), __runInitializers(this, _shadowNormalBias_initializers, 0
        // TODO: auto-adjust near and far planes like we will with Camera,
        // unless the user supplies a manual value.
        /**
         * @property {number} shadowCameraNear -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * Adjusts the near plane of the internal camera used for shadow projection.
         */
        ));
        // TODO: auto-adjust near and far planes like we will with Camera,
        // unless the user supplies a manual value.
        /**
         * @property {number} shadowCameraNear -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * Adjusts the near plane of the internal camera used for shadow projection.
         */
        shadowCameraNear = (__runInitializers(this, _shadowNormalBias_extraInitializers), __runInitializers(this, _shadowCameraNear_initializers, 1
        /**
         * @property {number} shadowCameraFar -
         *
         * `attribute`
         *
         * Default: `2000`
         *
         * Adjusts the far plane of the internal camera used for shadow projection.
         */
        ));
        /**
         * @property {number} shadowCameraFar -
         *
         * `attribute`
         *
         * Default: `2000`
         *
         * Adjusts the far plane of the internal camera used for shadow projection.
         */
        shadowCameraFar = (__runInitializers(this, _shadowCameraNear_extraInitializers), __runInitializers(this, _shadowCameraFar_initializers, 2000));
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const light = this.three;
                light.castShadow = this.castShadow;
                const shadow = this.three.shadow;
                shadow.mapSize.width = this.shadowMapWidth;
                shadow.mapSize.height = this.shadowMapHeight;
                shadow.radius = this.shadowRadius;
                shadow.bias = this.shadowBias;
                shadow.normalBias = this.shadowNormalBias;
                const camera = shadow.camera;
                camera.near = this.shadowCameraNear;
                camera.far = this.shadowCameraFar;
                shadow.needsUpdate = true;
                this.needsUpdate();
            });
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _shadowCameraFar_extraInitializers);
        }
    };
    return LightWithShadow = _classThis;
})();
export { LightWithShadow };
//# sourceMappingURL=LightWithShadow.js.map