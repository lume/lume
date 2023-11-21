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
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { numberAttribute } from '@lume/element';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryBehavior } from './GeometryBehavior.js';
/**
 * @class PlaneGeometryBehavior -
 *
 * Behavior: `plane-geometry`
 *
 * Makes a flat rectangle-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-plane>`](../../../meshes/Plane) elements.
 *
 * The size of the sphere is determined by the `x` and `y`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehavior
 * @behavior plane-geometry TODO @behavior jsdoc tag
 */
let PlaneGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _widthSegments_decorators;
    let _widthSegments_initializers = [];
    let _heightSegments_decorators;
    let _heightSegments_initializers = [];
    var PlaneGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _widthSegments_decorators = [numberAttribute, receiver];
            _heightSegments_decorators = [numberAttribute, receiver];
            __esDecorate(null, null, _widthSegments_decorators, { kind: "field", name: "widthSegments", static: false, private: false, access: { has: obj => "widthSegments" in obj, get: obj => obj.widthSegments, set: (obj, value) => { obj.widthSegments = value; } }, metadata: _metadata }, _widthSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _heightSegments_decorators, { kind: "field", name: "heightSegments", static: false, private: false, access: { has: obj => "heightSegments" in obj, get: obj => obj.heightSegments, set: (obj, value) => { obj.heightSegments = value; } }, metadata: _metadata }, _heightSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PlaneGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} widthSegments -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The number of divisions across the width of the plane. A plane with 10
         * width segments and 10 height segments is essentially made up of 100 cells
         * (or 10 rows and 10 columns of smaller planes)
         */
        widthSegments = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _widthSegments_initializers, 1
        /**
         * @property {number} heightSegments -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The number of divisions across the height of the plane. A plane with 10
         * width segments and 10 height segments is essentially made up of 100 cells
         * (or 10 rows and 10 columns of smaller planes)
         */
        ));
        /**
         * @property {number} heightSegments -
         *
         * `attribute`
         *
         * Default: `1`
         *
         * The number of divisions across the height of the plane. A plane with 10
         * width segments and 10 height segments is essentially made up of 100 cells
         * (or 10 rows and 10 columns of smaller planes)
         */
        heightSegments = __runInitializers(this, _heightSegments_initializers, 1);
        _createComponent() {
            return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y, this.widthSegments, this.heightSegments);
        }
    };
    return PlaneGeometryBehavior = _classThis;
})();
export { PlaneGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('plane-geometry'))
    elementBehaviors.define('plane-geometry', PlaneGeometryBehavior);
//# sourceMappingURL=PlaneGeometryBehavior.js.map