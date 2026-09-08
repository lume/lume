import { SphereGeometry as ThreeSphereGeometry } from 'three/src/geometries/SphereGeometry.js';
import { type ElementAttributes } from '@lume/element';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
export type SphereGeometryAttributes = 'horizontalSegments' | 'verticalSegments';
/**
 * @class SphereGeometryBehavior -
 *
 * Element: `<lume-sphere-geometry>`
 *
 * Makes a sphere-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-sphere>`](../../../meshes/Sphere) elements.
 *
 * The diameter of the sphere is determined by the `x`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehaviorEl
 * @element lume-sphere-geometry
 */
export declare class SphereGeometry extends GeometryBehaviorEl {
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
    _createComponent(): ThreeSphereGeometry;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-sphere-geometry': ElementAttributes<SphereGeometry, SphereGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-sphere-geometry': SphereGeometry;
    }
}
//# sourceMappingURL=SphereGeometry.d.ts.map