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
import html from 'solid-js/html';
import { Points as ThreePoints } from 'three/src/objects/Points.js';
import { MeshLike } from './MeshLike.js';
import { autoDefineElements } from '../LumeConfig.js';
// Import this lazily just in case the user is importing this class
// directly. We can't do it at the top level because it creates a
// circular dependency error during module execution.
import('../behavior-elements/mesh-behaviors/materials/PointsMaterial.js');
/**
 * @class Points -
 *
 * Element: `<lume-points>`
 *
 * A `<lume-points>` element is similar to a `<lume-mesh>` element, except that
 * the `<lume-points-material>` is used by default, which renders any geometry's
 * vertices as points instead of filled triangles.
 *
 * Applies default behaviors of
 * [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and
 * [`<lume-points-material>`](../behavior-elements/mesh-behaviors/materials/PointsMaterial).
 *
 * It can be useful along with a
 * [`<lume-ply-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlyGeometry)
 * child element to load a set of points from a file. For example:
 *
 * <live-code src="../../examples/shelby-gt350-points/example.html"></live-code>
 *
 * @extends MeshLike
 */
let Points = (() => {
    let _classDecorators = [element('lume-points', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = MeshLike;
    var Points = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Points = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        _defaultMaterial = () => html `<lume-points-material></lume-points-material>`;
        makeThreeObject3d() {
            return new ThreePoints();
        }
    };
    return Points = _classThis;
})();
export { Points };
//# sourceMappingURL=Points.js.map