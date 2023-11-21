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
import { numberAttribute } from '@lume/element';
import { TorusGeometry } from 'three/src/geometries/TorusGeometry.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { toRadians } from '../../../core/utils/index.js';
/**
 * @class TorusGeometryBehavior
 *
 * Creates a donut-shaped geometry for [`<lume-mesh>`](../../../meshes/Mesh)
 * elements. This is the geometry behavior of
 * [`<lume-torus>`](../../../meshes/Torus) elements by default.
 *
 * The outer diameter of the donut is determined by the element's
 * [`calculatedSize.x`](../../../core/Sizeable#calculatedsize). The inner diameter is
 * the element's `calculatedSize.x` minus the donut's
 * [`tubeThickness`](#tubethickness).
 *
 * @extends GeometryBehavior
 */
let TorusGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _tubeThickness_decorators;
    let _tubeThickness_initializers = [];
    let _radialSegments_decorators;
    let _radialSegments_initializers = [];
    let _tubularSegments_decorators;
    let _tubularSegments_initializers = [];
    let _arc_decorators;
    let _arc_initializers = [];
    var TorusGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _tubeThickness_decorators = [numberAttribute, receiver];
            _radialSegments_decorators = [numberAttribute, receiver];
            _tubularSegments_decorators = [numberAttribute, receiver];
            _arc_decorators = [numberAttribute, receiver];
            __esDecorate(null, null, _tubeThickness_decorators, { kind: "field", name: "tubeThickness", static: false, private: false, access: { has: obj => "tubeThickness" in obj, get: obj => obj.tubeThickness, set: (obj, value) => { obj.tubeThickness = value; } }, metadata: _metadata }, _tubeThickness_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _radialSegments_decorators, { kind: "field", name: "radialSegments", static: false, private: false, access: { has: obj => "radialSegments" in obj, get: obj => obj.radialSegments, set: (obj, value) => { obj.radialSegments = value; } }, metadata: _metadata }, _radialSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _tubularSegments_decorators, { kind: "field", name: "tubularSegments", static: false, private: false, access: { has: obj => "tubularSegments" in obj, get: obj => obj.tubularSegments, set: (obj, value) => { obj.tubularSegments = value; } }, metadata: _metadata }, _tubularSegments_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _arc_decorators, { kind: "field", name: "arc", static: false, private: false, access: { has: obj => "arc" in obj, get: obj => obj.arc, set: (obj, value) => { obj.arc = value; } }, metadata: _metadata }, _arc_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TorusGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        // TODO tubeThicknessMode: literal or proportional
        /**
         * @property {number} tubeThickness -
         *
         * `attribute`
         *
         * Default: `0.1`
         *
         * The thickness of the tube of the donut, as a fraction of the element's
         * `x` size (as a fraction of the overall diameter also determined by the
         * element's `x` size). The default `0.1` value means the donut's tube
         * thickness is 10% of the overall diameter.
         */
        tubeThickness = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _tubeThickness_initializers, 0.1
        /**
         * @property {number} radialSegments -
         *
         * `attribute`
         *
         * Default: `16`
         *
         * The number of segments (or edges) of the circular cross section of the
         * donut tube.
         */
        ));
        /**
         * @property {number} radialSegments -
         *
         * `attribute`
         *
         * Default: `16`
         *
         * The number of segments (or edges) of the circular cross section of the
         * donut tube.
         */
        radialSegments = __runInitializers(this, _radialSegments_initializers, 16
        /**
         * @property {number} tubularSegments -
         *
         * `attribute`
         *
         * Default: `32`
         *
         * The number of tube sections around the donut.
         */
        );
        /**
         * @property {number} tubularSegments -
         *
         * `attribute`
         *
         * Default: `32`
         *
         * The number of tube sections around the donut.
         */
        tubularSegments = __runInitializers(this, _tubularSegments_initializers, 32
        /**
         * @property {number} arc -
         *
         * `attribute`
         *
         * Default: `360`
         *
         * The total angle in degrees around which the donut is constructed. The
         * default value of `360` means the tubular segments go all the way around
         * to form a whole donut. A value of `180` means we get a half of a donut
         * shape.
         */
        );
        /**
         * @property {number} arc -
         *
         * `attribute`
         *
         * Default: `360`
         *
         * The total angle in degrees around which the donut is constructed. The
         * default value of `360` means the tubular segments go all the way around
         * to form a whole donut. A value of `180` means we get a half of a donut
         * shape.
         */
        arc = __runInitializers(this, _arc_initializers, 360);
        _createComponent() {
            const outerDiameter = this.element.calculatedSize.x;
            const outerRadius = outerDiameter / 2;
            const { tubeThickness, radialSegments, tubularSegments, arc } = this;
            const literalThickness = tubeThickness * outerDiameter;
            const radius = outerRadius - literalThickness / 2;
            return new TorusGeometry(radius, literalThickness, radialSegments, tubularSegments, toRadians(arc));
        }
    };
    return TorusGeometryBehavior = _classThis;
})();
export { TorusGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('torus-geometry'))
    elementBehaviors.define('torus-geometry', TorusGeometryBehavior);
//# sourceMappingURL=TorusGeometryBehavior.js.map