import { type ElementAttributes } from '@lume/element';
import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
import type { ElementWithBehaviors, TorusGeometryBehavior, TorusGeometryBehaviorAttributes } from '../behaviors/index.js';
export type TorusAttributes = MeshAttributes | TorusGeometryBehaviorAttributes;
/**
 * @class Torus
 *
 * Element: `<lume-torus>`
 *
 * Extends from `Mesh` to apply default behaviors of
 * [`<lume-torus-geometry>`](../behavior-elements/mesh-behaviors/geometries/TorusGeometry)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * @extends Mesh
 */
export declare class Torus extends Mesh {
    protected _defaultGeometry: () => Node | Node[];
}
export interface Torus extends ElementWithBehaviors<TorusGeometryBehavior, TorusGeometryBehaviorAttributes> {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-torus': ElementAttributes<Torus, TorusAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-torus': Torus;
    }
}
//# sourceMappingURL=Torus.d.ts.map