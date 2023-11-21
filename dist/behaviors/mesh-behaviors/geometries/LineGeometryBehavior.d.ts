import 'element-behaviors';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export type LineGeometryBehaviorAttributes = 'points' | 'centerGeometry' | 'fitment';
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
 * <div id="exampleContainer"></div>
 * <script>
 *   new Vue({
 *     el: '#exampleContainer',
 *     template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
 *     data: { code: lineExample },
 *   })
 * </script>
 *
 * @extends GeometryBehavior
 */
export declare class LineGeometryBehavior extends GeometryBehavior {
    __points: number[];
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
    get points(): number[];
    set points(points: string | number[] | null);
    /**
     * @property {boolean} centerGeometry - When true, centers the line geometry
     * around the local origin of the element.
     * @default false
     */
    centerGeometry: boolean;
    fitment: 'none' | 'contain' | 'cover' | 'fill' | 'scale-down';
    _createComponent(): BufferGeometry<import("three/src/core/BufferGeometry.js").NormalBufferAttributes>;
}
//# sourceMappingURL=LineGeometryBehavior.d.ts.map