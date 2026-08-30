import { type ElementAttributes } from '@lume/element';
import { Line as ThreeLine } from 'three/src/objects/Line.js';
import { MeshLike } from './MeshLike.js';
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
 * - [`<lume-line-geometry>`](../behavior-elements/mesh-behaviors/geometries/LineGeometry.md)
 * - [`<lume-basicline-material>`](../behavior-elements/mesh-behaviors/materials/BasiclineMaterial.md)
 *
 * It can be useful to have
 * [`<lume-ply-geometry>`](../behavior-elements/mesh-behaviors/geometries/PlyGeometry.md)
 * behavior on this element to load a set of points from a file.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = lineExample
 * </script>
 *
 * @extends MeshLike
 */
export declare class Line extends MeshLike {
    protected _defaultGeometry: () => Node | Node[];
    protected _defaultMaterial: () => Node | Node[];
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