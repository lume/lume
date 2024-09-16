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
import { Color } from 'three/src/math/Color.js';
import { Light as ThreeLight } from 'three/src/lights/Light.js';
import { attribute, element, numberAttribute } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
/**
 * @abstract
 * @class Light -
 *
 * `abstract`
 *
 * An abstract base class for light elements. This class has properties common
 * to all types of light.
 *
 * @extends Element3D
 */
let Light = (() => {
    let _classDecorators = [element];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    var Light = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _color_decorators = [attribute];
            _intensity_decorators = [numberAttribute];
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Light = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {string | number | THREE.Color} color -
         *
         * `attribute`
         *
         * Default: `"white"`
         *
         * The color of light that is emitted.
         *
         * A string value can be any valid CSS color string, f.e. `"#ff6600"` or
         * `"rgb(10,20,30)"`.
         *
         * A number value represents a hex color value, f.e.
         * `0xff6600`.
         *
         * A `THREE.Color` instance can be assigned, and it will be copied to the
         * element's internal color value upon assignment. Mutating the assigned
         * `THREE.Color` after assignment will have no effect; instead you can
         * assign it again each time you wish to update the color.
         */
        color = __runInitializers(this, _color_initializers, 'white'
        /**
         * @property {number} intensity -
         *
         * `abstract`
         *
         * Default: `1`
         *
         * The intensity of the light.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, the units of intensity depend on the type of light (f.e.
         * [`PointLight`](./PointLight) or [`SpotLight`](./SpotLight)).
         */
        );
        /**
         * @property {number} intensity -
         *
         * `abstract`
         *
         * Default: `1`
         *
         * The intensity of the light.
         *
         * When [physically correct lighting](../core/Scene#physicallycorrectlights)
         * is enabled, the units of intensity depend on the type of light (f.e.
         * [`PointLight`](./PointLight) or [`SpotLight`](./SpotLight)).
         */
        intensity = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _intensity_initializers, 1
        // This is not used in practice because this class is abstract, but this enforces
        // (in TypeScript) that subclasses that override this will return a subtype of
        // ThreeLight.
        ));
        // This is not used in practice because this class is abstract, but this enforces
        // (in TypeScript) that subclasses that override this will return a subtype of
        // ThreeLight.
        makeThreeObject3d() {
            // @ts-expect-error Threelight is abstract
            return new ThreeLight();
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                if (typeof this.color === 'object')
                    this.three.color = this.color;
                this.three.color = new Color(this.color);
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.three.intensity = this.intensity;
                this.needsUpdate();
            });
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _intensity_extraInitializers);
        }
    };
    return Light = _classThis;
})();
export { Light };
//# sourceMappingURL=Light.js.map