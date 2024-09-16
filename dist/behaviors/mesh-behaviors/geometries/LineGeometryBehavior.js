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
import { attribute, booleanAttribute, stringAttribute } from '@lume/element';
import 'element-behaviors';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { GeometryBehavior } from './GeometryBehavior.js';
import { stringToNumberArray } from '../../../meshes/utils.js';
// import {handleInvertedGeometry} from './utils/handleInvertedGeometry.js'
import { behavior } from '../../Behavior.js';
import { receiver } from '../../PropReceiver.js';
/**
 * @class LineGeometryBehavior -
 *
 * Behavior: `line-geometry`
 *
 * Provides a line geometry (series of points) for mesh elements. The
 * [`<lume-line>`](../../../meshes/Line.md) element has this behavior on it by
 * default. This is typically paired with
 * [`LineBasicMaterialBehavior`](../materials/LineBasicMaterialBehavior.md).
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends GeometryBehavior
 */
let LineGeometryBehavior = (() => {
    let _classDecorators = [behavior];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = GeometryBehavior;
    let _instanceExtraInitializers = [];
    let _get_points_decorators;
    let _centerGeometry_decorators;
    let _centerGeometry_initializers = [];
    let _centerGeometry_extraInitializers = [];
    let _fitment_decorators;
    let _fitment_initializers = [];
    let _fitment_extraInitializers = [];
    var LineGeometryBehavior = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_points_decorators = [attribute, receiver];
            _centerGeometry_decorators = [booleanAttribute, receiver];
            _fitment_decorators = [stringAttribute, receiver];
            __esDecorate(this, null, _get_points_decorators, { kind: "getter", name: "points", static: false, private: false, access: { has: obj => "points" in obj, get: obj => obj.points }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _centerGeometry_decorators, { kind: "field", name: "centerGeometry", static: false, private: false, access: { has: obj => "centerGeometry" in obj, get: obj => obj.centerGeometry, set: (obj, value) => { obj.centerGeometry = value; } }, metadata: _metadata }, _centerGeometry_initializers, _centerGeometry_extraInitializers);
            __esDecorate(null, null, _fitment_decorators, { kind: "field", name: "fitment", static: false, private: false, access: { has: obj => "fitment" in obj, get: obj => obj.fitment, set: (obj, value) => { obj.fitment = value; } }, metadata: _metadata }, _fitment_initializers, _fitment_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LineGeometryBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #points = (__runInitializers(this, _instanceExtraInitializers), []);
        // TODO see about using shapes, not just points, similar to lume-shape, using Shape.getPoints().
        /**
         * @property {string | number[] | null} points - a set of points for the line. Every three numbers is a point (X, Y, Z).
         *
         * The getter (i.e. reading the property) always returns an underlying Array
         * of numbers.
         *
         * Setting the property accepts `string`, `number[]`, or `null` values. All
         * values are mapped to a single `Array<number>` property (the one returned
         * by the getter).
         *
         * While setting the property triggers reactivity, modifying the
         * `Array` returned by the getter does not. In such a case, we can
         * execute `el.position = el.position` to trigger reactivity.
         * <!-- TODO investigate using Solid createMutable to make the Array reactive. -->
         *
         * A string value should be a list of numbers separated by any amount of space
         * (commas are optional, for organizational use), every three numbers forming
         * one point in the line. Similar to the rest of Lume's coordinate
         * system, +X goes rightward, and +Y goes downward.
         *
         * An number array value is similar to the string value: every three numbers
         * form a point in the line.
         * <!-- TODO investigate reacting to reactive arrays -->
         *
         * If the string or number array have no points, no line is rendered.
         *
         * An `Array` value will have its data copied to the underlying
         * `Array` returned by the getter, and does not replace the underlying
         * `Array`.
         * <!-- TODO perhaps the getter should always return the value the user set, and not expose the internal `Array` -->
         *
         * A value of `null` (or when the attribute is removed) causes no line to be
         * rendered.
         */
        get points() {
            return this.#points;
        }
        set points(points) {
            if (!points) {
                this.#points.length = 0;
            }
            else if (typeof points === 'string' || Array.isArray(points)) {
                const _points = typeof points === 'string' ? stringToNumberArray(points, 'points') : points;
                if (!_points.length) {
                    this.#points.length = 0;
                }
                else {
                    if (_points.length % 3 !== 0)
                        throw new Error('The points array needs to have 3 numbers per point.');
                    if (this.#points.length !== _points.length)
                        this.#points.length = _points.length;
                    for (let i = 0, l = _points.length; i < l; i += 1)
                        this.#points[i] = _points[i];
                }
            }
        }
        /**
         * @property {boolean} centerGeometry - When true, centers the line geometry
         * around the local origin of the element.
         * @default false
         */
        centerGeometry = __runInitializers(this, _centerGeometry_initializers, false
        /* TODO
         * @property {string} fitment - Determines how to fit the line within the
         * size area.  This takes the same values as the object-fit CSS property,
         * except global values. See
         * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values for
         * details.
         */
        );
        /* TODO
         * @property {string} fitment - Determines how to fit the line within the
         * size area.  This takes the same values as the object-fit CSS property,
         * except global values. See
         * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values for
         * details.
         */
        fitment = (__runInitializers(this, _centerGeometry_extraInitializers), __runInitializers(this, _fitment_initializers, 'none'));
        _createComponent() {
            const geometry = new BufferGeometry();
            const positions = new Float32BufferAttribute(this.points, 3);
            positions.needsUpdate = true;
            geometry.attributes['position'] = positions;
            if (this.centerGeometry)
                geometry.center();
            // Make the line's Y coordinates go downward to match with LUME's coordinate system.
            // Negative scale throws a lot of things off, causing lighting not to work due to normals going the wrong direction.
            geometry.scale(1, -1, 1);
            // So we have to do the following to reverse the effects geometries with triangle faces:
            // handleInvertedGeometry(geometry) // But we don't have to do this with lines because they have no faces.
            if (this.fitment === 'none')
                return geometry;
            // TODO de-dupe the following with ShapeGeometryBehavior, perhaps apply generically to all geometries.
            // TODO Needs to account for Z for any geometry, not just X/Y as with 2D shapes.
            // let minX = Number.MAX_VALUE
            // let maxX = -Number.MAX_VALUE
            // let minY = Number.MAX_VALUE
            // let maxY = -Number.MAX_VALUE
            // const verts = geometry.attributes.position.array
            // const stride = 3
            // for (let i = 0, l = verts.length / stride; i < l; i++) {
            // 	const x = verts[i * stride + 0]
            // 	const y = verts[i * stride + 1]
            // 	if (x < minX) minX = x
            // 	if (x > maxX) maxX = x
            // 	if (y < minY) minY = y
            // 	if (y > maxY) maxY = y
            // }
            // const shapeSizeX = maxX - minX
            // const shapeSizeY = maxY - minY
            // const scaleX = shapeSizeX / this.element.calculatedSize.x
            // const scaleY = shapeSizeY / this.element.calculatedSize.y
            // if (this.fitment === 'fill') return geometry.scale(1 / scaleX, 1 / scaleY, 1)
            // const shapeAspect = shapeSizeX / shapeSizeY
            // const sizeAspect = this.element.calculatedSize.x / this.element.calculatedSize.y
            // if (this.fitment === 'contain') {
            // 	// tall
            // 	if (shapeAspect < sizeAspect) geometry.scale(1 / scaleY, 1 / scaleY, 1)
            // 	// wide (or equal)
            // 	else geometry.scale(1 / scaleX, 1 / scaleX, 1)
            // } else if (this.fitment === 'cover') {
            // 	// tall
            // 	if (shapeAspect < sizeAspect) geometry.scale(1 / scaleX, 1 / scaleX, 1)
            // 	// wide (or equal)
            // 	else geometry.scale(1 / scaleY, 1 / scaleY, 1)
            // } else if (this.fitment === 'scale-down') {
            // 	if (!(shapeSizeX <= this.element.calculatedSize.x && shapeSizeY <= this.element.calculatedSize.y)) {
            // 		// tall
            // 		if (shapeAspect < sizeAspect) geometry.scale(1 / scaleY, 1 / scaleY, 1)
            // 		// wide (or equal)
            // 		else geometry.scale(1 / scaleX, 1 / scaleX, 1)
            // 	}
            // }
            return geometry;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _fitment_extraInitializers);
        }
    };
    return LineGeometryBehavior = _classThis;
})();
export { LineGeometryBehavior };
if (globalThis.window?.document && !elementBehaviors.has('line-geometry'))
    elementBehaviors.define('line-geometry', LineGeometryBehavior);
//# sourceMappingURL=LineGeometryBehavior.js.map