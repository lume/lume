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
import { attribute, booleanAttribute, numberAttribute, stringAttribute } from '@lume/element';
import 'element-behaviors';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { stringToNumberArray } from '../../../meshes/utils.js';
import { handleInvertedGeometry } from './utils/handleInvertedGeometry.js';
import { parseSvgPathDAttribute } from './utils/svg.js';
// Heart shape.
const defaultShape = new Shape();
defaultShape.moveTo(5, 5);
defaultShape.bezierCurveTo(5, 5, 4, 0, 0, 0);
defaultShape.bezierCurveTo(-6, 0, -6, 7, -6, 7);
defaultShape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
defaultShape.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
defaultShape.bezierCurveTo(16, 7, 16, 0, 10, 0);
defaultShape.bezierCurveTo(7, 0, 5, 5, 5, 5);
const emptyShape = new Shape();
const isPathStringRe = /^[mlhvcsqtaz][^a-z]/i;
/**
 * @class ShapeGeometryBehavior -
 *
 * Provides a 2D extrudable shape geometry for mesh
 * elements. The [`<lume-shape>`](../../../meshes/Shape.md) element has this behavior
 * on it by default.
 *
 * The shape defined by the [`shape`](#shape) attribute property will be centered within the
 * size space defined by the host element's `size` and `sizeMode` attribute
 * properties.
 *
 * To extrude the shape, set the host element's Z size to the amount of desired
 * extrusion. If the host element Z size is zero, the shape will be flat and 2D
 * only.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = shapesExample
 * </script>
 *
 * @extends GeometryBehavior
 */
let ShapeGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _get_shape_decorators;
    let _set_shape_decorators;
    let _curveSegments_decorators;
    let _curveSegments_initializers = [];
    let _curveSegments_extraInitializers = [];
    let _bevel_decorators;
    let _bevel_initializers = [];
    let _bevel_extraInitializers = [];
    let _bevelSegments_decorators;
    let _bevelSegments_initializers = [];
    let _bevelSegments_extraInitializers = [];
    let _bevelThickness_decorators;
    let _bevelThickness_initializers = [];
    let _bevelThickness_extraInitializers = [];
    let _centerGeometry_decorators;
    let _centerGeometry_initializers = [];
    let _centerGeometry_extraInitializers = [];
    let _fitment_decorators;
    let _fitment_initializers = [];
    let _fitment_extraInitializers = [];
    var ShapeGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_shape_decorators = [attribute, receiver];
            _set_shape_decorators = [attribute];
            _curveSegments_decorators = [numberAttribute, receiver];
            _bevel_decorators = [booleanAttribute, receiver];
            _bevelSegments_decorators = [numberAttribute, receiver];
            _bevelThickness_decorators = [numberAttribute, receiver];
            _centerGeometry_decorators = [booleanAttribute, receiver];
            _fitment_decorators = [stringAttribute, receiver];
            __esDecorate(this, null, _get_shape_decorators, { kind: "getter", name: "shape", static: false, private: false, access: { has: obj => "shape" in obj, get: obj => obj.shape }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_shape_decorators, { kind: "setter", name: "shape", static: false, private: false, access: { has: obj => "shape" in obj, set: (obj, value) => { obj.shape = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _curveSegments_decorators, { kind: "field", name: "curveSegments", static: false, private: false, access: { has: obj => "curveSegments" in obj, get: obj => obj.curveSegments, set: (obj, value) => { obj.curveSegments = value; } }, metadata: _metadata }, _curveSegments_initializers, _curveSegments_extraInitializers);
            __esDecorate(null, null, _bevel_decorators, { kind: "field", name: "bevel", static: false, private: false, access: { has: obj => "bevel" in obj, get: obj => obj.bevel, set: (obj, value) => { obj.bevel = value; } }, metadata: _metadata }, _bevel_initializers, _bevel_extraInitializers);
            __esDecorate(null, null, _bevelSegments_decorators, { kind: "field", name: "bevelSegments", static: false, private: false, access: { has: obj => "bevelSegments" in obj, get: obj => obj.bevelSegments, set: (obj, value) => { obj.bevelSegments = value; } }, metadata: _metadata }, _bevelSegments_initializers, _bevelSegments_extraInitializers);
            __esDecorate(null, null, _bevelThickness_decorators, { kind: "field", name: "bevelThickness", static: false, private: false, access: { has: obj => "bevelThickness" in obj, get: obj => obj.bevelThickness, set: (obj, value) => { obj.bevelThickness = value; } }, metadata: _metadata }, _bevelThickness_initializers, _bevelThickness_extraInitializers);
            __esDecorate(null, null, _centerGeometry_decorators, { kind: "field", name: "centerGeometry", static: false, private: false, access: { has: obj => "centerGeometry" in obj, get: obj => obj.centerGeometry, set: (obj, value) => { obj.centerGeometry = value; } }, metadata: _metadata }, _centerGeometry_initializers, _centerGeometry_extraInitializers);
            __esDecorate(null, null, _fitment_decorators, { kind: "field", name: "fitment", static: false, private: false, access: { has: obj => "fitment" in obj, get: obj => obj.fitment, set: (obj, value) => { obj.fitment = value; } }, metadata: _metadata }, _fitment_initializers, _fitment_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ShapeGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #shape = (__runInitializers(this, _instanceExtraInitializers), new Shape().copy(defaultShape));
        /**
         * @property {string | number[] | THREE.Shape | null} shape - Defines the 2D shape to render.
         *
         * Reading the property always returns an underlying
         * [THREE.Shape](https://threejs.org/docs/index.html?q=shape#api/en/extras/core/Shape)
         * object.
         *
         * Setting the property accepts `string`, `number[]`, `null`, or
         * `THREE.Shape` values. All values are mapped to a single `THREE.Shape`
         * property (the one returned by the getter).
         *
         * While setting the property triggers reactivity, modifying the
         * `THREE.Shape` returned by the getter does not. In such a case, we can
         * execute `el.shape = el.shape` to trigger reactivity.
         * <!-- TODO investigate using Solid createMutable to make the THREE.Shape reactive. -->
         *
         * A string value should be a list of numbers separated by any amount of space
         * (commas are optional, for organizational use), every two numbers forming
         * one point in the 2D shape. Similar to the rest of LUME's coordinate
         * system, +X goes rightward, and +Y goes downward.
         *
         * A number array value is similar to the string value: every two numbers
         * form a point in the shape.
         * <!-- TODO investigate reacting to reactive arrays -->
         *
         * If the string or number array have no points, the default shape is rendered.
         *
         * A `THREE.Shape` value will have its data copied to the underlying
         * `THREE.Shape` returned by the getter, and does not replace the underlying
         * `THREE.Shape` object.
         * <!-- TODO perhaps the getter should always return the value the user set, and not expose the internal `THREE.Shape` -->
         *
         * A value of `null` (or when the attribute is removed) causes the
         * default shape to be rendered.
         */
        get shape() {
            return this.#shape;
        }
        set shape(shape) {
            if (!shape) {
                this.#shape.copy(defaultShape);
            }
            else if (typeof shape === 'string' &&
                (shape = shape.trim()) && // skip empty string here
                shape.match(isPathStringRe)) {
                const shapePath = parseSvgPathDAttribute(shape);
                // TODO This supports only one solid shape for now.
                this.#shape.copy(shapePath.toShapes(true)[0] ?? defaultShape);
            }
            else if (typeof shape === 'string' && !shape.match(/^-?[0-9]/)) {
                // TODO query selector for <path> element from which to get a `d` attribute.
                console.error('Unsupported shape path: ', shape);
                this.#shape.copy(defaultShape);
            }
            else if (typeof shape === 'string' || Array.isArray(shape)) {
                const points = typeof shape === 'string' ? stringToNumberArray(shape, 'shape') : shape;
                if (!points.length) {
                    this.#shape.copy(defaultShape);
                }
                else {
                    if (points.length % 2 !== 0)
                        throw new Error('shape path must have an even number of numbers, each pair of numbers being a point.');
                    this.#shape.copy(emptyShape);
                    this.#shape.moveTo(points[0], points[1]);
                    if (points.length > 2)
                        for (let i = 2; i < points.length; i += 2)
                            this.#shape.lineTo(points[i], points[i + 1]);
                }
            }
            else {
                // Three.js bug: Copying a shape from itself breaks, causing
                // its `curves` array to be empty. Without this, `<lume-shape>` will
                // not draw anything on screen initially until its `shape` is
                // modified.
                if (this.#shape !== shape) {
                    this.#shape.copy(shape);
                }
            }
            this.#shape.updateArcLengths();
        }
        /**
         * @property {number} curveSegments - The number of lines per curve withing
         * the shape. The higher the number, the smoother the shape at the cost of
         * render time.
         * @default 8
         */
        curveSegments = __runInitializers(this, _curveSegments_initializers, 8
        /**
         * @property {boolean} bevel - When the shape is extruded, enables rounding
         * of the shape edges.
         * @default false
         */
        );
        /**
         * @property {boolean} bevel - When the shape is extruded, enables rounding
         * of the shape edges.
         * @default false
         */
        bevel = (__runInitializers(this, _curveSegments_extraInitializers), __runInitializers(this, _bevel_initializers, false
        /**
         * @property {number} bevelSegments - When the shape is extruded, determines
         * the number of sections for the bevel. A higher number makes the model
         * look smoother, but cost more time to render.
         * @default 4
         */
        ));
        /**
         * @property {number} bevelSegments - When the shape is extruded, determines
         * the number of sections for the bevel. A higher number makes the model
         * look smoother, but cost more time to render.
         * @default 4
         */
        bevelSegments = (__runInitializers(this, _bevel_extraInitializers), __runInitializers(this, _bevelSegments_initializers, 4
        /**
         * @property {number} bevelThickness - When the shape is extruded,
         * determines the thickness of the bevel. Roughly like the amount of
         * radius for the rounded edges.
         * @default 4
         */
        ));
        /**
         * @property {number} bevelThickness - When the shape is extruded,
         * determines the thickness of the bevel. Roughly like the amount of
         * radius for the rounded edges.
         * @default 4
         */
        bevelThickness = (__runInitializers(this, _bevelSegments_extraInitializers), __runInitializers(this, _bevelThickness_initializers, 4
        /**
         * @property {boolean} centerGeometry - When true, centers the shape geometry
         * within the host element's size space.
         * @default true
         */
        ));
        /**
         * @property {boolean} centerGeometry - When true, centers the shape geometry
         * within the host element's size space.
         * @default true
         */
        centerGeometry = (__runInitializers(this, _bevelThickness_extraInitializers), __runInitializers(this, _centerGeometry_initializers, true
        /**
         * @property {string} fitment - Determines how to fit a shape within the
         * size area on X and Y. The Z size dictates the shape extrusion separately.
         * This takes the same values as the object-fit CSS property, except global
         * values. See https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values
         * for details.
         */
        ));
        /**
         * @property {string} fitment - Determines how to fit a shape within the
         * size area on X and Y. The Z size dictates the shape extrusion separately.
         * This takes the same values as the object-fit CSS property, except global
         * values. See https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values
         * for details.
         */
        fitment = (__runInitializers(this, _centerGeometry_extraInitializers), __runInitializers(this, _fitment_initializers, 'none'
        // TODO attribute to apply smoothing to the geometry (calculate normals)?
        ));
        // TODO attribute to apply smoothing to the geometry (calculate normals)?
        _createComponent() {
            let geometry;
            if (this.element.calculatedSize.z === 0) {
                geometry = new ShapeGeometry(this.shape, this.curveSegments);
            }
            else {
                geometry = new ExtrudeGeometry(this.shape, {
                    curveSegments: this.curveSegments,
                    bevelSegments: this.bevelSegments,
                    bevelThickness: this.bevelThickness,
                    bevelEnabled: this.bevel,
                    depth: this.element.calculatedSize.z,
                });
            }
            if (this.centerGeometry)
                geometry.center();
            // Make a Shape's Y coordinates go downward to match with LUME's coordinate system.
            // Negative scale throws a lot of things off, causing lighting not to work due to normals going the wrong direction.
            geometry.scale(1, -1, 1);
            // So we have to do the following to reverse the effects:
            handleInvertedGeometry(geometry);
            if (this.fitment === 'none')
                return geometry;
            let minX = Number.MAX_VALUE;
            let maxX = -Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxY = -Number.MAX_VALUE;
            const verts = geometry.attributes.position.array;
            const stride = 3;
            for (let i = 0, l = verts.length / stride; i < l; i++) {
                const x = verts[i * stride + 0];
                const y = verts[i * stride + 1];
                if (x < minX)
                    minX = x;
                if (x > maxX)
                    maxX = x;
                if (y < minY)
                    minY = y;
                if (y > maxY)
                    maxY = y;
            }
            const shapeSizeX = maxX - minX;
            const shapeSizeY = maxY - minY;
            const scaleX = shapeSizeX / this.element.calculatedSize.x;
            const scaleY = shapeSizeY / this.element.calculatedSize.y;
            if (this.fitment === 'fill')
                return geometry.scale(1 / scaleX, 1 / scaleY, 1);
            const shapeAspect = shapeSizeX / shapeSizeY;
            const sizeAspect = this.element.calculatedSize.x / this.element.calculatedSize.y;
            if (this.fitment === 'contain') {
                // tall
                if (shapeAspect < sizeAspect)
                    geometry.scale(1 / scaleY, 1 / scaleY, 1);
                // wide (or equal)
                else
                    geometry.scale(1 / scaleX, 1 / scaleX, 1);
            }
            else if (this.fitment === 'cover') {
                // tall
                if (shapeAspect < sizeAspect)
                    geometry.scale(1 / scaleX, 1 / scaleX, 1);
                // wide (or equal)
                else
                    geometry.scale(1 / scaleY, 1 / scaleY, 1);
            }
            else if (this.fitment === 'scale-down') {
                if (!(shapeSizeX <= this.element.calculatedSize.x && shapeSizeY <= this.element.calculatedSize.y)) {
                    // tall
                    if (shapeAspect < sizeAspect)
                        geometry.scale(1 / scaleY, 1 / scaleY, 1);
                    // wide (or equal)
                    else
                        geometry.scale(1 / scaleX, 1 / scaleX, 1);
                }
            }
            return geometry;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _fitment_extraInitializers);
        }
    };
    return ShapeGeometryBehavior = _classThis;
})();
export { ShapeGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('shape-geometry'))
    elementBehaviors.define('shape-geometry', ShapeGeometryBehavior);
//# sourceMappingURL=ShapeGeometryBehavior.js.map