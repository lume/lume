import { type ElementAttributes } from '@lume/element';
import { Line as ThreeLine } from 'three/src/objects/Line.js';
import { Element3D } from '../core/Element3D.js';
import type { Element3DAttributes } from '../core/Element3D.js';
import type { ElementWithBehaviors } from '../behaviors/ElementWithBehaviors.js';
import type { ClipPlanesBehavior, ClipPlanesBehaviorAttributes, LineBasicMaterialBehavior, LineBasicMaterialBehaviorAttributes, LineGeometryBehavior, LineGeometryBehaviorAttributes } from '../behaviors/index.js';
export type LineAttributes = Element3DAttributes | BehaviorAttributes;
/**
 * @class Line - Renders a line based on a sequence of points.
 *
 * Element: `<lume-line>`
 *
 * Default behaviors:
 *
 * - [`line-geometry`](../behaviors/mesh-behaviors/geometries/LineGeometryBehavior.md)
 * - [`line-material`](../behaviors/mesh-behaviors/materials/LineBasicMaterialBehavior.md)
 *
 * It can be useful to have
 * [`ply-geometry`](../behaviors/mesh-behaviors/geometries/PlyGeometryBehavior)
 * behavior on this element to load a set of points from a file.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends Element3D
 */
export declare class Line extends Element3D {
    initialBehaviors: {
        geometry: string;
        material: string;
    };
    makeThreeObject3d(): ThreeLine<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
}
export interface Line extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
type BehaviorInstanceTypes = LineBasicMaterialBehavior & LineGeometryBehavior & ClipPlanesBehavior;
type BehaviorAttributes = LineBasicMaterialBehaviorAttributes | LineGeometryBehaviorAttributes | ClipPlanesBehaviorAttributes;
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-line': ElementAttributes<Line, LineAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-line': Line;
    }
}
export {};
//# sourceMappingURL=Line.d.ts.map