import { type ElementAttributes } from '@lume/element';
import { Mesh, type MeshAttributes } from './Mesh.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes } from '../behaviors/index.js';
export type RoundedRectangleAttributes = MeshAttributes | RoundedRectangleGeometryBehaviorAttributes;
/**
 * @class RoundedRectangle -
 *
 * Element: `<lume-rounded-rectangle>`
 *
 * Applies default behaviors of
 * [`<lume-roundedrect-geometry>`](../behavior-elements/mesh-behaviors/geometries/RoundedrectGeometry)
 * and
 * [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial).
 *
 * The dimensions of the rounded rectangle are determined by the
 * [`size`](../core/Sizeable#size) of the element.
 *
 * @extends Mesh
 */
export declare class RoundedRectangle extends Mesh {
    protected _defaultGeometry: () => Node | Node[];
}
export interface RoundedRectangle extends ElementWithBehaviors<RoundedRectangleGeometryBehavior, RoundedRectangleGeometryBehaviorAttributes> {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-rounded-rectangle': ElementAttributes<RoundedRectangle, RoundedRectangleAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-rounded-rectangle': RoundedRectangle;
    }
}
//# sourceMappingURL=RoundedRectangle.d.ts.map