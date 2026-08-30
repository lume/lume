import { type ElementAttributes } from '@lume/element';
import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes } from '../behaviors/index.js';
export type ShapeAttributes = MeshAttributes | ShapeGeometryBehaviorAttributes;
/**
 * @class Shape - Allows creating a 2D shape that can be extruded.
 *
 * Element: `<lume-shape>`
 *
 * Default behaviors:
 *
 * - [`<lume-shape-geometry>`](../behavior-elements/mesh-behaviors/geometries/ShapeGeometry.md)
 * - [`<lume-physical-material>`](../behavior-elements/mesh-behaviors/materials/PhysicalMaterial.md)
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = shapesExample
 * </script>
 *
 * @extends Mesh
 */
export declare class Shape extends Mesh {
    protected _defaultGeometry: () => Node | Node[];
}
export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-shape': ElementAttributes<Shape, ShapeAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-shape': Shape;
    }
}
//# sourceMappingURL=Shape.d.ts.map