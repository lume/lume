import { type ElementAttributes } from '@lume/element';
import { Mesh, type MeshAttributes } from './Mesh.js';
export type PlaneAttributes = MeshAttributes;
/**
 * @class Plane -
 *
 * Element: `<lume-plane>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`<lume-plane-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlaneGeometry.md)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.md).
 *
 * The dimensions of the plane are determined by the
 * [`size`](../core/Sizeable#size) of the element on `x` and `y`.
 *
 * @extends Mesh
 */
export declare class Plane extends Mesh {
    protected _defaultGeometry: () => Node | Node[];
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-plane': ElementAttributes<Plane, PlaneAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-plane': Plane;
    }
}
//# sourceMappingURL=Plane.d.ts.map