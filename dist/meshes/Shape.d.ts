import { Mesh } from './Mesh.js';
import type { MeshAttributes } from './Mesh.js';
export type ShapeAttributes = MeshAttributes;
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
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes } from '../index.js';
export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-shape': Shape;
    }
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-shape': JSX.IntrinsicElements['lume-mesh'] & ElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>;
        }
    }
}
//# sourceMappingURL=Shape.d.ts.map