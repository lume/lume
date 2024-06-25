import 'element-behaviors';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js';
import { GeometryBehavior } from './GeometryBehavior.js';
export type SphereGeometryBehaviorAttributes = 'horizontalSegments' | 'verticalSegments';
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
export declare class SphereGeometryBehavior extends GeometryBehavior {
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
    horizontalSegments: number;
    /**
     * @property {number} verticalSegments -
     *
     * `attribute`
     *
     * Default: `32`
     *
     * The number of divisions across the height of the sphere. A sphere with 10
     * horizontal segments and 10 vertical segments is made up of 100 flat faces.
     */
    verticalSegments: number;
    _createComponent(): SphereGeometry;
}
//# sourceMappingURL=SphereGeometryBehavior.d.ts.map