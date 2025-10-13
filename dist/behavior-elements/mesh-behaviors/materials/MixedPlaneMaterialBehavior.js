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
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { NoBlending /*, DoubleSide*/ } from 'three/src/constants.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import { element } from '@lume/element';
import { autoDefineElements } from '../../../LumeConfig.js';
/**
 * @class MixedPlaneMaterialBehavior -
 *
 * Element: `mixedplane-material`
 *
 * Used as the material for [`<lume-mixed-plane>`](../../../meshes/MixedPlane) elements.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends PhysicalMaterialBehavior
 * @element mixedplane-material
 */
let MixedPlaneMaterialBehavior = (() => {
    let _classDecorators = [element('mixedplane-material', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = PhysicalMaterialBehavior;
    var MixedPlaneMaterialBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MixedPlaneMaterialBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        constructor() {
            super();
            // TODO, these should be class field overrides instead of constructor
            // properties. At the moment, it isn't easy to override color
            // because it is a getter/setter and we have to copy over the logic,
            // which fails because the getter is accessed in the super class before
            // this subclass has a chance to define its private fields.
            /**
             * @property {number} materialOpacity -
             *
             * `override` `attribute`
             *
             * Default: `0.3`
             *
             * Overrides
             * [`PhysicalMaterialBehavior.materialOpacity`](./PhysicalMaterialBehavior#materialOpacity)
             * to give mixed planes a nice default for viewing DOM content behind
             * the WebGL canvas, while allowing some light to be caught on the
             * partially opaque surface for effect. This may require tweaking
             * depending on lighting and colors.
             */
            this.materialOpacity = 0.3;
            /**
             * @property {number} materialOpacity -
             *
             * `override` `attribute`
             *
             * Default: `0.3`
             *
             * Overrides [`PhysicalMaterialBehavior.color`](./PhysicalMaterialBehavior#color) to
             * give mixed planes a default tinted transparent surface over regular
             * DOM content, on which light effects can be drawn.
             */
            this.color = '#444';
        }
        _createComponent() {
            return new MeshPhysicalMaterial({ blending: NoBlending });
        }
    };
    return MixedPlaneMaterialBehavior = _classThis;
})();
export { MixedPlaneMaterialBehavior };
//# sourceMappingURL=MixedPlaneMaterialBehavior.js.map