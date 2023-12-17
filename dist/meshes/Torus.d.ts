import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type TorusAttributes = MeshAttributes;
/**
 * @class Torus -
 *
 * Element: `<lume-torus>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`torus-geometry`](../behaviors/mesh-behaviors/geometries/TorusGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * @extends Mesh
 */
export declare class Torus extends Mesh {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-torus': Torus;
    }
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-torus': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Torus.d.ts.map