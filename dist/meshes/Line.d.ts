import { Line as ThreeLine } from 'three/src/objects/Line.js';
import { Element3D } from '../core/Element3D.js';
import type { Element3DAttributes } from '../core/Element3D.js';
export type LineAttributes = Element3DAttributes;
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
 * <div id="exampleContainer"></div>
 * <script>
 *   new Vue({
 *     el: '#exampleContainer',
 *     template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
 *     data: { code: lineExample },
 *   })
 * </script>
 *
 * @extends Element3D
 */
export declare class Line extends Element3D {
    static defaultBehaviors: {
        [k: string]: any;
    };
    makeThreeObject3d(): ThreeLine<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[]>;
}
import type { ElementAttributes } from '@lume/element';
import type { ElementWithBehaviors, LineBasicMaterialBehavior, LineBasicMaterialBehaviorAttributes, LineGeometryBehavior, LineGeometryBehaviorAttributes } from '../index.js';
type BehaviorInstanceTypes = LineBasicMaterialBehavior & LineGeometryBehavior;
type BehaviorAttributes = LineBasicMaterialBehaviorAttributes | LineGeometryBehaviorAttributes;
export interface Line extends ElementWithBehaviors<BehaviorInstanceTypes, BehaviorAttributes> {
}
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-line': ElementAttributes<Line & BehaviorInstanceTypes, LineAttributes | BehaviorAttributes>;
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