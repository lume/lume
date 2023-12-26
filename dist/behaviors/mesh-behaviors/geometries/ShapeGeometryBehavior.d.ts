import 'element-behaviors';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ShapeGeometry } from 'three/src/geometries/ShapeGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export type ShapeGeometryBehaviorAttributes = 'shape' | 'curveSegments' | 'bevel' | 'bevelSegments' | 'bevelThickness' | 'centerGeometry' | 'fitment';
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
export declare class ShapeGeometryBehavior extends GeometryBehavior {
    #private;
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
    get shape(): Shape;
    set shape(shape: string | number[] | Shape | null);
    /**
     * @property {number} curveSegments - The number of lines per curve withing
     * the shape. The higher the number, the smoother the shape at the cost of
     * render time.
     * @default 8
     */
    curveSegments: number;
    /**
     * @property {boolean} bevel - When the shape is extruded, enables rounding
     * of the shape edges.
     * @default false
     */
    bevel: boolean;
    /**
     * @property {number} bevelSegments - When the shape is extruded, determines
     * the number of sections for the bevel. A higher number makes the model
     * look smoother, but cost more time to render.
     * @default 4
     */
    bevelSegments: number;
    /**
     * @property {number} bevelThickness - When the shape is extruded,
     * determines the thickness of the bevel. Roughly like the amount of
     * radius for the rounded edges.
     * @default 4
     */
    bevelThickness: number;
    /**
     * @property {boolean} centerGeometry - When true, centers the shape geometry
     * within the host element's size space.
     * @default true
     */
    centerGeometry: boolean;
    /**
     * @property {string} fitment - Determines how to fit a shape within the
     * size area on X and Y. The Z size dictates the shape extrusion separately.
     * This takes the same values as the object-fit CSS property, except global
     * values. See https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit#values
     * for details.
     */
    fitment: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down';
    _createComponent(): ExtrudeGeometry | ShapeGeometry;
}
//# sourceMappingURL=ShapeGeometryBehavior.d.ts.map