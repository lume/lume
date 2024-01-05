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
import { element } from '@lume/element';
import { Mesh } from './Mesh.js';
import { autoDefineElements } from '../LumeConfig.js';
/**
 * @class MixedPlane -
 *
 * Element: `<lume-mixed-plane>`
 *
 * This element is useful for rendering regular DOM content (`<div>`, `<img>`,
 * etc) mixed with WebGL content. Any regular DOM content placed as children of
 * this element will be visible in the 3D scene and can be occluded by 3D
 * elements as well as occlude other 3D elements.
 *
 * For best results, set the background of the DOM content to a solid color,
 * take up 100% width and height of the lume-mixed-plane element, and don't use
 * border radius (for now), otherwise transparent parts of the regular DOM
 * content will not receal 3D content that would be expected to be behind them.
 *
 * See [`MixedPlaneGeometryBehavior`](../behaviors/mesh-behaviors/geometries/MixedPlaneGeometryBehavior) and [`MixedPlaneMaterialBehavior`](../behaviors/mesh-behaviors/materials/MixedPlaneMaterialBehavior) for
 * available properties.
 *
 * <live-code src="../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends Mesh
 */
let MixedPlane = (() => {
    let _classDecorators = [element('lume-mixed-plane', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Mesh;
    var MixedPlane = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            MixedPlane = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        initialBehaviors = { geometry: 'mixedplane', material: 'mixedplane' };
        /**
         * @property {true} isMixedPlane - An always-`true` property signaling that
         * this element is a `MixedPlane`. Useful for duck typing, especially in
         * plain JavaScript as opposed to TypeScript.
         */
        get isMixedPlane() {
            return true;
        }
    };
    return MixedPlane = _classThis;
})();
export { MixedPlane };
//# sourceMappingURL=MixedPlane.js.map