import { type ElementAttributes } from '@lume/element';
import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type BoxAttributes = MeshAttributes;
/**
 * @class Box -
 *
 * Element: `<lume-box>`
 *
 * A `Mesh` subclass with a default
 * [`<lume-box-geometry>`](../behavior-elements/mesh-behaviors/geometries/BoxGeometry)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * The dimensions of the box are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export declare class Box extends Mesh {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-box': ElementAttributes<Box, BoxAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-box': Box;
    }
}
//# sourceMappingURL=Box.d.ts.map