import { Mesh, type MeshAttributes } from './Mesh.js';
export type SphereAttributes = MeshAttributes;
/**
 * @class Sphere -
 *
 * Element: `<lume-sphere>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`sphere-geometry`](../behaviors/mesh-behaviors/geometries/SphereGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The diameter of the sphere is determined by the `x` size of the element.
 *
 * @extends Mesh
 */
export declare class Sphere extends Mesh {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-sphere': Sphere;
    }
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-sphere': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Sphere.d.ts.map