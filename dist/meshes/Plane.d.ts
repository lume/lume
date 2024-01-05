import { type ElementAttributes } from '@lume/element';
import { Mesh, type MeshAttributes } from './Mesh.js';
export type PlaneAttributes = MeshAttributes;
/**
 * @class Plane -
 *
 * Element: `<lume-plane>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`plane-geometry`](../behaviors/mesh-behaviors/geometries/PlaneGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The dimensions of the plane are determined by the
 * [`size`](../core/Sizeable#size) of the element on `x` and `y`.
 *
 * @extends Mesh
 */
export declare class Plane extends Mesh {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
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