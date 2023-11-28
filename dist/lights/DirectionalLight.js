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
import { DirectionalLight as ThreeDirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { numberAttribute, element } from '@lume/element';
import { LightWithShadow } from './LightWithShadow.js';
import { autoDefineElements } from '../LumeConfig.js';
// TODO @element jsdoc tag
/**
 * @element lume-directional-light
 * @class DirectionalLight -
 *
 * Element: `<lume-directional-light>`
 *
 * This creates light with a particular direction all over the world. Think of
 * it like a point light infinitely (or very) far away, and the emitted light
 * rays are effectively all parallel. An example use case could be emulating
 * the sun, which is far enough away that on earth all the rays seem to be
 * parallel.
 *
 * The direction of the light is the direction from the light's
 * `position` to the world origin (the center of a scene's viewport).
 *
 * When casting shadows, an orthographic camera is used, and shadows are limited
 * to be within the ortho box specified by the `shadowCamera*` properties. While
 * light color affects all objects in a scene, only objects within the shadow
 * camera limits will be affects by shadows.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.code = directionalLightExample()
 * </script>
 *
 * @extends LightWithShadow
 */
let DirectionalLight = (() => {
    let _classDecorators = [element('lume-directional-light', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LightWithShadow;
    let _instanceExtraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _shadowCameraTop_decorators;
    let _shadowCameraTop_initializers = [];
    let _shadowCameraRight_decorators;
    let _shadowCameraRight_initializers = [];
    let _shadowCameraBottom_decorators;
    let _shadowCameraBottom_initializers = [];
    let _shadowCameraLeft_decorators;
    let _shadowCameraLeft_initializers = [];
    var DirectionalLight = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _intensity_decorators = [numberAttribute];
            _shadowCameraTop_decorators = [numberAttribute];
            _shadowCameraRight_decorators = [numberAttribute];
            _shadowCameraBottom_decorators = [numberAttribute];
            _shadowCameraLeft_decorators = [numberAttribute];
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shadowCameraTop_decorators, { kind: "field", name: "shadowCameraTop", static: false, private: false, access: { has: obj => "shadowCameraTop" in obj, get: obj => obj.shadowCameraTop, set: (obj, value) => { obj.shadowCameraTop = value; } }, metadata: _metadata }, _shadowCameraTop_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shadowCameraRight_decorators, { kind: "field", name: "shadowCameraRight", static: false, private: false, access: { has: obj => "shadowCameraRight" in obj, get: obj => obj.shadowCameraRight, set: (obj, value) => { obj.shadowCameraRight = value; } }, metadata: _metadata }, _shadowCameraRight_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shadowCameraBottom_decorators, { kind: "field", name: "shadowCameraBottom", static: false, private: false, access: { has: obj => "shadowCameraBottom" in obj, get: obj => obj.shadowCameraBottom, set: (obj, value) => { obj.shadowCameraBottom = value; } }, metadata: _metadata }, _shadowCameraBottom_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _shadowCameraLeft_decorators, { kind: "field", name: "shadowCameraLeft", static: false, private: false, access: { has: obj => "shadowCameraLeft" in obj, get: obj => obj.shadowCameraLeft, set: (obj, value) => { obj.shadowCameraLeft = value; } }, metadata: _metadata }, _shadowCameraLeft_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DirectionalLight = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} intensity -
         *
         * `override` `attribute`
         *
         * Default: `1`
         *
         * The intensity of the light.
         *
         * The intensity of this element does not change behavior when [physically
         * correct lighting](../core/Scene#physicallycorrectlights) is enabled.
         */
        intensity = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _intensity_initializers, 1
        // These map to THREE.DirectionalLightShadow properties, which uses an orthographic camera for shadow projection.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/DirectionalLightShadow
        ));
        // These map to THREE.DirectionalLightShadow properties, which uses an orthographic camera for shadow projection.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/DirectionalLightShadow
        shadowCameraTop = __runInitializers(this, _shadowCameraTop_initializers, 1000);
        shadowCameraRight = __runInitializers(this, _shadowCameraRight_initializers, 1000);
        shadowCameraBottom = __runInitializers(this, _shadowCameraBottom_initializers, -1000);
        shadowCameraLeft = __runInitializers(this, _shadowCameraLeft_initializers, -1000);
        _loadGL() {
            if (!super._loadGL())
                return false;
            this.createGLEffect(() => {
                const light = this.three;
                const shadow = light.shadow;
                shadow.camera.top = this.shadowCameraTop;
                shadow.camera.right = this.shadowCameraRight;
                shadow.camera.bottom = this.shadowCameraBottom;
                shadow.camera.left = this.shadowCameraLeft;
                shadow.needsUpdate = true;
                this.needsUpdate();
            });
            return true;
        }
        makeThreeObject3d() {
            return new ThreeDirectionalLight();
        }
    };
    return DirectionalLight = _classThis;
})();
export { DirectionalLight };
//# sourceMappingURL=DirectionalLight.js.map