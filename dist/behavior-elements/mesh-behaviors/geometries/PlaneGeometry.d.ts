import { PlaneGeometry as ThreePlaneGeometry } from 'three/src/geometries/PlaneGeometry.js';
import { type ElementAttributes } from '@lume/element';
import { GeometryBehaviorEl } from './GeometryBehaviorEl.js';
export type PlaneGeometryAttributes = 'widthSegments' | 'heightSegments';
/**
 * @class PlaneGeometryBehavior -
 *
 * Element: `<lume-plane-geometry>`
 *
 * Makes a flat rectangle-shaped geometry on a [`<lume-mesh>`](../../../meshes/Mesh)
 * element. This is the default geometry behavior on
 * [`<lume-plane>`](../../../meshes/Plane) elements.
 *
 * The size of the sphere is determined by the `x` and `y`
 * [`size`](../../../core/Sizeable#size) of the element.
 *
 * @extends GeometryBehaviorEl
 * @element lume-plane-geometry TODO @element jsdoc tag
 */
export declare class PlaneGeometry extends GeometryBehaviorEl {
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
    widthSegments: number;
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
    heightSegments: number;
    _createComponent(): ThreePlaneGeometry;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-plane-geometry': ElementAttributes<PlaneGeometry, PlaneGeometryAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-plane-geometry': PlaneGeometry;
    }
}
//# sourceMappingURL=PlaneGeometry.d.ts.map