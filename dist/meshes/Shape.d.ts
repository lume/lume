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
 * - [`shape-geometry`](../behaviors/mesh-behaviors/geometries/ShapeGeometryBehavior.md)
 * - [`phong-material`](../behaviors/mesh-behaviors/materials/PhongMaterialBehavior.md)
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = shapesExample
 * </script>
 *
 * Inherits attribute properties from [`ShapeGeometryBehavior`](../behaviors/geometries/ShapeGeometryBehavior.md).
 *
 * @extends Mesh
 */
export declare class Shape extends Mesh {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
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