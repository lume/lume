import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type BoxAttributes = MeshAttributes;
/**
 * @class Box -
 *
 * Element: `<lume-box>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`box-geometry`](../behaviors/mesh-behaviors/geometries/SphereGeometryBehavior)
 * and
 * [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior).
 *
 * The dimensions of the box are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export declare class Box extends Mesh {
    static defaultBehaviors: {
        'box-geometry': (initialBehaviors: any) => boolean;
        'phong-material': (initialBehaviors: any) => boolean;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-box': Box;
    }
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-box': JSX.IntrinsicElements['lume-mesh'];
        }
    }
}
//# sourceMappingURL=Box.d.ts.map