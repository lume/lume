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
import 'element-behaviors';
import { attribute } from '@lume/element';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryBehavior } from './GeometryBehavior.js';
let RoundedRectangleGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _cornerRadius_decorators;
    let _cornerRadius_initializers = [];
    let _cornerRadius_extraInitializers = [];
    let _thickness_decorators;
    let _thickness_initializers = [];
    let _thickness_extraInitializers = [];
    let _get_quadraticCorners_decorators;
    let _set_quadraticCorners_decorators;
    var RoundedRectangleGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _cornerRadius_decorators = [attribute({ from: Number }), receiver];
            _thickness_decorators = [attribute({ from: Number }), receiver];
            _get_quadraticCorners_decorators = [attribute, receiver];
            _set_quadraticCorners_decorators = [attribute];
            __esDecorate(this, null, _get_quadraticCorners_decorators, { kind: "getter", name: "quadraticCorners", static: false, private: false, access: { has: obj => "quadraticCorners" in obj, get: obj => obj.quadraticCorners }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_quadraticCorners_decorators, { kind: "setter", name: "quadraticCorners", static: false, private: false, access: { has: obj => "quadraticCorners" in obj, set: (obj, value) => { obj.quadraticCorners = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _cornerRadius_decorators, { kind: "field", name: "cornerRadius", static: false, private: false, access: { has: obj => "cornerRadius" in obj, get: obj => obj.cornerRadius, set: (obj, value) => { obj.cornerRadius = value; } }, metadata: _metadata }, _cornerRadius_initializers, _cornerRadius_extraInitializers);
            __esDecorate(null, null, _thickness_decorators, { kind: "field", name: "thickness", static: false, private: false, access: { has: obj => "thickness" in obj, get: obj => obj.thickness, set: (obj, value) => { obj.thickness = value; } }, metadata: _metadata }, _thickness_initializers, _thickness_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            RoundedRectangleGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        cornerRadius = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _cornerRadius_initializers, 0));
        thickness = (__runInitializers(this, _cornerRadius_extraInitializers), __runInitializers(this, _thickness_initializers, 0));
        #quadraticCorners = (__runInitializers(this, _thickness_extraInitializers), false);
        get quadraticCorners() {
            return this.#quadraticCorners;
        }
        set quadraticCorners(val) {
            // @ts-ignore handle incoming attribute values
            if (val === null || val === 'false')
                this.#quadraticCorners = false;
            else
                this.#quadraticCorners = true;
        }
        _createComponent() {
            let thickness = this.thickness;
            let geom;
            const roundedRectShape = new RoundedRectShape(0, 0, this.element.calculatedSize.x, this.element.calculatedSize.y, this.cornerRadius, this.quadraticCorners);
            if (thickness > 0) {
                geom = new ExtrudeGeometry(roundedRectShape, {
                    bevelEnabled: true,
                    steps: 1,
                    bevelSegments: 1,
                    bevelSize: 0,
                    bevelThickness: 0,
                    depth: thickness,
                });
            }
            else {
                geom = new ShapeGeometry(roundedRectShape);
            }
            geom.translate(-this.element.calculatedSize.x / 2, -this.element.calculatedSize.y / 2, -thickness / 2);
            return geom;
        }
    };
    return RoundedRectangleGeometryBehavior = _classThis;
})();
export { RoundedRectangleGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('rounded-rectangle-geometry'))
    elementBehaviors.define('rounded-rectangle-geometry', RoundedRectangleGeometryBehavior);
// Based on Three.js example: https://github.com/mrdoob/three.js/blob/159a40648ee86755220491d4f0bae202235a341c/examples/webgl_geometry_shapes.html#L237
class RoundedRectShape extends Shape {
    constructor(x, y, width, height, radius, quadraticCorners = false) {
        super();
        if (quadraticCorners) {
            // Quadratic corners (can look better, more bubbly)
            this.moveTo(x, y + radius);
            this.lineTo(x, y + height - radius);
            this.quadraticCurveTo(x, y + height, x + radius, y + height);
            this.lineTo(x + width - radius, y + height);
            this.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
            this.lineTo(x + width, y + radius);
            this.quadraticCurveTo(x + width, y, x + width - radius, y);
            this.lineTo(x + radius, y);
            this.quadraticCurveTo(x, y, x, y + radius);
            return;
        }
        // Circular corners (matches DOM's rounded borders)
        this.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
        this.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
        this.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
        this.absarc(x + radius, y + radius, radius, Math.PI, Math.PI + Math.PI / 2, false);
        this.lineTo(x + width - radius, y); // complete the loop
    }
}
//# sourceMappingURL=RoundedRectangleGeometryBehavior.js.map