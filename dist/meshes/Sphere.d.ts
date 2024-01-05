import { type ElementAttributes } from '@lume/element';
import { Mesh, type MeshAttributes } from './Mesh.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { SphereGeometryBehavior, SphereGeometryBehaviorAttributes } from '../behaviors/index.js';
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
export interface Sphere extends ElementWithBehaviors<SphereGeometryBehavior, SphereGeometryBehaviorAttributes> {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-sphere': ElementAttributes<Sphere, SphereAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-sphere': Sphere;
    }
}
//# sourceMappingURL=Sphere.d.ts.map