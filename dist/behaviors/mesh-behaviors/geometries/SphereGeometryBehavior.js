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
import 'element-behaviors';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js';
import { numberAttribute } from '@lume/element';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryBehavior } from './GeometryBehavior.js';
/**
 * @class SphereGeometryBehavior -
 *
 * Behavior: `sphere-geometry`
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @behavior sphere-geometry TODO @behavior jsdoc tag
 */
let SphereGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _horizontalSegments_decorators;
    let _horizontalSegments_initializers = [];
    let _verticalSegments_decorators;
    let _verticalSegments_initializers = [];
    var SphereGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _horizontalSegments_decorators = [numberAttribute, receiver];
            _verticalSegments_decorators = [numberAttribute, receiver];
            __esDecorate(null, null, _horizontalSegments_decorators, { kind: "field", name: "horizontalSegments", static: false, private: false, access: { has: obj => "horizontalSegments" in obj, get: obj => obj.horizontalSegments, set: (obj, value) => { obj.horizontalSegments = value; } }, metadata: _metadata }, _horizontalSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _verticalSegments_decorators, { kind: "field", name: "verticalSegments", static: false, private: false, access: { has: obj => "verticalSegments" in obj, get: obj => obj.verticalSegments, set: (obj, value) => { obj.verticalSegments = value; } }, metadata: _metadata }, _verticalSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SphereGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} horizontalSegments -
         *
         * `attribute`
         *
         * Default: `32`
         *
         * The number of divisions around the equator of the sphere. A sphere with 10
         * horizontal segments and 10 vertical segments is made up of 100 flat faces.
         */
        horizontalSegments = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _horizontalSegments_initializers, 32
        /**
         * @property {number} verticalSegments -
         *
         * `attribute`
         *
         * Default: `32`
         *
         * The number of divisions across the height of the sphere. A sphere with 10
         * width segments and 10 height segments is essentially made up of 100 cells
         * (or 10 rows and 10 columns of smaller planes).
         */
        ));
        /**
         * @property {number} verticalSegments -
         *
         * `attribute`
         *
         * Default: `32`
         *
         * The number of divisions across the height of the sphere. A sphere with 10
         * width segments and 10 height segments is essentially made up of 100 cells
         * (or 10 rows and 10 columns of smaller planes).
         */
        verticalSegments = __runInitializers(this, _verticalSegments_initializers, 32);
        _createComponent() {
            return new SphereGeometry(this.element.calculatedSize.x / 2, this.horizontalSegments, this.verticalSegments);
        }
    };
    return SphereGeometryBehavior = _classThis;
})();
export { SphereGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('sphere-geometry'))
    elementBehaviors.define('sphere-geometry', SphereGeometryBehavior);
//# sourceMappingURL=SphereGeometryBehavior.js.map