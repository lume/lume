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
import { numberAttribute, element } from '@lume/element';
import { onCleanup } from 'solid-js';
import { PointLight as ThreePointLight } from 'three/src/lights/PointLight.js';
import { PointLightHelper } from 'three/src/helpers/PointLightHelper.js';
import { Motor } from '../core/Motor.js';
import { LightWithShadow } from './LightWithShadow.js';
import { autoDefineElements } from '../LumeConfig.js';
// TODO @element jsdoc tag
/**
 * @element lume-point-light
 * @class PointLight -
 *
 * Element: `<lume-point-light>`
 *
 * An element that illuminates objects near it, casting shadows in any direction
 * away from the light by default. The light element itself is not visible; to
 * visualize it you can place a sphere as a child of the light for example.
 *
 * The light's shadow projection camera is a PerspectiveCamera with fov of 90,
 * with aspect of 1.
 *
 * All mesh elements [receive](../meshes/Mesh#receiveshadow) or
 * [cast](../meshes/Mesh#castshadow) shadows by default.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = pointLightExample()
 * </script>
 *
 * @extends LightWithShadow
 */
let PointLight = (() => {
    let _classDecorators = [element('lume-point-light', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LightWithShadow;
    let _instanceExtraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _shadowCameraFov_decorators;
    let _shadowCameraFov_initializers = [];
    let _shadowCameraFov_extraInitializers = [];
    let _distance_decorators;
    let _distance_initializers = [];
    let _distance_extraInitializers = [];
    let _decay_decorators;
    let _decay_initializers = [];
    let _decay_extraInitializers = [];
    let _get_power_decorators;
    let _set_power_decorators;
    var PointLight = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _intensity_decorators = [numberAttribute];
            _shadowCameraFov_decorators = [numberAttribute];
            _distance_decorators = [numberAttribute];
            _decay_decorators = [numberAttribute];
            _get_power_decorators = [numberAttribute];
            _set_power_decorators = [numberAttribute];
            __esDecorate(this, null, _get_power_decorators, { kind: "getter", name: "power", static: false, private: false, access: { has: obj => "power" in obj, get: obj => obj.power }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_power_decorators, { kind: "setter", name: "power", static: false, private: false, access: { has: obj => "power" in obj, set: (obj, value) => { obj.power = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _shadowCameraFov_decorators, { kind: "field", name: "shadowCameraFov", static: false, private: false, access: { has: obj => "shadowCameraFov" in obj, get: obj => obj.shadowCameraFov, set: (obj, value) => { obj.shadowCameraFov = value; } }, metadata: _metadata }, _shadowCameraFov_initializers, _shadowCameraFov_extraInitializers);
            __esDecorate(null, null, _distance_decorators, { kind: "field", name: "distance", static: false, private: false, access: { has: obj => "distance" in obj, get: obj => obj.distance, set: (obj, value) => { obj.distance = value; } }, metadata: _metadata }, _distance_initializers, _distance_extraInitializers);
            __esDecorate(null, null, _decay_decorators, { kind: "field", name: "decay", static: false, private: false, access: { has: obj => "decay" in obj, get: obj => obj.decay, set: (obj, value) => { obj.decay = value; } }, metadata: _metadata }, _decay_initializers, _decay_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PointLight = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} intensity -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * This light's intensity. Changing the intensity will also change the light's
         * [`power`](#power) according to the formula `intensity * 4 * Math.PI`.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * enabled, intensity is the luminous intensity of the light measured in
         * candela (cd).
         */
        intensity = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _intensity_initializers, 1
        // These map to THREE.PointLightShadow properties, which uses a perspective camera for shadow projection.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/PointLightShadow
        ));
        // These map to THREE.PointLightShadow properties, which uses a perspective camera for shadow projection.
        // https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/PointLightShadow
        shadowCameraFov = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _shadowCameraFov_initializers, 90
        /**
         * @property {number} distance -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * In the default lighting mode, when distance is zero, light does not
         * attenuate (intensity stays constant as it travels away the light's
         * position). When distance is non-zero, light will attenuate linearly from
         * maximum intensity at the light's position down to zero at this distance
         * from the light.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, when distance is zero, light will attenuate according to
         * inverse-square law to infinite distance. When distance is non-zero, light
         * will attenuate according to inverse-square law until near the distance
         * cutoff, where it will then attenuate quickly and smoothly to 0.
         * Inherently, cutoffs are not physically correct.
         */
        ));
        /**
         * @property {number} distance -
         *
         * `attribute`
         *
         * Default: `0`
         *
         * In the default lighting mode, when distance is zero, light does not
         * attenuate (intensity stays constant as it travels away the light's
         * position). When distance is non-zero, light will attenuate linearly from
         * maximum intensity at the light's position down to zero at this distance
         * from the light.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, when distance is zero, light will attenuate according to
         * inverse-square law to infinite distance. When distance is non-zero, light
         * will attenuate according to inverse-square law until near the distance
         * cutoff, where it will then attenuate quickly and smoothly to 0.
         * Inherently, cutoffs are not physically correct.
         */
        distance = (__runInitializers(this, _shadowCameraFov_extraInitializers), __runInitializers(this, _distance_initializers, 0
        /**
         * @property {number} decay
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The amount the light dims along the distance of the light.
         *
         * In [physically correct mode](../core/Scene#physicallycorrectlights), a
         * decay value of `2` leads to physically realistic light falloff.
         */
        ));
        /**
         * @property {number} decay
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The amount the light dims along the distance of the light.
         *
         * In [physically correct mode](../core/Scene#physicallycorrectlights), a
         * decay value of `2` leads to physically realistic light falloff.
         */
        decay = (__runInitializers(this, _distance_extraInitializers), __runInitializers(this, _decay_initializers, 1
        /**
         * @property {number} power -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * This light's power. Changing the power will also change the light's
         * [`intensity`](#intensity) according to the formula `power / (4 * Math.PI)`.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, power is the luminous power of the light measured in lumens
         * (lm).
         */
        ));
        /**
         * @property {number} power -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * This light's power. Changing the power will also change the light's
         * [`intensity`](#intensity) according to the formula `power / (4 * Math.PI)`.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, power is the luminous power of the light measured in lumens
         * (lm).
         */
        get power() {
            // compute the light's luminous power (in lumens) from its intensity (in candela)
            // for an isotropic light source, luminous power (lm) = 4 π luminous intensity (cd)
            return this.intensity * 4 * Math.PI;
        }
        set power(power) {
            // set the light's intensity (in candela) from the desired luminous power (in lumens)
            this.intensity = power / (4 * Math.PI);
        }
        // TODO computed properties, f.e.
        // @memo @numberAttribute power = this.intensity * 4 * Math.PI
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                const light = this.three;
                light.distance = this.distance;
                light.decay = this.decay;
                // We don't need to set three.power here because threejs already maps that itself.
                this.needsUpdate();
            });
            this.createEffect(() => {
                if (!this.debug)
                    return;
                if (!this.scene)
                    return;
                const helper = new PointLightHelper(this.three, this.calculatedSize.x || 100);
                this.scene.three.add(helper);
                // Inifinite render loop while debugging, but oh well, its debug
                // mode, code is simpler this way.
                const task = Motor.addRenderTask(() => helper.update());
                onCleanup(() => {
                    helper.dispose();
                    this.scene.three.remove(helper);
                    Motor.removeRenderTask(task);
                });
            });
        }
        makeThreeObject3d() {
            return new ThreePointLight();
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _decay_extraInitializers);
        }
    };
    return PointLight = _classThis;
})();
export { PointLight };
//# sourceMappingURL=PointLight.js.map